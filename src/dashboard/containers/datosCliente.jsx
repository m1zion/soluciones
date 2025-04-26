import { Box, Grid, Stack,Typography } from "@mui/material";
import React from "react";
const DatosCliente = ({datosCliente,datosDireccion}) => {
    const nombre = datosCliente.nombre ? datosCliente.nombre : ''; 
    const telefono = datosCliente.telefono ? datosCliente.telefono : '';  
    const correo = datosCliente.correo ? datosCliente.correo : '';  //CAMBIAR LUIS
    return (
    <Box
    className="Form_Container_admin"
    component="form"
    autoComplete="off"
    noValidate
    >
        <Stack className="VentasDatosClienteContainer" spacing={2} direction = "column">
            <Typography variant='subtitle1' className='datosClienteTitle'>Datos del cliente</Typography>
            <Grid container>
                <Grid item className="admin-gridLabel" xs={12} md = {4}>
                    <Typography>Nombre del cliente</Typography>
                </Grid>
                <Grid item className="admin-gridData" md= {8} >
                    <Typography>{nombre}</Typography>
                </Grid>   
                <Grid item className="admin-gridLabel" xs={12} md = {4}>
                    <Typography>Telefono</Typography>
                </Grid>
                <Grid item className="admin-gridData" md= {8} >
                    <Typography>{telefono}</Typography>
                </Grid>    
                <Grid item className="admin-gridLabel" xs={12} md = {4}>
                    <Typography>Correo electronico</Typography>
                </Grid>
                <Grid item className="admin-gridData" md= {8} >
                    <Typography>{correo}</Typography>
                </Grid>            
            </Grid>                                        
        </Stack>
        <Stack className="VentasDatosClienteContainer" spacing={2} direction = "column">
            <Typography variant='subtitle1' className='datosClienteTitle'>Detalles de envío</Typography>
            <Grid container>
                <Grid item className="admin-gridLabel" xs={12} md = {4}>
                    <Typography>Nombre</Typography>
                </Grid>
                <Grid item className="admin-gridData" md= {8} >
                    <Typography>{datosDireccion?.nombreCompleto ? datosDireccion.nombreCompleto : '-'}</Typography>
                </Grid>   
                <Grid item className="admin-gridLabel" xs={12} md = {4}>
                    <Typography>Direccion</Typography>
                </Grid>
                <Grid item className="admin-gridData" md= {8} >
                    <Typography>{datosDireccion?.calle ? datosDireccion.calle : '-'} {datosDireccion?.numExterior ? datosDireccion.numExterior : ''} {datosDireccion?.numInterior ? datosDireccion.numInterior : ''}</Typography>
                </Grid>    
                <Grid item className="admin-gridLabel" xs={12} md = {4}>
                    <Typography>C.P.</Typography>
                </Grid>
                <Grid item className="admin-gridData" md= {8} >
                    <Typography>{datosDireccion?.codigoPostal ? datosDireccion.codigoPostal : ''}</Typography>
                </Grid> 
                <Grid item className="admin-gridLabel" xs={12} md = {4}>
                    <Typography>Ciudad</Typography>
                </Grid>
                <Grid item className="admin-gridData" md= {8} >
                    <Typography>{datosDireccion?.ciudad ? datosDireccion.ciudad : ''}</Typography>
                </Grid>   
                <Grid item className="admin-gridLabel" xs={12} md = {4}>
                    <Typography>Estado</Typography>
                </Grid>
                <Grid item className="admin-gridData" md= {8} >
                    <Typography>{datosDireccion?.estado ? datosDireccion.estado : ''}</Typography>
                </Grid> 
                <Grid item className="admin-gridLabel" xs={12} md = {4}>
                    <Typography>Pais</Typography>
                </Grid>
                <Grid item className="admin-gridData" md= {8} >
                    <Typography>{datosDireccion?.pais ? datosDireccion.pais : ''}</Typography>
                </Grid>          
            </Grid>                                        
        </Stack>
    </Box>
    );
}
export default DatosCliente;