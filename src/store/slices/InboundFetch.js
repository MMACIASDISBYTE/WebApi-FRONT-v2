// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
import axios from 'utils/axios';
import { dispatch } from '../index';
import { PresupuestoHelper } from 'helpers/PresupuestoHelper';

// ----------------------------------------------------------------------

const initialState = {
    error: null,
    orders: [],

    //hay que declarar el estado inicial
    inbound: [],
};

const slice = createSlice({
    name: 'inbound',  //como se llama al metodo para luego ingresar a la respuesta ej inbound.inbound
    initialState,
    reducers: {

        // GET Inbound
        getInboundSuccess(state, action) {
            state.inbound = action.payload;
        },

        // GET ORDERS
        getOrdersSuccess(state, action) {
            state.orders = action.payload;
        },

        
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------


export function getInbound() {
    return async (dispatch) => {
        try {
            const response = await PresupuestoHelper.fetchDataInbound('tuTokenDeAcceso'); 
            dispatch(slice.actions.getInboundSuccess(response));
            console.log('Get Inbound :');
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
};

export function getOrders() {
    return async (dispatch) => {
        try {
            const response = await axios.get('/api/inbound/order/list');
            dispatch(slice.actions.getOrdersSuccess(response.data.orders));
        } catch (error) {
            dispatch(slice.actions.hasError(error));
        }
    };
}


