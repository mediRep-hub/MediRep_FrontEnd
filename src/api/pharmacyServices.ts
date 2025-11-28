import { HTTP_CLIENT } from "../utils/httpClient";
import { ENDPOINTS } from "./endpoints";

export const addPharmacypost = (values: any) => {
  return HTTP_CLIENT.post(ENDPOINTS.Pharmacy_ADD_Pharmacy, values);
};

export const getAllPharmacies = ({ page = 1, limit = 6 }) => {
  return HTTP_CLIENT.get(
    `${ENDPOINTS.Pharmacy_GET_ALL}?page=${page}&limit=${limit}`
  );
};

export const getAllPharmaciesLIst = () => {
  return HTTP_CLIENT.get(ENDPOINTS.Pharmacy_GET_ALL_LIST);
};

export const updatePharmacy = (id: string, values: any) => {
  return HTTP_CLIENT.put(`${ENDPOINTS.Pharmacy_UPDATE}/${id}`, values);
};

export const deletePharmacy = (id: string) => {
  return HTTP_CLIENT.delete(`${ENDPOINTS.Pharmacy_DELETE}/${id}`);
};

export const uploadCSVPharmacy = (formData: FormData) => {
  return HTTP_CLIENT.post(ENDPOINTS.Pharmacy_uploadCSVDOCTOR, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
