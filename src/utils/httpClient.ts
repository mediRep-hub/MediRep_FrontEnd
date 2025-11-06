import axios from "axios";
import { store } from "../redux/store";
import { BASE_URL } from "../api/endpoints";
import { setIsLoggedIn } from "../redux/userSlice";
import { notifyError } from "../Components/Toast";

export const HTTP_CLIENT = axios.create({
  baseURL: BASE_URL,
});

let isSessionExpiredHandled = false;

export const interceptorConfig = (navigate: any) => {
  HTTP_CLIENT.interceptors.request.use(
    (config: any) => {
      const state = store.getState();
      const token = state.user?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (err: any) => Promise.reject(err)
  );

  HTTP_CLIENT.interceptors.response.use(
    (response: any) => response,
    (error: any) => {
      if (error.response) {
        const { status } = error.response;

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
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Request setup error:", error.message);
      }

      return Promise.reject(error);
    }
  );
};
