import { GetApiData } from "@/utils/http-client";

export const GetAllUsers = function (page) {
    return GetApiData(`/users?page=${page}`, 'GET', null, true);
}
