const Item = require("../models/WatchlistItem");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const movieId = (req) => {
  const id = Number(req.params.movieId);
  if (!Number.isInteger(id) || id <= 0) throw new ApiError(400, "Invalid movie id");
  return id;
};

exports.list = asyncHandler(async (req, res) => {
  const filter = { user: req.user.id };
  if (req.query.status) filter.status = req.query.status;
  res.json(await Item.find(filter).sort({ createdAt: -1 }));
});

exports.add = asyncHandler(async (req, res) => {
  const { tmdbMovieId, title, posterPath } = req.body;
  if (!Number.isInteger(tmdbMovieId) || !title)
    throw new ApiError(400, "tmdbMovieId (number) and title are required");

  try {
    const item = await Item.create({
      user: req.user.id,
      tmdbMovieId,
      title,
      posterPath,
    });
    res.status(201).json(item);
  } catch (err) {
    if (err.code === 11000) throw new ApiError(409, "Already in your watchlist");
    throw err;
  }
});

exports.update = asyncHandler(async (req, res) => {
  const { status, rating, notes } = req.body;
  const changes = {};
  if (status !== undefined) changes.status = status;
  if (rating !== undefined) changes.rating = rating;
  if (notes !== undefined) changes.notes = notes;

  if (!Object.keys(changes).length)
    throw new ApiError(400, "Provide status, rating, or notes to update");

  const item = await Item.findOneAndUpdate(
    { user: req.user.id, tmdbMovieId: movieId(req) },
    { $set: changes },
    { new: true, runValidators: true }
  );
  if (!item) throw new ApiError(404, "Item not found");
  res.json(item);
});

exports.remove = asyncHandler(async (req, res) => {
  const result = await Item.deleteOne({ user: req.user.id, tmdbMovieId: movieId(req) });
  if (!result.deletedCount) throw new ApiError(404, "Item not found");
  res.status(204).end();
});
