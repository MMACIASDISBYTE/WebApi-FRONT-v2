import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { PaisRegionHelper } from "helpers/PaisRegionHelper";
import { useEffect, useState } from "react";

export const SelectPaises = ({
  nameSelect,
  dataName,
  MenuItem,
  handleChange,
  datosSelect,
}) => {

  return (
    <>
      <Grid item xs={12}>
        <FormControl fullWidth variant="outlined" sx={{ marginTop: "5px" }}>
          <InputLabel htmlFor={nameSelect === 'Pais' ? "paisregion_id" : nameSelect === 'Terminal' ? "terminal_id" : nameSelect === 'Carga' ? "carga_id" : ''}>
            Seleccione {nameSelect}
          </InputLabel>
          <Select
            value={nameSelect === 'Pais' ? dataName.paisregion_id : nameSelect === 'Terminal' ? dataName.terminal_id : nameSelect === 'Carga' ? dataName.carga_id : null}
            onChange={handleChange}
            label={`Seleccione un  ${nameSelect}`}
            inputProps={{
              name: nameSelect === 'Pais' ? "paisregion_id" : nameSelect === 'Terminal' ? 'terminal_id' : 'carga_id',
              id: nameSelect === 'Pais' ? "paisregion_id" : nameSelect === 'Terminal' ? 'terminal_id' : 'carga_id',
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
