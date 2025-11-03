import { HTTP_CLIENT } from "../utils/httpClient";
import { ENDPOINTS } from "./endpoints";

export const addStrategy = (values: any) => {
  return HTTP_CLIENT.post(ENDPOINTS.STRATEGY_ADD_STRATEGY, values);
};
export const getAllStrategy = () => {
  return HTTP_CLIENT.get(ENDPOINTS.STRATEGY_GET_ALL);
};
export const updateStrategy = (id: string, values: any) => {
  return HTTP_CLIENT.put(`${ENDPOINTS.STRATEGY_UPDATE}/${id}`, values);
};
export const deleteStrategy = (id: string) => {
  return HTTP_CLIENT.delete(`${ENDPOINTS.STRATEGY_DELETE}/${id}`);
};
