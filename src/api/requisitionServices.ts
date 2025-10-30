import { HTTP_CLIENT } from "../utils/httpClient";
import { ENDPOINTS } from "./endpoints";

export const addRequisition = (values: any) => {
  return HTTP_CLIENT.post(ENDPOINTS.REQUISITIONS_ADD_REQUISITIONS, values);
};

export const getAllRequisition = () => {
  return HTTP_CLIENT.get(ENDPOINTS.REQUISITIONS_GET_ALL);
};
export const updateRequisition = (id: string, values: any) => {
  return HTTP_CLIENT.put(`${ENDPOINTS.REQUISITIONS_UPDATE}/${id}`, values);
};
export const getSingleRequisition = (id: string) => {
  return HTTP_CLIENT.get(`${ENDPOINTS.REQUISITIONS_GET_SINGLE}/${id}`);
};
export const deleteRequisition = (id: string) => {
  return HTTP_CLIENT.delete(`${ENDPOINTS.REQUISITIONS_DELETE}/${id}`);
};
export const acceptRequisition = async (id: string) => {
  return HTTP_CLIENT.patch(`${ENDPOINTS.REQUISITIONS_UPDATEACCEPTED}/${id}`);
};
