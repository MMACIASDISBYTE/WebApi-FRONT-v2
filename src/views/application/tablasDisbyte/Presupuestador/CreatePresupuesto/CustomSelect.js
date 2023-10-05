import React, { useState } from "react";
import {
  Grid,
  Stack,
  Select,
  MenuItem,
  FormHelperText,
  TextField,
  Tooltip,
} from "@mui/material";
import InputLabel from "ui-component/extended/Form/InputLabel";

export const CustomSelect = ({
  id,
  name,
  em,
  inputLabel,
  data,
  formik,
  XS = 12,
  MD = 3,
  PaisRegion = null,
  desactivado = false,
}) => {
  // console.log(PaisRegion);
  // Filtramos los datos basados en paisregion_id solo si data es un array

  // Podemos acceder al valor seleccionado desde formik.values[name], para poder manejar la fecha en el tooltip
  const selectedValue = formik.values[name];
  // Vamos a obtener la información que queremos mostrar en el tooltip
  const tooltipInfo =
    selectedValue && selectedValue != null
      ? `Fecha: ${new Date(selectedValue.htimestamp).toLocaleDateString()}`
      : "";

  //filtro  si es un select o un String para el input, como tambien unicamente muestro los que corresponden al pais seleccionado en la primera parte de la cabecera
  const filteredData = Array.isArray(data)
    ? data.filter((item) => {
        if (item.hasOwnProperty("paisregion_id")) {
          return item.paisregion_id === PaisRegion;
        }
        return true;
      })
    : [];
  return (
    <>
      <Grid item xs={XS} md={MD}>
        <Stack>
          <InputLabel required>{`${inputLabel}`}</InputLabel>
          {/* Si data existe, mostramos el Select. Si no, mostramos el TextField. */}
          {data !== "String" ? (
            <Tooltip    //consulto si trae una fecha valida mostrar la fecha con formato sino no mostrar nada
              title={tooltipInfo != "Fecha: Invalid Date" ? tooltipInfo : ""}
            >
              <Select
                id={id}
                name={name}
                displayEmpty
                value={formik.values[name] || ""}
                onBlur={formik.handleBlur}
                error={formik.touched[name] && Boolean(formik.errors[name])}
                helperText={formik.touched[name] && formik.errors[name]}
                onChange={formik.handleChange}
                disabled={desactivado}
                renderValue={(selected) => {
                  if (!selected || Object.keys(selected).length === 0) {
                    return <em>{em}</em>;
                  }
                  return selected.description;
                }}
              >
                <MenuItem disabled value="">
                  <em>{em}</em>
                </MenuItem>
                {filteredData && filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <MenuItem key={item.id} value={item}>
                      {item.description}{" "}
                      {/* {item.paisregion_id ? ` - ${item.paisregion_id}` : ""}{" "}
                      {item.region ? ` - ${item.region}` : ""} */}
                      {item.htimestamp
                        ? ` - Fecha: ${new Date(
                            item.htimestamp
                          ).toLocaleDateString()}`
                        : ""}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">Sin datos</MenuItem>
                )}
              </Select>
            </Tooltip>
          ) : (
            <TextField
              id={id}
              name={name}
              value={formik.values[name] || ""}
              onBlur={formik.handleBlur}
              error={formik.touched[name] && Boolean(formik.errors[name])}
              helperText={formik.touched[name] && formik.errors[name]}
              onChange={formik.handleChange}
              placeholder={em}
              fullWidth
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
