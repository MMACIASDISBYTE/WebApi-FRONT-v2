import PropTypes from "prop-types";
import * as React from "react";
import { useNavigate } from "react-router-dom";

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

// project imports
import MainCard from "ui-component/cards/MainCard";
import { useDispatch, useSelector } from "store";
import { getCustomers } from "store/slices/customer";

// assets
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import AnimateButton from "ui-component/extended/AnimateButton";
import { useAccessTokenJWT } from "helpers/useAccessTokenJWT";

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
    label: "N° de Presupuesto",
    align: "left",
  },
  {
    id: "estvers",
    numeric: false,
    label: "Version",
    align: "left",
  },
  {
    id: "description",
    numeric: false,
    label: "Descripcion",
    align: "left",
  },
  {
    id: "cantidad_contenedores",
    numeric: true,
    label: "Cant. Contenedores",
    align: "left",
  },
  {
    id: "gastos_loc_total",
    numeric: true,
    label: "Gasto Local Total",
    align: "left",
  },
  {
    id: "fob_grand_total",
    numeric: true,
    label: "Fob Total",
    align: "left",
  },
  {
    id: "own",
    numeric: true,
    label: "Emisor",
    align: "left",
  },
  {
    id: "htimestamp",
    numeric: true,
    label: "Fecha",
    align: "right",
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

  return (
    <TableHead>
      <TableRow>
        {numSelected > 0 && (
          <TableCell padding="none" colSpan={6}>
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
          <TableCell sortDirection={false} align="center" sx={{ pr: 3 }}>
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

  const permisos = useAccessTokenJWT();
  // console.log(permisos);
  //LOGICA PERSMISOS
  const editarPresu = permisos.includes("presupuesto:edit");

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [search, setSearch] = React.useState("");
  const [rows, setRows] = React.useState([]);
  const { customers } = useSelector((state) => state.customer);
  React.useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);
  React.useEffect(() => {
    setRows(customers);
    console.log(customers);
  }, [customers]);
  const handleSearch = (event) => {
    const newString = event?.target.value;
    setSearch(newString || "");

    if (newString) {
      const newRows = rows.filter((row) => {
        let matches = true;

        const properties = [
          "id",
          "estvers",
          "description",
          "cantidad_contenedores",
          "gastos_loc_total",
          "fob_grand_total",
          "own",
          "htimestamp",
        ];
        let containsQuery = false;

        properties.forEach((property) => {
          if (
            row[property]
              .toString()
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
      setRows(newRows);
    } else {
      setRows(customers);
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
    console.log(estnumber, estvers);
    navigate(`/estimate/details/${estnumber}/${estvers}`);
  };

  const nuevoPresupuesto = (estnumber, estvers) => {
    navigate(`/estimate/update-estimate/${estnumber}/${estvers}`);
  };

  // console.log(rows);

  return (
    <MainCard title="Customer List" content={false}>
      <CardContent>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
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
              placeholder="Search Estimate"
              value={search}
              size="small"
            />
          </Grid>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <AnimateButton>
              <Button
                variant="contained"
                onClick={() => navigate("/estimate/create-estimate")}
              >
                Create Estimate
              </Button>
            </AnimateButton>
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
                    {/* ID Y DISPONIBLE PARA DATA */}
                    {/* <TableCell
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                            onClick={(event) => handleClick(event, row.id)}
                                            sx={{ cursor: 'pointer' }}
                                        >
                                            <Typography
                                                variant="subtitle1"
                                                sx={{ color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900' }}
                                            >
                                                {' '}
                                                {(
                                                    row.id
                                                    !== null && row.id
                                                    !== undefined) ? row.id
                                                    : 'Sin data'
                                                }
                                                {' '}
                                            </Typography>
                                            <Typography variant="caption"> Disponible para data </Typography>
                                        </TableCell> */}

                    <TableCell align="left">
                      N° -{" "}
                      {row.id !== null && row.id !== undefined
                        ? row.id
                        : "Sin data"}
                    </TableCell>
                    <TableCell align="left">
                      Ver N°{" "}
                      {row.estvers !== null && row.estvers !== undefined
                        ? row.estvers
                        : "Sin data"}
                    </TableCell>
                    <TableCell align="left">
                      {row.estvers !== null && row.description !== undefined
                        ? row.description
                        : "Sin data"}
                    </TableCell>
                    <TableCell align="left">
                      {row.cantidad_contenedores !== null && row.cantidad_contenedores !== undefined
                        ? (row.cantidad_contenedores).toFixed(3)
                        : "Sin data"}
                    </TableCell>
                    <TableCell align="left">
                      {row.gastos_loc_total !== null && row.gastos_loc_total !== undefined
                        ? (row.gastos_loc_total).toFixed(2)
                        : "Sin data"}
                    </TableCell>
                    <TableCell align="left">
                      {row.fob_grand_total !== null && row.fob_grand_total !== undefined
                        ? (row.fob_grand_total).toFixed(2)
                        : "Sin data"}
                    </TableCell>
                    <TableCell align="left">
                      {row.own !== null && row.own !== undefined
                        ? row.own
                        : "Sin data"}
                    </TableCell>
                    <TableCell align="right">
                      {new Date(row.htimestamp).toLocaleDateString() !== null &&
                      new Date(row.htimestamp).toLocaleDateString() !==
                        undefined
                        ? new Date(row.htimestamp).toLocaleDateString()
                        : "Sin data"}
                    </TableCell>
                    {/* <TableCell align="center">
                                            {row.status === 1 && <Chip label="Complete" size="small" chipcolor="success" />}
                                            {row.status === 2 && <Chip label="Processing" size="small" chipcolor="orange" />}
                                            {row.status === 3 && <Chip label="Confirm" size="small" chipcolor="primary" />}
                                        </TableCell> */}
                    <TableCell align="center" sx={{ pr: 3 }}>
                      <Tooltip title="Ver Detalle">
                        <IconButton
                          color="primary"
                          size="large"
                          aria-label="view"
                        >
                          <VisibilityTwoToneIcon
                            sx={{ fontSize: "1.3rem" }}
                            onClick={() => verDetalle(row.estnumber, row.estvers)}
                          />
                        </IconButton>
                      </Tooltip>
                      {editarPresu && (
                        <Tooltip title="Editar">
                          <IconButton
                            color="secondary"
                            size="large"
                            aria-label="edit"
                          >
                            <EditTwoToneIcon
                              sx={{ fontSize: "1.3rem" }}
                              onClick={() =>
                                nuevoPresupuesto(row.estnumber, row.estvers)
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
  );
};
export default CustomerList;
