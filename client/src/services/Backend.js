import API from './API';
import AccessToken from './AccessToken';

class Backend {
    fetcher = async (url, auth = true) => {
        return await API.send('GET', url, false, auth);
    };

    login = async (credentials) => {
        const response = await API.send('POST', '/login', credentials, false);
        if (response.status === 200) {
            AccessToken.set(response.data.token);
        }
        return response;
    };

    register = async (credentials) => {
        const response = await API.send('POST', '/register', credentials, false);
        if (response.status === 200) {
            AccessToken.set(response.data.token);
        }
        return response;
    };

    forgotPassword = async (payload) => {
        return await API.send('POST', '/forgot-password', payload, false);
    };

    resetPassword = async (token, payload) => {
        return await API.send('POST', '/reset-password/' + token, payload, false);
    };
    createProfile = async (payload) => {
        return await API.send('PATCH', '/create-customer', payload, true);
    };

    updateProfile = async (payload) => {
        return await API.send('PUT', '/update-profile', payload, true);
    };

    updatePassword = async (payload) => {
        return await API.send('PUT', '/update-password', payload, true);
    };

    storeAnnotation = async (data) => {
        return await API.send('POST', '/annotation', data, true);
    };
}

const service = new Backend();
export default service;
