import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// material-ui
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
    Button,
    Checkbox,
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
    Select,
    Stack,
    TextField
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import '@mui/lab';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { useTheme } from '@mui/material/styles';
// Importa CircularProgress de Material UI
import { CircularProgress } from '@material-ui/core';

// project imports
import AddItemPage from './AddItemPage';
import { gridSpacing } from 'store/constant';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import MainCard from 'ui-component/cards/MainCard';

// third-party
import * as yup from 'yup';
import ProductsPage from './ProductsPage';
import TotalCard from './TotalCard';
import { useFormik } from 'formik';
import useAuth from 'hooks/useAuth';
// Se importan helpers necesarios:
import { BancoHelper } from 'helpers/BancoHelper';
import { CanalHelper } from 'helpers/CanalHelper';
import { CargaHelper } from 'helpers/CargaHelper';
import { CustodiaHelper } from 'helpers/CustodiaHelper';
import { DepositoHelper } from 'helpers/DepositoHelper';
import { DespachanteHelper } from 'helpers/DespachanteHelper';
import { EstimateDetailHelper } from 'helpers/EstimateDetailHelper';
import { FleteHelper } from 'helpers/FleteHelper';
import { FwdtteHelper } from 'helpers/FwdtteHelper';
import SubCard from 'ui-component/cards/SubCard';
import { ProveedoresOemHelper } from 'helpers/ProveedoresOemHelper';
import { PolizaHelper } from 'helpers/PolizaHelper';
import { GestDigitalDocHelper } from 'helpers/GestDigitalDocHelper';
import { NcmHelper } from 'helpers/NcmHelper';
import { PresupuestoHelper } from 'helpers/PresupuestoHelper';
import { TarifasPolizaHelper } from 'helpers/TarifasPolizaHelper';
import { TarifasFwdContHelper } from 'helpers/TarifasFwdContHelper';
import { PesajeContenedor } from '../CreatePresupuesto/PesajeContenedor';
import { CustomSelectUpdate } from './CustomSelectUpdate';
import { useAccessTokenJWT } from 'helpers/useAccessTokenJWT';
import NoAutorizado from 'views/pages/maintenance/NoAutorizado';

// yup validation-schema
const validationSchema = yup.object({
    estnumber: yup.string().required('Invoice Number is Required'),
    versionNumber: yup.string().required('Version Number is Required'),
    own: yup.string().required('Customer Name is Required'),
    dolar: yup.string().required('Tipo de cambio is Required'),
    ivaExcento: yup.string().required('Iva Status is required'),

    // freightFwd: yup.string().required('Pais de origen Status is required'),

    p_gloc_banco: yup.object().shape({
        description: yup.string()
    }).nullable().required('Banco is required'),

    freightType: yup.object().shape({
        description: yup.string()
    }).nullable().required('Carga is required'),

    polizaProv: yup.object().shape({
        description: yup.string()
    }).nullable().required('Poliza is required'),

    p_gloc_tte: yup.object().shape({
        description: yup.string()
    }).nullable().required('Flete is required'),

    p_gloc_cust: yup.object().shape({
        description: yup.string()
    }).nullable().required('Custodia is required'),

    p_gloc_gestdigdoc: yup.object().shape({
        description: yup.string()
    }).nullable().required('Gest Digital is required'),

    oemprove1: yup.object().shape({
        description: yup.string()
    }).nullable().required('Proveedor Oem is required'),

    p_gloc_despa: yup.object().shape({
        description: yup.string()
    }).nullable().required('Despachante is required'),
});

// ==============================|| UPDATE INVOICE ||============================== //
function CreateInvoice() {
    const { user } = useAuth();
    const theme = useTheme();
    const navigate = useNavigate();
    const permisos = useAccessTokenJWT();
    // console.log(permisos);
    const editPresu = permisos.includes('presupuesto:edit');
    console.log(editPresu);

    const { estnumber, vers, presupuesto } = useParams();
    // console.log(estnumber, vers, presupuesto);
    const [open, setOpen] = useState(false);
    const [valueColor, setValueColor] = React.useState('false');
    const [dataHelp, setDataHelp] = useState({});
    const [loading, setLoading] = useState(true);
    const [mensaje, setMensaje] = useState('');
    const [ocultar, setOcultar] = useState(false);

    const dataHelpers = async () => {
        const banco = await BancoHelper.fetchData();
        const carga = await CargaHelper.fetchData();
        const canal = await CanalHelper.fetchData();
        const custodia = await CustodiaHelper.fetchData();
        const deposito = await DepositoHelper.fetchData();
        const despachante = await DespachanteHelper.fetchData();
        const estimate = await EstimateDetailHelper.fetchData();
        const flete = await FleteHelper.fetchData();
        const fwdtte = await FwdtteHelper.fetchData();
        const proveedoresOem = await ProveedoresOemHelper.fetchData();
        const gesDigDoc = await GestDigitalDocHelper.fetchData();
        const NCM = await NcmHelper.fetchData();
        const header = await PresupuestoHelper.readDataById(estnumber);
        const presupuesto = await PresupuestoHelper.readDataEstVers(estnumber, vers, '');
        const poliza = await TarifasPolizaHelper.fetchData();
        const origen = await TarifasFwdContHelper.fetchDataCountryOrigen();

        const objData = {
            banco,
            carga,
            canal,
            custodia,
            deposito,
            despachante,
            estimate,
            flete,
            fwdtte,
            header,
            proveedoresOem,
            poliza,
            gesDigDoc,
            NCM,
            presupuesto,
            origen,
        }
        // setDataHelp(objData);
        setLoading(false);  // Mueve esta línea aquí para establecer loading en false después de que las llamadas a la API se resuelvan
        setDataHelp(objData);
    };

    useEffect(() => {
        dataHelpers();
    }, []);
    // console.log(dataHelp);
    console.log(dataHelp.presupuesto);

    const cellInput = [
        {
            id: 'p_gloc_banco',
            name: 'p_gloc_banco',
            em: 'Seleccione un banco',
            inputLabel: 'Banco',
            data: dataHelp.banco,
            dataType: 'objectArray',
            selected_id: dataHelp?.presupuesto?.id_p_gloc_banco,
            selected_description: dataHelp?.presupuesto?.p_gloc_banco,
        },
        {
            id: 'freightType',
            name: 'freightType',
            em: 'Seleccione una Carga',
            inputLabel: 'Carga',
            data: dataHelp?.carga,
            dataType: 'objectArray',
            selected_id: 23,
            selected_description: dataHelp?.presupuesto?.freightType,
        },
        // { // NO ENTIENDO XQ NO FUNCIONA
        //     id: 'freightFwd',
        //     name: 'freightFwd',
        //     em: 'Seleccione Pais de Origen',
        //     inputLabel: 'Pais de Origen',
        //     data: dataHelp?.origen || '',
        //     dataType: 'stringArray',
        //     selected_id: 1,
        //     selected_description: dataHelp?.presupuesto?.freightFwd,
        // },
        {
            id: 'polizaProv',
            name: 'polizaProv',
            em: 'Seleccione un Poliza',
            inputLabel: 'Poliza',
            data: dataHelp.poliza,
            dataType: 'objectArray',
            selected_id: dataHelp?.presupuesto?.id_PolizaProv,
            selected_description: dataHelp?.presupuesto?.polizaProv,
        },
        {
            id: 'p_gloc_tte',
            name: 'p_gloc_tte',
            em: 'Seleccione un Flete',
            inputLabel: 'Flete',
            data: dataHelp.flete,
            dataType: 'objectArray',
            selected_id: dataHelp?.presupuesto?.id_p_gloc_tte,
            selected_description: dataHelp?.presupuesto?.p_gloc_tte,
        },
        {
            id: 'p_gloc_cust',
            name: 'p_gloc_cust',
            em: 'Seleccione un Custodia',
            inputLabel: 'Custodia',
            data: dataHelp.custodia,
            dataType: 'objectArray',
            selected_id: dataHelp?.presupuesto?.id_p_gloc_cust,
            selected_description: dataHelp?.presupuesto?.p_gloc_cust,
        },
        {
            id: 'p_gloc_gestdigdoc',
            name: 'p_gloc_gestdigdoc',
            em: 'Seleccione una Gest. Digital',
            inputLabel: 'Gestion DIgital',
            data: dataHelp.gesDigDoc,
            dataType: 'objectArray',
            selected_id: dataHelp?.presupuesto?.id_p_gloc_gestdigdoc,
            selected_description: dataHelp?.presupuesto?.p_gloc_gestdigdoc,
        },
        {
            id: 'oemprove1',
            name: 'oemprove1',
            em: 'Seleccione un Proveedor',
            inputLabel: 'Proveedores Oem',
            data: dataHelp.proveedoresOem,
            dataType: 'objectArray',
            selected_id: dataHelp?.presupuesto?.id_oemprove1,
            selected_description: dataHelp?.presupuesto?.oemprove1,
        },
        {
            id: 'p_gloc_despa',
            name: 'p_gloc_despa',
            em: 'Seleccione un Despachante',
            inputLabel: 'Despachante',
            data: dataHelp.despachante,
            dataType: 'objectArray',
            selected_id: dataHelp?.presupuesto?.id_p_gloc_despa,
            selected_description: dataHelp?.presupuesto?.p_gloc_despa,
        },
    ];
    console.log(dataHelp);

    const formik = useFormik({
        initialValues: {
            estnumber: estnumber,
            versionNumber: parseInt(vers) + 1,
            own: user.name,
            ArticleFamily: '',
            ivaExcento: 'true',
            freightType: null,
            freightFwd: null,
            polizaProv: null,
            dolar: '',
            pesoTotal: 0,
            p_gloc_banco: '',
            p_gloc_fwder: 'No aplica', //proveedor local
            p_gloc_term: 'No aplica',
            p_gloc_despa: null,
            p_gloc_tte: null,
            p_gloc_cust: null,
            p_gloc_gestdigdoc: null,

            oemprove1: null,
            oemprove2: '',
            oemprove3: '',
            oemprove4: '',
            oemprove5: '',
            oemprove6: '',
            oemprove7: '',

            id_PolizaProv: 1,
            id_p_gloc_banco: null,
            id_p_gloc_fwder: 1,
            id_p_gloc_term: 1,
            id_p_gloc_despa: 1,
            id_p_gloc_tte: 1,
            id_p_gloc_cust: 1,
            id_p_gloc_gestdigdoc: 1,

            id_oemprove1: 1,
            id_oemprove2: 1,
            id_oemprove3: 1,
            id_oemprove4: 1,
            id_oemprove5: 1,
            id_oemprove6: 1,
            id_oemprove7: 1
        },
        validationSchema,
        //configuracion de formik para validar cuando envio el formulario y no al iniciar
        validateOnMount: false,
        validateOnChange: false,
        validateOnBlur: true,
        onSubmit: (values) => {
            setOcultar(true);
            try {
                const postData = {
                    'estHeaderDB': {
                        ...values, // Incluye los valores del formulario (cabecera)
                        ArticleFamily: productsData[0].modelo || 'Sin Detalle de familia',
                        description: productsData[0].modelo || 'Sin Detalle de familia',
                        ivaExcento: values.ivaExcento === 'true', // Convierte el string a booleano

                        polizaProv: values.polizaProv ? values.polizaProv.description : '',
                        id_PolizaProv: values.polizaProv ? values.polizaProv.id : 1,

                        p_gloc_banco: values.p_gloc_banco ? values.p_gloc_banco.description : '',
                        id_p_gloc_banco: values.p_gloc_banco ? values.p_gloc_banco.id : 3,  // valor harcodeado

                        freightType: values.freightType ? values.freightType.description.replace(/\s/g, '') : '', // Recupera la descripción

                        // fwder no parece ir ni venir ..... OJO
                        //p_gloc_fwder: values.p_gloc_fwder ? values.p_gloc_fwder : '',
                        //id_p_gloc_fwder: values.p_gloc_fwder ? values.p_gloc_fwder.id : 1, // proveedor local solo mostrar el id

                        freightFwd: values.freightFwd ? values.freightFwd : "CHINA",

                        id_p_gloc_term: 1,

                        p_gloc_despa: values.p_gloc_despa ? values.p_gloc_despa.description : '',
                        id_p_gloc_despa: values.p_gloc_despa ? values.p_gloc_despa.id : 1, // Recupera el id,

                        p_gloc_tte: values.p_gloc_tte ? values.p_gloc_tte.description : '',
                        id_p_gloc_tte: values.p_gloc_tte ? values.p_gloc_tte.id : 1,

                        p_gloc_cust: values.p_gloc_cust ? values.p_gloc_cust.description : '',
                        id_p_gloc_cust: values.p_gloc_cust ? values.p_gloc_cust.id : 1,

                        p_gloc_gestdigdoc: values.p_gloc_gestdigdoc ? values.p_gloc_gestdigdoc.description : '',
                        id_p_gloc_gestdigdoc: values.p_gloc_gestdigdoc ? values.p_gloc_gestdigdoc.id : 1,

                        oemprove1: values.oemprove1 ? values.oemprove1.description : '',
                        id_oemprove1: values.oemprove1 ? values.oemprove1.id : 1,

                        id_oemprove2: 1,
                        id_oemprove3: 1,
                        id_oemprove4: 1,
                        id_oemprove5: 1,
                        id_oemprove6: 1,
                        id_oemprove7: 1

                    },
                    estDetailsDB: productsData, // incluyo los productos (details)
                }

                if (values) {
                    setOpen(true);
                }

                // console.log(productsData);
                // console.log(postData);

                // Solo se llama a createData si estDetailsDB tiene algún elemento.
                if (postData.estDetailsDB.length > 0) {
                    PresupuestoHelper.createNewPresupuesto(postData, estnumber);
                    console.log('Creacion exitosa de: ', postData);
                } else {
                    console.log('Error: estDetailsDB no contiene ningún elemento.');
                }
                setProductsData([]);
                setMensaje('Presupuesto creado Exitosamante');
                formik.resetForm();
            } catch (error) {
                setOpen(true);
                setMensaje('Debe de ingresar un Producto');
                console.log('Error', error);
            };

        }
    });

    // Carga los elementos del estado inicial una vez llegado la dataHelp
    useEffect(() => {
        if (dataHelp.presupuesto) {
            formik.setFieldValue('dolar', dataHelp?.presupuesto?.dolar);
        }
        /*try {
            if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
                formik.setFieldValue('estnumber', dataHelp.presupuesto[dataHelp.presupuesto.length - 1]);
            };
 
            if (dataHelp.presupuesto) {
                formik.setFieldValue('dolar', dataHelp?.presupuesto?.dolar);
            }
 
            if (dataHelp.presupuesto) {
                formik.setFieldValue('dolar', dataHelp?.presupuesto?.dolar);
            }
 
            if (dataHelp.presupuesto) {
                formik.setFieldValue('p_gloc_banco', dataHelp?.header?.p_gloc_banco);
            }
 
            if (dataHelp.presupuesto) {
                formik.setFieldValue('freightFwd', dataHelp?.header?.freightFwd);
            }
 
            if (dataHelp.presupuesto) {
                formik.setFieldValue('freightType', dataHelp?.header?.freightType);
            }
 
            if (dataHelp.presupuesto) {
                formik.setFieldValue('polizaProv', dataHelp?.header?.polizaProv);
            }
            console.log(formik.values)
        } catch (error) {
        console.log(error);
        }*/
        //formik.values.p_gloc_banco=dataHelp?.presupuesto?.p_gloc_banco;
        //console.log(formik);
        // console.log(dataHelp);
    }, [dataHelp]);


    const [allAmounts, setAllAmounts] = useState({
        subTotal: 0,
        appliedTaxValue: 0.1,
        appliedDiscountValue: 0.05,
        taxesAmount: 0,
        discountAmount: 0,
        totalAmount: 0
    });


    const [productsData, setProductsData] = useState([]);
    const [valueBasic, setValueBasic] = React.useState(new Date());
    const [addItemClicked, setAddItemClicked] = useState(false);

    var dummy = { id: 38, description: "Elemar" };

    // for calculating cost of all orders
    const getTotalAmounts = () => {
        const amounts = {
            subTotal: 0,
            appliedTaxValue: 0.1,
            appliedDiscountValue: 0.05,
            taxesAmount: 0,
            discountAmount: 0,
            totalAmount: 0
        };
        productsData.forEach((item) => {
            amounts.subTotal += item.total;
        });
        amounts.taxesAmount = amounts.subTotal * amounts.appliedTaxValue;
        amounts.discountAmount = (amounts.subTotal + amounts.taxesAmount) * amounts.appliedDiscountValue;
        amounts.totalAmount = amounts.subTotal + amounts.taxesAmount - amounts.discountAmount;
        setAllAmounts(amounts);
    };

    // calculates costs when order-details change
    useEffect(() => {
        getTotalAmounts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productsData]);

    // to delete row in order details
    const deleteProductHandler = (id) => {
        setProductsData(productsData.filter((item) => item.id !== id));
    };

    // Dialog Handler
    const handleDialogOk = () => {
        setOpen(false);
        navigate('/estimate/estimate-list');
    };

    // add item handler
    const handleAddItem = (addingData) => {
        setProductsData([
            ...productsData,
            {
                id: addingData.id,
                modelo: addingData.modelo,
                // description: addingData.desc,
                cantPcs: addingData.selectedQuantity,
                cbmxCaja: addingData.cbmxCaja,
                fobUnit: addingData.amount,
                ncm: addingData.code,
                total: addingData.totalAmount,
                pcsxCaja: addingData.pcsxCaja,
                pesoUnitxCaja: addingData.pesoUnitxCaja,

            }
        ]);
        console.log(addingData);

        setAddItemClicked(false);
    };

    useEffect(() => {
        if (dataHelp.presupuesto) {

            setProductsData(dataHelp.presupuesto.estDetails);
            getTotalAmounts();
        };
    }, [dataHelp]);

    return (
        <>
            {
                !editPresu ?
                    (
                        <NoAutorizado />
                    ) :
                    (

                        <MainCard title="Actualiza Presupuesto">
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
                                <AnimateButton>
                                    <Button variant="contained" onClick={() => navigate('/estimate/estimate-list')}>
                                        Volver a la lista
                                    </Button>
                                </AnimateButton>
                            </div>
                            {loading ? (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100vh'
                                }}>
                                    <CircularProgress />
                                </div>
                            ) : (
                                <form onSubmit={formik.handleSubmit}>
                                    <Grid container spacing={gridSpacing}>

                                        {/* CABECERA DE PRESUPUESTADOR */}
                                        {/* NUM DE FACTURA */}
                                        <Grid item xs={12} md={2}>
                                            <Stack>
                                                <InputLabel required>#</InputLabel>
                                                <TextField
                                                    id="estnumber"
                                                    name="estnumber"
                                                    disabled
                                                    value={formik.values.estnumber}
                                                    onBlur={formik.handleBlur}
                                                    error={formik.touched.estnumber && Boolean(formik.errors.estnumber)}
                                                    helperText={formik.touched.estnumber && formik.errors.estnumber}
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
                                                    id="versionNumber"
                                                    name="versionNumber"
                                                    disabled
                                                    value={formik.values.versionNumber}
                                                    onBlur={formik.handleBlur}
                                                    error={formik.touched.versionNumber && Boolean(formik.errors.versionNumber)}
                                                    helperText={formik.touched.versionNumber && formik.errors.versionNumber}
                                                    onChange={formik.handleChange}
                                                    fullWidth
                                                    placeholder="Version #"
                                                />
                                            </Stack>
                                        </Grid>

                                        {/* ESPACIO DE RELLENO */}
                                        <Grid item md={2}></Grid>

                                        {/* RADIO DEL IVA */}
                                        <Grid item xs={12} md={2} align='right'>
                                            <InputLabel required>Iva Exento</InputLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    row
                                                    aria-label="ivaExcento"
                                                    value={valueColor}
                                                    onChange={(e) => setValueColor(e.target.value)}
                                                    name="row-radio-buttons-group"
                                                >
                                                    <FormControlLabel
                                                        value="true"
                                                        control={
                                                            <Radio
                                                                sx={{
                                                                    color: theme.palette.primary.main,
                                                                    '&.Mui-checked': { color: theme.palette.primary.main }
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
                                                                    '&.Mui-checked': { color: theme.palette.error.main }
                                                                }}
                                                            />
                                                        }
                                                        label="No"
                                                    />
                                                </RadioGroup>
                                            </FormControl>
                                        </Grid>

                                        {/* TIPO DE CAMBIO */}
                                        <Grid item xs={12} md={2} align='right'>
                                            <Stack>
                                                <InputLabel required>Dolar</InputLabel>
                                                <TextField
                                                    id="dolar"
                                                    name="dolar"
                                                    type='number'
                                                    value={formik.values.dolar}
                                                    onBlur={formik.handleBlur}
                                                    error={formik.touched.dolar && Boolean(formik.errors.dolar)}
                                                    helperText={formik.touched.dolar && formik.errors.dolar}
                                                    onChange={formik.handleChange}
                                                    fullWidth
                                                    placeholder="$$$"
                                                    inputProps={{ style: { textAlign: 'right' } }} // Aquí se alinea el texto a la derecha
                                                />
                                            </Stack>
                                        </Grid>

                                        {/* FECHA DE FACTURACION */}
                                        <Grid item xs={12} md={2} align='right'>
                                            <Stack>
                                                <InputLabel required>Fecha de Facturacion</InputLabel>
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <DatePicker
                                                        inputFormat="dd/MM/yyyy"
                                                        renderInput={(props) => <TextField fullWidth {...props} />}
                                                        value={valueBasic}
                                                        disabled
                                                        onChange={(newValue) => {
                                                            setValueBasic(newValue);
                                                        }}
                                                    />
                                                </LocalizationProvider>
                                            </Stack>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Divider />
                                        </Grid>

                                        {/* Componente CustomSelectUpdate */}
                                        {
                                            dataHelp.presupuesto && cellInput.map(input => (
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
                                                />
                                            ))
                                        }

                                        {/* DETALLE DE PRESPUESTADOR */}

                                        {/* SELECT PAIS ORIGEN freigthFwd */}
                                        {/* <Grid item xs={12} md={3}>
                                <Stack>
                                    <InputLabel required>Pais de Origen</InputLabel>
                                    <Select
                                        id="freightFwd"
                                        name="freightFwd"
                                        defaultValue={formik.values.freightFwd || ''}
                                        displayEmpty
                                        value={formik.values.freightFwd}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.freightFwd && Boolean(formik.errors.freightFwd)}
                                        helperText={formik.touched.freightFwd && formik.errors.freightFwd}
                                        onChange={formik.handleChange}
                                        renderValue={(selected) => {
                                            if (!selected) {
                                                selected = {
                                                    id: 1,
                                                    description: dataHelp.presupuesto.freightFwd
                                                }
                                                formik.values.freightFwd = selected.description;
                                                return <em>Seleccione un Pais</em>;
                                            }
                                            return selected;
                                        }}
                                    >
                                        <MenuItem disabled value="">
                                            <em>Seleccione un Pais</em>
                                        </MenuItem>
                                        {
                                            dataHelp.origen && dataHelp.origen[0].length > 0
                                                ? dataHelp.origen[0].map((country, index) =>
                                                    <MenuItem key={index} value={country}>{country}</MenuItem>
                                                )
                                                : <MenuItem value="">Sin datos</MenuItem>
                                        }
                                    </Select>
                                    {formik.errors.freightFwd && <FormHelperText error>{formik.errors.freightFwd}</FormHelperText>}
                                </Stack>
                            </Grid> */}

                                        {/* SELECT Distribuidor Local fwdtte */}
                                        {/* <Grid item xs={12} md={3}>
                            <Stack>
                                <InputLabel required>Destribuidor Local</InputLabel>
                                <Select
                                    id="fwdtte"
                                    name="fwdtte"
                                    defaultValue={formik.values.fwdtte}
                                    value={formik.values.fwdtte}
                                    onChange={formik.handleChange}
                                >
                                    {
                                        // Asegúrate de tener los datos en un estado o prop
                                        // Aquí estoy asumiendo que los datos están en un estado llamado `data`
                                        dataHelp.fwdtte && dataHelp.fwdtte.length > 0
                                            ? dataHelp.fwdtte.map((item) =>
                                                <MenuItem key={item.id} value={item}>{item.description}</MenuItem>
                                            )
                                            : <MenuItem value="">Sin datos</MenuItem>
                                    }
                                </Select>
                                {formik.errors.fwdtte && <FormHelperText error>{formik.errors.fwdtte}</FormHelperText>}
                            </Stack>
                        </Grid> */}


                                        {/* Detalle de los productos segun presupuestador a actualizar */}
                                        {/* CARGA DE PRODUCTOS */}
                                        <Grid item xs={12}>
                                            <Divider />
                                        </Grid>

                                        <ProductsPage productsData={productsData} deleteProductHandler={deleteProductHandler} />

                                        {addItemClicked ? (
                                            <Grid item xs={12}>
                                                <AddItemPage handleAddItem={handleAddItem} setAddItemClicked={setAddItemClicked} dataHelp={dataHelp} />
                                            </Grid>
                                        ) : (
                                            <Grid item>
                                                <Button variant="text" onClick={() => setAddItemClicked(true)}>
                                                    + Add Item
                                                </Button>
                                            </Grid>
                                        )}

                                        <Grid item xs={12}>
                                            <Divider />
                                        </Grid>

                                        {/* TARJETA TOTALES */}
                                        {/* <TotalCard productsData={productsData} allAmounts={allAmounts} /> */}

                                        {/* <Grid item xs={12}>
                            <Stack>
                                <InputLabel required>Terms and Condition:</InputLabel>
                                <TextField
                                    fullWidth
                                    id="customerAddress"
                                    name="customerAddress"
                                    defaultValue="I acknowledge terms and conditions."
                                    multiline
                                    placeholder="Enter Address"
                                />
                            </Stack>
                        </Grid> */}

                                        {/* PESAJE CONTENEDORES */}
                                        {
                                            ocultar ? (
                                                ''
                                            ) : (
                                                <PesajeContenedor productsData={productsData} tipoContenedor={formik.values.freightType} />
                                            )
                                        }

                                        <Grid item xs={12}>
                                            <Divider />
                                        </Grid>

                                        <Grid item sx={{ display: 'flex', justifyContent: 'center' }} xs={12}>
                                            {
                                                !editPresu ? (
                                                    <>
                                                        <Button variant="contained" type="submit" title='Debe de tener permisos para editar presupuesto' disabled>
                                                            Presupuestar
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Button variant="contained" type="submit" title='Debe de tener permisos para editar presupuesto'>
                                                            Presupuestar
                                                        </Button>
                                                    </>
                                                )
                                            }
                                        </Grid>
                                        <Grid item>
                                            <Dialog open={open}>
                                                <DialogContent>
                                                    <DialogContentText sx={{ fontWeight: 500, color: `secondary.dark` }}>
                                                        {mensaje}
                                                    </DialogContentText>
                                                </DialogContent>
                                                <DialogActions sx={{ pr: '20px' }}>
                                                    <Button autoFocus variant="contained" onClick={handleDialogOk}>
                                                        Ok
                                                    </Button>
                                                </DialogActions>
                                            </Dialog>
                                        </Grid>
                                    </Grid>
                                </form>)
                            }
                        </MainCard>
                    )

            }
        </>
    );
}
export default CreateInvoice;