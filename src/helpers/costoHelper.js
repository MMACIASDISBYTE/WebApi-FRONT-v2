/*"estDetails": [
    {
      "id": 0,
      "estimateheader_id": 0,
      "proveedores_id": 0,
      "ncm_id": 0,
      "ncm_ack": true,
      "sku": "string",
      "description": "string",
      "imageurl": "string",
      "exw_u": 0,
      "fob_u": 0,
      "qty": 0,
      "pcsctn": 0,
      "cbmctn": 0,
      "gwctn": 0,
      "cambios_notas": "string",
      "ncm_arancel": 0,
      "ncm_te_dta_otro": 0,
      "ncm_iva": 0,
      "ncm_ivaad": 0,
      "gcias": 0,
      "ncm_sp1": "string",
      "ncm_sp2": "string",
      "precio_u": 0,
      "gloc_fwd": 0,
      "gloc_flete": 0,
      "gloc_terminales": 0,
      "gloc_polizas": 0,
      "gloc_depositos": 0,
      "gloc_despachantes": 0,
      "gloc_bancos": 0,
      "gloc_gestdigdoc": 0,
      "gloc_descarga": 0,
      "extrag_glob_src1": 0,
      "extrag_glob_src2": 0,
      "extrag_glob_comex1": 0,
      "extrag_glob_comex2": 0,
      "extrag_glob_comex3": 0,
      "extrag_glob_finan1": 0,
      "extrag_glob_finan2": 0,
      "extrag_glob_finan3": 0,
      "extrag_glob_finan4": 0,
      "extrag_glob_finan5": 0,
      "extrag_comex1": 0,
      "extrag_comex2": 0,
      "extrag_comex3": 0,
      "extrag_comex_notas": "string",
      "extrag_src1": 0,
      "extrag_src2": 0,
      "extrag_src_notas": "string",
      "extrag_finan1": 0,
      "extrag_finan2": 0,
      "extrag_finan3": 0,
      "extrag_finan_notas": "string",
      "costo_u_est": 0,
      "costo_u_prov": 0,
      "costo_u": 0,
      "updated": true,
      "purchaseorder": "string",
      "productowner": "string",
      "comercial_invoice": "string",
      "proforma_invoice": "string",
      "proveedor_prov": "string",
      "detailorder": 0,
      "ctns": 0,
      "totalcbm": 0,
      "totalgw": 0,
      "totalfob": 0,
      "factorproducto": 0,
      "freightCharge": 0,
      "insuranceCharge": 0,
      "totalcif": 0,
      "cifunit": 0,
      "ratio_fob_cif": 0,
      "arancelgrav_cif": 0,
      "te_dta_otro_cif": 0,
      "baseiva": 0,
      "baseiva_unit": 0,
      "iva_cif": 0,
      "ivaad_cif": 0,
      "gcias424": 0,
      "iibb900": 0,
      "totalaranceles": 0,
      "totalgastos_loc_y_extra": 0,
      "totalgastos_loc_y_extra_u": 0,
      "totaltraderfee": 0,
      "overhead": 0,
      "costounit": 0,
      "ratiopricing": 0,
      "fobtocosto": 0,
      "htimestamp": "2023-11-16T18:16:32.830Z"
    }*/

import { contenedorHelper } from "./contenedorHelper";
import { gastosLocMexHelper } from "./gastosLocMexHelper";

export const costoHelper = {
   
    // Calcula el peso de un item del excel. Un item se entiende, el pedido de un item, pueden ser 3100 piezas
        calculaCostoItem: function (productData,selectedItemP,carga,gastos,ncm,limiteConte) 
    {
        // Copia del parametro selecteditem, para poder obviar parametros con signo negativo que puedan ser usados por ACALC.
        // Trabajo sobre la copia por que las alteraciones en el paramtro afectan la variable usada para el llamado (como si fueran
        // x ref ... )

        // Necesito esto SI o SI para crear una COPIA que no sea una referencia a memoria.
        // El motivo es que si algun parametro basico del item es negativo, le paso Math.abs para que 
        // el calculo siga andando aun cuando esten usando el costo_ideal.
        let selectedItem=Object.create(selectedItemP);

        //console.log("COSCO");
        //console.log(productData,selectedItem,carga,gastos,ncm,limiteConte);

        if(selectedItem==undefined || carga==undefined || gastos==undefined || ncm==undefined/* || this.gotNegParams(selectedItem)*/)
        {
            return 0;
        }

        // OJO, los valores pueden ser negativos cuando se esta intentando usar acalc para despejar desde un costo
        // Tomo una copia del parametro selecteditem para usar solo
        selectedItem.exw_u=Math.abs(selectedItem.exw_u);
        selectedItem.fob_u=Math.abs(selectedItem.fob_u);
        selectedItem.qty=Math.abs(selectedItem.qty); 
        selectedItem.gwctn=Math.abs(selectedItem.gwctn);
        selectedItem.cbmctn=Math.abs(selectedItem.cbmctn);
        //                                                                                                                                                                                                                                           selectedItem.pcsctn=Math.abs(selectedItem.pcscnt);

        // Para que reduce / map se muestren con su definicion via intellicode, dejo ver que la variables es un vector de objetos.
        let prodDataTmp=[{}];


        // Me fijo si la lista de productos tiene al menos un item.
        if(productData!=null && productData!=undefined)
        {
            // Cuando la la lista de productos contiene MAS de un item y se edita uno de ellos, ese item
            // esta tambien en selectedItem. El selectedItem es la version real time del item conforma es editado
            // Y es la que voy a usar en la cuantas dado que se ejecutan con cada render.
            // Es importante RETIRAR de prodData el item que se esta editando, ya que sera sustituido por selecteditem

            // Copio todos los elementos que cuyo id no coincide con el id de selectedItem. (quito el producto que esta seindo editado)
            productData=productData.filter((prod)=>prod.id!=selectedItem.id);
            // Agrego selectedItem que es la version real time del producto.
            prodDataTmp=[...productData,selectedItem];  

        }
        else
        {   // Lista vacia. Selecteditem es EL UNICO ITEM, lo asigno.
            prodDataTmp[0]=selectedItem;
        }


        //console.log(prodDataTmp);


        // Calculo la cantidad de contenedores (necesaria para el calculo de gastos locales)
        let cantCont=0;
        if(limiteConte==0)
        {
            cantCont=contenedorHelper.calculaNumeroContenedores(prodDataTmp,carga).cantContEnt;
        }
        else
        {
            cantCont=limiteConte;
        }

        // El volumen ocupado x un item (un item pueden ser 3100 unidades. Se refiere a una linea en el xcel)
        prodDataTmp=prodDataTmp.map((producto)=>({...producto,
                                                                totalcbm: (producto.cbmctn / producto.pcsctn) * producto.qty
                                                                }));   
        // La suma de todos los volumenes                                                        
        const cbm_grand_total=prodDataTmp.reduce((acumulado,producto,index)=>
                                                                    acumulado + producto.totalcbm
                                                                ,0);      
        // Peso total de cada item (item = 1 linea del excel, pueden ser 3100 unidades)                                                           
        prodDataTmp=prodDataTmp.map((producto)=>({...producto,
                                                                totalgw: (producto.gwctn / producto.pcsctn) * producto.qty
                                                            }));
        // La suma de todos los pesos.                                                     
        const gw_grand_total=prodDataTmp.reduce((acumulado,producto,index)=>
                                                                acumulado + producto.totalgw
                                                            ,0);  
        // Fob total de cada item                                                    
        prodDataTmp=prodDataTmp.map((producto)=>({...producto,
                                                                totalfob: producto.fob_u * producto.qty
                                                            }));
        // La suma de todos los fob totales de los diferentes items
        const fob_grand_total=prodDataTmp.reduce((acumulado,producto,index)=>
                                                                acumulado + producto.totalfob
                                                                ,0);
        // El factor de producto que se saca como la relacion del fobtotal de cada item vs el fob grandtotal
        if(fob_grand_total>0)
        {                                                                
            prodDataTmp=prodDataTmp.map((producto)=>({...producto,
                                                                factorproducto: producto.totalfob / fob_grand_total
                                                                }));                                                    
        }
        // Cargo ponderado del flete internacional
        prodDataTmp=prodDataTmp.map((producto)=>({...producto,
                                                                freightCharge: gastos?.freight_charge * producto.factorproducto
                                                                }));  
        
        // El insurance es en base al fob total. Llamo a la rutina que calcula los gastos aunque solo sea para quedarme con el insurance
        const insurance=gastosLocMexHelper.calcularGloc(gastos,cantCont,fob_grand_total,0).freight_insurance_cost;                                                        

        // Cargo ponderado del seguro del flete internacional
        prodDataTmp=prodDataTmp.map((producto)=>({...producto,
                                                                insuranceCharge: insurance * producto.factorproducto
                                                                }));   
                                                                
        prodDataTmp=prodDataTmp.map((producto)=>({...producto,
                                                                totalcif: producto.totalfob + producto.freightCharge + producto.insuranceCharge
                                                                })); 

        // La suma de todos los fob totales de los diferentes items
        const cif_grand_total=prodDataTmp.reduce((acumulado,producto,index)=>
                                                                acumulado + producto.totalcif
                                                                ,0);

        prodDataTmp=prodDataTmp.map((producto)=>({...producto,
                                                                arancelgrav_cif: producto.totalcif * ncm.igi
                                                                })); 

        prodDataTmp=prodDataTmp.map((producto)=>({...producto,
                                                                te_dta_otro_cif: producto.totalcif * ncm.dta
                                                                })); 
        prodDataTmp=prodDataTmp.map((producto)=>({...producto,
                                                                baseiva: producto.totalcif + producto.arancelgrav_cif + producto.te_dta_otro_cif
                                                                })); 
        prodDataTmp=prodDataTmp.map((producto)=>({...producto,
                                                                iva_cif: producto.baseiva * ncm.iva
                                                                })); 

        // GASTOS LOCALES
        const misGloc=gastosLocMexHelper.calcularGloc(gastos,cantCont,fob_grand_total,cif_grand_total);
        console.log(misGloc);                                                        
        // Calculo y registro el total de los gastos locales y extra. No calculos gastos x separado como en el EXCEL para 
        // evitar iteraraciones. Solo me interesan los gastos locales y extra.
        // A los gastos venidos de TARIFON, apendar los globales de sourcing antes de llamar a esta funcion !!!!!
        prodDataTmp=prodDataTmp.map((producto)=>({...producto,
                                                                totalgastos_loc_y_extra:  ((misGloc.gloc_fwd +
                                                                                            misGloc.gloc_flete + 
                                                                                            misGloc.gloc_terminales +
                                                                                            misGloc.gloc_descarga + 
                                                                                            misGloc.gloc_despachantes 
                                                                                             ) * producto.factorproducto) + 
                                                                                            // POR PRODUCTO
                                                                                           (producto.extrag_src1 != undefined ? producto.extrag_src1 : 0) + 
                                                                                           (producto.extrag_src2 != undefined ? producto.extrag_src2 : 0)

                                                                })); 

        prodDataTmp=prodDataTmp.map((producto)=>({...producto,
                                                                totaltraderfee: (producto.fob_u - producto.exw_u) * producto.qty
                                                                }));                                                         

        prodDataTmp=prodDataTmp.map((producto)=>({...producto,
                                                                costo_u: producto.baseiva + producto.totalgastos_loc_y_extra + producto.totaltraderfee
                                                                })); 

        console.log(prodDataTmp);   
        //console.log(prodDataTmp);                                                        



        let currentItem=prodDataTmp[prodDataTmp.length-1];
        let result=(currentItem.costo_u/currentItem.qty).toFixed(3)                                                        
        return (isNaN(result)?0:result);
        
    }, 



    // ACALC para el front.
    // Determina que valor de entrada se necesita para obtener el valor deseado a la salida.
    // El valor de entrada contiene un signo -
    // El valor de salida por el momento es solo costo_u.
    saSolve: function(productData,selectedItem,carga,gastos,ncm,limiteConte)
    {
        // El parametro con signo negativo, sera la entrada que se debera ajustar para converger al valor de salida
        // que por el momento sera el precio unitario.


        console.log(productData,selectedItem,carga,gastos,ncm,limiteConte);
        let result=this.getTrimingParam(selectedItem);

        if(result.id<0)
        {
            return selectedItem;
        }
        // Le saco el signo.
        let adjValueIn=Math.abs(result.valor);

        // Recuerdo que parametro es.
        let paramId=result.id;
        // Lo seteo sin signo
        selectedItem=this.setValorItem(selectedItem,paramId,adjValueIn);
        // Valor Target
        let adjValueOut=selectedItem.costo_uest;

        let valueIniCopy=adjValueIn;

        // Init de la logica de stepping.
        let step=10;
        let sentido=1;
        let cntSmallStepDown=0;
        let cntSmallStepUp=0;
        let pass=0;
        let speed=1;
        let passes=300;
        // Fin Init logica de stepping

        // Variable de Debug
        let cnt1=0;
        let cnt2=0;
        let cnt3=0;
        let cnt4=0;
        let cnt5=0;
        let cnt6=0;

        
        // Primer calculo.
        let tmpOut=this.calculaCostoItem(productData,selectedItem,carga,gastos,ncm,limiteConte)
        // Mientras no haya iterado mas de 200 veces ... do
       
        while(pass<passes)
        {

            // Detemrino el step y el sentido
            // La cantidada resultante excede el valor esperado. El sentido del ajuste es negativo.
            // A medida que decrece la diferencia entre el valor deseado y el iterado, se reduce el step
            // Si la diferencia es mas grande que 300, el step va aumentando de a 15 cuentas.
            // Esto es identico para el otro sentido (el else).
            // Control PD
            if(tmpOut>adjValueOut)
            {
                sentido=-1;
                // Muy fuera del valor esperado .... incremento el step en cada iteracion.
                // Es el inico rango con step variable
                if((tmpOut-adjValueOut)>(adjValueOut/3))
                {
                    step=valueIniCopy/12;
                }
                else if((tmpOut-adjValueOut)>(adjValueOut/10))
                {
                    step=valueIniCopy/15;
                }
                else if((tmpOut-adjValueOut)>(adjValueOut/40))
                {
                    step=valueIniCopy/30;
                }
                else if((tmpOut-adjValueOut)>(adjValueOut/100))
                {
                    step=valueIniCopy/120;
                }
                else if((tmpOut-adjValueOut)>(adjValueOut/400))
                {
                    step=valueIniCopy/300;
                }
                // Ajuste fino. Aqui es posible que comience a oscilar entre correcion ascendente y descendente.
                // La oscilacion significa que ya se encontro el valor deseado entorno a +/-1 cuenta.
                // En el paso de ajuste fino, sea positivo y/o negativo se instalaron sendos contadores que registran
                // la cantidad de pasadas. Si ambos contadores estan en 2 o mas significa que el valor esta llendo entre
                // + y - una cuenta .... 
                else 
                {
                    step=valueIniCopy/1024;
                    cntSmallStepDown++;
                }
            }
            else
            // La cantidad resultante es inferior al valor esperado. El ajuste es positivo.
            // A medida que 
            {
                sentido=1;
                // Muy fuera del valor esperado .... incremento el step en cada iteracion.
                // Es el inico rango con step variable
                if((adjValueOut-tmpOut)>(adjValueOut/3))
                {
                    step=valueIniCopy/12;
                    cnt1++;
                }
                else if((adjValueOut-tmpOut)>(adjValueOut/10))
                {
                    step=valueIniCopy/15;
                    cnt2++;
                }
                else if((adjValueOut-tmpOut)>(adjValueOut/40))
                {
                    step=valueIniCopy/30;
                    cnt3++;
                }
                else if((adjValueOut-tmpOut)>(adjValueOut/100))
                {
                    step=valueIniCopy/120;
                    cnt4++;
                }
                else if((adjValueOut-tmpOut)>(adjValueOut/600))
                {
                    step=valueIniCopy/400;
                    cnt5++;
                }
                // Ajuste fino. Aqui es posible que comience a oscilar entre correcion ascendente y descendente.
                // La oscilacion significa que ya se encontro el valor deseado entorno a +/-1 cuenta.
                // En el paso de ajuste fino, sea positivo y/o negativo se instalaron sendos contadores que registran
                // la cantidad de pasadas. Si ambos contadores estan en 2 o mas significa que el valor esta llendo entre
                // + y - una cuenta .... 
                else 
                {
                    step=valueIniCopy/1024;
                    cntSmallStepUp++;
                    cnt6++;
                }
            }
            // Estamos en torno a +/- 0.1 cuenta ?
            if(cntSmallStepDown>1 && cntSmallStepUp>1)
            {
                break; // SI, corto la iteracion
            }

            // Analizo la velocidad de convergencia de in vs out        
            let delta=valueIniCopy-adjValueIn;
            if(delta<0)
            {   // Si es negativo lo hago positivo. ME interesa solo el valor absoluto.
                delta*=-1;
            }

            // Si luego de 10 iteraciones el delta es menor al valor/50 aumento la velocidad x10.
            if(((delta*50)<valueIniCopy) && pass==10)
            {
                speed*=10;
            }
            // Si luego de 20 iteraciones el delta persiste en el valor/50, aumento la velocidad otras 5x
            if(((delta*50)<valueIniCopy) && pass==20)
            {
                speed*=5;
            }

            // Ajusto el valor entrante (el valor a "DESPEJAR")
            adjValueIn+=(step*sentido*speed);
            // Seteo el parametro variable de nuevo en el item
            selectedItem=this.setValorItem(selectedItem,paramId,adjValueIn);
            // El parametro de salida por hoy es el costou ... Tocala de nuevo SAM. 
            tmpOut=this.calculaCostoItem(productData,selectedItem,carga,gastos,ncm,limiteConte);
            console.log(tmpOut);
            // cuento la cantidad de iteraciones.
            pass++;
        }
        //myEstV2.ArticleFamily=$"Convergencia: {pass} pasadas (MAX {passes})";

        // Debug.
        console.log("passes: "+passes, " trmValI: "+adjValueIn," trmValE: "+this.getTrimingParam(selectedItem,paramId).valor+" tgI: "+adjValueOut+" tgE: "+tmpOut);
        // Selected item contiene el parametro ajustado para converger al valor de salida deseado.
        return selectedItem;
    },

    // De un producto puedo variar mas o menos 6 parametros. Los direcciono con un id de 0 a 5.
    // Esta en coincidencia con los IDs de abajo. 
    setValorItem: function(selectedItem,codigo,valor)
    {
        switch(codigo)
        {
            // Para no tener bodrios con se testea con fob_u y exw_u iguales y se setea a ambos al mismo tiempo,
            case 0: selectedItem.fob_u=valor;  selectedItem.exw_u=valor; break;
            case 1: selectedItem.exw_u=valor;  selectedItem.fob_u=valor; break;

            case 2: selectedItem.qty=valor;     break;
            case 3: selectedItem.gwctn=valor;   break;
            case 4: selectedItem.cbmctn=valor;  break;
            case 5: selectedItem.pcsctn=valor;  break;
        }
        return selectedItem;
    },

    // Obtiene el parametro que se va a mover/ajustar. Devuelve valor y ID.
    // El parametro ajustable en teoria tiene un valor negativo. Saco su id y su valor.
    // El id devuelto aca y el usado para setear obviamente se corresponden.
    getTrimingParam: function(selectedItem)
    {
        if(selectedItem.fob_u<0)
        {
            return {id:0,valor:selectedItem.fob_u};
        }
        else if(selectedItem.exw_u<0)
        {
            return {id:1,valor:selectedItem.exw_u};
        }
        else if(selectedItem.qty<0)
        {
            return {id:2,valor:selectedItem.qty};
        }
        else if(selectedItem.gwctn<0)
        {
            return {id:3,valor:selectedItem.gwctn};
        }
        else if(selectedItem.cbmctn<0)
        {
            return {id:4,valor:selectedItem.cbmctn};
        }
        else if(selectedItem.pcsctn<0)
        {
            return {id:5,valor:selectedItem.pcsctn};
        }
        else
        {
            
            return {id:-1,valor:-1};
            
        }
    },

    gotNegParams: function(selectedItem)
    {
        if(this.getTrimingParam(selectedItem).id>=0)
        {
            console.log("1");
            return true;
        }
        else
        {
            console.log("2");
            return false;
        }
    }

}
