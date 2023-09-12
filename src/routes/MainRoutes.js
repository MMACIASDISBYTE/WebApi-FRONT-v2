import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const DashboardAnalytics = Loadable(lazy(() => import('views/dashboard/Analytics')));
const DashboardHome = Loadable(lazy(() => import('views/dashboard/Home')));

// widget routing
const WidgetStatistics = Loadable(lazy(() => import('views/widget/Statistics')));
const WidgetData = Loadable(lazy(() => import('views/widget/Data')));
const WidgetChart = Loadable(lazy(() => import('views/widget/Chart')));

// application - user social & account profile routing
const AppUserSocialProfile = Loadable(lazy(() => import('views/application/users/social-profile')));
const AppUserAccountProfile1 = Loadable(lazy(() => import('views/application/users/account-profile/Profile1')));
const AppUserAccountProfile2 = Loadable(lazy(() => import('views/application/users/account-profile/Profile2')));
const AppUserAccountProfile3 = Loadable(lazy(() => import('views/application/users/account-profile/Profile3')));

// application - user cards & list variant routing
const AppProfileCardStyle1 = Loadable(lazy(() => import('views/application/users/card/CardStyle1')));
const AppProfileCardStyle2 = Loadable(lazy(() => import('views/application/users/card/CardStyle2')));
const AppProfileCardStyle3 = Loadable(lazy(() => import('views/application/users/card/CardStyle3')));
const AppProfileListStyle1 = Loadable(lazy(() => import('views/application/users/list/Style1')));
const AppProfileListStyle2 = Loadable(lazy(() => import('views/application/users/list/Style2')));

// application - customer routing
const AppCustomerList = Loadable(lazy(() => import('views/application/customer/CustomerList')));
const AppCustomerOrderList = Loadable(lazy(() => import('views/application/customer/OrderList')));
const AppCustomerCreateInvoice = Loadable(lazy(() => import('views/application/customer/CreateInvoice')));
const AppCustomerOrderDetails = Loadable(lazy(() => import('views/application/customer/OrderDetails')));
const AppCustomerProduct = Loadable(lazy(() => import('views/application/customer/Product')));
const AppCustomerProductReview = Loadable(lazy(() => import('views/application/customer/ProductReview')));

// application - banco routing
const AppBancoList = Loadable(lazy(() => import('views/application/tablasDisbyte/MASTERTABLES/Proveedores/banco/BancoList')));
const AppBancoOrderList = Loadable(lazy(() => import('views/application/tablasDisbyte/MASTERTABLES/Proveedores/banco/BancoList')));
const AppBancoCreateInvoice = Loadable(lazy(() => import('views/application/tablasDisbyte/MASTERTABLES/Proveedores/banco/CreateInvoice')));
const AppBancoOrderDetails = Loadable(lazy(() => import('views/application/tablasDisbyte/MASTERTABLES/Proveedores/banco/OrderDetails')));
const AppBancoProduct = Loadable(lazy(() => import('views/application/tablasDisbyte/MASTERTABLES/Proveedores/banco/Banco')));
const AppBancoProductReview = Loadable(lazy(() => import('views/application/tablasDisbyte/MASTERTABLES/Proveedores/banco/BancoReview')));

// application - presupuestador routing
const AppPresupuestadorList = Loadable(lazy(() => import('views/application/tablasDisbyte/Presupuestador/PresupuestadorList')));
const AppPresupuestadorOrderList = Loadable(lazy(() => import('views/application/tablasDisbyte/Presupuestador/OrderList')));
const AppPresupuestadorCreateInvoice = Loadable(lazy(() => import('views/application/tablasDisbyte/Presupuestador/CreatePresupuesto')));
const AppPresupuestadorOrderDetails = Loadable(lazy(() => import('views/application/tablasDisbyte/Presupuestador/OrderDetails')));
const AppPresupuestadorProduct = Loadable(lazy(() => import('views/application/tablasDisbyte/Presupuestador/Presupuestador')));
const AppPresupuestadorProductReview = Loadable(lazy(() => import('views/application/tablasDisbyte/Presupuestador/PresupuestadorReview')));
const AppPresupuestadorUpdate = Loadable(lazy(() => import('views/application/tablasDisbyte/Presupuestador/UpdateVersPresupuesto')));

// application --> proveedores - canal routing 
const AppTerminalProduct = Loadable(lazy(() => import('views/application/tablasDisbyte/MASTERTABLES/Proveedores/terminal')));
// application --> proveedores - fwdtte routing
const AppFwdtteProduct = Loadable(lazy(() => import('views/application/tablasDisbyte/MASTERTABLES/Proveedores/fwdtte')));
// application --> proveedores - Custodia routing
const AppCustodiaProduct = Loadable(lazy(() => import('views/application/tablasDisbyte/MASTERTABLES/Proveedores/custodia')));
// application --> proveedores - Flete routing
const AppFleteProduct = Loadable(lazy(() => import('views/application/tablasDisbyte/MASTERTABLES/Proveedores/flete')));
// application --> proveedores - Truck routing
const AppTruckProduct = Loadable(lazy(() => import('views/application/tablasDisbyte/MASTERTABLES/Proveedores/Truck')));
// application --> proveedores - Despachante routing
const AppDespachanteProduct = Loadable(lazy(() => import('views/application/tablasDisbyte/MASTERTABLES/Proveedores/despachante')));
// application --> proveedores - Deposito routing
const AppDepositoProduct = Loadable(lazy(() => import('views/application/tablasDisbyte/MASTERTABLES/Proveedores/deposito')));
// application --> proveedores - Deposito routing
const AppGestDigitalDocProduct = Loadable(lazy(() => import('views/application/tablasDisbyte/MASTERTABLES/Proveedores/gestDigitalDoc')));
// application --> proveedores - Deposito routing
const AppPolizaProduct = Loadable(lazy(() => import('views/application/tablasDisbyte/MASTERTABLES/Proveedores/poliza')));
// application --> proveedores - Deposito routing
const AppProveedorOemProduct = Loadable(lazy(() => import('views/application/tablasDisbyte/MASTERTABLES/Proveedores/proveedoresOem')));

// application --> proveedores - Seguro routing
const AppProveedorSeguro = Loadable(lazy(() => import('views/application/tablasDisbyte/MASTERTABLES/Proveedores/seguros')));

// application --> NCM routing
const AppNCM = Loadable(lazy(() => import('views/application/tablasDisbyte/MASTERTABLES/NCM/NCM')));

// application --> IIBB routing
const AppIIBB = Loadable(lazy(() => import('views/application/tablasDisbyte/MASTERTABLES/IIBB')));

// application --> TARIFAS -> SHIPPING
const AppSHIPPING = Loadable(lazy(() => import('views/application/tablasDisbyte/MASTERTABLES/TARIFAS/SHIPPING')));
// application --> TARIFAS -> TERMINALES 
const AppTERMINALES = Loadable(lazy(() => import('views/application/tablasDisbyte/MASTERTABLES/TARIFAS/TERMINALES')));
// application --> TARIFAS -> DEPOSITOS 
const AppDEPOSITOS = Loadable(lazy(() => import('views/application/tablasDisbyte/MASTERTABLES/TARIFAS/DEPOSITOS')));
// application --> TARIFAS -> TRANSPORTE LOCAL 
const AppTRANSPORTELOC = Loadable(lazy(() => import('views/application/tablasDisbyte/MASTERTABLES/TARIFAS/TRANSPORTELOC')));
// application --> TARIFAS -> POLIZAS 
const AppPOLIZAS = Loadable(lazy(() => import('views/application/tablasDisbyte/MASTERTABLES/TARIFAS/POLIZAS')));
// application --> TARIFAS -> POLIZAS 
const AppBANCOS = Loadable(lazy(() => import('views/application/tablasDisbyte/MASTERTABLES/TARIFAS/BANCOS')));
// application --> TARIFAS -> POLIZAS 
const AppGestDig = Loadable(lazy(() => import('views/application/tablasDisbyte/MASTERTABLES/TARIFAS/GestDig')));
// application --> TARIFAS -> POLIZAS 
const AppDESPACHANTES = Loadable(lazy(() => import('views/application/tablasDisbyte/MASTERTABLES/TARIFAS/DESPACHANTES')));


// application --> Constantes - canal routing
const AppPaisRegion = Loadable(lazy(() => import('views/application/tablasDisbyte/MASTERTABLES/Constantes/paisRegion')));
// application --> Constantes - canal routing
const AppCanalProduct = Loadable(lazy(() => import('views/application/tablasDisbyte/MASTERTABLES/Constantes/canal')));
// application --> Constantes - carga routing
const AppCargaProduct = Loadable(lazy(() => import('views/application/tablasDisbyte/MASTERTABLES/Constantes/carga')));
// application --> Constantes - Impuestos routing
const AppImpuestosProduct = Loadable(lazy(() => import('views/application/tablasDisbyte/MASTERTABLES/Constantes/impuestos')));
// application --> Constantes - Impuestos routing
const AppConstProduct = Loadable(lazy(() => import('views/application/tablasDisbyte/MASTERTABLES/Constantes/CONST')));



// application routing
const AppChat = Loadable(lazy(() => import('views/application/chat')));
const AppKanban = Loadable(lazy(() => import('views/application/kanban')));
const AppKanbanBacklogs = Loadable(lazy(() => import('views/application/kanban/Backlogs')));
const AppKanbanBoard = Loadable(lazy(() => import('views/application/kanban/Board')));
const AppMail = Loadable(lazy(() => import('views/application/mail')));
const AppCalendar = Loadable(lazy(() => import('views/application/calendar')));
const AppContactCard = Loadable(lazy(() => import('views/application/contact/Card')));
const AppContactList = Loadable(lazy(() => import('views/application/contact/List')));

// application e-commerce pages
const AppECommProducts = Loadable(lazy(() => import('views/application/e-commerce/Products')));
const AppECommProductDetails = Loadable(lazy(() => import('views/application/e-commerce/ProductDetails')));
const AppECommProductList = Loadable(lazy(() => import('views/application/e-commerce/ProductList')));
const AppECommCheckout = Loadable(lazy(() => import('views/application/e-commerce/Checkout')));

// forms component routing
const FrmComponentsTextfield = Loadable(lazy(() => import('views/forms/components/TextField')));
const FrmComponentsButton = Loadable(lazy(() => import('views/forms/components/Button')));
const FrmComponentsCheckbox = Loadable(lazy(() => import('views/forms/components/Checkbox')));
const FrmComponentsRadio = Loadable(lazy(() => import('views/forms/components/Radio')));
const FrmComponentsSwitch = Loadable(lazy(() => import('views/forms/components/Switch')));
const FrmComponentsAutoComplete = Loadable(lazy(() => import('views/forms/components/AutoComplete')));
const FrmComponentsSlider = Loadable(lazy(() => import('views/forms/components/Slider')));
const FrmComponentsDateTime = Loadable(lazy(() => import('views/forms/components/DateTime')));

// forms plugins layout
const FrmLayoutLayout = Loadable(lazy(() => import('views/forms/layouts/Layouts')));
const FrmLayoutMultiColumnForms = Loadable(lazy(() => import('views/forms/layouts/MultiColumnForms')));
const FrmLayoutActionBar = Loadable(lazy(() => import('views/forms/layouts/ActionBar')));
const FrmLayoutStickyActionBar = Loadable(lazy(() => import('views/forms/layouts/StickyActionBar')));

// forms plugins routing
const FrmAutocomplete = Loadable(lazy(() => import('views/forms/plugins/AutoComplete')));
const FrmMask = Loadable(lazy(() => import('views/forms/plugins/Mask')));
const FrmClipboard = Loadable(lazy(() => import('views/forms/plugins/Clipboard')));
const FrmRecaptcha = Loadable(lazy(() => import('views/forms/plugins/Recaptcha')));
const FrmWysiwugEditor = Loadable(lazy(() => import('views/forms/plugins/WysiwugEditor')));
const FrmModal = Loadable(lazy(() => import('views/forms/plugins/Modal')));
const FrmTooltip = Loadable(lazy(() => import('views/forms/plugins/Tooltip')));

// table routing
const TableBasic = Loadable(lazy(() => import('views/forms/tables/TableBasic')));
const TableDense = Loadable(lazy(() => import('views/forms/tables/TableDense')));
const TableEnhanced = Loadable(lazy(() => import('views/forms/tables/TableEnhanced')));
const TableData = Loadable(lazy(() => import('views/forms/tables/TableData')));
const TableCustomized = Loadable(lazy(() => import('views/forms/tables/TablesCustomized')));
const TableStickyHead = Loadable(lazy(() => import('views/forms/tables/TableStickyHead')));
const TableCollapsible = Loadable(lazy(() => import('views/forms/tables/TableCollapsible')));

// forms validation
const FrmFormsValidation = Loadable(lazy(() => import('views/forms/forms-validation')));
const FrmFormsWizard = Loadable(lazy(() => import('views/forms/forms-wizard')));

// chart routing
const ChartApexchart = Loadable(lazy(() => import('views/forms/chart/Apexchart')));
const OrgChartPage = Loadable(lazy(() => import('views/forms/chart/OrgChart')));

// basic ui-elements routing
const BasicUIAccordion = Loadable(lazy(() => import('views/ui-elements/basic/UIAccordion')));
const BasicUIAvatar = Loadable(lazy(() => import('views/ui-elements/basic/UIAvatar')));
const BasicUIBadges = Loadable(lazy(() => import('views/ui-elements/basic/UIBadges')));
const BasicUIBreadcrumb = Loadable(lazy(() => import('views/ui-elements/basic/UIBreadcrumb')));
const BasicUICards = Loadable(lazy(() => import('views/ui-elements/basic/UICards')));
const BasicUIChip = Loadable(lazy(() => import('views/ui-elements/basic/UIChip')));
const BasicUIList = Loadable(lazy(() => import('views/ui-elements/basic/UIList')));
const BasicUITabs = Loadable(lazy(() => import('views/ui-elements/basic/UITabs')));

// advance ui-elements routing
const AdvanceUIAlert = Loadable(lazy(() => import('views/ui-elements/advance/UIAlert')));
const AdvanceUIDialog = Loadable(lazy(() => import('views/ui-elements/advance/UIDialog')));
const AdvanceUIPagination = Loadable(lazy(() => import('views/ui-elements/advance/UIPagination')));
const AdvanceUIProgress = Loadable(lazy(() => import('views/ui-elements/advance/UIProgress')));
const AdvanceUIRating = Loadable(lazy(() => import('views/ui-elements/advance/UIRating')));
const AdvanceUISnackbar = Loadable(lazy(() => import('views/ui-elements/advance/UISnackbar')));
const AdvanceUISkeleton = Loadable(lazy(() => import('views/ui-elements/advance/UISkeleton')));
const AdvanceUISpeeddial = Loadable(lazy(() => import('views/ui-elements/advance/UISpeeddial')));
const AdvanceUITimeline = Loadable(lazy(() => import('views/ui-elements/advance/UITimeline')));
const AdvanceUIToggleButton = Loadable(lazy(() => import('views/ui-elements/advance/UIToggleButton')));
const AdvanceUITreeview = Loadable(lazy(() => import('views/ui-elements/advance/UITreeview')));

// pricing page routing
const PagesPrice1 = Loadable(lazy(() => import('views/pages/pricing/Price1')));
const PagesPrice2 = Loadable(lazy(() => import('views/pages/pricing/Price2')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const UtilsAnimation = Loadable(lazy(() => import('views/utilities/Animation')));
const UtilsGrid = Loadable(lazy(() => import('views/utilities/Grid')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

//error
const UnderContruction = Loadable(lazy(() => import('views/pages/maintenance/UnderConstruction')));
const PagesError = Loadable(lazy(() => import('views/pages/maintenance/Error')));
const NoAutorizado = Loadable(lazy(() => import('views/pages/maintenance/NoAutorizado')));

// ==============================|| MAIN ROUTING ||============================== //


const MainRoutes = {
    
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
       /* {
            path: '/widget/statistics',
            element: <WidgetStatistics />
        },
        {
            path: '/widget/data',
            element: <WidgetData />
        },
        {
            path: '/widget/chart',
            element: <WidgetChart />
        },*/

        { //ruta para manejar cualquier error en el ingreso del PATH
            path:'*',
            element: <PagesError/>
        },
        { //ruta para manejar cualquier ingreso no autorizado
            path:'/NoAutorizado',
            element: <NoAutorizado/>
        },
        {
            path: '/user/social-profile/:tab',
            element: <AppUserSocialProfile />
        },
        {
            path: '/user/account-profile/profile1',
            element: <AppUserAccountProfile1 />
        },
       /* {
            path: '/user/account-profile/profile2',
            element: <AppUserAccountProfile2 />
        },
        {
            path: '/user/account-profile/profile3',
            element: <AppUserAccountProfile3 />
        },*/

        {
            path: '/user/card/card1',
            element: <AppProfileCardStyle1 />
        },
        /*{
            path: '/user/card/card2',
            element: <AppProfileCardStyle2 />
        },
        {
            path: '/user/card/card3',
            element: <AppProfileCardStyle3 />
        },
        {
            path: '/user/list/list1',
            element: <AppProfileListStyle1 />
        },
        {
            path: '/user/list/list2',
            element: <AppProfileListStyle2 />
        },*/

        //LISTA RUTA CLIENTES
        /*{
            path: '/customer/customer-list',
            element: <AppCustomerList />
        },
        {
            path: '/customer/order-list',
            element: <AppCustomerOrderList />
        },
        {
            path: '/customer/create-invoice',
            element: <AppCustomerCreateInvoice />
        },
        {
            path: '/customer/order-details',
            element: <AppCustomerOrderDetails />
        },
        {
            path: '/customer/product',
            element: <AppCustomerProduct />
        },
        {
            path: '/customer/product-review',
            element: <AppCustomerProductReview />
        },*/

        //LISTA RUTA BANCO
        /*{
            path: '/banco/banco-list',
            element: <AppBancoList />
        },
        {
            path: '/banco/order-list',
            element: <AppBancoOrderList />
        },
        {
            path: '/banco/banco-invoice',
            element: <AppBancoCreateInvoice />
        },
        {
            path: '/banco/banco-details',
            element: <AppBancoOrderDetails />
        },*/
        {
            path: '/banco/banco',
            element: <AppBancoProduct />
        },
        /*{
            path: '/banco/banco-review',
            element: <AppBancoProductReview />
        },*/
        //CONSTNATES DE CALCULO
        {
            path: '/CONST/CONST',
            element: <AppConstProduct />
        },
        //LISTA PAIS REGION
        {
            path: '/paisRegion/paisRegion',
            element: <AppPaisRegion />
        },
        //LISTA RUTA CANAL
        {
            path: '/canal/canal',
            element: <AppCanalProduct />
        },

        //LISTA RUTA CARGA
        {
            path: '/carga/carga',
            element: <AppCargaProduct />
        },
        // RUTAS PARA TARIFAS
        // CHILD: SHIPPING
        {
            path: '/TARIFAS/SHIPPING',
            element: <AppSHIPPING />
        },
        // CHILD TERMINALES
        {
            path: '/TARIFAS/TERMINALES',
            element: <AppTERMINALES />
        },
        // CHILD DEPOSITOS
        {
            path: '/TARIFAS/DEPOSITOS',
            element: <AppDEPOSITOS />
        },
        // CHILD TRANSPORTE LOCAL
        {
            path: '/TARIFAS/TRANSPORTELOC',
            element: <AppTRANSPORTELOC />
        },
        // CHILD POLIZAS
        {
            path: '/TARIFAS/POLIZAS',
            element: <AppPOLIZAS />
        },
        // CHILD BANCOS
        {
            path: '/TARIFAS/BANCOS',
            element: <AppBANCOS />
        },
        // CHILD GestDig
        {
            path: '/TARIFAS/GestDig',
            element: <AppGestDig />
        },
        // CHILD DESPACHANTES
        {
            path: '/TARIFAS/DESPACHANTES',
            element: <AppDESPACHANTES />
        },

        //lista padre Proveedores
        {
            path: '/fwdtte/fwdtte',
            element: <AppFwdtteProduct />
        },
        {
            path: '/terminal/terminal',
            element: <AppTerminalProduct />
        },
        {
            path: '/custodia/custodia',
            element: <AppCustodiaProduct />
        },
        {
            path: '/flete/flete',
            element: <AppFleteProduct />
        },
        {
            path: '/truck/truck',
            element: <AppTruckProduct />
        },
        {
            path: '/despachante/despachante',
            element: <AppDespachanteProduct />
        },
        {
            path: '/deposito/deposito',
            element: <AppDepositoProduct />
        },
        {
            path: '/GestDigitalDoc/GestDigitalDoc',
            element: <AppGestDigitalDocProduct />
        },
        {
            path: '/poliza/poliza',
            element: <AppPolizaProduct />
        },
        {
            path: '/proveedoresOem/proveedoresOem',
            element: <AppProveedorOemProduct />
        },

        // {
        //     path: '/seguros/seguros',
        //     element: <AppProveedorSeguro />
        // },

        // RUTA CONTANTES
        {
            path: '/impuestos/impuestos',
            element: <AppImpuestosProduct />
        },

        // RUTA NCM
        {
            path: '/NCM/NCM',
            element: <AppNCM />
        },

        // RUTA IIBB
        {
            path: '/IIBB/IIBB',
            element: <AppIIBB />
        },                

        // RUTA PRESUPUESTADOR
        {
            path: '/estimate/estimate-list',
            element: <AppPresupuestadorList />
        },
        {
            path: '/estimate/estimate-list',
            element: <AppPresupuestadorOrderList />
        },
        {
            path: '/estimate/create-estimate',
            element: <AppPresupuestadorCreateInvoice />
        },
        {
            path: '/estimate/details',
            element: <AppPresupuestadorOrderDetails />
        },
        {
            path: '/estimate/details/:estnumber/:vers',
            element: <AppPresupuestadorOrderDetails />
        },
        {
            path: '/estimate/estimate',
            element: <AppPresupuestadorProduct />
        },
        {
            path: '/estimate/estimate-review',
            element: <AppPresupuestadorProductReview />
        }, 
        {   // ACTUALIZAR PRESUPUESTO
            path: '/estimate/update-estimate/:estnumber/:vers',
            element: <AppPresupuestadorUpdate />
        },

        {
            path: '/app/chat',
            element: <AppChat />
        },
        {
            path: '/app/mail',
            element: <AppMail />
        },
        {
            path: '/app/kanban',
            element: <AppKanban />,
            children: [
                {
                    path: 'backlogs',
                    element: <AppKanbanBacklogs />
                },
                {
                    path: 'board',
                    element: <AppKanbanBoard />
                }
            ]
        },
        {
            path: '/app/calendar',
            element: <AppCalendar />
        },
        {
            path: '/app/contact/c-card',
            element: <AppContactCard />
        },
        {
            path: '/app/contact/c-list',
            element: <AppContactList />
        },

        {
            path: '/e-commerce/products',
            element: <AppECommProducts />
        },
        {
            path: '/e-commerce/product-details/:id',
            element: <AppECommProductDetails />
        },
        {
            path: '/e-commerce/product-list',
            element: <AppECommProductList />
        },
        {
            path: '/e-commerce/checkout',
            element: <AppECommCheckout />
        },

        {
            path: '/components/text-field',
            element: <FrmComponentsTextfield />
        },
        {
            path: '/components/button',
            element: <FrmComponentsButton />
        },
        {
            path: '/components/checkbox',
            element: <FrmComponentsCheckbox />
        },
        {
            path: '/components/radio',
            element: <FrmComponentsRadio />
        },
        {
            path: '/components/autocomplete',
            element: <FrmComponentsAutoComplete />
        },
        {
            path: '/components/slider',
            element: <FrmComponentsSlider />
        },
        {
            path: '/components/switch',
            element: <FrmComponentsSwitch />
        },
        {
            path: '/components/date-time',
            element: <FrmComponentsDateTime />
        },

        {
            path: '/forms/layouts/layouts',
            element: <FrmLayoutLayout />
        },
        {
            path: '/forms/layouts/multi-column-forms',
            element: <FrmLayoutMultiColumnForms />
        },
        {
            path: '/forms/layouts/action-bar',
            element: <FrmLayoutActionBar />
        },
        {
            path: '/forms/layouts/sticky-action-bar',
            element: <FrmLayoutStickyActionBar />
        },

        {
            path: '/forms/frm-autocomplete',
            element: <FrmAutocomplete />
        },
        {
            path: '/forms/frm-mask',
            element: <FrmMask />
        },
        {
            path: '/forms/frm-clipboard',
            element: <FrmClipboard />
        },
        {
            path: '/forms/frm-recaptcha',
            element: <FrmRecaptcha />
        },
        {
            path: '/forms/frm-wysiwug',
            element: <FrmWysiwugEditor />
        },
        {
            path: '/forms/frm-modal',
            element: <FrmModal />
        },
        {
            path: '/forms/frm-tooltip',
            element: <FrmTooltip />
        },

        {
            path: '/tables/tbl-basic',
            element: <TableBasic />
        },
        {
            path: '/tables/tbl-dense',
            element: <TableDense />
        },
        {
            path: '/tables/tbl-enhanced',
            element: <TableEnhanced />
        },
        {
            path: '/tables/tbl-data',
            element: <TableData />
        },
        {
            path: '/tables/tbl-customized',
            element: <TableCustomized />
        },
        {
            path: '/tables/tbl-sticky-header',
            element: <TableStickyHead />
        },
        {
            path: '/tables/tbl-collapse',
            element: <TableCollapsible />
        },

        {
            path: 'forms/charts/apexchart',
            element: <ChartApexchart />
        },
        {
            path: '/forms/charts/orgchart',
            element: <OrgChartPage />
        },
        {
            path: '/forms/forms-validation',
            element: <FrmFormsValidation />
        },
        {
            path: '/forms/forms-wizard',
            element: <FrmFormsWizard />
        },

        {
            path: '/basic/accordion',
            element: <BasicUIAccordion />
        },
        {
            path: '/basic/avatar',
            element: <BasicUIAvatar />
        },
        {
            path: '/basic/badges',
            element: <BasicUIBadges />
        },
        {
            path: '/basic/breadcrumb',
            element: <BasicUIBreadcrumb />
        },
        {
            path: '/basic/cards',
            element: <BasicUICards />
        },
        {
            path: '/basic/chip',
            element: <BasicUIChip />
        },
        {
            path: '/basic/list',
            element: <BasicUIList />
        },
        {
            path: '/basic/tabs',
            element: <BasicUITabs />
        },

        {
            path: '/advance/alert',
            element: <AdvanceUIAlert />
        },
        {
            path: '/advance/dialog',
            element: <AdvanceUIDialog />
        },
        {
            path: '/advance/pagination',
            element: <AdvanceUIPagination />
        },
        {
            path: '/advance/progress',
            element: <AdvanceUIProgress />
        },
        {
            path: '/advance/rating',
            element: <AdvanceUIRating />
        },
        {
            path: '/advance/snackbar',
            element: <AdvanceUISnackbar />
        },
        {
            path: '/advance/skeleton',
            element: <AdvanceUISkeleton />
        },
        {
            path: '/advance/speeddial',
            element: <AdvanceUISpeeddial />
        },
        {
            path: '/advance/timeline',
            element: <AdvanceUITimeline />
        },
        {
            path: '/advance/toggle-button',
            element: <AdvanceUIToggleButton />
        },
        {
            path: '/advance/treeview',
            element: <AdvanceUITreeview />
        },

        {
            path: '/pages/price/price1',
            element: <PagesPrice1 />
        },
        {
            path: '/pages/price/price2',
            element: <PagesPrice2 />
        },

        {
            path: '/utils/util-typography',
            element: <UtilsTypography />
        },
        {
            path: '/utils/util-color',
            element: <UtilsColor />
        },
        {
            path: '/utils/util-shadow',
            element: <UtilsShadow />
        },
        {
            path: '/utils/util-animation',
            element: <UtilsAnimation />
        },
        {
            path: '/utils/util-grid',
            element: <UtilsGrid />
        },
        {
            path: '/sample-page',
            element: <SamplePage />
        },
        {
            path: '/dashboard/default',
            element: <DashboardDefault />
        },
        {
            path: '/dashboard/analytics',
            element: <DashboardAnalytics />
        },

        // RUTAS AGRAGADAS
        {
            path: '/dashboard/home',
            element: <DashboardHome />
        },
    ]
};

export default MainRoutes;
