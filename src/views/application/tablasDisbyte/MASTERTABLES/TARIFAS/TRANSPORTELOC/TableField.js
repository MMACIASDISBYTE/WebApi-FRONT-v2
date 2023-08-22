// Listed 17/7/2023 11:06
import { useTheme } from '@mui/material/styles';

import {
    TableCell,
    TextField,
    Typography
} from '@mui/material';

export function TableFieldEdit({ rows, setRows, index, field, text, editMode }) {
    const theme = useTheme();
    const labelId = `enhanced-table-checkbox-${index}`;
    const myRow = rows[index];
    return (
        <>
            {// Si esta en modo edicion, muestro un cuadro de ingreso de texto.
                // Por defecto muesto el valor señalado por "field" en la columna señalada por "index"
                // Cuando hacen click se actualiza el campo field de la columna apuntada.
                // Para ello se co´pian todas las columans de nuevo salvo la editada
                editMode ? (
                    <TableCell>
                        <TextField
                            id="outlined-basic1"
                            fullWidth label={text}
                            value={myRow[`${field}`]}
                            onChange={(e) => {
                                myRow[`${field}`] = e.target.value;
                                setRows((prevRows) =>
                                    prevRows.map((row, index) =>
                                        row.id === myRow.id ? myRow : row
                                    ));
                                console.log(`Se ha actualizado la tabla ${text}, ID ${myRow.id} campo ${field}`)
                                console.log(rows);
                            }}
                        />
                        {/* Cuando no esta edicion muetro un campo de texto nomas.*/}
                    </TableCell>
                ) : (
                    <TableCell
                        align="center"
                        component="th"
                        id={labelId}
                        scope="row"
                        sx={{ cursor: 'pointer' }}>
                        <Typography
                            variant="subtitle1"
                            sx={{ color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900' }}>
                            {' '}
                            {myRow[`${field}`]}{' '}
                        </Typography>
                    </TableCell>
                )
            }
        </>
    );
}
/*
{editRow[`${field}`]=value;
        setRows((myRows)=>{myRows.map((myRow)=>myRow.id===id?editRow:myRow)})
        console.log(rows);
        console.log(`El campo ${field} de la tabla ${nombreTabla} de la ID${id} se ha editado`);}*/