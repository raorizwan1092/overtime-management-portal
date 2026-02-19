"use client";
import { useTheme } from '@/contexts/ThemeContext';
import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToastProvider = () => {
    const theme = useTheme()
    return (
        <Toaster
            position="top-center"
            toastOptions={{
                duration: 2000,
                style: {
                    background: theme?.primary,
                    color: theme?.textColor,
                    fontSize: '14px',
                    fontWeight: '500',
                    borderRadius: theme?.radius,
                    padding: '12px 16px',
                    zIndex: 9999,
                },
            }}
            limit={3}
        />
    );
};

export default ToastProvider;