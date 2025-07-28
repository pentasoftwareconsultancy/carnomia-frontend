import axios from "axios";
import { APPLICATION_CONSTANTS } from "../constants/app.constant";
import StorageService from "./storage.service";
import ServerUrl from "../constants/serverUrl.constant";

class ApiInterceptor {
  static axiosReference = axios.create({
    baseURL: ServerUrl.REACT_APP_API_URL || import.meta.env.VITE_REACT_APP_API_URL,
  });

  static requestCounts = 0;

  static init() {
    ApiInterceptor.axiosReference.interceptors.request.use((config) => {
      ApiInterceptor.requestCounts++;

      console.log("Requesting to:", config.baseURL); // Logs actual base URL
      config.headers = {
        ...config.headers,
        ...this.generateHeader(),
      };

      return config;
    });

    ApiInterceptor.axiosReference.interceptors.response.use(
      (response) => {
        ApiInterceptor.requestCounts--;
        return response;
      },
      (err) => {
        ApiInterceptor.requestCounts--;
        console.error("API Error =>", err);
        return Promise.reject(err);
      }
    );

    return ApiInterceptor.axiosReference;
  }

  static generateHeader() {
    const token = StorageService.getData(APPLICATION_CONSTANTS.STORAGE.TOKEN);
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export default ApiInterceptor;
