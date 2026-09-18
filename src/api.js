import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000', // Matches your FastAPI server port
});

export default API;