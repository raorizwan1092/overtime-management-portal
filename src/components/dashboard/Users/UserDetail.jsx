"use client";
import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { TIMELOG_STATUS } from "@/constants/AppConstants";
import { getLogsById, updateLogStatus } from "@/services/TimeLog";
import Canvas from "@/components/shared/Canvas";

const UserDetail = ({ showCanvas, setShowCanvas, selectedUser }) => {

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (showCanvas && selectedUser?._id) {
            fetchLogs();
        }
    }, [showCanvas, selectedUser]);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const res = await getLogsById(selectedUser?._id);
            setLogs(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await updateLogStatus(id, status);
            fetchLogs();
        } catch (err) {
            console.error(err);
        }
    };

    if (!selectedUser) return null;

    return (
        <Canvas
            show={showCanvas}
            onHide={() => setShowCanvas(false)}
            title="User Details"
            width={500}
        >
            <div className="p-3">

                {/* User Info */}
                <div className="mb-3">
                    <label className="fw-bold">Name</label>
                    <p className="mb-0">{selectedUser?.name}</p>
                </div>

                <div className="mb-4">
                    <label className="fw-bold">Email</label>
                    <p className="mb-0">{selectedUser?.email}</p>
                </div>

                <hr />

                {/* Timelogs Section */}
                <h6 className="fw-bold mb-3">Time Logs</h6>

                {loading ? (
                    <Spinner animation="border" />
                ) : logs.length === 0 ? (
                    <p>No timelogs found</p>
                ) : (
                    logs.map(log => (
                        <div key={log._id} className="border p-2 mb-2 rounded">

                            <div>
                                <strong>Date:</strong>{" "}
                                {new Date(log.date).toLocaleDateString()}
                            </div>

                            <div>
                                <strong>Hours:</strong> {log.hours}
                            </div>

                            <div>
                                <strong>Description:</strong> {log.description}
                            </div>
                            <div>
                                <strong>Amount:</strong> {log.totalAmount}
                            </div>

                            <div className="mb-2">
                                <strong>Status:</strong>{" "}
                                <span className={
                                    log.status === TIMELOG_STATUS?.APPROVED
                                        ? "text-success"
                                        : log.status === TIMELOG_STATUS?.REJECTED
                                            ? "text-danger"
                                            : "text-warning"
                                }>
                                    {log.status}
                                </span>
                            </div>

                            {log.status === TIMELOG_STATUS?.PENDING && (
                                <div className="d-flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="success"
                                        onClick={() => handleStatusChange(log._id, TIMELOG_STATUS?.APPROVED)}
                                    >
                                        Approve
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="danger"
                                        onClick={() => handleStatusChange(log._id, TIMELOG_STATUS?.REJECTED)}
                                    >
                                        Reject
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </Canvas>
    );
};

export default UserDetail;
