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
    productreviews: []
};

const slice = createSlice({
    name: 'customer',
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

export function getCustomers() {
    return async () => {
        try {
            const response = await PresupuestoHelper.fetchData('tuTokenDeAcceso'); // Recuerda cambiar 'tuTokenDeAcceso' por tu token real
            dispatch(slice.actions.getCustomersSuccess(response));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}

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
