const express = require("express");
const { getRoom } = require("../controllers/roomController");

const router = express.Router();

router.get("/", getRoom);

module.exports = router;
