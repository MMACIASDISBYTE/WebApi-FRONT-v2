import { useRef } from 'react';
import { Link } from 'react-router-dom';
//para formatear la hora
import { format } from 'date-fns';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Divider, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

// third-party
import ReactToPrint from 'react-to-print';
//
// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';
import SubCard from 'ui-component/cards/SubCard';
import Chip from 'ui-component/extended/Chip';
import Logo from 'ui-component/Logo';
import { gridSpacing } from 'store/constant';

import LogoDisbyteAzul from '../../../../../assets/images/disbyte/LogoDisbyte.png';
import LogoDisbyteBlanco from '../../../../../assets/images/disbyte/LogoDisbyte_blanco.png';
import { UtilidadesHelper } from 'helpers/UtilidadesHelper';
import { StatusComp } from '../StatusComp';
// import user from 'store/slices/user';

// table data
function createData(product, description, quantity, amount, total) {
    return { product, description, quantity, amount, total };
}

const rows = [
    // createData('Logo Design', 'lorem ipsum dolor sit amat, connecter adieu siccing eliot', '6', '$200.00', '$1200.00'),
    // createData('Landing Page', 'lorem ipsum dolor sit amat, connecter adieu siccing eliot', '7', '$100.00', '$700.00'),
    // createData('Admin Template', 'lorem ipsum dolor sit amat, connecter adieu siccing eliot', '5', '$150.00', '$750.00')
];

const Invoice = ({ presupuestador, usuario, historico }) => {
    const theme = useTheme();
    const componentRef = useRef(null);
    console.log(presupuestador);
    // console.log(usuario);
    return (
        <Grid container justifyContent="center" spacing={gridSpacing}>
            <Grid item xs={12} md={10} lg={8} ref={componentRef}>
                <SubCard darkTitle title={`Presupuesto #00${presupuestador.estHeader.estnumber ? presupuestador.estHeader.estnumber : 'Sin data'} /00${presupuestador.estHeader.estvers ? presupuestador.estHeader.estvers : 'Sin data'}`} secondary={<img width="240" height="100" viewBox="0 0 92 32" fill="none" src={LogoDisbyteAzul} alt="Logo Disbyte Azul" />}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <Grid container spacing={0}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1">Presupuestador: {usuario.name}.</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2">Heredia 949, Capital Federal</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2">Bs. As. CP: 1427</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography component={Link} to="#" variant="body2" color="primary">
                                        info@disbyte.com
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2">(+54) 11 3437-1324</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={gridSpacing}>
                                <Grid item sm={5}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <Typography variant="h5">Customer :</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Grid container spacing={0}>
                                                <Grid item xs={12}>
                                                    <Typography variant="subtitle1">Descripcion:{presupuestador.estHeader.description ? presupuestador.estHeader.description : 'Sin data'}</Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="body2">Origen: {presupuestador.estHeader.fwdpaisregion_id ? UtilidadesHelper.paisRegionSwitch(presupuestador.estHeader.fwdpaisregion_id) : 'Sin data'}</Typography>
                                                    <Typography variant="body2">Destino: {presupuestador.estHeader.paisregion_id ?  UtilidadesHelper.paisRegionSwitch(presupuestador.estHeader.paisregion_id) : 'Sin data'}</Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="body2">Tipo Cont: {presupuestador.carga_str ? presupuestador.carga_str : 'Sin data'}</Typography>
                                                    <Typography variant="body2">Cant. Cont: {presupuestador.estHeader.cantidad_contenedores ? (presupuestador.estHeader.cantidad_contenedores).toFixed(3) : 'Sin data'}</Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="body2">Dolar Billete: ARS$ {presupuestador.estHeader.dolar ? presupuestador.estHeader.dolar : 'Sin data'}</Typography>
                                                </Grid>
                                                {/* <Grid item xs={12}>
                                                    <Typography component={Link} to="#" variant="body2" color="primary">
                                                        demo@company.com
                                                    </Typography>
                                                </Grid> */}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item sm={4}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12}>
                                            <Typography variant="h5">Order Details :</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Grid container spacing={0}>
                                                <Grid item xs={4}>
                                                    <Typography variant="body2">Date :</Typography>
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <Typography variant="body2">{presupuestador.estHeader.htimestamp ? UtilidadesHelper.formatFecha(presupuestador.estHeader.htimestamp) : 'Sin data'}hs</Typography>
                                                </Grid>
                                                <Grid item xs={4} sx={{ my: 0.5 }}>
                                                    <Typography variant="body2">Estado :</Typography>
                                                </Grid>
                                                <Grid item xs={8} sx={{ my: 0.5 }}>
                                                    <Chip label={presupuestador.estHeader.status || presupuestador.estHeader.status == 0 ? `Estado n° ${presupuestador.estHeader.status}` : 'Sin data'} variant="outlined" size="small" chipcolor="warning" />
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <Typography variant="body2">Order Id :</Typography>
                                                </Grid>
                                                <Grid item xs={8}>
                                                    <Typography variant="body2" component={Link} to="#">
                                                        # {`00${presupuestador.estHeader.estnumber ? presupuestador.estHeader.estnumber : 'Sin data'} /00${presupuestador.estHeader.estvers ? presupuestador.estHeader.estvers : 'Sin data'}`}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <TableContainer>
                                <Table
                                    sx={{
                                        '& tr:last-of-type td': {
                                            borderBottom: 'none'
                                        },
                                        '& thead tr th': {
                                            borderBottom: 'none'
                                        },
                                        '& th:first-of-type, & td:first-of-type': {
                                            pl: { xs: 2.5, md: 5 }
                                        },
                                        '& th:last-of-type, & td:last-of-type': {
                                            pr: { xs: 6.25, md: 8.75 }
                                        }
                                    }}
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ pl: 3 }}>Own</TableCell>
                                            <TableCell align="right">Version</TableCell>
                                            <TableCell align="right">Estado</TableCell>
                                            <TableCell align="right">Fecha</TableCell>
                                            
                                            <TableCell align="right" sx={{ pr: 3 }}>Fob Total</TableCell>
                                            {/* <TableCell align="center">CeU. u$s</TableCell> */}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {historico.map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell sx={{ pl: 3 }}>
                                                    <Typography align="left" variant="subtitle1">
                                                        {row.own ? row.own : 'SIn data'}
                                                    </Typography>
                                                    {/* SE PUEDE AGREGAR UNA DESCRIPTION */}
                                                    {/* <Typography align="left" variant="body2">
                                                        {row.description}
                                                    </Typography> */}
                                                </TableCell>
                                                <TableCell align="right">{row.estvers ? row.estvers : 'Sin data'}</TableCell>
                                                <TableCell align="right">{ row.status ? <StatusComp estadio={row.status}/> : 'Sin data'}</TableCell>
                                                <TableCell align="right" sx={{ pr: 3 }}>{ row.htimestamp ? UtilidadesHelper.fechaParaVista(row.htimestamp)  : 'Sin data'}</TableCell>
                                                
                                                <TableCell align="right">USD {(row.fob_grand_total || row.fob_grand_total == 0) ? UtilidadesHelper.formatNumber((row.fob_grand_total).toFixed(2)) : 'Sin data'}</TableCell>
                                                {/* <TableCell align="center">u$s{(row.costoUnitEstimadoUSS).toFixed(2)}</TableCell> */}
                                            </TableRow>
                                        ))}
                                    </TableBody>

                                    {/* <TableBody> */}
                                        {/* {presupuestador.estDetails.map((row, index) => ( 
                                            // <TableRow key={index}>
                                            //     <TableCell sx={{ pl: 3 }}>
                                            //         <Typography align="left" variant="subtitle1">
                                            //             {row.description ? row.description : 'SIn data'}
                                            //         </Typography>
                                                    {/* SE PUEDE AGREGAR UNA DESCRIPTION */}
                                                    {/* <Typography align="left" variant="body2">
                                                        {row.description}
                                                    </Typography> 
                                                // </TableCell>
                                                // <TableCell align="right">{row.qty ? row.qty : 'Sin data'}u.</TableCell>
                                                // <TableCell align="right">USD { row.fob_u ? UtilidadesHelper.formatNumber((row.fob_u).toFixed(2)) : 'Sin data'}</TableCell>
                                                // <TableCell align="right" sx={{ pr: 3 }}>USD { (row.totalfob || row.totalfob == 0) ? UtilidadesHelper.formatNumber((row.totalfob).toFixed(2)) : 'Sin data'}</TableCell>
                                                
                                                // <TableCell align="right">USD {(row.cifunit || row.cifunit == 0) ? UtilidadesHelper.formatNumber((row.cifunit).toFixed(2)) : 'Sin data'}</TableCell>
                                                {/* <TableCell align="center">u$s{(row.costoUnitEstimadoUSS).toFixed(2)}</TableCell> */}
                                            {/* </TableRow> */}
                                         {/* ))} */}
                                    {/* </TableBody> */}

                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item xs={12}>
                            <SubCard
                                sx={{
                                    bgcolor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light
                                }}
                            >
                                <Grid container justifyContent="flex-end" spacing={gridSpacing}>
                                    <Grid item sm={6} md={6}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={6}>
                                                        <Typography align="right" variant="subtitle1">
                                                            Fob Gran Total:
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography align="right" variant="body2">
                                                            USD {presupuestador.estHeader.fob_grand_total ? UtilidadesHelper.formatNumber(presupuestador.estHeader.fob_grand_total.toFixed(2)) : 'Sin data'}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography align="right" variant="subtitle1">
                                                            {/* Aranceles / Pagado (10%): */}
                                                            Aranceles:
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography align="right" variant="body2">
                                                            USD {presupuestador.estHeader.impuestos_total ? UtilidadesHelper.formatNumber(presupuestador.estHeader.impuestos_total.toFixed(2)) : 'Sin data'}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography align="right" variant="subtitle1">
                                                            {/* Discount (5%) : */}
                                                            Freight Costo:
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography align="right" variant="body2">
                                                            {presupuestador.estHeader.freight_cost ? UtilidadesHelper.formatNumber(presupuestador.estHeader.freight_cost.toFixed(2)) : 'Sin data'}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography align="right" variant="subtitle1">
                                                            {/* Discount (5%) : */}
                                                            Freight Insurance Costo:
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography align="right" variant="body2">
                                                            {presupuestador.estHeader.freight_insurance_cost ? UtilidadesHelper.formatNumber(presupuestador.estHeader.freight_insurance_cost.toFixed(2)) : 'Sin data'}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography align="right" variant="subtitle1">
                                                            {/* Discount (5%) : */}
                                                            IIBB Total:
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography align="right" variant="body2">
                                                            % {presupuestador.estHeader.iibb_total ? UtilidadesHelper.formatNumber(presupuestador.estHeader.iibb_total.toFixed(2)) : 'Sin data'}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography align="right" variant="subtitle1">
                                                            Extra gastos Total:
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography align="right" variant="body2">
                                                            USD {(presupuestador.estHeader.extragastos_total || presupuestador.estHeader.extragastos_total == 0) ? UtilidadesHelper.formatNumber(presupuestador.estHeader.extragastos_total.toFixed(2)) : 'Sin data'}
                                                        </Typography>
                                                    </Grid>
                                                    {/* <Grid item xs={6}>
                                                        <Typography align="right" variant="subtitle1">
                                                            Discount (5%) :
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography align="right" variant="body2">
                                                            $45.00
                                                        </Typography>
                                                    </Grid> */}
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Divider />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Grid container spacing={1}>
                                                    <Grid item xs={6}>
                                                        <Typography align="right" color="primary" variant="subtitle1">
                                                            CIF Total USD:
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography align="right" color="primary" variant="subtitle1">
                                                            USD {presupuestador.estHeader.cif_grand_total ? UtilidadesHelper.formatNumber((presupuestador.estHeader.cif_grand_total).toFixed(2)) : 'SIn data'}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography align="right" color="primary" variant="subtitle1">
                                                            CIF Total ARS:
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography align="right" color="primary" variant="subtitle1">
                                                            ARS { presupuestador.estHeader.gastos_loc_total? UtilidadesHelper.formatNumber((presupuestador.estHeader.gastos_loc_total).toFixed(2) * presupuestador.estHeader.dolar) : 'Sin data'}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </SubCard>
                        </Grid>

                        {/* TERMINOS Y CONDICIONES */}
                        {/* <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h6">Terminos y condiciones :</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2">
                                        Este presupuesto es válido por un período de 24 horas a partir de la fecha de emisión.
                                        Para garantizar la precisión del presupuesto, solicitamos su confirmación dentro de este período.
                                        Si no se confirma dentro de las 24 horas,
                                        será necesario realizar un nuevo presupuesto para reflejar las condiciones y precios actuales.
                                        <br />
                                        <br />
                                        CIF*: Cost Insurance Fleet
                                        <br />
                                        CeU*: Cost Estimado Unitario
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid> */}
                        
                    </Grid>
                </SubCard>
            </Grid>
            <Grid item xs={12} md={10} lg={8}>
                <Grid
                    container
                    spacing={1}
                    justifyContent="center"
                    sx={{
                        maxWidth: 850,
                        mx: 'auto',
                        mt: 0,
                        mb: 2.5,
                        '& > .MuiCardContent-root': {
                            py: { xs: 3.75, md: 5.5 },
                            px: { xs: 2.5, md: 5 }
                        }
                    }}
                >
                    <Grid item>
                        <AnimateButton>
                            <ReactToPrint trigger={() => <Button variant="contained">Print</Button>} content={() => componentRef.current} />
                        </AnimateButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Invoice;
