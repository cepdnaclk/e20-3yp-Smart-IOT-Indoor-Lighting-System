// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const axiosClient = axios.create({
//   baseURL: "http://localhost:8080",
//   // baseURL: "http://192.168.8.189:8000/api",
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Add a request interceptor
// axiosClient.interceptors.request.use(
//   async (config) => {
//     const token = await AsyncStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Add a response interceptor
// axiosClient.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     // Check if the error has a response
//     if (error.response) {
//       if (error.response.status === 401) {
//         console.log(error.response);
//         // Handle unauthorized access (e.g., redirect to login)
//       }
//     } else {
//       // Handle network or other errors without a response
//       console.error("Network or other error:", error.message);
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosClient;




import axios from "axios";

// const axiosClient = axios.create({
//   baseURL: "http://192.168.1.50:8080",
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });


const axiosClient = axios.create({
  baseURL: "http://192.168.8.100:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});


// Request interceptor to catch errors before the request is sent
axiosClient.interceptors.request.use(
  (config) => {
    // You can modify the request config here if needed
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors in apresponses
axiosClient.interceptors.response.use(
  (response) => {
    // Simply return the response if no error occurs
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      console.error("Response error data:", error.response.data);
      console.error("Response error status:", error.response.status);
      console.error("Response error headers:", error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something else triggered an error
      console.error("Error message:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;


