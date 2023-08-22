// action - state management
import { LOGIN, LOGOUT, REGISTER } from './actions';

// ==============================|| ACCOUNT REDUCER ||============================== //

const initialState = {
    isLoggedIn: false,
    isInitialized: false,
    user: null,
    accessToken: null  // Agregar accessToken al estado inicial
};

// eslint-disable-next-line
const accountReducer = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER: {
            const { user } = action.payload;
            return {
                ...state,
                user
            };
        }
        case LOGIN: {
            const { user, accessToken } = action.payload; // extraer acces token a la accion
            return {
                ...state,
                isLoggedIn: true,
                isInitialized: true,
                user,
                accessToken  // Almacenar accessToken en el estado
            };
        }
        case LOGOUT: {
            return {
                ...state,
                isInitialized: true,
                isLoggedIn: false,
                user: null,
                accessToken: null  // Limpiar accessToken del estado
            };
        }
        default: {
            return { ...state };
        }
    }
};

export default accountReducer;
