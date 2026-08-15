import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACK_END_URL}/api`,
    withCredentials: true,
});

// Attach JWT token to every request
api.interceptors.request.use(
    (config) => {
        try {
            const auth = localStorage.getItem("auth");

            if (auth) {-
                const user = JSON.parse(auth);

                if (user?.jwtToken) {
                    config.headers.Authorization = `Bearer ${user.jwtToken}`;
                }
            }
        } catch (error) {
            console.error("Error reading authentication data:", error);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;