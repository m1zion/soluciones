
 import React, { useRef, useState, useContext, useEffect  } from 'react';
 import { 
     Alert, 
     Stack, 
     TextField, 
     Button, 
     Typography, 
     Box, 
     Container,
 } from "@mui/material"; 
 import { useNavigate } from 'react-router-dom'; 
 import isEmail from 'validator/lib/isEmail';
 import usePost2V from '@hooks/usePost2V';
 import useDelete2 from '@hooks/useDelete2';
 import AppContext from '@context/AppContext';
 const API = process.env.REACT_APP_API_URL;
 const ClienteCreate = () => {
    const { state } = useContext(AppContext);
    const [authorized,setAuthorized] = useState(true);
     const navigate = useNavigate();
     const errRef = useRef();
     const form = useRef(null);
     const [errMsg, setErrMsg] = useState('');
     const [success, setSuccess] = useState(false);
     //ITEMS VARIABLES
     const [id, setId] = useState('');
     const [nombre, setNombre] = useState('');
     const [correo, setCorreo] = useState('');
     const [apellidoPaterno, setApellidoPaterno] = useState('');
     const [apellidoMaterno, setApellidoMaterno] = useState('');
     const [telefono, setTelefono] = useState('');
     const [saldo, setSaldo] = useState('0');
     const [password, setPassword] = useState('');
     //Errores
     const [errorNombre, setErrorNombre] = useState(false);
     const [errorCorreo, setErrorCorreo] = useState(false);
     const [errorTelefono, setErrorTelefono] = useState(false);
     const [msgTelefono,setMsgTelefono] = useState("Telefono");
     const [errorApellidoPaterno, setErrorApellidoPaterno] = useState(false);
     const [errorApellidoMaterno, setErrorApellidoMaterno] = useState(false);
     const [msgApellidoPaterno,setMsgApellidoPaterno] = useState("Apellido Paterno");
     const [msgApellidoMaterno,setMsgApellidoMaterno] = useState("Apellido Materno");
     const [errorPassword,setErrorPassword] = useState(false);
     const authorizedRoles = ['admin', 'contabilidad'];
     useEffect(() => {
        if (!authorizedRoles.includes(state.role)) {
          setAuthorized(false);
        }
      }, [state.role]); 
     const handleSubmitReturn = (event) => {
         event.preventDefault();
         navigate('/Dashboard/Clientes');
     }   
    const handleSubmit = async (event) => {
        event.preventDefault();
        const validations = {
            nombre: { value: nombre, setError: setErrorNombre, condition: !nombre },
            password: { value: password, setError: setErrorPassword, condition: !password },
            correo: { value: correo, setError: setErrorCorreo, condition: !correo || !isEmail(correo) },
            apellidoPaterno: { value: apellidoPaterno, setError: setErrorApellidoPaterno, condition: !apellidoPaterno || apellidoPaterno.length < 3 },
            apellidoMaterno: { value: apellidoMaterno, setError: setErrorApellidoMaterno, condition: apellidoMaterno && apellidoMaterno.length < 3 },
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
                if (field === 'apellidoMaterno') setMsgApellidoPaterno("Apellido Materno");
                if (field === 'telefono') setMsgTelefono("Télefono");
            }
        }
        if (hasErrors) return;



        const userDataPost = { correo, role: "cliente", password };
        var clienteData = {nombre, apellidoPaterno, telefono,saldo};
        if (apellidoMaterno && apellidoMaterno !== '') {
            clienteData.apellidoMaterno = apellidoMaterno;
        }
        const APIUsers = API+"users/";
        const APIPost = API+"clientes/";
        try { // Perform API requests
            const { success: userSuccess, data: userData, error: userError } = await usePost2V(APIUsers, userDataPost, state.token);
            if (userSuccess) {
                const { success: clienteSuccess, error: clienteError } = await usePost2V(APIPost, { ...clienteData, usuarioId: userData.id },state.token);
                if (clienteSuccess) {
                    setSuccess(true);
                    setErrMsg("Registro Guardado");
                    alert('Registro Actualizado.');
                    setErrorCorreo(false);
                    navigate('/Dashboard/Clientes');
                } else {
                    handleError(clienteError || "Error al crear el cliente");
                    //Si no se pudo crear el cliente, borramos el usuario que creó
                    const { success: successDelete, error: errorDelete } = await useDelete2(APIUsers+userData.id);
                    if (successDelete) {        
                    console.log('Usuario Eliminado.')
                    } else if (errorDelete) {
                    console.error(errorDelete || "Error occurred during the request");
                    }
                }
            } else {
                console.log(userError);
                if (userError == "correo tiene que ser único") {
                    setSuccess(false);
                    setErrorCorreo(true);
                    setErrMsg("El correo ya está registrado");
                } else {
                    handleError("Error al crear el usuario");
                }
            }
        } catch (error) {
            handleError("Error en la solicitud");
        }
    }
    const handleError = (errorMessage) => {
        setSuccess(false);
        setErrMsg(errorMessage);
    };
    if(!authorized){
        return (             
          <Box className = "noAuthorizedContainer">
            <Typography className='noAuthorizedContainer401'>401</Typography>
            <Typography className='noAuthorizedContainertext'>Lo sentimos, no esta autorizado para ver esta pagina.</Typography>
          </Box>
        );
      }
     return (
         <Container maxWidth="lg" className="justified-container">
             <Box className= "admin-tableHeader" >
                 <Typography  component="h2" variant="h5" color ="#1a237e" gutterBottom>Crear nuevo cliente</Typography>
             </Box>
             <Alert ref={errRef}  severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert> 
             <Stack className="LoginFormContainer_admin" spacing={2} direction = {{xs:"column", md:"column", lg:"row"}} >
                 <Box
                 className="Form_Container_admin"
                 component="form"
                 autoComplete="off"
                 ref={form}
                 noValidate
                 >
                     <Stack alignItems="center" spacing={2}>                                                                  
                        <TextField className="InputBasic"
                             disabled
                             id="idCliente" 
                             label="Id" 
                             size="small"
                             name="idCliente"
                             autoComplete='on'
                             value={id}
                             onChange={e=>setId(e.target.value)}
                             inputProps={{maxLength:50 }}
                        ></TextField>
                        <TextField className="InputBasic"
                             error={errorNombre}
                             required
                             id="nombre" 
                             label="Nombre" 
                             size="small"
                             name="nombre"
                             autoComplete='on'
                             value={nombre}
                             onChange={e=>setNombre(e.target.value)}
                             inputProps={{maxLength:100 }}
                        ></TextField>    
                        <TextField className="InputBasic"
                             error={errorApellidoPaterno}
                             required
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
                     </Stack>
                 </Box> 
                 <Box
                 className="Form_Container_admin"
                 component="form"
                 autoComplete="off"
                 ref={form}
                 noValidate
                 >                   
                    <Stack alignItems="center" spacing={2}>
                        <TextField className="InputBasic"
                             error={errorCorreo}
                             required
                             id="correo" 
                             label="Correo electronico" 
                             size="small"
                             name="correo"
                             autoComplete='on'
                             value={correo}
                             type="correo"
                             onChange={e=>setCorreo(e.target.value)}
                             inputProps={{maxLength:80 }}
                        ></TextField>   
                        <TextField className="InputBasic"
                            required
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
                            error={errorPassword}
                            id="password" 
                            label="Password" 
                            size="small"
                            name="password"
                            type='password'
                            onChange={(e) => setPassword(e.target.value)}
                            inputProps={{maxLength:20 }}
                        >
            </TextField>  


                    </Stack>
                 </Box>
             </Stack>
             <Box className="Button_Container_admin">
                 <Button variant="contained"  sx={{textTransform: 'none'}} onClick={handleSubmit} className="primary-button-admin" >Guardar</Button>
                 <Button variant="contained"  sx={{textTransform: 'none'}} onClick={handleSubmitReturn} className="primary-button-admin-outlined" >Regresar</Button>
             </Box>
         </Container>
     );
 }
 export default ClienteCreate;