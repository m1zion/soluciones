import React, {useRef, useContext,useState, useEffect} from "react";
import { Box, Typography, Stack, Button } from "@mui/material";
import '@styles/Configurador1.scss';
import AppContext from '@context/AppContext';
import Alert from '@mui/material/Alert';
import GradientCircularProgress from "./GradientCircularProgress";
const API = process.env.REACT_APP_API_URL;
import usePut2V from '@hooks/usePut2V';
import { useNavigate } from 'react-router-dom';
/*import useGet7 from '@hooks/useGet7';
import { CircularProgress } from "@mui/material";*/
const Configurador3 = () => {
    
    const {state,loading,error,refreshState} = useContext(AppContext);
    const [hideBotenes,setHideBotones] = useState(true); //Solo buscamos estereos tipo Original
    const [activeOrderId, setActiveOrderId] = useState(null);
    const [activeOrder, setActiveOrder] = useState([]);
    const [loadingLocal,setLoadingLocal] = useState(false);
    const [tipoConfiguracion,setTipoConfiguracion] = useState(true); 
    const [hasItemsUndin, setHasItemsUnDin] = useState(false);
    const [hasItemsDobledin, setHasItemsDobleDin] = useState(false);
    const [hideUnDin, setHideUnDin] = useState(false);
    const [hideDobleDin, setHideDobleDin] = useState(false);
    const classesDisabled = `tipoConfiguracion_ButtonDisabled`;
    const classesBasica = `basica_Button, tipoConfiguracion_Button`;
    const [hideBotonOriginal, setHideBotonOriginal] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        refreshState();
    }, []);
    
   /* const { state, setConfig } = useContext(AppContext);
   
    //var hideBotenes = state.ocultaBotonC;
    const [success, setSuccess] = useState(false);    
    const [errMsg, setErrMsg] = useState('');
    const form = useRef(null);
    const setConfigurador = item =>{setConfig(item);};
    */
    // Main useEffect
    //console.log("----------");
    //console.log(state);
    useEffect(() => {
        const fetchData = async () => {
            //console.log("Se ejecuta en use Effect");
            setLoadingLocal(true);
            //const { order, tipoConfiguracion } = await fetchActiveCart(API, state.token);
            if (state.confOrderId) { //Si hay una orden activa
                const { unDin, dobleDin, tipoOriginal } = await fetchEstereos(API, state.tipoConfiguracionC);               
                setHasItemsUnDin(unDin.length > 0);
                setHasItemsDobleDin(dobleDin.length > 0);
                setHideBotones(tipoOriginal.length > 0);
               //Podemos validar que si state.marcaC no esta definida no ejecute nada aun
                const configuracion = await fetchConfiguracion(API);
                if (!configuracion){
                    console.error("No se pudo recuperar la informacion de la configuracion");
                    return;
                }
                console.log(configuracion);
                const arnesAI = configuracion.arnesAI;
                const arnesHF = configuracion.arnesHF;
                const dobleDinAI = configuracion.dobleDinAI;
                const dobleDinHF = configuracion.dobleDinHF;
                const pantallaHF = configuracion.pantallaHF;
                const unDinAI = configuracion.unDinAI;
                const unDinHF = configuracion.unDinHF;
                const tieneArnesAI = await fetchArneses(API+'products/arneses/getmodel?administrador=false&model='+arnesAI);//true/false
                const tieneArnesHF = await fetchArneses(API+'products/arneses/getmodel?administrador=false&model='+arnesHF);
                if ((!tieneArnesAI && !tieneArnesHF) || (arnesAI === 'N/A' && arnesHF === 'N/A')) {
                    setHideUnDin(true);
                    setHideDobleDin(true);
                    console.log("No tiene arneses: "+arnesAI+' / '+arnesHF +" , Se oculta boton de Un din y doble din");
                }
                
                if (unDinHF == 'N/A' && unDinAI == 'N/A'){
                    setHideUnDin(true);
                    console.log("No tiene bases de un Din, Se oculta boton de Un din");
                }
                if (dobleDinHF == 'N/A' && dobleDinAI == 'N/A'){
                    setHideDobleDin(true);
                    console.log("No tiene bases de doble Din, Se oculta doble din");
                }
                if(pantallaHF != 'N/A' && pantallaHF){
                    console.log("Habilita el boton de conservar porque pantallaHF != N/A"+pantallaHF);
                    setHideBotonOriginal(false);
                }
            } else {
                setActiveOrderId(null);
            }
            setLoadingLocal(false);
        };        
        fetchData();
    }, [state]);
    const fetchEstereos = async (API, tipoConfiguracion) => {
        const APIestereos = `${API}products/estereos/?offset=0&limit=400&administrador=false`;
        try {
            const response = await fetch(APIestereos);
            if (!response.ok) {
                throw new Error("Error fetching estereos");
            }            
            const estereosData = await response.json();
            const filteredProductsUnDin = estereosData.products.filter(
                product => product.tipoCategoria === tipoConfiguracion && product.Dines === 1
            );
            const filteredProductsDobledin = estereosData.products.filter(
                product => product.tipoCategoria === tipoConfiguracion && product.Dines === 2
            );      
            const filteredProductsTipoOriginal = estereosData.products.filter(
                product => product.Nombre === "Tipo Original"
            );        
            return { unDin: filteredProductsUnDin, dobleDin: filteredProductsDobledin, tipoOriginal: filteredProductsTipoOriginal };
        } catch (error) {
            console.error("Error:", error.message);
            return { unDin: [], dobleDin: [], tipoOriginal: [] };
        }
    };
    const fetchConfiguracion = async (API) => {
        const APIconf = API+'configurador/detalleModelo/?marca='+state.marcaC+'&modelo='+state.modeloC+'&Anio='+state.anioC;
        console.log(APIconf);
        try {
            const response = await fetch(APIconf);
            if (!response.ok) {
                throw new Error("Error fetching configuracion");
            }            
            const configuracionData = await response.json();
            if (!configuracionData.modelo) {
               return null;               
            }
            return configuracionData.modelo;
        } catch (error) {
            console.error("Error:", error.message);
            return null;
        }
    };
    const fetchArneses = async (APIArneses) => {
        try {
            const response = await fetch(APIArneses);
            if (!response.ok) {
                throw new Error("Error fetching Arneses");
            }            
            const arnesesData = await response.json();           
            return arnesesData.id ? true: false;
        
        } catch (error) {
            console.error("Error:", error.message);
            return false;
        }
    };
    // END HELPER FUNCTIONS ============================================================
    const handleSubmit = (configuracion) => {
        setLoadingLocal(true);
        const APIconfCaracteristicas = API+'orders/'+ state.confOrderId;
        let data = {};
        if (configuracion == 4){
            data = {
                orderType: 'configurador',
                status: 'activo',
                tieneEstereoOriginalC : 'si'
            }
        }
        else {
            data = {
                orderType: 'configurador',
                status: 'activo',
                dines: configuracion,
            }
        }
        try {
            usePut2V(APIconfCaracteristicas,data, state.token); //Actualiza los items API
            //setConfigurador(dataPost);  //Actualiza los elementos en el state
            navigate("/configurador4");    
        } catch (error) {
            console.error("Error al generar la orden. code:002");
            console.error(error);
        } finally {
            setLoadingLocal(false);  // Ensure loading state is reset
        }
    }
    console.log(hideUnDin);
    console.log(hasItemsUndin);

	return (
        <React.Fragment>
        {(loading || loadingLocal) && <Box className="Loading_Container"> <GradientCircularProgress /></Box>}
        {(!loading && !error && !loadingLocal) &&
        <Box className="Configurador_Container">
            <Box className="hero-image"></Box>
            <form action="/" className="Configurador_Form2">
                <Stack alignItems="center" spacing={2} direction="column" className="configurador1_stack"> 
                    <Box className="configurador_tuAuto">
                       <Box className="configurador_tuAuto1">
                            <Typography sx={{paddingLeft:"6px", minWidth:"70px"}}>Tu Auto:</Typography>
                            <Typography sx={{paddingLeft:"6px"}}>{state.marcaC} {state.modeloC} {state.anioC}</Typography>
                        </Box>  
                        <Box className="configurador_tuAuto1">
                            <Typography sx={{paddingLeft:"6px"}}>No. Orden: {state.confOrderId}</Typography> 
                        </Box>    
                        <Box className="configurador_tuAuto1">
                            <Typography sx={{paddingLeft:"6px"}}>Tipo de Configuración: {state.tipoConfiguracionC}</Typography> 
                        </Box>  
                    </Box>
                    <Typography sx={{fontWeight: 600, pb:3}} variant="h6">Selecciona tu <Typography variant="h7" sx={{fontWeight: 600}}>Configuración</Typography></Typography>
                    {hideBotenes && (
                    <Alert severity="warning" sx={{width:"90%", mb:"20px !important", textAlign:"center"}}>
                        Lo sentimos, por el momento no contamos con todas las configuraciones disponibles {state.mensajeC}</Alert>
                    )}
                    <Button disabled = {hideUnDin || !hasItemsUndin} onClick={() => handleSubmit('1')} className={hideUnDin || !hasItemsUndin ? classesDisabled: classesBasica }>Estereo Un Din</Button>
                    <Button disabled = {hideDobleDin || !hasItemsDobledin} onClick={() => handleSubmit('2')} className={hideDobleDin || !hasItemsDobledin  ? classesDisabled: classesBasica }>Pantalla Doble Din</Button>
                    <Button disabled = {hideBotenes} onClick={() => handleSubmit('3')} className={hideBotenes ? classesDisabled: classesBasica }>Estereo Tipo Original</Button>
                    <Button disabled = {hideBotonOriginal} onClick={() => handleSubmit('4')} className={hideBotonOriginal ? classesDisabled: classesBasica }>
                        Conservar mi Estereo Original 
                        {
                        //Lo desactivamos cuando pantallaHF venaga en N/A
                        }
                    </Button>
                </Stack>
            </form>
        </Box>
        }
        </React.Fragment>
	);
}
export default Configurador3;