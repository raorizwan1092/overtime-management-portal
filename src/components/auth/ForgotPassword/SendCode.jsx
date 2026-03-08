"use client";
import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { sendResetCode } from "@/services/Users";
import CustomButton from "@/components/shared/Button/Button";
import TextInput from "@/components/shared/TextInput/TextInput";
import AuthenticationHeader from "../AuthenticationHeader";

const Step1Schema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
});

const SendCode = ({ onSuccess }) => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setLoading(true);
        try {
            const res = await sendResetCode(values.email);
            if (res?.data?.success) {
                toast.success("Verification code sent to your email");
                resetForm();
                onSuccess(values.email);
            } else {
                toast.error(res?.data?.message || "Failed to send code");
            }
        } catch (err) {
            toast.error(err?.response?.data?.error || err?.message || "Failed to send code");
        } finally {
            setSubmitting(false);
            setLoading(false);
        }
    };

    return (
        <>
            <AuthenticationHeader
                heading="Forgot Password"
                subHeading="Please enter the email to continue"
            />
            <Formik
                initialValues={{ email: "" }}
                validationSchema={Step1Schema}
                onSubmit={handleSubmit}
                validateOnChange={false}
                validateOnBlur={false}
            >
                {({ handleSubmit, handleChange, values, errors, touched, isSubmitting }) => (
                    <Form onSubmit={handleSubmit}>
                        <TextInput
                            label="Email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={values.email}
                            onChange={handleChange}
                            error={errors.email}
                            touched={touched.email}
                        />
                        <CustomButton
                            type="submit"
                            label="Send Code"
                            fullWidth
                            loading={isSubmitting || loading}
                            disabled={isSubmitting || loading}
                        />
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default SendCode;
