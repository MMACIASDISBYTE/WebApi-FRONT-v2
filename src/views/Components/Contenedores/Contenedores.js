import React, { useState } from "react";
import ContenedorColor from "../../../assets/images/disbyte/ContenedorColor.png";
import { Box, Button, Grid } from "@mui/material"; // Actualizado para MUI v5
import { styled } from "@mui/system"; // Actualizado para MUI v5

// Creamos un componente estilo Box para el contenedor
const ImageContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "200px",
  height: "100px",
  backgroundColor: "transparent",
  overflow: "hidden",
}));

// Componente estilo Box para la imagen con el efecto de llenado
const ImageWrapper = styled(Box)(({ theme, llenado }) => ({
  position: "relative",
  width: "100%",
  height: "100%",
  backgroundImage: `url(${ContenedorColor})`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "left center",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: `linear-gradient(to left, rgba(255,255,255,0.5) ${
      100 - llenado
    }%, transparent ${100 - llenado}%)`,
    transition: "all 0.5s ease-out",
  },
}));

export const Contenedores = ({tipoContenedor}) => {
    console.log(tipoContenedor);
  const [llenado, setLlenado] = useState(50); // estado inicial del contenedor

  const incrementoLLenado = () => {
    setLlenado((prevLlenado) => (prevLlenado < 100 ? prevLlenado + 1 : prevLlenado));
  };
  
  const decrementoLLenado = () => {
    setLlenado((prevLlenado) => (prevLlenado > 0 ? prevLlenado - 1 : prevLlenado));
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        direction="column"
        alignItems="left"
        justifyContent="left"
      >
          <ImageContainer>
            <ImageWrapper llenado={llenado} />
          </ImageContainer>
        </Grid>
        <Button
            variant="contained"
            color="primary"
            onClick={decrementoLLenado}
          >
            Vaciar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={incrementoLLenado}
          >
            Llenar
          </Button>
    </>
  );
};
