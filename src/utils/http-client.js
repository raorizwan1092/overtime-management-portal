import axios from "axios";

export const GetApiData = async (endpoint, method, payload) => {
    const apiOptions = {
        url: "/api" + endpoint,
        method: method || "GET",
        data: payload || null,
        withCredentials: true,
    };

    return await axios(apiOptions);
};
