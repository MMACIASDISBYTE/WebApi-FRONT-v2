import PropTypes from "prop-types";
import * as React from "react";
import { Navigate, useNavigate } from "react-router-dom";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  CardContent,
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
import Avatar from "@mui/material/Avatar";
import useAuth from "hooks/useAuth";

// project imports
import MainCard from "ui-component/cards/MainCard";
import { useDispatch, useSelector } from "store";
// import customer, { getCustomers, getCustomersInbound } from "store/slices/customer";
import { getInbound } from "store/slices/InboundFetch";

// assets
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import AnimateButton from "ui-component/extended/AnimateButton";
import { useAccessTokenJWT } from "helpers/useAccessTokenJWT";
import { StatusComp } from "../../../../Components/StatusComp";
import { UtilidadesHelper } from "helpers/UtilidadesHelper";
import { SelectCarga } from "../../../../Components/Formularios/Selects/SelectCarga";
import { SelectEstado } from "../../../../Components/Formularios/Selects/SelectEstado";
import { SelectOwner } from "../../../../Components/Formularios/Selects/SelectOwner";
import { PresupuestoHelper } from "helpers/PresupuestoHelper";
import { useCommonStyles } from "helpers/CommonStyles";
import { StatusEstadosEmbarque } from "helpers/VariablesDeRepeticion";
import AguardandoInfo from "views/Components/AguardandoInfo";

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
  order === "asc"
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

// table header options
const headCells = [
  // {
  //     id: 'id',
  //     numeric: true,
  //     label: 'ID',
  //     align: 'center'
  // },
  {
    id: "id",
    numeric: true,
    label: "#",
    align: "left",
  },
  {
    id: "description",
    numeric: false,
    label: "Descripcion",
    align: "center",
  },
  {
    id: "paisregion_id",
    numeric: false,
    label: "Region",
    align: "center",
  },
  {
    id: "carga_id",
    numeric: true,
    label: "Carga",
    align: "center",
  },
  {
    id: "status",
    numeric: false,
    label: "Estado",
    align: "center",
  },
  {
    id: "embarque",
    numeric: false,
    label: "OC/Embarque",
    align: "center",
  },
  {
    id: "bl",
    numeric: false,
    label: "Bl",
    align: "center",
  },
  {
    id: "cantidad_contenedores",
    numeric: true,
    label: "Contenedores",
    align: "center",
  },
  // {
  //   id: "gastos_loc_total",
  //   numeric: true,
  //   label: "Gasto Local Total[USD]",
  //   align: "left",
  // },
  {
    id: "fob_grand_total",
    numeric: true,
    label: "Fob Total[USD]",
    align: "center",
  },
  {
    id: "own",
    numeric: true,
    label: "Creador",
    align: "center",
  },
  {
    id: "htimestamp",
    numeric: true,
    label: "Fecha",
    align: "center",
  },
];

// ==============================|| TABLE HEADER ||============================== //
//
function EnhancedTableHead({
  onSelectAllClick,
  order,
  orderBy,
  numSelected,
  rowCount,
  onRequestSort,
  selected,
}) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const classes = useCommonStyles();

  return (
    <TableHead>
      <TableRow>
        {numSelected > 0 && (
          <TableCell padding="none" colSpan={6} className={classes.tableCellCabecera3}>
            <EnhancedTableToolbar numSelected={selected.length} />
          </TableCell>
        )}
        {numSelected <= 0 &&
          headCells.map((headCell) => (
            <Tooltip title={headCell.label}>
              <TableCell
                key={headCell.id}
                align={headCell.align}
                padding={headCell.disablePadding ? "none" : "normal"}
                sortDirection={orderBy === headCell.id ? order : false}
                className={classes.tableCellCabecera3}
              >
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : "asc"}
                  onClick={createSortHandler(headCell.id)}
                >
                  {headCell.label}
                  {orderBy === headCell.id ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            </Tooltip>
          ))}
        {numSelected <= 0 && (
          <TableCell
            sortDirection={false}
            align="center"
            sx={{ pr: 3 }}
            className={classes.tableCellCabecera3}
          >
            Action
          </TableCell>
        )}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
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

// ==============================|| CUSTOMER LIST ||============================== //

const CustomerList = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // PERMISOS
  //Gestion de permisos
  const permisos = useAccessTokenJWT();
  // console.log(permisos);
  const permiTotal = [
    "presupuesto:all",
    "presupuesto:create",
    "presupuesto:edit",
  ]; //declaro los permisos que necesita para acceder a este componente
  const permiIngreso = [
    "CEO",
    "Gerencia",
    "Lider",
    "Comex",
    "Finanzas",
    "Sourcing",
  ];
  const permiCreate = ["CEO", "Sourcing", "Comex"];
  const permiEdicion = ["CEO", "Gerencia", "Comex", "Finanzas", "Sourcing"];
  const permiDelele = ["CEO"];
  const permiRetroceder = ["CEO"];

  const ingresoAutorizado = permiIngreso.some((permiso) =>
    permisos.includes(permiso)
  ); //recorro el array de permisos necesarios y los que me devuelve auth0 del user
  const AddOK = permiCreate.some((permiso) => permisos.includes(permiso));
  const EditOK = permiEdicion.some((permiso) => permisos.includes(permiso));
  const DeleleOK = permiDelele.every((permiso) => permisos.includes(permiso));
  const RetroEstadoOK = permiRetroceder.every((permiso) =>
    permisos.includes(permiso)
  );

  if (!ingresoAutorizado) {
    //rebote si no tiene autorizacion
    Navigate("/NoAutorizado");
  }

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [rows, setRows] = React.useState([]);
  // const { customers } = useSelector((state) => state.customer);
  const { inbound } = useSelector((state) => state.inbound); // Asegúrate de que este selector coincida con la estructura de tu estado global
  const [ultVerMostrar, setUltVerMostrar] = React.useState(true);
  const [seleccionPais, setSeleccionPais] = React.useState(5); //se da el pais de origen
  const [seleccionCarga, setSeleccionCarga] = React.useState(null); //se da carga
  const [seleccionEstado, setSeleccionEstado] = React.useState(null); //se da Estado
  const [seleccionOwner, setSeleccionOwner] = React.useState(null);
  const [ownersList, setOwnersList] = React.useState([{}]); //se da Owner
  const [infoOk, setInfoOk] = React.useState(false); //si esta todo okey muestra la data y quita el componente de carga

  const owners = async () => {
    const ownersListTmp = await PresupuestoHelper.fetchOwnersList();
    setOwnersList(ownersListTmp);
  };

  const [estados, setEstados] = React.useState([]);

  const dataEstado =  () =>{

      const misEstados = StatusEstadosEmbarque;

      setEstados(misEstados);
  }
  
  // React.useEffect(() => {
  //   // setEstados(StatusEstadosEmbarque)
  // }, [StatusEstadosEmbarque])

  React.useEffect(() => {
    owners();
    dataEstado();
  }, []);

  React.useEffect(() => {
    dispatch(getInbound()); // llama a la lista de inboun de comex
  }, [dispatch]);

  React.useEffect(() => {
    setRows(inbound);
  }, [inbound]);


  // Función para filtrar presupuestos
  const filtrarPresupuestos = () => {
    let presupuestosFiltrados = [...inbound];

    // Si hay un país seleccionado, filtrar por país
    if (seleccionPais !== null && seleccionPais !== 15) {
      presupuestosFiltrados = presupuestosFiltrados.filter(
        (presupuesto) => presupuesto.paisregion_id === seleccionPais
      );
    }

    // Si hay un carga seleccionado, filtrar por país
    if (seleccionCarga !== null && seleccionCarga !== undefined) {
      presupuestosFiltrados = presupuestosFiltrados.filter(
        (presupuesto) => presupuesto.carga_id === seleccionCarga
      );
    }
    // Si hay un carga seleccionado, filtrar por país
    // if (seleccionOwner !== null && seleccionOwner !== undefined) {
    //   presupuestosFiltrados = presupuestosFiltrados.filter(
    //     (presupuesto) => presupuesto.own === seleccionOwner.own
    //   );
    // }
    if (seleccionOwner !== null) {
      // Restaura el filtro y muestra todos en el callo que devuelva null el componente hijo
      presupuestosFiltrados = presupuestosFiltrados.filter(
        (presupuesto) => presupuesto.own === seleccionOwner.own
      );
    }
    // Si hay un carga seleccionado, filtrar por país
    if (seleccionEstado !== null && seleccionEstado !== undefined) {
      presupuestosFiltrados = presupuestosFiltrados.filter(
        (presupuesto) => presupuesto.status === seleccionEstado.id
      );
    }

    // Filtrar según la búsqueda
    if (search) {
      presupuestosFiltrados = presupuestosFiltrados.filter((row) => {
        const properties = [
          "estvers",
          "project",
          "description",
          "own",
          "htimestamp",
          "bl",
        ];
        return properties.some((property) => {
          return (
            row[property] &&
            row[property]
              .toString()
              .toLowerCase()
              .includes(search.toLowerCase())
          );
        });
      });
    }

    // Si ultVerMostrar es true, filtrar para mostrar solo la última versión de cada estnumber
    if (ultVerMostrar) {
      presupuestosFiltrados = presupuestosFiltrados.reduce(
        (acc, presupuesto) => {
          const { estnumber, estvers } = presupuesto;
          if (!acc[estnumber] || acc[estnumber].estvers < estvers) {
            acc[estnumber] = presupuesto;
          }
          return acc;
        },
        {}
      );
      presupuestosFiltrados = Object.values(presupuestosFiltrados);
    }

    setRows(presupuestosFiltrados);
    setPage(0);
    if(inbound.length > 0){
      setInfoOk(true);  //quita cartel de carga si llega la data
    }
  };

  // Efecto para actualizar los presupuestos mostrados cuando cambia customers, seleccionPais o ultVerMostrar
  React.useEffect(() => {
    filtrarPresupuestos();
  }, [
    inbound,
    seleccionPais,
    seleccionCarga,
    seleccionEstado,
    seleccionOwner,
    ultVerMostrar,
  ]);

  const handleChangePais = (pais) => {
    setSeleccionPais(pais.id);
  };

  const handleChangeCarga = (carga) => {
    // console.log(carga.id);
    setSeleccionCarga(carga.id);
  };

  const handleChangeOwner = (owner) => {
    // console.log(owner);
    setSeleccionOwner(owner);
  };

  const handleChangeEstado = (estado) => {
    setSeleccionEstado(estado);

  };

  const handleSearch = (event) => {
    const newString = event?.target.value || "";
    setSearch(newString);
    filtrarPresupuestos(); //lamado a la funcion de filtrado
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
        const newSelectedId = rows.map((n) => n.id);
        setSelected(newSelectedId);
      }
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
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

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const verDetalle = (estnumber, estvers) => {
    navigate(`/inboundMEX/details/${estnumber}/${estvers}`);
  };

  const ActualizarPresupuesto = (estnumber, estvers) => {
    navigate(`/inboundMEX/update-inboudMEX/${estnumber}/${estvers}`);
  };


  const classes = useCommonStyles();

  const { user } = useAuth();
  // console.log("owners", ownersList);


  return (
    <MainCard title="Inbound Mexico" content={false}>
      <CardContent>
        <Grid
          container
          // justifyContent="space-between"
          // alignItems="center"
          justifyContent="flex-start"
          alignItems="center"
          spacing={2}
        >
          {/* <SelectPais
            nameSelect = {'Pais'}
            datosSelect = {[]}
            handleChangePais={handleChangePais}
          /> */}

          <Grid
            item
            xs={12}
            sm
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            spacing={2}
          >
            {/* FILTRO DE BUSQUEDA ANULADO POR CRASHEO */}
            <Grid item xs={12} sm={2}>
              <TextField
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  style: { height: '53px' }
                }}
                onChange={handleSearch}
                placeholder="Buscar"
                value={search}
                size="small"
              />
            </Grid>

            <SelectCarga
              nameSelect={"Carga"}
              datosSelect={[]}
              handleChangeCarga={handleChangeCarga}
            />
            <SelectEstado
              nameSelect={"Estado"}
              datosSelect={[]}
              handleChangeEstado={handleChangeEstado}
              estados={estados}
            />
            <SelectOwner
              data={ownersList ? ownersList : ""}
              defaultSelection={ownersList?.filter(
                (value) => value.own === user.name
              )}
              handleChangeOwner={handleChangeOwner}
            />
          </Grid>

          {/* FILTRO DE ULTIMA VERSION, QUEDA POR DEFECTO EN TRUE */}
          {/* <Grid item xs={12} md={3}>
                  <Grid container spacing={1}>
                      <Grid item>
                          {/* <FormControlLabel onClick={mostrarUltimaVersion} control={<Checkbox defaultChecked />} label="Mostrar Ultima Version" /> 
                          <FormControlLabel onClick={mostrarUltimaVersion} control={<Checkbox />} label="Mostrar Ultima Version" />

                      </Grid>
                  </Grid>
          </Grid> */}

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {AddOK && (
              <AnimateButton>
                <Button
                  variant="contained"
                  onClick={() => navigate("/inboundMEX/CreateInboundMex")}
                >
                  Nuevo Inbound
                </Button>
              </AnimateButton>
            )}
          </div>

          {/* SE OCULTA ICONO DE IMPRESION, FILTRO Y COPIA */}
          {/* <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
                        <Tooltip title="Copy">
                            <IconButton size="large">
                                <FileCopyIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Print">
                            <IconButton size="large">
                                <PrintIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Filter">
                            <IconButton size="large">
                                <FilterListIcon />
                            </IconButton>
                        </Tooltip>
                    </Grid> */}
        </Grid>
      </CardContent>

      {/* table */}
      <TableContainer>

        { !infoOk ?
          
          <AguardandoInfo
            XS={12}
            MD={12}
            LG={12}
          /> : 

          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
          <EnhancedTableHead
            theme={theme}
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
            selected={selected}
          />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                /** Make sure no display bugs if row isn't an OrderData object */
                if (typeof row === "number") return null;
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;
                // console.log(orderBy);

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={index}
                    selected={isItemSelected}
                    sx={{
                      fontSize: 20,
                      "&:hover": {
                        fontStyle: "italic",
                      },
                    }}
                  >

                    <TableCell align="left" className={classes.tableCellBodyListaDetalle}>
                      {row.id !== null && row.id !== undefined
                        ? `N° ${row.estnumber}`
                        : "Sin data"}
                    </TableCell>

                    <Tooltip
                      title={
                        row.estvers !== null && row.description !== undefined
                          ? row.description
                          : "Sin data"
                      }
                    >
                      <TableCell align="left" className={classes.tableCellBodyListaDetalle}>
                        {row.estvers !== null && row.description !== undefined
                          ? row.description
                          : "Sin data"}
                      </TableCell>
                    </Tooltip>

                    <TableCell align="left" className={classes.tableCellBodyListaDetalle}>
                      {row.paisregion_id !== null &&
                      row.paisregion_id !== undefined
                        ? UtilidadesHelper.paisRegionSwitch(row.paisregion_id)
                        : "Sin data"}
                    </TableCell>

                    <TableCell align="center" className={classes.tableCellBodyListaDetalle}>
                      {row.estvers !== null && row.carga_id !== undefined ? (
                        <StatusComp
                          texto={""}
                          estadio={UtilidadesHelper.cargaSwitch(row.carga_id)}
                          colores={"orange"}
                        />
                      ) : (
                        "Sin data"
                      )}
                    </TableCell>

                    <TableCell align="center" className={classes.tableCellBodyListaDetalle}>
                      {row.estvers !== null && row.status !== undefined ? (
                        <StatusComp
                          texto={""}
                          estadio={estados.find((miEstado)=>miEstado.id===row?.status)?.description}
                          colores={"primary"}
                        />
                      ) : (
                        "Sin data"
                      )}
                    </TableCell>

                    <TableCell align="left" className={classes.tableCellBodyListaDetalle}>
                        {row.embarque
                          ? row.embarque
                          : "Sin Especificar"}
                      </TableCell>

                      <TableCell align="left" className={classes.tableCellBodyListaDetalle}>
                        {row.bl
                          ? row.bl
                          : "Sin Especificar"}
                      </TableCell>

                    <TableCell align="center" className={classes.tableCellBodyListaDetalle}>
                      {row.cantidad_contenedores !== null &&
                      row.cantidad_contenedores !== undefined
                        ? row.cantidad_contenedores.toFixed(3)
                        : "Sin data"}
                    </TableCell>
                    
                    <TableCell align="center" className={classes.tableCellBodyListaDetalle}>
                      {row.fob_grand_total !== null &&
                      row.fob_grand_total !== undefined
                        ? `${row.fob_grand_total.toFixed(2)}`
                        : "Sin data"}
                    </TableCell>

                    <TableCell className={classes.tableCellBodyListaDetalleAVATAR}>
                      {row.avatar_url != "" && row.avatar_url !== null ? (
                        <Tooltip title={row.own}>
                          <Avatar
                            align="center"
                            alt={row.own ? row.own : "Sin data"}
                            src={row.avatar_url}
                          />
                        </Tooltip>
                      ) : (
                        <>
                          {row.own !== null && row.own !== undefined
                            ? row.own
                            : "Sin data"}
                        </>
                      )}
                    </TableCell>

                    <TableCell align="right" className={classes.tableCellBodyListaDetalle}>
                      {new Date(row.htimestamp).toLocaleDateString() !== null &&
                      new Date(row.htimestamp).toLocaleDateString() !==
                        undefined
                        ? new Date(row.htimestamp).toLocaleDateString()
                        : "Sin data"}
                    </TableCell>
                    
                    <TableCell
                      align="center"
                      sx={{ pr: 3 }}
                      className={classes.tableCellBodyListaDetalle}
                    >
                      <Tooltip title="Ver Detalle">
                        <IconButton
                          color="primary"
                          size="large"
                          aria-label="view"
                        >
                          <VisibilityTwoToneIcon
                            sx={{ fontSize: "1.3rem" }}
                            onClick={() =>
                              verDetalle(row.estnumber, row.estvers)
                            }
                          />
                        </IconButton>
                      </Tooltip>
                      {EditOK && (
                        <Tooltip title="Editar">
                          <IconButton
                            color="secondary"
                            size="large"
                            aria-label="edit"
                          >
                            <EditTwoToneIcon
                              sx={{ fontSize: "1.3rem" }}
                              onClick={() =>
                                ActualizarPresupuesto(
                                  row.estnumber,
                                  row.estvers
                                )
                              }
                            />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
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
        }

      </TableContainer>

      {/* table pagination */}
      <TablePagination
        rowsPerPageOptions={[10, 20, 50]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </MainCard>
  );
};
export default CustomerList;
