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
  // Attach token to every request
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

  // Handle responses
  HTTP_CLIENT.interceptors.response.use(
    (response: any) => response,
    (error: any) => {
      const status = error.response?.status;

      if (status === 401 && !isSessionExpiredHandled) {
        isSessionExpiredHandled = true;

        // Clear user state & local storage
        store.dispatch(setIsLoggedIn(false));
        localStorage.clear();

        // Notify user
        notifyError("Your session has expired. Please log in again.");

        // Redirect to login page
        navigate("/");

        // Reset flag after navigation
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
