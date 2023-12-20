// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';
import { PresupuestoHelper } from 'helpers/PresupuestoHelper';

// ----------------------------------------------------------------------

const initialState = {
    error: null,
    customers: [],
    orders: [],
    products: [],
    productreviews: [],

    //hay que declarar el estado inicial
    sourcing: [],
    inbound: [],
};

const slice = createSlice({
    name: 'customer',  //como se llama al metodo para luego ingresar a la respuesta ej customer.inbound
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },

        // GET CUSTOMERS
        getCustomersSuccess(state, action) {
            state.customers = action.payload;
        },

        // GET Sourcing
        getSourcingSuccess(state, action) {
            state.sourcing = action.payload;
        },

        // GET Inbound
        getInboundSuccess(state, action) {
            state.inbound = action.payload;
        },

        // GET ORDERS
        getOrdersSuccess(state, action) {
            state.orders = action.payload;
        },

        // GET PRODUCTS
        getProductsSuccess(state, action) {
            state.products = action.payload;
        },

        // GET PRODUCT REVIEWS
        getProductReviewsSuccess(state, action) {
            state.productreviews = action.payload;
        }
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getCustomersSourcing() {
    return async () => {
        try {
            const response = await PresupuestoHelper.fetchDataSourcing('tuTokenDeAcceso'); // Recuerda cambiar 'tuTokenDeAcceso' por tu token real
            dispatch(slice.actions.getCustomersSuccess(response));
            console.log('Get Sourcing');
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getCustomersInbound() {
    return async () => {
        try {
            const response = await PresupuestoHelper.fetchDataInbound('tuTokenDeAcceso'); // Recuerda cambiar 'tuTokenDeAcceso' por tu token real
            dispatch(slice.actions.getCustomersSuccess(response));
            console.log('Get Customers');
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}


//REALIZADOS PARA EL HOME tanto Sourcing y Inbound
export function getSourcing() {
    return async () => {
        try {
            const response = await PresupuestoHelper.fetchDataSourcing('tuTokenDeAcceso'); 
            dispatch(slice.actions.getSourcingSuccess(response));
            console.log('Get Sourcing');
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
};
export function getInbound() {
    return async () => {
        try {
            const response = await PresupuestoHelper.fetchDataInbound('tuTokenDeAcceso'); 
            dispatch(slice.actions.getInboundSuccess(response));
            console.log('Get Inbound');
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
};

export function getOrders() {
    return async () => {
        try {
            const response = await axios.get('/api/customer/order/list');
            dispatch(slice.actions.getOrdersSuccess(response.data.orders));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getProducts() {
    return async () => {
        try {
            const response = await PresupuestoHelper.fetchData('tuTokenDeAcceso'); // Recuerda cambiar 'tuTokenDeAcceso' por tu token real
            dispatch(slice.actions.getProductsSuccess(response));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

export function getProductReviews() {
    return async (dispatch) => { // El dispatch ahora viene desde thunk
        try {
            const response = await PresupuestoHelper.fetchData('tuTokenDeAcceso'); // Recuerda cambiar 'tuTokenDeAcceso' por tu token real
            dispatch(slice.actions.getProductReviewsSuccess(response));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}
