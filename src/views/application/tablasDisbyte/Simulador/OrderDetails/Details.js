// LISTED 21_09_2023 18_41
// Se normiliza la vista del detalle, tal y como apacere en el XLS con una vista abreviada y una FULL.

import { useNavigate } from "react-router-dom";
// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Button,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
// Importa CircularProgress de Material UI
import { CircularProgress, makeStyles } from "@material-ui/core";

// project imports
import SubCard from "ui-component/cards/SubCard";
import Chip from "ui-component/extended/Chip";
import { gridSpacing } from "store/constant";
// assets
import { useEffect, useState } from "react";
import AnimateButton from "ui-component/extended/AnimateButton";
import { UtilidadesHelper } from "helpers/UtilidadesHelper";
import { useAccessTokenJWT } from "helpers/useAccessTokenJWT";
import { Box, ThemeProvider, display } from "@mui/system";
import { ImagenAvatar } from "../../../../Components/ImagenAvatar";
import { BarraContenedores } from "views/Components/Contenedores/BarraContenedores";
import { TablaContenedores } from "views/Components/Contenedores/TablaContenedores";
import { useCommonStyles } from "helpers/CommonStyles";
import { CargaHelper } from "helpers/CargaHelper";

const sxDivider = {
  borderColor: "primary.light",
};

const detailsIconSX = {
  width: 15,
  height: 15,
  verticalAlign: "text-top",
  mr: 0.5,
  mt: 0.25,
};

const Details = ({ presupuestador, usuario, historico, estados }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const permisos = useAccessTokenJWT();

  const editarPresu = permisos.includes("presupuesto:edit");

  const [rows, setRow] = useState([]);
  // Detalles que complementan cada row del detail, son detalles del tipo VISTA, FK que fueron convertidas a texto.
  // No se agregan a la definicion del estDetail, mas es una lista complementaria de igual dimencion.
  const [rowsAddData, setRowAddData] = useState([]);
  //responde al loading para la vista
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [verMas, setVerMas] = useState(true);
  const [pais, setPais] = useState(0);
  const [showHistorico, setShowHistorico] = useState(false);
  const [selRow, setSelRow] = useState(0);

  //console.log(pais);

  useEffect(() => {
    const fetchData = async () => {
      if (presupuestador && presupuestador.estDetails) {
        // El detail propiamente dicho
        setRow(presupuestador.estDetails);
        // Los datos adicionales que acompañan a cada detalle, fruto de convertir FKs en descripcion.
        setRowAddData(presupuestador.estDetAddData);
        //console.log("ROWS",rows[0]);
        //espera la respuesta de presupuestador y quita el loading
        setLoading(false);
        setPais(presupuestador.estHeader.paisregion_id);
      }
    };

    fetchData();
  }, [presupuestador]);

  useEffect(() => {
    if (presupuestador.estHeader != null && loading == false) {
      setLoading2(false);
    }
    //console.log(rows);
    //console.log("ROWS",rows[0]);
  }, [rows, loading]);

  const deteleDetails = async (id) => {
    console.log(`se hizo click en el ${id}`);
  };

  const nuevoPresupuesto = (estnumber, estvers) => {
    navigate(`/simuladorMEX/update-simuladorMEX/${estnumber}/${estvers}`);
    // navigate(`/estimate/update-estimate/${estnumber}/${estvers}`);
  };


  const[cargas,setCargas]=useState();
  const[carga,setCarga]=useState();

  const dataHelpers = async () => {
    const cargas = await CargaHelper.fetchData();
    setCargas(cargas);
  }


  useEffect(()=>{
    dataHelpers();
  },[])
  useEffect(()=>{
                  
    if(cargas!=undefined)
    {
        setCarga(cargas.filter((miCarga)=>miCarga?.description===presupuestador?.carga_str)[0])
        // console.log(cargas,carga);
    }

  },[cargas,presupuestador])

  // totales de los que no dispone el json o no estan operativos a la fecha
  // Suma de los extrag
  function sumExtrag(myRow) {
    //console.log("CALC",myRow);

    if (myRow == undefined) {
      return 0.0;
    }

    return (
      myRow.extrag_src1 +
      myRow.extrag_src2 +
      myRow.extrag_comex1 +
      myRow.extrag_comex2 +
      myRow.extrag_comex3 +
      myRow.extrag_finan1 +
      myRow.extrag_finan2 +
      myRow.extrag_finan3 +
      myRow.extrag_glob_comex1 +
      myRow.extrag_glob_comex2 +
      myRow.extrag_glob_comex3 +
      myRow.extrag_glob_src1 +
      myRow.extrag_glob_src2 +
      myRow.extrag_glob_finan1 +
      myRow.extrag_glob_finan2 +
      myRow.extrag_glob_finan3 +
      myRow.extrag_glob_finan4 +
      myRow.extrag_glob_finan5
    );
  }
  // Suma de los gastos locales
  function sumGlocPais(myRow, pais) {
    if (pais == 7) {
      return (
        myRow.gloc_bancos +
        myRow.gloc_depositos +
        myRow.gloc_despachantes +
        myRow.gloc_flete +
        myRow.gloc_fwd +
        myRow.gloc_gestdigdoc +
        myRow.gloc_polizas +
        myRow.gloc_terminales
      );
    }

    if (pais == 5) {
      return (
        myRow.gloc_despachantes +
        myRow.gloc_flete +
        myRow.gloc_fwd +
        myRow.gloc_terminales
      );
    }
    return 0.0;
  }
  // Suma de los aranceles.
  function sumImpuestosPais(myRow, pais) {
    if (pais == 7) {
      return (
        myRow.arancelgrav_cif +
        myRow.te_dta_otro_cif +
        myRow.iva_cif +
        myRow.ivaad_cif +
        myRow.gcias424 +
        myRow.iibb900
      );
    }
    if (pais == 5) {
      return myRow.arancelgrav_cif + myRow.te_dta_otro_cif + myRow.iva_cif;
    }
  }

  const verMasImp = () => {
    if (!verMas) {
      setVerMas(true);
      return;
    }
    setVerMas(false);
  };


  
  // const classes = useStyles();
  const classes = useCommonStyles(); //importo estilos propios
  const [isHovered, setIsHovered] = useState(false); //maneja el evento de la imagen

  const handleSelectRow = (selectedRow) => {
    setSelRow(selectedRow);
  };

  // alineado: el tipo de alineacion en la tabla
  // nombre: el nombre que tendra a la vista en la tabla
  // atributo: nombre del atributo que llega del JSON
  // tipoDeVista: determina a dnd pertenece su visualizacion
  //tipoDato: se agrega al string su tipo si es Kg, m3, u., etc.
  const DatosPackaging = [
    {
      alineado: "center",
      nombre: "Art.",
      atributo: "index",
      tipoDato: "index",
      tipoDeVista: 'todo',
      claseStyle: '',
    },
    {
      alineado: "center",
      nombre: "SKU",
      atributo: "sku",
      tipoDato: "string",
      tipoDeVista: 'todo',
      claseStyle: 'tableCellMediumSuspensivos',
    },
    {
      alineado: "center",
      nombre: "Commodity",
      atributo: "description",
      tipoDato: "string",
      tipoDeVista: 'todo',
      claseStyle: 'tableCellMediumSuspensivos',
    },
    {
      alineado: "center",
      nombre: "Proveedor",
      atributo: "proveedor",
      tipoDato: "busquedaProveedor",
      tipoDeVista: 'todo',
      claseStyle: 'tableCellMediumSuspensivos',
    },
    {
      alineado: "center",
      nombre: "Imagen URL",
      atributo: "imageurl",
      tipoDato: "imagen",
      tipoDeVista: 'todo',
      claseStyle: '',
    },
    {
      alineado: "center",
      nombre: "NCM",
      atributo: "ncm_str",
      tipoDato: "busquedaNCM",
      tipoDeVista: 'todo',
      claseStyle: '',
    },
    {
      alineado: "right",
      nombre: "ARANC.[%]",
      atributo: "ncm_arancel",
      tipoDato: "porciento",
      tipoDeVista: 'todo',
      claseStyle: '',
    },
    {
      alineado: "right",
      nombre: "DTA[%]",
      atributo: "ncm_te_dta_otro",
      tipoDato: "porciento",
      tipoDeVista: 'todo',
      claseStyle: '',
    },
    {
      alineado: "right",
      nombre: "IVA[%]",
      atributo: "ncm_iva",
      tipoDato: "porciento",
      tipoDeVista: 'todo',
      claseStyle: '',
    },
    {
      alineado: "right",
      nombre: "Qty[PCS]",
      atributo: "qty",
      tipoDato: "unitario",
      tipoDeVista: 'todo',
      claseStyle: '',
    },
    {
      alineado: "right",
      nombre: "PCS/CTN",
      atributo: "pcsctn",
      tipoDato: "unitario",
      tipoDeVista: 'todo',
      claseStyle: '',
    },
    {
      alineado: "right",
      nombre: "CBM/CTN[m3]",
      atributo: "cbmctn",
      tipoDato: "metraje",
      tipoDeVista: 'todo',
      claseStyle: '',
    },
    {
      alineado: "right",
      nombre: "GW CTN[kg]",
      atributo: "gwctn",
      tipoDato: "peso",
      tipoDeVista: 'todo',
      claseStyle: '',
    },
    {
      alineado: "right",
      nombre: "Total CBM[m3]",
      atributo: "totalcbm",
      tipoDato: "metraje",
      tipoDeVista: 'todo',
      claseStyle: '',
    },
    {
      alineado: "right",
      nombre: "Total GW[kg]",
      atributo: "totalgw",
      tipoDato: "peso",
      tipoDeVista: 'todo',
      claseStyle: '',
    },
    {
      alineado: "right",
      nombre: "FP[%]",
      atributo: "factorproducto",
      tipoDato: "porciento",
      tipoDeVista: 'todo',
      claseStyle: '',
    },
  ];

  //en este caso se agrega el atributo orden el cual dependiendo si es vista ampliada o no se respetara
  //si es vista reducida verMas = TRUE se muestran los tipoDeVista = reducida y si es FALSE se muestra
  //se muestra absolutamente todos los elementos de ARR respetando el orden
  const DatosArancelarios = [
    //vista reducida
    {
      alineado: "center",
      nombre: "Art.",
      atributo: "index",
      tipoDato: "index",
      tipoDeVista: 'reducida',
      claseStyle: '',
      orden: 1,
    },
    {
      alineado: "center",
      nombre: "SKU",
      atributo: "sku",
      tipoDato: "string",
      tipoDeVista: 'reducida',
      claseStyle: 'tableCellMediumSuspensivosSmall',
      orden: 2,
    },
    {
      alineado: "right",
      nombre: "EXW u.[USD]",
      atributo: "exw_u",
      tipoDato: "number",
      tipoDeVista: 'reducida',
      claseStyle: '',
      orden: 5,
    },
    {
      alineado: "right",
      nombre: "FOB u.[USD]",
      atributo: "fob_u",
      tipoDato: "number",
      tipoDeVista: 'reducida',
      claseStyle: '',
      orden: 6,
    },
    {
      alineado: "right",
      nombre: "Tot.FOB[USD]",
      atributo: "totalfob",
      tipoDato: "number",
      tipoDeVista: 'reducida',
      claseStyle: '',
      orden: 7,
    },
    {
      alineado: "right",
      nombre: "FP[%]",
      atributo: "factorproducto",
      tipoDato: "porciento",
      tipoDeVista: 'reducida',
      claseStyle: '',
      orden: 8,
    },
    {
      alineado: "right",
      nombre: "Freight[USD]",
      atributo: "freightCharge",
      tipoDato: "number",
      tipoDeVista: 'reducida',
      claseStyle: '',
      orden: 9,
    },
    {
      alineado: "right",
      nombre: "Ins[USD]",
      atributo: "insuranceCharge",
      tipoDato: "number",
      tipoDeVista: 'reducida',
      claseStyle: '',
      orden: 10,
    },
    {
      alineado: "right",
      nombre: "CIF TOT[USD]",
      atributo: "totalcif",
      tipoDato: "number",
      tipoDeVista: 'reducida',
      claseStyle: '',
      orden: 11,
    },
    {
      alineado: "right",
      nombre: "ARANC.[USD]",
      atributo: "arancelgrav_cif",
      tipoDato: "number",
      tipoDeVista: 'reducida',
      claseStyle: '',
      orden: 14,
    },
    {
      alineado: "right",
      nombre: "DTA[%]",
      atributo: "ncm_te_dta_otro",
      tipoDato: "porciento",
      tipoDeVista: 'todo',
      claseStyle: '',
      orden: 14.5,
    },
    {
      alineado: "right",
      nombre: "DTA[USD]",
      atributo: "te_dta_otro_cif",
      tipoDato: "number",
      tipoDeVista: 'reducida',
      claseStyle: '',
      orden: 15,
    },
    {
      alineado: "right",
      nombre: "BASE IVA[USD]",
      atributo: "baseiva",
      tipoDato: "number",
      tipoDeVista: 'reducida',
      claseStyle: '',
      orden: 16,
    },
    {
      alineado: "right",
      nombre: "IVA[USD]	",
      atributo: "iva_cif",
      tipoDato: "number",
      tipoDeVista: 'reducida',
      claseStyle: '',
      orden: 18,
    },
    {
      alineado: "right",
      nombre: "IMP TOT[USD]",
      atributo: "sumImpuestosPais",
      tipoDato: "funcion_sumImpuestosPais",
      tipoDeVista: 'reducida',
      claseStyle: '',
      orden: 19,
    },
    {
      alineado: "right",
      nombre: "Tot.GLOC[USD]",
      atributo: "sumGlocPais",
      tipoDato: "funcion_sumGlocPais",
      tipoDeVista: 'reducida',
      claseStyle: '',
      orden: 46,
    },
    {
      alineado: "right",
      nombre: "Extrg. TOT.",
      atributo: "sumExtrag",
      tipoDato: "funcion_sumExtrag",
      tipoDeVista: 'reducida',
      claseStyle: '',
      orden: 47,
    },
    {
      alineado: "right",
      nombre: "COSTO u.[USD]",
      atributo: "costo_u",
      tipoDato: "number",
      tipoDeVista: 'reducida',
      claseStyle: '',
      orden: 48,
    },

    //vista completa
    {
      alineado: "center",
      nombre: "Proveedor",
      atributo: "proveedor",
      tipoDato: "busquedaProveedor",
      tipoDeVista: 'todo',
      claseStyle: 'tableCellMediumSuspensivos',
      orden: 3,
    },
    {
      alineado: "center",
      nombre: "NCM",
      atributo: "ncm_str",
      tipoDato: "busquedaNCM",
      tipoDeVista: 'todo',
      claseStyle: '',
      orden: 4,
    },
    {
      alineado: "right",
      nombre: "FOB/CIF[%]",
      atributo: "totalcif/totalfob",
      tipoDato: "totalcif/totalfob",
      tipoDeVista: 'todo',
      claseStyle: '',
      orden: 12,
    },
    {
      alineado: "right",
      nombre: "ARANC.[%]",
      atributo: "ncm_arancel",
      tipoDato: "porciento",
      tipoDeVista: 'todo',
      claseStyle: '',
      orden: 13,
    },
    {
      alineado: "right",
      nombre: "IVA[%]",
      atributo: "ncm_iva",
      tipoDato: "porciento",
      tipoDeVista: 'todo',
      claseStyle: '',
      orden: 17,
    },
    //Gastos locales
    {
      alineado: "right",
      nombre: "Gasto Terminal[USD]",
      atributo: "gloc_terminales",
      tipoDato: "number",
      tipoDeVista: 'todo',
      claseStyle: '',
      orden: 20,
    },
    {
      alineado: "right",
      nombre: "Flete Interno[USD]",
      atributo: "gloc_flete",
      tipoDato: "number",
      tipoDeVista: 'todo',
      claseStyle: '',
      orden: 21,
    },
    {
      alineado: "right",
      nombre: "Gasto Loc. FWD[USD]",
      atributo: "gloc_fwd",
      tipoDato: "number",
      tipoDeVista: 'todo',
      claseStyle: '',
      orden: 22,
    },
    {
      alineado: "right",
      nombre: "Gasto DESPA[USD]",
      atributo: "gloc_despachantes",
      tipoDato: "number",
      tipoDeVista: 'todo',
      claseStyle: '',
      orden: 23,
    },
    {
      alineado: "right",
      nombre: "Total Gast Dest[USD]",
      atributo: "funcion_sumGlocPais",
      tipoDato: "funcion_sumGlocPais",
      tipoDeVista: 'todo',
      claseStyle: '',
      orden: 24,
    },
    {
      alineado: "right",
      nombre: "Extrg. SRC1[USD]",
      atributo: "extrag_src1",
      tipoDato: "number",
      tipoDeVista: 'todo',
      claseStyle: '',
      orden: 25,
    },
    {
      alineado: "right",
      nombre: "Extrg. SRC2[USD]",
      atributo: "extrag_src2",
      tipoDato: "number",
      tipoDeVista: 'todo',
      claseStyle: '',
      orden: 26,
    },
    {
      alineado: "right",
      nombre: "Extrg. SRC NOTAS",
      atributo: "extrag_src_notas",
      tipoDato: "string",
      tipoDeVista: 'todo',
      claseStyle: '',
      orden: 27,
    },
    {
      alineado: "right",
      nombre: "Extrg. CMX1[USD]",
      atributo: "extrag_comex1",
      tipoDato: "number",
      tipoDeVista: 'todo',
      claseStyle: '',
      orden: 28,
    },
    {
      alineado: "right",
      nombre: "Extrg. CMX2[USD]",
      atributo: "extrag_comex2",
      tipoDato: "number",
      tipoDeVista: 'todo',
      claseStyle: '',
      orden: 29,
    },
    {
      alineado: "right",
      nombre: "Extrg. CMX3[USD]",
      atributo: "extrag_comex3",
      tipoDato: "number",
      tipoDeVista: 'todo',
      claseStyle: '',
      orden: 30,
    },
    {
      alineado: "right",
      nombre: "Extrg. CMX NOTAS",
      atributo: "extrag_comex_notas",
      tipoDato: "string",
      tipoDeVista: 'todo',
      claseStyle: '',
      orden: 31,
    },
    {
      alineado: "right",
      nombre: "Extrg. FIN1[USD]",
      atributo: "extrag_finan1",
      tipoDato: "number",
      tipoDeVista: 'todo',
      claseStyle: '',
      orden: 32,
    },
    {
      alineado: "right",
      nombre: "Extrg. FIN2[USD]",
      atributo: "extrag_finan2",
      tipoDato: "number",
      tipoDeVista: 'todo',
      claseStyle: '',
      orden: 33,
    },
    {
      alineado: "right",
      nombre: "Extrg. FIN3[USD]",
      atributo: "extrag_finan3",
      tipoDato: "number",
      tipoDeVista: 'todo',
      claseStyle: '',
      orden: 34,
    },
    {
      alineado: "right",
      nombre: "Extrg. FIN NOTAS",
      atributo: "extrag_finan_notas",
      tipoDato: "string",
      tipoDeVista: 'todo',
      claseStyle: '',
      orden: 35,
    },
    //extra Gastos Globales
    {
      alineado: "right",
      nombre: "Extrg. gCMX1 [USD]",
      atributo: "extrag_glob_comex1",
      tipoDato: "number",
      tipoDeVista: 'todo',
      claseStyle: '',
      orden: 36,
    },
    {
      alineado: "right",
      nombre: "Extrg. gCMX2 [USD]",
      atributo: "extrag_glob_comex2",
      tipoDato: "number",
      tipoDeVista: 'todo',
      claseStyle: '',
      orden: 37,
    },
    {
      alineado: "right",
      nombre: "Extrg. gCMX3 [USD]",
      atributo: "extrag_glob_comex3",
      tipoDato: "number",
      tipoDeVista: 'todo',
      claseStyle: '',
      orden: 38,
    },
    {
      alineado: "right",
      nombre: "Extrg. gCMX4 [USD]",
      atributo: "extrag_glob_comex4",
      tipoDato: "number",
      tipoDeVista: 'todo',
      claseStyle: '',
      orden: 39,
    },
    {
      alineado: "right",
      nombre: "Extrg. gCMX5 [USD]",
      atributo: "extrag_glob_comex5",
      tipoDato: "number",
      tipoDeVista: 'todo',
      claseStyle: '',
      orden: 40,
    },

    {
      alineado: "right",
      nombre: "Extrg. gFIN1 [USD]",
      atributo: "extrag_glob_finan1",
      tipoDato: "number",
      tipoDeVista: 'todo',
      claseStyle: '',
      orden: 41,
    },
    {
      alineado: "right",
      nombre: "Extrg. gFIN2 [USD]",
      atributo: "extrag_glob_finan2",
      tipoDato: "number",
      tipoDeVista: 'todo',
      claseStyle: '',
      orden: 42,
    },
    {
      alineado: "right",
      nombre: "Extrg. gFIN3 [USD]",
      atributo: "extrag_glob_finan3",
      tipoDato: "number",
      tipoDeVista: 'todo',
      claseStyle: '',
      orden: 43,
    },
    {
      alineado: "right",
      nombre: "Extrg. gFIN4 [USD]",
      atributo: "extrag_glob_finan4",
      tipoDato: "number",
      tipoDeVista: 'todo',
      claseStyle: '',
      orden: 44,
    },
    {
      alineado: "right",
      nombre: "Extrg. gFIN5 [USD]",
      atributo: "extrag_glob_finan5",
      tipoDato: "number",
      tipoDeVista: 'todo',
      claseStyle: '',
      orden: 45,
    },
  ];

  return (
    <Grid container spacing={gridSpacing}>
      {loading ? (
        <div style={{ margin: "auto", display: "block", paddingTop: "25px" }}>
          <CircularProgress margin="auto" />
        </div>
      ) : (
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={11}>
              <Typography
                variant="h3"
                color={theme.palette.mode === "dark" ? "white" : "black"}
                display={"inline"}
              >
                {"SOURCING >>>> PRJ: "}
              </Typography>
              <Typography
                variant="h3"
                color={theme.palette.mode === "dark" ? "LightSkyBLue" : "grey"}
                display={"inline"}
                sx={{ fontStyle: "italic" }}
              >
                {presupuestador.estHeader.project
                  ? `${presupuestador.estHeader.project}`
                  : "Sin data"}{" "}
              </Typography>

              <Typography
                variant="h3"
                color={theme.palette.mode === "dark" ? "white" : "black"}
                display={"inline"}
              >
                {" / EMISOR: "}
              </Typography>
              <Typography
                variant="h3"
                color={theme.palette.mode === "dark" ? "LightSkyBLue" : "grey"}
                display={"inline"}
                sx={{ fontStyle: "italic" }}
              >
                {presupuestador.estHeader.own
                  ? `${presupuestador.estHeader.own}`
                  : "Sin data"}{" "}
              </Typography>

              <Grid container justifyContent="flex-end">
                <AnimateButton>
                  <Button
                    variant="contained"
                    sx={{
                      background: "#2196f3",
                      position: "relative", // Posición relativa  PARA COLOCAR EL BOTON A LA ALTURA DEL MAINCARD
                      top: "-30px", // Posición desde la parte superior del contenedor
                      spacing: "25px",
                      right: "-205px", // Posición desde la derecha del contenedor
                      //margin: "-25px",
                      "&:hover": { background: "#2554C7" },
                    }}
                    onClick={() => navigate("/simuladorMEX/simulador")}
                  >
                    Volver a la lista
                  </Button>
                </AnimateButton>
                {editarPresu && (
                  <AnimateButton>
                    <Button
                      variant="contained"
                      sx={{
                        background: theme.palette.error.main,
                        position: "relative", // Posición relativa  PARA COLOCAR EL BOTON A LA ALTURA DEL MAINCARD
                        top: "-30px", // Posición desde la parte superior del contenedor
                        right: "45px", // Posición desde la derecha del contenedor
                        //margin: "-25px",
                        "&:hover": { background: theme.palette.error.dark },
                      }}
                      onClick={() =>
                        nuevoPresupuesto(
                          presupuestador.estHeader.estnumber,
                          presupuestador.estHeader.estvers
                        )
                      }
                    >
                      Modificar
                    </Button>
                  </AnimateButton>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}

      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} sm={3} md={3} sx={{ marginLeft: "50px" }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className={classes.tableCellCabecera3}
                    sx={{ backgroundColor: "coral" }}
                  >
                    <Typography variant="h4">Detalle Carga</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableCell className={classes.tableCell}>Tipo:</TableCell>
                <TableCell className={classes.tableCell}>
                  {presupuestador.carga_str ? presupuestador.carga_str : 0}
                </TableCell>

                <TableRow>
                  <TableCell className={classes.tableCell}>
                    Cant Contenedores:
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {presupuestador?.estHeader?.cantidad_contenedores
                      ? presupuestador.estHeader.cantidad_contenedores.toFixed(
                          3
                        )
                      : 0.0}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableCell}>
                    Total CBM[m3]:
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {presupuestador?.estHeader?.cbm_grand_total || 0
                      ? presupuestador.estHeader.cbm_grand_total.toFixed(2)
                      : 0.0}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableCell}>
                    Pais ORIG {" -> "} DEST :
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {/*ADVERTENCIA !!!!:. En el presupuesto hay datos sueltos que son complementarios al header.
                                 No se incluyen en el header para no modificar el tipo de datos en todo el back. Se envian como datos sueltos
                                 (no so ni del detail ni del header) en le JSON. Esto se hizo para eliminar los IDs y tener las descripciones
                                 en un solo query, evitando varias fetch*/}
                    {presupuestador.paisorig ? presupuestador.paisorig : ""}
                    {" -> "}
                    {presupuestador.paisdest ? presupuestador.paisdest : ""}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableCell}>
                    Flete[USD]:
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {presupuestador?.estHeader?.gloc_flete ||
                    presupuestador?.estHeader?.gloc_flete == 0
                      ? UtilidadesHelper.formatNumber(
                          presupuestador.estHeader.gloc_flete.toFixed(2)
                        )
                      : "Sin data"}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableCell}>
                    Freight Cost[USD]:
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {presupuestador?.estHeader?.freight_cost ||
                    presupuestador?.estHeader?.freight_cost == 0
                      ? UtilidadesHelper.formatNumber(
                          presupuestador.estHeader.freight_cost.toFixed(2)
                        )
                      : "Sin data"}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableCell}>
                    Freight Insurance Cost[USD]:
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {presupuestador?.estHeader?.freight_insurance_cost ||
                    presupuestador?.estHeader?.freight_insurance_cost == 0
                      ? UtilidadesHelper.formatNumber(
                          presupuestador?.estHeader?.freight_insurance_cost.toFixed(
                            2
                          )
                        )
                      : "Sin data"}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableCell}>
                    Total CIF[USD]:
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {presupuestador?.estHeader?.cif_grand_total
                      ? UtilidadesHelper.formatNumber(
                          presupuestador.estHeader.cif_grand_total.toFixed(2)
                        )
                      : "Sin data"}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableCell}>
                    Impuestos[USD]:
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {presupuestador?.estHeader?.impuestos_total
                      ? UtilidadesHelper.formatNumber(
                          presupuestador?.estHeader?.impuestos_total.toFixed(2)
                        )
                      : "Sin data"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid
          item
          container
          spacing={0}
          alignItems="center"
          justifyContent="center"
          xs={12}
          sm={5.5}
          md={5.5}
        >
          <Box
            sx={{
              width: 600,
              height: 340,
              borderRadius: 1,
              // bgcolor: "aliceBlue",
              // "&:hover": { bgcolor: "azure" },
            }}
          >
            <Typography variant="h4" padding="10px 10px">
              Contenedores:
            </Typography>
            <Grid
              sx={{marginLeft: '30px'}}
            >
            <BarraContenedores
              value={
                (presupuestador?.estHeader?.cantidad_contenedores -
                  Math.floor(
                    presupuestador?.estHeader?.cantidad_contenedores
                  )) *
                100
              } // sacamos la fraccion del contenedor restante
              ent={Math.floor(presupuestador?.estHeader?.cantidad_contenedores)} // pasamos los contenedores a enteros
              tipo={presupuestador?.carga_str}
              longitudBarra={"75%"}
            />
            </Grid>
            <Grid
              container
              spacing={1}
              alignItems="center"
              justifyContent="center"
              marginTop={1}
            >
              <Grid item xs={12} sm={8} md={11}>
                <TablaContenedores
                  porcentaje={(presupuestador?.estHeader?.cantidad_contenedores - Math.floor(presupuestador?.estHeader?.cantidad_contenedores)) * 100 }
                  carga={carga}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* <Grid container spacing={gridSpacing}> */}

        <Grid item xs={12} sm={3} md={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className={classes.tableCellCabecera3}
                    sx={{ backgroundColor: "coral" }}
                  >
                    <Typography variant="h4">Detalle Presupuesto</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>

                

                <TableRow>
                  <TableCell className={classes.tableCell}>
                    PRJ:
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {presupuestador?.estHeader?.project
                      ? presupuestador.estHeader.project
                      : "Sin data"}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableCell}>
                    Detalle:
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {presupuestador?.estHeader?.description
                      ? presupuestador.estHeader.description
                      : "Sin data"}
                  </TableCell>
                </TableRow>



                <TableRow>
                  <TableCell className={classes.tableCell}>
                    Emisor :
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <Stack direction="row" spacing={2}>
                      {presupuestador?.estHeader?.avatar_url != "" &&
                      presupuestador?.estHeader?.avatar_url !== null ? (
                        <Avatar
                          alt={
                            presupuestador?.estHeader?.own
                              ? presupuestador.estHeader.own
                              : "Sin data"
                          }
                          src={presupuestador?.estHeader?.avatar_url}
                        />
                      ) : null}
                      <typography>
                        {presupuestador?.estHeader?.own
                          ? presupuestador.estHeader.own
                          : "Sin data"}
                      </typography>
                    </Stack>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableCell}>
                    Total Gastos loc.[USD]:
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {presupuestador?.estHeader?.gastos_loc_total ||
                    presupuestador?.estHeader?.gastos_loc_total == 0
                      ? UtilidadesHelper.formatNumber(
                          presupuestador.estHeader.gastos_loc_total.toFixed(2)
                        )
                      : "Sin data"}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className={classes.tableCell}>
                    Ult. Modificacion :
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {/* Para formato de fecha importar date-fns */}
                    {presupuestador?.estHeader?.htimestamp
                      ? UtilidadesHelper.formatFechaYhora(
                          presupuestador.estHeader.htimestamp
                        )
                      : "Sin data"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

      </Grid>

      <Grid item xs={12} sx={{ marginTop: "0px" }}>
        <SubCard>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TableContainer>
                <Typography
                  variant="h3"
                  color={theme.palette.mode === "dark" ? "white" : "black"}
                  display={"inline"}
                >
                  {"Detalles packing - "}
                </Typography>
                <Typography
                  variant="h3"
                  color={
                    theme.palette.mode === "dark" ? "LightSkyBLue" : "grey"
                  }
                  display={"inline"}
                >
                  {"[ Resumen: " +
                    presupuestador?.estHeader?.cantidad_contenedores.toFixed(
                      2
                    ) +
                    " Cont." +
                    presupuestador.carga_str +
                    " / " +
                    presupuestador?.estHeader?.gw_grand_total.toFixed(2) +
                    " kg / " +
                    presupuestador?.estHeader?.cbm_grand_total.toFixed(2) +
                    " m3 ]"}
                </Typography>
                <Table>
                  {/* DATOS PACKAGING */}
                  <TableHead>
                    <TableRow>
                    {DatosPackaging.map((data, index) => (
                      <TableCell
                        key={index}
                        align={data.alineado}
                        className={classes.tableCellCabecera3}
                      >
                        {data.nombre}
                      </TableCell>
                    ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {rows.length === 0 ? (
                      <TableRow>
                        <TableCell>Cargando...</TableCell>
                      </TableRow>
                    ) : (
                      rows.map((row, rowIndex) => (
                        <TableRow
                          key={rowIndex}
                          onClick={() => handleSelectRow(rowIndex)}
                          sx={{
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? selRow === rowIndex
                                  ? "rgba(154, 246, 212, 0.19)"
                                  : "grey600"
                                : selRow === rowIndex
                                ? "rgba(0, 0, 0, 0.09)"
                                : "white",
                            fontSize: 20,
                          }}
                          className={classes.tableCell}
                        >
                          {/* Mapeo anidado para generar el tbody de detalles packaging */}
                          {/* el switchCase actua segun el tipo de dato */}
                          {
                            DatosPackaging.map((data, colIndex) => {
                              let cellValue;
                              switch(data.tipoDato){
                                case 'index':
                                  cellValue = rowIndex + 1;
                                break;
                                case 'string':
                                  cellValue = row[data.atributo] ? row[data.atributo] : 'Sin data';
                                break;
                                case 'busquedaProveedor':
                                  cellValue = rowsAddData[rowIndex].proveedor ? rowsAddData[rowIndex].proveedor : 'Sin proveedor'
                                break;
                                case 'imagen':
                                  cellValue =  row[data.atributo] ? 
                                                <ImagenAvatar
                                                  src={row.imageurl}
                                                  alt={row.sku}
                                                /> :
                                                'Sin Imagen';
                                break;
                                case 'busquedaNCM':
                                  cellValue = rowsAddData[rowIndex].ncm_str ? rowsAddData[rowIndex].ncm_str : 'Sin Data'
                                break;
                                case 'unitario':
                                  cellValue = row[data.atributo] ? `${row[data.atributo]}u.` : '0u.';
                                break;
                                case 'metraje':
                                  cellValue = row[data.atributo] ? `${row[data.atributo].toFixed(3)}m3.` : '0.00m3';
                                break;
                                case 'peso':
                                  cellValue = row[data.atributo] ? `${row[data.atributo].toFixed(2)}Kg.` : '0.00Kg';
                                break;
                                case 'porciento':
                                  cellValue = row[data.atributo] ? `${row[data.atributo].toFixed(3)}%` : '0.00%';
                                break;
                                case 'number':
                                  cellValue = row[data.atributo] ? `${row[data.atributo].toFixed(2)}` : '0.00';
                                break;
                                default:
                                  cellValue = row[data.atributo] ? cellValue = row[data.atributo] : 'Sin data';
                                }
                                
                                return (
                                  // aqui mostramos tooltip de costo u. solo si es el atributo SKU
                                  <Tooltip
                                    title={data.atributo === 'sku' ? `${row[data.atributo]}, Costo U.[USD] ${row.costo_u.toFixed(3)}` : ''}
                                  >
                                    <TableCell
                                      key={colIndex}
                                      align={data.alineado}
                                      className={classes[data.claseStyle]}
                                      >
                                      {cellValue}
                                    </TableCell>
                                  </Tooltip>
                                );
                              })}
                            </TableRow>
                          ))
                        )}

                  </TableBody>
                </Table>
              </TableContainer>

              <Grid sx={{ marginTop: "40px", marginBottom: "-35px" }}>
                <Typography
                  variant="h3"
                  color={theme.palette.mode === "dark" ? "white" : "black"}
                  display={"inline"}
                >
                  {"Detalle Arancelario / Gastos - "}
                </Typography>
                <Typography
                  variant="h3"
                  color={
                    theme.palette.mode === "dark" ? "LightSkyBlue" : "grey"
                  }
                  display={"inline"}
                >
                  {"[ Resumen (USD) > CIF: " +
                    presupuestador?.estHeader?.cif_grand_total.toFixed(2) +
                    " / Impuestos: " +
                    presupuestador?.estHeader?.impuestos_total.toFixed(2) +
                    " / Gastos Loc.: " +
                    presupuestador?.estHeader?.gastos_loc_total.toFixed(2) +
                    " / Gastos Extr.: " +
                    presupuestador?.estHeader?.extragastos_total.toFixed(2) +
                    " ]"}
                </Typography>

                <Grid container justifyContent="flex-end">
                  <AnimateButton>
                    <Button
                      variant="contained"
                      sx={{
                        background: "green",
                        position: "relative", // Posición relativa  PARA COLOCAR EL BOTON A LA ALTURA DEL MAINCARD
                        top: "-45px", // Posición desde la parte superior del contenedor
                        // right: "-220px", // Posición desde la derecha del contenedor
                        //margin: "25px",
                      }}
                      display="inline"
                      onClick={verMasImp}
                    >
                      {verMas ? "Ver Detalle Calc" : "Ocultar Det. Calc."}
                    </Button>
                  </AnimateButton>
                </Grid>
              </Grid>

              {/* TABLANUEVA*/}
              <TableContainer>
                <Table>

                  <TableHead>
                    <TableRow>

                    {DatosArancelarios
                      .filter(data => verMas ? data.tipoDeVista === 'reducida' : true) // vista reducida o completa
                      .sort((a, b) => verMas ? 0 : a.orden - b.orden) // Ordena solo si verMas es false
                      .map((data, index) => (
                        <TableCell
                          key={index}
                          align={data.alineado}
                          className={classes.tableCellCabecera3}
                        >
                          {data.nombre}
                        </TableCell>
                      ))
                    }

                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {rows.length === 0 ? (
                      <TableRow>
                        <TableCell>Cargando...</TableCell>
                      </TableRow>
                    ) : (
                      rows.map((row, rowIndex) => (
                        <TableRow
                          key={rowIndex}
                          onClick={() => handleSelectRow(rowIndex)}
                          sx={{
                            backgroundColor:
                              theme.palette.mode === "dark"
                                ? selRow === rowIndex
                                  ? "rgba(154, 246, 212, 0.19)"
                                  : "grey600"
                                : selRow === rowIndex
                                ? "rgba(0, 0, 0, 0.09)"
                                : "white",
                            fontSize: 20,
                          }}
                          className={classes.tableCell}
                        >

                          {
                            DatosArancelarios
                            .filter(data => verMas ? data.tipoDeVista === 'reducida' : true) // vista reducida o completa
                            .sort((a, b) => verMas ? 0 : a.orden - b.orden) // Ordena solo si verMas es false
                            .map((data, colIndex) => {
                              let cellValue;
                              switch(data.tipoDato){
                                case 'index':
                                  cellValue = rowIndex + 1;
                                break;
                                case 'string':
                                  cellValue = row[data.atributo] ? row[data.atributo] : 'Sin data';
                                break;
                                case 'busquedaProveedor':
                                  cellValue = rowsAddData[rowIndex].proveedor ? rowsAddData[rowIndex].proveedor : 'Sin proveedor'
                                break;
                                case 'busquedaNCM':
                                  cellValue = rowsAddData[rowIndex].ncm_str ? rowsAddData[rowIndex].ncm_str : 'Sin Data'
                                break;
                                case 'unitario':
                                  cellValue = row[data.atributo] ? `${row[data.atributo]}u.` : '0u.';
                                break;
                                case 'metraje':
                                  cellValue = row[data.atributo] ? `${row[data.atributo].toFixed(3)}m3.` : '0.00m3';
                                break;
                                case 'peso':
                                  cellValue = row[data.atributo] ? `${row[data.atributo].toFixed(2)}Kg.` : '0.00Kg';
                                break;
                                case 'porciento':
                                  cellValue = row[data.atributo] ? `${row[data.atributo].toFixed(3)}%` : '0.00%';
                                break;
                                case 'number':
                                  cellValue = row[data.atributo] ? `${row[data.atributo].toFixed(2)}` : '0.00';
                                break;
                                //caso de ejecucion de funciones y calculos
                                case 'totalcif/totalfob':
                                  cellValue = `${(row.totalcif / row.totalfob).toFixed(3)}%`;
                                break;
                                case 'funcion_sumImpuestosPais':
                                  cellValue = `${sumImpuestosPais(row, pais).toFixed(2)}`;
                                break;
                                case 'funcion_sumGlocPais':
                                  cellValue = `${sumGlocPais(row, pais).toFixed(2)}`;
                                break
                                case 'funcion_sumExtrag':
                                  cellValue = `${sumExtrag(row, pais).toFixed(2)}`;
                                break
                                default:
                                  cellValue = row[data.atributo] ? cellValue = row[data.atributo] : 'Sin data';
                              }

                              return (
                                // aqui mostramos tooltip de costo u. solo si es el atributo SKU
                              <Tooltip
                                title={data.atributo === 'sku' ? `${row[data.atributo]}, Costo U.[USD] ${row.costo_u.toFixed(3)}` : ''}
                              >
                                <TableCell
                                  key={colIndex}
                                  align={data.alineado}
                                  className={classes[data.claseStyle]}
                                  >
                                  {cellValue}
                                </TableCell>
                              </Tooltip>
                              );
                            })}
                        </TableRow>
                      ))
                    )};

                  </TableBody>

                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </SubCard>
      </Grid>
    </Grid>
  );
};

export default Details;
