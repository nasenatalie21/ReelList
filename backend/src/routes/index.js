const router = require("express").Router();

router.get("/health", (req, res) => res.json({ status: "ok" }));
router.use("/auth", require("./auth.routes"));
router.use("/movies", require("./movies.routes"));
router.use("/watchlist", require("./watchlist.routes"));

module.exports = router;
