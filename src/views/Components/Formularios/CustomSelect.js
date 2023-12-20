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
import { makeStyles } from "@material-ui/core";
import { useCommonStyles } from "helpers/CommonStyles";

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
  ValorPorDefecto = null,
  tooltip = "",
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
  // console.log(formik.values);

  //declaro las no obligatorias
  const NoObligatorias = [
    'description',
    'project',
    'extrag_src1',
    'extrag_src2',
    'extrag_src_notas',
    'extrag_comex1',
    'extrag_comex2',
    'extrag_comex3',
    'extrag_comex_notas',
    'extrag_finan1',
    'extrag_finan2',
    'extrag_finan3',
    'extrag_finan4',
    'extrag_finan5',
    'extrag_finan_notas',
    'embarque',
    'vessel_carrier',
  ];

  const classes = useCommonStyles();
  return (
    <>
      <Tooltip title={tooltip}>
        <Grid item xs={XS} md={MD}>
          <Stack>
              {/* en el includes consulto si pertenece al array de excepciones */}
              <InputLabel required={!NoObligatorias.includes(name)}>{`${inputLabel}`}</InputLabel>
            {/* Si data existe, mostramos el Select. Si no, mostramos el TextField. */}
            {data !== "String" ? (
              <Tooltip //consulto si trae una fecha valida mostrar la fecha con formato sino no mostrar nada
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
                      if (ValorPorDefecto && data) {
                         //buscamos valor si hay que recorrer un array y machearlo con el valor numerico que traemos de la api
                            let valorEncontrado = null;
                            if(data && ValorPorDefecto){
                              valorEncontrado = data.find( obj => obj.id === ValorPorDefecto)
                            }
                            if(valorEncontrado){
                              return valorEncontrado.description; //si encuentra muestra descropcion
                            }else{
                              return <em>{em}</em>; //sino devuelve valor por defecto
                            }
                      } else if(ValorPorDefecto){
                        return ValorPorDefecto;
                      } else {
                        return <em>{em}</em>;
                      }
                    }
                    return selected.description;
                  }}
                >
                  <MenuItem disabled value="">
                    <em>{em}</em>
                  </MenuItem>
                  {filteredData && filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <MenuItem
                        key={item.id}
                        value={item}
                        disabled={
                          item.description === "LCL" ||
                          // item.description === "40ST" ||
                          item.description === "2*20ST" ||
                          item.description === "2*40HQ" ||
                          item.description === "2*40ST"
                        } // Desactiva el ítem si es "LCL"
                        style={
                          item.description === "LCL" ||
                          // item.description === "40ST" ||
                          item.description === "2*20ST" ||
                          item.description === "2*40HQ" ||
                          item.description === "2*40ST"
                            ? { backgroundColor: "lightgray" }
                            : {}
                        }
                      >
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
                type={name === "limite_carga" ? "number" : "string"}
                inputProps={
                  name === "limite_carga"
                    ? {
                        min: 0, // Establece el mínimo a 0 para prevenir números negativos
                        step: 1, // Establece el paso a 1 para solo permitir números enteros
                        style: { textAlign: "right" },
                        onWheel: (e) => e.target.blur(), // opcional, para prevenir cambios con la rueda del mouse
                        // step: "any", // permite valores decimales si es necesario
                      }
                    : {}
                }
                // className={classes.biggerSpinners} //en caso de ser numerico el input eliminalas flechas laterales
                value={formik.values[name] || ""}
                onBlur={formik.handleBlur}
                error={formik.touched[name] && Boolean(formik.errors[name])}
                // helperText={formik.touched[name] && formik.errors[name]}
                onChange={formik.handleChange}
                disabled={desactivado}
                placeholder={em}
                fullWidth
              />
            )}
            {formik.errors[name] && (
              <FormHelperText error>{formik.errors[name]}</FormHelperText>
            )}
          </Stack>
        </Grid>
      </Tooltip>
    </>
  );
};
