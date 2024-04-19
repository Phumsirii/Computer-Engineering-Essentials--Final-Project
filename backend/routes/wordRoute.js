const express = require("express");
const { getWord, createWord } = require("../controllers/wordController");

const router = express.Router();

router.get("/", getWord).post("/", createWord);

module.exports = router;
