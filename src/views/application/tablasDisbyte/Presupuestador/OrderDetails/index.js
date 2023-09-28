import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link, redirect, useParams } from "react-router-dom";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Box, Tab, Tabs } from "@mui/material";

// project imports
import Details from "./Details";
import Invoice from "./Invoice";
import Status from "./Status";
import MainCard from "ui-component/cards/MainCard";

// assets
import DescriptionTwoToneIcon from "@mui/icons-material/DescriptionTwoTone";
import LocalShippingTwoToneIcon from "@mui/icons-material/LocalShippingTwoTone";
import ReceiptTwoToneIcon from "@mui/icons-material/ReceiptTwoTone";

import { PresupuestoHelper } from "helpers/PresupuestoHelper";
import useAuth from "hooks/useAuth";

// const versionParams = useParams();

// tab content
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

// ==============================|| ESTIMATE(HEADER + item) DETAILS ||============================== //
//
const OrderDetails = () => {
  //traigo datos de usuario
  const { user } = useAuth();

  const theme = useTheme();
  const [rows, setRows] = useState([]); //estoy almacenando la data
  const [rowsDoble, setRowsDoble] = useState([]);
  const [historico, setHistorico] = useState([]);

  const { estnumber, vers } = useParams();

  const accessToken = "";

  // set selected tab
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // llamados a la api
  // traigo data Y LO ALMACENO EN EL STATE DE setRows
  const fetchData = async (estnumber) => {
    try {
      const jsonData = await PresupuestoHelper.fetchData();
      setRows(jsonData);
    } catch (error) {
      console.log(error);
    }
  };
  const readDataEstVers = async (estnumber, vers, accessToken) => {
    console.log(estnumber, vers);
    try {
      const jsonData = await PresupuestoHelper.readDataEstVers(
        estnumber,
        vers,
        accessToken
      );
      setRowsDoble(jsonData);
    } catch (error) {
      console.log(error);
    }
  };
  const traerHistorico = async (estnumber) => {
    console.log(estnumber, vers);
    try {
      const jsonData = await PresupuestoHelper.fetchDataHistorico(estnumber);
        
        setHistorico(jsonData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    readDataEstVers(estnumber, vers, accessToken);
    traerHistorico(estnumber);
  }, []); // este useEffect se ejecutará solo una vez, al montar el componente

  useEffect(() => {
    // console.log(rows);
    // console.log('Mostraremos el doble entrada')
    // console.log(rowsDoble)
    // console.log(historico);

  }, [rows, rowsDoble, historico]); // este useEffect se ejecutará cada vez que 'rows' cambie

  return (
    <MainCard>
      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
        variant="scrollable"
        aria-label="simple tabs example"
        sx={{
          "& a": {
            minHeight: "auto",
            minWidth: 10,
            px: 1,
            py: 1.5,
            mr: 2.25,
            color: theme.palette.grey[600],
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          },
          "& a.Mui-selected": {
            color: theme.palette.primary.main,
          },
          "& a > svg": {
            marginBottom: "0px !important",
            marginRight: 1.25,
          },
          mb: 3,
        }}
      >
        <Tab
          icon={<DescriptionTwoToneIcon />}
          component={Link}
          to="#"
          label="Details"
          {...a11yProps(0)}
        />
        <Tab
          icon={<ReceiptTwoToneIcon />}
          component={Link}
          to="#"
          label="Preview"
          {...a11yProps(1)}
        />
        {/* <Tab icon={<LocalShippingTwoToneIcon />} component={Link} to="#" label="Status" {...a11yProps(2)} /> */}
      </Tabs>

      {/* tab - details */}
      <TabPanel value={value} index={0}>
        <Details presupuestador={rowsDoble} usuario={user} historico={historico} />
      </TabPanel>

      {/* tab - invoice */}
      <TabPanel value={value} index={1}>
        <Invoice presupuestador={rowsDoble} usuario={user} />
      </TabPanel>

      {/* tab - status */}
      {/* <TabPanel value={value} index={2}>
                <Status />
            </TabPanel> */}
    </MainCard>
  );
};

export default OrderDetails;
