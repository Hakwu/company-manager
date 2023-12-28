import AccessToken from './AccessToken';
import { baseUrl } from '../config';

class API {
    getDomain() {
        return baseUrl;
    }

    async send(method, route, data = null, auth = true, multiform = false) {
        const api = this.getDomain();

        const headers = !multiform
            ? {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'
              }
            : {};

        if (auth) {
            let accessToken = AccessToken.get();
            accessToken = accessToken || '';
            if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
        }

        if (method !== 'GET' && data && !multiform) data = JSON.stringify(data);
        else if (multiform);
        else data = null;

        try {
            const response = await fetch(api + route, {
                headers,
                method,
                body: data
            });

            if (response.status === 401) {
                AccessToken.remove();
            }
            if (response.status === 201) {
                return {
                    data: response,
                    status: response.status
                };
            }

            return {
                data: await response.json(),
                status: response.status
            };
        } catch (e) {
            console.log('API error:', e);
            return {
                data: null,
                status: -1
            };
        }
    }
}

const service = new API();
export default service;
