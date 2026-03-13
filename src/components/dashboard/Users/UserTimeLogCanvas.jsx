"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isFuture } from "date-fns";
import { useTheme } from "@/contexts/ThemeContext";
import SharedSpinner from "@/components/shared/Spinner";
import CustomButton from "../../shared/Button/Button";
import Canvas from "@/components/shared/Canvas";
import { getLogsById } from "@/services/TimeLog";
import { getStatusClass } from "@/utils/TimeLog";
import TimeLogDetailModal from "./TimeLogDetailModal";

const UserTimeLogCanvas = ({ userId, showCanvas, setShowCanvas, title }) => {
    const theme = useTheme();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [timeLogs, setTimeLogs] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedLog, setSelectedLog] = useState(null);
    const [showLogModal, setShowLogModal] = useState(false);

    const fetchTimeLogs = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const response = await getLogsById(userId);
            const logs = {};
            response?.data?.data?.forEach((log) => {
                const dateKey = format(new Date(log.date), "yyyy-MM-dd");
                logs[dateKey] = { ...log, totalAmount: log.totalAmount || 0 };
            });
            setTimeLogs(logs);
            setError("");
        } catch (err) {
            console.error(err);
            setError("Failed to load time logs");
        } finally {
            setLoading(false);
        }
    }, [userId]);
    useEffect(() => {
        if (!showCanvas || !userId) return;
        fetchTimeLogs();
    }, [showCanvas, userId, fetchTimeLogs]);

    // Set currentDate only once when canvas opens
    useEffect(() => {
        if (!showCanvas) return;
        const logDates = Object.keys(timeLogs);
        if (logDates.length > 0) {
            setCurrentDate(new Date(logDates[0]));
        } else {
            setCurrentDate(new Date());
        }
    }, [showCanvas]);


    const getDaysInMonth = () =>
        eachDayOfInterval({ start: startOfMonth(currentDate), end: endOfMonth(currentDate) });

    const goToPreviousMonth = () =>
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

    const goToNextMonth = () => {
        const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        if (nextMonth <= new Date()) setCurrentDate(nextMonth);
    };

    const isNextMonthDisabled = () =>
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1) > new Date();

    const handleCardClick = (log, date) => {
        if (!log) return;
        setSelectedLog({ ...log, date });
        setShowLogModal(true);
    };

    const getCardStyle = (date, log) => {
        const future = isFuture(date);
        return {
            borderRadius: theme.radius,
            height: "100px",
            cursor: log && !future ? "pointer" : "not-allowed",
            overflow: "hidden",
            color: future ? theme.grayText : theme.textColor,
            backgroundColor: log ? `${theme.secondary}20` : theme.cardBackground,
            border: isToday(date) ? `2px solid ${theme.textColor}` : "2px solid transparent",
        };
    };

    return (
        <>
            <Canvas show={showCanvas} onHide={() => setShowCanvas(false)} title={title || "User Time Logs"} width={900}>
                <div style={{ backgroundColor: theme.background, color: theme.textColor, padding: "1rem" }}>
                    <Row className="my-2 align-items-center">
                        <Col className="d-flex justify-content-between align-items-center">
                            <CustomButton label="Previous" onClick={goToPreviousMonth} />
                            <h3>{format(currentDate, "MMMM yyyy")}</h3>
                            <CustomButton label="Next" onClick={goToNextMonth} disabled={isNextMonthDisabled()} />
                        </Col>
                    </Row>

                    {loading ? (
                        <SharedSpinner />
                    ) : error ? (
                        <p style={{ color: "red" }}>{error}</p>
                    ) : (
                        <Row className="g-2 mt-2 d-flex justify-content-center">
                            {getDaysInMonth().map((date, idx) => {
                                const dateStr = format(date, "yyyy-MM-dd");
                                const log = timeLogs[dateStr];

                                return (
                                    <Col key={idx} xs={6} md={3} lg={2}>
                                        <Card style={getCardStyle(date, log)} onClick={() => handleCardClick(log, date)}>
                                            <Card.Body className="p-2 d-flex flex-column justify-content-between">
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        <small style={{ fontWeight: "bold" }}>{format(date, "EEE")}</small>
                                                        <small className="ms-3">{format(date, "d")}</small>
                                                    </div>
                                                    {log && (
                                                        <div>
                                                            <span
                                                                style={{
                                                                    backgroundColor: theme.background,
                                                                    color: theme.textColor,
                                                                    padding: "2px 6px",
                                                                    borderRadius: "4px",
                                                                    fontSize: "0.75rem",
                                                                }}
                                                            >
                                                                {log.hours}h
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    {log ? (
                                                        <span className={getStatusClass(log.status)} style={{ fontSize: "12px" }}>
                                                            {log.status}
                                                        </span>
                                                    ) : (
                                                        <small style={{ color: theme.grayText, fontSize: "12px" }}>No log</small>
                                                    )}
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                );
                            })}
                        </Row>
                    )}
                </div>
            </Canvas>

            <TimeLogDetailModal
                show={showLogModal}
                onHide={() => setShowLogModal(false)}
                selectedLog={selectedLog}
                setSelectedLog={setSelectedLog}
                onStatusUpdated={() => fetchTimeLogs()}
            />
        </>
    );
};

export default UserTimeLogCanvas;
