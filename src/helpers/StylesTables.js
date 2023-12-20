import { makeStyles } from '@material-ui/core/styles';

export const StylesTables = makeStyles(() => ({
    tableCell: {
        borderRight: "1px solid rgba(224, 224, 224, 1)", // Color y grosor del borde
        //whiteSpace: 'nowrap',
      },
      tableCell2: {
        borderRight: "1px solid rgba(224, 224, 224, 1)", // Color y grosor del borde
        whiteSpace: "nowrap",
        padding: "1px 1px", // Ajuste del padding según necesidad
        lineHeight: "1", // Ajuste de la altura de línea según necesidad
        // fontSize: "0.875rem", // Opcional: ajuste del tamaño de la fuente si es necesario
        maxWidth: 120,
        // paddingLeft: 40,
        margin: "-5px",
      },
      tableCellCabecera: {
        borderRight: "1px solid rgba(224, 224, 224, 1)", // Color y grosor del borde
        whiteSpace: "nowrap",
        backgroundColor: "#2196f3",
        overflow: "hidden", // asegura que el contenido extra esté oculto
        padding: "5px 5px", // Ajuste del padding según necesidad
        lineHeight: "2", // Ajuste de la altura de línea según necesidad
        fontSize: "0.875rem", // Opcional: ajuste del tamaño de la fuente si es necesario
        maxWidth: 100,
        maxHeight: 3,
      },
      tableCellUltimaTarifa: {
        borderRight: "1px solid rgba(224, 224, 224, 1)", // Color y grosor del borde
        whiteSpace: "nowrap",
        backgroundColor: "lightGreen",
        overflow: "hidden", // asegura que el contenido extra esté oculto
        textOverflow: "ellipsis", // agrega puntos suspensivos al final
        padding: "6px 6px", // Ajuste del padding según necesidad
        lineHeight: "1", // Ajuste de la altura de línea según necesidad
        fontSize: "0.875rem", // Opcional: ajuste del tamaño de la fuente si es necesario
        maxWidth: 80,
        paddingLeft: 40,
      },
      tableCellTarifaAnterior: {
        borderRight: "1px solid rgba(224, 224, 224, 1)", // Color y grosor del borde
        whiteSpace: "nowrap",
        backgroundColor: "lightgray",
        overflow: "hidden", // asegura que el contenido extra esté oculto
        textOverflow: "ellipsis", // agrega puntos suspensivos al final
        padding: "6px 6px", // Ajuste del padding según necesidad
        lineHeight: "1", // Ajuste de la altura de línea según necesidad
        fontSize: "0.875rem", // Opcional: ajuste del tamaño de la fuente si es necesario
        maxWidth: 80,
        paddingLeft: 40,
      },
      lastCell: {
        borderRight: "none",
      },
  }));
  