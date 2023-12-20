import Excel from "exceljs";
import { saveAs } from "file-saver";
import { UtilidadesHelper } from "./UtilidadesHelper";
import { DatosPackaging, DatosImpositivos } from "./VariablesDeRepeticion";

const headerFill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFFFFF00" }, // Amarillo
};

export const exportToExcel = {
  exportCabecera: async (presupuestador) => {
    try {
      let cabecera = presupuestador.estHeader;
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet(
        `Datos Header 0${cabecera.estnumber}-0${cabecera.estvers}`
      );
      console.log("Hola desde exportToExcel :", presupuestador);

      // Agregar cabeceras de columna
      worksheet.columns = [
        { header: "Own", key: "own", width: 20 },
        { header: "Estimado", key: "estnumber", width: 10 },
        { header: "Vers.", key: "estvers", width: 10 },
        { header: "Descripcion", key: "description", width: 30 },
        { header: "Estado Embarque", key: "embarque", width: 30 },
        { header: "Fecha Embarque", key: "fecha_embarque", width: 20 },
        { header: "Cant. Cont.", key: "cantidad_contenedores", width: 20 },
      ];

      // Después de definir las columnas, aplicas el estilo a la primera fila
      worksheet.getRow(1).eachCell((cell) => {
        cell.fill = headerFill;
      });

      console.log("cabecera :", cabecera);

      // Agregar datos
      worksheet.addRow({
        own: cabecera.own,
        estnumber: cabecera.estnumber,
        estvers: cabecera.estvers,
        description: cabecera.description,
        embarque: cabecera.embarque,
        fecha_embarque: UtilidadesHelper.formatFechaYhora(
          cabecera.fecha_embarque
        ),
        cantidad_contenedores: cabecera.cantidad_contenedores,
      });

      // Agregar más hojas y datos según necesites

      // Escribir el archivo Excel
      const buffer = await workbook.xlsx.writeBuffer();
      const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const fileExtension = ".csv"; //extencion de exportacion a un formato general
      // const fileExtension = ".xlsx"; //extencion de exportacion a excel

      const blob = new Blob([buffer], { type: fileType });
      const fechaParaNombre = UtilidadesHelper.fechaParaVistaHoy();
      saveAs(
        blob,
        `${cabecera.own}_DataHeader${fechaParaNombre}` + fileExtension
      );
    } catch (error) {
      console.log("ERROR al Exportar :", error);
    }
  },

  ExportHistorico: async (presupuestador, historico, logDiferencias) => {
    try {
      const cabecera = presupuestador.estHeader; 
      
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet(
        `Datos Header 0${cabecera.estnumber}-0${cabecera.estvers}`
      );

      worksheet.columns = [
        { header: 'Estimado', key: 'estnumber', width: 13},
        { header: 'Fecha', key: 'htimestamp', width: 17},
        { header: 'Own', key: 'own', width: 20},
        { header: 'Estado', key: 'status', width: 12},
        { header: 'Fob Gran total', key: 'fob_grand_total', width: 20},
        { header: 'Cif Gran total', key: 'cif_grand_total', width: 20},
        { header: 'Diferencias', key: 'diferencia', width: 40},
      ];

      // Después de definir las columnas, aplicas el estilo a la primera fila
      worksheet.getRow(1).eachCell((cell) => {
        cell.fill = headerFill;
      });

      //Agregar Datos
       // Agregar Datos de cada fila del historico
      historico.forEach((row) => {
        //busco el cambio de presupuesto con el historico para mostrar el string de los cambios si esa version los tiene
        let diferencias = logDiferencias.find( dif => dif.estvers_actual === row.estvers);
        worksheet.addRow({
          estnumber: `#00${row.estnumber} /00${row.estvers}`,
          htimestamp: UtilidadesHelper.formatFechaYhora(row.htimestamp),
          own: row.own,
          status: UtilidadesHelper.BusquedaDeEstadoDeEmbarque(row.status), //devuelve el string a q corresponde el estado
          fob_grand_total: `USD ${row.fob_grand_total.toFixed(2)}`,
          cif_grand_total: `USD ${row.cif_grand_total.toFixed(2)}`,
          diferencia: diferencias ? diferencias.diferencias : 'Sin cambios',
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const fileExtension = ".csv"; //extencion de exportacion a un formato general

      const blob = new Blob([buffer], { type: fileType});
      const fechaParaNombre = UtilidadesHelper.fechaParaVistaHoy();
      saveAs(
        blob,
        `${cabecera.own}_DataHeader${fechaParaNombre}` + fileExtension
      );
      // console.log('Historico :', historico);
    } catch (error) {
      console.log("Error al Exportar :", error);
    }
  },

  ExportInforme: async (presupuestador) => {
    try {
      const cabecera = presupuestador.estHeader;
      const detalle = presupuestador.estDetails;
      const rowsAddData = presupuestador.estDetAddData;
      
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet(
        `Datos Header 0${cabecera.estnumber}-0${cabecera.estvers}`
      );

      //armo un array con los 2 array de objetos
      const columnasTotales = [...DatosPackaging, ...DatosImpositivos];

      //aqui recorro ambos array de objetos
      worksheet.columns = columnasTotales.map(dato => ({
        header: dato.nombre,
        key: dato.atributo,
        width: 15,
      }));

      // Después de definir las columnas, aplicas el estilo a la primera fila
      worksheet.getRow(1).eachCell((cell) => {
        cell.fill = headerFill;
      });

      // console.log('cabecera :', cabecera);
      // console.log('detalle :', detalle);
      // console.log('rowsAddData :', rowsAddData);

      // para añadir los datos de cada objeto en 'detalle' a la hoja de Excel.
      detalle.forEach((item, index) => { //se agrega el index para poder iterar rowAddData
        let row = {};

        // Crea un objeto 'row' que contenga las claves y valores según las definiciones de tus columnas.
        columnasTotales.forEach(({ atributo }) => {
          if(atributo === 'ncm_str'){
            row[atributo] = rowsAddData[index][atributo]; //tomo el ncm que viene de rowAddData
          } else {
            row[atributo] = item[atributo];
          }
          
        });

        // Añade la fila a la hoja de Excel.
        worksheet.addRow(row);
      });

      console.log(worksheet);
      const buffer = await workbook.xlsx.writeBuffer();
      const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const fileExtension = ".csv"; //extencion de exportacion a un formato general

      const blob = new Blob([buffer], { type: fileType});
      const fechaParaNombre = UtilidadesHelper.fechaParaVistaHoy();
      saveAs(
        blob,
        `${cabecera.own}_INFORME_${fechaParaNombre}` + fileExtension
      );
      // console.log('Historico :', historico);
    } catch (error) {
      console.log("Error al Exportar :", error);
    }
  },


};
