import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { getApiBaseUrl } from "./config.js";



const Axios = axios.create({
  baseURL: getApiBaseUrl()   
});




Axios.interceptors.request.use(async config => {
  const token = await SecureStore.getItemAsync("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default Axios;
