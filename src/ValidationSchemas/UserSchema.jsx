import { USER_ROLES } from "@/constants/AppConstants";
import * as Yup from "yup";

export const userSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    role: Yup.string().required("Role is required"),
    hourlyRate: Yup.number()
        .typeError("Hourly rate must be a number")
        .positive("Hourly rate must be positive")
        .required("Hourly rate is required"),

    managerId: Yup.string().when("role", {
        is: USER_ROLES?.EMPLOYEE,
        then: (schema) => schema.required("Manager is required"),
        otherwise: (schema) => schema.notRequired(),
    }),
});
