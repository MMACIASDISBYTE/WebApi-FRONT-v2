import PropTypes from 'prop-types';
import { forwardRef, useEffect, useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid,
    Radio,
    RadioGroup,
    Slide,
    TextField,
    Typography,
} from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { AlertComp } from './AlertComp';

// animation
const Transition = forwardRef((props, ref) => <Slide direction="left" ref={ref} {...props} />);

// ==============================|| Update DIALOG ||============================== //

const CompUpdate = ({ dataRow, open, handleCloseDialog, TableName, handleUpdateAPI }) => {
    const theme = useTheme();
    // console.log(dataRow);
    // console.log(TableName);
    // handle tag select
    const [dataName, setDataName] = useState(dataRow || {});
    // mostrar las alertas
    const [showAlert, setShowAlert] = useState(false);


    useEffect(() => {
        setDataName(dataRow || {});
    }, [dataRow]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setDataName((prevDataName) => ({
            ...prevDataName,
            [name]: value,
        }));
    };

    const handleRadioChange = (event) => {
        setDataName((prevDataName) => ({
            ...prevDataName,
            [event.target.name]: event.target.value === 'true',
        }));
    };

    const handleUpdate = async () => {

        // Validar si todos los campos requeridos están llenos
        const requiredFieldsFilled = Object.values(dataName).every(
            (value, index) => (value !== undefined && value !== '')
        );

        if (!requiredFieldsFilled) {
            setShowAlert(true);
            return;
        }

        if (TableName == 'NCM') {
            await handleUpdateAPI(dataRow.code, dataName);
            handleCloseDialog();
        } else {
            // Aquí realizas la actualización del registro usando el helper si la tabla es distinta a NCM ya no busca x id sino x code
            await handleUpdateAPI(dataRow.id, dataName);
            handleCloseDialog();
        }
    };

    const handleCloseAlert = () => {
        setShowAlert(false); // Cierra la alerta
    };

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseDialog}
            sx={{
                '&>div:nth-of-type(3)': {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&>div': {
                        m: 0,
                        borderRadius: '10px',
                        maxWidth: 450,
                        maxHeight: '100%',
                    }
                }
            }}
        >
            {open && (
                <>
                    <DialogTitle>Actualizar {TableName}</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>

                            {Object.entries(dataName).map(([key, value]) => (
                                // Ocultar el campo de entrada cuando el atributo es igual a "id"
                                key !== 'id' && (
                                    <Grid item xs={12} key={key}>
                                        <Typography variant="subtitle1">{key}</Typography>
                                        {typeof value === 'boolean' ? (
                                            <RadioGroup
                                                row
                                                name={key}
                                                value={value ? 'true' : 'false'}
                                                onChange={handleRadioChange}
                                            >
                                                <FormControlLabel
                                                    value="true"
                                                    control={<Radio color="primary" />}
                                                    label="True"
                                                />
                                                <FormControlLabel
                                                    value="false"
                                                    control={<Radio color="primary" />}
                                                    label="False"
                                                />
                                            </RadioGroup>
                                        ) : (
                                            <TextField
                                                fullWidth
                                                label={key}
                                                name={key}
                                                value={value}
                                                onChange={handleChange}
                                                sx={{ marginTop: '5px' }}
                                            />
                                        )}
                                    </Grid>
                                )
                            ))}

                        </Grid>
                    </DialogContent>
                    {showAlert ? (
                        <AlertComp onClick={()=>console.log('alerta')} handleCloseAlert={handleCloseAlert}/>
                    ) : (

                    <DialogActions>
                        <AnimateButton>
                            <Button variant="contained" onClick={handleUpdate}>Actualizar</Button>
                        </AnimateButton>
                        <Button variant="text" color="error" onClick={handleCloseDialog}>
                            Close
                        </Button>
                    </DialogActions>
                    )}
                </>
            )}
        </Dialog>
    );
};

CompUpdate.propTypes = {
    open: PropTypes.bool,
    handleCloseDialog: PropTypes.func
};
export default CompUpdate;