import { Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";

export const DetalleContenedorEnDetails = ({
    cantidadConte = 0,
    itemContenedor = 0,
    limiteConte = 1,
    formik,
    usaVolumen,
    alarmaLimiteContenedores,
    piezasRemanentes,
}) => {

    useEffect(() => {
        // console.log('Render Comp detalleCont');
    }, [cantidadConte, itemContenedor, limiteConte, formik, usaVolumen, alarmaLimiteContenedores, piezasRemanentes])

  return (
    <>
      {/* DETALLES DE CONTENEDOR EN DETAILS */}
      <Grid
        item
        xs={12}
        md={9}
        style={{
          marginTop: "-15px",
        }}
      >
        <Typography
          color={"blue"}
          variant="h4"
          display={"inline"}
          style={{ marginLeft: "8px" }}
        >
          Cant. Contenedores ya usada:
        </Typography>
        <Typography
          color={"black"}
          variant="h4"
          display={"inline"}
          style={{ marginLeft: "8px" }}
        >
          {cantidadConte.toFixed(3)}
        </Typography>
        {/* ------------------------------------------------------- */}
        <Grid>
          <Typography
            color={"blue"}
            variant="h4"
            display={"inline"}
            style={{ marginLeft: "8px" }}
          >
            Cant. Contenedores Este Item:
          </Typography>
          <Typography
            color={"black"}
            variant="h4"
            display={"inline"}
            style={{ marginLeft: "8px" }}
          >
            {itemContenedor.toFixed(3)}
          </Typography>
        </Grid>
        {/* ------------------------------------------------------- */}
        <Grid>
          <Typography
            color={"blue"}
            variant="h4"
            display={"inline"}
            style={{ marginLeft: "8px" }}
          >
            Limite Cont. Ingresado:
          </Typography>
          <Typography
            color={"black"}
            variant="h4"
            display={"inline"}
            style={{ marginLeft: "8px" }}
          >
            {limiteConte}
          </Typography>
          <Typography
            color={"blue"}
            variant="h4"
            display={"inline"}
            style={{ marginLeft: "8px" }}
          >
            tipo:
          </Typography>
          <Typography
            color={"black"}
            variant="h4"
            display={"inline"}
            style={{ marginLeft: "8px" }}
          >
            {formik?.values?.carga_id?.description}
          </Typography>

          <Grid>
            <Typography
              color={"blue"}
              variant="h4"
              style={{ marginLeft: "8px" }}
              display={"inline"}
            >
              Criterio Evaluacion:
            </Typography>
            <Typography
              color={"black"}
              variant="h4"
              display={"inline"}
              style={{ marginLeft: "8px" }}
            >
              {usaVolumen ? "Volumen" : "Peso"}
            </Typography>
          </Grid>
        </Grid>

        {alarmaLimiteContenedores == false ? (
          <>
            <Typography
              color={"blue"}
              variant="h4"
              display={"inline"}
              style={{
                /*marginTop: "20px", */
                marginLeft: "8px",
              }}
            >
              PCS para completar este Cont:
            </Typography>
            <Typography
              color={"black"}
              variant="h4"
              display={"inline"}
              style={{ marginLeft: "8px" }}
            >
              {piezasRemanentes}
            </Typography>
          </>
        ) : (
          <Typography
            color={"red"}
            variant="h4"
            display={"inline"}
            style={{ marginLeft: "8px" }}
          >
            {">>>> Limite Excedido <<<"}
          </Typography>
        )}
      </Grid>
    </>
  );
};
