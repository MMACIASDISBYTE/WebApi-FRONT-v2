import { Formik } from "formik";

export const UtilidadesHelper = {
  baseUrl: "https://api.apilayer.com/exchangerates_data/convert?to=",
  baseUrlLive:
    "https://api.apilayer.com/currency_data/live?source=USD&currencies=",
  paises: "ARS%2C%20BRL%2C%20MXN%2C%20COP%2C%20CNY",

  // CONSULTA DE TIPO DE CAMBIO VERSION GRATUITA, SON 1000 CONSULTAS AL DIA
  tipoCambioGeneral: async function () {
    try {
      // Definir myHeaders y requestOptions aquí
      let myHeaders = new Headers();
      myHeaders.append("apikey", "XfS8XFaq0OTkopXqkJvYuErqx1UdzTQ5");
      let requestOptions = {
        method: "GET",
        redirect: "follow",
        headers: myHeaders,
      };

      const response = await fetch(
        `${this.baseUrlLive}${this.paises}`,
        requestOptions
      );
      const jsonData = await response.json();

      return jsonData;
    } catch (error) {
      console.error("Error", error);
      return null;
    }
  },
  // Consulta a la API por tipoi de cambio individual
  DolarPeso: async function () {
    try {
      // Definir myHeaders y requestOptions aquí
      let myHeaders = new Headers();
      myHeaders.append("apikey", "XfS8XFaq0OTkopXqkJvYuErqx1UdzTQ5");
      let requestOptions = {
        method: "GET",
        redirect: "follow",
        headers: myHeaders,
      };

      const response = await fetch(
        `${this.baseUrl}ARS&from=USD&amount=1`,
        requestOptions
      );
      const jsonData = await response.json();

      return jsonData;
    } catch (error) {
      console.error("Error", error);
      return null;
    }
  },
  //Formateamos la moneda a pesos ES
  formatNumber: function (number) {
    return new Intl.NumberFormat("es-ES").format(parseFloat(number));
  },
  fechaParaVista: function () {
    const today = new Date();
    const dateString = `${today.getFullYear()}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${today.getFullYear()}`;
    return dateString;
  },
  fechaParaDB: function () {
    const today = new Date();
    const isoString = today.toISOString();
    return isoString;
  },
  formatFecha: function (fechaJSON) {
    const fecha = new Date(fechaJSON);
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
    const ano = fecha.getFullYear();

    return `${dia}/${mes}/${ano}`;
  },
  formatFechaYhora: function (fechaJSON) {
    const fecha = new Date(fechaJSON);

    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
    const ano = fecha.getFullYear();
    // Extraer las partes de la hora
    const horas = String(fecha.getHours()).padStart(2, "0");
    const minutos = String(fecha.getMinutes()).padStart(2, "0");

    return `${dia}/${mes}/${ano} ${horas}:${minutos}hs`;
  },
  valueToBoolArr: function (valInt) {
    const arrBool = Array(30).fill(false);
    let nuevoArr = arrBool.map((valor, index) =>
      valInt & (1 << index) ? (valor = true) : (valor = false)
    );
    // console.log(nuevoArr);
    // setTarifUpdate(nuevoArr); //ESTO SETEABA UN VALOR A UN USESTATE
    return nuevoArr;
  },
  valueToBoolArrPosition: function (valInt, position) {
    const arrBool = Array(30).fill(false);
    const nuevoArr = arrBool.map((valor, index) =>
      valInt & (1 << index) ? true : false
    );

    if (position != null && position >= 0 && position < nuevoArr.length) {
      // Si la posición es válida, retornamos el valor en esa posición.
      return nuevoArr[position];
    } else {
      // Si la posición no es válida, retornamos todo el array.
      return nuevoArr;
    }
  },
  boolArrToValue: function (boolArr) {
    const valor = boolArr.reduce((accumulator, currentValue, index) => {
      return accumulator + (currentValue ? 1 << index : 0);
    }, 0);

    return valor;
  },
  handleChangeCustom: function (event, formik, name) {
    let inputValue = event.target.value;
    // Reemplaza dos puntos o comas consecutivos por un solo punto
    inputValue = inputValue.replace(/\.{2,}/g, ".").replace(/,{2,}/g, ",");
    // Reemplaza la coma por un punto
    inputValue = inputValue.replace(",", ".");
    // Valida si el inputValue es un número
    if (!isNaN(inputValue) || inputValue === "." || inputValue === "") {
      // Aquí puedes asignar el valor numérico a Formik o mantenerlo como una cadena según tus necesidades.
      formik.setFieldValue(name, inputValue);
    }
  },
  handleChangeCustomSinFormik: function (
    event,
    formik,
    name,
    dataType,
    setStateFunction
  ) {
    let inputValue = event.target.value;

    // Permitir el ingreso de '0' al inicio
    if (inputValue === "0") {
      if (formik) {
        formik.setFieldValue(name, inputValue);
      }

      if (setStateFunction) {
        setStateFunction((prevState) => ({ ...prevState, [name]: inputValue }));
      }
      return; // terminamos aquí para permitir el '0' inicial
    }

    // Si el valor empieza con un punto, agregamos un "0" al inicio.
    if (inputValue.startsWith(".")) {
      inputValue = "0" + inputValue;
    }

    // Reemplaza dos puntos o más consecutivos por un solo punto
    inputValue = inputValue.replace(/\.{2,}/g, ".");

    // Reemplaza la coma por un punto
    inputValue = inputValue.replace(",", ".");

    if (!isNaN(inputValue) || inputValue === "." || inputValue === "") {
      if (formik) {
        formik.setFieldValue(name, inputValue);
      }

      if (setStateFunction) {
        // Si el tipo de dato es 'Number', mantengo el valor como una cadena hasta que sea necesario convertirlo
        if (dataType === "number") {
          setStateFunction((prevState) => ({
            ...prevState,
            [name]: parseFloat(inputValue),
          }));
        } else {
          setStateFunction((prevState) => ({
            ...prevState,
            [name]: inputValue,
          }));
        }
      }
    }
  },
};
