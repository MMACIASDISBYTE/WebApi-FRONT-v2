// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconClipboardCheck, IconPictureInPicture, IconForms, IconBorderAll, IconChartDots, IconStairsUp } from '@tabler/icons';

import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';
import LocalPoliceOutlinedIcon from '@mui/icons-material/LocalPoliceOutlined';
import SdOutlinedIcon from '@mui/icons-material/SdOutlined';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import PriceCheckOutlinedIcon from '@mui/icons-material/PriceCheckOutlined';
import DirectionsBoatFilledOutlinedIcon from '@mui/icons-material/DirectionsBoatFilledOutlined';
import ApartmentOutlinedIcon from '@mui/icons-material/ApartmentOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import BookOutlinedIcon from '@mui/icons-material/BookOutlined';
import TrafficOutlinedIcon from '@mui/icons-material/TrafficOutlined';
import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined';
import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined';
import FactoryOutlinedIcon from '@mui/icons-material/FactoryOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import SportsMartialArtsOutlinedIcon from '@mui/icons-material/SportsMartialArtsOutlined';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';
import CopyAllOutlinedIcon from '@mui/icons-material/CopyAllOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined';
import MiscellaneousServicesOutlinedIcon from '@mui/icons-material/MiscellaneousServicesOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

import { color } from '@mui/system';
import { red } from '@mui/material/colors';
//import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutl

// constant
const icons = {
    IconClipboardCheck,
    IconPictureInPicture,
    IconForms,
    IconBorderAll,
    IconChartDots,
    IconStairsUp
};

// ==============================|| UI FORMS MENU ITEMS ||============================== //

const masterTables = {
    id: 'masterTables',
    title: <FormattedMessage id="MASTERTABLES" />,
    icon: icons.IconPictureInPicture,
    type: 'group',
    children: 
            [
                // tabla CANAL
                {
                    id: 'TARIFAS',
                    title: <FormattedMessage id="TARIFAS" />,
                    type: 'collapse',
                    icon: PriceCheckOutlinedIcon,
                    children: [
                        // tabla COMEXFWD
                        {
                            id: 'COMEXFWD',
                            title: <FormattedMessage id="SHIPPING"/>,
                            type: 'item',
                            icon: DirectionsBoatFilledOutlinedIcon,
                            url:  '/TARIFAS/SHIPPING',
                            breadcrumbs: false                  
                        },
                       // LISTA DE COMEX TERMINAL
                        {
                            id: 'TERMINALES',
                            title: <FormattedMessage id="TERMINALES" />,
                            type: 'item',
                            icon: ApartmentOutlinedIcon,
                            url:  '/TARIFAS/TERMINALES',
                            breadcrumbs: false  
                        },
                        // LISTA DE DEPOSITOS
                        {
                            id: 'DEPOSITOS',
                            title: <FormattedMessage id="DEPOSITOS" />,
                            type: 'item',
                            icon: WarehouseOutlinedIcon,
                            url:  '/TARIFAS/DEPOSITOS',
                            breadcrumbs: false
                        },
                        // LISTA DE TRANSPORTES LOCALES
                        {
                            id: 'TRANSPORTESLOC',
                            title: <FormattedMessage id="TRANSPORTE LOCAL" />,
                            type: 'item',
                            icon: LocalShippingOutlinedIcon,
                            url:  '/TARIFAS/TRANSPORTELOC',
                            breadcrumbs: false
                        },
                        // LISTA DE POLIZAS
                        {
                            id: 'POLIZAS',
                            title: <FormattedMessage id="POLIZAS" />,
                            type: 'item',
                            icon: LibraryBooksOutlinedIcon,
                            url:  '/TARIFAS/POLIZAS',
                            breadcrumbs: false
                        }
        
                        
                    ]
                },
                // LISTA DE CARGA
                {
                    id: 'CONSTANTES',
                    title: <FormattedMessage id="CONSTANTES" />,
                    type: 'collapse',
                    icon: FormatListNumberedOutlinedIcon,
                    children: [
                        // tabla CANAL
                        {
                            id: 'canal',
                            title: <FormattedMessage id="canal" />,
                            type: 'item',
                            icon: TrafficOutlinedIcon,
                            url: '/canal/canal',
                            /*children: [
                                {
                                    id: 'canal',
                                    title: <FormattedMessage id="canal" />,
                                    type: 'item',
                                    url: '/canal/canal',
                                    breadcrumbs: false
                                },
                            ]*/
                        },
                        // LISTA DE CARGA
                        {
                            id: 'carga',
                            title: <FormattedMessage id="carga" />,
                            type: 'item',
                            icon: LocalShippingOutlinedIcon,
                            url: '/carga/carga',
                            /*hildren: [
                                {
                                    id: 'carga',
                                    title: <FormattedMessage id="carga" />,
                                    type: 'item',
                                    url: '/carga/carga',
                                    breadcrumbs: false
                                },
                            ]*/
                        },
                        // LISTA DE IMPUESTOS
                        {
                            id: 'impuestos',
                            title: <FormattedMessage id="impuestos" />,
                            type: 'item',
                            icon: PaidOutlinedIcon,
                            url: '/impuestos/impuestos',
                            /*children: [
                                {
                                    id: 'impuestos',
                                    title: <FormattedMessage id="impuestos" />,
                                    type: 'item',
                                    url: '/impuestos/impuestos',
                                    breadcrumbs: false
                                },
                            ]*/
                        },   
                         // LISTA DE IMPUESTOS
                         {
                            id: 'constantescalculo',
                            title: <FormattedMessage id="CONSTANTES DE CALCULO"   />,
                            type: 'item', 
                            icon: NumbersOutlinedIcon,
                            url: '/CONST/CONST',
                            /*children: [
                                {
                                    id: 'impuestos',
                                    title: <FormattedMessage id="CONSTANTES CALCULO" />,
                                    type: 'item',
                                    url: '/CONST/CONST',
                                    breadcrumbs: false
                                },
                            ]*/
                        }     
                    ]
                },
                {
                    id: 'Proveedores',
                    title: <FormattedMessage id="PROVEEDORES" />,
                    type: 'collapse',
                    icon: MiscellaneousServicesOutlinedIcon,    
                    children: 
                    [
                        {
                            id: 'banco',
                            title: <FormattedMessage id="banco" />,
                            type: 'item',
                            icon: AccountBalanceOutlinedIcon,
                            url: '/banco/banco'
                            /*children: [
        
                                // tabla banco
                                {
                                    id: 'bancos-list',
                                    title: <FormattedMessage id="bancos" />,
                                    type: 'item',
                                    url: '/banco/banco',
                                    breadcrumbs: false
                                },
                            ]*/
                        },
                        // tabla fwdtte
                        {
                            id: 'fwdtte',
                            title: <FormattedMessage id="fwdtte" />,
                            type: 'item',
                            icon: LocalShippingOutlinedIcon,
                            url: '/fwdtte/fwdtte'
                            /*children: [
                                {
                                    id: 'fwdtte',
                                    title: <FormattedMessage id="fwdtte" />,
                                    type: 'item',
                                    url: '/fwdtte/fwdtte',
                                    breadcrumbs: false
                                },
                            ],*/
                        },
                        // LISTA DE Terminal
                        {
                            id: 'terminal',
                            title: <FormattedMessage id="terminal" />,
                            type: 'item',
                            icon: WarehouseOutlinedIcon,
                            url: '/terminal/terminal',
                            /*children: [
                                {
                                    id: 'terminal',
                                    title: <FormattedMessage id="terminal" />,
                                    type: 'item',
                                    url: '/terminal/terminal',
                                    breadcrumbs: false
                                },
                            ]*/
                        },
                        // LISTA DE Custodia
                        {
                            id: 'custodia',
                            title: <FormattedMessage id="custodia" />,
                            type: 'item',
                            icon: AdminPanelSettingsOutlinedIcon,
                            url: '/custodia/custodia'
                            /*children: [
                                {
                                    id: 'custodia',
                                    title: <FormattedMessage id="custodia" />,
                                    type: 'item',
                                    url: '/custodia/custodia',
                                    breadcrumbs: false
                                },
                            ]*/
                        },
                        // LISTA DE Flete
                        {
                            id: 'flete',
                            title: <FormattedMessage id="flete" />,
                            type: 'item',
                            icon: LocalShippingOutlinedIcon,
                            url: '/flete/flete'
                            /*children: [
                                {
                                    id: 'flete',
                                    title: <FormattedMessage id="flete" />,
                                    type: 'item',
                                    url: '/flete/flete',
                                    breadcrumbs: false
                                },
                            ]*/
                        },
                        // LISTA DE Despechantes
                        {
                            id: 'despachante',
                            title: <FormattedMessage id="despachante" />,
                            type: 'item',
                            icon: PersonOutlineOutlinedIcon,
                            url: '/despachante/despachante'
                            /*children: [
                                {
                                    id: 'despachante',
                                    title: <FormattedMessage id="despachante" />,
                                    type: 'item',
                                    url: '/despachante/despachante',
                                    breadcrumbs: false
                                },
                            ]*/
                        },
                        // LISTA DE Despechantes
                        {
                            id: 'deposito',
                            title: <FormattedMessage id="DEPOSITO" />,
                            type: 'item',
                            icon: WarehouseOutlinedIcon,
                            url: '/deposito/deposito'
                            /*children: [
                                {
                                    id: 'deposito',
                                    title: <FormattedMessage id="deposito" />,
                                    type: 'item',
                                    url: '/deposito/deposito',
                                    breadcrumbs: false
                                },
                            ]*/
                        },
                        // LISTA DE GestDigitalDoc
                        {
                            id: 'GestDigitalDoc',
                            title: <FormattedMessage id="GestDigitalDoc" />,
                            type: 'item',
                            icon: CopyAllOutlinedIcon,
                            url: '/GestDigitalDoc/GestDigitalDoc'
                            /*children: [
                                {
                                    id: 'GestDigitalDoc',
                                    title: <FormattedMessage id="GestDigitalDoc" />,
                                    type: 'item',
                                    url: '/GestDigitalDoc/GestDigitalDoc',
                                    breadcrumbs: false
                                },
                            ]*/
                        },
                        // LISTA DE Poliza
                        {
                            id: 'poliza',
                            title: <FormattedMessage id="poliza" />,
                            type: 'item',
                            icon: ShieldOutlinedIcon,
                            url: '/poliza/poliza'
                            /*children: [
                                {
                                    id: 'poliza',
                                    title: <FormattedMessage id="poliza" />,
                                    type: 'item',
                                    url: '/poliza/poliza',
                                    breadcrumbs: false
                                },
                            ]*/
                        },
                        // LISTA DE Proveedor OEM
                        {
                            id: 'proveedoresOem',
                            title: <FormattedMessage id="proveedoresOem" />,
                            // type: 'collapse',
                            type: 'item',
                            url: '/proveedoresOem/proveedoresOem',
                            icon: FactoryOutlinedIcon,
                            children: [
                                {
                                    id: 'proveedoresOem',
                                    title: <FormattedMessage id="proveedoresOem" />,
                                    type: 'item',
                                    url: '/proveedoresOem/proveedoresOem',
                                    breadcrumbs: false
                                },
                            ]
                        },
        
                        // LISTA DE Proveedor OEM
                        {
                            id: 'Seguros',
                            title: <FormattedMessage id="Seguros" />,
                            type: 'item',
                            icon: SupervisorAccountOutlinedIcon,
                            url: '/seguros/seguros',
                            children: [
                                {
                                    id: 'Seguros',
                                    title: <FormattedMessage id="Seguros" />,
                                    type: 'item',
                                    url: '/seguros/seguros',
                                    breadcrumbs: false
                                },
                            ]
                        },
                    ]     
                },

        {
            id: 'NCM',
            title: <FormattedMessage id="NCM" />,
            type: 'item',
            url: '/NCM/NCM', 
            icon: MenuBookOutlinedIcon,
            breadcrumbs: false
        },   
        {
            id: 'IIBB',
            title: <FormattedMessage id="IIBB" />,
            type: 'item',
            url: '/IIBB/IIBB', 
            icon: PaidOutlinedIcon,
            breadcrumbs: false
        }
    ]
};

export default masterTables;
