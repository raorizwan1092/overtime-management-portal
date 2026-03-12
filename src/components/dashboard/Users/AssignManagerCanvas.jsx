"use client";
import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import toast from "react-hot-toast";
import CustomButton from "@/components/shared/Button/Button";
import Canvas from "@/components/shared/Canvas";
import SelectInput from "@/components/shared/SelectInput/SelectInput";
import { assignManager, GetAllUsers } from "@/services/Users";
import * as Yup from "yup";
import { USER_ROLES } from "@/constants/AppConstants";

const AssignManagerCanvas = ({ showCanvas, setShowCanvas, selectedUser, fetchUsers }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [loadingManagers, setLoadingManagers] = useState(false);

    useEffect(() => {
        if (!showCanvas) return;

        const fetchUsersData = async () => {
            setLoadingManagers(true);
            try {
                const res = await GetAllUsers(1, "");
                if (res?.data?.success) {
                    setAllUsers(res.data.users || []);
                } else {
                    toast.error("Failed to fetch users");
                }
            } catch (err) {
                console.error(err);
                toast.error("Error fetching users");
            } finally {
                setLoadingManagers(false);
            }
        };

        fetchUsersData();
    }, [showCanvas]);

    const managers = allUsers.filter((u) => u.role === USER_ROLES.MANAGER);

    const initialValues = {
        managerId: selectedUser?.managerId || "",
    };

    const validationSchema = Yup.object({
        managerId: Yup.string().required("Manager is required"),
    });

    const handleSubmit = async (values, actions) => {
        try {
            if (!selectedUser?._id) return;

            const response = await assignManager(selectedUser._id, values.managerId);

            if (response?.data?.success) {
                toast.success("Manager assigned successfully");
                setShowCanvas(false);
                if (fetchUsers) fetchUsers();
            }
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.error || "Failed to assign manager");
        } finally {
            actions.setSubmitting(false);
        }
    };

    return (
        <Canvas
            show={showCanvas}
            onHide={() => setShowCanvas(false)}
            title={`Assign Manager to ${selectedUser?.name || "Employee"}`}
            width={400}
        >
            <div className="p-3">
                {loadingManagers ? (
                    <div className="text-center py-4">Loading managers...</div>
                ) : (
                    <Formik
                        enableReinitialize
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ handleSubmit, handleChange, values, errors, touched, isSubmitting }) => (
                            <Form onSubmit={handleSubmit}>
                                <SelectInput
                                    label="Select Manager"
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

                                <CustomButton
                                    type="submit"
                                    label="Assign Manager"
                                    fullWidth
                                    loading={isSubmitting}
                                />
                            </Form>
                        )}
                    </Formik>
                )}
            </div>
        </Canvas>
    );
};

export default AssignManagerCanvas;
