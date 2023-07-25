import axios from "axios";

const useAxios = () => {
  const instance = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
  });
  return { axios: instance };
};

export default useAxios;
