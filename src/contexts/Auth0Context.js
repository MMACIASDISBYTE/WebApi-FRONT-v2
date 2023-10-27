import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';

// third-party
import { Auth0Client } from '@auth0/auth0-spa-js';

// project imports
import Loader from 'ui-component/Loader';

import { LOGIN, LOGOUT } from 'store/actions';
import accountReducer from 'store/accountReducer';

// constant
let auth0Client;

const initialState = {
    isLoggedIn: false,
    isInitialized: false,
    user: null,
    accessToken: null // agrego el token al inicial state
};

// ==============================|| AUTH0 CONTEXT & PROVIDER ||============================== //

const Auth0Context = createContext(null);

export const Auth0Provider = ({ children }) => {
    const [state, dispatch] = useReducer(accountReducer, initialState);

    useEffect(() => {
        const init = async () => {
            try {
                auth0Client = new Auth0Client({
                    clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
                    domain: process.env.REACT_APP_AUTH0_DOMAIN,
                    authorizationParams: {
                        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
                        redirect_uri: process.env.REACT_APP_AUTH0_CALLBACK_URL // PARA PRODUCCION
                        // redirect_uri: window.location.origin   // PARA TRABAJAR LOCAL
                    }
                });

                await auth0Client.checkSession();
                const isLoggedIn = await auth0Client.isAuthenticated();

                if (isLoggedIn) {
                    const user = await auth0Client.getUser();
                    const accessToken = await auth0Client.getTokenSilently(); // Get the access token
                    dispatch({
                        type: LOGIN,
                        payload: {
                            isLoggedIn: true,
                            user: {
                                id: user?.sub,
                                email: user?.email,
                                // SE AGREGAN TODOS LOS DATOS NECESARIOS PARA TRABAJAR EL USUARIO
                                roll: user,
                                avatar: user?.picture,
                                name: user?.name,
                                tier: 'Premium',
                                email_verified: user?.email_verified,
                                family_name: user?.family_name,
                                given_name: user?.given_name,
                                nickname: user?.nickname,
                                locale: user?.locale
                            },
                            accessToken: accessToken // Almacenar el token de acceso en el estado
                        }
                    });
                } else {
                    dispatch({
                        type: LOGOUT
                    });
                }
            } catch (err) {
                dispatch({
                    type: LOGOUT
                });
            }
        };

        init();
    }, []);

    const login = async (options) => {
        await auth0Client.loginWithPopup(options);
        const isLoggedIn = await auth0Client.isAuthenticated();

        if (isLoggedIn) {
            const user = await auth0Client.getUser();
            const accessToken = await auth0Client.getTokenSilently(); // optenemos el token
            dispatch({
                type: LOGIN,
                payload: {
                    isLoggedIn: true,
                    user: {
                        id: user?.sub,
                        email: user?.email,
                        // SE AGREGAN TODOS LOS DATOS NECESARIOS PARA TRABAJAR EL USUARIO
                        roll: user,
                        avatar: user?.picture,
                        name: user?.name,
                        tier: 'Premium',
                        email_verified: user?.email_verified,
                        family_name: user?.family_name,
                        given_name: user?.given_name,
                        nickname: user?.nickname,
                        locale: user?.locale
                    },
                    accessToken: accessToken
                }
            });
        }
    };

    const logout = () => {
        auth0Client.logout();

        dispatch({
            type: LOGOUT
        });
    };

    const resetPassword = () => { };

    const updateProfile = () => { };

    if (state.isInitialized !== undefined && !state.isInitialized) {
        return <Loader />;
    }

    return <Auth0Context.Provider value={{ ...state, login, logout, resetPassword, updateProfile }}>{children}</Auth0Context.Provider>;
};

Auth0Provider.propTypes = {
    children: PropTypes.node
};

export default Auth0Context;
