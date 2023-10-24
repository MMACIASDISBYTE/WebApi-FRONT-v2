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

export const ExtraCostoDobleClickUpdate = ({
  id,
  name,
  em,
  inputLabel,
  data = 0,
  dataType,
  formik,
  Xs_Xd,
  resaltar,
  gastoLocal = null,
  nameGastoLocalTarifon = null,
  fobGrandTotal = 0,
  deshabilitar = false,
  depto = null,
}) => {
  const theme = useTheme();
  // console.log("Gasto local:", gastoLocal);

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
  
  // Concatena depto si existe
  const formikName = depto ? `${name}${depto}` : name;
  // console.log(formikName);
  
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

  let colorEnabled = "";
  let colorDisabled = "";

  // Configuro el color del texto activo e inactivo segun el valor del flag resaltar
  if (resaltar) {
    colorEnabled = "red";
    colorDisabled = "darksalmon";
  } else {
    colorEnabled = "black";
    colorDisabled = "grey";
  }

  const classes = useStyles();

  // Estado local para el valor formateado mostrado en el INPUT NUMERICO CON TOFIXED
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    // Inicializa el valor formateado cuando cambian los valores de formik
    if (!isNaN(formik.values[formikName]) && formik.values[formikName] !== "") {
      setDisplayValue(Number(formik.values[formikName]).toFixed(2));
    } else {
      setDisplayValue(formik.values[formikName]);
    }
  }, [formik.values, formikName]);
  const handleBlur = (event) => {
    // Actualiza formik solo cuando el input pierde el foco
    UtilidadesHelper.handleChangeCustom(event, formik, formikName);
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
    let valor = parseFloat(event);
    return valor;
  };
  // console.log("Resaltar",id,resaltar,colorEnabled,colorDisabled);

  const focusElement = (inputField) => {
    const inputElement = document.getElementById(inputField);
    if (inputElement) {
      inputElement.focus();
    }
  };

  const [valorOriginal, setValorOriginal] = useState(0);
  useEffect(() => {
    if(gastoLocal.insurance_charge){

      if (nameGastoLocalTarifon == "gloc_despachantes") {
        let valorCalculado =
          formik?.values?.cif_grand_total * gastoLocal?.gloc_despachante_var +
          gastoLocal?.gloc_despachante_fijo +
          gastoLocal?.gloc_despachante_otro1 +
          gastoLocal?.gloc_despachante_otro2;
        setValorOriginal(valorCalculado.toFixed(2));
      } else if (nameGastoLocalTarifon == "freight_insurance_cost") {
  
        let valorCalculado = (gastoLocal?.insurance_charge / 100) * fobGrandTotal;
        // console.log(gastoLocal?.insurance_charge);
        // console.log(fobGrandTotal);
        setValorOriginal(valorCalculado.toFixed(2));
      } else {
        setValorOriginal(gastoLocal[nameGastoLocalTarifon].toFixed(2));
      }
    }
  }, [gastoLocal, fobGrandTotal]);

  return (
    <>
      <Grid item xs={Xs_Xd[0]} md={Xs_Xd[1]} align="left">
        <Stack>
          <InputLabel required>{inputLabel}</InputLabel>
          {dataType == "string" ? (
            <TextField
              id={id}
              name={formikName}
              type={dataType}
              value={formik.values[formikName]}
              InputProps={{
                //aqui si queremos poner un placeholde
                startAdornment: (
                  <InputAdornment position="start"></InputAdornment>
                ),
                style: { textAlign: "right" },
                // classes: { input: classes.input }, // aplicar la clase al input interno
              }}
              onBlur={formik.handleBlur}
              error={formik.touched.formikName && Boolean(formik.errors.formikName)}
              helperText={formik.touched.formikName && formik.errors.formikName}
              onChange={formik.handleChange}
              fullWidth
              placeholder={em}
              disabled={deshabilitar}
            />
          ) : (
            <Grid item align="left">
              {/* <Tooltip title={textDeTooltip}> */}
              <Tooltip
                title={gastoLocal ? `Valor Actual: $${valorOriginal}` : `--.--`}
              >
                <TextField
                  id={id}
                  name={formikName}
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
                  error={formik.touched.formikName && Boolean(formik.errors.formikName)}
                  helperText={formik.touched.formikName && formik.errors.formikName}
                  fullWidth
                  placeholder={em}
                  inputProps={{
                    style: { textAlign: "right", color: colorEnabled },
                  }}
                  sx={{
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: colorDisabled,
                    },
                  }}
                  onDoubleClick={(event) => {
                    // setDobleClick(!dobleClick); //para bloquear el campo
                    focusElement(formikName);
                    TextTooltip();
                  }}
                  // disabled={dobleClick}
                  disabled={deshabilitar}
                />
              </Tooltip>
            </Grid>
          )}
          {formik.errors[formikName] && (
            <FormHelperText error>{formik.errors[formikName]}</FormHelperText>
          )}
        </Stack>
      </Grid>
    </>
  );
};
