import React, { useRef, useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
    Alert, 
    Stack, 
    TextField, 
    Button, 
    Typography, 
    Box, 
} from "@mui/material"; 
import TableClientesMovEdit from '../containers/tableClientesMovEdit';
import isEmail from 'validator/lib/isEmail';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import useGet7V from '@hooks/useGet7V';
import usePatchV from '@hooks/usePatchV';
import formatNumber  from '@utils/formatNumber';
import AppContext from '@context/AppContext';
const API = process.env.REACT_APP_API_URL;
const ClienteEdit = () => {
    const { state } = useContext(AppContext);
    const [authorized,setAuthorized] = useState(true);
    const{cliente_id} = useParams();
    const navigate = useNavigate();
    const errRef = useRef();
    const form = useRef(null);
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    //const id = "1";
    //ITEMS VARIABLES
    const [id, setId] = useState('');
    const [userId, setUserId] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellidoPaterno, setApellidoPaterno] = useState('');
    const [apellidoMaterno, setApellidoMaterno] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [saldo, setSaldo] = useState('0');
    //Errores
    const [errorIdCliente, setErrorIdCliente] = useState(false);
    const [errorNombre, setErrorNombre] = useState(false);
    const [errorApellidoPaterno, setErrorApellidoPaterno] = useState(false);
    const [errorApellidoMaterno, setErrorApellidoMaterno] = useState(false);
    const [errorCorreo, setErrorCorreo] = useState(false);
    const [errorTelefono, setErrorTelefono] = useState(false);    
    const [msgApellidoPaterno,setMsgApellidoPaterno] = useState("Apellido Paterno");
    const [msgApellidoMaterno,setMsgApellidoMaterno] = useState("Apellido Materno");  
    const [msgTelefono,setMsgTelefono] = useState("Télefono"); 
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
        const clienteData = { nombre, apellidoPaterno, apellidoMaterno, telefono };
        const APIClientes = API+"clientes/"+cliente_id;
        const APIUsers = API+"users/"+userId;
        const userDataPost = {correo};        
        try { // Perform API requests
            const { success: userSuccess, data: userData, error: userError } = await usePatchV(APIUsers, userDataPost, state.token);
            if (userSuccess) {
                const { success: clienteSuccess, error: customerError } = await usePatchV(APIClientes,clienteData, state.token);
                if (clienteSuccess) {
                    setSuccess(true);
                    setErrMsg("Registro Guardado");
                    alert('Registro Actualizado.');
                    setErrorCorreo(false);
                    //navigate('/Dashboard/Compras');
                } else {
                    handleError(customerError || "Error al actualizar el cliente");
                }
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
            console.log(error);
            handleError("Error en la solicitud");
        }
    }
    const handleError = (errorMessage) => {
        setSuccess(false);
        setErrMsg(errorMessage);
    };
    const { data: clienteFetchData, loading, error } = useGet7V(API+"clientes/"+cliente_id, state.token);    
    useEffect(() => {
        const fetchCorreo = async (userId) => { // Funtion to fetch the correo from a different endpoint when clienteFetchData is available
            try {
                const response = await fetch(API + "users/" + userId, {
                    headers: {
                        Authorization: `Bearer ${state.token}`,
                    },
                });
                const userData = await response.json();
                if (userData && userData.correo) {
                    setCorreo(userData.correo); // Set the email fetched from the users endpoint
                }
            } catch (fetchError) {
                console.error("Error fetching correo:", fetchError);
                setErrMsg(fetchError.message || "Error fetching correo");
            }
        };
        if (clienteFetchData && clienteFetchData.id !== undefined) {
            setId(clienteFetchData.id);
            setUserId(clienteFetchData.usuarioId);
            setNombre(clienteFetchData.nombre);
            setApellidoPaterno(clienteFetchData.apellidoPaterno);
            setApellidoMaterno(clienteFetchData.apellidoMaterno);
            setTelefono(clienteFetchData.telefono);
            setSaldo(clienteFetchData.saldo);

            // Fetch correo using usuarioId
            if (clienteFetchData.usuarioId) {
                fetchCorreo(clienteFetchData.usuarioId); 
            }
        } else if (error) {
            setSuccess(false);
            setErrMsg(error || "Error de consulta");
        }
    }, [clienteFetchData, error, state.token, cliente_id]);

    const handleNewMovimiento = (id,tipo) =>{
        navigate('/Dashboard/Clientes/movimientocreate/'+id+'/'+tipo);
    }
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
            <Typography className="admin-title">Editar contacto de cliente</Typography>
            <Button onClick={()=>navigate('/Dashboard/Direcciones/'+id+'/'+userId)}>Administrar direcciones</Button>
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
                            error={errorIdCliente}
                            disabled
                            id="idCliente" 
                            label="Id" 
                            size="small"
                            name="idCliente"
                            autoComplete='on'
                            value={id}
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
                        inputProps={{maxLength:50 }}
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
                        inputProps={{maxLength:50 }}
                    ></TextField>
                    <TextField className="InputBasic"
                        error={errorApellidoMaterno}
                        required
                        id="apellidoMaterno" 
                        label={msgApellidoMaterno}
                        size="small"
                        name="apellidoMaterno"
                        autoComplete='on'
                        value={apellidoMaterno ? apellidoMaterno : ''}
                        onChange={e=>setApellidoMaterno(e.target.value)}
                        inputProps={{maxLength:50 }}
                    ></TextField>
                    <TextField className="InputBasic"
                        error={errorCorreo}
                        required
                        id="correo" 
                        label="Correo electronico" 
                        size="small"
                        name="correo"
                        autoComplete='on'
                        value={correo}
                        type="email"
                        onChange={e=>setCorreo(e.target.value)}
                        inputProps={{maxLength:80 }}
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
                            error={errorTelefono}                             
                            id="telefono" 
                            label={msgTelefono}
                            size="small"
                            name="telefono"
                            autoComplete='on'
                            value={telefono}
                            onChange={e=>setTelefono(e.target.value)}
                            inputProps={{maxLength:12 }}
                    ></TextField>                    
                </Stack>
            </Box>
        </Stack>
        <Box className="Button_Container_admin">
            <Button variant="contained"  sx={{textTransform: 'none'}} onClick={handleSubmit} className="primary-button-admin" >Guardar</Button>
            <Button variant="contained"  sx={{textTransform: 'none'}} onClick={handleSubmitReturn} className="primary-button-admin-outlined" >Regresar</Button>
        </Box>

        <Box className='proveedor_actions_main_container'>
            <Box  className="proveedor_actions_container">
                {/*<Button variant="contained"  sx={{textTransform: 'none'}} onClick={() => handleNewMovimiento(id,'Ingreso')}  className="income-button-admin" startIcon={<UploadIcon />}>Ingreso</Button>
                <Button variant="contained"  sx={{textTransform: 'none'}} onClick={() => handleNewMovimiento(id,'Egreso')} className="outcome-button-admin" startIcon={<DownloadIcon />}>Egreso</Button>*/}
            </Box>
            <Box className="saldoProveedor">
                <Typography variant="h6" >Saldo del cliente:</Typography>
                <Typography className="montoSaldoProveedor" >$ {formatNumber(parseFloat(clienteFetchData.saldo))}</Typography>
            </Box>
        </Box>      
        <TableClientesMovEdit clienteId={id}/>
    </Box>      
    );
}
export default ClienteEdit;