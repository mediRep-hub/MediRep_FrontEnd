import { HTTP_CLIENT } from "../utils/httpClient";
import { ENDPOINTS } from "./endpoints";

export const addGroups = (values: any) => {
  return HTTP_CLIENT.post(ENDPOINTS.GROUP_ADD_BRICK, values);
};

export const getAllGroups = () => {
  return HTTP_CLIENT.get(ENDPOINTS.GROUP_GET_ALL_BRICK);
};

export const deleteGroups = (id: string) => {
  return HTTP_CLIENT.delete(`${ENDPOINTS.GROUP_DELETE_BRICK}/${id}`);
};

export const updateGroup = (id: string, values: any) => {
  return HTTP_CLIENT.put(`${ENDPOINTS.GROUP_Update_BRICK}/${id}`, values);
};
