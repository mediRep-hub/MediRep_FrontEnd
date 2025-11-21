import { HTTP_CLIENT } from "../utils/httpClient";
import { ENDPOINTS } from "./endpoints";

export const addRequisition = (values: any) => {
  return HTTP_CLIENT.post(ENDPOINTS.REQUISITIONS_ADD_REQUISITIONS, values);
};

export const getAllRequisition = (
  page = 1,
  limit = 10,
  mrName?: string,
  startDate?: string,
  endDate?: string
) => {
  let query = `?page=${page}&limit=${limit}`;

  if (mrName) query += `&mrName=${encodeURIComponent(mrName)}`;
  if (startDate) query += `&startDate=${startDate}`;
  if (endDate) query += `&endDate=${endDate}`;

  return HTTP_CLIENT.get(`${ENDPOINTS.REQUISITIONS_GET_ALL}${query}`);
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
