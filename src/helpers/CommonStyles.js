const { makeStyles } = require("@material-ui/core");


//aqui tenemos insertados los estilos que vamos dando a la app por fuera del template

// variables de colores
const colorCabeceraTablas = '#a6a6a6';
const colorDetallesTablas = '#2196f3';
const colorLineasCabeceraGeneral = '1px solid rgba(224, 224, 224, 1)';
const colorLineasBodyConOpacidad = '1px solid rgba(224, 224, 224, 1.5)';

// color Contenedores
const colorBorderContenedor = "1px solid rgba(101, 101, 101, 1)";
const colorClassesContenedor = "#fafafa";
const colorTableCellLlenado = "#eafade";
const colorTableCellLlenadoAlarm = "#fadede";


export const useCommonStyles = makeStyles({

    // ESTILOS DE INFORME //   ESTILOS DETAILS
  tableCellCabecera: {
    borderLeft: colorLineasCabeceraGeneral,
    borderRight: colorLineasCabeceraGeneral, // Color y grosor del borde
    whiteSpace: "nowrap",
    padding: "6px 6px", // Ajuste del padding según necesidad
    lineHeight: "1.4", // Ajuste de la altura de línea según necesidad
    fontSize: "0.875rem", // Opcional: ajuste del tamaño de la fuente si es necesario
    // backgroundColor: "#66f0fa",
    maxWidth: "100px",
    // color: 'white',
    fontWeight: 500, // se puede intentar con 700, 800, etc.
  },
  tableCellCabecera2: {
    borderLeft: colorLineasCabeceraGeneral,
    borderRight: colorLineasCabeceraGeneral, 
    whiteSpace: "nowrap",
    padding: "6px 6px", 
    lineHeight: "1.4",
    fontSize: "0.875rem", 
    // backgroundColor: "#97e8a4",
    maxWidth: "100px",
    // color: 'white',
    fontWeight: 500, 
  },
  tableCellCabecera3: { // se usa en las cabeceras de DEATILS Y TAMBIEN EN LISTA
    borderLeft: colorLineasCabeceraGeneral,
    borderRight: colorLineasCabeceraGeneral, 
    whiteSpace: "nowrap",
    padding: "6px 6px", 
    lineHeight: "1.4", 
    fontSize: "0.875rem", 
    backgroundColor: colorCabeceraTablas,
    // maxWidth: "135px",
    whiteSpace: 'normal', //determina cómo se manejan los espacios en blanco dentro del elemento
    wordWrap: 'break-word', // permite que, si una palabra es demasiado larga para caber dentro de la anchura definida para su contenedor
    color: "white",
    fontWeight: 500, 
  }, 
  tableCellCabecera4: { // se usa en las cabeceras de DEATILS Y TAMBIEN EN LISTA
    borderLeft: colorLineasCabeceraGeneral,
    borderRight: colorLineasCabeceraGeneral, 
    // whiteSpace: "nowrap",
    padding: "6px 6px", 
    lineHeight: "1", 
    fontSize: "0.875rem", 
    backgroundColor: colorCabeceraTablas,
    maxWidth: "110px",
    color: "white",
    fontWeight: 600, 
  },

  tableCell: {
    border: colorLineasBodyConOpacidad, // Color y grosor del borde
    whiteSpace: "nowrap",
    padding: "6px 6px", // Ajuste del padding según necesidad
    lineHeight: "1.2", // Ajuste de la altura de línea según necesidad
    fontSize: "0.875rem", // Opcional: ajuste del tamaño de la fuente si es necesario
    overflow: "hidden", // asegura que el contenido extra esté oculto
    textOverflow: "ellipsis", // agrega puntos suspensivos al final
    maxWidth: "110px",
  },
  tableCellMedium: {
    border: colorLineasBodyConOpacidad, // Color y grosor del borde
    whiteSpace: "nowrap",
    padding: "6px 6px", // Ajuste del padding según necesidad
    lineHeight: "1.2", 
    fontSize: "0.875rem", 
    overflow: "hidden", 
    textOverflow: "ellipsis", 
    maxWidth: "180px",
  },
  lastCell: {
    borderRight: "none",
  },
  tableRow: {
    //aplica estilo salteado de color para su lectura
    "&:nth-of-type(even)": {
      //aqui aplica a indices PARES y si quiero a indices IMPARES se aplica '&:nth-of-type(odd)'
      backgroundColor: "rgba(0, 0, 0, 0.05)", // un gris muy claro
    },
  },
  tableCellMediumSuspensivos: {
    border: colorLineasCabeceraGeneral, // Color y grosor del borde
    maxWidth: 150, // o cualquier otro valor que se ajuste a tus necesidades
    overflow: "hidden", // asegura que el contenido extra esté oculto
    textOverflow: "ellipsis", // agrega puntos suspensivos al final
    whiteSpace: "nowrap", // mantiene el texto en una sola línea
  },
  tableCellMediumSuspensivosSmall: {
    border: colorLineasCabeceraGeneral, 
    maxWidth: 150, 
    overflow: "hidden", 
    textOverflow: "ellipsis", 
    whiteSpace: "nowrap", // mantiene el texto en una sola línea
    padding: "5px 5px", // Ajuste del padding según necesidad
  },
  // estilo para eliminar las flechas del input numerico  
  noSpinners: {  
    "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button":
      {
        "-webkit-appearance": "none",
        margin: 0,
      },
    "& input[type=number]": {
      "-moz-appearance": "textfield",
    },
  },
  


  //ESTILOS EN vista de LISTA DETALLE 
  tableCellCabeceraListaDetalle: { //CABECERA ORIGINAL EN AZUL
    borderRight: colorLineasCabeceraGeneral, // Color y grosor del borde
    minWidth: 100,
    whiteSpace: "nowrap",
    overflow: "hidden", // asegura que el contenido extra esté oculto
    backgroundColor: colorDetallesTablas,
    padding: "6px 16px", // Ajuste del padding según necesidad
    lineHeight: "1", // Ajuste de la altura de línea según necesidad
    fontSize: "0.875rem", // Opcional: ajuste del tamaño de la fuente si es necesario
    maxWidth: 100,
  },
  //estilos BodyTable
  tableCellBodyListaDetalle: {
    borderRight: colorLineasCabeceraGeneral, 
    whiteSpace: "nowrap",
    overflow: "hidden", 
    textOverflow: "ellipsis", 
    padding: "6px 6px", 
    lineHeight: "1", 
    fontSize: "0.875rem", 
    maxWidth: 130,
  },
  tableCellBodyListaDetalleAVATAR: {
    borderRight: colorLineasCabeceraGeneral, 
    whiteSpace: "nowrap",
    overflow: "hidden", 
    textOverflow: "ellipsis", 
    padding: "6px 6px", 
    lineHeight: "1", 
    fontSize: "0.875rem", 
    maxWidth: 80,
    paddingLeft: 40,
  },


  //ESTILOS CONTENEDOR
  tableRowContenedor: {
    height: "25px", 
    fontStyle: "Italic",
  },
  classesContenedor: {
    border: colorBorderContenedor, 
    whiteSpace: "nowrap",
    padding: "2px 2px", 
    backgroundColor: colorClassesContenedor,
    maxWidth: '5px',
    maxHeight: '5px',
    textAlign:"center"
  },
  tableCellLlenado: {
    border: colorBorderContenedor, 
    whiteSpace: "nowrap",
    padding: "2px 2px", 
    backgroundColor: colorTableCellLlenado,
    maxWidth: '5px',
    maxHeight: '5px',
    textAlign:"center"
  },
  tableCellLlenadoAlarm: {
    border: colorBorderContenedor, 
    whiteSpace: "nowrap",
    padding: "2px 2px", 
    maxWidth: "5px",
    backgroundColor: colorTableCellLlenadoAlarm,
    textAlign:"center"  
  },
  
});
