import Sidebar from '@/layout/Sidebar'
import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'

const DashboardLayout = ({ children }) => {
    return (
        <div>
            <Container fluid style={{ height: "100vh" }}>
                <Row style={{ height: "100%" }}>
                    <Col xs={2} className='px-0' style={{ height: "100%" }}>
                        <Sidebar />
                    </Col>
                    <Col xs={10} style={{ height: "100%", overflow: "auto" }}>
                        {children}
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default DashboardLayout