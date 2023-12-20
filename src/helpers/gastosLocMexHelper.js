
export const gastosLocMexHelper = {
   
    // Calcula el peso de un item del excel. Un item se entiende, el pedido de un item, pueden ser 3100 piezas
    calcularGastosDespa: function (gastos,cif_grand_total) {

        return (
            cif_grand_total * gastos?.gloc_despachante_var +
            gastos?.gloc_despachante_fijo +
            gastos?.gloc_despachante_otro1 +
            gastos?.gloc_despachante_otro2
          );
    },

    calcAndSetGloc: function(formik,gastos,cantContenedores)
    {
        formik.setFieldValue("freight_cost",Math.ceil(gastos?.freight_charge*cantContenedores));
        formik.setFieldValue("gloc_fwd",Math.ceil(gastos?.gloc_fwd*cantContenedores));
        formik.setFieldValue("gloc_descarga",Math.ceil(gastos?.gasto_descarga_depo*cantContenedores));
        formik.setFieldValue("gloc_terminales",Math.ceil(gastos?.gasto_terminal*cantContenedores));

        let cantContBase2 = Math.floor(cantContenedores/2);
        // La cantidad de contenedores multiplo de 2, la puedo llevar en fletes dobles.
        let glocFlete = (gastos?.flete_interno_doble)*cantContBase2;      
        if((cantContenedores%2)>0.1)
        { // Si la cantidad Impar de contenedores, sumo un flete simple, el resto va todos en fletes dobles.
            glocFlete=glocFlete+gastos.flete_interno;        
        }


        //console.log(glocFlete);
        formik.setFieldValue("gloc_flete",glocFlete);
        formik.setFieldValue("gloc_despachantes",Math.ceil(this.calcularGastosDespa(gastos,formik?.values?.cif_grand_total)/**cantContenedores*/));
    },

    calcularGloc: function(gastos,cantConte,fob_grand_total,cif_grand_total)
    {
            const cantContenedores=Math.ceil(cantConte);
            let misGloc={gloc_fwd:0,
                         gloc_flete:0,
                         gloc_terminales:0,
                         gloc_polizas:0,
                         gloc_depositos:0,
                         gloc_despachantes:0,
                         gloc_bancos:0,
                         gloc_gestdigdoc:0,
                         gloc_descarga:0,
                         freight_cost:0,
                         freight_insurance_cost:0
                        };

            
                        misGloc.freight_cost=gastos?.freight_charge*cantContenedores;
                        misGloc.gloc_fwd=gastos?.gloc_fwd*cantContenedores;
                        misGloc.gloc_descarga=gastos?.gasto_descarga_depo*cantContenedores;
                        misGloc.gloc_terminales=gastos?.gasto_terminal*cantContenedores;
                
                        let cantContBase2 = Math.floor((cantConte+0.01)/2);

                        //console.log("HOLA",cantContBase2);

                        // La cantidad de contenedores multiplo de 2, la puedo llevar en fletes dobles.
                        let glocFlete = (gastos?.flete_interno_doble)*cantContBase2;      
                        if((cantConte%2)>0.1)
                        { // Si la cantidad Impar de contenedores, sumo un flete simple, el resto va todos en fletes dobles.
                            glocFlete=glocFlete+gastos.flete_interno;        
                        }
                        misGloc.gloc_flete=glocFlete;
                        misGloc.gloc_despachantes=this.calcularGastosDespa(gastos,cif_grand_total)*cantContenedores;
                        misGloc.freight_insurance_cost=((gastos?.insurance_charge / 100) * fob_grand_total);

                        //console.log(misGloc);
                        return misGloc;
    }
}