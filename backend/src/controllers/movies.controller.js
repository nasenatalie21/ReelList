const tmdb = require("../services/tmdb.service");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const page = (req) => Math.max(1, parseInt(req.query.page, 10) || 1);

exports.search = asyncHandler(async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) throw new ApiError(400, "Query parameter 'q' is required");
  res.json(await tmdb.search(q, page(req)));
});

exports.trending = asyncHandler(async (req, res) => res.json(await tmdb.trending()));
exports.popular = asyncHandler(async (req, res) => res.json(await tmdb.popular(page(req))));
exports.topRated = asyncHandler(async (req, res) => res.json(await tmdb.topRated(page(req))));
exports.nowPlaying = asyncHandler(async (req, res) => res.json(await tmdb.nowPlaying(page(req))));
exports.upcoming = asyncHandler(async (req, res) => res.json(await tmdb.upcoming(page(req))));
exports.details = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) throw new ApiError(400, "Invalid movie id");
  res.json(await tmdb.details(id));
});
