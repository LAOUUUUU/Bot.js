# Discord NSFW Bot - Complete Setup Guide

## Table of Contents
- [Windows Setup](#windows-setup)
- [macOS Setup](#macos-setup)
- [Linux Setup](#linux-setup)
- [Discord Bot Configuration](#discord-bot-configuration)
- [Running the Bot](#running-the-bot)
- [Troubleshooting](#troubleshooting)

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

### Bot crashes immediately
- **Solution**: Check your `.env` file has all required fields filled in

### "ENOENT: no such file or directory, open '.env'"
- **Solution**: Make sure the `.env` file is in the same folder as `bot.js`

---

## Testing the Bot

1. Go to an NSFW channel in your Discord server
2. Type `/` and you should see your bot's commands
3. Try `/ping` first to test basic functionality
4. Try `/random` to test content fetching
5. Try `/auto interval:120 api:redgifs` to test auto-posting

## Important Notes

- **This bot only works in NSFW channels** - make sure your channel is marked as 18+
- **Owner-only**: Only the Discord user ID in `BOT_OWNER_IDS` can use commands
- **Server-only**: The bot doesn't work in DMs
- **Keep your token secret**: Never share your `.env` file or bot token publicly

---

## Need Help?

If you're still stuck:
1. Check that all files are in the same folder
2. Verify your `.env` file has no extra spaces or typos
3. Make sure you've followed every step in order
4. Check the console output for specific error messages