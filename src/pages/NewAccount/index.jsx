import { IconButton, Stack, TextField, InputAdornment, Button, Typography, Box, Alert} from "@mui/material"; //Para controlar la posicion
import React, { useRef, useState, useEffect } from 'react';
import './NewAccount.scss';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import usePost2 from '@hooks/usePost2';
import isEmail from 'validator/lib/isEmail';
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%_]).{8,24}$/;
const baseURL = process.env.REACT_APP_API_URL; 
const APIPostCliente = baseURL+"clientes/";
const NewAccount = () => {  
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');  //Nombre
  const [correo, setCorreo] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [telefono, setTelefono] = useState('');

  const [errorTelefono, setErrorTelefono] = useState(false);
  const [errorNombre, setErrorNombre] = useState(false);
  const [errorPwd, setErrorPwd] = useState(false);
  const [errorApellidoPaterno, setErrorApellidoPaterno] = useState(false);
  const [errorApellidoMaterno, setErrorApellidoMaterno] = useState(false);
  const [errorCorreo, setErrorCorreo] = useState(false);

  const [msgTelefono,setMsgTelefono] = useState("Telefono");
  const [msgApellidoPaterno,setMsgApellidoPaterno] = useState("Apellido Paterno");
  const [msgApellidoMaterno,setMsgApellidoMaterno] = useState("Apellido Materno");

  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);
  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);
  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');



   const [ready, setReady] = useState(false);
    const form = useRef(null);

    useEffect(() => {
      const img = new Image();
      img.src = require('../../assets/images/loginbg.jpg'); // adjust path if needed
      img.onload = () => {
        setTimeout(() => {
          setReady(true);
        }, 500); // small delay after image load (optional)
      };
    }, []);

  useEffect(() => {
    setValidName(USER_REGEX.test(nombre));
  }, [nombre])
  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd])

  useEffect(() => {
    setErrMsg('');
  }, [nombre, pwd, matchPwd])

  const handleSubmit = async (e) => {
    console.log("Entra a registrar el usuario");
    e.preventDefault();
    setErrMsg("");
    const validations = {
      nombre: { value: nombre, setError: setErrorNombre, condition: !nombre },
      correo: { value: correo, setError: setErrorCorreo, condition: !correo || !isEmail(correo) },
      pwd: { value: pwd, setError: setErrorPwd, condition: !PWD_REGEX.test(pwd) || !validMatch},
      apellidoPaterno: { value: apellidoPaterno, setError: setErrorApellidoPaterno, condition: !apellidoPaterno || apellidoPaterno.length < 3 },
      apellidoMaterno: { value: apellidoMaterno, setError: setErrorApellidoMaterno, condition: !apellidoMaterno || apellidoMaterno.length < 3 },
      telefono: { value: telefono, setError: setErrorTelefono, condition: !telefono || telefono.length !== 10 }
    };
    let hasErrors = false;
    for (const [field, { value, setError, condition }] of Object.entries(validations)) {
      if (condition) {
          setError(true);
          hasErrors = true;
          if (field === 'apellidoPaterno') setMsgApellidoPaterno("Apellido (min:3 caracteres)");
          if (field === 'apellidoMaterno') setMsgApellidoMaterno("Apellido (min:3 caracteres)");
          if (field === 'telefono') setMsgTelefono("Telefono (10 caracteres)");
      } else {
          setError(false);
          if (field === 'apellidoPaterno') setMsgApellidoPaterno("Apellido Paterno");
          if (field === 'apellidoMaterno') setMsgApellidoMaterno("Apellido Materno");
          if (field === 'telefono') setMsgTelefono("Télefono");
      }
    }
    if (hasErrors) return;
    const saldo = 0;
    try {
      const response = await fetch(`${baseURL}users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo: correo,
          password: pwd,
          role: 'cliente',
        }),
      });
      if (!response.ok) {
        if(response.status == 409){
          setErrMsg("El correo ya esta registrado");
        }
        else{
          setErrMsg("Error al crear el usuario");
        }
        throw new Error('Error al registrarse');
      }
      const data = await response.json();
      const id = data.id;
      //Once we create the user, we create the client assigning the user Id
      var clienteData = {nombre, apellidoPaterno: apellidoPaterno, apellidoMaterno: apellidoMaterno,telefono:telefono, saldo,usuarioId: id};
      console.log(clienteData);
      const { success: clienteSuccess, error: clienteError } = await usePost2(APIPostCliente,clienteData);
      if (!clienteSuccess) {
        throw new Error('Error al registrar el usuario');
      }
      alert("Tu usuario ha sido registrado");
      setMessage('¡Te has registrado exitosamente!');
      navigate('/login');
    } catch (error) {
      setMessage('Error al registrarse. Inténtalo nuevamente.');
      console.error('Error en el registro:', error);
    }
  }
  const [values, setValues] = React.useState({
    password: '',
    showPassword: false,
    showPassword_confirm: false,
  });

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };
  const handleClickShowPassword_confirm = () => {
    setValues({
      ...values,
      showPassword_confirm: !values.showPassword_confirm,
    });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleMouseDownPassword_confirm = (event) => {
    event.preventDefault();
  };

  if (!ready) {
    return <div style={{ color: "white", textAlign: "center", marginTop: "20%" }}>Loading...</div>;
  }

  return (
    <Box className="LoginBoxContainer">
      <Stack className="LoginFormContainer" spacing={2} direction = {{xs:"column", md:"column"}} >
        <Box
          className="Form_Container_transparent"
          component="form"
          autoComplete="off"
          ref={form}
          noValidate
        > 
          <Stack alignItems="center" spacing={2}>
            <Typography className="NewAccountTitle" sx={{color:"white"}} variant="h6">Crear nueva cuenta</Typography>
            <Alert sx={{width:'90%'}} severity={(errMsg) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert>  
            <TextField className="InputBasic"
              error={errorCorreo}
              required
              id="correo" 
              label="Correo Electronico" 
              size="small"
              name="correo"
              autoComplete='off'
              onChange={e=>setCorreo(e.target.value)}
              variant="filled"
            >
            </TextField>   
            <TextField 
              variant="filled"
              error={errorPwd}
              className="InputBasic"
              required
              id="password" 
              label="password" 
              size="small"
              name="password"
              type={values.showPassword ? 'text' : 'password'}             
              aria-invalid={validPwd ? "false" : "true"}
              onChange={(e) => setPwd(e.target.value)}
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" >
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      //tabIndex={-1}
                    >
                      {values.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              >
            </TextField>     
            {pwdFocus && !validPwd && (
            <Alert
              severity="info"
              id="uidnote"
              className={pwdFocus && !validPwd ? "instructions" : "offscreen"}
            >
              8 a 24 caracteres, debe incluir mayusculas y minusculas, un numero y un caracter especial:<br />
                <span aria-label="exclamation mark">!</span> 
                <span aria-label="at symbol">@</span> 
                <span aria-label="hashtag">#</span> 
                <span aria-label="dollar sign">$</span> 
                <span aria-label="percent">%</span>
            </Alert>      )}

            <TextField className="InputBasic"
                variant="filled"
                required
                error={errorPwd}
                id="confirm_pwd" 
                label="Confirmar Password" 
                size="small"
                name="confirm_pwd"
                type={values.showPassword_confirm ? 'text' : 'password'}                
                aria-invalid={validMatch ? "false" : "true"}
                onChange={(e) => setMatchPwd(e.target.value)}
                onFocus={() => setMatchFocus(true)}
                onBlur={() => setMatchFocus(false)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword_confirm}
                        onMouseDown={handleMouseDownPassword_confirm}
                        //tabIndex={-1}
                      >
                        {values.showPassword_confirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                >
            </TextField>      
            {matchFocus && !validMatch && (
            <Alert
              severity="info"
              id="uidnote"
              className={matchFocus && !validMatch ? "instructions" : "offscreen"}
            >
              Deberá coincidir con el password
            </Alert>
            )}
            <TextField className="InputBasic"
                required
                variant="filled"
                error={errorTelefono}                             
                id="telefono" 
                label={msgTelefono}
                size="small"
                name="telefono"
                autoComplete='on'
                value={telefono}
                onChange={e=>setTelefono(e.target.value)}
                inputProps={{maxLength:10 }}
            ></TextField> 
            <TextField className="InputBasic"
                required
                variant="filled"
                id="nombre_usuario" 
                label="Nombre" 
                size="small"
                name="nombre_usuario"
                error={errorNombre}         
                onChange={(e) => setNombre(e.target.value)}
                value={nombre}
                >
            </TextField>
            <TextField className="InputBasic"
              error={errorApellidoPaterno}
              required
              variant="filled"
              id="apellidoPaterno" 
              label={msgApellidoPaterno} 
              size="small"
              name="apellidoPaterno"
              autoComplete='on'
              value={apellidoPaterno}
              onChange={e=>setApellidoPaterno(e.target.value)}
              inputProps={{maxLength:100 }}
            ></TextField> 
            <TextField className="InputBasic"
              required
              variant="filled"
              error={errorApellidoMaterno}
              id="apellidoMaterno" 
              label={msgApellidoMaterno} 
              size="small"
              name="apellidoMaterno"
              autoComplete='on'
              value={apellidoMaterno}
              onChange={e=>setApellidoMaterno(e.target.value)}
              inputProps={{maxLength:100 }}
            ></TextField> 
            <FormGroup className="NewAccountLabel">
                <FormControlLabel control={<Checkbox sx={{
                  color: "white",
                  '&.Mui-checked': {
                    color: "white",
                  },
                }} />} label="He leido y acepto la politica de privacidad" />
            </FormGroup>
            <Box sx={{width:'100%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop:"3rem !important"}}>
              <Button variant="contained"  sx={{textTransform: 'none'}} onClick={handleSubmit} className="primary-button-login" >Registrarse</Button>
            </Box>
            <Typography variant="body2" className="NewAccountSignIn">¿Ya tienes cuenta? <a href="/login">Iniciar Sesion</a></Typography>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
export default NewAccount;