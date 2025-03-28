import axios from "axios";

const API_BASE_URL = "https://signin-api.free.beeceptor.com"; // Replace with Beeceptor URL


export const signIn = async (userData) => {
    return axios.post(`${API_BASE_URL}/signin`, userData);
  };
  
  export const signUp = async (userData) => {
    return axios.post(`${API_BASE_URL}/signup`, userData);
  };
  
  export const getToken = () => localStorage.getItem("token");