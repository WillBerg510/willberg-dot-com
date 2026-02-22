import axios from 'axios';
import { BACKEND } from "../constants/config.js";

const API = axios.create({
  baseURL: BACKEND,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;