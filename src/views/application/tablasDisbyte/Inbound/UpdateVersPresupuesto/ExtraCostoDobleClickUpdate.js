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
import { UtilidadesHelper } from "helpers/UtilidadesHelper";


// LISTED 24_10_2023: Logica de resaltado de diferencias para lo que es glocs.

export const ExtraCostoDobleClickUpdate = ({
  id,
  name,
  em,
  origData,
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
  gastoLocal = null,
  nameGastoLocalTarifon = null,
  fobGrandTotal = 0,
}) => {
  const theme = useTheme();


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

  let colorEnabled = "";
  let colorDisabled = "";

  if (id=="gloc_fwd" && parseFloat(formik?.values?.gloc_fwd).toFixed(2)!=origData?.gloc_fwd?.toFixed(2)) {
    colorEnabled = "red";
    colorDisabled = "darksalmon";
  } else if (id=="gloc_terminales" && parseFloat(formik?.values?.gloc_terminales).toFixed(2)!=origData?.gloc_terminales?.toFixed(2)) {
      colorEnabled = "red";
      colorDisabled = "darksalmon";
  } else if (id=="gloc_descarga" && parseFloat(formik?.values?.gloc_descarga).toFixed(2)!=origData?.gloc_descarga?.toFixed(2)) {
        colorEnabled = "red";
        colorDisabled = "darksalmon";
    } else if (id=="gloc_flete" && parseFloat(formik?.values?.gloc_flete).toFixed(2)!=origData?.gloc_flete?.toFixed(2)) {
          colorEnabled = "red";
          colorDisabled = "darksalmon";
      } else if (id=="freight_cost" && parseFloat(formik?.values?.freight_cost).toFixed(2)!=origData?.freight_cost?.toFixed(2)) {
          colorEnabled = "red";
          colorDisabled = "darksalmon";
        } 
          else if (id=="gloc_despachantes" && parseFloat(formik?.values?.gloc_despachantes).toFixed(2)!=origData?.gloc_despachantes?.toFixed(2)) {
            colorEnabled = "red";
            colorDisabled = "darksalmon";
          }
          else {
              colorEnabled = "black";
              colorDisabled = "grey";
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
            />
          ) : (
            <Grid item align="left">
              {/* <Tooltip title={textDeTooltip}> */}
              <Tooltip
                title={gastoLocal ? `Valor Actual: $${valorOriginal}` : `--.--`}
              >
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
                    style: { textAlign: "right", color: colorEnabled },
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
                  disabled={dobleClick}
                />
              </Tooltip>
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
