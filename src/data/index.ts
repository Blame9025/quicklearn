import {jwtDecode} from 'jwt-decode';

export function getTokenData(sessionName: string){
    const token = sessionStorage.getItem(sessionName);
    if(token == null || token == undefined)
        return null;
    const decodedToken = jwtDecode(token);
    if((decodedToken.exp || Date.now() / 1000) * 1000 < Date.now())
        return null;
    return decodedToken;
}