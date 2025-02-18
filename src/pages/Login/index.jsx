//Instalar npm install @auth0/auth0-react
// Manejador del submit  https://www.youtube.com/watch?v=raJjjm3rhhU 
// https://www.youtube.com/watch?v=oUZjO00NkhY&t=143s
import React, { useRef, useState, useContext } from 'react';
import { IconButton, Stack, TextField, InputAdornment, Button, Typography, Box, Divider,Alert} from "@mui/material"; 
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import './Login.scss';
import '../NewAccount/NewAccount.scss';
import googleIcon from '@icons/google-color-icon.svg';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../../context/LoginContext';
//import AppContext from '@context/AppContext';
//import { useAuth } from '@context/AuthContext'; // Importa el hook de AuthContext
const baseURL = process.env.REACT_APP_API_URL; 
const Login = () => {
  const errRef = useRef();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');  
  const [token, setToken] = useState(null); // Estado para almacenar el token
  const [user, setUser] = useState(null); // Estado para almacenar el token
  const [proveedorId, setProveedorId] = useState(null); // Estado para almacenar el token
   const loginContext = useContext(LoginContext);
  //const {setLogin} = useContext(AppContext);
  //const setDataLogin = item =>{setLogin(item);};
  const [message, setMessage] = useState(''); 
  const navigate = useNavigate();
  const form = useRef(null);
  //const { state } = useContext(AppContext);
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${baseURL}auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
      if (!response.ok) {
        throw new Error('Error al iniciar sesión');
      }
      
      const data = await response.json();
      const { token, user} = data; 
      // Guardar el token en el estado
      //console.log(token);
      console.log("Haciendo el Login");
      console.log(user);
      console.log(token);
      setToken(token);
      setUser(user.correo);
      setProveedorId(user.proveedorId)
      const  dataLogin = {
        token: token,
        user: user.correo,
        userId: user.id,
        proveedorId: user.proveedorId,
        role: user.role,
        //clienteId: clienteId,
      }
      //console.log(dataLogin);
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', user.correo);
      localStorage.setItem('roleL', user.role);
      localStorage.setItem('proveedorIdL', user.proveedorId);
      localStorage.setItem('userIdL', user.id);
      loginContext.setLogin(dataLogin);
      console.log(loginContext.login);
      //setDataLogin(dataLogin);  //State (setLogin)
      /*if (user.role == 'cliente'){
        navigate('/');
      }
      else {
        navigate('/Dashboard');
      }
      setMessage('¡Has iniciado sesión exitosamente!');
      */
    } catch (error) {
      setMessage('Error al iniciar sesión. Verifica tus credenciales.');
      console.error('Error en el login:', error);
    }
  }
  const [values, setValues] = React.useState({
    password: '',
    showPassword: false,
    showPassword_confirm: false,
  });
  const handleGoogleLogin = () => {
    window.location.href = `${baseURL}/api/v1/auth/google`;
  };
  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleRegister = categoria =>{
    navigate('/newAccount');
  }
  return (
    <Box className="LoginBoxContainer" >
      <Stack className="LoginFormContainer" spacing={2} direction = {{xs:"column", md:"column"}} >
        <Alert ref={errRef}  severity={errMsg ? "error" : "info"} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</Alert>
        <Box
          className="Form_Container"
          component="form"
          autoComplete="off"
          ref={form}
          noValidate
        >
          <Stack alignItems="center" spacing={2} >             
            <Typography className="NewAccountTitle" sx={{fontWeight: 600}} variant="h6">Iniciar Sesión</Typography>
            <TextField className="InputBasic"
                required
                id="email" 
                type='email'
                label="Correo Electronico" 
                size="small"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                autoComplete='on'
                >
            </TextField>
            <TextField
                className="InputBasic"
                required
                size='small'
                name="password"   
                label="Password"            
                id="password"
                type={values.showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" >
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        tabIndex={-1}
                      >
                        {values.showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
            />
            { message != "" && <Alert severity='error'>{message}</Alert> }
            <Box sx={{width:'100%',  display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop:"3rem !important"}}>
              <Button variant="contained"  sx={{textTransform: 'none'}} onClick={handleSubmit} className="primary-button-login" >Iniciar sesion</Button>
            </Box>
            <Box sx={{width:'100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Button variant="contained" sx={{textTransform: 'none'}}  onClick={handleRegister} className="NextStepButtonSecondaryFull" >Registrarse</Button>
            </Box>
            <Typography variant="body2" className="NewAccountSignIn"><a href="/ForgotPassword">¿Olvidaste tu contraseña? </a></Typography>
            
            {/*<Box className="loginFormBox">
              <Box className="loginFormBoxBox">
                <Divider></Divider>
              </Box>
              <Typography>o</Typography>
              <Box className="loginFormBoxBox">
                <Divider></Divider>
              </Box>
            </Box>    
            <button className="google-button" onClick={handleGoogleLogin}>
              <img src={ googleIcon } width="16px" />
              <Typography>Continuar con Google</Typography>
            </button>*/}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
export default Login;