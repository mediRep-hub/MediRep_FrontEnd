import { HTTP_CLIENT } from "../utils/httpClient";
import { ENDPOINTS } from "./endpoints";

export const getAllStocks = () => {
  return HTTP_CLIENT.get(ENDPOINTS.STOCK_GETALLSTOCK);
};
export const uploadCSVStock = (formData: FormData, config?: any) => {
  return HTTP_CLIENT.post(ENDPOINTS.UPLOAD_STOCK, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    ...config, // merge optional config (e.g., onUploadProgress)
  });
};
