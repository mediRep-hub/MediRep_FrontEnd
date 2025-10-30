import { HTTP_CLIENT } from "../utils/httpClient";
import { ENDPOINTS } from "./endpoints";

export const adminLogin = (values: { email: string; password: string }) => {
  return HTTP_CLIENT.post(ENDPOINTS.ACCOUNTS_LOGIN, values);
};

export const adminLogout = () => {
  return HTTP_CLIENT.post(ENDPOINTS.ACCOUNTS_LOGOUT);
};
export const addAccount = (values: any) => {
  return HTTP_CLIENT.post(ENDPOINTS.ACCOUNTS_ADD, values);
};

export const getAllAccounts = () => {
  return HTTP_CLIENT.get(ENDPOINTS.ACCOUNTS_GETALL);
};
export const updateAccount = (id: string, values: any) => {
  return HTTP_CLIENT.put(`${ENDPOINTS.ACCOUNTS_UPDATE}/${id}`, values);
};

export const deleteAccount = (id: string) => {
  return HTTP_CLIENT.delete(`${ENDPOINTS.ACCOUNTS_DELETE}/${id}`);
};
