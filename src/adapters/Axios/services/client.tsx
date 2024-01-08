/* Configuration of axios */

import axios, { AxiosRequestConfig } from "axios";

const axiosClient = (config?: AxiosRequestConfig) => {
  const api = axios.create(
    config || {
      baseURL: process.env.REACT_APP_API_URL,
      headers: {
        "Content-Type" : "application/json",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Credentials": true
      }
    }
  );

  return api;
};

export default axiosClient();
