// import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';
import AuthenticationRoutes from './AuthenticationRoutes';
import { useAccessTokenJWT } from 'helpers/useAccessTokenJWT';
// import Loadable from 'ui-component/Loadable';

// const PagesLanding = Loadable(lazy(() => import('views/pages/landing')));

// ==============================|| ROUTING RENDER ||============================== //

export default function ThemeRoutes() {
    //manejo rutas segun permiso
    const autorizacion = useAccessTokenJWT();
    console.log(autorizacion);
    // return useRoutes([{ path: '/', element: <PagesLanding /> }, AuthenticationRoutes, LoginRoutes, MainRoutes]);
    return useRoutes([LoginRoutes, AuthenticationRoutes, MainRoutes]);
}
