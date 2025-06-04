import React, { useRef, useState, useEffect, useContext } from 'react';
import { useNavigate, useParams} from "react-router-dom";
import {Stack, Box,Container, Alert, Typography, Grid, Button, Stepper, Step, StepLabel} from "@mui/material"; 
import useGet7V from '@hooks/useGet7V';
import TableVentasMov from '../containers/tableVentasMov';
import DatosCliente from '@containersDashboard/datosCliente';
import AppContext from '@context/AppContext';
const API = process.env.REACT_APP_API_URL;
const APICATEGORIAS = API+'categories/?offset=0&limit=100';
const APIClientes = API+'clientes/';
const APIUsers = API+'users/';
const steps = [
    'activo',
    'esperando surtido',
    'surtido'
  ];
const VentaDetail = () => {
    const{ordenVentaId} = useParams();
    const { state } = useContext(AppContext);
    const [authorized,setAuthorized] = useState(true);
    const errRef = useRef();
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const [totalOrden,setTotalOrden] = useState('');
    const [datosCliente,setDatosCliente] = useState('');
    const [datosDireccion,setDatosDireccion] = useState('');    
    const [loadingCategoria, setLoadingCategoria] = useState(true);
    const [loadingVenta, setLoadingVenta] = useState(true);
    const [loadingMovimientoVenta, setLoadingMovimientoVenta] = useState(true);
    const [ordenVenta, setOrdenVenta] = useState('');
    const [existeOrden, setExisteOrden] = useState(true);
    const [saldoPendiente,setSaldoPendiente] = useState(0);
    const navigate = useNavigate();
    const handleSubmitReturn = (event) => {
        event.preventDefault();
        navigate('/Dashboard/Ventas');
    }   
    //ITEMS VARIABLES    
    const [categorias,setCategorias] = useState('');
    const [descuento,setDescuento] = useState('');
    const [fecha,setFecha] = useState('');
    const [clienteId,setClienteId] = useState('');
    const [noGuia,setNoGuia] = useState('');
    const [paqueteria,setPaqueteria] = useState('');
    const [notas,setNotas] = useState('');
    const [estatusOrden,setEstatusOrden] = useState('');  
    const authorizedRoles = ['ventas', 'admin', 'contabilidad'];
    useEffect(() => {
        if (!authorizedRoles.includes(state.role)) {
          setAuthorized(false);
        }
      }, [state.role]);   
    const getActiveStep = (estatusOrden) => {
        switch (estatusOrden) {
            case "activo":
                return 0;
            case "esperando surtido":
                return 1;
            case "surtido":
                return 2;
            case "pagado":
                return 3;
            default:
                return 0; // Default to 0 if estatusOrden doesn't match any condition
        }
    };
     //========================CONSULTAMOS LAS CATEGORIAS===========================================
     useEffect(() => {// no usamos un hook para evitar multiples peticiones a la API
        const fetchData = async () => {
            try {
                const categoriasFetchData = await fetch(APICATEGORIAS);
                if (!categoriasFetchData.ok) {
                    throw new Error('Failed to fetch categorias');
                }
                const jsonCategorias = await categoriasFetchData.json();
                setCategorias(jsonCategorias.products);
                setErrMsg("");
                setLoadingCategoria(false);
            } catch (error) {
                setSuccess(false);
                setErrMsg("Error al consultar Categorias");
                setLoadingCategoria(false);
            }          
        };
        fetchData();
    }, []); // Empty dependency array ensures this effect runs only once
    //==================================== CONSULTAMOS LOS DATOS DE LA ORDEN DE VENTA CLIENTE y DIRECCION ==================================
    const { data: ordenVentaFetchData, loading, error } = useGet7V(API+"orders/"+ordenVentaId,state.token);
    useEffect(() => {
        if(ordenVentaFetchData && ordenVentaFetchData.order_id != undefined){
            //console.log(ordenVentaFetchData);
            setDescuento(ordenVentaFetchData.descuento);   
            setFecha(ordenVentaFetchData.createdAt);
            setClienteId(ordenVentaFetchData.clienteId.toString()); 
            setNoGuia(ordenVentaFetchData.noGuia);
            setPaqueteria(ordenVentaFetchData.paqueteria);  
            setNotas(ordenVentaFetchData.notas);
            setEstatusOrden(ordenVentaFetchData.status);
            setOrdenVenta(ordenVentaFetchData.order_id)
            setSaldoPendiente(ordenVentaFetchData.total - ordenVentaFetchData.saldoVenta);

            const datosDireccionTemp = {
                nombreCompleto: ordenVentaFetchData.nombreCompleto,
                calle: ordenVentaFetchData.calle,
                numExterior: ordenVentaFetchData.numExterior,
                numInterior: ordenVentaFetchData.numInterior,
                codigoPostal: ordenVentaFetchData.codigoPostal,
                ciudad: ordenVentaFetchData.ciudad,
                estado: ordenVentaFetchData.estado,
                pais: ordenVentaFetchData.pais,
            }
            setDatosDireccion(datosDireccionTemp);


            var usuarioId;
            //==========BUSCAMOS EL CLIENTE
            if (ordenVentaFetchData.clienteId) {           
                fetch(APIClientes+ordenVentaFetchData.clienteId, {
                    headers: {
                      'Authorization': `Bearer ${state.token}`,  
                      'Content-Type': 'application/json',
                    },
                  })  
                .then(response => response.json())
                .then(data => { 
                    //console.log(data);
                    const dataUsuario = data;
                    usuarioId = data.usuarioId;
                    //==========BUSCAMOS datos del usuario
                    fetch(APIUsers+usuarioId, {
                        headers: {
                          'Authorization': `Bearer ${state.token}`,  
                          'Content-Type': 'application/json',
                        },
                      })
                    .then(response => response.json())
                    .then(data => {
                        const usuarioCorreo = data.correo ? data.correo : '';                            
                        const clienteConEmail = { ...dataUsuario, correo: usuarioCorreo };   
                        setDatosCliente(clienteConEmail); 
                        setLoadingVenta(false);
                    })
                    .catch(error => {
                        setLoadingVenta(false);
                        console.error("Error fetching data from APIUsers:", error);
                        setErrMsg("Error al consultar Usuario");
                    });                
                })
                .catch(error => {
                    setLoadingVenta(false);
                    console.error("Error fetching data from APIClientes:", error);
                });
            } 
            setLoadingVenta(false); 
        }
        else{
            if(error){
                setSuccess(false);
                setLoadingVenta(false);
                setErrMsg(error || "Error de consulta");
            }
        }
    }, [ordenVentaFetchData,error]);
    //===================================================================================================================
    if(!authorized){
        return (             
          <Box className = "noAuthorizedContainer">
            <Typography className='noAuthorizedContainer401'>401</Typography>
            <Typography className='noAuthorizedContainertext'>Lo sentimos, no esta autorizado para ver esta pagina.</Typography>
          </Box>
        );
    }
    if (loadingCategoria || loadingVenta) { 
        return <Typography>Loading...</Typography>;
    }
    if (error) {
        return  <Alert ref={errRef}  severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert> ;
    }
    return (
        <Container maxWidth="lg" className="justified-container">
        <Box className= "admin-tableHeader" >
            <Typography className="admin-title" variant='h6'>Orden de Venta ({ordenVentaId})</Typography>
        </Box>
        <Box sx={{ width: '100%' }}>
                <Stepper activeStep={getActiveStep(estatusOrden)} alternativeLabel>
                    {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                    ))}
                </Stepper>
            </Box>
        <Alert ref={errRef}  severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert>            
        <Stack className="LoginFormContainer_admin" spacing={2} direction = {{xs:"column", md:"row", lg:"row"}} >
            <Grid container>
                <Grid item className="admin-gridLabel" xs={12} md = {4}>
                    <Typography>Fecha</Typography>
                </Grid>
                <Grid item className="admin-gridData" md= {8} >
                    <Typography>{fecha}</Typography>
                </Grid>   
                <Grid item className="admin-gridLabel" xs={12} md = {4}>
                    <Typography>Descuento</Typography>
                </Grid>
                <Grid item className="admin-gridData" md= {8} >
                    <Typography>{descuento ? descuento : ''}</Typography>
                </Grid> 
                <Grid item className="admin-gridLabel" xs={12} md = {4} >
                    <Typography sx={{wrap:'nowrap'}}>Cliente</Typography>
                </Grid>
                <Grid item className="admin-gridData"  md= {8} >
                    <Typography>{clienteId}</Typography>
                </Grid>
                <Grid item className="admin-gridLabel" xs={12} md = {4} >
                    <Typography sx={{wrap:'nowrap'}}>No. Guia</Typography>
                </Grid>
                <Grid item className="admin-gridData"  md= {8} >
                    <Typography>{noGuia ? noGuia : ''}</Typography>
                </Grid>
                <Grid item className="admin-gridLabel" xs={12} md = {4} >
                    <Typography sx={{wrap:'nowrap'}}>Paqueteria</Typography>
                </Grid>
                <Grid item className="admin-gridData"  md= {8} >
                    <Typography>{paqueteria ? paqueteria : ''}</Typography>
                </Grid>
                <Grid item className="admin-gridLabel" xs={12} md = {4} >
                    <Typography sx={{wrap:'nowrap'}}>Notas</Typography>
                </Grid>
                <Grid item className="admin-gridData"  md= {8} >
                    <Typography>{notas ? notas : ''}</Typography>
                </Grid>
            </Grid>  
            <DatosCliente datosCliente={datosCliente} datosDireccion={datosDireccion}/>                  
        </Stack>

        {existeOrden && 
            <TableVentasMov 
            ordenVentaId={ordenVentaId} 
            ordenVenta={ordenVenta}
            setTotalOrden={setTotalOrden}  
            edit={false}
            editMovimiento={estatusOrden == "surtido" ? true : false} 
            categoryData={categorias}
            clienteId={clienteId}
            saldoPendiente={saldoPendiente}
            />} 
        <Box className="Button_Container_admin">
             <Button variant="contained"  sx={{textTransform: 'none'}} onClick={handleSubmitReturn} className="primary-button-admin-outlined" >Regresar</Button>
        </Box>
    </Container>
    );
}
export default VentaDetail;