import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import TotalGrowthBarChart from '../Default/TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';
import useAuth from 'hooks/useAuth';
import { CircularProgress } from '@material-ui/core';
import RevenueCard from 'ui-component/cards/RevenueCard';
import MonetizationOnTwoToneIcon from '@mui/icons-material/MonetizationOnTwoTone';
import { PresupuestoHelper } from 'helpers/PresupuestoHelper';
import { UtilidadesHelper } from 'helpers/UtilidadesHelper';
import HoverSocialCard from 'ui-component/cards/HoverSocialCard';
import { useAccessTokenJWT } from 'helpers/useAccessTokenJWT';

// ==============================|| HOME DASHBOARD ||============================== //
const Inicio = () => {
    const theme = useTheme();
    const { user } = useAuth();
    const permisos = useAccessTokenJWT();

    // console.log(permisosAuth);
    const autorizado = permisos.includes('presupuesto:edit') // || permisosAuth.includes('tarifas:read')

    const dev = 'dev-7qwkde4r318nfwz7/roles';
    const userDetails = {
        id: user?.id || '#1Card_Phoebe',
        avatar: user.avatar || 'avatar-2.png',
        name: user?.name || 'Gaetano',
        role: user?.roll[dev] || 'Investor Division Strategist',
        about: 'Try to connect the SAS transmitter, maybe it will index the optical hard drive!',
        email: user?.email,
        contact: '253-418-5940',
        location: 'Herminahaven'
    };

    const [data, setData] = useState([]);
    const [distinctEstNumberCount, setDistinctEstNumberCount] = useState();
    const [countPerDate, setCountPerDate] = useState([]);
    const [cotizacionDate, setCotizacionDate] = useState({});

    const presupuesto = async () => {
        let data = await PresupuestoHelper.fetchData();
        const { distinctEstNumberCount, totalEstVersCount } = await PresupuestoHelper.amountDataFetch();
        const dataPerDate = await PresupuestoHelper.AmountDate();
        setData(data);
        setDistinctEstNumberCount(distinctEstNumberCount);
        console.log(distinctEstNumberCount);
        setCountPerDate(dataPerDate);
    };

    const cotizaciones = async () => {
        let Paises = await UtilidadesHelper.tipoCambioGeneral();

        setCotizacionDate(Paises);
    };
    console.log(cotizacionDate.quotes)

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


    return (
        <>
            {/* <h2>Componente Home</h2> */}
            <Grid container spacing={gridSpacing}>
                {countPerDate.length == 0 ?
                    (
                        <div style={{ margin: "auto", display: "block", paddingTop: "25px" }}>
                            <CircularProgress margin="auto" />
                        </div>
                    ) : (
                        <>
                            <Grid item xs={12}>
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
                                        {cotizacionDate.quotes ?
                                            (<HoverSocialCard
                                                primary="Peso - Dolar"
                                                secondary={`$${(cotizacionDate.quotes.USDARS).toFixed(2)}`}
                                                iconPrimary={MonetizationOnTwoToneIcon}
                                                color={theme.palette.orange.dark}
                                            />
                                            ) : (
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <Grid item style={{ textAlign: 'center', padding: '20px 0' }}>
                                                        <CircularProgress color="secondary" aria-label="progress with secondary color" />
                                                    </Grid>
                                                </Grid>
                                            )}
                                    </Grid>

                                    <Grid item xs={12} lg={3} sm={6}>
                                        {cotizacionDate.quotes ?
                                            (<HoverSocialCard
                                                primary="Reales - Dolar"
                                                secondary={`R$${(cotizacionDate.quotes.USDBRL).toFixed(2)}`}
                                                iconPrimary={MonetizationOnTwoToneIcon}
                                                color={theme.palette.primary.main}
                                            />) : (
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <Grid item style={{ textAlign: 'center', padding: '20px 0' }}>
                                                        <CircularProgress color="secondary" aria-label="progress with secondary color" />
                                                    </Grid>
                                                </Grid>
                                            )}
                                    </Grid>

                                    <Grid item xs={12} lg={3} sm={6}>
                                        {cotizacionDate.quotes ?
                                            (<HoverSocialCard
                                                primary="Peso Mexicano - Dolar"
                                                secondary={`$${(cotizacionDate.quotes.USDCNY).toFixed(2)}`}
                                                iconPrimary={MonetizationOnTwoToneIcon}
                                                color={theme.palette.secondary.dark}
                                            />) : (
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <Grid item style={{ textAlign: 'center', padding: '20px 0' }}>
                                                        <CircularProgress color="secondary" aria-label="progress with secondary color" />
                                                    </Grid>
                                                </Grid>
                                            )}
                                    </Grid>

                                    <Grid item xs={12} lg={3} sm={6}>
                                        {cotizacionDate.quotes ?
                                            (<HoverSocialCard
                                                primary="Yuanes - Dolar"
                                                secondary={`¥${(cotizacionDate.quotes.USDMXN).toFixed(2)}`}
                                                iconPrimary={MonetizationOnTwoToneIcon}
                                                color={theme.palette.warning.dark}
                                            />) : (
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <Grid item style={{ textAlign: 'center', padding: '20px 0' }}>
                                                        <CircularProgress color="secondary" aria-label="progress with secondary color" />
                                                    </Grid>
                                                </Grid>
                                            )}
                                    </Grid>

                                    <Grid item xs={12} lg={3} sm={6}>
                                        {cotizacionDate.quotes ?
                                            (<HoverSocialCard
                                                primary="Peso Colombiano - Dolar"
                                                secondary={`COL$${(cotizacionDate.quotes.USDCOP).toFixed(2)}`}
                                                iconPrimary={MonetizationOnTwoToneIcon}
                                                color={theme.palette.success.dark}
                                            />) : (
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <Grid item style={{ textAlign: 'center', padding: '20px 0' }}>
                                                        <CircularProgress color="secondary" aria-label="progress with secondary color" />
                                                    </Grid>
                                                </Grid>
                                            )}
                                    </Grid>

                                </Grid>
                            </Grid>
                            {autorizado &&

                                <Grid item xs={12}>
                                    <Grid container spacing={gridSpacing}>
                                        <Grid item xs={12} md={12}>

                                            <TotalGrowthBarChart isLoading={isLoading} countPerDate={countPerDate} />

                                        </Grid>
                                    </Grid>
                                </Grid>
                            }
                            {/* <Grid item xs={12} lg={4}>
                    <SubCard title="Basic Card Style 1">
                        <UserDetailsCard {...userDetails} />
                    </SubCard>
                </Grid> */}
                        </>
                    )}
            </Grid>
        </>
    )
}

export default Inicio;