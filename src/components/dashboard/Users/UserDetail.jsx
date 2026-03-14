"use client";
import React, { useEffect, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import toast from "react-hot-toast";
import { TIMELOG_STATUS, USER_ROLES } from "@/constants/AppConstants";
import { getLogsById, getUserTeam } from "@/services/TimeLog";

import Canvas from "@/components/shared/Canvas";
import SharedSpinner from "@/components/shared/Spinner";
import CustomButton from "@/components/shared/Button/Button";

import AddUserCanvas from "./AddUserCanvas";
import DeleteUserCanvas from "./DeleteUserCanvas";
import UserTimeLogCanvas from "./UserTimeLogCanvas";

import { FiEye } from "react-icons/fi";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoPersonRemoveOutline } from "react-icons/io5";
import { unassignTeamMember } from "@/services/Users";

const UserDetail = ({ showCanvas, setShowCanvas, selectedUser, fetchUsers }) => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [team, setTeam] = useState([]);
    const [teamLoading, setTeamLoading] = useState(false);
    const [unAssignLoading, setUnAssignLoading] = useState(false);

    const [showAddCanvas, setShowAddCanvas] = useState(false);
    const [showDeleteCanvas, setShowDeleteCanvas] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);

    const [showUserCanvas, setShowUserCanvas] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [logUser, setLogUser] = useState(null);

    useEffect(() => {
        if (!showCanvas || !selectedUser?._id) return;

        setLogUser(selectedUser);
        fetchLogs(selectedUser._id);

        if (selectedUser.role === USER_ROLES.MANAGER) fetchTeam();
    }, [showCanvas, selectedUser]);

    const fetchLogs = async (userId = selectedUser?._id) => {
        if (!userId) return;
        setLoading(true);
        try {
            const res = await getLogsById(userId);
            setLogs(res?.data?.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchTeam = async () => {
        if (!selectedUser?._id) return;
        setTeamLoading(true);
        try {
            const res = await getUserTeam(selectedUser._id);
            setTeam(res?.data?.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setTeamLoading(false);
        }
    };

    const handleUnassign = async (user) => {
        if (!user?._id) return;
        setUnAssignLoading(true);
        try {
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
            <Canvas show={showCanvas} onHide={() => setShowCanvas(false)} title="User Details" width={800}>
                <div className="p-3">
                    <div className="mb-3">
                        <label className="fw-bold">Name</label>
                        <p className="mb-0">{selectedUser?.name}</p>
                    </div>
                    <div className="mb-4">
                        <label className="fw-bold">Email</label>
                        <p className="mb-0">{selectedUser?.email}</p>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between align-items-center">
                        <h6 className="fw-bold mb-0">Time Logs {logUser ? `- ${logUser.name}` : ""}</h6>
                        <CustomButton
                            label="Get TimeLogs"
                            onClick={() => {
                                setSelectedUserId(logUser?._id);
                                setShowUserCanvas(true);
                            }}
                        />
                    </div>
                    {selectedUser.role === USER_ROLES.MANAGER && (
                        <>
                            <hr />
                            <div className="d-flex justify-content-between mb-2">
                                <h6 className="fw-bold mb-3">Team Members</h6>
                                <CustomButton
                                    label="Add Member"
                                    onClick={() => {
                                        setShowCanvas(false);
                                        setShowAddCanvas(true);
                                    }}
                                />
                            </div>

                            {teamLoading || unAssignLoading ? (
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
                                                        onClick={() => {
                                                            setSelectedUserId(member._id);
                                                            setShowUserCanvas(true);
                                                        }}
                                                    />
                                                    <RiDeleteBin6Fill
                                                        size={18}
                                                        style={{ cursor: "pointer" }}
                                                        className="mx-2 text-danger"
                                                        onClick={() => setSelectedMember(member) || setShowDeleteCanvas(true)}
                                                    />
                                                    <CustomButton
                                                        label={<IoPersonRemoveOutline size={14} />}
                                                        onClick={() => handleUnassign(member)}
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



                </div>
            </Canvas>

            <AddUserCanvas
                showCanvas={showAddCanvas}
                setShowCanvas={setShowAddCanvas}
                fetchUsers={fetchTeam}
                hideRole
                managerId={selectedUser._id}
            />
            <DeleteUserCanvas
                showCanvas={showDeleteCanvas}
                setShowCanvas={setShowDeleteCanvas}
                selectedUser={selectedMember}
                fetchUserTable={fetchTeam}
            />
            {selectedUserId && (
                <UserTimeLogCanvas
                    userId={selectedUserId}
                    showCanvas={showUserCanvas}
                    setShowCanvas={setShowUserCanvas}
                    title="Time Logs"
                />
            )}
        </>
    );
};

export default UserDetail;
