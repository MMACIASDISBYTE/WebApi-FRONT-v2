import { TableCell } from '@material-ui/core'
import Chip from 'ui-component/extended/Chip';
import React, { useEffect, useState } from 'react'
import { Grid } from '@mui/material';
import { CargaHelper } from 'helpers/CargaHelper';
import { UtilidadesHelper } from 'helpers/UtilidadesHelper';
import { useTheme } from '@emotion/react';

export const PesajeContenedorUpdate = ({ productsData = null, tipoContenedor = null }) => {
    // console.log(productsData, tipoContenedor);
    const theme = useTheme();
    const [peso, setPeso] = useState(0);
    const [volume, setVolumen] = useState(0);
    const [contenedor, setContenedor] = useState();
    const [contenedores, setContenedores] = useState(0);

    useEffect(() => {
        if (tipoContenedor) {
            const ContenedorConcatenado = tipoContenedor.id;
            // const ContenedorConcatenado = tipoContenedor.description.replace(/\s+/g, ''); //quiero los espacios del tipoContenedor para hacer consulta a la api
            const contenedorDetalle = async (ContenedorConcatenado) => {
                const ContenedorData = await CargaHelper.DetalleContenedor(ContenedorConcatenado);
                //console.log(ContenedorData);
                setContenedor(ContenedorData);
            };
            contenedorDetalle(ContenedorConcatenado);
            // console.log('detalle del contenedor', contenedor);
            // console.log(contenedor.weight);
            // console.log(ContenedorConcatenado);
            
        }
        
    }, [tipoContenedor, productsData]);


    useEffect(() => {
        
        if (contenedor) {
            // 1. Suma de todos los pesoUnitxCaja
            const pesoTotal = productsData.reduce((acc, product) => {
                const pesoPorCaja = parseFloat(product.gwctn || 0 );
                const piezasPorCaja = parseFloat(product.pcsctn || 1);
                const pesoPorPieza=pesoPorCaja/piezasPorCaja; 
                const cantidadDePiezas = parseFloat(product.qty || 1);
                return acc + (cantidadDePiezas*pesoPorPieza);
            }, 0);

            // 2. Suma de todos los cbmxCaja
            const CMB_grandTotal = productsData.reduce((acc, product) => {
                const cantidadPiezas = parseFloat(product.qty || 0);
                const piezasPorCaja = parseFloat(product.pcsctn || 1);
                const cantidadDeCajas = Math.ceil(cantidadPiezas/piezasPorCaja);
                const volumenPorCaja  = parseFloat(product.cbmctn || 0);
                return acc + (volumenPorCaja * cantidadDeCajas);
            }, 0);

            setPeso(pesoTotal);
            setVolumen(CMB_grandTotal);

            if ((parseFloat(pesoTotal / (contenedor.weight))) > parseFloat(CMB_grandTotal / contenedor.volume)) {
                setContenedores(parseFloat(pesoTotal / contenedor.weight))
            } else {
                // console.log(CMB_grandTotal / contenedor.volume);
                setContenedores(parseFloat(CMB_grandTotal / contenedor.volume));
            };
            // console.log(pesoTotal);    
            // console.log('Peso: ', pesoTotal, ' Volumen: ', CMB_grandTotal);
        }
    // console.log(contenedor);
    }, [tipoContenedor, productsData]);  

    return (
        <>
            <Grid
                item
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-end',
                    flexWrap: 'wrap'  // para que se envuelva en caso de que no haya espacio suficiente
                }}
                xs={12}>
                {contenedor ? (
                    <>
                        {
                            theme.palette.mode === 'light' ?
                                <>
                                    <Chip label={`Contenedor ${contenedor.description}`} size="medium" chipcolor="orange" />
                                    <Chip label={`Peso Soportado: ${UtilidadesHelper.formatNumber(contenedor.weight.toFixed(2))}Kg`} size="medium" chipcolor="orange" />
                                    <Chip label={`Volumen Soportado ${UtilidadesHelper.formatNumber(contenedor.volume.toFixed(2))}m3`} size="medium" chipcolor="orange" />
                                </> :
                                <>
                                    <Chip label={`Contenedor ${contenedor.description}`} variant="outlined" size="medium" chipcolor="warning" />
                                    <Chip label={`Peso Soportado: ${UtilidadesHelper.formatNumber(contenedor.weight.toFixed(2))}Kg`} variant="outlined" size="medium" chipcolor="warning" />
                                    <Chip label={`Volumen Soportado ${UtilidadesHelper.formatNumber(contenedor.volume.toFixed(2))}m3`} variant="outlined" size="medium" chipcolor="warning" />
                                </>
                        }
                    </>
                ) : (
                    <>
                        <Chip label={`Seleccione un tipo de contenedor`} size="medium" chipcolor="orange" />
                    </>
                )}
                {
                    theme.palette.mode === 'light' ?
                        <>
                            <Chip label={`Peso ${peso.toFixed(2)}Kg`} size="medium" chipcolor="primary" />
                            <Chip label={`Volumen ${volume.toFixed(2)}m3`} size="medium" chipcolor="primary" />
                            <Chip label={`Contenedores: ${contenedores.toFixed(2)}u.`} size="medium" chipcolor="primary" />
                        </> :
                        <>
                            <Chip label={`Peso ${peso.toFixed(2)}Kg`} variant="outlined" size="medium" chipcolor="success" />
                            <Chip label={`Volumen ${volume.toFixed(2)}m3`} variant="outlined" size="medium" chipcolor="success" />
                            <Chip label={`Contenedores: ${contenedores.toFixed(2)}u.`} variant="outlined" size="medium" chipcolor="success" />
                        </>
                }

            </Grid>
        </>
    )
}
