"use client";
import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { Offcanvas } from "react-bootstrap";

const Canvas = ({
    show,
    onHide,
    title = "Offcanvas",
    placement = "end",
    children,
    width = 320,
}) => {
    const theme = useTheme()
    return (
        <Offcanvas show={show} onHide={onHide} placement={placement}
            style={{
                backgroundColor: theme.background,
                color: theme.textColor,
                width: width
            }}
        >
            <Offcanvas.Header closeButton closeVariant="white" style={{borderBottom:"1px solid white"}}>
                <Offcanvas.Title>{title}</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="p-0">
                {children}
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default Canvas;
