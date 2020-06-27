const { Router } = require("express");
const organization = require("./organization.js");

const router = Router();

router.get("/organization", organization.get);
router.post("/organization/:code", organization.post);

module.exports = router;
