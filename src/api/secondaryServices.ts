import { HTTP_CLIENT } from "../utils/httpClient";
import { ENDPOINTS } from "./endpoints";

export const addSECONDARYSale = (values: any) => {
  return HTTP_CLIENT.post(ENDPOINTS.SECONDARY_SALE_ADD, values);
};

export const getAllSECONDARYSales = () => {
  return HTTP_CLIENT.get(ENDPOINTS.SECONDARY_SALE_GET_ALL);
};

export const updateSECONDARYSale = (id: string, values: any) => {
  return HTTP_CLIENT.put(`${ENDPOINTS.SECONDARY_SALE_UPDATE}/${id}`, values);
};

export const deleteSECONDARYSale = (id: string) => {
  return HTTP_CLIENT.delete(`${ENDPOINTS.SECONDARY_SALE_DELETE}/${id}`);
};

export const uploadBulkSECONDARYSales = (formData: FormData) => {
  return HTTP_CLIENT.post(ENDPOINTS.SECONDARY_SALE_BULK_UPLOAD, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
