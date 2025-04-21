
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Stack, 
    Typography, 
    Box, 
    IconButton,
    Alert,
    Grid,
} from "@mui/material"; 
import { useNavigate } from 'react-router-dom'; 
import CloseIcon from '@mui/icons-material/Close';
import useGet7 from '@hooks/useGet7';
import './popup.scss';
import formatNumber  from '@utils/formatNumber';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
const API = process.env.REACT_APP_API_URL;
const PopupProveedorMovDetails = (props) => {
    const proveedorMovimiento_id = props.id;
    const errRef = useRef();
    const navigate = useNavigate();
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const [proveedorMovimiento, setProveedorMovimiento] = useState([]);
    const handleSubmitReturn = (event) => {
        event.preventDefault();
        props.setTrigger(false);
    } 
    let APIBusqueda = "";
    if (props.tipoMovimiento == "movimiento")
    {
        APIBusqueda = `${API}proveedores/proveedorMovimiento/?id=${proveedorMovimiento_id}`;
    }
    else if (props.tipoMovimiento == "compra") {
        APIBusqueda = `${API}proveedores/ordenesCompra/?ordenCompra=${proveedorMovimiento_id}`;        
    }
    else if (props.tipoMovimiento == "devolucion") {
        APIBusqueda = `${API}proveedores/devolucionesCompra/?ordenDevolucion=${proveedorMovimiento_id}`;        
    }
    const { data: proveedorMovimientoFetchData, loading, error } = useGet7(APIBusqueda);
    useEffect(() => {
        if(props.tipoMovimiento == "movimiento" &&  proveedorMovimientoFetchData && proveedorMovimientoFetchData.movimientos != undefined){
            setProveedorMovimiento(proveedorMovimientoFetchData.movimientos[0]);
            setSuccess(true);
            setErrMsg("");
        } else 
        if (props.tipoMovimiento == "compra" &&  proveedorMovimientoFetchData && proveedorMovimientoFetchData.ordenesCompra != undefined) {
            setProveedorMovimiento(proveedorMovimientoFetchData.ordenesCompra[0]);
            setSuccess(true);
            setErrMsg("");
        } else
        if (props.tipoMovimiento == "devolucion" &&  proveedorMovimientoFetchData && proveedorMovimientoFetchData.devoluciones != undefined) {
            setProveedorMovimiento(proveedorMovimientoFetchData.devoluciones[0]);
            setSuccess(true);
            setErrMsg("");
        } else {
            setSuccess(false);
            setErrMsg(error || "Error occurredd during the request");
        }
    }, [proveedorMovimientoFetchData,error]);

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
                    <Typography className="admin-title" variant='h5'> Detalles del Movimiento {proveedorMovimiento.tipo}({proveedorMovimiento_id}) {proveedorMovimiento.tipo == "Ingreso" ? <TrendingUpIcon  sx={{color:"green"}}/> : proveedorMovimiento.tipo == "Egreso" ? <TrendingDownIcon  sx={{color:"red"}}/> : ''}</Typography>
                </Box>
                <Alert severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert> 
            {proveedorMovimiento &&
            <Stack className="admin_gridContainer" spacing={2} direction = {{xs:"column", md:"column", lg:"column"}} >
                <Grid container>             
                    <Grid item className="admin-gridLabel" xs={12} md = {12} >
                        <Typography noWrap>Fecha</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {12} >
                        <Typography>{proveedorMovimiento.fecha}</Typography>
                    </Grid>   
                    <Grid item className="admin-gridLabel" xs={12} md = {12} >
                        <Typography noWrap>Referencia</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {12} >
                        <Typography>{proveedorMovimiento.referencia}</Typography>
                    </Grid>    
                    <Grid item className="admin-gridLabel" xs={12} md = {12} >
                        <Typography noWrap>Referencia asignada</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {12} >
                        <Typography>{proveedorMovimiento.referenciaId}</Typography>
                    </Grid>    
                    <Grid item className="admin-gridLabel" xs={12} md = {12} >
                        <Typography noWrap>Concepto</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {12} >
                        <Typography>{proveedorMovimiento.concepto ? proveedorMovimiento.concepto : `Orden de compra/devolucion`}</Typography>
                    </Grid>       
                </Grid>
                <Grid container>
                    <Grid item className="admin-gridLabel" xs={12} md = {12} >
                        <Typography noWrap>Monto</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {12} >
                        <Typography>$ {formatNumber(parseFloat(proveedorMovimiento.monto ? proveedorMovimiento.monto : proveedorMovimiento.total))}</Typography>
                    </Grid>  
                    <Grid item className="admin-gridLabel" xs={12} md = {12} >
                        <Typography noWrap>Notas</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {12} >
                        <Typography>{proveedorMovimiento.notas}</Typography>
                    </Grid> 
                </Grid>
            </Stack>
            }
            </Box>            
         </Box>
        ) : ""
     );
 };
 export default PopupProveedorMovDetails;