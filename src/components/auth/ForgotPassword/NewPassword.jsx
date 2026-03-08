"use client";
import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { setNewPassword } from "@/services/Users";
import CustomButton from "@/components/shared/Button/Button";
import TextInput from "@/components/shared/TextInput/TextInput";
import AuthenticationHeader from "../AuthenticationHeader";
import { useRouter } from "next/navigation";

const Step3Schema = Yup.object({
    newPassword: Yup.string().min(6, "Min 6 characters").required("New Password required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords must match")
        .required("Confirm Password required"),
});

const NewPassword = ({ email, token, onBack, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter()

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        if (!email || !token) {
            toast.error("Session expired. Please start over.");
            setSubmitting(false);
            return;
        }

        setLoading(true);
        try {
            const res = await setNewPassword(email, values.newPassword, token);
            if (res?.data?.success) {
                toast.success("Password changed successfully");
                resetForm();
                onSuccess();
                router.push(NAVIGATION_URLS?.AUTH_URLS?.SIGNIN)
            } else {
                toast.error(res?.data?.message || "Failed to change password");
            }
        } catch (err) {
            toast.error(err?.response?.data?.error || err?.message || "Failed to change password");
        } finally {
            setSubmitting(false);
            setLoading(false);
        }
    };

    return (
        <>
            <AuthenticationHeader
                heading="New Password"
                subHeading={`Please enter your new password`}
            />
            <Formik
                initialValues={{ newPassword: "", confirmPassword: "" }}
                validationSchema={Step3Schema}
                onSubmit={handleSubmit}
                validateOnChange={false}
                validateOnBlur={false}
            >
                {({ handleSubmit, handleChange, values, errors, touched, isSubmitting }) => (
                    <Form onSubmit={handleSubmit}>
                        <TextInput
                            label="New Password"
                            name="newPassword"
                            type="password"
                            placeholder="Enter new password"
                            value={values.newPassword}
                            onChange={handleChange}
                            error={errors.newPassword}
                            touched={touched.newPassword}
                        />
                        <TextInput
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm new password"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            error={errors.confirmPassword}
                            touched={touched.confirmPassword}
                        />
                        <div className="d-flex gap-2">
                            <CustomButton
                                type="button"
                                label="Back"
                                variant="outline-secondary"
                                onClick={onBack}
                                disabled={isSubmitting || loading}
                            />
                            <CustomButton
                                type="submit"
                                label="Change Password"
                                fullWidth
                                loading={isSubmitting || loading}
                                disabled={isSubmitting || loading}
                            />
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default NewPassword;
