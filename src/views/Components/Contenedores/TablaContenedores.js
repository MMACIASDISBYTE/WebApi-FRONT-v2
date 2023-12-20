import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import { useCommonStyles } from "helpers/CommonStyles";

const getTriggerLevel=(maxcol,maxrow,col,row,value)=>
      {
          const porct100=maxcol*maxrow;
          const celdasPintar=Math.ceil((value/100)*porct100);
          const posActual=(col*maxcol)+row;
          // console.log(porct100,celdasPintar,posActual)
          if(posActual>=celdasPintar)
          {
            return true;
          }
          {
            return false;
          }
      };

// const columnas = 7;


export const TablaContenedores = ({
  porcentaje = 0,
  carga,
  limiteConte=1,
  cantidadConte=-1
  }) => {

  let limiteContenedores
  // Si limiteContenedores es 0, esta en AUTO. Por lo tanto el limite es el Ceil de la cantidad de contenedores 
  // que se este usando (cantidadConte)
  // Si no esta en modo auto, el limite, es entonces el limite ingresado.
  if(limiteConte==0)
  {
      limiteContenedores=Math.ceil(cantidadConte);      
  }
  else
  {
      limiteContenedores=limiteConte;
  }

  // En la tabla, aprovecho para mostrar en las celdas alguna info.
  // Preparo los string aca asi no se ilegible el array.
  let strPorcentaje=porcentaje?(porcentaje.toFixed(1)+"%"):("");
  let strLabelContenedor=cantidadConte>0 ? "Cont." : "";
  let strUsoContenedores=cantidadConte>0?(Math.ceil(cantidadConte)+"/"+limiteContenedores):"";
  let strEqDescription=carga?.description ? (carga?.description):("");
  let strEqPeso=carga?.weight? (carga?.weight + "kg"):("");
  let strEqVolume= carga?.volume?(carga?.volume+"m3"):("")
  const tableData = [
                    // En el primer cuadrado pongo el procenta de ocupacion del presente contenedor
                    [strPorcentaje   ,  "" , "" , "" , "" , ""],
                    ["", "", "", "", "", ""],
                    //["", "", "", "20ST", "28240kg", "27m3"],
                    ["", "", "", "", "", ""],
                    // En el medio de la tabla pongo cuantos contenedores se usaron respecto del total. Las llamadas que no pasen como parametro
                    // limite de carga, la dejaran con su valor default, negativo. Si es negativo no muestro nada. Esto es para componentes que no 
                    // quieran mostrar esta info. Si no pasan la prop, no se muestra.
                    ["", "", strLabelContenedor, strUsoContenedores, "", ""],
                    ["", "", "", "", "", ""],
                    //["", "", "", "40ST", "26850kg", "60m3"],
                    ["", "", "", "", "", ""],
                    ["", "", "" , strEqDescription , strEqPeso , strEqVolume],
    ];

  // porcentaje=90;

  useEffect(() => {

  },[porcentaje,carga])

  const classes = useCommonStyles();
  return (
    <>
      <TableContainer component={Paper}>
        <Table
          sx={{ alignItems: "center" }}
          aria-label="simple table"
        >
          <TableBody>
            {Array.from({ length: tableData[0].length }).map((_, rowIndex) => (
              <TableRow key={rowIndex} className={classes.tableRowContenedor}>
                {tableData.map((column, columnIndex) => (
                  <TableCell className={getTriggerLevel(6,7,columnIndex,rowIndex,porcentaje)?classes.classesContenedor:((porcentaje>90)?classes.tableCellLlenadoAlarm:classes.tableCellLlenado)} key={columnIndex}>
                    {column[rowIndex]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
