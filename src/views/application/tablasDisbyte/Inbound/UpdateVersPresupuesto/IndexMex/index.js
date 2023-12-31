import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// LISTED 16_11_2023 13_02

// material-ui
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  Grid,
  Stack,
  TextField,
  Tooltip,
  Typography,
  styled,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import "@mui/lab";
import { useTheme } from "@mui/material/styles";
import AnimateButton from "ui-component/extended/AnimateButton";
// Importa CircularProgress de Material UI
import { CircularProgress } from "@material-ui/core";

// project imports
import { gridSpacing } from "store/constant";
import InputLabel from "ui-component/extended/Form/InputLabel";
import MainCard from "ui-component/cards/MainCard";

// third-party
import * as yup from "yup";
import ProductsPage from "../../../../../Components/DetailsProduct/UpdateDetailsListado";
import { useFormik } from "formik";
import useAuth from "hooks/useAuth";
// Se importan helpers necesarios:
import { CargaHelper } from "helpers/CargaHelper";
import { ProveedoresOemHelper } from "helpers/ProveedoresOemHelper";
import { NcmHelper } from "helpers/NcmHelper";
import { PresupuestoHelper } from "helpers/PresupuestoHelper";

//importacion para poder opacar el placeholder del dolar
import { makeStyles } from "@material-ui/core/styles";
import { UtilidadesHelper } from "helpers/UtilidadesHelper";
import { TarifonMexHelper } from "helpers/TarifonMexHelper";
import { Box } from "@mui/system";
import { ExtraCostoDobleClick } from "../../UpdateVersPresupuesto/ExtraCostoDobleClick";
import { PesajeContenedor } from "../../../../../Components/Contenedores/PesajeContenedor";
import { CustomSelect } from "../../../../../Components/Formularios/CustomSelect";
import AddDetailsPage from "../../../../../Components/DetailsProduct/AddDetailsSimuladorMex";
import { CustomSelectUpdate } from "../../../../../Components/Formularios/TextFieldOrSelectDeFormUpdate";
import UpdateItemPage from "../../../../../Components/DetailsProduct/UpdateDetailsSimuladorMex";
import { ProductosHelper } from "helpers/ProductosHelper";
import { useAccessTokenJWT } from "helpers/useAccessTokenJWT";
import { ExtraCostoDobleClickUpdate } from "../ExtraCostoDobleClickUpdate";
import { contenedorHelper } from "helpers/contenedorHelper";
import { gastosLocMexHelper } from "helpers/gastosLocMexHelper";
import { StatusEstadosEmbarque } from "helpers/VariablesDeRepeticion";

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
  description: yup.string().nullable().required("La descripcion is required"),
  bl: yup.string().nullable().required("Bl is required"),

  carga_id: yup
    .object()
    .shape({
      description: yup.string(),
    })
    .nullable()
    .required("Carga is required"),

});

const alarmaContenedores=(prodData,miFormik)=>
{
  if(miFormik?.values?.limite_carga?.id!=undefined)
  {
      if(((contenedorHelper.calculaNumeroContenedores(prodData,miFormik?.values.carga_id).cantContEnt-miFormik?.values?.limite_carga?.id)>0.01) & (miFormik?.values?.limite_carga?.id>0))
      {
        return true;
      }
  }
  return false;
}

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
    //const NCM = await NcmHelper.fetchData();
    const NCM_Mex = await NcmHelper.fetchDataMex();
    //const presupuesto = await PresupuestoHelper.fetchData();
    const presupuestoEditable = await PresupuestoHelper.readDataEstVers(
      estnumber,
      vers,
      ""
    );
    const owners = await PresupuestoHelper.fetchOwnersList();
    //const presupuesto = presupuestoEditable ? presupuestoEditable:null;

    const proximoEstDisponible =
      await PresupuestoHelper.EstimateDisponibleNum();
    // const tipoCambio = await UtilidadesHelper.tipoCambioGeneral();
    const Paises = 0; //await PaisRegionHelper.fetchData();
    const ProductosDisbyte = await ProductosHelper.fetchData();


    const carga = await UtilidadesHelper.ordenadorDeArrayByDescription(
      ordenArrCarga,
      cargaAOrdenar
    );

    const objData = {
      carga,
      proveedoresOem,
      //NCM,
      NCM_Mex,
      //presupuesto,
      presupuestoEditable,
      owners,
      proximoEstDisponible,
      // tipoCambio,
      Paises,
      ProductosDisbyte,


    };
    setDataHelp(objData);
    setLoading(false); // Mueve esta línea aquí para establecer loading en false después de que las llamadas a la API se resuelvan
    setDataHelp(objData);
  };

  const [producto, setProductos] = useState();
  useState(() => {
    if (dataHelp.ProductosDisbyte) {
      const opciones = dataHelp?.ProductosDisbyte.map((product) => ({
        title: product.name,
        ...product,
      }));
    }
  }, [dataHelp.ProductosDisbyte]);
 // console.log('DATA HELP :', dataHelp);


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
      selected_description: dataHelp?.presupuestoEditable?.carga_str,
      PaisRegionApply: false,
    },
  ];

  const limitesDeCarga = [
    {id:0, description: "Auto"},
    {id:1, description: "1"},
    {id:2, description: "2"},
    {id:3, description: "3"},
    {id:4, description: "4"},
    {id:5, description: "5"},
  ];

  const cabeceraLimiteCarga = [
    {
      id: "limite_carga",
      name: "limite_carga",
      em: "Cantidad",
      inputLabel: "Cantidad",
      data: limitesDeCarga,
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
      blockDeGastos: true,
      ValorSwitch: null,
      ValorSwitchBase: "Aguarde ...", //dataHelp?.presupuestoEditable?.estHeader?.tarifupdate,
      arrPosition: 4,
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
      blockDeGastos: true,
      ValorSwitch: null,
      ValorSwitchBase: 0, //dataHelp?.presupuestoEditable?.estHeader?.tarifupdate,
      arrPosition: 7,
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
      blockDeGastos: true,
      ValorSwitch: null,
      ValorSwitchBase: 0, //dataHelp?.presupuestoEditable?.estHeader?.tarifupdate,
      arrPosition: 3,
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
      blockDeGastos: true,
      ValorSwitch: null,
      ValorSwitchBase: 0, //dataHelp?.presupuestoEditable?.estHeader?.tarifupdate,
      arrPosition: 3,
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
      blockDeGastos: true,
      ValorSwitch: null,
      ValorSwitchBase: dataHelp?.presupuestoEditable?.estHeader?.tarifupdate,
      arrPosition: 2,
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
      blockDeGastos: true,
      ValorSwitch: null,
      ValorSwitchBase: 0, //dataHelp?.presupuestoEditable?.estHeader?.tarifupdate,
      arrPosition: 8,
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
      Xs_Xd: [12, 1.8],
      blockDeGastos: true,
      ValorSwitch: null,
      ValorSwitchBase: dataHelp?.presupuestoEditable?.estHeader?.tarifupdate,
      arrPosition: 9,
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
      blockDeGastos: true,
      ValorSwitch: null,
      ValorSwitchBase: dataHelp?.presupuestoEditable?.estHeader?.extrag_src1,
      arrPosition: 4,
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
      blockDeGastos: true,
      ValorSwitch: null,
      ValorSwitchBase: dataHelp?.presupuestoEditable?.estHeader?.extrag_src2,
      arrPosition: 3,
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
      blockDeGastos: true,
      ValorSwitch: null,
      ValorSwitchBase:
        dataHelp?.presupuestoEditable?.estHeader?.extrag_src_notas,
      arrPosition: 3,
      resaltar: false,
    },
  ];

  const ExtraCostosComex = [
    {
      id: "extrag_comex1",
      name: "extrag_comex1",
      em: "Valor 1 [USD]",
      inputLabel: "Valor 1 [USD]",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_comex1,
      dataType: "number",
      Xs_Xd: [12, 2],
      blockDeGastos: true,
      ValorSwitch: null,
      ValorSwitchBase: dataHelp?.presupuestoEditable?.estHeader?.extrag_comex1,
      arrPosition: 4,
      resaltar: false,
    },
    {
      id: "extrag_comex2",
      name: "extrag_comex2",
      em: "Valor 2 [USD]",
      inputLabel: "Valor 2 [USD]",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_comex2,
      dataType: "number",
      Xs_Xd: [12, 2],
      blockDeGastos: true,
      ValorSwitch: null,
      ValorSwitchBase: dataHelp?.presupuestoEditable?.estHeader?.extrag_comex2,
      arrPosition: 3,
      resaltar: false,
    },
    {
      id: "extrag_comex3",
      name: "extrag_comex3",
      em: "Valor 3 [USD]",
      inputLabel: "Valor 3 [USD]",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_comex3,
      dataType: "number",
      Xs_Xd: [12, 2],
      blockDeGastos: true,
      ValorSwitch: null,
      ValorSwitchBase: dataHelp?.presupuestoEditable?.estHeader?.extrag_comex3,
      arrPosition: 3,
      resaltar: false,
    },
    {
      id: "extrag_comex_notas",
      name: "extrag_comex_notas",
      em: "Notas",
      inputLabel: "Notas",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_comex_notas,
      dataType: "string",
      Xs_Xd: [12, 6],
      blockDeGastos: true,
      ValorSwitch: null,
      ValorSwitchBase:
        dataHelp?.presupuestoEditable?.estHeader?.extrag_comex_notas,
      arrPosition: 3,
      resaltar: false,
    },
  ];


  const datosEmbarque = [
    {
      id: "status",
      name: "status",
      em: "Seleccione Estado",
      inputLabel: "Estado",
      data: StatusEstadosEmbarque,
    },
  ];

  const datosBl = [
    {
      id: "bl",
      name: "bl",
      em: "Ingrese Bl",
      inputLabel: "Bl",
      data: 'String',
    },
  ];

  const datosOc = [
    {
      id: "oc",
      name: "oc",
      em: "Ingrese Oc",
      inputLabel: "Oc",
      data: 'String',
    },
  ];

  const datosVesselCarrier = [
    {
      id: "carrier",
      name: "carrier",
      em: "Ingrese Vessel/Carriel",
      inputLabel: "Vessel/Carrier",
      data: 'String',
    },
  ];

  const ExtraCostosFinanciero = [
    {
      id: "extrag_finan1",
      name: "extrag_finan1",
      em: "Valor 1 [USD]",
      inputLabel: "Valor 1 [USD]",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_finan1,
      dataType: "number",
      Xs_Xd: [12, 1.8],
      blockDeGastos: true,
      ValorSwitch: null,
      ValorSwitchBase: dataHelp?.presupuestoEditable?.estHeader?.extrag_finan1,
      arrPosition: 4,
      resaltar: false,
    },
    {
      id: "extrag_finan2",
      name: "extrag_finan2",
      em: "Valor 2 [USD]",
      inputLabel: "Valor 2 [USD]",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_finan2,
      dataType: "number",
      Xs_Xd: [12, 1.8],
      blockDeGastos: true,
      ValorSwitch: null,
      ValorSwitchBase: dataHelp?.presupuestoEditable?.estHeader?.extrag_finan2,
      arrPosition: 3,
      resaltar: false,
    },
    {
      id: "extrag_finan3",
      name: "extrag_finan3",
      em: "Valor 3 [USD]",
      inputLabel: "Valor 3 [USD]",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_finan3,
      dataType: "number",
      Xs_Xd: [12, 1.8],
      blockDeGastos: true,
      ValorSwitch: null,
      ValorSwitchBase: dataHelp?.presupuestoEditable?.estHeader?.extrag_finan3,
      arrPosition: 3,
      resaltar: false,
    },
    {
      id: "extrag_finan4",
      name: "extrag_finan4",
      em: "Valor 4 [USD]",
      inputLabel: "Valor 4 [USD]",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_finan4,
      dataType: "number",
      Xs_Xd: [12, 1.8],
      blockDeGastos: true,
      ValorSwitch: null,
      ValorSwitchBase: dataHelp?.presupuestoEditable?.estHeader?.extrag_finan4,
      arrPosition: 3,
      resaltar: false,
    },
    {
      id: "extrag_finan5",
      name: "extrag_finan5",
      em: "Valor 5 [USD]",
      inputLabel: "Valor 5 [USD]",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_finan5,
      dataType: "number",
      Xs_Xd: [12, 1.8],
      blockDeGastos: true,
      ValorSwitch: null,
      ValorSwitchBase: dataHelp?.presupuestoEditable?.estHeader?.extrag_finan5,
      arrPosition: 3,
      resaltar: false,
    },
    {
      id: "extrag_finan_notas",
      name: "extrag_finan_notas",
      em: "Notas",
      inputLabel: "Notas",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_finan_notas,
      dataType: "string",
      Xs_Xd: [12, 3],
      blockDeGastos: true,
      ValorSwitch: null,
      ValorSwitchBase:
        dataHelp?.presupuestoEditable?.estHeader?.extrag_finan_notas,
      arrPosition: 3,
      resaltar: false,
    },
  ];

  useEffect(() => {
    dataHelpers();
  }, []);

  const formik = useFormik({ //valores iniciales del formik para el formulario
    initialValues: {
      description: null,
      project: "",
      embarque: "",
      fecha_embarque: UtilidadesHelper.fechaParaDB(), //valor inicial de fecha
      bl: "",
      oc: "",
      carrier: "",
      estnumber: "",
      estvers: 1,
      status: null,
      paisregion_id: 5, //Mexico Guadalajara HARCODEADO
      fwdpaisregion_id: 9, // es CHINA  Puede cambiar segun importador
      SeleccionPais: "Seleccione un pais", // existe para establecer la region
      own: user.name,
      avatar_url: user.avatar,
      ivaExcento: "true",
      htimestamp: UtilidadesHelper.fechaParaDB(),

      usarmoneda_local: "false",
      carga_id: null,
      limite_carga: null,
      cantContAuto: "--.--",
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

      // campos para trabajar con VirtualSeller
      vs_ockey: null,
      vs_oclastmodified: null,
    },
    validationSchema,
    //configuracion de formik para validar cuando envio el formulario y no al iniciar
    validateOnMount: false,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setOcultar(true);
      try {
        const postData = { //aqui toma la actualizacion de los campos antes de enviar el formik
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
            limite_carga: values.limite_carga ? values.limite_carga.id : 1,
            status: values.status ? values.status.id : 2,
            embarque: values.embarque ? values.embarque : "",
            bl: values.bl ? values.bl : "",
            fecha_embarque: values.fecha_embarque ? new Date(values.fecha_embarque).toISOString() : '', //nos aseguramos el formato de la fecha
            oc: values.oc ? values.oc : '',
            carrier: values.carrier ? values.carrier : '',

            //datos para trabajar con virtual seller
            vs_ockey: values.vs_ockey ? values.vs_ockey : '',
            vs_oclastmodified: values.vs_oclastmodified ? values.vs_oclastmodified : '',

            
          },
          estDetailsDB: productsData, // incluyo los productos (details)
        };

        if (values) {
          setOpen(true);
        }

        console.log('POST DATA :', postData);

        // Solo se llama a createData si estDetailsDB tiene algún elemento.
        if (postData.estDetailsDB.length > 0) {
          try {
            await PresupuestoHelper.createNewPresupuesto(postData, estnumber);
            console.log("Creacion exitosa de: ", postData);
            setProductsData([]);
            setLoadingEnvio(false);
            setMensaje("Presupuesto creado Exitosamante");
            localStorage.removeItem('formData'); //limpia storage
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
          setTimeout(() => {
            //repara el error de enviar mensaje para seguir con la carga
            setLoadingEnvio(false);
          }, 2000);
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
  //console.log('VALORES FORMIK: ', formik.values);

  

  // Carga los elementos del estado inicial una vez llegado la dataHelp ACTUALIZANDOLOS
  useEffect(() => {
    //CABECERA
    if (dataHelp?.proximoEstDisponible) {
      formik.setFieldValue("estnumber", dataHelp.proximoEstDisponible); //traemos el numEstimate disponible
      // formik.setFieldValue('estnumber', dataHelp.presupuesto[dataHelp.presupuesto.length - 1].estnumber + 1);
    }
    // ESTADO INICIAL QUE FUNCIONA CON LA COTIZACION (por ahora suspendida xq relentiza la app)
    // if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
    //   formik.setFieldValue("dolar", dataHelp.tipoCambio.quotes.USDARS);
    // }
    //if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
    formik.setFieldValue("dolar", 350);
    //}

    if (dataHelp.presupuestoEditable?.estHeader?.project) {
      formik.setFieldValue(
        "project",
        dataHelp.presupuestoEditable?.estHeader?.project == ""
          ? "Sin Data"
          : dataHelp.presupuestoEditable?.estHeader?.project
      );
    }
    if (dataHelp.presupuestoEditable?.estHeader?.description) {
      formik.setFieldValue(
        "description",
        dataHelp.presupuestoEditable?.estHeader?.description == ""
          ? "Sin Data"
          : dataHelp.presupuestoEditable?.estHeader?.description
      );
    }

    if (dataHelp.presupuestoEditable?.estHeader?.limite_carga!=undefined) 
    {  // aqui utilizamos filter() como un find por eso el [0] ya que filter devuelve un ARR
      const limiteCargaObj=limitesDeCarga.filter((limite) => limite.id===dataHelp.presupuestoEditable?.estHeader?.limite_carga)[0];

      formik.setFieldValue("limite_carga",limiteCargaObj);
    }

    if (dataHelp.presupuestoEditable?.estHeader?.status) {
              // aqui usamos el find() este caso devuelve el primer elemento que coincide en la busqueda
      const ValorEncontrado = StatusEstadosEmbarque.find( item => item.id === dataHelp.presupuestoEditable?.estHeader?.status)
      console.log('Valor encontrado :', ValorEncontrado);
      formik.setFieldValue("status", ValorEncontrado);
    }

    if (dataHelp.presupuestoEditable?.estHeader?.fecha_embarque) {
      formik.setFieldValue(
        "fecha_embarque",
        dataHelp.presupuestoEditable?.estHeader?.fecha_embarque == ""
          ? "Sin Data"
          : dataHelp.presupuestoEditable?.estHeader?.fecha_embarque
      );
    }

    if (dataHelp.presupuestoEditable?.estHeader?.embarque) {
      formik.setFieldValue(
        "embarque",
        dataHelp.presupuestoEditable?.estHeader?.embarque == ""
          ? "Sin Data"
          : dataHelp.presupuestoEditable?.estHeader?.embarque
      );
    }

    if (dataHelp.presupuestoEditable?.estHeader?.oc) {
      formik.setFieldValue(
        "oc",
        dataHelp.presupuestoEditable?.estHeader?.oc == ""
          ? "Sin Data"
          : dataHelp.presupuestoEditable?.estHeader?.oc
      );
    }

    if (dataHelp.presupuestoEditable?.estHeader?.carrier) {
      formik.setFieldValue(
        "carrier",
        dataHelp.presupuestoEditable?.estHeader?.carrier == ""
          ? "Sin Data"
          : dataHelp.presupuestoEditable?.estHeader?.carrier
      );
    }

    if (dataHelp.presupuestoEditable?.estHeader?.bl) {
      formik.setFieldValue(
        "bl",
        dataHelp.presupuestoEditable?.estHeader?.bl == ""
          ? "Sin Data"
          : dataHelp.presupuestoEditable?.estHeader?.bl
      );
    }

    //GASTOS LOCALES
    if (dataHelp.presupuestoEditable?.estHeader?.gloc_fwd) {
      formik.setFieldValue(
        "gloc_fwd",
        dataHelp.presupuestoEditable?.estHeader?.gloc_fwd
      );
    }
    if (dataHelp.presupuestoEditable?.estHeader?.gloc_flete) {
      formik.setFieldValue(
        "gloc_flete",
        dataHelp.presupuestoEditable?.estHeader?.gloc_flete
      );
    }
    if (dataHelp.presupuestoEditable?.estHeader?.gloc_terminales) {
      formik.setFieldValue(
        "gloc_terminales",
        dataHelp.presupuestoEditable?.estHeader?.gloc_terminales
      );
    }
    if (dataHelp.presupuestoEditable?.estHeader?.gloc_despachantes) {
      formik.setFieldValue(
        "gloc_despachantes",
        dataHelp.presupuestoEditable?.estHeader?.gloc_despachantes
      );
    }
    if (dataHelp.presupuestoEditable?.estHeader?.freight_cost) {
      formik.setFieldValue(
        "freight_cost",
        dataHelp.presupuestoEditable?.estHeader?.freight_cost
      );
    }
    if (dataHelp.presupuestoEditable?.estHeader?.freight_insurance_cost) {
      formik.setFieldValue(
        "freight_insurance_cost",
        dataHelp.presupuestoEditable?.estHeader?.freight_insurance_cost
      );
    }

    // EXTRA GASTOS
    // SOURCING
    if (dataHelp.presupuestoEditable?.estHeader?.extrag_src1) {
      formik.setFieldValue(
        "extrag_src1",
        dataHelp.presupuestoEditable?.estHeader?.extrag_src1
      );
    }
    if (dataHelp.presupuestoEditable?.estHeader?.extrag_src2) {
      formik.setFieldValue(
        "extrag_src2",
        dataHelp.presupuestoEditable?.estHeader?.extrag_src2
      );
    }
    if (dataHelp.presupuestoEditable?.estHeader?.extrag_src_notas) {
      formik.setFieldValue(
        "extrag_src_notas",
        dataHelp.presupuestoEditable?.estHeader?.extrag_src_notas
      );
    }
    // COMEX
    if (dataHelp.presupuestoEditable?.estHeader?.extrag_comex1) {
      formik.setFieldValue(
        "extrag_comex1",
        dataHelp.presupuestoEditable?.estHeader?.extrag_comex1
      );
    }
    if (dataHelp.presupuestoEditable?.estHeader?.extrag_comex2) {
      formik.setFieldValue(
        "extrag_comex2",
        dataHelp.presupuestoEditable?.estHeader?.extrag_comex2
      );
    }
    if (dataHelp.presupuestoEditable?.estHeader?.extrag_comex3) {
      formik.setFieldValue(
        "extrag_comex3",
        dataHelp.presupuestoEditable?.estHeader?.extrag_comex3
      );
    }
    if (dataHelp.presupuestoEditable?.estHeader?.extrag_comex_notas) {
      formik.setFieldValue(
        "extrag_comex_notas",
        dataHelp.presupuestoEditable?.estHeader?.extrag_comex_notas
      );
    }

    if(dataHelp?.presupuestoEditable?.estHeader?.gloc_fwd!=undefined)
    {
      //valor incial gastos locales
      formik.setFieldValue("gloc_fwd",dataHelp?.presupuestoEditable?.estHeader?.gloc_fwd?.toFixed(2));
      formik.setFieldValue("gloc_flete",dataHelp?.presupuestoEditable?.estHeader?.gloc_flete?.toFixed(2));
      formik.setFieldValue("gloc_descarga",dataHelp?.presupuestoEditable?.estHeader?.gloc_descarga?.toFixed(2));
      formik.setFieldValue("gloc_terminales",dataHelp?.presupuestoEditable?.estHeader?.gloc_terminales?.toFixed(2));
      formik.setFieldValue("freight_cost",dataHelp?.presupuestoEditable?.estHeader?.freight_cost?.toFixed(2));
      formik.setFieldValue("gloc_despachantes",dataHelp?.presupuestoEditable?.estHeader?.gloc_despachantes.toFixed(2));
      const cargaDetalle = dataHelp?.carga?.filter((conte) => conte.description == formik?.values?.carga_id?.description)[0];
      setCargaOld(cargaDetalle);
      formik.setFieldValue("carga_id",cargaDetalle);
      const limitCargObj=limitesDeCarga.filter((limite) => limite.id===dataHelp.presupuestoEditable?.estHeader?.limite_carga)[0];
      setLimiteCargaOld(limitCargObj);
      setGlocCopy(null);
    };

    // seteo de campos para trabajar con VirtualSeller
    if (dataHelp.presupuestoEditable?.estHeader?.vs_ockey) {
      formik.setFieldValue(
        "vs_ockey",
        dataHelp.presupuestoEditable?.estHeader?.vs_ockey == ""
          ? "Sin Data"
          : dataHelp.presupuestoEditable?.estHeader?.vs_ockey
      );
    };
    if (dataHelp.presupuestoEditable?.estHeader?.vs_oclastmodified) {
      formik.setFieldValue(
        "vs_oclastmodified",
        dataHelp.presupuestoEditable?.estHeader?.vs_oclastmodified == ""
          ? "Sin Data"
          : dataHelp.presupuestoEditable?.estHeader?.vs_oclastmodified
      );
    };
    
    // console.log('FOrmik post set :', formik.values);
    // console.log('datahelp :', dataHelp);
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
    // console.log(`El producto seleccionado es el: `, rowUpdate);
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
      navigate(`/inboundMEX/details/${estnumber}/${Number(vers) + 1}`);
    }
    setMensaje("");
    setLoadingEnvio(true);
  };

  function formatValue(value) {
    return value === "0" ? 0 : value;
  }

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

      // Añade el producto actualizado a la lista
      productsData.push({
        // ... (mismos campos que tienes en el caso else)
        // VALORES DEL DETAILS
        id: addingData.id,
        description: addingData.description ? addingData.description : 'Sin data',
        // description: addingData.desc,
        ncm_id: addingData.ncm_id,
        ncm_code: addingData.ncm_code,
        // total: addingData.totalAmount,
        pcsctn: addingData.pcsctn,
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
        cbmctn: addingData.cbmctn == 0 ? formatValue(addingData.cbmctn) : addingData.cbmctn,
        gwctn: addingData.gwctn == 0 ?  formatValue(addingData.gwctn) : addingData.gwctn,

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
          description: addingData.description ? addingData.description : 'Sin data',
          ncm_id: addingData.ncm_id,
          ncm_code: addingData.ncm_code,
          // total: addingData.totalAmount,
          pcsctn: addingData.pcsctn,
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
          cbmctn: addingData.cbmctn == 0 ? formatValue(addingData.cbmctn) : addingData.cbmctn,
          gwctn: addingData.gwctn == 0 ?  formatValue(addingData.gwctn) : addingData.gwctn,

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
    if(gastoLocal?.gloc_fwd!=undefined)
    {
      // console.log("RFID");
      setGlocCopy(tarifonData);
    }
    else
    {
      setGlocCopy(null);
    }
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


  // Variable que uarda la seleccion anterior de la carga para detectar si cambio y recalcular.
  const[cargaOld,setCargaOld]=useState({})
  const[limiteCargaOld,setLimiteCargaOld]=useState({})


  let tmpCantCont;
  const[glocCopy,setGlocCopy]=useState({});
  // Este Use effect detecta si cambian el select del tipo de carga. Escucha solo ese cambio.
  // Y si ya existia una x ccantidad de contenedores, entonces recalcula la cantidad necesaria con la nueva carga
  // elegida y luego recalcula los gastos locales.
   useEffect(()=>{
   // glocCopy se usa como semaforo para evitar la primera ejecucion de este codigo cuando llegan los datos del tarifon
   // Pero sucede que tambien desestima la reaccion cuando el limite de carga es cambiado x primera vez)
   // Por eso esta en una OR ... Si detecto cambio en el limite de carga proceso de inmediato sin importar el semafor glocCopy
   // SI, ES UN PARCHE y seguramente habra que revisitarlo. Son muchos eventos intentando competor contra un set de cuadros de ingreso
   // Ademas no hay eventos para cada uno de ellos que permita reorganizar. Debe deterctar los cambios que me interesan
   // En el caso del limite de carga, comparo lo que viene del json (presupuestoEditable, contra el formik)
   if(gastoLocal?.gloc_fwd !== undefined && (glocCopy?.gloc_fwd!=undefined || formik?.values.limite_carga?.id!=dataHelp?.presupuestoEditable?.estHeader?.limite_carga) )
      {
       
        // Si cambian la carga o cambian la cantidad limite, tengo que recalcular. Si el limite es 0, calculo la cantidad de contenedores
        // Caso contrario uso el limite ingresado para el calculo.
        if(formik?.values?.limite_carga?.id==0)
        {
          console.log("CID",formik.values.carga_id);
          tmpCantCont=contenedorHelper.calculaNumeroContenedores(productsData,formik.values.carga_id).cantContEnt;
          gastosLocMexHelper.calcAndSetGloc(formik,gastoLocal,Math.ceil(tmpCantCont));
        }
        else
        {
          //console.log("CID",formik.values.carga_id);
          gastosLocMexHelper.calcAndSetGloc(formik,gastoLocal,Math.ceil(formik?.values?.limite_carga?.id));
        }
    }
    
  },[productsData,formik?.values?.carga_id,formik?.values?.limite_carga,gastoLocal])

  // interfax de cantidad de contenedores para update
  useEffect(()=>{
    if(formik?.values?.limite_carga?.id==0){
    let tmpCantCont=contenedorHelper.calculaNumeroContenedores(productsData,formik?.values.carga_id).cantContEnt
    if((tmpCantCont).toFixed(3)>0.005){
      // Si, se calculan los gastos con la cantidad de contenedores.
      formik.setFieldValue( "cantContAuto", Math.ceil(tmpCantCont).toFixed(0) + " (" + tmpCantCont.toFixed(2) + ")" );
    }
  }
  else{
    formik.setFieldValue( "cantContAuto", "--.--");
  };
  },[productsData,formik?.values?.carga_id,formik?.values?.limite_carga]);


  function handleTextClick() {
    const inputElement = document.getElementById("carga_id");
    if (inputElement) {
      inputElement.focus();
    }
  };


  const [fobGrandTotal, setFobGrandTotal] = useState(0);
  useEffect(() => {
    if (productsData.length > 0 && gastoLocal?.freight_charge != undefined) {
      const fobGrandTotal = productsData.reduce((accumulator, currentValue) => {
        setFobGrandTotal(accumulator + currentValue.fob_u * currentValue.qty);
        return accumulator + currentValue.fob_u * currentValue.qty;
      }, 0);
      formik.setFieldValue(
        "freight_insurance_cost",
        (gastoLocal?.insurance_charge / 100) * fobGrandTotal
      );
    }
  }, [productsData]);

  const StyledTypography = styled(Typography)(({ theme }) => ({
    "&:hover": {
      color: "green",
      cursor: "pointer",
    },
  }));

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


  const [estados, setEstados] = React.useState([
    {id:2,description:"Pend. de Embarque "},
    {id:3,description:"Embarcado"},
    {id:4,description:"Cerrado"}, 
  ]);

  const [seleccionEstado, setSeleccionEstado] = React.useState(null); //se da Estado

  const handleChangeEstado = (estado) => {
    setSeleccionEstado(estado);
  };


  return (
    <>
      <MainCard
      >
        <Typography
                variant="h3"
                color={dataHelp?.presupuestoEditable?.estHeader?.status<=15?(theme.palette.mode === "dark" ? "white" : "black"):("coral")}
                display={"inline"}
              >
                {dataHelp?.presupuestoEditable?.estHeader?(dataHelp?.presupuestoEditable?.estHeader?.status<=15?"Actualizando: ":"IMPORTANDO: "):("")}
              </Typography>
              <Typography
                variant="h3"
                color={theme.palette.mode === "dark" ? "LightSkyBLue" : "grey"}
                display={"inline"}
                sx={{ fontStyle: "italic" }}
              >
                {
                dataHelp?.presupuestoEditable?.estHeader.estnumber?  
                        dataHelp?.presupuestoEditable?.estHeader?.description ? `${dataHelp?.presupuestoEditable?.estHeader.description}` : "Sin Datos"
                : " ...aguarde"}{" "}
              </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            position: "relative", // Posición relativa  PARA COLOCAR EL BOTON A LA ALTURA DEL MAINCARD
            top: "-35px", // Posición desde la parte superior del contenedor
            right: "10px", // Posición desde la derecha del contenedor
            // margin: "-55px",
          }}
        >
          <AnimateButton>
            <Button
              variant="contained"
              onClick={() => navigate("/inboundMEX/inbound")}
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
          <form
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
              }
            }}
            onSubmit={formik.handleSubmit}
          >
            <Grid container spacing={gridSpacing}>

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
                />
              ))}

              {/* LIMITE CARGA CABECERA */}
              {cabeceraLimiteCarga.map((field) => (
                <CustomSelect
                  key={field.id}
                  {...field}
                  formik={formik}
                  XS={12}
                  MD={1}
                  // tooltip={"Ingrese Limite de Carga"}
                  desactivado={formik.values.carga_id != null ? false : true}
                />
              ))}

              {/* PRJ CABECERA */}
              {/*cabeceraPRJ.map((field) => (
                <CustomSelect
                  key={field.id}
                  {...field}
                  formik={formik}
                  XS={12}
                  MD={1.5}
                />
              ))*/}

              {/* CANTIDAD DE AUTOCOMPLETADO */}
              <Grid item xs={12} md={0.8} align="left">
                <Stack>
                  <InputLabel>Auto</InputLabel>
                  <Tooltip title={formik.values.cantContAuto !== '--.--' ? `Cant. equipos: ${formik.values.cantContAuto}` : "Funcion para modo Auto"}>
                    <TextField
                      id="Auto"
                      name="Auto"
                      type="string"
                      value={formik.values.cantContAuto}
                      onBlur={formik.handleBlur}
                      disabled
                      fullWidth
                      placeholder="--.--"
                      inputProps={{
                        style: { textAlign: "left" },
                        className: classes.inputPlaceholder,
                      }} // Aquí se alinea el texto a la derecha y opacamos el dolar
                      defaultValue="--.--"
                    />
                  </Tooltip>
                </Stack>
              </Grid>

              {/* NOTA CABECERA Descipcion */}
              {cabeceraNota.map((field) => (
                <CustomSelect
                  key={field.id}
                  {...field}
                  formik={formik}
                  XS={12}
                  MD={2.7}
                />
              ))}


              {formik.values.carga_id != null ? (
                <>
                  <Grid
                    item
                    xs={12}
                    style={{ position: "relative", marginTop: -5 }}
                  >
                    <Typography
                      // color={"green"}
                      variant="h4"
                      style={{
                        // margin: "8px",
                        position: "absolute",
                        transform: "rotate(-90deg)",
                        transformOrigin: "left bottom",
                        whiteSpace: "nowrap",
                        bottom: -120, // Ajusta según sea necesario
                        left: 20, // Ajusta según sea necesario
                      }}
                    >
                      Gastos Locales
                    </Typography>
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
                      origData={dataHelp.presupuestoEditable.estHeader}
                      Xs_Xd={input.Xs_Xd}
                      blockDeGastos={input.blockDeGastos}
                      onSwitchChange={(newState) =>
                        handleSwitchChangeInIndex(newState, input.arrPosition)
                      }
                      handleSwitchChangeInIndex={handleSwitchChangeInIndex}
                      ValorSwitch={input.ValorSwitch}
                      ValorSwitchBase={input.ValorSwitchBase}
                      arrPosition={input.arrPosition}
                      resaltar={resaltaCambios[index]}
                      gastoLocal={gastoLocal}
                      nameGastoLocalTarifon={input.nameGastoLocalTarifon}
                      fobGrandTotal={fobGrandTotal}
                    />
                  ))}
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
                            <Typography
                              // color={"green"}
                              variant="h3"
                              style={{ marginLeft: "8px" }}
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
                <>

                  <Grid
                    item
                    xs={12}
                    style={{ position: "relative", marginTop: -5 }}
                  >
                    <Typography
                      // color={"green"}
                      variant="h4"
                      style={{
                        // margin: "8px",
                        position: "absolute",
                        transform: "rotate(-90deg)",
                        transformOrigin: "left bottom",
                        whiteSpace: "nowrap",
                        bottom: -110, // Ajusta según sea necesario
                        left: 20, // Ajusta según sea necesario
                      }}
                    >
                      Extra Gastos
                    </Typography>
                  </Grid>

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
                          handleSwitchChangeInIndex(newState, input.arrPosition)
                        }
                        handleSwitchChangeInIndex={handleSwitchChangeInIndex}
                        ValorSwitch={input.ValorSwitch}
                        ValorSwitchBase={input.ValorSwitchBase}
                        arrPosition={input.arrPosition}
                      />
                    ))}

                  {/* FECHA DE embarque */}
                  <Grid
                    item
                    xs={12}
                    style={{ position: "relative", marginTop: -5 }}
                  >
                    <Typography
                      // color={"green"}
                      variant="h4"
                      style={{
                        // margin: "8px",
                        position: "absolute",
                        transform: "rotate(-90deg)",
                        transformOrigin: "left bottom",
                        whiteSpace: "nowrap",
                        bottom: -110, // Ajusta según sea necesario
                        left: 20, // Ajusta según sea necesario
                      }}
                    >
                      Embarque
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={2} align="left">
                        <Stack>
                          <InputLabel required>Fecha</InputLabel>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                              inputFormat="dd/MM/yyyy"
                              renderInput={(props) => (
                                <TextField fullWidth {...props} />
                              )}
                              value={formik.values.fecha_embarque}
                              id="fecha_embarque"
                              name="fecha_embarque"
                              onChange={(newValue) => {
                                formik.setFieldValue('fecha_embarque', newValue ? newValue.toISOString() : '');
                              }}
                              // disabled={!checkedComex} // habilita o desabilita campos
                            />
                          </LocalizationProvider>
                        </Stack>
                      </Grid>

                      {/* Embarque */}
                      {datosEmbarque.map((field) => (
                        <CustomSelect
                          key={field.id} //se envia el valor del campo tanto NAME como ID del atributo
                          {...field} //se envia todo lo referente del objeto COMO TAMBIEN LA DATA QUE COMPLETA EL SELECT si corresponde
                          formik={formik} //se envian todos los valores del formik
                          XS={12} //medidas del campo en viewport
                          MD={2} //medidas del campo en viewport
                          // tooltip={"Ingrese Limite de Carga"}  //se envia el mensaje del tooltip
                          desactivado={formik.values.status != null ? false : true} // para poder activar o desactivar el input
                          ValorPorDefecto={formik?.values?.status} // aqui paso el valor por defecto que llega y se almacena en formik
                        />
                      ))}

                      {/* NOTA CABECERA Embarque */}
                      {cabeceraEmbarque.map((field) => (
                        <CustomSelect
                          key={field.id}
                          {...field}
                          formik={formik}
                          XS={12}
                          MD={2}
                        />
                      ))}

                  {/* DATOS BL */}
                  {datosBl.map((field) => (
                    <CustomSelect
                      key={field.id}
                      {...field}
                      formik={formik}
                      XS={12}
                      MD={2}
                    />
                  ))}

                    {/* DATOS VESSEL CARRIER */}
                    {datosVesselCarrier.map((field) => (
                    <CustomSelect
                      key={field.id}
                      {...field}
                      formik={formik}
                      XS={12}
                      MD={4}
                    />
                  ))}

                </>

              {/* CARGA DE PRODUCTOS */}
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
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <AddDetailsPage
                    handleAddItem={handleAddItem}
                    open={open2}
                    handleCloseDialog={handleCloseDialog}
                    dataHelp={dataHelp}
                    formik={formik} 
                    gastosLocales={gastoLocal}
                    productsData={productsData}
                    limiteConte={formik?.values?.limite_carga?.id}   
                    cantidadConte={contenedorHelper.calculaNumeroContenedores(productsData,formik.values.carga_id).cantContEnt}  
                  />
                </Grid>
              ) : formik.values.carga_id != null ? (
                <>
                    <Grid item xs={12}>
                    <Button display={"inline"}
                      variant="text"
                      onClick={handleClickOpenDialog}
                    >
                      + Agregar Producto
                    </Button>
                    <Typography            
                            variant="h3"
                            color={"red"}
                            style={{ marginLeft: "60%" }}
                            display={"inline"}
                            >
                            {alarmaContenedores(productsData,formik)?"ADVERTENCIA: Limite de Carga Excedido":""}
                            {/* {console.log(formik?.values?.cantidad_contenedores)} */}
                    </Typography> 
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
                    productsData={productsData}
                    gastosLocales={gastoLocal}
                    ProductsDisbyte={dataHelp?.ProductosDisbyte}
                    limiteConte={formik?.values?.limite_carga?.id}   
                    cantidadConte={contenedorHelper.calculaNumeroContenedores(productsData,formik.values.carga_id).cantContEnt/*-contenedorHelper.calculaContenedoresPorItem(rowUpdate,formik.values.carga_id).itemCont*/}  
                  />
                </>
              ) : (
                ""
              )}

              {/* PESAJE CONTENEDORES */}
             
                <PesajeContenedor
                  productsData={productsData}
                  tipoContenedor={formik.values.carga_id?formik.values.carga_id:2}
                />
              {/* {console.log(formik.values.carga_id)} */}

              <Grid
                item
                sx={{ display: "flex", justifyContent: "right" }}
                xs={12}
              >
                {formik.values.paisregion_id == "" ? (
                  <Button variant="contained" color="warning" disabled>
                    Seleccione Pais
                  </Button>
                ) : (
                  <Button variant="contained" type="submit">
                    Actualizar
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
