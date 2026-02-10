import { HTTP_CLIENT } from "../utils/httpClient";
import { ENDPOINTS } from "./endpoints";

export const getAllBricks = (brickName?: string) => {
  return HTTP_CLIENT.get(ENDPOINTS.REPORTING_GET_ALL, {
    params: { brickName },
  });
};

export const createBrick = (values: any) => {
  return HTTP_CLIENT.post(ENDPOINTS.REPORTING_ADD_REPORT, values);
};

export const updateBrick = (id: string, values: any) => {
  return HTTP_CLIENT.put(`${ENDPOINTS.REPORTING_UPDATE_REPORT}/${id}`, values);
};

export const deleteBrick = (id: string) => {
  return HTTP_CLIENT.delete(`${ENDPOINTS.REPORTING_DELETE_REPORT}/${id}`);
};

export const reorderDoctorList = (values: any) => {
  return HTTP_CLIENT.put(ENDPOINTS.REPORTING_REORDER_REPORT, values);
};
