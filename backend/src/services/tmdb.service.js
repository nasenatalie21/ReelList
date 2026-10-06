const axios = require("axios");
const cache = require("../utils/cache");
const { TMDB_API_KEY, TMDB_BASE_URL } = require("../config/env");

const client = axios.create({
  baseURL: TMDB_BASE_URL,
  params: { api_key: TMDB_API_KEY },
  timeout: 10000,
});

async function cachedGet(path, params = {}, ttl = 600) {
  const key = `${path}:${JSON.stringify(params)}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const { data } = await client.get(path, { params });
  cache.set(key, data, ttl);
  return data;
}

exports.search = (query, page = 1) =>
  cachedGet("/search/movie", { query, page, include_adult: false });

exports.trending = () => cachedGet("/trending/movie/week");
exports.popular = (page = 1) => cachedGet("/movie/popular", { page });
exports.topRated = (page = 1) => cachedGet("/movie/top_rated", { page });
exports.nowPlaying = (page = 1) => cachedGet("/movie/now_playing", { page });
exports.upcoming = (page = 1) => cachedGet("/movie/upcoming", { page });
exports.details = (id) =>cachedGet(`/movie/${id}`);
