"use client";
import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form } from "react-bootstrap";
import TextInput from "../shared/TextInput/TextInput";
import CustomButton from "../shared/Button/Button";
import AuthenticationHeader from "./AuthenticationHeader";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";

const Signin = () => {
    const theme = useTheme()
    const initialValues = {
        email: "",
        password: "",
    };

    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid email").required("Email is required"),
        password: Yup.string().required("Password is required"),
    });

    const handleSubmit = (values) => {
        console.log("Signin Values:", values);
    };

    return (
        <div>
            <AuthenticationHeader
                heading="Welcome Back 👋"
                subHeading="Sign in to continue your journey with us"
            />

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ handleSubmit, handleChange, values, errors, touched }) => (
                    <Form onSubmit={handleSubmit} className="mt-4">
                        <TextInput
                            label="Email"
                            name="email"
                            type="email"
                            value={values.email}
                            onChange={handleChange}
                            error={errors.email}
                            touched={touched.email}
                        />

                        <TextInput
                            label="Password"
                            name="password"
                            type="password"
                            value={values.password}
                            onChange={handleChange}
                            error={errors.password}
                            touched={touched.password}
                        />

                        <div className="text-end mb-3">
                            <Link href="#" className="text-decoration-none" style={{color:theme?.textColor}}>
                                Forgot Password?
                            </Link>
                        </div>

                        <CustomButton
                            type="submit"
                            label="Sign In"
                            fullWidth
                        />
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Signin;
