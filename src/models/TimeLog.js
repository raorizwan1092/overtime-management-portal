import { TIMELOG_STATUS } from "@/constants/AppConstants";
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
      enum: Object.values(TIMELOG_STATUS),
      default: TIMELOG_STATUS.PENDING,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    totalAmount: {
      type: Number,
      default: 0,
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
