const router = require("express").Router();
const ctrl = require("../controllers/watchlist.controller");
const { required } = require("../middleware/auth.middleware");

router.use(required);

router.get("/", ctrl.list);
router.post("/", ctrl.add);
router.patch("/:movieId", ctrl.update);
router.delete("/:movieId", ctrl.remove);

module.exports = router;
