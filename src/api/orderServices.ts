import { HTTP_CLIENT } from "../utils/httpClient";
import { ENDPOINTS } from "./endpoints";

export const addOrder = (values: any) => {
  return HTTP_CLIENT.post(ENDPOINTS.ORDER_ADD, values);
};

export const getAllOrders = (
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

  return HTTP_CLIENT.get(`${ENDPOINTS.ORDER_GET_ALL}${query}`);
};

export const getOrderById = (id: string) => {
  return HTTP_CLIENT.get(`${ENDPOINTS.ORDER_GET_SINGLE}/${id}`);
};

export const updateOrder = (id: string, values: any) => {
  return HTTP_CLIENT.put(`${ENDPOINTS.ORDER_UPDATE}/${id}`, values);
};

export const deleteOrder = (id: string) => {
  return HTTP_CLIENT.delete(`${ENDPOINTS.ORDER_DELETE}/${id}`);
};
