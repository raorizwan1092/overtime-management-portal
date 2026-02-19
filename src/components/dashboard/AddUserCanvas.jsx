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

const AddUserCanvas = ({ showCanvas, setShowCanvas }) => {
    const initialValues = {
        name: "",
        email: "",
        phone: "",
        role: "",
    };

    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        phone: Yup.string().required("Phone number is required"),
        role: Yup.string().required("Role is required"),
    });

    const handleSubmit = (values) => {
        console.log("Form Values:", values);
        setShowCanvas(false);
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
                    {({ handleSubmit, handleChange, values, errors, touched }) => (
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
                            />
                        </Form>

                    )}
                </Formik>
            </div>
        </Canvas>
    );
};

export default AddUserCanvas;
