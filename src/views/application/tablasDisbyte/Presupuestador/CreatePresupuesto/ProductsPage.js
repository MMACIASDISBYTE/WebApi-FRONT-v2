import PropTypes from "prop-types";

// material-ui
import {
  Avatar,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { makeStyles } from "@material-ui/core";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import { useState } from "react";
import { Box } from "@mui/system";
import { ImagenAvatar } from "./ImagenAvatar";

// ==============================|| PRODUCTS-DATA PAGE ||============================== //
//
function ProductsPage({
  productsData,
  deleteProductHandler,
  editProductHandler,
  freightCost,
  insurancePorct,
}) {
  // console.log(productsData);

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
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const fobGrandTotal = productsData.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.exw_u * currentValue.qty;
  }, 0);

  return (
    <>
      {productsData.length ? (
        <Grid item xs={12}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    className={classes.tableCell}
                    sx={{
                      pl: 3,
                      whiteSpace: "nowrap",
                      backgroundColor: "#2196f3",
                    }}
                  >
                    SKU
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    sx={{
                      pl: 3,
                      whiteSpace: "nowrap",
                      backgroundColor: "#2196f3",
                    }}
                  >
                    Description
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    align="center"
                    sx={{
                      whiteSpace: "nowrap",
                      backgroundColor: "#2196f3",
                    }}
                  >
                    Imagen Url
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    align="center"
                    sx={{
                      whiteSpace: "nowrap",
                      backgroundColor: "#2196f3",
                    }}
                  >
                    NCM
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    align="center"
                    sx={{
                      whiteSpace: "nowrap",
                      backgroundColor: "#2196f3",
                    }}
                  >
                    EXW U. USD
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    align="center"
                    sx={{
                      whiteSpace: "nowrap",
                      backgroundColor: "#2196f3",
                    }}
                  >
                    FOB Unit USD
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    align="center"
                    sx={{
                      whiteSpace: "nowrap",
                      backgroundColor: "#2196f3",
                    }}
                  >
                    QTY {"[pcs]"}
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    align="center"
                    sx={{
                      whiteSpace: "nowrap",
                      backgroundColor: "#2196f3",
                    }}
                  >
                    PCS/CTN
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    align="center"
                    sx={{
                      whiteSpace: "nowrap",
                      backgroundColor: "#2196f3",
                    }}
                  >
                    CBM/CTN {"[m3]"}
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    align="center"
                    sx={{
                      whiteSpace: "nowrap",
                      backgroundColor: "#2196f3",
                    }}
                  >
                    GW CTN {"[kg]"}
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    align="center"
                    sx={{
                      whiteSpace: "nowrap",
                      backgroundColor: "#2196f3",
                    }}
                  >
                    FOB TOT. {"[USD]"}
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    align="center"
                    sx={{
                      whiteSpace: "nowrap",
                      backgroundColor: "#2196f3",
                    }}
                  >
                    FP. {"[%]"}
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    align="center"
                    sx={{
                      whiteSpace: "nowrap",
                      backgroundColor: "#2196f3",
                    }}
                  >
                    Freight Chrg. {"[USD]"}
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    align="center"
                    sx={{
                      whiteSpace: "nowrap",
                      backgroundColor: "#2196f3",
                    }}
                  >
                    Ins. Chrg. {"[USD]"}
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    align="center"
                    sx={{
                      whiteSpace: "nowrap",
                      backgroundColor: "#2196f3",
                    }}
                  >
                    CIF Tot. {"[USD]"}
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    align="center"
                    sx={{
                      whiteSpace: "nowrap",
                      backgroundColor: "#2196f3",
                    }}
                  />
                  {/* FP  {"[%]"}
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    align="center"
                    sx={{
                      whiteSpace: "nowrap",
                      backgroundColor: "#2196f3",
                    }}
                  >  
                   Freight Charge {"[USD]"}
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    align="center"
                    sx={{
                      whiteSpace: "nowrap",
                      backgroundColor: "#2196f3",
                    }}
                  >  
                  Freight Insur. {"[USD]"}
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    align="center"
                    sx={{
                      whiteSpace: "nowrap",
                      backgroundColor: "#2196f3",
                    }}
                  />  */}

                  {/*     
                    Proveedor
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    align="center"
                    sx={{
                      whiteSpace: "nowrap",
                      backgroundColor: "#2196f3",
                    }}
                  >*/}
                  {/*
                    FOB Tot  {"[USD]"}
                  </TableCell>
                  <TableCell
                    // className={classes.tableCell}
                    align="center"
                    sx={{
                      pr: 3,
                      whiteSpace: "nowrap",
                      // backgroundColor: "#2196f3",
                    */}
                </TableRow>
              </TableHead>
              <TableBody>
                {productsData.map((row, index) => (
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
                  >
                    <TableCell className={classes.tableCell} sx={{ pl: 3 }}>
                      <Typography align="left" variant="subtitle1">
                        {row.sku}
                      </Typography>
                      {/*<Typography align="left" variant="body2"> X SI AGREGAMOS ALGUNA DESCRIPTCION
                                            {row.description}
                                            {row.description ? row.description : "sin descripción"} 
                                            {row.description || "sin descripción"} 
                                            </Typography> */}
                    </TableCell>
                    <TableCell
                      className={classes.tableCell}
                      sx={{
                        pl: 3,
                        maxWidth: 400, // o cualquier otro valor que se ajuste a tus necesidades
                        overflow: "hidden", // asegura que el contenido extra esté oculto
                        textOverflow: "ellipsis", // agrega puntos suspensivos al final
                        whiteSpace: "nowrap", // mantiene el texto en una sola línea
                      }}
                      align="center"
                    >
                      {row.description ? row.description : "Sin data"}
                    </TableCell>
                    <TableCell className={classes.tableCell} align="left">
                      {row.imageurl ? (
                        <>
                          <ImagenAvatar src={row.imageurl} alt={row.sku} />
                        </>
                      ) : (
                        "Sin Imagen"
                      )}
                    </TableCell>
                    <TableCell className={classes.tableCell} align="center">
                      {row.ncm_code ? row.ncm_code : "Sin data"}
                    </TableCell>

                    <TableCell className={classes.tableCell} align="center">
                      {row.exw_u ? `${row.exw_u.toFixed(2)}` : "Sin data"}
                    </TableCell>
                    <TableCell className={classes.tableCell} align="center">
                      {row.fob_u ? `${row.fob_u.toFixed(2)}` : "Sin data"}
                    </TableCell>
                    <TableCell className={classes.tableCell} align="center">
                      {row.qty ? `${row.qty}u.` : "Sin data"}
                    </TableCell>
                    <TableCell className={classes.tableCell} align="center">
                      {row.pcsctn ? `${row.pcsctn}u.` : "Sin data"}
                    </TableCell>
                    <TableCell className={classes.tableCell} align="center">
                      {row.cbmctn ? `${row.cbmctn.toFixed(2)}m3` : "Sin data"}
                    </TableCell>
                    <TableCell className={classes.tableCell} align="center">
                      {row.gwctn ? `${row.gwctn.toFixed(2)}Kg` : "Sin data"}
                    </TableCell>
                    {/*<TableCell className={classes.tableCell} align="center">
                      {row.proovedores_name ? row.proovedores_name : "Sin data"}
                      </TableCell>*/}

                    {/*CALCULO DEL FOB TOTAL*/}
                    <TableCell
                      className={classes.tableCell}
                      align="center"
                    >{`${(row.exw_u * row.qty).toFixed(2)}`}</TableCell>

                    {/*CALCULO DEL FP*/}
                    <TableCell className={classes.tableCell} align="center">
                      {fobGrandTotal > 0
                        ? ((row.exw_u * row.qty) / fobGrandTotal).toFixed(2)
                        : "Sin data"}
                    </TableCell>
                    <TableCell className={classes.tableCell} align="center">
                      {freightCost
                        ? (
                            freightCost *
                            ((row.exw_u * row.qty) / fobGrandTotal)
                          ).toFixed(2)
                        : "Sin data"}
                    </TableCell>
                    <TableCell className={classes.tableCell} align="center">
                      {insurancePorct
                        ? (
                            (insurancePorct / 100) *
                            (row.exw_u * row.qty)
                          ).toFixed(2)
                        : "Sin data"}
                    </TableCell>
                    <TableCell className={classes.tableCell} align="center">
                      {(
                        row.exw_u * row.qty +
                        freightCost * ((row.exw_u * row.qty) / fobGrandTotal) +
                        (insurancePorct / 100) * row.exw_u * row.qty
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell
                      // className={classes.tableCell}
                      sx={{ pr: 1 }}
                      align="right"
                    >
                      {/* MOMENTANEAMENTE OCULTO boton de edicion */}
                      {/* <IconButton
                                                color="secondary"
                                                size="small"
                                                onClick={() => editProductHandler(row)}
                                                aria-label="Product Delete"
                                            >
                                                <EditTwoToneIcon fontSize="small" />
                                            </IconButton> */}

                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => deleteProductHandler(row.id)}
                        aria-label="Product Delete"
                      >
                        <DeleteTwoToneIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      ) : null}
    </>
  );
}

ProductsPage.propTypes = {
  productsData: PropTypes.array,
  deleteProductHandler: PropTypes.func,
};

export default ProductsPage;
