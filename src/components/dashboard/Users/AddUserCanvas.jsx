"use client";
import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form } from "react-bootstrap";
import { ROLE_OPTIONS, USER_ROLES } from "@/constants/AppConstants";
import { createUser } from "@/services/Users";
import toast from "react-hot-toast";
import CustomButton from "@/components/shared/Button/Button";
import Canvas from "@/components/shared/Canvas";
import SelectInput from "@/components/shared/SelectInput/SelectInput";
import TextInput from "@/components/shared/TextInput/TextInput";

const AddUserCanvas = ({ showCanvas, setShowCanvas, fetchUsers, managers }) => {
    const initialValues = {
        name: "",
        email: "",
        phone: "",
        role: "",
        hourlyRate: "",
        managerId: "",
    };


    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        phone: Yup.string().required("Phone number is required"),
        role: Yup.string().required("Role is required"),
        hourlyRate: Yup.number()
            .typeError("Hourly rate must be a number")
            .positive("Hourly rate must be positive")
            .required("Hourly rate is required"),

        managerId: Yup.string().when("role", {
            is: USER_ROLES?.EMPLOYEE,
            then: (schema) => schema.required("Manager is required"),
            otherwise: (schema) => schema.notRequired(),
        }),
    });


    const handleSubmit = async (values) => {
        try {
            const response = await createUser(values);

            if (response?.data.success) {
                toast.success("User Created Successfully");
                setShowCanvas(false);
                fetchUsers();
            }
        } catch (err) {
            toast.error(err?.response?.data?.error || "Something went wrong");
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
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ handleSubmit, handleChange, values, errors, touched, isSubmitting }) => (
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

                            <SelectInput
                                label="Role"
                                name="role"
                                value={values.role}
                                onChange={handleChange}
                                options={ROLE_OPTIONS}
                                error={errors.role}
                                touched={touched.role}
                            />
                            {values.role === USER_ROLES?.EMPLOYEE && (
                                <SelectInput
                                    label="Manager"
                                    name="managerId"
                                    value={values.managerId}
                                    onChange={handleChange}
                                    options={managers.map((m) => ({
                                        label: m.name,
                                        value: m._id,
                                    }))}
                                    error={errors.managerId}
                                    touched={touched.managerId}
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
