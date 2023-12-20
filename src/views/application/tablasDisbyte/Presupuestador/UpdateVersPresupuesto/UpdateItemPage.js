import PropTypes from "prop-types";
import { forwardRef, useEffect, useRef, useState } from "react";

// material-ui
import { useTheme, styled } from "@mui/material/styles";
import {
  Button,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Slide,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { makeStyles } from "@material-ui/core";

// project imports
import { gridSpacing } from "store/constant";
import AnimateButton from "ui-component/extended/AnimateButton";

// assets
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import CloseIcon from "@mui/icons-material/Close";

import Product4 from "assets/images/widget/prod4.jpg";
import { UtilidadesHelper } from "helpers/UtilidadesHelper";
import { SwitchIOS } from "../CreatePresupuesto/SwitchIOS";
import AutoCompleteTextField from "../CreatePresupuesto/AutoCompleteTextField";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { Box } from "@mui/system";

// styles
const ImageWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  borderRadius: "4px",
  cursor: "pointer",
  width: 55,
  height: 55,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: theme.palette.background.default,
  "& > svg": {
    verticalAlign: "sub",
    marginRight: 6,
  },
}));

// product category options
const categories = [
  {
    value: "1",
    label: "Iphone 12 Pro Max",
  },
  {
    value: "2",
    label: "Iphone 11 Pro Max",
  },
  {
    value: "3",
    label: "Nokia",
  },
  {
    value: "4",
    label: "Samsung",
  },
];

// animation
const Transition = forwardRef((props, ref) => (
  <Slide direction="left" ref={ref} {...props} />
));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  chip: {
    margin: 2,
  },
};

// tags list & style
const tagNames = [
  "Html",
  "Scss",
  "Js",
  "React",
  "Ionic",
  "Angular",
  "css",
  "Php",
  "View",
];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

let counter = 0; // Esto debería estar fuera de la función del componente para que no se reinicie en cada render

// ==============================|| PRODUCT ADD DIALOG ||============================== //
const UpdateItemPage = ({
  handleAddItem,
  open,
  handleCloseDialog,
  dataHelp,
  rowUpdate = null,
  formik = null,
  ProductsDisbyte = null,
}) => {

  const theme = useTheme();

  const [producto, setProductos] = useState();
  useState(() => {
    if (dataHelp.ProductosDisbyte) {
      const opciones = dataHelp?.ProductosDisbyte.map((product) => ({
        title: product.name,
        ...product,
      }));
      setProductos(opciones);
    }
  }, [ProductsDisbyte]);

  let ordenProveedor = ["Sin Proveedor"];

  const [progress, setProgress] = useState(0);
  const progressRef = useRef(() => {});
  useEffect(() => {
    progressRef.current = () => {
      if (progress > 100) {
        setProgress(0);
      } else {
        const diff = Math.random() * 10;
        setProgress(progress + diff);
      }
    };
  });

  // handle tag select
  const [personName, setPersonName] = useState([]);
  const handleTagSelectChange = (event) => {
    setPersonName(event?.target.value);
  };

  const [selectedItem, setSelectedItem] = useState({
    id: rowUpdate?.id ? rowUpdate?.id : 0,
    description: rowUpdate?.description ? rowUpdate?.description : 0,
    ncm_id: rowUpdate?.ncm_id ? rowUpdate?.ncm_id : 0,
    gwctn: rowUpdate?.gwctn ? rowUpdate?.gwctn : "",
    proveedores_id: rowUpdate?.proveedores_id ? rowUpdate?.proveedores_id : 10, //por defecto es el sin proveedor
    proveedor_prov: rowUpdate?.proveedor_prov ? rowUpdate?.proveedor_prov : "",
    sku: rowUpdate?.sku ? rowUpdate?.sku : "",
    productowner: rowUpdate?.productowner ? rowUpdate?.productowner : "",
    proforma_invoice: rowUpdate?.proforma_invoice
      ? rowUpdate?.proforma_invoice
      : "",
    comercial_invoice: rowUpdate?.comercial_invoice
      ? rowUpdate?.comercial_invoice
      : "",
    purchaseorder: rowUpdate?.purchaseorder ? rowUpdate?.purchaseorder : "",
    imageurl: rowUpdate?.imageurl ? rowUpdate?.imageurl : "",
    exw_u: rowUpdate?.exw_u ? rowUpdate?.exw_u : 0,
    fob_u: rowUpdate?.fob_u ? rowUpdate?.fob_u : 0,
    qty: rowUpdate?.qty ? rowUpdate?.qty : 0,
    pcsctn: rowUpdate?.pcsctn ? rowUpdate?.pcsctn : 0,
    cbmctn: rowUpdate?.cbmctn ? rowUpdate?.cbmctn : 0,
    gwctn: rowUpdate?.gwctn ? rowUpdate?.gwctn : 0,

    cambios_notas: rowUpdate?.cambios_notas ? rowUpdate?.cambios_notas : "",
    ncm_arancel: rowUpdate?.ncm_arancel ? rowUpdate?.ncm_arancel : 0,
    ncm_te_dta_otro: rowUpdate?.ncm_te_dta_otro
      ? rowUpdate?.ncm_te_dta_otro
      : 0,
    ncm_iva: rowUpdate?.ncm_iva ? rowUpdate?.ncm_iva : 0,
    ncm_ivaad: rowUpdate?.ncm_ivaad ? rowUpdate?.ncm_ivaad : 0,
    gcias: rowUpdate?.gcias ? rowUpdate?.gcias : 0,

    ncm_sp1: rowUpdate?.ncm_sp1 ? rowUpdate?.ncm_sp1 : "",
    ncm_sp2: rowUpdate?.ncm_sp2 ? rowUpdate?.ncm_sp2 : "",
    precio_u: rowUpdate?.precio_u ? rowUpdate?.precio_u : 0,

    extrag_comex1: rowUpdate?.extrag_comex1 ? rowUpdate?.extrag_comex1 : 0,
    extrag_comex2: rowUpdate?.extrag_comex2 ? rowUpdate?.extrag_comex2 : 0,
    extrag_comex3: rowUpdate?.extrag_comex3 ? rowUpdate?.extrag_comex3 : 0,
    extrag_comex_notas: rowUpdate?.extrag_comex_notas
      ? rowUpdate?.extrag_comex_notas
      : "",

    extrag_src1: rowUpdate?.extrag_src1 ? rowUpdate?.extrag_src1 : 0,
    extrag_src2: rowUpdate?.extrag_src2 ? rowUpdate?.extrag_src2 : 0,
    extrag_src_notas: rowUpdate?.extrag_src_notas
      ? rowUpdate?.extrag_src_notas
      : "",

    extrag_finan1: rowUpdate?.extrag_finan1 ? rowUpdate?.extrag_finan1 : 0,
    extrag_finan2: rowUpdate?.extrag_finan2 ? rowUpdate?.extrag_finan2 : 0,
    extrag_finan3: rowUpdate?.extrag_finan3 ? rowUpdate?.extrag_finan3 : 0,
    extrag_finan_notas: rowUpdate?.extrag_finan_notas
      ? rowUpdate?.extrag_finan_notas
      : "",

    costo_u_est: rowUpdate?.costo_u_est ? rowUpdate?.costo_u_est : 0,
    costo_u_prov: rowUpdate?.costo_u_prov ? rowUpdate?.costo_u_prov : 0,
    costo_u: rowUpdate?.costo_u ? rowUpdate?.costo_u : 0,
    updated: false,
    htimestamp: UtilidadesHelper.fechaParaDB(),
    detailorder: rowUpdate?.detailorder ? rowUpdate?.detailorder : 0, //se respeta el valor que llega del BACK
  });

  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [qty, setQty] = useState(0);
  const [errors, setErrors] = useState({
    quantityError: "",
  });

  

  const [NCMList, setNCMList] = useState([]);

  
  useEffect(() => {
    // let paisregion_id = dataHelp?.presupuestoEditable?.estHeader?.paisregion_id;
    let paisregion_id = 5; // harcodeado Mexico

    let updatedList = [];

    if (paisregion_id !== 5 && dataHelp.NCM) {
      updatedList = dataHelp.NCM.map((item) => ({
        id: item.id,
        description: item.description,
        ncm_id: item.id,
        ncm_code: item.code,
      }));
    } else if (dataHelp.NCM_Mex) {
      updatedList = dataHelp.NCM_Mex.map((item) => ({
        id: item.id,
        description: item.description,
        ncm_id: item.id,
        ncm_code: item.code,
      }));
    }

    setNCMList(updatedList);

  }, [dataHelp, formik]);

  const ProveedoresList = dataHelp.proveedoresOem.map((item) => ({
    id: item.id,
    description: item.description,
    // ncm_id: item.id,
    // ncm_code: item.code,
    // gwctn: item.gwctn,
    // cbmctn: item.cbmctn,
    // pcsctn: item.pcsctn,
  }));

  useEffect(() => {
    if (selectedItem?.qty) {
      setQty(selectedItem.qty * selectedQuantity);
    }
  }, [selectedQuantity, selectedItem]);

  const handleChange = (event, type) => {
    const { name, value } = event.target;
    
    if (event.target.name === "quantity") {
      setErrors({
        ...errors,
        quantityError: "negative values not allowed",
      });
      setSelectedQuantity(event.target.value);

    } else {
      let selectedList;
      let selectedData = {};
      if (event.target.name === "ncm_id") {
        selectedList = NCMList;
        selectedData = {
          ncm_id: "id",
          ncm_code: "ncm_code",
          // otros campos relevantes aquí
        };
      } else if (event.target.name === "proveedores_id") {
        selectedList = ProveedoresList;
        selectedData = {
          proveedores_id: "id",
          proovedores_name: "description",
          // otros campos relevantes aquí
        };
      }
      const selectedOption = selectedList?.find((item) => item.id === value);

      let updatedSelectedItem = { ...selectedItem };

      // Si hay un selectedList y un selectedData, actualiza según eso
      if (selectedList && selectedData) {
        Object.keys(selectedData).forEach((key) => {
          updatedSelectedItem[key] = selectedOption[selectedData[key]];
        });
      } else {
        // Actualización general de selectedItem
        if (type === "Number") {
          updatedSelectedItem[name] = parseFloat(value) || value;
        } else {
          // Si el campo es 'imageurl', no convertir a mayúsculas
          if (name === "imageurl") {
            updatedSelectedItem[name] = value;
          } else {
            updatedSelectedItem[name] = value.toUpperCase();
          }
        }
      }
      setSelectedQuantity(event.target.value);
      setSelectedItem(updatedSelectedItem);
    }
  };

  const handleOk = () => {
    let errors = {}; // creo objeto de errores
    // validación de campos
    if (!selectedItem?.proveedores_id) {
      errors.ProveedoresError = "Proveedor is required";

    }
    // // Validacion NCM
    if (!selectedItem?.ncm_id) {
      errors.NCMError = "NCM is required";
    }

    // // Validacion Descripcion
    if (!selectedItem?.description || !selectedItem?.description.trim()) {
      errors.descriptionError = "Description Name is required";
    }

    // // Validacion exw_u
    if (!selectedItem?.exw_u || !selectedItem?.exw_u) {
      // AL INCIAR CON UN VALOR SER NUMERICO SE DEBE DE SACAR EL TRIM
      errors.exw_uError = "Valor exw_u is required";
    }
    // // Validacion exw_u menor a a fob_u
    if (selectedItem?.exw_u > selectedItem?.fob_u) {
      // AL INCIAR CON UN VALOR SER NUMERICO SE DEBE DE SACAR EL TRIM
      errors.exw_uError = "Valor exw_u debe ser menor a FOB u.";
    }
    // // // Validacion exw_u numerico
    if (typeof selectedItem.exw_u !== "number") {
      errors.exw_uError = "Valor exw_u is required";
    }

    // // Validacion Po
    // if (!selectedItem?.sku || !selectedItem?.productowner.trim()) {
    //   errors.productownerError = "Po is required";
    // }

    // // Validacion sku
    if (!selectedItem?.sku || !selectedItem?.sku.trim()) {
      errors.skuError = "Sku is required";
    }
    // // Validacion FOb unitario
    if (!selectedItem?.fob_u || selectedItem?.fob_u < 0) {
      errors.fob_uError = "Valor Fob is required";
    }
    // // Validacion fob_u numerico
    if (typeof selectedItem.fob_u !== "number") {
      errors.fob_uError = "Valor fob_u is required";
    }

    // // Validacion qty cantidad
    if (!selectedItem?.qty || selectedItem?.qty <= 0) {
      errors.qtyError = "Cantidad is required";
    }
    // Validacion qty Entero
    if (!Number.isInteger(selectedItem?.qty)) {
      errors.qtyError = "Cant. PCS Debe de ser un numero entero";
    }

    // // Validacion Vol x caja
    if (!selectedItem?.cbmctn || selectedItem?.cbmctn < 0) {
      errors.cbmctnError = "Vol. x caja is required";
    }
    // Validacion Vol x caja numerico
    if (!selectedItem?.cbmctn || typeof selectedItem.cbmctn !== "number") {
      errors.cbmctnError = "CBM x caja is required";
    }

    // // Validacion Piezas x caja
    if (!selectedItem?.pcsctn || selectedItem?.pcsctn <= 0) {
      errors.pcsctnError = "PSC x caja is required";
    }
    // Validacion Piezas x caja Entero
    if (!Number.isInteger(selectedItem?.pcsctn)) {
      errors.pcsctnError = "PSC x caja is required";
    }

    // // Validacion Peso x caja
    if (!selectedItem?.gwctn || selectedItem?.gwctn < 0) {
      errors.gwctnError = "Peso x caja is required";
    }
    // // Validacion gwctn numerico
    if (typeof selectedItem.gwctn !== "number") {
      errors.gwctnError = "Valor gwctn debe ser numerico";
    }

    // // Validacion Imagen
    if (!selectedItem?.imageurl || !selectedItem?.description.trim()) {
      errors.imageurlError = "Imagen is required";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors); // actualizamos los errores de validación en el estado
      return;
    }

    counter++;
    const data = {
      ...selectedItem,
      //   id: counter, // Aquí es donde generas el nuevo id
      totalAmount: qty,
      selectedQuantity,
    };

    handleAddItem(data, true);
    handleCloseDialog();
  };

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
    alignedLeft: {
      textAlign: "left", // Asegura que el texto esté alineado a la izquierda
    },
  });

  const classes = useStyles();
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const [textFieldSKU, setTextFieldSKU] = useState(true);
  const [mensajeTextFieldSKU, setMensajeTextFieldSKU] = useState(
    "Para ingreso manual de SKU"
  );

  const showSKU = () => {
    textFieldSKU
      ? setMensajeTextFieldSKU("Para listar SKUs")
      : setMensajeTextFieldSKU("Para ingreso manual de SKU");

    setTextFieldSKU(!textFieldSKU);
  };

  const [textFieldProveedor, setTextFieldProveedor] = useState(true);
  const [mensajeTextFieldProveedor, setMensajeTextFieldProveedor] = useState(
    "Para ingreso manual de Proveedor"
  );
  const showProveedor = () => {
    textFieldProveedor
      ? setMensajeTextFieldProveedor("Para listar Proveedores")
      : setMensajeTextFieldProveedor("Para ingreso manual de Proveedor");

    setTextFieldProveedor(!textFieldProveedor);
  };

  //ESTRA GASTOS
  const [showExtraGastos, setShowExtraGastos] = useState(false);
  const [showCostosSourcing, setShowCostosSourcing] = useState(false);
  const [showCostosComex, setShowCostosComex] = useState(false);
  const [showCostosFinan, setShowCostosFinan] = useState(false);

  const { status } = formik.values;

  const ExtraCostosSourcing = [
    {
      id: "extrag_src1",
      name: "extrag_src1",
      em: "Valor 1 [USD]",
      inputLabel: "Valor 1 [USD]",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_src1,
      dataType: "Number",
      Xs_Xd: [12, 3],
    },
    {
      id: "extrag_src2",
      name: "extrag_src2",
      em: "Valor 2 [USD]",
      inputLabel: "Valor 2 [USD]",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_src2,
      dataType: "Number",
    },
    {
      id: "extrag_src_notas",
      name: "extrag_src_notas",
      em: "Notas",
      inputLabel: "Notas",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_src_notas,
      dataType: "String",
      Xs_Xd: [12, 6],
    },
  ];

  const ExtraCostosComex = [
    {
      id: "extrag_comex1",
      name: "extrag_comex1",
      em: "Valor 1 [USD]",
      inputLabel: "Valor 1 [USD]",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_comex1,
      dataType: "Number",
      Xs_Xd: [12, 2],
    },
    {
      id: "extrag_comex2",
      name: "extrag_comex2",
      em: "Valor 2 [USD]",
      inputLabel: "Valor 2 [USD]",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_comex2,
      dataType: "Number",
      Xs_Xd: [12, 2],
    },
    {
      id: "extrag_comex3",
      name: "extrag_comex3",
      em: "Valor 3 [USD]",
      inputLabel: "Valor 3 [USD]",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_comex3,
      dataType: "Number",
      Xs_Xd: [12, 2],
    },
    {
      id: "extrag_comex_notas",
      name: "extrag_comex_notas",
      em: "Notas",
      inputLabel: "Notas",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_comex_notas,
      dataType: "String",
      Xs_Xd: [12, 6],
    },
  ];

  const ExtraCostosFinanciero = [
    {
      id: "extrag_finan1",
      name: "extrag_finan1",
      em: "Valor 1 [USD]",
      inputLabel: "Valor 1 [USD]",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_finan1,
      dataType: "Number",
      Xs_Xd: [12, 2],
    },
    {
      id: "extrag_finan2",
      name: "extrag_finan2",
      em: "Valor 2 [USD]",
      inputLabel: "Valor 2 [USD]",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_finan2,
      dataType: "Number",
      Xs_Xd: [12, 2],
    },
    {
      id: "extrag_finan3",
      name: "extrag_finan3",
      em: "Valor 3 [USD]",
      inputLabel: "Valor 3 [USD]",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_finan3,
      dataType: "Number",
      Xs_Xd: [12, 2],
    },
    {
      id: "extrag_finan_notas",
      name: "extrag_finan_notas",
      em: "Notas",
      inputLabel: "Notas",
      data: dataHelp?.presupuestoEditable?.estHeader?.extrag_finan_notas,
      dataType: "String",
      Xs_Xd: [12, 6],
    },
  ];

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleCloseDialog}
      sx={{
        "&>div:nth-of-type(3)": {
          justifyContent: "flex-end",
          "&>div": {
            m: 0,
            borderRadius: "0px",
            maxWidth: 1200,
            height: "100%",
            maxHeight: "100%",
          },
        },
      }}
    >
      {open && (
        <>
          <DialogTitle>Actualizar Producto</DialogTitle>
          <DialogContent>
            <Grid container spacing={gridSpacing} sx={{ mt: 0.5 }}>
              {/* SELECCION DE Proveedor de Select */}
              {textFieldProveedor ? (
                <Grid item xs={12} md={6}>
                  <TextField
                    id="proveedores_id"
                    name="proveedores_id"
                    select
                    label="Proveedor"
                    value={selectedItem?.proveedores_id || ""}
                    fullWidth
                    onChange={handleChange}
                    //   helperText="Seleccione Proveedor"
                  >
                    {/* {categories.map((option) => ( */}
                    {UtilidadesHelper.ordenadorDeArrayByDescription(
                      ordenProveedor,
                      dataHelp.proveedoresOem
                    ).map(
                      (
                        option //envio la lista de proovedores con helper para ordenar
                      ) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.description}
                        </MenuItem>
                      )
                    )}
                  </TextField>
                  {errors.ProveedoresError && (
                    <FormHelperText>{errors.ProveedoresError}</FormHelperText>
                  )}{" "}
                </Grid>
              ) : (
                <Grid item xs={12} md={6}>
                  <TextField
                    id="proveedor_prov"
                    name="proveedor_prov"
                    fullWidth
                    label="Proveedor Provisorio*"
                    onChange={handleChange}
                    //   defaultValue="Iphone 11 Pro Max"
                  />
                  {/* {errors.productownerError && (
                  <FormHelperText>{errors.productownerError}</FormHelperText>
                )}{" "} */}
                </Grid>
              )}

              <Tooltip title={mensajeTextFieldProveedor}>
                <Grid item xs={12} md={1}>
                  <SwitchIOS
                    defaultChecked
                    size="small"
                    onChange={showProveedor}
                  />
                  {/* <Checkbox
                    {...label}
                    defaultChecked
                    size="small"
                    onClick={showSKU}
                  /> */}
                </Grid>
              </Tooltip>

              <Grid item xs={12} md={5}>
                <TextField
                  id="productowner"
                  name="productowner"
                  value={selectedItem?.productowner}
                  fullWidth
                  label="Product Owner*"
                  onChange={handleChange}
                  //   defaultValue="Iphone 11 Pro Max"
                />
                {/* {errors.productownerError && (
                  <FormHelperText>{errors.productownerError}</FormHelperText>
                )}{" "} */}
              </Grid>

              {/* AUTOCOMPLETE DE SKU */}
              {textFieldSKU ? (
                <Grid item xs={12} md={6} fullWidth>
                  <AutoCompleteTextField
                    handleChange={handleChange}
                    name="sku*"
                    valorPorDefecto={selectedItem?.sku}
                    ProductsDisbyte={producto}
                  />
                  {errors.skuError && (
                    <FormHelperText>{errors.skuError}</FormHelperText>
                  )}{" "}
                </Grid>
              ) : (
                <Grid item xs={12} md={6}>
                  <TextField
                    id="sku"
                    name="sku"
                    value={selectedItem?.sku}
                    fullWidth
                    label="un Sku*"
                    onChange={handleChange}
                    //   defaultValue="Iphone 11 Pro Max"
                  />
                  {/* {errors.productownerError && (
                  <FormHelperText>{errors.productownerError}</FormHelperText>
                )}{" "} */}
                </Grid>
              )}

              <Tooltip title={mensajeTextFieldSKU}>
                <Grid item xs={12} md={1}>
                  <SwitchIOS defaultChecked size="small" onChange={showSKU} />
                  {/* <Checkbox
                    {...label}
                    defaultChecked
                    size="small"
                    onClick={showSKU}
                  /> */}
                </Grid>
              </Tooltip>

              {/* SELECCION DE NCM */}
              <Grid item xs={12} md={5}>
                <TextField
                  id="ncm_id"
                  name="ncm_id"
                  select
                  label="NCM*"
                  value={selectedItem?.ncm_id || ""}
                  fullWidth
                  noWrap
                  onChange={handleChange}
                  //   helperText="Seleccione Proveedor"
                >
                  {/* {categories.map((option) => ( */}
                  {NCMList.map((option) => (
                    <MenuItem
                      key={option.id}
                      value={option.id}
                      sx={{
                        maxWidth: 700, // o cualquier otro valor que se ajuste a tus necesidades
                        overflow: "hidden", // asegura que el contenido extra esté oculto
                        textOverflow: "ellipsis", // agrega puntos suspensivos al final
                        whiteSpace: "nowrap", // mantiene el texto en una sola línea
                      }}
                    >
                      Code: {option.ncm_code} - {option.description}
                    </MenuItem>
                  ))}
                </TextField>
                {/* {errors.ProveedoresError && (
                  <FormHelperText>{errors.ProveedoresError}</FormHelperText>
                )}{" "} */}
              </Grid>

              <Grid item xs={12} md={2}>
                <TextField
                  id="purchaseorder"
                  name="purchaseorder"
                  value={selectedItem?.purchaseorder}
                  fullWidth
                  label="Purchase Order"
                  onChange={handleChange}
                  //   defaultValue="Iphone 11 Pro Max"
                />
                {/* {errors.productownerError && (
                  <FormHelperText>{errors.productownerError}</FormHelperText>
                )}{" "} */}
              </Grid>

              <Grid item xs={12} md={2}>
                <TextField
                  id="proforma_invoice"
                  name="proforma_invoice"
                  value={selectedItem?.proforma_invoice}
                  fullWidth
                  label="Proforma Invoice"
                  onChange={handleChange}
                  //   defaultValue="Iphone 11 Pro Max"
                />
                {/* {errors.productownerError && (
                  <FormHelperText>{errors.productownerError}</FormHelperText>
                )}{" "} */}
              </Grid>

              <Grid item xs={12} md={2}>
                <TextField
                  id="comercial_invoice"
                  name="comercial_invoice"
                  value={selectedItem?.comercial_invoice}
                  fullWidth
                  label="Comercial Invoice"
                  onChange={handleChange}
                  //   defaultValue="Iphone 11 Pro Max"
                />
                {/* {errors.productownerError && (
                  <FormHelperText>{errors.productownerError}</FormHelperText>
                )}{" "} */}
              </Grid>

              {/* <Grid item xs={12} md={6}>
                <TextField
                  id="sku"
                  name="sku"
                  fullWidth
                  label="Ingrese Sku*"
                  onChange={handleChange}
                  //   defaultValue="Iphone 11 Pro Max"
                />
                {errors.skuError && (
                  <FormHelperText>{errors.skuError}</FormHelperText>
                )}{" "}
              </Grid> */}

              <Grid item xs={12} md={6}>
                <TextField
                  id="description"
                  name="description"
                  value={selectedItem?.description}
                  fullWidth
                  multiline
                  // rows={3}
                  label="Especificacion*"
                  //   defaultValue="Fundamentally redesigned and engineered The Apple Watch display yet."
                  onChange={handleChange}
                />
                {errors.descriptionError && (
                  <FormHelperText>{errors.descriptionError}</FormHelperText>
                )}{" "}
              </Grid>

              {/* BARDCODE */}
              {/* <Grid item xs={12}>
                <TextField
                  id="outlined-basic3"
                  fullWidth
                  label="Barcode*"
                  defaultValue="8390590339828"
                />
              </Grid> */}

              {/* SKU */}
              {/* <Grid item xs={12}>
                <TextField
                  id="outlined-basic4"
                  fullWidth
                  label="SKU*"
                  defaultValue="H8J702729P"
                />
              </Grid> */}

              {/* DATOS VARIOS (CANTIDAD, PRECIO, PESO, NUMBER, DESCUENTO, EXTRA) */}

              {/* VALOR exw_u */}
              <Grid item md={1.5} xs={12}>
                <TextField
                  type="number"
                  id="exw_u"
                  name="exw_u"
                  value={selectedItem?.exw_u || ""}
                  className={`${classes.hideSpinButton} ${classes.alignedLeft}`} // quitar flechas numericas
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  onChange={(e) => {
                    handleChange(e, "Number");
                  }}
                  fullWidth
                  label="EXW U.*"
                  //   defaultValue="0"
                />
                {errors.exw_uError && (
                  <FormHelperText>{errors.exw_uError}</FormHelperText>
                )}{" "}
              </Grid>

              {/* VALOR fob_u */}
              <Grid item md={1.5} xs={12}>
                <TextField
                  type="number"
                  id="fob_u"
                  name="fob_u"
                  value={selectedItem?.fob_u || ""}
                  className={classes.hideSpinButton} // quitar flechas numericas
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  onChange={(e) => {
                    handleChange(e, "Number");
                  }}
                  fullWidth
                  label="FOB U.*"
                  //   defaultValue="Samsung"
                />
                {errors.fob_uError && (
                  <FormHelperText>{errors.fob_uError}</FormHelperText>
                )}{" "}
              </Grid>

              {/* VALOR qty */}
              <Grid item md={1.5} xs={12}>
                <TextField
                  type="number"
                  id="qty"
                  name="qty"
                  value={selectedItem?.qty || ""}
                  className={classes.hideSpinButton} // quitar flechas numericas
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">U.</InputAdornment>
                    ),
                  }}
                  onChange={(e) => {
                    handleChange(e, "Number");
                  }}
                  fullWidth
                  label="QTY*"
                />
                {errors.qtyError && (
                  <FormHelperText>{errors.qtyError}</FormHelperText>
                )}{" "}
              </Grid>

              {/* VALOR pcsctn */}
              <Grid item md={1.5} xs={12}>
                <TextField
                  type="number"
                  id="pcsctn"
                  name="pcsctn"
                  value={selectedItem?.pcsctn || ""}
                  className={classes.hideSpinButton} // quitar flechas numericas
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">U.</InputAdornment>
                    ),
                  }}
                  onChange={(e) => {
                    handleChange(e, "Number");
                  }}
                  fullWidth
                  label="PCSCTN*"
                />
                {errors.pcsctnError && (
                  <FormHelperText>{errors.pcsctnError}</FormHelperText>
                )}{" "}
              </Grid>

              {/* VALOR cbmctn */}
              <Grid item md={1.5} xs={12}>
                <TextField
                  type="number"
                  id="cbmctn"
                  name="cbmctn"
                  value={selectedItem?.cbmctn || ""}
                  className={classes.hideSpinButton} // quitar flechas numericas
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">m3.</InputAdornment>
                    ),
                  }}
                  onChange={(e) => {
                    handleChange(e, "Number");
                  }}
                  fullWidth
                  label="CBMCTN*"
                />
                {errors.cbmctnError && (
                  <FormHelperText>{errors.cbmctnError}</FormHelperText>
                )}{" "}
              </Grid>

              {/* VALOR gwctn */}
              <Grid item md={1.5} xs={12}>
                <TextField
                  type="number"
                  id="gwctn"
                  name="gwctn"
                  fullWidth
                  label="GWCTN"
                  value={selectedItem?.gwctn || ""}
                  className={classes.hideSpinButton} // quitar flechas numericas
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">kg</InputAdornment>
                    ),
                  }}
                  onChange={(e) => {
                    handleChange(e, "Number");
                  }}
                />
                {errors.gwctnError && (
                  <FormHelperText>{errors.gwctnError}</FormHelperText>
                )}{" "}
              </Grid>

              {/* <Grid item md={3} xs={12}>
                <TextField
                  type="number"
                  id="outlined-basic7"
                  fullWidth
                  label="Extra Shipping Free"
                  defaultValue="0"
                />
              </Grid> */}

              {/* VALOR url Imagen */}
              <Grid item xs={12} md={9}>
                <TextField
                  id="imageurl"
                  name="imageurl"
                  value={selectedItem?.imageurl}
                  fullWidth
                  multiline
                  rows={1}
                  label="Url de Imagen"
                  //   defaultValue="Fundamentally redesigned and engineered The Apple Watch display yet."
                  onChange={handleChange}
                />
                {errors.imageurlError && (
                  <FormHelperText>{errors.imageurlError}</FormHelperText>
                )}{" "}
              </Grid>

              {/* CARGA DE IMAGEN */}
              <Grid item xs={3}>
                <Grid container spacing={0}>
                  {/* <Grid item xs={7}>
                    <Typography variant="subtitle1" align="left">
                      Imagen del Producto*
                    </Typography>
                  </Grid> */}
                  <Grid item xs={3}>
                    {/* <div>
                      <TextField
                        type="file"
                        id="file-upload"
                        fullWidth
                        label="Enter SKU"
                        sx={{ display: "none" }}
                      />
                      <InputLabel
                        htmlFor="file-upload"
                        sx={{
                          background: theme.palette.background.default,
                          py: 3.75,
                          px: 0,
                          textAlign: "center",
                          borderRadius: "4px",
                          cursor: "pointer",
                          mb: 3,
                          "& > svg": {
                            verticalAlign: "sub",
                            mr: 0.5,
                          },
                        }}
                      >
                        <CloudUploadIcon /> Drop file here to upload
                      </InputLabel>
                    </div> */}

                    {/* <Grid container spacing={1}> */}

                    {/* <Grid item>
                        <ImageWrapper>
                          <CardMedia
                            component="img"
                            image={Product1}
                            title="Product"
                          />
                        </ImageWrapper>
                      </Grid> */}

                    {/* <Grid item>
                        <ImageWrapper>
                          <CardMedia
                            component="img"
                            image={Product2}
                            title="Product"
                          />
                        </ImageWrapper>
                      </Grid> */}

                    {selectedItem.imageurl == "" ? (
                      <Grid item xs={1}>
                        <ImageWrapper
                          style={{
                            width: "140px",
                            height: "140px",
                            marginLeft: "40px",
                            marginTop: "-80px",
                          }}
                        >
                          <CardMedia
                            component="img"
                            image={Product4}
                            title="Product"
                          />
                          <CircularProgress
                            variant="determinate"
                            value={progress}
                            color="secondary"
                            sx={{
                              position: "absolute",
                              left: "0",
                              top: "0",
                              background: "rgba(255, 255, 255, .8)",
                              width: "100% !important",
                              height: "100% !important",
                              p: 1.5,
                            }}
                          />
                        </ImageWrapper>
                      </Grid>
                    ) : (
                      <Grid item xs={1}>
                        <ImageWrapper
                          style={{
                            width: "160px",
                            height: "160px",
                            marginLeft: "40px",
                            marginTop: "-80px",
                          }}
                        >
                          <CardMedia
                            component="img"
                            image={selectedItem?.imageurl}
                            title="Product"
                          />
                        </ImageWrapper>
                      </Grid>
                    )}

                    {/* <Grid item>
                        <ImageWrapper>
                          <Fab color="secondary" size="small">
                            <CloseIcon />
                          </Fab>
                        </ImageWrapper>
                      </Grid> */}

                    {/* </Grid> */}
                  </Grid>
                </Grid>
              </Grid>

              <Grid
                item
                xs={12}
                style={{
                  marginLeft: "8px",
                  marginTop: "-25px",
                  marginBottom: "-10px",
                }}
              >
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Box display="flex" alignItems="center">
                  <Tooltip
                    title={
                      showExtraGastos ? "Ocultar Gastos" : "Mostrar Gastos"
                    }
                  >
                    <IconButton
                      onClick={() => setShowExtraGastos(!showExtraGastos)}
                    >
                      {showExtraGastos ? (
                        <VisibilityOffOutlinedIcon />
                      ) : (
                        <VisibilityOutlinedIcon />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Typography variant="h3" style={{ marginBottom: "10px" }}>
                    Extra Gastos
                  </Typography>
                </Box>
              </Grid>

              {/* EXTRA COSTO SOURCING */}
              {showExtraGastos && (status === 0 || status === 1) ? (
                <>
                  <Grid
                    item
                    xs={12}
                    style={{
                      marginLeft: "8px",
                      marginTop: "-25px",
                      marginBottom: "-20px",
                    }}
                  >
                    <Typography
                      // color={"green"}
                      variant="h4"
                      style={{ marginTop: "30px" }}
                    >
                      Sourcing
                    </Typography>
                  </Grid>

                  {ExtraCostosSourcing.map((index) => (
                    <Grid
                      item
                      md={index.Xs_Xd?.[1]}
                      xs={index.Xs_Xd?.[0]}
                      key={index.id} // Recuerda siempre añadir una 'key' única al hacer map en React
                    >
                      <TextField
                        type={index.dataType === "Number" ? "number" : "string"}
                        id={index.id}
                        name={index.name}
                        value={selectedItem?.[index.name] || ""}
                        className={classes.hideSpinButton} // quitar flechas numericas
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              {index.dataType === "Number" ? "$" : ""}
                            </InputAdornment>
                          ),
                        }}
                        onChange={(e) => {
                          handleChange(e, index.dataType);
                        }}
                        fullWidth
                        label={index.inputLabel}
                        // defaultValue="Samsung"
                      />
                      {/* 
        {errors.fob_uError && (
          <FormHelperText>{errors.fob_uError}</FormHelperText>
        )} 
        */}
                    </Grid>
                  ))}
                </>
              ) : null}

              {/* EXTRA COSTO Comex */}
              {showExtraGastos && (status === 0 || status === 2) ? (
                <>
                  <Grid
                    item
                    xs={12}
                    style={{
                      marginLeft: "8px",
                      marginTop: "-25px",
                      marginBottom: "-20px",
                    }}
                  >
                    <Typography
                      // color={"green"}
                      variant="h4"
                      style={{ marginTop: "30px" }}
                    >
                      Comex
                    </Typography>
                  </Grid>

                  {ExtraCostosComex.map((index) => (
                    <Grid item md={index.Xs_Xd?.[1]} xs={index.Xs_Xd?.[0]}>
                      <TextField
                        type={index.dataType == "Number" ? "number" : "string"}
                        id={index.id}
                        name={index.name}
                        value={selectedItem?.[index.name] || ""}
                        className={classes.hideSpinButton} // quitar flechas numericas
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              {index.dataType == "Number" ? "$" : ""}
                            </InputAdornment>
                          ),
                        }}
                        onChange={(e) => {
                          handleChange(e, index.dataType);
                        }}
                        fullWidth
                        label={index.inputLabel}
                        //   defaultValue="Samsung"
                      />
                      {/* {errors.fob_uError && (
                    <FormHelperText>{errors.fob_uError}</FormHelperText>
                  )}{" "} */}
                    </Grid>
                  ))}
                </>
              ) : null}

              {/* EXTRA COSTO FINANCIERO */}
              {showExtraGastos && (status === 0 || status === 3) ? (
                <>
                  <Grid
                    item
                    xs={12}
                    style={{
                      marginLeft: "8px",
                      marginTop: "-25px",
                      marginBottom: "-20px",
                    }}
                  >
                    <Typography
                      // color={"green"}
                      variant="h4"
                      style={{ marginTop: "30px" }}
                    >
                      Financiero
                    </Typography>
                  </Grid>

                  {ExtraCostosFinanciero.map((index) => (
                    <Grid item md={index.Xs_Xd?.[1]} xs={index.Xs_Xd?.[0]}>
                      <TextField
                        type={index.dataType == "Number" ? "number" : "string"}
                        id={index.id}
                        name={index.name}
                        value={selectedItem?.[index.name] || ""}
                        className={classes.hideSpinButton} // quitar flechas numericas
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              {index.dataType == "Number" ? "$" : ""}
                            </InputAdornment>
                          ),
                        }}
                        onChange={(e) => {
                          handleChange(e, index.dataType);
                        }}
                        fullWidth
                        label={index.inputLabel}
                        //   defaultValue="Samsung"
                      />
                      {/* {errors.fob_uError && (
                    <FormHelperText>{errors.fob_uError}</FormHelperText>
                  )}{" "} */}
                    </Grid>
                  ))}
                </>
              ) : null}

              {/* TAG Q SE ALIMENTA DE LOS ITEM DECLARADOS EN TAGNAME */}
              {/* <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" align="left">
                      Tags
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <div>
                      <Select
                        id="demo-multiple-chip"
                        multiple
                        fullWidth
                        value={personName}
                        onChange={handleTagSelectChange}
                        input={<Input id="select-multiple-chip" />}
                        renderValue={(selected) => (
                          <div>
                            {typeof selected !== "string" &&
                              selected.map((value) => (
                                <Chip key={value} label={value} />
                              ))}
                          </div>
                        )}
                        MenuProps={MenuProps}
                      >
                        {tagNames.map((name) => (
                          <MenuItem
                            key={name}
                            value={name}
                            style={getStyles(name, personName, theme)}
                          >
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  </Grid>
                </Grid>
              </Grid> */}
            </Grid>
          </DialogContent>
          <DialogActions>
            <AnimateButton>
              <Button variant="contained" onClick={handleOk}>
                Actualizar
              </Button>
            </AnimateButton>
            <Button variant="text" color="error" onClick={handleCloseDialog}>
              Close
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

UpdateItemPage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func,
};

export default UpdateItemPage;
