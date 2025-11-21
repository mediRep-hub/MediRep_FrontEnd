import { HTTP_CLIENT } from "../utils/httpClient";
import { ENDPOINTS } from "./endpoints";

export const applyfilters = (values: any) => {
  return HTTP_CLIENT.post(ENDPOINTS.FILTER, values);
};
