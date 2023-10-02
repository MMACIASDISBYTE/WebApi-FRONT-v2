import PropTypes from "prop-types";
import { forwardRef, useEffect, useRef, useState } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
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
import { AlertComp } from "./AlertComp";
import { SelectPaises } from "./SelectPaises";

// animation
const Transition = forwardRef((props, ref) => (
  <Slide direction="left" ref={ref} {...props} />
));

// ==============================|| Update DIALOG ||============================== //

const CompUpdate = ({
  dataRow,
  open,
  handleCloseDialog,
  TableName,
  handleUpdateAPI,
  dataSelectPais = null,
  dataSelectTerminal = null,
  dataSelectCarga = null,
  dataSelectPoliza = null,
  dataSelectFwd = null,
  dataSelectFlete = null,
  dataSelectTruck = null,
  dataSelectDeposito = null,
  dataSelectBanco = null,
  dataGestDig = null,
  dataDespachante = null,
  selectPais = false,
  selectCarga = false,
  selectTerminal = false,
  selectPoliza = false,
  selectFwd = false,
  selectPaisFwd = false,
  selectFlete = false,
  selectTruck = false,
  selectDeposito = false,
  selectBanco = false,
  selectGestDig = false,
  selectDespachante = false,
}) => {
  const theme = useTheme();
  // console.log(dataRow);
  // console.log(TableName);
  // handle tag select
  const [dataName, setDataName] = useState(dataRow || {});
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
  const [datosSelectDespachante, setDatosSelectDespachante] = useState([]);
  useEffect(() => {
    setDatosSelectPais(dataSelectPais); // lista los paises a mostrar en el select, ya vienen del comp padre
    setDatosSelectTerminal(dataSelectTerminal);
    setDatosSelectCarga(dataSelectCarga);
    setDatosSelectPoliza(dataSelectPoliza);
    setDatosSelectFwd(dataSelectFwd);
    setDatosSelectFlete(dataSelectFlete);
    setDatosSelectTruck(dataSelectTruck);
    setDatosSelectDeposito(dataSelectDeposito);
    setDatosSelectBanco(dataSelectBanco);
    setDatosSelectGestDig(dataGestDig);
    setDatosSelectDespachante(dataDespachante);
  }, [dataSelectPais, dataSelectTerminal, dataSelectCarga, dataSelectPoliza, dataSelectFwd, dataSelectFlete, dataSelectTruck, dataSelectDeposito, dataSelectBanco, dataGestDig, dataDespachante]);

  useEffect(() => {
    setDataName(dataRow || {});
  }, [dataRow]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDataName((prevDataName) => ({
      ...prevDataName,
      [name]: value,
    }));
  };

  const handleRadioChange = (event) => {
    setDataName((prevDataName) => ({
      ...prevDataName,
      [event.target.name]: event.target.value === "true",
    }));
  };

  const handleUpdate = async () => {
    // Validar si todos los campos requeridos están llenos
    const requiredFieldsFilled = Object.values(dataName).every(
      (value, index) => value !== undefined && value !== ""
    );

    if (!requiredFieldsFilled) {
      setShowAlert(true);
      return;
    }

    if (TableName == "NCM") {
      await handleUpdateAPI(dataRow.code, dataName);
      handleCloseDialog();
    } else {
      // Aquí realizas la actualización del registro usando el helper si la tabla es distinta a NCM ya no busca x id sino x code
      await handleUpdateAPI(dataRow.id, dataName);
      handleCloseDialog();
    }
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

  console.log(selectFwd)
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
          <DialogTitle>Actualizar {TableName}</DialogTitle>
          <DialogContent>
            <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
              {Object.entries(dataName).map(
                ([key, value]) =>
                  // Ocultar el campo de entrada cuando el atributo es igual a los siguientes elementos:
                  key !== "id" &&
                  key !== "pais" &&
                  key !== "paisregion_id" &&
                  key !== "carga_id" &&
                  key !== "terminal_id" &&
                  key !== "poliza_id" &&
                  key !== "fwdtte_id" && 
                  key !== "paisfwd_id" &&
                  key !== "flete_id" &&
                  key !== "trucksemi_id" &&
                  key !== "depositos_id" &&
                  key !== "banco_id" &&
                  key !== "banco" &&
                  key !== "region" &&
                  key !== "gestdigdoc_id" &&
                  key !== "despachantes_id" &&
                  key !== "despachante" &&
                  key !== "deposito" &&
                  key !== "freight" &&
                  key !== "semi" &&
                  key !== "flete" &&
                  key !== "carga" &&
                  key !== "region_orig" &&
                  key !== "pais_orig" && (
                    <Grid item xs={12} key={key}>
                      <Typography variant="subtitle1">{key}</Typography>
                      {typeof value === "boolean" ? (
                        <RadioGroup
                          row
                          name={key}
                          value={value ? "true" : "false"}
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
                      ) : (
                        <TextField
                          fullWidth
                          label={key}
                          name={key}
                          value={value}
                          onChange={handleChange}
                          sx={{ marginTop: "5px" }}
                        />
                      )}
                    </Grid>
                  )
              )}

              {/* código para añadir el selectPais */}
              {selectPais && (
                <SelectPaises 
                    nameSelect={'Pais'}
                    dataName={dataName}
                    MenuItem={MenuItem}
                    handleChange={handleChange}
                    datosSelect={datosSelectPais}
                />
              )}
              {/* código para añadir el selectFwd */}
              {selectFwd && (
                <SelectPaises 
                    nameSelect={'Fwd'}
                    dataName={dataName}
                    MenuItem={MenuItem}
                    handleChange={handleChange}
                    datosSelect={datosSelectFwd}
                />
              )}
              {/* código para añadir el selectFwd */}
              {selectPaisFwd && (
                <SelectPaises 
                    nameSelect={'Pais Fwd'}
                    dataName={dataName}
                    MenuItem={MenuItem}
                    handleChange={handleChange}
                    datosSelect={datosSelectPais}
                />
              )}
              {/* código para añadir el selectCarga */}
              {selectCarga && (
                <SelectPaises 
                    nameSelect={'Carga'}
                    dataName={dataName}
                    MenuItem={MenuItem}
                    handleChange={handleChange}
                    datosSelect={datosSelectCarga}
                />
              )}
              {/* código para añadir el selectTerminal */}
              {selectTerminal && (
                <SelectPaises 
                  nameSelect={'Terminal'}
                    dataName={dataName}
                    MenuItem={MenuItem}
                    handleChange={handleChange}
                    datosSelect={datosSelectTerminal}
                />
              )}
              {/* código para añadir el selectPoliza */}
              {selectPoliza && (
                <SelectPaises 
                  nameSelect={'Poliza'}
                    dataName={dataName}
                    MenuItem={MenuItem}
                    handleChange={handleChange}
                    datosSelect={datosSelectPoliza}
                />
              )}
              {/* código para añadir el selectFlete */}
              {selectFlete && (
                <SelectPaises 
                  nameSelect={'Flete'}
                    dataName={dataName}
                    MenuItem={MenuItem}
                    handleChange={handleChange}
                    datosSelect={datosSelectFlete}
                />
              )}
              {/* código para añadir el selectTruck */}
              {selectTruck && (
                <SelectPaises 
                  nameSelect={'Truck'}
                    dataName={dataName}
                    MenuItem={MenuItem}
                    handleChange={handleChange}
                    datosSelect={datosSelectTruck}
                />
              )}
              {/* código para añadir el selectDeposito */}
              {selectDeposito && (
                <SelectPaises 
                  nameSelect={'Deposito'}
                    dataName={dataName}
                    MenuItem={MenuItem}
                    handleChange={handleChange}
                    datosSelect={datosSelectDeposito}
                />
              )}
              {/* código para añadir el selectBanco */}
              {selectBanco && (
                <SelectPaises 
                  nameSelect={'Banco'}
                    dataName={dataName}
                    MenuItem={MenuItem}
                    handleChange={handleChange}
                    datosSelect={datosSelectBanco}
                />
              )}
              {/* código para añadir el selectGestDig */}
              {selectGestDig && (
                <SelectPaises 
                  nameSelect={'GestDig'}
                    dataName={dataName}
                    MenuItem={MenuItem}
                    handleChange={handleChange}
                    datosSelect={datosSelectGestDig}
                />
              )}
              {/* código para añadir el selectDespachante */}
              {selectDespachante && (
                <SelectPaises 
                  nameSelect={'Despachante'}
                    dataName={dataName}
                    MenuItem={MenuItem}
                    handleChange={handleChange}
                    datosSelect={datosSelectDespachante}
                />
              )}
              
            </Grid>
          </DialogContent>
          {showAlert ? (
            <AlertComp
              onClick={() => console.log("alerta")}
              handleCloseAlert={handleCloseAlert}
            />
          ) : (
            <DialogActions>
              <AnimateButton>
                <Button variant="contained" onClick={handleUpdate}>
                  Actualizar
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

CompUpdate.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func,
};
export default CompUpdate;
