
import React, { useState, useEffect, useContext} from 'react';
import { Stack, 
    Typography, 
    Box, 
    IconButton,
    Alert,
    Grid,
} from "@mui/material"; 
import CloseIcon from '@mui/icons-material/Close';
import useGet7V from '@hooks/useGet7V';
import './popup.scss';
import formatNumber  from '@utils/formatNumber';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AppContext from '@context/AppContext';
const API = process.env.REACT_APP_API_URL;
const PopupClienteMovDetails = (props) => {
    const { state } = useContext(AppContext);
    const clienteMovimiento_id = props.id;
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const [clienteMovimiento, setClienteMovimiento] = useState([]);
    const handleSubmitReturn = (event) => {
        event.preventDefault();
        props.setTrigger(false);
    } 
    let APIBusqueda = "";
    if (props.tipoMovimiento == "movimiento")
    {
        APIBusqueda = `${API}cliente/clienteMovimiento/?id=${clienteMovimiento_id}`;
    }
    else if (props.tipoMovimiento == "venta") {
        APIBusqueda = `${API}orders/V2/get?order_id=${clienteMovimiento_id}`;        
    }
    else if (props.tipoMovimiento == "devolucion") {
       APIBusqueda = `${API}ventas/devolucionesVenta/?ordenDevolucionVenta=${clienteMovimiento_id}`;  
    }
    const { data: clienteMovimientoFetchData, loading, error } = useGet7V(APIBusqueda,state.token);
    useEffect(() => {
        if(props.tipoMovimiento == "movimiento" &&  clienteMovimientoFetchData && clienteMovimientoFetchData.movimientos != undefined){
            setClienteMovimiento(clienteMovimientoFetchData.movimientos[0]);
            setSuccess(true);
            setErrMsg("");
        } else 
        if (props.tipoMovimiento == "venta" &&  clienteMovimientoFetchData && clienteMovimientoFetchData.orders != undefined) {
            setClienteMovimiento(clienteMovimientoFetchData.orders[0]);
            setSuccess(true);
            setErrMsg("");
        } 
        else
        if (props.tipoMovimiento == "devolucion" &&  clienteMovimientoFetchData && clienteMovimientoFetchData.devoluciones != undefined) {
            setClienteMovimiento(clienteMovimientoFetchData.devoluciones[0]);
            setSuccess(true);
            setErrMsg("");
        } 
        else {
            setSuccess(false);
            setErrMsg(error || "Error occurredd during the request");
        }

        
    }, [clienteMovimientoFetchData,error]);


    const amount = clienteMovimiento.total || 
    clienteMovimiento.monto || 
    clienteMovimiento.precioTotalPromo || 
    clienteMovimiento.precioTotal || 
    0;
    if (loading) {
        return <Box>Loading...</Box>;
    }
    /*if (error) {
        return  <Alert ref={errRef}  severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert> ;
    }*/
     return (
        (props.trigger) ? (
         <Box className="popup">
            <Box className='popup-inner'> 
                <IconButton onClick={handleSubmitReturn} className='close-btn'><CloseIcon/></IconButton>
                {props.children}
                <Box className= "admin-tableHeaderPopup" >
                    <Typography className="admin-title" variant='h5'> Detalles del Movimiento {clienteMovimiento.tipo}({clienteMovimiento_id}) {clienteMovimiento.tipo == "Ingreso" ? <TrendingUpIcon  sx={{color:"green"}}/> : clienteMovimiento.tipo == "Egreso" ? <TrendingDownIcon  sx={{color:"red"}}/> : ''}</Typography>
                </Box>
                <Alert severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert> 
            {clienteMovimiento &&
            <Stack className="admin_gridContainer" spacing={2} direction = {{xs:"column", md:"column", lg:"column"}} >
                <Grid container>             
                    <Grid item className="admin-gridLabel" xs={12} md = {12} >
                        <Typography noWrap>Fecha</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {12} >
                        <Typography>{clienteMovimiento.fecha ? clienteMovimiento.fecha : clienteMovimiento.createdAt}</Typography>
                    </Grid>   
                    <Grid item className="admin-gridLabel" xs={12} md = {12} >
                        <Typography noWrap>Referencia</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {12} >
                        <Typography>{clienteMovimiento.referencia}</Typography>
                    </Grid>    
                    <Grid item className="admin-gridLabel" xs={12} md = {12} >
                        <Typography noWrap>Referencia asignada</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {12} >
                        <Typography>{clienteMovimiento.referenciaId}</Typography>
                    </Grid>    
                    <Grid item className="admin-gridLabel" xs={12} md = {12} >
                        <Typography noWrap>Concepto</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {12} >
                        <Typography>
                            {clienteMovimiento.ordenDevolucionVenta ? 'Devolución' : (clienteMovimiento.concepto || 'Venta')}
                        </Typography>
                    </Grid>       
                </Grid>
                <Grid container>
                    <Grid item className="admin-gridLabel" xs={12} md = {12} >
                        <Typography noWrap>Monto</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {12} >
                        <Typography>$ {formatNumber(parseFloat(amount))}</Typography>
                    </Grid>  
                    <Grid item className="admin-gridLabel" xs={12} md = {12} >
                        <Typography noWrap>Notas</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {12} >
                        <Typography>{clienteMovimiento.notas}</Typography>
                    </Grid> 
                </Grid>
            </Stack>
            }
            </Box>            
         </Box>
        ) : ""
     );
 };
 export default PopupClienteMovDetails;