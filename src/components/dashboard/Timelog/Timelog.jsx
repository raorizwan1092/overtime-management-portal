"use client";

import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isFuture } from "date-fns";
import axios from "axios";
import { useTheme } from "@/contexts/ThemeContext";
import TimeLogCanvas from "./TimeLogCanvas";
import { addTimeLog, getTimeLog } from "@/services/TimeLog";
import CustomButton from "../../shared/Button/Button";
import SharedSpinner from "@/components/shared/Spinner";

const Timelog = () => {
    const theme = useTheme();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [timeLogs, setTimeLogs] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showCanvas, setShowCanvas] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [formData, setFormData] = useState({ hours: "", description: "" });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchTimeLogs();
    }, [currentDate]);

    const fetchTimeLogs = async () => {
        try {
            setLoading(true);

            const month = format(currentDate, "MM");
            const year = format(currentDate, "yyyy");

            const data = await getTimeLog(month, year);

            const logs = {};

            data?.data?.forEach(log => {
                const formattedDate = format(
                    new Date(log.date),
                    "yyyy-MM-dd"
                );

                logs[formattedDate] = {
                    hours: log.hours,
                    description: log.description,
                    status: log.status,
                    totalAmount: log.totalAmount || 0,
                };
            });

            setTimeLogs(logs);
            setError("");
        } catch (err) {
            console.error(err);
            setError("Failed to load time logs");
        } finally {
            setLoading(false);
        }
    };


    const getDaysInMonth = () => eachDayOfInterval({ start: startOfMonth(currentDate), end: endOfMonth(currentDate) });

    const goToPreviousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const goToNextMonth = () => {
        const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        if (nextMonth <= new Date()) setCurrentDate(nextMonth);
    };
    const isNextMonthDisabled = () => new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1) > new Date();

    const handleDateClick = date => {
        if (isFuture(date)) return;

        const dateStr = format(date, "yyyy-MM-dd");
        const log = timeLogs[dateStr];
        if (log?.status === "APPROVED") return;

        setSelectedDate(date);
        setFormData(log || { hours: "", description: "" });
        setShowCanvas(true);
    };



    const handleSaveLog = async values => {
        try {
            setSaving(true);
            const logData = { date: format(selectedDate, "yyyy-MM-dd"), hours: parseFloat(values.hours), description: values.description };
            await addTimeLog(logData);
            await fetchTimeLogs();
            setShowCanvas(false);
        } catch (err) {
            console.error(err);
            setError("Failed to save time log");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ backgroundColor: theme.background, color: theme.textColor }}>
            <Row className="my-2 align-items-center">
                <Col className="d-flex justify-content-between align-items-center">
                    <CustomButton label={"Previous"} onClick={goToPreviousMonth} />
                  

                    <h3>{format(currentDate, "MMMM yyyy")}</h3>
                    <CustomButton label={"Next"} onClick={goToNextMonth} disabled={isNextMonthDisabled()} />
                </Col>
            </Row>

            {loading ? (
                <SharedSpinner/>
            ) : (
                <Row className="g-2 mt-2 d-flex justify-content-center">
                    {getDaysInMonth().map((date, index) => {
                        const dateStr = format(date, "yyyy-MM-dd");
                        const log = timeLogs[dateStr];
                        const isFutureDate = isFuture(date);
                        const isSelected = selectedDate && dateStr === format(selectedDate, "yyyy-MM-dd");

                        let cardStyle = {
                            borderRadius: theme.radius,
                            height: "100px",
                            cursor: isFutureDate ? "not-allowed" : "pointer",
                            overflow: "hidden",
                            opacity: isSameMonth(date, currentDate) ? 1 : 0.5,
                            color: isFutureDate ? theme.grayText : theme.textColor,
                            backgroundColor: log ? `${theme.secondary}20` : theme.cardBackground,
                            border: "2px solid transparent",
                        };
                        if (isToday(date) && !isSelected) {
                            cardStyle.border = `2px solid ${theme.textColor}`;
                        }
                        if (isSelected) {
                            cardStyle.border = `2px solid ${theme.textColor}`;
                        }

                        if (!isSameMonth(date, currentDate)) cardStyle.opacity = 0.5;
                        if (log) cardStyle.backgroundColor = `${theme.secondary}20`;
                        if (isFutureDate) cardStyle.color = theme.grayText;

                        return (
                            <Col key={index} xs={6} md={3} lg={2}>
                                <Card style={cardStyle} onClick={() => handleDateClick(date)}>
                                    <Card.Body className="p-2">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <small style={{ fontWeight: "bold" }}>{format(date, "EEE")}</small> {/* Weekday */}
                                                <br />
                                                <small>{format(date, "d")}</small>
                                            </div>
                                            {log && (
                                                <div className="d-flex flex-column align-items-end">
                                                    <span
                                                        style={{
                                                            padding: "2px 6px",
                                                            borderRadius: "4px",
                                                            fontSize: "0.65rem",
                                                            color:
                                                                log.status === "APPROVED"
                                                                    ? "#28a745"
                                                                    : log.status === "REJECTED"
                                                                        ? "#dc3545"
                                                                        : "#ffc107",
                                                            backgroundColor: theme?.background,
                                                            marginBottom: "4px"
                                                        }}
                                                    >
                                                        {log.status}
                                                    </span>

                                                    <span
                                                        style={{
                                                            backgroundColor: theme.background,
                                                            color: theme.textColor,
                                                            padding: "2px 6px",
                                                            borderRadius: "4px",
                                                            fontSize: "0.75rem"
                                                        }}
                                                    >
                                                        {log.hours}h
                                                    </span>
                                                    <span
                                                        style={{
                                                            padding: "2px 6px",
                                                            borderRadius: "4px",
                                                            fontSize: "0.65rem",
                                                            color: theme?.textColor,
                                                            backgroundColor: theme?.background,
                                                            marginBottom: "4px"
                                                        }}
                                                    >
                                                        {log.totalAmount || 0}
                                                    </span>
                                                </div>
                                            )}

                                        </div>
                                        {/* {log?.description && (
                                            <small style={{ color: theme.grayText }} className="d-block text-truncate">
                                                {log.description}
                                            </small>
                                        )} */}
                                        {isFutureDate && <small style={{ color: theme.grayText }}>Future</small>}
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            )}
            <TimeLogCanvas
                show={showCanvas}
                onHide={() => {
                    setShowCanvas(false);
                    setSelectedDate(null);
                }}
                selectedDate={selectedDate}
                initialData={formData}
                onSave={handleSaveLog}
            />
        </div>
    );
};

export default Timelog;
