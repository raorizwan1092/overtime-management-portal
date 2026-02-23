"use client";
import React from "react";
import Canvas from "../shared/Canvas";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form } from "react-bootstrap";
import { ROLE_OPTIONS } from "@/constants/AppConstants";
import TextInput from "../shared/TextInput/TextInput";
import SelectInput from "../shared/SelectInput/SelectInput";
import CustomButton from "../shared/Button/Button";
import { createUser } from "@/services/Users";
import toast from "react-hot-toast";

const AddUserCanvas = ({ showCanvas, setShowCanvas, fetchUsers }) => {
    const initialValues = {
        name: "",
        email: "",
        phone: "",
        role: "",
        hourlyRate: "",
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
