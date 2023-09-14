import React, { useState } from "react";
import {
  Grid,
  Stack,
  Select,
  MenuItem,
  FormHelperText,
  TextField,
  makeStyles,
} from "@mui/material";
import InputLabel from "ui-component/extended/Form/InputLabel";

export const ExtraCostos = ({
  id,
  name,
  em,
  inputLabel,
  data,
  dataType,
  formik,
  Xs_Xd,
}) => {

  const [value, setValue] = useState("");
  const handleChange = (e) => {
    let inputValue = e.target.value;

    // Reemplaza la coma por un punto
    inputValue = inputValue.replace(",", ".");

    // Valida si el inputValue es un número
    if (!isNaN(inputValue)) {
      setValue(inputValue);
    }
  };

  const handleChangeCustom = (event) => {
    let inputValue = event.target.value;
  
    // Reemplaza dos puntos o comas consecutivos por un solo punto
    inputValue = inputValue.replace(/\.{2,}/g, '.').replace(/,{2,}/g, ',');
  
    // Reemplaza la coma por un punto
    inputValue = inputValue.replace(',', '.');
  
    // Valida si el inputValue es un número
    if (!isNaN(inputValue) || inputValue === '.' || inputValue === '') {
      // Aquí puedes asignar el valor numérico a Formik o mantenerlo como una cadena según tus necesidades.
      formik.setFieldValue(name, inputValue);
    }
  };

  console.log(formik.values);
  console.log(data);
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
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              onChange={formik.handleChange}
              fullWidth
              placeholder={em}
            />
          ) : (
            <TextField
              id={id}
              name={name}
              type="string"
              value={formik.values[name]}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              onChange={handleChangeCustom}
              fullWidth
              placeholder={em}
              inputProps={{
                style: { textAlign: "right" },
              }}
            />
          )}
          {formik.errors[name] && (
            <FormHelperText error>{formik.errors[name]}</FormHelperText>
          )}
        </Stack>
      </Grid>
    </>
  );
};
