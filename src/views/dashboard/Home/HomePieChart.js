import React, { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

// project import
import useConfig from 'hooks/useConfig';

//variable de estados
import { StatusEstadosEmbarque } from 'helpers/VariablesDeRepeticion';

//tomo todas las descripciones
const labels = StatusEstadosEmbarque.map( estado => estado.description);

// chart options
const pieChartOptions = {
    chart: {
        type: 'pie',
        width: 450,
        height: 450
    },
    labels: labels, //aqui utilizamos el array de lebels generado por el map
    legend: {
        show: true,
        fontFamily: `'Roboto', sans-serif`,
        offsetX: 10,
        offsetY: 10,
        labels: {
            useSeriesColors: false
        },
        markers: {
            width: 12,
            height: 12,
            radius: 5
        },
        itemMargin: {
            horizontal: 25,
            vertical: 4
        }
    },
    responsive: [
        {
            breakpoint: 450,
            chart: {
                width: 280,
                height: 280
            },
            options: {
                legend: {
                    show: false,
                    position: 'bottom'
                }
            }
        }
    ]
};

// ==============================|| PIE CHART ||============================== //

const HomePieChart = ({inboundData}) => {
    const theme = useTheme();
    const { navType } = useConfig();

    // console.log('inboundData :', inboundData);

    let AcumuladorEstados = { 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 'mayorA6': 0 };

    useEffect(() => {
        // Asegúrate de que inboundData no está vacío y es un array
        if (Array.isArray(inboundData) && inboundData.length > 0) {
            // Realiza el conteo
            inboundData.forEach(item => {
                const statusNumber = Number(item.status); // Asegurarse de que status es un número
                if (statusNumber >= 2 && statusNumber <= 6) {
                    AcumuladorEstados[statusNumber]++;
                } else if (statusNumber > 6) {
                    AcumuladorEstados['mayorA6']++;
                }
            });
        };
    }, [inboundData])

    // console.log(AcumuladorEstados);

    const { primary } = theme.palette.text;
    const darkLight = theme.palette.dark.light;
    const grey200 = theme.palette.grey[200];
    const backColor = theme.palette.background.paper;

    // const [series] = useState([44, 55, 13, 43, 22, 33]);
    // Asegúrate de usar el estado para series
    const [series, setSeries] = useState([44, 55, 13, 43, 22, 33]);

    // Actualiza el estado de series una vez que tengas los conteos finales
    useEffect(() => {
        setSeries([
            AcumuladorEstados[2],
            AcumuladorEstados[3],
            AcumuladorEstados[4],
            AcumuladorEstados[5],
            AcumuladorEstados[6],
            AcumuladorEstados['mayorA6']
        ]);
    }, [inboundData]);
    
    const [options, setOptions] = useState(pieChartOptions);

    const secondary = theme.palette.secondary.main;
    const primaryMain = theme.palette.primary.main;
    const successDark = theme.palette.success.dark;
    const error = theme.palette.error.main;
    const warningDark = theme.palette.warning.dark;
    const orangeDark = theme.palette.orange.dark;

    React.useEffect(() => {
        setOptions((prevState) => ({
            ...prevState,
            colors: [secondary, primaryMain, successDark, error, warningDark, orangeDark],
            xaxis: {
                labels: {
                    style: {
                        colors: [primary, primary, primary, primary, primary, primary, primary]
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: [primary]
                    }
                }
            },
            grid: {
                borderColor: navType === 'dark' ? darkLight + 20 : grey200
            },
            legend: {
                labels: {
                    colors: 'grey.500'
                }
            },
            stroke: {
                colors: [backColor]
            }
        }));
    }, [navType, primary, darkLight, grey200, backColor, secondary, primaryMain, successDark, error, warningDark, orangeDark]);

    return (
        <div id="chart">
            <ReactApexChart options={options} series={series} type="pie" />
        </div>
    );
};

export default HomePieChart;
