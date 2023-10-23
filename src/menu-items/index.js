import dashboard from './dashboard';
import application from './application';
import masterTables from './masterTables';
import simulador from './simulador';

import pages from './pages';

// ELEMENTOS SECUNDARIOS
import elements from './elements';
import utilities from './utilities';
import support from './support';
import other from './other';

// ==============================|| MENU ITEMS ||============================== //
    //aqui exporto en menuItems los items en forma de objeto para armar la barra navegadora
const menuItems = {
    items: [
        dashboard,
        simulador,
        application,
        masterTables,
        //pages,
        // elements,
        // utilities,
        // support,
        // other
    ]
};

export default menuItems;
