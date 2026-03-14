import { GetApiData } from "@/utils/http-client";

export const getTimeLog = (month, year) => {
    return GetApiData(`/timelog?month=${month}&year=${year}`, "GET", null, true);
};
export const addTimeLog = (data) => {
    return GetApiData(`/timelog`, "POST", data, true);
};
export const getLogsById = (id) => {
    return GetApiData(`/timelog/${id}`, "GET", null, true);
};
export const updateLogStatus = (id, data) => {
    return GetApiData(`/timelog/status`, "PUT", { id, ...data }, true);
};
export const getUserTeam = (managerId) => {
    return GetApiData(`/users/team?managerId=${managerId}`, "GET", null, true);
};
