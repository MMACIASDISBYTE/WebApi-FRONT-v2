import PropTypes from "prop-types";
import { forwardRef, useEffect, useRef, useState } from "react"; 

// LISTED: 28_11_2023 16:51
// material-uic 
import { useTheme, styled } from "@mui/material/styles";
import {
  Button,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  InputAdornment,
  MenuItem,
  Slide,
  TextField,
  Tooltip,
} from "@mui/material";
import { makeStyles } from "@material-ui/core";

// project imports
import { gridSpacing } from "store/constant";
import AnimateButton from "ui-component/extended/AnimateButton";

// assets
import Product4 from "assets/images/widget/prod4.jpg";
import { UtilidadesHelper } from "helpers/UtilidadesHelper";
import AutoCompleteTextField from "../Formularios/AutoCompleteTextField";
import { SwitchIOS } from "../SwitchIOS";
import AutoCompleteTextFieldNCM from "../Formularios/AutoCompleteTextFieldNCM";
import { ModalConfirmacion } from "./ModalConfirmacion";
import { contenedorHelper } from "helpers/contenedorHelper";
import { Typography } from "@mui/material";
import { TablaContenedores } from "../Contenedores/TablaContenedores";
import { DetalleContenedorEnDetails } from "../Contenedores/DetalleContenedorEnDetails";
import { gastosLocMexHelper } from "helpers/gastosLocMexHelper";
import { costoHelper } from "helpers/costoHelper";

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

// animation
const Transition = forwardRef((props, ref) => (
  <Slide direction="left" ref={ref} {...props} />
));

let counter = 0; // Esto debería estar fuera de la función del componente para que no se reinicie en cada render

// ==============================|| PRODUCT ADD DIALOG ||============================== //
const AddDetailsPage = ({
  handleAddItem,
  open,
  handleCloseDialog,
  dataHelp,
  formik = null,
  ProductsDisbyte = null,
  productsData = null,
  gastosLocales = null,
  cantidadConte=0,
  limiteConte=1,
}) => {

  const theme = useTheme();

  const [producto, setProductos] = useState();
  useState(() => {
    if (dataHelp.ProductosDisbyte) {
      const opciones = dataHelp?.ProductosDisbyte.map((product) => ({
        title: `${product.codigo} - ${product.name}`,
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

  const [selectedItem, setSelectedItem] = useState({
    id: "",
    description: "",
    ncm_id: 0,
    proveedores_id: 10, //por defecto es el sin proveedor
    proveedor_prov: "",
    sku: "",
    productowner: "",
    proforma_invoice: "",
    comercial_invoice: "",
    purchaseorder: "",
    imageurl: "",
    exw_u: "",
    fob_u: "",
    qty: 0,
    pcsctn: 0,
    cbmctn: 0,
    gwctn: 0,

    cambios_notas: "",
    ncm_arancel: 0,
    ncm_te_dta_otro: 0,
    ncm_iva: 0,
    ncm_ivaad: 0,
    gcias: 0,

    ncm_sp1: "",
    ncm_sp2: "",
    precio_u: 0,

    extrag_comex1: 0,
    extrag_comex2: 0,
    extrag_comex3: 0,
    extrag_comex_notas: "Sin notas",

    extrag_src1: 0,
    extrag_src2: 0,
    extrag_src_notas: "Sin notas",

    extrag_finan1: 0,
    extrag_finan2: 0,
    extrag_finan3: 0,
    extrag_finan_notas: "Sin notas",

    costo_u_est: 0,
    costo_u_prov: 0,
    costo_u: 0,
    updated: false,
    htimestamp: UtilidadesHelper.fechaParaDB(),
    detailorder: 0,
  });

  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [qty, setQty] = useState(0);
  const [errors, setErrors] = useState({
    quantityError: "",
  });

  const [ncmSelItem,setNcmSelectedItem]=useState({});

  //localeStorage con formulario
  useEffect(() => {
    if(selectedItem.description !== '' || selectedItem.sku !== '' || selectedItem.purchaseorder !== '' || selectedItem.comercial_invoice !== '')
    {
        
        localStorage.setItem('formData', JSON.stringify(selectedItem));        
    }

  }, [selectedItem]);


  useEffect(()=>{
    let ncmList=[{}];
   // console.log(gastosLocales);
    if (formik?.values?.paisregion_id != 5 && dataHelp?.NCM!=undefined) 
    {
          //console.log("AA",formik?.values?.paisregion_id);
          ncmList=dataHelp?.NCM;        
    } 
    else if(dataHelp?.NCM_Mex!=undefined)
    {
         // console.log("BB");
          ncmList=dataHelp.NCM_Mex;
    }
    else
    {
        // console.log("nada") ;
    }
    const ncmItem=(ncmList.filter((pos)=>pos.id===selectedItem.ncm_id)[0]);
    setNcmSelectedItem(ncmItem);
    
    //console.log(ncmItem);


  },[selectedItem])

  //si existe cargamos el estado
  useEffect(() => {
    const savedFormData = localStorage.getItem('formData');
    if (savedFormData) {
      setSelectedItem(JSON.parse(savedFormData));
    }
  }, []);

  const [NCMList, setNCMList] = useState([]);

  const [NCMList2, setNCMList2] = useState();
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
      const opciones = dataHelp?.NCM_Mex.map((item) => ({
        title: `Code: ${item.code} - ${item.description}`,
        ...item,
      }));
      setNCMList2(opciones);

    }

    setNCMList(updatedList);
  }, [dataHelp, formik]);

  const ProveedoresList = dataHelp.proveedoresOem.map((item) => ({
    id: item.id,
    description: item.description,
  }));

  useEffect(() => {
    if (selectedItem?.qty) {
      setQty(selectedItem.qty * selectedQuantity);
    }
  }, [selectedQuantity, selectedItem]);

 

  const[fraccionContenedorActual,setFraccionContenedorActual]=useState(0);
  const[itemContenedor,setItemContenedor]=useState(0.0);
  const[alarmaLimiteContenedores,setAlarmaLimiteContenedores]=useState(false);
  const[usaVolumen,setUsaVolumen]=useState(false);
  const[piezasRemanentes,setPiezasRemanentes]=useState(0.0);
  const[costoUFullCont,setCostoUFullCont]=useState(0);

  useEffect(()=>{

  }, [fraccionContenedorActual])

  // Seguimiento en tiempo real de la volumetria del contenedor.
  useEffect(() => {
    let result=contenedorHelper.calculaContenedoresPorItem(selectedItem,formik?.values?.carga_id);
    setItemContenedor(result.itemCont);
    setUsaVolumen(result.usaVol);
    //console.log(itemContenedor,cantidadConte,alarmaLimiteContenedores);
    //console.log(pesoItem,volumenItem,pesoItem/formik?.values?.carga_id.weight,volumenItem/formik?.values?.carga_id.volume,alarmaLimiteContenedores); 
  }, [selectedItem,formik]);

  
  // Caculo de piezas remanentes y fraccion ocupada contenedor actual.
  useEffect(()=>
          {
              let remanente=0;
              let pRemanentes=0;
              //console.log(itemContenedor,limiteConte,cantidadConte);                                           // Esta cond es por que cuando limiteConte=0, esta en modo auto y por lo tanto no hay limite
              if((cantidadConte+itemContenedor)>limiteConte && limiteConte>0)
              {
                setAlarmaLimiteContenedores(true); 
              }
              else
              {
                setAlarmaLimiteContenedores(false);

                setPiezasRemanentes(contenedorHelper.calculaRemanentePiezasTopCont(selectedItem,productsData,formik?.values?.carga_id,limiteConte))
                
              }
              setFraccionContenedorActual((itemContenedor+cantidadConte)-Math.floor(itemContenedor+cantidadConte));
          },[itemContenedor,selectedItem])

   // CALCULO Y ACTUALIZACION DEL COSTO UNITARIO.
   const[costoU,setCostoU]=useState(0);
   useEffect(()=>{
     const gastos={...gastosLocales, extrag_src1 : dataHelp?.presupuestoEditable?.estHeader?.extrag_src1!=undefined?dataHelp?.presupuestoEditable?.estHeader?.extrag_src1:0 , extrag_src2 : dataHelp?.presupuestoEditable?.estHeader.extrag_src2!=undefined?dataHelp?.presupuestoEditable?.estHeader.extrag_src2:0};
     //console.log(dataHelp);
     setCostoU(costoHelper.calculaCostoItem(productsData,selectedItem,formik?.values?.carga_id,gastos,ncmSelItem,limiteConte));
     if(piezasRemanentes>0)
     {
       setCostoUFullCont(costoHelper.calculaCostoItem(productsData,{...selectedItem,qty:selectedItem.qty+piezasRemanentes},formik?.values?.carga_id,gastos,ncmSelItem,limiteConte));
     }
     else
     {
       setCostoUFullCont(0);
     }
   },[productsData,selectedItem,formik,ncmSelItem,piezasRemanentes]);


  const handleChange = (event, type) => {
    const { name, value } = event.target;
    console.log('Valor :', value);
    console.log('tipo de valor :', typeof(value));
    if (name === "quantity") {
      setErrors({
        ...errors,
        quantityError: "negative values not allowed",
      });
      setSelectedQuantity(value);

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
    // if (!selectedItem?.description || !selectedItem?.description.trim()) {
    //   errors.descriptionError = "Commodity is required";
    // }

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

    // Validación de Vol x caja
    if (selectedItem?.cbmctn === undefined || selectedItem?.cbmctn === null || selectedItem?.cbmctn < 0) {
      errors.cbmctnError = "CBM x caja is required";
    }
    // Validacion Vol x caja numerico
    if (!(typeof selectedItem.cbmctn === "number" || selectedItem.cbmctn === '0' || selectedItem.cbmctn === 0)) {
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
    if (!(typeof selectedItem.gwctn === "number" || selectedItem.gwctn === '0')) { // aqui permite tambien el ingreso de 0
      errors.gwctnError = "Valor gwctn debe ser numerico";
    }

    // // Validacion Imagen
    // if (!selectedItem?.imageurl || !selectedItem?.imageurl.trim()) {
    //   errors.imageurlError = "Imagen is required";
    // }

    if (Object.keys(errors).length > 0) {
      setErrors(errors); // actualizamos los errores de validación en el estado
      return;
    }

    counter++;
    const data = {
      ...selectedItem,
      id: counter, // Aquí es donde generas el nuevo id
      totalAmount: qty,
      selectedQuantity,
    };

    handleAddItem(data);
    handleCloseDialog();
    localStorage.removeItem('formData'); //limpia el storage
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
    errorText: {
      color: "red", // Cambia el color a rojo
      fontWeight: "bold", // Hace la letra más fuerte
      // Puedes agregar más estilos si es necesario
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

  const [openModal, setOpenModal] = useState(false);
  
  const openConfirmacion = () => {
    setOpenModal(true);
    // console.log('desde evento confirmacion');
    
  };

  const closeConfirmacion = () => {
    setOpenModal(false);
  }

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
            maxWidth: 800,
            height: "100%",
            maxHeight: "100%",
          },
        },
      }}
    >
      {open && (
        <>
          <DialogTitle>Agregar Producto</DialogTitle>
          <DialogContent>
            <Grid container spacing={gridSpacing} sx={{ mt: -0.5 }}>
              {/* SELECCION DE Proveedor de Select */}
              {textFieldProveedor ? (
                <Grid item xs={12} md={5}>
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
                    <FormHelperText className={classes.errorText}>
                      {errors.ProveedoresError}
                    </FormHelperText>
                  )}{" "}
                </Grid>
              ) : (
                <Grid item xs={12} md={5}>
                  <TextField
                    id="proveedor_prov"
                    name="proveedor_prov"
                    fullWidth
                    label="Proveedor Provisorio*"
                    onChange={handleChange}
                    //   defaultValue="Iphone 11 Pro Max"
                  />
                  {/* {errors.productownerError && (
                  <FormHelperText className={classes.errorText}>{errors.productownerError}</FormHelperText>
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

              {/* <Grid item xs={12} md={5}>
                <TextField
                  id="productowner"
                  name="productowner"
                  value={selectedItem?.productowner} // lo volvemos llamar para que pase en mayuscula
                  fullWidth
                  label="Product Owner*"
                  onChange={handleChange}
                  //   defaultValue="Iphone 11 Pro Max"
                />
                {/* {errors.productownerError && (
                  <FormHelperText className={classes.errorText}>{errors.productownerError}</FormHelperText>
                )}{" "} 
              </Grid>*/}

              {/* AUTOCOMPLETE DE SKU */}
              {textFieldSKU ? (
                <Grid item xs={12} md={5} fullWidth>
                  <AutoCompleteTextField
                    handleChange={handleChange}
                    name="sku"
                    valorPorDefecto={selectedItem?.sku}
                    ProductsDisbyte={producto}
                  />
                  {errors.skuError && (
                    <FormHelperText className={classes.errorText}>
                      {errors.skuError}
                    </FormHelperText>
                  )}{" "}
                </Grid>
              ) : (
                <Grid item xs={12} md={5}>
                  <TextField
                    id="sku"
                    name="sku"
                    value={selectedItem?.sku}
                    fullWidth
                    label="Ingrese un Sku*"
                    onChange={handleChange}
                    //   defaultValue="Iphone 11 Pro Max"
                  />
                  {/* {errors.productownerError && (
                  <FormHelperText className={classes.errorText}>{errors.productownerError}</FormHelperText>
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

              <Grid item xs={12} md={6} fullWidth>
                <AutoCompleteTextFieldNCM
                  handleChange={handleChange}
                  valorPorDefecto={selectedItem?.ncm_id || ""}
                  name="ncm_id"
                  ListaNCM={NCMList2}
                />
                {errors.NCMError && (
                  <FormHelperText className={classes.errorText}>
                    {errors.NCMError}
                  </FormHelperText>
                )}{" "}
              </Grid>

              <Grid item xs={12} md={2}>
                <TextField
                  id="purchaseorder"
                  name="purchaseorder"
                  value={selectedItem?.purchaseorder} //lo volvemos llamar para que pase en mayuscula
                  fullWidth
                  label="Purchase Order"
                  onChange={handleChange}
                  //   defaultValue="Iphone 11 Pro Max"
                />
                {/* {errors.productownerError && (
                  <FormHelperText className={classes.errorText}>{errors.productownerError}</FormHelperText>
                )}{" "} */}
              </Grid>

              <Grid item xs={12} md={2}>
                <TextField
                  id="proforma_invoice"
                  name="proforma_invoice"
                  value={selectedItem?.proforma_invoice} //lo volvemos llamar para que pase en mayuscula
                  fullWidth
                  label="Proforma Invoice"
                  onChange={handleChange}
                  //   defaultValue="Iphone 11 Pro Max"
                />
                {/* {errors.productownerError && (
                  <FormHelperText className={classes.errorText}>{errors.productownerError}</FormHelperText>
                )}{" "} */}
              </Grid>

              <Grid item xs={12} md={2}>
                <TextField
                  id="comercial_invoice"
                  name="comercial_invoice"
                  value={selectedItem?.comercial_invoice} //lo volvemos llamar para que pase en mayuscula
                  fullWidth
                  label="Comercial Invoice"
                  onChange={handleChange}
                  //   defaultValue="Iphone 11 Pro Max"
                />
                {/* {errors.productownerError && (
                  <FormHelperText className={classes.errorText}>{errors.productownerError}</FormHelperText>
                )}{" "} */}
              </Grid>

              <Grid item xs={12} md={12}>
                <TextField
                  id="description"
                  name="description"
                  fullWidth
                  multiline
                  rows={2.5}
                  label="Commodity"
                  value={selectedItem?.description}
                  //   defaultValue="Fundamentally redesigned and engineered The Apple Watch display yet."
                  onChange={handleChange}
                />
                {errors.descriptionError && (
                  <FormHelperText className={classes.errorText}>
                    {errors.descriptionError}
                  </FormHelperText>
                )}{" "}
              </Grid>

              {/* DATOS VARIOS (CANTIDAD, PRECIO, PESO, NUMBER, DESCUENTO, EXTRA) */}
              {/* VALOR exw_u */}
              <Grid item md={2} xs={12}>
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
                  <FormHelperText className={classes.errorText}>
                    {errors.exw_uError}
                  </FormHelperText>
                )}{" "}
              </Grid>

              {/* VALOR fob_u */}
              <Grid item md={2} xs={12}>
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
                  <FormHelperText className={classes.errorText}>
                    {errors.fob_uError}
                  </FormHelperText>
                )}{" "}
              </Grid>

              {/* VALOR qty */}
              <Grid item md={2} xs={12}>
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
                  <FormHelperText className={classes.errorText}>
                    {errors.qtyError}
                  </FormHelperText>
                )}{" "}
              </Grid>

              {/* VALOR pcsctn */}
              <Grid item md={2} xs={12}>
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
                  <FormHelperText className={classes.errorText}>
                    {errors.pcsctnError}
                  </FormHelperText>
                )}{" "}
              </Grid>

              {/* VALOR cbmctn */}
              <Grid item md={2} xs={12}>
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
                  <FormHelperText className={classes.errorText}>
                    {errors.cbmctnError}
                  </FormHelperText>
                )}{" "}
              </Grid>

              {/* VALOR gwctn */}
              <Grid item md={2} xs={12}>
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
                  <FormHelperText className={classes.errorText}>
                    {errors.gwctnError}
                  </FormHelperText>
                )}{" "}
              </Grid>

              {/* VALOR url Imagen */}
              <Grid item xs={12} md={9}>
                <TextField
                  id="imageurl"
                  name="imageurl"
                  fullWidth
                  multiline
                  rows={1}
                  label="Ingrese Url de Imagen"
                  value={selectedItem?.imageurl}
                  //   defaultValue="Fundamentally redesigned and engineered The Apple Watch display yet."
                  onChange={handleChange}
                />
                {errors.imageurlError && (
                  <FormHelperText className={classes.errorText}>
                    {errors.imageurlError}
                  </FormHelperText>
                )}{" "}
              </Grid>


               <Grid item xs={12} md={9}>
                          
                          <Typography
                            color={"grey"}
                            variant="h4"
                            display={"inline"}
                            style={{ marginLeft: "8px" }}
                          >
                            Cant. Contenedores ya usada:
                          </Typography>
                          <Typography
                            color={"black"}
                            variant="h4"
                            display={"inline"}
                            style={{ marginLeft: "8px" }}
                          >
                            {cantidadConte.toFixed(3)}
                          </Typography>
        {/* ------------------------------------------------------- */}
                          <br></br>
                          <Typography
                            color={"grey"}
                            variant="h4"
                            display={"inline"}
                            style={{ marginLeft: "8px" }}
                          >
                            Cant. Contenedores Este Item:
                          </Typography>
                          <Typography
                            color={"black"}
                            variant="h4"
                            display={"inline"}
                            style={{ marginLeft: "8px" }}
                          >
                            {itemContenedor.toFixed(3)}
                          </Typography>
                          <br></br>
        {/* ------------------------------------------------------- */}
                          <Typography
                            color={"grey"}
                            variant="h4"
                            display={"inline"}
                            style={{ marginLeft: "8px" }}
                          >
                            Limite Cont. Ingresado:
                          </Typography>
                          <Typography
                            color={"black"}
                            variant="h4"
                            display={"inline"}
                            style={{ marginLeft: "8px" }}
                          >
                            {limiteConte>0?limiteConte:"Auto"}
                          </Typography>
                          <Typography
                            color={"grey"}
                            variant="h4"
                            display={"inline"}
                            style={{ marginLeft: "8px" }}
                          >
                            tipo:
                          </Typography>
                          <Typography
                            color={"black"}
                            variant="h4"
                            display={"inline"}
                            style={{ marginLeft: "8px" }}
                          >
                            {formik?.values?.carga_id?.description}
                          </Typography>
                          
                          <br></br>

                          <Typography
                            color={"grey"}
                            variant="h4"
                            style={{ marginLeft: "8px" }}
                            display={"inline"}
                          >
                            {"Costo U. (seuo)"}
                          </Typography>
                          <Typography
                            color={"black"}
                            variant="h4"
                            display={"inline"}
                            style={{ marginLeft: "8px" }}
                          >
                            {costoU + " [USD]"}
                </Typography>
                          {/*<Typography
                            color={"grey"}
                            variant="h4"
                            style={{ marginLeft: "8px" }}
                            display={"inline"}
                          >
                            Criterio Evaluacion:
                          </Typography>
                          <Typography
                            color={"black"}
                            variant="h4"
                            display={"inline"}
                            style={{ marginLeft: "8px" }}
                          >
                            {usaVolumen?"Volumen":"Peso"}
                </Typography>*/}

                          <br></br>

                          {alarmaLimiteContenedores==false?
                            <>
                              <Typography
                                  color={"grey"}
                                  variant="h4"
                                  display={"inline"}
                                  style={{ 
                                      /*marginTop: "20px", */
                                      marginLeft: "8px"
                                        }}
                            
                              >
                                    PCS para completar Carga:
                              </Typography>
                              <Typography
                                  color={"black"}
                                  variant="h4"
                                  display={"inline"}
                                  style={{ marginLeft: "8px" }}
                              >
                                  {piezasRemanentes}
                              </Typography>
                              <Typography
                                  color={"grey"}
                                  variant="h4"
                                  display={"inline"}
                                  style={{ marginLeft: "8px" }}
                              >
                                {" @ Costo U.:"}
                              </Typography>
                              <Typography
                                  color={"#478f28"}
                                  variant="h4"
                                  display={"inline"}
                                  style={{ marginLeft: "8px" }}
                              >
                                {costoUFullCont+" [USD]"}
                              </Typography>
                            </>
                          :
                            <Typography
                                color={"red"}
                                variant="h4"
                                display={"inline"}
                                style={{ marginLeft: "8px" }}
                            >
                                {">>>> Limite Excedido <<<"}
                            </Typography>           
                          }

              </Grid>

              {/* CARGA DE IMAGEN */}
              <Grid item xs={3}>
                <Grid container spacing={0}>

                  <Grid item xs={3}>

                    {selectedItem.imageurl === "" ? (
                      <Grid item xs={1}>
                        <ImageWrapper
                          style={{
                            width: "150px",
                            height: "150px",
                            // marginLeft: "30px",
                            marginTop: "-15px",
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
                            width: "150px",
                            height: "150px",
                            // marginLeft: "30px",
                            marginTop: "-15px",
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

              
              <Grid item xs={12} md={7}
                style={{
                  marginTop: "-60px",

                }}>
                <TablaContenedores 
                  porcentaje={fraccionContenedorActual*100}
                  carga={formik?.values?.carga_id}
                  cantidadConte={cantidadConte+itemContenedor}
                  limiteConte={limiteConte}
                />
              </Grid>

            </Grid>

          {/* CONTENEDOR IMAGEN */}
          {/* <Contenedores
            tipoContenedor={formik}
          />  */}

          </DialogContent>
          <DialogActions>
            <AnimateButton>
              <Button variant="contained" onClick={handleOk}>
                Create
              </Button>
            </AnimateButton>
            {/* <Button variant="text" color="error" onClick={handleCloseDialog}> */}
            <Button variant="text" color="error" onClick={openConfirmacion}>
              Close
            </Button>
          </DialogActions>
          {
            openModal && (
              <ModalConfirmacion open={true} close={closeConfirmacion} handleCloseDialog={handleCloseDialog}/>
            )
          }
        </>
      )}
    </Dialog>
  );
};

AddDetailsPage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func,
};

export default AddDetailsPage;
