
import { createAuth0Client } from '@auth0/auth0-spa-js';

export const FetchService = {
    GetToken: async function () {
        const auth0 = await createAuth0Client({
            domain: process.env.REACT_APP_AUTH0_DOMAIN,
            clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
            authorizationParams: {
                audience: process.env.REACT_APP_AUTH0_AUDIENCE,
                redirect_uri: window.location.origin
            }
        });

        const token = await auth0.getTokenSilently();
        return token;
    },
    GetClaims: async function () {
        const auth0 = await createAuth0Client({
            domain: process.env.REACT_APP_AUTH0_DOMAIN,
            clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
            authorizationParams: {
                audience: process.env.REACT_APP_AUTH0_AUDIENCE,
                redirect_uri: window.location.origin
            }
        });

        const claims = await auth0.getIdTokenClaims();
        return claims.__raw;
    }, // original x Gus
    Get2: async function(url){
        const token = await this.GetToken();
        const requestUrl = `${process.env.REACT_APP_BASE_URL}/${url}`;
        const response = await fetch(requestUrl, {
            headers: {
                authorization: `Bearer ${token}`, // Incluye el token en la cabecera de la solicitud.
            },
        });
        const jsonData = await response.json();
        return jsonData;
    },
    Get: async function(url){
        // const token = await this.GetToken();
        const requestUrl = `${process.env.REACT_APP_BASE_URL}/${url}`;
        const response = await fetch(requestUrl);
        const jsonData = await response.json();
        return jsonData;
    },

    // Get: async function(url){   // EN ESTE METODO OPTENEMOS EL ESTADO
    //     const token = await this.GetToken();
    //     const requestUrl = `${process.env.REACT_APP_BASE_URL}/${url}`;
    //     const response = await fetch(requestUrl, {
    //         headers: {
    //             authorization: `Bearer ${token}`, // Incluye el token en la cabecera de la solicitud.
    //         },
    //     });
    //     const jsonData = await response.json();
    //     const status = await response.status;
    //     return {jsonData:jsonData, status: status};
    // },

// LISTED: 27_7_2023 16:09
    Update: async function(url,updatedData){
        const token = await this.GetToken();
        const requestUrl = `${process.env.REACT_APP_BASE_URL}/${url}`;
        const response = await fetch(requestUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`, // Incluye el token en la cabecera de la solicitud.
            },body: JSON.stringify(updatedData),
        });
        const jsonData = await response.json();
        return jsonData;
    },

    Create: async function(url,miData){
        const token = await this.GetToken();
        const requestUrl = `${process.env.REACT_APP_BASE_URL}/${url}`;
        const response = await fetch(requestUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`, // Incluye el token en la cabecera de la solicitud.
            },body: JSON.stringify(miData),
        });
        const jsonData = await response.json();
        return jsonData;
    },

    Delete: async function(url,miData){
        const token = await this.GetToken();
        const requestUrl = `${process.env.REACT_APP_BASE_URL}/${url}`;
        const response = await fetch(requestUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`, // Incluye el token en la cabecera de la solicitud.
            }
        });
        const jsonData = await response.json();
        return jsonData;
    }


}
