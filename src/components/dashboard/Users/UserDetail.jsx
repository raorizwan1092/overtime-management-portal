"use client";
import React, { useEffect, useState } from "react";
import {  Col, Row, Table } from "react-bootstrap";
import { TIMELOG_STATUS, USER_ROLES } from "@/constants/AppConstants";
import { getLogsById, updateLogStatus, getUserTeam } from "@/services/TimeLog";
import Canvas from "@/components/shared/Canvas";
import SharedSpinner from "@/components/shared/Spinner";
import CustomButton from "@/components/shared/Button/Button";
import AddUserCanvas from "./AddUserCanvas";
import { RiDeleteBin6Fill } from "react-icons/ri";
import DeleteUserCanvas from "./DeleteUserCanvas";
import { FiEye } from "react-icons/fi";
import { unassignTeamMember } from "@/services/Users";
import toast from "react-hot-toast";
import { IoPersonRemoveOutline } from "react-icons/io5";

const UserDetail = ({ showCanvas, setShowCanvas, selectedUser, fetchUsers }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [team, setTeam] = useState([]);
    const [teamLoading, setTeamLoading] = useState(false);
    const [showAddCanvas, setShowAddCanvas] = useState(false);
    const [showDeleteCanvas, setShowDeleteCanvas] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [logUser, setLogUser] = useState(null);
    const [unAssignLoading, setUnAssignLoading] = useState(false);
    useEffect(() => {
        if (showCanvas && selectedUser?._id) {
            setLogUser(selectedUser);
            fetchLogs(selectedUser._id);

            if (selectedUser.role === "MANAGER") fetchTeam();
        }
    }, [showCanvas, selectedUser]);


    const fetchLogs = async (userId) => {
        try {
            setLoading(true);
            const res = await getLogsById(userId);
            setLogs(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    const fetchTeam = async () => {
        try {
            setTeamLoading(true);
            const res = await getUserTeam(selectedUser._id);
            setTeam(res.data.data || []);
            setShowCanvas(true)
        } catch (err) {
            console.error(err);
        } finally {
            setTeamLoading(false);
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await updateLogStatus(id, status);
            fetchLogs();
        } catch (err) {
            console.error(err);
        }
    };
    const handleViewDeleteUser = (user) => {
        setSelectedMember(user);
        setShowDeleteCanvas(true);
    };
    const handleViewUser = (user) => {
        setLogUser(user);
        fetchLogs(user._id);
    };



    const handleUnassign = async (user) => {
        if (!user?._id) return;

        try {
            setUnAssignLoading(true);

            await unassignTeamMember(user._id);

            toast.success("Employee unassigned from manager");

            fetchTeam();
            fetchUsers();

        } catch (err) {
            console.error(err);
            toast.error("Failed to unassign employee");
        } finally {
            setUnAssignLoading(false);
        }
    };



    if (!selectedUser) return null;

    return (
        <>
            <Canvas
                show={showCanvas}
                onHide={() => setShowCanvas(false)}
                title="User Details"
                width={800}
            >
                <div className="p-3">

                    {/* User Info */}
                    <div className="mb-3">
                        <label className="fw-bold">Name</label>
                        <p className="mb-0">{selectedUser?.name}</p>
                    </div>

                    <div className="mb-4">
                        <label className="fw-bold">Email</label>
                        <p className="mb-0">{selectedUser?.email}</p>
                    </div>

                    {selectedUser.role === USER_ROLES.MANAGER && (
                        <>
                            <hr />
                            <div className="d-flex justify-content-between">
                                <div>
                                    <h6 className="fw-bold mb-3">Team Members</h6>
                                </div>
                                <div>
                                    <div className="d-flex justify-content-end mb-2">
                                        <CustomButton onClick={() => {
                                            setShowCanvas(false)
                                            setShowAddCanvas(true)
                                        }}
                                            label="Add Member" />
                                    </div>
                                </div>
                            </div>

                            {teamLoading ? (
                                <div className="pb-5">
                                    <SharedSpinner />
                                </div>
                            ) : team.length === 0 ? (
                                <p>No team members found</p>
                            ) : (
                                <Table striped bordered hover size="sm" responsive>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {team.map((member, idx) => (
                                            <tr key={member._id}>
                                                <td>{idx + 1}</td>
                                                <td>{member.name}</td>
                                                <td>{member.email}</td>
                                                <td>{member.phone || "-"}</td>
                                                <td className="d-flex gap-2 align-items-center">
                                                    <FiEye
                                                        size={18}
                                                        style={{ cursor: "pointer" }}
                                                        title="View User"
                                                        onClick={() => handleViewUser(member)}

                                                    />
                                                    <RiDeleteBin6Fill
                                                        size={18}
                                                        style={{ cursor: "pointer" }}
                                                        title="View User"
                                                        className="mx-2 text-danger"
                                                        onClick={() => handleViewDeleteUser(member)}
                                                    />
                                                    <CustomButton
                                                        label={<IoPersonRemoveOutline size={14} />}
                                                        onClick={() => handleUnassign(member)}
                                                        loading={unAssignLoading}
                                                        variant="link"
                                                        className="text-white px-0"

                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </>
                    )}

                    <hr />
                    <div className="d-flex justify-content-between">
                        <h6 className="fw-bold mb-3">
                            Time Logs {logUser ? `- ${logUser.name}` : ""}
                        </h6>

                        <CustomButton
                            label={"Back to Manager Logs"}
                            onClick={() => handleViewUser(selectedUser)}
                        />

                    </div>

                    {loading ? (
                        <div className="pb-5">
                            <SharedSpinner />
                        </div>

                    ) : logs.length === 0 ? (
                        <p>No timelogs found</p>
                    ) : (
                        <Row>
                            {logs.map((log) => (
                                <Col xs={12} lg={6} key={log._id}>
                                    <div className="border p-2 my-2 rounded" style={{ height: "100%" }}>
                                        <div><strong>Date:</strong> {new Date(log.date).toLocaleDateString()}</div>
                                        <div><strong>Hours:</strong> {log.hours}</div>
                                        <div><strong>Description:</strong> {log.description}</div>
                                        <div><strong>Amount:</strong> {log.totalAmount}</div>

                                        <div className="mb-2">
                                            <strong>Status:</strong>{" "}
                                            <span
                                                className={
                                                    log.status === TIMELOG_STATUS.APPROVED
                                                        ? "text-success"
                                                        : log.status === TIMELOG_STATUS.REJECTED
                                                            ? "text-danger"
                                                            : "text-warning"
                                                }
                                            >
                                                {log.status}
                                            </span>
                                        </div>

                                        {log.status === TIMELOG_STATUS.PENDING && (
                                            <Row className="mt-2">
                                                <Col xs={12} lg={6}>
                                                    <CustomButton
                                                        variant="success"
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                log._id,
                                                                TIMELOG_STATUS.APPROVED
                                                            )
                                                        }
                                                        label="Approve"
                                                        fullWidth
                                                        className="mb-1"
                                                    />
                                                </Col>

                                                <Col xs={12} lg={6}>
                                                    <CustomButton
                                                        variant="danger"
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                log._id,
                                                                TIMELOG_STATUS.REJECTED
                                                            )
                                                        }
                                                        loading={loading}
                                                        label="Reject"
                                                        fullWidth
                                                        className="mb-1"
                                                    />
                                                </Col>
                                            </Row>
                                        )}
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    )}


                </div>
            </Canvas>
            <AddUserCanvas
                showCanvas={showAddCanvas}
                setShowCanvas={setShowAddCanvas}
                fetchUsers={fetchTeam}
                hideRole={true}
                managerId={selectedUser._id}
            />
            <DeleteUserCanvas
                showCanvas={showDeleteCanvas}
                setShowCanvas={setShowDeleteCanvas}
                selectedUser={selectedMember}
                fetchUsers={fetchTeam}
                fetchUserTable={fetchUsers}
            />
        </>
    );
};

export default UserDetail;
