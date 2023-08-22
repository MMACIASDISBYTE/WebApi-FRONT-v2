import PropTypes from 'prop-types';
import { forwardRef, useEffect, useRef, useState } from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Slide,
    TextField,
    CardMedia,
    Chip,
    CircularProgress,
    Fab,
    Input,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    Typography
} from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';



// IMPORTO EL HELPER DE BANCO
import { BancoHelper } from '../../../../../../../helpers/BancoHelper';


// styles
const ImageWrapper = styled('div')(({ theme }) => ({
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '4px',
    cursor: 'pointer',
    width: 55,
    height: 55,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: theme.palette.background.default,
    '& > svg': {
        verticalAlign: 'sub',
        marginRight: 6
    }
}));


// animation
const Transition = forwardRef((props, ref) => <Slide direction="left" ref={ref} {...props} />);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250
        }
    },
    chip: {
        margin: 2
    }
};

// tags list & style
const tagNames = ['Html', 'Scss', 'Js', 'React', 'Ionic', 'Angular', 'css', 'Php', 'View'];

function getStyles(name, personName, theme) {
    return {
        fontWeight: personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium
    };
}

// ==============================|| BANCO ADD DIALOG ||============================== //

const ProductAdd = ({ open, handleCloseDialog }) => {
    const theme = useTheme();

    // handle category change dropdown
    const [currency, setCurrency] = useState('2');
    const handleSelectChange = (event) => {
        setCurrency(event?.target.value);
    };
    // set image upload progress
    const [progress, setProgress] = useState(0);
    const progressRef = useRef(() => {});
    useEffect(() => {
        progressRef.current = () => {
            if (progress > 100) {
                setProgress(0);
            } else {
                const diff = Math.random() * 10;
                setProgress(progress + diff);
            }
        };
    });

    useEffect(() => {
        const timer = setInterval(() => {
            progressRef.current();
        }, 500);

        return () => {
            clearInterval(timer);
        };
    }, []);

    // logica para que actuallizar / renderizar el componente a la hora de eliminar
    const [actualizacion, SetActualizacion] = useState(false);
    useEffect(()=>{
        // fetchData();
        SetActualizacion(false);
    },[actualizacion]);

    // handle tag select
    const [dataName, setDataName] = useState('');
    
    // Estado para almacenar la lista de elementos
    const [dataList, setDataList] = useState([]);

    const handleNameChange  = (event) => {
        setDataName(event?.target.value);
    };

    const handleAddBanco = () => {
        const newData = {
            id: 0,
            description: dataName,
          };
        BancoHelper.createData(newData) // Pasar el nombre del banco al manejador handleAddBanco en Banco.js
            .then((response) => {
                // Actualizar el estado con la nueva lista de elementos
                setDataList([...dataList, response]);
                console.log(dataName);
                console.log(newData);
            })
            .catch((error) => {
                console.error('Error', error);
            });
        handleCloseDialog();
    };
    


    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseDialog}
            sx={{
                '&>div:nth-of-type(3)': {
                    justifyContent: 'flex-end',
                    '&>div': {
                        m: 0,
                        borderRadius: '0px',
                        maxWidth: 450,
                        maxHeight: '100%'
                    }
                }
            }}
        >
            {open && (
                <>
                    <DialogTitle>Add Bank</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={gridSpacing} sx={{ mt: 0.25 }}>
                            
                            <Grid item xs={12}>
                                <TextField
                                    id="outlined-basic1"
                                    fullWidth label="Enter Bank Name*"
                                    // defaultValue="Ingrese el nombre de banco"
                                    placeholder='Ingrese el nombre de banco'
                                    value={dataName}
                                    onChange={handleNameChange} // Agregar esta línea
                                />
                            </Grid>

                            {/* <Grid item xs={12}>
                                <TextField
                                    id="outlined-basic2"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Enter Bank Name"
                                    defaultValue="Fundamentally redesigned and engineered The Apple Watch display yet."
                                />
                            </Grid> */}

                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <AnimateButton>
                            <Button variant="contained" onClick={handleAddBanco}>Create</Button>
                        </AnimateButton>
                        <Button variant="text" color="error" onClick={handleCloseDialog}>
                            Close
                        </Button>
                    </DialogActions>
                </>
            )}
        </Dialog>
    );
};

ProductAdd.propTypes = {
    open: PropTypes.bool,
    handleCloseDialog: PropTypes.func
};

export default ProductAdd;
