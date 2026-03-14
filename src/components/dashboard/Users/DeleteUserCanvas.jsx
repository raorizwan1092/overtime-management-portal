"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
import CustomButton from "@/components/shared/Button/Button";
import Canvas from "@/components/shared/Canvas";
import { deleteUser } from "@/services/Users";
import { Col, Row } from "react-bootstrap";

const DeleteUserCanvas = ({ showCanvas, setShowCanvas, selectedUser, fetchUsers, fetchUserTable }) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!selectedUser?._id) return;

        try {
            setLoading(true);

            const response = await deleteUser(selectedUser._id);

            if (response?.data?.success) {
                toast.success("User Deleted Successfully");

                setShowCanvas(false);

                if (fetchUsers) {
                    fetchUsers();
                }
                if (fetchUserTable) {
                    fetchUserTable()
                }
            }
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Canvas
            show={showCanvas}
            onHide={() => setShowCanvas(false)}
            title="Delete User"
            width={400}
        >
            <div className="p-3">
                <p>
                    Are you sure you want to remove <b>{selectedUser?.name}</b>?
                </p>

                <Row className="mt-4">
                    <Col xs={12} lg={6}>
                        <CustomButton
                            variant="secondary"
                            onClick={() => setShowCanvas(false)}
                            label={"Cancel"}
                            fullWidth
                            className="mb-3"
                        />
                    </Col>
                    <Col xs={12} lg={6}>
                        <CustomButton
                            variant="danger"
                            onClick={handleDelete}
                            loading={loading}
                            label={"Delete"}
                            fullWidth
                            className="mb-3"
                        />
                    </Col>
                </Row>
            </div>
        </Canvas>
    );
};

export default DeleteUserCanvas;
