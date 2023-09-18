import React, { useState } from "react";
import { Switch } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export const SwitchGastos = ({onSwitchChange}) => {
  const theme = useTheme();
  const [isChecked, setIsChecked] = useState(false); // Estado inicial como "false"

  const handleSwitchChange = (event) => {
    let newState = event.target.checked;
    setIsChecked(newState); // Actualiza el estado con el nuevo valor
    onSwitchChange(newState);
    // console.log("Switch is now:", newState); // Puedes usar este valor como quieras
  };

  return (
    <>
      <Switch
        checked={isChecked} // Usar el estado para controlar el componente
        onChange={handleSwitchChange} // Manejar cambios
        defaultChecked
        sx={{
          color: theme.palette.warning.dark,
          "& .Mui-checked": {
            color: `${theme.palette.warning.dark} !important`,
          },
          "& .Mui-checked+.MuiSwitch-track": {
            bgcolor: `${theme.palette.warning.main} !important`,
          },
        }}
      />
    </>
  );
};
