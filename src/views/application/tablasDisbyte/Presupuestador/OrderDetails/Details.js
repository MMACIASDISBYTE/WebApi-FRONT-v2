// LISTED 21_09_2023 18_41
// Se normiliza la vista del detalle, tal y como apacere en el XLS con una vista abreviada y una FULL.

import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
// material-ui 
import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Button,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
// Importa CircularProgress de Material UI
import { CircularProgress } from "@material-ui/core";
import FindInPageOutlinedIcon from "@mui/icons-material/FindInPageOutlined";

// project imports
import SubCard from "ui-component/cards/SubCard";
import Chip from "ui-component/extended/Chip";
import { gridSpacing } from "store/constant";
// assets
import CalendarTodayTwoToneIcon from "@mui/icons-material/CalendarTodayTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import EmailTwoToneIcon from "@mui/icons-material/EmailTwoTone";
import PhoneAndroidTwoToneIcon from "@mui/icons-material/PhoneAndroidTwoTone";
import { useEffect, useState } from "react";
import AnimateButton from "ui-component/extended/AnimateButton";
import { UtilidadesHelper } from "helpers/UtilidadesHelper";
import { useAccessTokenJWT } from "helpers/useAccessTokenJWT";

const sxDivider = {
  borderColor: "primary.light",
};

const detailsIconSX = {
  width: 15,
  height: 15,
  verticalAlign: "text-top",
  mr: 0.5,
  mt: 0.25,
};

const Details = ({ presupuestador, usuario }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const permisos = useAccessTokenJWT();
  // console.log(permisos);

  const editarPresu = permisos.includes("presupuesto:edit");

  // console.log(presupuestador);
  // console.log(usuario);
  const [rows, setRow] = useState([]);
  const [rowsAddData, setRowAddData] = useState([]);
  //responde al loading para la vista
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [verMas, setVerMas] = useState(true);
  const [pais, setPais] = useState(0);
  //console.log(rows);
  //console.log(pais);

  useEffect(() => {
    const fetchData = async () => {
      if (presupuestador && presupuestador.estDetails) {
        setRow(presupuestador.estDetails);
        setRowAddData(presupuestador.estDetAddData);
        console.log(rows);
        //espera la respuesta de presupuestador y quita el loading
        setLoading(false);
        setPais(presupuestador.estHeader.paisregion_id)
      }
    };

    fetchData();
    //console.log(presupuestador);
    console.log(presupuestador.estDetails);
   
    //console.log(presupuestador.estHeader);
    // console.log(presupuestador.estHeader.description);
  }, [presupuestador]);

  useEffect(() => {
    if ((presupuestador.estHeader != null && loading == false)) {
      setLoading2(false);
    }
    console.log(rows);
  }, [rows, loading]);

  const deteleDetails = async (id) => {
    console.log(`se hizo click en el ${id}`);
  };

  const nuevoPresupuesto = (estnumber, estvers) => {
    console.log(estnumber, 'de list');
    console.log(estvers, 'de list');
    navigate(`/estimate/update-estimate/${estnumber}/${estvers}`);
  };


  // totales de los que no dispone el json o no estan operativos a la fecha
  // Suma de los extrag
  function sumExtrag(myRow)
  {
    return ((
      myRow.extrag_local1+
      myRow.extrag_local2+
      myRow.extrag_comex1+
      myRow.extrag_comex2+
      myRow.extrag_comex3+
      myRow.extrag_finan1+
      myRow.extrag_finan2+
      myRow.extrag_finan3+
      myRow.extrag_glob_comex1+
      myRow.extrag_glob_comex2+
      myRow.extrag_glob_comex3+
      myRow.extrag_glob_comex4+
      myRow.extrag_glob_comex5+
      myRow.extrag_glob_finan1+
      myRow.extrag_glob_finan2+
      myRow.extrag_glob_finan3+
      myRow.extrag_glob_finan4+
      myRow.extrag_glob_finan5))
  }
  // Suma de los gastos locales
  function sumGlocPais(myRow,pais)
  {
    if(pais==7)
    {
    return(
            (myRow.gloc_bancos+
            myRow.gloc_depositos+
            myRow.gloc_despachantes+
            myRow.gloc_flete+
            myRow.gloc_fwd+
            myRow.gloc_gestdigdoc+
            myRow.gloc_despachantes+
            myRow.gloc_polizas+
            myRow.gloc_terminales));
    }

    if(pais==5)
    {
      return(
            (myRow.gloc_despachantes+
            myRow.gloc_flete+
            myRow.gloc_fwd+
            myRow.gloc_terminales));
    }  
    return 0.0
  }
  // Suma de los aranceles.
  function sumImpuestosPais(myRow,pais)
  {
    if(pais==7)
    {
        return   (myRow.arancelgrav_cif+
                  myRow.te_dta_otro_cif+
                  myRow.iva_cif+
                  myRow.ivaad_cif+
                  myRow.gcias424+
                  myRow.iibb900)
    }
    if(pais==5)
    {
      return   (myRow.arancelgrav_cif+
                myRow.te_dta_otro_cif+
                myRow.iva_cif)
    }
  }
   
             

  const verMasImp = () => {
    if (!verMas) {
      setVerMas(true);
      return;
    }
    setVerMas(false);
  };

  return (
    <Grid container spacing={gridSpacing}>
      {loading ? (
        <div style={{ margin: "auto", display: "block", paddingTop: "25px" }}>
          <CircularProgress margin="auto" />
        </div>
      ) : (
        
        <Grid item xs={12}>
          
          <SubCard
            title="Presupuesto"
            secondary={
              <Typography variant="subtitle1">
                <AnimateButton>
                  <Button
                    variant="contained"
                    onClick={() => navigate("/estimate/estimate-list")}
                  >
                    Volver a la lista
                  </Button>
                </AnimateButton>
              </Typography>
            }
          >
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  <Grid item>
                    <Avatar
                      src={usuario.avatar}
                      sx={{
                        ...theme.typography.mediumAvatar,
                        margin: "0px 0 8px 8px !important",
                        width: "50px",
                        height: "50px",
                      }}
                      aria-haspopup="true"
                      color="inherit"
                      alt="user-account"
                    />
                  </Grid>
                  <Grid item>
                    <Typography variant="body2">
                      <CalendarTodayTwoToneIcon sx={detailsIconSX} />{" "}
                      {usuario.name}
                    </Typography>
                  </Grid>

                  <Grid item>
                    <Typography variant="body2">
                      <EmailTwoToneIcon sx={detailsIconSX} />
                      {usuario.email}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={sxDivider} />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h2">
                  Presupuesto #00{presupuestador.estHeader.estnumber ? presupuestador.estHeader.estnumber : 'Sin data'} /00
                  {presupuestador.estHeader.estvers ? presupuestador.estHeader.estvers : 'Sin data'}
                </Typography><Typography variant="h4">
                  Fecha Emision: {presupuestador.estHeader.htimestamp ? ( UtilidadesHelper.formatFecha(presupuestador.estHeader.htimestamp) )  : 'Sin data'}
                </Typography>

                {editarPresu && (
                  <Grid container justifyContent="flex-end">
                    <AnimateButton>
                      <Button
                        variant="contained"
                        sx={{
                          background: theme.palette.error.main,
                          "&:hover": { background: theme.palette.error.dark },
                        }}
                        onClick={() =>
                          nuevoPresupuesto(
                            presupuestador.estHeader.estnumber,
                            presupuestador.estHeader.estvers
                          )
                        }
                      >
                        Modificar
                      </Button>
                    </AnimateButton>
                  </Grid>
                )}
                <Grid container spacing={gridSpacing}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack spacing={2}>
                      <Typography variant="h4">Detalle Carga</Typography>
                      <Stack spacing={0}>
                        {/* <Typography variant="h6" sx={{ mb: 1 }}>
                                                Credit Card
                                            </Typography> */}
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">Tipo :</Typography>
                          <Typography variant="body2">
                            {presupuestador.carga_str?presupuestador.carga_str: 0}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">
                            Cant Contenedores:
                          </Typography>
                          <Typography variant="body2">
                            {presupuestador.estHeader.cantidad_contenedores
                              ? presupuestador.estHeader.cantidad_contenedores.toFixed(3)
                              : 0.0}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">CBM m3 :</Typography>
                          <Typography variant="body2">
                            {(presupuestador.estHeader.cbm_grand_total || 0)
                              ? presupuestador.estHeader.cbm_grand_total.toFixed(2)
                              : 0.0}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">
                            Pais ORIG {" -> "} DEST :
                          </Typography>
                          <Typography variant="body2">
                            
                              {presupuestador.paisorig?presupuestador.paisorig:""}
                              {" -> "}
                              {presupuestador.paisdest?presupuestador.paisdest:""}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">Flete :</Typography>
                          <Typography variant="body2">
                            USD{" "}
                            {presupuestador.estHeader.gloc_flete || presupuestador.estHeader.gloc_flete == 0
                              ? UtilidadesHelper.formatNumber(
                                  presupuestador.estHeader.gloc_flete.toFixed(2)
                                )
                              : "Sin data"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">Freight Cost :</Typography>
                          <Typography variant="body2">
                            USD{" "}
                            {presupuestador.estHeader.freight_cost || presupuestador.estHeader.freight_cost == 0
                              ? UtilidadesHelper.formatNumber(
                                  presupuestador.estHeader.freight_cost.toFixed(2)
                                )
                              : "Sin data"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">
                            Freight Insurance Cost :
                          </Typography>
                          <Typography variant="body2">
                            USD{" "}
                            {presupuestador.estHeader.freight_insurance_cost || presupuestador.estHeader.freight_insurance_cost == 0
                              ? UtilidadesHelper.formatNumber(
                                  presupuestador.estHeader.freight_insurance_cost.toFixed(2)
                                )
                              : "Sin data"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">
                            CIF Total :
                          </Typography>
                          <Typography variant="body2">
                            USD{" "}
                            {presupuestador.estHeader.cif_grand_total
                              ? UtilidadesHelper.formatNumber(
                                  presupuestador.estHeader.cif_grand_total.toFixed(2)
                                )
                              : "Sin data"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">
                            Impuestos :
                          </Typography>
                          <Typography variant="body2">
                            USD{" "}
                            {presupuestador.estHeader.impuestos_total
                              ? UtilidadesHelper.formatNumber(
                                  presupuestador.estHeader.impuestos_total.toFixed(2)
                                )
                              : "Sin data"}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Stack spacing={2}>
                      <Typography variant="h4">Detalle Presupuesto</Typography>
                      <Stack spacing={0}>
                        {/* <Typography variant="h6" sx={{ mb: 1 }}>
                                                Carrier
                                            </Typography> */}
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">
                            #00
                            {presupuestador.estHeader.estnumber
                              ? presupuestador.estHeader.estnumber
                              : "#"}
                          </Typography>
                          <Typography variant="subtitle1">
                            / V0
                            {presupuestador.estHeader.estvers
                              ? presupuestador.estHeader.estvers
                              : "#"}
                          </Typography>    
                          <Typography variant="subtitle1" paddingLeft={3}>    
                            id:
                            {presupuestador.estHeader.id
                              ? presupuestador.estHeader.id
                              : "#"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">Detalle:</Typography>
                          <Typography variant="body2">
                            {presupuestador.estHeader.description
                              ? presupuestador.estHeader.description
                              : "Sin data"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">Emisor :</Typography>
                          <Typography variant="body2">
                            {presupuestador.estHeader.own
                              ? presupuestador.estHeader.own
                              : "Sin data"}
                          </Typography>
                        </Stack>

                        {/* ESTIMADO NUMERO Y VERSION */}
                        {/* <Stack direction="row" spacing={1}>
                                                    <Typography variant="subtitle1">Numero :</Typography>
                                                    <Typography variant="body2">{presupuestador.estnumber}</Typography>
                                                </Stack>
                                                <Stack direction="row" spacing={1}>
                                                    <Typography variant="subtitle1">Version :</Typography>
                                                    <Typography variant="body2">{presupuestador.estvers}</Typography>
                                                </Stack> */}

                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">
                            Dolar Billete :
                          </Typography>
                          <Typography variant="body2">
                            ARS${" "}
                            {presupuestador.estHeader.dolar
                              ? presupuestador.estHeader.dolar.toFixed(2)
                              : "Sin data"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">
                            Gastos loc. Proy :
                          </Typography>
                          <Typography variant="body2">
                            ARS${" "}
                            {presupuestador.estHeader.gastos_loc_total || presupuestador.estHeader.gastos_loc_total == 0
                              ? UtilidadesHelper.formatNumber(
                                  presupuestador.estHeader.gastos_loc_total.toFixed(2)
                                )
                              : "Sin data"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">IVA Exc :</Typography>
                          <Typography variant="body2">
                            {presupuestador.ivaexcento ? "Si" : "No"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">IIBB :</Typography>
                          <Typography variant="body2">
                            {pais==7?(presupuestador.estHeader.iibb_total
                              ? presupuestador.estHeader.iibb_total.toFixed(2)
                              : 0.0):("NA")}{" "}
                            %
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">
                            Ult. Modificacion :
                          </Typography>
                          <Typography variant="body2">
                            {" "}
                            {/* Para formato de fecha importar date-fns */}
                            {presupuestador.estHeader.htimestamp
                              ? UtilidadesHelper.formatFechaYhora(presupuestador.estHeader.htimestamp)
                              : "Sin data"}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Grid>

                  {/* <Grid item xs={12} sm={6} md={4}>
                                    <Stack spacing={0} sx={{ mt: { xs: 0, md: 3 } }}>
                                        <Stack direction="row" spacing={1}>
                                            <Typography variant="subtitle1">Fulfillment status :</Typography>
                                            <Typography variant="body2">Delivered</Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={1}>
                                            <Typography variant="subtitle1">Payment status :</Typography>
                                            <Chip label="Paid" variant="outlined" size="small" chipcolor="success" />
                                        </Stack>
                                    </Stack>
                                </Grid> */}
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={sxDivider} />
              </Grid>

              {/* <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                  <Grid item sm={6} md={4}>
                    <Stack spacing={2}>
                      <Typography variant="h4">Servicios</Typography>
                      <Stack spacing={0}>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">
                            Despachante:{" "}
                          </Typography>
                          <Typography variant="body2">
                            {presupuestador.gloc_despachantes !== null &&
                            presupuestador.gloc_despachantes !== undefined
                              ? presupuestador.gloc_despachantes
                              : "Sin data"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">Flete: </Typography>
                          <Typography variant="body2">
                            {presupuestador.gloc_flete !== null &&
                            presupuestador.gloc_flete !== undefined
                              ? presupuestador.gloc_flete.toLowerCase()
                              : "Sin data"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">
                            Gestion Dig:{" "}
                          </Typography>
                          <Typography variant="body2">
                            {presupuestador.gloc_gestdigdoc !== null &&
                            presupuestador.gloc_gestdigdoc !== undefined
                              ? presupuestador.gloc_gestdigdoc.toLowerCase()
                              : "Sin data"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">Banco: </Typography>
                          <Typography variant="body2">
                            {presupuestador.gloc_bancos !== null &&
                            presupuestador.gloc_bancos !== undefined
                              ? presupuestador.gloc_bancos.toLowerCase()
                              : "Sin data"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">
                            Terminal:{" "}
                          </Typography>
                          <Typography variant="body2">
                            {presupuestador.gloc_polizas !== null &&
                            presupuestador.gloc_polizas !== undefined
                              ? presupuestador.gloc_polizas.toLowerCase()
                              : "Sin data"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">Fwd: </Typography>
                          <Typography variant="body2">
                            {presupuestador.gloc_fwd !== null &&
                            presupuestador.gloc_fwd !== undefined
                              ? presupuestador.gloc_fwd.toLowerCase()
                              : "Sin data"}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item sm={6} md={4}>
                    <Stack spacing={1}>
                      <Typography variant="h4">Proveedores OEM</Typography>
                      <Stack spacing={0}>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">OEM 1 : </Typography>
                          <Typography variant="body2">
                            {presupuestador.oemprove1 !== null &&
                            presupuestador.oemprove1 !== undefined &&
                            presupuestador.oemprove1 !== ""
                              ? presupuestador.oemprove1.toLowerCase()
                              : "Sin data"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">OEM 2 : </Typography>
                          <Typography variant="body2">
                            {presupuestador.oemprove2 !== null &&
                            presupuestador.oemprove2 !== undefined &&
                            presupuestador.oemprove2 !== ""
                              ? presupuestador.oemprove2
                              : "Sin data"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">OEM 3 : </Typography>
                          <Typography variant="body2">
                            {presupuestador.oemprove3 !== null &&
                            presupuestador.oemprove3 !== undefined &&
                            presupuestador.oemprove3 !== ""
                              ? presupuestador.oemprove3
                              : "Sin data"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">OEM 4 : </Typography>
                          <Typography variant="body2">
                            {presupuestador.oemprove4 !== null &&
                            presupuestador.oemprove4 !== undefined &&
                            presupuestador.oemprove4 !== ""
                              ? presupuestador.oemprove4
                              : "Sin data"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">OEM 5 : </Typography>
                          <Typography variant="body2">
                            {presupuestador.oemprove5 !== null &&
                            presupuestador.oemprove5 !== undefined &&
                            presupuestador.oemprove5 !== ""
                              ? presupuestador.oemprove5
                              : "Sin data"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">OEM 6 : </Typography>
                          <Typography variant="body2">
                            {presupuestador.oemprove6 !== null &&
                            presupuestador.oemprove6 !== undefined &&
                            presupuestador.oemprove6 !== ""
                              ? presupuestador.oemprove6
                              : "Sin data"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">OEM 7 : </Typography>
                          <Typography variant="body2">
                            {presupuestador.oemprove6 !== null &&
                            presupuestador.oemprove6 !== undefined &&
                            presupuestador.oemprove6 !== ""
                              ? presupuestador.oemprove6
                              : "Sin data"}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid> */}
            </Grid>
          </SubCard>
        </Grid>
      )}
      <Grid item xs={12}>
        <SubCard
          title="Products"
          content={false}
          secondary={
            <Typography variant="subtitle1">
              {verMas ? (
                <Tab
                  container
                  alignItems="right"
                  label="Ver mas"
                  icon={<FindInPageOutlinedIcon />}
                  onClick={verMasImp}
                />
              ) : (
                <Tab
                  container
                  alignItems="right"
                  label="Ocultar"
                  icon={<FindInPageOutlinedIcon />}
                  onClick={verMasImp}
                />
              )}
            </Typography>
          }
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow> 
                     
                      {/*VISTA ABREVIADA*/}
                      {verMas ? (
                        <>
                          <TableCell sx={{ pl: 3, minWidth:280}}>Description</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:90}}>NCM</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:90}}>EXW U</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:90}}>FOB U</TableCell>                     
                          <TableCell align="right" sx={{ pl: 3, minWidth:90}}>Cant PCS</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:80}}>PCS x Caja</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:90}}>CBM x Caja</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:90}}>Peso x Caja</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:90}}>CBM TOT</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:90}}>PESO TOT</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:90}}>CIF TOT</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:90}}>IMP TOT</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:90}}>G. LOC</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:90}}>EXTRA G.</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:90}}>COSTOu USD</TableCell>
                         
                         </>
                      ) : (
                        
                        <>
                         {/*VISTA FULL*/}
                          <TableCell sx={{ pl: 5, minWidth:400}}>Description</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:100}}>NCM</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:100}}>SKU</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:220}}>OEM</TableCell>                   
                          <TableCell align="right" sx={{ pl: 3, minWidth:100}}>EXW u</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:80}}>FOB u</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:80}}>PCS x Caja</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:80}}>CBM x Caja</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:110}}>PESO x Caja</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:110}}>Cant. Cajas</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:110}}>CBM TOT</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:110}}>PESO TOT</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:110}}>FOB TOT</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:110}}>FP</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:100}}>FREIGHT CHRG</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:100}}>INSUR. CHRG</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:110}}>CIF TOT</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:110}}>FOB to CIF</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:100}}>ARANC.%</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:100}}>ARANC USD</TableCell>
                          {
                          pais==7?(
                                <>
                                <TableCell align="right" sx={{ pl: 3, minWidth:100}}>TE%</TableCell>
                                <TableCell align="right" sx={{ pl: 3, minWidth:100}}>TE USD</TableCell>
                                </>
                                ):(
                                <>
                                <TableCell align="right" sx={{ pl: 3, minWidth:100}}>DTA%</TableCell>
                                <TableCell align="right" sx={{ pl: 3, minWidth:100}}>DTA USD</TableCell>
                                <TableCell align="right" sx={{ pl: 3, minWidth:100}}>BASE IVA</TableCell>
                                <TableCell align="right" sx={{ pl: 3, minWidth:100}}>IVA%</TableCell>
                                <TableCell align="right" sx={{ pl: 3, minWidth:100}}>IVA USD</TableCell>
                                </>
                                )
                          }
                          {pais==7?(
                                <>
                                
                                <TableCell align="right" sx={{ pl: 3, minWidth:100}}>IVA Ad%</TableCell>
                                <TableCell align="right" sx={{ pl: 3, minWidth:100}}>IVA Ad USD</TableCell>
                                <TableCell align="right" sx={{ pl: 3, minWidth:100}}>IIBB%</TableCell>
                                <TableCell align="right" sx={{ pl: 3, minWidth:100}}>IIBB USD</TableCell>
                                <TableCell align="right" sx={{ pl: 3, minWidth:100}}>GCIAS %</TableCell>
                                <TableCell align="right" sx={{ pl: 3, minWidth:100}}>GCIAS USD</TableCell>
                                </>
                          ):
                          ("")
                          }
                          <TableCell align="right" sx={{ pl: 3, minWidth:90}}>IMP TOT</TableCell>
                          <TableCell align="right" sx={{ pl: 12, minWidth:100}}>GLOC TERM</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:100}}>GLOC FLETE</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:100}}>GLOC FWD</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:100}}>GLOC DESPA</TableCell>
                          {pais==7?(
                                <>
                                <TableCell align="right" sx={{ pl: 3, minWidth:100}}>GLOC BANC</TableCell>
                                <TableCell align="right" sx={{ pl: 3, minWidth:100}}>GLOC CUST</TableCell>
                                </>
                                ):("")
                          }
                          <TableCell align="right" sx={{ pl: 3, minWidth:100}}>GLOC TOT</TableCell>
                          <TableCell align="right" sx={{ pl: 12, minWidth:150}}>extrg LOC1</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:100}}>extrg LOC2</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:100}}>extrg CMX1</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:100}}>extrg CMX2</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:100}}>extrg CMX3</TableCell>
                          <TableCell align="right" sx={{ pl: 1, minWidth:220}}>extrg CMX NOTAS</TableCell>
                          <TableCell align="right" sx={{ pl: 12, minWidth:100}}>extrg FIN1</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:100}}>extrg FIN2</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:100}}>extrg FIN3</TableCell>
                          <TableCell align="right" sx={{ pl: 3, minWidth:220}}>extrg FIN NOTAS</TableCell>
                          <TableCell align="right" sx={{ pl: 10, minWidth:100}}>EXTRG gCMX1</TableCell>
                          <TableCell align="right" sx={{ pl: 1, minWidth:100}}>EXTRG gCMX2</TableCell>
                          <TableCell align="right" sx={{ pl: 1, minWidth:100}}>EXTRG gCMX3</TableCell>
                          <TableCell align="right" sx={{ pl: 1, minWidth:100}}>EXTRG gCMX4</TableCell>
                          <TableCell align="right" sx={{ pl: 1, minWidth:100}}>EXTRG gCMX5</TableCell>
                          <TableCell align="right" sx={{ pl: 10, minWidth:100}}>EXTRG gFIN1</TableCell>
                          <TableCell align="right" sx={{ pl: 1, minWidth:100}}>EXTRG gFIN2</TableCell>
                          <TableCell align="right" sx={{ pl: 1, minWidth:100}}>EXTRG gFIN3</TableCell>
                          <TableCell align="right" sx={{ pl: 1, minWidth:100}}>EXTRG gFIN4</TableCell>
                          <TableCell align="right" sx={{ pl: 1, minWidth:100}}>EXTRG gFIN5</TableCell>
                          <TableCell align="right" sx={{ pl: 10, minWidth:140}}>extrg TOT</TableCell>
                          <TableCell align="right" sx={{ pl: 10, minWidth:100}}>COSTO u</TableCell>
                          

                          

                        </>
                      )}
                      <TableCell align="right" sx={{ pr: 3 }} />
                    </TableRow>
                  </TableHead>
                  <TableBody>

                    {rows.length === 0 ? (
                      <TableRow>
                        <TableCell>Cargando...</TableCell>
                      </TableRow>
                    ) : (
                      rows.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ pl: 3 }}>
                            <Typography align="left" variant="subtitle1">
                              {row.description ? row.description : ""}
                              {/* {row.description} */}
                              {console.log(row)}
                            </Typography>
                          </TableCell>
                          {/* DATOS DE LA VISTA ABREVIADA */ }
                          {verMas?(
                          <>
                          <TableCell align="right">
                          {rowsAddData[index].ncm_str ? rowsAddData[index].ncm_str : 0}
                          </TableCell>
                          <TableCell align="right">
                            USD {row.exw_u ? row.exw_u.toFixed(3) : "0.0"}
                          </TableCell>
                          <TableCell align="right">
                            USD {row.fob_u ? row.fob_u.toFixed(3) : "0.0"}
                          </TableCell>
                          <TableCell align="right">
                            {row.qty ? row.qty : "0"}u.
                          </TableCell>
                          <TableCell align="right">
                            {row.pcsctn ? row.pcsctn : "0"}u.
                          </TableCell>
                          <TableCell align="right">
                            {row.cbmctn ? row.cbmctn.toFixed(4) : "0"}m3
                          </TableCell>
                          <TableCell align="right">
                            {row.gwctn ? row.gwctn.toFixed(2) : "0"}kg
                          </TableCell>
                          <TableCell align="right">
                            {row.totalcbm ? row.totalcbm.toFixed(2) : "0"}m3
                          </TableCell> 
                          <TableCell align="right">
                            {row.totalgw ? row.totalgw.toFixed(2) : "0"}kg
                          </TableCell> 
                          <TableCell align="right">
                            USD {row.totalcif ? row.totalcif.toFixed(2) : "0"}
                          </TableCell> 
                          {/*console.log(rows)*/} 
                          <TableCell align="right">
                           USD {sumImpuestosPais(row,pais).toFixed(2)}
                          </TableCell> 
                          <TableCell>
                            USD { sumGlocPais(row,pais).toFixed(2)}
                          </TableCell>  
                          
                          <TableCell align="right">
                          USD { sumExtrag(row).toFixed(2)}
                          </TableCell> 
                          <TableCell align="right">
                            USD {row.costo_u ? row.costo_u.toFixed(3) : ""}
                          </TableCell> 
                          </>
                          ):(
                              <>
                          { /* DATOS DE LA VISTA FULL */}
                          <TableCell align="right">
                            {rowsAddData[index].ncm_str ? rowsAddData[index].ncm_str : 0}
                          </TableCell> 
                          <TableCell align="right">
                            {row.sku ? row.sku : 0}
                          </TableCell> 
                          <TableCell align="right">
                            {rowsAddData[index].proveedor ? rowsAddData[index].proveedor : 0}
                          </TableCell> 
                          <TableCell align="right">
                            USD {row.exw_u? row.exw_u.toFixed(2) : 0}
                          </TableCell> 
                          <TableCell align="right">
                            USD {row.fob_u? row.fob_u.toFixed(2) : 0}
                          </TableCell> 
                          <TableCell align="right">
                            {row.pcsctn? row.pcsctn : 0} u.
                          </TableCell>
                          <TableCell align="right">
                            {row.cbmctn? row.cbmctn.toFixed(4) : 0.00} m3
                          </TableCell>
                          <TableCell align="right">
                            {row.gwctn? row.gwctn.toFixed(2) : 0.0} kg
                          </TableCell>
                          <TableCell align="right">
                            {(row.pcsctn>1)?Math.ceil(row.qty/row.pcsctn).toFixed(2): 0.0}u.
                          </TableCell> 
                          <TableCell align="right">
                            {row.totalcbm? row.totalcbm.toFixed(2) : 0.0} m3
                          </TableCell>
                          <TableCell align="right">
                            {row.totalgw? row.totalgw.toFixed(2) : 0.0} kg
                          </TableCell>
                          <TableCell align="right">
                            USD {row.totalfob? row.totalfob.toFixed(2) : 0.0}
                          </TableCell>
                          <TableCell align="right">
                            {row.factorproducto? row.factorproducto.toFixed(2) : 0.0}%
                          </TableCell>
                          <TableCell align="right">
                            {row.freightCharge? row.freightCharge.toFixed(2) : 0.0}
                          </TableCell>
                          <TableCell align="right">
                            {row.insuranceCharge? row.insuranceCharge.toFixed(2) : 0.0}
                          </TableCell>
                          <TableCell align="right">
                            {row.totalcif? row.totalcif.toFixed(2) : 0.0}
                          </TableCell>
                          <TableCell align="right">
                            {row.totalfob>0?(row.totalcif/row.totalfob).toFixed(3):0.0}
                          </TableCell>  
                          <TableCell align="right">
                            {row.ncm_arancel? row.ncm_arancel.toFixed(3) : 0.0} %
                          </TableCell>
                          <TableCell align="right">
                            USD {row.arancelgrav_cif? row.arancelgrav_cif.toFixed(2) : 0.0} 
                          </TableCell>
                          <TableCell align="right">
                            {row.ncm_te_dta_otro? row.ncm_te_dta_otro.toFixed(3) : 0.0} %
                          </TableCell>
                          <TableCell align="right">
                            USD {row.te_dta_otro_cif? row.te_dta_otro_cif.toFixed(2) : 0.0}
                          </TableCell>
                          <TableCell align="right">
                           USD {row.baseiva? row.baseiva.toFixed(2) : 0.0}
                          </TableCell>
                          <TableCell align="right">
                            {row.ncm_iva? row.ncm_iva.toFixed(3) : 0.0} %
                          </TableCell>
                          <TableCell align="right">
                            USD {row.iva_cif? row.iva_cif.toFixed(2) : 0.0}
                          </TableCell>
                          {pais==7?(
                                <>
                                <TableCell align="right">
                                    {row.ncm_ivaad? row.ncm_ivaad.toFixed(3) : 0.0} %
                                </TableCell>
                                <TableCell align="right">
                                    USD {row.ivaad_cif? row.ivaad_cif.toFixed(2) : 0.0}
                                </TableCell>
                                <TableCell align="right">
                                    {row.gcias? row.gcias.toFixed(3) : 0.0} %
                                </TableCell>
                                <TableCell align="right">
                                    USD {row.gcias42? row.gcias42.toFixed(2): 0.0}u.
                                </TableCell> 
                                <TableCell align="right">
                                    {presupuestador.estHeader.iibb_total? presupuestador.estHeader.iibb_total.toFixed(3) : 0.0} %
                                </TableCell>
                                <TableCell align="right">
                                    USD {row.iibb900? row.iibb900.toFixed(2) : 0.0} u.
                                </TableCell>
                                </>
                          ):("")}
                           <TableCell align="right">
                            USD {sumImpuestosPais(row,pais).toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            USD {row.gloc_terminales? row.gloc_terminales.toFixed(2) : 0}
                          </TableCell> 
                          <TableCell align="right">
                            USD {row.gloc_flete? row.gloc_flete.toFixed(2) : 0}
                          </TableCell> 
                          <TableCell align="right">
                            USD {row.gloc_fwd? row.gloc_fwd.toFixed(2) : 0}
                          </TableCell> 
                          <TableCell align="right">
                            USD {row.gloc_despachantes? row.gloc_despachantes.toFixed(2) : 2}
                          </TableCell> 

                          {
                            pais==7?(
                              <>
                                <TableCell align="right">
                                  USD {row.gloc_bancos? row.gloc_bancos.toFixed(2) : 0}
                                </TableCell>                                
                                <TableCell align="right">
                                 USD {row.gloc_polizas? row.gloc_polizas.toFixed(2) : 0.0}
                                </TableCell>

                              </>
                            ):("")
                          }
                           <TableCell align="right">
                            USD { sumGlocPais(row,pais).toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            USD {row.extrag_local1? row.extrag_local1.toFixed(2) : "0"}
                          </TableCell>
                          <TableCell align="right">
                            USD {row.extrag_local2? row.extrag_local2.toFixed(2) : "0"}
                          </TableCell>
                          <TableCell align="right">
                            USD {row.extrag_comex1? row.extrag_comex1.toFixed(2) : "0"}
                          </TableCell>
                          <TableCell align="right">
                            USD {row.extrag_comex2? row.extrag_comex2.toFixed(2) : "0"}
                          </TableCell>
                          <TableCell align="right">
                            USD {row.extrag_comex3? row.extrag_comex3.toFixed(2) : "0"}
                          </TableCell>
                          <TableCell align="right">
                            {row.extrag_comex_notas? row.extrag_comex_notas : ""}
                          </TableCell>
                          <TableCell align="right">
                            USD {row.extrag_finan1? row.extrag_finan1.toFixed(2) : "0"}
                          </TableCell>
                          <TableCell align="right">
                            USD {row.extrag_finan2? row.extrag_finan2.toFixed(2) : "0"}
                          </TableCell>
                          <TableCell align="right">
                            USD {row.extrag_finan3? row.extrag_finan3.toFixed(2) : "0"}
                          </TableCell>
                          <TableCell align="right">
                            {row.extrag_finan_notas? row.extrag_finan_notas : ""}
                          </TableCell>

                          <TableCell align="right">
                            USD {row.extrag_glob_comex1? row.extrag_glob_comex1.toFixed(2) : "0"}
                          </TableCell>
                          <TableCell align="right">
                            USD {row.extrag_glob_comex2? row.extrag_glob_comex2.toFixed(2) : "0"}
                          </TableCell>
                          <TableCell align="right">
                            USD {row.extrag_glob_comex3? row.extrag_glob_comex3.toFixed(2) : "0"}
                          </TableCell>
                          <TableCell align="right">
                            USD {row.extrag_glob_comex4? row.extrag_glob_comex4.toFixed(2) : "0"}
                          </TableCell>
                          <TableCell align="right">
                            USD {row.extrag_glob_comex5? row.extrag_glob_comex5.toFixed(2) : "0"}
                          </TableCell>
                          <TableCell align="right">
                            USD {row.extrag_glob_finan1? row.extrag_glob_finan1.toFixed(2) : "0"}
                          </TableCell>
                          <TableCell align="right">
                            USD {row.extrag_glob_finan2? row.extrag_glob_finan2.toFixed(2) : "0"}
                          </TableCell>
                          <TableCell align="right">
                            USD {row.extrag_glob_finan3? row.extrag_glob_finan3.toFixed(2) : "0"}
                          </TableCell>
                          <TableCell align="right">
                            USD {row.extrag_glob_finan4? row.extrag_glob_finan4.toFixed(2) : "0"}
                          </TableCell>
                          <TableCell align="right">
                            USD {row.extrag_glob_finan5? row.extrag_glob_finan5.toFixed(2) : "0"}
                          </TableCell>
                          <TableCell align="right">
                            USD { sumExtrag(row).toFixed(2) }
                          </TableCell> 
                          <TableCell align="right">
                            USD {row.costo_u ? row.costo_u.toFixed(3) : ""}
                          </TableCell>

                          </>
                          )}



                          

                          
                          

                          {/* ICONO DE BORRADO por ahora innecesario */}
                          {/* <TableCell sx={{ pr: 3 }} align="right">
                                                        <IconButton
                                                            color="primary"
                                                            size="large"
                                                            aria-label="product delete"
                                                            onClick={() => deteleDetails(row.id)}
                                                        >
                                                            <DeleteTwoToneIcon />
                                                        </IconButton>
                                                    </TableCell> */}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12}>
              <SubCard
                sx={{
                  mx: 3,
                  mb: 3,
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? theme.palette.dark.main
                      : theme.palette.primary.light,
                }}
              >
                <Grid container justifyContent="flex-end" spacing={gridSpacing}>
                  {loading2 ? (
                    <div
                      style={{
                        margin: "auto",
                        display: "block",
                        paddingTop: "25px",
                      }}
                    >
                      <CircularProgress margin="auto" />
                    </div>
                  ) : (
                    <Grid item sm={6} md={4}>
                      {/* RESULTADOS */}
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Grid container spacing={1}>
                            <Grid item xs={6}>
                              <Typography align="right" variant="subtitle1">
                                Fob Gran Total :
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography align="right" variant="body2">
                                USD{" "}
                                {presupuestador.estHeader.fob_grand_total || presupuestador.estHeader.fob_grand_total == 0
                                  ? UtilidadesHelper.formatNumber(
                                      presupuestador.estHeader.fob_grand_total.toFixed(2)
                                    )
                                  : "Sin data"}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography align="right" variant="subtitle1">
                                {/* Aranceles / Pagado (10%): */}
                                Aranceles Pagados:
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography align="right" variant="body2">
                                USD{" "}
                                {presupuestador.estHeader.impuestos_total || presupuestador.estHeader.impuestos_total == 0
                                  ? UtilidadesHelper.formatNumber(
                                      presupuestador.estHeader.impuestos_total.toFixed(2)
                                    )
                                  : "Sin data"}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography align="right" variant="subtitle1">
                                {/* Discount (5%) : */}
                                Flete:
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography align="right" variant="body2">
                              USD{" "}
                            {presupuestador.estHeader.gloc_flete || presupuestador.estHeader.gloc_flete == 0
                              ? UtilidadesHelper.formatNumber(
                                  presupuestador.estHeader.gloc_flete.toFixed(2)
                                )
                              : "Sin dataa"}
                              </Typography>
                            </Grid>
                            {/* <Grid item xs={6}>
                              <Typography align="right" variant="subtitle1">
                                Seguro:
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography align="right" variant="body2">
                                USD{" "}
                                {presupuestador.estHeader.seguro
                                  ? UtilidadesHelper.formatNumber(
                                      presupuestador.estHeader.seguro.toFixed(2)
                                    )
                                  : "Sin data"}
                              </Typography>
                            </Grid> */}
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <Divider sx={{ bgcolor: "dark.main" }} />
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container spacing={1}>
                            <Grid item xs={6}>
                              <Typography
                                align="right"
                                color="primary"
                                variant="subtitle1"
                              >
                                CIF Total USD:
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography
                                align="right"
                                color="primary"
                                variant="subtitle1"
                              >
                                USD{" "}
                                {presupuestador.estHeader.cif_grand_total || presupuestador.estHeader.cif_grand_total == 0
                                  ? UtilidadesHelper.formatNumber(
                                      presupuestador.estHeader.cif_grand_total.toFixed(2)
                                    )
                                  : "Sin data"}
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid container spacing={1}>
                            <Grid item xs={6}>
                              <Typography
                                align="right"
                                color="primary"
                                variant="subtitle1"
                              >
                                CIF Total ARS:
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography
                                align="right"
                                color="primary"
                                variant="subtitle1"
                              >
                                ARS{" "}
                                {presupuestador.estHeader.cif_grand_total &&
                                presupuestador.estHeader.dolar
                                  ? UtilidadesHelper.formatNumber(
                                      (
                                        presupuestador.estHeader.cif_grand_total *
                                        presupuestador.estHeader.dolar
                                      ).toFixed(2)
                                    )
                                  : "Sin data"}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </SubCard>
              
            </Grid>
          </Grid>
        </SubCard>
      </Grid>
    </Grid>
  );
};

export default Details;
