import * as Yup from "yup";

export const userValidationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    phone: Yup.string(),
});

export const passwordValidationSchema = Yup.object({
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("New password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords must match")
        .required("Confirm password is required"),
});
