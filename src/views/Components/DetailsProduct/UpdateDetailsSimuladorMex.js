import PropTypes from "prop-types";
import { forwardRef, useEffect, useRef, useState } from "react";

// material-ui
import { useTheme, styled } from "@mui/material/styles";
import {
  Button,
  CardMedia,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fab,
  FormHelperText,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { makeStyles } from "@material-ui/core";

// project imports
import { gridSpacing } from "store/constant";
import AnimateButton from "ui-component/extended/AnimateButton";
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';

// assets
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";

import Product1 from "assets/images/widget/prod1.jpg";
import Product2 from "assets/images/widget/prod2.jpg";
import Product3 from "assets/images/widget/prod3.jpg";
import Product4 from "assets/images/widget/prod4.jpg";
import { UtilidadesHelper } from "helpers/UtilidadesHelper";
import { SwitchIOS } from "../SwitchIOS";
import AutoCompleteTextField from "../Formularios/AutoCompleteTextField";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { Box, width } from "@mui/system";
import AutoCompleteTextFieldNCM from "../Formularios/AutoCompleteTextFieldNCM";
import { TablaContenedores } from "../Contenedores/TablaContenedores";
import { contenedorHelper } from "helpers/contenedorHelper";
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
  productsData=null,
  ProductsDisbyte = null,
  gastosLocales=null,
  limiteConte = 1,
  cantidadConte = 1,
  costoIdeal = false,
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

  const[cantContUpdt,setCantContUpdt]=useState(0);


  // Aca resto el a la cantidad de contenedores que me envian desde el form principal, el espacio ocupado por el presente articulo
  // Y todo lo calculos en funcion de esta cantidad resultante sumado a la fraccion ocupada x el item presente.
  // Eso es para que pueda reaccionar la cantidad de contenedores en uso mientras se cambia el item. Caso contrario serai el valor fijo
  // calculado antes de abrir el cuadro de update. Y no es intuitivo. Si tengo 0.97 contenedores ocupado por el ar y bajo la cantidad de
  // 3100 a 1, la cantidad de contenedores necesaria debe bajar. Antes mostraba 0.97 estaticamente por que viene desde el freate.
  // Durante un add en el create el prod que se esta agregando no ocupa nada aun y esta bien, pero aca ya existe, tiene una cantidad
  // y ocupa lugar.

  // Este useEffect toma la cantidad de contenedores "TOTAL" que incluye el presente ar que se esta modificando, con su cantidad orig
  // Se resta el contenedor que ocupa y esta es la cantidad de contenedores que se usara para las cuentas (adicionando el espacio corresp
  // a lo que se vaya ingresando en el presente art.)
  useEffect(()=>{

          let cantidadConte2=cantidadConte-contenedorHelper.calculaContenedoresPorItem(rowUpdate,formik?.values?.carga_id).itemCont;
          setCantContUpdt(cantidadConte2);
          console.log(cantidadConte, cantidadConte2);

  },[])

  const [selectedItem, setSelectedItem] = useState({
    id: rowUpdate?.id ? rowUpdate?.id : 0,
    description: rowUpdate?.description ? rowUpdate?.description : 0,
    ncm_id: rowUpdate?.ncm_id ? rowUpdate?.ncm_id : 0,
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

    costo_uest: rowUpdate?.costo_uest ? rowUpdate?.costo_uest : 0,
  });

  const [errors, setErrors] = useState({
    quantityError: "",
  });

  
  const [NCMList, setNCMList] = useState([]);

  const [NCMList2, setNCMList2] = useState();

  const [ncmSelItem,setNcmSelectedItem]=useState({});

  useEffect(()=>{
    let ncmList=[{}];

     
    if (formik?.values?.paisregion_id != 5 && dataHelp?.NCM!=undefined) 
    {
        console.log("DISTINTO");
          ncmList=dataHelp?.NCM;        
    } 
    else if(dataHelp?.NCM_Mex!=undefined)
    {
          console.log("igual");
          ncmList=dataHelp?.NCM_Mex;
    }
    else
    {
          console.log("nada");
    }
    console.log(ncmList);
    const ncmItem=(ncmList.filter((pos)=>pos.id===selectedItem.ncm_id)[0]);
    setNcmSelectedItem(ncmItem);
    console.log(ncmItem);

  },[selectedItem])

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

  const[fraccionContenedorActual,setFraccionContenedorActual]=useState(0);
  const[itemContenedor,setItemContenedor]=useState(0.0);
  const[alarmaLimiteContenedores,setAlarmaLimiteContenedores]=useState(false);
  const[usaVolumen,setUsaVolumen]=useState(false);
  const[piezasRemanentes,setPiezasRemanentes]=useState(0.0);
  const[costoUFullCont,setCostoUFullCont]=useState(0);

  // Seguimiento en tiempo real de la volumetria del contenedor.
   useEffect(() => {
     let result=contenedorHelper.calculaContenedoresPorItem(selectedItem,formik?.values?.carga_id);
     setItemContenedor(result.itemCont);
     setUsaVolumen(result.usaVol);
     console.log(selectedItem,formik.values.carga_id);
     //console.log(itemContenedor,cantidadConte,alarmaLimiteContenedores);
     //console.log(pesoItem,volumenItem,pesoItem/formik?.values?.carga_id.weight,volumenItem/formik?.values?.carga_id.volume,alarmaLimiteContenedores); 
   }, [selectedItem,formik]);

  useEffect(()=>
           {
               let remanente=0;
               let pRemanentes=0;
              console.log(cantContUpdt.itemContenedor,limiteConte);
                                                             // Esta cond es por que cuando limiteConte=0, esta en modo auto y por lo tanto no hay limite
               if((cantContUpdt+itemContenedor)>limiteConte && limiteConte>0)
               {
                 setAlarmaLimiteContenedores(true); 
               }
               else
               {
                 setAlarmaLimiteContenedores(false);

                 setPiezasRemanentes(contenedorHelper.calculaRemanentePiezasTopCont(selectedItem,productsData,formik?.values?.carga_id,limiteConte))
                /* const gastos={...gastosLocales, extrag_src1 : dataHelp?.presupuestoEditable?.estHeader?.extrag_src1 , extrag_src2 : dataHelp?.presupuestoEditable?.estHeader.extrag_src2};
                 setCostoUFullCont(costoHelper.calculaCostoItem(productsData,{...selectedItem,qty:selectedItem.qty+piezasRemanentes},formik?.values?.carga_id,gastos,ncmSelItem));*/
               }
               setFraccionContenedorActual((itemContenedor+cantContUpdt)-Math.floor(itemContenedor+cantContUpdt));
               
           },[itemContenedor,selectedItem,productsData,formik])


  // CALCULO Y ACTUALIZACION DEL COSTO UNITARIO.
  const[costoU,setCostoU]=useState(0);
  useEffect(()=>{
      const gastos={...gastosLocales, extrag_src1 : dataHelp?.presupuestoEditable?.estHeader?.extrag_src1 , extrag_src2 : dataHelp?.presupuestoEditable?.estHeader.extrag_src2};
      //console.log(dataHelp);
      setCostoU(costoHelper.calculaCostoItem(productsData,selectedItem,formik?.values?.carga_id,gastos,ncmSelItem,limiteConte));    
      if(piezasRemanentes)
      {
        setCostoUFullCont(costoHelper.calculaCostoItem(productsData,{...selectedItem,qty:selectedItem.qty+piezasRemanentes},formik?.values?.carga_id,gastos,ncmSelItem,limiteConte));
      }
      else
      {
        setCostoUFullCont(0);
      }
  },[productsData,selectedItem,formik,ncmSelItem,piezasRemanentes]);


 const Calcular = (e, type) =>{
  //console.log('Calcular valor ideal');
  const gastos={...gastosLocales, extrag_src1 : dataHelp?.presupuestoEditable?.estHeader?.extrag_src1 , extrag_src2 : dataHelp?.presupuestoEditable?.estHeader.extrag_src2};
  let selProd=costoHelper.saSolve(productsData,selectedItem,formik?.values?.carga_id,gastos,ncmSelItem,limiteConte);
  //setSelectedItem(costoHelper.saSolve(productsData,selectedItem,formik?.values?.carga_id,gastos,ncmSelItem,limiteConte));
  //formik.setFieldValue("fob_u",selProd.fob_u);
  setSelectedItem(selProd);
  console.log("VEO",selectedItem)
  handleChange(e, 'Number');
 }; 

  const handleChange = (event, type) => {
    const { name, value } = event.target;
    
    if (event.target.name === "quantity") {
      setErrors({
        ...errors,
        quantityError: "negative values not allowed",
      });

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
    //   errors.descriptionError = "Description is required";
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
    if (selectedItem?.gwctn === undefined || selectedItem?.gwctn === null || selectedItem?.gwctn < 0) {
      errors.gwctnError = "Peso x caja is required";
    }
    // // Validacion gwctn numerico
    if (!(typeof selectedItem.gwctn === "number" || selectedItem.gwctn === '0' || selectedItem.cbmctn === 0)) {
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
      //   id: counter, // Aquí es donde generas el nuevo id
      //totalAmount: qty,
      //selectedQuantity,
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

  //ESTRA GASTOS
  const [showExtraGastos, setShowExtraGastos] = useState(true);
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
      Xs_Xd: [12, 5],
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
            maxWidth: 900,
            height: "100%",
            maxHeight: "100%",
          },
        },
      }}
    >
      {open && (
        <>
          <DialogTitle>{dataHelp?.presupuestoEditable?.estHeader?.status>15?"IMPORTADO - Completar Informacion Producto":"Actualizar Producto"}</DialogTitle>
          <DialogContent>
            <Grid container spacing={gridSpacing} sx={{ mt: 0.5 }}>
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
                  value={selectedItem?.productowner}
                  fullWidth
                  label="Product Owner*"
                  onChange={handleChange}
                  disabled={true}
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
                    name="sku*"
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
                    label="un Sku*"
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
                  valorPorDefecto={selectedItem?.ncm_id}
                  name="ncm_id"
                  ListaNCM={NCMList2}
                />
                {errors.NCMError && (
                  <FormHelperText className={classes.errorText}>
                    {errors.NCMError}
                  </FormHelperText>
                )}{" "}
              </Grid>

              {/* SELECCION DE NCM */}
              {/* <Grid item xs={12} md={5}>
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
                  {/* {categories.map((option) => ( 
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
                  <FormHelperText className={classes.errorText}>{errors.ProveedoresError}</FormHelperText>
                )}{" "} 
              </Grid> */}

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
                  <FormHelperText className={classes.errorText}>{errors.productownerError}</FormHelperText>
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
                  <FormHelperText className={classes.errorText}>{errors.productownerError}</FormHelperText>
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
                  <FormHelperText className={classes.errorText}>{errors.productownerError}</FormHelperText>
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
                  <FormHelperText className={classes.errorText}>{errors.skuError}</FormHelperText>
                )}{" "}
              </Grid> */}

              <Grid item xs={12} md={12}>
                <TextField
                  id="description"
                  name="description"
                  value={selectedItem?.description}
                  fullWidth
                  multiline
                  rows={2.5}
                  label="Commodity"
                  //   defaultValue="Fundamentally redesigned and engineered The Apple Watch display yet."
                  onChange={handleChange}
                />
                {errors.descriptionError && (
                  <FormHelperText className={classes.errorText}>
                    {errors.descriptionError}
                  </FormHelperText>
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
                  value={selectedItem?.cbmctn ?? ""}
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
                  value={selectedItem?.gwctn ?? ""}
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
                  <FormHelperText className={classes.errorText}>
                    {errors.imageurlError}
                  </FormHelperText>
                )}{" "}
              </Grid>

              {/* VALOR costo_uest */}
              {costoIdeal && (
                <>
                  <Grid item md={1} xs={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Tooltip title='Calcular costo Objetivo'>
                      <CalculateOutlinedIcon
                      sx={{
                        '&:hover':{color:'green'} //cambia el color al pasar por arriba
                      }}
                        style={{ cursor: 'pointer' }} // Esto cambia el cursor a una manita
                        fontSize="large" // Puedes ajustar el tamaño aquí
                        onClick={Calcular}
                      />
                    </Tooltip>
                  </Grid>
                  <Grid item md={2} xs={12}>
                  <TextField
                    type="number"
                    id="costo_uest"
                    name="costo_uest"
                    fullWidth
                    label="Costo Objetivo"
                    value={selectedItem?.costo_uest ?? ""}
                    className={classes.hideSpinButton} // quitar flechas numericas
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
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
                </>
              )}

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
                            {(cantContUpdt+itemContenedor).toFixed(3)}
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
                          <Typography
                            color={"grey"}
                            variant="h4"
                            style={{ marginLeft: "8px" }}
                            display={"inline"}
                          >
                            {"Costo U. Estimado (seuo)"}:
                          </Typography>
                          <Typography
                            color={"#478f28"}
                            variant="h4"
                            display={"inline"}
                            style={{ marginLeft: "8px" }}
                          >
                            {costoU + "  [USD]"}
                </Typography>
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

                    {selectedItem.imageurl == "" ? (
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
                  cantidadConte={cantContUpdt+itemContenedor}
                  limiteConte={limiteConte}

                />
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
                  <Divider
                    style={{ marginTop: "20px", marginBottom: "10px" }}
                  />
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
          <FormHelperText className={classes.errorText}>{errors.fob_uError}</FormHelperText>
        )} 
        */}
                    </Grid>
                  ))}
                </>
              ) : null}

              {/* EXTRA COSTO Comex */}
              {showExtraGastos
              // && (status === 0 || status === 2) 
              ? (
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
                    <FormHelperText className={classes.errorText}>{errors.fob_uError}</FormHelperText>
                  )}{" "} */}
                    </Grid>
                  ))}
                </>
              ) : null}

              {/* EXTRA COSTO FINANCIERO */}
              {showExtraGastos && (status === 0 || status === 99) ? (
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
                    <FormHelperText className={classes.errorText}>{errors.fob_uError}</FormHelperText>
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
