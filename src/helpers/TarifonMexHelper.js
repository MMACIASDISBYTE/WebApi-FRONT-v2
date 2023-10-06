// LISTED 27_7_2023 16:46
//
import { FetchService } from "utils/FetchService";

export const TarifonMexHelper = {
  baseUrl: process.env.REACT_APP_BASE_URL,
  rutaTabla: "TarifonMex",
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  },

  //Consulta a la API
  /*
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
*/

  // METODO POR GUSTAVO
  fetchData: async function () {
    try {
      const response = await FetchService.Get(this.rutaTabla);
      // console.log('TarifasFwdHelper.fetchData::response', response);

      return response;
    } catch (error) {
      console.error("Error", error);
      return null;
    }
  },

  // fetchData: async function () { // METODO PARA OPTENER EL ESTADO
  //     try {
  //         const response = await FetchService.Get(this.rutaTabla);
  //         console.log('TarifasFwdContHelper.fetchData::response', response);

  //         return {
  //             data: response.jsonData,
  //             status: response.status,
  //         };
  //     } catch (error) {
  //         console.error('Error', error);
  //         return {
  //             data: null,
  //             status: null,
  //         };
  //     }
  // },

  createData: async function (newData) {
    try {
      const response = await FetchService.Create(`${this.rutaTabla}`, newData);
      console.log("TarifonMex.UpdateData::response", response);

      return response;
    } catch (error) {
      console.error("Error", error);
      return null;
    }
  },

  // Leer un registro de la tabla por ID
  readDataByCargaId: async function (id) {
    try {
      const response = await fetch(`${this.baseUrl}/${this.rutaTabla}/${id}`);
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      console.error("Error", error);
      return null;
    }
  },
};
