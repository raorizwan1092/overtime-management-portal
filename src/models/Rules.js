import mongoose from "mongoose";

const rulesSchema = new mongoose.Schema(
    {
        maxHours: {
            type: Number,
            required: [true, "Maximum hours is required"],
            min: [1, "Maximum hours must be at least 1"],
        },
        rate8to10: {
            type: Number,
            required: [true, "Hourly rate for 8-10 hours is required"],
            min: [0, "Rate must be positive"],
        },
        rate10to12: {
            type: Number,
            required: [true, "Hourly rate for 10-12 hours is required"],
            min: [0, "Rate must be positive"],
        },
    },
    {
        timestamps: true,
    }
);
export default mongoose.models.Rules || mongoose.model("Rules", rulesSchema);
