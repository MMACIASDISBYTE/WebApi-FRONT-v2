import PropTypes from "prop-types";
import { useEffect, useState } from "react";

// material-ui
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

// project imports
import { gridSpacing } from "store/constant";

// ==============================|| ADD ITEM PAGE ||============================== //
//
let counter = 0; // Esto debería estar fuera de la función del componente para que no se reinicie en cada render

function AddItemPage({ handleAddItem, setAddItemClicked, dataHelp }) {
  const itemDetails = [
    {
      id: "sku",
      name: "sku",
      em: "Ingrese un sku",
      data: "String",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: false,
    },
    {
      id: "description",
      name: "description",
      em: "Ingrese una Descripcion",
      data: "String",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: false,
    },
    {
      id: "proveedores_id",
      name: "proveedores_id",
      em: "Ingrese un Proveedor",
      data: dataHelp.proveedoresOem,
      xs_md: [12, 3],
      isDisabled: false,
      oculto: false,
    },
    {
      id: "ncm_id",
      name: "ncm_id",
      em: "Ingrese una Descripcion",
      data: dataHelp.NCM,
      xs_md: [12, 3],
      isDisabled: false,
      oculto: false,
    },
    {
      id: "ncm_ack",
      name: "ncm_ack",
      em: "Ingrese una Descripcion",
      data: "Bool",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: false,
    },
    {
      id: "imageurl",
      name: "imageurl",
      em: "Ingrese un URL de imageurl",
      data: "URL",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "exw_u",
      name: "exw_u",
      em: "Ingrese un exw_u",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: false,
    },
    {
      id: "fob_u",
      name: "fob_u",
      em: "Ingrese un fob U.",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: false,
    },
    {
      id: "qty",
      name: "qty",
      em: "Ingrese una Cantidad",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: false,
    },
    {
      id: "pcsctn",
      name: "pcsctn",
      em: "Ingrese una pcsctn",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: false,
    },
    {
      id: "cbmctn",
      name: "cbmctn",
      em: "Ingrese una cbmctn",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: false,
    },
    {
      id: "gwctn",
      name: "gwctn",
      em: "Ingrese una gwctn",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: false,
    },
    {
      id: "cambios_notas",
      name: "cambios_notas",
      em: "Ingrese una cambios notas",
      data: "String",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "ncm_arancel",
      name: "ncm_arancel",
      em: "Ingrese una cambios Arancel NCM",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "ncm_te_dta_otro",
      name: "ncm_te_dta_otro",
      em: "Ingrese una ncm_te_dta_otro",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "ncm_iva",
      name: "ncm_iva",
      em: "Ingrese una ncm_iva",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "ncm_ivaad",
      name: "ncm_ivaad",
      em: "Ingrese una ncm_ivaad",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "gcias",
      name: "gcias",
      em: "Ingrese una gcias",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "ncm_sp1",
      name: "ncm_sp1",
      em: "Ingrese una ncm_sp1",
      data: "String",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "ncm_sp2",
      name: "ncm_sp2",
      em: "Ingrese una ncm_sp2",
      data: "String",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "precio_u",
      name: "precio_u",
      em: "Ingrese una precio_u",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "extrag_comex1",
      name: "extrag_comex1",
      em: "Ingrese un Extra gasto comex",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "extrag_comex2",
      name: "extrag_comex2",
      em: "Ingrese un Extra gasto comex",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "extrag_comex3",
      name: "extrag_comex3",
      em: "Ingrese un Extra gasto comex",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "extrag_comex_notas",
      name: "extrag_comex_notas",
      em: "Ingrese una Nota de Extra gasto comex",
      data: "String",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "extrag_local1",
      name: "extrag_local1",
      em: "Ingrese un Extra gasto local",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "extrag_local2",
      name: "extrag_local2",
      em: "Ingrese un Extra gasto local",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "extrag_finan1",
      name: "extrag_finan1",
      em: "Ingrese un Extra gasto Financiero",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "extrag_finan2",
      name: "extrag_finan2",
      em: "Ingrese un Extra gasto Financiero",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "extrag_finan3",
      name: "extrag_finan3",
      em: "Ingrese un Extra gasto Financiero",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "extrag_finan_notas",
      name: "extrag_finan_notas",
      em: "Ingrese una nota de Extra gasto Financiero",
      data: "String",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "costo_u_est",
      name: "costo_u_est",
      em: "Ingrese un costo_u_est",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "costo_u",
      name: "costo_u",
      em: "Ingrese un costo_u",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "updated",
      name: "updated",
      em: "Ingrese un updated",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "htimestamp",
      name: "htimestamp",
      em: "Ingrese una Fecha",
      data: "Date",
      xs_md: [12, 3],
      isDisabled: true,
      oculto: false,
    },
  ];

  const [selectedItem, setSelectedItem] = useState({
    id: "",
    description: "",
    qty: 0,
    ncm_id: "",
    gwctn: "",
    pcsctn: "",
    cbmctn: "",
    proveedores_id: null,
    sku: "",
  });

  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [qty, setQty] = useState(0);
  const [errors, setErrors] = useState({
    quantityError: "",
  });
  console.log(dataHelp);
  console.log(dataHelp.NCM);

  const NCMList = dataHelp.NCM.map((item) => ({
    id: item.id,
    description: item.description,
    ncm_id: item.id,
    ncm_code: item.code,
    gwctn: item.gwctn,
    cbmctn: item.cbmctn,
    pcsctn: item.pcsctn,
  }));

  const ProveedoresList = dataHelp.proveedoresOem.map((item) => ({
    id: item.id,
    description: item.description,
    // ncm_id: item.id,
    // ncm_code: item.code,
    // gwctn: item.gwctn,
    // cbmctn: item.cbmctn,
    // pcsctn: item.pcsctn,
  }));

  useEffect(() => {
    if (selectedItem?.qty) {
      setQty(selectedItem.qty * selectedQuantity);
    }
  }, [selectedQuantity, selectedItem]);

  //   const handleChange = (event) => {
  //     const value = event.target.value;
  //     if (event.target.name === "quantity") {
  //       if (Number(value) < 0) {
  //         setErrors({
  //           ...errors,
  //           quantityError: "negative values not allowed",
  //         });
  //         setSelectedQuantity(value);
  //       } else if (Number(value) === 0) {
  //         setErrors({
  //           ...errors,
  //           quantityError: "quantity can not be zero",
  //         });
  //         setSelectedQuantity(value);
  //       } else {
  //         setSelectedQuantity(value);
  //         setErrors({
  //           ...errors,
  //           quantityError: "",
  //         });
  //       }
  //     } else {
  //       const selectedOption = NCMList.find((item) => item.id === value);
  //       setSelectedItem({
  //         ...selectedItem,
  //         id: selectedOption.id++,
  //         ncm_id: selectedOption.ncm_id,
  //         ncm_code: selectedOption.ncm_code,
  //       });
  //       console.log(selectedItem);
  //     }
  //   };

  const handleChange = (event) => {
    const value = event.target.value;
    if (event.target.name === "quantity") {
      setErrors({
        ...errors,
        quantityError: "negative values not allowed",
      });
      setSelectedQuantity(value);
    } else {
      let selectedList;
      let selectedData = {};
      if (event.target.name === "ncm_id") {
        selectedList = NCMList;
        selectedData = {
          ncm_id: "id",
          ncm_code: "ncm_code",
          // otros campos relevantes aquí
        };
      } else if (event.target.name === "proveedores_id") {
        selectedList = ProveedoresList;
        selectedData = {
          proveedores_id: "id",
          // otros campos relevantes aquí
        };
      }
      const selectedOption = selectedList.find((item) => item.id === value);
      let updatedSelectedItem = { ...selectedItem };
      Object.keys(selectedData).forEach((key) => {
        updatedSelectedItem[key] = selectedOption[selectedData[key]];
      });
      setSelectedItem(updatedSelectedItem);
    }
  };

  const handleOk = () => {
    let errors = {}; // creo objeto de errores
    // validación de campos
    // Validacion NCM
    if (!selectedItem?.ncm_id) {
      errors.NCMError = "NCM is required";
    }
    if (!selectedItem?.proveedores_id) {
      errors.ProveedoresError = "Proveedor is required";
    }
    // Validacion producto
    if (!selectedItem?.description || !selectedItem?.description.trim()) {
      errors.productError = "Product Name is required";
    }
    // Validacion FOb unitario
    if (!selectedItem?.qty || selectedItem?.qty <= 0) {
      errors.ValorFOBunitError = "Value Fob is required";
    }
    // Validacion Valor unitario
    if (!selectedItem?.gwctn || selectedItem?.gwctn <= 0) {
      errors.ValorUnitError = "Value is required";
    }
    // Validacion Vol x caja
    if (!selectedItem?.cbmctn || selectedItem?.cbmctn <= 0) {
      errors.cbmxCajaError = "Value Vol. x caja is required";
    }
    // Validacion Piezas x caja
    if (!selectedItem?.pcsctn || selectedItem?.pcsctn <= 0) {
      errors.pcsxCajaError = "Value Pieza x caja is required";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors); // actualizamos los errores de validación en el estado
      return;
    }

    counter++;
    const data = {
      ...selectedItem,
      id: counter, // Aquí es donde generas el nuevo id
      totalAmount: qty,
      selectedQuantity,
    };

    console.log(data);
    handleAddItem(data);
  };

  return (
    <>
      <Grid container spacing={gridSpacing}>
      {/* PRODUCTO */}
        <Grid item xs={12} md={6}>
          <Stack spacing={1}>
            <Typography variant="subtitle1">Producto</Typography>
            <FormControl>
              <tooltip title="Producto a importar">
                <TextField
                  fullWidth
                  displayEmpty
                  error={Boolean(errors.productError)}
                  value={selectedItem?.description || ""}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter Product Name"
                />
              </tooltip>
              {errors.productError && (
                <FormHelperText>{errors.productError}</FormHelperText>
              )}{" "}
              {/* alerta de MANEJO DEL ERROR */}
            </FormControl>
          </Stack>
        </Grid>

        {/* SKU */}
        <Grid item xs={12} md={3}>
          <Stack spacing={1}>
            <Typography variant="subtitle1">Sku</Typography>
            <FormControl>
              <tooltip title="Sku a importar">
                <TextField
                  fullWidth
                  displayEmpty
                  error={Boolean(errors.productError)}
                  value={selectedItem?.sku || ""}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      sku: e.target.value,
                    })
                  }
                  placeholder="Enter Sku Name"
                />
              </tooltip>
              {errors.productError && (
                <FormHelperText>{errors.productError}</FormHelperText>
              )}{" "}
              {/* alerta de MANEJO DEL ERROR */}
            </FormControl>
          </Stack>
        </Grid>

        {/* Select PROVEEDORES */}
        <Grid item xs={12} md={3}>
          <Stack spacing={1}>
            <Typography variant="subtitle1">Proveedores</Typography>
            <FormControl fullWidth error={Boolean(errors.ProveedoresError)}>
              <Select
                name="proveedores_id"
                fullWidth
                displayEmpty
                value={selectedItem?.proveedores_id || ""}
                onChange={handleChange}
                input={<OutlinedInput />}
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return (
                      <Typography
                        color="textSecondary"
                        sx={{ lineHeight: "1.4375em" }}
                      >
                        Select Proveedor
                      </Typography>
                    );
                  }
                  const selectedData = ProveedoresList.filter(
                    (item) => item.id === selected
                  )[0];
                  return (
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ width: "100%" }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ lineHeight: "1.4375em" }}
                      >
                        {selectedData.description}
                      </Typography>
                      <Typography>Id : {selectedData.id}</Typography>
                    </Stack>
                  );
                }}
                inputProps={{ "aria-label": "Without label" }}
              >
                <MenuItem disabled value="">
                  <Typography color="textSecondary">Select NCM</Typography>
                </MenuItem>
                {ProveedoresList.map((item, i) => (
                  <MenuItem key={i} value={item.id}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ width: "100%" }}
                    >
                      <Typography variant="subtitle1">
                        {item.description}
                      </Typography>
                      <Typography>id : {item.id}</Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
              {errors.ProveedoresError && (
                <FormHelperText>{errors.ProveedoresError}</FormHelperText>
              )}{" "}
              {/* alerta de MANEJO DEL ERROR */}
            </FormControl>
          </Stack>
        </Grid>

        {/* POSICION ARANCELARIA // NCM */}
        <Grid item xs={12} md={6}>
          <Stack spacing={1}>
            <Typography variant="subtitle1">NCM</Typography>
            <FormControl fullWidth error={Boolean(errors.NCMError)}>
              <Select
                name="ncm_id"
                fullWidth
                displayEmpty
                value={selectedItem?.ncm_id || ""}
                onChange={handleChange}
                input={<OutlinedInput />}
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return (
                      <Typography
                        color="textSecondary"
                        sx={{ lineHeight: "1.4375em" }}
                      >
                        Select NCM
                      </Typography>
                    );
                  }
                  const selectedData = NCMList.filter(
                    (item) => item.id === selected
                  )[0];
                  return (
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ width: "100%" }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ lineHeight: "1.4375em" }}
                      >
                        {selectedData.description}
                      </Typography>
                      <Typography>Code : {selectedData.ncm_code}</Typography>
                    </Stack>
                  );
                }}
                inputProps={{ "aria-label": "Without label" }}
              >
                <MenuItem disabled value="">
                  <Typography color="textSecondary">Select NCM</Typography>
                </MenuItem>
                {NCMList.map((item, i) => (
                  <MenuItem key={i} value={item.id}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ width: "100%" }}
                    >
                      <Typography variant="subtitle1">
                        {item.description}
                      </Typography>
                      <Typography>Code : {item.code}</Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
              {errors.NCMError && (
                <FormHelperText>{errors.NCMError}</FormHelperText>
              )}{" "}
              {/* alerta de MANEJO DEL ERROR */}
            </FormControl>
          </Stack>
        </Grid>

        {/* CANTIDAD */}
        <Grid item xs={12} md={3}>
          <Stack spacing={1}>
            <Typography variant="subtitle1" id="itemQuantity">
              Cantidad de Piezas a Imp
            </Typography>
            <FormControl>
              <tooltip title="Cantidad de piezas a importar">
                <TextField
                  fullWidth
                  type="number"
                  name="quantity"
                  value={selectedQuantity}
                  onChange={handleChange}
                  error={Boolean(errors.quantityError)}
                  helperText={errors.quantityError}
                  inputProps={{ style: { textAlign: "right" } }} // Aquí se alinea el texto a la derecha
                  // disabled={!selectedItem?.id}
                />
              </tooltip>
            </FormControl>
          </Stack>
        </Grid>

        {/* VALOR UNITARIO */}
        <Grid item xs={12} md={3}>
          <Stack spacing={1}>
            <Typography variant="subtitle1">FOB u$s</Typography>
            <FormControl>
              <tooltip title="Valor en u$s de una pieza en Origen">
                <TextField
                  fullWidth
                  type="number"
                  name="ValorFOBunit"
                  value={selectedItem?.qty || ""}
                  onChange={(e) =>
                    setSelectedItem({ ...selectedItem, qty: e.target.value })
                  }
                  error={Boolean(errors.ValorFOBunitError)}
                  placeholder="Enter Product Value"
                  inputProps={{ style: { textAlign: "right" } }} // Aquí se alinea el texto a la derecha
                />
              </tooltip>
              {errors.ValorFOBunitError && (
                <FormHelperText>{errors.ValorFOBunitError}</FormHelperText>
              )}{" "}
              {/* alerta de MANEJO DEL ERROR */}
            </FormControl>
          </Stack>
        </Grid>

        {/* PESO UNITARIO CAJA */}
        <Grid item xs={12} md={2}>
          <Stack spacing={1}>
            <Typography variant="subtitle1">Peso U. x caja</Typography>
            <FormControl>
              <tooltip title="Peso unitario por caja">
                <TextField
                  fullWidth
                  type="number"
                  name="ValorUnit"
                  displayEmpty
                  value={selectedItem?.gwctn || ""}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      gwctn: e.target.value,
                    })
                  }
                  error={Boolean(errors.ValorUnitError)}
                  placeholder="Enter Peso Unitario"
                  inputProps={{ style: { textAlign: "right" } }} // Aquí se alinea el texto a la derecha
                />
              </tooltip>
              {errors.ValorUnitError && (
                <FormHelperText>{errors.ValorUnitError}</FormHelperText>
              )}{" "}
              {/* alerta de MANEJO DEL ERROR */}
            </FormControl>
          </Stack>
        </Grid>

        {/* CMB x CAJA (volumen x caja) */}
        <Grid item xs={12} md={2}>
          <Stack spacing={1}>
            <Typography variant="subtitle1">Volumen x caja</Typography>
            <FormControl>
              <tooltip title="Volumen por caja en contenedor">
                <TextField
                  fullWidth
                  type="number"
                  name="cbmctn"
                  displayEmpty
                  value={selectedItem?.cbmctn || ""}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      cbmctn: e.target.value,
                    })
                  }
                  error={Boolean(errors.cbmxCajaError)}
                  placeholder="Enter Peso Unitario"
                  inputProps={{ style: { textAlign: "right" } }} // Aquí se alinea el texto a la derecha
                />
              </tooltip>
              {errors.cbmxCajaError && (
                <FormHelperText>{errors.cbmxCajaError}</FormHelperText>
              )}{" "}
              {/* alerta de MANEJO DEL ERROR */}
            </FormControl>
          </Stack>
        </Grid>

        {/* Piezas x CAJA (volumen x caja) */}
        <Grid item xs={12} md={2}>
          <Stack spacing={1}>
            <Typography variant="subtitle1">Piezas x caja</Typography>
            <FormControl>
              <tooltip title="Piezas por cajas">
                <TextField
                  fullWidth
                  type="number"
                  name="pcsctn"
                  displayEmpty
                  value={selectedItem?.pcsctn || ""}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      pcsctn: e.target.value,
                    })
                  }
                  error={Boolean(errors.pcsxCajaError)}
                  placeholder="Enter Peso Unitario"
                  inputProps={{ style: { textAlign: "right" } }} // Aquí se alinea el texto a la derecha
                />
              </tooltip>
              {errors.pcsxCajaError && (
                <FormHelperText>{errors.pcsxCajaError}</FormHelperText>
              )}{" "}
              {/* alerta de MANEJO DEL ERROR */}
            </FormControl>
          </Stack>
        </Grid>

        {/* CANTIDAD fob total */}
        {/* <Grid item xs={12} md={4}>
                    <Stack spacing={1}>
                        <Typography variant="subtitle1" id="itemAmount">
                            FOB Total
                        </Typography>
                        <TextField fullWidth name="qty" value={qty} disabled />
                    </Stack>
                </Grid> */}

        <Grid item container justifyContent="flex-end">
          <Stack direction="row" spacing={1} alignItems="center">
            <Button color="error" onClick={() => setAddItemClicked(false)}>
              Cancel
            </Button>
            <Button
              // disabled={!selectedItem?.id || !selectedQuantity || Boolean(errors.quantityError)}
              variant="contained"
              size="small"
              onClick={handleOk}
            >
              Agregar
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

AddItemPage.propTypes = {
  handleAddItem: PropTypes.func,
  setAddItemClicked: PropTypes.func,
};

export default AddItemPage;
