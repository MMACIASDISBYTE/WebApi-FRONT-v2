export const PresupuestoHelper = {
  baseUrl: process.env.REACT_APP_BASE_URL,
  rutaTabla: "Presupuesto",
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
      console.error("Error", error);
      return null;
    }
  },

  //Consulta a la API
  fetchDataSourcing: async function (accessToken) {
    try {
      const response = await fetch(`${this.baseUrl}/${this.rutaTabla}/sourcing`, {
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
      console.error("Error", error);
      return null;
    }
  },
  fetchDataInbound: async function (accessToken) {
    try {
      const response = await fetch(`${this.baseUrl}/${this.rutaTabla}/inbound`, {
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
      console.error("Error", error);
      return null;
    }
  },

  fetchOwnersList: async function (accessToken) {
    try {
      const response = await fetch(`${this.baseUrl}/${this.rutaTabla}/owners`, {
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
      console.error("Error", error);
      return null;
    }
  },

  fetchDataUltimosEstadios: async function ( estnumber, accessToken) {
    try {
      const response = await fetch(`${this.baseUrl}/recentlist/${estnumber}`, {
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
      console.error("Error", error);
      return null;
    }
  },
  EstimateDisponibleNum: async function (accessToken) {
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
      console.error("Error", error);
      return null;
    }
  },
  EstimateDisponibleVers: async function (estnumber, accessToken) {
    try {
      const response = await fetch(
        `${this.baseUrl}/EstimateHeader/detalles/${estnumber}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Incluye el token en la cabecera de la solicitud.
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      console.error("Error", error);
      return null;
    }
  },
  //Consulta a la API doble entrada
  readDataEstVers: async function (estnumber, vers, accessToken) {
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.rutaTabla}/${estnumber}/${vers}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // console.log(`${this.baseUrl}/${this.rutaTabla}/${estnumber}/${vers}`);
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      console.error("Error", error);
      // console.log(`${this.baseUrl}/${this.rutaTabla}/${estnumber}/${vers}`);
      return null;
    }
  },
  //CRUD PRESUPUESTO
  // Crear un registro en la tabla
  createDataSourcing: async function (newData) {
    try {
      const response = await fetch(`${this.baseUrl}/${this.rutaTabla}/sourcing`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      });
      if (!response.ok) {
        // Lanzar un error si el servidor responde con un estado de error
        const errorMessage = await response.text(); // O response.json() si el error es un objeto JSON
        throw new Error(errorMessage);
      }

      const jsonData = await response.json();
      console.log("Helper", newData);
      return jsonData;
    } catch (error) {
      console.error("Helper Error", error.message);
      throw error;
    }
  },
  createDataInbound: async function (newData) {
    try {
      const response = await fetch(`${this.baseUrl}/${this.rutaTabla}/inbound`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      });
      if (!response.ok) {
        // Lanzar un error si el servidor responde con un estado de error
        const errorMessage = await response.text(); // O response.json() si el error es un objeto JSON
        throw new Error(errorMessage);
      }

      const jsonData = await response.json();
      console.log("Helper", newData);
      return jsonData;
    } catch (error) {
      console.error("Helper Error", error.message);
      throw error;
    }
  },
  // Crear un registro en la tabla
  createNewPresupuesto: async function (newData, estnumber) {
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.rutaTabla}/${estnumber}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newData),
        }
      );
      if (!response.ok) {
        // Lanzar un error si el servidor responde con un estado de error
        const errorMessage = await response.text(); // O response.json() si el error es un objeto JSON
        throw new Error(errorMessage);
      }

      const jsonData = await response.json();
      console.log("Helper", newData);
      return jsonData;
    } catch (error) {
      console.error("Helper Error", error);
      throw error; // Lanzamos el error para que pueda ser capturado por el código que llama a esta función
    }
  },
  // Leer un registro de la tabla por ID
  readDataById: async function (id) {
    try {
      const response = await fetch(`${this.baseUrl}/${this.rutaTabla}/${id}`);
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      console.error("Error", error);
      return null;
    }
  },
  // Leer un registro de la tabla por ID y version
  readDataByIdVers: async function (estnumber, vers) {
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.rutaTabla}/${estnumber}/${vers}`
      );
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      console.error("Error", error);
      return null;
    }
  },
  // Actualizar un registro de la tabla por ID
  updateDataById: async function (id, updatedData) {
    try {
      const response = await fetch(`${this.baseUrl}/${this.rutaTabla}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      console.log(updatedData);
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      console.error("Error", error);
      return null;
    }
  },
  // Eliminar un registro de la tabla por ID
  deleteDataById: async function (id) {
    try {
      const response = await fetch(`${this.baseUrl}/${this.rutaTabla}/${id}`, {
        method: "DELETE",
      });
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      console.error("Error", error);
      return null;
    }
  },
  //Cantidad de presupuestos y versiones
  amountDataFetch: async function () {
    try {
      const data = await this.fetchData();

      // Creamos un Map para almacenar las versiones por estnumber
      const versionsByEstNumber = new Map();

      data.forEach((item) => {
        // Si el estnumber no está en el map, lo agregamos con un nuevo Set
        if (!versionsByEstNumber.has(item.estnumber)) {
          versionsByEstNumber.set(item.estnumber, new Set());
        }
        // Agregamos estVers al Set correspondiente al estnumber
        versionsByEstNumber.get(item.estnumber).add(item.estVers);
      });

      // Contar estnumber distintos
      const distinctEstNumberCount = versionsByEstNumber.size;

      // Contar total de estVers
      let totalEstVersCount = 0;
      versionsByEstNumber.forEach((versions) => {
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
      function countPresupuestosPerMonth(data) {
        // Inicializar un array con 12 ceros, uno por cada mes.
        let monthlyCounts = Array(12).fill(0);
        // console.log(data);

        data.forEach((item) => {
          const month = new Date(item.htimestamp).getMonth(); // Obtener el mes del timestamp (0-enero, 1-febrero, ..., 11-diciembre)
          monthlyCounts[month]++;
        });
        return monthlyCounts;
      }
      return countPresupuestosPerMonth(data);
    } catch (error) {
      console.log(error);
    }
  },
  fetchDataHistorico: async function (estimado) {
    try {
      const response = await fetch(`${this.baseUrl}/EstimateHeader/Trace/${estimado}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      
      return jsonData;
    } catch (error) {
      console.error("Error", error);
      return null;
    }
  },
  fetchLogHistorico: async function (estnumber) {
    try {
      const response = await fetch(`${this.baseUrl}/LogDiferencias/${estnumber}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();

      return jsonData;
    } catch (error) {
      console.error("Error", error);
      return null;
    }
  },
  fetchLogHistoricoVersion: async (estnumber, vers) => {
    try {
        const response = await fetch(`${this.baseUrl}/LogDiferencias/${estnumber}/${vers}`);
        if(!response.ok){
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        return jsonData;
    } catch (error) {
        console.error('Error :', error)
    }
},

};
