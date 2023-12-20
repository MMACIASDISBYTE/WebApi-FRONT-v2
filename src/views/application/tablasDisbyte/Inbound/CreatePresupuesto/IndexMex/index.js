import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
import AnimateButton from "ui-component/extended/AnimateButton";
// Importa CircularProgress de Material UI
import { CircularProgress } from "@material-ui/core";

// project imports
import { gridSpacing } from "store/constant";
import InputLabel from "ui-component/extended/Form/InputLabel";
import MainCard from "ui-component/cards/MainCard";

// third-party
import * as yup from "yup";
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
import { PesajeContenedor } from "../../../../../Components/Contenedores/PesajeContenedor";
import { CustomSelect } from "../../../../../Components/Formularios/CustomSelect";
import { PaisRegionHelper } from "helpers/PaisRegionHelper";
import { TarifonMexHelper } from "helpers/TarifonMexHelper";
import { Box } from "@mui/system";
import { ExtraCostoDobleClick } from "../../UpdateVersPresupuesto/ExtraCostoDobleClick";
import { ProductosHelper } from "helpers/ProductosHelper";
import ProductsPage from "../../../../../Components/DetailsProduct/DetailsListado";
import AddDetailsPage from "../../../../../Components/DetailsProduct/AddDetailsSimuladorMex";
import UpdateItemPage from "../../../../../Components/DetailsProduct/UpdateDetailsSimuladorMex";
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

// yup validation-schema VALIDACIONES
const validationSchema = yup.object({
  // description: yup.string().nullable().required("La descripcion is required"),
  bl: yup.string().nullable().required("Bl is required"),

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

});


const alarmaContenedores=(prodData,miFormik)=>
{
  if(((contenedorHelper.calculaNumeroContenedores(prodData,miFormik?.values.carga_id).cantContEnt-miFormik?.values?.limite_carga.id)>0.01) & (miFormik?.values?.limite_carga.id>0) )
  {
      return true;
  }
  return false;
}

// ==============================|| CREATE INVOICE ||============================== //
function CreateInvoice() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const classes = useStyles(); // linea para implementar la clase para opacar el placeholder de dolar

  const [open, setOpen] = useState(false);
  // const [valueMonedaLocal, setValueMonedaLocal] = React.useState("false");
  // const [valueIva, setValueIva] = React.useState("false");
  const [dataHelp, setDataHelp] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingEnvio, setLoadingEnvio] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [ocultar, setOcultar] = useState(false);

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
    const presupuesto = await PresupuestoHelper.fetchDataInbound();
    const proximoEstDisponible =
      await PresupuestoHelper.EstimateDisponibleNum();
    // const tipoCambio = await UtilidadesHelper.tipoCambioGeneral();
    const Paises = await PaisRegionHelper.fetchData();
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
      proximoEstDisponible,
      // tipoCambio,
      Paises,
      ProductosDisbyte,


    };
    setDataHelp(objData);
    setLoading(false); // Mueve esta línea aquí para establecer loading en false después de que las llamadas a la API se resuelvan
    setDataHelp(objData);
  };
  // console.log(dataHelp);


  // AQUI LLAMAMOS A ELEMENTOS DEL FORMULARIO Y LOS MAPEAMOS EN UN COMPONENTE
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
      em: "Tipo de Equipo",
      inputLabel: "Carga",
      data: dataHelp.carga,
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

  const cabeceraCantContAuto = [
    {
      id: "canCont",
      name: "Auto",
      em: "--.--", //placeholder en caso de String
      inputLabel: "Auto",
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
      ValorSwitchBase: dataHelp?.presupuestoEditable?.estHeader?.tarifupdate,
      arrPosition: 4,
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
      ValorSwitchBase: dataHelp?.presupuestoEditable?.estHeader?.tarifupdate,
      arrPosition: 7,
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
      ValorSwitchBase: dataHelp?.presupuestoEditable?.estHeader?.tarifupdate,
      arrPosition: 3,
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
      ValorSwitchBase: dataHelp?.presupuestoEditable?.estHeader?.tarifupdate,
      arrPosition: 3,
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
      ValorSwitchBase: dataHelp?.presupuestoEditable?.estHeader?.tarifupdate,
      arrPosition: 8,
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
      resaltar: false,
    },
  ];


  const datosEmbarque = [
    {
      id: "status",
      name: "status",
      em: "Seleccione Estado",
      inputLabel: "Estado Embarque",
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


  useEffect(() => {
    dataHelpers();
  }, []);

  // const today = new Date();
  // const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1 ).padStart(2, "0")}-${(today.getFullYear())}`;
  // const isoString = today.toISOString();
  // console.log(isoString);

  const formik = useFormik({
    initialValues: {
      description: null,
      project: "",
      embarque: "",
      fecha_embarque: UtilidadesHelper.fechaParaDB(),
      bl: "",
      oc: "",
      carrier: "",
      estnumber: "",
      estvers: 1,
      status: {id:2,description:"Pend. de Embarque"},
      paisregion_id: 5, //Mexico Guadalajara HARCODEADO
      fwdpaisregion_id: 9, // es CHINA  Puede cambiar segun importador
      SeleccionPais: "Seleccione un pais", // existe para establecer la region
      own: user.name,
      avatar_url: user.avatar,
      ivaExcento: "true",
      htimestamp: UtilidadesHelper.fechaParaDB(),

      usarmoneda_local: "false",
      carga_id: null,
      limite_carga: {id:1,description:"1"},
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
      pesoTotal: 0,

      //gastos
      extrag_comex1: 0,
      extrag_comex2: 0,
      extrag_comex3: 0,
      extrag_comex_notas: "Sin notas",
      extrag_glob_src1: 0, //nuevos
      extrag_glob_src2: 0, //nuevos
      extrag_src1: 0,
      extrag_src2: 0,
      extrag_src_notas: "Sin notas",
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

      gloc_fwd: 0,
      gloc_flete: 0,
      gloc_terminales: 0,
      gloc_despachantes: 0,
      gloc_descarga: 0,
      freight_cost: 0,
      freight_insurance_cost: 0,

      // campos para trabajar con VirtualSeller
      vs_ockey: 'webapp',
      vs_oclastmodified: UtilidadesHelper.fechaParaDB(),
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
            description: values.description ? values.description : "Sin Notas",

            carga_id: values.carga_id ? values.carga_id.id : "", // Recupera la descripción
            embarque: values.embarque ? values.embarque : "",
            limite_carga: values.limite_carga ? values.limite_carga.id : '', // envio el id de limite de carga siendo n!° entero
            status: values.status ? values.status.id : 2,
            oc: values.oc ? values.oc : "",
            carrier: values.carrier ? values.carrier : '',

            extrag_src1: values.extrag_src1
              ? parseFloat(values.extrag_src1)
              : 0,
            extrag_src2: values.extrag_src2
              ? parseFloat(values.extrag_src2)
              : 0,

          },
          estDetailsDB: productsData, // incluyo los productos (details)
        };

        if (values) {
          setOpen(true);
        }

        console.log('Data Enviada', postData);

        // Solo se llama a createData si estDetailsDB tiene algún elemento.
        if (postData.estDetailsDB.length > 0) {
          try {
            await PresupuestoHelper.createDataInbound(postData);
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
          setTimeout(() => {
            //repara el error de enviar mensaje para seguir con la carga
            setLoadingEnvio(false);
          }, 2000);
          throw new Error("estDetailsDB no contiene ningún elemento.");
        }
      } catch (error) {
        setOpen(true);
        setMensaje(error.message || "Un error desconocido ocurrió.");
        console.error("Error", error.errors);
      }
    },
  });

  // Carga los elementos del estado inicial una vez llegado la dataHelp
  useEffect(() => {
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
  }, [dataHelp]);


  const [productsData, setProductsData] = useState([]);
  const [valueBasic, setValueBasic] = React.useState(new Date());
  const [rowUpdate, SetRowUpdate] = useState([]);

  // to delete row in order details
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
    if (mensaje === "Presupuesto creado Exitosamante") {
      navigate(`/inboundMEX/details/${dataHelp.proximoEstDisponible}/1`); //Navego a la vista de detalle
    }
    setMensaje("");
    setLoadingEnvio(true);
  };

  function formatValue(value) {
    return value === "0" ? 0 : value;
  }

  // add item handler
  const handleAddItem = (addingData, edicion = false) => { //false por defecto si es un nuevo producto, ira en true si es uno que se actualiza
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
          description:  addingData.description ? addingData.description : 'Sin data',
          ncm_id: addingData.ncm_id,
          ncm_code: addingData.ncm_code,
          // total: addingData.totalAmount,
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
        },
      ]);

    }
    console.log(addingData);
  };

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

  /*const CalculoDespachanteMex = (cif_grand_total) => {
    return (
      cif_grand_total * gastoLocal?.gloc_despachante_var +
      gastoLocal?.gloc_despachante_fijo +
      gastoLocal?.gloc_despachante_otro1 +
      gastoLocal?.gloc_despachante_otro2
    );
  };*/

  const CalculoGastosLocales = (gastos,cantContenedores)=>{

      formik.setFieldValue("freight_cost",Math.ceil(gastos?.freight_charge*cantContenedores));
      formik.setFieldValue("gloc_fwd",Math.ceil(gastos?.gloc_fwd*cantContenedores));
      formik.setFieldValue("gloc_descarga",Math.ceil(gastos?.gasto_descarga_depo*cantContenedores));
      formik.setFieldValue("gloc_terminales",Math.ceil(gastos?.gasto_terminal*cantContenedores));

      let cantContBase2 = Math.floor(cantContenedores/2);
      // La cantidad de contenedores multiplo de 2, la puedo llevar en fletes dobles.
      let glocFlete = (gastos?.flete_interno_doble)*cantContBase2;      
      if((cantContenedores%2)>0.1)
      { // Si la cantidad Impar de contenedores, sumo un flete simple, el resto va todos en fletes dobles.
        glocFlete=glocFlete+gastos.flete_interno;        
      }

      console.log(glocFlete);
      formik.setFieldValue("gloc_flete",glocFlete);
  }

  const tarifonDataFetch = async (id) => {
    const tarifonData = await TarifonMexHelper.readDataByCargaId(id);
    setGastoLocal(tarifonData);
  };


// Aca vigilo si seleccionan otra carga. Si lo hacwn consulto los gstos locales nuevamente al endpoint tarifon
// Y aprovecho para pasivar todos los formik.
  useEffect(() => {
    formik.setFieldValue("gloc_descarga", "");
    formik.setFieldValue("gloc_terminales", "");
    formik.setFieldValue("gloc_fwd", "Aguarde ...");
    formik.setFieldValue("freight_cost", "");
    formik.setFieldValue("gloc_flete", "");
    formik.setFieldValue("gloc_despachantes", "");

    tarifonDataFetch(formik?.values?.carga_id?.id);
  }, [formik?.values?.carga_id]);

  // Refresca los gastos locales que son funcion de la carga.
  // Revisa si cambia la cantidad de productos ingresado
  // Cuando aun no hay prod calcula los gastos en base al limite de contenedores (VER !!!)
  useEffect(() => {
   
    let tmpCantCont=0;
    // Este dato viene desde la API de gasto. Miesntras este roto, siginifica que el fetch de los valores no temrino
    if (gastoLocal?.freight_charge === undefined) {
      formik.setFieldValue("gloc_descarga", "");
      formik.setFieldValue("gloc_terminales", "");
      formik.setFieldValue("gloc_fwd", "Aguarde ...");
      formik.setFieldValue("freight_cost", "");
      formik.setFieldValue("gloc_flete", "");
      formik.setFieldValue("gloc_despachantes", "");
      formik.setFieldValue("gloc_despachantes");
      formik.setFieldValue("freight_insurance_cost", "");
    } 
    else 
    {
        // Auto tiene id=0
        if(formik?.values?.limite_carga?.id>0)
        { // No esta en "auto"
              gastosLocMexHelper.calcAndSetGloc(formik,gastoLocal,formik?.values?.limite_carga.id);
              formik.setFieldValue("cantContAuto", "--.--");
        }
        else
        { //Auto: Si tengo al menos 0.005 de contenedor, aplico la logica de gastos. Si no pongo TBD a todo
          // Este useeffect tambien reacciona al cambio de lista de productos. Si cambia, recalcula los contenedores.
          tmpCantCont=contenedorHelper.calculaNumeroContenedores(productsData,formik?.values.carga_id).cantContEnt
          // La cantidad de ocntenedores es mayor a 0 ?
          if((tmpCantCont).toFixed(3)>0.005)
          {   // Si, se calculan los gastos con la cantidad de contenedores.
              gastosLocMexHelper.calcAndSetGloc(formik,gastoLocal,Math.ceil(tmpCantCont));   
              formik.setFieldValue( "cantContAuto", Math.ceil(tmpCantCont).toFixed(0) + " (" + tmpCantCont.toFixed(2) + ")" );
          }
          else
          {
              formik.setFieldValue("gloc_descarga", "TBD");
              formik.setFieldValue("gloc_terminales", "TBD");
              formik.setFieldValue("gloc_fwd", "TBD");
              formik.setFieldValue("freight_cost", "TBD");
              formik.setFieldValue("gloc_flete", "TBD");
              formik.setFieldValue("gloc_despachantes", "TBD");
              formik.setFieldValue("gloc_despachantes","TBD");
              formik.setFieldValue("freight_insurance_cost", "TBD");
              formik.setFieldValue("cantContAuto","TBD")
          }
        }
        //console.log(formik?.values);
      }

    //console.log(formik.values);
  }, [gastoLocal, formik?.values?.carga_id, formik?.values?.limite_carga, productsData]);

  function handleTextClick() {
    const inputElement = document.getElementById("carga_id");
    if (inputElement) {
      inputElement.focus();
    }
  }

  useEffect(() => {
    if (productsData.length > 0) {
      const fobGrandTotal = productsData.reduce((accumulator, currentValue) => {
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

  // // console.log('modal');

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
        title={`Crear Inbound en Mexico:`}
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
              if (event.key === "Enter") { //aqui prevenimos que no se envie el formulario apretando enter
                event.preventDefault();
              }
            }}
            onSubmit={formik.handleSubmit}
          >
            <Grid container spacing={gridSpacing}>
              {/* COMPONENTE DE INPUTS que maneja la data de cabeceraPais SELECCIONA PAIS */}

              {/* CABECERA DE PRESUPUESTADOR */}

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
                  ValorPorDefecto={9} //envio el valor por defecto del array id:9, description: 'CHINA'
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
                  ValorPorDefecto={5} //envio el valor por defecto del array id:5, description: 'MEXICO'
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
                <CustomSelect
                  key={field.id}
                  {...field}
                  formik={formik}
                  XS={12}
                  MD={1.2}
                  // tooltip={"Seleccione Carga"}
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

              <Grid item xs={12} md={0.8} align="left">
                <Stack>
                  <InputLabel>Auto</InputLabel>
                  <Tooltip title="Numero de Equipo en modo Auto">
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
                    style={{ position: "relative" }}
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

                  {ExtraCostosLocal.map((input) => (
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
                      gastoLocal={gastoLocal}
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
                      color={"grey"}
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
              <>
                {formik.values.carga_id && (
                  <>
                  {/* COMEX */}
                  
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

                    {ExtraCostosComex.map((input) => (
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
                              // disabled={!checkedComex} // habilita o desabilita campos
                            />
                          </LocalizationProvider>
                        </Stack>
                      </Grid>

                      {/* Embarque */}
                      {datosEmbarque.map((field) => (
                        <CustomSelect
                          key={field.id}
                          {...field}
                          formik={formik}
                          XS={12}
                          MD={2}
                          // tooltip={"Ingrese Limite de Carga"}
                          desactivado={formik.values.status != null ? false : true}
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
                )}
              </>

              {/* CARGA DE   PRODUCTOS */}
              <ProductsPage
                productsData={productsData}
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
                    productsData={productsData}
                    gastosLocales={gastoLocal}
                    cantidadConte={contenedorHelper.calculaNumeroContenedores(productsData,formik?.values.carga_id).cantContEnt}
                    limiteConte={formik.values.limite_carga.id}
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
                  <Grid item xs={12} >
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
                    limiteConte={formik?.values?.limite_carga.id}   
                    cantidadConte={contenedorHelper.calculaNumeroContenedores(productsData,formik.values.carga_id).cantContEnt/*-contenedorHelper.calculaContenedoresPorItem(rowUpdate,formik.values.carga_id).itemCont*/}  
                  />
                </>
              ) : (
                ""
              )}

              {/* PESAJE CONTENEDORES */}
              {ocultar ? (
                ""
              ) : (
                <>
                
                <PesajeContenedor
                  productsData={productsData}
                  tipoContenedor={formik?.values?.carga_id}
                />
                </>
              )}

              <Grid
                item
                sx={{ display: "flex", justifyContent: "right" }}
                xs={12}
              >
                {formik.values.paisregion_id === "" ? (
                  <Button variant="contained" color="warning" disabled>
                    Seleccione Pais
                  </Button>
                ) : (
                  <Button variant="contained" type="submit">
                    Enviar
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
