"use client";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import TextInput from "../shared/TextInput/TextInput";
import CustomButton from "../shared/Button/Button";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import Canvas from "../shared/Canvas";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { getRule } from "@/services/Rules";
import { calculateTotalAmount } from "@/utils/calculateTotalAmount";

const TimeLogCanvas = ({ show, onHide, selectedDate, initialData, onSave }) => {
    const { user } = useAuth();
    const theme = useTheme();
    const [rule, setRule] = useState()

    const TimeLogSchema = Yup.object().shape({
        hours: Yup.number()
            .min(0, "Hours cannot be negative")
            .max(12, "Hours cannot exceed 12")
            .required("Hours are required"),
        description: Yup.string().max(255, "Description too long"),
    });
    useEffect(() => {
        const fetchRule = async () => {
            try {
                const response = await getRule();
                if (response?.data?.success && response?.data?.rules?.length > 0) {
                    setRule(response.data.rules[0]);
                }
            } catch (err) {
                toast.error("Failed to fetch rules");
            }
        };
        fetchRule();
    }, []);


    return (
        <Canvas
            show={show}
            onHide={onHide}
            title={`Log Hours`}
            width={400}
        >
            <Formik
                initialValues={{
                    hours: initialData?.hours || "",
                    description: initialData?.description || "",
                }}
                validationSchema={TimeLogSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    await onSave(values);
                    setSubmitting(false);
                    onHide();
                }}
            >
                {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => {
                    const totalAmount = calculateTotalAmount(
                        Number(values.hours),
                        user?.hourlyRate || 0,
                        rule
                    );

                    return (
                        <FormikForm className="p-3">

                            <TextInput
                                label="Hours"
                                name="hours"
                                type="number"
                                value={values.hours}
                                onChange={handleChange}
                                error={errors.hours}
                                touched={touched.hours}
                                classNam={"mb-0"}
                                // min={0}
                                // max={12}
                            />
                            <TextInput
                                label="Description (Optional)"
                                name="description"
                                type="textarea"
                                value={values.description}
                                onChange={handleChange}
                                error={errors.description}
                                touched={touched.description}
                            />
                            {user?.hourlyRate && (
                                <div style={{ fontSize: "small", color: theme?.lightGray }}>
                                    Total Amount: ${totalAmount.toFixed(2)}
                                </div>
                            )}
                            {selectedDate && (
                                <div className="mb-3" style={{ fontSize: "small", color: theme?.lightGray }}>
                                    Selected Date: {format(selectedDate, "MMMM d, yyyy")}
                                </div>
                            )}
                            <div className="d-flex justify-content-end gap-2 mt-2">
                                <CustomButton
                                    label="Save Hours"
                                    type="submit"
                                    loading={isSubmitting}
                                    fullWidth
                                />
                            </div>
                        </FormikForm>
                    );
                }}
            </Formik>
        </Canvas>
    );
};

export default TimeLogCanvas;
