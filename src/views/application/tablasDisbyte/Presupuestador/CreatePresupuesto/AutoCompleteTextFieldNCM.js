import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { Box, Tooltip } from "@mui/material";
import { ProductosHelper } from "helpers/ProductosHelper";

const filter = createFilterOptions();

export default function AutoCompleteTextFieldNCM({ handleChange, name, valorPorDefecto= null, ListaNCM = null }) {
  const [value, setValue] = React.useState(valorPorDefecto);
  console.log('valor por defecto :', valorPorDefecto);
  const [isInputValue, setIsInputValue] = React.useState(false); // Nuevo estado para rastrear si el valor es un inputValue
  const [toolIngresoManual, setToolIngresoManual ] = React.useState('');
  
  const [productosSelect, setProductosSelect] = React.useState(ListaDeSKU);

  React.useEffect(() => {
    setProductosSelect(ListaNCM);
    console.log('NCM DESDE AUTOCOMPLETE :', ListaNCM);
  },[ListaNCM])

  React.useEffect(() => {
    if (ListaNCM && valorPorDefecto) {
      // Encuentra el objeto en ListaNCM que corresponde al valorPorDefecto
      const objPorDefecto = ListaNCM.find(item => item.id === valorPorDefecto);
      if (objPorDefecto) {
        setValue(objPorDefecto);
      }
    }
  }, [ListaNCM, valorPorDefecto]);

  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        let newEventValue;
        if (typeof newValue === "string") {
          setIsInputValue(true); // Si es un string, fue ingresado directamente
          setToolIngresoManual(`Ingreso Manualmente ${newValue.inputValue}`)
          console.log(newValue);
          newEventValue = newValue;
          setValue({ title: newValue });
        } else if (newValue && newValue.inputValue) {
          setIsInputValue(true); // Si tiene inputValue, también fue ingresado directamente
          setToolIngresoManual(`Ingreso Manualmente ${newValue.inputValue}`)
          console.log(newValue);
          newEventValue = newValue.inputValue;
          setValue({ title: newValue.inputValue, ncm_id: newValue.id, ncm_code: newValue.code });
        } else {
          setIsInputValue(false); // En otros casos, no fue ingresado directamente
          setToolIngresoManual('')
          newEventValue = newValue ? newValue.id : "";
          setValue(newValue);
        }

        // Aquí es donde adaptamos el evento para el componente padre
        const fakeEvent = {
          target: {
            name: name,
            value: newEventValue,
          },
        };

        handleChange(fakeEvent);
      }}

      // ESTO ES PARA AGREGAR EL PRODUCTO MANUAL, NCM NO PUEDE HACER ESTO
      // filterOptions={(options, params) => {
      //   const filtered = filter(options, params);

      //   const { inputValue } = params;
      //   // Suggest the creation of a new value
      //   const isExisting = options.some(
      //     (option) => inputValue === option.title
      //   );
      //   if (inputValue !== "" && !isExisting) {
      //     filtered.push({
      //       inputValue,
      //       title: `Add "${inputValue}"`,
      //     });
      //   }

      //   return filtered;
      // }}

      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={productosSelect}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === "string") {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.title;
      }}
      renderOption={(props, option) => <li {...props}>{option.title}</li>}
      //   sx={{ width: 300 }}
      fullWidth
      freeSolo
      renderInput={(params) => (
        <Box
      component="form"
      // sx={{
      //   '& > :not(style)': { m: 1, width: '25ch' },
      // }}
      // noValidate
      autoComplete="off"
    >
      <Tooltip title={toolIngresoManual}>
      <TextField
        fullWidth
        {...params}
        id={name}
        name={name}
        label="Select NCM"
        // Cambiamos el estilo basado en si el valor fue ingresado directamente
        color={isInputValue ? 'warning' : 'success'}
      />
      </Tooltip>
    </Box>
      )}
    />
  );
}


const ListaDeSKU = [
  { title: 'Cargando', year: 1994 },
];
