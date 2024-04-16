const express = require("express");
const { getStatus } = require("../controllers/defaultController");

const router = express.Router();

router.get("/", getStatus);

module.exports = router;
