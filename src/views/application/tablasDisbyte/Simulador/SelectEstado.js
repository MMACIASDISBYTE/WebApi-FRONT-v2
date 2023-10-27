import React, { useEffect, useState } from 'react';
import { FormControl, Grid, InputLabel, Select, MenuItem, Tooltip } from '@mui/material';
import { PaisRegionHelper } from 'helpers/PaisRegionHelper';
import { Stack } from '@mui/system';
import { CargaHelper } from 'helpers/CargaHelper';

export const SelectEstado = ({
  nameSelect = 'Estado',
  datosSelect = [{ description: 'Sourcing' }],
  handleChangeEstado,
}) => {
    const [estado, setEstado] = useState([]);
    const [selectedEstado, setSelectedEstado] = useState(''); // Estado para el valor seleccionado

    const dataEstado =  () =>{
        const estados = [
                          {id:0,description:"Estado 0: Created"},
                          {id:1,description:"Estado 1: Sourcing"},
                          {id:2,description:"Estado 2: Comex"},
                          {id:3,description:"Estado 3: Finanzas"}
                        ]        
        setEstado(estados);
    }
    
    useEffect(()=>{
        dataEstado()
    },[])

    const handleSelectionChange = (event) => {
        const value = event.target.value;
        // setSelectedCarga(Object.keys(value).length === 0 ? null : value);
        // handleChangeCarga(Object.keys(value).length === 0 ? null : value);
        setSelectedEstado(event.target.value);
        handleChangeEstado(event.target.value);
      };
  return (
    <>
      <Grid item xs={12} md={2}>
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
                    return <em>Filtro por Estado</em>;
                  }
                  return `${selected.description}`;
                }}
              >
                <MenuItem value={0}>
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
