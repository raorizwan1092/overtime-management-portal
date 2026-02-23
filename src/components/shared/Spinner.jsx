import React from 'react'
import { Spinner } from 'react-bootstrap'

const SharedSpinner = () => {
    return (
        <div>
            <div className="text-center mt-5" >
                <Spinner animation="border" className="text-white mt-5" />
            </div>
        </div>
    )
}

export default SharedSpinner