"use client";

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isFuture } from 'date-fns';
import axios from 'axios';
import { useTheme } from '@/contexts/ThemeContext';
import  TimeLogModal  from './TimeLogCanvas';

const Timelog = () => {
    const theme = useTheme();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [timeLogs, setTimeLogs] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [formData, setFormData] = useState({
        hours: '',
        description: ''
    });
    const [saving, setSaving] = useState(false);

    // Fetch time logs for current month
    useEffect(() => {
        fetchTimeLogs();
    }, [currentDate]);

    const fetchTimeLogs = async () => {
        try {
            setLoading(true);
            const month = format(currentDate, 'MM');
            const year = format(currentDate, 'yyyy');

            const response = await axios.get(`/api/time-logs?month=${month}&year=${year}`);
            const logs = {};

            // Convert array to object with date as key
            response.data.forEach(log => {
                logs[log.log_date] = {
                    hours: log.hours,
                    description: log.description
                };
            });

            setTimeLogs(logs);
            setError('');
        } catch (err) {
            setError('Failed to load time logs');
            console.error('Error fetching time logs:', err);
        } finally {
            setLoading(false);
        }
    };

    // Get days in current month
    const getDaysInMonth = () => {
        const start = startOfMonth(currentDate);
        const end = endOfMonth(currentDate);
        return eachDayOfInterval({ start, end });
    };

    // Handle month navigation
    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        // Prevent navigating to future months beyond current month
        const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        const currentMonth = new Date();

        if (nextMonth <= currentMonth || nextMonth.getMonth() === currentMonth.getMonth()) {
            setCurrentDate(nextMonth);
        }
    };

    const goToCurrentMonth = () => {
        setCurrentDate(new Date());
    };

    // Check if next month navigation should be disabled
    const isNextMonthDisabled = () => {
        const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        const currentMonth = new Date();
        return nextMonth > currentMonth && nextMonth.getMonth() !== currentMonth.getMonth();
    };

    // Handle date click
    const handleDateClick = (date) => {
        // Don't allow clicking on future dates
        if (isFuture(date)) {
            return;
        }

        const dateStr = format(date, 'yyyy-MM-dd');
        setSelectedDate(date);

        // Populate form with existing data if available
        if (timeLogs[dateStr]) {
            setFormData({
                hours: timeLogs[dateStr].hours,
                description: timeLogs[dateStr].description || ''
            });
        } else {
            setFormData({
                hours: '',
                description: ''
            });
        }

        setShowModal(true);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Save time log
    const handleSaveLog = async () => {
        if (!formData.hours || formData.hours <= 0) {
            alert('Please enter valid hours');
            return;
        }

        if (formData.hours > 24) {
            alert('Hours cannot exceed 24');
            return;
        }

        try {
            setSaving(true);
            const logData = {
                date: format(selectedDate, 'yyyy-MM-dd'),
                hours: parseFloat(formData.hours),
                description: formData.description
            };

            await axios.post('/api/time-logs', logData);

            // Refresh logs
            await fetchTimeLogs();

            // Close modal
            setShowModal(false);
            setFormData({ hours: '', description: '' });

        } catch (err) {
            setError('Failed to save time log');
            console.error('Error saving time log:', err);
        } finally {
            setSaving(false);
        }
    };

    // Get total hours for the month
    const getTotalHours = () => {
        return Object.values(timeLogs).reduce((total, log) => total + log.hours, 0);
    };

    // Custom styles using theme
    const styles = {
        container: {
            backgroundColor: theme.background,
            color: theme.textColor,
        },
        card: {
            backgroundColor: theme.cardBackground,
            border: theme.border,
            borderRadius: theme.radius,
            color: theme.textColor
        },
        button: {
            backgroundColor: theme.btnBackground,
            color: theme.btnText,
            border: 'none',
            borderRadius: theme.radius
        },
        buttonOutline: {
            backgroundColor: 'transparent',
            color: theme.primary,
            border: `1px solid ${theme.primary}`,
            borderRadius: theme.radius
        },
        calendarDay: {
            backgroundColor: theme.cardBackground,
            border: theme.border,
            borderRadius: theme.radius,
            color: theme.textColor,
            height: '100px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            overflow: 'hidden'
        },
        disabledDay: {
            backgroundColor: theme.cardBackground,
            border: theme.border,
            borderRadius: theme.radius,
            color: theme.grayText,
            height: '100px',
            opacity: 0.5,
            cursor: 'not-allowed',
            overflow: 'hidden'
        },
        todayDay: {
            backgroundColor: theme.cardBackground,
            border: `2px solid ${theme.textColor}`,
            borderRadius: theme.radius,
            color: theme.textColor,
            height: '100px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            overflow: 'hidden'
        },
        loggedDay: {
            backgroundColor: `${theme.secondary}20`, // 20% opacity
            border: theme.border,
            borderRadius: theme.radius,
            color: theme.textColor,
            height: '100px',
            cursor: 'pointer',
            transition: 'all 0.2s',
            overflow: 'hidden'
        },
        hoursBadge: {
            backgroundColor: theme.secondary,
            color: theme.textColor,
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '0.75rem'
        },
        modalHeader: {
            backgroundColor: theme.cardBackground,
            color: theme.textColor,
            borderBottom: theme.border
        },
        modalBody: {
            backgroundColor: theme.background,
            color: theme.textColor
        },
        modalFooter: {
            backgroundColor: theme.cardBackground,
            borderTop: theme.border
        },
        formControl: {
            backgroundColor: theme.cardBackground,
            color: theme.textColor,
            border: theme.border,
            borderRadius: theme.radius
        },
        formLabel: {
            color: theme.textColor
        },
        error: {
            color: theme.error,
            backgroundColor: `${theme.error}20`,
            border: `1px solid ${theme.error}`,
            borderRadius: theme.radius,
            padding: '10px'
        },
        summaryValue: {
            color: theme.secondary
        }
    };

    return (
        <div style={styles.container}>
            <Row className="mb-4">
                <Col className="d-flex justify-content-between align-items-center">
                    <Button
                        style={styles.buttonOutline}
                        onClick={goToPreviousMonth}
                    >
                        &larr; Previous
                    </Button>
                    <h3 style={{ color: theme.textColor }}>{format(currentDate, 'MMMM yyyy')}</h3>
                    <Button
                        style={isNextMonthDisabled() ? { ...styles.buttonOutline, opacity: 0.5, cursor: 'not-allowed' } : styles.buttonOutline}
                        onClick={goToNextMonth}
                        disabled={isNextMonthDisabled()}
                    >
                        Next &rarr;
                    </Button>
                </Col>
            </Row>



            {loading ? (
                <div className="text-center py-5">
                    <Spinner
                        animation="border"
                        style={{ color: theme.secondary }}
                    />
                </div>
            ) : (
                <>
                    <Row className="g-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <Col key={day} xs={1} className="text-center fw-bold">
                                <span style={{ color: theme.grayText }}>{day}</span>
                            </Col>
                        ))}
                    </Row>

                    {/* Calendar Days */}
                    <Row className="g-2 mt-2">
                        {getDaysInMonth().map((date, index) => {
                            const dateStr = format(date, 'yyyy-MM-dd');
                            const log = timeLogs[dateStr];
                            const isCurrentMonth = isSameMonth(date, currentDate);
                            const isCurrentDay = isToday(date);
                            const isFutureDate = isFuture(date);

                            // Determine card style
                            let cardStyle = { ...styles.calendarDay };

                            if (!isCurrentMonth) {
                                cardStyle = { ...cardStyle, opacity: 0.5 };
                            }

                            if (isFutureDate) {
                                cardStyle = styles.disabledDay;
                            } else if (isCurrentDay) {
                                cardStyle = styles.todayDay;
                            } else if (log) {
                                cardStyle = styles.loggedDay;
                            }

                            return (
                                <Col key={index} xs={1}>
                                    <Card
                                        style={cardStyle}
                                        onClick={() => !isFutureDate && handleDateClick(date)}
                                        className={!isFutureDate ? 'hover-effect' : ''}
                                    >
                                        <Card.Body className="p-2">
                                            <div className="d-flex justify-content-between">
                                                <small style={{ color: isFutureDate ? theme.grayText : theme.textColor }}>
                                                    {format(date, 'd')}
                                                </small>
                                                {log && !isFutureDate && (
                                                    <span style={styles.hoursBadge}>
                                                        {log.hours}h
                                                    </span>
                                                )}
                                            </div>
                                            {log && log.description && !isFutureDate && (
                                                <small
                                                    style={{ color: theme.grayText }}
                                                    className="d-block text-truncate"
                                                >
                                                    {log.description}
                                                </small>
                                            )}
                                            {isFutureDate && (
                                                <small style={{ color: theme.grayText }} className="d-block">
                                                    Future
                                                </small>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                </>
            )}
            {error && (
                <div style={styles.error} className="mb-4 d-flex justify-content-between align-items-center">
                    <span>{error}</span>
                    <Button
                        variant="link"
                        onClick={() => setError('')}
                        style={{ color: theme.error, textDecoration: 'none' }}
                    >
                        ×
                    </Button>
                </div>
            )}

            <TimeLogModal
                show={showModal}
                onHide={() => setShowModal(false)}
                selectedDate={selectedDate}
                formData={formData}
                onChange={handleInputChange}
                onSave={handleSaveLog}
                saving={saving}
            />


        </div>
    );
};

export default Timelog;