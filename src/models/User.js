import { USER_ROLES } from "@/constants/AppConstants";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      required: function () {
        return !this.googleId;
      },
    },
    role: {
      type: String,
      enum: [USER_ROLES.MANAGER, USER_ROLES.EMPLOYEE, USER_ROLES.HR],
      default: USER_ROLES.EMPLOYEE,
    },

  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model("User", userSchema);