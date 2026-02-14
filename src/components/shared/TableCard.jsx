"use client"
import { useTheme } from '@/contexts/ThemeContext'
import React from 'react'
import { Card } from 'react-bootstrap'

const TableCard = ({ children }) => {
    const theme = useTheme()
    return (
        <Card
            className="my-2"
            style={{
                boxShadow: "rgba(255, 255, 255, 0.35) 0px 5px 15px",
                background: theme?.background,
                borderRadius: theme?.radius,
                overflow: "hidden"
            }}
        >
            <Card.Body style={{ padding: "20px" }}>
                {children}
            </Card.Body>
        </Card>
    )
}

export default TableCard