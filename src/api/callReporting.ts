import { HTTP_CLIENT } from "../utils/httpClient";
import { ENDPOINTS } from "./endpoints";

export const getAllReports = () => {
  return HTTP_CLIENT.get(ENDPOINTS.PRODUCTS_GET_ALL);
};
