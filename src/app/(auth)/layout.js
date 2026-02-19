"use client";
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'

const AuthLayout = ({ children }) => {
    const theme = useTheme();
    return (
        <Container
            fluid
            style={{
                minHeight: '100vh',
                backgroundColor: theme.background,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Row className="w-100 justify-content-center">
                <Col xs={12} md={6} lg={4} className="text-center px-0">
                    <Card style={{ border: theme.border, background: theme.background, borderRadius: theme.radius }} className="p-3 my-5">
                        {children}
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default AuthLayout