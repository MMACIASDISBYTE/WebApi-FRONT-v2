import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";

export const SelectPaises = ({ dataName, MenuItem, handleChange, datosSelect}) => {
  return (
    <>
      <Grid item xs={12}>
        <FormControl fullWidth variant="outlined" sx={{ marginTop: "5px" }}>
          <InputLabel htmlFor="paisregion_id">Seleccione País</InputLabel>
          <Select
            value={dataName.paisregion_id || ""}
            onChange={handleChange}
            label="Seleccione País"
            inputProps={{
              name: "paisregion_id",
              id: "paisregion_id",
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
