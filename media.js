// media.js
// Smart media handler for sending content to Discord channels

const axios = require('axios');
const { EmbedBuilder } = require('discord.js');
const { log, errLog } = require('./utils');

async function sendMediaSmart(p, channel, title) {
  if (!p?.file_url) {
    log('[media] no file_url provided');
    return;
  }

  const url = p.file_url.toLowerCase();
  log('[media] processing:', url.substring(0, 100));

  const isVideo = url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov') ||
      url.endsWith('.mkv') || url.endsWith('.avi') || url.endsWith('.gif');

  let sizeMB = 0;
  try {
    const head = await axios.head(p.file_url, { timeout: 5000 });
    const contentLength = head.headers['content-length'];
    if (contentLength) {
      sizeMB = contentLength / (1024 * 1024);
      log('[media] size:', sizeMB.toFixed(2), 'MB');
    }
  } catch (e) {
    log('[media] HEAD request failed:', e.message);
  }

  if (isVideo || sizeMB > 25) {
    log('[media] sending as link (video or >25MB)');
    return channel.send({ content: p.file_url });
  }

  const embed = new EmbedBuilder()
      .setColor(0xFF69B4)
      .setTitle(title || 'Result')
      .setImage(p.file_url)
      .setFooter({ text: `ID: ${p.id || 'N/A'}` });

  //if (p.preview_url) {
    //embed.setThumbnail(p.preview_url);
  //log('[media] using preview_url as thumbnail');
  // } else if (p.sample_url) {
  //  embed.setThumbnail(p.sample_url);
  //  log('[media] using sample_url as fallback thumbnail');
  // } else {
  //   log('[media] no preview available');
  // }

  try {
    return await channel.send({ embeds: [embed] });
  } catch (e) {
    errLog('[media] embed send failed, falling back to link:', e.message);
    return channel.send({ content: p.file_url });
  }
}

module.exports = { sendMediaSmart };
