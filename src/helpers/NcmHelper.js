// LISTED 11/7/2023 13:15PM  
//
export const NcmHelper = {
    baseUrl: process.env.REACT_APP_BASE_URL,
    rutaTablaArg: 'NCM',
    rutaTablaMex: 'NCM_Mex',
    constructor(baseUrl){
        this.baseUrl = baseUrl;
    },

    //Consulta a la API
    fetchData: async function () {
        try {
            const response = await fetch(`${this.baseUrl}/${this.rutaTablaArg}`);
            const jsonData = await response.json();
            const jsonDataStatus = await response;
            // return [jsonData, jsonDataStatus];
            return jsonData;
        } catch (error) {
            console.error('Error', error);
            return null;
        }
    },
    //CRUD 
    // Crear un registro en la tabla
    createData: async function (newData) {
        try {
            const response = await fetch(`${this.baseUrl}/${this.rutaTablaArg}`, {
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
            const response = await fetch(`${this.baseUrl}/${this.rutaTablaArg}/${id}`);
            const jsonData = await response.json();
            return jsonData;
        } catch (error) {
            console.error('Error', error);
            return null;
        }
    },
    // Actualizar un registro de la tabla por ID
    updateDataById: async function (code, updatedData) {
        try {
            if(updatedData.vc===null)
            {
                updatedData.vc="";
            }
            if(updatedData.bit_bk===null)
            {
                updatedData.bit_bk="";
            }
            const response = await fetch(`${this.baseUrl}/${this.rutaTablaArg}/${code}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });
            console.log("LEER");
            console.log(code);
            console.log(updatedData);
            const jsonData = await response.json();
            return jsonData;
        } catch (error) {
            console.error('Error', error);
            return null;
        }
    },
    // Eliminar un registro de la tabla por ID
    deleteDataByCode: async function (id) {
        try {
            const response = await fetch(`${this.baseUrl}/${this.rutaTablaArg}/${id}`, {
                method: 'DELETE',
            });
            const jsonData = await response.json();
            return jsonData;
        } catch (error) {
            console.error('Error', error);
            return null;
        }
    },

    // MEXICO
    //Consulta a la API
    fetchDataMex: async function () {
        try {
            const response = await fetch(`${this.baseUrl}/${this.rutaTablaMex}`);
            const jsonData = await response.json();
            const jsonDataStatus = await response;
            // return [jsonData, jsonDataStatus];
            return jsonData;
        } catch (error) {
            console.error('Error', error);
            return null;
        }
    },
    //CRUD 
    // Crear un registro en la tabla
    createDataMex: async function (newData) {
        try {
            const response = await fetch(`${this.baseUrl}/${this.rutaTablaMex}`, {
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
    readDataByIdMex: async function(id) {
        try {
            const response = await fetch(`${this.baseUrl}/${this.rutaTablaMex}/${id}`);
            const jsonData = await response.json();
            return jsonData;
        } catch (error) {
            console.error('Error', error);
            return null;
        }
    },
    // Actualizar un registro de la tabla por ID
    updateDataByIdMex: async function (code, updatedData) {
        try {
            if(updatedData.vc===null)
            {
                updatedData.vc="";
            }
            if(updatedData.bit_bk===null)
            {
                updatedData.bit_bk="";
            }
            const response = await fetch(`${this.baseUrl}/${this.rutaTablaMex}/${code}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });
            console.log("LEER");
            console.log(code);
            console.log(updatedData);
            const jsonData = await response.json();
            return jsonData;
        } catch (error) {
            console.error('Error', error);
            return null;
        }
    },
    // Eliminar un registro de la tabla por ID
    deleteDataByIdMex: async function (id) {
        try {
            const response = await fetch(`${this.baseUrl}/${this.rutaTablaMex}/${id}`, {
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