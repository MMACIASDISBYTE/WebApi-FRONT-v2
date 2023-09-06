export const PresupuestoHelper = {
    baseUrl: process.env.REACT_APP_BASE_URL,
    rutaTabla: 'Presupuesto',
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    },

    //Consulta a la API
    fetchData: async function (accessToken) {
        try {
            const response = await fetch(`${this.baseUrl}/${this.rutaTabla}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Incluye el token en la cabecera de la solicitud.
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const jsonData = await response.json();
            // console.log('Res Presupuesto: ', jsonData);
            return jsonData;
        } catch (error) {
            console.error('Error', error);
            return null;
        }
    },
    EstimateDisponibleNum: async function (accessToken){
        try {
            const response = await fetch(`${this.baseUrl}/EstimateHeader/detalles`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Incluye el token en la cabecera de la solicitud.
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const jsonData = await response.json();
            return jsonData;
        } catch (error) {
            console.error('Error', error);
            return null;
        }
    },
    EstimateDisponibleVers: async function (estNumber, accessToken){
        try {
            const response = await fetch(`${this.baseUrl}/EstimateHeader/detalles/${estNumber}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Incluye el token en la cabecera de la solicitud.
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const jsonData = await response.json();
            return jsonData;
        } catch (error) {
            console.error('Error', error);
            return null;
        }
    },
    //Consulta a la API doble entrada
    readDataEstVers: async function (estNumber, vers, accessToken) {
        try {
            const response = await fetch(`${this.baseUrl}/${this.rutaTabla}/${estNumber}/${vers}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const jsonData = await response.json();
            return jsonData;
        } catch (error) {
            console.error('Error', error);
            return null;
        }
    },
    //CRUD PRESUPUESTO 
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
    // Crear un registro en la tabla
    createNewPresupuesto: async function (newData, estNumber) {
        try {
            const response = await fetch(`${this.baseUrl}/${this.rutaTabla}/${estNumber}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newData),
            });
            const jsonData = await response.json();
            console.log('Helper', newData);
            return jsonData;
        } catch (error) {
            console.error('Error', error);
            return null;
        }
    },
    // Leer un registro de la tabla por ID
    readDataById: async function (id) {
        try {
            const response = await fetch(`${this.baseUrl}/${this.rutaTabla}/${id}`);
            const jsonData = await response.json();
            return jsonData;
        } catch (error) {
            console.error('Error', error);
            return null;
        }
    },
    // Leer un registro de la tabla por ID y version
    readDataByIdVers: async function (estNumber, vers) {
        try {
            const response = await fetch(`${this.baseUrl}/${this.rutaTabla}/${estNumber}/${vers}`);
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
    //Cantidad de presupuestos y versiones
    amountDataFetch: async function () {
        try {
            const data = await this.fetchData();

            // Creamos un Map para almacenar las versiones por estNumber
            const versionsByEstNumber = new Map();

            data.forEach(item => {
                // Si el estNumber no está en el map, lo agregamos con un nuevo Set
                if (!versionsByEstNumber.has(item.estNumber)) {
                    versionsByEstNumber.set(item.estNumber, new Set());
                }
                // Agregamos estVers al Set correspondiente al estNumber
                versionsByEstNumber.get(item.estNumber).add(item.estVers);
            });

            // Contar estNumber distintos
            const distinctEstNumberCount = versionsByEstNumber.size;

            // Contar total de estVers
            let totalEstVersCount = 0;
            versionsByEstNumber.forEach(versions => {
                totalEstVersCount += versions.size;
            });

            return { distinctEstNumberCount, totalEstVersCount };
        } catch (error) {
            console.log(error);
        }
    },
    // Armar array segun mes
    AmountDate: async function () {
        try {
            const data = await this.fetchData();
            function countPresupuestosPerMonth (data){
                // Inicializar un array con 12 ceros, uno por cada mes.
                let monthlyCounts = Array(12).fill(0);
    
                data.forEach(item => {
                    const month = new Date(item.hTimeStamp).getMonth(); // Obtener el mes del timestamp (0-enero, 1-febrero, ..., 11-diciembre)
                    monthlyCounts[month]++;
                });
                return monthlyCounts;
            }
            return countPresupuestosPerMonth(data);
        } catch (error) {
            console.log(error);
        }
    },

}