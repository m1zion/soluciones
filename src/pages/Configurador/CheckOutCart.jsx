import React , {useContext, useRef, useEffect, useState}from "react";
import { Stack, FormControl, Typography, Box, TextField, InputLabel, Select, MenuItem, Button, Step, StepLabel, Stepper} from "@mui/material";
import ProductCart from "./containers/ProductCart";
import './CheckOutCart2.scss';
import './FacturacionForm.scss';
import ProductCartConf from "./containers/ProductCartConf";
import './CheckOutCart3.scss';
import AppContext from '@context/AppContext';
var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'MXN',
});
const API = process.env.REACT_APP_API_URL;
const steps = ['Selecciona Modelo', 'Tipo de Configuración', 'Número de Dines', 'Configurador','Detalles Envio','Envio'];
//==================================================================Checkout form=======
const CheckOutCart = () => {
  const { state,fetchOrderData,refreshState } = useContext(AppContext);
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
  const [estadoValue, setEstadoValue] = useState('');
  const handleChange = (event) => {
    setEstadoValue(event.target.value);
  };
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
  //==================================FUNCIONES PARA TRAER EL CARRITO==================================
	const form = useRef(null);
  if (state.totalCompra <= 0){
    return(
      <Box className="CheckOutCart2Container">
        <Stack spacing={2} sx={{pt:'1rem', pb:'2rem',pl:'1rem'}} className="CheckOutCart2Form" direction = {{xs:"column", md:"column"}}>              
          <Typography variant="h5" >Tu carrito se encuentra vacío</Typography>              
          <Typography>Puedes continuar comprando en el configurador o en la pagina principal</Typography>              
        </Stack>
      </Box>
    );
  }
	return (
    <Box>
      <Stepper activeStep={1} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

        <Box className="CheckOutCart2Container"> 
            
            <Box className="CheckOutCart2FormCont">                    
              <Box className="CheckOutCart2Form" >
                <Typography className="ProductCartTitle"  sx={{pt:"10px",mb:"1rem", mt:".5rem"}} variant="h6">Completa tu orden</Typography>
                <Stack spacing={2} direction = {{xs:"column", md:"column"}}>              
                    <TextField className="InputBasic2"
                    /*error={errorNombre}*/
                    required
                    id="outlined-basic" 
                    label="Nombre" 
                    size="small"
                    name="nombre"
                    slotProps={{
                      input: {
                        maxLength: 200
                      }
                    }}
                  >
                  </TextField> 
                  <TextField className="InputBasic2"
                    /*error={errorTelefono}*/
                    required
                    id="outlined-basic" 
                    label="Telefono" 
                    size="small"
                    name="telefono"
                    slotProps={{
                      input: {
                        maxLength: 200
                      }
                    }}
                    >
                  </TextField>
                  <TextField className="InputBasic2"
                    /*error={errorCalle}*/
                    required
                    id="outlined-basic" 
                    label="Calle" 
                    size="small"
                    name="calle"
                    slotProps={{
                      input: {
                        maxLength: 200
                      }
                    }}>
                  </TextField>
                  <Stack spacing={2} direction="row"                 
                        sx={{
                        width: '100%',
                        }}>
                    <TextField className="InputBasic2"
                        /*error={errorNumeroExterior}*/
                        required
                        id="outlined-basic" 
                        label="No. Exterior" 
                        size="small"
                        name="numeroExterior"
                        slotProps={{
                          input: {
                            maxLength: 200
                          }
                        }}>
                    </TextField>
                    <TextField className="InputBasic2"
                        id="outlined-basic" 
                        label="No. Interior" 
                        size="small"
                        name="numeroInterior"
                        slotProps={{
                          input: {
                            maxLength: 200
                          }
                        }}>
                    </TextField>
                  </Stack>
                  <TextField className="InputBasic2"
                    /*error={errorCp}*/
                    required
                    id="outlined-basic" 
                    label="C.P." 
                    size="small"
                    name="cp"
                    type="text"                
                    slotProps={{
                      input: {
                        maxLength: 200
                      }
                    }}               
                    >
                  </TextField>
                  <FormControl  /*error={errorEstado}*/  className="input_select2" size="small">
                        <InputLabel required id="ddl-estado-label">Estado</InputLabel>
                        <Select   
                        labelId="ddl-estado-label"
                        id="ddl-estado-select"
                        name="estado"
                        label="Estado"
                        value={estadoValue}
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
                    /*error={errorCiudad}*/
                    required
                    id="outlined-basic" 
                    label="Ciudad" 
                    size="small"
                    name="ciudad"
                    slotProps={{
                      input: {
                        maxLength: 200
                      }
                    }}>
                  </TextField> 
                  <Box sx={{width:'100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Button variant="contained" className="primary-basic2" >Enviar Orden</Button>
                  </Box>                                              
                </Stack>
              </Box>
            </Box> 
            <Box>
                <ProductCart/>      
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

