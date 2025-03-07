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
    //console.log("Loading state...");
    const [state, setState] = useState(initialState); 
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
              
              if(localStorageToken != '' && localStorageUser != '' ){
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
        },[]
    );

    /*useEffect(() => {
        console.log("Se ejecuta fetchOrderData");
        fetchOrderData(dataLogin);
    }, [state.token]); */
    const resetLocalStorage = () => {
        localStorage.removeItem('totalCompraL');
        localStorage.removeItem('confOrderIdL');
        localStorage.removeItem('cartOrderIdL');
        localStorage.removeItem('cart');
        localStorage.removeItem('anioL');
        // Add more localStorage.removeItem('key') if needed
    };
    const getClientData = async (userId) => {
        try {
            const response = await fetch(`${API}clientes/${userId}`);
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
        //console.log(data);
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
    return {
        setLogin,
        loading,
        error,
        //logout,
        //addToCart,
        //removeFromCart,
        fetchOrderData,
        setEstereo,  //Empiezan las funcions del configurador
        setBase,
        state,
    }
}
export default useInitialState;