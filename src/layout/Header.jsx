"use client";
import { useTheme } from '@/contexts/ThemeContext';
import React, { useState } from 'react';
import { Container, Navbar } from 'react-bootstrap';
import { HiMiniBars3CenterLeft } from "react-icons/hi2";
import SmallScreenSidebar from './SmallScreenSidebar';
import CustomButton from '@/components/shared/Button/Button';
import { RiLogoutCircleRLine } from "react-icons/ri";
import { Logout } from '@/services/Users';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const NavigationBar = () => {
    const theme = useTheme();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            setLoading(true);
            const response = await Logout();
            console.log("response",response)

            if (response?.data.success) {
                toast.success("Logged out successfully");
                router.push("/signin");
            }
        } catch (error) {
            toast.error(error?.response?.data?.error || "Logout failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar
                style={{
                    backgroundColor: theme.background,
                    color: theme.textColor,
                    position: "fixed",
                    top: 0,
                    zIndex: 1000,
                    borderBottom: theme.border
                }}
                className='w-100'
            >
                <Container fluid>
                    <div className='py-2 d-flex gap-3 align-items-center justify-content-between'>
                        <div className='d-flex gap-3 align-items-center'>
                            <HiMiniBars3CenterLeft
                                size={26}
                                className='d-block d-md-none'
                                style={{ cursor: "pointer" }}
                                onClick={() => setShow(true)}
                            />
                            <h3 className='mb-0'>Heading</h3>
                        </div>

                        <div>
                            <CustomButton
                                label={<RiLogoutCircleRLine size={28} className='text-danger' />}
                                onClick={handleLogout}
                                loading={loading}
                                className='bg-transparent border-0 p-0'
                                style={{ borderColor: theme.border, color: theme.textColor }}
                            />
                        </div>
                    </div>
                </Container>
            </Navbar>
            <SmallScreenSidebar show={show} onHide={() => setShow(false)} />
        </div>
    );
};

export default NavigationBar;
