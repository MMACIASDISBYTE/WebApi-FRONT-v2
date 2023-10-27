import { useEffect, useState } from "react";

// material-ui
import { Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// project imports
import TotalGrowthBarChart from "../Default/TotalGrowthBarChart";
import { gridSpacing } from "store/constant";
import useAuth from "hooks/useAuth";
import { CircularProgress } from "@material-ui/core";
import RevenueCard from "ui-component/cards/RevenueCard";
import MonetizationOnTwoToneIcon from "@mui/icons-material/MonetizationOnTwoTone";
import { PresupuestoHelper } from "helpers/PresupuestoHelper";
import { UtilidadesHelper } from "helpers/UtilidadesHelper";
import HoverSocialCard from "ui-component/cards/HoverSocialCard";
import { useAccessTokenJWT } from "helpers/useAccessTokenJWT";

// import img1 from "../../../assets/images/Test/drupi.png";
// import img2 from "../../../assets/images/Test/suckGorrito.png";
// import img3 from "../../../assets/images/Test/sucktion.png";
import LogoDisbyteBlanco from '../../../assets/images/disbyte/LogoDisbyte_blanco.png';
import LogoDisbyteAzul from '../../../assets/images/disbyte/LogoDisbyte.png';

// ==============================|| HOME DASHBOARD ||============================== //
const Inicio = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const permisos = useAccessTokenJWT();

  // console.log(permisos);  // IT-Test-PA
  const autorizado = permisos.includes("presupuesto:edit"); // || permisosAuth.includes('tarifas:read')

  const dev = "dev-7qwkde4r318nfwz7/roles";
  const userDetails = {
    id: user?.id || "#1Card_Phoebe",
    avatar: user.avatar || "avatar-2.png",
    name: user?.name || "Gaetano",
    role: user?.roll[dev] || "Investor Division Strategist",
    about:
      "Try to connect the SAS transmitter, maybe it will index the optical hard drive!",
    email: user?.email,
    contact: "253-418-5940",
    location: "Herminahaven",
  };

  const [data, setData] = useState([]);
  const [distinctEstNumberCount, setDistinctEstNumberCount] = useState();
  const [countPerDate, setCountPerDate] = useState([]);
  const [cotizacionDate, setCotizacionDate] = useState({});

  const presupuesto = async () => {
    let data = await PresupuestoHelper.fetchData();
    const { distinctEstNumberCount, totalEstVersCount } =
      await PresupuestoHelper.amountDataFetch();
    const dataPerDate = await PresupuestoHelper.AmountDate();
    setData(data);
    setDistinctEstNumberCount(distinctEstNumberCount);
    // console.log(distinctEstNumberCount);
    setCountPerDate(dataPerDate);
  };

  const cotizaciones = async () => {
    let Paises = await UtilidadesHelper.tipoCambioGeneral();

    setCotizacionDate(Paises);
  };
  // console.log(cotizacionDate.quotes);

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await presupuesto();
      await cotizaciones();
      setLoading(false);
    };

    fetchData();
  }, []);

  // console.log(cotizacionDate);

  // const usuarioRollViewMouse = true;
  const cursorImages = [LogoDisbyteBlanco, LogoDisbyteAzul];
  // const cursorImages = [img1, img2, img3];
  const usuarioRollViewMouse = permisos.includes('IT-Test-PA');
  const movementThreshold = 50; // Cantidad mínima de píxeles que el mouse debe moverse para cambiar el cursor
  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    const changeCursor = (event) => {
      const deltaX = Math.abs(event.clientX - lastX);
      const deltaY = Math.abs(event.clientY - lastY);

      if (deltaX + deltaY < movementThreshold) {
        return; // No hacer nada si el mouse no se ha movido lo suficiente
      }

      lastX = event.clientX;
      lastY = event.clientY;

      const randomIndex = Math.floor(Math.random() * cursorImages.length);
      const randomSize = Math.floor(Math.random() * 150) + 50; // Tamaño entre 20 y 50
      const randomRotation = Math.floor(Math.random() * 360); // Rotación de 0 a 360 grados

      const imageUrl = cursorImages[randomIndex];
      const cursorStyle = `url('${imageUrl}') ${randomSize} ${randomSize}, auto`;

      const cursorElement = document.createElement("div");
      cursorElement.style.position = "absolute";
      cursorElement.style.left = `${event.clientX}px`;
      cursorElement.style.top = `${event.clientY}px`;
      cursorElement.style.width = `${randomSize}px`;
      cursorElement.style.height = `${randomSize}px`;
      cursorElement.style.backgroundImage = `url('${imageUrl}')`;
      cursorElement.style.backgroundSize = "cover";
      cursorElement.style.transform = `rotate(${randomRotation}deg)`;
      cursorElement.style.pointerEvents = "none"; // Para evitar que el elemento interfiera con el clic

      document.body.appendChild(cursorElement);

      setTimeout(() => {
        document.body.removeChild(cursorElement);
      }, 1000); // Elimina el elemento después de un breve período para evitar el desorden en el DOM
    };

    if (usuarioRollViewMouse) {
      window.addEventListener("mousemove", changeCursor);
    }

    return () => {
      window.removeEventListener("mousemove", changeCursor);
    };
  }, [usuarioRollViewMouse, cursorImages]);

  return (
    <>
      {/* <h2>Componente Home</h2> */}
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          {countPerDate.length == 0 ? (
            <>
              <div
                style={{ margin: "auto", display: "block", paddingTop: "25px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "10vh",
                  }}
                >
                  <CircularProgress />
                </div>
              </div>
            </>
          ) : (
            <>
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12} lg={6}>
                  <RevenueCard
                    primary="Presupuestos Realizados"
                    secondary={distinctEstNumberCount}
                    content="Presupuestos Realizados"
                    iconPrimary={MonetizationOnTwoToneIcon}
                    color={theme.palette.secondary.main}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <RevenueCard
                    primary="Versiones Realizadas"
                    secondary={data.length}
                    content="Versiones realizadas"
                    iconPrimary={MonetizationOnTwoToneIcon}
                    color={theme.palette.primary.main}
                  />
                </Grid>

                <Grid item xs={12} lg={12} sm={12}>
                  {cotizacionDate.quotes ? (
                    <HoverSocialCard
                      primary="Peso - Dolar"
                      secondary={`$${cotizacionDate.quotes.USDARS.toFixed(2)}`}
                      iconPrimary={MonetizationOnTwoToneIcon}
                      color={theme.palette.orange.dark}
                    />
                  ) : (
                    <HoverSocialCard
                      primary="Peso - Dolar"
                      secondary={`Esperando cotizacion...`}
                      iconPrimary={MonetizationOnTwoToneIcon}
                      color={theme.palette.orange.dark}
                    />
                  )}
                </Grid>

                <Grid item xs={12} lg={3} sm={6}>
                  {cotizacionDate.quotes ? (
                    <HoverSocialCard
                      primary="Reales - Dolar"
                      secondary={`R$${cotizacionDate.quotes.USDBRL.toFixed(2)}`}
                      iconPrimary={MonetizationOnTwoToneIcon}
                      color={theme.palette.primary.main}
                    />
                  ) : (
                    <HoverSocialCard
                      primary="Reales - Dolar"
                      secondary={`Esperando cotizacion...`}
                      iconPrimary={MonetizationOnTwoToneIcon}
                      color={theme.palette.primary.main}
                    />
                  )}
                </Grid>

                <Grid item xs={12} lg={3} sm={6}>
                  {cotizacionDate.quotes ? (
                    <HoverSocialCard
                      primary="Peso Mexicano - Dolar"
                      secondary={`$${cotizacionDate.quotes.USDCNY.toFixed(2)}`}
                      iconPrimary={MonetizationOnTwoToneIcon}
                      color={theme.palette.secondary.dark}
                    />
                  ) : (
                    <HoverSocialCard
                      primary="Peso Mexicano - Dolar"
                      secondary={`Esperando cotizacion...`}
                      iconPrimary={MonetizationOnTwoToneIcon}
                      color={theme.palette.secondary.dark}
                    />
                  )}
                </Grid>

                <Grid item xs={12} lg={3} sm={6}>
                  {cotizacionDate.quotes ? (
                    <HoverSocialCard
                      primary="Yuanes - Dolar"
                      secondary={`¥${cotizacionDate.quotes.USDMXN.toFixed(2)}`}
                      iconPrimary={MonetizationOnTwoToneIcon}
                      color={theme.palette.warning.dark}
                    />
                  ) : (
                    <HoverSocialCard
                      primary="Yuanes - Dolar"
                      secondary={`Esperando cotizacion...`}
                      iconPrimary={MonetizationOnTwoToneIcon}
                      color={theme.palette.warning.dark}
                    />
                  )}
                </Grid>

                <Grid item xs={12} lg={3} sm={6}>
                  {cotizacionDate.quotes ? (
                    <HoverSocialCard
                      primary="Peso Colombiano - Dolar"
                      secondary={`COL$${cotizacionDate.quotes.USDCOP.toFixed(
                        2
                      )}`}
                      iconPrimary={MonetizationOnTwoToneIcon}
                      color={theme.palette.success.dark}
                    />
                  ) : (
                    <HoverSocialCard
                      primary="Peso Colombiano - Dolar"
                      secondary={`Esperando cotizacion...`}
                      iconPrimary={MonetizationOnTwoToneIcon}
                      color={theme.palette.success.dark}
                    />
                  )}
                </Grid>
              </Grid>

              {/* {autorizado && (
                <Grid item xs={12}>
                  <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} md={12}>
                      <TotalGrowthBarChart
                        isLoading={isLoading}
                        countPerDate={countPerDate}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              )} */}

              {/* GRAFICOS DE PRESUPUESTOS */}
              {/* <Grid item xs={12} lg={4}>
                    <SubCard title="Basic Card Style 1">
                        <UserDetailsCard {...userDetails} />
                    </SubCard>
                </Grid> */}
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default Inicio;
