import React from 'react'
import { Grid, Stack, Select, MenuItem, FormHelperText } from '@mui/material';
import InputLabel from 'ui-component/extended/Form/InputLabel';

export const CustomSelectUpdate = ({
    id,
    name,
    em,
    inputLabel,
    data,
    dataType,
    selected_id,
    selected_description,
    formik,
    XS,
    MD,
}) => {

    const defaultValue = {
        id: selected_id || "",
        description: selected_description || "Sin Data"
    };
    console.log(data);

    return (
        <>
            <Grid item xs={XS} md={MD}>
                <Stack>
                    <InputLabel required>{inputLabel}</InputLabel>
                    <Select
                        id={id}
                        name={name}
                        displayEmpty
                        defaultValue=""
                        value={formik.values[name] || ''}
                        onBlur={formik.handleBlur}
                        error={formik.touched[name] && Boolean(formik.errors[name])}
                        helperText={formik.touched[name] && formik.errors[name]}
                        onChange={formik.handleChange}
                        renderValue={(selected) => {
                            if (!selected || Object.keys(selected).length === 0) {
                                selected = defaultValue;
                                formik.values[name] = selected;
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
                                ? dataType === 'objectArray'
                                    ? data.map((item) => <MenuItem key={item.id} value={item}>{item.description}</MenuItem>)
                                    : dataType === 'stringArray'
                                        ? data[0].map((item, index) => <MenuItem key={index} value={item}>{item}</MenuItem>)
                                        : <MenuItem value="">Sin datos</MenuItem>
                                : <MenuItem value="">Sin datos</MenuItem>
                        }
                        {/* {
                            data && data.length > 0
                                ? data.map((item) => <MenuItem key={item.id} value={item}>{item.description}</MenuItem>)
                                : <MenuItem value="">Sin datos</MenuItem>
                        } */}
                    </Select>
                    {formik.errors[name] && <FormHelperText error>{formik.errors[name]}</FormHelperText>}
                </Stack>
            </Grid>
        </>
    )
};
