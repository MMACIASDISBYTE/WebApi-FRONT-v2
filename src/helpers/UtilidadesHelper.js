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
  formatFechaYhora: function(fechaJSON){
    const fecha = new Date(fechaJSON);

    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
    const ano = fecha.getFullYear();
    // Extraer las partes de la hora
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');

    return `${dia}/${mes}/${ano} ${horas}:${minutos}hs`;
  }
};
