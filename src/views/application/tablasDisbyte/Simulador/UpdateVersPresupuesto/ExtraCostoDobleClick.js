import React, { useEffect, useState } from "react";
import {
  Grid,
  Stack,
  FormHelperText,
  TextField,
  InputAdornment,
} from "@mui/material";
import { makeStyles } from "@material-ui/core";
import InputLabel from "ui-component/extended/Form/InputLabel";
import { useTheme } from "@mui/material/styles";
import { UtilidadesHelper } from "helpers/UtilidadesHelper";

export const ExtraCostoDobleClick = ({
  id,
  name,
  em,
  inputLabel,
  dataType,
  formik,
  Xs_Xd,
  gastoLocal,
}) => {
  const theme = useTheme();
  // console.log('Gasto local:', gastoLocal);

  const [dobleClick, setDobleClick] = useState(false);
  const [textDeTooltip, setTextDeTooltip] = useState(
    "Doble click para desbloquear"
  );
  const TextTooltip = () => {
    !dobleClick
      ? setTextDeTooltip("Doble click para Desbloquear")
      : setTextDeTooltip("Doble Click para Bloquear");
  };

  // console.log(formik.values);
  // console.log(ValorSwitch);
  useEffect(() => {}, [formik.values]);

  // ESTILO PARA QUITAR FLECHAS NUMERICAS DE TEXTFIELD NUMBER
  const useStyles = makeStyles({
    hideSpinButton: {
      "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button":
        {
          "-webkit-appearance": "none",
          margin: 0,
        },
      "& input[type=number]": {
        "-moz-appearance": "textfield",
      },
    },
    input: {
      textAlign: "left", // Asegura que el texto esté alineado a la izquierda
    },
  });

  let colorEnabled = "";
  let colorDisabled = "";

  // Logica de resaltado de valor diferente
  // El componente recibe tanto los gastos locales (desde el tarifon) como los de Formik.
  // Cuando llega el JSON, los gastos locales del mismo se comparan contra los procedentes del tarifon.
  // Si hay diferencia, dicho valor tiene prioridad y se guarda en el formik. Si no hay diferencia, se deja como esta
  // Dado que el componente analiza la diferencia entre formik y tarifon simplifica la logica de resaltado a un solo lugar
  /*if ( id == "gloc_fwd" && parseFloat(formik?.values?.gloc_fwd).toFixed(2) != gastoLocal?.gloc_fwd?.toFixed(2)) 
  {
    colorEnabled = "red";
    colorDisabled = "darksalmon";
  } 
  else if
  (
    id == "gloc_terminales" &&
    parseFloat(formik?.values?.gloc_terminales).toFixed(2) !=
    gastoLocal?.gasto_terminal?.toFixed(2)
  ) 
  {
    colorEnabled = "red";
    colorDisabled = "darksalmon";
  } 
  else if (id == "gloc_descarga" && parseFloat(formik?.values?.gloc_descarga).toFixed(2) != gastoLocal?.gasto_descarga_depo?.toFixed(2)) 
  {
    colorEnabled = "red";
    colorDisabled = "darksalmon";
  } 
  else if ( id == "gloc_flete" && parseFloat(formik?.values?.gloc_flete).toFixed(2) != gastoLocal?.flete_interno?.toFixed(2)) 
  {
    colorEnabled = "red";
    colorDisabled = "darksalmon";
  } 
  else if ( id == "freight_cost" && parseFloat(formik?.values?.freight_cost).toFixed(2) != gastoLocal?.freight_charge?.toFixed(2)) 
  {
    colorEnabled = "red";
    colorDisabled = "darksalmon";
  } 
  else 
  {
    colorEnabled = "black";
    colorDisabled = "grey";
  }*/

  let myid = id;

  const classes = useStyles();

  // Estado local para el valor formateado mostrado en el INPUT NUMERICO CON TOFIXED
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    // Inicializa el valor formateado cuando cambian los valores de formik
    if (!isNaN(formik.values[name]) && formik.values[name] !== "") {
      setDisplayValue(Number(formik.values[name]).toFixed(2));
    } else {
      setDisplayValue(formik.values[name]);
    }
  }, [formik.values, name]);
  const handleBlur = (event) => {
    // Actualiza formik solo cuando el input pierde el foco
    UtilidadesHelper.handleChangeCustom(event, formik, name);
    formik.handleBlur(event); // No olvides manejar el evento onBlur original de formik
  };
  const handleChangeDisplayValue = (event) => {
    // Solo actualizamos el valor mostrado, no el de formik
    let inputValue = event.target.value;
    inputValue = inputValue.replace(/\.{2,}/g, ".").replace(/,{2,}/g, ",");
    inputValue = inputValue.replace(",", ".");
    if (!isNaN(inputValue) || inputValue === "." || inputValue === "") {
      setDisplayValue(inputValue);
    }
  };

  const transformarValor = (event) => {
    let valor = parseFloat(event);
    return valor;
  };
  // console.log("Resaltar",id,resaltar,colorEnabled,colorDisabled);

  const focusElement = (inputField) => {
    const inputElement = document.getElementById(inputField);
    if (inputElement) {
      inputElement.focus();
    }
  };

  //declaro las no obligatorias
  const NoObligatorias = [
    'project',
    'extrag_src1',
    'extrag_src2',
    'extrag_src_notas',
    'extrag_comex1',
    'extrag_comex2',
    'extrag_comex3',
    'extrag_comex_notas',
    'extrag_finan1',
    'extrag_finan2',
    'extrag_finan3',
    'extrag_finan4',
    'extrag_finan5',
    'extrag_finan_notas',
    'embarque',
  ];

  return (
    <>
      <Grid item xs={Xs_Xd[0]} md={Xs_Xd[1]} align="left">
        <Stack>
          <InputLabel required={!NoObligatorias.includes(name)}>{inputLabel}</InputLabel>
          {dataType == "string" ? (
            <TextField
              id={id}
              name={name}
              type={dataType}
              value={formik.values[name]}
              InputProps={{
                //aqui si queremos poner un placeholde
                startAdornment: (
                  <InputAdornment position="start"></InputAdornment>
                ),
                style: { textAlign: "right" },
                // classes: { input: classes.input }, // aplicar la clase al input interno
              }}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              onChange={formik.handleChange}
              fullWidth
              placeholder={em}
              inputProps={{
                style: { textAlign: "right", color: colorEnabled },
              }}
              sx={{
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: colorDisabled,
                },
              }}
            />
          ) : (
            <Grid item align="left">
              {/* <Tooltip title={textDeTooltip}> */}

              <TextField
                id={id}
                name={name}
                type="string"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                  style: { textAlign: "right" },
                  // classes: { input: classes.input }, // aplicar la clase al input interno
                }}
                value={displayValue} // Usamos el valor formateado
                onBlur={handleBlur} // Actualiza formik en el evento onBlur
                onChange={handleChangeDisplayValue} // Cambia solo el valor mostrado
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                fullWidth
                placeholder={em}
                inputProps={{
                  style: { textAlign: "right", color: colorEnabled },
                }}
                sx={{
                  "& .MuiInputBase-input.Mui-disabled": {
                    WebkitTextFillColor: colorDisabled,
                  },
                }}
                onDoubleClick={(event) => {
                  // setDobleClick(!dobleClick); //para bloquear el campo
                  focusElement(name);
                  TextTooltip();
                }}
                disabled={dobleClick}
              />
              {/* </Tooltip> */}
            </Grid>
          )}
          {formik.errors[name] && (
            <FormHelperText error>{formik.errors[name]}</FormHelperText>
          )}
        </Stack>
      </Grid>
    </>
  );
};
