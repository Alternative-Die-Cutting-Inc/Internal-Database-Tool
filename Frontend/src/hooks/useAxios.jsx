import axios from "axios";

const useAxios = () => {
  const instance = axios.create({
    baseURL: "http://127.0.0.1:8080",
    withCredentials: true,
  });
  return { axios: instance };
};

export default useAxios;
