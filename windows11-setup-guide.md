# Discord NSFW Bot - Complete Windows 11 Setup Guide

## 🎯 What You'll Need
- Windows 11 computer
- Discord account
- Internet connection
- 30 minutes of time
- Admin access to your computer

---

## 📋 Step-by-Step Setup (EXACT INSTRUCTIONS)

### PART 1: Install Node.js

#### Step 1.1: Download Node.js
1. Open your web browser (Chrome, Edge, Firefox, etc.)
2. Go to: **https://nodejs.org/**
3. You'll see two big green buttons
4. Click the **LEFT button** that says "LTS" (Long Term Support)
   - Example: "20.11.0 LTS" or similar version
5. The download will start automatically
   - File will be named something like `node-v20.11.0-x64.msi`
   - Should be around 30-50 MB
6. Wait for download to complete (check your Downloads folder)

#### Step 1.2: Install Node.js
1. Go to your **Downloads** folder
2. Find the file you just downloaded (starts with `node-v`)
3. **Double-click** the file
4. Windows will ask "Do you want to allow this app to make changes?" 
   - Click **YES**

5. **Node.js Setup Wizard will open**:
   - Screen 1: Click **Next**
   - Screen 2: Check "I accept the terms" → Click **Next**
   - Screen 3: (Install location) → Leave as default → Click **Next**
   - Screen 4: (Custom Setup) → **IMPORTANT: Don't change anything** → Click **Next**
   - Screen 5: (Tools for Native Modules) → **Leave unchecked** → Click **Next**
   - Screen 6: Click **Install**
   
6. Wait for installation (green progress bar)
7. When done, click **Finish**

#### Step 1.3: Verify Node.js Installation
1. Press **Windows Key** (⊞) on your keyboard
2. Type: `cmd`
3. Press **Enter** (Command Prompt will open - black window)
4. Type this EXACTLY and press Enter:
   ```
   node --version
   ```
5. You should see something like: `v20.11.0`
6. Now type this and press Enter:
   ```
   npm --version
   ```
7. You should see something like: `10.2.4`

**✅ If you see version numbers, Node.js is installed correctly!**

**❌ If you get "not recognized" error:**
- Close Command Prompt
- Restart your computer
- Try Step 1.3 again

---

### PART 2: Download Bot Files

#### Step 2.1: Create Bot Folder
1. Open **File Explorer** (yellow folder icon on taskbar, OR press Windows Key + E)
2. Click on **Documents** on the left side
3. Right-click in empty space → **New** → **Folder**
4. Name it: `discord-bot` (exactly like this, all lowercase)
5. **Double-click** to open this folder

#### Step 2.2: Save All Bot Files
You need to save these files in your `discord-bot` folder:

**Required Files** (you should have all of these):
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

**How to save them:**
1. If you downloaded as a ZIP:
   - Right-click the ZIP file → **Extract All**
   - Choose your `discord-bot` folder
   - Click **Extract**

2. If you have individual files:
   - Copy all files into your `discord-bot` folder
   - Make sure they're in the folder, NOT in a subfolder

**Check you did it right:**
- Open your `discord-bot` folder
- You should see 12 files directly in this folder
- NOT in another folder inside this folder

---

### PART 3: Install Bot Dependencies

#### Step 3.1: Open Command Prompt in Bot Folder
**Method 1 (Easiest):**
1. Open File Explorer
2. Go to your `discord-bot` folder (Documents → discord-bot)
3. Click in the **address bar** at the top (where it shows the path)
4. The text will turn blue
5. Type: `cmd` (it will replace the blue text)
6. Press **Enter**
7. Command Prompt opens **in your bot folder**

**Method 2 (Alternative):**
1. Open Command Prompt (Windows Key, type `cmd`, press Enter)
2. Type this EXACTLY:
   ```
   cd Documents\discord-bot
   ```
3. Press Enter

**You'll know you're in the right place when you see:**
```
C:\Users\YourName\Documents\discord-bot>
```

#### Step 3.2: Install Packages
1. In the Command Prompt, type this EXACTLY:
   ```
   npm install
   ```
2. Press **Enter**
3. You'll see lots of text scrolling (this is normal!)
4. Wait for it to finish (can take 1-3 minutes)
5. When done, you'll see something like:
   ```
   added 50 packages in 45s
   ```

**✅ Success signs:**
- No red "ERROR" messages
- Created a folder called `node_modules` in your bot folder
- Shows "added X packages"

**❌ If you get errors:**
- Make sure you're in the bot folder (see Step 3.1)
- Make sure all files are in the folder
- Try running Command Prompt as Administrator:
  - Windows Key → type `cmd`
  - Right-click "Command Prompt" → **Run as administrator**
  - Navigate to folder again and retry

---

### PART 4: Get Discord Bot Token

#### Step 4.1: Create Discord Application
1. Go to: **https://discord.com/developers/applications**
2. Log in with your Discord account if needed
3. Click the blue **"New Application"** button (top right)
4. Enter a name for your bot (example: "My NSFW Bot")
5. Check the box "I agree to Discord's Terms"
6. Click **Create**

#### Step 4.2: Get Your Bot Token
1. On the left sidebar, click **"Bot"**
2. Click the blue **"Reset Token"** button
3. Discord will ask "Are you sure?" → Click **"Yes, do it!"**
4. You'll see a long string of letters/numbers (this is your token)
5. Click **"Copy"** button
6. **SAVE THIS TOKEN** - Open Notepad and paste it there temporarily
   - **⚠️ NEVER SHARE THIS TOKEN WITH ANYONE**
   - If someone gets your token, they control your bot

#### Step 4.3: Get Client ID
1. On the left sidebar, click **"General Information"**
2. Under "Application ID", you'll see a long number
3. Click **"Copy"**
4. Save this in Notepad too (label it "Client ID")

#### Step 4.4: Get Your Discord User ID
1. Open **Discord** (the app or website)
2. Click the **⚙️ Settings** icon (bottom left, next to your username)
3. Scroll down to **"Advanced"** (under "App Settings")
4. Turn ON **"Developer Mode"**
5. Click **ESC** to close settings
6. Right-click **your own username** anywhere in Discord
7. Click **"Copy User ID"**
8. Save this in Notepad too (label it "User ID")

#### Step 4.5: Get Server ID
1. In Discord, find the server where you want to use the bot
2. Right-click the **server name** (top left)
3. Click **"Copy Server ID"**
4. Save this in Notepad too (label it "Server ID")

**Your Notepad should now have:**
```
Bot Token: MTIzNDU2Nzg5MDEyMzQ1Njc4OQ.GH3kL9.a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9
Client ID: 1234567890123456789
User ID: 987654321098765432
Server ID: 1122334455667788990
```

---

### PART 5: Create .env File

#### Step 5.1: Create the File
1. Open **Notepad** (Windows Key → type "notepad" → Enter)
2. Copy and paste this EXACT text:

```env
DISCORD_BOT_TOKEN=PUT_YOUR_BOT_TOKEN_HERE
CLIENT_ID=PUT_YOUR_CLIENT_ID_HERE
BOT_OWNER_IDS=PUT_YOUR_USER_ID_HERE
GUILD_IDS=PUT_YOUR_SERVER_ID_HERE
REGISTER_COMMANDS=true

# Optional API Keys (leave blank for now)
RULE34_API_KEY=
RULE34_USER_ID=
GELBOORU_API_KEY=
GELBOORU_USER_ID=
DANBOORU_API_KEY=
DANBOORU_USER_ID=
E621_USER_AGENT=DiscordBot/1.0 (your_email@example.com)

# Reddit API (optional)
REDDIT_CLIENT_ID=
REDDIT_CLIENT_SECRET=

# Admin blacklist
ADMIN_BLACKLISTED_TAGS=

# Memory settings
RECENT_HISTORY_SIZE=200
MAX_CHANNELS_IN_MEMORY=100
MAX_CONSECUTIVE_FAILURES=5
```

#### Step 5.2: Fill in Your Information
Replace these parts with your actual values from Notepad:

**Example BEFORE:**
```
DISCORD_BOT_TOKEN=PUT_YOUR_BOT_TOKEN_HERE
```

**Example AFTER:**
```
DISCORD_BOT_TOKEN=MTIzNDU2Nzg5MDEyMzQ1Njc4OQ.GH3kL9.a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9
```

Do this for all 4 lines:
- `DISCORD_BOT_TOKEN=`
- `CLIENT_ID=`
- `BOT_OWNER_IDS=`
- `GUILD_IDS=`

#### Step 5.3: Save the .env File
**THIS IS TRICKY - FOLLOW EXACTLY:**

1. In Notepad, click **File** → **Save As**
2. A save window opens
3. **Navigate to your discord-bot folder** (Documents → discord-bot)
4. In the "File name" box, type EXACTLY (with quotes):
   ```
   ".env"
   ```
   **IMPORTANT: Include the quotes!**
5. In "Save as type" dropdown, select **"All Files (*.*)"**
6. Click **Save**

**Check you did it right:**
1. Open File Explorer → Documents → discord-bot
2. You should see a file called `.env` (no .txt at the end)
3. If you see `.env.txt`, you did it wrong - try again with quotes

**Common mistakes:**
- ❌ Saved as `env` without the dot
- ❌ Saved as `.env.txt` 
- ✅ Correct: `.env` (just this, nothing else)

---

### PART 6: Invite Bot to Your Server

#### Step 6.1: Set Bot Permissions
1. Go back to: **https://discord.com/developers/applications**
2. Click your application
3. Click **"Bot"** on the left sidebar
4. Scroll down to **"Privileged Gateway Intents"**
5. Turn ON these switches:
   - ❌ Presence Intent (leave OFF)
   - ❌ Server Members Intent (leave OFF)
   - ❌ Message Content Intent (leave OFF)
   - (You don't need any of these for this bot)

#### Step 6.2: Generate Invite Link
1. On the left sidebar, click **"OAuth2"** → **"URL Generator"**
2. Under **"Scopes"**, check these boxes:
   - ✅ `bot`
   - ✅ `applications.commands`
3. Under **"Bot Permissions"**, check these boxes:
   - ✅ Send Messages
   - ✅ Embed Links
   - ✅ Attach Files
   - ✅ Read Message History
   - ✅ Use Slash Commands
4. Scroll to the bottom
5. You'll see a **"Generated URL"** - click **"Copy"**

#### Step 6.3: Add Bot to Server
1. Open a new browser tab
2. Paste the URL you copied
3. Press Enter
4. Select your server from the dropdown
5. Click **"Continue"**
6. Click **"Authorize"**
7. Complete the "I'm human" check if it appears
8. You should see "Success!"

**Check it worked:**
- Go to your Discord server
- You should see your bot in the member list (right side)
- It will show as "Offline" (gray dot) - this is normal, we haven't started it yet

---

### PART 7: Make an NSFW Channel

Your bot ONLY works in NSFW (18+) channels.

#### Step 7.1: Create NSFW Channel
1. In your Discord server, right-click any empty space in the channel list
2. Click **"Create Channel"**
3. Choose **"Text Channel"**
4. Name it something like: `nsfw-bot-test`
5. Click **"Next"**
6. **IMPORTANT:** Turn ON the toggle for **"Age-Restricted Channel (NSFW)"**
   - It should show a warning symbol ⚠️
7. Click **"Create Channel"**

**Or make existing channel NSFW:**
1. Right-click the channel name
2. Click **"Edit Channel"**
3. Go to **"Overview"**
4. Scroll down
5. Turn ON **"Age-Restricted Channel"**
6. Click **"Save Changes"**

---

### PART 8: Run the Bot (First Time)

#### Step 8.1: Start the Bot
1. Open Command Prompt in your bot folder (see Part 3 Step 3.1)
2. Type this EXACTLY:
   ```
   node bot.js
   ```
3. Press **Enter**

#### Step 8.2: What You Should See
The bot will start and show messages like this:

```
2025-01-22T10:30:45.123Z Registering commands to guilds: [ '1122334455667788990' ]
2025-01-22T10:30:46.456Z Registered commands to 1122334455667788990
2025-01-22T10:30:46.789Z ✅ Command registration complete.
2025-01-22T10:30:47.012Z ✅ Logged in as MyBot#1234
2025-01-22T10:30:47.345Z ✅ Configuration validated
2025-01-22T10:30:47.678Z [prefs] Loaded 0 user preferences
```

**✅ Success signs:**
- Green checkmarks (✅)
- "Logged in as [YourBotName]"
- "Configuration validated"
- No red errors
- Bot shows "Online" (green dot) in Discord

**❌ Common errors and fixes:**

**"Invalid Token" error:**
- Your bot token in `.env` is wrong
- Go back to Discord Developer Portal
- Reset your token (Part 4 Step 4.2)
- Update `.env` with new token
- Try again

**"Cannot find module" error:**
- You didn't run `npm install`
- Or you're in the wrong folder
- Go back to Part 3 and do it again

**"ENOENT: no such file or directory, open '.env'":**
- Your `.env` file is missing or named wrong
- Go back to Part 5 and create it properly
- Make sure it's in the discord-bot folder
- Make sure it's named `.env` not `.env.txt`

#### Step 8.3: Test the Bot
**LEAVE COMMAND PROMPT OPEN** (bot must be running!)

1. Go to your Discord server
2. Go to your NSFW channel
3. Type: `/` (forward slash)
4. You should see a list of your bot's commands pop up
5. Click `/ping` or type `/ping` and press Enter
6. Bot should respond: "🏓 pong"

**✅ IT WORKS! Your bot is running!**

---

### PART 9: Stop and Configure for Normal Use

#### Step 9.1: Stop the Bot
1. Go to the Command Prompt window (where the bot is running)
2. Press **Ctrl + C** on your keyboard
3. Bot will stop
4. Bot shows "Offline" in Discord again

#### Step 9.2: Change REGISTER_COMMANDS Setting
We only need to register commands once. Now we turn it off:

1. Open your `.env` file (in discord-bot folder)
2. Find this line:
   ```
   REGISTER_COMMANDS=true
   ```
3. Change it to:
   ```
   REGISTER_COMMANDS=false
   ```
4. Save the file (Ctrl + S)

**Why?**
- First time: `true` (registers slash commands in Discord)
- After that: `false` (faster startup, no need to re-register)

---

### PART 10: Run Bot Normally

Now you can run your bot anytime:

#### Option A: Manual Start (Simple)
1. Open Command Prompt in bot folder
2. Type: `node bot.js`
3. Press Enter
4. Bot runs until you close Command Prompt

**To stop:**
- Press Ctrl + C in Command Prompt
- Or close the Command Prompt window

#### Option B: Keep Running in Background (Advanced)
If you want the bot to run even when you close Command Prompt:

**Install PM2:**
1. Open Command Prompt as Administrator
2. Type: `npm install -g pm2`
3. Press Enter
4. Wait for installation

**Start bot with PM2:**
1. Navigate to bot folder
2. Type: `pm2 start bot.js --name discord-bot`
3. Bot runs in background

**Useful PM2 commands:**
```bash
pm2 list              # See running bots
pm2 stop discord-bot  # Stop the bot
pm2 restart discord-bot # Restart the bot
pm2 logs discord-bot  # See bot logs
pm2 delete discord-bot # Remove from PM2
```

---

## 🎮 Using Your Bot

### Basic Commands

Try these in your NSFW channel:

**Test bot:**
```
/ping
```

**See bot stats:**
```
/status
```

**Get random content:**
```
/random
```

**Search specific content:**
```
/nsfw search:blonde
/rule34 tags:1girl blonde_hair
/e621 tags:fox anthro
```

**Auto-post every 2 minutes:**
```
/auto interval:120 api:redgifs tag:blonde
```

**Stop auto-posting:**
```
/stop
```

**Add favorite tags:**
```
/favorite add tag:futa
/favorite add tag:catgirl
/random tag:favorite
```

**Blacklist unwanted tags:**
```
/blacklist add tag:gore
/blacklist add tag:scat
```

---

## ❌ Troubleshooting Common Windows 11 Issues

### Issue: "node is not recognized"
**Solution:**
1. Restart your computer
2. Open Command Prompt again
3. Try `node --version`
4. If still broken, reinstall Node.js (Part 1)

### Issue: Can't create .env file
**Solution:**
1. Make sure you typed `".env"` with quotes
2. Make sure you selected "All Files" when saving
3. Or download Notepad++ (free) and use that instead

### Issue: Bot won't start - "Error: Cannot find module"
**Solution:**
1. Open Command Prompt in bot folder
2. Delete `node_modules` folder
3. Run `npm install` again
4. Try starting bot again

### Issue: Commands don't show up in Discord
**Solution:**
1. Make sure `.env` has `REGISTER_COMMANDS=true`
2. Start bot once
3. Wait 5-10 minutes
4. Try typing `/` in Discord
5. If still nothing, kick bot from server and re-invite

### Issue: "Missing Access" when using commands
**Solution:**
1. Make sure channel is marked NSFW (18+)
2. Make sure bot has permissions (Part 6)
3. Try in a different channel

### Issue: Windows Defender blocks the bot
**Solution:**
1. This is rare but can happen
2. Open Windows Security
3. Go to Virus & threat protection
4. Click "Manage settings"
5. Add an exclusion for your discord-bot folder

### Issue: Can't find Command Prompt in bot folder
**Solution (Alternative method):**
1. Open Command Prompt normally
2. Type: `cd C:\Users\YourName\Documents\discord-bot`
3. Replace `YourName` with your actual Windows username
4. Press Enter

---

## 🔒 Security Reminders

### Keep Your Token Secret
**NEVER share your:**
- `.env` file
- Bot token
- Screenshots showing your token

**If token leaks:**
1. Go to Discord Developer Portal
2. Click your application → Bot
3. Click "Reset Token"
4. Update `.env` with new token
5. Restart bot

### Backup Your Files
**Important files to backup:**
- `.env` (your settings)
- `user-prefs.json` (your favorites/blacklists)

**Copy these to:**
- USB drive
- Cloud storage (Google Drive, OneDrive)
- Email them to yourself

---

## 📊 System Requirements

**Minimum:**
- Windows 11 (any version)
- 4 GB RAM
- 500 MB free disk space
- Internet connection

**Recommended:**
- 8 GB RAM
- 1 GB free disk space
- Stable internet (for 24/7 running)

---

## 🆘 Quick Help

**Bot won't start?**
1. Check `.env` file exists in bot folder
2. Check all values in `.env` are filled in
3. Run `npm install` again
4. Read error message carefully

**Commands not working?**
1. Make sure channel is NSFW
2. Make sure you're the bot owner
3. Try `/ping` first
4. Check bot is online (green dot)

**No content showing?**
1. Check internet connection
2. Try different tag
3. Try different API
4. Some APIs might be down temporarily

---

## ✅ Success Checklist

Before asking for help, check:
- [ ] Node.js installed (`node --version` works)
- [ ] All bot files in discord-bot folder
- [ ] Ran `npm install` successfully
- [ ] `.env` file created properly (named `.env` not `.env.txt`)
- [ ] All 4 IDs filled in `.env` (token, client ID, user ID, guild ID)
- [ ] Bot invited to server with correct permissions
- [ ] NSFW channel created
- [ ] `REGISTER_COMMANDS=true` for first run
- [ ] Bot starts without errors
- [ ] Bot shows "Online" in Discord
- [ ] `/ping` command works

If ALL checked and still broken:
- Copy the error message from Command Prompt
- Note exactly what step fails
- Ask for help with specific details

---

## 🎉 You're Done!

Your Discord NSFW bot should now be fully working on Windows 11!

**Enjoy your bot! Remember:**
- Keep it in NSFW channels only
- Use responsibly (18+ only)
- Don't share your token
- Have fun!

---

*Last updated: January 2025*
*For Windows 11 22H2 and later*