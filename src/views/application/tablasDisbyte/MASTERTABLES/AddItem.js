import PropTypes from "prop-types";
import { forwardRef, useEffect, useRef, useState } from "react";

// material-ui
import { useTheme, styled } from "@mui/material/styles";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Slide,
  TextField,
  Typography,
} from "@mui/material";

// project imports
import { gridSpacing } from "store/constant";
import AnimateButton from "ui-component/extended/AnimateButton";

// assets
import { AlertComp } from "./AlertComp";

// animation
const Transition = forwardRef((props, ref) => (
  <Slide direction="left" ref={ref} {...props} />
));

// ==============================|| CANAL ADD DIALOG ||============================== //

const AddItem = ({
  open,
  handleCloseDialog,
  TableName,
  headCells,
  handleCreateAPI,
  dataSelect,
}) => {
  const theme = useTheme();
  // console.log(headCells)
  // handle tag select
  const [dataName, setDataName] = useState("");
  // Estado para almacenar la lista de elementos
  const [dataList, setDataList] = useState([]);
  // Estado para almacenar los valores de cada atributo
  const [dataValues, setDataValues] = useState({});
  // mostrar las alertas
  const [showAlert, setShowAlert] = useState(false);
  // almacena para el select paises y regiones
  const [datosSelect, setDatosSelect] = useState([]);

//   console.log(datosSelect);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDataValues((prevDataValues) => ({
      ...prevDataValues,
      [name]: value,
    }));
  };

  const handleRadioChange = (event) => {
    setDataValues((prevDataValues) => ({
      ...prevDataValues,
      [event.target.name]: event.target.value === "true",
    }));
  };

  const handleAdd = () => {
    // Validar si todos los campos requeridos están llenos
    const requiredFieldsFilled = headCells.every(
      (cell) =>
        !cell.isRequired ||
        (dataValues[cell.id] !== undefined && dataValues[cell.id] !== "")
    );

    if (!requiredFieldsFilled) {
      setShowAlert(true);
      return;
    }

    // Crear el nuevo objeto con todos los atributos ingresados
    const newData = headCells.reduce((acc, cell) => {
      acc[cell.id] = dataValues[cell.id];
      return acc;
    }, {});

    console.log(newData);

    handleCreateAPI(newData)
      .then((response) => {
        // Actualizar el estado con la nueva lista de elementos
        setDataList([...dataList, response]);
        console.log(newData);
      })
      .catch((error) => {
        console.error("Error", error);
      });

    setDataValues({});
    setDataName("");
    handleCloseDialog();
  };

  const handleCloseAlert = () => {
    setShowAlert(false); // Cierra la alerta
  };

  useEffect(() => {
    setDatosSelect(dataSelect); // lista los paises a mostrar en el select, ya vienen del comp padre
  }, [dataSelect]);

  useEffect(() => {
    // hace que la alerta se quite en 2 segundos
    setTimeout(() => {
      setShowAlert(false);
    }, 2000);
  }, [showAlert]);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleCloseDialog}
      sx={{
        "&>div:nth-of-type(3)": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "&>div": {
            m: 0,
            borderRadius: "10px",
            maxWidth: 450,
            maxHeight: "100%",
          },
        },
      }}
    >
      {open && (
        <>
          <DialogTitle>Agregar {TableName}</DialogTitle>
          <DialogContent>
            <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
              {headCells.map((cell) => (
                <Grid item xs={12} key={cell.id}>
                  {cell.id !== "id" && (
                    <>
                      <Typography variant="subtitle1">{cell.label}</Typography>
                      {cell.select === "paisRegion" ? (
                        <FormControl
                          fullWidth
                          variant="outlined"
                          sx={{ marginTop: "5px" }}
                        >
                          <InputLabel>{`Seleccione ${cell.label}${
                            cell.isRequired ? " *Requerido" : ""
                          }`}</InputLabel>
                          <Select
                            name={cell.id}
                            value={dataValues[cell.id] || ""}
                            onChange={handleChange}
                            label={`Seleccione ${cell.label}${
                              cell.isRequired ? " *Requerido" : ""
                            }`}
                          >
                            {datosSelect.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.description} - {option.region}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : cell.numeric === false ? (
                        <TextField
                          fullWidth
                          name={cell.id}
                          value={dataValues[cell.id] || ""}
                          placeholder={`Ingrese ${cell.label}${
                            cell.isRequired ? " *Requerido" : ""
                          }`}
                          onChange={handleChange}
                          sx={{ marginTop: "5px" }}
                          required={cell.isRequired}
                        />
                      ) : cell.numeric === true ? (
                        <TextField
                          type="number"
                          fullWidth
                          name={cell.id}
                          value={dataValues[cell.id] || ""}
                          placeholder={`Ingrese ${cell.label}${
                            cell.isRequired ? " *Requerido" : ""
                          }`}
                          onChange={handleChange}
                          sx={{ marginTop: "5px" }}
                          required={cell.isRequired}
                        />
                      ) : cell.numeric === "fecha" ? (
                        <TextField
                          type="datetime-local"
                          defaultValue={new Date().toISOString().slice(0, 16)} // Fecha y hora actuales en formato "yyyy-MM-ddTHH:mm"
                          fullWidth
                          name={cell.id}
                          value={dataValues[cell.id] || ""}
                          placeholder={`Ingrese ${cell.label}${
                            cell.isRequired ? " *Requerido" : ""
                          }`}
                          onChange={handleChange}
                          sx={{ marginTop: "5px" }}
                          required={cell.isRequired}
                        />
                      ) : (
                        <RadioGroup
                          row
                          name={cell.id}
                          value={
                            dataValues[cell.id] === true ? "true" : "false"
                          }
                          onChange={handleRadioChange}
                        >
                          <FormControlLabel
                            value="true"
                            control={<Radio color="primary" />}
                            label="True"
                          />
                          <FormControlLabel
                            value="false"
                            control={<Radio color="primary" />}
                            label="False"
                          />
                        </RadioGroup>
                      )}
                    </>
                  )}
                </Grid>
              ))}
            </Grid>
          </DialogContent>

          {showAlert ? (
            <AlertComp handleCloseAlert={handleCloseAlert} />
          ) : (
            <DialogActions>
              <AnimateButton>
                <Button variant="contained" onClick={handleAdd}>
                  Create
                </Button>
              </AnimateButton>
              <Button variant="text" color="error" onClick={handleCloseDialog}>
                Close
              </Button>
            </DialogActions>
          )}
        </>
      )}
    </Dialog>
  );
};

AddItem.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func,
};
export default AddItem;
