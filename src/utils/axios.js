 /**
 * axios setup to use mock service
 */

 /*
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const axiosServices = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3010/' });

// interceptor for http
axiosServices.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log('***Axios response error: ', error);
        Promise.reject((error.response && error.response.data) || 'Wrong Services');
    }
);

axiosServices.interceptors.request.use(
    async (config) => {
        const { getAccessTokenSilently } = useAuth0();
        const accessToken = await getAccessTokenSilently();
        config.headers['Authorization'] = `Bearer ${accessToken}`;
        return config; 
    },
    (error) => {
        console.log('***Axios request error: ', error);
        Promise.reject((error.response && error.response.data) || 'Wrong Services');
    }
);

export default axiosServices; */



// CODIGO ORIGINAL
import axios from 'axios';

const axiosServices = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3010/' });

// interceptor for http
axiosServices.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject((error.response && error.response.data) || 'Wrong Services')
);

export default axiosServices;
