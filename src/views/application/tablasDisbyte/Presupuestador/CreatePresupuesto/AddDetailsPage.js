import PropTypes from "prop-types";
import { forwardRef, useEffect, useRef, useState } from "react";

// material-ui
import { useTheme, styled } from "@mui/material/styles";
import {
  Button,
  CardMedia,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  FormHelperText,
  Grid,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  TextField,
  Typography,
} from "@mui/material";

// project imports
import { gridSpacing } from "store/constant";
import AnimateButton from "ui-component/extended/AnimateButton";

// assets
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";

import Product1 from "assets/images/widget/prod1.jpg";
import Product2 from "assets/images/widget/prod2.jpg";
import Product3 from "assets/images/widget/prod3.jpg";
import Product4 from "assets/images/widget/prod4.jpg";
import { UtilidadesHelper } from "helpers/UtilidadesHelper";

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
const AddDetailsPage = ({
  handleAddItem,
  open,
  handleCloseDialog,
  dataHelp,
  formik = null,
}) => {
  console.log(dataHelp);
  const theme = useTheme();

  // handle category change dropdown
  // const [currency, setCurrency] = useState(dataHelp?.proveedoresOem[0].id);
  // const handleSelectChange = (event) => {
  //     console.log(event?.target.value);
  //     setCurrency(event?.target.value);
  // };
  // set image upload progress
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

  useEffect(() => {
    const timer = setInterval(() => {
      progressRef.current();
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // handle tag select
  const [personName, setPersonName] = useState([]);
  const handleTagSelectChange = (event) => {
    setPersonName(event?.target.value);
  };

  const [selectedItem, setSelectedItem] = useState({
    id: "",
    description: "",
    ncm_id: 0,
    gwctn: "",
    proveedores_id: null,
    sku: "",
    productowner: "",
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
    extrag_comex_notas: "",

    extrag_local1: 0,
    extrag_local2: 0,

    extrag_finan1: 0,
    extrag_finan2: 0,
    extrag_finan3: 0,
    extrag_finan_notas: "",

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
  //   console.log(dataHelp.proveedoresOem);

  //   console.log(dataHelp);
  const [NCMList, setNCMList] = useState([]);
  //   console.log(formik.values.paisregion_id);

  useEffect(() => {
    // let paisregion_id = dataHelp?.presupuestoEditable?.estHeader?.paisregion_id;
    let paisregion_id = formik?.values?.paisregion_id?.id;
    // console.log(paisregion_id);
    // console.log(formik.values.paisregion_id.id);

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
    // console.log("EVENT ", event);
    // console.log("Type ", type);
    // console.log(event.target.name);
    if (event.target.name === "quantity") {
      setErrors({
        ...errors,
        quantityError: "negative values not allowed",
      });
      setSelectedQuantity(event.target.value);
      //   console.log(value);
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
          updatedSelectedItem[name] = value;
        }
      }
      setSelectedQuantity(event.target.value);
      setSelectedItem(updatedSelectedItem);
    }
  };

  const handleOk = () => {
    console.log("hola");
    let errors = {}; // creo objeto de errores
    // validación de campos
    if (!selectedItem?.proveedores_id) {
      errors.ProveedoresError = "Proveedor is required";
      console.log(selectedItem?.proveedores_id);
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
    if (!selectedItem?.exw_u || !selectedItem?.sku.trim()) {
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

    // // Validacion sku
    if (!selectedItem?.sku || !selectedItem?.productowner.trim()) {
      errors.poError = "Po is required";
    }

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

    console.log(data);
    handleAddItem(data);
  };

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
            maxHeight: "100%",
          },
        },
      }}
    >
      {open && (
        <>
          <DialogTitle>Add Details</DialogTitle>
          <DialogContent>
            <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
              {/* SELECCION DE Proveedor */}
              <Grid item xs={12} md={6}>
                <TextField
                  id="proveedores_id"
                  name="proveedores_id"
                  select
                  label="Select Proveedor"
                  value={selectedItem?.proveedores_id || ""}
                  fullWidth
                  onChange={handleChange}
                  //   helperText="Seleccione Proveedor"
                >
                  {/* {categories.map((option) => ( */}
                  {dataHelp.proveedoresOem.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.description}
                    </MenuItem>
                  ))}
                </TextField>
                {errors.ProveedoresError && (
                  <FormHelperText>{errors.ProveedoresError}</FormHelperText>
                )}{" "}
              </Grid>

              {/* SELECCION DE NCM */}
              <Grid item xs={12} md={6}>
                <TextField
                  id="ncm_id"
                  name="ncm_id"
                  select
                  label="Select NCM"
                  value={selectedItem?.ncm_id || ""}
                  fullWidth
                  onChange={handleChange}
                  //   helperText="Seleccione Proveedor"
                >
                  {/* {categories.map((option) => ( */}
                  {NCMList.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.description} - Code: {option.ncm_code}
                    </MenuItem>
                  ))}
                </TextField>
                {/* {errors.ProveedoresError && (
                  <FormHelperText>{errors.ProveedoresError}</FormHelperText>
                )}{" "} */}
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  id="productowner"
                  name="productowner"
                  fullWidth
                  label="Ingrese Po*"
                  onChange={handleChange}
                  //   defaultValue="Iphone 11 Pro Max"
                />
                {errors.poError && (
                  <FormHelperText>{errors.poError}</FormHelperText>
                )}{" "}
              </Grid>

              <Grid item xs={12} md={6}>
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
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  id="description"
                  name="description"
                  fullWidth
                  multiline
                  rows={1}
                  label="Ingrese Descripcion"
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
              <Grid item md={3} xs={12}>
                <TextField
                  type="number"
                  id="exw_u"
                  name="exw_u"
                  value={selectedItem?.exw_u || ""}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  onChange={(e) => {
                    handleChange(e, "Number");
                  }}
                  fullWidth
                  label="Exw U.*"
                  //   defaultValue="0"
                />
                {errors.exw_uError && (
                  <FormHelperText>{errors.exw_uError}</FormHelperText>
                )}{" "}
              </Grid>

              {/* VALOR fob_u */}
              <Grid item md={3} xs={12}>
                <TextField
                  type="number"
                  id="fob_u"
                  name="fob_u"
                  value={selectedItem?.fob_u || ""}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  onChange={(e) => {
                    handleChange(e, "Number");
                  }}
                  fullWidth
                  label="Fob U.*"
                  //   defaultValue="Samsung"
                />
                {errors.fob_uError && (
                  <FormHelperText>{errors.fob_uError}</FormHelperText>
                )}{" "}
              </Grid>

              {/* VALOR qty */}
              <Grid item md={3} xs={12}>
                <TextField
                  type="number"
                  id="qty"
                  name="qty"
                  value={selectedItem?.qty || ""}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">U.</InputAdornment>
                    ),
                  }}
                  onChange={(e) => {
                    handleChange(e, "Number");
                  }}
                  fullWidth
                  label="Qty*"
                />
                {errors.qtyError && (
                  <FormHelperText>{errors.qtyError}</FormHelperText>
                )}{" "}
              </Grid>

              {/* VALOR pcsctn */}
              <Grid item md={3} xs={12}>
                <TextField
                  type="number"
                  id="pcsctn"
                  name="pcsctn"
                  value={selectedItem?.pcsctn || ""}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">U.</InputAdornment>
                    ),
                  }}
                  onChange={(e) => {
                    handleChange(e, "Number");
                  }}
                  fullWidth
                  label="Pcsctn*"
                />
                {errors.pcsctnError && (
                  <FormHelperText>{errors.pcsctnError}</FormHelperText>
                )}{" "}
              </Grid>

              {/* VALOR cbmctn */}
              <Grid item md={3} xs={12}>
                <TextField
                  type="number"
                  id="cbmctn"
                  name="cbmctn"
                  value={selectedItem?.cbmctn || ""}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">M3.</InputAdornment>
                    ),
                  }}
                  onChange={(e) => {
                    handleChange(e, "Number");
                  }}
                  fullWidth
                  label="Cbmctn*"
                />
                {errors.cbmctnError && (
                  <FormHelperText>{errors.cbmctnError}</FormHelperText>
                )}{" "}
              </Grid>

              {/* VALOR gwctn */}
              <Grid item md={3} xs={12}>
                <TextField
                  type="number"
                  id="gwctn"
                  name="gwctn"
                  fullWidth
                  label="Cbmctn"
                  value={selectedItem?.gwctn || ""}
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
              <Grid item xs={12} md={6}>
                <TextField
                  id="imageurl"
                  name="imageurl"
                  fullWidth
                  multiline
                  rows={1}
                  label="Ingrese Url de Imagen"
                  //   defaultValue="Fundamentally redesigned and engineered The Apple Watch display yet."
                  onChange={handleChange}
                />
                {errors.descriptionError && (
                  <FormHelperText>{errors.descriptionError}</FormHelperText>
                )}{" "}
              </Grid>

              {/* CARGA DE IMAGEN */}
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" align="left">
                      Imagen del Producto*
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
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
                    <Grid container spacing={1}>
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
                        <Grid item>
                          <ImageWrapper>
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
                        <Grid item>
                          <ImageWrapper
                          style={{ width: '120px', height: '120px' }}>
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
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

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
                Create
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

AddDetailsPage.propTypes = {
  open: PropTypes.bool,
  handleCloseDialog: PropTypes.func,
};

export default AddDetailsPage;
