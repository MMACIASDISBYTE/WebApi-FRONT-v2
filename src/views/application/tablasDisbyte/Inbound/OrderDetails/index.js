import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Box, Tab, Tabs } from "@mui/material";

// project imports
import Details from "./Details";
import Informe from "./Informe";
import Historico from "./Historico";
import Diferencias from "./Diferencias";
import Status from "./Status";
import MainCard from "ui-component/cards/MainCard";

// assets
import DescriptionTwoToneIcon from "@mui/icons-material/DescriptionTwoTone";
import ReceiptTwoToneIcon from "@mui/icons-material/ReceiptTwoTone";

import { PresupuestoHelper } from "helpers/PresupuestoHelper";
import useAuth from "hooks/useAuth";
import AguardandoInfo from "../../../../Components/AguardandoInfo";
import { StatusEstadosEmbarque } from "helpers/VariablesDeRepeticion";

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
  const [loading, setLoading] = useState(false); //carga estado para que no crashee la app
  const [rows, setRows] = useState([]); //estoy almacenando la data
  const [rowsDoble, setRowsDoble] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [logDiferencias, setLogDiferencias] = useState([]); // dnd almaceno las diferencias

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
    try {
      const jsonData = await PresupuestoHelper.fetchDataHistorico(estnumber);
        
        setHistorico(jsonData);
    } catch (error) {
      console.log(error);
    }
  };
  
  //ENTRY que trae diferencias
  const LogDiferencias = async (estnumber) => {
    try {
      const jsonData = await PresupuestoHelper.fetchLogHistorico(estnumber);
      setLogDiferencias(jsonData);

    } catch (error) {
      console.log('Error :', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchData(estnumber);
        await readDataEstVers(estnumber, vers, accessToken);
        await traerHistorico(estnumber);
        await LogDiferencias(estnumber);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    loadData();
  }, [estnumber]); // este useEffect se ejecutará solo una vez, al montar el componente

  useEffect(() => {


  }, [rows, rowsDoble, historico, StatusEstadosEmbarque]); // este useEffect se ejecutará cada vez que 'rows' cambie


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
          label="Detalle"
          {...a11yProps(0)}
        />

        {/* ESTO PERTENECE A Informe */}
        <Tab
          icon={<ReceiptTwoToneIcon />}
          component={Link}
          to="#"
          label="Informe"
          {...a11yProps(1)}
        />

        {/* ESTO PERTENECE A Historico */}
        {/* <Tab
          icon={<ReceiptTwoToneIcon />}
          component={Link}
          to="#"
          label="Historico"
          {...a11yProps(2)}
        /> */}

        {/* ESTO PERTENECE A LogDIferencias */}
        <Tab
          icon={<ReceiptTwoToneIcon />}
          component={Link}
          to="#"
          label="Diferencias"
          {...a11yProps(2)}
        />
        {/* <Tab icon={<LocalShippingTwoToneIcon />} component={Link} to="#" label="Status" {...a11yProps(2)} /> */}
        
      </Tabs>

      {/* tab - details */}
      <TabPanel value={value} index={0}>
        <Details presupuestador={rowsDoble} usuario={user} historico={historico} estados={StatusEstadosEmbarque} logDiferencias={logDiferencias} />
      </TabPanel>

      <TabPanel value={value} index={1}>
        {!loading ? <Informe presupuestador={rowsDoble} usuario={user} historico={historico} estados={StatusEstadosEmbarque} logDiferencias={logDiferencias} /> : <AguardandoInfo/> }
      </TabPanel>

      {/* tab - invoice ESTO PERTENECE A ENVOICE / historico */}
      {/* <TabPanel value={value} index={2}>
        <Historico presupuestador={rowsDoble} usuario={user} historico={historico} estados={StatusEstadosEmbarque} logDiferencias={logDiferencias} />
      </TabPanel> */}

      {/* tab - invoice ESTO PERTENECE A ENVOICE / historico */}
      <TabPanel value={value} index={2}>
       {!loading ? <Diferencias presupuestador={rowsDoble} usuario={user} historico={historico} estados={StatusEstadosEmbarque} logDiferencias={logDiferencias} /> : <AguardandoInfo/> }
      </TabPanel>

      {/* tab - status */}
      {/* <TabPanel value={value} index={2}>
                <Status />
            </TabPanel> */}
            
    </MainCard>
  );
};

export default OrderDetails;
