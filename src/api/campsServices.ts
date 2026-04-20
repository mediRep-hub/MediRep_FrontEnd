import { HTTP_CLIENT } from "../utils/httpClient";
import { ENDPOINTS } from "./endpoints";

// ✅ Get all camps
export const getAllCamps = async () => {
  return HTTP_CLIENT.get(`${ENDPOINTS.CAMPS_GET_ALL}`);
};

// ✅ Update camp status
export const updateCampStatus = async (id: string, status: string) => {
  return HTTP_CLIENT.patch(`${ENDPOINTS.CAMPS_ChANGE_STATUS}${id}`, { status });
};

export const getAllDashboardStats = async () => {
  return HTTP_CLIENT.get(`${ENDPOINTS.CAMPS_DASHBOARD_STATS}`);
};

export const getBarStats = async () => {
  return HTTP_CLIENT.get(`${ENDPOINTS.CAMPS_BAR_STATS}`);
};
