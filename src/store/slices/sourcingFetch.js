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
    sourcing: [],
};

const slice = createSlice({
    name: 'sourcing',  //como se llama al metodo para luego ingresar a la respuesta ej inbound.inbound
    initialState,
    reducers: {

        // GET Inbound
        getSourcingSuccess(state, action) {
            state.sourcing = action.payload;
        },

        
    }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------


export function getSourcing() {
    return async (dispatch) => {
        try {
            const response = await PresupuestoHelper.fetchDataSourcing('tuTokenDeAcceso'); 
            dispatch(slice.actions.getSourcingSuccess(response));
            console.log('Get Sourcing :');
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

