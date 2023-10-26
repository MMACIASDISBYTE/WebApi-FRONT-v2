import React, { useEffect, useState } from 'react';
import { FormControl, Grid, InputLabel, Select, MenuItem, Tooltip } from '@mui/material';
import { PaisRegionHelper } from 'helpers/PaisRegionHelper';
import { Stack } from '@mui/system';

export const SelectOwner = ({
  data,
  defaultSelection,
  handleChangeOwner,
}) => {
    let owners = data;
    const [selectedOwner, setSelectedOwner] = useState(); // Estado para el valor seleccionado

    const handleSelectionChange = (event) => {
        const value = event.target.value;
        setSelectedOwner(Object.keys(value).length === 0 ? null : value);
        handleChangeOwner(Object.keys(value).length === 0 ? null : value);
        console.log(value);
      };
    const [firstRun,setFirstRun]=useState(true);


  
  // Cuando se carga el dato default que viene en otro momento (cuando concluye el fetch), lanzo un evento 
  // simulando que la seleccion cambio de modo que ya funcione filtre ya al cargar.
  // Default selection es un vector, de un solo elemento, solo cuando su len es 1 significa que le cargaron 
  // data en el padre y entonces ahi ejecuto este use effect x ultima vez con un flag que evita reentrar.  
  useEffect(()=>{
                  if(defaultSelection?.length>0 && firstRun)
                  {     
                    
                    handleChangeOwner(defaultSelection[0]);
                    setFirstRun(false);
                  }
                },[defaultSelection]);

                
                console.log("SEL",defaultSelection);
  return (
    <>
      <Grid item xs={12} md={2}>
        <Stack>
            <Tooltip title={'OWNER'}>
            <Select
                id={'ownerSeleccionado'}
                name={'ownerSeleccionado'}
                displayEmpty
                value={selectedOwner}
                onBlur={''}
                helperText={'Owner:'}
                onChange={handleSelectionChange}
                renderValue={(selected) => {
                  if (defaultSelection?.length>0 && (!selected || Object.keys(selected).length === 0)) {
                    return `${defaultSelection[0]?.own}`;
                  }
                  return `${selected?selected.own:"Aguarde ..."}`;
                }}
              >
                {owners && owners.length > 0 ? (
                  owners.map((item) => (
                    <MenuItem key={item.id} value={item}>
                      {item.own}
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
