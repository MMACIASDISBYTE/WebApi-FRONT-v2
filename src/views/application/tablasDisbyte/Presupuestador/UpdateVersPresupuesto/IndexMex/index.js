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
  FormHelperText,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import Chip from "ui-component/extended/Chip";
import Checkbox from "@mui/material/Checkbox";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import "@mui/lab";
import { useTheme } from "@mui/material/styles";
import AnimateButton from "ui-component/extended/AnimateButton";
// Importa CircularProgress de Material UI
import { CircularProgress, Select } from "@material-ui/core";
import DoubleArrowRoundedIcon from "@mui/icons-material/DoubleArrowRounded";
import ReplyAllRoundedIcon from "@mui/icons-material/ReplyAllRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

// project imports
import AddItemPage from "../AddItemPage";
import { gridSpacing } from "store/constant";
import InputLabel from "ui-component/extended/Form/InputLabel";
import MainCard from "ui-component/cards/MainCard";

// third-party
import * as yup from "yup";
import ProductsPage from "../ProductsPage";
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
import { ExtraCostosArrBool } from "../../UpdateVersPresupuesto/ExtraCostoArrBool";
import { TarifonMexHelper } from "helpers/TarifonMexHelper";
import { Box } from "@mui/system";
import { ExtraCostoDobleClick } from "../../UpdateVersPresupuesto/ExtraCostoDobleClick";
import { PesajeContenedor } from "../../CreatePresupuesto/PesajeContenedor";
import { CustomSelect } from "../../CreatePresupuesto/CustomSelect";
import AddDetailsPage from "../../CreatePresupuesto/AddDetailsPage";
import { CustomSelectUpdate } from "../CustomSelectUpdate";
import UpdateItemPage from "../UpdateItemPage";
import { ProductosHelper } from "helpers/ProductosHelper";
import { useAccessTokenJWT } from "helpers/useAccessTokenJWT";
import { ExtraCostoDobleClickUpdate } from "../ExtraCostoDobleClickUpdate";
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
  // project: yup.string().nullable().required("El Prj is required"),

  carga_id: yup
    .object()
    .shape({
      description: yup.string(),
    })
    .nullable()
    .required("Carga is required"),

  // fwdpaisregion_id: yup
  //   .object()
  //   .shape({
  //     description: yup.string(),
  //   })
  //   .nullable()
  //   .required("Fwd Pais/Region is required"),

  // tarifasfwd_id: yup
  //   .object()
  //   .shape({
  //     description: yup.string(),
  //   })
  //   .nullable()
  //   .required("Tarifas Fwd is required"),

  // tarifasflete_id: yup
  //   .object()
  //   .shape({
  //     description: yup.string(),
  //   })
  //   .nullable()
  //   .required("Tarifas Flete is required"),

  // tarifasterminales_id: yup
  //   .object()
  //   .shape({
  //     description: yup.string(),
  //   })
  //   .nullable()
  //   .required("Tarifas Terminal is required"),

  // tarifaspolizas_id: yup
  //   .object()
  //   .shape({
  //     description: yup.string(),
  //   })
  //   .nullable()
  //   .required("Tarifas Poliza is required"),

  // tarifasdepositos_id: yup
  //   .object()
  //   .shape({
  //     description: yup.string(),
  //   })
  //   .nullable()
  //   .required("Tarifas Deposito is required"),

  // tarifasdespachantes_id: yup
  //   .object()
  //   .shape({
  //     description: yup.string(),
  //   })
  //   .nullable()
  //   .required("Tarifas Deposito is required"),

  // tarifasbancos_id: yup
  //   .object()
  //   .shape({
  //     description: yup.string(),
  //   })
  //   .nullable()
  //   .required("Tarifas Deposito is Banco"),

  // tarifasgestdigdoc_id: yup
  //   .object()
  //   .shape({
  //     description: yup.string(),
  //   })
  //   .nullable()
  //   .required("Tarifas Gest Dig is Banco"),
});

// ==============================|| CREATE INVOICE ||============================== //
function CreateInvoice() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const { estnumber, vers, presupuesto } = useParams();
  const classes = useStyles(); // linea para implementar la clase para opacar el placeholder de dolar
  // console.log(user);
  const [open, setOpen] = useState(false);
  const [valueMonedaLocal, setValueMonedaLocal] = React.useState("false");
  const [valueIva, setValueIva] = React.useState("false");
  const [dataHelp, setDataHelp] = useState({});
  const [ProductsDisbyte, setProductsDisbyte] = useState({});

  const [loading, setLoading] = useState(true);
  const [loadingEnvio, setLoadingEnvio] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [ocultar, setOcultar] = useState(false);
  const [resaltaCambios, setResaltaCambios] = useState([]);

  const ordenArrCarga = [
    "LCL",
    "20ST",
    "40ST",
    "40HQ",
    "2*20ST",
    "2*40ST",
    "2*40HQ",
  ];

  const dataHelpers = async () => {
    const cargaAOrdenar = await CargaHelper.fetchData();
    const proveedoresOem = await ProveedoresOemHelper.fetchData();
    const NCM = await NcmHelper.fetchData();
    const NCM_Mex = await NcmHelper.fetchDataMex();
    const presupuesto = await PresupuestoHelper.fetchData();
    const presupuestoEditable = await PresupuestoHelper.readDataEstVers(
      estnumber,
      vers,
      ""
    );
    const presuUltimosEstadios =
      await PresupuestoHelper.fetchDataUltimosEstadios(estnumber);
    const proximoEstDisponible =
      await PresupuestoHelper.EstimateDisponibleNum();
    // const tipoCambio = await UtilidadesHelper.tipoCambioGeneral();
    const Paises = await PaisRegionHelper.fetchData();
    const TarifasFwd = await TarifasFwdHelper.fetchData();
    const TarifasFlete = await TarifasFleteHelper.fetchData();
    const TarifasTerminal = await TarifasTerminalHelper.fetchData();
    const TarifasPoliza = await TarifasPolizaHelper.fetchData();
    const TarifasDepositos = await TarifasDepositoHelper.fetchData();
    const TarifasDespachantes = await TarifasDespachanteHelper.fetchData();
    const TarifasBanco = await TarifasBancosHelper.fetchDataFecha();
    const TarifasGestDig = await TarifasGestDigDocHelper.fetchData();
    const ProductosDisbyte = await ProductosHelper.fetchData();

    const carga = await UtilidadesHelper.ordenadorDeArrayByDescription(
      ordenArrCarga,
      cargaAOrdenar
    );

    const objData = {
      carga,
      proveedoresOem,
      NCM,
      NCM_Mex,
      presupuesto,
      presupuestoEditable,
      presuUltimosEstadios,
      proximoEstDisponible,
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
      ProductosDisbyte,
    };
    setDataHelp(objData);
    setLoading(false); // Mueve esta línea aquí para establecer loading en false después de que las llamadas a la API se resuelvan
    setDataHelp(objData);
  };
  console.log(dataHelp);

  const [producto, setProductos] = useState();
  useState(() => {
    if (dataHelp.ProductosDisbyte) {
      const opciones = dataHelp?.ProductosDisbyte.map((product) => ({
        title: product.name,
        ...product,
      }));
      console.log(opciones);
    }
  }, [dataHelp.ProductosDisbyte]);

  const cellInput = [
    {
      id: "tarifasfwd_id",
      name: "tarifasfwd_id",
      em: "Seleccione una Tarifa Fwd",
      inputLabel: "Fwd",
      data: dataHelp.TarifasFwd,
    },
    {
      id: "tarifasflete_id",
      name: "tarifasflete_id",
      em: "Seleccione una Tarifa Flete",
      inputLabel: "Fletes",
      data: dataHelp.TarifasFlete,
    },
    {
      id: "tarifasterminales_id",
      name: "tarifasterminales_id",
      em: "Seleccione una Tarifa Terminal",
      inputLabel: "Terminal",
      data: dataHelp.TarifasTerminal,
    },
    {
      id: "tarifaspolizas_id",
      name: "tarifaspolizas_id",
      em: "Seleccione una Tarifa Poliza",
      inputLabel: "Poliza",
      data: dataHelp.TarifasPoliza,
    },
    {
      id: "tarifasdepositos_id",
      name: "tarifasdepositos_id",
      em: "Seleccione una Tarifa Deposito",
      inputLabel: "Deposito",
      data: dataHelp.TarifasDepositos,
    },
    {
      id: "tarifasdespachantes_id",
      name: "tarifasdespachantes_id",
      em: "Seleccione una Tarifa Despachantes",
      inputLabel: "Despachantes",
      data: dataHelp.TarifasDespachantes,
    },
    {
      id: "tarifasbancos_id",
      name: "tarifasbancos_id",
      em: "Seleccione una Tarifa banco",
      inputLabel: "Banco",
      data: dataHelp.TarifasBanco,
    },
    {
      id: "tarifasgestdigdoc_id",
      name: "tarifasgestdigdoc_id",
      em: "Seleccione una Tarifa Gestion Digital",
      inputLabel: "Gestion Digital",
      data: dataHelp.TarifasGestDig,
    },
  ];
  //   console.log(cellInput);

  const cabeceraPais = [
    {
      id: "paisregion_id",
      name: "paisregion_id",
      em: "Seleccione un Pais",
      inputLabel: "Destino",
      data: dataHelp.Paises,
    },
  ];

  const cabeceraCarga = [
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
  ];

  const cabeceraPaisOrigen = [
    {
      id: "fwdpaisregion_id",
      name: "fwdpaisregion_id",
      em: "Seleccione una pais de Origen",
      inputLabel: "Origen",
      data: dataHelp.Paises,
    },
  ];

  const cabeceraNota = [
    {
      id: "description",
      name: "description",
      em: "Ingrese una Descripcion del Presupuesto", //placeholder en caso de String
      inputLabel: "Descripcion",
      data: "String",
    },
  ];

  const cabeceraPRJ = [
    {
      id: "project",
      name: "project",
      em: "Ingrese un Project", //placeholder en caso de String
      inputLabel: "PRJ",
      data: "String",
    },
  ];

  const cabeceraEmbarque = [
    {
      id: "embarque",
      name: "embarque",
      em: "Ingrese un Embarque", //placeholder en caso de String
      inputLabel: "Embarque",
      data: "String",
    },
  ];

  const ExtraCostosLocal = [
    {
      id: "gloc_fwd",
      name: "gloc_fwd",
      em: "Ingrese Gastos Locales FWD [USD]",
      inputLabel: "Locales FWD [USD]",
      data: dataHelp?.presupuestoEditable?.estHeader?.gloc_fwd,
      dataType: "number",
      Xs_Xd: [12, 1.7],
      resaltar: false,
      nameGastoLocalTarifon: "gloc_fwd",
    },
    {
      id: "gloc_terminales",
      name: "gloc_terminales",
      em: "Ingrese Gasto Terminal [USD]",
      inputLabel: "Terminal [USD]",
      data: dataHelp?.presupuestoEditable?.estHeader?.gloc_terminales,
      dataType: "number",
      Xs_Xd: [12, 1.7],
      resaltar: false,
      nameGastoLocalTarifon: "gasto_terminal",
    },
    {
      id: "gloc_flete",
      name: "gloc_flete",
      em: "Ingrese Gasto Flete Interno [USD]",
      inputLabel: "Flete Interno [USD]",
      data: dataHelp?.presupuestoEditable?.estHeader?.gloc_flete,
      dataType: "number",
      Xs_Xd: [12, 1.7],
      resaltar: false,
      nameGastoLocalTarifon: "flete_interno",
    },
    {
      id: "gloc_descarga",
      name: "gloc_descarga",
      em: "Ingrese Gasto Descarga [USD]",
      inputLabel: "Descarga [USD]",
      data: dataHelp?.presupuestoEditable?.estHeader?.gloc_descarga,
      dataType: "number",
      Xs_Xd: [12, 1.7],
      resaltar: false,
      nameGastoLocalTarifon: "gasto_descarga_depo",
    },
    {
      id: "gloc_despachantes",
      name: "gloc_despachantes",
      em: "Ingrese Gastos Despacho [USD]",
      inputLabel: "Despacho [USD]",
      data: dataHelp?.presupuestoEditable?.estHeader?.gloc_despachantes,
      dataType: "number",
      Xs_Xd: [12, 1.7],
      resaltar: false,
      nameGastoLocalTarifon: "gloc_despachantes", //se calcula
    },
    {
      id: "freight_cost",
      name: "freight_cost",
      em: "Freight Cost USD",
      inputLabel: "Freight Cost [USD]",
      data: dataHelp?.presupuestoEditable?.estHeader?.freight_cost,
      dataType: "number",
      Xs_Xd: [12, 1.7],
      resaltar: false,
      nameGastoLocalTarifon: "freight_charge",
    },
    {
      id: "freight_insurance_cost",
      name: "freight_insurance_cost",
      em: "Freight Insurance [USD]",
      inputLabel: "Freight Insurance [USD]",
      data: dataHelp?.presupuestoEditable?.estHeader?.freight_insurance_cost,
      dataType: "number",
      Xs_Xd: [12, 1.7],
      resaltar: false,
      nameGastoLocalTarifon: "freight_insurance_cost", // se calcula
    },
  ];

  const ExtraCostosSourcing = [
    {
      id: "extrag_src1",
      name: "extrag_src1",
      em: "Valor 1 [USD]",
      inputLabel: "Valor 1 [USD]",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_src1,
      dataType: "number",
      Xs_Xd: [12, 3],
      resaltar: false,
    },
    {
      id: "extrag_src2",
      name: "extrag_src2",
      em: "Valor 2 [USD]",
      inputLabel: "Valor 2 [USD]",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_src2,
      dataType: "number",
      Xs_Xd: [12, 3],
      resaltar: false,
    },
    {
      id: "extrag_src_notas",
      name: "extrag_src_notas",
      em: "Notas",
      inputLabel: "Notas",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_src_notas,
      dataType: "string",
      Xs_Xd: [12, 6],
      resaltar: false,
    },
  ];

  const ExtraCostosComex = [
    // {
    //   id: "fecha_embarque",
    //   name: "fecha_embarque",
    //   em: "fecha_embarque",
    //   inputLabel: "fecha_embarque",
    //   data: dataHelp?.presupuestoEditable?.estHeader?.fecha_embarque,
    //   dataType: "String",
    //   Xs_Xd: [12, 1.7],
    //   blockDeGastos: true,
    //   ValorSwitch: null,
    //   ValorSwitchBase: dataHelp?.presupuestoEditable?.estHeader?.fecha_embarque,
    //   arrPosition: 4,
    //   resaltar: false,
    // },
    {
      id: "embarque",
      name: "embarque",
      em: "Embarque",
      inputLabel: "Embarque",
      data: dataHelp?.presupuestoEditable?.estHeader?.embarque,
      dataType: "string",
      Xs_Xd: [12, 1.7],
      resaltar: false,
    },
    {
      id: "bl",
      name: "bl",
      em: "Ingrese Bl",
      inputLabel: "Bl",
      data: dataHelp?.presupuestoEditable?.estHeader?.bl,
      dataType: "string",
      Xs_Xd: [12, 1.7],
      resaltar: false,
    },
    {
      id: "extrag_comex1",
      name: "extrag_comex1",
      em: "Valor 1 [USD]",
      inputLabel: "Valor 1 [USD]",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_comex1,
      dataType: "number",
      Xs_Xd: [12, 1.7],
      resaltar: false,
    },
    {
      id: "extrag_comex2",
      name: "extrag_comex2",
      em: "Valor 2 [USD]",
      inputLabel: "Valor 2 [USD]",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_comex2,
      dataType: "number",
      Xs_Xd: [12, 1.7],
      resaltar: false,
    },
    {
      id: "extrag_comex3",
      name: "extrag_comex3",
      em: "Valor 3 [USD]",
      inputLabel: "Valor 3 [USD]",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_comex3,
      dataType: "number",
      Xs_Xd: [12, 1.7],
      resaltar: false,
    },
    {
      id: "extrag_comex_notas",
      name: "extrag_comex_notas",
      em: "Notas",
      inputLabel: "Notas",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_comex_notas,
      dataType: "string",
      Xs_Xd: [12, 1.7],
      resaltar: false,
    },
  ];

  const ExtraCostosFinanciero = [
    {
      id: "pedimiento",
      name: "pedimiento",
      em: "N° De Pedimento",
      inputLabel: "N° Pedimento",
      data: dataHelp?.presupuestoEditable?.estHeader?.pedimiento,
      dataType: "string",
      Xs_Xd: [12, 1.4],
      resaltar: false,
    },
    {
      id: "extrag_finan1",
      name: "extrag_finan1",
      em: "Valor 1 [USD]",
      inputLabel: "Valor 1 [USD]",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_finan1,
      dataType: "number",
      Xs_Xd: [12, 1.4],
      resaltar: false,
    },
    {
      id: "extrag_finan2",
      name: "extrag_finan2",
      em: "Valor 2 [USD]",
      inputLabel: "Valor 2 [USD]",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_finan2,
      dataType: "number",
      Xs_Xd: [12, 1.4],
      resaltar: false,
    },
    {
      id: "extrag_finan3",
      name: "extrag_finan3",
      em: "Valor 3 [USD]",
      inputLabel: "Valor 3 [USD]",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_finan3,
      dataType: "number",
      Xs_Xd: [12, 1.4],
      resaltar: false,
    },
    {
      id: "extrag_finan4",
      name: "extrag_finan4",
      em: "Valor 4 [USD]",
      inputLabel: "Valor 4 [USD]",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_finan4,
      dataType: "number",
      Xs_Xd: [12, 1.4],
      resaltar: false,
    },
    {
      id: "extrag_finan5",
      name: "extrag_finan5",
      em: "Valor 5 [USD]",
      inputLabel: "Valor 5 [USD]",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_finan5,
      dataType: "number",
      Xs_Xd: [12, 1.4],
      resaltar: false,
    },
    {
      id: "extrag_finan_notas",
      name: "extrag_finan_notas",
      em: "Notas",
      inputLabel: "Notas",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_finan_notas,
      dataType: "string",
      Xs_Xd: [12, 2],
      resaltar: false,
    },
  ];

  useEffect(() => {
    dataHelpers();
  }, []);

  const formik = useFormik({
    initialValues: {
      description: null,
      project: "",
      embarque: "",
      fecha_embarque: UtilidadesHelper.fechaParaDB(),
      bl: "",
      estnumber: "",
      estvers: 1,
      status: 1,
      paisregion_id: 5, //Mexico Guadalajara HARCODEADO
      fwdpaisregion_id: 9, // es CHINA  Puede cambiar segun importador
      SeleccionPais: "Seleccione un pais", // existe para establecer la region
      own: user.name,
      avatar_url: user.avatar,
      ivaExcento: "true",
      htimestamp: UtilidadesHelper.fechaParaDB(),

      usarmoneda_local: "false",
      carga_id: null,
      //   polizaProv: null,
      dolar: "",
      tarifupdate: 0, //harcodeado (formula de calculo)
      tarifrecent: 0, //harcodeado (formula de calculo)
      tarifasfwd_id: 9,
      tarifasflete_id: 9,
      tarifasterminales_id: 2,
      tarifaspolizas_id: 0,
      tarifasdepositos_id: 0,
      tarifasdespachantes_id: 2,
      tarifasbancos_id: 0,
      tarifasgestdigdoc_id: 0,

      extrag_src_notas: "",

      pesoTotal: 0,

      //gastos
      extrag_comex1: 0,
      extrag_comex2: 0,
      extrag_comex3: 0,
      extrag_comex_notas: "Sin notas",
      extrag_glob_src1: 0, //nuevos
      extrag_glob_src2: 0, //nuevos
      extrag_src_notas: "Sin Notas",
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
      pedimiento: "",
      fecha_pedimiento: UtilidadesHelper.fechaParaDB(),
      extrag_finan_notas: "Sin notas",
      constantes_id: 1, //harcodeado
      fob_grand_total: 0,
      cbm_grand_total: 0,
      gw_grand_total: 0,
      cif_grand_total: 0,
      gastos_loc_total: 0,
      extragastos_total: 0,
      impuestos_total: 0,
      cantidad_contenedores: 0,
      iibb_total: 0,
      tarifonmex_id: 0,

      gloc_fwd: 0,
      gloc_flete: 0,
      gloc_terminales: 0,
      gloc_despachantes: 0,
      gloc_descarga: 0,
      freight_cost: 0,
      freight_insurance_cost: 0,
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

            //AQUI ESTAN COMENTADOS YA QUE SINO PONEN EL ELEMENTO EN 0
            // paisregion_id: values.paisregion_id ? values.paisregion_id.id : "", //HARCODEADO EN 5
            // fwdpaisregion_id: values.fwdpaisregion_id ? values.fwdpaisregion_id.id : "",

            carga_id: values.carga_id ? values.carga_id.id : "", // Recupera la descripción
            embarque: values.embarque ? values.embarque : "",

            // tarifasfwd_id: values.tarifasfwd_id ? values.tarifasfwd_id.id : "",
            // tarifasflete_id: values.tarifasflete_id
            //   ? values.tarifasflete_id.id
            //   : "",
            // tarifasterminales_id: values.tarifasterminales_id
            //   ? values.tarifasterminales_id.id
            //   : "",
            // tarifaspolizas_id: values.tarifaspolizas_id
            //   ? values.tarifaspolizas_id.id
            //   : "",
            // tarifasdepositos_id: values.tarifasdepositos_id
            //   ? values.tarifasdepositos_id.id
            //   : "",
            // tarifasdespachantes_id: values.tarifasdespachantes_id
            //   ? values.tarifasdespachantes_id.id
            //   : "",
            // tarifasbancos_id: values.tarifasbancos_id
            //   ? values.tarifasbancos_id.id
            //   : "",
            // tarifasgestdigdoc_id: values.tarifasgestdigdoc_id
            //   ? values.tarifasgestdigdoc_id.id
            //   : "",
          },
          estDetailsDB: productsData, // incluyo los productos (details)
        };

        if (values) {
          setOpen(true);
        }

        console.log(postData);
        // console.log(productsData);
        // console.log(postData);

        // Solo se llama a createData si estDetailsDB tiene algún elemento.
        if (postData.estDetailsDB.length > 0) {
          try {
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
            // formik.resetForm();
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
        console.error("Error", error.errors);
      }
    },
  });
  // console.log(formik.values);

  // Carga los elementos del estado inicial una vez llegado la dataHelp
  useEffect(() => {
    //CABECERA
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue("estnumber", dataHelp.proximoEstDisponible); //traemos el numEstimate disponible
      // formik.setFieldValue('estnumber', dataHelp.presupuesto[dataHelp.presupuesto.length - 1].estnumber + 1);
    }
    // ESTADO INICIAL QUE FUNCIONA CON LA COTIZACION (por ahora suspendida xq relentiza la app)
    // if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
    //   formik.setFieldValue("dolar", dataHelp.tipoCambio.quotes.USDARS);
    // }
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue("dolar", 350);
    }

    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "status",
        dataHelp.presupuestoEditable?.estHeader?.status
      );
    }

    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "project",
        dataHelp.presupuestoEditable?.estHeader?.project == ""
          ? "Sin Data"
          : dataHelp.presupuestoEditable?.estHeader?.project
      );
    }
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "description",
        dataHelp.presupuestoEditable?.estHeader?.description == ""
          ? "Sin Data"
          : dataHelp.presupuestoEditable?.estHeader?.description
      );
    }

    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "embarque",
        dataHelp.presupuestoEditable?.estHeader?.embarque == ""
          ? "Sin Data"
          : dataHelp.presupuestoEditable?.estHeader?.embarque
      );
    }

    //GASTOS LOCALES
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
        "gloc_despachantes",
        dataHelp.presupuestoEditable?.estHeader?.gloc_despachantes
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

    // EXTRA GASTOS
    // SOURCING
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "extrag_src1",
        dataHelp.presupuestoEditable?.estHeader?.extrag_src1
      );
    }
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "extrag_src2",
        dataHelp.presupuestoEditable?.estHeader?.extrag_src2
      );
    }
    if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
      formik.setFieldValue(
        "extrag_src_notas",
        dataHelp.presupuestoEditable?.estHeader?.extrag_src_notas
      );
    }
    // COMEX
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
        "extrag_comex_notas",
        dataHelp.presupuestoEditable?.estHeader?.extrag_comex_notas
      );
    }
    // FINANCIERO
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

  // to Update row in order details
  const [openUpdate, setOpenUpdate] = useState(false);
  const editProductHandler = (rowUpdate) => {
    console.log(`El producto seleccionado es el: `, rowUpdate);
    // setProductsData(productsData.filter((item) => item.id !== id));
    setOpenUpdate(true);
    SetRowUpdate(rowUpdate);
  };
  const handleCloseUpdateDialog = () => {
    setOpenUpdate(false);
  };

  // to delete row in order details
  const deleteProductHandler = (id) => {
    setProductsData(productsData.filter((item) => item.id !== id));
  };

  // Dialog Handler
  const handleDialogOk = () => {
    setOpen(false);
    if (mensaje == "Presupuesto creado Exitosamante") {
      // navigate("/estimate/estimate-list");
      navigate(`/estimate/details/${estnumber}/${Number(vers) + 1}`);
    }
    setMensaje("");
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
        // total: addingData.totalAmount,
        pcsctn: addingData.pcsctn,
        gwctn: addingData.gwctn,
        ncm_ack: true, //aplicar el RadioGroup,
        proovedores_name: addingData.proovedores_name,
        proveedores_id: addingData.proveedores_id,
        sku: addingData.sku,

        productowner: addingData.productowner,
        proforma_invoice: addingData.proforma_invoice,
        comercial_invoice: addingData.comercial_invoice,
        purchaseorder: addingData.purchaseorder,
        proveedor_prov: addingData.proveedor_prov,

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

        extrag_src1: formatValue(addingData.extrag_src1),
        extrag_src2: formatValue(addingData.extrag_src2),
        extrag_src_notas: addingData.extrag_src_notas,

        extrag_finan1: formatValue(addingData.extrag_finan1),
        extrag_finan2: formatValue(addingData.extrag_finan2),
        extrag_finan3: formatValue(addingData.extrag_finan3),
        extrag_finan_notas: addingData.extrag_finan_notas,

        costo_u_est: addingData.costo_u_est,
        costo_u_prov: addingData.costo_u_prov,
        costo_u: addingData.costo_u,
        updated: addingData.updated,
        htimestamp: addingData.htimestamp,
        detailorder: addingData.detailorder,
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
          ncm_id: addingData.ncm_id,
          ncm_code: addingData.ncm_code,
          // total: addingData.totalAmount,
          pcsctn: addingData.pcsctn,
          gwctn: addingData.gwctn,
          ncm_ack: true, //aplicar el RadioGroup,
          proovedores_name: addingData.proovedores_name
            ? addingData.proovedores_name
            : "Proveedor Provisorio",
          proveedores_id: addingData.proveedores_id,
          proveedor_prov: addingData.proveedor_prov,
          sku: addingData.sku,

          productowner: addingData.productowner,
          proforma_invoice: addingData.proforma_invoice,
          comercial_invoice: addingData.comercial_invoice,
          purchaseorder: addingData.purchaseorder,

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

          extrag_src1: addingData.extrag_src1,
          extrag_src2: addingData.extrag_src2,
          extrag_src_notas: addingData.extrag_src_notas,

          extrag_finan1: addingData.extrag_finan1,
          extrag_finan2: addingData.extrag_finan2,
          extrag_finan3: addingData.extrag_finan3,
          extrag_finan_notas: addingData.extrag_finan_notas,

          costo_u_est: addingData.costo_u_est,
          costo_u_prov: addingData.costo_u_prov,
          costo_u: addingData.costo_u,

          updated: addingData.updated,
          htimestamp: addingData.htimestamp,
          detailorder: addingData.detailorder,
          // Calculo: calculo,
        },
      ]);
      setAddItemClicked(false);
    }
    console.log(addingData);
  };

  useEffect(() => {
    if (dataHelp.presupuestoEditable) {
      setProductsData(dataHelp.presupuestoEditable.estDetails);
      setProductsDataAdd(dataHelp.presupuestoEditable.estDetAddData);
    }
  }, [dataHelp]);

  //ventana de productos lateral

  const [open2, setOpen2] = React.useState(false);
  const handleClickOpenDialog = () => {
    setOpen2(true);
  };
  const handleCloseDialog = () => {
    setOpen2(false);
  };

  const [ArrBool, setArrBool] = useState(Array(30).fill(false));
  const handleSwitchChangeInIndex = (newState, position) => {
    // console.log("Nuevo estado del interruptor en Index:", newState);
    // console.log("Posición en el array:", position); // Aquí puedes hacer lo que necesites con el nuevo estado del interruptor // Crear una copia del array para evitar modificar el estado directamente
    const updatedArrBool = [...ArrBool]; //crea copia del array // Actualizar el valor en el índice específico
    updatedArrBool[position] = newState; // Actualizar el estado con el nuevo array
    setArrBool(updatedArrBool);
  };

  const [gastoLocal, setGastoLocal] = useState({});

  const CalculoDespachanteMex = (cif_grand_total) => {
    return (
      cif_grand_total * gastoLocal?.gloc_despachante_var +
      gastoLocal?.gloc_despachante_fijo +
      gastoLocal?.gloc_despachante_otro1 +
      gastoLocal?.gloc_despachante_otro2
    );
  };

  function actualizaResaltar(id, valor) {
    const resaltaCambiosTmp = resaltaCambios;
    resaltaCambios[ExtraCostosLocal.findIndex((el) => el.id == id)] = valor;
    setResaltaCambios(resaltaCambiosTmp);
  }

  const tarifonDataFetch = async (id) => {
    const tarifonData = await TarifonMexHelper.readDataByCargaId(id);
    setGastoLocal(tarifonData);
  };

  useEffect(() => {
    tarifonDataFetch(formik?.values?.carga_id?.id);
  }, [formik?.values?.carga_id]);

  useEffect(() => {
    formik.setFieldValue(
      "freight_insurance_cost",
      dataHelp.presupuestoEditable?.estHeader?.freight_insurance_cost
    );
  }, [gastoLocal]);
  // console.log(gastoLocal);

  useEffect(() => {
    // El valor que viene del Tarifon es el mismo que viene desde el JSON ?
    if (
      gastoLocal?.gloc_fwd?.toFixed(2) ===
      dataHelp?.presupuestoEditable?.estHeader?.gloc_fwd?.toFixed(2)
    ) {
      // console.log("EQ");
      formik.setFieldValue("gloc_fwd", gastoLocal?.gloc_fwd?.toFixed(2));
      //setAlerta(false,0);
      actualizaResaltar("gloc_fwd", false);
    } else {
      // console.log("NOTEQ");
      formik.setFieldValue(
        "gloc_fwd",
        dataHelp?.presupuestoEditable?.estHeader?.gloc_fwd?.toFixed(2)
      );
      actualizaResaltar("gloc_fwd", true);
    }

    if (
      gastoLocal?.flete_interno?.toFixed(2) ===
      dataHelp?.presupuestoEditable?.estHeader?.gloc_flete?.toFixed(2)
    ) {
      //console.log("EQ");
      formik.setFieldValue("gloc_flete", gastoLocal?.flete_interno?.toFixed(2));
      //setAlerta(false,1);
      actualizaResaltar("gloc_flete", false);
    } else {
      //console.log("NOTEQ");
      formik.setFieldValue(
        "gloc_flete",
        dataHelp?.presupuestoEditable?.estHeader?.gloc_flete?.toFixed(2)
      );
      //setAlerta(false,1);
      actualizaResaltar("gloc_flete", true);
    }

    if (
      gastoLocal?.gasto_descarga_depo?.toFixed(2) ===
      dataHelp?.presupuestoEditable?.estHeader?.gloc_descarga?.toFixed(2)
    ) {
      //console.log("EQ");
      formik.setFieldValue(
        "gloc_descarga",
        gastoLocal?.gasto_descarga_depo?.toFixed(2)
      );
      //setAlerta(false,2);
      actualizaResaltar("gloc_descarga", false);
    } else {
      //console.log("NOTEQ");
      formik.setFieldValue(
        "gloc_descarga",
        dataHelp?.presupuestoEditable?.estHeader?.gloc_descarga?.toFixed(2)
      );
      //set (true,2);
      actualizaResaltar("gloc_descarga", true);
    }

    if (
      gastoLocal?.gasto_terminal?.toFixed(2) ===
      dataHelp?.presupuestoEditable?.estHeader?.gloc_terminales?.toFixed(2)
    ) {
      //console.log("EQ");
      formik.setFieldValue(
        "gloc_terminales",
        gastoLocal?.gasto_terminal?.toFixed(2)
      );
      //setAlerta(false,3);
      actualizaResaltar("gloc_terminales", false);
    } else {
      //console.log("NOTEQ");
      formik.setFieldValue(
        "gloc_terminales",
        dataHelp?.presupuestoEditable?.estHeader?.gloc_terminales?.toFixed(2)
      );
      //setAlerta(true,3);
      actualizaResaltar("gloc_terminales", true);
    }

    //formik.setFieldValue("gloc_fwd", gastoLocal?.gloc_fwd);
    //formik.setFieldValue("gloc_flete", gastoLocal?.flete_interno);
    //formik.setFieldValue("gloc_descarga", gastoLocal?.gasto_descarga_depo);
    //formik.setFieldValue("gloc_terminales", gastoLocal?.gasto_terminal);
    formik.setFieldValue(
      "gloc_despachantes",
      CalculoDespachanteMex(formik?.values?.cif_grand_total)
    );
    formik.setFieldValue("freight_cost", gastoLocal?.freight_charge);
    // formik.setFieldValue("freight_insurance_cost", gastoLocal?.insurance_charge * formik?.values?.cif_grand_total );
    // console.log(ExtraCostosLocal);
    //console.log(formik.values);
  }, [gastoLocal, productsData, dataHelp?.presupuestoEditable]);

  function handleTextClick() {
    const inputElement = document.getElementById("carga_id");
    if (inputElement) {
      inputElement.focus();
    }
  }

  const [fobGrandTotal, setFobGrandTotal] = useState(0);
  useEffect(() => {
    if (productsData.length > 0) {
      const fobGrandTotal = productsData.reduce((accumulator, currentValue) => {
        setFobGrandTotal(accumulator + currentValue.fob_u * currentValue.qty);
        return accumulator + currentValue.fob_u * currentValue.qty;
      }, 0);
      formik.setFieldValue(
        "freight_insurance_cost",
        (gastoLocal?.insurance_charge / 100) * fobGrandTotal
      );
      // console.log(fobGrandTotal);
      // console.log(productsData);
    }
  }, [productsData]);

  const StyledTypography = styled(Typography)(({ theme }) => ({
    "&:hover": {
      color: "green",
      cursor: "pointer",
    },
  }));

  const [showCostosLocal, setShowCostosLocal] = useState(true);
  const [showCostosSourcing, setShowCostosSourcing] = useState(false);
  const [showCostosComex, setShowCostosComex] = useState(false);
  const [showCostosFinan, setShowCostosFinan] = useState(false);
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

  // Logica de gastos locales para habilitar o deshabilitar campos
  const [checkedSourcing, setCheckedSourcing] = React.useState(false);
  const [checkedComex, setCheckedComex] = React.useState(false);
  const [checkedFinan, setCheckedFinan] = React.useState(false);
  // si la bandera esta en 1 no puede editar los extraGastos
  const [banderaCheck, setBanderaCheck] = React.useState(0);
  const [tooltipGastosLocales, setTooltipGastosLocales] = React.useState(
    "Habilitar/deshabilitar"
  );

  const handleChangeSourcing = (event) => {
    if (banderaCheck === 0) {
      setCheckedSourcing(event.target.checked);
      setBanderaCheck(1);
      setTooltipGastosLocales("Ya no puede modificar tarifa de otro sector");
    } else {
      console.log("no puede modificar");
    }
  };
  const handleChangeComex = (event) => {
    if (banderaCheck === 0) {
      setCheckedComex(event.target.checked);
      setBanderaCheck(1);
      setTooltipGastosLocales("Ya no puede modificar tarifa de otro sector");
    } else {
      console.log("no puede modificar");
    }
  };
  const handleChangeFinan = (event) => {
    if (banderaCheck === 0) {
      setCheckedFinan(event.target.checked);
      setBanderaCheck(1);
      setTooltipGastosLocales("Ya no puede modificar tarifa de otro sector");
    } else {
      console.log("no puede modificar");
    }
  };

  return (
    <>
      <MainCard
        // title={`Crear Presupuesto de Mexico : #00${ formik?.values?.estnumber }/00${ formik?.values?.estvers } Fecha: ${UtilidadesHelper.fechaParaVistaHoy()}`}
        title={`Actualizar Presupuesto de Mexico:`}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            position: "relative", // Posición relativa  PARA COLOCAR EL BOTON A LA ALTURA DEL MAINCARD
            top: "-55px", // Posición desde la parte superior del contenedor
            right: "10px", // Posición desde la derecha del contenedor
            margin: "-25px",
          }}
        >
          <AnimateButton>
            <Button
              variant="contained"
              onClick={() => navigate("/estimateMex/estimate-list")}
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

              {/* CABECERA DE PRESUPUESTADOR */}

              {/* STATUS */}
              <Grid
                item
                xs={12}
                md={11}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  flexWrap: "wrap", // para que se envuelva en caso de que no haya espacio suficiente
                  position: "relative", // Posición relativa  PARA COLOCAR EL BOTON A LA ALTURA DEL MAINCARD
                  top: "-110px", // Posición desde la parte superior del contenedor
                  //right: "10px", // Posición desde la derecha del contenedor
                  marginBottom: "-100px",
                }}
              >
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
                <Chip
                  label={` ${
                    formik.values.status == 0
                      ? "CEO"
                      : formik.values.status == 1
                      ? "Estado 1: Sourcing"
                      : formik.values.status == 2
                      ? "Estado 2: Comex"
                      : "Estado 3: Financiero"
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
                  </>
                )}
              </Grid>

              {/* FECHA DE FACTURACION */}
              <Grid item xs={12} md={1.6} align="left">
                <Stack>
                  <InputLabel required>Fecha de Emisión</InputLabel>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      inputFormat="dd/MM/yyyy"
                      renderInput={(props) => (
                        <TextField fullWidth {...props} />
                      )}
                      value={valueBasic}
                      disabled
                      onChange={(newValue) => {
                        setValueBasic(newValue);
                      }}
                    />
                  </LocalizationProvider>
                </Stack>
              </Grid>

              {/* NUM DE ESTIMADO */}
              <Grid item xs={12} md={0.8}>
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

              {/* SELECT PAIS ORIGEN CABECERA */}
              {cabeceraPaisOrigen.map((field) => (
                <CustomSelect
                  key={field.id}
                  {...field}
                  formik={formik}
                  XS={12}
                  MD={1.2}
                  desactivado={true}
                  ValorPorDefecto={"CHINA"}
                  tooltip={"CHINA"}
                />
              ))}

              {/* CABECERA PAIS */}
              {cabeceraPais.map((field) => (
                <CustomSelect
                  key={field.id}
                  {...field}
                  formik={formik}
                  XS={12}
                  MD={1.2}
                  desactivado={true}
                  ValorPorDefecto={"MEXICO"}
                  tooltip={"MEXICO"}
                />
              ))}

              {/* Seleccion pais*/}
              <Grid item xs={12} md={1.5} align="left">
                <Stack>
                  <InputLabel>Region</InputLabel>
                  <Tooltip title="GUADALAJARA">
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
                      defaultValue="GUADALAJARA"
                    />
                  </Tooltip>
                </Stack>
              </Grid>

              {/* SELECT CARGA CABECERA */}
              {cabeceraCarga.map((field) => (
                <CustomSelectUpdate
                  key={field.id}
                  {...field}
                  formik={formik}
                  XS={12}
                  MD={1.2}
                  tooltip={"Seleccione Carga"}
                  deshabilitar={true}
                />
              ))}

              {/* PRJ CABECERA */}
              {cabeceraPRJ.map((field) => (
                <CustomSelect
                  key={field.id}
                  {...field}
                  formik={formik}
                  XS={12}
                  MD={1.5}
                />
              ))}

              {/* NOTA CABECERA Descipcion */}
              {cabeceraNota.map((field) => (
                <CustomSelect
                  key={field.id}
                  {...field}
                  formik={formik}
                  XS={12}
                  MD={3}
                />
              ))}

              {/* NOTA CABECERA Embarque */}
              {/* {cabeceraEmbarque.map((field) => (
                    <CustomSelect
                      key={field.id}
                      {...field}
                      formik={formik}
                      XS={12}
                      MD={1.5}
                    />
                  ))} */}

              {/* ESPACIO DE RELLENO */}
              <Grid item md={0}></Grid>

              {/* RADIO DE MONEDA LOCAL */}
              {/* <Grid item xs={12} md={1.7} align="right">
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
              </Grid> */}

              {/* RADIO DEL IVA */}
              {/* <Grid item xs={12} md={1.7} align="right">
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
              </Grid> */}

              {/* TIPO DE CAMBIO */}
              {/* <Grid item xs={12} md={1} align="right">
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
              </Grid> */}

              {/* DETALLE DE PRESUPUESTADOR */}
              {/* <Grid item xs={12}>
                <Divider />
              </Grid> */}

              {/* ESPACIO DE RELLENO */}
              {/* <Grid item md={6}></Grid> */}

              {/* NUM DE VERSION */}
              {/* <Grid item xs={12} md={2}>
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
              </Grid> */}

              {/* ESPACIO DE RELLENO */}
              {/* <Grid item md={0}></Grid> */}

              {/* DETALLE DE PRESUPUESTADOR */}
              {/* <Grid item xs={12}>
                <Divider />
              </Grid> */}

              {formik.values.carga_id != null ? (
                <>
                  {/* SOURCING */}
                  <Box
                    sx={{
                      borderRadius: "15px", // Esto hará que los bordes sean redondeados
                      border: "5px solid red", // Esto aplica un borde rojo de 2px
                      // padding: "30px", // Espacio interior alrededor de tus elementos, ajusta según necesidad
                      paddingTop: 3,
                      paddingBottom: 2,
                      paddingLeft: 8,
                      paddingRight: 1,
                      marginBottom: "20px", // Espacio exterior debajo del contenedor, ajusta según necesidad
                      marginTop: -1,
                    }}
                  >
                    <Grid
                      container
                      direction="row" // hace que los hijos estén en fila (horizontal)
                      spacing={2} // puedes usar "spacing" para controlar el espacio entre los elementos
                      alignItems="center" // alinea verticalmente los ítems en el centro
                    >
                      <Grid
                        item
                        xs={12}
                        style={{ position: "relative", marginTop: -20 }}
                      >
                        {/* <Divider /> */}
                        <Typography
                          // color={"green"}
                          variant="h5"
                          style={{
                            // margin: "8px",
                            position: "absolute",
                            transform: "rotate(-90deg)",
                            transformOrigin: "left bottom",
                            whiteSpace: "nowrap",
                            bottom: -100, // Ajusta según sea necesario
                            left: 10, // Ajusta según sea necesario
                          }}
                        >
                          Gastos Locales
                        </Typography>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        style={{ position: "relative", marginTop: -20 }}
                      >
                        {/* <Divider /> */}
                        <Typography
                          // color={"green"}
                          variant="h5"
                          style={{
                            // margin: "8px",
                            position: "absolute",
                            transform: "rotate(-90deg)",
                            transformOrigin: "left bottom",
                            whiteSpace: "nowrap",
                            bottom: -180, // Ajusta según sea necesario
                            left: 10, // Ajusta según sea necesario
                          }}
                        >
                          Extra
                        </Typography>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        style={{ position: "relative", marginTop: -20 }}
                      >
                        {/* <Divider /> */}
                        <Typography
                          // color={"green"}
                          variant="h4"
                          style={{
                            // margin: "8px",
                            position: "absolute",
                            transform: "rotate(-90deg)",
                            transformOrigin: "left bottom",
                            whiteSpace: "nowrap",
                            bottom: -140, // Ajusta según sea necesario
                            left: -20, // Ajusta según sea necesario
                          }}
                        >
                          Sourcing
                        </Typography>
                        <Tooltip title={tooltipGastosLocales}>
                          <Checkbox
                            style={{
                              // margin: "8px",
                              position: "absolute",
                              // transform: "rotate(-90deg)",
                              transformOrigin: "left bottom",
                              whiteSpace: "nowrap",
                              bottom: -40, // Ajusta según sea necesario
                              left: -50, // Ajusta según sea necesario
                            }}
                            checked={checkedSourcing}
                            onChange={handleChangeSourcing}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        </Tooltip>
                      </Grid>

                      {ExtraCostosLocal.map((input, index) => (
                        <ExtraCostoDobleClickUpdate
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
                            handleSwitchChangeInIndex(
                              newState,
                              input.arrPosition
                            )
                          }
                          handleSwitchChangeInIndex={handleSwitchChangeInIndex}
                          ValorSwitch={input.ValorSwitch}
                          ValorSwitchBase={input.ValorSwitchBase}
                          arrPosition={input.arrPosition}
                          resaltar={resaltaCambios[index]}
                          gastoLocal={gastoLocal}
                          nameGastoLocalTarifon={input.nameGastoLocalTarifon}
                          fobGrandTotal={fobGrandTotal}
                          deshabilitar={!checkedSourcing} // habilita o desabilita campos
                        />
                      ))}

                      {/* DETALLE DE COSTOS Sourcing */}
                      {dataHelp.presupuestoEditable &&
                        ExtraCostosSourcing.map((input) => (
                          <ExtraCostoDobleClick
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
                              handleSwitchChangeInIndex(
                                newState,
                                input.arrPosition
                              )
                            }
                            handleSwitchChangeInIndex={
                              handleSwitchChangeInIndex
                            }
                            ValorSwitch={input.ValorSwitch}
                            ValorSwitchBase={input.ValorSwitchBase}
                            arrPosition={input.arrPosition}
                            deshabilitar={!checkedSourcing} // habilita o desabilita campos
                          />
                        ))}
                    </Grid>
                  </Box>

                  {/* COMEX */}
                  <Box
                    sx={{
                      borderRadius: "15px", // Esto hará que los bordes sean redondeados
                      border: "5px solid yellow", // Esto aplica un borde rojo de 2px
                      // padding: "30px", // Espacio interior alrededor de tus elementos, ajusta según necesidad
                      paddingTop: 3,
                      paddingBottom: 2,
                      paddingLeft: 8,
                      paddingRight: 1,
                      marginBottom: "20px", // Espacio exterior debajo del contenedor, ajusta según necesidad
                      marginTop: -1,
                    }}
                  >
                    <Grid
                      container
                      direction="row" // hace que los hijos estén en fila (horizontal)
                      spacing={2} // puedes usar "spacing" para controlar el espacio entre los elementos
                      alignItems="center" // alinea verticalmente los ítems en el centro
                    >
                      <Grid
                        item
                        xs={12}
                        style={{ position: "relative", marginTop: -20 }}
                      >
                        {/* <Divider /> */}
                        <Typography
                          // color={"green"}
                          variant="h5"
                          style={{
                            // margin: "8px",
                            position: "absolute",
                            transform: "rotate(-90deg)",
                            transformOrigin: "left bottom",
                            whiteSpace: "nowrap",
                            bottom: -100, // Ajusta según sea necesario
                            left: 10, // Ajusta según sea necesario
                          }}
                        >
                          Gastos Locales
                        </Typography>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        style={{ position: "relative", marginTop: -20 }}
                      >
                        {/* <Divider /> */}
                        <Typography
                          // color={"green"}
                          variant="h5"
                          style={{
                            // margin: "8px",
                            position: "absolute",
                            transform: "rotate(-90deg)",
                            transformOrigin: "left bottom",
                            whiteSpace: "nowrap",
                            bottom: -180, // Ajusta según sea necesario
                            left: 10, // Ajusta según sea necesario
                          }}
                        >
                          Extra
                        </Typography>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        style={{ position: "relative", marginTop: -20 }}
                      >
                        {/* <Divider /> */}
                        <Typography
                          // color={"green"}
                          variant="h4"
                          style={{
                            // margin: "8px",
                            position: "absolute",
                            transform: "rotate(-90deg)",
                            transformOrigin: "left bottom",
                            whiteSpace: "nowrap",
                            bottom: -140, // Ajusta según sea necesario
                            left: -20, // Ajusta según sea necesario
                          }}
                        >
                          Comex
                        </Typography>
                        <Tooltip title={tooltipGastosLocales}>
                          <Checkbox
                            style={{
                              // margin: "8px",
                              position: "absolute",
                              // transform: "rotate(-90deg)",
                              transformOrigin: "left bottom",
                              whiteSpace: "nowrap",
                              bottom: -40, // Ajusta según sea necesario
                              left: -50, // Ajusta según sea necesario
                            }}
                            checked={checkedComex}
                            onChange={handleChangeComex}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        </Tooltip>
                      </Grid>

                      {ExtraCostosLocal.map((input, index) => (
                        <ExtraCostoDobleClickUpdate
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
                            handleSwitchChangeInIndex(
                              newState,
                              input.arrPosition
                            )
                          }
                          handleSwitchChangeInIndex={handleSwitchChangeInIndex}
                          ValorSwitch={input.ValorSwitch}
                          ValorSwitchBase={input.ValorSwitchBase}
                          arrPosition={input.arrPosition}
                          resaltar={resaltaCambios[index]}
                          gastoLocal={gastoLocal}
                          nameGastoLocalTarifon={input.nameGastoLocalTarifon}
                          fobGrandTotal={fobGrandTotal}
                          deshabilitar={!checkedComex} // habilita o desabilita campos
                        />
                      ))}

                      {/* FECHA DE embarque */}
                      <Grid item xs={12} md={1.7} align="left">
                        <Stack>
                          <InputLabel required>Fecha Embarque</InputLabel>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              inputFormat="dd/MM/yyyy"
                              renderInput={(props) => (
                                <TextField fullWidth {...props} />
                              )}
                              value={valueBasic}
                              id="fecha_embarque"
                              name="fecha_embarque"
                              onChange={(newValue) => {
                                setValueBasic(newValue);
                              }}
                              disabled={!checkedComex} // habilita o desabilita campos
                            />
                          </LocalizationProvider>
                        </Stack>
                      </Grid>

                      {/* DETALLE DE COSTOS Comex */}
                      {dataHelp.presupuestoEditable &&
                        ExtraCostosComex.map((input) => (
                          <ExtraCostoDobleClick
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
                              handleSwitchChangeInIndex(
                                newState,
                                input.arrPosition
                              )
                            }
                            handleSwitchChangeInIndex={
                              handleSwitchChangeInIndex
                            }
                            ValorSwitch={input.ValorSwitch}
                            ValorSwitchBase={input.ValorSwitchBase}
                            arrPosition={input.arrPosition}
                            deshabilitar={!checkedComex} // habilita o desabilita campos
                          />
                        ))}
                    </Grid>
                  </Box>

                  {/* FINAN */}
                  <Box
                    sx={{
                      borderRadius: "15px", // Esto hará que los bordes sean redondeados
                      border: "5px solid blue", // Esto aplica un borde rojo de 2px
                      // padding: "30px", // Espacio interior alrededor de tus elementos, ajusta según necesidad
                      paddingTop: 3,
                      paddingBottom: 2,
                      paddingLeft: 8,
                      paddingRight: 1,
                      marginBottom: "20px", // Espacio exterior debajo del contenedor, ajusta según necesidad
                      marginTop: -1,
                      marginBottom: -2,
                    }}
                  >
                    <Grid
                      container
                      direction="row" // hace que los hijos estén en fila (horizontal)
                      spacing={2} // puedes usar "spacing" para controlar el espacio entre los elementos
                      alignItems="center" // alinea verticalmente los ítems en el centro
                    >
                      <Grid
                        item
                        xs={12}
                        style={{ position: "relative", marginTop: -20 }}
                      >
                        {/* <Divider /> */}
                        <Typography
                          // color={"green"}
                          variant="h5"
                          style={{
                            // margin: "8px",
                            position: "absolute",
                            transform: "rotate(-90deg)",
                            transformOrigin: "left bottom",
                            whiteSpace: "nowrap",
                            bottom: -100, // Ajusta según sea necesario
                            left: 10, // Ajusta según sea necesario
                          }}
                        >
                          Gastos Locales
                        </Typography>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        style={{ position: "relative", marginTop: -20 }}
                      >
                        {/* <Divider /> */}
                        <Typography
                          // color={"green"}
                          variant="h5"
                          style={{
                            // margin: "8px",
                            position: "absolute",
                            transform: "rotate(-90deg)",
                            transformOrigin: "left bottom",
                            whiteSpace: "nowrap",
                            bottom: -180, // Ajusta según sea necesario
                            left: 10, // Ajusta según sea necesario
                          }}
                        >
                          Extra
                        </Typography>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        style={{ position: "relative", marginTop: -20 }}
                      >
                        {/* <Divider /> */}
                        <Typography
                          // color={"green"}
                          variant="h4"
                          style={{
                            // margin: "8px",
                            position: "absolute",
                            transform: "rotate(-90deg)",
                            transformOrigin: "left bottom",
                            whiteSpace: "nowrap",
                            bottom: -130, // Ajusta según sea necesario
                            left: -20, // Ajusta según sea necesario
                          }}
                        >
                          Finan
                        </Typography>
                        <Tooltip title={tooltipGastosLocales}>
                          <Checkbox
                            style={{
                              // margin: "8px",
                              position: "absolute",
                              // transform: "rotate(-90deg)",
                              transformOrigin: "left bottom",
                              whiteSpace: "nowrap",
                              bottom: -40, // Ajusta según sea necesario
                              left: -50, // Ajusta según sea necesario
                            }}
                            checked={checkedFinan}
                            onChange={handleChangeFinan}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        </Tooltip>
                      </Grid>

                      {ExtraCostosLocal.map((input, index) => (
                        <ExtraCostoDobleClickUpdate
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
                            handleSwitchChangeInIndex(
                              newState,
                              input.arrPosition
                            )
                          }
                          handleSwitchChangeInIndex={handleSwitchChangeInIndex}
                          ValorSwitch={input.ValorSwitch}
                          ValorSwitchBase={input.ValorSwitchBase}
                          arrPosition={input.arrPosition}
                          resaltar={resaltaCambios[index]}
                          gastoLocal={gastoLocal}
                          nameGastoLocalTarifon={input.nameGastoLocalTarifon}
                          fobGrandTotal={fobGrandTotal}
                          deshabilitar={!checkedFinan} // habilita o desabilita campos
                        />
                      ))}

                      {/* FECHA DE pedimento */}
                      <Grid item xs={12} md={1.5} align="left">
                        <Stack>
                          <InputLabel required>Fecha Pedimento</InputLabel>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              inputFormat="dd/MM/yyyy"
                              renderInput={(props) => (
                                <TextField fullWidth {...props} />
                              )}
                              value={valueBasic}
                              id="fecha_pedimiento"
                              name="fecha_pedimiento"
                              onChange={(newValue) => {
                                setValueBasic(newValue);
                              }}
                              disabled={!checkedFinan} // habilita o desabilita campos
                            />
                          </LocalizationProvider>
                        </Stack>
                      </Grid>

                      {/* DETALLE DE COSTOS Finan */}
                      {dataHelp.presupuestoEditable &&
                        ExtraCostosFinanciero.map((input) => (
                          <ExtraCostoDobleClick
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
                              handleSwitchChangeInIndex(
                                newState,
                                input.arrPosition
                              )
                            }
                            handleSwitchChangeInIndex={
                              handleSwitchChangeInIndex
                            }
                            ValorSwitch={input.ValorSwitch}
                            ValorSwitchBase={input.ValorSwitchBase}
                            arrPosition={input.arrPosition}
                            deshabilitar={!checkedFinan} // habilita o desabilita campos
                          />
                        ))}
                    </Grid>
                  </Box>
                </>
              ) : (
                <>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    // height="5vh"
                    width="100vw"
                  >
                    <StyledTypography
                      color={"red"}
                      variant="h2"
                      style={{ margin: "15px" }}
                      onClick={handleTextClick}
                    >
                      Seleccione una carga
                    </StyledTypography>
                  </Box>
                </>
              )}

              {/* DETALLE DE COSTOS Sourcing */}
              {/* {!(formik.values.status == 2 || formik.values.status == 3) && (
                <>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>

                  <Grid item xs={12}>
                    {showCostosSourcing ? (
                      <>
                        <Box display="flex" alignItems="center">
                          <Tooltip title="Ocultar Gastos">
                            <VisibilityOffOutlinedIcon
                              variant="text"
                              onClick={() =>
                                setShowCostosSourcing(!showCostosSourcing)
                              }
                            />
                          </Tooltip>
                          <Grid item xs={12}>
                            {/* <Divider /> 
                            <Typography
                              // color={"green"}
                              variant="h3"
                              style={{ margin: "8px" }}
                            >
                              Extra Gastos Sourcing
                            </Typography>
                          </Grid>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Box display="flex" alignItems="center">
                          <Tooltip title="Mostrar Gastos">
                            <VisibilityOutlinedIcon
                              variant="text"
                              onClick={() =>
                                setShowCostosSourcing(!showCostosSourcing)
                              }
                            />
                          </Tooltip>
                          <Typography
                            // color={"green"}
                            variant="h4"
                            style={{ marginLeft: "8px" }}
                          >
                            Extra Gastos Sourcing
                          </Typography>
                        </Box>
                      </>
                    )}
                  </Grid>

                  {dataHelp.presupuestoEditable &&
                    showCostosSourcing &&
                    ExtraCostosSourcing.map((input) => (
                      <ExtraCostoDobleClick
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
                </>
              )} */}

              {/* DETALLE DE COSTOS COMEX */}
              {/* {!(formik.values.status == 1 || formik.values.status == 3) && (
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
                          <Grid item xs={12}>
                             <Divider /> 
                            <Typography
                              // color={"green"}
                              variant="h3"
                              style={{ margin: "8px" }}
                            >
                              Extra Gastos Comex
                            </Typography>
                          </Grid>
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
                            // color={"green"}
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
                      <ExtraCostoDobleClick
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
                </>
              )} */}

              {/* DETALLE DE COSTOS Financiero */}
              {/* {!(formik.values.status == 1 || formik.values.status == 2) && (
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
                          <Grid item xs={12}>
                             <Divider /> 
                            <Typography
                              // color={"green"}
                              variant="h3"
                              style={{ margin: "8px" }}
                            >
                              Extra Gastos Financiero
                            </Typography>
                          </Grid>
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
                            // color={"green"}
                            variant="h4"
                            style={{ marginLeft: "8px" }}
                          >
                            Extra Gastos Financiero
                          </Typography>
                        </Box>
                      </>
                    )}
                  </Grid>

                  {dataHelp.presupuestoEditable &&
                    showCostosFinan &&
                    ExtraCostosFinanciero.map((input) => (
                      <ExtraCostoDobleClick
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
                </>
              )} */}

              {/* CARGA DE PRODUCTOS */}
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <ProductsPage
                productsData={productsData}
                productsDataAdd={productsDataAdd}
                deleteProductHandler={deleteProductHandler}
                editProductHandler={editProductHandler}
                freightCost={gastoLocal?.freight_charge}
                insurancePorct={gastoLocal?.insurance_charge}
                //formik.setFieldValue("freight_cost", gastoLocal?.freight_charge);
                // formik.setFieldValue("freight_insurance_cost", gastoLocal?.insurance_charge * formik?.values?.cif_grand_total );
              />
              {open2 ? (
                <Grid item xs={12}>
                  {/* <AddItemPage
                    handleAddItem={handleAddItem}
                    setAddItemClicked={setAddItemClicked}
                    dataHelp={dataHelp}
                    formik={formik}
                  /> */}
                  <AddDetailsPage
                    handleAddItem={handleAddItem}
                    open={open2}
                    handleCloseDialog={handleCloseDialog}
                    dataHelp={dataHelp}
                    formik={formik}
                  />
                </Grid>
              ) : formik.values.carga_id != null ? (
                <>
                  <Grid item>
                    <Button
                      variant="text"
                      // onClick={() => setAddItemClicked(true)}
                      onClick={handleClickOpenDialog}
                    >
                      + Agregar Producto
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                </>
              ) : (
                ""
              )}

              {openUpdate ? (
                <>
                  <UpdateItemPage
                    handleAddItem={handleAddItem}
                    open={openUpdate}
                    handleCloseDialog={handleCloseUpdateDialog}
                    dataHelp={dataHelp}
                    rowUpdate={rowUpdate}
                    formik={formik}
                    ProductsDisbyte={dataHelp?.ProductosDisbyte}
                  />
                </>
              ) : (
                ""
              )}

              {/* PESAJE CONTENEDORES */}
              {ocultar ? (
                ""
              ) : (
                <PesajeContenedor
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
