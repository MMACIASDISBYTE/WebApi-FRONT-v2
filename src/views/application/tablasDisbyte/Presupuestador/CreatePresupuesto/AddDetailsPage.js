import PropTypes from 'prop-types';
import { forwardRef, useEffect, useRef, useState } from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
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
    Grid,
    Input,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    Slide,
    TextField,
    Typography
} from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

import Product1 from 'assets/images/widget/prod1.jpg';
import Product2 from 'assets/images/widget/prod2.jpg';
import Product3 from 'assets/images/widget/prod3.jpg';
import Product4 from 'assets/images/widget/prod4.jpg';
import { UtilidadesHelper } from 'helpers/UtilidadesHelper';

// styles
const ImageWrapper = styled('div')(({ theme }) => ({
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '4px',
    cursor: 'pointer',
    width: 55,
    height: 55,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: theme.palette.background.default,
    '& > svg': {
        verticalAlign: 'sub',
        marginRight: 6
    }
}));

// product category options
const categories = [
    {
        value: '1',
        label: 'Iphone 12 Pro Max'
    },
    {
        value: '2',
        label: 'Iphone 11 Pro Max'
    },
    {
        value: '3',
        label: 'Nokia'
    },
    {
        value: '4',
        label: 'Samsung'
    }
];

// animation
const Transition = forwardRef((props, ref) => <Slide direction="left" ref={ref} {...props} />);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250
        }
    },
    chip: {
        margin: 2
    }
};

// tags list & style
const tagNames = ['Html', 'Scss', 'Js', 'React', 'Ionic', 'Angular', 'css', 'Php', 'View'];

function getStyles(name, personName, theme) {
    return {
        fontWeight: personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium
    };
}

// ==============================|| PRODUCT ADD DIALOG ||============================== //

const AddDetailsPage = ({ open, handleCloseDialog, dataHelp, formik = null }) => {
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
      });

      const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [qty, setQty] = useState(0);
  const [errors, setErrors] = useState({
    quantityError: "",
  });
  console.log(dataHelp.proveedoresOem);
  
  console.log(dataHelp);
  const [NCMList, setNCMList] = useState([]);
  console.log(formik.values.paisregion_id);

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

      

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseDialog}
            sx={{
                '&>div:nth-of-type(3)': {
                    justifyContent: 'flex-end',
                    '&>div': {
                        m: 0,
                        borderRadius: '0px',
                        maxWidth: 450,
                        maxHeight: '100%'
                    }
                }
            }}
        >
            {open && (
                <>
                    <DialogTitle>Add Details</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
                            {/* SELECCION DE Proveedor */}
                            <Grid item xs={12}>
                                <TextField
                                    id="proveedores_id"
                                    name="proveedores_id"
                                    select
                                    label="Select Proveedor"
                                    value={selectedItem?.proveedores_id || ""}
                                    fullWidth
                                    onChange={handleChange}
                                    helperText="Seleccione Proveedor"
                                >
                                    {/* {categories.map((option) => ( */}
                                        {dataHelp.proveedoresOem.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.description}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField id="outlined-basic1" fullWidth label="Ingrese Sku*" defaultValue="Iphone 11 Pro Max" />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    id="outlined-basic2"
                                    fullWidth
                                    multiline
                                    rows={2}
                                    label="Ingrese Descripcion"
                                    defaultValue="Fundamentally redesigned and engineered The Apple Watch display yet."
                                />
                            </Grid>

                            {/* BARDCODE */}
                            <Grid item xs={12}>
                                <TextField id="outlined-basic3" fullWidth label="Barcode*" defaultValue="8390590339828" />
                            </Grid>


                            {/* SKU */}
                            <Grid item xs={12}>
                                <TextField id="outlined-basic4" fullWidth label="SKU*" defaultValue="H8J702729P" />
                            </Grid>


                            {/* DATOS VARIOS (CANTIDAD, PRECIO, PESO, NUMBER, DESCUENTO, EXTRA) */}
                            <Grid item md={6} xs={12}>
                                <TextField
                                    label="Price*"
                                    id="filled-start-adornment1"
                                    value="399"
                                    InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    label="Discount"
                                    id="filled-start-adornment2"
                                    value="10"
                                    InputProps={{ startAdornment: <InputAdornment position="start">%</InputAdornment> }}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField type="number" id="outlined-basic5" fullWidth label="Quantity*" defaultValue="0" />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField id="outlined-basic6" fullWidth label="Brand*" defaultValue="Samsung" />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    label="Weight"
                                    value="0"
                                    InputProps={{ endAdornment: <InputAdornment position="end">kg</InputAdornment> }}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField type="number" id="outlined-basic7" fullWidth label="Extra Shipping Free" defaultValue="0" />
                            </Grid>


                            {/* CARGA DE IMAGEN */}
                            <Grid item xs={12}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1" align="left">
                                            Product Images*
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <div>
                                            <TextField type="file" id="file-upload" fullWidth label="Enter SKU" sx={{ display: 'none' }} />
                                            <InputLabel
                                                htmlFor="file-upload"
                                                sx={{
                                                    background: theme.palette.background.default,
                                                    py: 3.75,
                                                    px: 0,
                                                    textAlign: 'center',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    mb: 3,
                                                    '& > svg': {
                                                        verticalAlign: 'sub',
                                                        mr: 0.5
                                                    }
                                                }}
                                            >
                                                <CloudUploadIcon /> Drop file here to upload
                                            </InputLabel>
                                        </div>
                                        <Grid container spacing={1}>
                                            <Grid item>
                                                <ImageWrapper>
                                                    <CardMedia component="img" image={Product1} title="Product" />
                                                </ImageWrapper>
                                            </Grid>
                                            <Grid item>
                                                <ImageWrapper>
                                                    <CardMedia component="img" image={Product2} title="Product" />
                                                </ImageWrapper>
                                            </Grid>
                                            <Grid item>
                                                <ImageWrapper>
                                                    <CardMedia component="img" image={Product3} title="Product" />
                                                </ImageWrapper>
                                            </Grid>
                                            <Grid item>
                                                <ImageWrapper>
                                                    <CardMedia component="img" image={Product4} title="Product" />
                                                    <CircularProgress
                                                        variant="determinate"
                                                        value={progress}
                                                        color="secondary"
                                                        sx={{
                                                            position: 'absolute',
                                                            left: '0',
                                                            top: '0',
                                                            background: 'rgba(255, 255, 255, .8)',
                                                            width: '100% !important',
                                                            height: '100% !important',
                                                            p: 1.5
                                                        }}
                                                    />
                                                </ImageWrapper>
                                            </Grid>
                                            <Grid item>
                                                <ImageWrapper>
                                                    <Fab color="secondary" size="small">
                                                        <CloseIcon />
                                                    </Fab>
                                                </ImageWrapper>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>



                            {/* TAG Q SE ALIMENTA DE LOS ITEM DECLARADOS EN TAGNAME */}
                            <Grid item xs={12}>
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
                                                        {typeof selected !== 'string' &&
                                                            selected.map((value) => <Chip key={value} label={value} />)}
                                                    </div>
                                                )}
                                                MenuProps={MenuProps}
                                            >
                                                {tagNames.map((name) => (
                                                    <MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
                                                        {name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <AnimateButton>
                            <Button variant="contained">Create</Button>
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
    handleCloseDialog: PropTypes.func
};

export default AddDetailsPage;
