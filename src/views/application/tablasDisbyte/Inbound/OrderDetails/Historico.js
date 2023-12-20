import { useRef } from "react";
import { Link } from "react-router-dom";
//para formatear la hora

import IconExcel from '../../../../../assets/images/iconoExcel.png';

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Button,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import PrintIcon from '@mui/icons-material/Print';

// third-party
import ReactToPrint from "react-to-print";
//
// project imports
import AnimateButton from "ui-component/extended/AnimateButton";
import SubCard from "ui-component/cards/SubCard";
import Chip from "ui-component/extended/Chip";
import { gridSpacing } from "store/constant";

import LogoDisbyteAzul from "../../../../../assets/images/disbyte/LogoDisbyte.png";
import { UtilidadesHelper } from "helpers/UtilidadesHelper";
import { makeStyles } from "@material-ui/core";
import { useCommonStyles } from "helpers/CommonStyles";
import { exportToExcel } from "helpers/ExportExcel";
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

const Historico = ({ presupuestador, usuario, historico, estados }) => {
  const theme = useTheme();
  const componentRef = useRef(null);
  
  console.log(historico);
  console.log(estados);

  const classes = useCommonStyles(); //importo los estilos de CommonStyles

  return (
    <Grid container justifyContent="center" spacing={gridSpacing}>
      <Grid item xs={12} md={10} lg={8} ref={componentRef}>
        <SubCard
          darkTitle
          title={`Simulación #00${
            presupuestador.estHeader.estnumber
              ? presupuestador.estHeader.estnumber
              : "Sin data"
          }/00${
            presupuestador.estHeader.estvers
              ? presupuestador.estHeader.estvers
              : "Sin data"
          }`}
          secondary={
            <img
              width="140"
              height="60"
              viewBox="0 0 92 32"
              fill="none"
              src={LogoDisbyteAzul}
              alt="Logo Disbyte Azul"
            />
          }
        >
          <Grid container spacing={gridSpacing} >

            <Grid item xs={12}>
              <Grid container spacing={gridSpacing}>
                <Grid item sm={5}>
                  <Grid container spacing={1}>
                    
                    <Grid item xs={12}>
                      <Grid container spacing={0}>
                        <Grid item xs={12}>
                          <Typography variant="h5">Detalles :</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2">
                            Own: {usuario.name}.
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2">
                            Descripcion:{" "}
                            {presupuestador.estHeader.description
                              ? presupuestador.estHeader.description
                              : "Sin data"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2">
                            Origen:{" "}
                            {presupuestador.estHeader.fwdpaisregion_id
                              ? UtilidadesHelper.paisRegionSwitch(
                                  presupuestador.estHeader.fwdpaisregion_id
                                )
                              : "Sin data"}
                          </Typography>
                          <Typography variant="body2">
                            Destino:{" "}
                            {presupuestador.estHeader.paisregion_id
                              ? UtilidadesHelper.paisRegionSwitch(
                                  presupuestador.estHeader.paisregion_id
                                )
                              : "Sin data"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2">
                            Tipo Cont:{" "}
                            {presupuestador.carga_str
                              ? presupuestador.carga_str
                              : "Sin data"}
                          </Typography>
                          <Typography variant="body2">
                            Cant. Cont:{" "}
                            {presupuestador.estHeader.cantidad_contenedores
                              ? presupuestador.estHeader.cantidad_contenedores.toFixed(
                                  3
                                )
                              : "Sin data"}
                          </Typography>
                        </Grid>

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
                          <Typography variant="body2">
                            {presupuestador.estHeader.htimestamp
                              ? UtilidadesHelper.formatFecha(
                                  presupuestador.estHeader.htimestamp
                                )
                              : "Sin data"}
                            hs
                          </Typography>
                        </Grid>
                        <Grid item xs={4} sx={{ my: 0.5 }}>
                          <Typography variant="body2">Estado :</Typography>
                        </Grid>
                        <Grid item xs={8} sx={{ my: 0.5 }}>
                          <Chip
                          label={estados.filter((miEstado)=>miEstado.id===presupuestador?.estHeader?.status)[0]?.description}                      
                          variant="outlined"
                            size="small"
                            chipcolor="warning"
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2">Order Id :</Typography>
                        </Grid>
                        <Grid item xs={8}>
                          <Typography variant="body2" component={Link} to="#">
                            #{" "}
                            {`00${
                              presupuestador.estHeader.estnumber
                                ? presupuestador.estHeader.estnumber
                                : "Sin data"
                            } /00${
                              presupuestador.estHeader.estvers
                                ? presupuestador.estHeader.estvers
                                : "Sin data"
                            }`}
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
                    "& tr:last-of-type td": {
                      borderBottom: "none",
                    },
                    "& thead tr th": {
                      borderBottom: "none",
                    },
                    "& th:first-of-type, & td:first-of-type": {
                      pl: { xs: 2.5, md: 5 },
                    },
                    "& th:last-of-type, & td:last-of-type": {
                      pr: { xs: 6.25, md: 8.75 },
                    },
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{ pl: 3 }}
                        className={classes.tableCellCabecera3}
                      >
                        Own
                      </TableCell>
                      <TableCell
                        align="right"
                        className={classes.tableCellCabecera3}
                      >
                        Version
                      </TableCell>
                      <TableCell
                        align="center"
                        className={classes.tableCellCabecera3}
                      >
                        Estado
                      </TableCell>
                      <TableCell
                        align="center"
                        className={classes.tableCellCabecera3}
                      >
                        Fecha
                      </TableCell>

                      <TableCell
                        align="right"
                        sx={{ pr: 3, maxWidth: 100 }}
                        className={classes.tableCellCabecera3}
                      >
                        Fob Total[USD]
                      </TableCell>

                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {historico.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ pl: 3 }} className={classes.tableCell}>
                          <Typography align="left" variant="subtitle1">
                            {row.own ? row.own : "SIn data"}
                          </Typography>
                          
                        </TableCell>
                        <TableCell align="right" className={classes.tableCell}>
                          {row.estvers ? row.estvers : "Sin data"}
                        </TableCell>
                        <TableCell align="center" className={classes.tableCell}>
                        {row.status ? (
                          (() => { //FIND devuelve un solo elemento el primero que machea con la condicion FILTER en cambio almacena todos los q machean y almacena en un ARR
                            const estadoEncontrado = estados.find((miEstado) => miEstado.id === row.status); //almacenamos el elemento encontrado entre el historico y el arr de estados que llega como props
                            return (
                              <Chip
                                sx={{ minWidth: "80px" }}
                                label={estadoEncontrado ? estadoEncontrado.description : "Sin data"} //mostramos el valor almacenado de la busqueda
                                variant="outlined"
                                size="small"
                                chipcolor="warning"
                              />
                            );
                          })()
                          ) : (
                            <Chip
                              sx={{ minWidth: "80px" }}
                              label={`Creacion`}
                              variant="outlined"
                              size="small"
                              chipcolor="warning"
                            />
                          )}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ pr: 3 }}
                          className={classes.tableCell}
                        >
                          {row.htimestamp
                            ? UtilidadesHelper.fechaParaVista(row.htimestamp)
                            : "Sin data"}
                        </TableCell>

                        <TableCell align="right" className={classes.tableCell}>
                          {row.cif_grand_total || row.cif_grand_total == 0
                            ? UtilidadesHelper.formatNumber(
                                row.cif_grand_total.toFixed(2)
                              )
                            : "Sin data"}
                        </TableCell>
                        {/* <TableCell align="center">u$s{(row.costoUnitEstimadoUSS).toFixed(2)}</TableCell> */}
                      </TableRow>
                    ))}
                  </TableBody>

                </Table>
              </TableContainer>
            </Grid>

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
            mx: "auto",
            mt: 0,
            mb: 2.5,
            "& > .MuiCardContent-root": {
              py: { xs: 3.75, md: 5.5 },
              px: { xs: 2.5, md: 5 },
            },
          }}
        >
          <Grid item>
            <AnimateButton>
              <ReactToPrint
                trigger={() =>
                <Tooltip title='Imprimir historico'>
                  <Button variant="contained">
                    <PrintIcon/>
                  </Button>
                </Tooltip>
                }
                content={() => componentRef.current}
              />
            </AnimateButton>
          </Grid>
          
          <Grid item>
            <Tooltip title='Exportar a excel'>
              <Button
                variant="contained"
                color="success"
                onClick={() => exportToExcel.exportCabecera(presupuestador, usuario, historico, estados)}
              >
                <img src={IconExcel} alt="Exportar a Excel" style={{ maxWidth: '220%', height: '25px' }} />
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Historico;
