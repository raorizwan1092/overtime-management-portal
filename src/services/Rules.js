import { GetApiData } from "@/utils/http-client";

export const getRule = () => {
  return GetApiData(`/rules?limit=1`, "GET", null, true);
};

export const updateRule = (id, data) => {
  return GetApiData(`/rules`, "PATCH", { id, ...data }, true);
};