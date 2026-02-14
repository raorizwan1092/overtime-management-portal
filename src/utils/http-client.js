import axios from 'axios';
import Cookies from 'js-cookie';


export const GetApiData = async (endpoint, method, payload, secured) => {
    let headers = AuthHeader();
    let apiOptions = { url: "/api" + endpoint }
    if (method !== '') apiOptions.method = method
    if (payload != null) apiOptions.data = payload
    if (secured !== false) apiOptions.headers = headers
    return await axios(apiOptions);
}
export function AuthHeader() {
    const token = Cookies.get('token');
    return token ? token : {};
}