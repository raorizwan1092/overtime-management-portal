"use client"
import React from 'react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import ToastProvider from '@/components/shared/ToastProvider'
import { AuthProvider } from '@/contexts/AuthContext'

const Provider = ({ children }) => {
    return (
        <div>
            <AuthProvider>
                <ThemeProvider>
                    {children}
                    <ToastProvider />
                </ThemeProvider>
            </AuthProvider>
        </div>
    )
}

export default Provider