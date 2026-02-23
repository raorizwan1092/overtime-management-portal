"use client";
import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, InputGroup } from "react-bootstrap";
import TextInput from "../shared/TextInput/TextInput";
import CustomButton from "../shared/Button/Button";
import { getRule, updateRule } from "@/services/Rules";
import toast from "react-hot-toast";
import { FiEdit } from "react-icons/fi";

const Rules = () => {
    const [initialValues, setInitialValues] = useState({
        maxHours: "",
        rate8to10: "",
        rate10to12: "",
    });
    const [ruleId, setRuleId] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // Controls edit mode

    useEffect(() => {
        const fetchRule = async () => {
            try {
                const response = await getRule();

                if (response?.data?.success && response?.data?.rules?.length > 0) {
                    const rule = response?.data?.rules[0];
                    setRuleId(rule._id);
                    setInitialValues({
                        maxHours: rule.maxHours,
                        rate8to10: rule.rate8to10,
                        rate10to12: rule.rate10to12,
                    });
                }
            } catch (err) {
                toast.error("Failed to fetch rules");
            }
        };

        fetchRule();
    }, []);

    const validationSchema = Yup.object({
        maxHours: Yup.number()
            .typeError("Maximum hours must be a number")
            .required("Maximum hours is required")
            .min(1, "Must be at least 1 hour"),
        rate8to10: Yup.number()
            .typeError("Rate must be a number")
            .required("Hourly rate for 8-10 hours is required")
            .min(0, "Rate must be positive"),
        rate10to12: Yup.number()
            .typeError("Rate must be a number")
            .required("Hourly rate for 10-12 hours is required")
            .min(0, "Rate must be positive"),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            if (!ruleId) {
                toast.error("Rule not found");
                return;
            }
            const response = await updateRule(ruleId, values);
            if (response?.data?.success) {
                toast.success("Rule updated successfully!");
                setIsEditing(false);
            } else {
                toast.error(response.error || "Failed to update rule");
            }
        } catch (err) {
            toast.error(err?.response?.data?.error || "Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <h3 className="text-end">
                <FiEdit
                    size={22}
                    className="cursor-pointer text-white"
                    onClick={() => setIsEditing(!isEditing)}
                    title={isEditing ? "Cancel Editing" : "Edit Rules"}
                />
            </h3>

            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ handleSubmit, handleChange, values, errors, touched, isSubmitting }) => (
                    <Form onSubmit={handleSubmit}>
                        <TextInput
                            label="Maximum Hours"
                            name="maxHours"
                            type="number"
                            value={values.maxHours}
                            onChange={handleChange}
                            error={errors.maxHours}
                            touched={touched.maxHours}
                            disabled={!isEditing}
                        />

                        <TextInput
                            label="Hourly Rate (8-10 hours) in %"
                            name="rate8to10"
                            type="number"
                            value={values.rate8to10}
                            onChange={handleChange}
                            error={errors.rate8to10}
                            touched={touched.rate8to10}
                            disabled={!isEditing}
                        />

                        <TextInput
                            label="Hourly Rate (10-12 hours) in %"
                            name="rate10to12"
                            type="number"
                            value={values.rate10to12}
                            onChange={handleChange}
                            error={errors.rate10to12}
                            touched={touched.rate10to12}
                            disabled={!isEditing}
                        />

                        <CustomButton
                            type="submit"
                            label="Update Rules"
                            fullWidth
                            loading={isSubmitting}
                            disabled={!isEditing}
                            className="mt-3"
                        />
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Rules;
