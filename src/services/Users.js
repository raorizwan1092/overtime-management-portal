import { GetApiData } from "@/utils/http-client";

export const GetAllUsers = function (page = 1, search = "") {
    const query = search ? `&search=${encodeURIComponent(search)}` : "";
    return GetApiData(`/users?page=${page}${query}`, "GET", null, true);
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