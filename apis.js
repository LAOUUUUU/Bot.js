// apis.js
// Centralized API wrappers and ready-to-use instances

const axios = require('axios');
const { log, errLog } = require('./utils');


class XbooruAPI {
  constructor() {
    this.baseUrl = 'https://xbooru.com/index.php';
  }
  async searchPosts(tags, limit = 100) {
    try {
      const params = { page: 'dapi', s: 'post', q: 'index', json: 1, tags: tags, limit };
      log('[xbooru] searching with tags:', tags);
      const r = await axios.get(this.baseUrl, {
        params,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        timeout: 10000
      });
      let posts = [];
      if (Array.isArray(r.data)) posts = r.data;
      else if (r.data?.post) posts = r.data.post;
      if (!Array.isArray(posts)) return [];
      log('[xbooru] found', posts.length, 'posts');
      return posts.filter(p => p?.file_url).map(p => ({
        id: p.id,
        file_url: p.file_url,
        preview_url: p.preview_url || p.sample_url,
        sample_url: p.sample_url
      }));
    } catch (e) {
      errLog('[xbooru] error', e?.response?.status, e?.response?.data || e?.message || e);
      return [];
    }
  }
}

class Rule34PahealAPI {
  constructor() {
    this.baseUrl = 'https://rule34.paheal.net/api/danbooru/find_posts';
  }
  async searchPosts(tags, limit = 100) {
    try {
      const params = { tags: tags, limit: Math.min(limit, 100) };
      log('[rule34paheal] searching with tags:', tags);
      const r = await axios.get(this.baseUrl, {
        params,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        timeout: 10000
      });

      // Paheal returns XML, need to parse it
      const posts = [];
      const xmlData = r.data;

      // Simple XML parsing for post elements
      const postMatches = xmlData.match(/<post[^>]*>/g) || [];

      for (const postTag of postMatches) {
        const idMatch = postTag.match(/id="([^"]+)"/);
        const fileUrlMatch = postTag.match(/file_url="([^"]+)"/);
        const previewUrlMatch = postTag.match(/preview_url="([^"]+)"/);
        const sampleUrlMatch = postTag.match(/sample_url="([^"]+)"/);

        if (fileUrlMatch) {
          posts.push({
            id: idMatch ? idMatch[1] : 'unknown',
            file_url: fileUrlMatch[1].replace(/&amp;/g, '&'),
            preview_url: previewUrlMatch ? previewUrlMatch[1].replace(/&amp;/g, '&') : null,
            sample_url: sampleUrlMatch ? sampleUrlMatch[1].replace(/&amp;/g, '&') : null
          });
        }
      }

      log('[rule34paheal] found', posts.length, 'posts');
      return posts;
    } catch (e) {
      errLog('[rule34paheal] error', e?.response?.status, e?.response?.data || e?.message || e);
      return [];
    }
  }
}

class ATFBooruAPI {
  constructor() {
    this.baseUrl = 'https://booru.allthefallen.moe/posts.json';
  }
  async searchPosts(tags, limit = 100) {
    try {
      const params = { tags, limit: Math.min(limit, 100) };
      log('[atfbooru] searching with tags:', tags);
      const r = await axios.get(this.baseUrl, {
        params,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        timeout: 10000
      });
      const posts = r.data || [];
      log('[atfbooru] found', posts.length, 'posts');
      return posts.filter(p => p?.file_url).map(p => ({
        id: p.id,
        file_url: p.file_url,
        preview_url: p.preview_file_url || p.large_file_url,
        sample_url: p.large_file_url
      }));
    } catch (e) {
      errLog('[atfbooru] error', e?.response?.status, e?.response?.data || e?.message || e);
      return [];
    }
  }
}

class BehoimiAPI {
  constructor() {
    this.baseUrl = 'https://behoimi.org/post.json';
  }
  async searchPosts(tags, limit = 100) {
    try {
      const params = { tags, limit: Math.min(limit, 100) };
      log('[behoimi] searching with tags:', tags);
      const r = await axios.get(this.baseUrl, {
        params,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        timeout: 10000
      });
      const posts = r.data || [];
      log('[behoimi] found', posts.length, 'posts');
      return posts.filter(p => p?.file_url).map(p => ({
        id: p.id,
        file_url: p.file_url,
        preview_url: p.preview_url || p.sample_url,
        sample_url: p.sample_url
      }));
    } catch (e) {
      errLog('[behoimi] error', e?.response?.status, e?.response?.data || e?.message || e);
      return [];
    }
  }
}

class RedditAPI {
  constructor() {
    this.clientId = process.env.REDDIT_CLIENT_ID;
    this.clientSecret = process.env.REDDIT_CLIENT_SECRET;
    this.accessToken = null;
    this.tokenExpiry = 0;
  }

  async getAccessToken() {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    if (!this.clientId || !this.clientSecret) {
      errLog('[reddit] Missing CLIENT_ID or CLIENT_SECRET');
      return null;
    }

    try {
      const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      const r = await axios.post('https://www.reddit.com/api/v1/access_token',
          'grant_type=client_credentials',
          {
            headers: {
              'Authorization': `Basic ${auth}`,
              'Content-Type': 'application/x-www-form-urlencoded',
              'User-Agent': 'DiscordBot/1.0'
            }
          }
      );

      this.accessToken = r.data.access_token;
      this.tokenExpiry = Date.now() + (r.data.expires_in * 1000) - 60000; // 1 min buffer
      log('[reddit] got access token');
      return this.accessToken;
    } catch (e) {
      errLog('[reddit] token error', e?.response?.data || e?.message);
      return null;
    }
  }

  async searchPosts(subreddit = 'nsfw+gonewild', limit = 100) {
    const token = await this.getAccessToken();
    if (!token) return [];

    try {
      // Clean subreddit name (remove r/ if present)
      const cleanSub = subreddit.replace(/^r\//i, '');

      log('[reddit] searching r/', cleanSub);
      const r = await axios.get(`https://oauth.reddit.com/r/${cleanSub}/hot.json`, {
        params: { limit: Math.min(limit, 100) },
        headers: {
          'Authorization': `Bearer ${token}`,
          'User-Agent': 'DiscordBot/1.0'
        },
        timeout: 10000
      });

      const posts = r.data?.data?.children || [];
      const imagePosts = posts
          .filter(p => {
            const post = p.data;
            return post.url && (
                post.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ||
                post.url.includes('i.redd.it') ||
                post.url.includes('i.imgur.com')
            );
          })
          .map(p => ({
            id: p.data.id,
            file_url: p.data.url,
            preview_url: p.data.thumbnail !== 'default' ? p.data.thumbnail : null,
            sample_url: p.data.preview?.images?.[0]?.source?.url?.replace(/&amp;/g, '&')
          }));

      log('[reddit] found', imagePosts.length, 'image posts');
      return imagePosts;
    } catch (e) {
      errLog('[reddit] error', e?.response?.status, e?.response?.data || e?.message);
      return [];
    }
  }
}


class RedGifsAPI {
  constructor() { this.baseUrl = 'https://api.redgifs.com/v2'; this.token = null; }
  async getToken() {
    try {
      const r = await axios.get(`${this.baseUrl}/auth/temporary`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      });
      this.token = r.data.token;
      log('[redgifs] got token');
      return true;
    } catch (e) {
      errLog('[redgifs] token error', e?.response?.data || e?.message || e);
      return false;
    }
  }
  async searchGifs(query, count = 20) {
    if (!this.token && !(await this.getToken())) return [];
    try {
      const r = await axios.get(`${this.baseUrl}/gifs/search`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        params: { search_text: query, order: 'trending', count: Math.min(count, 80) }
      });
      return (r.data.gifs || []).map(g => ({
        id: g.id,
        file_url: g.urls?.hd || g.urls?.sd,
        preview_url: g.urls?.thumbnail || g.urls?.vthumbnail,
        sample_url: g.urls?.poster
      }));
    } catch (e) {
      errLog('[redgifs] search error', e?.response?.status || e?.message || e);
      if (e?.response?.status === 401) {
        this.token = null;
        return this.searchGifs(query, count);
      }
      return [];
    }
  }
}

class Rule34API {
  constructor() {
    this.baseUrl = 'https://api.rule34.xxx/index.php';
    this.apiKey = process.env.RULE34_API_KEY;
    this.userId = process.env.RULE34_USER_ID;
  }
  async searchPosts(tags, limit = 100) {
    try {
      const params = { page: 'dapi', s: 'post', q: 'index', json: 1, tags: tags, limit };
      if (this.apiKey) params.api_key = this.apiKey;
      if (this.userId) params.user_id = this.userId;

      log('[rule34] searching with tags:', tags);

      const r = await axios.get(this.baseUrl, {
        params,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        timeout: 10000
      });

      let posts = [];
      if (Array.isArray(r.data)) posts = r.data;
      else if (r.data?.post) posts = r.data.post;
      if (!Array.isArray(posts)) return [];

      log('[rule34] found', posts.length, 'posts');

      return posts.filter(p => p?.file_url).map(p => ({
        id: p.id,
        file_url: p.file_url,
        preview_url: p.preview_url || p.sample_url,
        sample_url: p.sample_url
      }));
    } catch (e) {
      errLog('[rule34] error', e?.response?.status, e?.response?.data || e?.message || e);
      return [];
    }
  }
}

class HypnoHubAPI {
  constructor() {
    this.baseUrl = 'https://hypnohub.net/index.php';
  }
  async searchPosts(tags, limit = 100) {
    try {
      const params = { page: 'dapi', s: 'post', q: 'index', json: 1, tags: tags, limit: Math.min(limit, 100) };

      log('[hypnohub] searching with tags:', tags);

      const r = await axios.get(this.baseUrl, {
        params,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        timeout: 10000
      });

      let posts = [];
      if (Array.isArray(r.data)) posts = r.data;
      else if (r.data?.post) posts = r.data.post;
      if (!Array.isArray(posts)) return [];

      log('[hypnohub] found', posts.length, 'posts');

      return posts.filter(p => p?.file_url).map(p => ({
        id: p.id,
        file_url: p.file_url,
        preview_url: p.preview_url || p.sample_url,
        sample_url: p.sample_url
      }));
    } catch (e) {
      errLog('[hypnohub] error', e?.response?.status, e?.response?.data || e?.message || e);
      if (e?.response?.status === 403) {
        errLog('[hypnohub] 403 - possible temporary block or rate limit');
      }
      return [];
    }
  }
}

class GelbooruAPI {
  constructor() {
    this.baseUrl = 'https://gelbooru.com/index.php';
    this.apiKey = process.env.GELBOORU_API_KEY;
    this.userId = process.env.GELBOORU_USER_ID;
  }
  async searchPosts(tags, limit = 100) {
    try {
      const params = { page: 'dapi', s: 'post', q: 'index', json: 1, tags: tags, limit };
      if (this.apiKey) params.api_key = this.apiKey;
      if (this.userId) params.user_id = this.userId;

      log('[gelbooru] searching with tags:', tags);

      const r = await axios.get(this.baseUrl, {
        params,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        timeout: 10000
      });

      let posts = [];
      if (Array.isArray(r.data)) posts = r.data;
      else if (r.data?.post) posts = r.data.post;
      if (!Array.isArray(posts)) return [];

      log('[gelbooru] found', posts.length, 'posts');

      return posts.filter(p => p?.file_url).map(p => ({
        id: p.id,
        file_url: p.file_url,
        preview_url: p.preview_url || p.sample_url,
        sample_url: p.sample_url
      }));
    } catch (e) {
      errLog('[gelbooru] error', e?.response?.status, e?.response?.data || e?.message || e);
      return [];
    }
  }
}

class E621API {
  constructor() {
    this.baseUrl = 'https://e621.net';
    this.userAgent = process.env.E621_USER_AGENT || 'DiscordBot/1.0 (contact@example.com)';
  }
  async searchPosts(tags, limit = 100) {
    try {
      const cleanTags = tags.replace(/_/g, ' ').trim();
      const searchTags = cleanTags ? `${cleanTags} rating:e order:score` : 'rating:e order:score';

      const params = { tags: searchTags, limit: Math.min(limit, 320) };

      log('[e621] searching with tags:', params.tags);

      const r = await axios.get(`${this.baseUrl}/posts.json`, {
        params,
        headers: { 'User-Agent': this.userAgent },
        timeout: 10000
      });

      const posts = r.data?.posts || [];
      log('[e621] found', posts.length, 'posts');

      return posts.filter(p => p?.file?.url).map(p => ({
        id: p.id,
        file_url: p.file.url,
        preview_url: p.preview?.url || p.sample?.url,
        sample_url: p.sample?.url
      }));
    } catch (e) {
      errLog('[e621] error', e?.response?.status, e?.response?.data || e?.message || e);
      return [];
    }
  }
}

class RealbooruAPI {
  constructor() {
    this.baseUrl = 'https://realbooru.com/index.php';
  }
  async searchPosts(tags, limit = 100) {
    try {
      const params = { page: 'dapi', s: 'post', q: 'index', json: 1, tags: tags, limit };

      log('[realbooru] searching with tags:', tags);

      const r = await axios.get(this.baseUrl, {
        params,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        timeout: 10000
      });

      let posts = [];
      if (Array.isArray(r.data)) posts = r.data;
      else if (r.data?.post) posts = r.data.post;
      if (!Array.isArray(posts)) return [];

      log('[realbooru] found', posts.length, 'posts');

      return posts.filter(p => p?.file_url).map(p => ({
        id: p.id,
        file_url: p.file_url,
        preview_url: p.preview_url || p.sample_url,
        sample_url: p.sample_url
      }));
    } catch (e) {
      errLog('[realbooru] error', e?.response?.status, e?.response?.data || e?.message || e);
      return [];
    }
  }
}

class YandeReAPI {
  constructor() {
    this.baseUrl = 'https://yande.re/post.json';
  }
  async searchPosts(tags, limit = 100) {
    try {
      const params = { tags, limit };
      log('[yandere] searching with tags:', tags);
      const r = await axios.get(this.baseUrl, {
        params,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        timeout: 10000
      });
      const posts = r.data || [];
      log('[yandere] found', posts.length, 'posts');
      return posts.filter(p => p?.file_url).map(p => ({
        id: p.id,
        file_url: p.file_url,
        preview_url: p.preview_url || p.sample_url,
        sample_url: p.sample_url
      }));
    } catch (e) {
      errLog('[yandere] error', e?.response?.status, e?.response?.data || e?.message || e);
      return [];
    }
  }
}

class KonachanAPI {
  constructor() {
    this.baseUrl = 'https://konachan.com/post.json';
  }
  async searchPosts(tags, limit = 100) {
    try {
      const params = { tags, limit };
      log('[konachan] searching with tags:', tags);
      const r = await axios.get(this.baseUrl, {
        params,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        timeout: 10000
      });
      const posts = r.data || [];
      log('[konachan] found', posts.length, 'posts');
      return posts.filter(p => p?.file_url).map(p => ({
        id: p.id,
        file_url: p.file_url,
        preview_url: p.preview_url || p.sample_url,
        sample_url: p.sample_url
      }));
    } catch (e) {
      errLog('[konachan] error', e?.response?.status, e?.response?.data || e?.message || e);
      return [];
    }
  }
}

class DanbooruAPI {
  constructor() {
    this.baseUrl = 'https://danbooru.donmai.us/posts.json';
    this.apiKey = process.env.DANBOORU_API_KEY;
    this.userId = process.env.DANBOORU_USER_ID;
  }
  async searchPosts(tags, limit = 100) {
    try {
      const params = { tags, limit };
      if (this.apiKey && this.userId) {
        params.login = this.userId;
        params.api_key = this.apiKey;
      }
      log('[danbooru] searching with tags:', tags);
      const r = await axios.get(this.baseUrl, {
        params,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        timeout: 10000
      });
      const posts = r.data || [];
      log('[danbooru] found', posts.length, 'posts');
      return posts.filter(p => p?.file_url).map(p => ({
        id: p.id,
        file_url: p.file_url,
        preview_url: p.preview_file_url || p.large_file_url,
        sample_url: p.large_file_url
      }));
    } catch (e) {
      errLog('[danbooru] error', e?.response?.status, e?.response?.data || e?.message || e);
      return [];
    }
  }
}

const redgifs = new RedGifsAPI();
const rule34 = new Rule34API();
const gelbooru = new GelbooruAPI();
const e621 = new E621API();
const realbooru = new RealbooruAPI();
const hypnohub = new HypnoHubAPI();
const yandere = new YandeReAPI();
const konachan = new KonachanAPI();
const danbooru = new DanbooruAPI();
const xbooru = new XbooruAPI();
const rule34paheal = new Rule34PahealAPI();
const atfbooru = new ATFBooruAPI();
const behoimi = new BehoimiAPI();
const reddit = new RedditAPI();

module.exports = {
  // Classes
  RedGifsAPI,
  Rule34API,
  HypnoHubAPI,
  GelbooruAPI,
  E621API,
  RealbooruAPI,
  YandeReAPI,
  KonachanAPI,
  DanbooruAPI,
  XbooruAPI,
  Rule34PahealAPI,
  ATFBooruAPI,
  BehoimiAPI,
  RedditAPI,
  // Instances
  redgifs,
  rule34,
  gelbooru,
  e621,
  realbooru,
  hypnohub,
  yandere,
  konachan,
  danbooru,
  xbooru,
  rule34paheal,
  atfbooru,
  behoimi,
  reddit,
};
