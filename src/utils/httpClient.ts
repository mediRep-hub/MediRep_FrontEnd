import axios from "axios";
import { store } from "../redux/store";
import { BASE_URL } from "../api/endpoints";
import { setIsLoggedIn } from "../redux/userSlice";
import { notifyError } from "../Components/Toast";

export const HTTP_CLIENT = axios.create({
  baseURL: BASE_URL,
});

let isSessionExpiredHandled = false;

export const setupInterceptors = (navigate: any) => {
  HTTP_CLIENT.interceptors.request.use(
    (config: any) => {
      const token = store.getState().user?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: any) => Promise.reject(error)
  );
  HTTP_CLIENT.interceptors.response.use(
    (response: any) => response,
    (error: any) => {
      const status = error.response?.status;

      if (status === 401 && !isSessionExpiredHandled) {
        isSessionExpiredHandled = true;

        store.dispatch(setIsLoggedIn(false));
        localStorage.clear();
        notifyError("Your session has expired. Please log in again.");
        navigate("/");
        setTimeout(() => {
          isSessionExpiredHandled = false;
        }, 2000);
      }

      if (status === 500) {
        notifyError("Server error — please try again later.");
      }

      return Promise.reject(error);
    }
  );
};
