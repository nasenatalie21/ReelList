const { Schema, model } = require("mongoose");

const itemSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tmdbMovieId: { type: Number, required: true },
    title: { type: String, required: true },
    posterPath: String,
    status: { type: String, enum: ["want", "watched"], default: "want" },
    rating: { type: Number, min: 1, max: 5 },
    notes: String,
  },
  { timestamps: true }
);

itemSchema.index({ user: 1, tmdbMovieId: 1 }, { unique: true });

module.exports = model("WatchlistItem", itemSchema);