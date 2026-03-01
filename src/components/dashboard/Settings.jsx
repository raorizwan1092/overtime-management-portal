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
import { updateUser } from "@/services/Users";

const Settings = () => {
    const { user, setUser } = useAuth();
    const [initialValues, setInitialValues] = useState({
        name: "",
        email: "",
        phone: "",
        role: "",
        hourlyRate: "",
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (user) {
            setInitialValues({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                role: user.role || "",
                hourlyRate: user.hourlyRate || "",
            });
        }
    }, [user]);

    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        phone: Yup.string(),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitting(true);
        try {
            const response = await updateUser({ name: values.name, phone: values.phone });
            if (response?.data.success) {
                toast.success("Settings updated successfully");
                setUser(response?.data.user);
                setIsEditing(false);
            } else {
                toast.error(data.error || "Failed to update settings");
            }
        } catch (err) {
            toast.error("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <TableCard>
            <div className="d-flex justify-content-between align-items-center">
                <h4 className="text-white">
                    Settings
                </h4>

                <h3 className="text-end">
                    <FiEdit
                        size={22}
                        className="cursor-pointer text-white"
                        onClick={() => setIsEditing(!isEditing)}
                        title={isEditing ? "Cancel Editing" : "Edit Settings"}
                    />
                </h3>
            </div>


            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
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
    );
};

export default Settings;
