import { HTTP_CLIENT } from "../utils/httpClient";
import { ENDPOINTS } from "./endpoints";

export const getAllLeaves = (search?: string) => {
  return HTTP_CLIENT.get(ENDPOINTS.LEAVES_GET_ALL, {
    params: search ? { search } : {},
  });
};
export const updateLeavesStatus = (
  id: string,
  values: { status: string; approvedBy: string }
) => {
  return HTTP_CLIENT.put(`${ENDPOINTS.LEAVES_APPROVE}/${id}`, values);
};
export const updateLeave = (id: string, values: any) => {
  return HTTP_CLIENT.put(`${ENDPOINTS.LEAVES_UPDATE}/${id}`, values);
};

export const deleteLeave = (id: string) => {
  return HTTP_CLIENT.delete(`${ENDPOINTS.LEAVES_DELETE}/${id}`);
};
export const applyLeave = (values: any) => {
  return HTTP_CLIENT.post(ENDPOINTS.LEAVES_APPLY, values);
};
