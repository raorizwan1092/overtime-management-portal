import { GetApiData } from "@/utils/http-client";

export const GetAllUsers = function (page = 1, search = "", filter = "") {
    const query = [
        page ? `page=${page}` : "",
        search ? `search=${encodeURIComponent(search)}` : "",
        filter ? `filter=${filter}` : "",
    ]
        .filter(Boolean)
        .join("&");

    return GetApiData(`/users?${query}`, "GET", null, true);
};


export const createUser = function (data) {
    return GetApiData(`/users`, 'POST', data, true);
}
export const SignInUser = function (data) {
    return GetApiData(`/signin`, 'POST', data, true);
}
export const Logout = function (data) {
    return GetApiData(`/logout`, 'POST', data, true);
}
export const GetUserDetails = function () {
    return GetApiData(`/user`, 'GET', null, true);
}
export const deleteUser = function (id) {
    return GetApiData(`/users/${id}`, "DELETE", null, true);
};

export const changePassword = async (newPassword) => {
    return GetApiData("/change-password", "POST", { newPassword }, true);
};
export const updatePassword = async (currentPassword, newPassword) => {
    return GetApiData("/update-password", "POST", { currentPassword, newPassword }, true);
};
export const unassignTeamMember = async (id) => {
    return GetApiData(`/users/unassign-manager/${id}`, "PATCH", null, true);
};
export const assignManager = async (id, managerId) => {
    return GetApiData(`/users/assign-manager/${id}`, "PATCH", { managerId }, true);
};

export const updateUser = async (data) => {
    return GetApiData("/user", "PUT", data, true);
};

export const sendResetCode = async (email) => {
    return GetApiData("/auth/forgot-password/send-code", "POST", { email }, false);
};
export const verifyResetCode = async (email, code) => {
    return GetApiData("/auth/forgot-password/verify-code", "POST", { email, code }, false);
};
export const setNewPassword = async (email, newPassword) => {
    return GetApiData("/auth/forgot-password/set-password", "POST", { email, newPassword }, false);
};