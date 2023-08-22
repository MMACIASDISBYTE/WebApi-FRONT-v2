import useAuth from "hooks/useAuth";
import jwt_decode from "jwt-decode";

export function useAccessTokenJWT() {

    const { accessToken } = useAuth();

    if (!accessToken) {
        return null
    }

    try {
        const tokenDesemcriptado = jwt_decode(accessToken);
        const permisos = tokenDesemcriptado.permissions;

        return permisos;
    } catch (error) {
        console.error('Error al decodificar el token: ', error);
        return null;
    }
}