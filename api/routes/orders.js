const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");

const Controller = require('../controllers/orders');

router.get("/", checkAuth, Controller.getAll);
router.get("/:order", Controller.getOne);

router.post("/", checkAuth, Controller.create);

router.patch("/:order", Controller.patch);

router.delete("/:order", checkAuth, Controller.delete);

module.exports = router;