import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
//para formatear la hora
import { format } from "date-fns";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import IconExcel from "../../../../../assets/images/iconoExcel.png";

// third-party
import ReactToPrint from "react-to-print";
//
// project imports
import AnimateButton from "ui-component/extended/AnimateButton";
import SubCard from "ui-component/cards/SubCard";
import { gridSpacing } from "store/constant";

import LogoDisbyteAzul from "../../../../../assets/images/disbyte/LogoDisbyte.png";
import { UtilidadesHelper } from "helpers/UtilidadesHelper";
import { useCommonStyles } from "helpers/CommonStyles";
import Chip from "ui-component/extended/Chip";
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

const DatosPackaging = [
  // ATRIBUTOS DE TABLA PACKAGING
  {
    alineado: "left",
    nombre: "SKU",
    atributo: "sku",
    tipoDato: "string",
  },
  {
    alineado: "left",
    nombre: "Description",
    atributo: "description",
    tipoDato: "string",
  },
  {
    alineado: "left",
    nombre: "NCM",
    atributo: "ncm_str",
    tipoDato: "string",
  },
  {
    alineado: "center",
    nombre: "Qty[PCS]",
    atributo: "qty",
    tipoDato: "unitario",
  },
  {
    alineado: "center",
    nombre: "PCS/CTN",
    atributo: "pcsctn",
    tipoDato: "unitario",
  },
  {
    alineado: "center",
    nombre: "CBM/CTN[m3]",
    atributo: "cbmctn",
    tipoDato: "metrage",
  },
  {
    alineado: "center",
    nombre: "GW CTN[kg]",
    atributo: "gwctn",
    tipoDato: "peso",
  },
  {
    alineado: "center",
    nombre: "Total CBM[m3]",
    atributo: "totalcbm",
    tipoDato: "metraje",
  },
  {
    alineado: "center",
    nombre: "Total GW[kg]",
    atributo: "totalgw",
    tipoDato: "peso",
  },
  {
    alineado: "center",
    nombre: "FP[%]",
    atributo: "factorproducto",
    tipoDato: "porcentual",
  },
  
];

// ATRIBUTOS DE TABLA ARANCELARIOS
const DatosImpositivos = [
  {
    alineado: "center",
    nombre: "EXW u.[USD]",
    atributo: "exw_u",
    tipoDato: "number",
  },
  {
    alineado: "center",
    nombre: "FOB u.[USD]",
    atributo: "fob_u",
    tipoDato: "number",
  },
  {
    alineado: "center",
    nombre: "Tot.FOB[USD]",
    atributo: "totalfob",
    tipoDato: "number",
  },
  {
    alineado: "center",
    nombre: "Freight[USD]	",
    atributo: "freightCharge",
    tipoDato: "number",
  },
  {
    alineado: "center",
    nombre: "Ins[USD]",
    atributo: "insuranceCharge",
    tipoDato: "number",
  },
  {
    alineado: "center",
    nombre: "CIF TOT[USD]",
    atributo: "totalcif",
    tipoDato: "number",
  },
  {
    alineado: "center",
    nombre: "ARANC.[USD]",
    atributo: "arancelgrav_cif",
    tipoDato: "number",
  },
  {
    alineado: "center",
    nombre: "DTA[USD]",
    atributo: "te_dta_otro_cif",
    tipoDato: "number",
  },
  {
    alineado: "center",
    nombre: "BASE IVA[USD]",
    atributo: "baseiva",
    tipoDato: "number",
  },
  {
    alineado: "center",
    nombre: "IVA[USD]",
    atributo: "iva_cif",
    tipoDato: "number",
  },
  // VER CON PETER
  // {
  //   alineado: "center",
  //   nombre: "IMP TOT[USD]",
  //   atributo: "ivaad_cif",
  //   tipoDato: "number",
  // },
  // {
  //   alineado: "center",
  //   nombre: "Tot.GLOC[USD]",
  //   atributo: "iibb900",
  //   tipoDato: "number",
  // },
  // {
  //   alineado: "center",
  //   nombre: "Extrg. TOT.",
  //   atributo: "gcias424",
  //   tipoDato: "number",
  // },
  {
    alineado: "center",
    nombre: "COSTO u.[USD]",
    atributo: "costo_u",
    tipoDato: "number",
  },
]

const Informe = ({ presupuestador, usuario, historico, estados }) => {
  const theme = useTheme();
  const componentRef = useRef(null);
  // console.log(presupuestador.estDetails);

  const [row, setRow] = useState([]);
  const [rowsAddData, setRowAddData] = useState([]); //almacena la data adicional de ncm

  useEffect(() => {
    if (presupuestador && presupuestador.estDetails) {
      setRow(presupuestador.estDetails);
      setRowAddData(presupuestador.estDetAddData);
    }
  }, [presupuestador]);

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
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid container spacing={gridSpacing}>
                <Grid item sm={12}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <div
                          style={{
                            display: "flex",
                            // justifyContent: "flex-start",
                            position: "relative", // Posición relativa  PARA COLOCAR EL BOTON A LA ALTURA DEL MAINCARD
                            top: "-55px", // Posición desde la parte superior del contenedor
                            // right: "50px", // Posición desde la derecha del contenedor
                            // margin: "-25px",
                          }}
                        >
                            <Chip
                              label={estados.filter((miEstado)=>miEstado.id===presupuestador?.estHeader?.status)[0]?.description}                      
                              variant="outlined"
                              size="small"
                              chipcolor="warning"
                            />
                        </div>
                      <Grid container spacing={0} sx={{marginTop: -4}}>
                        <Grid item sx={12}>
                          <Typography
                            variant="h4"
                            color={
                              theme.palette.mode === "dark" ? "white" : "black"
                            }
                            display={"inline"}
                          >
                            {"Detalles - "}
                          </Typography>
                          <Typography
                            variant="h5"
                            color={
                              theme.palette.mode === "dark"
                                ? "LightSkyBlue"
                                : "grey"
                            }
                            display={"inline"}
                          >
                            {`[ Origen: ${UtilidadesHelper.paisRegionSwitch(
                              presupuestador.estHeader.fwdpaisregion_id
                            )} / Destino: ${UtilidadesHelper.paisRegionSwitch(
                              presupuestador.estHeader.paisregion_id
                            )} ]`}
                          </Typography>
                        </Grid>

                        <Grid item xs={12}>
                          <Typography
                            variant="h4"
                            color={
                              theme.palette.mode === "dark" ? "white" : "black"
                            }
                            display={"inline"}
                          >
                            {"Packing - "}
                          </Typography>
                          <Typography
                            variant="h5"
                            color={
                              theme.palette.mode === "dark"
                                ? "LightSkyBLue"
                                : "grey"
                            }
                            display={"inline"}
                          >
                            {`[ Resumen: ${presupuestador?.estHeader?.cantidad_contenedores.toFixed(
                              2
                            )} Cont. ${
                              presupuestador.carga_str
                            } / ${presupuestador?.estHeader?.gw_grand_total.toFixed(
                              2
                            )} kg / ${presupuestador?.estHeader?.cbm_grand_total.toFixed(
                              2
                            )} m3 ]`}
                          </Typography>
                        </Grid>

                        <Grid item sx={12}>
                          <Typography
                            variant="h4"
                            color={
                              theme.palette.mode === "dark" ? "white" : "black"
                            }
                            display={"inline"}
                          >
                            {"Arancelario/Gastos - "}
                          </Typography>
                          <Typography
                            variant="h5"
                            color={
                              theme.palette.mode === "dark"
                                ? "LightSkyBlue"
                                : "grey"
                            }
                            display={"inline"}
                          >
                            {`[ Resumen (USD) > CIF: ${presupuestador?.estHeader?.cif_grand_total.toFixed(
                              2
                            )} / Impuestos: ${presupuestador?.estHeader?.impuestos_total.toFixed(
                              2
                            )} / Gastos Loc.: ${presupuestador?.estHeader?.gastos_loc_total.toFixed(
                              2
                            )} / Gastos Extr.: ${presupuestador?.estHeader?.extragastos_total.toFixed(
                              2
                            )}]`}
                          </Typography>
                        </Grid>

                        {/* TABLA A ROTAR */}
                        <Grid item xs={12}>
                          <TableContainer>
                            <Table className={classes.table}>

                            <TableRow>
                              <TableCell
                                component="th"
                                scope="row"
                                className={classes.tableCellCabecera3}
                                colSpan={row.length + 1} // Aquí asegúrate de tener el número correcto de columnas
                                align="center"
                              >
                                DATOS PACKAGING
                              </TableCell>
                            </TableRow>

                              <TableBody>
                                {DatosPackaging.map((data, index) => (
                                  <TableRow key={data.nombre} className={classes.tableRow}>
                                    {/* Encabezado de la fila */}

                                    {/* DATOS PACKAGING */}
                                    <TableCell
                                      component="th"
                                      scope="row"
                                      className={classes.tableCellCabecera}
                                    >
                                      {data.nombre}
                                    </TableCell>

                                    {/* Datos de la fila */}
                                    {row.map((rowItem, index) => (
                                      <TableCell
                                        key={`${data.atributo}-${rowItem.id}`}
                                        align={data.alineado}
                                        className={classes.tableCell}
                                      >
                                        {data.tipoDato === "string" ?
                                            rowItem[data.atributo] || (data.atributo === "ncm_str" && rowsAddData[index].ncm_str)
                                          : data.tipoDato === "unitario" ?
                                            `${rowItem[data.atributo].toFixed(2)}u.` 
                                          : data.tipoDato === 'peso' ?
                                            `${rowItem[data.atributo].toFixed(2)}kg`
                                          : data.tipoDato === 'metraje' ?
                                            `${rowItem[data.atributo].toFixed(2)}m3`
                                          : data.tipoDato === 'porcentual' ?
                                            `${rowItem[data.atributo].toFixed(2) * 100}%` 
                                          : data.tipoDato === 'number' ?
                                            `${rowItem[data.atributo].toFixed(2)}`
                                          : rowItem[data.atributo]}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                              </TableBody>

                              {/* TABLA IMPOSITIVA */}
                              <TableRow>
                                <TableCell
                                  component="th"
                                  scope="row"
                                  className={classes.tableCellCabecera3}
                                  colSpan={row.length + 1} // Aquí asegúrate de tener el número correcto de columnas
                                  align="center"
                                >
                                  DATOS ARANCELARIOS
                                </TableCell>
                              </TableRow>

                              <TableBody>
                                {DatosImpositivos.map((data, index) => (
                                  <TableRow key={data.nombre} className={classes.tableRow}>
                                    {/* Encabezado de la fila */}
                                    <TableCell
                                      component="th"
                                      scope="row"
                                      className={classes.tableCellCabecera2}
                                    >
                                      {data.nombre}
                                    </TableCell>

                                    {/* Datos de la fila */}
                                    {row.map((rowItem, index) => (
                                      <TableCell
                                        key={`${data.atributo}-${rowItem.id}`}
                                        align={data.alineado}
                                        className={classes.tableCell}
                                      >
                                        {data.tipoDato === "string" ?
                                            rowItem[data.atributo] || (data.atributo === "ncm_str" && rowsAddData[index].ncm_str)
                                          : data.tipoDato === "unitario" ?
                                            `${rowItem[data.atributo].toFixed(2)}u.` 
                                          : data.tipoDato === 'peso' ?
                                            `${rowItem[data.atributo].toFixed(2)}kg`
                                          : data.tipoDato === 'metraje' ?
                                            `${rowItem[data.atributo].toFixed(2)}m3`
                                          : data.tipoDato === 'porcentual' ?
                                            `${rowItem[data.atributo].toFixed(2) * 100}%`
                                          : data.tipoDato === 'number' ?
                                            `${rowItem[data.atributo].toFixed(2)}`
                                          : rowItem[data.atributo]}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                              </TableBody>

                            </Table>
                          </TableContainer>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
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
                trigger={() => (
                  <Tooltip title="Imprimir Informe">
                    <Button variant="contained">
                      <PrintIcon />
                    </Button>
                  </Tooltip>
                )}
                content={() => componentRef.current}
              />
            </AnimateButton>
          </Grid>

          <Grid item>
            <Tooltip title="Exportar a excel">
              <Button
                variant="contained"
                color="success"
                onClick={() =>
                  // exportToExcel.exportCabecera(
                  //   presupuestador,
                  //   usuario,
                  //   historico,
                  //   estados
                  // )
                  exportToExcel.ExportInforme(presupuestador)
                }
              >
                <img
                  src={IconExcel}
                  alt="Exportar a Excel"
                  style={{ maxWidth: "220%", height: "25px" }}
                />
              </Button>
            </Tooltip>
          </Grid>

        </Grid>
      </Grid>
    </Grid>
  );
};

export default Informe;
