"use client";
import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { verifyResetCode } from "@/services/Users";
import CustomButton from "@/components/shared/Button/Button";
import TextInput from "@/components/shared/TextInput/TextInput";
import AuthenticationHeader from "../AuthenticationHeader";

const Step2Schema = Yup.object({
    code: Yup.string()
        .required("Code is required")
        .matches(/^\d+$/, "Code must contain only numbers")
        .length(6, "Code must be 6 digits"),
});

const VerifyCode = ({ email, onBack, onSuccess }) => {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        const code = values?.code;
        if (!code) {
            toast.error("Please enter the verification code");
            return setSubmitting(false);
        }

        setLoading(true);
        try {
            const res = await verifyResetCode(email, code);
            if (res?.data?.success) {
                toast.success("Code verified successfully");
                resetForm();
                onSuccess(res.data.token); // pass token to parent
            } else {
                toast.error(res?.data?.message || "Invalid verification code");
            }
        } catch (err) {
            const errorMessage =
                err?.response?.data?.error || err?.response?.data?.message || err?.message || "Invalid code";
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
            setLoading(false);
        }
    };

    return (
        <>
            <AuthenticationHeader
                heading="Verification Code"
                subHeading={`Verification code sent to: ${email}`}
            />
            <Formik
                initialValues={{ code: "" }}
                validationSchema={Step2Schema}
                onSubmit={handleSubmit}
                validateOnChange={false}
                validateOnBlur={false}
            >
                {({ handleSubmit, handleChange, values, errors, touched, isSubmitting }) => (
                    <Form onSubmit={handleSubmit}>

                        <TextInput
                            label="Verification Code"
                            name="code"
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={values.code}
                            onChange={handleChange}
                            error={errors.code}
                            touched={touched.code}
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
                                label="Verify Code"
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

export default VerifyCode;
