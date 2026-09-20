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

// The hosted API sleeps when idle. While it boots, requests fail with a network error or a
// 502/503/504 from the host's proxy. Retry idempotent GETs with a growing pause so a visitor's
// first load waits for the wake-up instead of showing an error.
const COLD_START_DELAYS_MS = [3000, 6000, 10000, 15000, 20000];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isColdStartFailure = (error) => {
    if (error?.code === "ERR_CANCELED") return false;
    if (!error?.response) return true; // network error / connection reset / timeout
    return [502, 503, 504].includes(error.response.status);
};

api.interceptors.response.use(undefined, async (error) => {
    const config = error?.config;
    const method = (config?.method || "get").toLowerCase();
    if (!config || method !== "get" || config.noRetry || !isColdStartFailure(error)) {
        throw error;
    }
    const attempt = config.__retryCount || 0;
    if (attempt >= COLD_START_DELAYS_MS.length) throw error;
    config.__retryCount = attempt + 1;
    await sleep(COLD_START_DELAYS_MS[attempt]);
    return api(config);
});

// Backend errors follow { timestamp, message, details, status }.
export const getErrorMessage = (error, fallback = "Something went wrong") =>
    error?.response?.data?.message || error?.message || fallback;
