"use client"
import { useTheme } from '@/contexts/ThemeContext'
import Image from 'next/image'
import React from 'react'

const AuthenticationHeader = ({ heading, subHeading }) => {
    const theme = useTheme()
    return (
        <div className='text-center'>
            {/* <Image
                src={"/logo.png"}
                width={150}
                height={50}
                alt='logo'
            /> */}
            <h4 className='mt-3' style={{ color: theme?.textColor }}>{heading}</h4>
            <p style={{ color: theme?.grayText }}>{subHeading}</p>
        </div>
    )
}

export default AuthenticationHeader