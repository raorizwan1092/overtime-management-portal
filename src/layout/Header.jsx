"use client";
import { useTheme } from '@/contexts/ThemeContext';
import React, { useState } from 'react'
import { Container, Navbar } from 'react-bootstrap'
import { HiMiniBars3CenterLeft } from "react-icons/hi2";
import SmallScreenSidebar from './SmallScreenSidebar';

const NavigationBar = () => {
    const theme = useTheme()
    const [show, setShow] = useState(false);
    return (
        <div >
            <Navbar
                style={{
                    backgroundColor: theme.background,
                    color: theme.textColor,
                    position: "fixed",
                    top: 0,
                    zIndex: 1000
                }}
                className='w-100'
            >
                <Container fluid >
                    <div className='py-2 d-flex gap-3 align-items-center'>
                        <HiMiniBars3CenterLeft size={26} style={{ cursor: "pointer" }} onClick={() => setShow(true)} />
                        <h3 className='mb-0'>Heading</h3>
                    </div>

                </Container>
            </Navbar>
            <SmallScreenSidebar show={show} onHide={() => setShow(false)} />
        </div>
    )
}

export default NavigationBar