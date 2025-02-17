import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from "@mui/material";
import '@styles/configurador1.scss';
import React, { useState, useEffect, useRef, useContext } from "react";
import useGet7 from '@hooks/useGet7';
import { useNavigate } from "react-router-dom";
const Configurador1 = () => {
  const { state,fetchOrderData } = useContext(AppContext);
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
  const { data: marcasFetchData, loading: loadingMa, error:errorMa } = useGet7(APIMARCAS);
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
  console.log(data);
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
      console.log("Orden Activa"+activeOrderId);
      /*const deletedSuccess = await deleteAllItems(activeOrderId);
      if(!deletedSuccess){
        console.error("No se pudo actualizar la orden");
        return;
      }
      const dataConfCaracteristicas = createConfiguradorData();
      const updatedConfiguradorResponse = await updateConfigurador(dataConfCaracteristicas,activeOrderId);
      if(updatedConfiguradorResponse){
        alert("Configuracion actualizada con exito");            
        //setConfigurador(dataPost);  //Hay que mandarlo al estado y al localStorage?
        navigate("/configurador2");
      }  */        
    }
    else { 
      console.log("Creamos la nueva order");
     /* const newOrderId = await createNewOrder();
      if (newOrderId) {
        console.log("Se creo la nueva orden del configurador:"+newOrderId);
      }*/
      //CREAMOS LA ORDEN NUEVA
    }
  } catch (error) {
    setErrorMessage("Error al generar la orden. code:002");
    console.log("Error al generar la orden. code:002");
    console.log(error);
  }
}
//HELPER FUNCTIONS=============================================================
const verifyActiveCart = async () =>{
  const APICart = `${API}ordenesUsuario/V2/get?offset=0&limit=1&status=activo&orderType=configurador`; 
  console.log('APICart');
  console.log(APICart);
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

  return (
    <Box className="Configurador_Container">
      <Box className="hero-image">
      </Box>      
      <form action="/" className="Configurador_Form2">
        <Stack alignItems="center" spacing={2} direction="column" className="configurador1_stack"  > 
          <Typography className = "configurador1_titulo"  variant="h6">Configura el mejor equipo de audio para tu <Typography sx={{fontWeight: 600, color: "var(--blueConfigurador3)"}} variant="h7">Vehiculo</Typography></Typography> 
             { /*
              (
                (state.estereoC.id_item != undefined || state.estereoC.id != undefined || state.orderType == 'openshow')? //Si tiene almenos un estereo puede editar la configuracion
                (<Box><Alert severity="warning">Tienes una configuracion pendiente</Alert></Box>) :
                ('')
              )
                */
            }
                <FormControl  error={errorMarca} className="configurador_formControl"  size="small" variant="standard">
                    <InputLabel  id="ddl-marca-label"  sx={{paddingLeft:"10px"}}>Marca</InputLabel>
                    <Select
                    sx={{paddingLeft:"10px"}}
                    disableUnderline
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
                <FormControl error={errorModelo} className="configurador_formControl" size="small" variant="standard">
                    <InputLabel id="ddl-modelo-label" sx={{paddingLeft:"10px"}}>Modelo</InputLabel>
                    <Select
                    sx={{paddingLeft:"10px"}}
                    disableUnderline
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
                <FormControl error={errorAnio} className="configurador_formControl" size="small" variant="standard">
                    <InputLabel id="ddl-anio-label" sx={{paddingLeft:"10px"}}>Año</InputLabel>
                    <Select
                    sx={{paddingLeft:"10px"}}
                    disableUnderline
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
                  //state.estereoC.id_item != undefined || state.estereoC.id != undefined || state.orderType == 'openshow'
                (
                  (1 == 2))? //
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
  )
}
export default Configurador1;