import { Alert, Box, Button, Stack, Step, StepLabel, Stepper, Typography } from "@mui/material";
import '@styles/Configurador1.scss';
import React, { useState, useEffect, useRef, useContext } from "react";
import AppContext from '@context/AppContext';
import { useNavigate } from "react-router-dom";
import GradientCircularProgress from "./GradientCircularProgress";
const Configurador1 = () => {
  const { state} = useContext(AppContext);
  console.log("======");
  console.log(state);
  console.log(state.userName);
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
        <Typography variant="h6">Favor de Iniciar Sesión</Typography>
        <Typography variant="body1" className="NewAccountSignIn">
          <a href="/Login">Iniciar Sesión / Registrarse</a>
        </Typography>
      </Box>
      ) : 
      (
      <Box className="Configurador_Container">
        <Box className="hero-image"></Box>    
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
          </Stack>
        </form>
      </Box>
    )}
  </React.Fragment> 
  )
}
export default Configurador1;