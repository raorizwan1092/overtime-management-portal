"use client";
import React, { useState } from 'react';
import { Col, Modal, Row, Spinner } from 'react-bootstrap';
import { format } from 'date-fns';
import { useTheme } from '@/contexts/ThemeContext';
import CustomButton from '@/components/shared/Button/Button';
import { updateLogStatus } from '@/services/TimeLog';
import { TIMELOG_STATUS } from '@/constants/AppConstants';
import { getStatusClass } from '@/utils/TimeLog';
import { IoCloseSharp } from "react-icons/io5";

const TimeLogDetailModal = ({ show, selectedLog, onHide, setSelectedLog, onStatusUpdated }) => {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);

    const handleStatusUpdate = async (status) => {
        if (!selectedLog?._id) return;
        setLoading(true);
        try {
            await updateLogStatus(selectedLog._id, status);
            setSelectedLog(prev => ({ ...prev, status }));
            if (onStatusUpdated) onStatusUpdated();
            onHide();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Body style={{ background: theme.background, color: theme.textColor }}>
                <div className='text-end'>
                    <IoCloseSharp
                        size={30}
                        className='text-white'
                        style={{ cursor: "pointer" }}
                        onClick={onHide}
                    />
                </div>

                {selectedLog && (
                    <>
                        <p><strong>Date:</strong> {format(new Date(selectedLog.date), "eeee, MMMM d, yyyy")}</p>
                        <p><strong>Hours:</strong> {selectedLog.hours}</p>
                        <p><strong>Description:</strong> {selectedLog.description}</p>
                        <p>
                            <strong>Status:</strong>{" "}
                            <span className={getStatusClass(selectedLog.status)}>
                                {selectedLog.status}
                            </span>
                        </p>
                        <p><strong>Total Amount:</strong> {selectedLog.totalAmount}</p>

                        {selectedLog.status === TIMELOG_STATUS.PENDING && (
                            <Row className="mt-3">
                                <Col xs={12} lg={6}>
                                    <CustomButton
                                        variant="success"
                                        label={loading ? <Spinner animation="border" size="sm" /> : "Approve"}
                                        fullWidth
                                        disabled={loading}
                                        onClick={() => handleStatusUpdate(TIMELOG_STATUS.APPROVED)}
                                    />
                                </Col>
                                <Col xs={12} lg={6}>
                                    <CustomButton
                                        variant="danger"
                                        label={loading ? <Spinner animation="border" size="sm" /> : "Reject"}
                                        fullWidth
                                        disabled={loading}
                                        onClick={() => handleStatusUpdate(TIMELOG_STATUS.REJECTED)}
                                    />
                                </Col>
                            </Row>
                        )}
                    </>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default TimeLogDetailModal;
