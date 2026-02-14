"use client";

import { useTheme } from '@/contexts/ThemeContext'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Nav } from 'react-bootstrap'
import { navLinks } from '@/constants/AppConstants'



const DashboardSidebar = ({ handleClose }) => {
    const theme = useTheme()
    const pathname = usePathname()

    const isActive = (path) => {
        return pathname === path || pathname.startsWith(path + '/')
    }

    return (
        <div
            style={{
                backgroundColor: theme.background,
                color: theme.textColor,
                height: "100%",
                width: "100%",
            }}
        >
            <Nav className="d-flex py-3 px-2 w-100 flex-column">
                {navLinks.map((link) => {
                    const active = isActive(link.path)

                    return (
                        <Link
                            key={link.id}
                            href={link.path}
                            className="text-decoration-none w-100"
                            style={{ borderRadius: theme.radius }}
                            onClick={() => handleClose?.()}
                        >
                            <Nav.Link
                                as="div"
                                className={`d-flex align-items-center justify-content-between py-3 px-3 mb-2 ${active ? 'active' : ''}`}
                                style={{
                                    background: active ? theme.btnBackground : 'transparent',
                                    color: active ? theme.btnText : theme.textColor,
                                    borderRadius: theme.radius,
                                    border: active
                                        ? `1px solid ${theme.primary}`
                                        : `1px solid transparent`,
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                <div className="d-flex align-items-center">
                                    <span
                                        className="me-3"
                                        style={{ opacity: active ? 1 : 0.7 }}
                                    >
                                        {link.icon}
                                    </span>
                                    <span className="fw-medium">{link.name}</span>
                                </div>
                            </Nav.Link>
                        </Link>
                    )
                })}
            </Nav>
        </div>
    )
}

export default DashboardSidebar
