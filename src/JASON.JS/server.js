import axios from "axios";
 
const baseUrl = 'https://backend2-s86u.onrender.com/api/persons';
 
const getAll = () =>
  axios.get(baseUrl).then(response => response.data);
 
const create = (newObject) =>
  axios.post(baseUrl, newObject).then(response => response.data);
 
const update = (id, updatedObject) =>
  axios.put(`${baseUrl}/${id}`, updatedObject).then(response => response.data);
 
const remove = (id) =>
  axios.delete(`${baseUrl}/${id}`);
 
export default { getAll, create, update, remove };


