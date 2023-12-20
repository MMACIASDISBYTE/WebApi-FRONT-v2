// statusEstadosEmbarque.js
export const StatusEstadosEmbarque = [
  { id: 2, description: "Pend. de Embarque " },
  { id: 3, description: "Embarcado" },
  { id: 4, description: "Arribado" },
  { id: 5, description: "Despachado" },
  { id: 6, description: "Cerrado" },
  { id: 1000, description: 'Para Revisión'},
];

// En otro archivo donde necesitas utilizar esta informacion se puede importar varias variables y deben de importarse desectructuradamente con las {}
// import { StatusEstadosEmbarque } from './statusEstadosEmbarque';


export const DatosPackaging = [
  // ATRIBUTOS DE TABLA PACKAGING
  {
    alineado: "left",
    nombre: "SKU",
    atributo: "sku",
    tipoDato: "string",
  },
  {
    alineado: "left",
    nombre: "Description",
    atributo: "description",
    tipoDato: "string",
  },
  {
    alineado: "left",
    nombre: "NCM",
    atributo: "ncm_str",
    tipoDato: "string",
  },
  {
    alineado: "center",
    nombre: "Qty[PCS]",
    atributo: "qty",
    tipoDato: "unitario",
  },
  {
    alineado: "center",
    nombre: "PCS/CTN",
    atributo: "pcsctn",
    tipoDato: "unitario",
  },
  {
    alineado: "center",
    nombre: "CBM/CTN[m3]",
    atributo: "cbmctn",
    tipoDato: "metrage",
  },
  {
    alineado: "center",
    nombre: "GW CTN[kg]",
    atributo: "gwctn",
    tipoDato: "peso",
  },
  {
    alineado: "center",
    nombre: "Total CBM[m3]",
    atributo: "totalcbm",
    tipoDato: "metraje",
  },
  {
    alineado: "center",
    nombre: "Total GW[kg]",
    atributo: "totalgw",
    tipoDato: "peso",
  },
  {
    alineado: "center",
    nombre: "FP[%]",
    atributo: "factorproducto",
    tipoDato: "porcentual",
  },
  
];

// ATRIBUTOS DE TABLA ARANCELARIOS
export const DatosImpositivos = [
  {
    alineado: "center",
    nombre: "EXW u.[USD]",
    atributo: "exw_u",
    tipoDato: "number",
  },
  {
    alineado: "center",
    nombre: "FOB u.[USD]",
    atributo: "fob_u",
    tipoDato: "number",
  },
  {
    alineado: "center",
    nombre: "Tot.FOB[USD]",
    atributo: "totalfob",
    tipoDato: "number",
  },
  {
    alineado: "center",
    nombre: "Freight[USD]	",
    atributo: "freightCharge",
    tipoDato: "number",
  },
  {
    alineado: "center",
    nombre: "Ins[USD]",
    atributo: "insuranceCharge",
    tipoDato: "number",
  },
  {
    alineado: "center",
    nombre: "CIF TOT[USD]",
    atributo: "totalcif",
    tipoDato: "number",
  },
  {
    alineado: "center",
    nombre: "ARANC.[USD]",
    atributo: "arancelgrav_cif",
    tipoDato: "number",
  },
  {
    alineado: "center",
    nombre: "DTA[USD]",
    atributo: "te_dta_otro_cif",
    tipoDato: "number",
  },
  {
    alineado: "center",
    nombre: "BASE IVA[USD]",
    atributo: "baseiva",
    tipoDato: "number",
  },
  {
    alineado: "center",
    nombre: "IVA[USD]",
    atributo: "iva_cif",
    tipoDato: "number",
  },
  // VER CON PETER
  // {
  //   alineado: "center",
  //   nombre: "IMP TOT[USD]",
  //   atributo: "ivaad_cif",
  //   tipoDato: "number",
  // },
  // {
  //   alineado: "center",
  //   nombre: "Tot.GLOC[USD]",
  //   atributo: "iibb900",
  //   tipoDato: "number",
  // },
  // {
  //   alineado: "center",
  //   nombre: "Extrg. TOT.",
  //   atributo: "gcias424",
  //   tipoDato: "number",
  // },
  {
    alineado: "center",
    nombre: "COSTO u.[USD]",
    atributo: "costo_u",
    tipoDato: "number",
  },
];
