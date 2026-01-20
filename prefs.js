// prefs.js
// User preferences storage and helpers

const fs = require('fs').promises;
const path = require('path');
const { log, errLog } = require('./utils');

const PREFS_FILE = path.join(__dirname, 'user-prefs.json');
const userPreferences = new Map();

async function loadUserPreferences() {
  try {
    const data = await fs.readFile(PREFS_FILE, 'utf8');
    const parsed = JSON.parse(data);
    Object.entries(parsed).forEach(([userId, prefs]) => {
      userPreferences.set(userId, prefs);
    });
    log('[prefs] Loaded', userPreferences.size, 'user preferences');
  } catch (err) {
    if (err.code !== 'ENOENT') {
      errLog('[prefs] Error loading preferences:', err);
    }
  }
}

async function saveUserPreferences() {
  try {
    const obj = {};
    userPreferences.forEach((prefs, userId) => {
      obj[userId] = prefs;
    });
    await fs.writeFile(PREFS_FILE, JSON.stringify(obj, null, 2));
    log('[prefs] Saved', userPreferences.size, 'user preferences');
  } catch (err) {
    errLog('[prefs] Error saving preferences:', err);
  }
}

function getUserPrefs(userId) {
  if (!userPreferences.has(userId)) {
    userPreferences.set(userId, {
      favoriteTags: [],
      blacklistedTags: []
    });
  }
  return userPreferences.get(userId);
}

module.exports = {
  PREFS_FILE,
  userPreferences,
  loadUserPreferences,
  saveUserPreferences,
  getUserPrefs,
};
