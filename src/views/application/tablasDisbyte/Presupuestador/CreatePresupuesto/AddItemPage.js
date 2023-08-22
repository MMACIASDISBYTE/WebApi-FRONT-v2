import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import { Button, FormControl, FormHelperText, Grid, MenuItem, OutlinedInput, Select, Stack, TextField, Typography } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';

// ==============================|| ADD ITEM PAGE ||============================== //
//
let counter = 0; // Esto debería estar fuera de la función del componente para que no se reinicie en cada render

function AddItemPage({ handleAddItem, setAddItemClicked, dataHelp }) {
    const [selectedItem, setSelectedItem] = useState({
        id: '',
        modelo: '',
        amount: 0,
        code: '',
        pesoUnitxCaja: '',
        cbmxCaja: '',
        pcsxCaja: '',
    });

    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [amount, setAmount] = useState(0);
    const [errors, setErrors] = useState({
        quantityError: ''
    });
    console.log(dataHelp.NCM);

    const NCMList = dataHelp.NCM[0].map(item => ({
        id: item.id,
        description: item.description,
        code: item.code,
        pesoUnitxCaja: item.pesoUnitxCaja,
        cbmxCaja: item.cbmxCaja,
        pcsxCaja: item.pcsxCaja,
    }));

    useEffect(() => {
        if (selectedItem?.amount) {
            setAmount(selectedItem.amount * selectedQuantity);
        }
    }, [selectedQuantity, selectedItem]);


    const handleChange = (event) => {
        const value = event.target.value;
        if (event.target.name === 'quantity') {
            if (Number(value) < 0) {
                setErrors({
                    ...errors,
                    quantityError: 'negative values not allowed'
                });
                setSelectedQuantity(value);
            } else if (Number(value) === 0) {
                setErrors({
                    ...errors,
                    quantityError: 'quantity can not be zero'
                });
                setSelectedQuantity(value);
            } else {
                setSelectedQuantity(value);
                setErrors({
                    ...errors,
                    quantityError: ''
                });
            }
        } else {
            const selectedOption = NCMList.find((item) => item.id === value);
            setSelectedItem({
                ...selectedItem,
                id: selectedOption.id++,
                code: selectedOption.code,
            });
            console.log(selectedItem);
        }
    };

    const handleOk = () => {

        let errors = {}; // creo objeto de errores
        // validación de campos
        // Validacion NCM
        if (!selectedItem?.id) {
            errors.NCMError = 'NCM is required';
        }
        // Validacion producto
        if (!selectedItem?.modelo || !selectedItem?.modelo.trim()) {
            errors.productError = 'Product Name is required';
        }
        // Validacion FOb unitario
        if (!selectedItem?.amount || selectedItem?.amount <= 0) {
            errors.ValorFOBunitError = 'Value Fob is required';
        }   
        // Validacion Valor unitario
        if (!selectedItem?.pesoUnitxCaja || selectedItem?.pesoUnitxCaja <= 0) {
            errors.ValorUnitError = 'Value is required';
        }
        // Validacion Vol x caja
        if (!selectedItem?.cbmxCaja || selectedItem?.cbmxCaja <= 0) {
            errors.cbmxCajaError = 'Value Vol. x caja is required';
        }   
        // Validacion Piezas x caja
        if (!selectedItem?.pcsxCaja || selectedItem?.pcsxCaja <= 0) {
            errors.pcsxCajaError = 'Value Pieza x caja is required';
        }

        if (Object.keys(errors).length > 0) {
            setErrors(errors); // actualizamos los errores de validación en el estado
            return;
        }

        counter++;
        const data = {
            ...selectedItem,
            id: counter, // Aquí es donde generas el nuevo id
            totalAmount: amount,
            selectedQuantity,
        };

        console.log(data);
        handleAddItem(data);
    };

    return (
        <>
            {/* PRODUCTO */}
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                        <Typography variant="subtitle1">Producto</Typography>
                        <FormControl>
                            <FormControl>
                            <tooltip title='Producto a importar'>
                                <TextField
                                    fullWidth
                                    displayEmpty
                                    error={Boolean(errors.productError)}
                                    value={selectedItem?.modelo || ''}
                                    onChange={(e) => setSelectedItem({ ...selectedItem, modelo: e.target.value })}
                                    placeholder="Enter Product Name"
                                />
                            </tooltip>
                            {errors.productError && <FormHelperText>{errors.productError}</FormHelperText>}  {/* alerta de MANEJO DEL ERROR */}
                            </FormControl>
                        </FormControl>
                    </Stack>
                </Grid>

                {/* POSICION ARANCELARIA // NCM */}
                <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                        <Typography variant="subtitle1">NCM</Typography>
                        <FormControl fullWidth error={Boolean(errors.NCMError)}>
                            <Select
                                fullWidth
                                displayEmpty
                                value={selectedItem?.id || ''}
                                onChange={handleChange}
                                input={<OutlinedInput />}
                                renderValue={(selected) => {
                                    if (selected.length === 0) {
                                        return (
                                            <Typography color="textSecondary" sx={{ lineHeight: '1.4375em' }}>
                                                Select NCM
                                            </Typography>
                                        );
                                    }
                                    const selectedData = NCMList.filter((item) => item.id === selected)[0];
                                    return (
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
                                            <Typography variant="subtitle1" sx={{ lineHeight: '1.4375em' }}>
                                                {selectedData.description}
                                            </Typography>
                                            <Typography>Code : {selectedData.code}</Typography>
                                        </Stack>
                                    );
                                }}
                                inputProps={{ 'aria-label': 'Without label' }}
                            >
                                <MenuItem disabled value="">
                                    <Typography color="textSecondary">Select NCM</Typography>
                                </MenuItem>
                                {NCMList.map((item, i) => (
                                    <MenuItem key={i} value={item.id}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
                                            <Typography variant="subtitle1">{item.description}</Typography>
                                            <Typography>Code : {item.code}</Typography>
                                        </Stack>
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.NCMError && <FormHelperText>{errors.NCMError}</FormHelperText>}  {/* alerta de MANEJO DEL ERROR */}
                        </FormControl>
                    </Stack>
                </Grid>

                {/* CANTIDAD */}
                <Grid item xs={12} md={3}>
                    <Stack spacing={1}>
                        <Typography variant="subtitle1" id="itemQuantity">
                            Cantidad de Piezas a Imp
                        </Typography>
                        <tooltip title='Cantidad de piezas a importar'>
                            <TextField
                                fullWidth
                                type="number"
                                name="quantity"
                                value={selectedQuantity}
                                onChange={handleChange}
                                error={Boolean(errors.quantityError)}
                                helperText={errors.quantityError}
                                inputProps={{style: { textAlign: 'right' }}} // Aquí se alinea el texto a la derecha
                            // disabled={!selectedItem?.id}
                            />
                        </tooltip>
                    </Stack>
                </Grid>

                {/* VALOR UNITARIO */}
                <Grid item xs={12} md={3}>
                    <Stack spacing={1}>
                        <Typography variant="subtitle1">FOB u$s</Typography>
                        <FormControl>
                            <tooltip title='Valor en u$s de una pieza en Origen'>
                                <TextField
                                    fullWidth
                                    type="number"
                                    name='ValorFOBunit'
                                    value={selectedItem?.amount || ''}
                                    onChange={(e) => setSelectedItem({ ...selectedItem, amount: e.target.value })}
                                    error={Boolean(errors.ValorFOBunitError)}
                                    placeholder="Enter Product Value"
                                    inputProps={{style: { textAlign: 'right' }}} // Aquí se alinea el texto a la derecha
                                />
                            </tooltip>
                            {errors.ValorFOBunitError && <FormHelperText>{errors.ValorFOBunitError}</FormHelperText>}  {/* alerta de MANEJO DEL ERROR */}
                        </FormControl>
                    </Stack>
                </Grid>

                {/* PESO UNITARIO CAJA */}
                <Grid item xs={12} md={2}>
                    <Stack spacing={1}>
                        <Typography variant="subtitle1">Peso U. x caja</Typography>
                        <FormControl>
                            <FormControl>
                                <tooltip title='Peso unitario por caja'>
                                    <TextField
                                        fullWidth
                                        type='number'
                                        name='ValorUnit'
                                        displayEmpty
                                        value={selectedItem?.pesoUnitxCaja || ''}
                                        onChange={(e) => setSelectedItem({ ...selectedItem, pesoUnitxCaja: e.target.value })}
                                        error={Boolean(errors.ValorUnitError)}
                                        placeholder="Enter Peso Unitario"
                                        inputProps={{style: { textAlign: 'right' }}} // Aquí se alinea el texto a la derecha
                                    />
                                </tooltip>
                                {errors.ValorUnitError && <FormHelperText>{errors.ValorUnitError}</FormHelperText>}  {/* alerta de MANEJO DEL ERROR */}
                            </FormControl>
                        </FormControl>
                    </Stack>
                </Grid>

                {/* CMB x CAJA (volumen x caja) */}
                <Grid item xs={12} md={2}>
                    <Stack spacing={1}>
                        <Typography variant="subtitle1">Volumen x caja</Typography>
                        <FormControl>
                            <FormControl>
                                <tooltip title='Volumen por caja en contenedor'>
                                    <TextField
                                        fullWidth
                                        type='number'
                                        name='cbmxCaja'
                                        displayEmpty
                                        value={selectedItem?.cbmxCaja || ''}
                                        onChange={(e) => setSelectedItem({ ...selectedItem, cbmxCaja: e.target.value })}
                                        error={Boolean(errors.cbmxCajaError)}
                                        placeholder="Enter Peso Unitario"
                                        inputProps={{style: { textAlign: 'right' }}} // Aquí se alinea el texto a la derecha
                                    />
                                </tooltip>
                                {errors.cbmxCajaError && <FormHelperText>{errors.cbmxCajaError}</FormHelperText>}  {/* alerta de MANEJO DEL ERROR */}
                            </FormControl>
                        </FormControl>
                    </Stack>
                </Grid>

                {/* Piezas x CAJA (volumen x caja) */}
                <Grid item xs={12} md={2}>
                    <Stack spacing={1}>
                        <Typography variant="subtitle1">Piezas x caja</Typography>
                        <FormControl>
                            <FormControl>
                                <tooltip title='Piezas por cajas'>

                                    <TextField
                                        fullWidth
                                        type='number'
                                        name='pcsxCaja'
                                        displayEmpty
                                        value={selectedItem?.pcsxCaja || ''}
                                        onChange={(e) => setSelectedItem({ ...selectedItem, pcsxCaja: e.target.value })}
                                        error={Boolean(errors.pcsxCajaError)}
                                        placeholder="Enter Peso Unitario"
                                        inputProps={{style: { textAlign: 'right' }}} // Aquí se alinea el texto a la derecha
                                    />
                                </tooltip>
                                {errors.pcsxCajaError && <FormHelperText>{errors.pcsxCajaError}</FormHelperText>}  {/* alerta de MANEJO DEL ERROR */}
                            </FormControl>
                        </FormControl>
                    </Stack>
                </Grid>

                {/* CANTIDAD fob total */}
                {/* <Grid item xs={12} md={4}>
                    <Stack spacing={1}>
                        <Typography variant="subtitle1" id="itemAmount">
                            FOB Total
                        </Typography>
                        <TextField fullWidth name="amount" value={amount} disabled />
                    </Stack>
                </Grid> */}


                <Grid item container justifyContent="flex-end">
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Button color="error" onClick={() => setAddItemClicked(false)}>
                            Cancel
                        </Button>
                        <Button
                            // disabled={!selectedItem?.id || !selectedQuantity || Boolean(errors.quantityError)}
                            variant="contained"
                            size="small"
                            onClick={handleOk}
                        >
                            Agregar
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
}

AddItemPage.propTypes = {
    handleAddItem: PropTypes.func,
    setAddItemClicked: PropTypes.func
};

export default AddItemPage;
