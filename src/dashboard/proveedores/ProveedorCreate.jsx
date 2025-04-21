
 import React, { useRef, useState, useContext, useEffect } from 'react';
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
 import AppContext from '@context/AppContext';
 const API = process.env.REACT_APP_API_URL;
 const ProveedorCreate = () => {
     const { state } = useContext(AppContext);
     const [authorized,setAuthorized] = useState(true);
     const [loading,setLoading] = useState(true);
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
     const [msgRazonSocial,setMsgRazonSocial] = useState("Razon Social");
     const [errorTelefono, setErrorTelefono] = useState(false);
     const [msgTelefono,setMsgTelefono] = useState("Télefono");
     const [errorDireccionFiscal, setErrorDireccionFiscal] = useState(false);
     const [msgDireccionFiscal,setMsgDireccionFiscal] = useState("Dirección Fiscal");
     const [errorNotas, setErrorNotas] = useState(false);  
     const authorizedRoles = ['admin', 'contabilidad'];
     useEffect(() => {
         if (!authorizedRoles.includes(state.role)) {
           setAuthorized(false);
           setLoading(false);
         }
         setLoading(false);
       }, [state.role]);
     const handleSubmitReturn = (event) => {
         event.preventDefault();
         navigate('/Dashboard/Proveedores');
     }   
     const handleSubmit = async () => {
         if (!nombre) { setErrorNombre(true); } else { setErrorNombre(false); }
         if (!email || !isEmail(email)) { setErrorEmail(true); } else { setErrorEmail(false); }
         if (!razonSocial || razonSocial.length < 3) { setErrorRazonSocial(true); setMsgRazonSocial("Razon Social (min:3 caracteres)"); } else { setErrorRazonSocial(false); setMsgRazonSocial("Razon Social"); }
         if (!telefono || telefono.length != 10) { setErrorTelefono(true); setMsgTelefono("Telefono (10 caracteres)"); } else { setErrorTelefono(false); setMsgTelefono("Télefono"); }
         if (!direccionFiscal || direccionFiscal.length < 5) { setErrorDireccionFiscal(true); setMsgDireccionFiscal("Dirección Fiscal (min: 5 caracteres)"); } else { setErrorDireccionFiscal(false); setMsgDireccionFiscal("Dirección Fiscal"); }
         if (!nombre ||
             !email || !isEmail(email) ||
             !razonSocial|| razonSocial.length < 3 || 
             !telefono || telefono.length != 10||
             !direccionFiscal || direccionFiscal.length < 5) {
             return;
         }
         var proveedorData={nombre,email,razonSocial,telefono,direccionFiscal,notas,saldo };
         const APIPost = API+"proveedores";
         //console.log(proveedorData);
         const { success, data, error } = await usePost2V(APIPost, proveedorData, state.token);
         if (success){
            setSuccess(true);
            setErrMsg("Registro Guardado");
            alert('Registro Guardado.');
            navigate('/Dashboard/Proveedores');
         } else {
             setSuccess(false);
             setErrMsg(error || "Error occurred during the request");
         }
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
     return (
         <Container maxWidth="lg" className="justified-container">
             <Box className= "admin-tableHeader" >
                 <Typography  component="h2" variant="h5" color ="#1a237e" gutterBottom>Crear nuevo proveedor</Typography>
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
                             id="idProveedor" 
                             label="Id" 
                             size="small"
                             name="idProveedor"
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
                            required
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
                            required
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
         </Container>
     );
 }
 export default ProveedorCreate;