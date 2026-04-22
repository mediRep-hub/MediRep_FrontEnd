import { getToken } from "firebase/messaging";
import { HTTP_CLIENT } from "../utils/httpClient";
import { getFCMToken } from "../utils/notifications";
import { ENDPOINTS } from "./endpoints";
import { messaging } from "../firebase";

export const adminLogin = async (values: {
  email: string;
  password: string;
  fcmToken?: string;
}) => {
  try {
    const response = await HTTP_CLIENT.post(ENDPOINTS.ACCOUNTS_LOGIN, values);

    return response.data;
  } catch (error: any) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

const askPermissionAndGetToken = async () => {
  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    return null;
  }

  const registration = await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js",
  );

  const token = await getToken(messaging, {
    vapidKey: "YOUR_VAPID_KEY",
    serviceWorkerRegistration: registration,
  });

  return token;
};
export const adminLogout = () => {
  return HTTP_CLIENT.post(ENDPOINTS.ACCOUNTS_LOGOUT);
};
export const addAccount = (values: any) => {
  return HTTP_CLIENT.post(ENDPOINTS.ACCOUNTS_ADD, values);
};
export const getBirthday = () => {
  return HTTP_CLIENT.get(ENDPOINTS.ACCOUNTS_BIRTHDAY);
};
export const getAllAccounts = (params?: {
  name?: string;
  brickName?: string;
  page?: number;
  limit?: number;
}) => {
  return HTTP_CLIENT.get(ENDPOINTS.ACCOUNTS_GETALL, {
    params,
  });
};

export const updateAccount = (id: string, values: any) => {
  return HTTP_CLIENT.put(`${ENDPOINTS.ACCOUNTS_UPDATE}/${id}`, values);
};

export const deleteAccount = (id: string) => {
  return HTTP_CLIENT.delete(`${ENDPOINTS.ACCOUNTS_DELETE}/${id}`);
};

export const updatePassword = (id: string, values: { password: string }) => {
  return HTTP_CLIENT.put(`${ENDPOINTS.ACCOUNTS_UPDATEPASSWORD}/${id}`, values);
};
