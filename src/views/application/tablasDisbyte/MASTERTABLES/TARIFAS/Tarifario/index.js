// LISTED 5_10_2023 17:51PM 
import PropTypes from "prop-types";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import {MenuItem,Divider} from "@mui/material";
import * as React from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Box,
  CardContent,
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
  Typography,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";

// project imports
import MainCard from "ui-component/cards/MainCard";
import { CircularProgress, makeStyles } from "@material-ui/core";
import SubCard from "ui-component/cards/SubCard";

//importamos el useNavigate para manejar navegaciones y redireccciones
import { redirect, useNavigate } from "react-router-dom";

// assets
import SaveIcon from "@mui/icons-material/Save"; // SE IMPORTA ICONO DE SAVE
import EditIcon from "@mui/icons-material/Edit"; // SE IMPORTA ICONO DE EDIT
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/AddTwoTone";
import UndoOutlinedIcon from "@mui/icons-material/UndoOutlined";

//importacion del helper fwette
import { TarifasTerminalHelper } from "../../../../../../helpers/TarifasTerminalHelper";
import { TarifonMexHelper } from "../../../../../../helpers/TarifonMexHelper";
import AddTarifario from "../../AddTarifario";
import CompUpdate from "../../CompUpdate";
import { useAccessTokenJWT } from "helpers/useAccessTokenJWT";
import { PaisRegionHelper } from "helpers/PaisRegionHelper";
import { TerminalHelper } from "helpers/TerminalHelper";
import { CargaHelper } from "helpers/CargaHelper";
import { PolizaHelper } from "helpers/PolizaHelper";
import { UtilidadesHelper } from "helpers/UtilidadesHelper";

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
  order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}





/*public class TarifonMex
{
    public int id {get;set;}
    public string description {get;set;}
    public double flete_internacional_40sthq{get;set;}
    public double flete_internacional_20ft{get;set;}
    public double seguro{get;set;}
    public double gastosLocales_40sthq{get;set;}
    public double gastosLocales_20ft{get;set;}   
    public double terminal_40sthq{get;set;}
    public double terminal_20ft{get;set;}
    public double flete_interno_1p40sthq_guad{get;set;}     //1*40hq
    public double flete_interno_1p20ft_guad{get;set;}       //1*20ft
    public double flete_interno_1p40sthq_cdmx{get;set;}     
    public double flete_interno_1p20ft_cdmx{get;set;}
    public double flete_interno_2p40sthq_guad{get;set;}     //2*40hq o st GUAD
    public double flete_interno_2p20ft_guad{get;set;}       //2*20ft GUAD
    public double flete_interno_2p40sthq_cdmx{get;set;}     //2*40hq CDMX
    public double flete_interno_2p20ft_cdmx{get;set;}       //2*20ft CDMX
    public double descarga_meli_40sthq_guad{get;set;}
    public double descarga_meli_20ft_guad{get;set;}
    public double descarga_meli_40sthq_cdmx{get;set;}
    public double descarga_meli_20ft_cdmx{get;set;}
    public double despa_fijo{get;set;}
    public double despa_var{get;set;}
    public double despa_clasific_oper{get;set;}
    public double despa_consult_compl{get;set;}
    public DateTime htimestamp{get;set;}
}*/





// table header options/ATRIBUTOS DEL MODELO, tambien este arr le da la caracteristica al formulario tanto de AddIetm como CompUpdate
const headCells = [
  {
    id: "id",
    numeric: true,
    select: null,
    isRequired: false,
    isDisabled: false,
    ocultar: false,
    label: "Id",
    align: "Left",
  },
  {
    id: "htimestamp",
    numeric: 'fecha',
    select: null,
    isRequired: false,
    isDisabled: true,
    ocultar: false,
    label: "Ult. Edicion",
    align: "Left",
  },
  {
    id: "flete_internacional_40sthq",
    numeric: true,
    select: null,
    isRequired: true,
    isDisabled: false,
    ocultar: false,
    label: "Flete Internacional 40HQ/STD",
    align: "Left",
  },
  {
    id: "flete_internacional_20ft",
    numeric: true,
    select: null,
    isRequired: true,
    isDisabled: false,
    ocultar: false,
    label: "Flete Internacional 20FT",
    align: "Left",
  },
  {
    id: "seguro",
    numeric: true,
    select: null,
    isRequired: true,
    isDisabled: false,
    ocultar: false,
    label: "Seguro Variable (segun FOB)",
    align: "Left",
  },
  {
    id: "gastosLocales_40sthq",
    numeric: true,
    select: null,
    isRequired: true,
    isDisabled: false,
    ocultar: false,
    label: "Gastos Locales 40HQ/STD",
    align: "Left",
  },
  {
    id: "gastosLocales_20ft",
    numeric: true,
    select: null,
    isRequired: true,
    isDisabled: false,
    ocultar: false,
    label: "Gastos Locales 20FT",
    align: "Left",
  },
  {
    id: "terminal_40sthq",
    numeric: true,
    select: null,
    isRequired: true,
    isDisabled: false,
    ocultar: false,
    label: "Terminal 40HQ/STD",
    align: "Left",
  },
  {
    id: "terminal_20ft",
    numeric: true,
    select: null,
    isRequired: true,
    isDisabled: false,
    ocultar: false,
    label: "Terminal 20FT",
    align: "Left",
  },
  {
    id: "flete_interno_1p40sthq_guad",
    numeric: true,
    select: null,
    isRequired: true,
    isDisabled: false,
    ocultar: false,
    label: "Flete Interno 1*40HQ/STD GUAD",
    align: "Left",
  },
  {
    id: "flete_interno_1p20ft_guad",
    numeric: true,
    select: null,
    isRequired: true,
    isDisabled: false,
    ocultar: false,
    label: "Flete Interno 1*20FT GUAD",
    align: "Left",
  },
  {
    id: "flete_interno_1p40sthq_cdmx",
    numeric: true,
    select: null,
    isRequired: false,
    isDisabled: false,
    ocultar: true,
    label: "Flete Interno 1*40HQ/STD CDMX",
    align: "Left",
  },
  {
    id: "flete_interno_1p20ft_cdmx",
    numeric: true,
    select: null,
    isRequired: false,
    isDisabled: false,
    ocultar: true,
    label: "Flete Interno 1*20FT CDMX",
    align: "Left",
  },
  {
    id: "flete_interno_2p40sthq_guad",
    numeric: true,
    select: null,
    isRequired: true,
    isDisabled: false,
    ocultar: false,
    label: "Flete Interno 2*40HQ/STD GUAD",
    align: "Left",
  },
  {
    id: "flete_interno_2p20ft_guad",
    numeric: true,
    select: null,
    isRequired: true,
    isDisabled: false,
    ocultar: false,
    label: "Flete Interno 2*20FT GUAD",
    align: "Left",
  },
  {
    id: "flete_interno_2p40sthq_cdmx",
    numeric: true,
    select: null,
    isRequired: false,
    isDisabled: false,
    ocultar: true,
    label: "Flete Interno 2*40HQ/STD CDMX",
    align: "Left",
  },
  {
    id: "flete_interno_2p20ft_cdmx",
    numeric: true,
    select: null,
    isRequired: false,
    isDisabled: false,
    ocultar: true,
    label: "Flete Interno 2*20FT CDMX",
    align: "Left",
  },
  {
    id: "descarga_meli_40sthq_guad",
    numeric: true,
    select: null,
    isRequired: true,
    isDisabled: false,
    ocultar: false,
    label: "Descarga MELI 40HQ/STD GUAD",
    align: "Left",
  },
  {
    id: "descarga_meli_20ft_guad",
    numeric: true,
    select: null,
    isRequired: true,
    isDisabled: false,
    ocultar: false,
    label: "Descarga MELI 20FT GUAD",
    align: "Left",
  },
  {
    id: "descarga_meli_40sthq_cdmx",
    numeric: true,
    select: null,
    isRequired: false,
    isDisabled: true,
    ocultar: false,
    label: "Descarga 40HQ/STD CDMX",
    align: "Left",
  },
  {
    id: "descarga_meli_20ft_cdmx",
    numeric: true,
    select: null,
    isRequired: false,
    isDisabled: false,
    ocultar: true,
    label: "Descarga 20FT CDMX",
    align: "Left",
  },
  {
    id: "despa_fijo",
    numeric: true,
    select: null,
    isRequired: true,
    isDisabled: false,
    ocultar: false,
    label: "Despachante Cargo Fijo",
    align: "Left",
  },
  {
    id: "despa_var",
    numeric: true,
    select: null,
    isRequired: true,
    isDisabled: false,
    ocultar: false,
    label: "Despachante cargo Var.",
    align: "Left",
  },
  {
    id: "despa_clasific_oper",
    numeric: true,
    select: null,
    isRequired: true,
    isDisabled: false,
    ocultar: false,
    label: "Despachante Clasific x Oper.",
    align: "Left",
  },
  {
    id: "despa_consult_compl",
    numeric: true,
    select: null,
    isRequired: true,
    isDisabled: false,
    ocultar: false,
    label: "Despachante Consult Compl.",
    align: "Left",
  },
  // {
  //   id: "htimestamp",
  //   numeric: 'fecha',
  //   select: null,
  //   isRequired: false,
  //   isDisabled: true,
  //   ocultar: true,
  //   label: "Fecha/Hora",
  //   align: "Left",
  // },
];

// ==============================|| TABLE HEADER ||============================== //

function EnhancedTableHead({
  onSelectAllClick,
  order,
  orderBy,
  numSelected,
  rowCount,
  onRequestSort,
  theme,
  selected,
}) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  //manejo excepciones de cabecera del listado
  const excludedColumns = ["id","terminal_id","carga_id","paisregion_id"];;

  return (
    <TableHead>
      <TableRow>
        {numSelected <= 0 &&
          headCells
            .filter((headCell) => !excludedColumns.includes(headCell.id)) // Excluimos las columnas no deseadas
            .map((headCell) => (
              <TableCell
                key={headCell.id}
                align={headCell.align}
                padding={headCell.disablePadding ? "none" : "normal"}
                sortDirection={orderBy === headCell.id ? order : false}
              >
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : "asc"}
                  onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                  {orderBy === headCell?.id ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            ))}
        {numSelected <= 0 && (
          <TableCell sortDirection={false} align="center" sx={{ pr: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{
                color: theme.palette.mode === "dark" ? "grey.600" : "grey.900",
              }}
            >
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
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

// ==============================|| TABLE HEADER TOOLBAR ||============================== //

const EnhancedTableToolbar = ({ numSelected }) => (
  <Toolbar
    sx={{
      p: 0,
      pl: 1,
      pr: 1,
      ...(numSelected > 0 && {
        color: (theme) => theme.palette.secondary.main,
      }),
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
  numSelected: PropTypes.number.isRequired,
};

// ==============================|| LIST ||============================== //

const ProductList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const TableName = "Tarifas Mexico";

  //Gestion de permisos
  const permisos = useAccessTokenJWT();
  const permiTotal = [
    "presupuesto:all",
    "presupuesto:create",
    "presupuesto:edit",
  ]; //declaro los permisos que necesita para acceder a este componente
  const permiIngreso = ["CEO", "Gerencia", "Lider"];
  const permiCreate = ["CEO", "Gerencia", "Lider"];
  const permiEdicion = ["CEO", "Gerencia"];
  const permiDelele = ["CEO"];

  const ingresoAutorizado = permiIngreso.some((permiso) =>
    permisos.includes(permiso)
  ); //recorro el array de permisos necesarios y los que me devuelve auth0 del user
  const AddOK = permiCreate.some((permiso) => permisos.includes(permiso));
  const EditOK = permiEdicion.some((permiso) => permisos.includes(permiso));
  const DeleleOK = permiDelele.every((permiso) => permisos.includes(permiso));

  if (!ingresoAutorizado) {
    navigate("/NoAutorizado");
  }

  // show a right sidebar when clicked on new product
  const [open, setOpen] = React.useState(false);
  const [openUpdate, setOpenUpdate] = React.useState(false);

  const handleClickOpenDialog = () => {
    setOpen(true);
  };
  const handleCloseDialog = () => {
    setOpen(false);
    SetActualizacion(true);
  };
  const handleCloseDialogUpdate = () => {
    setOpenUpdate(false);
    SetActualizacion(true);
  };

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [search, setSearch] = React.useState("");
  const [selectedRow, setSelectedRow] = React.useState(null); // lo que seleccionamos para editar
  const [row, setRow] = React.useState(); //estoy almacenando la data fwette

  // logica para que actuallizar / renderizar el componente a la hora de eliminar
  const [actualizacion, SetActualizacion] = React.useState(false);
  React.useEffect(() => {
    fetchData();
    SetActualizacion(false);
    //console.log(rows);
  }, [actualizacion]);

  // traigo data de fwette Y LO ALMACENO EN EL STATE DE setRows

  const fetchData = async (accessToken) => {
    try {
      //traigo 2 parametros del helper, uno es la data y el otro es el response crudo de la api para manejar los redirect
      const jsonData = await TarifonMexHelper.fetchData();
      // const jsonData = await BancoHelper.fetchData(accessToken);

      // console.log(jsonData);
      //console.log(jsonDataStatus.status);
      setRow(jsonData);
      // console.log(accessToken);
      // console.log('Data del json: ', jsonData)
      //setRows(jsonData);
    } catch (error) {
      console.log(error);
      navigate("/pages/error");
    }
  };

  //IDENTIFICA LOS ATRIBUTOS DEL OBJETO PARA LISTAR EN LA TABLA
  /*const exclude = ["id","terminal_id","carga_id","paisregion_id"];
  const attributes = Array.from(
    new Set(
      rows.flatMap((row) =>
        Object.keys(row).filter((attr) => !exclude.includes(attr))
      )
    )
  );*/

  // AQUI ELEMINO ELEMENTOS
  const handleDelete = async (id) => {
    // Aquí debes implementar la lógica para eliminar los productos seleccionados
    await TarifasTerminalHelper.deleteDataById(id);
    // para actualizar el componente
    SetActualizacion(true);
    console.log(`Tarifa TERMINAL con ID ${id} se ha sido eliminada`);
  };

  const handleCreateAPI = async (newData) => {
    
    if(newData.id==undefined)
    {
      newData.id=0;
    }
    if(newData.description==undefined)
    {
      newData.description="Sin notas";
    }
    if(newData.notas==undefined)
    {
      newData.notas="Sin notas";
    }
    if(newData.htimestamp==undefined)
    {
      newData.htimestamp= UtilidadesHelper.fechaParaDB();
    }
    if(newData.flete_interno_2p20ft_cdmx==undefined)
    {
      newData.flete_interno_2p20ft_cdmx=0.0;
    }
    if(newData.flete_interno_2p40sthq_cdmx==undefined)
    {
      newData.flete_interno_2p40sthq_cdmx=0.0;
    }
    if(newData.flete_interno_1p40sthq_cdmx==undefined)
    {
      newData.flete_interno_1p40sthq_cdmx=0.0; 
    }
    if(newData.flete_interno_1p20ft_cdmx==undefined)
    {
      newData.flete_interno_1p20ft_cdmx=0.0; 
    }
    if(newData.descarga_meli_20ft_cdmx==undefined)
    {
      newData.descarga_meli_20ft_cdmx=0.0;
    }
    if(newData.descarga_meli_40sthq_cdmx==undefined)
    {
      newData.descarga_meli_40sthq_cdmx=0.0;
    }

    await TarifonMexHelper.createData(newData);
  };

  // Función para actualizar la API utilizando
  const handleUpdateAPI = async (id, data) => {
    await TarifasTerminalHelper.updateDataById(id, data);
  };

  // uso metodo Update (que trabaja en el componente hijo)
  const handleEdit = async (row) => {
    setSelectedRow(row);
    setOpenUpdate(true);
  };

  // almacena data para los SELECT de paisRegion, Poliza, terminales y carga
  const [paisRegion, setPaisRegion] = React.useState([]);
  const [Carga, setCarga] = React.useState([]);
  const [Poliza, setPoliza] = React.useState([]);
  const [Terminales, setTerminales] = React.useState([]);
  React.useEffect(() => {
    //consulta tabla pais para enviar al componente
    const fetchDataPais = async () => {
      try {
        const dataPais = await PaisRegionHelper.fetchData();
        setPaisRegion(dataPais);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchDataPais();

    const FetchDataTerminales = async () => {
      try {
        const dataTerminal = await TerminalHelper.fetchData();
        setTerminales(dataTerminal);
      } catch (error) {
        console.log("Error en traer data terminal: ", error);
      }
    };
    FetchDataTerminales();

    const FetchDataCarga = async () => {
      try {
        const dataCarga = await CargaHelper.fetchData();
        setCarga(dataCarga);
        console.log(Carga);
      } catch (error) {
        console.log("Error en traer data terminal: ", error);
      }
    };
    FetchDataCarga();

    const FetchDataPoliza = async () => {
      try {
        const dataCarga = await PolizaHelper.fetchData();
        setPoliza(dataCarga);
        console.log(Carga);
      } catch (error) {
        console.log("Error en traer data terminal: ", error);
      }
    };
    FetchDataPoliza();
  }, []);

  /*const handleSearch = (event) => {
    const newString = event?.target.value;
    setSearch(newString || "");

    //cuando se vacia el search renderiza nuevamente gracias al setActualizacion
    if (event.target.value == "") {
      SetActualizacion(true);
    }

    if (newString) {
      const newRows = rows.filter((row) => {
        let matches = true;

        // las propiedades que debe listar/buscar, deben de ser igual al modelo
        const properties = [
          "id",
          "description",
          "contype",
          "gastoFijo",
          "gastoVariable",
          "gasto_otro1",
          "gasto_otro2",
          "htimestamp",
        ];

        let containsQuery = false;

        properties.forEach((property) => {
          //console.log(newString)
          if (
            row[property]
              ?.toString()
              .toLowerCase()
              .includes(newString.toString().toLowerCase())
          ) {
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
  };*/

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  /*const handleSelectAllClick = (event) => {
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
  };*/

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event?.target.value, 10));
    setPage(0);
  };

  /*const isSelected = (name) => selected.indexOf(name) !== -1;
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    //estado inicial de pais a filtrar
    const [paisSelect,setPaisSelect]=React.useState({
      "id": 5,
      "description": "MEXICO",
      "region": "CDMX",
      "moneda": "MDX",
      "puerto": "DF"
  }); */



  const useStyles = makeStyles({
    tableCell: {
      borderRight: "1px solid rgba(224, 224, 224, 1)",  // Color y grosor del borde 
      //whiteSpace: 'nowrap',
    },
    lastCell: {
      borderRight: "none"
    },
  });

  const classes = useStyles();



  return (
    <>
      {
        <MainCard title={`Maestro ${TableName} - [USD]`}content={false}>
          <CardContent>
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              {/* BOTON DE SEARCH */}
              <Grid item xs={12} sm={6}>
                <TextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  //onChange={handleSearch}
                  placeholder={`Buscar en ${TableName}`}
                  value={search}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6} sx={{ textAlign: "right" }}>
                {/* add & dialog */}
                {AddOK && (
                  <>
                    <Tooltip title="Add item">
                      <Fab
                        color="primary"
                        size="small"
                        onClick={handleClickOpenDialog}
                        sx={{
                          boxShadow: "none",
                          ml: 1,
                          width: 32,
                          height: 32,
                          minHeight: 32,
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </Fab>
                    </Tooltip>
                    <AddTarifario
                      dataRow={row}
                      open={open}
                      handleCloseDialog={handleCloseDialog}
                      handleCreateAPI={handleCreateAPI}
                      TableName={TableName}
                      headCells={headCells}
                      dataSelectPais={paisRegion}
                      dataTerminales={Terminales}
                      dataCarga={Carga}
                      dataPoliza={Poliza}
                    />
                  </>
                )}
              </Grid>
            </Grid>
            <Typography>
                <br/>
            </Typography>

            {/* SELECT REGION */}
            {/* <Box sx={{ minWidth: 120} }>
                    <FormControl style={{minWidth: 202, maxWidth:202}}>
                        <InputLabel id="demo-simple-select-label">Pais - Region</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                value={paisSelect}
                                label="PAIS - Region"
                              onChange={handlePaisRegionChange}>

                          <MenuItem disabled value="">
                                <em>Seleccione un Pais / Region</em>
                          </MenuItem>
                                {
                                    paisRegion && paisRegion.length > 0
                                    ? paisRegion.map((item) =>
                                    <MenuItem key={item.id} value={item}>{item.description + " - "+item.region}</MenuItem>)
                                    : <MenuItem value="">Sin datos</MenuItem>
                                }
                          </Select>
                    </FormControl>
                  </Box> */}

          </CardContent>

          {/* table */}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      {/*VISTA ABREVIADA*/}
                      
                        <>
                          <TableCell align="center"
                            sx={{ minWidth: 120, backgroundColor: '#2196f3' }}
                          className={classes.tableCell}>
                            Fecha
                          </TableCell>
                          <TableCell align="center" sx={{ minWidth:80,/*whiteSpace: 'nowrap',*/  backgroundColor: '#2196f3' }} className={classes.tableCell}>
                            Flete 4HQ/STD
                          </TableCell>
                          <TableCell align="center" sx={{ minWidth:80,/*whiteSpace: 'nowrap',*/ backgroundColor: '#2196f3' }} className={classes.tableCell}>
                            Flete 20FT
                          </TableCell>
                          <TableCell align="center" sx={{ minWidth:130,/*whiteSpace: 'nowrap',*/ backgroundColor: '#2196f3' }} className={classes.tableCell}>
                            Seguro Var. (segun FOB)
                          </TableCell>
                          <TableCell align="center" sx={{ minWidth:130,/*whiteSpace: 'nowrap',*/ backgroundColor: '#2196f3' }} className={classes.tableCell}>
                            Gastos Locales FWD 40HQ/STD
                          </TableCell>
                          <TableCell align="center" sx={{ minWidth:130,/*whiteSpace: 'nowrap',*/ backgroundColor: '#2196f3' }} className={classes.tableCell}>
                            Gastos Locales FWD 20FT
                          </TableCell>
                          <TableCell align="center" sx={{ minwidth:130,/*whiteSpace: 'nowrap',*/ backgroundColor: '#2196f3' }} className={classes.tableCell}>
                            Terminal 40HQ/STD
                          </TableCell>
                          <TableCell align="center" sx={{ minWidth:110,/*whiteSpace: 'nowrap',*/ backgroundColor: '#2196f3' }} className={classes.tableCell}>
                            Terminal 20FT
                          </TableCell>
                          <TableCell align="center" sx={{ minWidth:130,/*whiteSpace: 'nowrap',*/ backgroundColor: '#2196f3' }} className={classes.tableCell}>
                            Flete Interno 1*40HQ/STD GUAD
                          </TableCell>
                          <TableCell align="center" sx={{ minWidth:130,/*whiteSpace: 'nowrap',*/ backgroundColor: '#2196f3' }} className={classes.tableCell}>
                            Flete Interno 1*20FT GUAD
                          </TableCell>
                          <TableCell align="center" sx={{ minWidth:130,/*whiteSpace: 'nowrap',*/ backgroundColor: '#2196f3' }} className={classes.tableCell}>
                            Flete Interno 2*40HQ/STD GUAD
                          </TableCell>
                          <TableCell align="center" sx={{ minWidth:130,/*whiteSpace: 'nowrap',*/ backgroundColor: '#2196f3' }} className={classes.tableCell}>
                            Flete Interno 2*20FT GUAD
                          </TableCell>
                          <TableCell align="center" sx={{ minWidth:130,/*whiteSpace: 'nowrap',*/ backgroundColor: '#2196f3' }} className={classes.tableCell}>
                            Flete Interno 2*40HQ/STD CDMX
                          </TableCell>
                          <TableCell align="center" sx={{ minWidth:130,/*whiteSpace: 'nowrap',*/ backgroundColor: '#2196f3' }} className={classes.tableCell}>
                            Flete Interno 2*20FT/STD CDMX
                          </TableCell>
                          <TableCell align="center" sx={{ minWidth:130,/*whiteSpace: 'nowrap',*/ backgroundColor: '#2196f3' }} className={classes.tableCell}>
                            Descarga MELI GUAD 40HQ/STD
                          </TableCell><TableCell align="right" sx={{ minWidth:130,/*whiteSpace: 'nowrap',*/ backgroundColor: '#2196f3' }} className={classes.tableCell}>
                            Descarga MELI GUAD 20FT
                          </TableCell>
                          <TableCell align="center" sx={{ minWidth:120,/*whiteSpace: 'nowrap',*/ backgroundColor: '#2196f3' }} className={classes.tableCell}>
                            Despachante Cargo Fijo por Oper. 
                          </TableCell>
                          <TableCell align="center" sx={{ mindWidth:130, /*whiteSpace: 'nowrap',*/ backgroundColor: '#2196f3' }} className={classes.tableCell}>
                            Despachante Variable Segun CIF
                          </TableCell>
                          <TableCell align="center" sx={{ minWidth:130, /*whiteSpace: 'nowrap',*/ backgroundColor: '#2196f3' }} className={classes.tableCell}>
                            Clasificacion por Oper.
                          </TableCell>
                          <TableCell align="center" sx={{ minWidth:130, /*whiteSpace: 'nowrap',*/ backgroundColor: '#2196f3' }} className={classes.tableCell}>
                            Consultoria Compliance por Oper.
                          </TableCell>                          
                        </>

                      <TableCell align="right" sx={{ pr: 3 }} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row==undefined? (
                      <TableRow>
                        <TableCell>Cargando...</TableCell>
                      </TableRow>
                    ) : (
                        <TableRow
                          //key={index}
                          hover
                          role="checkbox"
                          sx={{
                            fontSize: 20,
                            "&:hover": {
                              fontStyle: "italic",
                            },
                          }}
                          className={classes.tableCell}
                        >
                          <TableCell sx={{ pl: 3, maxWidth: 350 }} className={classes.tableCell}>
                            <Typography align="left" variant="subtitle1">
                            {row.htimestamp
                                  ? UtilidadesHelper.formatFecha(
                                    row.htimestamp
                                                                )
                                  : "Sin data"}
                              {/* {row.description} */}
                              {/* {console.log(row)} */}
                            </Typography>
                          </TableCell>
                          {/* DATOS DE LA VISTA ABREVIADA */}
                          {
                            <>
                              
                              <TableCell align="right" className={classes.tableCell}>
                                {row.flete_internacional_40sthq.toFixed(2)}
                              </TableCell>
                              <TableCell align="right" className={classes.tableCell}>
                                {row.flete_internacional_20ft.toFixed(2)}
                              </TableCell>
                              <TableCell align="right" className={classes.tableCell}>
                                {row.seguro.toFixed(2)}
                              </TableCell>
                              <TableCell align="right" className={classes.tableCell}>
                                {row.gastosLocales_40sthq.toFixed(2)}
                              </TableCell>
                              <TableCell align="right" className={classes.tableCell}>
                                {row.gastosLocales_20ft.toFixed(2)}
                              </TableCell>
                              <TableCell align="right" className={classes.tableCell}>
                                {row.terminal_40sthq.toFixed(2)}
                              </TableCell>
                              <TableCell align="right" className={classes.tableCell}>
                                {row.terminal_20ft.toFixed(2)}
                              </TableCell>
                              <TableCell align="right" className={classes.tableCell}>
                                {row.flete_interno_1p40sthq_guad.toFixed(2)}
                              </TableCell>
                              <TableCell align="right" className={classes.tableCell}>
                                {row.flete_interno_1p20ft_guad.toFixed(2)}
                              </TableCell>
                              <TableCell align="right" className={classes.tableCell}>
                                {row.flete_interno_2p40sthq_guad.toFixed(2)}
                              </TableCell>
                              <TableCell align="right" className={classes.tableCell}>
                                {row.flete_interno_2p20ft_guad.toFixed(2)}
                              </TableCell>
                              <TableCell align="right" className={classes.tableCell}>
                                {row.flete_interno_2p40sthq_cdmx.toFixed(2)}
                              </TableCell>
                              <TableCell align="right" className={classes.tableCell}>
                                {row.flete_interno_2p20ft_cdmx.toFixed(2)}
                              </TableCell>
                              <TableCell align="right" className={classes.tableCell}>
                                {row.descarga_meli_40sthq_guad.toFixed(2)}
                              </TableCell>
                              <TableCell align="right" className={classes.tableCell}>
                                {row.descarga_meli_20ft_guad.toFixed(2)}
                              </TableCell>
                              <TableCell align="right" className={classes.tableCell}>
                                {row.despa_fijo.toFixed(2)}
                              </TableCell>
                              <TableCell align="right" className={classes.tableCell}>
                                {row.despa_var.toFixed(2)}
                              </TableCell>
                              <TableCell align="right" className={classes.tableCell}>
                                {row.despa_clasific_oper.toFixed(2)}
                              </TableCell>
                              <TableCell align="right" className={classes.tableCell}>
                                {row.despa_consult_compl.toFixed(2)}
                              </TableCell>
                            </>
}

                          {/* ICONO DE BORRADO por ahora innecesario */}
                          {/* <TableCell sx={{ pr: 3 }} align="right">
                                                        <IconButton
                                                            color="primary"
                                                            size="large"
                                                            aria-label="product delete"
                                                            onClick={() => deteleDetails(row.id)}
                                                        >
                                                            <DeleteTwoToneIcon />
                                                        </IconButton>
                                                    </TableCell> */}
                        </TableRow>

                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12}>
              <SubCard
                sx={{
                  mx: 3,
                  mb: 3,
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? theme.palette.dark.main
                      : theme.palette.primary.light,
                }}
              >
                
              </SubCard>
            </Grid>
          </Grid>

          
        </MainCard>
      }
    </>
  );
};

export default ProductList;
