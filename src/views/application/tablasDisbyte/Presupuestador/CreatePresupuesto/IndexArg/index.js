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
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import Chip from "ui-component/extended/Chip";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import "@mui/lab";
import { useTheme } from "@mui/material/styles";
import AnimateButton from "ui-component/extended/AnimateButton";
// Importa CircularProgress de Material UI
import { CircularProgress } from "@material-ui/core";

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
import { PesajeContenedor } from "../PesajeContenedor";
import { CustomSelect } from "../CustomSelect";
import { PaisRegionHelper } from "helpers/PaisRegionHelper";
import { TarifasFwdHelper } from "helpers/TarifasFwdHelper";
import { TarifasFleteHelper } from "helpers/TarifasFleteHelper";
import { TarifasTerminalHelper } from "helpers/TarifasTerminalHelper";
import { TarifasDepositoHelper } from "helpers/TarifasDepositoHelper";
import { TarifasDespachanteHelper } from "helpers/TarifasDespachanteHelper";
import { TarifasBancosHelper } from "helpers/TarifasBancosHelper";
import { TarifasGestDigDocHelper } from "helpers/TarifasGestDigHelper";
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
});

// ==============================|| CREATE INVOICE ||============================== //
function CreateInvoice() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
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

    const objData = {
      carga,
      proveedoresOem,
      NCM,
      NCM_Mex,
      presupuesto,
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
    };
    setDataHelp(objData);
    setLoading(false); // Mueve esta línea aquí para establecer loading en false después de que las llamadas a la API se resuelvan
    setDataHelp(objData);
  };

  const cellInput = [
    // {
    //   id: "carga_id",
    //   name: "carga_id",
    //   em: "Seleccione una Carga",
    //   inputLabel: "Carga",
    //   data: dataHelp.carga,
    // },
    {
      id: "fwdpaisregion_id",
      name: "fwdpaisregion_id",
      em: "Seleccione una pais de Origen",
      inputLabel: "Pais Origen",
      data: dataHelp.Paises,
    },
    {
      id: "tarifasfwd_id",
      name: "tarifasfwd_id",
      em: "Seleccione una Tarifa Fwd",
      inputLabel: "Tarifas Fwd",
      data: dataHelp.TarifasFwd,
    },
    {
      id: "tarifasflete_id",
      name: "tarifasflete_id",
      em: "Seleccione una Tarifa Flete",
      inputLabel: "Tarifa Fletes",
      data: dataHelp.TarifasFlete,
    },
    {
      id: "tarifasterminales_id",
      name: "tarifasterminales_id",
      em: "Seleccione una Tarifa Terminal",
      inputLabel: "Tarifa Terminal",
      data: dataHelp.TarifasTerminal,
    },
    {
      id: "tarifaspolizas_id",
      name: "tarifaspolizas_id",
      em: "Seleccione una Tarifa Poliza",
      inputLabel: "Tarifa Poliza",
      data: dataHelp.TarifasPoliza,
    },
    {
      id: "tarifasdepositos_id",
      name: "tarifasdepositos_id",
      em: "Seleccione una Tarifa Deposito",
      inputLabel: "Tarifa Deposito",
      data: dataHelp.TarifasDepositos,
    },
    {
      id: "tarifasdespachantes_id",
      name: "tarifasdespachantes_id",
      em: "Seleccione una Tarifa Despachantes",
      inputLabel: "Tarifa Despachantes",
      data: dataHelp.TarifasDespachantes,
    },
    {
      id: "tarifasbancos_id",
      name: "tarifasbancos_id",
      em: "Seleccione una Tarifa banco",
      inputLabel: "Tarifa Banco",
      data: dataHelp.TarifasBanco,
    },
    {
      id: "tarifasgestdigdoc_id",
      name: "tarifasgestdigdoc_id",
      em: "Seleccione una Tarifa Gestion Digital",
      inputLabel: "Tarifa Gestion Digital",
      data: dataHelp.TarifasGestDig,
    },
  ];
  //   console.log(cellInput);

  const cabeceraPais = [
    {
      id: "paisregion_id",
      name: "paisregion_id",
      em: "Seleccione un Pais",
      inputLabel: "Pais",
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
      estnumber: "",
      estvers: 1,
      status: 1,
      paisregion_id: 7,
      SeleccionPais: "Seleccione un pais", // existe para establecer la region
      own: user.name,
      ivaExcento: "true",
      htimestamp: UtilidadesHelper.fechaParaDB(),

      usarmoneda_local: "false",
      carga_id: null,
      fwdpaisregion_id: null,
      //   polizaProv: null,
      dolar: "",
      tarifupdate: 1023, //harcodeado (formula de calculo)
      tarifrecent: 1023, //harcodeado (formula de calculo)
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
      freight_cost: 0,
      freight_insurance_cost: 0,
      iibb_total: 0,

      // proveedores_id: null, //va en el details
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
          },
          estDetailsDB: productsData, // incluyo los productos (details)
        };

        if (values) {
          setOpen(true);
        }

        // console.log(productsData);
        // console.log(postData);

        // Solo se llama a createData si estDetailsDB tiene algún elemento.
        if (postData.estDetailsDB.length > 0) {
          try {
            await PresupuestoHelper.createData(postData);
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

  const [allAmounts, setAllAmounts] = useState({
    subTotal: 0,
    appliedTaxValue: 0.1,
    appliedDiscountValue: 0.05,
    taxesAmount: 0,
    discountAmount: 0,
    totalAmount: 0,
  });

  const [productsData, setProductsData] = useState([]);
  const [valueBasic, setValueBasic] = React.useState(new Date());
  const [addItemClicked, setAddItemClicked] = useState(false);

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
  const editProductHandler = (id) => {
    console.log(`El producto seleccionado es el: `, id);
    // setProductsData(productsData.filter((item) => item.id !== id));
  };

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
  const handleAddItem = (addingData) => {
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
    console.log(addingData);

    setAddItemClicked(false);
  };
  

  return (
    <>
      <MainCard title={`Crear Presupuesto de Argentina - Bs. As. : #00${formik?.values?.estnumber}/00${formik?.values?.estvers} Fecha: ${UtilidadesHelper.fechaParaVista(valueBasic)}`}>
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
              {/* {cabeceraPais.map((field) => (
                <CustomSelect
                  key={field.id}
                  {...field}
                  formik={formik}
                  XS={12}
                  MD={1.2}
                />
              ))} */}

              {/* Seleccion pais*/}
              {/* <Grid item xs={12} md={1.2} align="left">
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
              </Grid> */}

              {/* SELECT CARGA CABECERA */}
              {cabeceraCarga.map((field) => (
                <CustomSelect
                  key={field.id}
                  {...field}
                  formik={formik}
                  XS={12}
                  MD={1.2}
                />
              ))}

              {/* NOTA CABECERA */}
              {cabeceraNota.map((field) => (
                <CustomSelect
                  key={field.id}
                  {...field}
                  formik={formik}
                  XS={12}
                  MD={4}
                />
              ))}

              {/* STATUS */}
              <Grid
                item
                xs={12}
                md={2}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  justifyContent: "flex-end",
                  flexWrap: "wrap", // para que se envuelva en caso de que no haya espacio suficiente
                }}
              >
                <Chip
                  label={`Status: ${
                    formik.values.status == 1
                      ? "Estado inicial"
                      : "Segundo estadio"
                  }`}
                  size="string"
                  chipcolor="orange"
                />
              </Grid>

              {/* ESPACIO DE RELLENO */}
              <Grid item md={0}></Grid>

              {/* RADIO DE MONEDA LOCAL */}
              <Grid item xs={12} md={1.7} align="right">
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

              {/* RADIO DEL IVA */}
              <Grid item xs={12} md={1.7} align="right">
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

              {/* TIPO DE CAMBIO */}
              <Grid item xs={12} md={1} align="right">
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
              {/* <Grid item xs={12} md={2}>
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
              </Grid> */}

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

              

              {/* FECHA DE FACTURACION */}
              {/* <Grid item xs={12} md={2} align="right">
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
              </Grid> */}

              {/* DETALLE DE PRESUPUESTADOR */}
              {/* <Grid item xs={12}>
                <Divider />
              </Grid> */}

                  {
                    //COMPONENTE DE INPUTS que maneja la data de cellInput *
                    cellInput.map((field) => (
                      <CustomSelect
                        key={field.id}
                        {...field}
                        formik={formik}
                        XS={12}
                        MD={2}
                        PaisRegion={formik.values.paisregion_id}
                      />
                    ))
                  }
                  {/* CARGA DE PRODUCTOS */}
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <ProductsPage
                    productsData={productsData}
                    deleteProductHandler={deleteProductHandler}
                    editProductHandler={editProductHandler}
                  />
                  {addItemClicked ? (
                    <Grid item xs={12}>
                      <AddItemPage
                        handleAddItem={handleAddItem}
                        setAddItemClicked={setAddItemClicked}
                        dataHelp={dataHelp}
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
