// LISTED 21_7_2023 12:30

// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconApps, IconUserCheck, IconBasket, IconMessages, IconLayoutKanban, IconMail, IconCalendar, IconNfc } from '@tabler/icons';

// importacion de iconos adicionales de iconos

import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import { useAccessTokenJWT } from 'helpers/useAccessTokenJWT';

//import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';
// constant
const icons = {
    IconApps,
    IconUserCheck,
    IconBasket,
    IconMessages,
    IconLayoutKanban,
    IconMail,
    IconCalendar,
    IconNfc,
};

// ==============================|| APPLICATION MENU ITEMS ||============================== //

const application = {
    id: 'application',
    title: <FormattedMessage id="PRESUPUESTADOR" />,
    icon: icons.IconApps,
    type: 'group',
    children: [

        //MEXICO
        {
            id: 'ESTIMADOR-MEX',
            title: <FormattedMessage id="ESTIMADOR-MEX" />,
            type: 'item',
            url: '/inboundMEX/inbound',
            // type: 'collapse',
            // url: '/UnderConstruction',  // RUTA QUE DESVIA PARA MOSTRAR ALERTA DE CONSTRUCCION
            // url: '/app/calendar',
            icon: SummarizeOutlinedIcon,
            breadcrumbs: false,
            children:[
                {
                    id: 'estimate-list-CDMX',
                    title: <FormattedMessage id="estimate-list-CDMX" />,
                    type: 'item',
                    // url: '/UnderConstruction',  // RUTA QUE DESVIA PARA MOSTRAR ALERTA DE CONSTRUCCION
                    url: '/inboundMEX/inbound',
                    breadcrumbs: false
                },

            ]
        },

        //VIEJO PRESUPUESTADOR
        // {
        //     id: 'estimate-list-CDMX',
        //     title: <FormattedMessage id="estimate-list-CDMX" />,
        //     type: 'item',
        //     url: '/estimateMex/estimate-list',
        //     // type: 'collapse',
        //     // url: '/UnderConstruction',  // RUTA QUE DESVIA PARA MOSTRAR ALERTA DE CONSTRUCCION
        //     // url: '/app/calendar',
        //     icon: SummarizeOutlinedIcon,
        //     breadcrumbs: false,
        //     children:[
        //         {   
        //             id: 'estimate-list-CDMX',
        //             title: <FormattedMessage id="estimate-list-CDMX" />,
        //             type: 'item',
        //             // url: '/UnderConstruction',  // RUTA QUE DESVIA PARA MOSTRAR ALERTA DE CONSTRUCCION
        //             url: '/estimateMex/estimate-list',
        //             breadcrumbs: false
        //         },
        //     ]
        // },

    ]
};

export default application;