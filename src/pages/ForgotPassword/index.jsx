import { Stack, TextField, Button, Typography, Box, Alert} from "@mui/material"; //Para controlar la posicion
import React, { useRef, useState } from 'react';
import './ForgotPassword.scss';
import { useNavigate } from 'react-router-dom';
import isEmail from 'validator/lib/isEmail';
const baseURL = process.env.REACT_APP_API_URL; 
const ForgotPassword = () => {  
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [errorCorreo, setErrorCorreo] = useState(false);
  const [success, setSuccess] = useState(true);
  const [message, setMessage] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validations = {
      correo: { value: correo, setError: setErrorCorreo, condition: !correo || !isEmail(correo) },
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
      const response = await fetch(`${baseURL}auth/recovery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email:correo }),
      });

      if (!response.ok) {
        setSuccess(false);
        throw new Error('Error en la recuperación de contraseña');
      }
      setSuccess(true);
      alert('¡Revisa tu correo para recuperar la contraseña!');
      setTimeout(() => navigate('/'), 3000); // Redirige a login después de 3 segundos
    } catch (error) {
      setMessage('Error al intentar recuperar la contraseña. Inténtalo nuevamente.');
      console.error('Error en la recuperación de contraseña:', error);
    }
  }
  const form = useRef(null);
  return (  
    <Box className="LoginBoxContainer">
      <Stack className="LoginFormContainer" spacing={2} direction = {{xs:"column", md:"column"}} >
        <Box
          className="RecoveryContainer"
          component="form"
          autoComplete="off"
          ref={form}
          noValidate
        > 
            <Stack alignItems="center" spacing={2}>
                <Typography sx={{width:'90%'}} className="RecoveryAccountTitle" variant="h6">Recuperar cuenta</Typography>
                <Typography sx={{width:'90%'}} className="RecoveryAccountTitle" variant="subtitle1">Ingrese la dirección de correo electrónico asociada a su cuenta para restablecer su contraseña.</Typography>
                <Alert sx={{width:'90%'}} severity={(!success) ? "error" : "info"}  className={!success ? "errmsg" : "offscreen"} aria-live="assertive" >{message}</Alert>  
                <TextField className="InputBasic"
                error={errorCorreo}
                required
                id="correo" 
                label="Correo Electronico" 
                size="small"
                name="correo"
                autoComplete='off'
                onChange={e=>setCorreo(e.target.value)}
                ></TextField>   
                <Box sx={{width:'100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop:"2rem !important"}}>
                <Button 
                    variant="contained"  
                    sx={{textTransform: 'none'}} 
                    onClick={handleSubmit} 
                    className={!correo.trim() ? "primary-button-login-disabled" : "primary-button-login"} 
                    disabled={!correo.trim()}
                    >
                        Recuperar contraseña
                    </Button>
                </Box>
          </Stack>
        </Box>
      </Stack>      
    </Box>
  );
}
export default ForgotPassword;