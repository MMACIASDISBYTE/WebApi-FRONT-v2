import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { PaisRegionHelper } from "helpers/PaisRegionHelper";
import { useEffect, useState } from "react";

export const SelectPaises = ({ dataName, MenuItem, handleChange, datosSelect}) => {

  const [paisRegion, setPaisRegion] = useState([]);

  console.log(MenuItem);
  useEffect(() => {
    //consulta tabla pais para enviar al componente
    const fetchDataPais = async () => {
      try {
        const dataPais = await PaisRegionHelper.fetchData();
        setPaisRegion(dataPais);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataPais();
  }, []);

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
