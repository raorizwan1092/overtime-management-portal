import * as Yup from "yup";

export const TimeLogSchema = Yup.object().shape({
    hours: Yup.number()
        .min(0, "Hours cannot be negative")
        .max(12, "Hours cannot exceed 12")
        .required("Hours are required"),
    description: Yup.string().max(255, "Description too long"),
});