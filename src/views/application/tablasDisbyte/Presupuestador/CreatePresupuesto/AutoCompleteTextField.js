import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { Box, Tooltip } from "@mui/material";

const filter = createFilterOptions();

export default function AutoCompleteTextField({ handleChange, name }) {
  const [value, setValue] = React.useState(null);
  const [isInputValue, setIsInputValue] = React.useState(false); // Nuevo estado para rastrear si el valor es un inputValue
  const [toolIngresoManual, setToolIngresoManual ] = React.useState('');
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
          setValue({ title: newValue.inputValue });
        } else {
          setIsInputValue(false); // En otros casos, no fue ingresado directamente
          setToolIngresoManual('')
          newEventValue = newValue ? newValue.title : "";
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
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some(
          (option) => inputValue === option.title
        );
        if (inputValue !== "" && !isExisting) {
          filtered.push({
            inputValue,
            title: `Add "${inputValue}"`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={ListaDeSKU}
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
        name={name}
        label="Seleccione o Ingrese un Sku"
        // Cambiamos el estilo basado en si el valor fue ingresado directamente
        color={isInputValue ? 'warning' : 'success'}
      />
      </Tooltip>
    </Box>
      )}
    />
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const ListaDeSKU = [
  { title: 'URBAN NOTEBOOK MODEL 1', year: 1994 },
  { title: 'ANTI THEFT MDOEL 1', year: 1972 },
  { title: "ANTI THEFT MDOEL 2", year: 1974 },
  { title: "URBAN NOTEBOOK MODEL 2", year: 2008 },
  { title: "SET SCHOOL", year: 1957 },
  { title: "Model #1 Lenovo", year: 1993 },
  { title: "MIDDLE_LEVEL_BAG", year: 1994 },
  { title: "Bag laptop entry level" , year: 1998 },
  {
    title: "MIDDLE_LEVEL_BAG",
    year: 2003,
  },
  { title: "EAMES", year: 1966 },
  { title: "TULIP", year: 1999 },
  {
    title: "ROODIAN R1 2*1P5S",
    year: 2001,
  },
  {
    title: "ROODIAN R1 2*2P5S",
    year: 1980,
  },
  { title: "BOODIAN R1 2*1P5S", year: 1991 },
  { title: "BOODIAN R1 2*2P5S", year: 1946 },
  { title: "LT203-1400 Entry Level", year: 1994 },
  { title: "LT3071C-1400 ENTRY LEVEL + WHEELS", year: 2010 },
  {
    title: "MIG-130I",
    year: 2002,
  },
  { title: "THUNDER-100-AC127V", year: 1975 },
  { title: "THUNDER-120-AC127V", year: 1990 },
  { title: "THUNDER-BF130-AC127/220V", year: 1999 },
  { title: "THUNDER-BF130WM-AC127/220V", year: 1954 },
  { title: "THUNDER-BF160-AC127/220V", year: 2002 },
  { title: "THUNDER-MIG130GL-AC127V" , year: 1994 },
  { title: "THUNDER-MIG130G-AC127V" , year: 2001 },
  {
    title: "FMT-30S",
    year: 1977,
  },
  { title: "ENTRY LEVEL MODEL", year: 1995 },
  { title: "LT203-1400 ENTRY LEVEL", year: 1997 },
  { title: "LT3071C-1400 ENTRY LEVEL + WHEELS", year: 1995 },
  { title: "HKS-140" , year: 1968 },
  { title: "OAKLAND MIG-130i", year: 1998 },
  { title: "Cooking scale", year: 2014 },
  { title: "MICROFIBER SHEETS", year: 1942 },
  { title: "Multi-function vacuum cleaner Car cleaners Handheld wireless charging cleaner", year: 1931 },
  { title: "PJ8000", year: 1960 },
  { title: "PJ4000", year: 1999 },
  { title: "RVC00004", year: 2011 },
  { title: "PARILLA A GAS 4Q EMPOTRABLE", year: 1936 },
  { title: "PARILLA A GAS 5Q EMPOTRABLE", year: 1981 },
  { title: "PARILLA A GAS 4Q MESA", year: 1954 },
  { title: "MIXER 2.9L", year: 2002 },
  { title: "MIXER 5L", year: 2006 },
  { title: "digital 8l", year: 1991 },
  { title: "analogica 3.5l", year: 1985 },
  { title: "BP30L-9M(MEX)", year: 2014 },
  { title: "BP60L-12M(MEX)", year: 2000 },

  { title: "GRB02-CRO", year: 2000 },
  { title: "GRB02-NEG", year: 2006 },
];
