"use client";
import React from "react";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import { ROLE_OPTIONS, USER_ROLES } from "@/constants/AppConstants";
import { createUser } from "@/services/Users";
import toast from "react-hot-toast";
import CustomButton from "@/components/shared/Button/Button";
import Canvas from "@/components/shared/Canvas";
import SelectInput from "@/components/shared/SelectInput/SelectInput";
import TextInput from "@/components/shared/TextInput/TextInput";
import { userSchema } from "@/ValidationSchemas/UserSchema";

const AddUserCanvas = ({
    showCanvas,
    setShowCanvas,
    fetchUsers,
    managers = [],
    hideRole = false,
    managerId = null,
}) => {
    const initialValues = {
        name: "",
        email: "",
        phone: "",
        role: managerId ? USER_ROLES.EMPLOYEE : "",
        hourlyRate: "",
        managerId: managerId || "",
    };

    const handleSubmit = async (values, actions) => {
        try {
            let payload = { ...values };

            if (managerId) {
                payload = {
                    ...payload,
                    role: USER_ROLES.EMPLOYEE,
                    managerId: managerId,
                };
            }

            const response = await createUser(payload);

            if (response?.data?.success) {
                toast.success("User Created Successfully");

                actions.resetForm();
                setShowCanvas(false);

                if (fetchUsers) fetchUsers();
            }
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.error || "Something went wrong");
        } finally {
            actions.setSubmitting(false);
        }
    };

    return (
        <Canvas
            show={showCanvas}
            onHide={() => setShowCanvas(false)}
            title="Add User"
            width={400}
        >
            <div className="p-3">
                <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={userSchema}
                    onSubmit={handleSubmit}
                >
                    {({
                        handleSubmit,
                        handleChange,
                        values,
                        errors,
                        touched,
                        isSubmitting,
                    }) => (
                        <Form onSubmit={handleSubmit}>
                            <TextInput
                                label="Name"
                                name="name"
                                value={values.name}
                                onChange={handleChange}
                                error={errors.name}
                                touched={touched.name}
                            />

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
                                label="Phone Number"
                                name="phone"
                                value={values.phone}
                                onChange={handleChange}
                                error={errors.phone}
                                touched={touched.phone}
                            />

                            <TextInput
                                label="Hourly Rate"
                                name="hourlyRate"
                                type="number"
                                value={values.hourlyRate}
                                onChange={handleChange}
                                error={errors.hourlyRate}
                                touched={touched.hourlyRate}
                            />

                            {/* Show role only when HR creates user */}
                            {!hideRole && (
                                <SelectInput
                                    label="Role"
                                    name="role"
                                    value={values.role}
                                    onChange={handleChange}
                                    options={ROLE_OPTIONS.filter(
                                        (role) => role.value !== USER_ROLES.EMPLOYEE
                                    )}
                                    error={errors.role}
                                    touched={touched.role}
                                />
                            )}

                            <CustomButton
                                type="submit"
                                label="Add User"
                                fullWidth
                                loading={isSubmitting}
                            />
                        </Form>
                    )}
                </Formik>
            </div>
        </Canvas>
    );
};

export default AddUserCanvas;
