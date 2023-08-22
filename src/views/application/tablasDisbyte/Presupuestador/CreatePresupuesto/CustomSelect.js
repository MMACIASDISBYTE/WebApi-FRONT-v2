import React from 'react';
import { Grid, Stack, Select, MenuItem, FormHelperText } from '@mui/material';
import InputLabel from 'ui-component/extended/Form/InputLabel';

export const CustomSelect = ({ id, name, em, inputLabel, data, formik }) => {

    return (
        <>
            <Grid item xs={12} md={3}>
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
                            data && data.length > 0
                                ? data.map((item) =>
                                    <MenuItem key={item.id} value={item}>{item.description}</MenuItem>
                                )
                                : <MenuItem value="">Sin datos</MenuItem>
                        }
                    </Select>
                    {formik.errors[name] && <FormHelperText error>{formik.errors[name]}</FormHelperText>}
                </Stack>
            </Grid>
        </>
    )
};