import React from 'react';
import { Grid, Stack, Select, MenuItem, FormHelperText } from '@mui/material';
import InputLabel from 'ui-component/extended/Form/InputLabel';

export const CustomSelect = ({ id, name, em, inputLabel, data, formik, XS=12,  MD=3, PaisRegion = null }) => {

    // console.log(PaisRegion);
    // Filtramos los datos basados en paisregion_id
    const filteredData = data.filter((item) => {
        if (item.hasOwnProperty('paisregion_id')) {
            return item.paisregion_id === PaisRegion;
        }
        return true; // De lo contrario, lo mostramos como está.
    });
    return (
        <>
            <Grid item xs={XS} md={MD}>
                <Stack>
                    <InputLabel required>{inputLabel}</InputLabel>
                    <Select
                        id={id}
                        name={name}
                        displayEmpty
                        value={formik.values[name] || ''}
                        onBlur={formik.handleBlur}
                        error={formik.touched[name] && Boolean(formik.errors[name])}
                        helperText={formik.touched[name] && formik.errors[name]}
                        onChange={formik.handleChange}
                        renderValue={(selected) => {
                            if (!selected || Object.keys(selected).length === 0) {
                                return <em>{em}</em>;
                            }
                            return selected.description;
                        }}
                    >
                        <MenuItem disabled value="">
                            <em>{em}</em>
                        </MenuItem>
                        {
                            filteredData && filteredData.length > 0
                                ? filteredData.map((item) =>
                                    <MenuItem key={item.id} value={item}>
                                        {item.description} {item.paisregion_id ? ` - ${item.paisregion_id}`: ''} {item.region ? ` - ${item.region}` : ''}
                                    </MenuItem>
                                )
                                : <MenuItem value="">Sin datos</MenuItem>
                        }
                        {/* {
                            data && data.length > 0
                                ? data.map((item) =>
                                    <MenuItem key={item.id} value={item}>{item.description} {item.paisregion_id ? ` - ${item.paisregion_id}`: ''} {item.region ? ` - ${item.region}` : ''}</MenuItem>
                                )
                                : <MenuItem value="">Sin datos</MenuItem>
                        } */}
                    </Select>
                    {formik.errors[name] && <FormHelperText error>{formik.errors[name]}</FormHelperText>}
                </Stack>
            </Grid>
        </>
    )
};