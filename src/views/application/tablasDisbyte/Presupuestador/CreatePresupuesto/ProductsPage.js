import PropTypes from 'prop-types';

// material-ui
import { Grid, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

// ==============================|| PRODUCTS-DATA PAGE ||============================== //
//
function ProductsPage({ productsData, deleteProductHandler, editProductHandler }) {
    
    console.log(productsData);
    return (
        <>
            {productsData.length ? (
                <Grid item xs={12}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ pl: 3 }}>Description</TableCell>
                                    <TableCell align="right">Piezas de Importacion</TableCell>
                                    <TableCell align="right">Amount FOB</TableCell>
                                    <TableCell align="right">Peso U.</TableCell>
                                    <TableCell align="right">Volumen U.</TableCell>
                                    <TableCell align="right">Piezas x Caja</TableCell>
                                    <TableCell align="right">NCM</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                    <TableCell align="right" sx={{ pr: 3 }} />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productsData.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell sx={{ pl: 3 }}>
                                            <Typography align="left" variant="subtitle1">
                                                {row.description}
                                            </Typography>
                                            {/*<Typography align="left" variant="body2"> X SI AGREGAMOS ALGUNA DESCRIPTCION
                                            {row.description}
                                            {row.description ? row.description : "sin descripción"} 
                                            {row.description || "sin descripción"} 
                                            </Typography> */}
                                        </TableCell>
                                        <TableCell align="right">{row.cantPcs}</TableCell>
                                        <TableCell align="right">${row.qty}</TableCell>
                                        <TableCell align="right">{row.gwctn}</TableCell>
                                        <TableCell align="right">{row.cbmctn}</TableCell> 
                                        <TableCell align="right">{row.pcsctn}</TableCell> 
                                        {/* <TableCell align="right">{row.ncm_id}</TableCell>  */}
                                        <TableCell align="right">{row.ncm_code}</TableCell> 
                                        <TableCell align="right">${row.total}</TableCell>
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
    productsData: PropTypes.array,
    deleteProductHandler: PropTypes.func
};

export default ProductsPage;
