//m2134256161 
import React, {useRef, useState, useEffect, useContext, useLayoutEffect, useMemo} from "react";
import { Typography, Stack, Button, Stepper, Step, StepLabel } from "@mui/material";
import { Box, sizeHeight } from "@mui/system";
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import useDelete from '@hooks/useDelete';
import { styled } from '@mui/material/styles';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import useDeleteOrderItem from '@hooks/useDeleteOrderItem';
import './Configurador1.scss';
import '@styles/ProductList.scss';
import usePut from '@hooks/usePut';
import AppContext from '@context/AppContext';
import ProductCartConf from "./containers/ProductCartConf";
import { useNavigate } from 'react-router-dom';
import GradientCircularProgress from "./GradientCircularProgress";
import ConfiguradorCategoria from "./containers/ConfiguradorCategoria";
import DeleteIcon from '@mui/icons-material/Delete';
import { DeleteForever, DeleteOutline } from "@mui/icons-material";
import ProductDetail from './components/ProductDetail';
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
    removeFromCartConf,
    setProductToShow,
    openProductDetail,
  } = useContext(AppContext);
  const showProduct = (productDetail) => {
    openProductDetail();
    setProductToShow(productDetail);
  };  
  const API = process.env.REACT_APP_API_URL;
  const APIDelete = API+'orders/delete-item/';
  const APIDeleteAll = API+'orders/delete-all-items/';
  const navigate = useNavigate();
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [APIconfCaracteristicas,setAPIconfCaracteristicas] = useState('');
  const [loadingLocal,setLoadingLocal] = useState(false);
  const [caracteristicas,setCaracteristicas] = useState([]);
  const memoCarFeatures = useMemo(() => caracteristicas, [caracteristicas]);

  const [activarBotonWoofer,setActivarBotonWoofer] = useState(true)
  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/CheckOutCart");
  }
  useEffect(() => {
    if (!state.configuracion || !state.modeloC) return;
    console.log("Entra a useEffect 1");
    const fetchData = async () => {
        setLoadingLocal(true);
        if (state.configuracion) {
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
  }, [state.marcaC, state.modeloC, state.anioC, state.confOrderId]);
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

  var valor,valor2 = 'X';
  const [expanded, setExpanded] = React.useState('panel0');
  const handleChange = (panel) => (event, newExpanded) => {
    console.log('handleChange');
      setExpanded(newExpanded ? panel : false);
  };

  const expandEstereo =
    state.estereoC.SKU == undefined && //state.estereoC.length === 0 
    state.tieneEstereoOriginalC !== 'si' &&
    state.tieneEstereoTipoOriginalC != true;
  const expandBases = 
    state.estereoC.SKU != undefined && 
    state.baseC.length === 0;

  const handleRemove  = (categoryIdConfigurador,id_categoria) => {  
    let APIDeleteAll2 = "";
    APIDeleteAll2 = APIDeleteAll.concat(state.confOrderId);
    let dataConfCaracteristicas = {
      orderType: 'configurador',
      status: 'activo',
      marca: '',
      modelo: '',
      anio: '',      
    };
    let dataConfCaracteristicasTodo = {
      orderType: 'configurador',
      status: 'activo',
      tieneBocinaReemplazo: '',
      tieneBocinaOriginal: '',
      terminaConfiguracion1: '',    
    };
    alert("Se borraran todos los productos que seleccionaste despues!");
    let  data = {};
    removeFromCartConf(categoryIdConfigurador);
    let dataCaracteristicas1 = {
      orderType: 'configurador',
      status: 'activo',
      mejorarAudio: ''    
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
        }
      break;      
      case "20": //Estereos
        data = {orderId: state.confOrderId,categoryId: 1,categoryIdConfigurador: 20}; //Borro Estereos
        useDeleteOrderItem(APIDelete,data);
      case "20": case "8": //bases
        data = {orderId: state.confOrderId,categoryId: 13,categoryIdConfigurador: 8}; //Borro bases
        useDeleteOrderItem(APIDelete,data);   
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
    }
  }
/*
  useEffect(() => {
    console.log("mover el scroll");
    let targetId = null;

    if (expandEstereo || expanded === "accordion_estereo2") targetId = "accordion_estereo2";
    else if (expandBases || expanded === "accordion_base3") targetId = "accordion_base3";

    if (targetId) {
      // delay until after DOM updates
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          console.log("mueve el scroll 2", el);
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          el.focus?.();
        } else {
          console.log("no encontró el elemento todavía");
        }
      }, 1500); // 200ms is usually enough
    }
  }, [expandEstereo, expandBases, expanded]);*/

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
      <Box sx={{backgroundColor:'olive', width:'100%',height:'650px', color:'white'}}>
        A
      </Box>
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
                <Typography sx={{paddingLeft:"6px"}}>Tipo de Configuración: {state.tipoConfiguracionC} {state.dinesC}</Typography> 
            </Box>         
          </Box>  
          {
          //------------------------------------------------------ESTEREO--------------------------------------------------------------
          }                   
          <Accordion 
            id="accordion_estereo"
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
              <ConfiguradorCategoria  category="8"  value={valor} value2= {valor2} optional="false" carFeatures={memoCarFeatures}/>
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