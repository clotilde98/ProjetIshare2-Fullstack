import axios from "axios";
import * as SecureStore from "expo-secure-store";

const Axios = axios.create({
  baseURL: "http://172.30.48.1:3002"
});

Axios.interceptors.request.use(async config => {
  const token = await SecureStore.getItemAsync("jwt");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default Axios;
