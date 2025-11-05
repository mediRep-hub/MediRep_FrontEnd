import axios from "axios";
import { store } from "../redux/store";
import { BASE_URL } from "../api/endpoints";
import { setIsLoggedIn } from "../redux/userSlice";

export const HTTP_CLIENT = axios.create({
  baseURL: BASE_URL,
});

// interceptor configuration
export const interceptorConfig = (router: any) => {
  // Request interceptor
  HTTP_CLIENT.interceptors.request.use(
    (config: any) => {
      const state = store.getState();
      const token = state.user?.token; // get token from Redux store
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (err: any) => Promise.reject(err)
  );

  // Response interceptor
  HTTP_CLIENT.interceptors.response.use(
    (response: any) => response,
    (error: any) => {
      if (error.response) {
        const { status } = error.response;

        if (status === 401) {
          // Logout via Redux
          store.dispatch(setIsLoggedIn(false));
          router.push("/admin/login");
          alert("Your session has expired. Please log in again.");
        }

        if (status === 500) {
          alert("Something went wrong on the server. Please try again later.");
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
