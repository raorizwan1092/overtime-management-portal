"use client";

import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form } from "react-bootstrap";
import TextInput from "../shared/TextInput/TextInput";
import CustomButton from "../shared/Button/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { NAVIGATION_URLS, USER_ROLES } from "@/constants/AppConstants";
import AuthenticationHeader from "../auth/AuthenticationHeader";
import { changePassword, Logout } from "@/services/Users";
import { RiLogoutCircleRLine } from "react-icons/ri";

const ChangePassword = () => {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
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
                const updatedUser = { ...user, mustChangePassword: false };
                console.log("updatedUser", updatedUser);
                setUser({ ...user, mustChangePassword: false });
                resetForm();
                if (
                    updatedUser.role === USER_ROLES.HR ||
                    updatedUser.role === USER_ROLES.MANAGER
                ) {
                    router.push(NAVIGATION_URLS.USERS);
                } else {
                    router.push(NAVIGATION_URLS.TIME_LOG);
                }

            }
        } catch (error) {
            toast.error(error?.response?.data?.error || "Failed to change password");
        } finally {
            setSubmitting(false);
        }
    };
    const handleLogout = async () => {
        try {
            setLoading(true);
            const response = await Logout();
            if (response?.data.success) {
                toast.success("Logged out successfully");
                router.push(NAVIGATION_URLS.AUTH_URLS.SIGNIN);
            }
        } catch (error) {
            toast.error(error?.response?.data?.error || "Logout failed");
        } finally {
            setLoading(false);
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
                        <CustomButton
                            label={"Logout"}
                            onClick={handleLogout}
                            loading={loading}
                            fullWidth
                            className="mt-3"
                        />
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ChangePassword;
