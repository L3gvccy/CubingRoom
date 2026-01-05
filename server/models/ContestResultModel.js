import mongoose from "mongoose";

const solveSchema = new mongoose.Schema(
  {
    time: {
      type: Number,
      required: true,
    },
    penalty: {
      type: String,
      enum: ["OK", "+2", "DNF"],
      default: "OK",
    },
    finalResult: {
      type: Number,
      required: true,
    },
  },
  { _id: true }
);

const contestResultSchema = mongoose.Schema({
  contest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contests",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  solves: [solveSchema],
  best: {
    type: Number,
  },
  average: {
    type: Number,
  },
  submittes: {
    type: Boolean,
    default: false,
  },
});

const ContestResult = mongoose.model("ContestResult", contestResultSchema);

export default ContestResult;
