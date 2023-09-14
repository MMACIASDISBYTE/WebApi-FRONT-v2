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

export const CustomSelectUpdate = ({
  id,
  name,
  em,
  inputLabel,
  data,
  dataType,
  selected_id,
  selected_description,
  formik,
  XS,
  MD,
}) => {

  // console.log(data, name, formik.values[id]?.id);

  let objetoEncontrado = null;
  if(formik.values[id]?.id){
    const idABuscar = formik.values[id]?.id; // reemplaza con el ID que estás buscando

    const objeto = data.find((objeto) => objeto.id === idABuscar);
    objetoEncontrado = objeto.description;
  };
  // console.log(objetoEncontrado);

  let defaultValue = {
    id: selected_id || "",
    description: selected_description || "Sin Data",
    descriptioniNICIAL: objetoEncontrado,
  };
  

  return (
    <>
      <Grid item xs={XS} md={MD}>
        <Stack>
          <InputLabel required>{inputLabel}</InputLabel>
          {dataType == "string" ? (
            <TextField
              id={id}
              name={name}
              type={dataType}
              value={formik.values[name] || ""}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              onChange={formik.handleChange}
              fullWidth
              placeholder={em}
            />
          ) : dataType == "number" ? (
            <TextField
              id={id}
              name={name}
              type={dataType}
              value={formik.values[name] || ""}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              onChange={formik.handleChange}
              fullWidth
              placeholder={em}
              inputProps={{
                style: { textAlign: "right" },
              }}
            />
          ) : (
            <Select
              id={id}
              name={name}
              displayEmpty
              defaultValue=""
              value={formik.values[name] || ""}
              onBlur={formik.handleBlur}
              error={formik.touched[name] && Boolean(formik.errors[name])}
              helperText={formik.touched[name] && formik.errors[name]}
              onChange={formik.handleChange}
              renderValue={(selected) => {
                if (!selected || Object.keys(selected).length === 0) {
                  selected = defaultValue;
                  formik.values[name] = selected;
                  return <em>{em}</em>;
                }
                return objetoEncontrado ? objetoEncontrado : selected.description;
                // return selected.description;
              }}
            >
              <MenuItem disabled value="">
                <em>{formik.touched[name]}</em>
              </MenuItem>
              {data && data.length > 0 ? (
                dataType === "objectArray" ? (
                  data.map((item) => (
                    <MenuItem key={item.id} value={item}>
                      {item.description}
                    </MenuItem>
                  ))
                ) : dataType === "stringArray" ? (
                  data[0].map((item, index) => (
                    <MenuItem key={index} value={item}>
                      {item}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">Sin datos</MenuItem>
                )
              ) : (
                <MenuItem value="">Sin datos</MenuItem>
              )}
              {/* {
                            data && data.length > 0
                                ? data.map((item) => <MenuItem key={item.id} value={item}>{item.description}</MenuItem>)
                                : <MenuItem value="">Sin datos</MenuItem>
                        } */}
            </Select>
          )}
          {formik.errors[name] && (
            <FormHelperText error>{formik.errors[name]}</FormHelperText>
          )}
        </Stack>
      </Grid>
    </>
  );
};
