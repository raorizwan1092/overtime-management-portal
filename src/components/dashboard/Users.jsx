"use client";
import { GetAllUsers } from "@/services/Users";
import React, { useEffect, useState } from "react";
import { Table, Pagination, Spinner } from "react-bootstrap";
import toast from "react-hot-toast";
import { FiEye } from "react-icons/fi";
import TableCard from "../shared/TableCard";
import AddUserCanvas from "./AddUserCanvas";
import CustomButton from "../shared/Button/Button";

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [showCanvas, setShowCanvas] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);


    const fetchUsers = async (pageNumber = 1) => {
        setLoading(true);
        try {
            const response = await GetAllUsers(pageNumber);
            console.log("res", response)
            if (response?.data?.success) {
                setUsers(response?.data.users);
                setPagination(response?.data.pagination);
            }
        } catch (error) {
            toast?.error(error ? error?.response?.data?.error : "Something went wrong")
        } finally {
            setLoading(false);
        }
    };
    const handleViewUser = (user) => {
        setSelectedUser(user);
        setShowCanvas(true);
    };


    useEffect(() => {
        fetchUsers(page);
    }, [page]);

    return (
        <div>
            <div className="text-end">
                <CustomButton
                    label="Add User"
                    onClick={() => {
                        setSelectedUser(null);
                        setShowCanvas(true);
                    }}
                />
            </div>
            <AddUserCanvas
                showCanvas={showCanvas}
                setShowCanvas={setShowCanvas}
                fetchUsers={fetchUsers}
            />

            {loading ?
                <div className="d-flex justify-content-center align-items-center mt-5" >
                    <Spinner animation="border" className="text-white mt-5" />
                </div>

                :
                <TableCard>


                    <div>
                        <Table responsive className="mb-0">
                            <thead>
                                <tr>
                                    <th style={{ width: "80px" }}>No.</th>
                                    <th style={{ width: "25%" }}>Name</th>
                                    <th style={{ width: "30%" }}>Email</th>
                                    <th style={{ width: "15%" }}>Phone</th>
                                    <th style={{ width: "15%" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr className="border-0">
                                        <td colSpan="5" className="text-center align-middle">
                                            <div className="d-flex justify-content-center align-items-center h-100">
                                                No users found
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    users?.map((user, index) => (
                                        <tr key={user._id}>
                                            <td className="text-truncate">{(page - 1) * pagination.limit + index + 1}</td>
                                            <td className="text-truncate" title={user.name || "-"}>
                                                {user.name || "-"}
                                            </td>
                                            <td className="text-truncate" title={user.email}>
                                                {user.email}
                                            </td>
                                            <td className="text-truncate">{user.phone}</td>
                                            <td>
                                                <FiEye
                                                    size={18}
                                                    style={{ cursor: "pointer" }}
                                                    title="View User"
                                                    onClick={() => handleViewUser(user)}
                                                />
                                            </td>

                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>
                </TableCard>

            }

            {pagination && !loading && users.length > 0 && (
                <Pagination className="justify-content-center align-items-center mt-3">
                    <Pagination.Prev
                        disabled={!pagination.hasPrevPage}
                        onClick={() => setPage(page - 1)}
                        className="prev-btn"
                    />

                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                        (pageNum) => (
                            <Pagination.Item
                                key={pageNum}
                                active={pageNum === page}
                                onClick={() => setPage(pageNum)}
                            >
                                {pageNum}
                            </Pagination.Item>
                        )
                    )}

                    <Pagination.Next
                        disabled={!pagination.hasNextPage}
                        onClick={() => setPage(page + 1)}
                        className="next-btn"
                    />
                </Pagination>
            )}
        </div>
    );
};

export default UserTable;