// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconClipboardCheck, IconPictureInPicture, IconForms, IconBorderAll, IconChartDots, IconStairsUp } from '@tabler/icons';

import DirectionsBoatFilledOutlinedIcon from '@mui/icons-material/DirectionsBoatFilledOutlined';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';

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
