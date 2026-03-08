"use client";
import React from "react";
import { Formik } from "formik";

import { Form } from "react-bootstrap";
import TextInput from "../shared/TextInput/TextInput";
import CustomButton from "../shared/Button/Button";
import AuthenticationHeader from "./AuthenticationHeader";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import { SignInUser } from "@/services/Users";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { NAVIGATION_URLS, USER_ROLES } from "@/constants/AppConstants";
import { useAuth } from "@/contexts/AuthContext";
import { SigninSchema } from "@/ValidationSchemas/SigninSchema";

const Signin = () => {
    const theme = useTheme()
    const { setUser } = useAuth();
    const router = useRouter()
    const initialValues = {
        email: "",
        password: "",
    };



    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await SignInUser(values);

            if (response?.data.success) {
                const role = response?.data?.user?.role;
                const userData = response?.data?.user;
                setUser(userData);
                console.log("userData", userData);
                toast.success("Login successful");
                if (userData?.mustChangePassword) {
                    router.push(NAVIGATION_URLS.CHANGE_PASSWORD);
                } else {
                    router.push(
                        role === USER_ROLES.HR || role === USER_ROLES.MANAGER
                            ? NAVIGATION_URLS.USERS
                            : NAVIGATION_URLS.TIME_LOG
                    );

                }
            }
        } catch (error) {
            toast.error(
                error?.response?.data?.error || "Login failed"
            );
        } finally {
            setSubmitting(false);
        }
    };




    return (
        <div>
            <AuthenticationHeader
                heading="Welcome Back 👋"
                subHeading="Sign in to continue your journey with us"
            />

            <Formik
                initialValues={initialValues}
                validationSchema={SigninSchema}
                onSubmit={handleSubmit}
            >
                {({ handleSubmit, handleChange, values, errors, touched, isSubmitting }) => (
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
                            <Link href={NAVIGATION_URLS?.AUTH_URLS?.FORGOT_PASSWORD} className="text-decoration-none" style={{ color: theme?.textColor }}>
                                Forgot Password?
                            </Link>
                        </div>

                        <CustomButton
                            type="submit"
                            label="Sign In"
                            fullWidth
                            loading={isSubmitting}
                        />
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Signin;
