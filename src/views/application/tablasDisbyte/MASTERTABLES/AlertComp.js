import { Alert, Button, DialogActions, Grid } from '@mui/material'
import React from 'react'
import { useTheme, styled } from '@mui/material/styles';

export const AlertComp = ({ handleCloseAlert }) => {
    const theme = useTheme();

    return (
        <>
            <Grid item xs={12}>
                <Alert
                    severity="error"
                    icon={false}
                    sx={{ color: theme.palette.warning.main }}
                    action={
                        <>
                            <Button color="inherit" size="small" onClick={handleCloseAlert}>
                                Cerrar
                            </Button>
                        </>
                    }
                >
                    Debe de completar los campos requeridos
                </Alert>
            </Grid>
        </>
    )
}
