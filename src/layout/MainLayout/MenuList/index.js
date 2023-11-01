import { memo, useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Typography, useMediaQuery } from '@mui/material';

// project imports
import menuItem from 'menu-items';
import NavGroup from './NavGroup';
import useConfig from 'hooks/useConfig';
import { Menu } from 'menu-items/widget';

import LAYOUT_CONST from 'constant';
import { HORIZONTAL_MAX_ITEM } from 'config';
import { useAccessTokenJWT } from 'helpers/useAccessTokenJWT';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {

    // const permisos = useAccessTokenJWT();
    const permisosIniciales = JSON.parse(localStorage.getItem("DisbyteRoll")) || [];
    const [permisos, setPermisos] = useState(permisosIniciales);

    useEffect(() => {
    setPermisos(JSON.parse(localStorage.getItem("DisbyteRoll")))
  },[])
    // console.log(permisos);
    // console.log(menuItem);
    let excludedIds = ['application', 'masterTables']; //aca se almacen el listado que NO mostrar el menu principal(solo se mostrara el home luego depende usuario se vera lo demas)
    let cargoJerarquico = ["CEO", "Gerencia", "Lider"];

    //LOGICA DE PERMISOS EN RAMA PRINCIPAL DE NAVEGACION 
    if(permisos.includes('presupuesto:read')){ //aqui consultamos por permisos si tiene X permiso entonces se hace la excepcion del ARR de excluidos para podes mostrarlo
        const itemsToRemove = ["application"];
        excludedIds = excludedIds.filter(item => !itemsToRemove.includes(item));
        // console.log(excludedIds)
    }
    if(cargoJerarquico.some(permiso => permisos.includes(permiso))){ //aqui cunsulto si tiene roll o persmiso de cargo gerarquico para ver las tablas maestras
        const itemsToRemove = ["masterTables"];
        excludedIds = excludedIds.filter(item => !itemsToRemove.includes(item));
        // console.log(excludedIds)
    }

    menuItem.items = menuItem.items.filter( item => !excludedIds.includes(item.id)); //AQUI RECORRO EL MENUITEM y muestro los q quedan disponibles segun permisos
    // console.log(menuItem);

    const theme = useTheme();
    const { layout } = useConfig();
    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

    const getMenu = Menu();
    const handlerMenuItem = () => {
        const isFound = menuItem.items.some((element) => {
            if (element.id === 'widget') {
                return true;
            }
            return false;
        });

        if (getMenu?.id !== undefined && !isFound) {
            menuItem.items.splice(1, 0, getMenu);
        }
    };

    useEffect(() => {
        handlerMenuItem();
        // eslint-disable-next-line
    }, []);

    // last menu-item to show in horizontal menu bar
    const lastItem = layout === LAYOUT_CONST.HORIZONTAL_LAYOUT && !matchDownMd ? HORIZONTAL_MAX_ITEM : null;

    let lastItemIndex = menuItem.items.length - 1;
    let remItems = [];
    let lastItemId;

    if (lastItem && lastItem < menuItem.items.length) {
        lastItemId = menuItem.items[lastItem - 1].id;
        lastItemIndex = lastItem - 1;
        remItems = menuItem.items.slice(lastItem - 1, menuItem.items.length).map((item) => ({
            title: item.title,
            elements: item.children
        }));
    }

    const navItems = menuItem.items.slice(0, lastItemIndex + 1).map((item) => {
        switch (item.type) {
            case 'group':
                return <NavGroup key={item.id} item={item} lastItem={lastItem} remItems={remItems} lastItemId={lastItemId} />;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        {/* Menu Items Error */}
                    </Typography>
                );
        }
    });

    return <>{navItems}</>;
};

export default memo(MenuList);
