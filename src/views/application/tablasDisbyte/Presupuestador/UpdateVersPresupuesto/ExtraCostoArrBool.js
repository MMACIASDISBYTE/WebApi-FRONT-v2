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
} from "@mui/material";
import { makeStyles } from "@material-ui/core";
import InputLabel from "ui-component/extended/Form/InputLabel";
import { useTheme } from "@mui/material/styles";
import { SwitchGastos } from "./SwitchGastos";
import { UtilidadesHelper } from "helpers/UtilidadesHelper";

export const ExtraCostosArrBool = ({
  id,
  name,
  em,
  inputLabel,
  data,
  dataType,
  formik,
  Xs_Xd,
  blockDeGastos = false,
  ValorSwitch = false,
  ValorSwitchBase,
  arrPosition = null,
  handleSwitchChangeInIndex,
}) => {
  const theme = useTheme();

  const [value, setValue] = useState("");
  const [ValorSwitchaplicable, setValorSwitchAplicable] = useState(false); // Estado inicial

  const onSwitchChangeDesabled = (newSwitchState) => {
    // console.log("El nuevo estado del interruptor es:", newSwitchState);
    // Aquí puedes hacer lo que necesites con el nuevo estado del interruptor
    setValorSwitchAplicable(newSwitchState); // Aquí actualizas el estado
  };

  const handleChangeCustom = (event) => {
    let inputValue = event.target.value;
    // Reemplaza dos puntos o comas consecutivos por un solo punto
    inputValue = inputValue.replace(/\.{2,}/g, ".").replace(/,{2,}/g, ",");
    // Reemplaza la coma por un punto
    inputValue = inputValue.replace(",", ".");
    // Valida si el inputValue es un número
    if (!isNaN(inputValue) || inputValue === "." || inputValue === "") {
      // Aquí puedes asignar el valor numérico a Formik o mantenerlo como una cadena según tus necesidades.
      formik.setFieldValue(name, inputValue);
    }
  };

  useEffect(() => {

  }, [ValorSwitch]);
  // console.log(data);
  useEffect(() => {
    // console.log('valor antes :', ValorSwitchaplicable);
    const valorInicialSwitch = UtilidadesHelper.valueToBoolArrPosition(ValorSwitchBase, arrPosition);
    setValorSwitchAplicable(valorInicialSwitch);
    // console.log('valor despues :',valorInicialSwitch);
  },[ValorSwitchBase])

  // console.log(formik.values);
  // console.log(ValorSwitch);
  useEffect(()=>{

  }, [formik.values])

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
      textAlign: 'left', // Asegura que el texto esté alineado a la izquierda
    },
  });

  const classes = useStyles();

  return (
    <>
      <Grid item xs={Xs_Xd[0]} md={Xs_Xd[1]}>
        <Stack>
          <InputLabel required>{inputLabel}</InputLabel>
          {dataType == "string" ? (
            <TextField
              id={id}
              name={name}
              type={dataType}
              value={formik.values[name]}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
                style: { textAlign: "left" },
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
            <Grid item>
              <TextField
                id={id}
                name={name}
                type="string"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                  style: { textAlign: "left" },
                  // classes: { input: classes.input }, // aplicar la clase al input interno
                }}
                value={formik.values[name]}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                onChange={(event) => UtilidadesHelper.handleChangeCustom(event, formik, name)}
                fullWidth
                placeholder={em}
                disabled={!ValorSwitchaplicable}
                inputProps={{
                  style: { textAlign: "right" },
                }}
              />
              {blockDeGastos && (
                <SwitchGastos
                  // onSwitchChange={onSwitchChange}
                  onSwitchChange={(newState) => {
                    handleSwitchChangeInIndex(newState, arrPosition); // Pasa el estado al componente padre (Index)
                    onSwitchChangeDesabled(newState)
                  }}
                  ValorSwitchaplicable={ValorSwitchaplicable}
                />
              )}
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
