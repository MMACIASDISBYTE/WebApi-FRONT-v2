import { Link } from 'react-router-dom';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Button, Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';

// project imports
import { DASHBOARD_PATH } from 'config';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';

// assets
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';

// import image from 'assets/images/maintenance/img-build.svg';
import imageBackground from 'assets/images/maintenance/img-bg-grid.svg';
import imageDarkBackground from 'assets/images/maintenance/img-bg-grid-dark.svg';
import imageParts from 'assets/images/maintenance/img-bg-parts.svg';

import LogoDisbyte from '../../../assets/images/disbyte/LogoDisbyte.png';
import LogoDisbyteBlanco from '../../../assets/images/disbyte/LogoDisbyte_blanco.png';


// styles
const CardMediaWrapper = styled('div')({
    maxWidth: 720,
    margin: '0 auto',
    position: 'relative'
});

const PageContentWrapper = styled('div')({
    maxWidth: 350,
    margin: '0 auto',
    textAlign: 'center'
});

const CardMediaBuild = styled('img')({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    animation: '5s bounce ease-in-out infinite'
});

const CardMediaParts = styled('img')({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    animation: '10s blink ease-in-out infinite'
});

// ========================|| UNDER CONSTRUCTION PAGE ||======================== //

const NoAutorizado = () => {
    const theme = useTheme();

    const ConstructionCard = styled(Card)(({ theme }) => ({
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.mode === 'dark' ? '#154360' : '#FBEEE6',
    }));

    const CustomButton = styled(Button)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#A569BD' : '#85C1E9',
        '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? '#CCCCCC' : '#EEC200',
        },
    }));

    return (
        <ConstructionCard>
            <CardContent>
                <Grid container justifyContent="center" spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <CardMediaWrapper>
                            <CardMedia
                                component="img"
                                image={theme.palette.mode === 'dark' ? imageDarkBackground : imageBackground}
                                title="Slider 3 image"
                            />
                            <CardMediaParts src={imageParts} title="Slider 1 image" />
                            <CardMediaBuild src={theme.palette.mode === 'dark' ? LogoDisbyteBlanco : LogoDisbyte} title="Slider 2 image" />
                        </CardMediaWrapper>
                    </Grid>
                    <Grid item xs={12}>
                        <PageContentWrapper>
                            <Grid container spacing={gridSpacing}>
                                <Grid item xs={12}>
                                    <Typography variant="h1" component="div">
                                        No Autorizado
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2">
                                        No tiene los permisos para ingresar a este Sitio
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <AnimateButton>
                                        <CustomButton variant="contained" size="large" component={Link} to={DASHBOARD_PATH}>
                                            <HomeTwoToneIcon sx={{ fontSize: '1.3rem', mr: 0.75 }} /> Ir a Inicio
                                        </CustomButton>
                                    </AnimateButton>
                                </Grid>
                            </Grid>
                        </PageContentWrapper>
                    </Grid>
                </Grid>
            </CardContent>
        </ConstructionCard>
    );
};
export default NoAutorizado;
