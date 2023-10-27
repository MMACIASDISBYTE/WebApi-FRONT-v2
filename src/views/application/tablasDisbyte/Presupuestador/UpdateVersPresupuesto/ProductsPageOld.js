import PropTypes, { number } from "prop-types";

// material-ui
import {
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
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";

// ==============================|| PRODUCTS-DATA PAGE ||============================== //
//
function ProductsPage({
  productsData,
  productsDataAdd,
  deleteProductHandler,
  editProductHandler,
}) {
  //console.log(productsData);
  // console.log(productsDataAdd);
  return (
    <>
      {productsData.length ? (
        <Grid item xs={12}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ pl: 3, minWidth: 220 }}>
                    Description
                  </TableCell>
                  <TableCell align="right" sx={{ pl: 3, minWidth: 90 }}>
                    NCM
                  </TableCell>
                  <TableCell align="right" sx={{ pl: 3, minWidth: 90 }}>
                    EXW U
                  </TableCell>
                  <TableCell align="right" sx={{ pl: 3, minWidth: 90 }}>
                    FOB U
                  </TableCell>
                  <TableCell align="right" sx={{ pl: 3, minWidth: 90 }}>
                    Cant PCS
                  </TableCell>
                  <TableCell align="right" sx={{ pl: 3, minWidth: 80 }}>
                    PCS x Caja
                  </TableCell>
                  <TableCell align="right" sx={{ pl: 3, minWidth: 90 }}>
                    CBM x Caja
                  </TableCell>
                  <TableCell align="right" sx={{ pl: 3, minWidth: 90 }}>
                    Peso x Caja
                  </TableCell>
                  <TableCell align="right" sx={{ pl: 3, minWidth: 90 }}>
                    CBM TOT
                  </TableCell>
                  <TableCell align="right" sx={{ pl: 3, minWidth: 90 }}>
                    PESO TOT
                  </TableCell>
                  <TableCell align="right" sx={{ pl: 3, minWidth: 90 }}>
                    CIF TOT
                  </TableCell>
                  <TableCell align="right" sx={{ pl: 3, minWidth: 90 }}>
                    COSTOu USD
                  </TableCell>
                  <TableCell align="right" sx={{ pr: 3 }} />
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
                    <TableCell sx={{ pl: 3 }}>
                      <Typography align="left" variant="subtitle1">
                        {row.sku}
                      </Typography>
                      {/*<Typography align="left" variant="body2"> X SI AGREGAMOS ALGUNA DESCRIPTCION
                                            {row.description}
                                            {row.description ? row.description : "sin descripción"} 
                                            {row.description || "sin descripción"} 
                                            </Typography> */}
                    </TableCell>
                    <TableCell align="right">
                      {productsDataAdd[index]?.ncm_str
                        ? productsDataAdd[index].ncm_str
                        : row.ncm_code}
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

                    <TableCell align="right">
                      USD {row.costo_u ? row.costo_u.toFixed(3) : ""}
                    </TableCell>
                    <TableCell sx={{ pr: 1 }} align="right">
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
  productsDataAdd: PropTypes.array,
  productsData: PropTypes.array,
  deleteProductHandler: PropTypes.func,
};

export default ProductsPage;
