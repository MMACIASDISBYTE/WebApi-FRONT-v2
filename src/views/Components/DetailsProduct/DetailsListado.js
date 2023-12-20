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
  Tooltip,
} from "@mui/material";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import { useState } from "react";
import { ImagenAvatar } from "../ImagenAvatar";
import { useCommonStyles } from "helpers/CommonStyles";

// ==============================|| PRODUCTS-DATA PAGE ||============================== //
//
function ProductsPage({
  productsData,
  deleteProductHandler,
  editProductHandler,
  freightCost,
  insurancePorct,
}) {
  const classes = useCommonStyles();

  const fobGrandTotal = productsData.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.exw_u * currentValue.qty;
  }, 0);

  const tablaCabecera = [
    {
      name: 'SKU',
      atributo: 'sku',
      type : 'string',
    },
    {
      name: 'Commodity',
      atributo: 'description',
      type : 'string',
    },
    {
      name: 'Imagen Url',
      atributo: 'imageurl',
      type : 'string',
    },
    {
      name: 'NCM',
      atributo: 'ncm_code',
      type : 'string',
    },
    {
      name: 'EXW U. USD',
      atributo: 'exw_u',
      type : 'number',
    },
    {
      name: 'FOB Unit USD',
      atributo: 'fob_u',
      type : 'number',
    },
    {
      name: 'QTY [pcs]',
      atributo: 'qty',
      type : 'unidad',
    },
    {
      name: 'PCS/CTN',
      atributo: 'pcsctn',
      type : 'unidad',
    },
    {
      name: 'CBM/CTN [m3]',
      atributo: 'cbmctn',
      type : 'metros',
    },
    {
      name: 'GW CTN [kg]',
      atributo: 'gwctn',
      type : 'kilos',
    },
    {
      name: 'FOB TOT. [USD]',
      atributo: 'calculo_exw_u*qty',
      type : 'calculo_exw_u*qty',
    },
    {
      name: 'FP. [%]',
      atributo: 'calculo_exw_u*qty/fobGrandTotal',
      type : 'calculo_exw_u*qty/fobGrandTotal',
    },
    {
      name: 'Freight Chrg. [USD]',
      atributo: 'calculo_freightCost*exw_u*qty/fobGrandTotal',
      type : 'calculo_freightCost*exw_u*qty/fobGrandTotal',
    },
    {
      name: 'Ins. Chrg. [USD]',
      atributo: 'calculo_insurancePorct/100*exw_u*qty',
      type : 'calculo_insurancePorct/100*exw_u*qty',
    },
    {
      name: 'CIF Tot. [USD]',
      atributo: 'calculo_exw_u*qty+freightCost*exw_u*qty/fobGrandTotal+insurancePorct*exw_u*qty',
      type : 'calculo_exw_u*qty+freightCost*exw_u*qty/fobGrandTotal+insurancePorct*exw_u*qty',
    },
  ];

  return (
    <>
      {productsData.length ? (
        <Grid item xs={12}>
          <TableContainer>
            <Table>
              <TableHead>

                <TableRow>
                { //mapeo item de cabecera
                  tablaCabecera.map((item, index) => (
                    <TableCell key={index} className={classes.tableCellCabecera4} align="center">
                      {item.name}
                    </TableCell>
                  ))
                }
                  
                  {/* elementos de la cabecera de la tabla estaticos */}
                  <TableCell
                    className={classes.tableCellCabecera4}
                    align="center"
                  >
                    Accion
                  </TableCell>

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
                    <Tooltip title={row.sku ? row.sku : ""}>
                      <TableCell
                        className={classes.tableCellMedium}
                        sx={{ pl: 3 }}
                      >
                        <Typography
                          align="left"
                          variant="subtitle1"
                          style={{
                            overflow: "hidden", // asegura que el contenido extra esté oculto
                            textOverflow: "ellipsis", // agrega puntos suspensivos al final
                          }}
                        >
                          {row.sku}
                        </Typography>
                      </TableCell>
                    </Tooltip>
                    <TableCell
                      className={classes.tableCellMedium}
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
                      {row.cbmctn && row.cbmctn != '0' ? `${row.cbmctn.toFixed(2)}m3` : row.cbmctn == 0 ? '0.00m3' : "Sin data"}
                    </TableCell>
                    <TableCell className={classes.tableCell} align="center">
                      {row.gwctn && row.gwctn != '0' ? `${row.gwctn.toFixed(2)}Kg` : row.gwctn == 0 ? '0.00Kg' : "Sin data"}
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
                      sx={{ pr: 1, minWidth: "90px" }}
                      align="right"
                    >
                      {/* MOMENTANEAMENTE OCULTO boton de edicion */}
                      <IconButton
                        color="secondary"
                        size="small"
                        onClick={() => editProductHandler(row)}
                        aria-label="Product Delete"
                      >
                        <EditTwoToneIcon fontSize="small" />
                      </IconButton>

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
