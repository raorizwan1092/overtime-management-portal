import { GetApiData } from "@/utils/http-client";

export const GetAllUsers = function (page) {
    return GetApiData(`/users?page=${page}`, 'GET', null, true);
}
export const createUser = function (data) {
    return GetApiData(`/users`, 'POST', data, true);
}
