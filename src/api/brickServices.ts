import { HTTP_CLIENT } from "../utils/httpClient";
import { ENDPOINTS } from "./endpoints";

// 👉 Get All Bricks
export const getAllBricks = (brickName?: string) => {
  return HTTP_CLIENT.get(ENDPOINTS.REPORTING_GET_ALL, {
    params: { brickName },
  });
};

// 👉 Create Brick
export const createBrick = (values: any) => {
  return HTTP_CLIENT.post(ENDPOINTS.REPORTING_ADD_REPORT, values);
};

// 👉 Update Brick
export const updateBrick = (id: string, values: any) => {
  return HTTP_CLIENT.put(`${ENDPOINTS.REPORTING_UPDATE_REPORT}/${id}`, values);
};

// 👉 Delete Brick
export const deleteBrick = (id: string) => {
  return HTTP_CLIENT.delete(`${ENDPOINTS.REPORTING_DELETE_REPORT}/${id}`);
};

// 👉 Reorder Doctor List (optional agar use karni ho)
export const reorderDoctorList = (values: any) => {
  return HTTP_CLIENT.put(ENDPOINTS.REPORTING_REORDER_REPORT, values);
};
