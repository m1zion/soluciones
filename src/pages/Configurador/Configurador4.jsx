//m2134256161 
import React, {useRef, useState, useEffect, useContext} from "react";
import { Typography, Stack, Button, Stepper, Step, StepLabel } from "@mui/material";
import { Box, sizeHeight } from "@mui/system";
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
import ProductCartConf from "./containers/ProductCartConf";
import { useNavigate } from 'react-router-dom';
import CircularProgress from "@mui/material/CircularProgress";
import GradientCircularProgress from "./GradientCircularProgress";
import ConfiguradorCategoria from "./containers/ConfiguradorCategoria";
import DeleteIcon from '@mui/icons-material/Delete';
import { DeleteForever, DeleteOutline } from "@mui/icons-material";
import ProductDetail from './Components/ProductDetail';
import VisibilityIcon from '@mui/icons-material/Visibility';
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
  
  const steps = ['Selecciona Modelo', 'Tipo de Configuración', 'Número de Dines', 'Configurador','Detalles Envio','Envio'];
  const { 
    state,
    loading,
    error, 
    setConfig,
    fetchOrderData,
    removeFromCartConf,
    setMejoraAudio,
    setTieneBocinaReemplazo,
    setTerminaConfiguracion1,
    setTieneAmplificadorBajos,
    setTieneBocinaOriginal,
    setTieneEcualizador,
    setProductToShow,
    openProductDetail,
  } = useContext(AppContext);
  const showProduct = (productDetail) => {
    //console.log("Show product");
    //console.log(productDetail);
    openProductDetail();
    setProductToShow(productDetail);
  };  
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
    navigate("/CheckOutCart");
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
            setAPIconfCaracteristicas(API+'orders/'+state.confOrderId);
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
  const handleTieneBocinaOriginal = item =>{ 
    const data = {
      orderType: 'configurador',
      status: 'activo',
      tieneBocinaOriginal: item
    }
    usePut(APIconfCaracteristicas,data); 
    setTieneBocinaOriginal(item); 
  }
  const handleTieneBocina = item =>{ 
    const data = {
      orderType: 'configurador',
      status: 'activo',
      tieneBocinaReemplazo: item
    }
    usePut(APIconfCaracteristicas,data);  //Aqui se enviara al backend
    setTieneBocinaReemplazo(item); 
  }
  const handleTerminar1 = item =>{ 
    setTerminaConfiguracion1(item); 
    const data = {
      orderType: 'configurador',
      status: 'activo',
      terminaConfiguracion1: item
    }
    usePut(APIconfCaracteristicas,data);  
  }
  const handleTieneAmplificadorBajos = item =>{ 
    const data = {
      orderType: 'configurador',
      status: 'activo',
      tieneAmplificadorBajos: item
    }
    usePut(APIconfCaracteristicas,data); 
    setTieneAmplificadorBajos(item); 
  }
  const handleTieneEcualizador = item =>{ 
    const data = {
      orderType: 'configurador',
      status: 'activo',
      tieneEcualizador: item
    }
    usePut(APIconfCaracteristicas,data); 
    setTieneEcualizador(item); 
  }

  const handleRemoveNuevo  = async () => {
    let APIDeleteAll2 = "";
    APIDeleteAll2 = APIDeleteAll.concat("9");
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
    if (confirm('Se borraran todos los productos y el modelo de tu auto')) { 
      try {
          await useDelete(APIDeleteAll2);
          removeFromCartConf('nuevo');
          await usePut(APIconfCaracteristicas, dataConfCaracteristicas);
          //("se Borraran los Items");
          navigate("/configurador1");
      } catch (error) {
          console.error("Error during deletion and update:", error);
      }
    }    
  }

  
  const expandEstereo =
    state.estereoC.SKU == undefined && //state.estereoC.length === 0 
    state.tieneEstereoOriginalC !== 'si' &&
    state.tieneEstereoTipoOriginalC != true;
  const expandBases = 
    state.estereoC.SKU != undefined && 
    state.baseC.length === 0;
  const expandArneses = state.baseC.SKU != undefined && 
    state.arnesC.length === 0;
  const expandAdaptadores = (state.arnesC.SKU != undefined || state.arnesC === 'N/A')  && 
    state.adaptadorC.length === 0;
  const expandAdaptadoresImpedancia = state.tieneEstereoOriginalC == 'si' && 
    state.adaptadorImpedanciaC.length === 0;
  const expandBocinaRD = (state.tieneEstereoTipoOriginalC == true && state.bocinaReemplazoDelanteraC.length === 0) ||
  (state.tieneBocinaReemplazo === 'si'  && state.mejorarAudio === 'si' && state.bocinaReemplazoDelanteraC.length === 0) ||
  (state.mejorarAudio != 'no' &&  state.tieneBocinaReemplazo != 'no' &&
    ((state.adaptadorC.SKU != undefined && state.bocinaReemplazoDelanteraC.length === 0) ||
    (state.adaptadorImpedanciaC.SKU != undefined && state.bocinaReemplazoDelanteraC.length === 0)) 
  );
  const expandBaseBocinaRD = (state.bocinaReemplazoDelanteraC.SKU != undefined && state.calzaBocinaReemplazoDelanteraC.length === 0) || 
    (state.bocinaReemplazoDelanteraC === 'N/A' && state.calzaBocinaReemplazoDelanteraC.length === 0);
  const expandBocinaRT = 
    (state.calzaBocinaReemplazoDelanteraC.SKU != undefined && state.bocinaReemplazoTraseraC.length === 0) || 
    (state.calzaBocinaReemplazoDelanteraC === 'N/A' && state.bocinaReemplazoTraseraC.length === 0);
  const expandBaseBocinaRT = (state.bocinaReemplazoTraseraC.SKU != undefined && state.calzaBocinaReemplazoTraseraC.length === 0) || 
    (state.bocinaReemplazoTraseraC === 'N/A' && state.calzaBocinaReemplazoTraseraC.length === 0); 
  const expandBocinaPT = (state.calzaBocinaPremiumDelanteraC.SKU != undefined && state.bocinaPremiumTraseraC.length === 0) || 
    (state.calzaBocinaPremiumDelanteraC === 'N/A' && state.bocinaPremiumTraseraC.length === 0);  
  const expandCalzaBocinaPT = (state.bocinaPremiumTraseraC.SKU != undefined && state.calzaBocinaPremiumTraseraC.length === 0) ||
    (state.bocinaPremiumTraseraC === 'N/A' && state.calzaBocinaPremiumTraseraC.length === 0);
  const expandAmplificadorVoz =  state.amplificadorC.length === 0 && state.tieneBocinaReemplazo === 'no';//Cuando No quiere bocinas de reemplazo N0 = AMPLIFICARLA
  /*let expandedAmplificadorWoofer =  (state.amplificadorWooferC.length === 0 && state.tieneAmplificadorBajos != 'no' && state.mejorarAudio === 'no') || 
    (state.amplificadorWooferC.length === 0 && state.tieneAmplificadorBajos != 'no' && state.terminaConfiguracion1 === 'no') || 
    (state.amplificadorWooferC.length === 0 && state.tieneAmplificadorBajos != 'no'  && state.tieneBocinaOriginal === 'si' ) ||
    (state.amplificadorWooferC.length === 0 && state.tieneAmplificadorBajos != 'no'  && state.calzaBocinaPremiumTraseraC.length != 0 );  
  expandedAmplificadorWoofer = !(state.amplificador3en1C?.SKU != null && state.amplificador3en1C?.SKU !== '');*/
  const hasAmplificador3en1 = state.amplificador3en1C?.SKU != null && state.amplificador3en1C?.SKU !== '';
  const baseCondition = state.amplificadorWooferC.length === 0 && state.tieneAmplificadorBajos !== 'no';
  const extraCondition = (
    state.mejorarAudio === 'no' ||
    state.terminaConfiguracion1 === 'no' ||
    state.tieneBocinaOriginal === 'si' ||
    state.calzaBocinaPremiumTraseraC.length !== 0
  );
  const expandedAmplificadorWoofer = baseCondition && extraCondition && !hasAmplificador3en1;
  
  const expandAmplificador3en1 = (state.tieneAmplificadorBajos === 'no' && state.amplificador3en1C.length === 0);
  const expandCajonAcustico = (state.amplificadorWooferC.SKU != undefined && state.cajonAcusticoC.length === 0) || 
    (state.amplificadorWooferC === 'N/A' && state.cajonAcusticoC.length === 0);
  const expandWoofer = (state.cajonAcusticoC.SKU != undefined && state.wooferC.length === 0) ||
    (state.cajonAcusticoC === 'N/A' && state.wooferC.length === 0);
  const expandKitCables = (state.wooferC.SKU != undefined && state.kitCablesC.length === 0) ||
    (state.wooferC === 'N/A' && state.kitCablesC.length === 0) || 
    (state.amplificador3en1C.SKU != undefined && state.kitCablesC.length === 0);
  const expandEcualizador = (state.ecualizadorC.length === 0 && state.tieneEcualizador === 'si' && state.amplificador3en1C.length === 0) || 
    (state.ecualizadorC.length === 0 && state.kitCablesC.length != 0 && state.amplificador3en1C.length === 0 );
  const expandEpicentro = (state.ecualizadorC.SKU != undefined && state.epicentroC.length === 0) || 
    (state.ecualizadorC === 'N/A' && state.epicentroC.length === 0);
  const expandProcesador =  (state.epicentroC.SKU != undefined && state.procesadorC.length === 0) || 
    (state.epicentroC === 'N/A' && state.procesadorC.length === 0);
  const expandTweeters = (state.procesadorC.SKU != undefined && state.tweeterC.length === 0) || 
    (state.procesadorC === 'N/A' && state.tweeterC.length === 0);
  const expandAccesorios =   (state.tweeterC.SKU != undefined && state.accesorioC.length === 0) || 
    (state.tweeterC === 'N/A' && state.accesorioC.length === 0) || 
    (state.amplificador3en1C.SKU != undefined && state.kitCablesC.SKU != undefined && state.accesorioC.length === 0) || 
    (state.amplificador3en1C.SKU != undefined && state.kitCablesC === 'N/A' && state.accesorioC.length === 0);    
  const expandBocinasOriginalesPremium = (state.tieneBocinaOriginal != 'si') && ((state.amplificadorC.SKU != undefined && state.bocinaPremiumDelanteraC.length === 0));
  const expandCalzaBocinaPD = (state.bocinaPremiumDelanteraC.SKU != undefined && state.calzaBocinaPremiumDelanteraC.length === 0) || 
    (state.bocinaPremiumDelanteraC === 'N/A' && state.calzaBocinaPremiumDelanteraC.length === 0);
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
      
      case "20": //Estereos
        data = {orderId: state.confOrderId,categoryId: 1,categoryIdConfigurador: 20}; //Borro Estereos
        useDeleteOrderItem(APIDelete,data);
      case "20": case "8": //bases
        data = {orderId: state.confOrderId,categoryId: 13,categoryIdConfigurador: 8}; //Borro bases
        useDeleteOrderItem(APIDelete,data);
      case "20": case "8": case "7": //arneses
        data = {orderId: state.confOrderId,categoryId: 14,categoryIdConfigurador: 7}; //Borro arneses
        useDeleteOrderItem(APIDelete,data);
      case "20": case "8": case "7": case "2": // Adaptadores de antena
        data = {orderId: state.confOrderId,categoryId: 15,categoryIdConfigurador: 2}; 
        useDeleteOrderItem(APIDelete,data);
      case "20": case "8": case "7": case "3": // Adaptadores de impedancia
        data = {orderId: state.confOrderId,categoryId: 27,categoryIdConfigurador: 3}; 
        //console.log(data);
        //console.log(APIDelete);
        useDeleteOrderItem(APIDelete,data);
      case "20": case "8": case "7": case "2": case "3": case "11": // Bocina RD Borro bocinas y componentes
        data = {orderId: state.confOrderId,categoryId: 16,categoryIdConfigurador: 11}; 
        useDeleteOrderItem(APIDelete,data);
        data = {orderId: state.confOrderId,categoryId: 29,categoryIdConfigurador: 11}; 
        useDeleteOrderItem(APIDelete,data)
      case "20": case "8": case "7": case "2": case "3":  case "11": case "16": // Base Bocina RD
        data = {orderId: state.confOrderId,categoryId: 28,categoryIdConfigurador: 16}; 
        useDeleteOrderItem(APIDelete,data);
      case "20": case "8": case "7": case "2": case "3":  case "11": case "16": case "12": //Bocina RT  Borro bocinas y componentes
        data = {orderId: state.confOrderId,categoryId: 16,categoryIdConfigurador: 12}; 
        useDeleteOrderItem(APIDelete,data);
        data = {orderId: state.confOrderId,categoryId: 29,categoryIdConfigurador: 12}; 
        useDeleteOrderItem(APIDelete,data)
      case "20": case "8": case "7": case "2": case "3":  case "11": case "16": case "12": case "17": //Base Bocina RT
        data = {orderId: state.confOrderId,categoryId: 28,categoryIdConfigurador: 17}; 
        useDeleteOrderItem(APIDelete,data);
      case "20": case "8": case "7": case "2": case "3":  case "11": case "16": case "12": case "17": case "5": //Amplificador de voz
        data = {orderId: state.confOrderId,categoryId: 17,categoryIdConfigurador: 5}; 
        useDeleteOrderItem(APIDelete,data);
      case "20": case "8": case "7": case "2": case "3":  case "11": case "16": case "12": case "17": case "5": case "9": //Bocina PD  Borro bocinas y componentes
        data = {orderId: state.confOrderId,categoryId: 16,categoryIdConfigurador: 9}; 
        useDeleteOrderItem(APIDelete,data);
        data = {orderId: state.confOrderId,categoryId: 29,categoryIdConfigurador: 9}; 
        useDeleteOrderItem(APIDelete,data);
      case "20": case "8": case "7": case "2": case "3":  case "11": case "16": case "12": case "17": case "5": case "9": case "14": //Base BPD
        data = {orderId: state.confOrderId,categoryId: 28,categoryIdConfigurador: 14}; 
        useDeleteOrderItem(APIDelete,data);
      case "20": case "8": case "7": case "2": case "3":  case "11": case "16": case "12": case "17": case "5": case "9": case "14": case "10": //Bocina PT  Borro bocinas y componentes
        data = {orderId: state.confOrderId,categoryId: 16,categoryIdConfigurador: 10}; 
        useDeleteOrderItem(APIDelete,data);
        data = {orderId: state.confOrderId,categoryId: 29,categoryIdConfigurador: 10}; 
        useDeleteOrderItem(APIDelete,data);
      case "20": case "8": case "7": case "2": case "3":  case "11": case "16": case "12": case "17": case "5": case "9": case "14": case "10": case "15": //Base BPT
        data = {orderId: state.confOrderId,categoryId: 28,categoryIdConfigurador: 15}; 
        useDeleteOrderItem(APIDelete,data);
      case "20": case "8": case "7": case "2": case "3":  case "11": case "16": case "12": case "17": case "5": case "9": case "14": case "10": case "15": case "6":  //Amplificador Woofer
        data = {orderId: state.confOrderId,categoryId: 17,categoryIdConfigurador: 6}; 
        useDeleteOrderItem(APIDelete,data);
      case "20": case "8": case "7": case "2": case "3":  case "11": case "16": case "12": case "17": case "5": case "9": case "14": case "10": case "15": case "4":  //Amplificador 3 en 1
        data = {orderId: state.confOrderId,categoryId: 38,categoryIdConfigurador: 4}; 
        useDeleteOrderItem(APIDelete,data);
      case "20": case "8": case "7": case "2": case "3":  case "11": case "16": case "12": case "17": case "5": case "9": case "14": case "10": case "15": case "6": case "13": //cajon acustico
        data = {orderId: state.confOrderId,categoryId: 7,categoryIdConfigurador: 13};
        useDeleteOrderItem(APIDelete,data);
      case "20": case "8": case "7": case "2": case "3":  case "11": case "16": case "12": case "17": case "5": case "9": case "14": case "10": case "15": case "6": case "13":
      case "26":  //Woofer
        data = {orderId: state.confOrderId,categoryId: 21,categoryIdConfigurador: 26}; 
        useDeleteOrderItem(APIDelete,data);
      case "20": case "8": case "7": case "2": case "3":  case "11": case "16": case "12": case "17": case "5": case "9": case "14": case "10": case "15": case "6": case "26":
      case "13": case "21": case "4":  //Kit de cables
        data = {orderId: state.confOrderId,categoryId: 25,categoryIdConfigurador: 21}; 
        useDeleteOrderItem(APIDelete,data);
      case "20": case "8": case "7": case "2": case "3":  case "11": case "16": case "12": case "17": case "5": case "9": case "14": case "10": case "15": case "6": case "26":
      case "13": case "21": case "18":  //Ecualizador
        data = {orderId: state.confOrderId,categoryId: 20,categoryIdConfigurador: 18}; 
        useDeleteOrderItem(APIDelete,data);        
      case "20": case "8": case "7": case "2": case "3":  case "11": case "16": case "12": case "17": case "5": case "9": case "14": case "10": case "15": case "6": case "26":
      case "13": case "21": case "18": case "19": //Epicentro
        data = {orderId: state.confOrderId,categoryId: 23,categoryIdConfigurador: 19};
        useDeleteOrderItem(APIDelete,data);
      case "20": case "8": case "7": case "2": case "3":  case "11": case "16": case "12": case "17": case "5": case "9": case "14": case "10": case "15": case "6": case "26":
      case "13": case "21": case "18": case "19": case "23": //Procesador
        data = {orderId: state.confOrderId,categoryId: 24,categoryIdConfigurador: 23};
        useDeleteOrderItem(APIDelete,data);
      case "20": case "8": case "7": case "2": case "3":  case "11": case "16": case "12": case "17": case "5": case "9": case "14": case "10": case "15": case "6": case "26":
      case "13": case "21": case "18": case "19": case "23": case "25": //Tweeters
        data = {orderId: state.confOrderId,categoryId: 19,categoryIdConfigurador: 25};
        useDeleteOrderItem(APIDelete,data);
      case "20": case "8": case "7": case "2": case "3":  case "11": case "16": case "12": case "17": case "5": case "9": case "14": case "10": case "15": case "6": case "26":
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
      case "8": case "7": case "2": case "11": case '3': case '20': // Bases, Arneses, Adaptadores de antena, Bocinas RD, adaptadores de Impedancia, Estereos
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

  console.log("---------------");
  console.log(state.mejorarAudio);
  /*console.log("===========");*/
  return (
    <React.Fragment>
      {(loading || loadingLocal) && <Box className="Loading_Container"> <GradientCircularProgress /></Box>}
      {(!loading && !error && !loadingLocal) &&
      <Box>        
      <Stepper activeStep={3} alternativeLabel 
        sx={{
            display: { xs: 'flex', flexWrap:'wrap' },
            mt: "7rem",
            width: "-webkit-fill-available",
            "& .MuiStepIcon-root.Mui-active": {
            color: "#B1B803", // Color of the active step icon
            },
            "& .MuiStepIcon-root.Mui-completed": {
            color: "#B1B803", // Color of completed step icons
            },
        }}>
        {steps.map((label) => (
        <Step key={label} >
            <StepLabel>{label}</StepLabel>
        </Step>
        ))}
      </Stepper>
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
          <Accordion 
            expanded={expandEstereo || expanded === 'panel1'}  
            disabled = {state.tieneEstereoOriginalC === 'si' || state.tieneEstereoTipoOriginalC === true || (state.estereoC?.SKU != null && state.estereoC.SKU !== '')} //|| state.estereoC?.SKU? !== ''
            onChange={handleChange('panel1')}      
          >
            <Box className="configurador-accordionSummary">
              <AccordionSummary 
                aria-controls="panel1d-content" 
                id="panel1d-header"              
                className={state.estereoC?.SKU != null && state.estereoC?.SKU !== '' ? 'configurador-accordion-header-disabled': ''}
              >    
                <Typography>Estereos</Typography><Typography className="configurador-item-selected"> - {state.estereoC.modelo} </Typography>  
              </AccordionSummary>
              <Box className="configurador-button-borrar">
                {(state.estereoC?.SKU && state.estereoC.SKU !== "") && (
                <>
                <VisibilityIcon
                  className="viewIconConf"
                  style={{ marginRight: '8px',marginLeft: '8px' }}
                  onClick={() => showProduct(state.estereoC)}
                />
                <DeleteForever className = "trashCanConf" alt="close"  onClick={() => handleRemove('20','1')}  />
                </>
                )
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
          <Accordion 
            expanded={expandBases || expanded === 'panel2'}  
            onChange={handleChange('panel2')} 
            disabled = {(!state.estereoC?.SKU || state.estereoC.SKU === ""  || (state.baseC?.SKU != null && state.baseC.SKU !== '') )} 
            id="accordion_base"
          >{/* disabled={enabledBase}*/}
           <Box className="configurador-accordionSummary">
            <AccordionSummary 
              className={state.baseC?.SKU != null && state.baseC?.SKU !== '' ? 'configurador-accordion-header-disabled': ''}
              aria-controls="panel2d-content" 
              id="panel2d-header">
              <Typography>Bases</Typography><Typography className="configurador-item-selected"> - {state.baseC.modelo} </Typography>
            </AccordionSummary>
              <Box className="configurador-button-borrar">
              {(state.baseC.length != 0) && (
                <>
                  <VisibilityIcon
                    className="viewIconConf"
                    style={{ marginRight: '8px',marginLeft: '8px' }}
                    onClick={() => showProduct(state.baseC)}
                  />
                  <DeleteForever className = "trashCanConf" alt="close"  onClick={() => handleRemove('8','13')}  />
                </>
              )}            
              </Box>
            </Box>
            <AccordionDetails>
            {(expandBases || expanded === 'panel2') && (     
              <ConfiguradorCategoria category="8"  value={valor} value2= {valor2} optional="false" carFeatures={caracteristicas}/>
            )}
            </AccordionDetails>
          </Accordion>
          {/*------------------------------------------------------ARNESES--------------------------------------------------------------*/}
          <Accordion 
            expanded={expandArneses || expanded === 'panel3'} 
            onChange={handleChange('panel3')} 
            disabled = {state.baseC.length === 0 || (state.arnesC?.SKU != null && state.arnesC.SKU !== '')}
          >
            <Box className="configurador-accordionSummary">
            <AccordionSummary 
              className={state.arnesC?.SKU != null && state.arnesC?.SKU !== '' ? 'configurador-accordion-header-disabled': ''}
              aria-controls="panel3d-content" 
              id="panel3d-header">
              <Typography>Arneses</Typography><Typography className="configurador-item-selected"> - {(state.arnesC === 'N/A') ? 'NO DESEO ESTE PRODUCTO' :  state.arnesC.modelo}</Typography>
            </AccordionSummary>
            <Box className="configurador-button-borrar">
              {(state.arnesC.length != 0) && (
              <>
                <VisibilityIcon
                  className="viewIconConf"
                  style={{ marginRight: '8px',marginLeft: '8px' }}
                  onClick={() => showProduct(state.arnesC)}
                />
                <DeleteForever className = "trashCanConf" alt="close"  onClick={() => handleRemove('7','14')}  />
              </>
              )
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
          <Accordion 
            expanded={expandAdaptadores || expanded === 'panel4'} 
            onChange={handleChange('panel4')} 
            disabled = {(state.arnesC.length === 0 || (state.adaptadorC?.SKU != null && state.adaptadorC.SKU !== ''))}
          >
             <Box className="configurador-accordionSummary">
            <AccordionSummary 
              className={state.adaptadorC?.SKU != null && state.adaptadorC?.SKU !== '' ? 'configurador-accordion-header-disabled': ''}
              aria-controls="panel4-content" 
              id="panel4d-header">
              <Typography>Adaptadores</Typography><Typography className="configurador-item-selected"> - {state.adaptadorC.modelo}</Typography>
            </AccordionSummary>
              <Box className="configurador-button-borrar">
              {(state.adaptadorC.length != 0) && (
                <>
                  <VisibilityIcon
                    className="viewIconConf"
                    style={{ marginRight: '8px',marginLeft: '8px' }}
                    onClick={() => showProduct(state.adaptadorC)}
                  />
                  <DeleteForever className = "trashCanConf" alt="close"  onClick={() => handleRemove('2','15')}  />
                </>
              )}
              </Box>
            </Box>
            <AccordionDetails>
            { (expanded === 'panel4' || expandAdaptadores) && ( 
              <ConfiguradorCategoria category="2" value={adaptadorAntenaHF} optional="false" carFeatures={caracteristicas}/>
            )}
            </AccordionDetails>
          </Accordion>
          {/*------------------------------------------------------ADAPTADOR DE IMPEDANCIA--------------------------------------------------------------*/}
          <Accordion 
            expanded={expandAdaptadoresImpedancia || expanded === 'panel23'} 
            onChange={handleChange('panel23')} 
            disabled = {state.tieneEstereoOriginalC!= 'si' || state.adaptadorImpedanciaC.length != 0}>
              <Box className="configurador-accordionSummary">
            <AccordionSummary 
              className={state.adaptadorImpedanciaC?.SKU != null && state.adaptadorImpedanciaC?.SKU !== '' ? 'configurador-accordion-header-disabled': ''}
              aria-controls="panel4-content" 
              id="panel4d-header">
              <Typography>Adaptador de Impedancia (Solo Estereo Original)</Typography><Typography className="configurador-item-selected"> - {state.adaptadorImpedanciaC.modelo}</Typography>
            </AccordionSummary>
              <Box className="configurador-button-borrar">
              {(state.adaptadorImpedanciaC.length != 0)&& (
                <>
                  <VisibilityIcon
                    className="viewIconConf"
                    style={{ marginRight: '8px',marginLeft: '8px' }}
                    onClick={() => showProduct(state.adaptadorImpedanciaC)}
                  />
                 <DeleteForever className = "trashCanConf" alt="close"  onClick={() => handleRemove('3','27')}  />
                </>
              )
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
            state.tieneBocinaReemplazo == 'no' ||
            (state.bocinaReemplazoDelanteraC.length != 0)
          }
          >
            <Box className="configurador-accordionSummary">
            <AccordionSummary 
              className={state.bocinaReemplazoDelanteraC?.SKU != null && state.bocinaReemplazoDelanteraC?.SKU !== '' ? 'configurador-accordion-header-disabled': ''}
              aria-controls="panel5d-content" 
              id="panel5d-header">
              <Typography>  Bocina de Reemplazo Delantera</Typography><Typography className="configurador-item-selected"> - {(state.bocinaReemplazoDelanteraC === 'N/A') ? 'NO DESEO ESTE PRODUCTO' : state.bocinaReemplazoDelanteraC.modelo}</Typography>
            </AccordionSummary>
            <Box className="configurador-button-borrar">
                {(state.bocinaReemplazoDelanteraC.length != 0) && 
                <>
                  <VisibilityIcon
                    className="viewIconConf"
                    style={{ marginRight: '8px',marginLeft: '8px' }}
                    onClick={() => showProduct(state.bocinaReemplazoDelanteraC)}
                  />
                   <DeleteForever className = "trashCanConf" alt="close"  onClick={() => handleRemove('11','16')}  />
                </>
                }
                </Box>
            </Box>
            <AccordionDetails>
              {
                  //(state.mejorarAudio.length === 0)
                  (!state.mejorarAudio || state.mejorarAudio.length === 0)
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
                          <ConfiguradorCategoria category="11" value={unDinHF} optional="true" carFeatures={caracteristicas}/>
                        </>
                }
            </AccordionDetails>
          </Accordion>
          {/*------------------------------------------------------CALZAS BOCINA DE REEMPLAZO DELANTERA--------------------------------------------------------------*/}
          <Accordion expanded={(expandBaseBocinaRD || expanded === 'panel6')} onChange={handleChange('panel6')} 
            disabled = {state.bocinaReemplazoDelanteraC.length === 0 || (state.calzaBocinaReemplazoDelanteraC?.SKU != null && state.calzaBocinaReemplazoDelanteraC?.SKU !== '') }>
              <Box className="configurador-accordionSummary">
                <AccordionSummary 
                  className={state.calzaBocinaReemplazoDelanteraC?.SKU != null && state.calzaBocinaReemplazoDelanteraC?.SKU !== '' ? 'configurador-accordion-header-disabled': ''}
                  aria-controls="panel6d-content" 
                  id="panel6d-header">
                  <Typography>Base para Bocina Delantera</Typography><Typography className="configurador-item-selected"> - {(state.calzaBocinaReemplazoDelanteraC === 'N/A') ? 'NO DESEO ESTE PRODUCTO' : state.calzaBocinaReemplazoDelanteraC.modelo}</Typography>
                </AccordionSummary>
                <Box className="configurador-button-borrar">
                  {(state.calzaBocinaReemplazoDelanteraC.length != 0) && 
                  <>
                    <VisibilityIcon
                      className="viewIconConf"
                      style={{ marginRight: '8px',marginLeft: '8px' }}
                      onClick={() => showProduct(state.calzaBocinaReemplazoDelanteraC)}
                    />
                    <DeleteForever className = "trashCanConf" alt="close"  onClick={() => handleRemove('16','28')}  />
                  </>
                  }
                </Box>
              </Box>
              <AccordionDetails>
              {(expandBaseBocinaRD || expanded === 'panel6') && (
                <ConfiguradorCategoria category="16" value={unDinHF} optional="true" carFeatures={caracteristicas}/>
              )}
              </AccordionDetails>
          </Accordion>
          {/*------------------------------------------------------BOCINA DE REEMPLAZO TRASERA--------------------------------------------------------------*/}
          <Accordion 
            expanded={(expandBocinaRT || expanded === 'panel7')} 
            onChange={handleChange('panel7')} 
            disabled = {state.calzaBocinaReemplazoDelanteraC.length === 0 || (state.bocinaReemplazoTraseraC.length != 0)}>
            <Box className="configurador-accordionSummary">
              <AccordionSummary 
                className={state.bocinaReemplazoTraseraC?.SKU != null && state.bocinaReemplazoTraseraC?.SKU !== '' ? 'configurador-accordion-header-disabled': ''}
                aria-controls="panel7d-content" 
                id="panel7d-header">
                <Typography>Bocina de Reemplazo Trasera</Typography>
                <Typography className="configurador-item-selected"> - {(state.bocinaReemplazoTraseraC === 'N/A') ? 'NO DESEO ESTE PRODUCTO' :  state.bocinaReemplazoTraseraC.modelo}</Typography>
              </AccordionSummary>
              <Box className="configurador-button-borrar">
                {(state.bocinaReemplazoTraseraC.length != 0) && 
                  <>
                    <VisibilityIcon
                      className="viewIconConf"
                      style={{ marginRight: '8px',marginLeft: '8px' }}
                      onClick={() => showProduct(state.bocinaReemplazoTraseraC)}
                    />
                   <DeleteForever className = "trashCanConf" alt="close"  onClick={() => handleRemove('12','16')}  />
                  </>
                }
              </Box>
            </Box>
            <AccordionDetails>
            {(expandBocinaRT || expanded === 'panel7') && (
                <>
                  <ConfiguradorCategoria category="12" config="Modelo" value={unDinHF} optional="true" carFeatures={caracteristicas}/>          
                </>
                  )}
            </AccordionDetails>
        </Accordion>
        {/*------------------------------------------------------CALZAS BOCINA DE REEMPLAZO TRASERA--------------------------------------------------------------*/}
        <Accordion 
          expanded={(expandBaseBocinaRT || expanded === 'panel8')} 
          onChange={handleChange('panel8')} 
          disabled = {(state.bocinaReemplazoTraseraC.length === 0 || (state.calzaBocinaReemplazoTraseraC.length != 0))}>
          <Box className="configurador-accordionSummary">
            <AccordionSummary 
              className={state.calzaBocinaReemplazoTraseraC?.SKU != null && state.calzaBocinaReemplazoTraseraC?.SKU !== '' ? 'configurador-accordion-header-disabled': ''}
              aria-controls="panel8d-content" 
              id="panel8d-header">
              <Typography>Base para Bocina Trasera</Typography><Typography className="configurador-item-selected"> - {(state.calzaBocinaReemplazoTraseraC === 'N/A') ? 'NO DESEO ESTE PRODUCTO' :  state.calzaBocinaReemplazoTraseraC.modelo}</Typography>
            </AccordionSummary>
            <Box className="configurador-button-borrar">
              {(state.calzaBocinaReemplazoTraseraC.length != 0) && 
              <>
                <VisibilityIcon
                  className="viewIconConf"
                  style={{ marginRight: '8px',marginLeft: '8px' }}
                  onClick={() => showProduct(state.calzaBocinaReemplazoTraseraC)}
                />
                <DeleteForever className = "trashCanConf" alt="close"  onClick={() => handleRemove('17','28')}  />
              </>
              }
            </Box>
          </Box>
          <AccordionDetails>
          {(expandBaseBocinaRT || expanded === 'panel8') && (
            <ConfiguradorCategoria category="17" config="Modelo" value={unDinHF} optional="true" carFeatures={caracteristicas}/>
          )}
          </AccordionDetails>
        </Accordion>  
        {/*------------------------------------------------------TERMINAR CONFIGURACION 1--------------------------------------------------------------*/}
        <Accordion expanded={(
          (state.calzaBocinaReemplazoTraseraC.length != 0 && state.tieneBocinaReemplazo.length != 0) || 
          expanded === 'panel9')} onChange={handleChange('panel9')} 
          disabled = {state.calzaBocinaReemplazoTraseraC.length === 0 && state.calzaBocinaReemplazoTraseraC.length === 0}>
           <Box className="configurador-accordionSummary">
              <AccordionSummary className="configurador-accordion-header" aria-controls="panel9d-content" id="panel9d-header">
                <Typography>Terminar Configuracion 1</Typography>
              </AccordionSummary>
            </Box>        
            {
                (!state.terminaConfiguracion1 || state.terminaConfiguracion1.length === 0)
                && 
                <AccordionDetails>
                  <Stack alignItems="center" direction="column" sx={{marginTop:"10px"}}>
                    <Typography>¿Que deseas hacer?</Typography>
                    <Button variant="contained" onClick={() => handleTerminar1('si')} className="configurador_sino_button" >Terminar Configuración</Button>
                    <Button variant="contained" onClick={() => handleTerminar1('no')} className="configurador_sino_button" >Agregar Amplificador de Woofer</Button>
                  </Stack>
                  </AccordionDetails>
              }          
        </Accordion>
        {/*------------------------------------------------------AMPLIFICADOR DE VOZ (Previo adaptador)--------------------------------------------------------------*/}
        <Accordion 
          expanded={(expandAmplificadorVoz || expanded === 'panel10')} 
          onChange={handleChange('panel10')} 
          disabled = {(state.adaptadorC.length === 0) || 
          (state.tieneBocinaReemplazo.length === 0) || 
          (state.tieneBocinaReemplazo === 'si') ||
          state.amplificadorC.length != 0 }>
          <Box className="configurador-accordionSummary">
            <AccordionSummary 
              className={state.amplificadorC?.SKU != null && state.amplificadorC?.SKU !== '' ? 'configurador-accordion-header-disabled': ''}
              aria-controls="panel10d-content" 
              id="panel10d-header">
              <Typography>Amplificador de Voz</Typography><Typography className="configurador-item-selected"> - {state.amplificadorC.modelo}</Typography>
            </AccordionSummary>
            <Box className="configurador-button-borrar">
              {(state.amplificadorC.length != 0) && 
                <>
                  <VisibilityIcon
                    className="viewIconConf"
                    style={{ marginRight: '8px',marginLeft: '8px' }}
                    onClick={() => showProduct(state.amplificadorC)}
                  />
                  <DeleteForever className = "trashCanConf" alt="close"  onClick={() => handleRemove('5')}  />
                </>
              }
            </Box>
          </Box>
          <AccordionDetails>
          {(expandAmplificadorVoz || expanded === 'panel10') && (
            <ConfiguradorCategoria category="5" config="Modelo" value={unDinHF} optional="false"/>
          )}
          </AccordionDetails>
        </Accordion>   
        {/*------------------------------------------------- BOCINAS ORIGINALES O PREMIUM --------------------------------------------------------*/}
        <Accordion 
          expanded={(expandBocinasOriginalesPremium || expanded === 'panel11')} 
          onChange={handleChange('panel11')} 
          disabled = {state.amplificadorC.length === 0 || state.tieneBocinaOriginal === 'si' || state.bocinaPremiumDelanteraC.length != 0}>
           <Box className="configurador-accordionSummary">
          <AccordionSummary 
            className={state.bocinaPremiumDelanteraC?.SKU != null && state.bocinaPremiumDelanteraC?.SKU !== '' ? 'configurador-accordion-header-disabled': ''} 
            aria-controls="panel11d-content" 
            id="panel11d-header">
            <Typography>Bocina Premium Delatera</Typography><Typography className="configurador-item-selected"> - {(state.bocinaPremiumDelanteraC === 'N/A') ? 'NO DESEO ESTE PRODUCTO' :  state.bocinaPremiumDelanteraC.modelo}</Typography>
          </AccordionSummary>
          <Box className="configurador-button-borrar">
              {(state.bocinaPremiumDelanteraC.length != 0) && 
              <>
                <VisibilityIcon
                  className="viewIconConf"
                  style={{ marginRight: '8px',marginLeft: '8px' }}
                  onClick={() => showProduct(state.bocinaPremiumDelanteraC)}
                />
                <DeleteForever className = "trashCanConf" alt="close"  onClick={() => handleRemove('9','16')}  />
              </>
              }
              </Box>
            </Box>
          <AccordionDetails>
            {
              (!state.tieneBocinaOriginal || state.tieneBocinaOriginal.length === 0)                
                ? 
                  <Stack alignItems="center" direction="column" sx={{marginTop:"10px"}}>
                    <Typography>¿Que tipo de Bocinas deseas incluir?</Typography>
                    <Button variant="contained"  onClick={() => handleTieneBocinaOriginal('si')} className="configurador_sino_button" >Bocinas Originales</Button>
                    <Button variant="contained" onClick={() => handleTieneBocinaOriginal('no')} className="configurador_sino_button" >Bocinas Premium</Button>
                  </Stack>
                :
                  ((state.tieneBocinaOriginal === 'no') && (expandBocinasOriginalesPremium || expanded === 'panel11'))
                  &&
                  <ConfiguradorCategoria category="9" value={unDinHF} optional="true" carFeatures={caracteristicas}/>
              }
            </AccordionDetails>
          </Accordion>
        {/*------------------------------------------------------CALZAS BOCINA PREMIUM DELANTERA--------------------------------------------------------------*/}
        <Accordion 
          expanded={(expandCalzaBocinaPD || expanded === 'panel12')} 
          onChange={handleChange('panel12')} 
          disabled = {state.bocinaPremiumDelanteraC.length === 0 || state.calzaBocinaPremiumDelanteraC.length != 0}>
          <Box className="configurador-accordionSummary">
            <AccordionSummary 
              className={state.calzaBocinaPremiumDelanteraC?.SKU != null && state.calzaBocinaPremiumDelanteraC?.SKU !== '' ? 'configurador-accordion-header-disabled': ''} 
              aria-controls="panel12d-content" 
              id="panel12d-header">
              <Typography>Base para Bocina Premium Delantera</Typography><Typography className="configurador-item-selected"> - {(state.calzaBocinaPremiumDelanteraC === 'N/A') ? 'NO DESEO ESTE PRODUCTO' :  state.calzaBocinaPremiumDelanteraC.modelo}</Typography>
            </AccordionSummary>
            <Box className="configurador-button-borrar">
              {(state.calzaBocinaPremiumDelanteraC.length != 0) && 
              <>
                <VisibilityIcon
                  className="viewIconConf"
                  style={{ marginRight: '8px',marginLeft: '8px' }}
                  onClick={() => showProduct(state.calzaBocinaPremiumDelanteraC)}
                />
                <DeleteForever className = "trashCanConf" alt="close"  onClick={() => handleRemove('14','28')}  />
              </>
              }
            </Box>
          </Box>
          <AccordionDetails>
          {(expandCalzaBocinaPD || expanded === 'panel12') && (
            <ConfiguradorCategoria category="14" value={unDinHF} optional="true" carFeatures={caracteristicas}/>
          )}
          </AccordionDetails>
        </Accordion>



          {/*------------------------------------------------------BOCINA PREMIUM TRASERA--------------------------------------------------------------*/}
        <Accordion 
          expanded={(expandBocinaPT || expanded === 'panel13')} 
          onChange={handleChange('panel13')} 
          disabled = {state.calzaBocinaPremiumDelanteraC.length === 0 || state.bocinaPremiumTraseraC.length != 0}>
          <Box className="configurador-accordionSummary">
            <AccordionSummary 
              className={state.bocinaPremiumTraseraC?.SKU != null && state.bocinaPremiumTraseraC?.SKU !== '' ? 'configurador-accordion-header-disabled': ''} 
              aria-controls="panel13d-content" 
              id="panel13d-header">
              <Typography>Bocina Premium Trasera</Typography>
              <Typography className="configurador-item-selected"> - {(state.bocinaPremiumTraseraC === 'N/A') ? 'NO DESEO ESTE PRODUCTO' :  state.bocinaPremiumTraseraC.modelo}</Typography>
            </AccordionSummary>
            <Box className="configurador-button-borrar">
              {(state.bocinaPremiumTraseraC.length != 0) && 
              <>
                <VisibilityIcon
                  className="viewIconConf"
                  style={{ marginRight: '8px',marginLeft: '8px' }}
                  onClick={() => showProduct(state.bocinaPremiumTraseraC)}
                />
                <DeleteForever className = "trashCanConf" alt="close"  onClick={() => handleRemove('10','16')}  />
              </>
              }
            </Box>
          </Box>
          <AccordionDetails>
          {(expandBocinaPT || expanded === 'panel13') && (
              <ConfiguradorCategoria category="10" value={unDinHF} optional="true" carFeatures={caracteristicas}/>
          )}
          </AccordionDetails>
        </Accordion>
      {/*------------------------------------------------------CALZAS BOCINA PREMIUM TRASERA--------------------------------------------------------------*/}
      <Accordion 
        expanded={(expandCalzaBocinaPT || expanded === 'panel14')} 
        onChange={handleChange('panel14')} 
        disabled = {state.bocinaPremiumTraseraC.length === 0 || state.calzaBocinaPremiumTraseraC.length}>
      <Box className="configurador-accordionSummary">
        <AccordionSummary 
          className={state.calzaBocinaPremiumTraseraC?.SKU != null && state.calzaBocinaPremiumTraseraC?.SKU !== '' ? 'configurador-accordion-header-disabled': ''}  
          aria-controls="panel14d-content" 
          id="panel14d-header">
          <Typography>Base para Bocina Premium Trasera</Typography><Typography className="configurador-item-selected"> - {(state.calzaBocinaPremiumTraseraC === 'N/A') ? 'NO DESEO ESTE PRODUCTO' :  state.calzaBocinaPremiumTraseraC.modelo}</Typography>
        </AccordionSummary>
        <Box className="configurador-button-borrar">
          {(state.calzaBocinaPremiumTraseraC.length != 0) && 
            <>
              <VisibilityIcon
                className="viewIconConf"
                style={{ marginRight: '8px',marginLeft: '8px' }}
                onClick={() => showProduct(state.calzaBocinaPremiumTraseraC)}
              />
              <DeleteForever className = "trashCanConf" alt="close"  onClick={() => handleRemove('15','28')}  />
          </>
          }
        </Box>
      </Box>
      <AccordionDetails>
      {(expandCalzaBocinaPT || expanded === 'panel14') && (
        <ConfiguradorCategoria category="15" value={unDinHF} optional="true" carFeatures={caracteristicas}/>
      )}
      </AccordionDetails>
    </Accordion>
    {/*------------------------------------------------------AMPLIFICADOR DE WOOFER--------------------------------------------------------------*/}
      {/*ACTIVAR disabled={!activarBotonWoofer} para desactivar el boton*/}
    <Accordion 
      expanded={(expandedAmplificadorWoofer || expanded === 'panel15')} 
      onChange={handleChange('panel15')} 
      disabled = {
        ((!state.mejorarAudio || state.mejorarAudio.length === 0) && state.mejorarAudio !== 'no') ||
        (state.terminaConfiguracion1 !== 'no' &&
          state.tieneBocinaOriginal !== 'si' &&
          state.mejorarAudio !== 'no' && 
          (!state.calzaBocinaPremiumTraseraC || state.calzaBocinaPremiumTraseraC.length === 0)) || 
        (state.amplificadorWooferC && state.amplificadorWooferC.length !== 0)
      }      
      >
        <Box className="configurador-accordionSummary">
        <AccordionSummary 
          className={state.amplificadorWooferC?.SKU != null && state.amplificadorWooferC?.SKU !== '' ? 'configurador-accordion-header-disabled': ''}
          aria-controls="panel15d-content" 
          id="panel15d-header">
          <Typography>Amplificador de Woofer</Typography><Typography className="configurador-item-selected"> - {(state.amplificadorWooferC === 'N/A') ? 'NO DESEO ESTE PRODUCTO' :  state.amplificadorWooferC.modelo}</Typography>
        </AccordionSummary>
        <Box className="configurador-button-borrar">
          {(state.amplificadorWooferC.length != 0) && 
          <>
            <VisibilityIcon
              className="viewIconConf"
              style={{ marginRight: '8px',marginLeft: '8px' }}
              onClick={() => showProduct(state.amplificadorWooferC)}
            />
            <DeleteForever className = "trashCanConf" alt="close"  onClick={() => handleRemove('6','17')}  />
          </>
          }
          </Box>
        </Box>
      <AccordionDetails>
        {
          (!state.tieneAmplificadorBajos || state.tieneAmplificadorBajos.length === 0)
            ? 
              <Stack alignItems="center" direction="column" sx={{marginTop:"10px"}}>
                <Typography>¿Selecciona el tipo de amplificador de Woofer?</Typography>
              
                <Button disabled={!activarBotonWoofer} variant="contained"  onClick={() => handleTieneAmplificadorBajos('si')} className={activarBotonWoofer ? 'configurador_sino_button' : 'configurador_sino_button_disabled'} >Amplificador de Woofer</Button>
                <Button variant="contained" onClick={() => handleTieneAmplificadorBajos('no')} className="configurador_sino_button">Amplificador 3 en 1</Button>
              </Stack>
            :
              ((state.tieneAmplificadorBajos === 'si') && (expandedAmplificadorWoofer || expanded === 'panel15'))
              &&
              <ConfiguradorCategoria category="6" value={unDinHF} optional="true" carFeatures={caracteristicas}/>          
          }
      </AccordionDetails>
    </Accordion>
  {/*------------------------------------------------------AMPLIFICADOR 3 en 1 --------------------------------------------------------------*/}
  <Accordion 
    expanded={(expandAmplificador3en1 || expanded === 'panel24')} 
    onChange={handleChange('panel24')} 
    disabled = {state.tieneAmplificadorBajos != 'no' || state.amplificador3en1C.length != 0}>
      <Box className="configurador-accordionSummary">
        <AccordionSummary 
          className={state.amplificador3en1C?.SKU != null && state.amplificador3en1C?.SKU !== '' ? 'configurador-accordion-header-disabled': ''}
          aria-controls="panel16d-content" 
          id="panel16d-header">
          <Typography>Amplificador 3 en 1</Typography>
          <Typography className="configurador-item-selected"> - {state.amplificador3en1C.modelo}</Typography>
        </AccordionSummary>
        <Box className="configurador-button-borrar">
          {(state.amplificador3en1C.length != 0)&& 
          <>
            <VisibilityIcon
              className="viewIconConf"
              style={{ marginRight: '8px',marginLeft: '8px' }}
              onClick={() => showProduct(state.amplificador3en1C)}
            />
            <DeleteForever className = "trashCanConf" alt="close"  onClick={() => handleRemove('4','38')}  />
          </>
          }
        </Box>
      </Box>
      <AccordionDetails>
      {(expandAmplificador3en1 || expanded === 'panel24') && (
          <ConfiguradorCategoria category="4" value={unDinHF} optional="false" carFeatures={caracteristicas}/>
      )}
      </AccordionDetails>
    </Accordion>
    {/*------------------------------------------------------CAJON ACUSTICO--------------------------------------------------------------*/}
    <Accordion 
      expanded={(expandCajonAcustico || expanded === 'panel16')} 
      onChange={handleChange('panel16')} 
      disabled = {(state.amplificadorWooferC.length === 0 || state.cajonAcusticoC.length != 0)}>
      <Box className="configurador-accordionSummary">
        <AccordionSummary 
          className={state.cajonAcusticoC?.SKU != null && state.cajonAcusticoC?.SKU !== '' ? 'configurador-accordion-header-disabled': ''}
          aria-controls="panel16d-content" 
          id="panel16d-header">
          <Typography>Cajon Acustico</Typography>
          <Typography className="configurador-item-selected"> - {(state.cajonAcusticoC === 'N/A') ? 'NO DESEO ESTE PRODUCTO' :  state.cajonAcusticoC.modelo}</Typography>
        </AccordionSummary>
        <Box className="configurador-button-borrar">
          {(state.cajonAcusticoC.length != 0) && 
          <>
            <VisibilityIcon
              className="viewIconConf"
              style={{ marginRight: '8px',marginLeft: '8px' }}
              onClick={() => showProduct(state.cajonAcusticoC)}
            />
            <DeleteForever className = "trashCanConf" alt="close"  onClick={() => handleRemove('13','7')}  />
          </>
          }
        </Box>
      </Box>
      <AccordionDetails>
      {(expandCajonAcustico || expanded === 'panel16') && (
        <ConfiguradorCategoria category="13" value={unDinHF} optional="true" carFeatures={caracteristicas}/>
      )}
      </AccordionDetails>
    </Accordion>
  {/*------------------------------------------------------WOOFER--------------------------------------------------------------*/}
  <Accordion 
    expanded={(expandWoofer || expanded === 'panel17')} 
    onChange={handleChange('panel17')} 
    disabled = {(state.cajonAcusticoC.length === 0 || state.wooferC.length != 0)}>
      <Box className="configurador-accordionSummary">
        <AccordionSummary 
          className={state.wooferC?.SKU != null && state.wooferC?.SKU !== '' ? 'configurador-accordion-header-disabled': ''}
          aria-controls="panel17d-content" 
          id="panel17d-header">
          <Typography>Woofer</Typography>
          <Typography className="configurador-item-selected"> - {(state.wooferC === 'N/A') ? 'NO DESEO ESTE PRODUCTO' :  state.wooferC.modelo}</Typography>
        </AccordionSummary>
        <Box className="configurador-button-borrar">
          {(state.wooferC.length != 0) && 
          <>
            <VisibilityIcon
              className="viewIconConf"
              style={{ marginRight: '8px',marginLeft: '8px' }}
              onClick={() => showProduct(state.wooferC)}
            />
             <DeleteForever className = "trashCanConf" alt="close"  onClick={() => handleRemove('26','21')}  />
          </>
          }
        </Box>
      </Box>
      <AccordionDetails>
      {(expandWoofer || expanded === 'panel17') && (
          <ConfiguradorCategoria category="26" value={unDinHF} optional="true" carFeatures={caracteristicas}/>
      )}
      </AccordionDetails>
    </Accordion>


    {/*------------------------------------------------------KIT DE CABLES --------------------------------------------------------------*/}
    <Accordion 
      expanded={(expandKitCables || expanded === 'panel18')} 
      onChange={handleChange('panel18')} 
      disabled = {(state.wooferC.length === 0 && state.amplificador3en1C.length === 0) || (state.kitCablesC.length != 0)}>
      <Box className="configurador-accordionSummary">
        <AccordionSummary 
          className={state.kitCablesC?.SKU != null && state.kitCablesC?.SKU !== '' ? 'configurador-accordion-header-disabled': ''}
          aria-controls="panel18d-content" 
          id="panel18d-header">
          <Typography>Kit de Cables</Typography>
          <Typography className="configurador-item-selected"> - {(state.kitCablesC === 'N/A') ? 'NO DESEO ESTE PRODUCTO' :  state.kitCablesC.modelo}</Typography>
        </AccordionSummary>
        <Box className="configurador-button-borrar">
          {(state.kitCablesC.length != 0) && 
          <>
            <VisibilityIcon
              className="viewIconConf"
              style={{ marginRight: '8px',marginLeft: '8px' }}
              onClick={() => showProduct(state.kitCablesC)}
            />
             <DeleteForever className = "trashCanConf" alt="close"  onClick={() => handleRemove('21','25')}  />
          </>
          }
        </Box>
      </Box>
      <AccordionDetails>
      {(expandKitCables || expanded === 'panel18') && (
        <ConfiguradorCategoria category="21" value={unDinHF} optional="true" carFeatures={caracteristicas}/>
      )}
      </AccordionDetails>
    </Accordion>

    {/*---------------------------------------------TERMINAR CONFIGURACION 2 / ECUALIZADOR--------------------------------------------------------*/}
    <Accordion 
      expanded={(expandEcualizador || expanded === 'panel18a')} 
      onChange={handleChange('panel18a')} 
      disabled = {
        (state.tieneEcualizador != 'si' &&
        state.kitCablesC.length === 0) || state.tieneAmplificadorBajos === 'no' || state.ecualizadorC.length != 0}>
        <Box className="configurador-accordionSummary">
      <AccordionSummary 
        className={state.ecualizadorC?.SKU != null && state.ecualizadorC?.SKU !== '' ? 'configurador-accordion-header-disabled': ''}
        aria-controls="panel18d-content" 
        id="panel18d-header">
        <Typography>Ecualizador</Typography><Typography className="configurador-item-selected"> - {(state.ecualizadorC === 'N/A') ? 'NO DESEO ESTE PRODUCTO' :  state.ecualizadorC.modelo}</Typography>
      </AccordionSummary>
      <Box className="configurador-button-borrar">
          {(state.ecualizadorC.length != 0) && 
          <>
            <VisibilityIcon
              className="viewIconConf"
              style={{ marginRight: '8px',marginLeft: '8px' }}
              onClick={() => showProduct(state.ecualizadorC)}
            />
            <DeleteForever className = "trashCanConf" alt="close"  onClick={() => handleRemove('18','20')}  />
          </>
          }
          </Box>
        </Box>
      <AccordionDetails>
        {
            (!state.tieneEcualizador || state.tieneEcualizador.length === 0)
            ? 
              <Stack alignItems="center" direction="column" sx={{marginTop:"10px"}}>
                <Typography>¿Que deseas hacer?</Typography>
                <Button variant="contained" onClick={() => handleTieneEcualizador('no')} className="configurador_sino_button">Terminar configuración</Button>
                <Button variant="contained" onClick={() => handleTieneEcualizador('si')} className="configurador_sino_button">Seleccionar Ecualizador</Button>
              </Stack>
            :
              ((state.tieneEcualizador === 'si') && (expandEcualizador || expanded === 'panel18a'))
              &&
              <ConfiguradorCategoria category="18" value={unDinHF} optional="true" carFeatures={caracteristicas}/>
          }
      </AccordionDetails>
    </Accordion>
  {/*------------------------------------------------------EPICENTRO --------------------------------------------------------------*/}
  <Accordion 
    expanded={(expandEpicentro || expanded === 'panel19')} 
    onChange={handleChange('panel19')} 
    disabled = {state.ecualizadorC.length === 0 || state.epicentroC.length != 0}>
      <Box className="configurador-accordionSummary">
        <AccordionSummary 
          className={state.epicentroC?.SKU != null && state.epicentroC?.SKU !== '' ? 'configurador-accordion-header-disabled': ''}
          aria-controls="panel19d-content" 
          id="panel19d-header">
          <Typography>Epicentro</Typography>
          <Typography className="configurador-item-selected"> - {(state.epicentroC === 'N/A') ? 'NO DESEO ESTE PRODUCTO' :  state.epicentroC.modelo}</Typography>
        </AccordionSummary>
        <Box className="configurador-button-borrar">
          {(state.epicentroC.length != 0) && 
          <>
            <VisibilityIcon
              className="viewIconConf"
              style={{ marginRight: '8px',marginLeft: '8px' }}
              onClick={() => showProduct(state.epicentroC)}
            />
            <DeleteForever className = "trashCanConf" alt="close"  onClick={() => handleRemove('19','23')}  />
          </>
          }
        </Box>
      </Box>
      <AccordionDetails>
      {(expandEpicentro || expanded === 'panel19') && (
        <ConfiguradorCategoria category="19" value={unDinHF} optional="true" carFeatures={caracteristicas}/>
      )}
      </AccordionDetails>
    </Accordion>
    {/*------------------------------------------------------PROCESADOR --------------------------------------------------------------*/}
    <Accordion 
      expanded={(expandProcesador || expanded === 'panel20')} 
      onChange={handleChange('panel20')} 
      disabled = {state.epicentroC.length === 0 || state.procesadorC.length != 0}>
      <Box className="configurador-accordionSummary">
        <AccordionSummary 
          className={state.procesadorC?.SKU != null && state.procesadorC?.SKU !== '' ? 'configurador-accordion-header-disabled': ''}
          aria-controls="panel20d-content" 
          id="panel20d-header">
          <Typography>Procesador</Typography>
          <Typography className="configurador-item-selected"> - {(state.procesadorC === 'N/A') ? 'NO DESEO ESTE PRODUCTO' :  state.procesadorC.modelo}</Typography>
        </AccordionSummary>
        <Box className="configurador-button-borrar">
          {(state.procesadorC.length != 0) && 
          <>
            <VisibilityIcon
              className="viewIconConf"
              style={{ marginRight: '8px',marginLeft: '8px' }}
              onClick={() => showProduct(state.procesadorC)}
            />
            <DeleteForever className = "trashCanConf" alt="close"  onClick={() => handleRemove('23','24')}  />
          </>
          }
        </Box>
      </Box>
      <AccordionDetails>
      {(expandProcesador || expanded === 'panel20') && (
          <ConfiguradorCategoria category="23" value={unDinHF} optional="true" carFeatures={caracteristicas}/>
      )}
      </AccordionDetails>
    </Accordion>
    {/*------------------------------------------------------TWEETERS --------------------------------------------------------------*/}
    <Accordion 
      expanded={(expandTweeters || expanded === 'panel21')} 
      onChange={handleChange('panel21')} 
      disabled = {state.procesadorC.length === 0 || state.tweeterC.length != 0}>
      <Box className="configurador-accordionSummary">
        <AccordionSummary 
          className={state.tweeterC?.SKU != null && state.tweeterC?.SKU !== '' ? 'configurador-accordion-header-disabled': ''} 
          aria-controls="panel21d-content" 
          id="panel21d-header">
          <Typography>Tweeter</Typography>
          <Typography className="configurador-item-selected"> - {(state.tweeterC === 'N/A') ? 'NO DESEO ESTE PRODUCTO' :  state.tweeterC.modelo}</Typography>
        </AccordionSummary>
        <Box className="configurador-button-borrar">
          {(state.tweeterC.length != 0) && 
          <>
            <VisibilityIcon
              className="viewIconConf"
              style={{ marginRight: '8px',marginLeft: '8px' }}
              onClick={() => showProduct(state.tweeterC)}
            />
            <DeleteForever className = "trashCanConf" alt="close"  onClick={() => handleRemove('25','19')}  />
          </>
          }
        </Box>
      </Box>
      <AccordionDetails>
      {(expandTweeters || expanded === 'panel21') && (
        <ConfiguradorCategoria category="25" config="Modelo" value={unDinHF} optional="true" carFeatures={caracteristicas}/>
      )}
      </AccordionDetails>
    </Accordion>
    {/*------------------------------------------------------ACCESORIOS --------------------------------------------------------------*/}
    <Accordion 
      expanded={(expandAccesorios || expanded === 'panel22')} 
      onChange={handleChange('panel22')} 
      disabled = {
        !((state.tweeterC.SKU != undefined || state.tweeterC === 'N/A') || ((state.kitCablesC.SKU != undefined || state.kitCablesC === 'N/A') && state.amplificador3en1C.SKU != undefined)) || state.accesorioC.length != 0}>
        <Box className="configurador-accordionSummary">
          <AccordionSummary 
            className={state.accesorioC?.SKU != null && state.accesorioC?.SKU !== '' ? 'configurador-accordion-header-disabled': ''} 
            aria-controls="panel21d-content" 
            id="panel21d-header">
            <Typography>Accesorios</Typography>
            <Typography className="configurador-item-selected"> - {(state.accesorioC === 'N/A') ? 'NO DESEO ESTE PRODUCTO' :  state.accesorioC.modelo}</Typography>
          </AccordionSummary>
          <Box className="configurador-button-borrar">
            {(state.accesorioC.length != 0) && 
            <>
              <VisibilityIcon
                className="viewIconConf"
                style={{ marginRight: '8px',marginLeft: '8px' }}
                onClick={() => showProduct(state.accesorioC)}
              />
              <DeleteForever className = "trashCanConf" alt="close"  onClick={() => handleRemove('1','26')}  />
            </>
            }
          </Box>
        </Box>
        <AccordionDetails>
        {(expandAccesorios || expanded === 'panel22') && (
          <ConfiguradorCategoria category="1"  value={unDinHF} optional="true" carFeatures={caracteristicas}/>
        )}
        </AccordionDetails>
    </Accordion>


        </Stack>
        <Box>
          <ProductCartConf/>
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
                )? 'primary-basic-full' : 'primary-basic-full_disabled' }>
                  Siguiente paso
            </Button>
          </Box>
        </Box>
      </Box>
      
    </Box>
    }
    
        <ProductDetail/>
        
    </React.Fragment>
  );
}
export default Configurador4;