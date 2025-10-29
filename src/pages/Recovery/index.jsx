import { Stack, TextField, Button, Typography, Box, Alert} from "@mui/material"; //Para controlar la posicion
import React, { useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Recovery.scss';
const baseURL = process.env.REACT_APP_API_URL; 
const Recovery = () => {  
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [errorNewPassword, setErrorNewPassword] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const validations = {
      newPassword: { value: newPassword, setError: setErrorNewPassword, condition: !newPassword },
    };
    let hasErrors = false;
    for (const [field, { value, setError, condition }] of Object.entries(validations)) {
      if (condition) {
          setError(true);
          hasErrors = true;         
      } else {
          setError(false);         
      }
    }
    if (hasErrors) return;
    try {
      const response = await fetch(`${baseURL}auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });
      

      if (!response.ok) {
        const errorData = await response.json(); // Extraer la respuesta del backend
        setSuccess(false);
        setMessage(errorData.message || 'Error al cambiar la contraseña');
        return; 
      }
      setSuccess(true);
      setMessage('¡Tu contraseña ha sido cambiada exitosamente!');
      setTimeout(() => navigate('/'), 3000); // Redirige a login después de 3 segundos
    } catch (error) {
      setSuccess(false);
      setMessage('Error al cambiar la contraseña. Inténtalo nuevamente.');
      console.error('Error en el cambio de contraseña:', error);
    }
  }
  const form = useRef(null);
  return (  
    <Box className="LoginBoxContainer">
      <Stack className="LoginFormContainer" spacing={2} direction = {{xs:"column", md:"column"}} >
        <Box
          className="Form_Container"
          component="form"
          autoComplete="off"
          ref={form}
          noValidate
        > 
            <Stack alignItems="center" spacing={2}>
           <Typography className="NewAccountTitle" variant="h6">Cambiar contraseña</Typography>
           <Alert sx={{width:'90%'}} severity={(!success) ? "error" : "info"}  className={!success ? "errmsg" : "offscreen"} aria-live="assertive" >{message}</Alert>  
           <Alert sx={{width:'90%'}} severity={(!success) ? "error" : "info"}  className={(success && message) ? "errmsg" : "offscreen"} aria-live="assertive" >{message}</Alert>  
            <TextField className="InputBasic"
              error={errorNewPassword}
              type="password" 
              required
              id="newPassword" 
              label="Ingresa tu nueva contraseña" 
              size="small"
              name="newPassword"
              autoComplete='off'
              onChange={e=>setNewPassword(e.target.value)}
            ></TextField>   
            <Box sx={{width:'100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop:"3rem !important"}}>
              <Button variant="contained"  sx={{textTransform: 'none'}} onClick={handleSubmit} className="primary-button-login" >Recuperar contraseña</Button>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
export default Recovery;