"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Table, Pagination, Form } from "react-bootstrap";
import { FiEye } from "react-icons/fi";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa6";
import { useDebounce } from "use-debounce";
import { GetAllUsers } from "@/services/Users";
import TableCard from "../../shared/TableCard";
import CustomButton from "../../shared/Button/Button";
import SharedSpinner from "../../shared/Spinner";
import { USER_ROLES } from "@/constants/AppConstants";
import { useAuth } from "@/contexts/AuthContext";
import AddUserCanvas from "./AddUserCanvas";
import UserDetail from "./UserDetail";
import { RiDeleteBin6Fill, RiUserAddFill } from "react-icons/ri";
import DeleteUserCanvas from "./DeleteUserCanvas";
import AssignManagerCanvas from "./AssignManagerCanvas";

const UserTable = () => {
    const { user } = useAuth()
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch] = useDebounce(searchTerm, 500);
    const [showAddCanvas, setShowAddCanvas] = useState(false);
    const [showDetailCanvas, setShowDetailCanvas] = useState(false);
    const [showDeleteCanvas, setShowDeleteCanvas] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showAssignCanvas, setShowAssignCanvas] = useState(false);
    const [filter, setFilter] = useState("");

    const fetchUsers = useCallback(async (pageNumber = 1, search = "", filterType = "") => {
        setLoading(true);
        try {
            const response = await GetAllUsers(pageNumber, search, filterType);
            if (response?.data?.success) {
                setUsers(response.data.users || []);
                setPagination(response.data.pagination || null);
            }
        } catch (error) {
            toast.error(error?.response?.data?.error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }, []);

    const handleAddUser = () => {
        setSelectedUser(null);
        setShowAddCanvas(true);
    };

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setShowDetailCanvas(true);
    };

    const handleViewAssignCanvas = (user) => {
        setSelectedUser(user);
        setShowAssignCanvas(true);
    };

    const handleViewDeleteUser = (user) => {
        setSelectedUser(user);
        setShowDeleteCanvas(true);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        fetchUsers(currentPage, debouncedSearch, filter);
    }, [currentPage, debouncedSearch, filter, fetchUsers]);

    return (
        <div>
            {user?.role === USER_ROLES.HR && (
                <div className="d-flex justify-content-between mb-4">
                    <CustomButton
                        label={
                            <>
                                <FaPlus className="me-2" />
                                Add User
                            </>
                        }
                        onClick={handleAddUser}
                    />

                    <Form.Select
                        style={{ width: "220px" }}
                        value={filter}
                        onChange={(e) => {
                            setFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">Managers & HR</option>
                        <option value="unassigned">Unassigned Employees</option>
                    </Form.Select>
                </div>
            )}

            <div className="mb-4 user-input">
                <Form.Control
                    type="text"
                    placeholder="Search by name or email..."
                    className="bg-black text-white"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />
            </div>

            {loading ? (
                <SharedSpinner />
            ) : (
                <TableCard>
                    <Table responsive className="mb-0">
                        <thead>
                            <tr>
                                <th style={{ width: "80px" }}>No.</th>
                                <th style={{ width: "25%" }}>Name</th>
                                <th style={{ width: "30%" }}>Email</th>
                                <th style={{ width: "15%" }}>Phone</th>
                                <th style={{ width: "10%" }}>Role</th>
                                <th style={{ width: "10%" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                users.map((user, index) => (
                                    <tr key={user._id}>
                                        <td>{(currentPage - 1) * (pagination?.limit || 10) + index + 1}</td>
                                        <td>{user?.name || "-"}</td>
                                        <td>{user?.email}</td>
                                        <td>{user?.phone}</td>
                                        <td>{user?.role}</td>
                                        <td>
                                            {user.role === USER_ROLES.EMPLOYEE && !user.managerId ? (
                                                <RiUserAddFill
                                                    size={18}
                                                    style={{ cursor: "pointer" }}
                                                    title="Assign Manager"
                                                    onClick={() => handleViewAssignCanvas(user)}
                                                />
                                            ) : (
                                                <>
                                                    <FiEye
                                                        size={18}
                                                        style={{ cursor: "pointer" }}
                                                        title="View User"
                                                        onClick={() => handleViewUser(user)}
                                                    />
                                                    <RiDeleteBin6Fill
                                                        size={18}
                                                        style={{
                                                            cursor: user.teamCount > 0 ? "not-allowed" : "pointer",
                                                            opacity: user.teamCount > 0 ? 0.7 : 1,
                                                        }}
                                                        title={
                                                            user.teamCount > 0
                                                                ? "Cannot delete manager with team members"
                                                                : "Delete User"
                                                        }
                                                        className="mx-2 text-danger"
                                                        onClick={() => {
                                                            if (user.role !== USER_ROLES?.MANAGER || user.teamCount === 0) {
                                                                handleViewDeleteUser(user);
                                                            }
                                                        }}
                                                    />
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </TableCard>
            )}

            {pagination && !loading && users.length > 0 && (
                <Pagination className="justify-content-center mt-4">
                    <Pagination.Prev
                        disabled={!pagination.hasPrevPage}
                        onClick={() => handlePageChange(currentPage - 1)}
                    />
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                        (pageNumber) => (
                            <Pagination.Item
                                key={pageNumber}
                                active={pageNumber === currentPage}
                                onClick={() => handlePageChange(pageNumber)}
                            >
                                {pageNumber}
                            </Pagination.Item>
                        )
                    )}
                    <Pagination.Next
                        disabled={!pagination.hasNextPage}
                        onClick={() => handlePageChange(currentPage + 1)}
                    />
                </Pagination>
            )}

            <AddUserCanvas
                showCanvas={showAddCanvas}
                setShowCanvas={setShowAddCanvas}
                fetchUsers={() => fetchUsers(currentPage, debouncedSearch, filter)}
                managers={users.filter((u) => u.role === USER_ROLES.MANAGER)}
            />

            <UserDetail
                showCanvas={showDetailCanvas}
                setShowCanvas={setShowDetailCanvas}
                selectedUser={selectedUser}
                fetchUsers={fetchUsers}
            />

            <DeleteUserCanvas
                showCanvas={showDeleteCanvas}
                setShowCanvas={setShowDeleteCanvas}
                selectedUser={selectedUser}
                fetchUsers={fetchUsers}
            />

            <AssignManagerCanvas
                showCanvas={showAssignCanvas}
                setShowCanvas={setShowAssignCanvas}
                selectedUser={selectedUser}
                fetchUsers={() => {
                    setCurrentPage(1);
                    setFilter("");
                    fetchUsers(1, "", "");
                }}
            />
        </div>
    );
};

export default UserTable;
