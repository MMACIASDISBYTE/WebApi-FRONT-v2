import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { useTheme } from "@emotion/react";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { BarraContenedoresFULL } from "./BarraContenedorFULL";

export function BarraContenedores({ value, ent, tipo, longitudBarra = '85%' }) {
  const [alarma, setAlarma] = useState(false);
  const [alarma20st, setAlarma20st] = useState(false);
  const [alarmaFrac, setAlarmaFrac] = useState(false);

  //console.log(value);

  // Ajusta las alarmas basadas en las propiedades
  useEffect(() => {
    setAlarma(ent > 0);
    setAlarma20st(ent > 50);
    setAlarmaFrac(value > 90);
  }, [value, ent, tipo]);


  // POR FAVOR, NO AGREGAR ENTERS A LO PAVO !!!!!!!!. 
  // GRACIAS.
  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      // NO PARTIR LOS TERNARIOS EN MULTIPLES LINEAS. GRACIAS.
      backgroundColor: theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      // Aplica el color dependiendo de las condiciones de alarma y el valor
      // NO DAR ENTERS AL PEDO A LOS TERNARIOS ANIDADOS. GRACIAS !!!!
      backgroundColor: alarmaFrac ? "#f26852" : (value > 75 ? "#f5c149" : "#c2f0ca"),
    },
  }));

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", marginLeft: 2 }}>
        <Box sx={{ width: `${longitudBarra}`, mr: 1 }}>
          <BorderLinearProgress variant="determinate" value={value} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">
            {tipo?`${Math.round(value)}% de ${tipo}`:("")}
          </Typography>
        </Box>
      </Box>
      {/* Generar las instancias del componente BarraContenedoresFULL basado en ent */}
      {Array.from({ length: ent }, (_, index) => (
        <BarraContenedoresFULL
          key={index} /* Puedes pasar más props aquí si es necesario */
          tipo={tipo}
          longitudBarra={longitudBarra}
        />
      ))}
    </>
  );
}
