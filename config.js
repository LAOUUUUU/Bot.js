// config.js
// Handles environment config loading and validation

require('dotenv').config();

const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const BOT_OWNER_IDS = (process.env.BOT_OWNER_IDS || '').split(',').map(s => s.trim()).filter(Boolean);
const ownerIds = new Set(BOT_OWNER_IDS);

const RECENT_HISTORY_SIZE = Number(process.env.RECENT_HISTORY_SIZE) || 200;
const MAX_CHANNELS_IN_MEMORY = Number(process.env.MAX_CHANNELS_IN_MEMORY) || 100;
const MAX_CONSECUTIVE_FAILURES = Number(process.env.MAX_CONSECUTIVE_FAILURES) || 5;

const OWNER_MIN_INTERVAL = 30;
const REGULAR_MIN_INTERVAL = 65;
const MAX_INTERVAL = 300;
const DEFAULT_REDGIFS_COUNT = 50;
const DEFAULT_BOORU_COUNT = 100;

function validateConfig() {
    const required = ['DISCORD_BOT_TOKEN', 'CLIENT_ID', 'BOT_OWNER_IDS'];
    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        errLog('❌ Missing required environment variables:', missing.join(', '));
        process.exit(1);
    }

    // Validate owner IDs are valid snowflakes
    for (const id of BOT_OWNER_IDS) {
        if (!/^\d{17,19}$/.test(id)) {
            errLog('❌ Invalid owner ID format:', id);
            process.exit(1);
        }
    }

    log('✅ Configuration validated');
}

function getMinInterval(userId) {
    return ownerIds.has(userId) ? OWNER_MIN_INTERVAL : REGULAR_MIN_INTERVAL;
}

function validateInterval(userId, intervalSeconds) {
    const minInterval = getMinInterval(userId);
    if (intervalSeconds < minInterval) {
        return { valid: false, min: minInterval, max: MAX_INTERVAL };
    }
    if (intervalSeconds > MAX_INTERVAL) {
        return { valid: false, min: minInterval, max: MAX_INTERVAL };
    }
    return { valid: true, min: minInterval, max: MAX_INTERVAL };
}

module.exports = {
    DISCORD_TOKEN,
    CLIENT_ID,
    BOT_OWNER_IDS,
    ownerIds,
    RECENT_HISTORY_SIZE,
    MAX_CHANNELS_IN_MEMORY,
    MAX_CONSECUTIVE_FAILURES,
    OWNER_MIN_INTERVAL,
    REGULAR_MIN_INTERVAL,
    MAX_INTERVAL,
    DEFAULT_REDGIFS_COUNT,
    DEFAULT_BOORU_COUNT,
    validateConfig,
    getMinInterval,
    validateInterval
};