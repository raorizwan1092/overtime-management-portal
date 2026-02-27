"use client";

import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isFuture } from "date-fns";
import axios from "axios";
import { useTheme } from "@/contexts/ThemeContext";
import TimeLogCanvas from "./TimeLogCanvas";

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
            const response = await axios.get(`/api/time-logs?month=${month}&year=${year}`);
            const logs = {};
            response.data.forEach(log => {
                logs[log.log_date] = { hours: log.hours, description: log.description };
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
        setSelectedDate(date);
        const dateStr = format(date, "yyyy-MM-dd");
        setFormData(timeLogs[dateStr] || { hours: "", description: "" });
        setShowCanvas(true);
    };


    const handleSaveLog = async values => {
        try {
            setSaving(true);
            const logData = { date: format(selectedDate, "yyyy-MM-dd"), hours: parseFloat(values.hours), description: values.description };
            await axios.post("/api/time-logs", logData);
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
            <Row className="mb-4 align-items-center">
                <Col className="d-flex justify-content-between align-items-center">
                    <Button style={{ border: `1px solid ${theme.primary}`, background: "transparent", color: theme.primary }} onClick={goToPreviousMonth}>
                        &larr; Previous
                    </Button>
                    <h3>{format(currentDate, "MMMM yyyy")}</h3>
                    <Button style={{ border: `1px solid ${theme.primary}`, background: "transparent", color: theme.primary }} onClick={goToNextMonth} disabled={isNextMonthDisabled()}>
                        Next &rarr;
                    </Button>
                </Col>
            </Row>


            {/* Calendar Days */}
            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" style={{ color: theme.secondary }} />
                </div>
            ) : (
                <Row className="g-2 mt-2 d-flex justify-content-center">
                    {getDaysInMonth().map((date, index) => {
                        const dateStr = format(date, "yyyy-MM-dd");
                        const log = timeLogs[dateStr];
                        const isFutureDate = isFuture(date);
                        const isSelected = selectedDate && dateStr === format(selectedDate, "yyyy-MM-dd");
                        const firstDayOfMonth = startOfMonth(currentDate);

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
                            <Col key={index} xs={2} style={{ marginLeft: index === 0 ? `${(firstDayOfMonth.getDay() * 100) / 7}%` : "0" }}>
                                <Card style={cardStyle} onClick={() => handleDateClick(date)}>
                                    <Card.Body className="p-2">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <small style={{ fontWeight: "bold" }}>{format(date, "EEE")}</small> {/* Weekday */}
                                                <br />
                                                <small>{format(date, "d")}</small> {/* Day of month */}
                                            </div>
                                            {log && (
                                                <span style={{ backgroundColor: theme.secondary, color: theme.textColor, padding: "2px 6px", borderRadius: "4px", fontSize: "0.75rem" }}>
                                                    {log.hours}h
                                                </span>
                                            )}
                                        </div>
                                        {log?.description && (
                                            <small style={{ color: theme.grayText }} className="d-block text-truncate">
                                                {log.description}
                                            </small>
                                        )}
                                        {isFutureDate && <small style={{ color: theme.grayText }}>Future</small>}
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            )}


            {error && (
                <div style={{ color: theme.error, padding: "10px", marginTop: "10px", border: `1px solid ${theme.error}`, borderRadius: theme.radius }}>
                    {error}
                    <Button variant="link" onClick={() => setError("")} style={{ color: theme.error, textDecoration: "none", float: "right" }}>
                        ×
                    </Button>
                </div>
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
