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
        /*{
            id: 'users',
            title: <FormattedMessage id="users" />,
            type: 'collapse',
            icon: icons.IconUserCheck,
            children: [
                // {
                //     id: 'posts',
                //     title: <FormattedMessage id="social-profile" />,
                //     type: 'item',
                //     url: '/user/social-profile/posts'
                // },
                {
                    id: 'account-profile',
                    title: <FormattedMessage id="account-profile" />,
                    type: 'collapse',
                    children: [
                        {
                            id: 'profile1',
                            title: (
                                <>
                                    <FormattedMessage id="profile" /> 01
                                </>
                            ),
                            type: 'item',
                            url: '/user/account-profile/profile1'
                        },
                        // {
                        //     id: 'profile2',
                        //     title: (
                        //         <>
                        //             <FormattedMessage id="profile" /> 02
                        //         </>
                        //     ),
                        //     type: 'item',
                        //     url: '/user/account-profile/profile2'
                        // },
                        // {
                        //     id: 'profile3',
                        //     title: (
                        //         <>
                        //             <FormattedMessage id="profile" /> 03
                        //         </>
                        //     ),
                        //     type: 'item',
                        //     url: '/user/account-profile/profile3'
                        // }
                    ]
                },

                // LAS CARDS DE USUARIOS
                // {
                //     id: 'user-card',
                //     title: <FormattedMessage id="cards" />,
                //     type: 'collapse',
                //     children: [
                //         {
                //             id: 'card1',
                //             title: (
                //                 <>
                //                     <FormattedMessage id="style" /> 01
                //                 </>
                //             ),
                //             type: 'item',
                //             url: '/user/card/card1'
                //         },
                //         {
                //             id: 'card2',
                //             title: (
                //                 <>
                //                     <FormattedMessage id="style" /> 02
                //                 </>
                //             ),
                //             type: 'item',
                //             url: '/user/card/card2'
                //         },
                //         {
                //             id: 'card3',
                //             title: (
                //                 <>
                //                     <FormattedMessage id="style" /> 03
                //                 </>
                //             ),
                //             type: 'item',
                //             url: '/user/card/card3'
                //         }
                //     ]
                // },

                //  LAS LISTAS DE USUARIO
                // {
                //     id: 'user-list',
                //     title: <FormattedMessage id="list" />,
                //     type: 'collapse',
                //     children: [
                //         {
                //             id: 'list1',
                //             title: (
                //                 <>
                //                     <FormattedMessage id="style" /> 01
                //                 </>
                //             ),
                //             type: 'item',
                //             url: '/user/list/list1'
                //         },
                //         {
                //             id: 'list2',
                //             title: (
                //                 <>
                //                     <FormattedMessage id="style" /> 02
                //                 </>
                //             ),
                //             type: 'item',
                //             url: '/user/list/list2'
                //         }
                //     ]
                // }
            ]
        },*/

        // LISTA DE ITEM COSTUMER
        /*{
            id: 'customer',
            title: <FormattedMessage id="customer" />,
            type: 'collapse',
            icon: icons.IconBasket,
            children: [
                {
                    id: 'customer-list',
                    title: <FormattedMessage id="customer-list" />,
                    type: 'item',
                    url: '/customer/customer-list',
                    breadcrumbs: false
                },
                {
                    id: 'order-list',
                    title: <FormattedMessage id="order-list" />,
                    type: 'item',
                    url: '/customer/order-list',
                    breadcrumbs: false
                },
                {
                    id: 'create-invoice',
                    title: <FormattedMessage id="create-invoice" />,
                    type: 'item',
                    url: '/customer/create-invoice',
                    breadcrumbs: false
                },
                {
                    id: 'order-details',
                    title: <FormattedMessage id="order-details" />,
                    type: 'item',
                    url: '/customer/order-details'
                },
                {
                    id: 'product',
                    title: <FormattedMessage id="product" />,
                    type: 'item',
                    url: '/customer/product',
                    breadcrumbs: false
                },
                {
                    id: 'product-review',
                    title: <FormattedMessage id="product-review" />,
                    type: 'item',
                    url: '/customer/product-review',
                    breadcrumbs: false
                }
            ]
        },
*/

        // LISTA DE HERRAMIENTAS DE COMUNICACION: chat, kanban, mail, calendar
        // {
        //     id: 'chat',
        //     title: <FormattedMessage id="chat" />,
        //     type: 'item',
        //     icon: icons.IconMessages,
        //     url: '/app/chat'
        // },
        // {
        //     id: 'kanban',
        //     title: 'Kanban',
        //     type: 'item',
        //     icon: icons.IconLayoutKanban,
        //     url: '/app/kanban/board'
        // },
        // {
        //     id: 'mail',
        //     title: <FormattedMessage id="mail" />,
        //     type: 'item',
        //     icon: icons.IconMail,
        //     url: '/app/mail'
        // },

        //MEXICO
        {
            id: 'ESTIMADOR-MEX',
            title: <FormattedMessage id="ESTIMADOR-MEX" />,
            type: 'item',
            url: '/estimateMex/estimate-list',
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
                    url: '/UnderConstruction',  // RUTA QUE DESVIA PARA MOSTRAR ALERTA DE CONSTRUCCION
                    // url: '/estimateMex/estimate-list',
                    breadcrumbs: false
                },
                // {
                //     id: 'estimate-list-GUADALUPE',
                //     title: <FormattedMessage id="estimate-list-GUADALUPE" />,
                //     type: 'item',
                //     url: '/estimate/estimate-list',
                //     breadcrumbs: false
                // },
            ]
        },

        // ARGENTINA 
        {
            id: 'ESTIMADOR-ARG',
            title: <FormattedMessage id="ESTIMADOR-ARG" />,
            type: 'item',
            // url: '/estimate/estimate-list',
            // url: '/estimateArg_BsAs/estimate-list',  
            url: '/UnderConstruction',  // RUTA QUE DESVIA PARA MOSTRAR ALERTA DE CONSTRUCCION
            // type: 'collapse',
            // url: '/app/calendar',
            icon: SummarizeOutlinedIcon,
            breadcrumbs: false,
            children:[
                {
                    id: 'estimate-list-BSAS',
                    title: <FormattedMessage id="estimate-list-BSAS" />,
                    type: 'item',
                    url: '/estimateArg_BsAs/estimate-list',
                    breadcrumbs: false
                },
            ]
        },

        

        

        /*{
            id: 'calendar',
            title: <FormattedMessage id="calendar" />,
            type: 'item',
            url: '/app/calendar',
            icon: icons.IconCalendar,
            breadcrumbs: false
        },*/


        // LISTA DE CONTACTOS: cards, list
        // {
        //     id: 'contact',
        //     title: <FormattedMessage id="contact" />,
        //     type: 'collapse',
        //     icon: icons.IconNfc,
        //     children: [
        //         {
        //             id: 'c-card',
        //             title: <FormattedMessage id="cards" />,
        //             type: 'item',
        //             url: '/app/contact/c-card',
        //             breadcrumbs: false
        //         },
        //         {
        //             id: 'c-list',
        //             title: <FormattedMessage id="list" />,
        //             type: 'item',
        //             url: '/app/contact/c-list',
        //             breadcrumbs: false
        //         }
        //     ]
        // },

        // LISTA DE PRODUCTOS: products, product-detail
        // {
        //     id: 'e-commerce',
        //     title: <FormattedMessage id="e-commerce" />,
        //     type: 'collapse',
        //     icon: icons.IconBasket,
        //     children: [
        //         {
        //             id: 'products',
        //             title: <FormattedMessage id="products" />,
        //             type: 'item',
        //             url: '/e-commerce/products'
        //         },
        //         {
        //             id: 'product-details',
        //             title: <FormattedMessage id="product-details" />,
        //             type: 'item',
        //             url: '/e-commerce/product-details/1',
        //             breadcrumbs: false
        //         },
        //         {
        //             id: 'product-list',
        //             title: <FormattedMessage id="product-list" />,
        //             type: 'item',
        //             url: '/e-commerce/product-list',
        //             breadcrumbs: false
        //         },
        //         {
        //             id: 'checkout',
        //             title: <FormattedMessage id="checkout" />,
        //             type: 'item',
        //             url: '/e-commerce/checkout'
        //         }
        //     ]
        // }

        //fin de la lista del menu de Application
    ]
};

export default application;