//m2134256161 
import React, {useRef, useState, useEffect, useContext} from "react";
import { Typography, Stack, Button } from "@mui/material";
import { Box } from "@mui/system";
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
//import useDelete from '@hooks/useDelete';
import { styled } from '@mui/material/styles';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import useDeleteOrderItem from '@hooks/useDeleteOrderItem';
import '@styles/Configurador1.scss';
import '@styles/ProductList.scss';
import usePut from '@hooks/usePut';
import AppContext from '@context/AppContext';
//import ProductCartConf from "@containers/ProductCartConf";
import { useNavigate } from 'react-router-dom';
import CircularProgress from "@mui/material/CircularProgress";
import GradientCircularProgress from "./GradientCircularProgress";
import ConfiguradorCategoria from "./containers/ConfiguradorCategoria";
import DeleteIcon from '@mui/icons-material/Delete';
import { DeleteForever, DeleteOutline } from "@mui/icons-material";
const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  width: '100%',
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));
const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));


const Configurador4 = () => {
  const APIConf = API+'orders/9';
  const APICart = API+'orders/3';
  const { state,loading,error, setConfig,fetchOrderData,removeFromCartConf,setMejoraAudio } = useContext(AppContext);
  const API = process.env.REACT_APP_API_URL;
  const APIDelete = API+'orders/delete-item/';
  const APIDeleteAll = API+'orders/delete-all-items/';
  const navigate = useNavigate();
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [activeOrder, setActiveOrder] = useState([]);
  const [tipoConfiguracion,setTipoConfiguracion] = useState(true);
  const [APIconfCaracteristicas,setAPIconfCaracteristicas] = useState('');
  const [loadingLocal,setLoadingLocal] = useState(false);
  const [caracteristicas,setCaracteristicas] = useState([]);
  const [activarBotonWoofer,setActivarBotonWoofer] = useState(true)
  const  dataLogin = {
    token: state.token
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/CheckOutCart3_1");
  }
  useEffect(() => {
    const fetchData = async () => {
        setLoadingLocal(true);
        //await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate a 1-second delay
        if (state.configuracion) {
            //setActiveOrder(order); state.configuracion (Order del configurador)
            //setTipoConfiguracion(tipoConfiguracion); state.tipoConfiguracion : (Configuracion del modelos del auto)
            //setActiveOrderId(order.id);      
            //const APIDetalleModelo = API+'configurador/detalleModelo/?marca='+order.marca+'&modelo='+order.modelo+'&Anio='+order.anio+'';
            const APIDetalleModelo = API+'configurador/detalleModelo/?marca='+state.marcaC+'&modelo='+state.modeloC+'&Anio='+state.anioC;
            const caracteristicasResult = await fetchCaracteristicas(APIDetalleModelo);
            setCaracteristicas(caracteristicasResult);   
            if(caracteristicasResult?.tamanioCajuela == 'A'){
              setActivarBotonWoofer(false);
            }         
        } else {
            setActiveOrderId(null);
        }
        setLoadingLocal(false);
    };    
    fetchData();
  }, [state]);
  // HELPER FUNCTIONS ============================================================
  const fetchCaracteristicas = async (API) => {
    try {
        const response = await fetch(API);
        if (!response.ok) {
            throw new Error("Error fetching caractetisticas");
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
  //END HELPER FUNCTIONS ============================================================
  const unDinHF = 'X';//caracteristicas?.modelo?.unDinHF; 
  const arnesHF = 'X';//caracteristicas?.modelo?.arnesHF;
  const adaptadorAntenaHF = 'X'; //caracteristicas?.modelo?.adaptadorAntenaHF;
  var valor,valor2 = 'X';
  const [expanded, setExpanded] = React.useState('panel0');
  const handleChange = (panel) => (event, newExpanded) => {
      setExpanded(newExpanded ? panel : false);
  };
  const [expand, setExpand] = React.useState(false);
  //VARIABLES DEL CONFIGURADOR, FUNCIONES CONTEXT Y API =================================
  
  const handleMejoraAudio = item =>{ 
    const data = {
      orderType: 'configurador',
      status: 'activo',
      mejorarAudio: item
    }
    usePut(APIconfCaracteristicas,data);  //Aqui se enviara al backend
    setMejoraAudio(item); //Aqui se enviara al estado 
  }
  
  const expandEstereo =
    state.estereoC.length === 0 &&
    state.tieneEstereoOriginalC !== 'si' &&
    state.tieneEstereoTipoOriginalC != true;
  const expandBases = 
    state.estereoC.SKU != undefined && 
    state.baseC.length === 0;
  const expandArneses = state.baseC.SKU != undefined && 
    state.arnesC.length === 0;
  const expandAdaptadores = state.arnesC.SKU != undefined || state.arnesC === 'N/A'  && 
    state.adaptadorC.length === 0;
  const expandAdaptadoresImpedancia = state.tieneEstereoOriginalC == 'si' && 
    state.adaptadorImpedanciaC.length === 0;
    const expandBocinaRD = (state.tieneEstereoTipoOriginalC == true && state.bocinaReemplazoDelanteraC.length === 0) ||
    (state.tieneBocinaReemplazo === 'si'  && state.mejorarAudio === 'si' && state.bocinaReemplazoDelanteraC.length === 0) ||
    (state.mejorarAudio != 'no' &&  state.tieneBocinaReemplazo != 'no' &&
      ((state.adaptadorC.SKU != undefined && state.bocinaReemplazoDelanteraC.length === 0) ||
      (state.adaptadorImpedanciaC.SKU != undefined && state.bocinaReemplazoDelanteraC.length === 0)) 
    );
  const toggleAcordion = () => {
    setExpand((prev) => !prev);
  };
  //https://www.freakyjolly.com/react-material-ui-accordion-tabs-tutorial-with-example/  */
  //console.log(activeOrder);

  //console.log("loading");
  //console.log(loading);
  //console.log(state.cartConf);
  //console.log(state.cart);
  const handleRemove  = (categoryIdConfigurador,id_categoria) => {  
    let APIDeleteAll2 = "";
    APIDeleteAll2 = APIDeleteAll.concat(state.confOrderId);
    let dataConfCaracteristicas = {
      orderType: 'configurador',
      status: 'activo',
      marca: '',
      modelo: '',
      anio: '',
      tiposConfiguracion: 'N/A',
      dines: '0',
      tieneBocinaReemplazo: '',
      tieneBocinaOriginal: '',
      terminaConfiguracion1: '',
      mejorarAudio: '',
      tieneEcualizador: '',
      tieneAmplificadorBajos: '',
      tieneEstereoOriginalC: '',
      tieneEstereoTipoOriginalC: '',
      bocinaReemplazoDelanteraC: '',
      calzaBocinaReemplazoDelanteraC: '',
      bocinaReemplazoTraseraC: '',
      calzaBocinaReemplazoTraseraC: '',
      bocinaPremiumDelanteraC: '',
      calzaBocinaPremiumDelanteraC: '',
      bocinaPremiumTraseraC: '',
      calzaBocinaPremiumTraseraC: '',
      ecualizadorC: '',
      epicentroC: '',
      procesadorC: '',
      tweeterC: '',
      accesorioC: '',
      setMediosO: '',
      medioRangoO: '',
      amplificadorWooferC: '',
      wooferC: '',
      cajonAcusticoC: '',
      kitCablesC: ''
    };
    let dataConfCaracteristicasTodo = {
      orderType: 'configurador',
      status: 'activo',
      tieneBocinaReemplazo: '',
      tieneBocinaOriginal: '',
      terminaConfiguracion1: '',
      mejorarAudio: '',
      tieneEcualizador: '',
      tieneAmplificadorBajos: '',
      tieneEstereoOriginalC: '',
      tieneEstereoTipoOriginalC: '',
      bocinaReemplazoDelanteraC: '',
      calzaBocinaReemplazoDelanteraC: '',
      bocinaReemplazoTraseraC: '',
      calzaBocinaReemplazoTraseraC: '',
      bocinaPremiumDelanteraC: '',
      calzaBocinaPremiumDelanteraC: '',
      bocinaPremiumTraseraC: '',
      calzaBocinaPremiumTraseraC: '',
      ecualizadorC: '',
      epicentroC: '',
      procesadorC: '',
      tweeterC: '',
      accesorioC: '',
      setMediosO: '',
      medioRangoO: '',
      amplificadorWooferC: '',
      wooferC: '',
      cajonAcusticoC: '',
      kitCablesC: ''
    };
    alert("Se borraran todos los productos que seleccionaste despues!");
    let  data = {};
    removeFromCartConf(categoryIdConfigurador);
    let dataCaracteristicas1 = {
      orderType: 'configurador',
      status: 'activo',
      mejorarAudio: '',
      tieneBocinaReemplazo: '',
      tieneBocinaOriginal: '',
      terminaConfiguracion1: '',
      tieneEcualizador: '',
      tieneAmplificadorBajos: '',
      tieneEstereoTipoOriginalC: '',
      bocinaReemplazoDelanteraC: '',
      calzaBocinaReemplazoDelanteraC: '',
      bocinaReemplazoTraseraC: '',
      calzaBocinaReemplazoTraseraC: '',
      bocinaPremiumDelanteraC: '',
      calzaBocinaPremiumDelanteraC: '',
      bocinaPremiumTraseraC: '',
      calzaBocinaPremiumTraseraC: '',
      ecualizadorC: '',
      epicentroC: '',
      procesadorC: '',
      tweeterC: '',
      accesorioC: '',
      setMediosO: '',
      medioRangoO: '',
      amplificadorWooferC: '',
      wooferC: '',
      cajonAcusticoC: '',
      kitCablesC: '',
      amplificador3en1C: '',
      amplificadorVozC: ''
    };

    switch(categoryIdConfigurador){
      case 'todo': 
        if (confirm('¿Estas seguro de borrar todos los productos?')) { 
          useDelete(APIDeleteAll2); //Borra de la API productos
          removeFromCartConf('todo'); //Borra del estado caracteristicas y productos
          usePut(APIconfCaracteristicas,dataConfCaracteristicasTodo); //Borra de la API caracteristicas
        }
      break;
      case 'nuevo': 
        if (confirm('Se borraran todos los productos y el modelo de tu auto')) { 
          useDelete(APIDeleteAll2);  //API
          removeFromCartConf('nuevo'); //State
          usePut(APIconfCaracteristicas,dataConfCaracteristicas); //Variables Adicionales
          //console.log(dataConfCaracteristicas);
          //navigate("/configurador1");
        }
      break;
      case "8": //bases
        data = {orderId: state.confOrderId,categoryId: 13,categoryIdConfigurador: 8}; //Borro bases
        useDeleteOrderItem(APIDelete,data);
      case "8": case "7": //arneses
        data = {orderId: state.confOrderId,categoryId: 14,categoryIdConfigurador: 7}; //Borro arneses
        useDeleteOrderItem(APIDelete,data);
      case "8": case "7": case "2": // Adaptadores de antena
        data = {orderId: state.confOrderId,categoryId: 15,categoryIdConfigurador: 2}; 
        useDeleteOrderItem(APIDelete,data);
      case "8": case "7": case "3": // Adaptadores de impedancia
        data = {orderId: state.confOrderId,categoryId: 27,categoryIdConfigurador: 3}; 
        console.log(data);
        console.log(APIDelete);
        useDeleteOrderItem(APIDelete,data);
      case "8": case "7": case "2": case "3": case "11": // Bocina RD Borro bocinas y componentes
        data = {orderId: state.confOrderId,categoryId: 16,categoryIdConfigurador: 11}; 
        useDeleteOrderItem(APIDelete,data);
        data = {orderId: state.confOrderId,categoryId: 29,categoryIdConfigurador: 11}; 
        useDeleteOrderItem(APIDelete,data)
      case "8": case "7": case "2": case "3":  case "11": case "16": // Base Bocina RD
        data = {orderId: state.confOrderId,categoryId: 28,categoryIdConfigurador: 16}; 
        useDeleteOrderItem(APIDelete,data);
      case "8": case "7": case "2": case "3":  case "11": case "16": case "12": //Bocina RT  Borro bocinas y componentes
        data = {orderId: state.confOrderId,categoryId: 16,categoryIdConfigurador: 12}; 
        useDeleteOrderItem(APIDelete,data);
        data = {orderId: state.confOrderId,categoryId: 29,categoryIdConfigurador: 12}; 
        useDeleteOrderItem(APIDelete,data)
      case "8": case "7": case "2": case "3":  case "11": case "16": case "12": case "17": //Base Bocina RT
        data = {orderId: state.confOrderId,categoryId: 28,categoryIdConfigurador: 17}; 
        useDeleteOrderItem(APIDelete,data);
      case "8": case "7": case "2": case "3":  case "11": case "16": case "12": case "17": case "5": //Amplificador de voz
        data = {orderId: state.confOrderId,categoryId: 17,categoryIdConfigurador: 5}; 
        useDeleteOrderItem(APIDelete,data);
      case "8": case "7": case "2": case "3":  case "11": case "16": case "12": case "17": case "5": case "9": //Bocina PD  Borro bocinas y componentes
        data = {orderId: state.confOrderId,categoryId: 16,categoryIdConfigurador: 9}; 
        useDeleteOrderItem(APIDelete,data);
        data = {orderId: state.confOrderId,categoryId: 29,categoryIdConfigurador: 9}; 
        useDeleteOrderItem(APIDelete,data);
      case "8": case "7": case "2": case "3":  case "11": case "16": case "12": case "17": case "5": case "9": case "14": //Base BPD
        data = {orderId: state.confOrderId,categoryId: 28,categoryIdConfigurador: 14}; 
        useDeleteOrderItem(APIDelete,data);
      case "8": case "7": case "2": case "3":  case "11": case "16": case "12": case "17": case "5": case "9": case "14": case "10": //Bocina PT  Borro bocinas y componentes
        data = {orderId: state.confOrderId,categoryId: 16,categoryIdConfigurador: 10}; 
        useDeleteOrderItem(APIDelete,data);
        data = {orderId: state.confOrderId,categoryId: 29,categoryIdConfigurador: 10}; 
        useDeleteOrderItem(APIDelete,data);
      case "8": case "7": case "2": case "3":  case "11": case "16": case "12": case "17": case "5": case "9": case "14": case "10": case "15": //Base BPT
        data = {orderId: state.confOrderId,categoryId: 28,categoryIdConfigurador: 15}; 
        useDeleteOrderItem(APIDelete,data);
      case "8": case "7": case "2": case "3":  case "11": case "16": case "12": case "17": case "5": case "9": case "14": case "10": case "15": case "6":  //Amplificador Woofer
        data = {orderId: state.confOrderId,categoryId: 17,categoryIdConfigurador: 6}; 
        useDeleteOrderItem(APIDelete,data);
      case "8": case "7": case "2": case "3":  case "11": case "16": case "12": case "17": case "5": case "9": case "14": case "10": case "15": case "4":  //Amplificador 3 en 1
        data = {orderId: state.confOrderId,categoryId: 38,categoryIdConfigurador: 4}; 
        useDeleteOrderItem(APIDelete,data);
      case "8": case "7": case "2": case "3":  case "11": case "16": case "12": case "17": case "5": case "9": case "14": case "10": case "15": case "6": case "13": //cajon acustico
        data = {orderId: state.confOrderId,categoryId: 7,categoryIdConfigurador: 13};
        useDeleteOrderItem(APIDelete,data);
      case "8": case "7": case "2": case "3":  case "11": case "16": case "12": case "17": case "5": case "9": case "14": case "10": case "15": case "6": case "13":
      case "26":  //Woofer
        data = {orderId: state.confOrderId,categoryId: 21,categoryIdConfigurador: 26}; 
        useDeleteOrderItem(APIDelete,data);
      case "8": case "7": case "2": case "3":  case "11": case "16": case "12": case "17": case "5": case "9": case "14": case "10": case "15": case "6": case "26":
      case "13": case "21": case "4":  //Kit de cables
        data = {orderId: state.confOrderId,categoryId: 25,categoryIdConfigurador: 21}; 
        useDeleteOrderItem(APIDelete,data);
      case "8": case "7": case "2": case "3":  case "11": case "16": case "12": case "17": case "5": case "9": case "14": case "10": case "15": case "6": case "26":
      case "13": case "21": case "18":  //Ecualizador
        data = {orderId: state.confOrderId,categoryId: 20,categoryIdConfigurador: 18}; 
        useDeleteOrderItem(APIDelete,data);        
      case "8": case "7": case "2": case "3":  case "11": case "16": case "12": case "17": case "5": case "9": case "14": case "10": case "15": case "6": case "26":
      case "13": case "21": case "18": case "19": //Epicentro
        data = {orderId: state.confOrderId,categoryId: 23,categoryIdConfigurador: 19};
        useDeleteOrderItem(APIDelete,data);
      case "8": case "7": case "2": case "3":  case "11": case "16": case "12": case "17": case "5": case "9": case "14": case "10": case "15": case "6": case "26":
      case "13": case "21": case "18": case "19": case "23": //Procesador
        data = {orderId: state.confOrderId,categoryId: 24,categoryIdConfigurador: 23};
        useDeleteOrderItem(APIDelete,data);
      case "8": case "7": case "2": case "3":  case "11": case "16": case "12": case "17": case "5": case "9": case "14": case "10": case "15": case "6": case "26":
      case "13": case "21": case "18": case "19": case "23": case "25": //Tweeters
        data = {orderId: state.confOrderId,categoryId: 19,categoryIdConfigurador: 25};
        useDeleteOrderItem(APIDelete,data);
      case "8": case "7": case "2": case "3":  case "11": case "16": case "12": case "17": case "5": case "9": case "14": case "10": case "15": case "6": case "26":
      case "13": case "21": case "18": case "19": case "23": case "25": case "1": case "4":  //Accesorios
        data = {orderId: state.confOrderId,categoryId: 26,categoryIdConfigurador: 1};
        useDeleteOrderItem(APIDelete,data);
      break
      default:
        data = {
          orderId: state.confOrderId,
          categoryId: id_categoria,
          categoryIdConfigurador: categoryIdConfigurador,
        };
        useDeleteOrderItem(APIDelete,data); 
        console.log('ELIMINARA de removeFromCartConf');
        removeFromCartConf(categoryIdConfigurador);
    }
    //Lo ejecutamos nuevamente para borrar las variables independientes de la API y posteriormentee sean cargadas
    switch(categoryIdConfigurador){  
      case "8": case "7": case "2": case "11": case '3': // Bases, Arneses, Adaptadores de antena, Bocinas RD, adaptadores de Impedancia
        usePut(APIconfCaracteristicas,dataCaracteristicas1);
      break;
      case "16": // Calza Bocina RD
        delete dataCaracteristicas1.bocinaReemplazoDelanteraC;
        delete dataCaracteristicas1.mejorarAudio;
        delete dataCaracteristicas1.tieneBocinaReemplazo;
        usePut(APIconfCaracteristicas,dataCaracteristicas1);
      break;
      case "12": //Bocina RT
        delete dataCaracteristicas1.bocinaReemplazoDelanteraC;
        delete dataCaracteristicas1.mejorarAudio;
        delete dataCaracteristicas1.tieneBocinaReemplazo;
        delete dataCaracteristicas1.calzaBocinaReemplazoDelanteraC;
        usePut(APIconfCaracteristicas,dataCaracteristicas1);
      break;
      case "17": //Calza Bocina RT
        delete dataCaracteristicas1.bocinaReemplazoDelanteraC;
        delete dataCaracteristicas1.mejorarAudio;
        delete dataCaracteristicas1.tieneBocinaReemplazo;
        delete dataCaracteristicas1.calzaBocinaReemplazoDelanteraC;
        delete dataCaracteristicas1.bocinaReemplazoTraseraC;
        usePut(APIconfCaracteristicas,dataCaracteristicas1);
      break;
      case "5": //Amplificador de voz
        delete dataCaracteristicas1.bocinaReemplazoDelanteraC;
        delete dataCaracteristicas1.mejorarAudio;
        delete dataCaracteristicas1.tieneBocinaReemplazo;
        delete dataCaracteristicas1.calzaBocinaReemplazoDelanteraC;
        delete dataCaracteristicas1.bocinaReemplazoTraseraC;
        delete dataCaracteristicas1.calzaBocinaReemplazoTraseraC;
        delete dataCaracteristicas1.terminaConfiguracion1;
        delete dataCaracteristicas1.tieneEstereoOriginalC;
        delete dataCaracteristicas1.tieneEstereoTipoOriginalC;
        usePut(APIconfCaracteristicas,dataCaracteristicas1);
      break;
      case "9": //Bocina PremiumD
        delete dataCaracteristicas1.bocinaReemplazoDelanteraC;
        delete dataCaracteristicas1.mejorarAudio;
        delete dataCaracteristicas1.tieneBocinaReemplazo;
        delete dataCaracteristicas1.calzaBocinaReemplazoDelanteraC;
        delete dataCaracteristicas1.bocinaReemplazoTraseraC;
        delete dataCaracteristicas1.calzaBocinaReemplazoTraseraC;
        delete dataCaracteristicas1.terminaConfiguracion1;
        delete dataCaracteristicas1.tieneEstereoOriginalC;
        delete dataCaracteristicas1.tieneEstereoTipoOriginalC;
        usePut(APIconfCaracteristicas,dataCaracteristicas1);
      break;
      case "14": //Base BPremiumD
          delete dataCaracteristicas1.bocinaReemplazoDelanteraC;
          delete dataCaracteristicas1.mejorarAudio;
          delete dataCaracteristicas1.tieneBocinaReemplazo;
          delete dataCaracteristicas1.calzaBocinaReemplazoDelanteraC;
          delete dataCaracteristicas1.bocinaReemplazoTraseraC;
          delete dataCaracteristicas1.calzaBocinaReemplazoTraseraC;
          delete dataCaracteristicas1.bocinaPremiumDelanteraC;
          delete dataCaracteristicas1.tieneBocinaOriginal;
          delete dataCaracteristicas1.terminaConfiguracion1;
          delete dataCaracteristicas1.tieneEstereoOriginalC;
          delete dataCaracteristicas1.tieneEstereoTipoOriginalC;
          usePut(APIconfCaracteristicas,dataCaracteristicas1);
      break;
      case "10": //Bocina PremiumT
        delete dataCaracteristicas1.bocinaReemplazoDelanteraC;
        delete dataCaracteristicas1.mejorarAudio;
        delete dataCaracteristicas1.tieneBocinaReemplazo;
        delete dataCaracteristicas1.calzaBocinaReemplazoDelanteraC;
        delete dataCaracteristicas1.bocinaReemplazoTraseraC;
        delete dataCaracteristicas1.calzaBocinaReemplazoTraseraC;
        delete dataCaracteristicas1.bocinaPremiumDelanteraC;
        delete dataCaracteristicas1.calzaBocinaPremiumDelanteraC;
        delete dataCaracteristicas1.tieneBocinaOriginal;
        delete dataCaracteristicas1.terminaConfiguracion1;
        delete dataCaracteristicas1.tieneEstereoOriginalC;
        delete dataCaracteristicas1.tieneEstereoTipoOriginalC;
        usePut(APIconfCaracteristicas,dataCaracteristicas1);
      break;
      case "15": //Base BPremiumT
        delete dataCaracteristicas1.bocinaReemplazoDelanteraC;
        delete dataCaracteristicas1.mejorarAudio;
        delete dataCaracteristicas1.tieneBocinaReemplazo;
        delete dataCaracteristicas1.calzaBocinaReemplazoDelanteraC;
        delete dataCaracteristicas1.bocinaReemplazoTraseraC;
        delete dataCaracteristicas1.calzaBocinaReemplazoTraseraC;
        delete dataCaracteristicas1.bocinaPremiumDelanteraC;
        delete dataCaracteristicas1.calzaBocinaPremiumDelanteraC;
        delete dataCaracteristicas1.bocinaPremiumTraseraC;
        delete dataCaracteristicas1.tieneBocinaOriginal;
        delete dataCaracteristicas1.terminaConfiguracion1;
        delete dataCaracteristicas1.tieneEstereoOriginalC;
        delete dataCaracteristicas1.tieneEstereoTipoOriginalC;
        usePut(APIconfCaracteristicas,dataCaracteristicas1);
      break;
      case "6": //Amplificador de woofer
        delete dataCaracteristicas1.bocinaReemplazoDelanteraC;
        delete dataCaracteristicas1.mejorarAudio;
        delete dataCaracteristicas1.tieneBocinaReemplazo;
        delete dataCaracteristicas1.calzaBocinaReemplazoDelanteraC;
        delete dataCaracteristicas1.bocinaReemplazoTraseraC;
        delete dataCaracteristicas1.calzaBocinaReemplazoTraseraC;
        delete dataCaracteristicas1.tieneBocinaOriginal;
        delete dataCaracteristicas1.terminaConfiguracion1;
        delete dataCaracteristicas1.tieneEstereoOriginalC;
        delete dataCaracteristicas1.tieneEstereoTipoOriginalC;
        delete dataCaracteristicas1.bocinaPremiumDelanteraC;
        delete dataCaracteristicas1.calzaBocinaPremiumDelanteraC;
        delete dataCaracteristicas1.bocinaPremiumTraseraC;
        delete dataCaracteristicas1.calzaBocinaPremiumTraseraC;
        usePut(APIconfCaracteristicas,dataCaracteristicas1);
      break;
      case "4": //Amplificador de 3 en 1
        delete dataCaracteristicas1.bocinaReemplazoDelanteraC;
        delete dataCaracteristicas1.mejorarAudio;
        delete dataCaracteristicas1.tieneBocinaReemplazo;
        delete dataCaracteristicas1.calzaBocinaReemplazoDelanteraC;
        delete dataCaracteristicas1.bocinaReemplazoTraseraC;
        delete dataCaracteristicas1.calzaBocinaReemplazoTraseraC;
        delete dataCaracteristicas1.tieneBocinaOriginal;
        delete dataCaracteristicas1.terminaConfiguracion1;
        delete dataCaracteristicas1.tieneEstereoOriginalC;
        delete dataCaracteristicas1.tieneEstereoTipoOriginalC;
        delete dataCaracteristicas1.bocinaPremiumDelanteraC;
        delete dataCaracteristicas1.calzaBocinaPremiumDelanteraC;
        delete dataCaracteristicas1.bocinaPremiumTraseraC;
        delete dataCaracteristicas1.calzaBocinaPremiumTraseraC;
        usePut(APIconfCaracteristicas,dataCaracteristicas1);
      break;
      case "13": //Cajon Acustico
        delete dataCaracteristicas1.bocinaReemplazoDelanteraC;
        delete dataCaracteristicas1.mejorarAudio;
        delete dataCaracteristicas1.tieneBocinaReemplazo;
        delete dataCaracteristicas1.calzaBocinaReemplazoDelanteraC;
        delete dataCaracteristicas1.bocinaReemplazoTraseraC;
        delete dataCaracteristicas1.calzaBocinaReemplazoTraseraC;
        delete dataCaracteristicas1.tieneBocinaOriginal;
        delete dataCaracteristicas1.terminaConfiguracion1;
        delete dataCaracteristicas1.tieneEstereoOriginalC;
        delete dataCaracteristicas1.tieneEstereoTipoOriginalC;
        delete dataCaracteristicas1.amplificadorWooferC;
        delete dataCaracteristicas1.tieneAmplificadorBajos;
        delete dataCaracteristicas1.bocinaPremiumDelanteraC;
        delete dataCaracteristicas1.calzaBocinaPremiumDelanteraC;
        delete dataCaracteristicas1.bocinaPremiumTraseraC;
        delete dataCaracteristicas1.calzaBocinaPremiumTraseraC;
        usePut(APIconfCaracteristicas,dataCaracteristicas1);
      break;
      case "26":  //Woofer
        delete dataCaracteristicas1.bocinaReemplazoDelanteraC;
        delete dataCaracteristicas1.mejorarAudio;
        delete dataCaracteristicas1.tieneBocinaReemplazo;
        delete dataCaracteristicas1.calzaBocinaReemplazoDelanteraC;
        delete dataCaracteristicas1.bocinaReemplazoTraseraC;
        delete dataCaracteristicas1.calzaBocinaReemplazoTraseraC;
        delete dataCaracteristicas1.tieneBocinaOriginal;
        delete dataCaracteristicas1.terminaConfiguracion1;
        delete dataCaracteristicas1.tieneEstereoOriginalC;
        delete dataCaracteristicas1.tieneEstereoTipoOriginalC;
        delete dataCaracteristicas1.amplificadorWooferC;
        delete dataCaracteristicas1.cajonAcusticoC;
        delete dataCaracteristicas1.tieneAmplificadorBajos;
        delete dataCaracteristicas1.bocinaPremiumDelanteraC;
        delete dataCaracteristicas1.calzaBocinaPremiumDelanteraC;
        delete dataCaracteristicas1.bocinaPremiumTraseraC;
        delete dataCaracteristicas1.calzaBocinaPremiumTraseraC;
        usePut(APIconfCaracteristicas,dataCaracteristicas1);
      break;
      case "21":  //Kit de cables
        delete dataCaracteristicas1.bocinaReemplazoDelanteraC;
        delete dataCaracteristicas1.mejorarAudio;
        delete dataCaracteristicas1.tieneBocinaReemplazo;
        delete dataCaracteristicas1.calzaBocinaReemplazoDelanteraC;
        delete dataCaracteristicas1.bocinaReemplazoTraseraC;
        delete dataCaracteristicas1.calzaBocinaReemplazoTraseraC;
        delete dataCaracteristicas1.tieneBocinaOriginal;
        delete dataCaracteristicas1.terminaConfiguracion1;
        delete dataCaracteristicas1.tieneEstereoOriginalC;
        delete dataCaracteristicas1.tieneEstereoTipoOriginalC;
        delete dataCaracteristicas1.amplificadorWooferC;
        delete dataCaracteristicas1.wooferC;
        delete dataCaracteristicas1.cajonAcusticoC;
        delete dataCaracteristicas1.bocinaPremiumDelanteraC;
        delete dataCaracteristicas1.calzaBocinaPremiumDelanteraC;
        delete dataCaracteristicas1.bocinaPremiumTraseraC;
        delete dataCaracteristicas1.calzaBocinaPremiumTraseraC;
        usePut(APIconfCaracteristicas,dataCaracteristicas1);
    break;
    case "18":  //Ecualizador
      delete dataCaracteristicas1.bocinaReemplazoDelanteraC;
      delete dataCaracteristicas1.mejorarAudio;
      delete dataCaracteristicas1.tieneBocinaReemplazo;
      delete dataCaracteristicas1.calzaBocinaReemplazoDelanteraC;
      delete dataCaracteristicas1.bocinaReemplazoTraseraC;
      delete dataCaracteristicas1.calzaBocinaReemplazoTraseraC;
      delete dataCaracteristicas1.tieneBocinaOriginal;
      delete dataCaracteristicas1.terminaConfiguracion1;
      delete dataCaracteristicas1.tieneEstereoOriginalC;
      delete dataCaracteristicas1.tieneEstereoTipoOriginalC;
      delete dataCaracteristicas1.amplificadorWooferC;
      delete dataCaracteristicas1.wooferC;
      delete dataCaracteristicas1.cajonAcusticoC;
      delete dataCaracteristicas1.kitCablesC;
      delete dataCaracteristicas1.bocinaPremiumDelanteraC;
      delete dataCaracteristicas1.calzaBocinaPremiumDelanteraC;
      delete dataCaracteristicas1.bocinaPremiumTraseraC;
      delete dataCaracteristicas1.calzaBocinaPremiumTraseraC;
      usePut(APIconfCaracteristicas,dataCaracteristicas1);
    break;
    case "19":  //Epicentro
      delete dataCaracteristicas1.bocinaReemplazoDelanteraC;
      delete dataCaracteristicas1.mejorarAudio;
      delete dataCaracteristicas1.tieneBocinaReemplazo;
      delete dataCaracteristicas1.calzaBocinaReemplazoDelanteraC;
      delete dataCaracteristicas1.bocinaReemplazoTraseraC;
      delete dataCaracteristicas1.calzaBocinaReemplazoTraseraC;
      delete dataCaracteristicas1.tieneBocinaOriginal;
      delete dataCaracteristicas1.terminaConfiguracion1;
      delete dataCaracteristicas1.tieneEstereoOriginalC;
      delete dataCaracteristicas1.tieneEstereoTipoOriginalC;
      delete dataCaracteristicas1.amplificadorWooferC;
      delete dataCaracteristicas1.wooferC;
      delete dataCaracteristicas1.cajonAcusticoC;
      delete dataCaracteristicas1.kitCablesC;
      delete dataCaracteristicas1.tieneEcualizador;
      delete dataCaracteristicas1.ecualizadorC;
      delete dataCaracteristicas1.bocinaPremiumDelanteraC;
      delete dataCaracteristicas1.calzaBocinaPremiumDelanteraC;
      delete dataCaracteristicas1.bocinaPremiumTraseraC;
      delete dataCaracteristicas1.calzaBocinaPremiumTraseraC;
      usePut(APIconfCaracteristicas,dataCaracteristicas1);
    break;
    case "23":  //Procesador
      delete dataCaracteristicas1.bocinaReemplazoDelanteraC;
      delete dataCaracteristicas1.mejorarAudio;
      delete dataCaracteristicas1.tieneBocinaReemplazo;
      delete dataCaracteristicas1.calzaBocinaReemplazoDelanteraC;
      delete dataCaracteristicas1.bocinaReemplazoTraseraC;
      delete dataCaracteristicas1.calzaBocinaReemplazoTraseraC;
      delete dataCaracteristicas1.tieneBocinaOriginal;
      delete dataCaracteristicas1.terminaConfiguracion1;
      delete dataCaracteristicas1.tieneEstereoOriginalC;
      delete dataCaracteristicas1.tieneEstereoTipoOriginalC;
      delete dataCaracteristicas1.amplificadorWooferC;
      delete dataCaracteristicas1.wooferC;
      delete dataCaracteristicas1.cajonAcusticoC;
      delete dataCaracteristicas1.kitCablesC;
      delete dataCaracteristicas1.tieneEcualizador;
      delete dataCaracteristicas1.ecualizadorC;
      delete dataCaracteristicas1.epicentroC;
      delete dataCaracteristicas1.bocinaPremiumDelanteraC;
      delete dataCaracteristicas1.calzaBocinaPremiumDelanteraC;
      delete dataCaracteristicas1.bocinaPremiumTraseraC;
      delete dataCaracteristicas1.calzaBocinaPremiumTraseraC;
      usePut(APIconfCaracteristicas,dataCaracteristicas1);
    break;
    case "25":  //tweeters
      delete dataCaracteristicas1.bocinaReemplazoDelanteraC;
      delete dataCaracteristicas1.mejorarAudio;
      delete dataCaracteristicas1.tieneBocinaReemplazo;
      delete dataCaracteristicas1.calzaBocinaReemplazoDelanteraC;
      delete dataCaracteristicas1.bocinaReemplazoTraseraC;
      delete dataCaracteristicas1.calzaBocinaReemplazoTraseraC;
      delete dataCaracteristicas1.tieneBocinaOriginal;
      delete dataCaracteristicas1.terminaConfiguracion1;
      delete dataCaracteristicas1.tieneEstereoOriginalC;
      delete dataCaracteristicas1.tieneEstereoTipoOriginalC;
      delete dataCaracteristicas1.amplificadorWooferC;
      delete dataCaracteristicas1.wooferC;
      delete dataCaracteristicas1.cajonAcusticoC;
      delete dataCaracteristicas1.kitCablesC;
      delete dataCaracteristicas1.tieneEcualizador;
      delete dataCaracteristicas1.ecualizadorC;
      delete dataCaracteristicas1.epicentroC;
      delete dataCaracteristicas1.procesadorC;
      delete dataCaracteristicas1.bocinaPremiumDelanteraC;
      delete dataCaracteristicas1.calzaBocinaPremiumDelanteraC;
      delete dataCaracteristicas1.bocinaPremiumTraseraC;
      delete dataCaracteristicas1.calzaBocinaPremiumTraseraC;
      usePut(APIconfCaracteristicas,dataCaracteristicas1);
    break;
    case "1":  //Accesorios
      delete dataCaracteristicas1.bocinaReemplazoDelanteraC;
      delete dataCaracteristicas1.mejorarAudio;
      delete dataCaracteristicas1.tieneBocinaReemplazo;
      delete dataCaracteristicas1.calzaBocinaReemplazoDelanteraC;
      delete dataCaracteristicas1.bocinaReemplazoTraseraC;
      delete dataCaracteristicas1.calzaBocinaReemplazoTraseraC;
      delete dataCaracteristicas1.tieneBocinaOriginal;
      delete dataCaracteristicas1.terminaConfiguracion1;
      delete dataCaracteristicas1.tieneEstereoOriginalC;
      delete dataCaracteristicas1.tieneEstereoTipoOriginalC;
      delete dataCaracteristicas1.amplificadorWooferC;
      delete dataCaracteristicas1.wooferC;
      delete dataCaracteristicas1.cajonAcusticoC;
      delete dataCaracteristicas1.kitCablesC;
      delete dataCaracteristicas1.tieneEcualizador;
      delete dataCaracteristicas1.ecualizadorC;
      delete dataCaracteristicas1.epicentroC;
      delete dataCaracteristicas1.procesadorC;
      delete dataCaracteristicas1.tweeterC;
      delete dataCaracteristicas1.bocinaPremiumDelanteraC;
      delete dataCaracteristicas1.calzaBocinaPremiumDelanteraC;
      delete dataCaracteristicas1.bocinaPremiumTraseraC;
      delete dataCaracteristicas1.calzaBocinaPremiumTraseraC;
      usePut(APIconfCaracteristicas,dataCaracteristicas1);
    break;
    }
  }

  return (
    <React.Fragment>
      {(loading || loadingLocal) && <Box className="Loading_Container"> <GradientCircularProgress /></Box>}
      {(!loading && !error && !loadingLocal) &&
      <Box className="Configurador_Form">
        <Stack alignItems="center" direction="column"> 
          <Box className="configurador_header">
            <Box sx={{alignItems:"left"}}><Typography sx={{fontWeight: 600, pl: "5px"}} variant="h6">Configurador de Auto </Typography></Box>
            <Box>              
              <Button variant="contained" className="primary-basic" onClick={() => handleRemoveNuevo('nuevo')} >Nueva Configuracion</Button>
              <Button variant="contained" className="primary-basic" onClick={() => handleRemove('todo')} sx={{marginLeft:"5px"}}>Eliminar Productos</Button>              
            </Box>
          </Box>
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
          {
          //------------------------------------------------------ESTEREO--------------------------------------------------------------
          }                   
          <Accordion expanded={expandEstereo || expanded === 'panel1'}  
            disabled = {state.tieneEstereoOriginalC === 'si' || state.tieneEstereoTipoOriginalC === true}
            onChange={handleChange('panel1')} 
           >
              <Box className="configurador-accordionSummary">
                <AccordionSummary 
                  className="configurador-accordion-header" 
                  aria-controls="panel1d-content" 
                  id="panel1d-header">
                    <Typography>Estereos</Typography><Typography className="configurador-item-selected"> - {state.estereoC.modelo} </Typography>  
                  </AccordionSummary>
                <Box className="configurador-button-borrar">
                {(state.estereoC.length != 0) ?
                 <DeleteForever className = "trashCanConf" alt="close"  onClick={() => handleRemove('20','1')}  />:  ''
                
                }             
                </Box>
              </Box>
              <AccordionDetails>   
                {(expanded === 'panel1' || expandEstereo) && (     
                  <ConfiguradorCategoria category="20" value={valor} value2= {valor2} optional="false" carFeatures={caracteristicas}/>
                )}
              </AccordionDetails>
          </Accordion>  
          {/*------------------------------------------------------BASES--------------------------------------------------------------*/}
          <Accordion expanded={expandBases || expanded === 'panel2'}  onChange={handleChange('panel2')} 
          disabled = {state.estereoC.length === 0} id="accordion_base"
          >{/* disabled={enabledBase}*/}
           <Box className="configurador-accordionSummary">
            <AccordionSummary className="configurador-accordion-header" aria-controls="panel2d-content" id="panel2d-header">
              <Typography>Bases</Typography><Typography className="configurador-item-selected"> - {state.baseC.modelo} </Typography>
            </AccordionSummary>
            <Box className="configurador-button-borrar">
              {(state.baseC.length != 0) ?
                <DeleteForever className = "trashCanConf" alt="close"  onClick={() => handleRemove('8','13')}  />:  ''
              }
              </Box>
            </Box>
            <AccordionDetails>
            {(expandBases || expanded === 'panel2') && (     
              <ConfiguradorCategoria category="8"  value={valor} value2= {valor2} optional="false" carFeatures={caracteristicas}/>
            )}
            </AccordionDetails>
          </Accordion>
          {/*------------------------------------------------------ARNESES--------------------------------------------------------------*/}
          <Accordion expanded={expandArneses || expanded === 'panel3'} onChange={handleChange('panel3')} 
          disabled = {state.baseC.length === 0}
          >
            <Box className="configurador-accordionSummary">
            <AccordionSummary className="configurador-accordion-header" aria-controls="panel3d-content" id="panel3d-header">
              <Typography>Arneses</Typography><Typography className="configurador-item-selected"> - {(state.arnesC === 'N/A') ? 'NO DESEO ESTE PRODUCTO' :  state.arnesC.modelo}</Typography>
            </AccordionSummary>
            <Box className="configurador-button-borrar">
              {(state.arnesC.length != 0) ?
                <DeleteForever className = "trashCanConf" alt="close"  onClick={() => handleRemove('7','14')}  />:  ''
              }
              </Box>
            </Box>
            <AccordionDetails>
            {(expandArneses || expanded === 'panel3') && ( 
              <ConfiguradorCategoria category="7" value={arnesHF} optional="false" carFeatures={caracteristicas}/>
            )}
            </AccordionDetails>
          </Accordion>
         {/*------------------------------------------------------ADAPTADORES--------------------------------------------------------------*/}
          <Accordion expanded={expandAdaptadores || expanded === 'panel4'} onChange={handleChange('panel4')} 
          disabled = {state.arnesC.length === 0}
          >
             <Box className="configurador-accordionSummary">
            <AccordionSummary className="configurador-accordion-header" aria-controls="panel4-content" id="panel4d-header">
              <Typography>Adaptadores</Typography><Typography className="configurador-item-selected"> - {state.adaptadorC.modelo}</Typography>
            </AccordionSummary>
              <Box className="configurador-button-borrar">
              {(state.adaptadorC.length != 0) ?
                <DeleteForever className = "trashCanConf" alt="close"  onClick={() => handleRemove('2','15')}  />:  ''
              }
              </Box>
            </Box>
            <AccordionDetails>
            { (expanded === 'panel4' || expandAdaptadores) && ( 
              <ConfiguradorCategoria category="2" value={adaptadorAntenaHF} optional="false" carFeatures={caracteristicas}/>
            )}
            </AccordionDetails>
          </Accordion>
          {/*------------------------------------------------------ADAPTADOR DE IMPEDANCIA--------------------------------------------------------------*/}
          <Accordion expanded={expandAdaptadoresImpedancia || expanded === 'panel23'} onChange={handleChange('panel23')} 
          disabled = {state.tieneEstereoOriginalC!= 'si'}>
              <Box className="configurador-accordionSummary">
            <AccordionSummary className="configurador-accordion-header" aria-controls="panel4-content" id="panel4d-header">
              <Typography>Adaptador de Impedancia (Solo Estereo Original)</Typography><Typography className="configurador-item-selected"> - {state.adaptadorImpedanciaC.modelo}</Typography>
            </AccordionSummary>
              <Box className="configurador-button-borrar">
              {(state.adaptadorImpedanciaC.length != 0) ?
                 <DeleteForever className = "trashCanConf" alt="close"  onClick={() => handleRemove('3','27')}  />:  ''
              }
              </Box>
            </Box>
            <AccordionDetails>    
            {(expandAdaptadoresImpedancia || expanded === 'panel23') && ( 
              <ConfiguradorCategoria category="3"  value={adaptadorAntenaHF} optional="false" carFeatures={caracteristicas}/>
            )}
            </AccordionDetails>
          </Accordion>
          {/*------------------------------------------------------BOCINA DE REEMPLAZO DELANTERA--------------------------------------------------------------*/}
          <Accordion 
          expanded={(expandBocinaRD || expanded === 'panel5')} 
          onChange={handleChange('panel5')} 
          disabled = {
            (state.adaptadorC.length === 0 && (state.adaptadorImpedanciaC.length === 0 && state.tieneEstereoTipoOriginalC != true)) ||
            (state.mejorarAudio === 'no') || 
            state.tieneBocinaReemplazo == 'no'}>
              <Box className="configurador-accordionSummary">
            <AccordionSummary className="configurador-accordion-header" aria-controls="panel5d-content" id="panel5d-header">
              <Typography>  Bocina de Reemplazo Delantera</Typography><Typography className="configurador-item-selected"> - {(state.bocinaReemplazoDelanteraC === 'N/A') ? 'NO DESEO ESTE PRODUCTO' : state.bocinaReemplazoDelanteraC.modelo}</Typography>
            </AccordionSummary>
            <Box className="configurador-button-borrar">
                {(state.bocinaReemplazoDelanteraC.length != 0) ?
                  <img className = "trashCanConf" src={trash} alt="close"  onClick={() => handleRemove('11','16')}/>:  ''
                }
                </Box>
              </Box>
            <AccordionDetails>
              {
                  (state.mejorarAudio.length === 0)
                  ?
                    <Stack alignItems="center" direction="column" sx={{marginTop:"10px"}}>
                      <Typography>¿Deseas mejorar el audio de tus bocinas?</Typography>
                      <Button variant="contained"  onClick={() => handleMejoraAudio('si')} className="configurador_sino_button" >Si</Button>
                      <Button variant="contained" onClick={() => handleMejoraAudio('no')} className="configurador_sino_button" >No</Button>
                    </Stack>
                  :
                      (state.tieneBocinaReemplazo.length === 0 && state.mejorarAudio === 'si') 
                      ? 
                        <Stack alignItems="center" direction="column" sx={{marginTop:"10px"}}>
                          <Typography>¿Que deseas hacer con tus bocinas?</Typography>
                          <Button variant="contained"  onClick={() => handleTieneBocina('si')} className="configurador_sino_button" >Reemplazarlas</Button>
                          <Button variant="contained" onClick={() => handleTieneBocina('no')} className="configurador_sino_button" >Amplificarlas</Button>
                        </Stack>
                      :
                        (state.tieneBocinaReemplazo === 'si')
                        &&
                        <>
                          <ConfiguradorCategoria category="11" config="Modelo" value={unDinHF} optional="true" carFeatures={caracteristicas}/>
                        </>
                        }
            </AccordionDetails>
          </Accordion>







        </Stack>
        <Box>
          {/*<ProductCartConf/>*/}
          <Box className='nextButton_container'>
            <Button  onClick={handleSubmit}  
              disabled = {
                !(state.terminaConfiguracion1 == "si" ||
                state.accesorioC.length != 0 ||
                state.tieneEcualizador == "no"
                ) ?? 'disabled'
              }  
              variant="contained" 
              className={
                (state.terminaConfiguracion1 == "si" ||
                state.accesorioC.length != 0 ||
                state.tieneEcualizador == "no"
                )? 'primary-basic' : 'primary-basic_disabled' }>
                  Siguiente paso
            </Button>
          </Box>
        </Box>
      </Box>
    }
    </React.Fragment>
  );
}
export default Configurador4;