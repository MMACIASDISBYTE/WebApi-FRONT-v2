import React, { useEffect, useState } from 'react';
import { FormControl, Grid, InputLabel, Select, MenuItem, Tooltip } from '@mui/material';
import { PaisRegionHelper } from 'helpers/PaisRegionHelper';
import { Stack } from '@mui/system';
import { CargaHelper } from 'helpers/CargaHelper';

export const SelectCarga = ({
  nameSelect = 'Carga',
  datosSelect = [{ description: '40HQ' }],
  handleChangeCarga,
}) => {
    const [carga, setCarga] = useState([]);
    const [selectedCarga, setSelectedCarga] = useState(''); // Estado para el valor seleccionado

    const dataCarga = async () =>{
        const carga = await CargaHelper.fetchData()
        
        setCarga(carga);
    }
    
    useEffect(()=>{
        dataCarga()
    },[])
    console.log(carga);

    const handleSelectionChange = (event) => {
        const value = event.target.value;
        // setSelectedCarga(Object.keys(value).length === 0 ? null : value);
        // handleChangeCarga(Object.keys(value).length === 0 ? null : value);
        setSelectedCarga(event.target.value);
        handleChangeCarga(event.target.value);
      };
  return (
    <>
      <Grid item xs={12} md={2}>
        <Stack>
            <Tooltip title={'Filtro por Carga'}>
            <Select
                id={'cargaSeleccionada'}
                name={'cargaSeleccionada'}
                displayEmpty
                value={selectedCarga}
                onBlur={''}
                helperText={'Seleccione helperText'}
                onChange={handleSelectionChange}
                renderValue={(selected) => {
                  if (!selected || Object.keys(selected).length === 0) {
                    return <em>Filtro por Carga</em>;
                  }
                  return `${selected.description}`;
                }}
              >
                <MenuItem value={0}>
                  <em>Restaurar Filtro</em>
                </MenuItem>
                {carga && carga.length > 0 ? (
                  carga.map((item) => (
                    <MenuItem key={item.id} value={item}>
                      {item.description}
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
