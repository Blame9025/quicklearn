import Axios from 'axios';

const axiosHandler = Axios.create({
    baseURL:'http://localhost:8080/'
});
axiosHandler.interceptors.request.use(function (config) {
    const token = sessionStorage.getItem('token');
    config.headers.Authorization =  token;
    return config;
});
export default axiosHandler;