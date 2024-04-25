import Axios from 'axios';

const axiosHandler = Axios.create({
    baseURL:'http://localhost:8080/'
});

export default axiosHandler;