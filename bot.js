// bot.js
// Enhanced version with API-specific tag selection
// Owner-only, Server-only, NSFW-only bot with robust /auto implementation.

const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const apiTagData = require('./api-tags.json'); // NEW: API-specific tags
const { log, errLog, API_POOL, IMAGE_EXTS, VIDEO_EXTS, getRandomGif, isChannelNSFW } = require('./utils');
const { redgifs, rule34, gelbooru, e621, realbooru, hypnohub, yandere, konachan, danbooru } = require('./apis');
const { userPreferences, loadUserPreferences, saveUserPreferences, getUserPrefs } = require('./prefs');
const { sendMediaSmart } = require('./media');
const { createDispatcher } = require('./commands');
const { commands } = require('./commandRegistry');
const { DISCORD_TOKEN, CLIENT_ID, BOT_OWNER_IDS, ownerIds, RECENT_HISTORY_SIZE, MAX_CHANNELS_IN_MEMORY, MAX_CONSECUTIVE_FAILURES, OWNER_MIN_INTERVAL, REGULAR_MIN_INTERVAL, MAX_INTERVAL, DEFAULT_REDGIFS_COUNT, DEFAULT_BOORU_COUNT, validateConfig, getMinInterval, validateInterval } = require('./config');
const { loadAdminBlacklist, isTagBlacklisted, addAdminBlacklist, removeAdminBlacklist, listAdminBlacklist } = require('./admin');



// NEW: Get API-specific tags
function getApiTags(apiName) {
  return apiTagData.api_tags[apiName]?.tags || [];
}

// NEW: Get a random tag for a specific API
function getRandomTagForApi(apiName) {
  const tags = getApiTags(apiName);
  if (tags.length === 0) {
    errLog('[tags] No tags found for API:', apiName);
    return '';
  }
  return tags[Math.floor(Math.random() * tags.length)];
}

// ---------- Process Error Handling ----------
process.on('unhandledRejection', (r) => errLog('unhandledRejection', r));
process.on('uncaughtException', (err) => {
  errLog('uncaughtException', err);
});


// ---------- In-memory structures ----------
const recentGifs = new Map();
const activeAutos = new Map();

const stats = {
  totalPosts: 0,
  postsByApi: {},
  errors: 0,
  errorsByType: {},
  startTime: Date.now()
};

// ---------- Discord client ----------
const client = new Client({ intents: GatewayIntentBits.Guilds });

// ---------- Command registration ----------
const REGISTER_COMMANDS = process.env.REGISTER_COMMANDS === 'true';
if (REGISTER_COMMANDS) {
  const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);
  (async () => {
    try {
      const guildIds = (process.env.GUILD_IDS || '').split(',').map(s => s.trim()).filter(Boolean);
      if (guildIds.length === 0) {
        errLog('REGISTER_COMMANDS=true but GUILD_IDS is empty. Set GUILD_IDS for guild registration.');
        process.exit(1);
      }
      log('Registering commands to guilds:', guildIds);
      for (const gid of guildIds) {
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID, gid), { body: commands });
        log('Registered commands to', gid);
      }
      log('✅ Command registration complete.');
    } catch (err) {
      errLog('❌ Failed to register commands:', err);
      process.exit(1);
    }
  })();
}

// ---------- Auto loop ----------
// Add this function to bot.js, before the startAuto function

// Add this to bot.js, before startAuto()

async function postRandomToChannel(channel, apiChoice, tag, userId, filterType = 'any', stats) {
  try {
    let selectedApi = apiChoice === 'any'
        ? API_POOL[Math.floor(Math.random() * API_POOL.length)]
        : apiChoice;

    let searchTag = tag || getRandomTagForApi(selectedApi);

    const blacklistCheck = isTagBlacklisted(searchTag, userId);
    if (blacklistCheck.blocked) {
      return { ok: false, error: `Tag blacklisted: ${blacklistCheck.reason}` };
    }

    const count = selectedApi === 'redgifs' ? DEFAULT_REDGIFS_COUNT : DEFAULT_BOORU_COUNT;
    let posts = [];

    switch (selectedApi) {
      case 'redgifs':
        posts = await redgifs.searchGifs(searchTag, count);
        break;
      case 'rule34':
        posts = await rule34.searchPosts(searchTag, count);
        break;
      case 'gelbooru':
        posts = await gelbooru.searchPosts(searchTag, count);
        break;
      case 'e621':
        posts = await e621.searchPosts(searchTag, count);
        break;
      case 'realbooru':
        posts = await realbooru.searchPosts(searchTag, count);
        break;
      case 'hypnohub':
        posts = await hypnohub.searchPosts(searchTag, count);
        break;
      case 'yandere':
        posts = await yandere.searchPosts(searchTag, count);
        break;
      case 'konachan':
        posts = await konachan.searchPosts(searchTag, count);
        break;
      case 'danbooru':
        posts = await danbooru.searchPosts(searchTag, count);
        break;
      default:
        return { ok: false, error: 'Unknown API' };
    }

    if (!posts || posts.length === 0) {
      return { ok: false, error: 'No results' };
    }

    if (filterType !== 'any') {
      posts = posts.filter(p => {
        const url = (p.file_url || '').toLowerCase();
        if (filterType === 'gif') return url.endsWith('.gif');
        if (filterType === 'image') return IMAGE_EXTS.some(ext => url.endsWith(ext));
        if (filterType === 'video') return VIDEO_EXTS.some(ext => url.endsWith(ext));
        return true;
      });
      if (posts.length === 0) {
        return { ok: false, error: `No ${filterType} found` };
      }
    }

    const chosen = getRandomGif(posts, channel.id);
    if (!chosen) {
      return { ok: false, error: 'All content recently seen' };
    }

    await sendMediaSmart(chosen, channel, `${selectedApi} - ${searchTag || 'random'}`);

    stats.totalPosts++;
    stats.postsByApi[selectedApi] = (stats.postsByApi[selectedApi] || 0) + 1;

    return { ok: true };
  } catch (err) {
    errLog('[postRandom] error:', err);
    stats.errors++;
    return { ok: false, error: err.message };
  }
}


async function startAuto(channel, userId, intervalSeconds, apiChoice = 'any', tag = '', filterType = 'any') {
  const cid = channel.id;
  if (activeAutos.has(cid)) {
    return { ok: false, reason: 'already_running' };
  }

  const intervalMs = intervalSeconds * 1000;
  let stopped = false;
  let consecutiveFailures = 0;
  let timer = null;

  let resolvedTag = tag;
  if (tag === 'favorite') {
    const prefs = getUserPrefs(userId);
    if (prefs.favoriteTags.length === 0) {
      return { ok: false, reason: 'no_favorites' };
    }
    resolvedTag = '';
  }

  async function runOnceAndSchedule() {
    if (stopped) return;

    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    try {
      let currentTag = resolvedTag;
      if (tag === 'favorite') {
        const prefs = getUserPrefs(userId);
        if (prefs.favoriteTags.length === 0) {
          log('[auto] no favorites available, stopping', cid);
          stop();
          return;
        }
        currentTag = prefs.favoriteTags[Math.floor(Math.random() * prefs.favoriteTags.length)];
        log('[auto] using favorite tag:', currentTag);
      }

      const res = await postRandomToChannel(channel, apiChoice, currentTag, userId, filterType,stats);

      if (!res.ok) {
        consecutiveFailures += 1;
        log('[auto] post failed', cid, 'failure#', consecutiveFailures, res.error);
      } else {
        consecutiveFailures = 0;
      }

      if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
        log('[auto] stopping due to unexpected errors for', cid);
        try { await channel.send(`⚠️ Auto-posting stopped after ${consecutiveFailures} consecutive unexpected errors.`); } catch (_) {}
        stop();
        return;
      }
      timer = setTimeout(runOnceAndSchedule, intervalMs);
      activeAutos.set(cid, { stop, meta: { userId, intervalSeconds, apiChoice, tag, filterType }, timer });
    } catch (err) {
      consecutiveFailures += 1;
      errLog('[auto] unexpected error in loop for', cid, err);
    }
  }

  function stop() {
    stopped = true;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    activeAutos.delete(cid);
    log('[auto] stopped for channel', cid);
  }

  activeAutos.set(cid, { stop, meta: { userId, intervalSeconds, apiChoice, tag, filterType }, timer: null });
  log('[auto] starting initial post for', cid);

  try {
    let currentTag = resolvedTag;
    if (tag === 'favorite') {
      const prefs = getUserPrefs(userId);
      currentTag = prefs.favoriteTags[Math.floor(Math.random() * prefs.favoriteTags.length)];
      log('[auto] using favorite tag for initial post:', currentTag);
    }

    const initial = await postRandomToChannel(channel, apiChoice, currentTag, userId, filterType,stats);
    if (!initial.ok) {
      consecutiveFailures += 1;
      log('[auto] initial post failed for', cid, initial.error);
    }
  } catch (err) {
    consecutiveFailures += 1;
    errLog('[auto] unexpected error on initial post for', cid, err);
  }

  if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
    activeAutos.delete(cid);
    return { ok: false, reason: 'initial_failures' };
  }

  timer = setTimeout(runOnceAndSchedule, intervalMs);
  activeAutos.set(cid, { stop, meta: { userId, intervalSeconds, apiChoice, tag, filterType }, timer });
  log('[auto] started for', cid, 'interval=', intervalSeconds, 'api=', apiChoice, 'tag=', tag, 'filter=', filterType);
  return { ok: true };
}

function stopAuto(channelId) {
  const info = activeAutos.get(channelId);
  if (!info) return { ok: false, reason: 'not_running' };
  try {
    if (info.timer) clearTimeout(info.timer);
    if (typeof info.stop === 'function') info.stop();
    activeAutos.delete(channelId);
    log('[auto] manually stopped for', channelId);
    return { ok: true };
  } catch (err) {
    errLog('[auto] error stopping for', channelId, err);
    return { ok: false, reason: 'stop_error' };
  }
}

// ---------- Interaction handling ----------
// These functions are used by commands.js via createDispatcher
// eslint-disable-next-line no-unused-vars
const handleInteraction = createDispatcher({
  log,
  errLog,
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
});

client.on('interactionCreate', handleInteraction);

// ---------- Graceful shutdown handlers ----------
process.on('SIGINT', async () => {
  log('[shutdown] SIGINT received, cleaning up...');

  for (const [, info] of activeAutos.entries()) {
    if (info.timer) clearTimeout(info.timer);
    if (typeof info.stop === 'function') info.stop();
  }
  activeAutos.clear();

  await saveUserPreferences();

  log('[shutdown] Goodbye!');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  log('[shutdown] SIGTERM received, cleaning up...');

  for (const [, info] of activeAutos.entries()) {
    if (info.timer) clearTimeout(info.timer);
    if (typeof info.stop === 'function') info.stop();
  }
  activeAutos.clear();

  await saveUserPreferences();

  log('[shutdown] Goodbye!');
  process.exit(0);
});

// ---------- Load preferences and login ----------
client.once('ready', async () => {
  log(`✅ Logged in as ${client.user.tag}`);
  await loadUserPreferences();
  client.user.setPresence({
    activities: [{ name: 'NSFW content', type: ActivityType.Playing }],
    status: 'online'
  });
});

client.login(DISCORD_TOKEN).catch(err => errLog('Login error', err));