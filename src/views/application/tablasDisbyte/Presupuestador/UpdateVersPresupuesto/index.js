import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// material-ui
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Chip from "ui-component/extended/Chip";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import "@mui/lab";
import { useTheme } from "@mui/material/styles";
import AnimateButton from "ui-component/extended/AnimateButton";
// Importa CircularProgress de Material UI
import { CircularProgress } from "@material-ui/core";
import DoubleArrowRoundedIcon from "@mui/icons-material/DoubleArrowRounded";
import ReplyAllRoundedIcon from "@mui/icons-material/ReplyAllRounded";

// project imports
import AddItemPage from "./AddItemPage";
import AddItemPageUpdate from "./AddItemPageUpdate";
import { gridSpacing } from "store/constant";
import InputLabel from "ui-component/extended/Form/InputLabel";
import MainCard from "ui-component/cards/MainCard";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

// third-party
import * as yup from "yup";
import ProductsPage from "./ProductsPage";
import { useFormik } from "formik";
import useAuth from "hooks/useAuth";
// Se importan helpers necesarios:
import { CargaHelper } from "helpers/CargaHelper";
import { ProveedoresOemHelper } from "helpers/ProveedoresOemHelper";
import { NcmHelper } from "helpers/NcmHelper";
import { PresupuestoHelper } from "helpers/PresupuestoHelper";
import { TarifasPolizaHelper } from "helpers/TarifasPolizaHelper";

//importacion para poder opacar el placeholder del dolar
import { makeStyles } from "@material-ui/core/styles";
import { UtilidadesHelper } from "helpers/UtilidadesHelper";
import { PaisRegionHelper } from "helpers/PaisRegionHelper";
import { TarifasFwdHelper } from "helpers/TarifasFwdHelper";
import { TarifasFleteHelper } from "helpers/TarifasFleteHelper";
import { TarifasTerminalHelper } from "helpers/TarifasTerminalHelper";
import { TarifasDepositoHelper } from "helpers/TarifasDepositoHelper";
import { TarifasDespachanteHelper } from "helpers/TarifasDespachanteHelper";
import { TarifasBancosHelper } from "helpers/TarifasBancosHelper";
import { TarifasGestDigDocHelper } from "helpers/TarifasGestDigHelper";
import { CustomSelect } from "../CreatePresupuesto/CustomSelect";
import { CustomSelectUpdate } from "./CustomSelectUpdate";
import { ExtraCostos } from "./ExtraCostos";
import { PesajeContenedorUpdate } from "./PesajeContenedorUpdate";
import { ExtraCostosArrBool } from "./ExtraCostoArrBool";
import { Box } from "@mui/system";
import { log } from "util";
import { useAccessTokenJWT } from "helpers/useAccessTokenJWT";
import { async } from "q";
const useStyles = makeStyles((theme) => ({
  inputPlaceholder: {
    "&::placeholder": {
      color: "black", // Aquí puedes colocar el color que prefieras
      opacity: 1, // El valor por defecto es 0.54
    },
  },
}));

// yup validation-schema
const validationSchema = yup.object({
  estnumber: yup.string().required("Invoice Number is Required"),
  estvers: yup.string().required("Version Number is Required"),
  own: yup.string().required("Customer Name is Required"),
  dolar: yup.string().required("Tipo de cambio is Required"),
  ivaExcento: yup.string().required("Iva Status is required"),
  description: yup.string().nullable().required("La descripcion is required"),

  // freightFwd: yup.object().nullable().required('Pais de origen is required'),

  //   p_gloc_banco: yup
  //     .object()
  //     .shape({
  //       description: yup.string(),
  //     })
  //     .nullable()
  //     .required("Banco is required"),

  carga_id: yup
    .object()
    .shape({
      description: yup.string(),
    })
    .nullable()
    .required("Carga is required"),

  fwdpaisregion_id: yup
    .object()
    .shape({
      description: yup.string(),
    })
    .nullable()
    .required("Fwd Pais/Region is required"),

  tarifasfwd_id: yup
    .object()
    .shape({
      description: yup.string(),
    })
    .nullable()
    .required("Tarifas Fwd is required"),

  tarifasflete_id: yup
    .object()
    .shape({
      description: yup.string(),
    })
    .nullable()
    .required("Tarifas Flete is required"),

  tarifasterminales_id: yup
    .object()
    .shape({
      description: yup.string(),
    })
    .nullable()
    .required("Tarifas Terminal is required"),

  tarifaspolizas_id: yup
    .object()
    .shape({
      description: yup.string(),
    })
    .nullable()
    .required("Tarifas Poliza is required"),

  tarifasdepositos_id: yup
    .object()
    .shape({
      description: yup.string(),
    })
    .nullable()
    .required("Tarifas Deposito is required"),

  tarifasdespachantes_id: yup
    .object()
    .shape({
      description: yup.string(),
    })
    .nullable()
    .required("Tarifas Deposito is required"),

  tarifasbancos_id: yup
    .object()
    .shape({
      description: yup.string(),
    })
    .nullable()
    .required("Tarifas Deposito is Banco"),

  tarifasgestdigdoc_id: yup
    .object()
    .shape({
      description: yup.string(),
    })
    .nullable()
    .required("Tarifas Gest Dig is Banco"),

  proveedores_id: yup
    .object()
    .shape({
      description: yup.string(),
    })
    .nullable()
    .required("Proveedor Oem is required"),
});

// ==============================|| Update INVOICE ||============================== //
function CreateInvoice() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const { estnumber, vers, presupuesto } = useParams();
  // console.log(estnumber, vers);
  const classes = useStyles(); // linea para implementar la clase para opacar el placeholder de dolar
  // console.log(user);
  const [open, setOpen] = useState(false);
  const [valueMonedaLocal, setValueMonedaLocal] = React.useState("false");
  const [valueIva, setValueIva] = React.useState("false");
  const [dataHelp, setDataHelp] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingEnvio, setLoadingEnvio] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [ocultar, setOcultar] = useState(false);

  const dataHelpers = async () => {
    const carga = await CargaHelper.fetchData();
    const proveedoresOem = await ProveedoresOemHelper.fetchData();
    const NCM = await NcmHelper.fetchData();
    const NCM_Mex = await NcmHelper.fetchDataMex();
    const presupuesto = await PresupuestoHelper.fetchData();
    const presupuestoEditable = await PresupuestoHelper.readDataEstVers(
      estnumber,
      vers,
      ""
    );
    const proximoEstDisponible =
      await PresupuestoHelper.EstimateDisponibleNum();
    const proximaVerDisponible =
      await PresupuestoHelper.EstimateDisponibleVers(estnumber);
    // const tipoCambio = await UtilidadesHelper.tipoCambioGeneral();
    const Paises = await PaisRegionHelper.fetchData();
    const TarifasFwd = await TarifasFwdHelper.fetchData();
    const TarifasFlete = await TarifasFleteHelper.fetchData();
    const TarifasTerminal = await TarifasTerminalHelper.fetchData();
    const TarifasPoliza = await TarifasPolizaHelper.fetchData();
    const TarifasDepositos = await TarifasDepositoHelper.fetchData();
    const TarifasDespachantes = await TarifasDespachanteHelper.fetchData();
    const TarifasBanco = await TarifasBancosHelper.fetchData();
    const TarifasGestDig = await TarifasGestDigDocHelper.fetchData();

    const objData = {
      carga,
      proveedoresOem,
      NCM,
      NCM_Mex,
      presupuesto,
      presupuestoEditable,
      proximoEstDisponible,
      proximaVerDisponible,
      // tipoCambio,
      Paises,
      TarifasFwd,
      TarifasFlete,
      TarifasTerminal,
      TarifasPoliza,
      TarifasDepositos,
      TarifasDespachantes,
      TarifasBanco,
      TarifasGestDig,
    };
    // setDataHelp(objData);
    setLoading(false); // Mueve esta línea aquí para establecer loading en false después de que las llamadas a la API se resuelvan
    setDataHelp(objData);
  };

  useEffect(() => {
    dataHelpers();
  }, []);
  console.log(dataHelp);

  const cellInput = [
    {
      id: "carga_id",
      name: "carga_id",
      em: "Seleccione una Carga",
      inputLabel: "Carga",
      data: dataHelp.carga,
      dataType: "objectArray",
      selected_id: dataHelp?.presupuestoEditable?.estHeader?.carga_id,
      selected_description: dataHelp?.presupuestoEditable?.estHeader?.carga_id,
      PaisRegionApply: false,
    },
    {
      id: "fwdpaisregion_id",
      name: "fwdpaisregion_id",
      em: "Seleccione una pais de Origen",
      inputLabel: "Pais Origen",
      data: dataHelp.Paises,
      dataType: "objectArray",
      selected_id: dataHelp?.presupuestoEditable?.estHeader?.fwdpaisregion_id,
      selected_description:
        dataHelp?.presupuestoEditable?.estHeader?.fwdpaisregion_id,
      PaisRegionApply: false,
    },
    {
      id: "tarifasfwd_id",
      name: "tarifasfwd_id",
      em: "Seleccione una Tarifa Fwd",
      inputLabel: "Tarifas Fwd",
      data: dataHelp.TarifasFwd,
      dataType: "objectArray",
      selected_id: dataHelp?.presupuestoEditable?.estHeader?.tarifasfwd_id,
      selected_description:
        dataHelp?.presupuestoEditable?.estHeader?.tarifasfwd_id,
    },
    {
      id: "tarifasflete_id",
      name: "tarifasflete_id",
      em: "Seleccione una Tarifa Flete",
      inputLabel: "Tarifa Fletes",
      data: dataHelp.TarifasFlete,
      dataType: "objectArray",
      selected_id: dataHelp?.presupuestoEditable?.estHeader?.tarifasflete_id,
      selected_description:
        dataHelp?.presupuestoEditable?.estHeader?.tarifasflete_id,
    },
    {
      id: "tarifasterminales_id",
      name: "tarifasterminales_id",
      em: "Seleccione una Tarifa Terminal",
      inputLabel: "Tarifa Terminal",
      data: dataHelp.TarifasTerminal,
      dataType: "objectArray",
      selected_id:
        dataHelp?.presupuestoEditable?.estHeader?.tarifasterminales_id,
      selected_description:
        dataHelp?.presupuestoEditable?.estHeader?.tarifasterminales_id,
    },
    {
      id: "tarifaspolizas_id",
      name: "tarifaspolizas_id",
      em: "Seleccione una Tarifa Poliza",
      inputLabel: "Tarifa Poliza",
      data: dataHelp.TarifasPoliza,
      dataType: "objectArray",
      selected_id: dataHelp?.presupuestoEditable?.estHeader?.tarifaspolizas_id,
      selected_description:
        dataHelp?.presupuestoEditable?.estHeader?.tarifaspolizas_id,
    },
    {
      id: "tarifasdepositos_id",
      name: "tarifasdepositos_id",
      em: "Seleccione una Tarifa Deposito",
      inputLabel: "Tarifa Deposito",
      data: dataHelp.TarifasDepositos,
      dataType: "objectArray",
      selected_id:
        dataHelp?.presupuestoEditable?.estHeader?.tarifasdepositos_id,
      selected_description:
        dataHelp?.presupuestoEditable?.estHeader?.tarifasdepositos_id,
    },
    {
      id: "tarifasdespachantes_id",
      name: "tarifasdespachantes_id",
      em: "Seleccione una Tarifa Despachantes",
      inputLabel: "Tarifa Despachantes",
      data: dataHelp.TarifasDespachantes,
      dataType: "objectArray",
      selected_id:
        dataHelp?.presupuestoEditable?.estHeader?.tarifasdespachantes_id,
      selected_description:
        dataHelp?.presupuestoEditable?.estHeader?.tarifasdespachantes_id,
    },
    {
      id: "tarifasbancos_id",
      name: "tarifasbancos_id",
      em: "Seleccione una Tarifa banco",
      inputLabel: "Tarifa Banco",
      data: dataHelp.TarifasBanco,
      dataType: "objectArray",
      selected_id: dataHelp?.presupuestoEditable?.estHeader?.tarifasbancos_id,
      selected_description:
        dataHelp?.presupuestoEditable?.estHeader?.tarifasbancos_id,
    },
    {
      id: "tarifasgestdigdoc_id",
      name: "tarifasgestdigdoc_id",
      em: "Seleccione una Tarifa Gestion Digital",
      inputLabel: "Tarifa Gestion Digital",
      data: dataHelp.TarifasGestDig,
      dataType: "objectArray",
      selected_id:
        dataHelp?.presupuestoEditable?.estHeader?.tarifasgestdigdoc_id,
      selected_description:
        dataHelp?.presupuestoEditable?.estHeader?.tarifasgestdigdoc_id,
    },
  ];
  //   console.log(cellInput);

  const ExtraCostosLocal = [
    {
      id: "gloc_fwd",
      name: "gloc_fwd",
      em: "Ingrese Extra Gasto Local Fwd",
      inputLabel: "Gasto Local Fwd",
      data: dataHelp?.presupuestoEditable?.estHeader?.gloc_fwd,
      dataType: "number",
      Xs_Xd: [12, 3],
      blockDeGastos: true,
      ValorSwitch: null,
      ValorSwitchBase: dataHelp?.presupuestoEditable?.estHeader?.tarifupdate,
      arrPosition: 4,
    },
    {
      id: "gloc_flete",
      name: "gloc_flete",
      em: "Ingrese Extra Gasto Local Flete",
      inputLabel: "Gasto Local Flete",
      data: dataHelp?.presupuestoEditable?.estHeader?.gloc_flete,
      dataType: "number",
      Xs_Xd: [12, 3],
      blockDeGastos: true,
      ValorSwitch: null,
      ValorSwitchBase: dataHelp?.presupuestoEditable?.estHeader?.tarifupdate,
      arrPosition: 3,
    },
    {
      id: "gloc_terminales",
      name: "gloc_terminales",
      em: "Ingrese Extra Gasto Local Terminal",
      inputLabel: "Gasto Local Terminal",
      data: dataHelp?.presupuestoEditable?.estHeader?.gloc_terminales,
      dataType: "number",
      Xs_Xd: [12, 3],
      blockDeGastos: true,
      ValorSwitch: null,
      ValorSwitchBase: dataHelp?.presupuestoEditable?.estHeader?.tarifupdate,
      arrPosition: 7,
    },
    {
      id: "gloc_polizas",
      name: "gloc_polizas",
      em: "Ingrese Extra Gasto Local Poliza",
      inputLabel: "Gasto Local Poliza",
      data: dataHelp?.presupuestoEditable?.estHeader?.gloc_polizas,
      dataType: "number",
      Xs_Xd: [12, 3],
      blockDeGastos: true,
      ValorSwitch: null,
      ValorSwitchBase: dataHelp?.presupuestoEditable?.estHeader?.tarifupdate,
      arrPosition: 6,
    },
    {
      id: "gloc_depositos",
      name: "gloc_depositos",
      em: "Ingrese Extra Gasto Local Deposito",
      inputLabel: "Gasto Local Deposito",
      data: dataHelp?.presupuestoEditable?.estHeader?.gloc_depositos,
      dataType: "number",
      Xs_Xd: [12, 3],
      blockDeGastos: true,
      ValorSwitch: null,
      ValorSwitchBase: dataHelp?.presupuestoEditable?.estHeader?.tarifupdate,
      arrPosition: 1,
    },
    {
      id: "gloc_despachantes",
      name: "gloc_despachantes",
      em: "Ingrese Extra Gasto Local Despachantes",
      inputLabel: "Gasto Local Despachantes",
      data: dataHelp?.presupuestoEditable?.estHeader?.gloc_despachantes,
      dataType: "number",
      Xs_Xd: [12, 3],
      blockDeGastos: true,
      ValorSwitch: null,
      ValorSwitchBase: dataHelp?.presupuestoEditable?.estHeader?.tarifupdate,
      arrPosition: 2,
    },
    {
      id: "gloc_bancos",
      name: "gloc_bancos",
      em: "Ingrese Extra Gasto Local Bancos",
      inputLabel: "Gasto Local Bancos",
      data: dataHelp?.presupuestoEditable?.estHeader?.gloc_bancos,
      dataType: "number",
      Xs_Xd: [12, 3],
      blockDeGastos: true,
      ValorSwitch: null,
      ValorSwitchBase: dataHelp?.presupuestoEditable?.estHeader?.tarifupdate,
      arrPosition: 0,
    },
    {
      id: "gloc_gestdigdoc",
      name: "gloc_gestdigdoc",
      em: "Ingrese Extra Gasto Local Gest. Dig.",
      inputLabel: "Gasto Local Gest. Dig.",
      data: dataHelp?.presupuestoEditable?.estHeader?.gloc_gestdigdoc,
      dataType: "number",
      Xs_Xd: [12, 3],
      blockDeGastos: true,
      ValorSwitch: null,
      ValorSwitchBase: dataHelp?.presupuestoEditable?.estHeader?.tarifupdate,
      arrPosition: 5,
    },
    {
      id: "freight_cost",
      name: "freight_cost",
      em: "Costo flete internacional.",
      inputLabel: "Costo flete internacional.",
      data: dataHelp?.presupuestoEditable?.estHeader?.freight_cost,
      dataType: "number",
      Xs_Xd: [12, 3],
      blockDeGastos: true,
      ValorSwitch: null,
      ValorSwitchBase: dataHelp?.presupuestoEditable?.estHeader?.tarifupdate,
      arrPosition: 8,
    },
    {
      id: "freight_insurance_cost",
      name: "freight_insurance_cost",
      em: "Ingrese Gasto Seguro Carga USD.",
      inputLabel: "Seguro Carga USD.",
      data: dataHelp?.presupuestoEditable?.estHeader?.freight_insurance_cost,
      dataType: "number",
      Xs_Xd: [12, 3],
      blockDeGastos: true,
      ValorSwitch: null,
      ValorSwitchBase: dataHelp?.presupuestoEditable?.estHeader?.tarifupdate,
      arrPosition: 9,
    },
  ];

  const ExtraCostosComex = [
    {
      id: "extrag_comex1",
      name: "extrag_comex1",
      em: "Ingrese Extra Gasto Comex 1",
      inputLabel: "Ex Costo 1 Comex",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_comex1,
      dataType: "number",
      Xs_Xd: [12, 3],
      blockDeGastos: false,
      ValorSwitch: null,
    },
    {
      id: "extrag_comex2",
      name: "extrag_comex2",
      em: "Ingrese Extra Gasto Comex 2",
      inputLabel: "Ex Costo 2 Comex",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_comex2,
      dataType: "number",
      Xs_Xd: [12, 3],
      blockDeGastos: false,
    },
    {
      id: "extrag_comex3",
      name: "extrag_comex3",
      em: "Ingrese Extra Gasto Comex 3",
      inputLabel: "Ex Costo 3 Comex",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_comex3,
      dataType: "number",
      Xs_Xd: [12, 3],
      blockDeGastos: false,
    },
    {
      id: "extrag_comex4",
      name: "extrag_comex4",
      em: "Ingrese Extra Gasto Comex 4",
      inputLabel: "Ex Costo 4 Comex",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_comex4,
      dataType: "number",
      Xs_Xd: [12, 3],
      blockDeGastos: false,
    },
    {
      id: "extrag_comex5",
      name: "extrag_comex5",
      em: "Ingrese Extra Gasto Comex 5",
      inputLabel: "Ex Costo 5 Comex",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_comex5,
      dataType: "number",
      Xs_Xd: [12, 3],
      blockDeGastos: false,
    },
    {
      id: "extrag_comex_notas",
      name: "extrag_comex_notas",
      em: "Ingrese Nota De gastos Comex",
      inputLabel: "Notas de gasto Comex",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_comex_notas,
      dataType: "string",
      Xs_Xd: [12, 9],
      blockDeGastos: false,
    },
  ];

  const ExtraCostosFinan = [
    {
      id: "extrag_finan1",
      name: "extrag_finan1",
      em: "Ingrese Extra Gasto Financiero 1",
      inputLabel: "Ex Costo 1 Financiero",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_finan1,
      dataType: "number",
      Xs_Xd: [12, 3],
      blockDeGastos: false,
    },
    {
      id: "extrag_finan2",
      name: "extrag_finan2",
      em: "Ingrese Extra Gasto Financiero 2",
      inputLabel: "Ex Costo 2 Financiero",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_finan2,
      dataType: "number",
      Xs_Xd: [12, 3],
      blockDeGastos: false,
    },
    {
      id: "extrag_finan3",
      name: "extrag_finan3",
      em: "Ingrese Extra Gasto Financiero 3",
      inputLabel: "Ex Costo 3 Financiero",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_finan3,
      dataType: "number",
      Xs_Xd: [12, 3],
      blockDeGastos: false,
    },
    {
      id: "extrag_finan4",
      name: "extrag_finan4",
      em: "Ingrese Extra Gasto Financiero 4",
      inputLabel: "Ex Costo 4 Financiero",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_finan4,
      dataType: "number",
      Xs_Xd: [12, 3],
      blockDeGastos: true,
    },
    {
      id: "extrag_finan5",
      name: "extrag_finan5",
      em: "Ingrese Extra Gasto Financiero 5",
      inputLabel: "Ex Costo 5 Financiero",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_finan5,
      dataType: "number",
      Xs_Xd: [12, 3],
      blockDeGastos: true,
    },
    {
      id: "extrag_finan_notas",
      name: "extrag_finan_notas",
      em: "Ingrese Nota De gastos Financiero",
      inputLabel: "Notas de gasto Financiero",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_finan_notas,
      dataType: "string",
      Xs_Xd: [12, 9],
      blockDeGastos: false,
    },
  ];

  const cabeceraPais = [
    {
      id: "paisregion_id",
      name: "paisregion_id",
      em: "Seleccione un Pais",
      inputLabel: "Pais",
      data: dataHelp.Paises,
      dataType: "objectArray",
      selected_id: dataHelp?.presupuestoEditable?.estHeader?.paisregion_id,
      selected_description:
        dataHelp?.presupuestoEditable?.estHeader?.paisregion_id,
    },
    // {
    //   id: "carga_id",
    //   name: "carga_id",
    //   em: "Seleccione una Carga",
    //   inputLabel: "Carga",
    //   data: dataHelp.carga,
    //   dataType: "objectArray",
    //   selected_id: dataHelp?.presupuestoEditable?.estHeader?.carga_id,
    //   selected_description:
    //     dataHelp?.presupuestoEditable?.estHeader?.carga_id,
    // },
  ];

  const cabeceraNota = [
    {
      id: "description",
      name: "description",
      em: "Ingrese una Descripcion del Presupuesto", //placeholder en caso de String
      inputLabel: "Descripcion",
      data: dataHelp?.presupuestoEditable?.description,
      dataType: "string",
      selected_id: dataHelp?.presupuestoEditable?.estHeader?.description,
      selected_description:
        dataHelp?.presupuestoEditable?.estHeader?.description,
    },
  ];

  const formik = useFormik({
    initialValues: {
      id: dataHelp?.presupuestoEditable?.estHeader?.id,
      description: null,
      estnumber: "",
      estvers: "",
      status: "",
      paisregion_id:
        dataHelp?.presupuestoEditable?.estHeader?.paisregion_id || "",
      SeleccionPais: "Seleccione un pais",
      own: user.name,
      ivaExcento: "true",
      htimestamp: null,

      usarmoneda_local: "false",
      carga_id: null,
      fwdpaisregion_id: null,
      //   polizaProv: null,
      dolar: null,
      tarifupdate: null,
      tarifrecent: null, // BoolArry aqui
      tarifasfwd_id: null,
      tarifasflete_id: null,
      tarifasterminales_id: null,
      tarifaspolizas_id: null,
      tarifasdepositos_id: null,
      tarifasdespachantes_id: null,
      tarifasbancos_id: null,
      tarifasgestdigdoc_id: null,

      pesoTotal: 0,

      //gastos
      extrag_comex1: 0,
      extrag_comex2: 0,
      extrag_comex3: 0,
      extrag_comex4: 0,
      extrag_comex5: 0,
      extrag_comex_notas: "Sin notas",
      extrag_finanformula1_id: 0,
      extrag_finanformula2_id: 0,
      extrag_finanformula3_id: 0,
      extrag_finanformula4_id: 0,
      extrag_finanformula5_id: 0,
      extrag_finan1: 0,
      extrag_finan2: 0,
      extrag_finan3: 0,
      extrag_finan4: 0,
      extrag_finan5: 0,
      extrag_finan_notas: "Sin Notas",
      constantes_id: 1, //harcodeado
      fob_grand_total: 0,
      cbm_grand_total: 0,
      gw_grand_total: 0,
      cif_grand_total: 0,
      gastos_loc_total: 0,
      extragastos_total: 0,
      impuestos_total: 0,
      cantidad_contenedores: 0,
      freight_cost: 0,
      freight_insurance_cost: 0,
      iibb_total: 0,
    },
    validationSchema,
    //configuracion de formik para validar cuando envio el formulario y no al iniciar
    validateOnMount: false,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setOcultar(true);
      try {
        const postData = {
          estHeaderDB: {
            ...values, // Incluye los valores del formulario (cabecera)
            ivaExcento: values.ivaExcento === "true", // Convierte el string a booleano
            usarmoneda_local: values.usarmoneda_local === "true",

            // nuevos inputs
            description: values.description ? values.description : "",
            paisregion_id: values.paisregion_id ? values.paisregion_id.id : "",

            carga_id: values.carga_id ? values.carga_id.id : "", // Recupera la descripción

            fwdpaisregion_id: values.fwdpaisregion_id
              ? values.fwdpaisregion_id.id
              : "",
            tarifasfwd_id: values.tarifasfwd_id ? values.tarifasfwd_id.id : "",
            tarifasflete_id: values.tarifasflete_id
              ? values.tarifasflete_id.id
              : "",
            tarifasterminales_id: values.tarifasterminales_id
              ? values.tarifasterminales_id.id
              : "",
            tarifaspolizas_id: values.tarifaspolizas_id
              ? values.tarifaspolizas_id.id
              : "",
            tarifasdepositos_id: values.tarifasdepositos_id
              ? values.tarifasdepositos_id.id
              : "",
            tarifasdespachantes_id: values.tarifasdespachantes_id
              ? values.tarifasdespachantes_id.id
              : "",
            tarifasbancos_id: values.tarifasbancos_id
              ? values.tarifasbancos_id.id
              : "",
            tarifasgestdigdoc_id: values.tarifasgestdigdoc_id
              ? values.tarifasgestdigdoc_id.id
              : "",

            proveedores_id: values.proveedores_id
              ? values.proveedores_id.description
              : "",
          },
          estDetailsDB: productsData, // incluyo los productos (details)
        };

        if (values) {
          setOpen(true);
        }

        console.log(postData);

        // Solo se llama a createData si estDetailsDB tiene algún elemento.
        if (postData.estDetailsDB.length > 0) {
          try {
            console.log("Previo envio", postData, estnumber);

            await PresupuestoHelper.createNewPresupuesto(postData, estnumber);

            console.log("Creacion exitosa de: ", postData);

            setProductsData([]);
            setLoadingEnvio(false);
            setMensaje("Presupuesto creado Exitosamante");
            formik.resetForm();
          } catch (error) {
            console.log(error);
            setLoadingEnvio(false);
            setMensaje(
              error.message || "Un error ocurrió al crear el presupuesto."
            );
            formik.resetForm();
            throw error;
          }
        } else {
          throw new Error("estDetailsDB no contiene ningún elemento.");
        }
        // setProductsData([]);
        // setMensaje("Presupuesto creado Exitosamante");
        // formik.resetForm();
      } catch (error) {
        setOpen(true);
        setMensaje(error.message || "Un error desconocido ocurrió.");
        console.log("Error", error);
      }
    },
  });
  // console.log(formik.values);

  // Carga los elementos del estado inicial una vez llegado la dataHelp
  useEffect(() => {
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue("id", dataHelp.presupuestoEditable?.estHeader?.id); //traemos el numEstimate disponible
      // formik.setFieldValue('estnumber', dataHelp.presupuesto[dataHelp.presupuesto.length - 1].estnumber + 1);
    }
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "estnumber",
        dataHelp.presupuestoEditable?.estHeader?.estnumber
      ); //traemos el numEstimate disponible
      // formik.setFieldValue('estnumber', dataHelp.presupuesto[dataHelp.presupuesto.length - 1].estnumber + 1);
    }
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "estvers",
        dataHelp?.proximaVerDisponible
      );
    }
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "status",
        dataHelp.presupuestoEditable?.estHeader?.status
      );
    }
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "dolar",
        dataHelp.presupuestoEditable?.estHeader?.dolar
      );
    }
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "description",
        dataHelp.presupuestoEditable?.estHeader?.description
      );
    }
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "tarifupdate",
        dataHelp.presupuestoEditable?.estHeader?.tarifupdate
      );
    }
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "tarifrecent",
        dataHelp.presupuestoEditable?.estHeader?.tarifrecent
      );
    }

    //EXTRA GASTOS LOCAL
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "gloc_fwd",
        dataHelp.presupuestoEditable?.estHeader?.gloc_fwd
      );
    }
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "gloc_flete",
        dataHelp.presupuestoEditable?.estHeader?.gloc_flete
      );
    }
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "gloc_terminales",
        dataHelp.presupuestoEditable?.estHeader?.gloc_terminales
      );
    }
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "gloc_polizas",
        dataHelp.presupuestoEditable?.estHeader?.gloc_polizas
      );
    }
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "gloc_depositos",
        dataHelp.presupuestoEditable?.estHeader?.gloc_depositos
      );
    }
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "gloc_despachantes",
        dataHelp.presupuestoEditable?.estHeader?.gloc_despachantes
      );
    }
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "gloc_bancos",
        dataHelp.presupuestoEditable?.estHeader?.gloc_bancos
      );
    }
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "gloc_gestdigdoc",
        dataHelp.presupuestoEditable?.estHeader?.gloc_gestdigdoc
      );
    }
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "freight_cost",
        dataHelp.presupuestoEditable?.estHeader?.freight_cost
      );
    }
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "freight_insurance_cost",
        dataHelp.presupuestoEditable?.estHeader?.freight_insurance_cost
      );
    }

    //EXTRA GASTOS COMEX
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "extrag_comex1",
        dataHelp.presupuestoEditable?.estHeader?.extrag_comex1
      );
    }
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "extrag_comex2",
        dataHelp.presupuestoEditable?.estHeader?.extrag_comex2
      );
    }
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "extrag_comex3",
        dataHelp.presupuestoEditable?.estHeader?.extrag_comex3
      );
    }
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "extrag_comex4",
        dataHelp.presupuestoEditable?.estHeader?.extrag_comex4
      );
    }
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "extrag_comex5",
        dataHelp.presupuestoEditable?.estHeader?.extrag_comex5
      );
    }
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "extrag_comex_notas",
        dataHelp.presupuestoEditable?.estHeader?.extrag_comex_notas
      );
    }

    //EXTRA GASTOS FINANCIERO
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "extrag_finan1",
        dataHelp.presupuestoEditable?.estHeader?.extrag_finan1
      );
    }
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "extrag_finan2",
        dataHelp.presupuestoEditable?.estHeader?.extrag_finan2
      );
    }
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "extrag_finan3",
        dataHelp.presupuestoEditable?.estHeader?.extrag_finan3
      );
    }
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "extrag_finan4",
        dataHelp.presupuestoEditable?.estHeader?.extrag_finan4
      );
    }
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "extrag_finan5",
        dataHelp.presupuestoEditable?.estHeader?.extrag_finan5
      );
    }
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "extrag_finan_notas",
        dataHelp.presupuestoEditable?.estHeader?.extrag_finan_notas
      );
    }
    // if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
    //   formik.setFieldValue(
    //     "carga_id",
    //     dataHelp.presupuestoEditable?.estHeader?.carga_id
    //   );
    // }
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "htimestamp",
        dataHelp.presupuestoEditable?.estHeader?.htimestamp
      );
    }
  }, [dataHelp]);

  const [allAmounts, setAllAmounts] = useState({
    subTotal: 0,
    appliedTaxValue: 0.1,
    appliedDiscountValue: 0.05,
    taxesAmount: 0,
    discountAmount: 0,
    totalAmount: 0,
  });

  const [productsData, setProductsData] = useState([]);
  const [productsDataAdd, setProductsDataAdd] = useState([]);
  const [valueBasic, setValueBasic] = React.useState(new Date());
  const [addItemClicked, setAddItemClicked] = useState(false);
  const [addItemClickedUpdate, setAddItemClickedUpdate] = useState(false);
  const [rowUpdate, SetRowUpdate] = useState([]);

  // for calculating cost of all orders
  const getTotalAmounts = () => {
    const amounts = {
      subTotal: 0,
      appliedTaxValue: 0.1,
      appliedDiscountValue: 0.05,
      taxesAmount: 0,
      discountAmount: 0,
      totalAmount: 0,
    };
    productsData.forEach((item) => {
      amounts.subTotal += item.total;
    });
    amounts.taxesAmount = amounts.subTotal * amounts.appliedTaxValue;
    amounts.discountAmount =
      (amounts.subTotal + amounts.taxesAmount) * amounts.appliedDiscountValue;
    amounts.totalAmount =
      amounts.subTotal + amounts.taxesAmount - amounts.discountAmount;
    setAllAmounts(amounts);
  };

  // calculates costs when order-details change
  useEffect(() => {
    getTotalAmounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productsData]);

  // to delete row in order details
  const editProductHandler = (rowUpdate) => {
    console.log(
      `El ID producto del es: ${rowUpdate.id}, su Data es  ${rowUpdate.description}`
    );
    console.log(rowUpdate);
    setAddItemClickedUpdate(true);
    SetRowUpdate(rowUpdate);
    // setProductsData(productsData.filter((item) => item.id !== id));
  };

  useEffect(() => {
    // console.log(rowUpdate);
  }, [rowUpdate]);

  // to delete row in order details
  const deleteProductHandler = (id) => {
    setProductsData(productsData.filter((item) => item.id !== id));
  };

  // Dialog Handler
  const handleDialogOk = () => {
    setOpen(false);
    if (mensaje == "Presupuesto creado Exitosamante") {
      navigate("/estimate/estimate-list");
    }
    setMensaje('');
    setLoadingEnvio(true);
  };

  // add item handler
  const handleAddItem = (addingData, edicion = false) => {
    if (edicion) {
      // Encuentra el índice del producto en el arreglo productsData por su id
      const index = productsData.findIndex(
        (product) => product.id === addingData.id
      );

      if (index !== -1) {
        // Elimina el producto existente de la lista
        productsData.splice(index, 1);
      }
      function formatValue(value) {
        return value === "0" ? 0 : value;
      }

      // Añade el producto actualizado a la lista
      productsData.push({
        // ... (mismos campos que tienes en el caso else)
        // VALORES DEL DETAILS
        id: addingData.id,
        description: addingData.description,
        // description: addingData.desc,
        ncm_id: addingData.ncm_id,
        ncm_code: addingData.ncm_code,
        total: addingData.totalAmount,
        pcsctn: addingData.pcsctn,
        gwctn: addingData.gwctn,
        ncm_ack: true, //aplicar el RadioGroup,
        proovedores_name: addingData.proovedores_name,
        proveedores_id: addingData.proveedores_id,
        sku: addingData.sku,
        imageurl: addingData.imageurl,
        exw_u: addingData.exw_u,
        fob_u: addingData.fob_u,
        qty: addingData.qty,
        pcsctn: addingData.pcsctn,
        cbmctn: addingData.cbmctn,
        gwctn: addingData.gwctn,

        cambios_notas: addingData.cambios_notas,
        ncm_arancel: addingData.ncm_arancel,
        ncm_te_dta_otro: addingData.ncm_te_dta_otro,
        ncm_iva: addingData.ncm_iva,
        ncm_ivaad: addingData.ncm_ivaad,
        gcias: addingData.gcias,
        ncm_sp1: addingData.ncm_sp1,
        ncm_sp2: addingData.ncm_sp2,
        precio_u: addingData.precio_u,

        extrag_comex1: formatValue(addingData.extrag_comex1),
        extrag_comex2: formatValue(addingData.extrag_comex2),
        extrag_comex3: formatValue(addingData.extrag_comex3),
        extrag_comex_notas: addingData.extrag_comex_notas,

        extrag_local1: formatValue(addingData.extrag_local1),
        extrag_local2: formatValue(addingData.extrag_local2),

        extrag_finan1: formatValue(addingData.extrag_finan1),
        extrag_finan2: formatValue(addingData.extrag_finan2),
        extrag_finan3: formatValue(addingData.extrag_finan3),
        extrag_finan_notas: addingData.extrag_finan_notas,

        costo_u_est: addingData.costo_u_est,
        costo_u_prov: addingData.costo_u_prov,
        costo_u: addingData.costo_u,
        updated: addingData.updated,
        htimestamp: addingData.htimestamp,
      });

      // Actualiza el estado
      setProductsData([...productsData]);
    } else {
      setProductsData([
        ...productsData,
        {
          // VALORES DEL DETAILS
          id: addingData.id,
          description: addingData.description,
          // description: addingData.desc,
          ncm_id: addingData.ncm_id,
          ncm_code: addingData.ncm_code,
          total: addingData.totalAmount,
          pcsctn: addingData.pcsctn,
          gwctn: addingData.gwctn,
          ncm_ack: true, //aplicar el RadioGroup,
          proovedores_name: addingData.proovedores_name,
          proveedores_id: addingData.proveedores_id,
          sku: addingData.sku,
          imageurl: addingData.imageurl,
          exw_u: addingData.exw_u,
          fob_u: addingData.fob_u,
          qty: addingData.qty,
          pcsctn: addingData.pcsctn,
          cbmctn: addingData.cbmctn,
          gwctn: addingData.gwctn,

          cambios_notas: addingData.cambios_notas,
          ncm_arancel: addingData.ncm_arancel,
          ncm_te_dta_otro: addingData.ncm_te_dta_otro,
          ncm_iva: addingData.ncm_iva,
          ncm_ivaad: addingData.ncm_ivaad,
          gcias: addingData.gcias,
          ncm_sp1: addingData.ncm_sp1,
          ncm_sp2: addingData.ncm_sp2,
          precio_u: addingData.precio_u,

          extrag_comex1: addingData.extrag_comex1,
          extrag_comex2: addingData.extrag_comex2,
          extrag_comex3: addingData.extrag_comex3,
          extrag_comex_notas: addingData.extrag_comex_notas,

          extrag_local1: addingData.extrag_local1,
          extrag_local2: addingData.extrag_local2,

          extrag_finan1: addingData.extrag_finan1,
          extrag_finan2: addingData.extrag_finan2,
          extrag_finan3: addingData.extrag_finan3,
          extrag_finan_notas: addingData.extrag_finan_notas,

          costo_u_est: addingData.costo_u_est,
          costo_u_prov: addingData.costo_u_prov,
          costo_u: addingData.costo_u,
          updated: addingData.updated,
          htimestamp: addingData.htimestamp,
        },
      ]);
    }
    console.log(addingData);

    setAddItemClicked(false);
    setAddItemClickedUpdate(false);
  };

  useEffect(() => {
    if (dataHelp.presupuestoEditable) {
      setProductsData(dataHelp.presupuestoEditable.estDetails);
      setProductsDataAdd(dataHelp.presupuestoEditable.estDetAddData);
    }
  }, [dataHelp]);

  // ARRAY DE BOLEANOS
  const [ArrBool, setArrBool] = useState(Array(30).fill(false));
  const [ArrBoolANumber, setArrBoolANumber] = useState(
    formik.values.tarifupdate
  );
  const [valueSwitch, setValueSwitch] = useState(false);
  const handleSwitchChangeInIndex = (newState, position) => {
    // console.log("Nuevo estado del interruptor en Index:", newState);
    // console.log("Posición en el array:", position); // Aquí puedes hacer lo que necesites con el nuevo estado del interruptor // Crear una copia del array para evitar modificar el estado directamente
    const updatedArrBool = [...ArrBool]; //crea copia del array // Actualizar el valor en el índice específico
    updatedArrBool[position] = newState; // Actualizar el estado con el nuevo array
    setArrBool(updatedArrBool);
  };

  useEffect(() => {
    setArrBool(UtilidadesHelper.valueToBoolArr(dataHelp?.presupuestoEditable?.estHeader?.tarifupdate))
  },[dataHelp])

  useEffect(() => {
    // console.log(ArrBool);
    setArrBoolANumber(UtilidadesHelper.boolArrToValue(ArrBool));
  }, [ArrBool, formik]);
  useEffect(() => {
    // console.log(ArrBoolANumber);
    formik.setFieldValue("tarifupdate", ArrBoolANumber); //asigno los valores
    formik.setFieldValue("tarifrecent", ArrBoolANumber); //asigno los valores
    // console.log(ArrBoolANumber);
  }, [ArrBoolANumber]);

  const [showCostosLocal, setShowCostosLocal] = useState(true);
  const [showCostosComex, setShowCostosComex] = useState(true);
  const [showCostosFinan, setShowCostosFinan] = useState(true);
  const [showDetails, setShowDetails] = useState(true);

  const CambioEstado = () => {
    if (formik.values.status < 3) {
      formik.setFieldValue("status", formik.values.status + 1);
    }
    // console.log(formik.values.status);
  };
  const CambioEstadoBack = () => {
    if (formik.values.status > 0) {
      formik.setFieldValue("status", formik.values.status - 1);
    }
    // console.log(formik.values.status);
  };

  // PERMISOS
  //Gestion de permisos
  const permisos = useAccessTokenJWT();
  // console.log(permisos);
  const permiTotal = [
    "presupuesto:all",
    "presupuesto:create",
    "presupuesto:edit",
  ]; //declaro los permisos que necesita para acceder a este componente
  const permiIngreso = [
    "CEO",
    "Gerencia",
    "Lider",
    "Comex",
    "Finanzas",
    "Sourcing",
  ];
  const permiCreate = ["CEO", "Sourcing"];
  const permiEdicion = ["CEO", "Gerencia", "Comex", "Finanzas", "Sourcing"];
  const permiDelele = ["CEO"];
  const permiRetroceder = ["CEO"];
  const permiComex = ["Comex"];
  const permiSourcing = ["Sourcing"];
  const permiFinanzas = ["Finanzas"];

  const ingresoAutorizado = permiIngreso.some((permiso) =>
    permisos.includes(permiso)
  ); //recorro el array de permisos necesarios y los que me devuelve auth0 del user
  const AddOK = permiCreate.some((permiso) => permisos.includes(permiso));
  const EditOK = permiEdicion.some((permiso) => permisos.includes(permiso));
  const DeleleOK = permiDelele.every((permiso) => permisos.includes(permiso));
  const RetroEstadoOK = permiRetroceder.every((permiso) =>
    permisos.includes(permiso)
  );
  const ComexOK = permiComex.every((permiso) => permisos.includes(permiso));
  const SourcingOk = permiSourcing.every((permiso) =>
    permisos.includes(permiso)
  );
  const FinanzasOk = permiFinanzas.every((permiso) =>
    permisos.includes(permiso)
  );
  if (!ingresoAutorizado) {
    //rebote si no tiene autorizacion
    navigate("/NoAutorizado");
  }
  return (
    <>
      <MainCard title="Actualizar Presupuesto">
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "15px",
          }}
        >
          <AnimateButton>
            <Button
              variant="contained"
              onClick={() => navigate("/estimate/estimate-list")}
            >
              Ir a la lista
            </Button>
          </AnimateButton>
        </div>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={gridSpacing}>
              {/* COMPONENTE DE INPUTS que maneja la data de cabeceraPais SELECCIONA PAIS */}
              {dataHelp.presupuestoEditable &&
                cabeceraPais.map((input) => (
                  <CustomSelectUpdate
                    key={input.id}
                    id={input.id}
                    name={input.name}
                    em={input.em}
                    inputLabel={input.inputLabel}
                    data={input.data}
                    dataType={input.dataType}
                    selected_id={input.selected_id}
                    selected_description={input.selected_description}
                    formik={formik}
                    XS={12}
                    MD={2}
                  />
                ))}

              {/* Seleccion pais*/}
              <Grid item xs={12} md={2} align="left">
                <Stack>
                  <InputLabel>Region</InputLabel>
                  <TextField
                    id="SeleccionPais"
                    name="SeleccionPais"
                    type="string"
                    value={formik.values.paisregion_id.region}
                    onBlur={formik.handleBlur}
                    disabled
                    error={
                      formik.touched.SeleccionPais &&
                      Boolean(formik.errors.SeleccionPais)
                    }
                    helperText={
                      formik.touched.SeleccionPais &&
                      formik.errors.SeleccionPais
                    }
                    onChange={formik.handleChange}
                    fullWidth
                    placeholder="Seleccione un pais"
                    inputProps={{
                      style: { textAlign: "left" },
                      className: classes.inputPlaceholder,
                    }} // Aquí se alinea el texto a la derecha y opacamos el dolar
                  />
                </Stack>
              </Grid>

              {/* ESPACIO DE RELLENO */}
              <Grid item md={1}></Grid>

              {/* STATUS */}
              <Grid
                item
                xs={12}
                md={2}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  flexWrap: "wrap", // para que se envuelva en caso de que no haya espacio suficiente
                }}
              >
                <Chip
                  label={`Status ${
                    formik.values.status == 0 || formik.values.status == 1
                      ? `${formik.values.status}: Estado Inicial Comex`
                      : formik.values.status == 2
                      ? `${formik.values.status}: Segundo Estadio`
                      : `${formik.values.status}: Tercer Estadio`
                  }`}
                  size="string"
                  chipcolor="orange"
                />
                {formik.values.status <= 3 && (
                  <>
                    {/* Mostrar Flechas de estado */}
                    {formik.values.status == 0 && RetroEstadoOK && (
                      <Tooltip title="Cambiar Estado">
                        <DoubleArrowRoundedIcon
                          sx={{
                            marginTop: 1,
                            "&:hover": {
                              color: "red", // Cambia esto por el color que quieras
                            },
                          }}
                          disabled={formik.values.status == 3 ? true : false}
                          onClick={CambioEstado}
                        />
                      </Tooltip>
                    )}
                    {formik.values.status == 1 && SourcingOk && (
                      <Tooltip title="Cambiar Estado">
                        <DoubleArrowRoundedIcon
                          sx={{
                            marginTop: 1,
                            "&:hover": {
                              color: "red", // Cambia esto por el color que quieras
                            },
                          }}
                          disabled={formik.values.status == 3 ? true : false}
                          onClick={CambioEstado}
                        />
                      </Tooltip>
                    )}
                    {formik.values.status == 2 && ComexOK && (
                      <Tooltip title="Cambiar Estado">
                        <DoubleArrowRoundedIcon
                          sx={{
                            marginTop: 1,
                            "&:hover": {
                              color: "red", // Cambia esto por el color que quieras
                            },
                          }}
                          disabled={formik.values.status == 3 ? true : false}
                          onClick={CambioEstado}
                        />
                      </Tooltip>
                    )}
                    {/* Flecha de return de estado */}
                    {formik.values.status > 0 && RetroEstadoOK && (
                      <>
                        <Tooltip title="Volver">
                          <ReplyAllRoundedIcon
                            sx={{
                              marginTop: 1,
                              "&:hover": {
                                color: "red", // Cambia esto por el color que quieras
                              },
                            }}
                            disabled={formik.values.status == 3 ? true : false}
                            onClick={CambioEstadoBack}
                          />
                        </Tooltip>
                      </>
                    )}
                  </>
                )}
              </Grid>

              {/* ESPACIO DE RELLENO */}
              <Grid item md={1}></Grid>

              {/* RADIO DE MONEDA LOCAL */}
              <Grid item xs={12} md={2} align="right">
                <InputLabel required>Moneda Local</InputLabel>
                <Tooltip title="USD por defecto">
                  <FormControl>
                    <RadioGroup
                      row
                      aria-label="usarmoneda_local"
                      value={valueMonedaLocal}
                      onChange={(e) => setValueMonedaLocal(e.target.value)}
                      name="row-radio-buttons-group"
                    >
                      <FormControlLabel
                        value="true"
                        control={
                          <Radio
                            sx={{
                              color: theme.palette.primary.main,
                              "&.Mui-checked": {
                                color: theme.palette.primary.main,
                              },
                            }}
                          />
                        }
                        label="Si"
                      />
                      <FormControlLabel
                        value="false"
                        control={
                          <Radio
                            sx={{
                              color: theme.palette.error.main,
                              "&.Mui-checked": {
                                color: theme.palette.error.main,
                              },
                            }}
                          />
                        }
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
                </Tooltip>
              </Grid>

              {/* TIPO DE CAMBIO */}
              <Grid item xs={12} md={2} align="right">
                <Stack>
                  <InputLabel required>Dolar</InputLabel>
                  <TextField
                    id="dolar"
                    name="dolar"
                    type="number"
                    value={formik.values.dolar}
                    onBlur={formik.handleBlur}
                    error={formik.touched.dolar && Boolean(formik.errors.dolar)}
                    helperText={formik.touched.dolar && formik.errors.dolar}
                    onChange={formik.handleChange}
                    fullWidth
                    placeholder="$$$"
                    inputProps={{
                      style: { textAlign: "right" },
                      className: classes.inputPlaceholder,
                    }} // Aquí se alinea el texto a la derecha y opacamos el dolar
                  />
                </Stack>
              </Grid>

              {/* DETALLE DE PRESUPUESTADOR */}
              <Grid item xs={12}>
                <Divider />
              </Grid>

              {/* ESPACIO DE RELLENO */}
              {/* <Grid item md={6}></Grid> */}

              {/* CABECERA DE PRESUPUESTADOR */}
              {/* NUM DE ESTIMADO */}
              <Grid item xs={12} md={2}>
                <Stack>
                  <InputLabel required>#</InputLabel>
                  <TextField
                    id="estnumber"
                    name="estnumber"
                    disabled
                    value={formik.values.estnumber}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.estnumber &&
                      Boolean(formik.errors.estnumber)
                    }
                    helperText={
                      formik.touched.estnumber && formik.errors.estnumber
                    }
                    onChange={formik.handleChange}
                    fullWidth
                    placeholder="Invoice #"
                  />
                </Stack>
              </Grid>

              {/* NUM DE VERSION */}
              <Grid item xs={12} md={2}>
                <Stack>
                  <InputLabel required>Version</InputLabel>
                  <TextField
                    id="estvers"
                    name="estvers"
                    disabled
                    value={formik.values.estvers}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.estvers && Boolean(formik.errors.estvers)
                    }
                    helperText={formik.touched.estvers && formik.errors.estvers}
                    onChange={formik.handleChange}
                    fullWidth
                    placeholder="Version #"
                  />
                </Stack>
              </Grid>

              {dataHelp.presupuestoEditable &&
                cabeceraNota.map((input) => (
                  <CustomSelectUpdate
                    key={input.id}
                    id={input.id}
                    name={input.name}
                    em={input.em}
                    inputLabel={input.inputLabel}
                    data={input.data}
                    dataType={input.dataType}
                    selected_id={input.selected_id}
                    selected_description={input.selected_description}
                    formik={formik}
                    XS={12}
                    MD={4}
                  />
                ))}

              {/* ESPACIO DE RELLENO */}
              {/* <Grid item md={0}></Grid> */}

              {/* RADIO DEL IVA */}
              <Grid item xs={12} md={2} align="right">
                <InputLabel required>Iva Exento</InputLabel>
                <FormControl>
                  <RadioGroup
                    row
                    aria-label="ivaExcento"
                    value={valueIva}
                    onChange={(e) => setValueIva(e.target.value)}
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel
                      value="true"
                      control={
                        <Radio
                          sx={{
                            color: theme.palette.primary.main,
                            "&.Mui-checked": {
                              color: theme.palette.primary.main,
                            },
                          }}
                        />
                      }
                      label="Si"
                    />
                    <FormControlLabel
                      value="false"
                      control={
                        <Radio
                          sx={{
                            color: theme.palette.error.main,
                            "&.Mui-checked": {
                              color: theme.palette.error.main,
                            },
                          }}
                        />
                      }
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {/* FECHA DE FACTURACION */}
              <Grid item xs={12} md={2} align="right">
                <Stack>
                  <InputLabel required>Fecha de Emisión</InputLabel>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      inputFormat="dd/MM/yyyy"
                      renderInput={(props) => (
                        <TextField fullWidth {...props} />
                      )}
                      value={
                        dataHelp?.presupuestoEditable?.estHeader?.htimestamp ||
                        valueBasic
                      }
                      disabled
                      onChange={(newValue) => {
                        setValueBasic(newValue);
                      }}
                    />
                  </LocalizationProvider>
                </Stack>
              </Grid>

              {/* DETALLE DE PRESUPUESTADOR */}
              <Grid item xs={12}>
                <Divider />
              </Grid>

              {
                //COMPONENTE DE INPUTS que maneja la data de cellInput *
                dataHelp.presupuestoEditable &&
                  cellInput.map((field) => (
                    <CustomSelectUpdate
                      key={field.id}
                      {...field}
                      formik={formik}
                      XS={12}
                      MD={2}
                      PaisRegionApply={field.PaisRegionApply}
                      PaisRegion={formik.values.paisregion_id.id}
                    />
                  ))
              }

              {/* DETALLE DE COSTOS Local */}
              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12}>
                {showCostosLocal ? (
                  <>
                    <Box display="flex" alignItems="center">
                      <Tooltip title="Ocultar Gastos">
                        <VisibilityOffOutlinedIcon
                          variant="text"
                          onClick={() => setShowCostosLocal(!showCostosLocal)}
                        />
                      </Tooltip>
                      <Typography
                        color={"green"}
                        variant="h4"
                        style={{ marginLeft: "8px" }}
                      >
                        Extra Gastos Local
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box display="flex" alignItems="center">
                      <Tooltip title="Mostrar Gastos">
                        <VisibilityOutlinedIcon
                          variant="text"
                          onClick={() => setShowCostosLocal(!showCostosLocal)}
                        />
                      </Tooltip>
                      <Typography
                        color={"green"}
                        variant="h4"
                        style={{ marginLeft: "8px" }}
                      >
                        Extra Gastos Local
                      </Typography>
                    </Box>
                  </>
                )}
              </Grid>

              {dataHelp.presupuestoEditable &&
                showCostosLocal &&
                ExtraCostosLocal.map((input) => (
                  <ExtraCostosArrBool
                    key={input.id}
                    id={input.id}
                    name={input.name}
                    em={input.em}
                    inputLabel={input.inputLabel}
                    data={input.data}
                    dataType={input.dataType}
                    formik={formik}
                    Xs_Xd={input.Xs_Xd}
                    blockDeGastos={input.blockDeGastos}
                    onSwitchChange={(newState) =>
                      handleSwitchChangeInIndex(newState, input.arrPosition)
                    }
                    handleSwitchChangeInIndex={handleSwitchChangeInIndex}
                    ValorSwitch={input.ValorSwitch}
                    ValorSwitchBase={input.ValorSwitchBase}
                    arrPosition={input.arrPosition}
                  />
                ))}

              {/* DETALLE DE COSTOS COMEX */}
              {!(formik.values.status == 1 || formik.values.status == 3) && (
                <>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  <Grid item xs={12}>
                    {showCostosComex ? (
                      <>
                        <Box display="flex" alignItems="center">
                          <Tooltip title="Ocultar Gastos">
                            <VisibilityOffOutlinedIcon
                              variant="text"
                              onClick={() =>
                                setShowCostosComex(!showCostosComex)
                              }
                            />
                          </Tooltip>
                          <Typography
                            color={"green"}
                            variant="h4"
                            style={{ marginLeft: "8px" }}
                          >
                            Extra Gastos Comex
                          </Typography>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Box display="flex" alignItems="center">
                          <Tooltip title="Mostrar Gastos">
                            <VisibilityOutlinedIcon
                              variant="text"
                              onClick={() =>
                                setShowCostosComex(!showCostosComex)
                              }
                            />
                          </Tooltip>
                          <Typography
                            color={"green"}
                            variant="h4"
                            style={{ marginLeft: "8px" }}
                          >
                            Extra Gastos Comex
                          </Typography>
                        </Box>
                      </>
                    )}
                  </Grid>

                  {dataHelp.presupuestoEditable &&
                    showCostosComex &&
                    ExtraCostosComex.map((input) => (
                      <ExtraCostos
                        key={input.id}
                        id={input.id}
                        name={input.name}
                        em={input.em}
                        inputLabel={input.inputLabel}
                        data={input.data}
                        dataType={input.dataType}
                        formik={formik}
                        Xs_Xd={input.Xs_Xd}
                        blockDeGastos={input.blockDeGastos}
                        ValorSwitch={input.ValorSwitch}
                      />
                    ))}
                </>
              )}

              {/* DETALLE DE COSTOS FINAN */}
              {!(formik.values.status == 1 || formik.values.status == 2) && (
                <>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  <Grid item xs={12}>
                    {showCostosFinan ? (
                      <>
                        <Box display="flex" alignItems="center">
                          <Tooltip title="Ocultar Gastos">
                            <VisibilityOffOutlinedIcon
                              variant="text"
                              onClick={() =>
                                setShowCostosFinan(!showCostosFinan)
                              }
                            />
                          </Tooltip>
                          <Typography
                            color={"green"}
                            variant="h4"
                            style={{ marginLeft: "8px" }}
                          >
                            Extra Gastos Financieros
                          </Typography>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Box display="flex" alignItems="center">
                          <Tooltip title="Mostrar Gastos">
                            <VisibilityOutlinedIcon
                              variant="text"
                              onClick={() =>
                                setShowCostosFinan(!showCostosFinan)
                              }
                            />
                          </Tooltip>
                          <Typography
                            color={"green"}
                            variant="h4"
                            style={{ marginLeft: "8px" }}
                          >
                            Extra Gastos Financieros
                          </Typography>
                        </Box>
                      </>
                    )}
                  </Grid>

                  {dataHelp.presupuestoEditable &&
                    showCostosFinan &&
                    showCostosFinan &&
                    ExtraCostosFinan.map((input) => (
                      <ExtraCostos
                        key={input.id}
                        id={input.id}
                        name={input.name}
                        em={input.em}
                        inputLabel={input.inputLabel}
                        data={input.data}
                        dataType={input.dataType}
                        formik={formik}
                        Xs_Xd={input.Xs_Xd}
                      />
                    ))}
                </>
              )}

              {/* CARGA DE PRODUCTOS */}
              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12}>
                {showDetails ? (
                  <>
                    <Box display="flex" alignItems="center">
                      <Tooltip title="Ocultar Detalle">
                        <VisibilityOffOutlinedIcon
                          variant="text"
                          onClick={() => setShowDetails(!showDetails)}
                        />
                      </Tooltip>
                      <Typography
                        color={"red"}
                        variant="h3"
                        style={{ marginLeft: "8px" }}
                      >
                        Detalle Producto
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box display="flex" alignItems="center">
                      <Tooltip title="Mostrar Detalle">
                        <VisibilityOutlinedIcon
                          variant="text"
                          onClick={() => setShowDetails(!showDetails)}
                        />
                      </Tooltip>
                      <Typography
                        color={"red"}
                        variant="h3"
                        style={{ marginLeft: "8px" }}
                      >
                        Detalle Producto
                      </Typography>
                    </Box>
                  </>
                )}
              </Grid>

              {
                // Si no se llama al componente de editar producto se mostrara
                !addItemClickedUpdate && showDetails && (
                  <ProductsPage
                    productsData={productsData}
                    productsDataAdd={productsDataAdd}
                    deleteProductHandler={deleteProductHandler}
                    editProductHandler={editProductHandler}
                  />
                )
              }

              {addItemClicked ? (
                <Grid item xs={12}>
                  <AddItemPage
                    handleAddItem={handleAddItem}
                    setAddItemClicked={setAddItemClicked}
                    dataHelp={dataHelp}
                    formik={formik}
                  />
                </Grid>
              ) : addItemClickedUpdate ? (
                <Grid item xs={12}>
                  <AddItemPageUpdate
                    handleAddItem={handleAddItem}
                    setAddItemClickedUpdate={setAddItemClickedUpdate}
                    dataHelp={dataHelp}
                    rowUpdate={rowUpdate}
                    formik={formik}
                  />
                </Grid>
              ) : (
                <Grid item>
                  <Button
                    variant="text"
                    onClick={() => setAddItemClicked(true)}
                  >
                    + Agregar Producto
                  </Button>
                </Grid>
              )}
              <Grid item xs={12}>
                <Divider />
              </Grid>

              {/* PESAJE CONTENEDORES */}
              {ocultar ? (
                ""
              ) : (
                <PesajeContenedorUpdate
                  productsData={productsData}
                  tipoContenedor={formik.values.carga_id}
                />
              )}

              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid
                item
                sx={{ display: "flex", justifyContent: "center" }}
                xs={12}
              >
                {formik.values.paisregion_id == "" ? (
                  <Button variant="contained" color="warning" disabled>
                    Seleccione Pais
                  </Button>
                ) : (
                  <Button variant="contained" type="submit">
                    Presupuestar
                  </Button>
                )}
              </Grid>

              <Grid item>
                <Dialog open={open}>
                  {loadingEnvio && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "10vh",
                      }}
                    >
                      <CircularProgress />
                    </div>
                  )}
                  <DialogContent>
                    <DialogContentText
                      sx={{
                        fontWeight: 500,
                        color: `secondary.dark`,
                        minWidth: 200,
                      }}
                    >
                      {mensaje}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions sx={{ pr: "20px" }}>
                    {!loadingEnvio && (
                      <Button
                        autoFocus
                        variant="contained"
                        onClick={handleDialogOk}
                      >
                        Ok
                      </Button>
                    )}
                  </DialogActions>
                </Dialog>
              </Grid>
            </Grid>
          </form>
        )}
      </MainCard>
    </>
  );
}
export default CreateInvoice;
