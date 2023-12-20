import { Button, Dialog, DialogActions, DialogContent, DialogContentText, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react'

export const ModalConfirmacion = ({open, close, handleCloseDialog}) => {

    const [message, setMensaje] = useState('¿Desea Cancelar la carga del producto?');
    const [confirmacion, setConfirmacion] = useState();

    useEffect(() => {
        console.log(confirmacion);
    }, [confirmacion])
    // // console.log('modal');

    const handleConfirmAndClose = () => {
      localStorage.removeItem('formData'); //limpia el storage
      handleCloseDialog();
    };
  return (
    <>
        <Grid item>
                <Dialog open={open}>
                  <DialogContent>
                    <DialogContentText
                      sx={{
                        fontWeight: 500,
                        color: `secondary.dark`,
                        minWidth: 200,
                      }}
                    >
                      {message}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions sx={{ pr: "20px" }}>
                      <Button
                        autoFocus
                        variant="contained"
                        onClick={handleConfirmAndClose}
                      >
                        Confirmar
                      </Button>
                      <Button
                        autoFocus
                        variant='contained'
                        color='error'
                        onClick={() =>  close()}
                      >
                        Cancelar
                      </Button>
                  </DialogActions>
                </Dialog>
              </Grid>
    </>
  )
}
