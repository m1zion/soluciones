import { useNavigate, useParams } from "react-router-dom";
import React, {useEffect, useRef, useState, useContext} from "react";
import { Box, Typography, Container, Button, Grid, Stack, Alert } from "@mui/material";
//import TableProveedoresMovEdit from '../containers/tableProveedoresMovEdit';
import useGet7V from '@hooks/useGet7V';
import formatNumber  from '@utils/formatNumber';
import AppContext from '@context/AppContext';
const API = process.env.REACT_APP_API_URL;
const ProveedorDetail = () => {
    const { state } = useContext(AppContext);
    console.log("proveedorId");
    console.log(state.proveedorId);
    const [authorized,setAuthorized] = useState(true);
    const{proveedor_id} = useParams();
    const errRef = useRef();
    const [errMsg, setErrMsg] = useState('');
    const [id, setId] = useState('');
    const [success, setSuccess] = useState(true);  
    const authorizedRoles = ['proveedor', 'admin', 'contabilidad'];
    useEffect(() => {
      if (!authorizedRoles.includes(state.role)) {
        setAuthorized(false);
      }
    }, [state.role]); 
    const navigate = useNavigate();
    const { data: proveedorFetchData, loading, error } = useGet7V(API+"proveedores/"+proveedor_id,state.token);
    useEffect(() => {
        if(proveedorFetchData && proveedorFetchData.nombre != undefined){
            setId(proveedorFetchData.id);
            setSuccess(true);
            setErrMsg("");
        } else {
            if(error){
                setErrMsg(error || "Error occurred during the request");
                setSuccess(false);
            }
        }
    }, [proveedorFetchData]);
    const handleSubmitReturn = (event) => {
        event.preventDefault();
        navigate('/Dashboard/Proveedores');
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
        return <p>Loading...</p>;
    }
    if (error  && !success) {
        return  <Alert ref={errRef}  severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert> ;
    }
    return (
        <Container maxWidth="lg" className="justified-container">
             <Box className= "admin-tableHeader" >
                <Typography className="admin-title" variant='h5'>Contacto Proveedor</Typography>
            </Box>
            <Alert severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert> 
            {proveedorFetchData &&
            <Stack className="admin_gridContainer" spacing={2} direction = {{xs:"column", md:"column", lg:"row"}} >

                <Grid container>
                    <Grid item className="admin-gridLabel" xs={12} md = {4}>
                        <Typography>Id</Typography>
                    </Grid>
                    <Grid item className="admin-gridData" md= {8} >
                        <Typography>{proveedorFetchData.id}</Typography>
                    </Grid>    
                    <Grid item className="admin-gridLabel" xs={12} md = {4}>
                        <Typography>Nombre</Typography>
                    </Grid>
                    <Grid item className="admin-gridData" md= {8} >
                        <Typography>{proveedorFetchData.nombre}</Typography>
                    </Grid>  
                    <Grid item className="admin-gridLabel" xs={12} md = {4}>
                        <Typography>Correo</Typography>
                    </Grid>
                    <Grid item className="admin-gridData" md= {8} >
                        <Typography>{proveedorFetchData.email}</Typography>
                    </Grid>  
                    <Grid item className="admin-gridLabel" xs={12} md = {4}>
                        <Typography>Razon Social</Typography>
                    </Grid>
                    <Grid item className="admin-gridData" md= {8} >
                        <Typography>{proveedorFetchData.razonSocial}</Typography>
                    </Grid>                
                </Grid>
                <Grid container>
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Telefono</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{proveedorFetchData.telefono}</Typography>
                    </Grid>    
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Dirección Fiscal</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{proveedorFetchData.direccionFiscal}</Typography>
                    </Grid>    
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Notas</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{proveedorFetchData.notas}</Typography>
                    </Grid>                    
                </Grid>
            </Stack>
            }
            <Box className="Button_Container_admin">
                <Button variant="contained"  sx={{textTransform: 'none'}} onClick={handleSubmitReturn} className="primary-button-admin" >Regresar</Button>
                {/*No manejaremos contabilidad*/}
                {/*<Box className="saldoProveedor">
                    <Typography variant="h6" >Saldo del proveedor:</Typography>
                    <Typography className="montoSaldoProveedor" >$ {formatNumber(parseFloat(proveedorFetchData.saldo))}</Typography>
                </Box>*/}
            </Box>
            {/*<TableProveedoresMovEdit proveedorId={id}/>*/}
        </Container>
    );
}
export default ProveedorDetail;