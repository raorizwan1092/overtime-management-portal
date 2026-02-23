import NavigationBar from '@/layout/Header'
import Sidebar from '@/layout/Sidebar'
import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'

const DashboardLayout = ({ children }) => {
    return (
        <div>
            <Container fluid style={{ height: "100vh" }}>
                <Row style={{ height: "100%" }}>
                    <Col lg={2} className='px-0 d-none d-md-block' style={{ height: "100%" }}>
                        <Sidebar />
                    </Col>
                    <Col xs={12} lg={10} className='px-0' style={{ height: "100%", overflow: "auto" }}>
                        <NavigationBar />
                        <div className='px-4 py-3'>
                            {children}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default DashboardLayout