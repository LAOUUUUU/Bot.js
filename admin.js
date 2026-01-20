// admin.js
// Handles admin blacklist loading and checks
// admin.js
// Handles admin blacklist loading and checks


const { log, errLog } = require('./utils');
const { getUserPrefs } = require('./prefs'); // ADD THIS LINE
const adminBlacklist = new Set();

function loadAdminBlacklist() {
    const tags = (process.env.ADMIN_BLACKLISTED_TAGS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    tags.forEach(tag => adminBlacklist.add(tag));
    if (tags.length > 0) {
        log('[admin] Loaded', adminBlacklist.size, 'blacklisted tags');
    }
}

function isTagBlacklisted(tag, userId) {
    const lowerTag = (tag || '').toLowerCase().trim();

    if (adminBlacklist.has(lowerTag)) {
        return { blocked: true, reason: 'admin_blacklist' };
    }

    const prefs = getUserPrefs(userId);
    const tokens = lowerTag.split(/\s+/).filter(Boolean);
    const userBlacklist = new Set((prefs.blacklistedTags || []).map(t => String(t || '').toLowerCase().trim()).filter(Boolean));
    if (tokens.some(tok => userBlacklist.has(tok))) {
        return { blocked: true, reason: 'user_blacklist' };
    }

    return { blocked: false };
}

// For dispatcher: add/remove/list functions
function addAdminBlacklist(tag) {
    const lowerTag = tag.toLowerCase().trim();
    adminBlacklist.add(lowerTag);
    return true;
}

function removeAdminBlacklist(tag) {
    const lowerTag = tag.toLowerCase().trim();
    if (!adminBlacklist.has(lowerTag)) return false;
    adminBlacklist.delete(lowerTag);
    return true;
}

function listAdminBlacklist() {
    return Array.from(adminBlacklist);
}

module.exports = {
    adminBlacklist,
    loadAdminBlacklist,
    isTagBlacklisted,
    addAdminBlacklist,
    removeAdminBlacklist,
    listAdminBlacklist
};