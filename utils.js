// utils.js
// Centralized utilities shared across the bot
// admin.js
// Handles admin blacklist loading and checks

const {MAX_CHANNELS_IN_MEMORY, RECENT_HISTORY_SIZE} = require("./config");
const log = (...args) => console.log(new Date().toISOString(), ...args);
const errLog = (...args) => console.error(new Date().toISOString(), ...args);
const API_POOL = ['redgifs', 'rule34', 'gelbooru', 'e621', 'realbooru', 'hypnohub', 'yandere', 'konachan', 'danbooru'];
const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp'];
const VIDEO_EXTS = ['.mp4', '.webm', '.mov'];
const recentGifs = new Map();

function getRandomGif(items, channelId,recentGifs) {
    if (!items?.length) return null;

    if (!recentGifs.has(channelId)) {
        if (recentGifs.size >= MAX_CHANNELS_IN_MEMORY) {
            const firstKey = recentGifs.keys().next().value;
            recentGifs.delete(firstKey);
            log('[memory] evicted recent history for channel', firstKey);
        }
        recentGifs.set(channelId, []);
    }

    const recent = recentGifs.get(channelId);

    let available = items.filter(item => {
        const id = item.id ? String(item.id) : null;
        const url = item.file_url ? String(item.file_url) : null;
        const previewUrl = item.preview_url ? String(item.preview_url) : null;

        if (id && recent.includes(id)) return false;
        if (url && recent.includes(url)) return false;
        if (previewUrl && recent.includes(previewUrl)) return false;

        return true;
    });

    if (available.length === 0) {
        if (recent.length > items.length / 2) {
            const keepAmount = Math.floor(recent.length / 2);
            recent.splice(0, recent.length - keepAmount);
            log('[memory] partial clear - kept last', keepAmount, 'items for channel', channelId);

            available = items.filter(item => {
                const id = item.id ? String(item.id) : null;
                const url = item.file_url ? String(item.file_url) : null;
                const previewUrl = item.preview_url ? String(item.preview_url) : null;

                if (id && recent.includes(id)) return false;
                if (url && recent.includes(url)) return false;
                if (previewUrl && recent.includes(previewUrl)) return false;

                return true;
            });
        }

        if (available.length === 0) {
            available = items;
            recent.length = 0;
            log('[memory] full clear for channel', channelId);
        }
    }

    if (available.length === 0) return null;

    const chosen = available[Math.floor(Math.random() * available.length)];

    if (chosen.id) recent.push(String(chosen.id));
    if (chosen.file_url) recent.push(String(chosen.file_url));

    while (recent.length > RECENT_HISTORY_SIZE) {
        recent.shift();
    }

    return chosen;
}

function isChannelNSFW(channel) {
    if (!channel) return false;
    try {
        if (typeof channel.isThread === 'function' && channel.isThread()) {
            return channel.parent?.nsfw === true;
        }
        return channel.nsfw === true;
    } catch (e) {
        errLog('[isChannelNSFW] error', e);
        return false;
    }
}

module.exports = {
    log,
    errLog,
    API_POOL,
    IMAGE_EXTS,
    VIDEO_EXTS,
    getRandomGif,
    isChannelNSFW,
    recentGifs
};
