"use client";
import React from "react";
import Canvas from "../shared/Canvas";

const UserDetail = ({ showCanvas, setShowCanvas, selectedUser }) => {

    if (!selectedUser) return null;

    return (
        <Canvas
            show={showCanvas}
            onHide={() => setShowCanvas(false)}
            title="User Details"
            width={400}
        >
            <div className="p-3">
                <div className="mb-3">
                    <label className="fw-bold">User ID</label>
                    <p className="mb-0">{selectedUser?._id}</p>
                </div>
                <div className="mb-3">
                    <label className="fw-bold">Name</label>
                    <p className="mb-0">{selectedUser?.name || "-"}</p>
                </div>

                <div className="mb-3">
                    <label className="fw-bold">Email</label>
                    <p className="mb-0">{selectedUser?.email || "-"}</p>
                </div>

                <div className="mb-3">
                    <label className="fw-bold">Phone</label>
                    <p className="mb-0">{selectedUser?.phone || "-"}</p>
                </div>

                <div className="mb-3">
                    <label className="fw-bold">Role</label>
                    <p className="mb-0">{selectedUser?.role || "-"}</p>
                </div>



                <div className="mb-3">
                    <label className="fw-bold">Created At</label>
                    <p className="mb-0">
                        {new Date(selectedUser?.createdAt).toLocaleString()}
                    </p>
                </div>


            </div>
        </Canvas>
    );
};

export default UserDetail;
