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
  dataSelectPais = null,
  dataTerminales = null,
  dataCarga = null,
  dataPoliza = null,
  dataFwd = null,
  dataFlete = null,
  dataTruck = null,
  dataDeposito = null,
  dataBanco = null,
  dataGestDig = null,
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
  const [datosSelectPais, setDatosSelectPais] = useState([]);
  const [datosSelectTerminal, setDatosSelectTerminal] = useState([]);
  const [datosSelectCarga, setDatosSelectCarga] = useState([]);
  const [datosSelectPoliza, setDatosSelectPoliza] = useState([]);
  const [datosSelectFwd, setDatosSelectFwd] = useState([]);
  const [datosSelectFlete, setDatosSelectFlete] = useState([]);
  const [datosSelectTruck, setDatosSelectTruck] = useState([]);
  const [datosSelectDeposito, setDatosSelectDeposito] = useState([]);
  const [datosSelectBanco, setDatosSelectBanco] = useState([]);
  const [datosSelectGestDig, setDatosSelectGestDig] = useState([]);
  useEffect(() => {
    setDatosSelectPais(dataSelectPais); // lista los paises a mostrar en el select, ya vienen del comp padre
    setDatosSelectTerminal(dataTerminales);
    setDatosSelectCarga(dataCarga);
    setDatosSelectPoliza(dataPoliza);
    setDatosSelectFwd(dataFwd);
    setDatosSelectFlete(dataFlete);
    setDatosSelectTruck(dataTruck);
    setDatosSelectDeposito(dataDeposito);
    setDatosSelectBanco(dataBanco);
    setDatosSelectGestDig(dataGestDig)
  }, [dataSelectPais, dataTerminales, dataCarga, dataPoliza, dataFwd, dataFlete, dataTruck, dataDeposito, dataBanco, dataGestDig]);

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
    // hace que la alerta se quite en 2 segundos
    setTimeout(() => {
      setShowAlert(false);
    }, 2000);
  }, [showAlert]);

  //excluimos elementos del formulario para casos de vistas
  const excludedColumns = ["pais", "region"];

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
              {headCells
              .filter((headCell) => !excludedColumns.includes(headCell.id))
              .map((cell) => (
                <Grid item xs={12} key={cell.id}>
                  {cell.id !== "id" && (
                    <>
                      <Typography variant="subtitle1">{cell.label}</Typography>
                      {(cell.select === "paisRegion") ? (
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
                            {datosSelectPais.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.description} - {option.region}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : cell.select === "Terminal" ? (
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
                            {datosSelectTerminal.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.description} - {option.paisregion_id}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : cell.select === "Carga" ? (
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
                            {datosSelectCarga.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.description}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : cell.select === "Poliza" ? (
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
                            {datosSelectPoliza.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.description}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : cell.select === "Fwd" ? (
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
                            {datosSelectFwd.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.description}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : cell.select === "Flete" ? (
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
                            {datosSelectFlete.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.description}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : cell.select === "Truck" ? (
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
                            {datosSelectTruck.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.description}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : cell.select === "Deposito" ? (
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
                            {datosSelectDeposito.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.description}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : cell.select === "Banco" ? (
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
                            {datosSelectBanco.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.description}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : cell.select === "GestDig" ? (
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
                            {datosSelectGestDig.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.description}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : cell.numeric === false ? (
                        <TextField
                          fullWidth
                          disabled={cell.isDisabled ? true : false}
                          name={cell.id}
                          value={dataValues[cell.id] || ""}
                          placeholder={`Ingrese ${cell.label}${
                            cell.isRequired ? " *Requerido" : ""
                          }`}
                          onChange={handleChange}
                          sx={{
                            display: cell.ocultar ? "none" : "block",
                            marginTop: "5px",
                          }}
                          required={cell.isRequired}
                        />
                      ) : cell.numeric === true ? (
                        <TextField
                          type="number"
                          fullWidth
                          disabled={cell.isDisabled ? true : false}
                          name={cell.id}
                          value={dataValues[cell.id] || ""}
                          placeholder={`Ingrese ${cell.label}${
                            cell.isRequired ? " *Requerido" : ""
                          }`}
                          onChange={handleChange}
                          sx={{
                            display: cell.ocultar ? "none" : "block",
                            marginTop: "5px",
                          }}
                          required={cell.isRequired}
                        />
                      ) : cell.numeric === "fecha" ? (
                        <TextField
                          sx={{
                            display: cell.ocultar ? "none" : "block",
                            marginTop: "5px",
                          }}
                          type="datetime-local"
                          defaultValue={new Date().toISOString().slice(0, 16)} // Fecha y hora actuales en formato "yyyy-MM-ddTHH:mm"
                          fullWidth
                          disabled={cell.isDisabled ? true : false}
                          name={cell.id}
                          value={dataValues[cell.id] || ""}
                          placeholder={`Ingrese ${cell.label}${
                            cell.isRequired ? " *Requerido" : ""
                          }`}
                          onChange={handleChange}
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
