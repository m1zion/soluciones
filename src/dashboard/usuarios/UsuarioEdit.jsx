import React, { useRef, useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { 
    Alert, 
    Stack, 
    TextField, 
    Button, 
    Typography, 
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem, 
} from "@mui/material"; 
import isEmail from 'validator/lib/isEmail';
import useGet7V from '@hooks/useGet7V';
import usePatchV from '@hooks/usePatchV';
import AppContext from '@context/AppContext';
const API = process.env.REACT_APP_API_URL;
const UsuarioEdit = () => {
    const { state } = useContext(AppContext);
    const [authorized,setAuthorized] = useState(true);
    const {usuario_id} = useParams();
    const navigate = useNavigate();
    const errRef = useRef();
    const form = useRef(null);
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    //const id = "1";
    //ITEMS VARIABLES
    const [id, setId] = useState('');
    const [userId, setUserId] = useState('');
    //ITEMS VARIABLES
    const [role, setRole] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    //Errores
    const [errorRole, setErrorRole] = useState(false);
    const [errorCorreo, setErrorCorreo] = useState(false);
    const [errorPassword,setErrorPassword] = useState(false);

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
            password: { value: password, setError: setErrorPassword, condition: !password || password.length <= 8 }
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
        const userDataPost = { password, role};
        const APIUsers = API+"users/"+usuario_id;      
        try { // Perform API requests
            const { success: userSuccess, data: userData, error: userError } = await usePatchV(APIUsers, userDataPost, state.token);
            if (userSuccess) {                
                    setSuccess(true);
                    setErrMsg("Registro Guardado");
                    alert('Registro Actualizado.');
                    setErrorCorreo(false);
                    navigate('/Dashboard/Usuarios');                
            } else {
                //console.log(userError);
                if (userError == "email tiene que ser único") {
                    setSuccess(false);
                    setErrorCorreo(true);
                    setErrMsg("El correo ya está registrado");
                } else {
                    handleError("Error al actualizar el usuario");
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
    const { data: usuarioFetchData, loading, error } = useGet7V(API+"users/"+usuario_id, state.token);    
    useEffect(() => {       
        if (usuarioFetchData && usuarioFetchData.correo !== undefined) {
            setCorreo(usuarioFetchData.correo);
            setRole(usuarioFetchData.role)
        } else if (error) {
            setSuccess(false);
            setErrMsg(error || "Error de consulta");
        }
    }, [usuarioFetchData, error, state.token, usuario_id]);

    if(!authorized){
        return (             
          <Box className = "noAuthorizedContainer">
            <Typography className='noAuthorizedContainer401'>401</Typography>
            <Typography className='noAuthorizedContainertext'>Lo sentimos, no esta autorizado para ver esta pagina.</Typography>
          </Box>
        );
      }
    if (loading) {
        return <Typography>Loading...</Typography>;
    }
    if (error) {
        return  <Alert ref={errRef}  severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert> ;
    }
   return (
    <Box className = "adminContainer">
        <Box className= "admin-tableHeader" >
            <Typography className="admin-title">Editar contacto de usuario</Typography>
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
                        disabled
                        id="correo" 
                        label="Correo electronico" 
                        size="small"
                        name="correo"
                        autoComplete='on'
                        value={correo}
                        type="correo"
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
                            <MenuItem key="3" value="almacen">Almacen</MenuItem>
                            <MenuItem key="4" value="compras">Compras</MenuItem>
                            <MenuItem key="5" value="ventas">Ventas</MenuItem>
                            <MenuItem key="6" value="devoluciones">Devoluciones</MenuItem>
                            <MenuItem key="7" value="proveedor">Proveedor</MenuItem>
                            <MenuItem key="8" value="contabilidad">Contabilidad</MenuItem>
                            <MenuItem key="9" value="recuperacion">Recuperacion</MenuItem>
                            <MenuItem key="10" value="estadisticas">Estadisticas</MenuItem>
                            <MenuItem key="11" value="diseño">Diseño</MenuItem>            
                        </Select>
                    </FormControl>                    
                </Stack>
            </Box>           
        </Stack>
        <Box className="Button_Container_admin">
            <Button variant="contained"  sx={{textTransform: 'none'}} onClick={handleSubmit} className="primary-button-admin" >Guardar</Button>
            <Button variant="contained"  sx={{textTransform: 'none'}} onClick={handleSubmitReturn} className="primary-button-admin-outlined" >Regresar</Button>
        </Box>    
    </Box>      
    );
}
export default UsuarioEdit;