# Discord NSFW Bot - Complete Setup Guide

## Table of Contents
- [Windows Setup](#windows-setup)
- [macOS Setup](#macos-setup)
- [Linux Setup](#linux-setup)
- [Discord Bot Configuration](#discord-bot-configuration)
- [Running the Bot](#running-the-bot)
- [Commands List & Usage](#commands-list--usage)
- [Features Explained](#features-explained)
- [Security Best Practices](#security-best-practices)
- [Advanced Configuration](#advanced-configuration)
- [FAQ](#faq)
- [Troubleshooting](#troubleshooting)
- [Uninstalling](#uninstalling)

---

## Windows Setup

### Step 1: Install Node.js
1. Go to https://nodejs.org/
2. Download the **LTS (Long Term Support)** version for Windows
3. Run the installer (`.msi` file)
4. Follow the installation wizard:
   - Click "Next" through the prompts
   - **Important**: Make sure "Add to PATH" is checked
   - Accept the license agreement
   - Click "Install"
5. Click "Finish" when done

### Step 2: Verify Installation
1. Press `Win + R` to open Run dialog
2. Type `cmd` and press Enter to open Command Prompt
3. Type these commands one at a time:
   ```bash
   node --version
   npm --version
   ```
4. You should see version numbers (like `v20.x.x` and `10.x.x`)

### Step 3: Download the Bot Files
1. Download all the bot files to a folder (e.g., `C:\Users\YourName\discord-bot`)
2. Make sure all these files are in the same folder:
   - `bot.js`
   - `commands.js`
   - `apis.js`
   - `config.js`
   - `prefs.js`
   - `admin.js`
   - `media.js`
   - `utils.js`
   - `commandRegistry.js`
   - `api-tags.json`
   - `package.json`
   - `user-prefs.json`

### Step 4: Install Dependencies
1. Open Command Prompt in your bot folder:
   - Navigate to the folder in File Explorer
   - Click in the address bar and type `cmd`, then press Enter
2. Run this command:
   ```bash
   npm install
   ```
3. Wait for it to finish (you'll see a progress bar)

### Step 5: Create .env File
1. In your bot folder, create a new file called `.env` (no name before the dot)
2. Open it with Notepad
3. Add this content (replace with your actual values):
   ```env
   DISCORD_BOT_TOKEN=your_bot_token_here
   CLIENT_ID=your_client_id_here
   BOT_OWNER_IDS=your_discord_user_id_here
   GUILD_IDS=your_server_id_here
   REGISTER_COMMANDS=true
   
   # Optional API Keys (leave blank if you don't have them)
   RULE34_API_KEY=
   RULE34_USER_ID=
   GELBOORU_API_KEY=
   GELBOORU_USER_ID=
   DANBOORU_API_KEY=
   DANBOORU_USER_ID=
   E621_USER_AGENT=MyDiscordBot/1.0 (your_email@example.com)
   
   # Admin blacklist (comma-separated tags)
   ADMIN_BLACKLISTED_TAGS=
   
   # Memory settings (optional)
   RECENT_HISTORY_SIZE=200
   MAX_CHANNELS_IN_MEMORY=100
   MAX_CONSECUTIVE_FAILURES=5
   ```

---

## macOS Setup

### Step 1: Install Homebrew (if not installed)
1. Open Terminal (Command + Space, type "Terminal")
2. Run this command:
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
3. Follow the on-screen instructions
4. Enter your password when prompted

### Step 2: Install Node.js
1. In Terminal, run:
   ```bash
   brew install node
   ```
2. Wait for installation to complete

### Step 3: Verify Installation
```bash
node --version
npm --version
```
You should see version numbers.

### Step 4: Download the Bot Files
1. Create a folder for your bot:
   ```bash
   mkdir ~/discord-bot
   cd ~/discord-bot
   ```
2. Place all bot files in this folder

### Step 5: Install Dependencies
```bash
npm install
```

### Step 6: Create .env File
1. In Terminal, in your bot folder:
   ```bash
   nano .env
   ```
2. Paste the .env content from the Windows section above
3. Press `Ctrl + O` to save, then `Ctrl + X` to exit

---

## Linux Setup

### Step 1: Update Package Manager
For **Ubuntu/Debian**:
```bash
sudo apt update
sudo apt upgrade -y
```

For **Fedora/RHEL**:
```bash
sudo dnf update -y
```

For **Arch Linux**:
```bash
sudo pacman -Syu
```

### Step 2: Install Node.js and npm

**Ubuntu/Debian**:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

**Fedora/RHEL**:
```bash
sudo dnf install nodejs npm
```

**Arch Linux**:
```bash
sudo pacman -S nodejs npm
```

### Step 3: Verify Installation
```bash
node --version
npm --version
```

### Step 4: Create Bot Directory
```bash
mkdir ~/discord-bot
cd ~/discord-bot
```

### Step 5: Add Bot Files
Place all your bot files in `~/discord-bot`

### Step 6: Install Dependencies
```bash
npm install
```

### Step 7: Create .env File
```bash
nano .env
```
Paste the .env content, save with `Ctrl + O`, exit with `Ctrl + X`

---

## Discord Bot Configuration

### Step 1: Create Discord Application
1. Go to https://discord.com/developers/applications
2. Click "New Application"
3. Give it a name (e.g., "My NSFW Bot")
4. Click "Create"

### Step 2: Get Bot Token
1. In your application, go to the "Bot" tab on the left
2. Click "Add Bot" → "Yes, do it!"
3. Under "Token", click "Reset Token" → "Yes, do it!"
4. Click "Copy" to copy your token
5. **Save this in your .env file as `DISCORD_BOT_TOKEN`**

### Step 3: Get Client ID
1. Go to the "General Information" tab
2. Copy the "Application ID"
3. **Save this in your .env file as `CLIENT_ID`**

### Step 4: Get Your User ID
1. Open Discord
2. Go to Settings → Advanced
3. Enable "Developer Mode"
4. Right-click your username in any chat
5. Click "Copy User ID"
6. **Save this in your .env file as `BOT_OWNER_IDS`**

### Step 5: Get Server (Guild) ID
1. Right-click your server name in Discord
2. Click "Copy Server ID"
3. **Save this in your .env file as `GUILD_IDS`**

### Step 6: Bot Permissions & Invite
1. Go back to your application on Discord Developer Portal
2. Go to "OAuth2" → "URL Generator"
3. Under "Scopes", check:
   - `bot`
   - `applications.commands`
4. Under "Bot Permissions", check:
   - Send Messages
   - Embed Links
   - Attach Files
   - Read Message History
   - Use Slash Commands
5. Copy the generated URL at the bottom
6. Paste it in your browser
7. Select your server and authorize

---

## Running the Bot

### First Time Setup (Register Commands)
Make sure your `.env` has:
```env
REGISTER_COMMANDS=true
```

Then run:

**Windows**:
```bash
node bot.js
```

**macOS/Linux**:
```bash
node bot.js
```

You should see:
```
Registering commands to guilds: [your_guild_id]
Registered commands to [guild_id]
✅ Command registration complete.
✅ Logged in as YourBot#1234
```

### After First Time
Change `.env` to:
```env
REGISTER_COMMANDS=false
```

Then run the bot normally:
```bash
node bot.js
```

### Keep Bot Running (Optional)

**Using PM2 (Recommended for production)**:
```bash
npm install -g pm2
pm2 start bot.js --name discord-bot
pm2 save
pm2 startup
```

**Using nohup (Linux/macOS)**:
```bash
nohup node bot.js &
```

**Using screen (Linux/macOS)**:
```bash
screen -S discord-bot
node bot.js
# Press Ctrl+A then D to detach
# To reattach: screen -r discord-bot
```

---

## Commands List & Usage

### Basic Commands

**`/ping`**
- Tests if the bot is responding
- Usage: Just type `/ping`
- Response: "🏓 pong"

**`/status`**
- Shows bot statistics and active auto-posts
- Usage: `/status`
- Shows: Uptime, total posts, errors, active channels, API usage

---

### Content Commands (NSFW Channels Only)

**`/nsfw search:[tag]`**
- Search RedGifs for specific content
- Usage: `/nsfw search:blonde`
- Optional: `type:gif` or `type:image` or `type:video`
- Example: `/nsfw search:blonde type:gif`

**`/rule34 tags:[tags]`**
- Search Rule34 (anime/hentai)
- Usage: `/rule34 tags:1girl blonde_hair`
- Use spaces between tags
- Example: `/rule34 tags:ahegao big_breasts type:image`

**`/gelbooru tags:[tags]`**
- Search Gelbooru (anime booru)
- Usage: `/gelbooru tags:big_breasts 1girl`
- Example: `/gelbooru tags:yuri 2girls`

**`/e621 tags:[tags]`**
- Search e621 (furry content)
- Usage: `/e621 tags:fox anthro`
- Example: `/e621 tags:dragon wings`

**`/realbooru tags:[tags]`**
- Search Realbooru (real photos)
- Usage: `/realbooru tags:amateur blonde`
- Example: `/realbooru tags:bikini beach`

**`/hypnohub tags:[tags]`**
- Search HypnoHub (hypnosis themed)
- Usage: `/hypnohub tags:spiral_eyes`
- Example: `/hypnohub tags:mind_control trance`

**`/yandere tags:[tags]`**
- Search Yande.re (high quality anime)
- Usage: `/yandere tags:bikini beach`
- Example: `/yandere tags:wet swimsuit`

**`/konachan tags:[tags]`**
- Search Konachan (anime wallpapers)
- Usage: `/konachan tags:landscape sunset`
- Example: `/konachan tags:1girl long_hair`

**`/danbooru tags:[tags]`**
- Search Danbooru (largest anime database)
- Usage: `/danbooru tags:ahegao 1girl`
- Example: `/danbooru tags:stockings high_heels`

**`/random`**
- Get random content from any API
- Usage: `/random`
- Optional: `tag:specific_tag` or `tag:favorite` to use your favorites
- Optional: `type:gif` or `type:image` or `type:video`
- Example: `/random tag:futa type:gif`

**`/trending`**
- Get trending content from RedGifs
- Usage: `/trending`
- Optional: `type:` filter
- Example: `/trending type:video`

---

### Auto-Posting Commands

**`/auto interval:[seconds] api:[api] tag:[tag] type:[type]`**
- Automatically post content at set intervals
- Required: `interval` (30-300 seconds, owner: 30+, regular: 65+)
- Optional: `api` (which site to use, default: any)
- Optional: `tag` (specific tag or "favorite", default: random)
- Optional: `type` (gif/image/video, default: any)

Examples:
```
/auto interval:120 api:redgifs tag:blonde type:gif
/auto interval:180 api:rule34 tag:favorite
/auto interval:90 api:any
/auto interval:300 api:e621 tag:dragon type:image
```

**`/stop`**
- Stop auto-posting in the current channel
- Usage: `/stop`
- Only works in channels with active auto-posting

---

### Favorite Tag Management

**`/favorite add tag:[tag]`**
- Add a tag to your personal favorites
- Usage: `/favorite add tag:futa`
- Example: `/favorite add tag:catgirl`

**`/favorite remove tag:[tag]`**
- Remove a tag from your favorites
- Usage: `/favorite remove tag:futa`

**`/favorite list`**
- Show all your favorite tags
- Usage: `/favorite list`

**`/favorite clear`**
- Remove all your favorite tags
- Usage: `/favorite clear`

---

### Blacklist Management

**`/blacklist add tag:[tag]`**
- Add a tag to your personal blacklist (you won't see content with this tag)
- Usage: `/blacklist add tag:furry`
- Example: `/blacklist add tag:gore`

**`/blacklist remove tag:[tag]`**
- Remove a tag from your blacklist
- Usage: `/blacklist remove tag:furry`

**`/blacklist list`**
- Show all your blacklisted tags
- Usage: `/blacklist list`

**`/blacklist clear`**
- Clear your entire blacklist
- Usage: `/blacklist clear`

---

### Admin Commands (Owner Only)

**`/admin blacklist-add tag:[tag]`**
- Add a tag to the global blacklist (affects all users)
- Usage: `/admin blacklist-add tag:loli`

**`/admin blacklist-remove tag:[tag]`**
- Remove a tag from global blacklist
- Usage: `/admin blacklist-remove tag:loli`

**`/admin blacklist-list`**
- Show all globally blacklisted tags
- Usage: `/admin blacklist-list`

**`/admin setlimit user:[user] interval:[seconds]`**
- Set custom interval limits for specific users (not yet implemented)
- Usage: `/admin setlimit user:@friend interval:45`

---

## Features Explained

### API Sources - What's the Difference?

**RedGifs**
- Real people, GIFs and videos
- Best for: Real porn, GIFs, trending content
- Popular tags: amateur, bbc, creampie, pov

**Rule34**
- Anime/cartoon porn
- Best for: Hentai, anime characters, game characters
- Popular tags: 1girl, ahegao, futanari, tentacles

**Gelbooru**
- Large anime image board
- Best for: High quality anime art, diverse content
- Similar to Rule34 but different content

**e621**
- Furry/anthropomorphic content
- Best for: Furry art, scalies, Pokemon
- Popular tags: anthro, fox, dragon, knot

**Realbooru**
- Real photos (tagged like booru sites)
- Best for: Real photos with detailed tags
- Popular tags: amateur, blonde, lingerie

**HypnoHub**
- Hypnosis/mind control themed
- Best for: Hypno fetish content
- Popular tags: spiral_eyes, mind_control, trance

**Yande.re**
- High quality anime images
- Best for: Wallpaper-quality anime art
- More curated than other boorus

**Konachan**
- Anime wallpapers
- Best for: High resolution anime art
- Similar to Yande.re

**Danbooru**
- Largest anime image database
- Best for: Maximum variety of anime content
- Most comprehensive tagging system

---

### How Favorites Work

1. Add tags you like: `/favorite add tag:futa`
2. Add more: `/favorite add tag:catgirl`
3. Use in commands: `/random tag:favorite` - picks a random favorite
4. Use in auto: `/auto interval:120 tag:favorite` - rotates through favorites
5. Each user has their own favorite list

---

### How Blacklists Work

**Personal Blacklist**
- Add tags you don't want to see: `/blacklist add tag:gore`
- The bot won't show you content with those tags
- Only affects you

**Admin Blacklist**
- Owner can add tags: `/admin blacklist-add tag:loli`
- Affects ALL users of the bot
- Can't be bypassed by regular users

**How it checks:**
- Before posting, checks if any tag in the content matches your blacklist
- If match found, skips that content and tries another

---

### Media Type Filters

All content commands support `type:` parameter:

- `type:any` - Any media (default)
- `type:gif` - Only GIF files
- `type:image` - Only static images (jpg, png, webp)
- `type:video` - Only videos (mp4, webm)

Example: `/nsfw search:blonde type:gif` - only shows GIF results

---

### Auto-Posting How It Works

1. You start auto: `/auto interval:120 api:redgifs`
2. Bot immediately posts one item
3. Waits 120 seconds
4. Posts another item
5. Repeats until you `/stop` or bot crashes

**Features:**
- Remembers recent posts to avoid duplicates (last 200 items per channel)
- Tracks up to 100 channels in memory
- Stops automatically after 5 consecutive failures
- Only one auto per channel at a time

**Interval Limits:**
- Bot owner: 30-300 seconds
- Regular users: 65-300 seconds
- Prevents spam and API rate limits

---

### Recent History & Duplicates

The bot tracks what it recently posted in each channel:
- Stores last 200 items per channel
- Tracks up to 100 channels
- When all items seen, partially clears history
- Prevents showing same content multiple times in a row

This means if you request the same tag repeatedly, you'll get different results each time!

---

## Security Best Practices

### Protecting Your Bot Token

**❌ NEVER:**
- Share your `.env` file
- Commit `.env` to GitHub
- Post your token in Discord/forums
- Share screenshots with token visible
- Give token to untrusted people

**✅ ALWAYS:**
- Keep `.env` in your bot folder only
- Add `.env` to `.gitignore` if using git
- Reset token immediately if leaked
- Use environment variables on servers

### .gitignore File

If you're using Git, create a `.gitignore` file in your bot folder:

```
# Bot secrets
.env
user-prefs.json

# Dependencies
node_modules/

# Logs
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db
```

### If Your Token Leaks

1. Go to Discord Developer Portal
2. Go to your application → Bot tab
3. Click "Reset Token"
4. Copy the new token
5. Update your `.env` file
6. Restart the bot

### Owner-Only Mode

This bot is set to **owner-only** for security:
- Only Discord user IDs in `BOT_OWNER_IDS` can use commands
- Prevents random people from using your bot
- Even if bot is in 100 servers, only you can control it

To add co-owners:
```env
BOT_OWNER_IDS=your_id,friend_id,another_friend_id
```

---

## Advanced Configuration

### Getting API Keys for Booru Sites

Some booru sites work better with API keys (higher rate limits, more features).

**Rule34 API Key:**
1. Create account at https://rule34.xxx/
2. Go to Account → API
3. Generate API key
4. Add to `.env`:
   ```env
   RULE34_API_KEY=your_key_here
   RULE34_USER_ID=your_user_id_here
   ```

**Gelbooru API Key:**
1. Create account at https://gelbooru.com/
2. Go to Account Settings → API
3. Generate API key
4. Add to `.env`:
   ```env
   GELBOORU_API_KEY=your_key_here
   GELBOORU_USER_ID=your_user_id_here
   ```

**Danbooru API Key:**
1. Create account at https://danbooru.donmai.us/
2. Go to Profile → API Key
3. Generate key
4. Add to `.env`:
   ```env
   DANBOORU_API_KEY=your_key_here
   DANBOORU_USER_ID=your_username_here
   ```

**e621 User Agent:**
e621 requires a proper user agent:
```env
E621_USER_AGENT=YourBotName/1.0 (your_email@example.com)
```

---

### Adjusting Memory Settings

In `.env`:

```env
# How many recent items to remember per channel (default: 200)
RECENT_HISTORY_SIZE=200

# Maximum channels to track (default: 100)
MAX_CHANNELS_IN_MEMORY=100

# Auto-stop after this many failures (default: 5)
MAX_CONSECUTIVE_FAILURES=5
```

**Higher values = more memory usage**
- If bot uses too much RAM, lower these numbers
- If you want less duplicates, increase `RECENT_HISTORY_SIZE`

---

### Running in Multiple Servers

You can add the bot to multiple servers:

1. Get each server's ID (right-click server → Copy Server ID)
2. Update `.env`:
   ```env
   GUILD_IDS=server1_id,server2_id,server3_id
   ```
3. Set `REGISTER_COMMANDS=true`
4. Run bot once to register commands in all servers
5. Set `REGISTER_COMMANDS=false` and restart

The bot will work in all servers, but only the owner can use commands.

---

### Using Different Accounts/Bots

If you want separate bots for different purposes:

1. Create a new Discord application (repeat "Discord Bot Configuration")
2. Create a new folder with new bot files
3. Create new `.env` with the new bot's token
4. Run the second bot

You can run multiple bots simultaneously if they have different tokens!

---

## FAQ

### General Questions

**Q: Can my friends use this bot?**
A: Only if you add their Discord IDs to `BOT_OWNER_IDS`. Otherwise, only you can use commands.

**Q: Can I run this bot 24/7?**
A: Yes! Use PM2 or run it on a VPS/server. Your computer needs to stay on if running locally.

**Q: Does this work in DMs?**
A: No, server-only. The bot will reject DM commands.

**Q: How much does this cost?**
A: Free! The bot uses free APIs. Optional: VPS hosting ($3-5/month) for 24/7 uptime.

**Q: Can I customize the bot's name/avatar?**
A: Yes! Go to Discord Developer Portal → Your App → Bot tab → Change username/avatar.

---

### Multiple Bots & Servers

**Q: Can I run multiple bots at once?**
A: Yes, but each needs its own token (separate Discord application).

**Q: Can I use one bot in multiple servers?**
A: Yes! Add all server IDs to `GUILD_IDS` in `.env`.

**Q: Two people can't run the same bot at once?**
A: Correct. One token = one bot instance. They'll conflict if both try to run it.

**Q: How do I give my friend access?**
A: Three options:
1. Add their ID to `BOT_OWNER_IDS` (they share your bot)
2. They create their own bot (recommended)
3. You run the bot, they just use commands (add their ID as co-owner)

---

### Commands & Features

**Q: Why aren't my commands showing up?**
A: 
1. Make sure `REGISTER_COMMANDS=true` first time
2. Run bot once
3. Wait 5-10 minutes
4. Try `/ping`
5. If still not working, kick bot and re-invite

**Q: Can I use this in non-NSFW channels?**
A: No. All content commands require NSFW channels (18+). `/ping` and `/status` work anywhere.

**Q: What's the difference between `/random` and `/nsfw`?**
A: 
- `/nsfw` - Only searches RedGifs
- `/random` - Picks random API (RedGifs, Rule34, e621, etc.)

**Q: How do I stop auto-posting?**
A: Type `/stop` in the channel with active auto-posting.

**Q: Can I have auto-posting in multiple channels?**
A: Yes! Each channel can have its own auto-posting with different settings.

**Q: What happens if I use `/auto` twice in same channel?**
A: Bot will say "already running". Use `/stop` first, then start new auto.

---

### Content & APIs

**Q: Why do I keep getting "No results"?**
A: 
- Tag might be misspelled
- Tag might not exist on that API
- Try different API or broader tag
- Some APIs have less content than others

**Q: Can I search for multiple tags?**
A: Yes! For booru sites: `/rule34 tags:1girl blonde_hair big_breasts`

**Q: What's the best API for [specific content]?**
A:
- Real people: RedGifs, Realbooru
- Anime: Rule34, Gelbooru, Danbooru
- Furry: e621
- Hypnosis: HypnoHub

**Q: Do I need API keys?**
A: No, all APIs work without keys. Keys just give better rate limits and more features.

**Q: Why does the bot keep showing me the same content?**
A: The bot remembers last 200 items per channel. If you've seen them all, it partially clears history. Try different tags or wait.

---

### Technical Questions

**Q: How do I update the bot?**
A:
1. Download new bot files
2. Replace old files (keep your `.env` and `user-prefs.json`)
3. Run `npm install` again
4. Restart bot

**Q: Can I modify the code?**
A: Yes! It's open source. Edit any `.js` file. Just restart bot after changes.

**Q: How much RAM does this use?**
A: ~50-150MB depending on settings. Very lightweight.

**Q: Can I run this on a Raspberry Pi?**
A: Yes! Follow Linux setup instructions.

**Q: Does this work on replit/glitch?**
A: Technically yes, but they might ban NSFW bots. Use a VPS instead.

---

### Errors & Issues

**Q: Bot crashes when I use a command**
A: Check console for error message. Common causes:
- Missing `.env` values
- No internet connection
- API is down
- Invalid tag/search

**Q: "Missing Access" error**
A: Make sure:
1. Bot is in the server
2. Channel is marked NSFW
3. Bot has proper permissions

**Q: Commands work but no content appears**
A: 
- Check if channel is NSFW
- Try different tag
- Check API status (site might be down)
- Try `/status` to see errors

**Q: Bot stops auto-posting randomly**
A: Usually means 5 consecutive failures (no results, API down, etc.). Check console logs.

---

## Troubleshooting

### "Command not found: node"
- **Solution**: Restart your terminal/command prompt after installing Node.js
- Or add Node.js to PATH manually

### "Cannot find module 'discord.js'"
- **Solution**: Run `npm install` in the bot folder

### "Invalid Token"
- **Solution**: 
  1. Go to Discord Developer Portal
  2. Reset your bot token
  3. Update `.env` with the new token

### "Missing Access" or "Unknown Channel"
- **Solution**: 
  1. Make sure the bot is in your server
  2. Check that the channel is marked as NSFW (18+)
  3. Verify bot has proper permissions

### "Commands not showing up"
- **Solution**:
  1. Make sure `REGISTER_COMMANDS=true` in `.env`
  2. Run the bot once to register commands
  3. Wait 5-10 minutes for Discord to update
  4. Try kicking and re-inviting the bot
  5. Make sure you're in a server (not DMs)

### Bot crashes immediately
- **Solution**: Check your `.env` file has all required fields filled in
- Check console for specific error message

### "ENOENT: no such file or directory, open '.env'"
- **Solution**: Make sure the `.env` file is in the same folder as `bot.js`

### "All content recently seen"
- **Solution**: 
  - Bot has shown all available results
  - Try different tag
  - Wait a bit (history will partially clear)
  - Increase `RECENT_HISTORY_SIZE` in `.env`

### "No results or error"
- **Solution**:
  - Tag might not exist on that API
  - Try different API
  - Check spelling
  - Try broader tag

### Bot uses too much memory
- **Solution**: Lower these in `.env`:
  ```env
  RECENT_HISTORY_SIZE=100
  MAX_CHANNELS_IN_MEMORY=50
  ```

### Auto-posting stops after a while
- **Solution**: 
  - Normal after 5 consecutive failures
  - Check console for error
  - Try different tag/API
  - Restart auto with `/stop` then `/auto`

### PM2 errors
- **Solution**:
  ```bash
  pm2 delete discord-bot
  pm2 start bot.js --name discord-bot
  ```

### Rate limit errors
- **Solution**:
  - You're making too many requests
  - Increase auto interval
  - Get API keys for booru sites
  - Wait a few minutes

---

## Uninstalling

### Stop the Bot

**If running normally:**
- Press `Ctrl + C` in the terminal

**If using PM2:**
```bash
pm2 stop discord-bot
pm2 delete discord-bot
pm2 save
```

**If using screen:**
```bash
screen -r discord-bot
# Press Ctrl+C
exit
```

**If using nohup:**
```bash
# Find process
ps aux | grep "node bot.js"
# Kill it (replace PID with actual number)
kill PID
```

---

### Remove from Discord

1. Go to your Discord server
2. Right-click the bot's name
3. Click "Kick [bot name]"

Or:

1. Server Settings → Members
2. Find your bot
3. Click three dots → Kick

---

### Delete Discord Application

1. Go to https://discord.com/developers/applications
2. Click your bot application
3. Go to "General Information"
4. Scroll down → "Delete Application"
5. Confirm by typing the app name

---

### Clean Up Files

**Windows:**
1. Delete the bot folder (e.g., `C:\Users\YourName\discord-bot`)
2. Empty Recycle Bin

**macOS/Linux:**
```bash
cd ~
rm -rf discord-bot
```

---

### Uninstall Node.js (Optional)

**Windows:**
1. Control Panel → Programs → Uninstall a program
2. Find "Node.js"
3. Click Uninstall

**macOS:**
```bash
brew uninstall node
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt remove nodejs npm
sudo apt autoremove
```

---

### Clean PM2 (if installed)

```bash
pm2 kill
npm uninstall -g pm2
```

---

## Testing the Bot

After setup, test in this order:

1. **Basic connectivity**: `/ping` → Should respond "🏓 pong"

2. **Bot statistics**: `/status` → Should show uptime and stats

3. **Simple content fetch**: 
   - Go to an NSFW channel
   - Try `/nsfw search:blonde`
   - Should post an image/gif

4. **Random content**: `/random` → Should post from random API

5. **Favorites system**:
   - `/favorite add tag:futa` → Should confirm added
   - `/favorite list` → Should show your tag
   - `/random tag:favorite` → Should use that tag

6. **Auto-posting**:
   - `/auto interval:120 api:redgifs tag:blonde`
   - Should post immediately, then every 120 seconds
   - `/stop` → Should stop auto-posting

7. **Blacklist**:
   - `/blacklist add tag:gore`
   - Try to search for that tag → Should be blocked

If all these work, your bot is fully functional! 🎉

---

## Performance Tips

### Optimal Interval Times

**Recommended intervals:**
- **Fast posting**: 90-120 seconds (1.5-2 minutes)
- **Moderate**: 180-240 seconds (3-4 minutes)
- **Slow/safe**: 300+ seconds (5+ minutes)

**Why not go faster?**
- API rate limits might block you
- Discord might flag as spam
- More likely to see duplicates
- Higher server load

### Memory Optimization

If running on low-end hardware:

```env
RECENT_HISTORY_SIZE=100        # Instead of 200
MAX_CHANNELS_IN_MEMORY=50      # Instead of 100
```

This reduces RAM usage but increases duplicate chances.

### API Performance

**Fastest APIs** (usually):
- RedGifs (optimized CDN)
- e621 (fast servers)

**Slower APIs**:
- Danbooru (huge database)
- Gelbooru (sometimes slow)

**Most reliable**:
- RedGifs (rarely down)
- e621 (good uptime)

**Least reliable**:
- Smaller booru sites (occasional downtime)

### Reducing Duplicates

1. **Increase history size**:
   ```env
   RECENT_HISTORY_SIZE=300
   ```

2. **Use broader tags** (more results = less duplicates)

3. **Rotate between different tags/APIs**

4. **Use `/random` instead of same command repeatedly**

---

## Common Use Cases

### Use Case 1: Personal Auto-Posting Server

**Goal**: Automatically post content to your private server

**Setup**:
```
1. Create private Discord server
2. Make NSFW channel
3. Invite bot
4. Start auto: /auto interval:180 api:redgifs tag:favorite
```

**Tips**:
- Add multiple favorite tags for variety
- Use moderate interval (3-5 minutes)
- Set up multiple channels with different themes

---

### Use Case 2: Multi-Channel Different Themes

**Goal**: Different types of content in different channels

**Setup**:
```
#real-content:
/auto interval:240 api:realbooru tag:amateur

#anime-content:
/auto interval:240 api:rule34 tag:ahegao

#furry-content:
/auto interval:240 api:e621 tag:anthro
```

**Tips**:
- Each channel remembers its own history
- Can have different intervals per channel
- Use specific tags for each theme

---

### Use Case 3: On-Demand Content Server

**Goal**: No auto-posting, just manual requests

**Setup**:
```
1. Don't use /auto at all
2. Just use /random or specific API commands when needed
3. Build up favorite tags for quick access
```

**Tips**:
- Use `/random tag:favorite` for quick variety
- Blacklist unwanted content
- Use type filters for specific media

---

### Use Case 4: Scheduled Posting

**Goal**: Post only at certain times (morning/evening)

**Setup** (requires cron/task scheduler):

**Linux/macOS crontab**:
```bash
# Edit crontab
crontab -e

# Add these lines (posts at 8 AM and 8 PM daily)
0 8 * * * curl -X POST "YOUR_WEBHOOK_URL" -d '{"content": "Starting morning posts!"}'
0 20 * * * curl -X POST "YOUR_WEBHOOK_URL" -d '{"content": "Starting evening posts!"}'
```

Then manually start/stop auto at those times, or use a separate script.

---

### Use Case 5: Friend Group Server

**Goal**: Multiple people can control the bot

**Setup**:
```env
BOT_OWNER_IDS=your_id,friend1_id,friend2_id,friend3_id
```

**Tips**:
- Anyone in owner list can use ALL commands
- They can start/stop auto-posting
- Each person has their own favorites/blacklist
- Coordinate who starts auto to avoid conflicts

---

## Advanced Tips & Tricks

### Combining Tags Effectively

**For booru sites**, you can combine tags for specific results:

**Good combinations**:
```
/rule34 tags:1girl blonde_hair blue_eyes
/gelbooru tags:yuri 2girls kissing
/e621 tags:fox anthro female
/danbooru tags:futanari big_breasts 1girl
```

**Tag modifiers** (site-dependent):
```
rating:explicit     (NSFW only)
score:>100         (highly rated)
-tag_name          (exclude this tag)
```

Example: `/rule34 tags:1girl blonde_hair -furry`

---

### Using API-Specific Features

**RedGifs**:
- Best for trending content
- Use `/trending` for popular posts
- High quality real content

**e621**:
- Advanced tag system
- Use underscores: `big_breasts` not `big breasts`
- Can combine many tags

**Danbooru**:
- Most comprehensive tags
- Best for finding specific characters/scenarios
- Use exact tag names

---

### Managing Multiple Bots

If running multiple bots:

**Folder structure**:
```
~/discord-bots/
  ├── bot1-nsfw/
  │   ├── bot.js
  │   ├── .env (token1)
  │   └── ...
  ├── bot2-sfw/
  │   ├── bot.js
  │   ├── .env (token2)
  │   └── ...
```

**PM2 management**:
```bash
cd ~/discord-bots/bot1-nsfw
pm2 start bot.js --name nsfw-bot

cd ~/discord-bots/bot2-sfw
pm2 start bot.js --name sfw-bot

pm2 list  # See all bots
pm2 logs  # See all logs
```

---

### Webhook Alternative

Instead of bot posting, you can modify the code to use webhooks:

**Advantages**:
- Can customize username per post
- Can customize avatar per post
- More flexibility

**Disadvantages**:
- Requires code modification
- More complex setup

---

### Logging & Monitoring

The bot logs to console. To save logs:

**Using PM2**:
```bash
pm2 logs discord-bot --lines 100
pm2 logs discord-bot > bot-logs.txt
```

**Using redirect**:
```bash
node bot.js > bot.log 2>&1
```

**Using tee** (see output AND save):
```bash
node bot.js 2>&1 | tee bot.log
```

---

### Backup & Restore

**What to backup**:
- `.env` (your config)
- `user-prefs.json` (all favorites/blacklists)
- Modified code files

**What NOT to backup**:
- `node_modules/` (reinstall with `npm install`)
- Log files

**Backup command** (Linux/macOS):
```bash
tar -czf discord-bot-backup.tar.gz .env user-prefs.json *.js api-tags.json package.json
```

**Restore**:
```bash
tar -xzf discord-bot-backup.tar.gz
npm install
```

---

## Hosting Options

### Option 1: Your Computer (Free)
**Pros**: Free, full control
**Cons**: Must stay on, uses electricity

**Best for**: Testing, personal use

---

### Option 2: Raspberry Pi ($35 one-time)
**Pros**: Low power, always on, cheap
**Cons**: Initial cost, requires setup

**Best for**: Home servers, 24/7 personal use

**Setup**: Follow Linux instructions

---

### Option 3: VPS (Virtual Private Server) ($3-10/month)

**Providers**:
- DigitalOcean ($4/month)
- Linode ($5/month)
- Vultr ($3.50/month)
- AWS EC2 (free tier 12 months)
- Oracle Cloud (always free tier)

**Pros**: 24/7, reliable, fast
**Cons**: Monthly cost, requires Linux knowledge

**Best for**: Public bots, serious use

**Quick VPS setup**:
```bash
# SSH into VPS
ssh user@your-vps-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Upload bot files (from your computer)
scp -r /path/to/discord-bot user@your-vps-ip:~/

# On VPS, install and run
cd ~/discord-bot
npm install
pm2 start bot.js --name discord-bot
pm2 startup
pm2 save
```

---

### Option 4: Cloud Platforms

**Heroku**: Was free, now paid
**Railway**: $5/month
**Render**: Free tier available
**Fly.io**: Free tier available

**Pros**: Easy deployment, managed
**Cons**: Can be expensive, NSFW might violate ToS

**Best for**: Simple deployment

⚠️ **Warning**: Many free hosts ban NSFW bots. Read ToS first!

---

## Legal & Safety Information

### Age Restrictions
- This bot is for **18+ users only**
- Only use in **NSFW-marked channels**
- Some APIs have stricter content policies

### Terms of Service
Make sure you comply with:
- Discord ToS (no illegal content)
- Each API's ToS (e621, Rule34, etc.)
- Your hosting provider's ToS

### Content Responsibility
- **You** are responsible for what your bot posts
- Use blacklists to avoid unwanted content
- Don't use in servers with minors
- Respect server rules

### Privacy
- User preferences stored locally in `user-prefs.json`
- No data sent to third parties (except API requests)
- Bot owner can see all user preferences (they're in the file)

### API Rate Limits
Respect API rate limits:
- Don't spam requests
- Use reasonable intervals
- Get API keys if making many requests
- Some APIs will block you for abuse

---

## Contributing & Customization

### Customizing Embed Colors

In `media.js`, find:
```javascript
.setColor(0xFF69B4)
```

Change to your color (hex code):
```javascript
.setColor(0xFF0000)  // Red
.setColor(0x00FF00)  // Green
.setColor(0x0099FF)  // Blue
```

### Adding New Commands

1. Edit `commandRegistry.js` to add command definition
2. Edit `commands.js` to add command handler
3. Set `REGISTER_COMMANDS=true`
4. Run bot once
5. Set back to `false`

### Adding New APIs

1. Create API class in `apis.js`
2. Add to `API_POOL` in `utils.js`
3. Add case in `postRandomToChannel()` in `bot.js`
4. Add tags to `api-tags.json`
5. Add command in `commandRegistry.js`

### Modifying Intervals

In `config.js`:
```javascript
const OWNER_MIN_INTERVAL = 30;      // Owner minimum
const REGULAR_MIN_INTERVAL = 65;    // Regular user minimum
const MAX_INTERVAL = 300;           // Maximum for all
```

---

## Support & Resources

### Official Documentation Links
- Discord.js Guide: https://discordjs.guide/
- Discord Developer Portal: https://discord.com/developers/docs
- Node.js Docs: https://nodejs.org/docs/

### API Documentation
- RedGifs API: https://api.redgifs.com/docs
- Rule34 API: https://rule34.xxx/index.php?page=help&topic=dapi
- e621 API: https://e621.net/help/api
- Gelbooru API: https://gelbooru.com/index.php?page=wiki&s=view&id=18780
- Danbooru API: https://danbooru.donmai.us/wiki_pages/help:api

### Community Resources
- Discord.js Discord: https://discord.gg/djs
- Reddit r/discordapp
- Stack Overflow (tag: discord.js)

### Getting Help

If you need help:
1. Check this guide first
2. Look at console error messages
3. Google the specific error
4. Check Discord.js documentation
5. Ask in Discord.js community server

When asking for help, provide:
- Operating system
- Node.js version (`node --version`)
- Full error message from console
- What you were trying to do
- What you already tried

---

## Credits & License

### This Bot
- License: MIT (see LICENSE file)
- Free to use, modify, distribute
- No warranty provided

### APIs Used
- RedGifs
- Rule34
- Gelbooru
- e621
- Realbooru
- HypnoHub
- Yande.re
- Konachan
- Danbooru

All content belongs to respective API providers and original creators.

### Built With
- Node.js
- Discord.js
- Axios
- dotenv

---

## Changelog & Updates

### How to Check for Updates

If the bot code gets updated:

1. Download new files
2. **Backup your `.env` and `user-prefs.json`**
3. Replace all `.js` files with new versions
4. Keep your `.env` and `user-prefs.json`
5. Run `npm install` (in case dependencies changed)
6. Restart bot

### Version History

**Current Version**: 1.0.0
- Initial release
- 9 API integrations
- Favorite tags system
- Blacklist system
- Auto-posting
- Media type filters
- Owner-only mode

---

## Final Notes

### Important Reminders

✅ **Always use NSFW channels** - Bot won't work in regular channels
✅ **Keep your token secret** - Never share `.env` file
✅ **Respect rate limits** - Don't spam APIs
✅ **18+ only** - This is adult content
✅ **You're responsible** - For what your bot posts

### Best Practices

- Start with longer intervals (120+ seconds)
- Build your favorites list gradually
- Use blacklists to filter unwanted content
- Monitor console logs occasionally
- Keep Node.js updated
- Backup your preferences file
- Use PM2 for production

### Getting the Most Out of Your Bot

1. **Explore different APIs** - Each has unique content
2. **Use favorites** - Quick access to preferred tags
3. **Combine tags** - Get specific results
4. **Use filters** - Type:gif for animations only
5. **Multiple channels** - Different themes
6. **Blacklist liberally** - Remove unwanted content

---

## Quick Reference Card

### Essential Commands
```
/ping              - Test bot
/status            - Bot statistics  
/random            - Random content from any API
/nsfw search:X     - RedGifs search
/auto interval:X   - Start auto-posting
/stop              - Stop auto-posting
/favorite add      - Add favorite tag
/blacklist add     - Block unwanted tags
```

### Essential Files
```
.env               - Your config (KEEP SECRET!)
bot.js             - Main bot file
user-prefs.json    - Your favorites/blacklists
package.json       - Dependencies list
```

### Essential Commands (Terminal)
```
node bot.js        - Run bot
npm install        - Install dependencies
pm2 start bot.js   - Run in background
pm2 stop all       - Stop all PM2 processes
```

### Troubleshooting Quick Fixes
```
❌ Commands not showing  → REGISTER_COMMANDS=true, restart
❌ Invalid token         → Reset token in Discord portal
❌ No results            → Try different tag/API
❌ Not NSFW channel      → Mark channel as 18+
❌ Module not found      → npm install
```

---

## You're All Set! 🎉

You now have a fully functional NSFW Discord bot with:
- ✅ 9 different content sources
- ✅ Auto-posting capability
- ✅ Favorite tags system
- ✅ Blacklist filtering
- ✅ Media type filters
- ✅ Owner-only security
- ✅ Duplicate prevention

**Next Steps**:
1. Test basic commands
2. Add some favorite tags
3. Try auto-posting
4. Explore different APIs
5. Customize to your preferences

**Enjoy responsibly!** 🔞

---

*Need help? Reread the FAQ and Troubleshooting sections. Most issues have solutions there!*