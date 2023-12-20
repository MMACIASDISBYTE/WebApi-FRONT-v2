import React, { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

// project import
import useConfig from 'hooks/useConfig';

// chart options
const redialBarChartOptions = {
    chart: {
        type: 'radialBar',
        width: 450,
        height: 450
    },
    plotOptions: {
        radialBar: {
            offsetY: 0,
            startAngle: 0,
            endAngle: 270,
            hollow: {
                margin: 5,
                size: '30%',
                background: 'transparent',
                image: undefined
            },
            dataLabels: {
                name: {
                    show: false
                },
                value: {
                    show: false
                }
            }
        }
    },
    labels: [ '20S', '40ST', '40HQ', 'LCL', '2*40ST', '2*20ST', '2*40HQ', 'otros' ],
    legend: {
        show: true,
        floating: true,
        fontSize: '16px',
        position: 'left',
        offsetX: 0,
        offsetY: 15,
        labels: {
            useSeriesColors: true
        },
        markers: {
            size: 0
        },
        formatter(seriesName, opts) {
            return `${seriesName}:  ${opts.w.globals.series[opts.seriesIndex]}`;
        },
        itemMargin: {
            vertical: 3
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

// ==============================|| RADIAL BAR CHART ||============================== //

const HomeReialChart = ({sourcingData}) => {
    const theme = useTheme();
    const { navType } = useConfig();

    let AcumuladorEstados = {
        '20ST':0, 
        '40ST':0, 
        '40HQ': 0, 
        'LCL': 0, 
        '2*40ST': 0, 
        '2*20ST': 0, 
        '2*40HQ': 0, 
        'otros': 0
    };


    useEffect(() => {
        // console.log('Sourcing Data :', sourcingData);

        // Asegúrate de que sourcingData no está vacío y es un array
        if (Array.isArray(sourcingData) && sourcingData.length > 0) {
            // Realiza el conteo
            sourcingData.forEach(item => {
                const cargaNumber = Number(item.carga_id); // Asegurarse de que carga_id es un número
                if (cargaNumber === 1) {
                    AcumuladorEstados['20ST']++;
                } else if (cargaNumber === 2 ) {
                    AcumuladorEstados['40ST']++;
                } else if (cargaNumber === 3 ) {
                    AcumuladorEstados['40HQ']++;
                } else if (cargaNumber === 6 ) {
                    AcumuladorEstados['LCL']++;
                } else if (cargaNumber === 12 ) {
                    AcumuladorEstados['2*40ST']++;
                } else if (cargaNumber === 11 ) {
                    AcumuladorEstados['2*20ST']++;
                } else if (cargaNumber === 13 ) {
                    AcumuladorEstados['2*40HQ']++;
                } else{
                    AcumuladorEstados['otros']++;
                }
            });
        };
    }, [sourcingData])

    const { primary } = theme.palette.text;
    const darkLight = theme.palette.dark.light;
    const grey200 = theme.palette.grey[200];

    // const [series] = useState([76, 67, 61, 90]);

    // Asegúrate de usar el estado para series
    const [series, setSeries] = useState([44, 55, 13, 43, 22, 33]);

    // Actualiza el estado de series una vez que tengas los conteos finales
    useEffect(() => {
        setSeries([
            AcumuladorEstados['20ST'],
            AcumuladorEstados['40ST'],
            AcumuladorEstados['40HQ'],
            AcumuladorEstados['LCL'],
            AcumuladorEstados['2*40ST'],
            AcumuladorEstados['2*20ST'],
            AcumuladorEstados['2*40HQ'],
            AcumuladorEstados['otros']
        ]);
    }, [sourcingData]);

    const [options, setOptions] = useState(redialBarChartOptions);

    const secondary = theme.palette.secondary.main;
    const primaryMain = theme.palette.primary.main;
    const successDark = theme.palette.success.dark;
    const error = theme.palette.error.main;

    React.useEffect(() => {
        setOptions((prevState) => ({
            ...prevState,
            colors: [secondary, primaryMain, successDark, error],
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
            plotOptions: {
                radialBar: {
                    track: {
                        background: navType === 'dark' ? darkLight + 20 : grey200
                    }
                }
            }
        }));
    }, [navType, primary, darkLight, grey200, secondary, primaryMain, successDark, error]);

    return (
        <div id="chart">
            <ReactApexChart options={options} series={series} type="radialBar" />
        </div>
    );
};

export default HomeReialChart;
