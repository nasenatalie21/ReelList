const router = require("express").Router();
const ctrl = require("../controllers/movies.controller");

router.get("/search", ctrl.search);
router.get("/trending", ctrl.trending);
router.get("/popular", ctrl.popular);
router.get("/top-rated", ctrl.topRated);
router.get("/now-playing", ctrl.nowPlaying);
router.get("/upcoming", ctrl.upcoming);
router.get("/:id", ctrl.details);

module.exports = router;
