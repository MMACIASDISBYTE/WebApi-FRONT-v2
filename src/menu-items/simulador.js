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
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';


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

const simulador = {
    id: 'simulador',
    title: <FormattedMessage id="SIMULADOR" />,
    icon: icons.IconPictureInPicture,
    type: 'group',
    children: 
            [
                // tabla Tarifas
                {
                    id: 'simuladorMex',
                    title: <FormattedMessage id="simuladorMex" />,
                    // type: 'collapse',
                    type: 'item',
                    url:  '/simuladorMEX/simulador',
                    icon: SummarizeOutlinedIcon,
                    children: [
                        // tabla COMEXFWD
                        {
                            id: 'simuladorMex',
                            title: <FormattedMessage id="simuladorMex"/>,
                            type: 'item',
                            icon: DirectionsBoatFilledOutlinedIcon,
                            url:  '/simuladorMEX/simulador',
                            breadcrumbs: false                  
                        },
        
                        
                    ]
                },
                
        
    ]
};

export default simulador;
