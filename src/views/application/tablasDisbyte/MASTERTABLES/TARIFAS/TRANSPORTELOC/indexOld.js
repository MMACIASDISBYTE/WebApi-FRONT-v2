// LISTED 17/7/2023 11:06   
import PropTypes from 'prop-types';
import * as React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    CardContent,
    Checkbox,
    Fab,
    Grid,
    IconButton,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    TextField,
    Toolbar,
    Tooltip,
    Typography
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets
import SaveIcon from '@mui/icons-material/Save'; // SE IMPORTA ICONO DE SAVE
import EditIcon from '@mui/icons-material/Edit'; // SE IMPORTA ICONO DE EDIT
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterListTwoTone';
import PrintIcon from '@mui/icons-material/PrintTwoTone';
import FileCopyIcon from '@mui/icons-material/FileCopyTwoTone';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/AddTwoTone';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import { orange, red } from '@material-ui/core/colors';
//importacion del helper fwette
import { TarifasTteLocalHelper } from '../../../../../../helpers/TarifasTteLocalHelper';
import { TableFieldEdit } from './TableField';
// Importa CircularProgress de Material UI
import { CircularProgress } from '@material-ui/core';
//importamos el useNavigate para manejar navegaciones y redireccciones
import { redirect, useNavigate } from "react-router-dom";

// table sort
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

const getComparator = (order, orderBy) =>
    order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

// table header options
// ADVERTENCIA:
// La dimension del array debe ser igual a la cantidad de columnas (campos) de un ROW.
// ADVERTENCIA:
// Los campos "id" debe contener el nombre exacto del atributo TAL y como FIGURA en el JSON
// Este array es usado para desplegar las columnas que sean encesarias para esta tabla, sus titulos
// alamcenados en LABEL y el nombre del atributo alamacenado en "id"
// 
// TODA VEZ QUE SE COPIE ESTE ARCHIVO PARA SER USADO EN UNA TABLA DE n campos, los n campos DEBEN 
// se ingresados aca SIN EXCEPCION. Si el id no tiene un nombre de campo valido, ROMPE. Entiendase
// por valido, alguna de las propiedades del JSON.
const headCells = [

    {
        id: 'id',
        numeric: true,
        label: 'ID',
        align: 'center'
    },
    {
        id: 'contype',
        numeric: false,
        label: 'TIPO DE CONTENEDOR',
        align: 'center'
    },
    {
        id: 'fleteint',
        numeric: true,
        label: 'FLETE INTERNO',
        align: 'center'
    },
    {
        id: 'devacio',
        numeric: true,
        label: 'DEVOLUCION VACIO',
        align: 'center'
    },
    {
        id: 'demora',
        numeric: true,
        label: 'DEMORA',
        align: 'center'
    },
    {
        id: 'guarderia',
        numeric: true,
        label: 'GUARDERIA',
        align: 'center'
    },
    {
        id: 'totgastos',
        numeric: true,
        label: 'TOTAL GASTOS',
        align: 'center'
    }
];

// ==============================|| TABLE HEADER ||============================== //

function EnhancedTableHead({ onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, theme, selected }) {
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {<TableCell padding="checkbox" sx={{ pl: 3 }}>
                    {/*<Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts'
                        }}
                    />*/}
                </TableCell>}
                {numSelected > 0 && (
                    <TableCell padding="none" colSpan={7}>
                        <EnhancedTableToolbar numSelected={selected.length} />
                    </TableCell>
                )}
                {numSelected <= 0 &&
                    headCells.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            align={headCell.align}
                            padding={headCell.disablePadding ? 'none' : 'normal'}
                            sortDirection={orderBy === headCell.id ? order : false}
                        >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell?.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                {numSelected <= 0 && (
                    <TableCell sortDirection={false} align="center" sx={{ pr: 3 }}>
                        <Typography variant="subtitle1" sx={{ color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900' }}>
                            Action
                        </Typography>
                    </TableCell>
                )}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    theme: PropTypes.object,
    selected: PropTypes.array,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
};

// ==============================|| TABLE HEADER TOOLBAR ||============================== //

const EnhancedTableToolbar = ({ numSelected }) => (
    <Toolbar
        sx={{
            p: 0,
            pl: 1,
            pr: 1,
            ...(numSelected > 0 && {
                color: (theme) => theme.palette.secondary.main
            })
        }}
    >
        {numSelected > 0 ? (
            <Typography color="inherit" variant="h4">
                {numSelected} Selected
            </Typography>
        ) : (
            <Typography variant="h6" id="tableTitle">
                Nutrition
            </Typography>
        )}
        <Box sx={{ flexGrow: 1 }} />
        {numSelected > 0 && (
            <Tooltip title="Delete">
                <IconButton size="large">
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        )}
    </Toolbar>
);

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired
};

// ==============================|| TRANSPORTE LOCAL - LIST ||============================== //

const ProductList = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    //no utilizamos es de la version original
    // const dispatch = useDispatch();

    // show a right sidebar when clicked on new product
    const [open, setOpen] = React.useState(false);
    const handleClickOpenDialog = () => {
        setOpen(true);
    };
    const handleCloseDialog = () => {
        setOpen(false);
        SetActualizacion(true);
    };

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [search, setSearch] = React.useState('');

    // SE AGREGA EL MODO EDICION
    const [editMode, setEditMode] = React.useState({});
    // Este flag indica que al menos una entrada esta siendo editada e inhibe la edicion para 
    // todas las demas
    const [oneEditing, setOneEditing] = React.useState(false);
    // Este flag indica que se esta editando una entrada nueva. Sirve para indicar al click del 
    // diskette (cassette) que hacer, si llamar a update o a insert.
    const [enableEditPK, setEnableEditPK] = React.useState(false);

    const [rows, setRows] = React.useState([]); //estoy almacenando la data fwette
    const [rowsOrig, setRowsOrig] = React.useState([]); //estoy almacenando la data fwette

    // logica para que actuallizar / renderizar el componente a la hora de eliminar
    const [actualizacion, SetActualizacion] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetchData();
        SetActualizacion(false);
        setLoading(false);
    }, [actualizacion]);

    // traigo data de fwette Y LO ALMACENO EN EL STATE DE setRows
    /*const fetchData = async () => {
        const jsonData = await TarifasTteLocalHelper.fetchData();
        setRows(jsonData);
        setRowsOrig(jsonData);
    };*/

    // traigo data de banco Y LO ALMACENO EN EL STATE DE setRows
    const fetchData = async (accessToken) => {
        try {
            //traigo 2 parametros del helper, uno es la data y el otro es el response crudo de la api para manejar los redirect
            const [jsonData, jsonDataStatus] = await TarifasTteLocalHelper.fetchData();
            // const jsonData = await BancoHelper.fetchData(accessToken);

            //console.log(jsonData);
            //console.log(jsonDataStatus.status);
            setRows(jsonData);
            setRowsOrig(jsonData);
            // aca manejo los errores, y rederijo hay q importar navegate
            if (jsonDataStatus.status !== 200) {
                navigate('/pages/error');
            }
            //console.log(accessToken);
            // console.log('Data del json: ', jsonData)
            //setRows(jsonData);
        } catch (error) {
            console.log(error);
            navigate('/pages/error');
        }
    };


    /*React.useEffect(() => {
        fetchData();
        //console.log(rows);
    }, []);*/


    // AQUI ELEMINO ELEMENTOS
    const handleDelete = async (id) => {
        // Aquí debes implementar la lógica para eliminar los productos seleccionados
        await TarifasTteLocalHelper.deleteDataById(id);
        // para actualizar el componente
        SetActualizacion(true);
        console.log(`Tarifa Tranporte Local con ID ${id} se ha sido eliminada`);
    };

    const handleEdit = async (id) => {

        setOneEditing(true);

        setEditMode((prevEditMode) => ({
            ...prevEditMode,
            [id]: true,
        }));

        console.log(`Tarifa Transporte Local con ID ${id}, ha sido Editada`)
    };

    const handleUpdate = async (id) => {
        setEnableEditPK(false);
        setOneEditing(false);
        const registro = rows.find((row) => row.id === id);
        // cuando finalmente se hace update a la base, actualizo la copia original de ROWS.
        // de forma de mantenerlo coherente. Quiza esta linea deberia ejecutarse LUEGO de corroborar
        // que la operacion a la base se ejecuto con exito.
        setRowsOrig(rowsOrig.map((myRow) => id === myRow.id ? registro : myRow));
        // Llamar a la función del helper para modificar el registro
        await TarifasTteLocalHelper.updateDataById(id, registro);
        //para cuando se actualice el componente
        // SetActualizacion(true);
        setEditMode((prevEditMode) => ({
            ...prevEditMode,
            [id]: false,
        }));
    };

    // Cuando presionan AGREGAR, se crea una entrada dummy en la lista de ROWS con los contenidos que aparecen aca
    // Luego la RIW queda como si estuviere en modo edicion, pendiente de que completen los valores.
    const handleAddRowToTable = () => {
        // Contenido x defecto que aparece dentro de las celdas cuando la entrada es creada
        const newData = {
            id: 0,           // No cambiar este Texto.
            contype: "!EDIT",
            fleteint: 0,
            devacio: 0,
            demora: 0,
            guarderia: 0,
            totgastos: 0
        };

        rows.unshift(0);
        rows[0] = newData;
        console.log(rows);
        //   SetActualizacion(true);

        // Cancelo los botones de editar y borrar a todas las otras entradas
        setOneEditing(true);
        // Aviso que estoy creando una entrada (DISKETTE?INSERT:UPDATE)
        setEnableEditPK(true);
        // Lo marco como en modo edicion tambien.
        setEditMode((prevEditMode) => ({
            ...prevEditMode,
            [0]: true,
        }));

    }

    // "SUSTITUYE" a NCMadd. El add se hace desde el mismo form.
    // El caso en que le dan SAVE a una entrada DUMMY creada con el metodo handleRowToTable, se usara por unica vez
    // este metodo y no UPDATE. Se usa el mismo ICONO (DISKETTE ... AKA CASSETTE). Hay un flag que indica
    // que se esta CREANDO una entrada y redirige el clik en el diskette a handleupdate o handleinsert.
    const handleInsert = () => {

        if (rows[0].contype === "!EDIT" || rows[0].contype === "") {
            return;
        }

        setEnableEditPK(false);
        setOneEditing(false);
        TarifasTteLocalHelper.createData(rows[0]) // Pasar el nombre del data al manejador handleAdd
            .then((response) => {
                // Actualizar el estado con la nueva lista de elementos
                // setDataList([...dataList, response]);
            })
            .catch((error) => {
                console.error('Error', error);
            });
        setEditMode((prevEditMode) => ({
            ...prevEditMode,
            [0]: false,
        }))
    };

    // Salen del modo EDICION sin guardar cambios.
    // Dado que los cambios se van guardando a medida que cambian los textboxes, no tengo forma de volver
    // a la data original, excepto que haga un render de nuevo
    // Mantengo una copia de los ROWS originales y si me dan cancelar sustituyo a "rows" con estos.
    // Limitacion: Si habia mas ee una edicion en curso, cancelar una implica cancelar TODAS. 
    // Lo ideal seria que solo de pudiera editar una a la vez.
    const handleReject = (id) => {
        setOneEditing(false);
        setEnableEditPK(false);
        setRows(rowsOrig);
        setEditMode((prevEditMode) => ({
            ...prevEditMode,
            [id]: false,
        }));
        SetActualizacion(true);
    };

    // QUITO ESTE METODO Q ME TRAE CONFLICTO DE LA API ORIGINAL
    // const { products } = useSelector((state) => state.customer);
    // React.useEffect(() => {
    //     dispatch(getProducts());
    // }, [dispatch]);
    // React.useEffect(() => {
    //     setRows(products);
    // }, [products]);

    const handleSearch = (event) => {
        const newString = event?.target.value;
        setSearch(newString || '');

        //cuando se vacia el search renderiza nuevamente gracias al setActualizacion
        if (event.target.value == '') {
            SetActualizacion(true);
        };

        if (newString) {
            const newRows = rows.filter((row) => {
                let matches = true;

                // las propiedades que debe listar/buscar, deben de ser igual al modelo
                const properties = [
                    'id',
                    'contype',
                    'fleteint',
                    'devacio',
                    'demora',
                    'guarderia',
                    'totgastos'
                ];

                let containsQuery = false;

                properties.forEach((property) => {
                    //console.log(newString)
                    if (row[property]?.toString().toLowerCase().includes(newString.toString().toLowerCase())) {
                        containsQuery = true;
                    }
                });

                if (!containsQuery) {
                    matches = false;
                }
                return matches;
            });
            console.log(newRows);
            setRows(newRows);
        } else {
            setRows(rows);
        }
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            if (selected.length > 0) {
                setSelected([]);
            } else {
                const newSelectedId = rows.map((n) => n.name);
                setSelected(newSelectedId);
            }
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event?.target.value, 10));
        setPage(0);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <>

            <MainCard title="Maestro TARIFAS.TTELOCAL V2" content={false}>
                {rows && (
                    <CardContent>
                        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon fontSize="small" />
                                            </InputAdornment>
                                        )
                                    }}
                                    onChange={handleSearch}
                                    placeholder="Buscar en TRANSPORTE"
                                    value={search}
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>


                                {/* BOTON COPY */}
                                {/* <Tooltip title="Copy">
                            <IconButton size="large">
                                <FileCopyIcon />
                            </IconButton>
                        </Tooltip> */}

                                {/* BOTON IMPRESION */}
                                {/* <Tooltip title="Print">
                            <IconButton size="large">
                                <PrintIcon />
                            </IconButton>
                        </Tooltip> */}

                                {/* BOTON FILTRO */}
                                {/* <Tooltip title="Filter">
                            <IconButton size="large">
                                <FilterListIcon />
                            </IconButton>
                        </Tooltip> */}

                                {/* product add & dialog */}
                                {!oneEditing &&
                                    <>
                                        <Tooltip title="Add TRANSPORTE">
                                            <Fab
                                                color="primary"
                                                size="small"
                                                // onClick={handleClickOpenDialog}
                                                onClick={handleAddRowToTable}
                                                sx={{ boxShadow: 'none', ml: 1, width: 32, height: 32, minHeight: 32 }}
                                            >
                                                <AddIcon fontSize="small" />
                                            </Fab>
                                        </Tooltip>
                                        {/* <ProductAdd open={open} handleCloseDialog={handleCloseDialog} /> */}
                                    </>}
                            </Grid>
                        </Grid>
                    </CardContent>
                )}

                {/* table */}
                <TableContainer>
                    <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                            theme={theme}
                            selected={selected}
                        />
                        <TableBody>
                            {stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    /** Make sure no display bugs if row isn't an OrderData object */
                                    if (typeof row === 'number') return null;
                                    const isItemSelected = isSelected(row.description);
                                    const labelId = `enhanced-table-checkbox-${index}`;
                                    // Yo index necesito que vaya de 0 a n-1. Pero dado que pagina, index es 0 
                                    // en cada inicio de pagina lo cual no me permite indexar los rows de 0 a n
                                    // Con lo cual vuelvo a colocar a index con el valor que deberia tener de modo que
                                    // la logica de abajo funcione.
                                    index = index + (page * rowsPerPage);
                                    return (
                                        <TableRow
                                            hover
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={index}
                                            selected={isItemSelected}
                                        >
                                            <TableCell padding="checkbox" sx={{ pl: 3 }} onClick={(event) => handleClick(event, row.description)}>
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        'aria-labelledby': labelId
                                                    }}
                                                />
                                            </TableCell>
                                            {/* Para todos los campos de un ROW, mostrar los datos:
                                            normales o en edicion. En esta tabla elk ID es PK y por lo tanto no
                                            es editable, por lo que editMode en id es automaticamente false. Para 
                                            barrer todos los campos de valgo del arrary headecells. Su cantidad y los
                                            datos "id" y "label" con CRITICOS. Sobre todo el datos id, debe tener 
                                            EXACTAMENTE el nombre del campo que se esta editando. OJO.*/}
                                            {headCells.map((cell) =>
                                            (
                                                <TableFieldEdit
                                                    rows={rows}
                                                    setRows={setRows}
                                                    index={index}
                                                    field={cell.id}
                                                    text={cell.label}
                                                    editMode={cell.id === "id" ? false : editMode[row.id]}
                                                />
                                            ))}

                                            {/* Logica del os botones EDITAR / BORRAR / CANCELAR */}
                                            {
                                                editMode[row.id] ? (
                                                    <>
                                                        <TableCell>
                                                            <Tooltip title="Edit">
                                                                {/* Uso el icono del diskette (CASSETTE) para hacer update pero tambien para hacer insert si es una nueva entrada
                                                                Cuando una entrada esta siendo creada, el flag enableEditPK esta seteado. */}
                                                                <IconButton onClick={() => enableEditPK ? handleInsert() : handleUpdate(row.id)}>
                                                                    <SaveIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </TableCell>

                                                        <TableCell>
                                                            {/* Botton Deshacer */}
                                                            <Tooltip title="Cancel">
                                                                <IconButton onClick={() => handleReject(row.id)}>
                                                                    <UndoOutlinedIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </TableCell>
                                                    </>

                                                ) : (
                                                    <>
                                                        {/* Solo muestro los iconos de edicion y borrado si ninguna entrada esta siendo editada
                                                 La idea es que solo pueda haber una entrada en modo edicion en un momento dado */}
                                                        {!oneEditing && <TableCell>
                                                            <Tooltip title="Delete">
                                                                <IconButton size="large">
                                                                    <DeleteIcon fontSize="small" onClick={() => handleDelete(row.id)} />
                                                                </IconButton>

                                                            </Tooltip>
                                                            <IconButton onClick={() => handleEdit(row.id)}>
                                                                <EditIcon />
                                                            </IconButton>
                                                        </TableCell>}
                                                    </>
                                                )}
                                        </TableRow>
                                    );
                                })

                            }
                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: 53 * emptyRows
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* table pagination */}
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </MainCard>

        </>
    );
};
export default ProductList;