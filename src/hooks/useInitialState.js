import { useState, useEffect } from "react";
const API = process.env.REACT_APP_API_URL;
const initialState = {  //
    //VARIABLES DE SESION
    error: false,
    userId: localStorage.getItem('userIdL') || '',
    user: localStorage.getItem('authUser') || '',
    token: localStorage.getItem('authToken') || '',
    userName: localStorage.getItem('userName') || 'Invitado',
    role: localStorage.getItem('roleL') || '',
    proveedorId: localStorage.getItem('proveedorIdL') || '',
    //VARIABLES DE LOS CARRITOS
    totalCompra: localStorage.getItem('totalCompraL') || '',
    cartOrderId: localStorage.getItem('cartOrderIdL') || '',
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    //VARIABLES DEL CONFIGURADOR
    confOrderId: localStorage.getItem('confOrderIdL') || '',
    cartConf: [], 
    marcaC: [],
    modeloC: [],
    anioC: localStorage.getItem('anioL') || [],
    configC: [], //marca,modelo,anio
    dinesC:[],
    estereoC: [],



    ocultaBotonUnDinC: true,
    ocultaBotonDobleDinC: true,
    ocultaBotonC: true,
    ocultaBotonOriginalC: true,
    mensajeC: '',
    numItems: 0,
    tipoConfiguracionC: [],
    dinesC:[],
    orderConf: [],  //Guardamos el array tal cual se postea en la API de orden "SIMPLIFICADO"
    cartConfOrder : [], //Guardamos el objeto tal cual como lo recibimos de la API
    baseC: [],
    arnesC: [],
    adaptadorC: [],
    mejorarAudio: [],
    tieneBocinaReemplazo: [],
    bocinaReemplazoDelanteraC: [],
    calzaBocinaReemplazoDelanteraC: [],
    bocinaReemplazoTraseraC: [],
    calzaBocinaReemplazoTraseraC: [],
    terminaConfiguracion1: [],
    amplificadorC: [],  //Este es el amplificador de Voz
    tieneBocinaOriginal: [],
    bocinaPremiumDelanteraC: [],
    calzaBocinaPremiumDelanteraC: [],
    bocinaPremiumTraseraC: [],
    calzaBocinaPremiumTraseraC: [],
    tieneAmplificadorBajos: [],
    amplificadorWooferC: [],
    amplificador3en1C: [],
    wooferC: [],
    cajonAcusticoC: [],
    kitCablesC: [],
    tieneEcualizador: [],
    ecualizadorC: [],
    epicentroC: [],
    procesadorC: [],
    tweeterC:[],
    tweeterCP:[],
    accesorioC: [],
    tieneEstereoOriginalC: [],
    tieneEstereoTipoOriginalC: [],
    adaptadorImpedanciaC: [],
    medioRangoO: [],
    setComponentesO: []
}


const useInitialState = () =>{  //Funcion para inicializar el estado
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(false); 
    console.log("Loading state...");
    const [state, setState] = useState(initialState); 
    const [refresh,setRefresh] = useState(true);



    const refreshState = () => {
        console.log("Refreshing state...");
        setRefresh(prev => !prev); // Toggle the refresh state
    };

    useEffect(() =>
        {
        //console.log("Verificando si tiene una sesion activa");
           //setTimeout(() => {
            try{
              const localStorageToken = localStorage.getItem('authToken');    
              const localStorageUser = localStorage.getItem('authUser');  
              const localStorageproveedorId = localStorage.getItem('proveedorIdL');
              const localStorageUserId = localStorage.getItem('userIdL');  
              const localStorageRole = localStorage.getItem('roleL');
              //Adicionalmente hay que validar que el token es valido     
              
              if(localStorageToken && localStorageToken !== 'null' && 
                localStorageUser && localStorageUser !== 'null'){
                const dataLogin = {
                  token: localStorageToken,
                  user: localStorageUser,
                  userId: localStorageUserId,
                  proveedorId: localStorageproveedorId,
                  role: localStorageRole,
                }
                //console.log(dataLogin);
                //Enviando datos de sesion del local storage'
                setLogin(dataLogin);  //State (setLogin)
                //setDataLogin(dataLogin);  //State (setLogin)
                /*if (localStorageRole == 'cliente'){
                  navigate('/');
                }
                else {
                  navigate('/Dashboard');
                }*/
      
              }
              //setLoading(false);
            }
            catch(error){
              setLoading(false);
              //setError(true);
              console.error("No se pudo encontrar la sesion");
              console.log(error);
            }
          //},3000) 
        },[refresh]
    );

    /*useEffect(() => {
        console.log("Se ejecuta fetchOrderData");
        fetchOrderData(dataLogin);
    }, [state.token]); */



    const setConfigInicial = (payload) =>{
        //En esta funcion borramos toda la configuracion, ya que al llamar 2 funciones que modifican el state, solo hace caso a una
        //Lo usamoes en el configurador 1
        //Borramos todo del state
        console.log("Payload SetConfigInicial");
        console.log(payload);
        let data = [];
        let sumTotalPrecioPromo = 0;
        data = state.cartConf;
        data.forEach((item) => {
            sumTotalPrecioPromo += parseFloat(item.precioPromoTotal) * item.amount;
        });
        setState({...state, 
            configC: [],
            marcaC:payload.marca, //configurador1
            modeloC:payload.modelo,  //configurador1
            anioC:payload.anio, //configurador1
            tipoConfiguracionC: payload.tipoConfiguracionC, //configurador1
            dinesC:[],
            estereoC:[],
            baseC: [],
            arnesC: [],
            adaptadorC: [],
            adaptadorImpedanciaC: [],
            mejorarAudio: [],
            tieneBocinaReemplazo: [],
            bocinaReemplazoDelanteraC: [],
            calzaBocinaReemplazoDelanteraC: [],
            bocinaReemplazoTraseraC: [],
            calzaBocinaReemplazoTraseraC: [],
            terminaConfiguracion1: [],
            amplificadorC: [],
            tieneBocinaOriginal: [],
            bocinaPremiumDelanteraC: [],
            calzaBocinaPremiumDelanteraC: [],
            bocinaPremiumTraseraC: [],
            calzaBocinaPremiumTraseraC: [],
            tieneAmplificadorBajos: [],
            amplificadorWooferC: [],
            amplificador3en1C: [],
            wooferC: [],
            cajonAcusticoC: [],
            kitCablesC: [],
            tieneEcualizador: [],
            ecualizadorC: [],
            epicentroC: [],
            procesadorC: [],
            tweeterC:[],
            accesorioC: [],
            tieneEstereoOriginalC: [],
            tieneEstereoTipoOriginalC: [],
            medioRangoO: [],
            //setMediosO: [],
            setComponentesO: [],
            totalCompra: state.totalCompra - sumTotalPrecioPromo,
            cartConf: [], 
        });       
    };


    const resetLocalStorage = () => {
        localStorage.removeItem('totalCompraL');
        localStorage.removeItem('confOrderIdL');
        localStorage.removeItem('cartOrderIdL');
        localStorage.removeItem('cart');
        localStorage.removeItem('anioL');
        // Add more localStorage.removeItem('key') if needed
    };
    const getClientData = async (userId) => {
        console.log("Entra a getClientData");
        try {
            const response = await fetch(`${API}clientes/${userId}`);
            console.log(`${API}clientes/${userId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch client data");
            }
            const clientData = await response.json();
            return clientData;
        } catch (error) {
            console.error("Error fetching client data:", error);
            return null;
        }
    };

     /*FUNCIONES PARA TRAER EL CARRITO****************************/
    const fetchFullData = async (orderId, authToken) => {
        const response = await fetch(`${API}orders/${orderId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
        return response.json();
    };
    const calculateTotal = (items) => {
        if (!items) return 0;
        return items.reduce((total, item) => {
            const unitPrice = item.precioPromoTotal !== null
                ? parseFloat(item.precioPromoTotal)
                : parseFloat(item.precioTotal);
            return total + unitPrice * item.amount;
        }, 0);
    };
    const handlematchOrdersTodas = (data,dataCart,montoTotal,cartOrderId,confOrderId,payloadLogin) =>{ //data= orden configurador,dataCart = carrito Normal
        //console.log("Inicia handlematchOrdersTodas");
        //console.log(data.tieneBocinaReemplazo_Configurador);
        //console.log(data.tieneBocinaReemplazo);
        const  dataPost = {
            marca: data.marca, 
            modelo: data.modelo, 
            anio: data.anio,
            version: null,
            dines: data.dines,
            tipoConfiguracion: data.tipoConfiguracion,//data.tipoConfiguracion || 'Basica',
            orderType: data.orderType,
            bocinaReemplazoTraseraC:'',
            mejorarAudio: data.mejorarAudio, //Quitar Luis, poner como espacio vacio mientras
            tieneEstereoOriginalC: data.tieneEstereoOriginalC,
            tieneBocinaReemplazo: data.tieneBocinaReemplazo, 
            terminaConfiguracion1: data.terminaConfiguracion1,
            tieneAmplificadorBajos: data.tieneAmplificadorBajos,
            tieneEcualizador: data.tieneEcualizador,
            tieneBocinaOriginal: data.tieneBocinaOriginal,
            bocinaReemplazoDelanteraC: data.bocinaReemplazoDelanteraC,
            calzaBocinaReemplazoDelanteraC: data.calzaBocinaReemplazoDelanteraC,
            bocinaReemplazoTraseraC: data.bocinaReemplazoTraseraC,
            calzaBocinaReemplazoTraseraC: data.calzaBocinaReemplazoTraseraC,
            bocinaPremiumDelanteraC: data.bocinaPremiumDelanteraC,
            calzaBocinaPremiumDelanteraC: data.calzaBocinaPremiumDelanteraC,
            bocinaPremiumTraseraC: data.bocinaPremiumTraseraC,
            calzaBocinaPremiumTraseraC: data.calzaBocinaPremiumTraseraC,
            cajonAcusticoC: data.cajonAcusticoC,
            amplificadorWooferC: data.amplificadorWooferC,
            amplificador3en1C: data.amplificador3en1C,
            wooferC: data.wooferC,
            kitCablesC: data.kitCablesC,
            ecualizadorC: data.ecualizadorC,
            epicentroC: data.epicentroC,
            procesadorC: data.procesadorC,
            tweeterC: data.tweeterC,
            accesorioC: data.accesorioC,
            //Se agregaron estos campos para completar el array
            id:data.order_id,
            precioTotal:data.precioTotal,
            precioPromoTotal:data.precioPromoTotal,
            totalItems:data.totalItems,
            status:data.status,
            direccionId:data.direccionId,
            tieneEstereoTipoOriginalC:data.tieneEstereoTipoOriginalC,
            setMediosO:data.setMediosO,
            medioRangoO:data.medioRangoO,
            amplificadorVozC:data.amplificadorVozC,
            paymentId:data.paymentId,
            clienteId:data.clienteId,
            referencia:data.referencia,
            notas:data.notas,
            noGuia:data.noGuia,
            paqueteria:data.paqueteria,
            total:data.total,
            saldo:data.saldo,
            saldoVenta:data.saldoVenta,
            descuento:data.descuento,
            emailEnviado:data.emailEnviado,
            metodoPago:data.metodoPago,
            createdAt:data.createdAt,
            lastmodified:data.lastmodified,
        }
        if (data.orderType == 'configurador' || data.orderType == 'openshow'){
          setMatchOrdersTodas(data.items,dataPost,dataCart,montoTotal,cartOrderId,confOrderId,payloadLogin);
        }
        else{
          setMatchOrdersTodas([],[],dataCart,montoTotal,cartOrderId,confOrderId,payloadLogin);
        }
    };
    const setMatchOrdersTodas = (payload,configuracion,carrito,montoTotal,cartOrderId,confOrderId,payloadLogin) =>{ 
        //Payload: Items(articulos) del configurador
        //configuracion: Elementos del carrito del configurador sin los items
        //Articulos del configurador-Datos del configurador-Articulos del Carrito-Configurador + carrito        
        //AQUI CARGAMOS TODOS LOS ESTADOS:
        //Este es el que haria en el login ya que no podemos actualizar el setState 2 veces
        //console.log("Inicia setMatchOrdersTodas");
        //console.log(configuracion);
        const updatedState = { ...state };
        updatedState.user = payloadLogin.user;
        updatedState.token = payloadLogin.token;
        updatedState.role = payloadLogin.roleM;
        updatedState.proveedorId = payloadLogin.proveedorId;
        updatedState.userName = payloadLogin.userName;
        //====================================
        updatedState.cartOrderId = cartOrderId;
        updatedState.confOrderId = confOrderId;
        updatedState.cart = carrito.items; //if(state.cart.length > 0){  ??pongo la conticion
        updatedState.dinesC = configuracion.dines;
        localStorage.setItem('cart', JSON.stringify(carrito.items));
        localStorage.setItem('cartOrderIdL', cartOrderId);  
        localStorage.setItem('confOrderIdL', confOrderId); 
        localStorage.setItem('totalCompraL', montoTotal);       
        updatedState.totalCompra = montoTotal;
        updatedState.marcaC = configuracion.marca;
        updatedState.modeloC = configuracion.modelo;
        updatedState.anioC = configuracion.anio;
        updatedState.configuracion = configuracion;
        if(state.cartConf.length > 0){ //Si tiene algo en el configurador no hacemos nada
            console.log("03 CONFIGURADOR LLENO");
        }  //REVISAAAARRRRRR ****************************** puede que si tenga algo y aun asi hay que actualizarlo
        else { //Si el estado no tiene nada llenamos el configurador
            if(payload.length > 0 || configuracion.length > 0)  //Llenamos las variables del configurador si no vienen vacias
            {
                //console.log("Entra b");
                let marcaCC = [];
                let modeloCC = [];
                let anioCC = [];
                let tipoConfiguracionCC = [];
                let orderTypeCC = [];
                let dinesCC = [];
                let accesorioCC = [];  //OpenShow
                let adaptadorCC = [];
                let adaptadorImpedanciaCC = [];
                let amplificadorCC = [];  //OpenShow amplificador Voz
                let amplificador3en1CC = [];
                let amplificadorWooferCC = [];  //OpenShow amplificadorwoofer/ bajos
                let medioRangoCC = [];  //OpenShow
                let setComponentesCC = [];
                let kitCablesCC = [];  //OpenShow
                let tweeterCC = [];  //OpenShow
                let wooferCC = [];  //OpenShow
                let cajonesCC = [];  //OpenShow
                let ecualizadorCC = [];
                let epicentroCC = [];
                let procesadorCC = [];
                 //Configurador
                let estereoCC = [];
                let baseCC = [];
                let arnesCC = [];
                let mejorarAudioCC = []; //**
                let tieneBocinaRemplazoCC = [];
                let bocinaReemplazoDelanteraCC = [];
                let calzaBocinaReemplazoDelanteraCC = [];
                let bocinaReemplazoTraseraCC = [];
                let calzaBocinaReemplazoTraseraCC = [];
                let tieneEstereoOriginalCC = [];
                let terminaConfiguracion1CC = [];
                let tieneAmplificadorBajosCC = [];
                let tieneEcualizadorCC = [];
                let tieneBocinaOriginalCC = [];
                let bocinaPremiumDelanteraCC = [];
                let calzaBocinaPremiumDelanteraCC = [];
                let bocinaPremiumTraseraCC = [];
                let calzaBocinaPremiumTraseraCC = [];


                if (configuracion.marca != ''){ marcaCC = configuracion.marca; }
                if (configuracion.modelo != ''){ modeloCC = configuracion.modelo; }
                if (configuracion.anio != ''){ anioCC = configuracion.anio; }
                if (configuracion.dines != ''){ dinesCC = configuracion.dines; }
                if (configuracion.tipoConfiguracion != ''){ tipoConfiguracionCC = configuracion.tipoConfiguracion; } 
                if (configuracion.orderType != ''){ orderTypeCC = configuracion.orderType; }  
                if (configuracion.mejorarAudio != ""){ mejorarAudioCC = configuracion.mejorarAudio; }
                if (configuracion.tieneEstereoOriginalC != ""){ tieneEstereoOriginalCC = configuracion.tieneEstereoOriginalC; }
                if (configuracion.tieneBocinaReemplazo != "") { tieneBocinaRemplazoCC = configuracion.tieneBocinaReemplazo; }
                if (configuracion.terminaConfiguracion1 != ""){ terminaConfiguracion1CC = configuracion.terminaConfiguracion1; }
                if (configuracion.tieneAmplificadorBajos != ""){ tieneAmplificadorBajosCC = configuracion.tieneAmplificadorBajos; }
                if (configuracion.tieneEcualizador != ""){ tieneEcualizadorCC = configuracion.tieneEcualizador; }
                if (configuracion.tieneBocinaOriginal != ""){ tieneBocinaOriginalCC = configuracion.tieneBocinaOriginal; }
                if (configuracion.bocinaReemplazoDelanteraC == 'N/A'){ bocinaReemplazoDelanteraCC = configuracion.bocinaReemplazoDelanteraC; }
                if (configuracion.calzaBocinaReemplazoDelanteraC == 'N/A'){ calzaBocinaReemplazoDelanteraCC = configuracion.calzaBocinaReemplazoDelanteraC; }
                if (configuracion.bocinaReemplazoTraseraC == 'N/A'){ bocinaReemplazoTraseraCC = configuracion.bocinaReemplazoTraseraC; }
                if (configuracion.calzaBocinaReemplazoTraseraC == 'N/A'){ calzaBocinaReemplazoTraseraCC = configuracion.calzaBocinaReemplazoTraseraC; }
                if (configuracion.wooferC == 'N/A'){ wooferCC = configuracion.wooferC; }
                if (configuracion.cajonAcusticoC == 'N/A'){ cajonesCC = configuracion.cajonAcusticoC; }
                if (configuracion.ecualizadorC == 'N/A'){ ecualizadorCC = configuracion.ecualizadorC; }
                if (configuracion.epicentroC == 'N/A'){ epicentroCC = configuracion.epicentroC; }
                if (configuracion.procesadorC == 'N/A'){ procesadorCC = configuracion.procesadorC; }
                if (configuracion.tweeterC == 'N/A'){ tweeterCC = configuracion.tweeterC; }
                if (configuracion.accesorioC == 'N/A'){ accesorioCC = configuracion.accesorioC; }            
                if (configuracion.amplificador3en1C == 'N/A'){ amplificador3en1CC = configuracion.amplificador3en1C; }
                if (configuracion.kitCablesC == 'N/A'){ kitCablesCC = configuracion.kitCablesC; }
                if (configuracion.bocinaPremiumDelanteraC == 'N/A'){ bocinaPremiumDelanteraCC = configuracion.bocinaPremiumDelanteraC; }
                if (configuracion.calzaBocinaPremiumDelanteraC == 'N/A'){ calzaBocinaPremiumDelanteraCC = configuracion.calzaBocinaPremiumDelanteraC; }
                if (configuracion.bocinaPremiumTraseraC == 'N/A'){ bocinaPremiumTraseraCC = configuracion.bocinaPremiumTraseraC; }
                if (configuracion.calzaBocinaPremiumTraseraC == 'N/A'){ calzaBocinaPremiumTraseraCC = configuracion.calzaBocinaPremiumTraseraC; }

                payload.map(orden => {  //payload son los items de la orden, aqui hago un mapeo de todos
                    orden.id = orden.id_producto; 
                    switch(parseInt(orden.categoryIdConfigurador)) {
                        case 1: accesorioCC = orden;  break;
                        case 2: adaptadorCC = orden; break;
                        case 3: adaptadorImpedanciaCC = orden; break;
                        case 4: amplificador3en1CC = orden; break;
                        case 5: amplificadorCC = orden; break;
                        case 6: amplificadorWooferCC = orden; break;                    
                        case 7: arnesCC = orden;  break;
                        case 8: baseCC = orden; break;
                        case 9: bocinaPremiumDelanteraCC = orden; break;
                        case 10: bocinaPremiumTraseraCC = orden; break;
                        case 11: bocinaReemplazoDelanteraCC = orden; break;
                        case 12: bocinaReemplazoTraseraCC = orden; break;
                        case 13: cajonesCC = orden; break;
                        case 14: calzaBocinaPremiumDelanteraCC = orden; break;
                        case 15: calzaBocinaPremiumTraseraCC = orden; break;
                        case 16: calzaBocinaReemplazoDelanteraCC = orden; break;
                        case 17: calzaBocinaReemplazoTraseraCC = orden; break;
                        case 18: ecualizadorCC = orden; break;
                        case 19: epicentroCC = orden; break;
                        case 20: estereoCC = orden; break;
                        case 21: kitCablesCC = orden; break;
                        case 22: medioRangoCC = orden; break;
                        case 23: procesadorCC = orden; break;
                        //case 24: console.log("aqui entro el set de medios"); setMediosCC = orden; break;
                        case 24: setComponentesCC = orden; break;
                        case 25: tweeterCC = orden; break;
                        case 26: wooferCC = orden; break;
                        default: console.log("Otro producto");
                    }
                }    
                );


                updatedState.marcaC = state.cartConf.length === 0 ? marcaCC : state.marcaC;
                updatedState.modeloC = state.cartConf.length === 0 ? modeloCC : state.modeloC;
                updatedState.anioC = state.cartConf.length === 0 ? anioCC : state.anioC;
                updatedState.tipoConfiguracionC = state.cartConf.length === 0 ? tipoConfiguracionCC : state.tipoConfiguracionC;
                updatedState.dinesC = state.cartConf.length === 0 ? dinesCC : state.dinesC;
                //setState(updatedState);  //Solo vendria lleno el cart
                //Insertamos los mismos valores en el local storage
                 // Open Show
                updatedState.accesorioC = state.cartConf.length === 0 ? accesorioCC : state.accesorioC;
                updatedState.kitCablesC = state.cartConf.length === 0 ? kitCablesCC : state.kitCablesC;
                updatedState.amplificadorC = state.cartConf.length === 0 ? amplificadorCC : state.amplificadorC;
                updatedState.amplificadorWooferC = state.cartConf.length === 0 ? amplificadorWooferCC : state.amplificadorWooferC;
                updatedState.medioRangoO = state.cartConf.length === 0 ? medioRangoCC : state.medioRangoO;
                // updatedState.setMediosO = state.cartConf.length === 0 ? setMediosCC : state.setMediosO;
                updatedState.setComponentesO = state.cartConf.length === 0 ? setComponentesCC : state.setComponentesO;
                updatedState.tweeterC = state.cartConf.length === 0 ? tweeterCC : state.tweeterC;
                updatedState.wooferC = state.cartConf.length === 0 ? wooferCC : state.wooferC;
                updatedState.orderType = state.cartConf.length === 0 ? orderTypeCC : state.orderType;
                updatedState.estereoC = state.cartConf.length === 0 ? estereoCC : state.estereoC; 
                updatedState.baseC = state.cartConf.length === 0 ? baseCC : state.baseC;
                updatedState.arnesC = state.cartConf.length === 0 ? arnesCC : state.arnesC;
                updatedState.adaptadorC = state.cartConf.length === 0 ? adaptadorCC : state.adaptadorC;
                updatedState.adaptadorImpedanciaC = state.cartConf.length === 0 ? adaptadorImpedanciaCC : state.adaptadorImpedanciaC;
                updatedState.mejorarAudio = state.cartConf.length === 0 ? mejorarAudioCC : state.mejorarAudio;
                updatedState.tieneEstereoOriginalC = state.cartConf.length === 0 ? tieneEstereoOriginalCC : state.tieneEstereoOriginalC;
                updatedState.tieneBocinaReemplazo = state.cartConf.length === 0 ? tieneBocinaRemplazoCC : state.tieneBocinaReemplazo;
                updatedState.bocinaReemplazoDelanteraC = state.cartConf.length === 0 ? bocinaReemplazoDelanteraCC : state.bocinaReemplazoDelanteraC;
                updatedState.calzaBocinaReemplazoDelanteraC = state.cartConf.length === 0 ? calzaBocinaReemplazoDelanteraCC : state.calzaBocinaReemplazoDelanteraC;
                updatedState.bocinaReemplazoTraseraC = state.cartConf.length === 0 ? bocinaReemplazoTraseraCC : state.bocinaReemplazoTraseraC;
                updatedState.calzaBocinaReemplazoTraseraC = state.cartConf.length === 0 ? calzaBocinaReemplazoTraseraCC : state.calzaBocinaReemplazoTraseraC;
                updatedState.cajonAcusticoC = state.cartConf.length === 0 ? cajonesCC : state.cajonAcusticoC;
                updatedState.ecualizadorC = state.cartConf.length === 0 ? ecualizadorCC : state.ecualizadorC;
                updatedState.epicentroC = state.cartConf.length === 0 ? epicentroCC : state.epicentroC;
                updatedState.procesadorC = state.cartConf.length === 0 ? procesadorCC : state.procesadorC;
                updatedState.terminaConfiguracion1 = state.cartConf.length === 0 ? terminaConfiguracion1CC : state.terminaConfiguracion1;
                updatedState.tieneAmplificadorBajos = state.cartConf.length === 0 ? tieneAmplificadorBajosCC : state.tieneAmplificadorBajos;
                updatedState.tieneEcualizador = state.cartConf.length === 0 ? tieneEcualizadorCC : state.tieneEcualizador;
                updatedState.tieneBocinaOriginal = state.cartConf.length === 0 ? tieneBocinaOriginalCC : state.tieneBocinaOriginal;
                updatedState.amplificador3en1C = state.cartConf.length === 0 ? amplificador3en1CC : state.amplificador3en1C;
                updatedState.bocinaPremiumDelanteraC = state.cartConf.length === 0 ? bocinaPremiumDelanteraCC : state.bocinaPremiumDelanteraC;
                updatedState.calzaBocinaPremiumDelanteraC = state.cartConf.length === 0 ? calzaBocinaPremiumDelanteraCC : state.calzaBocinaPremiumDelanteraC;
                updatedState.bocinaPremiumTraseraC = state.cartConf.length === 0 ? bocinaPremiumTraseraCC : state.bocinaPremiumTraseraC;
                updatedState.calzaBocinaPremiumTraseraC = state.cartConf.length === 0 ? calzaBocinaPremiumTraseraCC : state.calzaBocinaPremiumTraseraC;
                updatedState.cartConf = payload;
                //console.log("Carga los datos del carrito del congurador 1");
                updatedState.totalCompra = montoTotal;
                localStorage.setItem('anioL', anioCC);
                       
            }
            else{
                let tipoConfiguracionCC = '';
                if (configuracion.tipoConfiguracion != ''){ 
                    //console.log("Carga los datos del carrito del congurador 3");
                    tipoConfiguracionCC = configuracion.tipoConfiguracion; 
                    updatedState.tipoConfiguracionC = tipoConfiguracionCC;
                    updatedState.cartConf = payload;
                } 
            }
        }
        setState(updatedState);  //Solo vendria lleno el cart
        setLoading(false);
    }; 
     //-------------------------------------------
     const setLogin = async(payloadLogin) =>{
        console.log("Inicia setLogin");
        //Aqui dependiendo si es cliente cargo los carritos, si no solo el token 
        //Traemos el nombre del usuario
        const clientData = await getClientData(payloadLogin.userId);
        let nombreUsuarioAux = '';
        if (clientData){
            nombreUsuarioAux = clientData.nombre;
            payloadLogin.userName = nombreUsuarioAux;
        }
        // Store values in localStorage
        localStorage.setItem('authUser', payloadLogin.user);
        localStorage.setItem('authToken', payloadLogin.token);
        localStorage.setItem('payloadLogin', payloadLogin.role);
        localStorage.setItem('userName', payloadLogin.userName);
        if(payloadLogin.role != 'cliente'){
            setState({
                ...state, 
                user: payloadLogin.user,
                token: payloadLogin.token,
                role: payloadLogin.role,
                proveedorId: payloadLogin.proveedorId,
                userName: payloadLogin.userName,
            });           
        }
        else{
            await fetchOrderData(payloadLogin);  //Caragar los datos de la compra
        }
    }

    const fetchOrderData = async (payloadLogin) => {
        //console.log("Inicia fetchOrderData");
        try {
            // 1. Check if I have active orders of cart and configurador
            const APICart = `${API}ordenesUsuario/V2/get?offset=0&limit=1&status=activo&orderType=tienda`; //MANDAR TASK A LUIS, NO SIRVE FILTRO DE TYPE
            const APIConf = `${API}ordenesUsuario/V2/get?offset=0&limit=1&status=activo&orderType=configurador`; 
            const [cartResponse, confResponse] = await Promise.all([
                fetch(APICart, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${payloadLogin.token}`,
                        'Content-Type': 'application/json'
                    }
                }),
                fetch(APIConf, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${payloadLogin.token}`,
                        'Content-Type': 'application/json'
                    }
                })
            ]);    
            const cartData = await cartResponse.json();
            const confData = await confResponse.json();
            const cartOrderId = cartData.orders?.[0]?.id;
            const confOrderId = confData.orders?.[0]?.id;
            //console.log("Vemos si me trajo algun dato");
            if (!cartOrderId && !confOrderId) {
                //console.log("reseteamos el localStorage y el state");
                //setDataCarrito([]);
                //setDataConfigurador([]);
                resetLocalStorage();
                const updatedState = { ...state };
                updatedState.totalCompra = '';
                updatedState.confOrderId =  '';
                updatedState.cartOrderId =  '';
                updatedState.cart = [];
                updatedState.cartConf = [];
                updatedState.marcaC = [];
                updatedState.modeloC = [];
                updatedState.anioC = [];
                updatedState.userName = payloadLogin.userName;
                setState(updatedState); 
                console.log("Estado Vacio");
                return;
            }
            // 2. If I have any of them, then retrieve the full data 
            const [dataCart, dataConf] = await Promise.all([
                cartOrderId ? fetchFullData(cartOrderId, payloadLogin.token) : Promise.resolve({ items: [] }),
                confOrderId ? fetchFullData(confOrderId, payloadLogin.token) : Promise.resolve({ items: [] }),
            ]);           
            /*const itemOrder = createOrderItemDataContext(dataCart.items[0]);
            addToCart(itemOrder);*/
            //setDataCarrito(dataCart);
            //setDataConfigurador(dataConf);    
            // 3. Revisamos que este finalizado el configurador
            const tieneAccesorioC = dataConf.items?.some(item => item.categoryIdConfigurador === '1');
            const configuratorCompleted = dataConf.terminaConfiguracion1 === 'si' || tieneAccesorioC || dataConf.tieneEcualizador === 'no';
            const finalTotalCart = calculateTotal(dataCart.items);
            const finalTotalConf = configuratorCompleted ? calculateTotal(dataConf.items) : 0;
            const montoTotal = finalTotalCart + finalTotalConf;

            
            //console.log("dataConf");
            //console.log(dataConf);
            handlematchOrdersTodas(dataConf, dataCart, montoTotal,cartOrderId,confOrderId,payloadLogin);
        } catch (error) {
            console.error('Error fetching order data:', error);
        }
    };

    const setEstereo = (payload,payload2,amountProducts) =>{
        //console.log(payload);
        //console.log(payload2);
        setState({
            ...state, 
            estereoC:payload, 
            cartConf:[...state.cartConf, payload],   //Agrega un arreglo con los productos del configurador
            orderConf:[...state.orderConf, payload2], //Agrega un arreglo igual al de la BD, este solo queda en el estado
            totalCompra:state.totalCompra+amountProducts
        });
    };
    const setBase = (payload,payload2,amountProducts) =>{
        setState({
            ...state, 
            baseC:payload,
            cartConf:[...state.cartConf, payload], 
            orderConf:[...state.orderConf, payload2],
            totalCompra:state.totalCompra+amountProducts,
        });
    };
    const setArnes = (payload,payload2,amountProducts) =>{
        setState({
            ...state,
            arnesC:payload,
            cartConf:[...state.cartConf, payload],
            orderConf:[...state.orderConf, payload2],
            totalCompra:state.totalCompra+amountProducts,
        });
    };
    const setAdaptador = (payload,payload2,amountProducts) =>{
        setState({
            ...state, 
            adaptadorC:payload,
            cartConf:[...state.cartConf, payload],
            orderConf:[...state.orderConf, payload2],
            totalCompra:state.totalCompra+amountProducts,
        });
    };

    const setMejoraAudio = (payload)  => {
        setState({...state,mejorarAudio:payload})
    }
    
    const setTieneBocinaReemplazo = (payload) =>{
        setState({...state, tieneBocinaReemplazo:payload});
    };
    const setAmplificador = (payload,payload2,amountProducts) =>{
        setState({
            ...state,
            amplificadorC:payload,
            cartConf:[...state.cartConf, payload],
            orderConf:[...state.orderConf, payload2],
            totalCompra:state.totalCompra+amountProducts,
        });
    };
    const setBocinaReemplazoDelantera = (payload,payload2,amountProducts) =>{
        setState({
            ...state, 
            bocinaReemplazoDelanteraC:payload,
            cartConf:[...state.cartConf, payload],
            orderConf:[...state.orderConf, payload2],
            totalCompra:state.totalCompra+amountProducts,
        });
    };
    const setCalzaBocinaReemplazoDelantera = (payload,payload2,amountProducts) =>{
        setState({
            ...state, 
            calzaBocinaReemplazoDelanteraC:payload,
            cartConf:[...state.cartConf, payload],
            orderConf:[...state.orderConf, payload2],
            totalCompra:state.totalCompra+amountProducts,
        });
    };
    const setBocinaReemplazoTrasera = (payload,payload2,amountProducts) =>{
        setState({
            ...state, 
            bocinaReemplazoTraseraC:payload,
            cartConf:[...state.cartConf, payload],
            orderConf:[...state.orderConf, payload2],
            totalCompra:state.totalCompra+amountProducts,
        });
    };
    const setCalzaBocinaReemplazoTrasera = (payload,payload2,amountProducts) =>{
        setState({
            ...state, 
            calzaBocinaReemplazoTraseraC:payload,
            cartConf:[...state.cartConf, payload],
            orderConf:[...state.orderConf, payload2],
            totalCompra:state.totalCompra+amountProducts,
        });
    };
    const setTerminaConfiguracion1 = (payload) =>{
        setState({...state, terminaConfiguracion1:payload});
    };
    const setTieneAmplificadorBajos = (payload) =>{
        setState({...state, tieneAmplificadorBajos:payload});
    };
    const setAmplificadorWoofer = (payload,payload2,amountProducts) =>{
        setState({
            ...state,
            amplificadorWooferC:payload,
            cartConf:[...state.cartConf, payload],
            orderConf:[...state.orderConf, payload2],
            totalCompra:state.totalCompra+amountProducts,
        });
    };
    const setAmplificador3en1 = (payload,payload2,amountProducts) =>{
        setState({
            ...state,
            amplificador3en1C:payload,
            cartConf:[...state.cartConf, payload],
            orderConf:[...state.orderConf, payload2],
            totalCompra:state.totalCompra+amountProducts,
        });
    };
    const setWoofer = (payload,payload2,amountProducts) =>{
        setState({
            ...state, 
            wooferC:payload,
            cartConf:[...state.cartConf, payload],
            orderConf:[...state.orderConf, payload2],
            totalCompra:state.totalCompra+amountProducts,
        });
    };
    const setCajonAcustico = (payload,payload2,amountProducts) =>{
        setState({
            ...state, 
            cajonAcusticoC:payload,
            cartConf:[...state.cartConf, payload],
            orderConf:[...state.orderConf, payload2],
            totalCompra:state.totalCompra+amountProducts,
        });
    }; 
    const setKitCables = (payload,payload2,amountProducts) =>{
        setState({...state, 
            kitCablesC:payload,
            cartConf:[...state.cartConf, payload],
            orderConf:[...state.orderConf, payload2],
            totalCompra:state.totalCompra+amountProducts,
        });
    };
    const setTieneEcualizador = (payload) =>{
        setState({...state, tieneEcualizador:payload});
    };
    const setAccesorio = (payload,payload2,amountProducts) =>{
        console.log("Set accesorios nuevo total");
        //console.log(amountProducts);
        setState({
            ...state, 
            accesorioC:payload,
            cartConf:[...state.cartConf, payload],
            orderConf:[...state.orderConf, payload2],
            totalCompra:state.totalCompra+amountProducts,
            //totalCompra: newTotal,
        });
    };
    const setTieneBocinaOriginal = (payload) =>{
        setState({...state, tieneBocinaOriginal:payload});
    };
    const setCalzaBocinaPremiumTrasera = (payload,payload2,amountProducts) =>{
        setState({
            ...state, 
            calzaBocinaPremiumTraseraC:payload,
            cartConf:[...state.cartConf, payload],
            orderConf:[...state.orderConf, payload2],
            totalCompra:state.totalCompra+amountProducts,
        });
    };
    const setEcualizador = (payload,payload2,amountProducts) =>{
        setState({...state, 
            ecualizadorC:payload,
            cartConf:[...state.cartConf, payload],
            orderConf:[...state.orderConf, payload2],
            totalCompra:state.totalCompra+amountProducts,
        });
    };
    const setEpicentro = (payload,payload2,amountProducts) =>{
        setState({
            ...state, 
            epicentroC:payload,
            cartConf:[...state.cartConf, payload],
            orderConf:[...state.orderConf, payload2],
            totalCompra:state.totalCompra+amountProducts,
        });
    };
    const setProcesador = (payload,payload2,amountProducts) =>{
        setState({
            ...state, 
            procesadorC:payload,
            cartConf:[...state.cartConf, payload],
            orderConf:[...state.orderConf, payload2],
            totalCompra:state.totalCompra+amountProducts,
        });
    };
    const setTweeter = (payload,payload2,amountProducts) =>{
        setState({
            ...state, 
            tweeterC:payload,
            cartConf:[...state.cartConf, payload],
            orderConf:[...state.orderConf, payload2],
            totalCompra:state.totalCompra+amountProducts,
        });
    };
    //PRODUCTOS OPCIONALES
    const setProductoOpcional = (category) =>{
        console.log("Set Producto Opcional: ");
        console.log(category);
        switch(category) {
            case '11': setState({...state,bocinaReemplazoDelanteraC:'N/A'}); break;
            case '16': setState({...state,calzaBocinaReemplazoDelanteraC:'N/A'}); break;
            case '12': setState({...state,bocinaReemplazoTraseraC:'N/A'}); break;
            case '17': setState({...state,calzaBocinaReemplazoTraseraC:'N/A'}); break;
            case '9':  setState({...state,bocinaPremiumDelanteraC:'N/A'}); break;
            case '14': setState({...state,calzaBocinaPremiumDelanteraC:'N/A'}); break;
            case '10': setState({...state,bocinaPremiumTraseraC:'N/A'}); break;
            case '15': setState({...state,calzaBocinaPremiumTraseraC:'N/A'}); break;
            case '18': setState({...state,ecualizadorC:'N/A'}); break;
            case '19': setState({...state,epicentroC:'N/A'}); break;
            case '23': setState({...state,procesadorC:'N/A'}); break;
            case '25': setState({...state,tweeterC:'N/A'}); break;
            case '1':  setState({...state,accesorioC:'N/A'}); break;
            case '24': setState({...state,setComponentesO:'N/A'}); break;
            case '22': setState({...state,medioRangoO:'N/A'}); break;
            case '6':  setState({...state,amplificadorWooferC:'N/A'}); break;
            case '26': setState({...state,wooferC:'N/A'}); break;
            case '13': setState({...state,cajonAcusticoC:'N/A'}); break;
            case '21': setState({...state,kitCablesC:'N/A'}); break;
            
            case '7': setState({...state,arnesC:'N/A'}); break;
        }
    };

    const removeFromCartConf = (payload) =>{
        let payloadOptions = [];
        let sumTotalPrecioPromo = 0;
        let data = [];
        //console.log("Borrara todos los items "+payload);
        switch(payload) {  //categoryIdConfigurador
            case 'nuevo':
                data = [...state.cartConf];
                data.forEach((item) => {
                    sumTotalPrecioPromo += parseFloat(item.precioPromoTotal ? item.precioPromoTotal : item.precioTotal) * item.amount;
                });
                //console.log("State antes de borrar");
                //console.log(state);
                setState({...state, 
                    configC: [],
                    marcaC: [],   
                    modeloC: [],
                    anioC:[],
                    tipoConfiguracionC: [],             
                    dinesC:[],
                    estereoC:[],
                    baseC: [],
                    arnesC: [],
                    adaptadorC: [],
                    adaptadorImpedanciaC: [],
                    mejorarAudio: [],
                    tieneBocinaReemplazo: [],
                    bocinaReemplazoDelanteraC: [],
                    calzaBocinaReemplazoDelanteraC: [],
                    bocinaReemplazoTraseraC: [],
                    calzaBocinaReemplazoTraseraC: [],
                    terminaConfiguracion1: [],
                    amplificadorC: [],
                    tieneBocinaOriginal: [],
                    bocinaPremiumDelanteraC: [],
                    calzaBocinaPremiumDelanteraC: [],
                    bocinaPremiumTraseraC: [],
                    calzaBocinaPremiumTraseraC: [],
                    tieneAmplificadorBajos: [],
                    amplificadorWooferC: [],
                    amplificador3en1C: [],
                    wooferC: [],
                    cajonAcusticoC: [],
                    kitCablesC: [],
                    tieneEcualizador: [],
                    ecualizadorC: [],
                    epicentroC: [],
                    procesadorC: [],
                    tweeterC:[],
                    accesorioC: [],
                    tieneEstereoOriginalC: [],
                    tieneEstereoTipoOriginalC: [],
                    medioRangoO: [] ,
                    setComponentesO: [],
                    totalCompra: state.totalCompra - sumTotalPrecioPromo,     
                    cartConf: []     
                });
                //console.log("State despues de borrar");
                //console.log(state);
            break;
            case 'todo':
            case '20': //Para los estereos borramos todo
                data = state.cartConf;
                data.forEach((item) => {
                    sumTotalPrecioPromo += parseFloat(item.precioPromoTotal) * item.amount;
                });
                setState({...state, 
                    estereoC:[],
                    baseC: [],
                    arnesC: [],
                    adaptadorC: [],
                    adaptadorImpedanciaC: [],
                    mejorarAudio: [],
                    tieneBocinaReemplazo: [],
                    bocinaReemplazoDelanteraC: [],
                    calzaBocinaReemplazoDelanteraC: [],
                    bocinaReemplazoTraseraC: [],
                    calzaBocinaReemplazoTraseraC: [],
                    terminaConfiguracion1: [],
                    amplificadorC: [],
                    tieneBocinaOriginal: [],
                    bocinaPremiumDelanteraC: [],
                    calzaBocinaPremiumDelanteraC: [],
                    bocinaPremiumTraseraC: [],
                    calzaBocinaPremiumTraseraC: [],
                    tieneAmplificadorBajos: [],
                    amplificadorWooferC: [],
                    amplificador3en1C: [],
                    wooferC: [],
                    cajonAcusticoC: [],
                    kitCablesC: [],
                    tieneEcualizador: [],
                    ecualizadorC: [],
                    epicentroC: [],
                    procesadorC: [],
                    tweeterC:[],
                    accesorioC: [],                        
                    //tieneEstereoOriginalC: [],
                    medioRangoO: [],
                    //setMediosO: [],
                    setComponentesO: [],
                    totalCompra: state.totalCompra - sumTotalPrecioPromo,
                    cartConf: [], 
                });
            break;
            case '8': //Bases
                payloadOptions = [20];
                data = state.cartConf.filter(item => !payloadOptions.includes(parseInt(item.categoryIdConfigurador)));
                data.forEach((item) => {
                    sumTotalPrecioPromo += parseFloat(item.precioPromoTotal) * item.amount;
                });
                setState({...state, 
                    baseC: [],
                    arnesC: [],
                    adaptadorC: [],
                    adaptadorImpedanciaC: [],
                    mejorarAudio: [],
                    tieneBocinaReemplazo: [],
                    bocinaReemplazoDelanteraC: [],
                    calzaBocinaReemplazoDelanteraC: [],
                    bocinaReemplazoTraseraC: [],
                    calzaBocinaReemplazoTraseraC: [],
                    terminaConfiguracion1: [],
                    amplificadorC: [],
                    tieneBocinaOriginal: [],
                    bocinaPremiumDelanteraC: [],
                    calzaBocinaPremiumDelanteraC: [],
                    bocinaPremiumTraseraC: [],
                    calzaBocinaPremiumTraseraC: [],
                    tieneAmplificadorBajos: [],
                    amplificadorWooferC: [],
                    amplificador3en1C: [],
                    wooferC: [],
                    cajonAcusticoC: [],
                    kitCablesC: [],
                    tieneEcualizador: [],
                    ecualizadorC: [],
                    epicentroC: [],
                    procesadorC: [],
                    tweeterC:[],
                    accesorioC: [],
                    totalCompra: state.totalCompra - sumTotalPrecioPromo,
                    cartConf: state.cartConf.filter(items => (
                        items.categoryIdConfigurador == '20'  //Estereos
                        )),
                    });
            break;
            case '7': //Arneses
                payloadOptions = [20,8];
                data = state.cartConf.filter(item => !payloadOptions.includes(parseInt(item.categoryIdConfigurador)));
                               data.forEach((item) => {
                    sumTotalPrecioPromo += parseFloat(item.precioPromoTotal) * item.amount;
                });
                setState({...state, 
                arnesC: [],
                adaptadorC: [],
                adaptadorImpedanciaC: [],
                mejorarAudio: [],
                tieneBocinaReemplazo: [],
                bocinaReemplazoDelanteraC: [],
                calzaBocinaReemplazoDelanteraC: [],
                bocinaReemplazoTraseraC: [],
                calzaBocinaReemplazoTraseraC: [],
                terminaConfiguracion1: [],
                amplificadorC: [],
                tieneBocinaOriginal: [],
                bocinaPremiumDelanteraC: [],
                calzaBocinaPremiumDelanteraC: [],
                bocinaPremiumTraseraC: [],
                calzaBocinaPremiumTraseraC: [],
                tieneAmplificadorBajos: [],
                amplificadorWooferC: [],
                amplificador3en1C: [],
                wooferC: [],
                cajonAcusticoC: [],
                kitCablesC: [],
                tieneEcualizador: [],
                ecualizadorC: [],
                epicentroC: [],
                procesadorC: [],
                tweeterC:[],
                accesorioC: [],
                totalCompra: state.totalCompra - sumTotalPrecioPromo,
                cartConf: state.cartConf.filter(items => (
                    items.categoryIdConfigurador == '20' ||
                    items.categoryIdConfigurador == '8'  //Bases
                    )),
                });
            break;
            case '2': //adaptadores
                payloadOptions = [20,8,7];               
                data = state.cartConf.filter(item => !payloadOptions.includes(parseInt(item.categoryIdConfigurador)));
                    data.forEach((item) => {
                    sumTotalPrecioPromo += parseFloat(item.precioPromoTotal) * item.amount; 
                });
                setState({...state, 
                adaptadorC: [],
                adaptadorImpedanciaC: [],
                mejorarAudio: [],
                tieneBocinaReemplazo: [],
                bocinaReemplazoDelanteraC: [],
                calzaBocinaReemplazoDelanteraC: [],
                bocinaReemplazoTraseraC: [],
                calzaBocinaReemplazoTraseraC: [],
                terminaConfiguracion1: [],
                amplificadorC: [],
                tieneBocinaOriginal: [],
                bocinaPremiumDelanteraC: [],
                calzaBocinaPremiumDelanteraC: [],
                bocinaPremiumTraseraC: [],
                calzaBocinaPremiumTraseraC: [],
                tieneAmplificadorBajos: [],
                amplificadorWooferC: [],
                amplificador3en1C: [],
                wooferC: [],
                cajonAcusticoC: [],
                kitCablesC: [],
                tieneEcualizador: [],
                ecualizadorC: [],
                epicentroC: [],
                procesadorC: [],
                tweeterC:[],
                accesorioC: [],
                totalCompra: state.totalCompra - sumTotalPrecioPromo,
                cartConf: state.cartConf.filter(items => (
                    items.categoryIdConfigurador == '20' ||
                    items.categoryIdConfigurador == '8'  ||
                    items.categoryIdConfigurador == '7' // Arneses
                    )),
                });
            break;
            case '3': //Adaptadores de impedancia (estereo original)
                payloadOptions = [20,8,7];               
                data = state.cartConf.filter(item => !payloadOptions.includes(parseInt(item.categoryIdConfigurador)));
                    data.forEach((item) => {
                    sumTotalPrecioPromo += parseFloat(item.precioPromoTotal) * item.amount; 
                });
                setState({...state, 
                    adaptadorC: [],
                    adaptadorImpedanciaC: [],
                    mejorarAudio: [],
                    tieneBocinaReemplazo: [],
                    bocinaReemplazoDelanteraC: [],
                    calzaBocinaReemplazoDelanteraC: [],
                    bocinaReemplazoTraseraC: [],
                    calzaBocinaReemplazoTraseraC: [],
                    terminaConfiguracion1: [],
                    amplificadorC: [],
                    tieneBocinaOriginal: [],
                    bocinaPremiumDelanteraC: [],
                    calzaBocinaPremiumDelanteraC: [],
                    bocinaPremiumTraseraC: [],
                    calzaBocinaPremiumTraseraC: [],
                    tieneAmplificadorBajos: [],
                    amplificadorWooferC: [],
                    amplificador3en1C: [],
                    wooferC: [],
                    cajonAcusticoC: [],
                    kitCablesC: [],
                    tieneEcualizador: [],
                    ecualizadorC: [],
                    epicentroC: [],
                    procesadorC: [],
                    tweeterC:[],
                    accesorioC: [],
                    totalCompra: state.totalCompra - sumTotalPrecioPromo,
                    cartConf: state.cartConf.filter(items => (
                        items.categoryIdConfigurador == '20' ||
                        items.categoryIdConfigurador == '8'  ||
                        items.categoryIdConfigurador == '7'
                        )),
                    });
                break;


            case '11': //bocinasReemplazoDelantera
                payloadOptions = [20,8,7,2,3];
                data = state.cartConf.filter(item => !payloadOptions.includes(parseInt(item.categoryIdConfigurador)));
                data.forEach((item) => {
                    sumTotalPrecioPromo += parseFloat(item.precioPromoTotal) * item.amount;
                });
                setState({...state, 
                mejorarAudio: [],
                tieneBocinaReemplazo: [],
                bocinaReemplazoDelanteraC: [],
                calzaBocinaReemplazoDelanteraC: [],
                bocinaReemplazoTraseraC: [],
                calzaBocinaReemplazoTraseraC: [],
                terminaConfiguracion1: [],
                amplificadorC: [],
                tieneBocinaOriginal: [],
                bocinaPremiumDelanteraC: [],
                calzaBocinaPremiumDelanteraC: [],
                bocinaPremiumTraseraC: [],
                calzaBocinaPremiumTraseraC: [],
                tieneAmplificadorBajos: [],
                amplificadorWooferC: [],
                amplificador3en1C: [],
                wooferC: [],
                cajonAcusticoC: [],
                kitCablesC: [],
                tieneEcualizador: [],
                ecualizadorC: [],
                epicentroC: [],
                procesadorC: [],
                tweeterC:[],
                accesorioC: [],
                totalCompra: state.totalCompra - sumTotalPrecioPromo,
                cartConf: state.cartConf.filter(items => (
                    items.categoryIdConfigurador == '20' ||
                    items.categoryIdConfigurador == '8'  ||
                    items.categoryIdConfigurador == '7'  ||
                    items.categoryIdConfigurador == '2'  ||  //Adaptadores de Voz
                    items.categoryIdConfigurador == '3' 
                    )),
                });
            break;
            case '16': //calzasBocinasReemplazoDelantera
                payloadOptions = [20,8,7,2,3,11];
                data = state.cartConf.filter(item => !payloadOptions.includes(parseInt(item.categoryIdConfigurador)));
                           data.forEach((item) => {
                sumTotalPrecioPromo += parseFloat(item.precioPromoTotal) * item.amount;
                });
                setState({...state, 
                calzaBocinaReemplazoDelanteraC: [],
                bocinaReemplazoTraseraC: [],
                calzaBocinaReemplazoTraseraC: [],
                terminaConfiguracion1: [],
                amplificadorC: [],
                tieneBocinaOriginal: [],
                bocinaPremiumDelanteraC: [],
                calzaBocinaPremiumDelanteraC: [],
                bocinaPremiumTraseraC: [],
                calzaBocinaPremiumTraseraC: [],
                tieneAmplificadorBajos: [],
                amplificadorWooferC: [],
                amplificador3en1C: [],
                wooferC: [],
                cajonAcusticoC: [],
                kitCablesC: [],
                tieneEcualizador: [],
                ecualizadorC: [],
                epicentroC: [],
                procesadorC: [],
                tweeterC:[],
                accesorioC: [],
                totalCompra: state.totalCompra - sumTotalPrecioPromo,
                cartConf: state.cartConf.filter(items => (
                    items.categoryIdConfigurador == '20' ||
                    items.categoryIdConfigurador == '8'  ||
                    items.categoryIdConfigurador == '7'  ||
                    items.categoryIdConfigurador == '2'  ||
                    items.categoryIdConfigurador == '3'  ||
                    items.categoryIdConfigurador == '11' //Bocina RD  
                    )),
                });
            break;
            case '12': //bocinasReemplazoTrasera
                payloadOptions = [20,8,7,2,3,11,16];
                data = state.cartConf.filter(item => !payloadOptions.includes(parseInt(item.categoryIdConfigurador)));
                data.forEach((item) => {
                sumTotalPrecioPromo += parseFloat(item.precioPromoTotal) * item.amount;
                });
                setState({...state, 
                bocinaReemplazoTraseraC: [],
                calzaBocinaReemplazoTraseraC: [],
                terminaConfiguracion1: [],
                amplificadorC: [],
                tieneBocinaOriginal: [],
                bocinaPremiumDelanteraC: [],
                calzaBocinaPremiumDelanteraC: [],
                bocinaPremiumTraseraC: [],
                calzaBocinaPremiumTraseraC: [],
                tieneAmplificadorBajos: [],
                amplificadorWooferC: [],
                amplificador3en1C: [],
                wooferC: [],
                cajonAcusticoC: [],
                kitCablesC: [],
                tieneEcualizador: [],
                ecualizadorC: [],
                epicentroC: [],
                procesadorC: [],
                tweeterC:[],
                accesorioC: [],
                totalCompra: state.totalCompra - sumTotalPrecioPromo,
                cartConf: state.cartConf.filter(items => (
                    items.categoryIdConfigurador == '20' ||
                    items.categoryIdConfigurador == '8'  ||
                    items.categoryIdConfigurador == '7'  ||
                    items.categoryIdConfigurador == '2'  ||
                    items.categoryIdConfigurador == '3'  ||
                    items.categoryIdConfigurador == '11' ||   
                    items.categoryIdConfigurador == '16' // Base Bocina RD 
                    )),
                });
            break;
            case '17': //calzasBocinasReemplazoTrasera
                payloadOptions = [20,8,7,2,3,11,16,12];
                data = state.cartConf.filter(item => !payloadOptions.includes(parseInt(item.categoryIdConfigurador)));
                data.forEach((item) => {
                    sumTotalPrecioPromo += parseFloat(item.precioPromoTotal) * item.amount;
                });
                setState({...state, 
                    calzaBocinaReemplazoTraseraC: [],
                    terminaConfiguracion1: [],
                    amplificadorC: [],
                    tieneBocinaOriginal: [],
                    bocinaPremiumDelanteraC: [],
                    calzaBocinaPremiumDelanteraC: [],
                    bocinaPremiumTraseraC: [],
                    calzaBocinaPremiumTraseraC: [],
                    tieneAmplificadorBajos: [],
                    amplificadorWooferC: [],
                    amplificador3en1C: [],
                    wooferC: [],
                    cajonAcusticoC: [],
                    kitCablesC: [],
                    tieneEcualizador: [],
                    ecualizadorC: [],
                    epicentroC: [],
                    procesadorC: [],
                    tweeterC:[],
                    accesorioC: [],
                    totalCompra: state.totalCompra - sumTotalPrecioPromo,
                    cartConf: state.cartConf.filter(items => (
                        items.categoryIdConfigurador == '20' ||
                        items.categoryIdConfigurador == '8'  ||
                        items.categoryIdConfigurador == '7'  ||
                        items.categoryIdConfigurador == '2'  ||
                        items.categoryIdConfigurador == '3'  ||
                        items.categoryIdConfigurador == '11' ||  
                        items.categoryIdConfigurador == '16' || 
                        items.categoryIdConfigurador == '12'  //Bocina RT
                    )),
                });
            break;
            case '5': //amplificadorDeVoz
                payloadOptions = [20,8,7,2,3,11,16,12,17];
                data = state.cartConf.filter(item => !payloadOptions.includes(parseInt(item.categoryIdConfigurador)));
                data.forEach((item) => {
                    sumTotalPrecioPromo += parseFloat(item.precioPromoTotal) * item.amount;
                });
                setState({...state, 
                    terminaConfiguracion1: [],
                    amplificadorC: [],
                    tieneBocinaOriginal: [],
                    bocinaPremiumDelanteraC: [],
                    calzaBocinaPremiumDelanteraC: [],
                    bocinaPremiumTraseraC: [],
                    calzaBocinaPremiumTraseraC: [],
                    tieneAmplificadorBajos: [],
                    amplificadorWooferC: [],
                    amplificador3en1C: [],
                    wooferC: [],
                    cajonAcusticoC: [],
                    kitCablesC: [],
                    tieneEcualizador: [],
                    ecualizadorC: [],
                    epicentroC: [],
                    procesadorC: [],
                    tweeterC:[],
                    accesorioC: [],
                    totalCompra: state.totalCompra - sumTotalPrecioPromo,
                    cartConf: state.cartConf.filter(items => (
                        items.categoryIdConfigurador == '20' ||
                        items.categoryIdConfigurador == '8'  ||
                        items.categoryIdConfigurador == '7'  ||
                        items.categoryIdConfigurador == '2'  ||
                        items.categoryIdConfigurador == '3'  ||
                        items.categoryIdConfigurador == '11' || 
                        items.categoryIdConfigurador == '16' ||
                        items.categoryIdConfigurador == '12' ||
                        items.categoryIdConfigurador == '17' // Base Bocina RD
                        )),
                });
            break;
            case '9': //bocinasPremiumDelantera
                payloadOptions = [20,8,7,2,3,11,16,12,17,5];
                data = state.cartConf.filter(item => !payloadOptions.includes(parseInt(item.categoryIdConfigurador)));
                data.forEach((item) => {
                    sumTotalPrecioPromo += parseFloat(item.precioPromoTotal) * item.amount;
                });
                setState({...state, 
                    tieneBocinaOriginal: [],
                    bocinaPremiumDelanteraC: [],
                    calzaBocinaPremiumDelanteraC: [],
                    bocinaPremiumTraseraC: [],
                    calzaBocinaPremiumTraseraC: [],
                    tieneAmplificadorBajos: [],
                    amplificadorWooferC: [],
                    amplificador3en1C: [],
                    wooferC: [],
                    cajonAcusticoC: [],
                    kitCablesC: [],
                    tieneEcualizador: [],
                    ecualizadorC: [],
                    epicentroC: [],
                    procesadorC: [],
                    tweeterC:[],
                    accesorioC: [],
                    totalCompra: state.totalCompra - sumTotalPrecioPromo,
                    cartConf: state.cartConf.filter(items => (
                        items.categoryIdConfigurador == '20' ||
                        items.categoryIdConfigurador == '8'  ||
                        items.categoryIdConfigurador == '7'  ||
                        items.categoryIdConfigurador == '2'  ||
                        items.categoryIdConfigurador == '3'  ||
                        items.categoryIdConfigurador == '11' || 
                        items.categoryIdConfigurador == '16' ||
                        items.categoryIdConfigurador == '12' ||
                        items.categoryIdConfigurador == '17' ||
                        items.categoryIdConfigurador == '5'
                        )),
                });
            break;
            case '14': //calzasBocinasPremiumDelantera
                payloadOptions = [20,8,7,2,3,11,16,12,17,5,9];
                data = state.cartConf.filter(item => !payloadOptions.includes(parseInt(item.categoryIdConfigurador)));
                data.forEach((item) => {
                    sumTotalPrecioPromo += parseFloat(item.precioPromoTotal) * item.amount;
                });
                setState({...state,         
                    calzaBocinaPremiumDelanteraC: [],
                    bocinaPremiumTraseraC: [],
                    calzaBocinaPremiumTraseraC: [],
                    tieneAmplificadorBajos: [],
                    amplificadorWooferC: [],
                    amplificador3en1C: [],
                    wooferC: [],
                    cajonAcusticoC: [],
                    kitCablesC: [],
                    tieneEcualizador: [],
                    ecualizadorC: [],
                    epicentroC: [],
                    procesadorC: [],
                    tweeterC:[],
                    accesorioC: [],
                    totalCompra: state.totalCompra - sumTotalPrecioPromo,
                    cartConf: state.cartConf.filter(items => (
                        items.categoryIdConfigurador == '20' ||
                        items.categoryIdConfigurador == '8'  ||
                        items.categoryIdConfigurador == '7'  ||
                        items.categoryIdConfigurador == '2'  ||
                        items.categoryIdConfigurador == '3'  ||
                        items.categoryIdConfigurador == '11' ||
                        items.categoryIdConfigurador == '16' ||
                        items.categoryIdConfigurador == '12' ||
                        items.categoryIdConfigurador == '17' ||
                        items.categoryIdConfigurador == '5'  || 
                        items.categoryIdConfigurador == '9'  //Bocina PD
                        )),
                });
            break;
            case '10': //bocinasPremiumTrasera
                payloadOptions = [20,8,7,2,3,11,16,12,17,5,9,14];
                data = state.cartConf.filter(item => !payloadOptions.includes(parseInt(item.categoryIdConfigurador)));
                data.forEach((item) => {
                    sumTotalPrecioPromo += parseFloat(item.precioPromoTotal) * item.amount;
                });
                setState({...state,                  
                    bocinaPremiumTraseraC: [],
                    calzaBocinaPremiumTraseraC: [],
                    tieneAmplificadorBajos: [],
                    amplificadorWooferC: [],
                    amplificador3en1C: [],
                    wooferC: [],
                    cajonAcusticoC: [],
                    kitCablesC: [],
                    tieneEcualizador: [],
                    ecualizadorC: [],
                    epicentroC: [],
                    procesadorC: [],
                    tweeterC:[],
                    accesorioC: [],
                    totalCompra: state.totalCompra - sumTotalPrecioPromo,
                    cartConf: state.cartConf.filter(items => (
                        items.categoryIdConfigurador == '20' ||
                        items.categoryIdConfigurador == '8'  ||
                        items.categoryIdConfigurador == '7'  ||
                        items.categoryIdConfigurador == '2'  ||
                        items.categoryIdConfigurador == '3'  ||
                        items.categoryIdConfigurador == '11' || 
                        items.categoryIdConfigurador == '16' ||
                        items.categoryIdConfigurador == '12' ||
                        items.categoryIdConfigurador == '17' ||
                        items.categoryIdConfigurador == '5'  || 
                        items.categoryIdConfigurador == '9'  ||
                        items.categoryIdConfigurador == '14' //Calza Bocina PD
                        )),
                });
            break;
            case '15': //calzasBocinasPremiumTrasera
                payloadOptions = [20,8,7,2,3,11,16,12,17,5,9,14,10];
                data = state.cartConf.filter(item => !payloadOptions.includes(parseInt(item.categoryIdConfigurador)));
                data.forEach((item) => {
                    sumTotalPrecioPromo += parseFloat(item.precioPromoTotal) * item.amount;
                });
                setState({...state,
                    calzaBocinaPremiumTraseraC: [],
                    tieneAmplificadorBajos: [],
                    amplificadorWooferC: [],
                    amplificador3en1C: [],
                    wooferC: [],
                    cajonAcusticoC: [],
                    kitCablesC: [],
                    tieneEcualizador: [],
                    ecualizadorC: [],
                    epicentroC: [],
                    procesadorC: [],
                    tweeterC:[],
                    accesorioC: [],
                    totalCompra: state.totalCompra - sumTotalPrecioPromo,
                    cartConf: state.cartConf.filter(items => (
                        items.categoryIdConfigurador == '20' ||
                        items.categoryIdConfigurador == '8'  ||
                        items.categoryIdConfigurador == '7'  ||
                        items.categoryIdConfigurador == '2'  ||
                        items.categoryIdConfigurador == '3'  ||
                        items.categoryIdConfigurador == '11' || 
                        items.categoryIdConfigurador == '16' ||
                        items.categoryIdConfigurador == '12' ||
                        items.categoryIdConfigurador == '17' ||
                        items.categoryIdConfigurador == '5'  || 
                        items.categoryIdConfigurador == '9'  ||
                        items.categoryIdConfigurador == '14' ||
                        items.categoryIdConfigurador == '10'  //Bocina Premium trasera
                        )),
                });
            break;
            case '6': //amplificadorWoofer
                payloadOptions = [20,8,7,2,3,11,16,12,17,5,9,14,10,15];
                data = state.cartConf.filter(item => !payloadOptions.includes(parseInt(item.categoryIdConfigurador)));
                data.forEach((item) => {
                    sumTotalPrecioPromo += parseFloat(item.precioPromoTotal) * item.amount;
                });
                setState({...state,
                    tieneAmplificadorBajos: [],
                    amplificadorWooferC: [],
                    amplificador3en1C: [],
                    wooferC: [],
                    cajonAcusticoC: [],
                    kitCablesC: [],
                    tieneEcualizador: [],
                    ecualizadorC: [],
                    epicentroC: [],
                    procesadorC: [],
                    tweeterC:[],
                    accesorioC: [],
                    totalCompra: state.totalCompra - sumTotalPrecioPromo,
                    cartConf: state.cartConf.filter(items => (
                        items.categoryIdConfigurador == '20' ||
                        items.categoryIdConfigurador == '8'  ||
                        items.categoryIdConfigurador == '7'  ||
                        items.categoryIdConfigurador == '2'  ||
                        items.categoryIdConfigurador == '3'  ||
                        items.categoryIdConfigurador == '11' || 
                        items.categoryIdConfigurador == '16' ||
                        items.categoryIdConfigurador == '12' ||
                        items.categoryIdConfigurador == '17' ||
                        items.categoryIdConfigurador == '5'  || 
                        items.categoryIdConfigurador == '9'  ||
                        items.categoryIdConfigurador == '14' ||
                        items.categoryIdConfigurador == '10' ||
                        items.categoryIdConfigurador == '15' // Calza Bocina Premium trasera 
                        )),
                });
            break;
            case '4': //amplificador3en1
                payloadOptions = [20,8,7,2,3,11,16,12,17,5,9,14,10,15,6];
                data = state.cartConf.filter(item => !payloadOptions.includes(parseInt(item.categoryIdConfigurador)));
                data.forEach((item) => {
                    sumTotalPrecioPromo += parseFloat(item.precioPromoTotal) * item.amount;
                });
                setState({...state,
                    tieneAmplificadorBajos: [],
                    amplificadorWooferC: [],
                    amplificador3en1C: [],
                    wooferC: [],
                    cajonAcusticoC: [],
                    kitCablesC: [],
                    tieneEcualizador: [],
                    ecualizadorC: [],
                    epicentroC: [],
                    procesadorC: [],
                    tweeterC:[],
                    accesorioC: [],
                    totalCompra: state.totalCompra - sumTotalPrecioPromo,
                    cartConf: state.cartConf.filter(items => (
                        items.categoryIdConfigurador == '20' ||
                        items.categoryIdConfigurador == '8'  ||
                        items.categoryIdConfigurador == '7'  ||
                        items.categoryIdConfigurador == '2'  ||
                        items.categoryIdConfigurador == '3'  ||
                        items.categoryIdConfigurador == '11' ||
                        items.categoryIdConfigurador == '16' ||
                        items.categoryIdConfigurador == '12' ||
                        items.categoryIdConfigurador == '17' ||
                        items.categoryIdConfigurador == '5'  || 
                        items.categoryIdConfigurador == '9'  ||
                        items.categoryIdConfigurador == '14' ||
                        items.categoryIdConfigurador == '10' ||
                        items.categoryIdConfigurador == '15' ||
                        items.categoryIdConfigurador == '6' // Amplificador de woofer
                        )),
                });
            break;
            case '13': //cajonAcustico
                payloadOptions = [20,8,7,2,3,11,16,12,17,5,9,14,10,15,6,4];
                data = state.cartConf.filter(item => !payloadOptions.includes(parseInt(item.categoryIdConfigurador)));
                data.forEach((item) => {
                    sumTotalPrecioPromo += parseFloat(item.precioPromoTotal) * item.amount;
                });
                setState({...state,
                    wooferC: [],
                    cajonAcusticoC: [],
                    kitCablesC: [],
                    tieneEcualizador: [],
                    ecualizadorC: [],
                    epicentroC: [],
                    procesadorC: [],
                    tweeterC:[],
                    accesorioC: [],
                    totalCompra: state.totalCompra - sumTotalPrecioPromo,
                    cartConf: state.cartConf.filter(items => (
                        items.categoryIdConfigurador == '20' ||
                        items.categoryIdConfigurador == '8'  ||
                        items.categoryIdConfigurador == '7'  ||
                        items.categoryIdConfigurador == '2'  ||
                        items.categoryIdConfigurador == '3'  ||
                        items.categoryIdConfigurador == '11' || 
                        items.categoryIdConfigurador == '16' ||
                        items.categoryIdConfigurador == '12' ||
                        items.categoryIdConfigurador == '17' ||
                        items.categoryIdConfigurador == '5'  || 
                        items.categoryIdConfigurador == '9'  ||
                        items.categoryIdConfigurador == '14' ||
                        items.categoryIdConfigurador == '10' ||
                        items.categoryIdConfigurador == '15' ||
                        items.categoryIdConfigurador == '6'  ||
                        items.categoryIdConfigurador == '4' // Amplificador 3 en 1
                        )),
                });
            break;
            case '26': //woofer
                payloadOptions = [20,8,7,2,3,11,16,12,17,5,9,14,10,15,6,4,13];
                data = state.cartConf.filter(item => !payloadOptions.includes(parseInt(item.categoryIdConfigurador)));
                data.forEach((item) => {
                    sumTotalPrecioPromo += parseFloat(item.precioPromoTotal) * item.amount;
                });
                setState({...state,
                    wooferC: [],
                    kitCablesC: [],
                    tieneEcualizador: [],
                    ecualizadorC: [],
                    epicentroC: [],
                    procesadorC: [],
                    tweeterC:[],
                    accesorioC: [],
                    totalCompra: state.totalCompra - sumTotalPrecioPromo,
                    cartConf: state.cartConf.filter(items => (
                        items.categoryIdConfigurador == '20' ||
                        items.categoryIdConfigurador == '8'  ||
                        items.categoryIdConfigurador == '7'  ||
                        items.categoryIdConfigurador == '2'  ||
                        items.categoryIdConfigurador == '3'  ||
                        items.categoryIdConfigurador == '11' || 
                        items.categoryIdConfigurador == '16' ||
                        items.categoryIdConfigurador == '12' ||
                        items.categoryIdConfigurador == '17' ||
                        items.categoryIdConfigurador == '5'  || 
                        items.categoryIdConfigurador == '9'  ||
                        items.categoryIdConfigurador == '14' ||
                        items.categoryIdConfigurador == '10' ||
                        items.categoryIdConfigurador == '15' ||
                        items.categoryIdConfigurador == '6'  ||
                        items.categoryIdConfigurador == '4'  ||
                        items.categoryIdConfigurador == '13' //Woofers
                        )),
                });
            break;
            case '21': //kitCables
                payloadOptions = [20,8,7,2,3,11,16,12,17,5,9,14,10,15,6,4,26,13];
                data = state.cartConf.filter(item => !payloadOptions.includes(parseInt(item.categoryIdConfigurador)));
                data.forEach((item) => {
                    sumTotalPrecioPromo += parseFloat(item.precioPromoTotal) * item.amount;
                });
                setState({...state,
                    kitCablesC: [],
                    tieneEcualizador: [],
                    ecualizadorC: [],
                    epicentroC: [],
                    procesadorC: [],
                    tweeterC:[],
                    accesorioC: [],
                    totalCompra: state.totalCompra - sumTotalPrecioPromo,
                    cartConf: state.cartConf.filter(items => (
                        items.categoryIdConfigurador == '20' ||
                        items.categoryIdConfigurador == '8'  ||
                        items.categoryIdConfigurador == '7'  ||
                        items.categoryIdConfigurador == '2'  ||
                        items.categoryIdConfigurador == '3'  ||
                        items.categoryIdConfigurador == '11' || 
                        items.categoryIdConfigurador == '16' ||
                        items.categoryIdConfigurador == '12' ||
                        items.categoryIdConfigurador == '17' ||
                        items.categoryIdConfigurador == '5'  || 
                        items.categoryIdConfigurador == '9'  ||
                        items.categoryIdConfigurador == '14' ||
                        items.categoryIdConfigurador == '10' ||
                        items.categoryIdConfigurador == '15' ||
                        items.categoryIdConfigurador == '6'  ||
                        items.categoryIdConfigurador == '4'  ||
                        items.categoryIdConfigurador == '26' ||
                        items.categoryIdConfigurador == '13' //Cajones
                        )),
                });
            break;
            case '18': //ecualizador'
                payloadOptions = [20,8,7,2,3,11,16,12,17,5,9,14,10,15,6,4,26,13,21];
                data = state.cartConf.filter(item => !payloadOptions.includes(parseInt(item.categoryIdConfigurador)));
                data.forEach((item) => {
                    sumTotalPrecioPromo += parseFloat(item.precioPromoTotal) * item.amount;
                });
                setState({...state,
                    tieneEcualizador: [],
                    ecualizadorC: [],
                    epicentroC: [],
                    procesadorC: [],
                    tweeterC:[],
                    accesorioC: [],
                    totalCompra: state.totalCompra - sumTotalPrecioPromo,
                    cartConf: state.cartConf.filter(items => (
                        items.categoryIdConfigurador == '20' ||
                        items.categoryIdConfigurador == '8'  ||
                        items.categoryIdConfigurador == '7'  ||
                        items.categoryIdConfigurador == '2'  ||
                        items.categoryIdConfigurador == '3'  ||
                        items.categoryIdConfigurador == '11' || 
                        items.categoryIdConfigurador == '16' ||
                        items.categoryIdConfigurador == '12' ||
                        items.categoryIdConfigurador == '17' ||
                        items.categoryIdConfigurador == '5'  || 
                        items.categoryIdConfigurador == '9'  ||
                        items.categoryIdConfigurador == '14' ||
                        items.categoryIdConfigurador == '10' ||
                        items.categoryIdConfigurador == '15' ||
                        items.categoryIdConfigurador == '6'  ||
                        items.categoryIdConfigurador == '4'  ||
                        items.categoryIdConfigurador == '26' ||
                        items.categoryIdConfigurador == '13' ||
                        items.categoryIdConfigurador == '21' //Kits de cables
                        )),
                });
            break;
            case '19': //epicentro
                payloadOptions = [20,8,7,2,3,11,16,12,17,5,9,14,10,15,6,4,26,13,21,18];
                data = state.cartConf.filter(item => !payloadOptions.includes(parseInt(item.categoryIdConfigurador)));
                data.forEach((item) => {
                    sumTotalPrecioPromo += parseFloat(item.precioPromoTotal) * item.amount;
                });
                setState({...state,
                    epicentroC: [],
                    procesadorC: [],
                    tweeterC:[],
                    accesorioC: [],
                    totalCompra: state.totalCompra - sumTotalPrecioPromo,
                    cartConf: state.cartConf.filter(items => (
                        items.categoryIdConfigurador == '20' ||
                        items.categoryIdConfigurador == '8'  ||
                        items.categoryIdConfigurador == '7'  ||
                        items.categoryIdConfigurador == '2'  ||
                        items.categoryIdConfigurador == '3'  ||
                        items.categoryIdConfigurador == '11' ||
                        items.categoryIdConfigurador == '16' ||
                        items.categoryIdConfigurador == '12' ||
                        items.categoryIdConfigurador == '17' ||
                        items.categoryIdConfigurador == '5'  || 
                        items.categoryIdConfigurador == '9'  ||
                        items.categoryIdConfigurador == '14' ||
                        items.categoryIdConfigurador == '10' ||
                        items.categoryIdConfigurador == '15' ||
                        items.categoryIdConfigurador == '6'  ||
                        items.categoryIdConfigurador == '4'  ||
                        items.categoryIdConfigurador == '26' ||
                        items.categoryIdConfigurador == '13' ||
                        items.categoryIdConfigurador == '21' ||
                        items.categoryIdConfigurador == '18' //Ecualizadores
                        )),
                });
            break;
            case '23': //procesador
                payloadOptions = [20,8,7,2,3,11,16,12,17,5,9,14,10,15,6,4,26,13,21,18,19];
                data = state.cartConf.filter(item => !payloadOptions.includes(parseInt(item.categoryIdConfigurador)));
                data.forEach((item) => {
                    sumTotalPrecioPromo += parseFloat(item.precioPromoTotal) * item.amount;
                });
                setState({...state,
                    procesadorC: [],
                    tweeterC:[],
                    accesorioC: [],
                    totalCompra: state.totalCompra - sumTotalPrecioPromo,
                    cartConf: state.cartConf.filter(items => (
                        items.categoryIdConfigurador == '20' ||
                        items.categoryIdConfigurador == '8'  ||
                        items.categoryIdConfigurador == '7'  ||
                        items.categoryIdConfigurador == '2'  ||
                        items.categoryIdConfigurador == '3'  ||
                        items.categoryIdConfigurador == '11' || 
                        items.categoryIdConfigurador == '16' ||
                        items.categoryIdConfigurador == '12' ||
                        items.categoryIdConfigurador == '17' ||
                        items.categoryIdConfigurador == '5'  || 
                        items.categoryIdConfigurador == '9'  ||
                        items.categoryIdConfigurador == '14' ||
                        items.categoryIdConfigurador == '10' ||
                        items.categoryIdConfigurador == '15' ||
                        items.categoryIdConfigurador == '6'  ||
                        items.categoryIdConfigurador == '4'  ||
                        items.categoryIdConfigurador == '26' ||
                        items.categoryIdConfigurador == '13' ||
                        items.categoryIdConfigurador == '21' ||
                        items.categoryIdConfigurador == '18' ||
                        items.categoryIdConfigurador == '19'  //Epicentros
                        )),
                });
            break;
            case '25': //tweeters
                payloadOptions = [20,8,7,2,3,11,16,12,17,5,9,14,10,15,6,4,26,13,21,18,19,23];
                data = state.cartConf.filter(item => !payloadOptions.includes(parseInt(item.categoryIdConfigurador)));
                data.forEach((item) => {
                    sumTotalPrecioPromo += parseFloat(item.precioPromoTotal) * item.amount;
                });
                setState({...state,
                    tweeterC:[],
                    accesorioC: [],
                    totalCompra: state.totalCompra - sumTotalPrecioPromo,
                    cartConf: state.cartConf.filter(items => (
                        items.categoryIdConfigurador == '20' ||
                        items.categoryIdConfigurador == '8'  ||
                        items.categoryIdConfigurador == '7'  ||
                        items.categoryIdConfigurador == '2'  ||
                        items.categoryIdConfigurador == '3'  ||
                        items.categoryIdConfigurador == '11' || 
                        items.categoryIdConfigurador == '16' ||
                        items.categoryIdConfigurador == '12' ||
                        items.categoryIdConfigurador == '17' ||
                        items.categoryIdConfigurador == '5'  || 
                        items.categoryIdConfigurador == '9'  ||
                        items.categoryIdConfigurador == '14' ||
                        items.categoryIdConfigurador == '10' ||
                        items.categoryIdConfigurador == '15' ||
                        items.categoryIdConfigurador == '6'  ||
                        items.categoryIdConfigurador == '4'  ||
                        items.categoryIdConfigurador == '26' ||
                        items.categoryIdConfigurador == '13' ||
                        items.categoryIdConfigurador == '21' ||
                        items.categoryIdConfigurador == '18' ||
                        items.categoryIdConfigurador == '19' ||
                        items.categoryIdConfigurador == '23' //Procesadores 
                        )),
                });
            break;
            case '1': //accesorios
                payloadOptions = [20,8,7,2,3,11,16,12,17,5,9,14,10,15,6,4,26,13,21,18,19,23,25];
                data = state.cartConf.filter(item => !payloadOptions.includes(parseInt(item.categoryIdConfigurador)));
                data.forEach((item) => {
                    sumTotalPrecioPromo += parseFloat(item.precioPromoTotal) * item.amount;
                });
                setState({...state,
                    accesorioC: [],
                    totalCompra: state.totalCompra - sumTotalPrecioPromo,
                    cartConf: state.cartConf.filter(items => (
                        items.categoryIdConfigurador == '20' ||
                        items.categoryIdConfigurador == '8'  ||
                        items.categoryIdConfigurador == '7'  ||
                        items.categoryIdConfigurador == '2'  ||
                        items.categoryIdConfigurador == '3'  ||
                        items.categoryIdConfigurador == '11' ||
                        items.categoryIdConfigurador == '16' ||
                        items.categoryIdConfigurador == '12' ||
                        items.categoryIdConfigurador == '17' ||
                        items.categoryIdConfigurador == '5'  || 
                        items.categoryIdConfigurador == '9'  ||
                        items.categoryIdConfigurador == '14' ||
                        items.categoryIdConfigurador == '10' ||
                        items.categoryIdConfigurador == '15' ||
                        items.categoryIdConfigurador == '6'  ||
                        items.categoryIdConfigurador == '4'  ||
                        items.categoryIdConfigurador == '26' ||
                        items.categoryIdConfigurador == '13' ||
                        items.categoryIdConfigurador == '21' ||
                        items.categoryIdConfigurador == '18' ||
                        items.categoryIdConfigurador == '19' ||
                        items.categoryIdConfigurador == '23' ||
                        items.categoryIdConfigurador == '25' //Twetters
                        )),
                });
            break;
        }
    }

    return {
        setLogin,
        loading,
        error,
        //logout,
        //addToCart,
        //removeFromCart,
        refreshState,
        setConfigInicial,
        fetchOrderData,        
        removeFromCartConf,
        setEstereo,  //Empiezan las funcions del configurador
        setBase,
        setArnes,
        setProductoOpcional,
        setAdaptador,   
        setMejoraAudio,  
        setTieneBocinaReemplazo,   
        setBocinaReemplazoDelantera,
        setCalzaBocinaReemplazoDelantera, 
        setBocinaReemplazoTrasera,
        setCalzaBocinaReemplazoTrasera,
        setTerminaConfiguracion1,
        setTieneAmplificadorBajos,
        setAmplificador3en1,
        setAmplificadorWoofer,
        setWoofer,
        setCajonAcustico,
        setKitCables,
        setAccesorio,
        setAmplificador,
        setTieneBocinaOriginal,
        setCalzaBocinaPremiumTrasera,
        setTieneEcualizador,
        setEcualizador,
        setEpicentro,
        setProcesador,
        setTweeter,
        state,
    }
}
export default useInitialState;