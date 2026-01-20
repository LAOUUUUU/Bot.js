// commands.js
// Centralized dispatcher for slash command handling to reduce complexity in bot.js

const { EmbedBuilder } = require('discord.js');

function shouldDefer(cmd) {
  // Network-heavy operations that should defer replies
  return new Set([
    'nsfw', 'rule34', 'gelbooru', 'e621', 'realbooru', 'hypnohub', 'yandere', 'konachan', 'danbooru',
    'trending', 'random'
  ]).has(cmd);
}

function requiresNSFW(cmd) {
  return new Set([
    'nsfw', 'rule34', 'gelbooru', 'e621', 'realbooru', 'hypnohub', 'yandere', 'konachan', 'danbooru',
    'trending', 'random'
  ]).has(cmd);
}

function createDispatcher(deps) {
  const {
    log, errLog,
    ownerIds,
    isChannelNSFW,
    validateInterval,
    isTagBlacklisted,
    getUserPrefs,
    saveUserPreferences,
    postRandomToChannel,
    startAuto,
    stopAuto,
    stats,
    activeAutos,
    userPreferences,
    recentGifs,
    addAdminBlacklist,
    removeAdminBlacklist,
    listAdminBlacklist,
  } = deps;

  const apiForCmd = {
    'nsfw': 'redgifs',
    'rule34': 'rule34',
    'gelbooru': 'gelbooru',
    'e621': 'e621',
    'realbooru': 'realbooru',
    'hypnohub': 'hypnohub',
    'yandere': 'yandere',
    'konachan': 'konachan',
    'danbooru': 'danbooru',
  };

  return async function handleInteraction(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const startedAt = Date.now();
    const userId = interaction.user.id;
    const cmd = interaction.commandName;

    // Guild-only enforcement
    if (!interaction.guildId) {
      try {
        return await interaction.reply({ content: '⚠️ This bot only works in servers (no DMs).', ephemeral: true });
      } catch (err) {
        errLog('[interaction] failed to reply to non-guild', err);
        return;
      }
    }

    // Owner-only enforcement
    if (!ownerIds.has(userId)) {
      try {
        return await interaction.reply({ content: '⛔ Only the bot owner may use this bot.', ephemeral: true });
      } catch (err) {
        errLog('[interaction] failed to reply to non-owner', err);
        return;
      }
    }

    // NSFW-only enforcement for content commands
    if (requiresNSFW(cmd)) {
      const ch = interaction.channel;
      const effective = (ch && typeof ch.isThread === 'function' && ch.isThread()) ? ch.parent : ch;
      if (!isChannelNSFW(effective)) {
        try {
          return await interaction.reply({ content: '⚠️ This command may only be used in an NSFW channel.', ephemeral: true });
        } catch (err) {
          errLog('[interaction] failed to reply NSFW restriction', err);
          return;
        }
      }
    }

    let deferred = false;
    if (shouldDefer(cmd)) {
      try {
        await interaction.deferReply();
        deferred = true;
      } catch (err) {
        errLog('[interaction] defer failed', err);
      }
    }

    try {
      // ping
      if (cmd === 'ping') {
        const resText = '🏓 pong';
        if (deferred) await interaction.editReply(resText);
        else await interaction.reply({ content: resText, ephemeral: true });
        log('[cmd] ping by', userId, 'took', Date.now() - startedAt, 'ms');
        return;
      }

      // favorite (subcommands)
      if (cmd === 'favorite') {
        const subcmd = interaction.options.getSubcommand();
        const prefs = getUserPrefs(userId);

        if (subcmd === 'add') {
          const tag = interaction.options.getString('tag').toLowerCase();
          if (prefs.favoriteTags.includes(tag)) {
            return interaction.reply({ content: `❌ "${tag}" is already in your favorites.`, ephemeral: true });
          }
          prefs.favoriteTags.push(tag);
          await saveUserPreferences();
          return interaction.reply({ content: `✅ Added "${tag}" to your favorites.`, ephemeral: true });
        }

        if (subcmd === 'remove') {
          const tag = interaction.options.getString('tag').toLowerCase();
          const index = prefs.favoriteTags.indexOf(tag);
          if (index === -1) {
            return interaction.reply({ content: `❌ "${tag}" is not in your favorites.`, ephemeral: true });
          }
          prefs.favoriteTags.splice(index, 1);
          await saveUserPreferences();
          return interaction.reply({ content: `✅ Removed "${tag}" from your favorites.`, ephemeral: true });
        }

        if (subcmd === 'list') {
          if (prefs.favoriteTags.length === 0) {
            return interaction.reply({ content: 'You have no favorite tags. Use `/favorite add` to add some!', ephemeral: true });
          }
          const list = prefs.favoriteTags.map((t, i) => `${i + 1}. ${t}`).join('\n');
          const embed = new EmbedBuilder()
              .setColor(0xFF69B4)
              .setTitle('⭐ Your Favorite Tags')
              .setDescription(list);
          return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (subcmd === 'clear') {
          prefs.favoriteTags = [];
          await saveUserPreferences();
          return interaction.reply({ content: '✅ Cleared all your favorite tags.', ephemeral: true });
        }
      }

      // blacklist (subcommands)
      if (cmd === 'blacklist') {
        const subcmd = interaction.options.getSubcommand();
        const prefs = getUserPrefs(userId);

        if (subcmd === 'add') {
          const tag = interaction.options.getString('tag').toLowerCase();
          if (prefs.blacklistedTags.includes(tag)) {
            return interaction.reply({ content: `❌ "${tag}" is already in your blacklist.`, ephemeral: true });
          }
          prefs.blacklistedTags.push(tag);
          await saveUserPreferences();
          return interaction.reply({ content: `✅ Added "${tag}" to your blacklist.`, ephemeral: true });
        }

        if (subcmd === 'remove') {
          const tag = interaction.options.getString('tag').toLowerCase();
          const index = prefs.blacklistedTags.indexOf(tag);
          if (index === -1) {
            return interaction.reply({ content: `❌ "${tag}" is not in your blacklist.`, ephemeral: true });
          }
          prefs.blacklistedTags.splice(index, 1);
          await saveUserPreferences();
          return interaction.reply({ content: `✅ Removed "${tag}" from your blacklist.`, ephemeral: true });
        }

        if (subcmd === 'list') {
          if (prefs.blacklistedTags.length === 0) {
            return interaction.reply({ content: 'You have no blacklisted tags.', ephemeral: true });
          }
          const list = prefs.blacklistedTags.map((t, i) => `${i + 1}. ${t}`).join('\n');
          const embed = new EmbedBuilder()
              .setColor(0xFF0000)
              .setTitle('🚫 Your Blacklisted Tags')
              .setDescription(list);
          return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (subcmd === 'clear') {
          prefs.blacklistedTags = [];
          await saveUserPreferences();
          return interaction.reply({ content: '✅ Cleared your blacklist.', ephemeral: true });
        }
      }

      // admin (subcommands)
      if (cmd === 'admin') {
        if (!ownerIds.has(userId)) {
          return interaction.reply({ content: '⛔ Only bot owners can use admin commands.', ephemeral: true });
        }

        const subcmd = interaction.options.getSubcommand();

        if (subcmd === 'blacklist-add') {
          const tag = interaction.options.getString('tag').toLowerCase();
          if (typeof addAdminBlacklist === 'function') addAdminBlacklist(tag);
          return interaction.reply({ content: `✅ Added "${tag}" to global blacklist.`, ephemeral: true });
        }

        if (subcmd === 'blacklist-remove') {
          const tag = interaction.options.getString('tag').toLowerCase();
          if (typeof removeAdminBlacklist === 'function') {
            const removed = removeAdminBlacklist(tag);
            if (!removed) {
              return interaction.reply({ content: `❌ "${tag}" is not in the global blacklist.`, ephemeral: true });
            }
          }
          return interaction.reply({ content: `✅ Removed "${tag}" from global blacklist.`, ephemeral: true });
        }

        if (subcmd === 'blacklist-list') {
          if (typeof listAdminBlacklist === 'function') {
            const listArr = listAdminBlacklist();
            if (!listArr || listArr.length === 0) {
              return interaction.reply({ content: 'No globally blacklisted tags.', ephemeral: true });
            }
            const list = listArr.map((t, i) => `${i + 1}. ${t}`).join('\n');
            const embed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('🛡️ Global Blacklisted Tags')
                .setDescription(list);
            return interaction.reply({ embeds: [embed], ephemeral: true });
          }
          return interaction.reply({ content: 'No globally blacklisted tags.', ephemeral: true });
        }

        if (subcmd === 'setlimit') {
          const user = interaction.options.getUser('user');
          const interval = interaction.options.getInteger('interval');
          return interaction.reply({ content: `ℹ️ Custom user limits feature not yet implemented. User: ${user.tag}, Interval: ${interval}s`, ephemeral: true });
        }
      }

      // status
      if (cmd === 'status') {
        const uptime = Date.now() - stats.startTime;
        const hours = Math.floor(uptime / 3600000);
        const minutes = Math.floor((uptime % 3600000) / 60000);

        const embed = new EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle('📊 Bot Status')
            .addFields(
                { name: '⏱️ Uptime', value: `${hours}h ${minutes}m`, inline: true },
                { name: '📮 Total Posts', value: stats.totalPosts.toString(), inline: true },
                { name: '❌ Errors', value: stats.errors.toString(), inline: true },
                { name: '🔄 Active Auto-Posts', value: activeAutos.size.toString(), inline: true },
                { name: '💾 Tracked Channels', value: recentGifs.size.toString(), inline: true },
                { name: '👥 Users with Prefs', value: userPreferences.size.toString(), inline: true }
            )
            .setTimestamp();

        if (stats.totalPosts > 0) {
          const apiStats = Object.entries(stats.postsByApi)
              .sort((a, b) => b[1] - a[1])
              .map(([api, count]) => `${api}: ${count}`)
              .join('\n');
          if (apiStats) {
            embed.addFields({ name: '📡 Posts by API', value: apiStats, inline: false });
          }
        }

        if (activeAutos.size > 0) {
          const autoInfo = Array.from(activeAutos.entries())
              .map(([channelId, info]) => {
                const meta = info.meta;
                return `<#${channelId}>: ${meta.intervalSeconds}s (${meta.apiChoice}${meta.filterType !== 'any' ? `, ${meta.filterType}` : ''})`;
              })
              .slice(0, 10)
              .join('\n');
          embed.addFields({ name: '🔄 Active Auto-Posts', value: autoInfo, inline: false });
        }

        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      // auto
      if (cmd === 'auto') {
        const intervalSeconds = interaction.options.getInteger('interval');
        const apiChoice = interaction.options.getString('api') || 'any';
        let tag = interaction.options.getString('tag') || '';
        const filterType = interaction.options.getString('type') || 'any';

        const validation = validateInterval(userId, intervalSeconds);
        if (!validation.valid) {
          const isOwner = ownerIds.has(userId);
          return interaction.reply({ content: `⚠️ Interval must be between ${validation.min} and ${validation.max} seconds.${isOwner ? ' (as owner)' : ' (as regular user)'}`, ephemeral: true });
        }

        if (!isChannelNSFW(interaction.channel)) {
          return interaction.reply({ content: '⚠️ Auto can only be started in NSFW channels.', ephemeral: true });
        }

        if (tag === 'favorite') {
          const prefs = getUserPrefs(userId);
          if (prefs.favoriteTags.length === 0) {
            return interaction.reply({ content: '⚠️ You have no favorite tags to use for auto.', ephemeral: true });
          }
        } else if (tag) {
          const check = isTagBlacklisted(tag, userId);
          if (check.blocked) {
            return interaction.reply({ content: `⚠️ The tag "${tag}" is blacklisted (${check.reason}).`, ephemeral: true });
          }
        }

        const res = await startAuto(interaction.channel, userId, intervalSeconds, apiChoice, tag, filterType);
        if (res.ok) {
          return interaction.reply({ content: `✅ Started auto-posting every ${intervalSeconds} seconds (API: ${apiChoice}, Tag: ${tag || 'random'}, Type: ${filterType}). Use /stop to stop.`, ephemeral: false });
        } else {
          return interaction.reply({ content: `⚠️ Failed to start auto: ${res.reason || 'unknown error'}`, ephemeral: true });
        }
      }

      // stop
      if (cmd === 'stop') {
        const res = stopAuto(interaction.channel.id);
        if (res.ok) {
          return interaction.reply({ content: '✅ Auto-posting stopped.', ephemeral: false });
        } else {
          return interaction.reply({ content: '⚠️ No active auto-posting in this channel.', ephemeral: true });
        }
      }

      // API bound commands
      if (apiForCmd[cmd]) {
        const tagOptionName = (cmd === 'nsfw') ? 'search' : 'tags';
        let tag = interaction.options.getString(tagOptionName) || '';
        const filterType = interaction.options.getString('type') || 'any';

        // Normalize tags for booru APIs (replace commas with spaces)
        if (cmd !== 'nsfw') {
          tag = tag.replace(/,/g, ' ');
        }

        const check = isTagBlacklisted(tag, userId);
        if (check.blocked) {
          return interaction.editReply(`⚠️ Tag "${tag}" is blacklisted (${check.reason}).`);
        }

        const res = await postRandomToChannel(interaction.channel, apiForCmd[cmd], tag, userId, filterType);
        if (res.ok) {
          return interaction.editReply('✅ Posted!');
        } else {
          return interaction.editReply(`⚠️ No results or error: ${res.error}`);
        }
      }

      // random
      if (cmd === 'random') {
        let tag = interaction.options.getString('tag') || '';
        const filterType = interaction.options.getString('type') || 'any';
        let effectiveTag = tag;

        if (tag === 'favorite') {
          const prefs = getUserPrefs(userId);
          if (prefs.favoriteTags.length === 0) {
            return interaction.editReply('⚠️ You have no favorite tags.');
          }
          effectiveTag = prefs.favoriteTags[Math.floor(Math.random() * prefs.favoriteTags.length)];
        }

        const check = isTagBlacklisted(effectiveTag, userId);
        if (check.blocked) {
          return interaction.editReply(`⚠️ Tag "${effectiveTag}" is blacklisted (${check.reason}).`);
        }

        const res = await postRandomToChannel(interaction.channel, 'any', effectiveTag, userId, filterType);
        if (res.ok) {
          return interaction.editReply('✅ Posted random content!');
        } else {
          return interaction.editReply(`⚠️ Failed: ${res.error}`);
        }
      }

      // trending
      if (cmd === 'trending') {
        const filterType = interaction.options.getString('type') || 'any';

        const res = await postRandomToChannel(interaction.channel, 'redgifs', '', userId, filterType);
        if (res.ok) {
          return interaction.editReply('✅ Posted trending content!');
        } else {
          return interaction.editReply(`⚠️ Failed: ${res.error}`);
        }
      }

      // unknown command fallback
      return interaction.reply({ content: '⚠️ Unknown command.', ephemeral: true });

    } catch (err) {
      errLog('[interaction] error handling command', cmd, err);
      if (deferred) {
        try {
          await interaction.editReply('❌ An unexpected error occurred. Please try again later.');
        } catch (_) {}
      } else {
        try {
          await interaction.reply({ content: '❌ An unexpected error occurred. Please try again later.', ephemeral: true });
        } catch (_) {}
      }
    }
  };
}

module.exports = { createDispatcher };
