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
  Tooltip,
  Typography,
} from "@mui/material";
// Importa CircularProgress de Material UI
import { CircularProgress, makeStyles } from "@material-ui/core";
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
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { Box } from "@mui/system";
import { ImagenAvatar } from "../CreatePresupuesto/ImagenAvatar";

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

const Details = ({ presupuestador, usuario, historico }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const permisos = useAccessTokenJWT();
  // console.log(permisos);

  const editarPresu = permisos.includes("presupuesto:edit");

  // console.log(presupuestador);
  // console.log(usuario);
  console.log(historico);
  const [rows, setRow] = useState([]);
  // Detalles que complementan cada row del detail, son detalles del tipo VISTA, FK que fueron convertidas a texto.
  // No se agregan a la definicion del estDetail, mas es una lista complementaria de igual dimencion.
  const [rowsAddData, setRowAddData] = useState([]);
  //responde al loading para la vista
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [verMas, setVerMas] = useState(true);
  const [pais, setPais] = useState(0);
  const [showHistorico, setShowHistorico] = useState(false);
  //console.log(rows);
  //console.log(pais);

  useEffect(() => {
    const fetchData = async () => {
      if (presupuestador && presupuestador.estDetails) {
        // El detail propiamente dicho
        setRow(presupuestador.estDetails);
        // Los datos adicionales que acompañan a cada detalle, fruto de convertir FKs en descripcion.
        setRowAddData(presupuestador.estDetAddData);
        console.log(rows);
        //espera la respuesta de presupuestador y quita el loading
        setLoading(false);
        setPais(presupuestador.estHeader.paisregion_id);
      }
    };

    fetchData();
    //console.log(presupuestador);
    console.log(presupuestador.estDetails);

    //console.log(presupuestador.estHeader);
    // console.log(presupuestador.estHeader.description);
  }, [presupuestador]);

  useEffect(() => {
    if (presupuestador.estHeader != null && loading == false) {
      setLoading2(false);
    }
    console.log(rows);
  }, [rows, loading]);

  const deteleDetails = async (id) => {
    console.log(`se hizo click en el ${id}`);
  };

  const nuevoPresupuesto = (estnumber, estvers) => {
    console.log(estnumber, "de list");
    console.log(estvers, "de list");
    navigate(`/estimate/update-estimateMEX/${estnumber}/${estvers}`);
    // navigate(`/estimate/update-estimate/${estnumber}/${estvers}`);
  };

  // totales de los que no dispone el json o no estan operativos a la fecha
  // Suma de los extrag
  function sumExtrag(myRow) {
    return (
      myRow.extrag_comex1 +
      myRow.extrag_comex2 +
      myRow.extrag_comex3 +
      myRow.extrag_finan1 +
      myRow.extrag_finan2 +
      myRow.extrag_finan3 +
      myRow.extrag_glob_comex1 +
      myRow.extrag_glob_comex2 +
      myRow.extrag_glob_comex3 +
      myRow.extrag_glob_src1 +
      myRow.extrag_glob_src2 +
      myRow.extrag_glob_finan1 +
      myRow.extrag_glob_finan2 +
      myRow.extrag_glob_finan3 +
      myRow.extrag_glob_finan4 +
      myRow.extrag_glob_finan5
    );
  }
  // Suma de los gastos locales
  function sumGlocPais(myRow, pais) {
    if (pais == 7) {
      return (
        myRow.gloc_bancos +
        myRow.gloc_depositos +
        myRow.gloc_despachantes +
        myRow.gloc_flete +
        myRow.gloc_fwd +
        myRow.gloc_gestdigdoc +
        myRow.gloc_polizas +
        myRow.gloc_terminales
      );
    }

    if (pais == 5) {
      return (
        myRow.gloc_despachantes +
        myRow.gloc_flete +
        myRow.gloc_fwd +
        myRow.gloc_terminales
      );
    }
    return 0.0;
  }
  // Suma de los aranceles.
  function sumImpuestosPais(myRow, pais) {
    if (pais == 7) {
      return (
        myRow.arancelgrav_cif +
        myRow.te_dta_otro_cif +
        myRow.iva_cif +
        myRow.ivaad_cif +
        myRow.gcias424 +
        myRow.iibb900
      );
    }
    if (pais == 5) {
      return myRow.arancelgrav_cif + myRow.te_dta_otro_cif + myRow.iva_cif;
    }
  }

  const verMasImp = () => {
    if (!verMas) {
      setVerMas(true);
      return;
    }
    setVerMas(false);
  };
  const useStyles = makeStyles({
    tableCell: {
      borderRight: "1px solid rgba(224, 224, 224, 1)", // Color y grosor del borde
      whiteSpace: "nowrap",
    },
    lastCell: {
      borderRight: "none",
    },
  });
  const classes = useStyles();
  const [isHovered, setIsHovered] = useState(false); //maneja el evento de la imagen

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
                    onClick={() => navigate("/estimateMex/estimate-list")}
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
                <Typography variant="h2" color={"yellowgreen"}>
                  Presupuesto #00
                  {presupuestador.estHeader.estnumber
                    ? presupuestador.estHeader.estnumber
                    : "Sin data"}{" "}
                  /00
                  {presupuestador.estHeader.estvers
                    ? presupuestador.estHeader.estvers
                    : "Sin data"}
                </Typography>
                <Typography variant="h4">
                  Fecha Emision:{" "}
                  {presupuestador.estHeader.htimestamp
                    ? UtilidadesHelper.formatFecha(
                        presupuestador.estHeader.htimestamp
                      )
                    : "Sin data"}
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
                          <Typography variant="subtitle1" color={"green"}>
                            Tipo :
                          </Typography>
                          <Typography variant="body2">
                            {presupuestador.carga_str
                              ? presupuestador.carga_str
                              : 0}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1" color={"green"}>
                            Cant Contenedores:
                          </Typography>
                          <Typography variant="body2">
                            {presupuestador.estHeader.cantidad_contenedores
                              ? presupuestador.estHeader.cantidad_contenedores.toFixed(
                                  3
                                )
                              : 0.0}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1" color={"green"}>
                            Total CBM[m3]:
                          </Typography>
                          <Typography variant="body2">
                            {presupuestador.estHeader.cbm_grand_total || 0
                              ? presupuestador.estHeader.cbm_grand_total.toFixed(
                                  2
                                )
                              : 0.0}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1" color={"green"}>
                            Pais ORIG {" -> "} DEST :
                          </Typography>
                          <Typography variant="body2">
                            {/*ADVERTENCIA !!!!:. En el presupuesto hay datos sueltos que son complementarios al header.
                                 No se incluyen en el header para no modificar el tipo de datos en todo el back. Se envian como datos sueltos
                                 (no so ni del detail ni del header) en le JSON. Esto se hizo para eliminar los IDs y tener las descripciones
                                 en un solo query, evitando varias fetch*/}
                            {presupuestador.paisorig
                              ? presupuestador.paisorig
                              : ""}
                            {" -> "}
                            {presupuestador.paisdest
                              ? presupuestador.paisdest
                              : ""}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1" color={"green"}>
                            Flete[USD]:
                          </Typography>
                          <Typography variant="body2">
                            {presupuestador.estHeader.gloc_flete ||
                            presupuestador.estHeader.gloc_flete == 0
                              ? UtilidadesHelper.formatNumber(
                                  presupuestador.estHeader.gloc_flete.toFixed(2)
                                )
                              : "Sin data"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1" color={"green"}>
                            Freight Cost[USD]:
                          </Typography>
                          <Typography variant="body2">
                            {presupuestador.estHeader.freight_cost ||
                            presupuestador.estHeader.freight_cost == 0
                              ? UtilidadesHelper.formatNumber(
                                  presupuestador.estHeader.freight_cost.toFixed(
                                    2
                                  )
                                )
                              : "Sin data"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1" color={"green"}>
                            Freight Insurance Cost[USD]:
                          </Typography>
                          <Typography variant="body2">
                            {presupuestador.estHeader.freight_insurance_cost ||
                            presupuestador.estHeader.freight_insurance_cost == 0
                              ? UtilidadesHelper.formatNumber(
                                  presupuestador.estHeader.freight_insurance_cost.toFixed(
                                    2
                                  )
                                )
                              : "Sin data"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1" color={"green"}>
                            Total CIF[USD]:
                          </Typography>
                          <Typography variant="body2">
                            {presupuestador.estHeader.cif_grand_total
                              ? UtilidadesHelper.formatNumber(
                                  presupuestador.estHeader.cif_grand_total.toFixed(
                                    2
                                  )
                                )
                              : "Sin data"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1" color={"green"}>
                            Impuestos[USD]:
                          </Typography>
                          <Typography variant="body2">
                            {presupuestador.estHeader.impuestos_total
                              ? UtilidadesHelper.formatNumber(
                                  presupuestador.estHeader.impuestos_total.toFixed(
                                    2
                                  )
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
                          <Typography variant="subtitle1" color={"green"}>
                            #00
                            {presupuestador.estHeader.estnumber
                              ? presupuestador.estHeader.estnumber
                              : "#"}
                          </Typography>
                          <Typography variant="subtitle1" color={"green"}>
                            / V0
                            {presupuestador.estHeader.estvers
                              ? presupuestador.estHeader.estvers
                              : "#"}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            paddingLeft={3}
                            color={"green"}
                          >
                            id:
                            {presupuestador.estHeader.id
                              ? presupuestador.estHeader.id
                              : "#"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1" color={"green"}>
                            Detalle:
                          </Typography>
                          <Typography variant="body2">
                            {presupuestador.estHeader.description
                              ? presupuestador.estHeader.description
                              : "Sin data"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1" color={"green"}>
                            Prj:
                          </Typography>
                          <Typography variant="body2">
                            {presupuestador.estHeader.project
                              ? presupuestador.estHeader.project
                              : "Sin data"}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1" color={"green"}>
                            Emisor :
                          </Typography>
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

                        {/* <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1" color={"green"}>
                            Dolar Billete :
                          </Typography>
                          <Typography variant="body2">
                            ARS${" "}
                            {presupuestador.estHeader.dolar
                              ? presupuestador.estHeader.dolar.toFixed(2)
                              : "Sin data"}
                          </Typography>
                        </Stack> */}
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1" color={"green"}>
                            Total Gastos loc.[USD]:
                          </Typography>
                          <Typography variant="body2">
                            {presupuestador.estHeader.gastos_loc_total ||
                            presupuestador.estHeader.gastos_loc_total == 0
                              ? UtilidadesHelper.formatNumber(
                                  presupuestador.estHeader.gastos_loc_total.toFixed(
                                    2
                                  )
                                )
                              : "Sin data"}
                          </Typography>
                        </Stack>

                        {/* <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1" color={"green"}>
                            IVA Exc :
                          </Typography>
                          <Typography variant="body2">
                            {presupuestador.ivaexcento ? "Si" : "No"}
                          </Typography>
                        </Stack> */}

                        {/* <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1" color={"green"}>
                            IIBB :
                          </Typography>
                          <Typography variant="body2">
                            {pais == 7
                              ? presupuestador.estHeader.iibb_total
                                ? `${presupuestador.estHeader.iibb_total.toFixed(
                                    2
                                  )} %`
                                : 0.0
                              : "NA"}
                          </Typography>
                        </Stack> */}
                        <Stack direction="row" spacing={1}>
                          <Typography variant="subtitle1" color={"green"}>
                            Ult. Modificacion :
                          </Typography>
                          <Typography variant="body2">
                            {" "}
                            {/* Para formato de fecha importar date-fns */}
                            {presupuestador.estHeader.htimestamp
                              ? UtilidadesHelper.formatFechaYhora(
                                  presupuestador.estHeader.htimestamp
                                )
                              : "Sin data"}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <Stack spacing={2}>
                      <Typography variant="h4">
                        Historico Presupuesto
                        {showHistorico ? (
                          <Tooltip title="Ver Historico completo">
                            <VisibilityOutlinedIcon
                              variant="text"
                              onClick={() => setShowHistorico(!showHistorico)}
                            />
                          </Tooltip>
                        ) : (
                          <Tooltip title="Reducir Historico">
                            <VisibilityOffOutlinedIcon
                              variant="text"
                              onClick={() => setShowHistorico(!showHistorico)}
                            />
                          </Tooltip>
                        )}
                      </Typography>
                      {(showHistorico ? historico : historico.slice(0, 4)).map(
                        (historial) => (
                          <Stack spacing={0}>
                            {/* <Typography variant="h6" sx={{ mb: 1 }}>
                                                Carrier
                                            </Typography> */}
                            <Stack direction="row" spacing={1}>
                              <Typography variant="subtitle1" color={"green"}>
                                Version:
                              </Typography>
                              <Typography variant="body2">
                                {historial.estvers ? historial.estvers : "#"}
                              </Typography>
                              <Typography variant="subtitle1" color={"green"}>
                                Emisor:
                              </Typography>
                              <Typography variant="body2">
                                {historial.own ? historial.own : "Sin data"}
                              </Typography>
                            </Stack>
                            <Stack direction="row" spacing={1}>
                              <Typography variant="subtitle1" color={"green"}>
                                Fecha:
                              </Typography>
                              <Typography variant="body2">
                                {" "}
                                {/* Para formato de fecha importar date-fns */}
                                {historial.htimestamp
                                  ? UtilidadesHelper.formatFecha(
                                      historial.htimestamp
                                    )
                                  : "Sin data"}
                              </Typography>
                              <Typography variant="subtitle1" color={"green"}>
                                Estado :
                              </Typography>
                              <Typography variant="body2">
                                {historial.status ? historial.status : "0"}
                              </Typography>
                              <Typography variant="subtitle1" color={"green"}>
                                Fob Total[USD]:
                              </Typography>
                              <Typography variant="body2">
                                {historial.fob_grand_total
                                  ? `${historial.fob_grand_total.toFixed(2)}`
                                  : "Sin data"}
                              </Typography>
                            </Stack>
                          </Stack>
                        )
                      )}
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
                          <TableCell
                            align="right"
                            sx={{
                              minWidth: 100,
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            SKU
                          </TableCell>
                          <TableCell
                            align="left"
                            sx={{ minWidth: 400, backgroundColor: "#B8B8B8" }}
                            className={classes.tableCell}
                          >
                            Description
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            Imagen URL
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            NCM
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            EXW U [USD]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            FOB u. [USD]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            Qty[PCS]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              pl: 3,
                              minWidth: 80,
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            PCS/CTN
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            CBM/CTN[m3]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            GW CTN [kg]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            Total CBM [m3]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            Total GW [kg]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            CIF TOT [USD]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            Tot Impuestos[USD]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            Tot Gasto Destino[USD]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            EXTRA G. [USD]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            COSTOu [USD]
                          </TableCell>
                        </>
                      ) : (
                        <>
                          {/*VISTA FULL*/}
                          <TableCell
                            align="right"
                            sx={{
                              minWidth: 100,
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            SKU
                          </TableCell>
                          <TableCell
                            align="left"
                            sx={{ minWidth: 400, backgroundColor: "#B8B8B8" }}
                            className={classes.tableCell}
                          >
                            Description
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            Imagen URL
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            NCM
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              minWidth: 180,
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            Proveedor
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            EXW u [USD]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            FOB u. [USD]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            PCS/CTN
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            CBM/CTN[m3]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            GW CTN [kg]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            Qty[PCS]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            Total CBM [m3]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            Total GW [kg]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            Total FOB[USD]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            FP [%]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            FREIGHT CHRG[USD]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            INSUR. CHRG[USD]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            CIF TOT[USD]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            FOB to CIF[%]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            ARANC.[%]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            ARANC[USD]
                          </TableCell>
                          {pais == 7 ? (
                            <>
                              <TableCell
                                align="right"
                                sx={{
                                  whiteSpace: "nowrap",
                                  backgroundColor: "#B8B8B8",
                                }}
                                className={classes.tableCell}
                              >
                                TE%
                              </TableCell>
                              <TableCell
                                align="right"
                                sx={{
                                  whiteSpace: "nowrap",
                                  backgroundColor: "#B8B8B8",
                                }}
                                className={classes.tableCell}
                              >
                                TE[USD]
                              </TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell
                                align="right"
                                sx={{
                                  whiteSpace: "nowrap",
                                  backgroundColor: "#B8B8B8",
                                }}
                                className={classes.tableCell}
                              >
                                DTA[%]
                              </TableCell>
                              <TableCell
                                align="right"
                                sx={{
                                  whiteSpace: "nowrap",
                                  backgroundColor: "#B8B8B8",
                                }}
                                className={classes.tableCell}
                              >
                                DTA[USD]
                              </TableCell>
                            </>
                          )}
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            BASE IVA[USD]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            IVA[%]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                            className={classes.tableCell}
                          >
                            IVA[USD]
                          </TableCell>
                          {pais == 7 ? (
                            <>
                              <TableCell
                                align="right"
                                sx={{
                                  whiteSpace: "nowrap",
                                  backgroundColor: "#B8B8B8",
                                }}
                                className={classes.tableCell}
                              >
                                IVA Ad[%]
                              </TableCell>
                              <TableCell
                                align="right"
                                sx={{
                                  whiteSpace: "nowrap",
                                  backgroundColor: "#B8B8B8",
                                }}
                                className={classes.tableCell}
                              >
                                IVA Ad[USD]
                              </TableCell>
                              <TableCell
                                align="right"
                                sx={{
                                  whiteSpace: "nowrap",
                                  backgroundColor: "#B8B8B8",
                                }}
                                className={classes.tableCell}
                              >
                                IIBB[%]
                              </TableCell>
                              <TableCell
                                align="right"
                                sx={{
                                  whiteSpace: "nowrap",
                                  backgroundColor: "#B8B8B8",
                                }}
                                className={classes.tableCell}
                              >
                                IIBB[USD]
                              </TableCell>
                              <TableCell
                                align="right"
                                sx={{
                                  whiteSpace: "nowrap",
                                  backgroundColor: "#B8B8B8",
                                }}
                                className={classes.tableCell}
                              >
                                GCIAS[%]
                              </TableCell>
                              <TableCell
                                align="right"
                                sx={{
                                  whiteSpace: "nowrap",
                                  backgroundColor: "#B8B8B8",
                                }}
                                className={classes.tableCell}
                              >
                                GCIAS[USD]
                              </TableCell>
                            </>
                          ) : (
                            ""
                          )}
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                          >
                            IMP TOT[USD]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                          >
                            Gasto Terminal[USD]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                          >
                            Flete Interno[USD]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                          >
                            Gasto Loc FWD[USD]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                          >
                            Gasto DESPA[USD]
                          </TableCell>
                          {pais == 7 ? (
                            <>
                              <TableCell
                                align="right"
                                sx={{
                                  whiteSpace: "nowrap",
                                  backgroundColor: "#B8B8B8",
                                }}
                              >
                                Gasto BANCO[USD]
                              </TableCell>
                              <TableCell
                                align="right"
                                sx={{
                                  whiteSpace: "nowrap",
                                  backgroundColor: "#B8B8B8",
                                }}
                              >
                                Gasto CUST[USD]
                              </TableCell>
                            </>
                          ) : (
                            ""
                          )}
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                          >
                            Total Gast Dest[USD]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                          >
                            Extrg LOC1[USD]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                          >
                            Extrg LOC2[USD]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                          >
                            Extrg CMX1[USD]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                          >
                            Extrg CMX2[USD]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                          >
                            Extrg CMX3[USD]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                          >
                            Extrg CMX NOTAS
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                          >
                            Extrg FIN1[USD]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                          >
                            Extrg FIN2[USD]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                          >
                            Extrg FIN3[USD]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                          >
                            Extrg FIN NOTAS
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                          >
                            Extrg gCMX1[USD]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                          >
                            Extrg gCMX2 [USD]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                          >
                            Extrg gCMX3 [USD]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                          >
                            Extrg gCMX4 [USD]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                          >
                            Extrg gCMX5 [USD]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                          >
                            Extrg gFIN1 [USD]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                          >
                            Extrg gFIN2 [USD]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                          >
                            Extrg gFIN3 [USD]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                          >
                            Extrg gFIN4 [USD]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                          >
                            Extrg gFIN5 [USD]
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                          >
                            Extrg TOT
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              whiteSpace: "nowrap",
                              backgroundColor: "#B8B8B8",
                            }}
                          >
                            COSTO u.[USD]
                          </TableCell>
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
                        <TableRow
                          key={index}
                          hover
                          role="checkbox"
                          sx={{
                            fontSize: 20,
                            "&:hover": {
                              fontStyle: "italic",
                            },
                          }}
                          className={classes.tableCell}
                        >
                          <Tooltip
                            title={`Costo U.[USD] ${row.costo_u.toFixed(3)}`}
                          >
                            <TableCell
                              align="right"
                              className={classes.tableCell}
                            >
                              {row.sku ? row.sku : 0}
                            </TableCell>
                          </Tooltip>
                          <TableCell
                            sx={{ pl: 3, maxWidth: 350 }}
                            className={classes.tableCell}
                          >
                            <Typography
                            align="left"
                            variant="subtitle1"
                            noWrap // evita que el texto se envuelva en nuevas líneas
                            sx={{ 
                              maxWidth: 500, // o cualquier otro valor que se ajuste a tus necesidades
                              overflow: 'hidden', // asegura que el contenido extra esté oculto
                              textOverflow: 'ellipsis', // agrega puntos suspensivos al final
                              whiteSpace: 'nowrap', // mantiene el texto en una sola línea
                            }}
                            >
                              {row.description ? row.description : ""}
                              {/* {row.description} */}
                              {/* {console.log(row)} */}
                            </Typography>
                          </TableCell>
                          <TableCell
                            align="right"
                            className={classes.tableCell}
                          >
                            {row.imageurl ? (
                              <>
                                <ImagenAvatar
                                  src={row.imageurl}
                                  alt={row.sku}
                                />
                              </>
                            ) : (
                              "Sin imagen"
                            )}
                          </TableCell>
                          {/* DATOS DE LA VISTA ABREVIADA */}
                          {verMas ? (
                            <>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {rowsAddData[index].ncm_str
                                  ? rowsAddData[index].ncm_str
                                  : 0}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.exw_u ? row.exw_u.toFixed(3) : "0.0"}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.fob_u ? row.fob_u.toFixed(3) : "0.0"}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.qty ? row.qty : "0"}u.
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.pcsctn ? row.pcsctn : "0"}u.
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.cbmctn ? row.cbmctn.toFixed(4) : "0"}m3
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.gwctn ? row.gwctn.toFixed(2) : "0"}kg
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.totalcbm ? row.totalcbm.toFixed(2) : "0"}m3
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.totalgw ? row.totalgw.toFixed(2) : "0"}kg
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.totalcif ? row.totalcif.toFixed(2) : "0"}
                              </TableCell>
                              {/*console.log(rows)*/}
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {sumImpuestosPais(row, pais).toFixed(2)}
                              </TableCell>
                              <TableCell className={classes.tableCell}>
                                {row.totalgastos_loc_y_extra
                                  ? row.totalgastos_loc_y_extra.toFixed(2)
                                  : 0}
                                {/* {sumGlocPais(row, pais).toFixed(2)} */}
                              </TableCell>

                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {sumExtrag(row).toFixed(2)}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.costo_u ? row.costo_u.toFixed(3) : ""}
                              </TableCell>
                            </>
                          ) : (
                            <>
                              {/* DATOS DE LA VISTA FULL */}
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {rowsAddData[index].ncm_str
                                  ? rowsAddData[index].ncm_str
                                  : 0}
                              </TableCell>

                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {rowsAddData[index].proveedor
                                  ? rowsAddData[index].proveedor
                                  : 0}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.exw_u ? row.exw_u.toFixed(2) : 0}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.fob_u ? row.fob_u.toFixed(2) : 0}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.pcsctn ? row.pcsctn : 0} u.
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.cbmctn ? row.cbmctn.toFixed(4) : 0.0} m3
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.gwctn ? row.gwctn.toFixed(2) : 0.0} kg
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.qty ? row.qty : 0}
                                {/* {row.pcsctn > 1
                                  ? Math.ceil(row.qty / row.pcsctn).toFixed(2)
                                  : 0.0}
                                u. */}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.totalcbm ? row.totalcbm.toFixed(2) : 0.0}{" "}
                                m3
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.totalgw ? row.totalgw.toFixed(2) : 0.0} kg
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.totalfob ? row.totalfob.toFixed(2) : 0.0}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.factorproducto
                                  ? row.factorproducto.toFixed(2)
                                  : 0.0}
                                %
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.freightCharge
                                  ? row.freightCharge.toFixed(2)
                                  : 0.0}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.insuranceCharge
                                  ? row.insuranceCharge.toFixed(2)
                                  : 0.0}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.totalcif ? row.totalcif.toFixed(2) : 0.0}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.totalfob > 0
                                  ? (row.totalcif / row.totalfob).toFixed(3)
                                  : 0.0}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.ncm_arancel
                                  ? row.ncm_arancel.toFixed(3)
                                  : 0.0}{" "}
                                %
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.arancelgrav_cif
                                  ? row.arancelgrav_cif.toFixed(2)
                                  : 0.0}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.ncm_te_dta_otro
                                  ? row.ncm_te_dta_otro.toFixed(3)
                                  : 0.0}{" "}
                                %
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.te_dta_otro_cif
                                  ? row.te_dta_otro_cif.toFixed(2)
                                  : 0.0}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.baseiva ? row.baseiva.toFixed(2) : 0.0}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.ncm_iva ? row.ncm_iva.toFixed(3) : 0.0} %
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.iva_cif ? row.iva_cif.toFixed(2) : 0.0}
                              </TableCell>
                              {pais == 7 ? (
                                <>
                                  <TableCell
                                    align="right"
                                    className={classes.tableCell}
                                  >
                                    {row.ncm_ivaad
                                      ? row.ncm_ivaad.toFixed(3)
                                      : 0.0}{" "}
                                    %
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    className={classes.tableCell}
                                  >
                                    {row.ivaad_cif
                                      ? row.ivaad_cif.toFixed(2)
                                      : 0.0}
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    className={classes.tableCell}
                                  >
                                    {presupuestador.estHeader.iibb_total
                                      ? presupuestador.estHeader.iibb_total.toFixed(
                                          3
                                        )
                                      : 0.0}{" "}
                                    %
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    className={classes.tableCell}
                                  >
                                    {row.iibb900 ? row.iibb900.toFixed(2) : 0.0}
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    className={classes.tableCell}
                                  >
                                    {row.gcias ? row.gcias.toFixed(3) : 0.0} %
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    className={classes.tableCell}
                                  >
                                    {row.gcias424
                                      ? row.gcias424.toFixed(2)
                                      : 0.0}
                                  </TableCell>
                                </>
                              ) : (
                                ""
                              )}
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                [USD] {sumImpuestosPais(row, pais).toFixed(2)}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.gloc_terminales
                                  ? row.gloc_terminales.toFixed(2)
                                  : 0}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.gloc_flete ? row.gloc_flete.toFixed(2) : 0}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.gloc_fwd ? row.gloc_fwd.toFixed(2) : 0}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.gloc_despachantes
                                  ? row.gloc_despachantes.toFixed(2)
                                  : 2}
                              </TableCell>

                              {pais == 7 ? (
                                <>
                                  <TableCell
                                    align="right"
                                    className={classes.tableCell}
                                  >
                                    {row.gloc_bancos
                                      ? row.gloc_bancos.toFixed(2)
                                      : 0}
                                  </TableCell>
                                  <TableCell
                                    align="right"
                                    className={classes.tableCell}
                                  >
                                    {row.gloc_polizas
                                      ? row.gloc_polizas.toFixed(2)
                                      : 0.0}
                                  </TableCell>
                                </>
                              ) : (
                                ""
                              )}
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {sumGlocPais(row, pais).toFixed(2)}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.extrag_local1
                                  ? row.extrag_local1.toFixed(2)
                                  : "0"}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.extrag_local2
                                  ? row.extrag_local2.toFixed(2)
                                  : "0"}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.extrag_comex1
                                  ? row.extrag_comex1.toFixed(2)
                                  : "0"}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.extrag_comex2
                                  ? row.extrag_comex2.toFixed(2)
                                  : "0"}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.extrag_comex3
                                  ? row.extrag_comex3.toFixed(2)
                                  : "0"}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.extrag_comex_notas
                                  ? row.extrag_comex_notas
                                  : ""}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.extrag_finan1
                                  ? row.extrag_finan1.toFixed(2)
                                  : "0"}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.extrag_finan2
                                  ? row.extrag_finan2.toFixed(2)
                                  : "0"}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.extrag_finan3
                                  ? row.extrag_finan3.toFixed(2)
                                  : "0"}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.extrag_finan_notas
                                  ? row.extrag_finan_notas
                                  : ""}
                              </TableCell>

                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.extrag_glob_comex1
                                  ? row.extrag_glob_comex1.toFixed(2)
                                  : "0"}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.extrag_glob_comex2
                                  ? row.extrag_glob_comex2.toFixed(2)
                                  : "0"}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.extrag_glob_comex3
                                  ? row.extrag_glob_comex3.toFixed(2)
                                  : "0"}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.extrag_glob_comex4
                                  ? row.extrag_glob_comex4.toFixed(2)
                                  : "0"}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.extrag_glob_comex5
                                  ? row.extrag_glob_comex5.toFixed(2)
                                  : "0"}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.extrag_glob_finan1
                                  ? row.extrag_glob_finan1.toFixed(2)
                                  : "0"}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.extrag_glob_finan2
                                  ? row.extrag_glob_finan2.toFixed(2)
                                  : "0"}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.extrag_glob_finan3
                                  ? row.extrag_glob_finan3.toFixed(2)
                                  : "0"}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.extrag_glob_finan4
                                  ? row.extrag_glob_finan4.toFixed(2)
                                  : "0"}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {row.extrag_glob_finan5
                                  ? row.extrag_glob_finan5.toFixed(2)
                                  : "0"}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                              >
                                {sumExtrag(row).toFixed(2)}
                              </TableCell>
                              <TableCell
                                align="right"
                                className={classes.tableCell}
                                sx={{ pl: 10, whiteSpace: "nowrap" }}
                              >
                                {row.costo_u ? row.costo_u.toFixed(3) : ""}
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
                                Fob Total[USD]:
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography align="right" variant="body2">
                                {presupuestador.estHeader.fob_grand_total ||
                                presupuestador.estHeader.fob_grand_total == 0
                                  ? UtilidadesHelper.formatNumber(
                                      presupuestador.estHeader.fob_grand_total.toFixed(
                                        2
                                      )
                                    )
                                  : "Sin data"}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography align="right" variant="subtitle1">
                                {/* Aranceles / Pagado (10%): */}
                                Aranceles Pagados[USD] :
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography align="right" variant="body2">
                                {presupuestador.estHeader.impuestos_total ||
                                presupuestador.estHeader.impuestos_total == 0
                                  ? UtilidadesHelper.formatNumber(
                                      presupuestador.estHeader.impuestos_total.toFixed(
                                        2
                                      )
                                    )
                                  : "Sin data"}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography align="right" variant="subtitle1">
                                {/* Discount (5%) : */}
                                Flete[USD] :
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography align="right" variant="body2">
                                {presupuestador.estHeader.gloc_flete ||
                                presupuestador.estHeader.gloc_flete == 0
                                  ? UtilidadesHelper.formatNumber(
                                      presupuestador.estHeader.gloc_flete.toFixed(
                                        2
                                      )
                                    )
                                  : "Sin dataa"}
                              </Typography>
                            </Grid>

                            <Grid item xs={6}>
                              <Typography
                                align="right"
                                // color="primary"
                                variant="subtitle1"
                              >
                                Total CIF[USD]:
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography
                                align="right"
                                // color="primary"
                                variant="body2"
                                // sx={{ pl: 10, minWidth: 180 }}
                              >
                                {presupuestador.estHeader.cif_grand_total ||
                                presupuestador.estHeader.cif_grand_total == 0
                                  ? UtilidadesHelper.formatNumber(
                                      presupuestador.estHeader.cif_grand_total.toFixed(
                                        2
                                      )
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
                                [USD]{" "}
                                {presupuestador.estHeader.seguro
                                  ? UtilidadesHelper.formatNumber(
                                      presupuestador.estHeader.seguro.toFixed(2)
                                    )
                                  : "Sin data"}
                              </Typography>
                            </Grid> */}
                          </Grid>
                        </Grid>

                        {/* <Grid item xs={12}>
                          <Divider sx={{ bgcolor: "dark.main" }} />
                        </Grid> */}

                        <Grid item xs={12}>
                          {/* <Grid
                            container
                            // spacing={1}
                          >
                            <Grid item xs={6}>
                              <Typography
                                align="right"
                                // color="primary"
                                variant="subtitle1"
                              >
                                Total CIF[USD]:
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography
                                align="right"
                                // color="primary"
                                variant="subtitle1"
                                // sx={{ pl: 10, minWidth: 180 }}
                              >
                                {presupuestador.estHeader.cif_grand_total ||
                                presupuestador.estHeader.cif_grand_total == 0
                                  ? UtilidadesHelper.formatNumber(
                                      presupuestador.estHeader.cif_grand_total.toFixed(
                                        2
                                      )
                                    )
                                  : "Sin data"}
                              </Typography>
                            </Grid>
                          </Grid> */}
                          {/* <Grid container spacing={1}> */}
                            {/* <Grid item xs={6}> */}
                              {/* <Typography
                                align="right"
                                color="primary"
                                variant="subtitle1"
                              >
                                CIF Total ARS:
                              </Typography> */}
                            {/* </Grid> */}
                            {/* <Grid item xs={6}>
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
                                        presupuestador.estHeader
                                          .cif_grand_total *
                                        presupuestador.estHeader.dolar
                                      ).toFixed(2)
                                    )
                                  : "Sin data"}
                              </Typography>
                            </Grid> */}
                          {/* </Grid> */}
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
