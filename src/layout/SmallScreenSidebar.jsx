import Canvas from '@/components/shared/Canvas'
import React from 'react'
import DashboardSidebar from './Sidebar'

const SmallScreenSidebar = ({ show, onHide }) => {
    return (
        <>
            <Canvas
                show={show}
                onHide={onHide}
                title="Navigation Bar"
                placement='start'
            >
               <DashboardSidebar/>
            </Canvas>
        </>
    )
}

export default SmallScreenSidebar