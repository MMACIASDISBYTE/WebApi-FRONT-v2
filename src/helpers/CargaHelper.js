import { FetchService } from "utils/FetchService";

export const CargaHelper = {
    baseUrl: process.env.REACT_APP_BASE_URL,
    rutaTabla: 'Carga',
    constructor(baseUrl){
        this.baseUrl = baseUrl;
    },
    fetchData: async function () {
        try {
            const response = await FetchService.Get(this.rutaTabla);
            // console.log('CargaHelper.fetchData::response', response);
    
            return response;
        } catch (error) {
            console.error('Error', error);
            return null;
        }
    }, 

    //Consulta a la API
    DetalleContenedor: async function (id) {
        try {
            const response = await fetch(`${this.baseUrl}/${this.rutaTabla}/${id}`);
            const jsonData = await response.json();

            return jsonData;
        } catch (error) {
            console.error('Error', error);
            return null;
        }
    },
    //CRUD CANAL 
    // Crear un registro en la tabla
    createData: async function (newData) {
        try {
            const response = await fetch(`${this.baseUrl}/${this.rutaTabla}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newData),
            });
            const jsonData = await response.json();
            console.log('Helper', newData)
            return jsonData;
        } catch (error) {
            console.error('Error', error);
            return null;
        }
    },
    // Leer un registro de la tabla por ID
    readDataById: async function(id) {
        try {
            const response = await fetch(`${this.baseUrl}/${this.rutaTabla}/${id}`);
            const jsonData = await response.json();
            return jsonData;
        } catch (error) {
            console.error('Error', error);
            return null;
        }
    },
    // Actualizar un registro de la tabla por ID
    updateDataById: async function (id, updatedData) {
        try {
            const response = await fetch(`${this.baseUrl}/${this.rutaTabla}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });
            console.log(updatedData);
            const jsonData = await response.json();
            return jsonData;
        } catch (error) {
            console.error('Error', error);
            return null;
        }
    },
    // Eliminar un registro de la tabla por ID
    deleteDataById: async function (id) {
        try {
            const response = await fetch(`${this.baseUrl}/${this.rutaTabla}/${id}`, {
                method: 'DELETE',
            });
            const jsonData = await response.json();
            return jsonData;
        } catch (error) {
            console.error('Error', error);
            return null;
        }
    },

}