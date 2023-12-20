import product from "store/slices/product";

export const contenedorHelper = {
   
    // Calcula el peso de un item del excel. Un item se entiende, el pedido de un item, pueden ser 3100 piezas
    calcularPesoItem: function (gwctn,pcsctn,qty) {

        const pesoPorCaja = parseFloat(gwctn || 0);
        const piezasPorCaja = parseFloat(pcsctn || 1);
        const pesoPorPieza=pesoPorCaja/piezasPorCaja; 
        const cantidadDePiezas = parseFloat(qty || 1);
        return (cantidadDePiezas*pesoPorPieza);
    },

    // Calcula el volumen de un item del excel. Cuando se dice item es una compra, pueden ser 3100 unidades.
    calcularVolumenItem: function(cbmctn,pcsctn,qty)
    {
        const cantidadPiezas = parseFloat(qty || 0);
        const piezasPorCaja = parseFloat(pcsctn || 1);
        const cantidadDeCajas = Math.ceil(cantidadPiezas/piezasPorCaja);
        const volumenPorCaja  = parseFloat(cbmctn || 0);
        return (volumenPorCaja * cantidadDeCajas);
    },

    // Si me dicen que carga es, hago la cuenta de volumetria. Le entrego como parte entera y parte fraccionaria.
    calculaNumeroContenedores: function(productsData,contenedor)
    {

        let usaVol=false;
        console.log(contenedor,productsData);

        // console.log(contenedor,productsData);

        const gwTotal=productsData?.reduce((acc, product) => {
            
            return acc + this.calcularPesoItem(product.gwctn,product.pcsctn,product.qty);
        }, 0);

        const cbmTotal=productsData?.reduce((acc, product) => {
            
            return acc + this.calcularVolumenItem(product.cbmctn,product.pcsctn,product.qty);
        }, 0);

        let cantidadContenedores=0;

        if ((parseFloat(gwTotal / (contenedor?.weight))) > parseFloat(cbmTotal / contenedor?.volume))                
        {
            cantidadContenedores=parseFloat(gwTotal / contenedor?.weight);
            usaVol=false;
        }
        else
        {
            cantidadContenedores=parseFloat(cbmTotal / contenedor?.volume);
            usaVol=true;
        }
        return {cantContEnt:cantidadContenedores,canContFrac:100*(cantidadContenedores-Math.floor(cantidadContenedores)),usaVolumen:usaVol}
    },


    // Compara el costo total de gastos locales y flete internacional usando 20FTs contra 40STHQ
    // Devuelve el menor de los costos y un string que dice como se acomodo la carga 
    calculaNumeroContenedoresAuto: function(productsData,infoContenedores,gloc)
    {

        let resultCalcFlete20={};
        let resultCalcFlete40={};

        // Cuanto cuesta un contenedor 20FT, SALVO el FLETE LOCAL
        const gloc20 = gloc.flete_1p20ft +
                       gloc.gloc_fwd_1p20ft +
                       gloc.terminal_1p20ft +                    
                       gloc.descarga_meli_1p20ft_guad +
                      (gloc.despa_fijo + gloc.despa_clasific + gloc.despa_consult);
        
        // Cuanto cuesta un contenedor 40STHQ, SALVO FLETE LOCAL
        const gloc40 = gloc.flete_1p40sthq +
                       gloc.gloc_fwd_1p40sthq +
                       gloc.terminal_1p40sthq +                    
                       gloc.descarga_meli_1p40sthq_guad +
                      (gloc.despa_fijo + gloc.despa_clasific + gloc.despa_consult);

        // Calculo el gwGrandTotal de todos los articulos
        const gwTotal=productsData?.reduce((acc, product) => {
            
            return acc + this.calcularPesoItem(product.gwctn,product.pcsctn,product.qty);
        }, 0);

        // Calculo el cbmGrandTotal de todos los articulos
        const cbmTotal=productsData?.reduce((acc, product) => {
            
            return acc + this.calcularVolumenItem(product.cbmctn,product.pcsctn,product.qty);
        }, 0);

        // En el listado de cargas que me pasaron, busco el 40 y el 20. 40ST y 40HQ es lo mismo
        let tipo40hq=infoContenedores.find((contenedor)=>{contenedor.description.includes("40")})
        let tipo20ft=infoContenedores.find((contenedor)=>(contenedor.description.includes("20")))

        // Este caso es para cuando la carga no totaliza un contenedor.     
        // Tengo que fijar tanto volumen como peso. 
        let cantidadContenedores20=0;
        let cantidadContenedores40=0;
        let cantidadContenedoresEnt20=0;
        let cantidadContenedoresFrac20=0;
        let cantidadContenedoresEnt40=0;
        let cantidadContenedoresFrac40=0;
        let glocContenedores20=0;
        let glocContenedores40=0;
        // Calculo la cantidad de contenedores 20ft para esta carga basado en PESO
        let ratedWeight20=gwTotal/tipo20ft.weight;
        // Calculo la cantidad de contenedores 40hq para esta carga, basado en PESO
        let ratedWeight40=gwTotal/tipo40hq.weight;
        // Calculo la cantidad de contenedores 20FT para esta carga, basado en VOLUMEN
        let ratedVolume20=cbmTotal/tipo20ft.volume;
        // Calculo la cantidad de contenedores 40HQ para esta carga, basada en VOLUMEN
        let ratedVolume40=cbmTotal/tipo40hq.volume;        
        
        // Calculo la cantidad de contenedores 20FT necesarios para el embarque.
        // Si el volumen requerido es mayor al peso, me guio x el volumen. Si no, por el peso
        // La cantidad es un parte entera y una fraccion.
        if(ratedVolume20>ratedWeight20)
        {
            cantidadContenedores20=ratedVolume20;
            cantidadContenedoresEnt20=Math.floor(ratedVolume20);            
            cantidadContenedoresFrac20=cantidadContenedores20 - cantidadContenedoresEnt20;
        }
        else
        {
            cantidadContenedores20=ratedWeight20;
            cantidadContenedoresEnt20=Math.floor(ratedWeight20);            
            cantidadContenedoresFrac20=cantidadContenedores20 - cantidadContenedoresEnt20;
        }

        glocContenedores20=gloc20*Math.ceil(cantidadContenedores20);
        resultCalcFlete20=this.calcularCostoFleteBase20(cantidadContenedores20,gloc.fleteint_1p20ft_guad,gloc.fleteint_2p20ft_guad).glocFlete;
        glocContenedores20=glocContenedores20+resultCalcFlete20.glocFlete;

        // Volumetria en 40ST
        // Si el volumen requerido es mayor al peso, me guio x el volumen. Si no, por el peso
        // La cantidad es un parte entera y una fraccion.
        if(ratedVolume40>ratedWeight40)
        {   // Manda Volumen.
            cantidadContenedores40=ratedVolume40;
            cantidadContenedoresEnt40=Math.floor(ratedVolume40);
            cantidadContenedoresFrac40=cantidadContenedores40-cantidadContenedoresEnt40;

             // Solo saco los gastos con la cantidad ENTERA de contenedores. La fraccion puede que se resuelva
            // con un 20FT. No lo se. Me fijo debajo.
            glocContenedores40=gloc40*cantidadContenedoresEnt40;

            // Veo si puedo meter la fraccion en un 20FT ... Como este seccion del if es gobernada por el volumen
            // pues comparo volumenes.
            if(cantidadContenedoresFrac40<tipo20ft.volume)
            {
                // La Fraccion entra en un 20FT. Cancelo la fraccion en el 40
                cantidadContenedoresFrac40=0;
                // y sumo un contenedor 20FT
                cantidadContenedoresEnt20=1;
                // Tambien lo sumo al gasto
                glocContenedores40=glocContenedores40+gloc20;            
            }
            else
            { // Es mas que un 20FT. Lo compiuto como 40.
                glocContenedores40=glocContenedores40+gloc40;
            }
            
        }
        else
        {   // Manda Peso.
            cantidadContenedores40=ratedWeight40;
            cantidadContenedoresEnt40=Math.floor(ratedWeight40);            
            cantidadContenedoresFrac40=cantidadContenedores40-cantidadContenedoresEnt40;
            glocContenedores40=gloc40*cantidadContenedoresEnt40;
            // Veo si puedo meter la fraccion en un 20FT ...
            if(cantidadContenedoresFrac40<tipo20ft.weight)
            {
                // La faccion entra en un 20FT. Cancelo la fraccion en el 40.
                cantidadContenedoresFrac40=0;
                // Sumo 1 20FT al conteo y los gastos. Es la menor unidad de transporte.
                cantidadContenedoresEnt20=1;
                glocContenedores40=glocContenedores40+gloc20;
            }
            else
            {
                glocContenedores40=glocContenedores40+gloc40;
            }
            
        }
        // El calculo del gasto del flete tiene varias posibilidades, asi que lo hace una funcion.
        resultCalcFlete40=this.calcularCostoFleteBase40(cantidadContenedores40,cantidadContenedoresEnt20,gloc.fleteint_1p20ft_guad,gloc.fleteint_1p40sthq_guad,gloc.fleteint_2p40sthq_guad).glocFlete;
        // Sumo el gasto del flete.
        glocContenedores40=glocContenedores40+resultCalcFlete20.glocFlete;

        //Aca se disputan los costos. Me quedo con el menor. Ademas de enviar el valor envio un string que proviene
        //del calculo del flete que contiene indicaciones de como esta compuesta la carga
        if(glocContenedores20<glocContenedores40)
        {
            return{gastos:glocContenedores20,infoGastos:resultCalcFlete20.infoStr,cantContEnt20:cantidadContenedoresEnt20,cantContFrac20:cantidadContenedoresFrac20,cantContEnt40:cantidadContenedoresEnt40,cantContFrac40:cantidadContenedoresFrac40}
        }
        else
        {
            return{gastos:glocContenedores40,infoGastos:resultCalcFlete40.infoStr,cantContEnt20:cantidadContenedoresEnt20,cantContFrac20:cantidadContenedoresFrac20,cantContEnt40:cantidadContenedoresEnt40,cantContFrac40:cantidadContenedoresFrac40}
        }
                        
    },

    // Calcula el flete usando 20FTs
    calcularCostoFleteBase20: function(costoFleteSimple20, costoFleteDoble20, cantidadContenedores20)
    {
            let cantCont20EntBase2=Math.floor(cantidadContenedores20/2);
            let cantCont20FracBase2=cantidadContenedores20%20;
            let glocFlete=0;
            let infoStr="";

            glocFlete=cantCont20EntBase2*costoFleteDoble20;
            // La fraccion puede ir de 0.1 a 1.99. Si pasa de 1, tengo que usar un 2*20FT
            if(cantCont20FracBase2.toFixed(2)>1.05)
            {   // La faccion excede un 20FT ... agrego el costo de un flete doble
                glocFlete=glocFlete+costoFleteDoble20
                infoStr=(cantCont20EntBase2+1).toFixed(2)+" fletes dobles20"
            }
            else
            {   // No excede el costo de flete de un 20FT ... Agrego el costo de un flete simple
                glocFlete=glocFlete+costoFleteSimple20;
                infoStr=(cantCont20EntBase2).toFixed(2)+" fletes dobles20 + 1 flete simple20"
            }
            return {glocFlete,infoStr};
    },

    // Calcula el flete asumiendo que el tipo se usan 40ST/HQs
    calcularCostoFleteBase40: function(cantCont40,cantContEnt20,costoFleteSimple20,costoFleteSimple40,costoFleteDoble40)
    {
            let cantCont40EntBase2=Math.floor(cantCont40/2)
            let cantCont40FracBase2=cantCont40%2
            let glocFlete=0;
            let infoStr="";

            glocFlete=cantCont40EntBase2*costoFleteDoble40;

            // Si hay un contEnt20 vale 1, significa que la rutina que calcula los gastos encontro que se puece acomodar la fraccion en el
            // Me fijo si fue asi
            if(cantContEnt20.toFixed(1)>0.9)
            {   // Si, la fraccion entra en un 20FT.
                glocFlete=glocFlete+costoFleteSimple20;
                infoStr=(cantCont40EntBase2.toFixed(2))+" fletes dobles40 + 1 flete simple20"
            }
            else
            {   // La Fracion no entra en un 20FT.
                // La fraccion es modulo 2, va de 0.1 a 1.99. Si para 1.05, decreto que es un doble.
                if(cantCont40FracBase2>1.05)
                {
                    // Al gasto que ya tenia sumo un doble.
                    glocFlete=glocFlete+costoFleteDoble40;
                    infoStr=(cantCont40EntBase2+1).toFixed(2)+" fletes dobles40"
                }
                else
                {   // Es menos que 1.05, necesito un simple.
                    glocFlete=glocFlete+costoFleteSimple40;
                    infoStr=cantCont40EntBase2.toFixed(2)+" fletes dobles40 + 1 flete simple40";
                }
            }
            return {glocFlete,infoStr};
    },

    // Calcula cuantos contenedores se necesito para albergar el presente item en la cantidad solicitada
    // RECIBE selectedItem, que son los datos ingresados cuando se agrega un producto (ver AddDetaill)
    // RECIBE el tipo de carga elegido para saber el peso y el volumen (normlamente en formik.values.carga_id)
    calculaContenedoresPorItem: function(item,carga)
    {
        const pesoItem=this.calcularPesoItem(item.gwctn,item.pcsctn,item.qty);
        const volumenItem=this.calcularVolumenItem(item.cbmctn,item.pcsctn,item.qty);
        let calculo=0.0;
        if (item?.qty!=undefined & item?.cbmctn!=undefined & item?.gwctn!=undefined & item?.pcsctn!=undefined & item.pcsctn>0 & item.qty>0 & (item.cbmctn>0 | item.gwctn>0)) 
        {
            if((pesoItem/carga.weight) > (volumenItem/carga.volume))
            {     calculo=pesoItem/(carga.weight);
                  //setItemContenedor(calculo);
              //setUsaVolumen(false);
              return{itemCont:calculo,usaVol:false}
            }
            else
            {     
              calculo=volumenItem/(carga.volume)
              //setItemContenedor(calculo);
              //setUsaVolumen(true);
              return{itemCont:calculo,usaVol:true}
            }   
        }

        
        return{itemCont:0,usaVol:false}
    },

    // Recibe el item (cantidad, peso, volumen), lista de productosm el tipo de carga y el limite 
    calculaRemanentePiezasTopCont: function(item,productData,carga,limiteCont)
    {
            //let itemsCotenedorRaw=calculaNumeroContenedores(productData,carga);
            // Quito el item bajo edicion de la lista de productos (si estuviere). Me lo pasan aparte como parametro.
            // y corresponde a la instancia realtime. Por eso elimino de la lista dicho producto, si no lo estaria
            // teniendo en cuenta 2 veces.
            let productos=productData?.filter((prod)=>prod.id!=item.id);
            let result=this.calculaNumeroContenedores(productos,carga);
            let itemsContenedor=result.cantContEnt;
            let itemContenedor=this.calculaContenedoresPorItem(item,carga).itemCont;
            let usaVol=result.usaVolumen;
            let pRemanentes=0;
            //let remanente=Math.ceil(itemCont+limiteCont)-(itemCont+limiteCont); 
        

            let remanente=0;

            console.log(itemContenedor,itemsContenedor);
            // La cantidad de piezas remanentes son SIN INCLUIR el articulo bajo edicion (que se pasa como parametro
            // en "item"). 
            // Si limite contenedor es 0, esta en modo AUTO, el remanente es la diferencia entre lo
            // que ocupa el item actual y la cantidad de contenedores entera mas cercana
            if(limiteCont==0)
            {
                remanente=Math.ceil(itemsContenedor+itemContenedor)-(itemsContenedor+itemContenedor);
                //console.log(remanente);
            }
            else    // El remanente de espacio es la diferencia entre lo ya ocupado y el limite
            {
                remanente=limiteCont-(itemsContenedor+itemContenedor);
            }

            // El item en edicion existe con cantidades validas. Calculo la cantidad de piezas remanentes.
            if(item.pcsctn>0 & (item.cbmctn>0 | item.gwctn>0))
            {               
                if(usaVol)
                {
                    //console.log("vol");
                    pRemanentes=(remanente*carga?.volume)/(item.cbmctn/item.pcsctn);
                }
                else
                {
                    //console.log("peso");
                    pRemanentes=(remanente*carga?.weight)/(item.gwctn/item.pcsctn);
                }                
            }
            console.log(pRemanentes);
            // El item tiene faltante de cantidades o datos. Solo puedo devolver el remanente calculado 
            // respecto de los items previos.
            //  console.log(item,remanente);
            if(item.qty==undefined || item.qty==null || item.qty==0)
            {
                if(pRemanentes>0)
                {
                    return Math.floor(pRemanentes);        
                }
                else
                {
                    return(0);
                }
            }

            return(Math.floor(pRemanentes));
                                   
    },
    calcularCantContFromPrev: function(cargaOrig,cantOrig,cargaNew)
    {
        let volumenOrig=cargaOrig.volume*cantOrig;
        let pesoOrig=cargaOrig.weight*cantOrig;

        if((volumenOrig/cargaNew.volume)>(pesoOrig/cargaNew.weight))
        {
            return (volumenOrig/cargaNew.volume);
        }
        else
        {
            return (pesoOrig/cargaNew.weight);
        }
    }
}