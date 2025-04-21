import React, { useRef, useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { 
    Alert, 
    Stack, 
    TextField, 
    Button, 
    Typography, 
    Box, 
} from "@mui/material"; 
//import TableProveedoresMovEdit from '../containers/tableProveedoresMovEdit';
import isEmail from 'validator/lib/isEmail';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import useGet7V from '@hooks/useGet7V';
import usePatchV from '@hooks/usePatchV';
import formatNumber  from '@utils/formatNumber';
import AppContext from '@context/AppContext';
const API = process.env.REACT_APP_API_URL;
const ProveedorEdit = () => {
    const { state } = useContext(AppContext);
    const [authorized,setAuthorized] = useState(true);
    const{proveedor_id} = useParams();
    const navigate = useNavigate();
    const errRef = useRef();
    const form = useRef(null);
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    //ITEMS VARIABLES
    const [id, setId] = useState('');
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [razonSocial, setRazonSocial] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccionFiscal, setDireccionFiscal] = useState('');
    const [notas, setNotas] = useState('');
    const [saldo, setSaldo] = useState('0');
    //Errores
    const [errorIdProveedor, setErrorIdProveedor] = useState(false);
     const [errorNombre, setErrorNombre] = useState(false);
     const [errorEmail, setErrorEmail] = useState(false);
     const [errorRazonSocial, setErrorRazonSocial] = useState(false);
     const [errorTelefono, setErrorTelefono] = useState(false);
     const [errorDireccionFiscal, setErrorDireccionFiscal] = useState(false);
     const [errorNotas, setErrorNotas] = useState(false);
     const [msgRazonSocial,setMsgRazonSocial] = useState("Razon Social");
     const [msgTelefono,setMsgTelefono] = useState("Télefono");
     const [msgDireccionFiscal,setMsgDireccionFiscal] = useState("Dirección Fiscal");    
     const authorizedRoles = ['proveedor', 'admin', 'contabilidad'];
     useEffect(() => {
       if (!authorizedRoles.includes(state.role)) {
         setAuthorized(false);
       }
     }, [state.role]); 
    const handleSubmitReturn = (event) => {
        event.preventDefault();
        navigate('/Dashboard/Proveedores');
    }   
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!nombre) { setErrorNombre(true); } else { setErrorNombre(false); }
        if (!email || !isEmail(email)) { setErrorEmail(true); } else { setErrorEmail(false); }
        if (!razonSocial || razonSocial.length < 3) { setErrorRazonSocial(true); setMsgRazonSocial("Razon Social (min:3 caracteres)"); } else { setErrorRazonSocial(false); setMsgRazonSocial("Razon Social"); }
        if (!telefono || telefono.length != 10) { setErrorTelefono(true); setMsgTelefono("Telefono (10 caracteres)"); } else { setErrorTelefono(false); setMsgTelefono("Télefono"); }
        if (!direccionFiscal || direccionFiscal.length < 5) { setErrorDireccionFiscal(true); setMsgDireccionFiscal("Dirección Fiscal (min: 5 caracteres)"); } else { setErrorDireccionFiscal(false); setMsgDireccionFiscal("Dirección Fiscal"); }
        if (!nombre ||
            !email || !isEmail(email) ||
            !razonSocial || razonSocial.length < 3 || 
            !telefono || telefono.length != 10 ||
            !direccionFiscal || direccionFiscal.length < 5) {
            return;
        }
        var proveedorData={nombre,email,razonSocial,telefono,direccionFiscal,notas,saldo };
        const APIPut = API+"proveedores/"+proveedor_id;
         const { success, data, error } = await usePatchV(APIPut, proveedorData, state.token);
         if (success){
             setSuccess(true);
             setErrMsg("Registro Guardado");
         } else {
             setSuccess(false);
             setErrMsg(error || "Error occurred during the request");
         }
    }
    //const resp = useGet("http://localhost:3001/proveedores/"+proveedor_id);

    const { data: proveedorFetchData, loading, error } = useGet7V(API+"proveedores/"+proveedor_id,state.token);
    useEffect(() => {
    if(proveedorFetchData && proveedorFetchData.nombre != undefined){
           setId(proveedorFetchData.id);
           setNombre(proveedorFetchData.nombre);
           setEmail(proveedorFetchData.email);
           setRazonSocial(proveedorFetchData.razonSocial);
           setTelefono(proveedorFetchData.telefono);
           setDireccionFiscal(proveedorFetchData.direccionFiscal);
           setNotas(proveedorFetchData.notas);
           setSaldo(proveedorFetchData.saldo)
        }
        else{
            if(error){
                setSuccess(false);
                setErrMsg(error || "Error de consulta");
            }
        }
    }, [proveedorFetchData,error]);

    const handleNewMovimiento = (id,tipo) =>{
        navigate('/Dashboard/Proveedores/movimientocreate/'+id+'/'+tipo);
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
            <Typography className="admin-title">Editar contacto de proveedor</Typography>
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
                            error={errorIdProveedor}
                            disabled
                            id="idProveedor" 
                            label="Id" 
                            size="small"
                            name="idProveedor"
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
                            error={errorEmail}
                            required
                            id="email" 
                            label="Correo electronico" 
                            size="small"
                            name="email"
                            autoComplete='on'
                            value={email}
                            type="email"
                            onChange={e=>setEmail(e.target.value)}
                            inputProps={{maxLength:80 }}
                        ></TextField>    
                        <TextField className="InputBasic"
                            error={errorRazonSocial}
                            required
                            id="razonSocial" 
                            label={msgRazonSocial} 
                            size="small"
                            name="razonSocial"
                            autoComplete='on'
                            value={razonSocial}
                            onChange={e=>setRazonSocial(e.target.value)}
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
                    <TextField className="InputBasic"
                            error={errorDireccionFiscal}                             
                            id="direccionFiscal" 
                            label={msgDireccionFiscal} 
                            size="small"
                            name="direccionFiscal"
                            autoComplete='off'
                            value={direccionFiscal}
                            onChange={e=>setDireccionFiscal(e.target.value)}
                            inputProps={{maxLength:100 }}
                    ></TextField>    
                    <TextField className="InputBasic"
                            error={errorNotas}                             
                            id="notas" 
                            label="Notas" 
                            size="small"
                            name="notas"
                            multiline
                            maxRows={4}
                            autoComplete='off'
                            value={notas}
                            onChange={e=>setNotas(e.target.value)}
                            inputProps={{maxLength:200 }}
                    ></TextField>   
                </Stack>
            </Box>
        </Stack>
        <Box className="Button_Container_admin">
            <Button variant="contained"  sx={{textTransform: 'none'}} onClick={handleSubmit} className="primary-button-admin" >Guardar</Button>
            <Button variant="contained"  sx={{textTransform: 'none'}} onClick={handleSubmitReturn} className="primary-button-admin-outlined" >Regresar</Button>
        </Box>
        {/*No manejaremos contabilidad */}
        {/*<Box className='proveedor_actions_main_container'>
            <Box  className="proveedor_actions_container">
                <Button variant="contained"  sx={{textTransform: 'none'}} onClick={() => handleNewMovimiento(id,'Ingreso')}  className="income-button-admin" startIcon={<UploadIcon />}>Ingreso</Button>
                <Button variant="contained"  sx={{textTransform: 'none'}} onClick={() => handleNewMovimiento(id,'Egreso')} className="outcome-button-admin" startIcon={<DownloadIcon />}>Egreso</Button>
            </Box>
            <Box className="saldoProveedor">
                <Typography variant="h6" >Saldo del proveedor:</Typography>
                <Typography className="montoSaldoProveedor" >$ {formatNumber(parseFloat(proveedorFetchData.saldo))}</Typography>
            </Box>
        </Box>
        <TableProveedoresMovEdit proveedorId={id}/>*/}
    </Box>      
    );
}
export default ProveedorEdit;