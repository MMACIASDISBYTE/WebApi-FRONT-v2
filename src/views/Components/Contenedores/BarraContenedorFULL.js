import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles';
import { useTheme } from '@emotion/react';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


export function BarraContenedoresFULL({ value = 100, ent = 0, tipo, longitudBarra = '85%' }) {

    const [alarma, setAlarma] = useState(false);
    const [alarma20st, setAlarma20st] = useState(false);
    const [alarmaFrac, setAlarmaFrac] = useState(100);

    // Ajusta las alarmas basadas en las propiedades
    useEffect(() => {
        setAlarma(ent > 0);
        setAlarma20st(ent > 50);
        setAlarmaFrac(value > 90);
    }, [value, ent]);

    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 7,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: alarma ? "pink" : theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            // Aplica el color dependiendo de las condiciones de alarma y el valor
            backgroundColor: alarmaFrac ? "#f29c8f" : (value > 75 ? "#f0d6a5" : "#d4f2c2"),
        },
    }));

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 2 }}>
            <Box sx={{ width: `${longitudBarra}`, mr: 1 }}>
                <BorderLinearProgress variant="determinate" value={value} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">
                    {`${Math.round(value)}% de ${tipo}`}
                </Typography>
            </Box>
        </Box>
    );
}