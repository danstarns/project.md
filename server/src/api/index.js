const { Router } = require("express");
const invite = require("./invite/index.js");

const router = Router();
router.use("/invite", invite);

module.exports = router;
