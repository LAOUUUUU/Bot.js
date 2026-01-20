// apis.js
// Centralized API wrappers and ready-to-use instances

const axios = require('axios');
const { log, errLog } = require('./utils');

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
};
