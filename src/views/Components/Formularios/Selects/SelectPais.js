import React, { useEffect, useState } from 'react';
import { FormControl, Grid, InputLabel, Select, MenuItem, Tooltip } from '@mui/material';
import { PaisRegionHelper } from 'helpers/PaisRegionHelper';
import { Stack } from '@mui/system';

export const SelectPais = ({
  nameSelect = 'Pais',
  datosSelect = [{ description: 'Brasil' }],
  handleChangePais,
}) => {
    const [pais, setPais] = useState([]);
    const [selectedPais, setSelectedPais] = useState(''); // Estado para el valor seleccionado

    const dataPais = async () =>{
        const paisRegion = await PaisRegionHelper.fetchData()
        
        setPais(paisRegion);
    }
    
    useEffect(()=>{
        dataPais()
    },[])

    const handleSelectionChange = (event) => {
        const value = event.target.value;
        setSelectedPais(Object.keys(value).length === 0 ? null : value);
        handleChangePais(Object.keys(value).length === 0 ? null : value);
      };
  return (
    <>
      <Grid item xs={12} md={2}>
        <Stack>
            <Tooltip title={'Filtro por Pais'}>
            <Select
                id={'paisSeleccionado'}
                name={'paisSeleccionado'}
                displayEmpty
                value={selectedPais}
                onBlur={''}
                helperText={'Seleccione helperText'}
                onChange={handleSelectionChange}
                renderValue={(selected) => {
                  if (!selected || Object.keys(selected).length === 0) {
                    return <em>Filtro por pais</em>;
                  }
                  return `${selected.description} - ${selected.region}`;
                }}
              >
                <MenuItem value={{}}>
                  <em>Filtro por pais</em>
                </MenuItem>
                {pais && pais.length > 0 ? (
                  pais.map((item) => (
                    <MenuItem key={item.id} value={item}>
                      {item.description}{" "}
                      {item.region ? ` - ${item.region}` : ""}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">Sin datos</MenuItem>
                )}
              </Select>
            </Tooltip>
          
        </Stack>
      </Grid>
    </>
  );
};
