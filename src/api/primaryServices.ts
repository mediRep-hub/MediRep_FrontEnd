import { HTTP_CLIENT } from "../utils/httpClient";
import { ENDPOINTS } from "./endpoints";

export const addPrimarySale = (values: any) => {
  return HTTP_CLIENT.post(ENDPOINTS.PRIMARY_SALE_ADD, values);
};

export const getAllPrimarySales = () => {
  return HTTP_CLIENT.get(ENDPOINTS.PRIMARY_SALE_GET_ALL);
};

export const updatePrimarySale = (id: string, values: any) => {
  return HTTP_CLIENT.put(`${ENDPOINTS.PRIMARY_SALE_UPDATE}/${id}`, values);
};

export const deletePrimarySale = (id: string) => {
  return HTTP_CLIENT.delete(`${ENDPOINTS.PRIMARY_SALE_DELETE}/${id}`);
};

export const uploadBulkPrimarySales = (formData: FormData) => {
  return HTTP_CLIENT.post(ENDPOINTS.PRIMARY_SALE_BULK_UPLOAD, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
