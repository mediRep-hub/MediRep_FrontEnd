import { HTTP_CLIENT } from "../utils/httpClient";
import { ENDPOINTS } from "./endpoints";

export const addReport = (payload: any) => {
  return HTTP_CLIENT.post(ENDPOINTS.REPORTING_ADD_REPORT, payload);
};

export const getAllReports = (
  page: number,
  limit: number,
  doctorPage?: number,
  doctorLimit?: number
) => {
  return HTTP_CLIENT.get(ENDPOINTS.REPORTING_GET_ALL, {
    params: { page, limit, doctorPage, doctorLimit },
  }).then((res) => res.data);
};

export const updateReports = (id: string, values: any) => {
  return HTTP_CLIENT.put(`${ENDPOINTS.REPORTING_UPDATE_REPORT}/${id}`, values);
};
export const reorderDoctorList = (
  id: string,
  data: { orderedDoctorIds: string[] }
) => {
  return HTTP_CLIENT.put(`${ENDPOINTS.REPORTING_REORDER_REPORT}/${id}`, data);
};

export const deleteReports = (id: string) => {
  return HTTP_CLIENT.delete(`${ENDPOINTS.REPORTING_DELETE_REPORT}/${id}`);
};
