// LISTED 13/7/2023 16:18
import PropTypes from "prop-types";
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

//importamos el useNavigate para manejar navegaciones y redireccciones
import { redirect, useNavigate } from "react-router-dom";

// assets
import EditIcon from "@mui/icons-material/Edit"; // SE IMPORTA ICONO DE EDIT
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/AddTwoTone";

//importacion del helper fwette
import CompUpdate from "../../CompUpdate";
import AddItem from "../../AddItem";
import { useAccessTokenJWT } from "helpers/useAccessTokenJWT";
import { FwdtteHelper } from "helpers/FwdtteHelper";
import { PolizaHelper } from "helpers/PolizaHelper";
import { CargaHelper } from "helpers/CargaHelper";
import { TerminalHelper } from "helpers/TerminalHelper";
import { PaisRegionHelper } from "helpers/PaisRegionHelper";
import { FleteHelper } from "helpers/FleteHelper";
import { TruckSemiHelper } from "helpers/TruckHelper";
import { TarifasBancosHelper } from "helpers/TarifasBancosHelper";
import { BancoHelper } from "helpers/BancoHelper";
import { GestDigitalDocHelper } from "helpers/GestDigitalDocHelper";

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

// table header options/ATRIBUTOS DEL MODELO IIBB
const headCells = [
  {
    id: "id",
    numeric: true,
    isRequired: false,
    select: null,
    isDisabled: false,
    ocultar: false,
    label: "Id",
    align: "Left",
  },
  /*{
    id: "description",
    numeric: false,
    isRequired: true,
    select: null,
    isDisabled: false,
    ocultar: false,
    label: "Descripcion",
    align: "Left",
  },*/
  {
    id: "description",
    numeric: false,
    isRequired: true,
    select: "Banco",
    isDisabled: false,
    ocultar: false,
    label: "Nombre Cotizacion",
    align: "Left",
  },
  {
    id: "paisregion_id",
    numeric: false,
    select: "paisRegion",
    isRequired: true,
    isDisabled: false,
    ocultar: false,
    label: "Pais/Region",
    align: "Left",
  },
  {
    id: "costo",
    numeric: true,
    isRequired: true,
    select: null,
    isDisabled: false,
    ocultar: false,
    label: "Costo",
    align: "Left",
  },
  {
    id: "factor1",
    numeric: true,
    isRequired: true,
    select: null,
    isDisabled: false,
    ocultar: false,
    label: "Factor",
    align: "Left",
  },
  {
    id: "gasto_otro1",
    numeric: true,
    isRequired: false,
    select: null,
    isDisabled: false,
    ocultar: false,
    label: "Otros Gastos",
    align: "Left",
  },
  {
    id: "notas",
    numeric: false,
    isRequired: false,
    select: null,
    isDisabled: false,
    ocultar: false,
    label: "Notas",
    align: "Left",
  },
  {
    id: "htimestamp",
    numeric: "fecha",
    select: null,
    isRequired: false,
    isDisabled: true,
    ocultar: false,
    label: "Fecha/hora",
    align: "Left",
  },
  {
    id: "banco",
    numeric: false,
    isRequired: true,
    select: "Banco",
    isDisabled: false,
    ocultar: false,
    label: "Banco",
    align: "Left",
  },
  {
    id: "pais_vista",
    numeric: false,
    isRequired: false,
    select: null,
    isDisabled: false,
    ocultar: false,
    label: "Pais",
    align: "Left",
  },
  {
    id: "region_vista",
    numeric: false,
    select: null,
    isRequired: false,
    isDisabled: false,
    ocultar: false,
    label: "Region",
    align: "Left",
  },
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
  const excludedColumns = ["id", "paisregion_id"];

  return (
    <TableHead>
      <TableRow>
        {numSelected > 0 && (
          <TableCell padding="none" colSpan={7}>
            <EnhancedTableToolbar numSelected={selected.length} />
          </TableCell>
        )}
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
          <>
            <TableCell sortDirection={false} align="center" sx={{ pr: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  color:
                    theme.palette.mode === "dark" ? "grey.600" : "grey.900",
                }}
              >
                Action
              </Typography>
            </TableCell>
          </>
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
  const TableName = "Banco";

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
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [search, setSearch] = React.useState("");
  const [selectedRow, setSelectedRow] = React.useState(null); // lo que seleccionamos para editar
  const [rows, setRows] = React.useState([]); //estoy almacenando la data

  // logica para que actuallizar / renderizar el componente a la hora de eliminar
  const [actualizacion, SetActualizacion] = React.useState(false);
  React.useEffect(() => {
    fetchData();
    SetActualizacion(false);
  }, [actualizacion]);

  const fetchData = async (accessToken) => {
    try {
      const jsonData = await TarifasBancosHelper.fetchDataPais();

      setRows(jsonData);
    } catch (error) {
      console.log("ShippingIndex.fetchData::erro: ".error);
      navigate("/pages/error");
    }
  };
  //IDENTIFICA LOS ATRIBUTOS DEL OBJETO PARA LISTAR EN LA TABLA
  const exclude = ["id", "banco_id", "paisregion_id"];
  const attributes = Array.from(
    new Set(
      rows.flatMap((row) =>
        Object.keys(row).filter((attr) => !exclude.includes(attr))
      )
    )
  );

  // AQUI ELEMINO ELEMENTOS
  const handleDelete = async (id) => {
    // Aquí debes implementar la lógica para eliminar los productos seleccionados
    await TarifasBancosHelper.deleteDataById(id);
    // para actualizar el componente
    SetActualizacion(true);
    console.log(`Transporte local ${id} ha sido eliminada`);
  };

  const handleCreateAPI = async (newData) => {
    await TarifasBancosHelper.createData(newData);
  };
  // Función para actualizar la API utilizando
  const handleUpdateAPI = async (id, data) => {
    await TarifasBancosHelper.updateDataById(id, data);
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
  const [Fwd, setFwd] = React.useState([]);
  const [Flete, setFlete] = React.useState([]);
  const [Truck, setTruck] = React.useState([]);
  const [Banco, setBanco] = React.useState([]);
  const [GestDig, setGestDig] = React.useState([]);
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
      } catch (error) {
        console.log("Error en traer data Carga: ", error);
      }
    };
    FetchDataCarga();

    const FetchDataPoliza = async () => {
      try {
        const dataPoliza = await PolizaHelper.fetchData();
        setPoliza(dataPoliza);
      } catch (error) {
        console.log("Error en traer data Poliza: ", error);
      }
    };
    FetchDataPoliza();

    const FetchDataFwd = async () => {
      try {
        const dataFwdtte = await FwdtteHelper.fetchData();
        setFwd(dataFwdtte);
      } catch (error) {
        console.log("Error en traer data Fwdtte: ", error);
      }
    };
    FetchDataFwd();

    const FetchDataFlete = async () => {
      try {
        const dataFlete = await FleteHelper.fetchData();
        setFlete(dataFlete);
      } catch (error) {
        console.log("Error en traer data Flete: ", error);
      }
    };
    FetchDataFlete();

    const FetchDataTruck = async () => {
      try {
        const dataTruck = await TruckSemiHelper.fetchData();
        setTruck(dataTruck);
      } catch (error) {
        console.log("Error en traer data Truck: ", error);
      }
    };
    FetchDataTruck();

    const FetchDataBanco = async () => {
      try {
        const dataBanco = await BancoHelper.fetchData();
        setBanco(dataBanco);
      } catch (error) {
        console.log("Error en traer data Banco: ", error);
      }
    };
    FetchDataBanco();

    const FetchDataGestDig = async () => {
      try {
        const dataGestDig = await GestDigitalDocHelper.fetchData();
        setGestDig(dataGestDig);
      } catch (error) {
        console.log("Error en traer data GestDig: ", error);
      }
    };
    FetchDataGestDig();
  }, []);

  const handleSearch = (event) => {
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
          "paisregion_id",
          "demora",
          "costo",
          "factor1",
          "gasto_otro1",
          "notas",
          "banco_id",
          "pais",
          "region",
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
      // console.log(newRows);
      setRows(newRows);
    } else {
      setRows(rows);
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event?.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <>
      {
        <MainCard title={`Tarifas ${TableName}`} content={false}>
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
                  onChange={handleSearch}
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
                    <AddItem
                      open={open}
                      handleCloseDialog={handleCloseDialog}
                      handleCreateAPI={handleCreateAPI}
                      TableName={TableName}
                      headCells={headCells}
                      dataSelectPais={paisRegion}
                      dataTerminales={Terminales}
                      dataCarga={Carga}
                      dataPoliza={Poliza}
                      dataFwd={Fwd}
                      dataFlete={Flete}
                      dataTruck={Truck}
                      dataBanco={Banco}
                      dataGestDig={GestDig}
                    />
                  </>
                )}
              </Grid>
            </Grid>
          </CardContent>

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
                    if (typeof row === "number") return null;
                    const isItemSelected = isSelected(row.description);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={index}
                        selected={isItemSelected}
                      >
                        {attributes.map((attribute) => (
                          <TableCell
                            align="left"
                            component="th"
                            id={labelId}
                            scope="row"
                            sx={{
                              fontSize: 20,
                              "&:hover": {
                                fontStyle: "italic",
                              },
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{
                                color:
                                  theme.palette.mode === "dark"
                                    ? "grey.600"
                                    : "grey.900",
                              }}
                            >
                              {attribute === "htimestamp"
                                ? new Date(row[attribute]).toLocaleDateString()
                                : row[attribute]}
                            </Typography>
                          </TableCell>
                        ))}

                        <TableCell align="right">
                          {EditOK ? (
                            <>
                              {DeleleOK && (
                                <Tooltip title="Delete">
                                  <IconButton size="large">
                                    <DeleteIcon
                                      fontSize="small"
                                      onClick={() => handleDelete(row.id)}
                                    />
                                  </IconButton>
                                </Tooltip>
                              )}

                              <Tooltip title="Edit item">
                                <IconButton
                                  size="large"
                                  onClick={() => handleEdit(row)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                            </>
                          ) : (
                            "Sin permisos"
                          )}
                        </TableCell>

                        <CompUpdate
                          open={openUpdate}
                          dataRow={selectedRow}
                          handleUpdateAPI={handleUpdateAPI}
                          handleCloseDialog={handleCloseDialogUpdate}
                          TableName={TableName}
                          dataSelectPais={paisRegion}
                          dataSelectTerminal={Terminales}
                          dataSelectCarga={Carga} 
                          dataSelectPoliza={Poliza}
                          dataSelectFwd={Fwd}
                          dataSelectFlete={Flete}
                          dataSelectTruck={Truck}
                          dataSelectBanco={Banco}
                          selectPais={true}
                          selectCarga={false}
                          selectTerminal={false}
                          selectPoliza={false}
                          selectFwd={false}
                          selectPaisFwd={false}
                          selectFlete={false}
                          selectTruck={false}
                          selectBanco={true}
                        />
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
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
      }
    </>
  );
};
export default ProductList;
