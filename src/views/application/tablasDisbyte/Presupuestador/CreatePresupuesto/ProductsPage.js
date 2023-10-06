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
}) {
  console.log(productsData);

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
                      backgroundColor: "#B8B8B8",
                    }}
                  >
                    SKU
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    sx={{
                      pl: 3,
                      whiteSpace: "nowrap",
                      backgroundColor: "#B8B8B8",
                    }}
                  >
                    Description
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    align="center"
                    sx={{
                      whiteSpace: "nowrap",
                      backgroundColor: "#B8B8B8",
                    }}
                  >
                    Imagen Url
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    align="right"
                    sx={{
                      whiteSpace: "nowrap",
                      backgroundColor: "#B8B8B8",
                    }}
                  >
                    FOB Unit USD
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    align="right"
                    sx={{
                      whiteSpace: "nowrap",
                      backgroundColor: "#B8B8B8",
                    }}
                  >
                    EXW U. USD
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    align="right"
                    sx={{
                      whiteSpace: "nowrap",
                      backgroundColor: "#B8B8B8",
                    }}
                  >
                    Cant. PCS U.
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    align="right"
                    sx={{
                      whiteSpace: "nowrap",
                      backgroundColor: "#B8B8B8",
                    }}
                  >
                    Pcs x Caja
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    align="right"
                    sx={{
                      whiteSpace: "nowrap",
                      backgroundColor: "#B8B8B8",
                    }}
                  >
                    CBM x Caja
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    align="right"
                    sx={{
                      whiteSpace: "nowrap",
                      backgroundColor: "#B8B8B8",
                    }}
                  >
                    GW x Caja
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    align="right"
                    sx={{
                      whiteSpace: "nowrap",
                      backgroundColor: "#B8B8B8",
                    }}
                  >
                    NCM
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    align="right"
                    sx={{
                      whiteSpace: "nowrap",
                      backgroundColor: "#B8B8B8",
                    }}
                  >
                    Proveedor
                  </TableCell>
                  <TableCell
                    className={classes.tableCell}
                    align="right"
                    sx={{
                      whiteSpace: "nowrap",
                      backgroundColor: "#B8B8B8",
                    }}
                  >
                    FOB Tot USD
                  </TableCell>
                  <TableCell
                    // className={classes.tableCell}
                    align="right"
                    sx={{
                      pr: 3,
                      whiteSpace: "nowrap",
                      // backgroundColor: "#B8B8B8",
                    }}
                  />
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
                      sx={{ pl: 3 }}
                      align="right"
                    >
                      {row.description ? row.description : "Sin data"}
                    </TableCell>
                    <TableCell className={classes.tableCell} align="left">
                      {row.imageurl ? (
                        <>
                          <ImagenAvatar
                            src={row.imageurl}
                            alt={row.sku}
                          />
                        </>
                      ) : (
                        "Sin Imagen"
                      )}
                    </TableCell>
                    <TableCell className={classes.tableCell} align="right">
                      {row.fob_u ? `${row.fob_u}` : "Sin data"}
                    </TableCell>
                    <TableCell className={classes.tableCell} align="right">
                      {row.exw_u ? `${row.exw_u}` : "Sin data"}
                    </TableCell>
                    <TableCell className={classes.tableCell} align="right">
                      {row.qty ? `${row.qty}` : "Sin data"}
                    </TableCell>
                    <TableCell className={classes.tableCell} align="right">
                      {row.pcsctn ? row.pcsctn : "Sin data"}
                    </TableCell>
                    <TableCell className={classes.tableCell} align="right">
                      {row.cbmctn ? row.cbmctn : "Sin data"}
                    </TableCell>
                    <TableCell className={classes.tableCell} align="right">
                      {row.gwctn ? row.gwctn : "Sin data"}
                    </TableCell>
                    {/* <TableCell className={classes.tableCell}align="right">{row.ncm_id}</TableCell>  */}
                    <TableCell className={classes.tableCell} align="right">
                      {row.ncm_code ? row.ncm_code : "Sin data"}
                    </TableCell>
                    <TableCell className={classes.tableCell} align="right">
                      {row.proovedores_name ? row.proovedores_name : "Sin data"}
                    </TableCell>
                    <TableCell className={classes.tableCell} align="right">{`${(
                      row.fob_u * row.qty
                    ).toFixed(2)}`}</TableCell>
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
