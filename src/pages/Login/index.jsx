//Instalar npm install @auth0/auth0-react
// Manejador del submit  https://www.youtube.com/watch?v=raJjjm3rhhU 
// https://www.youtube.com/watch?v=oUZjO00NkhY&t=143s
import React, { useRef, useState, useContext, useEffect } from 'react';
import { IconButton, Stack, TextField, InputAdornment, Button, Typography, Box, Divider,Alert, CircularProgress} from "@mui/material"; 
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import './Login.scss';
import '../NewAccount/NewAccount.scss';
import googleIcon from '@icons/google-color-icon.svg';
import { useNavigate } from 'react-router-dom';
//import { LoginContext } from '../../context/LoginContext';
import AppContext from '@context/AppContext';
import { SubscriptionsOutlined } from '@mui/icons-material';
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
  //const loginContext = useContext(LoginContext);
  const {setLogin} = useContext(AppContext);
  const setDataLogin = item =>{setLogin(item);};
  const [message, setMessage] = useState(''); 
  const navigate = useNavigate();
  const form = useRef(null);
  //const { state } = useContext(AppContext);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(false); 
  //Persistencia de datos


  const [ready, setReady] = useState(false);
  
  useEffect(() => {
    const img = new Image();
    img.src = require('../../assets/images/loginbg.jpg'); // adjust path if needed
    img.onload = () => {
      setTimeout(() => {
        setReady(true);
      }, 500); // small delay after image load (optional)
    };
  }, []);
  //Verificamos si tiene una sesion activa en el local storage -------------------------
  useEffect(() =>
    {
      setTimeout(() => {
        try{
          const localStorageToken = localStorage.getItem('authToken');    
          const localStorageUser = localStorage.getItem('authUser');  
          const localStorageproveedorId = localStorage.getItem('proveedorIdL');
          const localStorageUserId = localStorage.getItem('userIdL');  
          const localStorageRole = localStorage.getItem('roleL');
          //Adicionalmente hay que validar que el token es valido            
          if(localStorageToken && localStorageToken !== 'null' && 
            localStorageUser && localStorageUser !== 'null'){
            console.log("1");
            setToken(localStorageToken);
            setUser(localStorageUser);
            setProveedorId(localStorageproveedorId)
            const dataLogin = {
              token: localStorageToken,
              user: localStorageUser,
              userId: localStorageUserId,
              proveedorId: localStorageproveedorId,
              role: localStorageRole,
            }
            //Enviando datos de sesion del local storage'
            setDataLogin(dataLogin);  //State (setLogin)
            if (localStorageRole == 'cliente'){ navigate('/'); }
            else { navigate('/Dashboard'); }  
          }
          setLoading(false);
        }
        catch(error){
          setLoading(false);
          setError(true);
          console.error("No se pudo encontrar la sesion");
          console.log(error);
        }
      },0) 
    },[]
  );
  //------------------------------------------------------------------------

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
      console.log(dataLogin);
      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', user.correo);
      localStorage.setItem('roleL', user.role);
      localStorage.setItem('proveedorIdL', user.proveedorId);
      localStorage.setItem('userIdL', user.id);
      //loginContext.setLogin(dataLogin);
      setDataLogin(dataLogin);  //State (setLogin)
      //setDataLogin(dataLogin);  //State (setLogin)
      if (user.role == 'cliente'){
        navigate('/');
      }
      else {
        navigate('/Dashboard');
      }
      setMessage('¡Has iniciado sesión exitosamente!');
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

  if (!ready) {
    return <div style={{ color: "white", textAlign: "center", marginTop: "20%" }}>Loading...</div>;
  }


  
  return (
    <Box className="LoginBoxContainer" >
      <Stack className="LoginFormContainer" spacing={2} direction = {{xs:"column", md:"column"}} >
        <Alert ref={errRef}  severity={errMsg ? "error" : "info"} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</Alert>
        {loading && <Box className="Form_ContainerLoading"> <CircularProgress /></Box>}
        {(!loading && !error && (user == '' || !user)) &&
        <Box
          className="Form_Container_transparent"
          component="form"
          autoComplete="off"
          ref={form}
          noValidate
        >
            <Stack alignItems="center" spacing={2} >             
            <Typography className="NewAccountTitle" sx={{color:"white"}} variant="h6">Iniciar Sesión</Typography>
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
                variant="filled"
                >
            </TextField>
            <TextField
                className="InputBasic"
                variant="filled"
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
            <Typography variant="body2" className="NewAccountSignInW"><a href="/ForgotPassword">¿Olvidaste tu contraseña? </a></Typography>
          </Stack>
        </Box>
      } 
      </Stack>
    </Box>
  );
}
export default Login;