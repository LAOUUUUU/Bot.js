// clear-all-commands.js
// Automatically detects and removes ALL commands (global + guild-specific)
require('dotenv').config();
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

const token = process.env.DISCORD_BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildIds = (process.env.GUILD_IDS || '').split(',').map(s => s.trim()).filter(Boolean);

if (!token || !clientId) {
  console.error('❌ Set DISCORD_BOT_TOKEN and CLIENT_ID in .env');
  process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('🔍 Fetching and clearing all commands...\n');

    // 1. Clear global commands
    console.log('📡 Checking global commands...');
    const globalCommands = await rest.get(Routes.applicationCommands(clientId));
    
    if (globalCommands.length > 0) {
      console.log(`Found ${globalCommands.length} global command(s):`);
      globalCommands.forEach(cmd => console.log(`  - ${cmd.name}`));
      
      await rest.put(Routes.applicationCommands(clientId), { body: [] });
      console.log('✅ Cleared all global commands.\n');
    } else {
      console.log('✅ No global commands found.\n');
    }

    // 2. Clear guild-specific commands
    if (guildIds.length > 0) {
      console.log(`📡 Checking ${guildIds.length} guild(s)...`);
      
      for (const guildId of guildIds) {
        try {
          const guildCommands = await rest.get(Routes.applicationGuildCommands(clientId, guildId));
          
          if (guildCommands.length > 0) {
            console.log(`\nGuild ${guildId}: Found ${guildCommands.length} command(s):`);
            guildCommands.forEach(cmd => console.log(`  - ${cmd.name}`));
            
            await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });
            console.log(`✅ Cleared commands for guild ${guildId}`);
          } else {
            console.log(`Guild ${guildId}: No commands found`);
          }
        } catch (err) {
          console.error(`❌ Failed to clear commands for guild ${guildId}:`, err.message);
        }
      }
    } else {
      console.log('⚠️  No GUILD_IDS set in .env - skipping guild commands');
    }

    console.log('\n✅ Done! All commands cleared.');
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
})();