import { Alert, Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, Stack, Step, StepLabel, Stepper, Typography } from "@mui/material";
import './Configurador1.scss';
import React, { useState, useEffect, useRef, useContext } from "react";
import useGet7 from '@hooks/useGet7';
import AppContext from '@context/AppContext';
import usePost2V from '@hooks/usePost2V';
import useDelete2V from '@hooks/useDelete2V';
import usePut2V from '@hooks/usePut2V'; 
import { useNavigate } from "react-router-dom";
import GradientCircularProgress from "./GradientCircularProgress";
const steps = ['Selecciona Modelo', 'Tipo de Configuración', 'Número de Dines', 'Configurador','Detalles Envio','Envio'];

const Configurador1 = () => {
   const [localLoading, setLocalLoading] = useState(true); 
  const { 
    state,
    refreshState,
    removeFromCartConf,
    fetchOrderData,
    loadingLoging,
  setLoadingLoging} = useContext(AppContext);  
  
  /*useEffect(() => {
    const init = async () => {
      await refreshState();
      setLocalLoading(false);
    };
    init();
  }, []);*/
  useEffect(() => {
    setLoadingLoging(true);
    refreshState();
  }, []);


   // Wait 0.5 seconds before hiding loading spinner
  useEffect(() => {
    if (!loadingLoging) {
      const timer = setTimeout(() => setLocalLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [loadingLoging]);



  const navigate = useNavigate();
  const API = process.env.REACT_APP_API_URL;
  const APIMARCAS =  API+'configurador/marcas/?offset=0&limit=30';
  const APIMODELOS = API+'configurador/modelos/?offset=0&limit=300';
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [marca, setMarca] = useState('');
  const [marcas,setMarcas] = useState([]);
  const [modelo,setModelo] = useState('');
  const [modelos,setModelos] = useState([]);
  const [anio,setAnio] = useState([]); 
  const [age3, setAge3] = useState(''); 
  const [modelosAnios,setModelosAnios] = useState([]);
  //Errores
  const [errorMarca, setErrorMarca] = useState(false);
  const [errorModelo, setErrorModelo] = useState(false);
  const [errorAnio, setErrorAnio] = useState(false);
  //===== Carga las Marcas ======================================================================
  const { data: marcasFetchData, error:errorMa } = useGet7(APIMARCAS);
  useEffect(() => {
      if(errorMa){
          setSuccess(false);
          setErrMsg("Ocurrio un error al cargar el configurador");
      }
      if (Array.isArray(marcasFetchData.marcas) && marcasFetchData.marcas.length > 0) {
        setMarcas(marcasFetchData.marcas);
      }  
  }, [marcasFetchData,errorMa]);
 //===== Handle Marca ================================================================
  const handleMarca = async (event) => {
    setModelo('');
    setAnio('');
    setAge3('')
    setMarca(event.target.value);
    try {
      const response = await fetch(`${APIMODELOS}&marca=${event.target.value}`); 
      //const response = await fetch(APIMODELOS);
      if (response.status === 404) {
          setModelos([]);
      } else {
        const data = await response.json();
        const modelos = data.modelos;
        setModelosAnios(modelos); //Aqui vamos a traer los del año
        //QUITAMOS LOS DUPLICADOS
        if (Array.isArray(modelos)) {
          const dt = [...new Set(modelos.map(item => item.modelo))];
          setModelos(dt);
        } 
      } 
    }
    catch (error) {
        console.error('Error fetching models:', error);
    }
  };
//===== Handle Modelo ================================================================
const handleModelo = (event) =>{  //Para los años hay que volver a filtrar los modelos pero ahora por modelo
  setModelo(event.target.value);
  const data = modelosAnios.filter(x => x.modelo === event.target.value);
  const dt = [...new Set(data.map(item => item.Anio))]; // [ 'A', 'B']
  setAnio(dt);
}
//===== Handle Anio ================================================================
const handleAnio = (event) => {
  setAge3(event.target.value);
};
//==================================================================================
//===== Submit ======================================================================
const handleSubmit = async (event) => {
  event.preventDefault();
  if (!marca) { setErrorMarca(true); } else { setErrorMarca(false); }
  if (!modelo) { setErrorModelo(true); } else { setErrorModelo(false); }
  if (!age3) { setErrorAnio(true); } else { setErrorAnio(false); }
  if (!marca || !modelo || !age3) {
      return;
  }
  //Verificar si existe una orden de configurador de el usuario, si es asi resetearla, de lo contrrario crear una nueva
  //SI NO EXISTE ORDEN CREAMOS LA ORDEN ACTIVA CON ESTOS DATOS
  try {  
    const activeOrderId =  await verifyActiveCart(); //Verificamos orden activa de configurador y monto 
    if (activeOrderId) {
      //AQUI BORRAREMOS LOS ARTICULOS Y actualizaremos LA NUEVA CONFIGURACION
      const deletedSuccess = await deleteAllItems(activeOrderId); //bd
      if(!deletedSuccess){
        console.error("No se pudo actualizar la orden");
        return;
      }
      removeFromCartConf('nuevo'); 
      const dataConfCaracteristicas = createConfiguradorData();
      const updatedConfiguradorResponse = await updateConfigurador(dataConfCaracteristicas,activeOrderId);
      
      if(updatedConfiguradorResponse){
        alert("Configuracion actualizada con exito");  
        const dataPost = {
          marca: marca,       // configurador1
          modelo: modelo,     // configurador1
          anio: age3,         // configurador1
          tipoConfiguracionC: "" // configurador1
        };        
        //setConfigurador(dataPost);  //Hay que mandarlo al estado y al localStorage?
        navigate("/configurador2");
      }       
    }
    else { 
      const newOrderId = await createNewOrder();
      if (newOrderId) {
        //console.log("Se creo la nueva orden del configurador:"+newOrderId);
        navigate("/configurador2");
      }
    }
  } catch (error) {
    setErrorMessage("Error al generar la orden. code:002");
    console.log("Error al generar la orden. code:002");
    console.log(error);
  }
}
//HELPER FUNCTIONS=============================================================
//VERIFICA SI HAY UNA ORDEN ACTIVA
const verifyActiveCart = async () =>{
  const APICart = `${API}ordenesUsuario/V2/get?offset=0&limit=1&status=activo&orderType=configurador`; 
  const response = await fetch(APICart, {
    headers: {
      'Authorization': `Bearer ${state.token}`,  
      'Content-Type': 'application/json',
    },
  });
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) throw new Error("Error fetching detalle venta");
  const orden = await response.json();
  if (orden && orden.orders && orden.orders.length > 0 && orden.orders[0].id) {
    return orden.orders[0].id;
  } else {
    return null;
  }
}
//CREA NUEVA ORDEN
const createNewOrder = async () => {
  const ordenVentaData = {
    //clienteId: state.userId,
    clienteId: state.clienteId,
    orderType: "configurador",
    status: "activo",
    marca: marca,
    modelo: modelo,
    anio: age3
  };
  const APIPost = API + 'ordenesUsuario/';
  const { success, data, error } = await usePost2V(APIPost, ordenVentaData, state.token);
  if (!success) {
    setErrMsg(error || "Error occurred while creating a new order");
    return null;
  }
  return data.id;
};
const deleteAllItems = async (orderId) => {
  const APIDeleteAll2 = API+'ordenesUsuario/delete-all-items/'+orderId;
  const { success: successDelete, error: errorDelete } = await useDelete2V(APIDeleteAll2, state.token); 
  if (successDelete) {
    return true;
  }
  else {
    return false;
  }
};
const createConfiguradorData = () => ({
  orderType: 'configurador',
  status: 'activo',
  marca: marca,
  modelo: modelo,
  anio:  age3,
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
});
const updateConfigurador = async (ordenVentaData,ordenVentaId) => {
  const APIPut = API + "ordenesUsuario/" + ordenVentaId;
  const { success, data, error } = await usePut2V(APIPut, ordenVentaData, state.token); 
  if (!success) throw new Error(error || "Error occurred during the request");
  return success;
};
const handleSubmitModificar = (event) => {
  event.preventDefault();
  navigate("/Configurador4");
}
 

  if (loadingLoging || localLoading) {
    return (
      <Box className="Loading_Container">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <React.Fragment>
    {
    /*(loading && state.userName === 'Invitado') ? 
      (
      <Box className="Loading_Container">
        <CircularProgress />
      </Box>
      ) : */
    (state.userName === 'Invitado') ? 
      (
      <Box className="verify_Container">
        <Typography variant="h6">Favor de Iniciar Sesión.</Typography>
        <Typography variant="body1" className="NewAccountSignIn">
          <a href="/Login">Iniciar Sesión / Registrarse</a>
        </Typography>
      </Box>
      ) : 
      (
      <Box className="Configurador_Container">
        <Box className="hero-image"></Box>  
        <Stepper activeStep={0} alternativeLabel 
          sx={{
            display: { xs: 'flex', flexWrap:'wrap' },
            mt: { xs: "3rem", sm: "3rem" }, 
            mb: "1rem",
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
        <form action="/" className="Configurador_Form2">
          <Stack alignItems="center" spacing={2} direction="column" className="configurador1_stack"  > 
            <Typography className = "configurador1_titulo"  variant="h6">Configura el mejor equipo de audio para tu <Typography sx={{fontWeight: 600, color: "var(--blueConfigurador3)"}} variant="h7">Vehiculo</Typography></Typography> 
             { 
              (
                (state.estereoC.id_item != undefined || state.estereoC.id != undefined || state.orderType == 'openshow')? //Si tiene almenos un estereo puede editar la configuracion
                (<Box><Alert severity="warning">Tienes una configuracion pendiente</Alert></Box>) :
                ('')
              )
                
            }
            <FormControl  error={errorMarca} className="configurador_formControl"  size="small" >
              <InputLabel  id="ddl-marca-label"  sx={{paddingLeft:"10px"}}>Marca</InputLabel>
              <Select
                sx={{paddingLeft:"10px"}}
                labelId="ddl-marca-label"
                id="ddl-marca-select"
                name="ddl-marca-select"
                value={marca}
                label="Marca"
                onChange={handleMarca}
              >
              {
                marcas.map((marca,index) =>{
                    return (
                        <MenuItem key={index} value={marca.marca}>{marca.marca}</MenuItem>
                    )
                })
              }                
              </Select>
            </FormControl>
            <FormControl error={errorModelo} className="configurador_formControl" size="small">
              <InputLabel id="ddl-modelo-label" sx={{paddingLeft:"10px"}}>Modelo</InputLabel>
              <Select
                sx={{paddingLeft:"10px"}}
                labelId="ddl-modelo-label"
                id="ddl-modelo-select"
                name="ddl-modelo-select"
                value={modelo}
                label="Modelo"
                onChange={handleModelo}
                >
                {
                modelos.map((mod,index) =>{
                    return (
                        <MenuItem key={index} value={mod}>{mod}</MenuItem>
                    )
                })
              }
              </Select>
            </FormControl>
            <FormControl error={errorAnio} className="configurador_formControl" size="small">
              <InputLabel id="ddl-anio-label" sx={{paddingLeft:"10px"}}>Año</InputLabel>
              <Select
                sx={{paddingLeft:"10px"}}
                labelId="ddl-anio-label"
                id="ddl-anio-select"
                name="ddl-anio-select"
                value={age3}
                label="Año"
                onChange={handleAnio}
              >
              {
                anio && anio !== undefined ?
                anio.map((yea,index) =>{
                    return (
                        <MenuItem key={index} value={yea}>{yea}</MenuItem>
                    )
                })
                : "No hay Año"
              }
              </Select>
            </FormControl>
            <Box className="BotonesContainer">
            {
              //Si tiene almenos un estereo puede editar la configuracion
              //
            (
              (state.estereoC.id_item != undefined || state.estereoC.id != undefined || state.orderType == 'openshow' || state.adaptadorImpedanciaC.id != undefined || state.adaptadorImpedanciaC.id_item != undefined))? //
                (
                  <Box sx={{display: 'flex', alignItems: 'center', gap:'1rem', justifyContent: 'center', width: '90%', flexWrap: 'wrap'}}>
                    <Button variant="contained" onClick={handleSubmit} className="NextStepButton2" >Nueva Configuración</Button> 
                    <Button variant="contained" onClick={handleSubmitModificar} className="NextStepButton2Bright" >Modificar Configuración</Button> 
                  </Box>
                    ) :
                (
                  <Button variant="contained" onClick={handleSubmit} className="NextStepButton2" >Nueva Configuración</Button> 
                
              )
            }
            </Box>
          </Stack>
        </form>
      </Box>
    )}
  </React.Fragment> 
  )
}
export default Configurador1;