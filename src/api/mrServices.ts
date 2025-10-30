import { HTTP_CLIENT } from "../utils/httpClient";
import { ENDPOINTS } from "./endpoints";

export const addMR = (values: any) => {
  return HTTP_CLIENT.post(ENDPOINTS.MR_ADD_MR, values);
};
export const getAllMR = () => {
  return HTTP_CLIENT.get(ENDPOINTS.MR_GET_ALL);
};
export const updateMR = (id: string, values: any) => {
  return HTTP_CLIENT.put(`${ENDPOINTS.MR_UPDATE}/${id}`, values);
};
export const deleteMR = (id: string) => {
  return HTTP_CLIENT.delete(`${ENDPOINTS.MR_DELETE}/${id}`);
};
