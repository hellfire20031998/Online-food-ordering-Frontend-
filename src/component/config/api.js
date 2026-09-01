import axios from "axios";

export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/";

export const profile = "api/users/profile";

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Attach the JWT (when present) to every request from one place.
api.interceptors.request.use((config) => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
        config.headers.Authorization = `Bearer ${jwt}`;
    }
    return config;
});

// Backend errors follow { timestamp, message, details, status }.
export const getErrorMessage = (error, fallback = "Something went wrong") =>
    error?.response?.data?.message || error?.message || fallback;
