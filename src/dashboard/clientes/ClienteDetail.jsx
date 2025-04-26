import { useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useRef, useState, useContext} from "react";
import { Box, Typography, Container, Button, Grid, Stack, Alert } from "@mui/material";
import TableClientesMovEdit from '../containers/tableClientesMovEdit';
import formatNumber  from '@utils/formatNumber';
import useGet7V from '@hooks/useGet7V';
import AppContext from '@context/AppContext';
const API = process.env.REACT_APP_API_URL;
const ClienteDetail = () => {
    const { state } = useContext(AppContext);
    const [authorized,setAuthorized] = useState(true);
    const{cliente_id} = useParams();
    const errRef = useRef();
    const [id, setId] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate(); const authorizedRoles = ['admin', 'contabilidad'];
    useEffect(() => {
       if (!authorizedRoles.includes(state.role)) {
         setAuthorized(false);
       }
     }, [state.role]); 
    const { data: clienteFetchData, loading, error } = useGet7V(API+"clientes/"+cliente_id, state.token);
    useEffect(() => {
        if(clienteFetchData && clienteFetchData.nombre != undefined){
            setId(clienteFetchData.id);
            setSuccess(true);
            setErrMsg("");
        } else {
            setSuccess(false);
            setErrMsg(error || "Error occurred during the request");
        }
    }, [clienteFetchData]);
    const handleSubmitReturn = (event) => {
        event.preventDefault();
        navigate('/Dashboard/Clientes');
    }   
    if (loading) {
        return <Typography>Loading...</Typography>;
    }
    if (error) {
        return  <Alert ref={errRef}  severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert> ;
    }
    return (
        <Container maxWidth="lg" className="justified-container">
             <Box className= "admin-tableHeader" >
                <Typography className="admin-title" variant='h5'>Contacto Cliente</Typography>
            </Box>
            <Alert severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert> 
            {clienteFetchData &&
            <Stack className="admin_gridContainer" spacing={2} direction = {{xs:"column", md:"column", lg:"row"}} >

                <Grid container>
                    <Grid item className="admin-gridLabel" xs={12} md = {4}>
                        <Typography>Id</Typography>
                    </Grid>
                    <Grid item className="admin-gridData" md= {8} >
                        <Typography>{clienteFetchData.id}</Typography>
                    </Grid>    
                    <Grid item className="admin-gridLabel" xs={12} md = {4}>
                        <Typography>Nombre</Typography>
                    </Grid>
                    <Grid item className="admin-gridData" md= {8} >
                        <Typography>{clienteFetchData.nombre}</Typography>
                    </Grid> 
                    <Grid item className="admin-gridLabel" xs={12} md = {4}>
                        <Typography>Apellidos</Typography>
                    </Grid>
                    <Grid item className="admin-gridData" md= {8} >
                        <Typography>{clienteFetchData.nombre} {clienteFetchData.apellidoPaterno} {clienteFetchData.apellidoMaterno}</Typography>
                    </Grid>  
                    <Grid item className="admin-gridLabel" xs={12} md = {4}>
                        <Typography>Correo</Typography>
                    </Grid>
                    <Grid item className="admin-gridData" md= {8} >
                        <Typography>Correo</Typography> {/*Preguntar a LUIS si se agreagara el correo */}
                    </Grid>                                    
                </Grid>
                <Grid container>
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Telefono</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{clienteFetchData.telefono}</Typography>
                    </Grid>    
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Saldo</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>$ {formatNumber(parseFloat(clienteFetchData.saldo))}</Typography>
                    </Grid>                                  
                </Grid>
            </Stack>
            }
            <Box className="Button_Container_admin">
                <Button variant="contained"  sx={{textTransform: 'none'}} onClick={handleSubmitReturn} className="primary-button-admin" >Regresar</Button>
                <Box className="saldoProveedor">
                    <Typography variant="h6" >Saldo del cliente:</Typography>
                    <Typography className="montoSaldoProveedor" >$ {formatNumber(parseFloat(clienteFetchData.saldo))}</Typography>
                </Box>
            </Box>
           <TableClientesMovEdit clienteId={id}/>
        </Container>
    );
}
export default ClienteDetail;