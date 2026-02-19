"use client"
import React from 'react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import ToastProvider from '@/components/shared/ToastProvider'

const Provider = ({ children }) => {
    return (
        <div>
            <ThemeProvider>
                {children}
                <ToastProvider />
            </ThemeProvider>
        </div>
    )
}

export default Provider