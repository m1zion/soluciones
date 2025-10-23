import React , {useContext, useRef, useEffect, useState}from "react";
import { Stack, FormControl, Typography, Box, TextField, InputLabel, Select, MenuItem, Button, Step, StepLabel, Stepper} from "@mui/material";
import ProductCart from "./containers/ProductCart";
import './CheckOutCart2.scss';
import './FacturacionForm.scss';
import ProductCartConf from "./containers/ProductCartConf";
import './CheckOutCart3.scss';
import AppContext from '@context/AppContext';
import usePut2V from '@hooks/usePut2V';
import { useNavigate } from "react-router-dom";
var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'MXN',
});
const API = process.env.REACT_APP_API_URL;
const steps = ['Selecciona Modelo', 'Tipo de Configuración', 'Número de Dines', 'Configurador','Detalles Envio','Envio'];
//==================================================================Checkout form=======
const CheckOutCart = () => {
  const { state,fetchOrderData,refreshState,removeFromCartConf} = useContext(AppContext);
  const [loadingLocal,setLoadingLocal] = useState(false);
  const navigate = useNavigate();
  const estadosMexicanos = [
    "Aguascalientes","Baja California","Baja California Sur",
    "Campeche","Coahuila","Colima",
    "Chiapas","Chihuahua","Ciudad de México",
    "Durango","Guanajuato","Guerrero",
    "Hidalgo","Jalisco","Estado de México",
    "Michoacán","Morelos","Nayarit",
    "Nuevo León","Oaxaca","Puebla",
    "Querétaro","Quintana Roo","San Luis Potosí",
    "Sinaloa","Sonora","Tabasco",
    "Tamaulipas","Tlaxcala","Veracruz",
    "Yucatán","Zacatecas"];

  const [nombre, setNombre] = useState('');
  const [errorNombre, setErrorNombre] = useState(false);
  const [msgNombre, setMsgNombre] = useState('Nombre');

  const [telefono, setTelefono] = useState('');
  const [errorTelefono, setErrorTelefono] = useState(false);
  const [msgTelefono, setMsgTelefono] = useState('Teléfono');

  const [calle, setCalle] = useState('');
  const [errorCalle, setErrorCalle] = useState(false);
  const [msgCalle, setMsgCalle] = useState('Calle');

  const [numeroExterior, setNumeroExterior] = useState('');
  const [errorNumeroExterior, setErrorNumeroExterior] = useState(false);
  const [msgNumeroExterior, setMsgNumeroExterior] = useState('Número exterior');

  const [numeroInterior, setNumeroInterior] = useState('');
  const [errorNumeroInterior, setErrorNumeroInterior] = useState(false);

  const [cp, setCp] = useState('');
  const [errorCp, setErrorCp] = useState(false);
  const [msgCp, setMsgCp] = useState('Código postal');

  const [estado, setEstado] = useState('');
  const [errorEstado, setErrorEstado] = useState(false);
  const [msgEstado, setMsgEstado] = useState('Estado');
  const handleChange = (event) => {
    setEstado(event.target.value);
  };

  const [ciudad, setCiudad] = useState('');
  const [errorCiudad, setErrorCiudad] = useState(false);
  const [msgCiudad, setMsgCiudad] = useState('Ciudad');

  const  dataLogin = {
    token: state.token
  }
  //Puedo usar cualquiera de estas dos dunciones par cargar el estado Esto cargaria el carrito al state
 /* useEffect(() => {
    console.log("Se ejecuta fetchOrderData");
    fetchOrderData(dataLogin);
  }, [state.token]); */
  useEffect(() => {
      refreshState();
  }, []);
  const handleSubmit = () => {
    setLoadingLocal(true);
    setErrorNombre(false); setMsgNombre("Nombre");
    setErrorTelefono(false); setMsgTelefono("Teléfono");
    setErrorCalle(false); setMsgCalle("Calle");
    setErrorNumeroExterior(false); setMsgNumeroExterior("Número exterior");
    setErrorCp(false); setMsgCp("Código postal");
    setErrorEstado(false); setMsgEstado("Estado");
    setErrorCiudad(false); setMsgCiudad("Ciudad");

    const validations = {nombre: { value: nombre, setError: setErrorNombre, condition: !nombre || nombre.length < 3 },
      telefono: { value: telefono, setError: setErrorTelefono, condition: !telefono || telefono.length !== 10  },
      calle: { value: calle, setError: setErrorCalle, condition: !calle },
      numeroExterior: { value: numeroExterior, setError: setErrorNumeroExterior, condition: !numeroExterior },
      cp: { value: cp, setError: setErrorCp, condition: !cp || cp.length !== 5 },
      estado: { value: estado, setError: setErrorEstado, condition: !estado },
      ciudad: { value: ciudad, setError: setErrorCiudad, condition: !ciudad  }
    };
    let hasErrors = false;
    for (const [field, { value, setError, condition }] of Object.entries(validations)) {
      if (condition) {
        //setError(true);
        hasErrors = true;  
        if (field === 'nombre') { setMsgNombre(nombre ? "Mínimo 3 caracteres" : "Nombre requerido"); setError(true); }
        if (field === 'telefono') { setMsgTelefono("Teléfono (10 dígitos)"); setError(true);}
        if (field === 'calle') { setMsgCalle("Calle requerida"); setError(true);}
        if (field === 'numeroExterior') { setMsgNumeroExterior("Número exterior requerido"); setError(true);}
        if (field === 'cp') { setMsgCp(cp ? "Debe tener 5 caracteres" : "Código postal requerido"); setError(true);}
        if (field === 'estado') { setMsgEstado("Estado requerido"); setError(true);}
        if (field === 'ciudad') { setMsgCiudad("Ciudad requerida"); setError(true);}
      } else {
        setError(false);
        if (field === 'nombre') setMsgNombre("Nombre");
        if (field === 'telefono') setMsgTelefono("Teléfono");
        if (field === 'calle') setMsgCalle("Calle");
        if (field === 'numeroExterior') setMsgNumeroExterior("Número exterior");
        if (field === 'cp') setMsgCp("Código postal");
        if (field === 'estado') setMsgEstado("Estado");
        if (field === 'ciudad') setMsgCiudad("Ciudad");
      }
    }
    if (hasErrors) return;
    const APIconfCaracteristicas = API+'orders/'+ state.confOrderId;
    let data = {
      orderType: 'configurador',
      status: 'esperando surtido',
      calle,
      numExterior: numeroExterior,
      numInterior: numeroInterior ? numeroInterior : '-',
      codigoPostal: cp,
      pais: "Mexico",
      estado,
      ciudad,
      telefono,
      nombreCompleto: nombre
    }   
    try {
      usePut2V(APIconfCaracteristicas,data, state.token); //Actualiza los items API
      //Borramos todos los items del state
      removeFromCartConf('nuevo');
      navigate("/CheckOutCart4");    
    } catch (error) {
      console.error("Error al generar la orden. code:002");
      console.error(error);
    } finally {
      setLoadingLocal(false);  // Ensure loading state is reset
    }
  }

  //==================================FUNCIONES PARA TRAER EL CARRITO==================================
	const form = useRef(null);
  if (state.totalCompra <= 0){
    return(
      <Box className="CheckOutCart2Container">
        <Stack spacing={2} sx={{pt:'1rem', pb:'2rem',pl:'1rem'}} className="CheckOutCart2Form" direction = {{xs:"column", md:"column"}}>              
          <Typography variant="h5" >Tu configuración aún no está completa</Typography>              
          <Typography>Puedes continuar comprando en el configurador.</Typography>              
        </Stack>
      </Box>
    );
  }
	return (
    <Box>
      <Stepper activeStep={4} alternativeLabel 
      sx={{
        display: { xs: 'flex', flexWrap:'wrap' },
        mt: "7rem",
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
      <Box className="CheckOutCont">             
        <Box className="CheckOutCart2FormCont">                    
          <Box className="CheckOutCart2Form" >
            <Typography className="ProductCartTitle"  sx={{pt:"10px",mb:"1rem", mt:".5rem"}} variant="h6">Completa tu orden</Typography>
            <Stack spacing={2} direction = {{xs:"column", md:"column"}}>              
                  <TextField className="InputBasic2"
                  error={errorNombre}
                  required
                  id="outlined-basic" 
                  label={msgNombre} 
                  size="small"
                  name="nombre"
                  value={nombre}
                  onChange={e=>setNombre(e.target.value)}
                  inputProps={{maxLength:100 }}
                >
                </TextField> 
                <TextField className="InputBasic2"
                  error={errorTelefono}
                  required
                  id="outlined-basic" 
                  label="Telefono" 
                  size="small"
                  name="telefono"
                  value={telefono}
                  onChange={e=>setTelefono(e.target.value)}
                  inputProps={{maxLength:10 }}
                  >
                </TextField>
                <TextField className="InputBasic2"
                  error={errorCalle}
                  required
                  id="outlined-basic" 
                  label="Calle" 
                  size="small"
                  name="calle"
                  value={calle}
                  onChange={e=>setCalle(e.target.value)}
                  inputProps={{maxLength:100 }}>
                </TextField>
                <Stack spacing={2} direction="row"                 
                      sx={{
                      width: '100%',
                      }}>
                  <TextField className="InputBasic2"
                      error={errorNumeroExterior}
                      required
                      id="outlined-basic" 
                      label="No. Exterior" 
                      size="small"
                      name="numeroExterior"
                      value={numeroExterior}
                      onChange={e=>setNumeroExterior(e.target.value)}
                      inputProps={{maxLength:10 }}>
                  </TextField>
                  <TextField className="InputBasic2"
                      id="outlined-basic" 
                      label="No. Interior" 
                      size="small"
                      name="numeroInterior"
                      value={numeroInterior}
                      onChange={e=>setNumeroInterior(e.target.value)}
                      inputProps={{maxLength:6 }}>
                  </TextField>
                </Stack>
                <TextField className="InputBasic2"
                  error={errorCp}
                  required
                  id="outlined-basic" 
                  label="C.P." 
                  size="small"
                  name="cp"
                  type="text"     
                  value={cp}
                  onChange={e=>setCp(e.target.value)}    
                  inputProps={{maxLength:5}}               
                  >
                </TextField>
                <FormControl  error={errorEstado}  className="input_select2" size="small">
                      <InputLabel required id="ddl-estado-label">Estado</InputLabel>
                      <Select   
                      labelId="ddl-estado-label"
                      id="ddl-estado-select"
                      name="estado"
                      label="Estado"
                      value={estado}
                      onChange={handleChange}
                      >
                      {      
                      estadosMexicanos && estadosMexicanos !== undefined ?      
                        estadosMexicanos.map((estadoMexicano,index) =>{
                            return (
                                <MenuItem key={index} value={estadoMexicano}>{estadoMexicano}</MenuItem>
                            )
                        })
                        :''                   
                      }
                      </Select>
                </FormControl>
                <TextField className="InputBasic2"
                  error={errorCiudad}
                  required
                  id="outlined-basic" 
                  label="Ciudad" 
                  size="small"
                  name="ciudad"
                  value={ciudad}
                  onChange={e=>setCiudad(e.target.value)}   
                  inputProps={{maxLength:100 }}>
                </TextField> 
                <Box sx={{width:'100%', display: 'flex', alignItems: 'center', justifyContent: 'center', pb: '1rem'}}>
                  <Button onClick={() => handleSubmit()}  variant="contained" className="primary-basic-full" >Enviar Orden</Button>
                </Box>                                              
              </Stack>
            </Box>
          </Box> 
          <Box>
              {Array.isArray(state.cart) && state.cart.length > 0 && <ProductCart />}
              <Box sx={{height:'10px'}}></Box>          
              <ProductCartConf editVisible={true}/>
              <Box className="total_compra">
                <Typography >Total de la Compra:</Typography> 
                <Typography  className="total_config">{formatter.format(state.totalCompra)}</Typography>
              </Box>
          </Box>
      </Box>
    </Box>
	);
}
export default CheckOutCart;

