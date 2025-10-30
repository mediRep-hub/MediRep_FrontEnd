import axios from "axios";
import type { AxiosInstance } from "axios";
import { BASE_URL } from "../api/endpoints";
import { getItem, setItem } from "../utils/localStorageHelper";

export const HTTP_CLIENT: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

export const interceptorConfig = (router: any) => {
  HTTP_CLIENT.interceptors.request.use(
    (config: any) => {
      const isLoggedIn = getItem<boolean>("isLoggedIn");
      const token = getItem<string>("token");

      if (isLoggedIn && token) {
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
        const { status, data } = error.response;

        if (status === 401) {
          setItem("isLoggedIn", false);
          setItem("token", "");
          router.push(`/admin/login`);
          alert("Your session has expired. Please log in again.");
          return Promise.reject(data);
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
