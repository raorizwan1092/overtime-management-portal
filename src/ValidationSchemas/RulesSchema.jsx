import * as Yup from "yup";
export const rulesSchema = Yup.object({
    maxHours: Yup.number()
        .typeError("Maximum hours must be a number")
        .required("Maximum hours is required")
        .min(1, "Must be at least 1 hour"),
    rate8to10: Yup.number()
        .typeError("Rate must be a number")
        .required("Hourly rate for 8-10 hours is required")
        .min(0, "Rate must be positive"),
    rate10to12: Yup.number()
        .typeError("Rate must be a number")
        .required("Hourly rate for 10-12 hours is required")
        .min(0, "Rate must be positive"),
});