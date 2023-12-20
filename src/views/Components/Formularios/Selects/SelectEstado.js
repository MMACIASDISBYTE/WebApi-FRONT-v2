import React, { useEffect, useState } from 'react';
import { FormControl, Grid, InputLabel, Select, MenuItem, Tooltip } from '@mui/material';

import { Stack } from '@mui/system';

export const SelectEstado = ({
  nameSelect = 'Estado',
  datosSelect = [{ description: 'Sourcing' }],
  handleChangeEstado,
  estados,
  MD = 2,
  mensajeCabecera = 'Filtro Por Estado',
  atributoID = 'estadoSeleccionado'
}) => {
    const [estado, setEstado] = useState([]);
    const [selectedEstado, setSelectedEstado] = useState(''); // Estado para el valor seleccionado

    
    useEffect(()=>{
        setEstado(estados);
    },[estados])

    const handleSelectionChange = (event) => {
        const value = event.target.value;
        // setSelectedCarga(Object.keys(value).length === 0 ? null : value);
        // handleChangeCarga(Object.keys(value).length === 0 ? null : value);
        setSelectedEstado(value);
        handleChangeEstado(value);
      };
  return (
    <>
      <Grid item xs={12} md={MD}>
        <Stack>
            {/* <Tooltip title={'Filtro por Carga'}> */}
            <Select
                id={'estadoSeleccionado'}
                name={'estadoSeleccionado'}
                displayEmpty
                value={selectedEstado}
                onBlur={''}
                helperText={'Seleccione helperText'}
                onChange={handleSelectionChange}
                renderValue={(selected) => {
                  if (!selected || Object.keys(selected).length === 0) {
                    return <em>{mensajeCabecera}</em>;
                  }
                  return `${selected.description}`;
                }}
              >
                <MenuItem value={null}> {/* AQUI APLICO NULL xq es un objeto esto es para limpiar el filtro */}
                  <em>Restaurar Filtro</em>
                </MenuItem>
                {estado && estado.length > 0 ? (
                  estado.map((item) => (
                    <MenuItem key={item.id} value={item}>
                      {item.description}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="">Sin datos</MenuItem>
                )}
              </Select>
            {/* </Tooltip> */}
          
        </Stack>
      </Grid>
    </>
  );
};
