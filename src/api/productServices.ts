import { HTTP_CLIENT } from "../utils/httpClient";
import { ENDPOINTS } from "./endpoints";

export const addProduct = (values: any) => {
  return HTTP_CLIENT.post(ENDPOINTS.PRODUCT_ADD_PRODUCT, values);
};

export const getAllProducts = () => {
  return HTTP_CLIENT.get(ENDPOINTS.PRODUCT_GET_ALL);
};
export const updateProducts = (id: string, values: any) => {
  return HTTP_CLIENT.put(`${ENDPOINTS.PRODUCT_UPDATE}/${id}`, values);
};
export const deleteProducts = (id: string) => {
  return HTTP_CLIENT.delete(`${ENDPOINTS.PRODUCT_DELETE}/${id}`);
};

export const uploadCSVTarget = (data: any[]) => {
  return HTTP_CLIENT.post(ENDPOINTS.PRODUCT_uploadCSVTarget, data, {
    headers: { "Content-Type": "application/json" },
  });
};
