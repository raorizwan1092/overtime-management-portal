"use client"
import React from 'react'
import { ThemeProvider } from '@/contexts/ThemeContext'

const Provider = ({ children }) => {
    return (
        <div>
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </div>
    )
}

export default Provider