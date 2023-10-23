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
  Tooltip,
  Typography,
} from "@mui/material";

// project imports
import { gridSpacing } from "store/constant";
import { UtilidadesHelper } from "helpers/UtilidadesHelper";

// ==============================|| ADD ITEM PAGE ||============================== //
//
let counter = 0; // Esto debería estar fuera de la función del componente para que no se reinicie en cada render

function AddItemPage({ handleAddItem, setAddItemClicked, dataHelp, formik = null }) {
  const itemDetails = [
    {
      id: "sku",
      name: "sku",
      inputName: "Sku",
      em: "Ingrese un sku",
      data: "String",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: false,
    },
    {
      id: "description",
      name: "description",
      inputName: "Descripcion",
      em: "Ingrese una Descripcion",
      data: "String",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: false,
    },
    // {
    //   id: "proveedores_id",
    //   name: "proveedores_id",
    //   inputName: '',
    //   em: "Ingrese un Proveedor",
    //   data: dataHelp.proveedoresOem,
    //   xs_md: [12, 3],
    //   isDisabled: false,
    //   oculto: false,
    // },
    // {
    //   id: "ncm_id",
    //   name: "ncm_id",
    //   inputName: '',
    //   em: "Ingrese una Descripcion",
    //   data: dataHelp.NCM,
    //   xs_md: [12, 3],
    //   isDisabled: false,
    //   oculto: false,
    // },
    {
      id: "ncm_ack",
      name: "ncm_ack",
      inputName: "NCM ack",
      em: "Ingrese una Descripcion",
      data: "Bool",
      xs_md: [12, 3],
      isDisabled: true,
      oculto: true,
    },
    {
      id: "imageurl",
      name: "imageurl",
      inputName: "URL de Imagen",
      em: "Ingrese una URL",
      data: "URL",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "exw_u",
      name: "exw_u",
      inputName: "EXW Unit .[USD]",
      em: "Ingrese exw_u",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: false,
    },
    {
      id: "fob_u",
      name: "fob_u",
      inputName: "FOB u.",
      em: "Ingrese un fob U.",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: false,
    },
    {
      id: "qty",
      name: "qty",
      inputName: "Cant. PCS",
      em: "Ingrese N° Entero de Cant. PCS",
      data: "Number",
      alerta: "Debe de ingresar un numero entero",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: false,
    },
    {
      id: "pcsctn",
      name: "pcsctn",
      inputName: "PCS x Caja",
      em: "Ingrese N° Entero de PCS x Caja",
      alerta: "Debe de ingresar un numero entero",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: false,
    },
    {
      id: "cbmctn",
      name: "cbmctn",
      inputName: "CBM x Caja",
      em: "Ingrese CBM x Caja",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: false,
    },
    {
      id: "gwctn",
      name: "gwctn",
      inputName: "Peso x Caja",
      em: "Ingrese Peso x Caja",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: false,
    },
    {
      id: "cambios_notas",
      name: "cambios_notas",
      inputName: "Notas de cambios",
      em: "Ingrese una notas de cambios",
      data: "String",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "ncm_arancel",
      name: "ncm_arancel",
      inputName: "Cambios Arancelarios",
      em: "Ingrese una cambios Arancel NCM",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "ncm_te_dta_otro",
      name: "ncm_te_dta_otro",
      inputName: "",
      em: "Ingrese una ncm_te_dta_otro",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "ncm_iva",
      name: "ncm_iva",
      inputName: "NCM Iva",
      em: "Ingrese una NCM Iva",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "ncm_ivaad",
      name: "ncm_ivaad",
      inputName: "NCM Iva Adicional",
      em: "Ingrese una NCM Iva Adicional",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "gcias",
      name: "gcias",
      inputName: "Ganancias",
      em: "Ingrese una Ganancia",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "ncm_sp1",
      name: "ncm_sp1",
      inputName: "NCM sp1",
      em: "Ingrese una ncm_sp1",
      data: "String",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "ncm_sp2",
      name: "ncm_sp2",
      inputName: "NCM sp2",
      em: "Ingrese una ncm_sp2",
      data: "String",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "precio_u",
      name: "precio_u",
      inputName: "",
      em: "Ingrese una precio_u",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "extrag_comex1",
      name: "extrag_comex1",
      inputName: "Extra gasto comex",
      em: "Ingrese un Extra gasto comex",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "extrag_comex2",
      name: "extrag_comex2",
      inputName: "Extra gasto comex 2",
      em: "Ingrese un Extra gasto comex",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "extrag_comex3",
      name: "extrag_comex3",
      inputName: "Extra gasto comex 3",
      em: "Ingrese un Extra gasto comex",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "extrag_comex_notas",
      name: "extrag_comex_notas",
      inputName: "Nota Extra gasto comex",
      em: "Ingrese una Nota de Extra gasto comex",
      data: "String",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "extrag_local1",
      name: "extrag_local1",
      inputName: "Extra gasto local",
      em: "Ingrese un Extra gasto local",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "extrag_local2",
      name: "extrag_local2",
      inputName: "Extra gasto local 2",
      em: "Ingrese un Extra gasto local",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "extrag_finan1",
      name: "extrag_finan1",
      inputName: "Extra Gasto Financiero 1",
      em: "Ingrese un Extra gasto Financiero",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "extrag_finan2",
      name: "extrag_finan2",
      inputName: "Ext. Gasto Financiero 2",
      em: "Ingrese un Extra gasto Financiero",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "extrag_finan3",
      name: "extrag_finan3",
      inputName: "Ext. Gasto Financiero 3",
      em: "Ingrese un Extra gasto Financiero",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "extrag_finan_notas",
      name: "extrag_finan_notas",
      inputName: "Nota Extra Gasto Financiero",
      em: "Ingrese una nota de Extra gasto Financiero",
      data: "String",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "costo_u_est",
      name: "costo_u_est",
      inputName: "Costo u. Est",
      em: "Ingrese un costo_u_est",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "costo_u",
      name: "costo_u",
      inputName: "Costo U.",
      em: "Ingrese un costo_u",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "updated",
      name: "updated",
      inputName: "Update",
      em: "Ingrese un updated",
      data: "Number",
      xs_md: [12, 3],
      isDisabled: false,
      oculto: true,
    },
    {
      id: "htimestamp",
      name: "htimestamp",
      inputName: "Fecha",
      em: "Ingrese una Fecha",
      data: "Date",
      xs_md: [12, 3],
      isDisabled: true,
      oculto: true,
    },
  ];

  const [selectedItem, setSelectedItem] = useState({
    id: "",
    description: "",
    ncm_id: 0,
    gwctn: "",
    proveedores_id: null,
    sku: "",
    imageurl: "",
    exw_u: "",
    fob_u: "",
    qty: 0,
    pcsctn: 0,
    cbmctn: 0,
    gwctn: 0,

    cambios_notas: "",
    ncm_arancel: 0,
    ncm_te_dta_otro: 0,
    ncm_iva: 0,
    ncm_ivaad: 0,
    gcias: 0,

    ncm_sp1: "",
    ncm_sp2: "",
    precio_u: 0,

    extrag_comex1: 0,
    extrag_comex2: 0,
    extrag_comex3: 0,
    extrag_comex_notas: "",

    extrag_src1: 0,
    extrag_src2: 0,
    extrag_src_notas: "Sin notas",

    extrag_finan1: 0,
    extrag_finan2: 0,
    extrag_finan3: 0,
    extrag_finan_notas: "",

    costo_u_est: 0,
    costo_u_prov: 0,
    costo_u: 0,
    updated: false,
    htimestamp: UtilidadesHelper.fechaParaDB(),
  });

  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [qty, setQty] = useState(0);
  const [errors, setErrors] = useState({
    quantityError: "",
  });
  console.log(dataHelp.proveedoresOem);
  //   console.log(dataHelp.NCM);

  // const NCMList = dataHelp.NCM.map((item) => ({
  //   id: item.id,
  //   description: item.description,
  //   ncm_id: item.id,
  //   ncm_code: item.code,
  //   gwctn: item.gwctn,
  //   cbmctn: item.cbmctn,
  //   pcsctn: item.pcsctn,
  // }));

  console.log(dataHelp);
  const [NCMList, setNCMList] = useState([]);
  console.log(formik.values.paisregion_id);

  useEffect(() => {
    // let paisregion_id = dataHelp?.presupuestoEditable?.estHeader?.paisregion_id;
    let paisregion_id = formik?.values?.paisregion_id?.id;
    // console.log(paisregion_id);
    // console.log(formik.values.paisregion_id.id);

    let updatedList = [];

    if (paisregion_id !== 5 && dataHelp.NCM) {
      updatedList = dataHelp.NCM.map((item) => ({
        id: item.id,
        description: item.description,
        ncm_id: item.id,
        ncm_code: item.code,
      }));
    } else if (dataHelp.NCM_Mex) {
      updatedList = dataHelp.NCM_Mex.map((item) => ({
        id: item.id,
        description: item.description,
        ncm_id: item.id,
        ncm_code: item.code,
      }));
    }

    setNCMList(updatedList); 
  }, [dataHelp, formik]);

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

  const handleChange = (event, type) => {
    const { name, value } = event.target;
    // console.log("EVENT ", event);
    // console.log("Type ", type);
    // console.log(event.target.name);
    if (event.target.name === "quantity") {
      setErrors({
        ...errors,
        quantityError: "negative values not allowed",
      });
      setSelectedQuantity(event.target.value);
      //   console.log(value);
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
          proovedores_name: "description",
          // otros campos relevantes aquí
        };
      }
      const selectedOption = selectedList?.find((item) => item.id === value);
      let updatedSelectedItem = { ...selectedItem };

      // Si hay un selectedList y un selectedData, actualiza según eso
      if (selectedList && selectedData) {
        Object.keys(selectedData).forEach((key) => {
          updatedSelectedItem[key] = selectedOption[selectedData[key]];
        });
      } else {
        // Actualización general de selectedItem
        if (type === "Number") {
          updatedSelectedItem[name] = parseFloat(value) || value;
        } else {
          updatedSelectedItem[name] = value;
        }
      }
      setSelectedQuantity(event.target.value);
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
    // Validacion Descripcion
    if (!selectedItem?.description || !selectedItem?.description.trim()) {
      errors.descriptionError = "Description Name is required";
    }

    // Validacion exw_u
    if (!selectedItem?.exw_u || !selectedItem?.sku.trim()) {
      // AL INCIAR CON UN VALOR SER NUMERICO SE DEBE DE SACAR EL TRIM
      errors.exw_uError = "Valor exw_u is required";
    }
    // Validacion exw_u menor a a fob_u
    if (selectedItem?.exw_u > selectedItem?.fob_u) {
      // AL INCIAR CON UN VALOR SER NUMERICO SE DEBE DE SACAR EL TRIM
      errors.exw_uError = "Valor exw_u debe ser menor a FOB u.";
    }
    // // Validacion exw_u numerico
    if (typeof selectedItem.exw_u !== "number") {
      errors.exw_uError = "Valor exw_u is required";
    }

    // Validacion sku
    if (!selectedItem?.sku || !selectedItem?.sku.trim()) {
      errors.skuError = "Sku Name is required";
    }
    // Validacion FOb unitario
    if (!selectedItem?.fob_u || selectedItem?.fob_u < 0) {
      errors.fob_uError = "Valor Fob is required";
    }
    // // Validacion fob_u numerico
    if (typeof selectedItem.fob_u !== "number") {
      errors.fob_uError = "Valor fob_u is required";
    }

    // Validacion qty cantidad
    if (!selectedItem?.qty || selectedItem?.qty <= 0) {
      errors.qtyError = "Cantidad is required";
    }
    // Validacion qty Entero
    if (!Number.isInteger(selectedItem?.qty)) {
      errors.qtyError = "Cant. PCS Debe de ser un numero entero";
    }

    // Validacion Vol x caja
    if (!selectedItem?.cbmctn || selectedItem?.cbmctn < 0) {
      errors.cbmctnError = "Vol. x caja is required";
    }
    // Validacion Vol x caja numerico
    if (!selectedItem?.cbmctn || typeof selectedItem.cbmctn !== "number") {
      errors.cbmctnError = "CBM x caja is required";
    }

    // Validacion Piezas x caja
    if (!selectedItem?.pcsctn || selectedItem?.pcsctn <= 0) {
      errors.pcsctnError = "PSC x caja is required";
    }
    // Validacion Piezas x caja Entero
    if (!Number.isInteger(selectedItem?.pcsctn)) {
      errors.pcsctnError = "PSC x caja is required";
    }

    // Validacion Peso x caja
    if (!selectedItem?.gwctn || selectedItem?.gwctn < 0) {
      errors.gwctnError = "Peso x caja is required";
    }
    // // Validacion gwctn numerico
    if (typeof selectedItem.gwctn !== "number") {
      errors.gwctnError = "Valor gwctn debe ser numerico";
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

        {/* Select PROVEEDORES */}
        <Grid item xs={12} md={1.2}>
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
                      {/* <Typography>Id : {selectedData.id}</Typography> */}
                    </Stack>
                  );
                }}
                inputProps={{ "aria-label": "Without label" }}
              >
                <MenuItem disabled value="">
                  <Typography color="textSecondary">
                    Select Proveedor
                  </Typography>
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
                      {/* <Typography>id : {item.id}</Typography> */}
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
        
        {/* Mapeo objetos itemDetails */}
        {itemDetails.map(
          (item, index) =>
            !item.oculto && (
              <Grid item xs={item.xs_md[0]} md={item.xs_md[1]} key={index} sx={12}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1">{item.inputName}</Typography>
                  <FormControl>
                    <Tooltip title={item.alerta ? item.alerta : item.name}>
                      <TextField
                        fullWidth
                        name={item.name}
                        type={item.data === "Number" ? "number" : "string"}
                        error={Boolean(errors[`${item.name}Error`])}
                        value={selectedItem[item.id] || ""}
                        onChange={(e) => {
                          handleChange(e, item.data);
                        }}
                        placeholder={`${item.em}`}
                        disabled={item.isDisabled}
                        // Si es tipo Date, añade el atributo inputType
                        inputProps={
                          item.data === "Date" ? { type: "date" } : {}
                        }
                      />
                    </Tooltip>
                    {errors[`${item.name}Error`] && (
                      <FormHelperText>
                        {errors[`${item.name}Error`]}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Stack>
              </Grid>
            )
        )}

        {/* POSICION ARANCELARIA // NCM */}
        <Grid item xs={12} md={1.2}>
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
                      <Typography>Code : {item.ncm_code}</Typography>
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
        {/* <Grid item xs={12} md={3}>
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
        </Grid> */}

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
