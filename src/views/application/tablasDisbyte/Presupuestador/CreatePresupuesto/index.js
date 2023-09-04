import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
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
import { ProveedoresOemHelper } from 'helpers/ProveedoresOemHelper';
import { GestDigitalDocHelper } from 'helpers/GestDigitalDocHelper';
import { NcmHelper } from 'helpers/NcmHelper';
import { PresupuestoHelper } from 'helpers/PresupuestoHelper';
import { TarifasPolizaHelper } from 'helpers/TarifasPolizaHelper';
import { TarifasFwdContHelper } from 'helpers/TarifasFwdContHelper';

//importacion para poder opacar el placeholder del dolar
import { makeStyles } from '@material-ui/core/styles';
import { UtilidadesHelper } from 'helpers/UtilidadesHelper';
import { PesajeContenedor } from './PesajeContenedor';
import { CustomSelect } from './CustomSelect';
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
        // console.log('Origen : ', origen)
        // console.log('Banco : ', banco)
    };

    const cellInput = [
        {
            id: 'p_gloc_banco',
            name: 'p_gloc_banco',
            em: 'Seleccione un banco',
            inputLabel: 'Banco',
            data: dataHelp.banco,
        },
        {
            id: 'freightType',
            name: 'freightType',
            em: 'Seleccione una Carga',
            inputLabel: 'Carga',
            data: dataHelp.carga,
        },
        {
            id: 'polizaProv',
            name: 'polizaProv',
            em: 'Seleccione un Poliza',
            inputLabel: 'Poliza',
            data: dataHelp.poliza,
        },
        {
            id: 'p_gloc_tte',
            name: 'p_gloc_tte',
            em: 'Seleccione un Flete',
            inputLabel: 'Flete',
            data: dataHelp.flete,
        },
        {
            id: 'p_gloc_cust',
            name: 'p_gloc_cust',
            em: 'Seleccione un Custodia',
            inputLabel: 'Custodia',
            data: dataHelp.custodia,
        },
        {
            id: 'p_gloc_gestdigdoc',
            name: 'p_gloc_gestdigdoc',
            em: 'Seleccione una Gest. Digital',
            inputLabel: 'Gestion DIgital',
            data: dataHelp.gesDigDoc,
        },
        {
            id: 'oemprove1',
            name: 'oemprove1',
            em: 'Seleccione un Proveedor',
            inputLabel: 'Proveedores Oem',
            data: dataHelp.proveedoresOem,
        },
        {
            id: 'p_gloc_despa',
            name: 'p_gloc_despa',
            em: 'Seleccione un Despachante',
            inputLabel: 'Despachante',
            data: dataHelp.despachante,
        },
    ];

    console.log(cellInput);
    console.log(dataHelp.carga);

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
            freightFwd: 'PANAMA', //hardcodeado
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
    const editProductHandler = (id) => {
        console.log(`El producto seleccionado es el: `, id)
        // setProductsData(productsData.filter((item) => item.id !== id));
    };

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
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
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

                            {/* CABECERA DE PRESUPUESTADOR */}
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

                            {/* DETALLE DE PRESUPUESTADOR */}
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>

                            {/* COMPONENTE DE INPUTS que maneja la data de cellInput */}
                            {
                                cellInput.map(field =>
                                    <CustomSelect key={field.id} {...field} formik={formik} />
                                )
                            }

                            {/* CARGA DE PRODUCTOS */}
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>

                            <ProductsPage productsData={productsData} deleteProductHandler={deleteProductHandler} editProductHandler={editProductHandler} />

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
};
export default CreateInvoice;