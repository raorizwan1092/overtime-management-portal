"use client";

import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form } from "react-bootstrap";
import TextInput from "../shared/TextInput/TextInput";
import CustomButton from "../shared/Button/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { NAVIGATION_URLS } from "@/constants/AppConstants";
import AuthenticationHeader from "../auth/AuthenticationHeader";
import { changePassword } from "@/services/Users";

const ChangePassword = () => {
    const { user, setUser } = useAuth();
    const router = useRouter();

    const initialValues = {
        newPassword: "",
        confirmPassword: "",
    };

    const validationSchema = Yup.object({
        newPassword: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("New password is required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("newPassword")], "Passwords must match")
            .required("Confirm password is required"),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const response = await changePassword(values.newPassword);
            console.log("response", response);

            if (response.data.success) {
                toast.success("Password changed successfully");
                setUser({ ...user, mustChangePassword: false });
                router.push(NAVIGATION_URLS.TIME_LOG);
                resetForm();
            }
        } catch (error) {
            toast.error(error?.response?.data?.error || "Failed to change password");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <AuthenticationHeader
                heading="Change Your Password 🔒"
                subHeading="Set a new password to continue"
            />

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ handleSubmit, handleChange, values, errors, touched, isSubmitting }) => (
                    <Form onSubmit={handleSubmit} className="mt-4">
                        <TextInput
                            label="New Password"
                            name="newPassword"
                            type="password"
                            value={values.newPassword}
                            onChange={handleChange}
                            error={errors.newPassword}
                            touched={touched.newPassword}
                        />

                        <TextInput
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            error={errors.confirmPassword}
                            touched={touched.confirmPassword}
                        />

                        <CustomButton
                            type="submit"
                            label="Update Password"
                            fullWidth
                            loading={isSubmitting}
                        />
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ChangePassword;
