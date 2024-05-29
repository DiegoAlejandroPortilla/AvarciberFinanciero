import axios from "axios";

const API = "https://savarciber-production.up.railway.app/api";
export const fetchTVulnerabilidades = () => {
    return axios.get(`${API}/TVulnerabilidades`);
  };
  
  export const fetchTVulnerabilidadesById = (id) => {
    return axios.get(`${API}/TVulnerabilidades/${id}`);
  };
  
  export const addTVulnerabilidades = (TVulnerabilidadesData) => {
    return axios.post(`${API}/TVulnerabilidades`, TVulnerabilidadesData);
  };
  
  export const deleteTVulnerabilidades = (id) => {
    return axios.delete(`${API}/TVulnerabilidades/${id}`);
  };
  
  export const updateTVulnerabilidades = (id, TVulnerabilidadesData) => {
    return axios.put(`${API}/TVulnerabilidades/${id}`, TVulnerabilidadesData);
};