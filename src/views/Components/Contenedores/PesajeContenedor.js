// LISTED 15_11_2023 16:37PM
// Se repara bug actualizacion tardia de las cuentas de las barras respecto de la barras en si.
// El calculo de la cantidad de contenedores parece por algun motivo mas lento que el render y las barras siempre
// trabajan sobre el render previo.


import Chip from "ui-component/extended/Chip";
import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { CargaHelper } from "helpers/CargaHelper";
import { UtilidadesHelper } from "helpers/UtilidadesHelper";
import { useTheme } from "@emotion/react";
import Box from "@mui/material/Box";
import { BarraContenedores } from "./BarraContenedores";

export const PesajeContenedor = ({
  productsData = null,
  tipoContenedor = null,
}) => {
  // console.log(productsData, tipoContenedor);
  const theme = useTheme();
  const [peso, setPeso] = useState(0);
  const [volume, setVolumen] = useState(0);

  const [contenedores, setContenedores] = useState(0);
  const [mostrarContenedores, setMostrarContenedores] = useState(false);
  const [contCalcInfo, setContCalcInfo] = useState({ contEnt: 0, contFrac: 0 });


  // console.log(tipoContenedor);

  useEffect(() => {
    if (tipoContenedor!=undefined & productsData!=undefined) {
      // 1. Suma de todos los pesoUnitxCaja
      const pesoTotal = productsData.reduce((acc, product) => {
        const pesoPorCaja = parseFloat(product.gwctn || 0);
        const piezasPorCaja = parseFloat(product.pcsctn || 1);
        const pesoPorPieza = pesoPorCaja / piezasPorCaja;
        const cantidadDePiezas = parseFloat(product.qty || 1);
        return acc + cantidadDePiezas * pesoPorPieza;
      }, 0);

      // 2. Suma de todos los cbmxCaja
      const CMB_grandTotal = productsData.reduce((acc, product) => {
        const cantidadPiezas = parseFloat(product.qty || 0);
        const piezasPorCaja = parseFloat(product.pcsctn || 1);
        const cantidadDeCajas = Math.ceil(cantidadPiezas / piezasPorCaja);
        const volumenPorCaja = parseFloat(product.cbmctn || 0);
        return acc + volumenPorCaja * cantidadDeCajas;
      }, 0);
      setPeso(pesoTotal);
      setVolumen(CMB_grandTotal);


      // NO DAR ENTERS AL PEDO EN LAS EXPRESIONES !!!!!. NO ES JSX
      if ((pesoTotal / tipoContenedor.weight) > (CMB_grandTotal / tipoContenedor.volume)) 
      {
        setContenedores(pesoTotal / tipoContenedor.weight);
        // Calculo simple de contenedores. Por hoy obtengo parte entera y parte fraccionaria
        setContCalcInfo({ contEnt: Math.floor(contenedores), contFrac: (contenedores - Math.floor(contenedores)) * 100});
      } 
      else 
      {
        // console.log(CMB_grandTotal / contenedor.volume);
        setContenedores(CMB_grandTotal / tipoContenedor.volume);
        // Calculo simple de contenedores. Por hoy obtengo parte entera y parte fraccionaria
        setContCalcInfo({contEnt: Math.floor(contenedores), contFrac: ((contenedores - Math.floor(contenedores)) * 100)});
      }
      setMostrarContenedores(true);

      // console.log('Peso: ', pesoTotal, ' Volumen: ', CMB_grandTotal);
    }
    // console.log(productsData);
  }, [productsData, tipoContenedor,contenedores,mostrarContenedores,peso,volume]);
  // 6_11_2023: BUG DE QUE NO CARGA LA VOLUMETRIA AL INGRESA. Contenedor viene de un fetch y es undefined al momento del calculo. Luego el componente no se
  // llama mas. Agrego "contenedor" al use effect para que cuando llegue desde el fetch, se dispare de nuevo este calculo.


  return (
    <>
      {/* dejo espacio para la barra de contenedor*/}
      {/* BARRA DE PORCENTAJE DE OCUPACION DE CONTENEDOR */}
      {/* BASADO EN LA CARGA PASADA COMO PARAMETRO. DEBERIA HABER UN VALOR "auto" para detemrinar la comb optima*/}
      {mostrarContenedores && (
        <Box sx={{ width: "100%", marginTop: 1.5 }}>
          {/* <LinearProgressWithLabel value={contCalcInfo.contFrac} ent={contCalcInfo.contEnt} tipo={tipoContenedor?.description} /> */}
          
          {<BarraContenedores
            value={contCalcInfo?.contFrac}
            ent={contCalcInfo?.contEnt}
            tipo={tipoContenedor?.description}
          />}
        </Box>
      )}
      <Grid
        item
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          flexWrap: "wrap", // para que se envuelva en caso de que no haya espacio suficiente
        }}
        xs={12}
      >
        {tipoContenedor ? (
          <>
            {theme.palette.mode === "light" ? (
              <>
                <Chip
                  label={`Contenedor ${tipoContenedor?.description}`}
                  size="medium"
                  chipcolor="orange"
                />
                <Chip
                  label={`Peso Soportado: ${UtilidadesHelper.formatNumber(
                    tipoContenedor?.weight?.toFixed(2)
                  )}Kg`}
                  size="medium"
                  chipcolor="orange"
                />
                <Chip
                  label={`Volumen Soportado ${UtilidadesHelper.formatNumber(
                    tipoContenedor?.volume?.toFixed(2)
                  )}m3`}
                  size="medium"
                  chipcolor="orange"
                />
              </>
            ) : (
              <>
                <Chip
                  label={`Contenedor ${tipoContenedor?.description}`}
                  variant="outlined"
                  size="medium"
                  chipcolor="warning"
                />
                <Chip
                  label={`Peso Soportado: ${UtilidadesHelper.formatNumber(
                    tipoContenedor?.weight?.toFixed(2)
                  )}Kg`}
                  variant="outlined"
                  size="medium"
                  chipcolor="warning"
                />
                <Chip
                  label={`Volumen Soportado ${UtilidadesHelper.formatNumber(
                    tipoContenedor?.volume?.toFixed(2)
                  )}m3`}
                  variant="outlined"
                  size="medium"
                  chipcolor="warning"
                />
              </>
            )}
          </>
        ) : (
          <>
            <Chip
              label={`Seleccione un tipo de contenedor`}
              size="medium"
              chipcolor="orange"
            />
          </>
        )}
        {theme.palette.mode === "light" ? (
          <>
            <Chip
              label={`Peso ${peso.toFixed(2)}Kg`}
              size="medium"
              chipcolor="primary"
            />
            <Chip
              label={`Volumen ${volume.toFixed(2)}m3`}
              size="medium"
              chipcolor="primary"
            />
            <Chip
              label={`Contenedores: ${contenedores.toFixed(2)}u.`}
              size="medium"
              chipcolor="primary"
            />
          </>
        ) : (
          <>
            <Chip
              label={`Peso ${peso.toFixed(2)}Kg`}
              variant="outlined"
              size="medium"
              chipcolor="success"
            />
            <Chip
              label={`Volumen ${volume.toFixed(2)}m3`}
              variant="outlined"
              size="medium"
              chipcolor="success"
            />
            <Chip
              label={`Contenedores: ${contenedores.toFixed(2)}u.`}
              variant="outlined"
              size="medium"
              chipcolor="success"
            />
          </>
        )}
      </Grid>
    </>
  );
};
