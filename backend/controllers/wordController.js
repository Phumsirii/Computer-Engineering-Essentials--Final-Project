const Word = require("../models/wordModel");
const mongoose = require("mongoose");

const getWord = async (req, res) => {
  try {
    const words = await Word.find();

    res.status(200).json({ success: true, data: words });
  } catch (err) {
    console.log(err);

    res.stuatus(400).json({ success: false });
  }
};

const createWord = async (req, res) => {
  const word = await Word.create(req.body);

  res.status(201).json({ success: true, data: word });
};

module.exports = { getWord, createWord };
