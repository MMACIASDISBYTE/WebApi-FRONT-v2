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
  //responde al loading para la vista
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [verMas, setVerMas] = useState(true);
  console.log(rows);

  useEffect(() => {
    const fetchData = async () => {
      if (presupuestador && presupuestador.estDetails) {
        setRow(presupuestador.estDetails);
        //espera la respuesta de presupuestador y quita el loading
        setLoading(false);
      }
    };

    fetchData();
    console.log(presupuestador);
    console.log(presupuestador.estDetails);
    console.log(presupuestador.estHeader);
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
    navigate(`/estimate/update-estimate/${estnumber}/${estvers}`);
  };

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
                            presupuestador.estnumber,
                            presupuestador.estvers
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
                            {presupuestador.estHeader.carga_id
                              ? presupuestador.estHeader.carga_id
                              : "Sin data"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">
                            Cant Contenedores:
                          </Typography>
                          <Typography variant="body2">
                            {presupuestador.estHeader.cantidad_contenedores
                              ? presupuestador.estHeader.cantidad_contenedores.toFixed(2)
                              : "Sin data"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">CBM m3 :</Typography>
                          <Typography variant="body2">
                            {(presupuestador.estHeader.cbm_grand_total || 0)
                              ? presupuestador.estHeader.cbm_grand_total.toFixed(3)
                              : "Sin dataa"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">
                            Pais de Origen :
                          </Typography>
                          <Typography variant="body2">
                            {presupuestador.estHeader.paisregion_id
                              ? presupuestador.estHeader.paisregion_id
                              : "Sin data"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">Flete :</Typography>
                          <Typography variant="body2">
                            USD{" "}
                            {presupuestador.estHeader.gloc_flete
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
                            {presupuestador.estHeader.freight_cost
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
                            {presupuestador.estHeader.freight_insurance_cost
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
                            {presupuestador.estnumber
                              ? presupuestador.estnumber
                              : "Sin data"}
                          </Typography>
                          <Typography variant="subtitle1">
                            /00
                            {presupuestador.estvers
                              ? presupuestador.estvers
                              : "Sin data"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">Detalle:</Typography>
                          <Typography variant="body2">
                            {presupuestador.description
                              ? presupuestador.description
                              : "Sin data"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">Emisor :</Typography>
                          <Typography variant="body2">
                            {presupuestador.own
                              ? presupuestador.own
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
                            {presupuestador.dolar
                              ? presupuestador.dolar
                              : "Sin data"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">
                            Gastos loc. Proy :
                          </Typography>
                          <Typography variant="body2">
                            ARS${" "}
                            {presupuestador.gastos_loc_total
                              ? UtilidadesHelper.formatNumber(
                                  presupuestador.gastos_loc_total.toFixed(2)
                                )
                              : "Sin data"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">IVA Exc :</Typography>
                          <Typography variant="body2">
                            {presupuestador.iibb_total ? "Si" : "No"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1">IIBB :</Typography>
                          <Typography variant="body2">
                            {presupuestador.iibbTot
                              ? presupuestador.iibbTot.toFixed(2)
                              : "Sin data"}{" "}
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
                            {presupuestador.htimestamp
                              ? format(
                                  new Date(presupuestador.htimestamp),
                                  "dd/MM/yy HH:mm"
                                )
                              : "Sin data"}
                            hs
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
                      <TableCell sx={{ pl: 3 }}>Description</TableCell>
                      <TableCell align="right">FOBUnit</TableCell>
                      <TableCell align="right">CantPcs</TableCell>
                      <TableCell align="right">Peso Total</TableCell>
                      <TableCell align="right">CBM Total</TableCell>
                      <TableCell align="right">CIF Total</TableCell>
                      <TableCell align="right">Costo USD(u)</TableCell>
                      <TableCell align="right">Costo Est. USD(u)</TableCell>
                      <TableCell align="right">Costo Prov(u)</TableCell>
                      {verMas ? (
                        ""
                      ) : (
                        <>
                          <TableCell align="right">IIBB</TableCell>
                          <TableCell align="right">Derechos</TableCell>
                          <TableCell align="right">Tasa E. 061</TableCell>
                          <TableCell align="right">Base Iva Cif</TableCell>
                          <TableCell align="right">Iva Cif</TableCell>
                          <TableCell align="right">Iva Ad Cif</TableCell>
                          <TableCell align="right">IIBB 900</TableCell>
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
                              {row.description ? row.description : "Sin data"}
                              {/* {row.description} */}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            USD {row.fob_u ? row.fob_u.toFixed(3) : 'Sin data'}
                          </TableCell>
                          <TableCell align="right">
                            {row.qty ? row.qty : "Sin data"}u.
                          </TableCell>
                          <TableCell align="right">
                            {row.pesoTot ? row.pesoTot : "Sin data"}Kg
                          </TableCell>
                          <TableCell align="right">
                            {row.cbmctn ? UtilidadesHelper.formatNumber(
                              row.cbmctn.toFixed(2)
                            ) : 'Sin data'}
                            m3
                          </TableCell>
                          <TableCell align="right">
                            USD{" "}
                            {row.totalcif
                              ? UtilidadesHelper.formatNumber(
                                  row.totalcif.toFixed(2)
                                )
                              : "Sin data"}
                          </TableCell>
                          <TableCell align="right">
                            USD{" "}
                            {row.costo_u
                              ? UtilidadesHelper.formatNumber(
                                  row.costo_u.toFixed(2)
                                )
                              : "Sin data"}
                          </TableCell>
                          <TableCell align="right">
                            USD{" "}
                            {(row.costo_u_est || row.costo_u_est == 0)
                              ? UtilidadesHelper.formatNumber(
                                  row.costo_u_est.toFixed(2)
                                )
                              : "Sin data"}
                          </TableCell>
                          <TableCell align="right">
                            ARS{" "}
                            {(row.costo_u_prov || row.costo_u_prov == 0)
                              ? UtilidadesHelper.formatNumber(
                                  row.costo_u_prov.toFixed(2)
                                )
                              : "SIn data"}
                          </TableCell>
                          {verMas ? (
                            ""
                          ) : (
                            <>
                              <TableCell align="right">
                                USD{" "}
                                {row.iibb900
                                  ? UtilidadesHelper.formatNumber(
                                      row.iibb900.toFixed(2)
                                    )
                                  : "Sin data"}
                              </TableCell>
                              <TableCell align="right">
                                USD{" "}
                                {row.derechos
                                  ? UtilidadesHelper.formatNumber(
                                      row.derechos.toFixed(2)
                                    )
                                  : "Sin data"}
                              </TableCell>
                              <TableCell align="right">
                                USD{" "}
                                {row.tasaEstad061
                                  ? UtilidadesHelper.formatNumber(
                                      row.tasaEstad061.toFixed(2)
                                    )
                                  : "Sin data"}
                              </TableCell>
                              <TableCell align="right">
                                USD{" "}
                                {row.baseiva
                                  ? UtilidadesHelper.formatNumber(
                                      row.baseiva.toFixed(2)
                                    )
                                  : "Sin data"}
                              </TableCell>
                              <TableCell align="right">
                                USD{" "}
                                {row.iva_cif
                                  ? UtilidadesHelper.formatNumber(
                                      row.iva_cif.toFixed(2)
                                    )
                                  : "Sin data"}
                              </TableCell>
                              <TableCell align="right">
                                USD{" "}
                                {row.ivaad_cif || row.ivaad_cif == 0
                                  ? UtilidadesHelper.formatNumber(
                                      row.ivaad_cif.toFixed(2)
                                    )
                                  : "SIn data"}
                              </TableCell>
                              <TableCell align="right">{row.iibb900 ? UtilidadesHelper.formatNumber(row.iibb900.toFixed(2)) : 'Sin data'}</TableCell>
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
                                {presupuestador.estHeader.fob_grand_total
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
                                {presupuestador.estHeader.impuestos_total
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
                                {presupuestador.estHeader.gloc_flete
                                  ? UtilidadesHelper.formatNumber(
                                      presupuestador.estHeader.gloc_flete.toFixed(2)
                                    )
                                  : "Sin data"}
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
                                {presupuestador.estHeader.cif_grand_total
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
