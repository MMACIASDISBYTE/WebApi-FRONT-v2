import React, { useEffect, useState } from "react";
import {
  Grid,
  Stack,
  Select,
  MenuItem,
  FormHelperText,
  TextField,
  Switch,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { makeStyles } from "@material-ui/core";
import InputLabel from "ui-component/extended/Form/InputLabel";
import { useTheme } from "@mui/material/styles";
import { SwitchGastos } from "./SwitchGastos";
import { UtilidadesHelper } from "helpers/UtilidadesHelper";

export const ExtraCostoDobleClick = ({
  id,
  name,
  em,
  inputLabel,
  data = 0,
  dataType,
  formik,
  Xs_Xd,
  blockDeGastos = false,
  ValorSwitch = false,
  ValorSwitchBase,
  arrPosition = null,
  handleSwitchChangeInIndex,
  resaltar,
  gastoLocal,
  habilitacion = false,
}) => {
  const theme = useTheme();
  // console.log('Gasto local:', gastoLocal);

  const [dobleClick, setDobleClick] = useState(false);
  const [textDeTooltip, setTextDeTooltip] = useState(
    "Doble click para desbloquear"
  );
  const TextTooltip = () => {
    !dobleClick
      ? setTextDeTooltip("Doble click para Desbloquear")
      : setTextDeTooltip("Doble Click para Bloquear");
  };

  // console.log(formik.values);
  // console.log(ValorSwitch);
  useEffect(() => {}, [formik.values]);

  // ESTILO PARA QUITAR FLECHAS NUMERICAS DE TEXTFIELD NUMBER
  const useStyles = makeStyles({
    hideSpinButton: {
      "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button":
        {
          "-webkit-appearance": "none",
          margin: 0,
        },
      "& input[type=number]": {
        "-moz-appearance": "textfield",
      },
    },
    input: {
      textAlign: "left", // Asegura que el texto esté alineado a la izquierda
    },
  });

  let colorEnabled ="" 
  let colorDisabled=""
  
  // Configuro el color del texto activo e inactivo segun el valor del flag resaltar
  if(resaltar)
  {
    colorEnabled="red";
    colorDisabled="darksalmon";
  }
  else
  {
    colorEnabled="black";
    colorDisabled="grey";
  }
  
  const classes = useStyles();

  // Estado local para el valor formateado mostrado en el INPUT NUMERICO CON TOFIXED
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    // Inicializa el valor formateado cuando cambian los valores de formik
    if (!isNaN(formik.values[name]) && formik.values[name] !== "") {
      setDisplayValue(Number(formik.values[name]).toFixed(2));
    } else {
      setDisplayValue(formik.values[name]);
    }
  }, [formik.values, name]);
  const handleBlur = (event) => {
    // Actualiza formik solo cuando el input pierde el foco
    UtilidadesHelper.handleChangeCustom(event, formik, name);
    formik.handleBlur(event); // No olvides manejar el evento onBlur original de formik
  };
  const handleChangeDisplayValue = (event) => {
    // Solo actualizamos el valor mostrado, no el de formik
    let inputValue = event.target.value;
    inputValue = inputValue.replace(/\.{2,}/g, ".").replace(/,{2,}/g, ",");
    inputValue = inputValue.replace(",", ".");
    if (!isNaN(inputValue) || inputValue === "." || inputValue === "") {
      setDisplayValue(inputValue);
    }
  };


  const transformarValor = (event) => {
    let valor = parseFloat(event)
    return valor;
  }
  // console.log("Resaltar",id,resaltar,colorEnabled,colorDisabled);

  const focusElement = (inputField) => {
    const inputElement = document.getElementById(inputField);
    if (inputElement) {
      inputElement.focus();
    }
  }

  return (
    <>
      <Grid item xs={Xs_Xd[0]} md={Xs_Xd[1]} align="left">
        <Stack>
          <InputLabel required>{inputLabel}</InputLabel>
          {dataType == "string" ? (
            <TextField
              id={id}
              name={name}
              type={dataType}
              value={formik.values[name]}
              InputProps={{
                //aqui si queremos poner un placeholde
                startAdornment: (
                  <InputAdornment position="start"></InputAdornment>
                ),
                style: { textAlign: "right" },
                // classes: { input: classes.input }, // aplicar la clase al input interno
              }}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              onChange={formik.handleChange}
              fullWidth
              placeholder={em}
              disabled={habilitacion}
            />
          ) : (
            <Grid item align="left">
              {/* <Tooltip title={textDeTooltip}> */}
                <TextField
                  id={id}
                  name={name}
                  type="string"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                    style: { textAlign: "right" },
                    // classes: { input: classes.input }, // aplicar la clase al input interno
                  }}
                  value={displayValue} // Usamos el valor formateado
                  onBlur={handleBlur} // Actualiza formik en el evento onBlur
                  onChange={handleChangeDisplayValue} // Cambia solo el valor mostrado
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  fullWidth
                  placeholder={em}
                 
                  inputProps={{
                    style: { textAlign: "right", color: colorEnabled},
                  }}

                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: colorDisabled,
                    },
                  }}
                  onDoubleClick={(event) => {
                    // setDobleClick(!dobleClick); //para bloquear el campo
                    focusElement(name);
                    TextTooltip();
                  }}
                  // disabled={dobleClick}
                  disabled={habilitacion}
                />
              {/* </Tooltip> */}
            </Grid>
          )}
          {formik.errors[name] && (
            <FormHelperText error>{formik.errors[name]}</FormHelperText>
          )}
        </Stack>
      </Grid>
    </>
  );
};
