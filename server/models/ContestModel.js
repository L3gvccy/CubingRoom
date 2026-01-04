import mongoose from "mongoose";

const contestSchema = mongoose.Schema({
  event: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    default: "ao5",
    enum: ["ao5", "mo3"],
  },
  scrambles: { type: Array, default: [] },
  active: {
    type: Boolean,
    default: true,
  },
  date: {
    type: Date,
    default: Date.now,
    index: { expireAfterSeconds: 8 * 24 * 60 * 60 },
  },
});

const Contest = mongoose.model("Contests", contestSchema);

export default Contest;
