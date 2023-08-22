// LISTED FIRST 12/7/2023 8:16AM

// import { FetchService } from "utils/FetchServiceC";

export const TarifasFwdContHelper = {
    baseUrl: process.env.REACT_APP_BASE_URL,
    rutaTabla: 'TarifasFwdCont',
    constructor(baseUrl){
        this.baseUrl = baseUrl;
    },

 //Consulta a la API
    fetchData: async function () {
    try {
        const response = await fetch(`${this.baseUrl}/${this.rutaTabla}`);
        const jsonData = await response.json();
        const jsonDataStatus = await response;
        return [jsonData, jsonDataStatus];
    } catch (error) {
        console.error('Error', error);
        return null;
    }
},   
fetchData2: async function () {
    try {
        try {
            const response = await FetchService.Get(this.rutaTabla);
            console.error('TarifasFwdContHelper.fetchData.response', response);

            return response;
        } catch (error) {
            console.error('Error', error);
            return null;
        }

    } catch (error) {
        console.error('Error', error);
        return null;
    }
},   
fetchData3: async function () {
    try {
        
        const response = await fetch(`${this.baseUrl}/${this.rutaTabla}`);
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

        // Leer un registro de la tabla direccionando por FWD/TIPO_CONT. Se asume que este par es UNICO
        // a lo largo de la tabla. La necesidad sutge por que esta tabla es una doble entrada. A MEJORAR
        readDataByFwdByCont: async function(fwd,cont) {
            try {
                const response = await fetch(`${this.baseUrl}/${this.rutaTabla}/${fwd}/${cont}`);
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

        // Borrar una linea identificada por el PAR FWD / TIPO_CONT que se asume es unico a lo largo
        // de la tabla. Esto se debe a que la tabla es una doble entrada. A MEJORAR.
        deleteDataByFwdByCont: async function (fwd,cont) {
            try {
                const response = await fetch(`${this.baseUrl}/${this.rutaTabla}/${fwd}/${cont}`, {
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