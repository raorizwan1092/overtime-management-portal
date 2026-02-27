import mongoose from "mongoose";

const timeLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    hours: {
      type: Number,
      required: true,
      min: 0,
      max: 24,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 255,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    approvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

timeLogSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.models.TimeLog ||
  mongoose.model("TimeLog", timeLogSchema);
