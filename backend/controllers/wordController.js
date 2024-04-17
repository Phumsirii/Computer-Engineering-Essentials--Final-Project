import Word from "../models/wordModel";
import mongoose from "mongoose";

const getWord = async (req, res) => {
  res.send("Word Controller");
};

module.exports = { getWord };
