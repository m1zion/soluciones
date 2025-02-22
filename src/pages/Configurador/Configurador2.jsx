import React, {useRef, useContext, useState, useEffect} from "react";
import { Box, Typography, Stack, Button } from "@mui/material";
import '@styles/configurador1.scss';
import AppContext from '@context/AppContext';
import usePut2V from '@hooks/usePut2V';
import { useNavigate } from 'react-router-dom';
import GradientCircularProgress from "./GradientCircularProgress";
const Configurador2 = () => {
    const API = process.env.REACT_APP_API_URL; 
    const {state,loading,error} = useContext(AppContext);
    const [loadingLocal,setLoadingLocal] = useState(false);
    const navigate = useNavigate();
    //VALIDACIONES PARA VER SI EXISTEN BASES,ESTEREOS y ADAPTADORES
    //Buscamos la orden del configurador activa*/
    const handleSubmit = async (configuracion) => {
        setLoadingLocal(true);
        const dataConfCaracteristicas = {
            orderType: configuracion === 'OpenShow' ? 'openshow' : 'configurador',
            status: 'activo',
            tipoConfiguracion: configuracion,
        };
        try {           
            const updatedConfiguradorResponse = await updateConfigurador(dataConfCaracteristicas);
            if(updatedConfiguradorResponse){
                alert("Configuracion actualizada con exito");            
                //setConfigurador(dataPost);  //Hay que mandarlo al estado y al localStorage?
                switch (configuracion){
                    case 'OpenShow':
                        navigate("/OpenShow");
                    break;
                    default:
                        navigate("/configurador3");
                }
            }         
        } catch (error) {
            //setErrorMessage("Error al generar la orden. code:002");
            console.error("Error al generar la orden. code:002");
            console.error(error);
        } finally {
            setLoadingLocal(false);  // Ensure loading state is reset
        }
    }
    //HELPER FUNCTIONS==========================================
    const updateConfigurador = async (ordenVentaData) => {
        const APIPut = API + "ordenesUsuario/" + state.confOrderId;
        const { success, data, error } = await usePut2V(APIPut, ordenVentaData, state.token); 
        if (!success) throw new Error(error || "Error occurred during the request");
        return success;
    };
	return (
        <React.Fragment>
        {(loading || loadingLocal) && <Box className="Loading_Container"> <GradientCircularProgress /></Box>}
        {(!loading && !error) &&
            <Box className="Configurador_Container">
                <Box className="hero-image"></Box>
                <form action="/" className="Configurador_Form2">
                    <Stack alignItems="center" spacing={2} direction="column" className="configurador1_stack"> 
                        <Box className="configurador_tuAuto">
                            <Box className="configurador_tuAuto1">
                                <Typography sx={{paddingLeft:"6px", minWidth:"70px"}}>Tu Auto:</Typography>
                                <Typography sx={{paddingLeft:"6px"}}>{state.marcaC} {state.modeloC} {state.anio}</Typography>
                            </Box>  
                            <Box className="configurador_tuAuto1">
                                <Typography sx={{paddingLeft:"6px"}}>No. Orden: {state.confOrderId}</Typography> 
                            </Box>       
                        </Box>
                        <Typography sx={{fontWeight: 600}} variant="h6">Selecciona tu <Typography variant="h7" sx={{fontWeight: 600, color: "var(--blueConfigurador3)"}}>Configuración</Typography></Typography>                    
                        <Button onClick={() => handleSubmit('Básico')} className="tipoConfiguracion_Button">Configuración Basica</Button>
                        <Button onClick={() => handleSubmit('Intermedio')} className="tipoConfiguracion_Button" >Configuración Media</Button>
                        <Button onClick={() => handleSubmit('Premium')} className="tipoConfiguracion_Button" >Configuración Premium</Button>
                        <Button onClick={() => handleSubmit('Premium')} className="tipoConfiguracion_Button" >Configuración High Fidelity</Button>
                    </Stack>
                </form>
            </Box>
        }
        </React.Fragment>
	);
}
export default Configurador2;