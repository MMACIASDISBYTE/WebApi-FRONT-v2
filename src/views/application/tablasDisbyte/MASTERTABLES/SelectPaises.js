import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { PaisRegionHelper } from "helpers/PaisRegionHelper";
import { useEffect, useState } from "react";

export const SelectPaises = ({
  nameSelect = 'Pais', //pongo este valor por defecto asi no rompe a todos los a aplica unicamente el pais
  dataName,
  MenuItem,
  handleChange,
  datosSelect,
}) => {

  return (
    <>
      <Grid item xs={12}>
        <FormControl fullWidth variant="outlined" sx={{ marginTop: "5px" }}>
          <InputLabel htmlFor={
            nameSelect === 'Pais' ? "paisregion_id"
          : nameSelect === 'Pais Fwd' ? 'paisfwd_id'
          : nameSelect === 'Terminal' ? "terminal_id"
          : nameSelect === 'Carga' ? "carga_id"
          : nameSelect === 'Poliza' ? 'poliza_id'
          : nameSelect === 'Fwd' ? 'fwdtte_id'
          : nameSelect === 'Flete' ? 'flete_id'
          : nameSelect === 'Truck' ? 'trucksemi_id'
          : ''
          }>
            Seleccione {nameSelect}
          </InputLabel>
          <Select
            value={
              nameSelect === 'Pais' ? dataName.paisregion_id
              : nameSelect === 'Pais Fwd' ? dataName.paisfwd_id
              : nameSelect === 'Terminal' ? dataName.terminal_id
              : nameSelect === 'Carga' ? dataName.carga_id
              : nameSelect === 'Poliza' ? dataName.poliza_id
              : nameSelect === 'Fwd' ? dataName.fwdtte_id
              : nameSelect === 'Flete' ? dataName.flete_id
              : nameSelect === 'Truck' ? dataName.trucksemi_id
              : null
            }
            onChange={handleChange}
            label={`Seleccione un  ${nameSelect}`}
            inputProps={{
              name: nameSelect === 'Pais' ? "paisregion_id"
              : nameSelect === 'Pais Fwd' ? 'paisfwd_id'
              : nameSelect === 'Terminal' ? 'terminal_id'
              : nameSelect === 'Carga' ? 'carga_id'
              : nameSelect === 'Fwd'? 'fwdtte_id'
              : nameSelect === 'Flete'? 'flete_id'
              : nameSelect === 'Truck'? 'trucksemi_id'
              : 'poliza_id',

              id: nameSelect === 'Pais' ? "paisregion_id"
              : nameSelect === 'Pais Fwd' ? 'paisfwd_id'
              : nameSelect === 'Terminal' ? 'terminal_id'
              : nameSelect === 'Carga' ? 'carga_id'
              : nameSelect === 'Fwd'? 'fwdtte_id'
              : nameSelect === 'Flete'? 'flete_id'
              : nameSelect === 'Truck'? 'trucksemi_id'
              : 'poliza_id',
            }}
          >
            {datosSelect.map((option, index) => (
              <MenuItem key={index} value={option.id}>
                {option.description} - {option.region}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </>
  );
};
