"use client";

import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Col, Form, Row } from "react-bootstrap";
import TextInput from "../shared/TextInput/TextInput";
import CustomButton from "../shared/Button/Button";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { FiEdit } from "react-icons/fi";
import TableCard from "../shared/TableCard";
import { changePassword, updatePassword, updateUser } from "@/services/Users";
import { useRouter } from "next/navigation";

const Settings = () => {
    const { user, setUser } = useAuth();
    const router = useRouter();

    // --- Name & Phone Form ---
    const [isEditing, setIsEditing] = useState(false);
    const [userValues, setUserValues] = useState({
        name: "",
        email: "",
        phone: "",
        role: "",
        hourlyRate: "",
    });

    useEffect(() => {
        if (user) {
            setUserValues({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                role: user.role || "",
                hourlyRate: user.hourlyRate || "",
            });
        }
    }, [user]);

    const userValidationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        phone: Yup.string(),
    });

    const handleUserSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true);
        try {
            const response = await updateUser({ name: values.name, phone: values.phone });
            if (response?.data.success) {
                toast.success("Settings updated successfully");
                setUser(response?.data.user);
                setIsEditing(false);
            } else {
                toast.error(response?.data?.error || "Failed to update settings");
            }
        } catch (err) {
            toast.error("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    // --- Password Form ---
    const passwordInitialValues = { currentPassword: "", newPassword: "", confirmPassword: "" };

    const passwordValidationSchema = Yup.object({
        currentPassword: Yup.string().required("Current password is required"),
        newPassword: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("New password is required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("newPassword")], "Passwords must match")
            .required("Confirm password is required"),
    });

    const handlePasswordSubmit = async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        try {
            const response = await updatePassword(values.currentPassword, values.newPassword);
            if (response?.data.success) {
                toast.success("Password changed successfully");
                setUser({ ...user, mustChangePassword: false });
                resetForm();
            } else {
                toast.error(response?.data?.error || "Failed to change password");
            }
        } catch (err) {
            toast.error(err?.response?.data?.error || "Failed to change password");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            {/* --- Name & Phone Settings --- */}
            <TableCard>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="text-white">Settings</h4>
                    <FiEdit
                        size={22}
                        className="cursor-pointer text-white"
                        onClick={() => setIsEditing(!isEditing)}
                        title={isEditing ? "Cancel Editing" : "Edit Settings"}
                    />
                </div>

                <Formik
                    enableReinitialize
                    initialValues={userValues}
                    validationSchema={userValidationSchema}
                    onSubmit={handleUserSubmit}
                >
                    {({ handleSubmit, handleChange, values, errors, touched, isSubmitting }) => (
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col xs={12} md={6}>
                                    <TextInput
                                        label="Name"
                                        name="name"
                                        type="text"
                                        value={values.name}
                                        onChange={handleChange}
                                        error={errors.name}
                                        touched={touched.name}
                                        disabled={!isEditing}
                                    />
                                </Col>
                                <Col xs={12} md={6}>
                                    <TextInput
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        error={errors.email}
                                        touched={touched.email}
                                        disabled
                                    />
                                </Col>
                                <Col xs={12} md={6}>
                                    <TextInput
                                        label="Phone"
                                        name="phone"
                                        type="text"
                                        value={values.phone}
                                        onChange={handleChange}
                                        error={errors.phone}
                                        touched={touched.phone}
                                        disabled={!isEditing}
                                    />
                                </Col>
                                <Col xs={12} md={6}>
                                    <TextInput
                                        label="Role"
                                        name="role"
                                        type="text"
                                        value={values.role}
                                        onChange={handleChange}
                                        error={errors.role}
                                        touched={touched.role}
                                        disabled
                                    />
                                </Col>
                                <Col xs={12} md={6}>
                                    <TextInput
                                        label="Hourly Rate"
                                        name="hourlyRate"
                                        type="number"
                                        value={values.hourlyRate}
                                        onChange={handleChange}
                                        error={errors.hourlyRate}
                                        touched={touched.hourlyRate}
                                        disabled
                                    />
                                </Col>
                            </Row>

                            <CustomButton
                                type="submit"
                                label="Save Changes"
                                fullWidth
                                loading={isSubmitting}
                                disabled={!isEditing}
                                className="mt-3"
                            />
                        </Form>
                    )}
                </Formik>
            </TableCard>

            {/* --- Change Password --- */}
            <TableCard className="mt-4">
                <h4 className="text-white mb-3">Change Password</h4>
                <Formik
                    enableReinitialize
                    initialValues={passwordInitialValues}
                    validationSchema={passwordValidationSchema}
                    onSubmit={handlePasswordSubmit}
                >
                    {({ handleSubmit, handleChange, values, errors, touched, isSubmitting }) => (
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col xs={12} md={6}>
                                    <TextInput
                                        label="Current Password"
                                        name="currentPassword"
                                        type="password"
                                        value={values.currentPassword}
                                        onChange={handleChange}
                                        error={errors.currentPassword}
                                        touched={touched.currentPassword}
                                    />
                                </Col>
                                <Col xs={12} md={6}>
                                    <TextInput
                                        label="New Password"
                                        name="newPassword"
                                        type="password"
                                        value={values.newPassword}
                                        onChange={handleChange}
                                        error={errors.newPassword}
                                        touched={touched.newPassword}
                                    />
                                </Col>
                                <Col xs={12} md={6}>
                                    <TextInput
                                        label="Confirm Password"
                                        name="confirmPassword"
                                        type="password"
                                        value={values.confirmPassword}
                                        onChange={handleChange}
                                        error={errors.confirmPassword}
                                        touched={touched.confirmPassword}
                                    />
                                </Col>
                            </Row>

                            <CustomButton
                                type="submit"
                                label="Update Password"
                                fullWidth
                                loading={isSubmitting}
                                className="mt-3"
                            />
                        </Form>
                    )}
                </Formik>
            </TableCard>
        </>
    );
};

export default Settings;
