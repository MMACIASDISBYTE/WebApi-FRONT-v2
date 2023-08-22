import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
import { useTheme } from '@mui/material/styles';
import AnimateButton from 'ui-component/extended/AnimateButton';
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

//importacion para poder opacar el placeholder del dolar
import { makeStyles } from '@material-ui/core/styles';
import { UtilidadesHelper } from 'helpers/UtilidadesHelper';
import { PesajeContenedor } from './PesajeContenedor';
const useStyles = makeStyles((theme) => ({
  inputPlaceholder: {
    '&::placeholder': {
      color: 'black',  // Aquí puedes colocar el color que prefieras
      opacity: 1,      // El valor por defecto es 0.54
    },
  },
}));

// yup validation-schema
const validationSchema = yup.object({
    estNumber: yup.string().required('Invoice Number is Required'),
    versionNumber: yup.string().required('Version Number is Required'),
    own: yup.string().required('Customer Name is Required'),
    dolarBillete: yup.string().required('Tipo de cambio is Required'),
    ivaExcento: yup.string().required('Iva Status is required'),
    
    // freightFwd: yup.object().nullable().required('Pais de origen is required'),

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

// ==============================|| CREATE INVOICE ||============================== //
function CreateInvoice() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const classes = useStyles(); // linea para implementar la clase para opacar el placeholder de dolar
    // console.log(user);
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
        const presupuesto = await PresupuestoHelper.fetchData();
        const poliza = await TarifasPolizaHelper.fetchData();
        const origen = await TarifasFwdContHelper.fetchDataCountryOrigen();
        const proximoEstDisponible = await PresupuestoHelper.EstimateDisponibleNum();
        const tipoCambio = await UtilidadesHelper.tipoCambioGeneral();

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
            proveedoresOem,
            poliza,
            gesDigDoc,
            NCM,
            presupuesto,
            origen,
            proximoEstDisponible,
            tipoCambio
        }
        // setDataHelp(objData);
        setLoading(false);  // Mueve esta línea aquí para establecer loading en false después de que las llamadas a la API se resuelvan
        setDataHelp(objData);
        console.log(origen)
    };

    useEffect(() => {
        dataHelpers();
    }, []);
    // console.log(dataHelp);

    const formik = useFormik({
        initialValues: {
            estNumber: '',
            versionNumber: 1,
            own: user.name,
            ArticleFamily: '',
            ivaExcento: 'true',
            freightType: null,
            freightFwd: null,
            polizaProv: null,
            dolarBillete: '',
            pesoTotal: 0,
            p_gloc_banco: null,
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

                        id_p_gloc_fwder: values.fwdtte ? values.fwdtte.id : 1, // proveedor local solo mostrar el id

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

                console.log(postData);
                // console.log(productsData);
                // console.log(postData);

                // Solo se llama a createData si estDetailsDB tiene algún elemento.
                if (postData.estDetailsDB.length > 0) {
                    PresupuestoHelper.createData(postData);
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
            }

        }
    });

    // Carga los elementos del estado inicial una vez llegado la dataHelp
    useEffect(() => {
        if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
            formik.setFieldValue('estNumber', dataHelp.proximoEstDisponible); //traemos el numEstimate disponible
            // formik.setFieldValue('estNumber', dataHelp.presupuesto[dataHelp.presupuesto.length - 1].estNumber + 1);
        }
        if (dataHelp.presupuesto && dataHelp.presupuesto.length > 0) {
            formik.setFieldValue('dolarBillete', dataHelp.tipoCambio.quotes.USDARS);
        }

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
        if (mensaje == 'Presupuesto creado Exitosamante') {
            navigate('/estimate/estimate-list');
        };

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

    return (
        <>
            <MainCard title="Crear Presupuesto">
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <AnimateButton>
                        <Button variant="contained" onClick={() => navigate('/estimate/estimate-list')}>
                            Ir a la lista
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
                            {/* NUM DE FACTURA */}
                            <Grid item xs={12} md={2}>
                                <Stack>
                                    <InputLabel required>#</InputLabel>
                                    <TextField
                                        id="estNumber"
                                        name="estNumber"
                                        disabled
                                        value={formik.values.estNumber}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.estNumber && Boolean(formik.errors.estNumber)}
                                        helperText={formik.touched.estNumber && formik.errors.estNumber}
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
                            {/* RADIO DEL IVA */}
                            <Grid item xs={12} md={3}>
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
                            <Grid item xs={12} md={2}>
                                <Stack>
                                    <InputLabel required>Dolar</InputLabel>
                                    <TextField
                                        id="dolarBillete"
                                        name="dolarBillete"
                                        type='number'
                                        value={formik.values.dolarBillete}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.dolarBillete && Boolean(formik.errors.dolarBillete)}
                                        helperText={formik.touched.dolarBillete && formik.errors.dolarBillete}
                                        onChange={formik.handleChange}
                                        fullWidth
                                        placeholder="$$$"
                                        inputProps={{ style: { textAlign: 'right' }, className: classes.inputPlaceholder }} // Aquí se alinea el texto a la derecha y opacamos el dolar
                                    />
                                </Stack>
                            </Grid>

                            <Grid item xs={12}>
                                <Divider />
                            </Grid>

                            {/* FECHA DE FACTURACION */}
                            <Grid item xs={12} md={3}>
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

                            {/* SELECT BANCO */}
                            <Grid item xs={12} md={3}>
                                <Stack>
                                    <InputLabel required>Banco</InputLabel>
                                    <Select
                                        id="p_gloc_banco"
                                        name="p_gloc_banco"
                                        displayEmpty
                                        value={formik.values.p_gloc_banco || ''}
                                        // ESTO SE NECESITA PARA RENDERIZAR LA VALIDACION
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.p_gloc_banco && Boolean(formik.errors.p_gloc_banco)}
                                        helperText={formik.touched.p_gloc_banco && formik.errors.p_gloc_banco}
                                        // HASTA AQUI
                                        onChange={formik.handleChange}
                                        renderValue={(selected) => {
                                            if (!selected || Object.keys(selected).length === 0) {
                                                return <em>Seleccione un Banco</em>;
                                            }
                                            return selected.description;
                                        }}
                                    >
                                        <MenuItem disabled value="">
                                            <em>Seleccione una Banco</em>
                                        </MenuItem>
                                        {
                                            dataHelp.banco && dataHelp.banco.length > 0
                                                ? dataHelp.banco[0].map((item) =>
                                                    <MenuItem key={item.id} value={item}>{item.description}</MenuItem>
                                                )
                                                : <MenuItem value="">Sin datos</MenuItem>
                                        }
                                    </Select>
                                    {formik.errors.p_gloc_banco && <FormHelperText error>{formik.errors.p_gloc_banco}</FormHelperText>}
                                </Stack>
                            </Grid>

                            {/* SELECT PAIS ORIGEN freigthFwd */}
                            <Grid item xs={12} md={3}>
                                <Stack>
                                    <InputLabel required>Pais de Origen</InputLabel>
                                    <Select
                                        id="freightFwd"
                                        name="freightFwd"
                                        defaultValue={formik.values.freightFwd}
                                        displayEmpty
                                        value={formik.values.freightFwd}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.freightFwd && Boolean(formik.errors.freightFwd)}
                                        helperText={formik.touched.freightFwd && formik.errors.freightFwd}
                                        onChange={formik.handleChange}
                                        renderValue={(selected) => {
                                            if (!selected) {
                                                console.log("Selected value:", selected);  // Agregar esto
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
                            </Grid>

                            {/* SELECT CARGA */}
                            <Grid item xs={12} md={3}>
                                <Stack>
                                    <InputLabel required>Carga</InputLabel>
                                    <Select
                                        id="freightType"
                                        name="freightType"
                                        displayEmpty
                                        value={formik.values.freightType || ''}
                                        // ESTO SE NECESITA PARA RENDERIZAR LA VALIDACION
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.freightType && Boolean(formik.errors.freightType)}
                                        helperText={formik.touched.freightType && formik.errors.freightType}
                                        // HASTA AQUI
                                        onChange={formik.handleChange}
                                        renderValue={(selected) => {
                                            if (!selected || Object.keys(selected).length === 0) {
                                                return <em>Seleccione una Carga</em>;
                                            }
                                            return selected.description;
                                        }}
                                    >
                                        <MenuItem disabled value="">
                                            <em>Seleccione una Carga</em>
                                        </MenuItem>
                                        {
                                            dataHelp.carga && dataHelp.carga.length > 0
                                                ? dataHelp.carga.map((item) =>
                                                    <MenuItem key={item.id} value={item}>{item.description}</MenuItem>
                                                )
                                                : <MenuItem value="">Sin datos</MenuItem>
                                        }
                                    </Select>
                                    {formik.errors.freightType && <FormHelperText error>{formik.errors.freightType}</FormHelperText>}
                                </Stack>
                            </Grid>

                            {/* SELECT Distribuidor Local fwdtte */}
                            {/* <Grid item xs={12} md={6}>
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


                            {/* SELECT Poliza */}
                            <Grid item xs={12} md={3}>
                                <Stack>
                                    <InputLabel required>Poliza</InputLabel>
                                    <Select
                                        id="polizaProv"
                                        name="polizaProv"
                                        displayEmpty
                                        value={formik.values.polizaProv || ''}
                                        // ESTO SE NECESITA PARA RENDERIZAR LA VALIDACION
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.polizaProv && Boolean(formik.errors.polizaProv)}
                                        helperText={formik.touched.polizaProv && formik.errors.polizaProv}
                                        // HASTA AQUI
                                        onChange={formik.handleChange}
                                        renderValue={(selected) => {
                                            if (!selected || Object.keys(selected).length === 0) {
                                                return <em>Seleccione una Poliza</em>;
                                            }
                                            return selected.description;
                                        }}
                                    >
                                        <MenuItem disabled value="">
                                            <em>Seleccione una Poliza</em>
                                        </MenuItem>
                                        {
                                            dataHelp.poliza && dataHelp.poliza.length > 0
                                                ? dataHelp.poliza[0].map((item) =>
                                                    <MenuItem key={item.id} value={item}>{item.description}</MenuItem>
                                                )
                                                : <MenuItem value="">Sin datos</MenuItem>
                                        }
                                    </Select>
                                    {formik.errors.polizaProv && <FormHelperText error>{formik.errors.polizaProv}</FormHelperText>}
                                </Stack>
                            </Grid>

                            {/* Select FLETE */}
                            <Grid item xs={12} md={3}>
                                <Stack>
                                    <InputLabel required>Flete</InputLabel>
                                    <Select
                                        id="p_gloc_tte"
                                        name="p_gloc_tte"
                                        displayEmpty
                                        value={formik.values.p_gloc_tte || ''}
                                        // ESTO SE NECESITA PARA RENDERIZAR LA VALIDACION
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.p_gloc_tte && Boolean(formik.errors.p_gloc_tte)}
                                        helperText={formik.touched.p_gloc_tte && formik.errors.p_gloc_tte}
                                        // HASTA AQUI
                                        onChange={formik.handleChange}
                                        renderValue={(selected) => {
                                            if (!selected || Object.keys(selected).length === 0) {
                                                return <em>Seleccione un Flete</em>;
                                            }
                                            return selected.description;
                                        }}
                                    >
                                        <MenuItem disabled value="">
                                            <em>Seleccione una Flete</em>
                                        </MenuItem>
                                        {
                                            dataHelp.flete && dataHelp.flete.length > 0
                                                ? dataHelp.flete.map((item) =>
                                                    <MenuItem key={item.id} value={item}>{item.description}</MenuItem>
                                                )
                                                : <MenuItem value="">Sin datos</MenuItem>
                                        }
                                    </Select>
                                    {formik.errors.p_gloc_tte && <FormHelperText error>{formik.errors.p_gloc_tte}</FormHelperText>}
                                </Stack>
                            </Grid>

                            {/* SELECT CUSTODIA */}
                            <Grid item xs={12} md={3}>
                                <Stack>
                                    <InputLabel required>Custodia</InputLabel>
                                    <Select
                                        id="p_gloc_cust"
                                        name="p_gloc_cust"
                                        displayEmpty
                                        value={formik.values.p_gloc_cust || ''}
                                        // ESTO SE NECESITA PARA RENDERIZAR LA VALIDACION
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.p_gloc_cust && Boolean(formik.errors.p_gloc_cust)}
                                        helperText={formik.touched.p_gloc_cust && formik.errors.p_gloc_cust}
                                        // HASTA AQUI
                                        onChange={formik.handleChange}
                                        renderValue={(selected) => {
                                            if (!selected || Object.keys(selected).length === 0) {
                                                return <em>Seleccione un Custodia</em>;
                                            }
                                            return selected.description;
                                        }}
                                    >
                                        <MenuItem disabled value="">
                                            <em>Seleccione una Custodia</em>
                                        </MenuItem>
                                        {
                                            dataHelp.custodia && dataHelp.custodia.length > 0
                                                ? dataHelp.custodia.map((item) =>
                                                    <MenuItem key={item.id} value={item}>{item.description}</MenuItem>
                                                )
                                                : <MenuItem value="">Sin datos</MenuItem>
                                        }
                                    </Select>
                                    {formik.errors.p_gloc_cust && <FormHelperText error>{formik.errors.p_gloc_cust}</FormHelperText>}
                                </Stack>
                            </Grid>

                            {/* Select Gestion digital */}
                            <Grid item xs={12} md={3}>
                                <Stack>
                                    <InputLabel required>Gestion DIgital</InputLabel>
                                    <Select
                                        id="p_gloc_gestdigdoc"
                                        name="p_gloc_gestdigdoc"
                                        displayEmpty
                                        value={formik.values.p_gloc_gestdigdoc || ''}
                                        // ESTO SE NECESITA PARA RENDERIZAR LA VALIDACION
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.p_gloc_gestdigdoc && Boolean(formik.errors.p_gloc_gestdigdoc)}
                                        helperText={formik.touched.p_gloc_gestdigdoc && formik.errors.p_gloc_gestdigdoc}
                                        // HASTA AQUI
                                        onChange={formik.handleChange}
                                        renderValue={(selected) => {
                                            if (!selected || Object.keys(selected).length === 0) {
                                                return <em>Seleccione una Gest. Digital</em>;
                                            }
                                            return selected.description;
                                        }}
                                    >
                                        <MenuItem disabled value="">
                                            <em>Seleccione una Gest. Digital</em>
                                        </MenuItem>
                                        {
                                            dataHelp.gesDigDoc && dataHelp.gesDigDoc.length > 0
                                                ? dataHelp.gesDigDoc.map((item) =>
                                                    <MenuItem key={item.id} value={item}>{item.description}</MenuItem>
                                                )
                                                : <MenuItem value="">Sin datos</MenuItem>
                                        }
                                    </Select>
                                    {formik.errors.p_gloc_gestdigdoc && <FormHelperText error>{formik.errors.p_gloc_gestdigdoc}</FormHelperText>}
                                </Stack>
                            </Grid>

                            {/* SELECT ProveedoresOEM */}
                            <Grid item xs={12} md={3}>
                                <Stack>
                                    <InputLabel required>Proveedores Oem</InputLabel>
                                    <Select
                                        id="oemprove1"
                                        name="oemprove1"
                                        displayEmpty
                                        value={formik.values.oemprove1 || ''}
                                        // ESTO SE NECESITA PARA RENDERIZAR LA VALIDACION
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.oemprove1 && Boolean(formik.errors.oemprove1)}
                                        helperText={formik.touched.oemprove1 && formik.errors.oemprove1}
                                        // HASTA AQUI
                                        onChange={formik.handleChange}
                                        renderValue={(selected) => {
                                            if (!selected || Object.keys(selected).length === 0) {
                                                return <em>Seleccione un Proveedor</em>;
                                            }
                                            return selected.description;
                                        }}
                                    >
                                        <MenuItem disabled value="">
                                            <em>Seleccione un Proveedor</em>
                                        </MenuItem>
                                        {
                                            dataHelp.proveedoresOem && dataHelp.proveedoresOem.length > 0
                                                ? dataHelp.proveedoresOem.map((item) =>
                                                    <MenuItem key={item.id} value={item}>{item.description}</MenuItem>
                                                )
                                                : <MenuItem value="">Sin datos</MenuItem>
                                        }
                                    </Select>
                                    {formik.errors.oemprove1 && <FormHelperText error>{formik.errors.oemprove1}</FormHelperText>}
                                </Stack>
                            </Grid>

                            {/* Select Despachante */}
                            <Grid item xs={12} md={3}>
                                <Stack>
                                    <InputLabel required>Despachante</InputLabel>

                                    <Select
                                        id="p_gloc_despa"
                                        name="p_gloc_despa"
                                        displayEmpty
                                        value={formik.values.p_gloc_despa || ''}
                                        // ESTO SE NECESITA PARA RENDERIZAR LA VALIDACION
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.p_gloc_despa && Boolean(formik.errors.p_gloc_despa)}
                                        helperText={formik.touched.p_gloc_despa && formik.errors.p_gloc_despa}
                                        // HASTA AQUI
                                        onChange={formik.handleChange}
                                        renderValue={(selected) => {
                                            if (!selected || Object.keys(selected).length === 0) {
                                                return <em>Seleccione un Despachante</em>;
                                            }
                                            return selected.description;
                                        }}
                                    >
                                        <MenuItem disabled value="">
                                            <em>Seleccione un Despachante</em>
                                        </MenuItem>
                                        {
                                            dataHelp.despachante && dataHelp.despachante.length > 0
                                                ? dataHelp.despachante.map((item) =>
                                                    <MenuItem key={item.id} value={item}>{item.description}</MenuItem>
                                                )
                                                : <MenuItem value="">Sin datos</MenuItem>
                                        }
                                    </Select>
                                    {formik.errors.p_gloc_despa && <FormHelperText error>{formik.errors.p_gloc_despa}</FormHelperText>}
                                </Stack>
                            </Grid>

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
                                        + Agregar Producto
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
                            </Grid>*/}

                            {/* PESAJE CONTENEDORES */}
                            {
                                ocultar?(
                                    ''
                                ):(
                                    <PesajeContenedor productsData={productsData} tipoContenedor={formik.values.freightType}/>
                                )
                            }
                            
                            <Grid item xs={12}>
                            <Divider />
                            </Grid> 

                            <Grid item sx={{ display: 'flex', justifyContent: 'center' }} xs={12}>
                                <Button variant="contained" type="submit">
                                    Presupuestar
                                </Button>
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
        </>
    );
}
export default CreateInvoice;