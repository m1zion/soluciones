//m2134256161 
import React, {useRef, useState, useEffect, useContext} from "react";
import { Typography, Stack, Button, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { Box } from "@mui/system";
//import useDelete from '@hooks/useDelete';
//import useDeleteOrderItem from '@hooks/useDeleteOrderItem';
import '@styles/Configurador1.scss';
//import '@styles/ProductList.scss';
//import usePut from '@hooks/usePut';
import AppContext from '@context/AppContext';
//import ProductCartConf from "@containers/ProductCartConf";
import { useNavigate } from 'react-router-dom';
import CircularProgress from "@mui/material/CircularProgress";
import GradientCircularProgress from "./GradientCircularProgress";
import ConfiguradorCategoria from "./containers/ConfiguradorCategoria";

const Configurador4 = () => {
  const APIConf = API+'orders/9';
  const APICart = API+'orders/3';
  const { state,loading,error, setConfig,fetchOrderData } = useContext(AppContext);
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
  //console.log(state);
  const expandEstereo =
    state.estereoC.length === 0 &&
    state.tieneEstereoOriginalC !== 'si' &&
    state.tieneEstereoTipoOriginalC != true;

  const toggleAcordion = () => {
    setExpand((prev) => !prev);
  };
  //https://www.freakyjolly.com/react-material-ui-accordion-tabs-tutorial-with-example/  */
  //console.log(activeOrder);

  console.log("loading");
  console.log(loading);
  //console.log(state.configuracion);
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
            onChange={handleChange('panel1')} >
              <Box className="configurador-accordionSummary">
                <AccordionSummary 
                  className="configurador-accordion-header" 
                  aria-controls="panel1d-content" 
                  id="panel1d-header">
                    <Typography>Estereos</Typography><Typography className="configurador-item-selected"> - {state.estereoC.modelo} </Typography>  
                  </AccordionSummary>
                <Box className="configurador-button-borrar">
                {(state.estereoC.length != 0) ?
                  <img className = "trashCanConf" src={trash} alt="close"  onClick={() => handleRemove('20','1')} />:  ''
                }             
                </Box>
              </Box>
              <AccordionDetails>   
                {(expanded === 'panel1' || expandEstereo) && (     
                  <ConfiguradorCategoria category="20" value={valor} value2= {valor2} optional="false" carFeatures={caracteristicas}/>
                )}
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