
 import React, { useRef, useState, useContext, useEffect  } from 'react';
 import { 
     Alert, 
     Stack, 
     TextField, 
     Button, 
     Typography, 
     Box, 
     Container,
     FormControl,
     InputLabel,
     Select,
     MenuItem,
 } from "@mui/material"; 
 import { useNavigate } from 'react-router-dom'; 
 import isEmail from 'validator/lib/isEmail';
 import usePost2V from '@hooks/usePost2V';
 import AppContext from '@context/AppContext';
 const API = process.env.REACT_APP_API_URL;
 const UsuarioCreate = () => {
    const { state } = useContext(AppContext);
    const [authorized,setAuthorized] = useState(true);
     const navigate = useNavigate();
     const errRef = useRef();
     const form = useRef(null);
     const [errMsg, setErrMsg] = useState('');
     const [success, setSuccess] = useState(false);
     //ITEMS VARIABLES
     const [role, setRole] = useState('admin');
     const [correo, setCorreo] = useState('');
     const [password, setPassword] = useState('');
     const [proveedorId, setProveedorId] = useState(null);
     //Errores
     const [errorRole, setErrorRole] = useState(false);
     const [errorCorreo, setErrorCorreo] = useState(false);
     const [errorPassword,setErrorPassword] = useState(false);
     const [errorProveedorId,setErrorProveedorId] = useState(false);
     const authorizedRoles = ['admin'];
     useEffect(() => {
        if (!authorizedRoles.includes(state.role)) {
          setAuthorized(false);
        }
      }, [state.role]); 
     const handleSubmitReturn = (event) => {
         event.preventDefault();
         navigate('/Dashboard/Usuarios');
     }   
    const handleSubmit = async (event) => {
        event.preventDefault();
        const validations = {
            role: { value: role, setError: setErrorRole, condition: !role },
            password: { value: password, setError: setErrorPassword, condition: !password || password.length <= 8 },
            correo: { value: correo, setError: setErrorCorreo, condition: !correo || !isEmail(correo) },
            proveedorId: {
                value: proveedorId,
                setError: setErrorProveedorId,
                condition: role === 'proveedor' && !proveedorId, // Validate only if role is 'proveedor'
            },
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
        const userDataPost = { 
            correo, 
            role, 
            password, 
            ...(proveedorId ? { proveedorId } : {}) // Include proveedorId only if it's not null or empty
        };
        console.log(userDataPost);
        const APIUsers = API+"users/";
        try { 
            const { success: userSuccess, data: userData, error: userError } = await usePost2V(APIUsers, userDataPost, state.token);
            if (userSuccess) {                
                    setSuccess(true);
                    setErrMsg("Registro Guardado");
                    alert('Registro Guardado.');
                    setErrorCorreo(false);
                    navigate('/Dashboard/Usuarios');             
            } else {
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
                 <Typography  component="h2" variant="h5" color ="#1a237e" gutterBottom>Crear nuevo usuario</Typography>
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
                        <Alert severity='info' sx = {{width:'90%',mt:'5px !important',padding:'2px'}}> Minimo 8 caracteres</Alert>                       
                        <FormControl error={errorRole} className="InputBasic"  size="small" variant="outlined">
                            <InputLabel  id="ddl-marca-label">Rol *</InputLabel>
                            <Select 
                                id="role"
                                name="role"
                                value={role}
                                label="Rol"
                                onChange={e=>setRole(e.target.value)}
                                MenuProps={{
                                    style: {zIndex: 2001}
                                }}
                            >                          
                                <MenuItem key="1" value="admin">Administrador</MenuItem>
                                {/*<MenuItem key="3" value="almacen">Almacen</MenuItem>
                                <MenuItem key="4" value="compras">Compras</MenuItem>
                                <MenuItem key="5" value="ventas">Ventas</MenuItem>
                                <MenuItem key="6" value="devoluciones">Devoluciones</MenuItem>
                                <MenuItem key="7" value="proveedor">Proveedor</MenuItem>
                                <MenuItem key="8" value="contabilidad">Contabilidad</MenuItem>
                                <MenuItem key="9" value="recuperacion">Recuperacion</MenuItem>
                                <MenuItem key="10" value="estadisticas">Estadisticas</MenuItem>
                                <MenuItem key="11" value="diseño">Diseño</MenuItem>            */}
                            </Select>
                        </FormControl> 

                        {role === 'proveedor' && (
                            <TextField className="InputBasic"
                                required
                                error={errorProveedorId}
                                id="proveedorId" 
                                label="Id del proveedor" 
                                size="small"
                                name="proveedorId"
                                type='proveedorId'
                                onChange={(e) => setProveedorId(e.target.value)}
                                inputProps={{maxLength:20 }}
                            >
                            </TextField>   
                        )}
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
 export default UsuarioCreate;