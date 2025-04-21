import { useNavigate, useParams } from "react-router-dom";
import React, {useEffect, useState} from "react";
import { Box, Typography, Container, Button, Grid, Stack, Alert } from "@mui/material";
import useGet7 from '@hooks/useGet7';
const API = process.env.REACT_APP_API_URL;
const ConfiguradorDetail = () => {
    const{configurador_id} = useParams();
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const [tamanioCajuela, setTamanioCajuela] = useState('');
    const [unDinAI, setUnDinAI] = useState('');
    const [dobleDinAI, setDobleDinAI] = useState('');
    const [unDinHF, setUnDinHF] = useState('');
    const [dobleDinHF, setDobleDinHF] = useState('');
    const [detalleModeloData,setDetalleModeloData] = useState([]);
    const setCajuela = (newValue) => {
        if (Array.isArray(newValue)) {
          if (newValue.length > 0) {
            const firstItem = newValue[0];
            setTamanioCajuela(firstItem.claveTipoCajones);
          } else {
            setTamanioCajuela('');
          }
        } else {
          setTamanioCajuela(newValue);
        }
    };
    const handleDobleDInAI = (newValue) => {
        if (Array.isArray(newValue)) {
          if (newValue.length > 0) {
            const firstItem = newValue[0];
            setDobleDinAI(firstItem.claveId);
          } else {
            setDobleDinAI('');
          }
        } else {
            setDobleDinAI(newValue);
        }
    };
    const handleUnDinAI = (newValue) => {
        if (Array.isArray(newValue)) {
          if (newValue.length > 0) {
            const firstItem = newValue[0];
            setUnDinAI(firstItem.claveId);
          } else {
            setUnDinAI('');
          }
        } else {
            setUnDinAI(newValue);
        }
    };
    const handleDobleDInHF = (newValue) => {
        if (Array.isArray(newValue)) {
          if (newValue.length > 0) {
            const firstItem = newValue[0];
            setDobleDinHF(firstItem.claveId);
          } else {
            setDobleDinHF('');
          }
        } else {
            setDobleDinHF(newValue);
        }
    };
    const handleUnDinHF = (newValue) => {
        if (Array.isArray(newValue)) {
          if (newValue.length > 0) {
            const firstItem = newValue[0];
            setUnDinHF(firstItem.claveId);
          } else {
            setUnDinHF('');
          }
        } else {
            setUnDinHF(newValue);
        }
    };
    const { data: detalleModeloFetchData, loading, error } = useGet7(API+"configurador/detalleModelo/?id="+configurador_id);
     useEffect(() => {
        if(detalleModeloFetchData && detalleModeloFetchData.modelo != undefined){
            const detalleModeloDataTemp = detalleModeloFetchData.modelo;
            setCajuela(detalleModeloDataTemp.tamanioCajuela); 
            handleUnDinAI(detalleModeloDataTemp.unDinAI)
            handleDobleDInAI(detalleModeloDataTemp.dobleDinAI);
            handleUnDinHF(detalleModeloDataTemp.unDinHF)
            handleDobleDInHF(detalleModeloDataTemp.dobleDinHF);
            setDetalleModeloData(detalleModeloDataTemp);
            setSuccess(true);
            setErrMsg("");
        } else {
            if(error){
                setSuccess(false);
                setErrMsg(error || "Error de consulta");
            }
        }
    }, [detalleModeloFetchData,error]);
    const handleSubmitReturn = (event) => {
        event.preventDefault();
        navigate('/Dashboard/Configurador');
    }   
    if (loading) {
        return <Typography>Loading...</Typography>;
    }
    if (error) {
        return  <Alert severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert> ;
    }
    return (
        <Container maxWidth="lg" className="justified-container">
             <Box className= "admin-tableHeader" >
                <Typography className="admin-title" variant='h5'>Configuración Auto</Typography>
            </Box>
            <Alert severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert> 
            {detalleModeloData &&
            <Stack className="admin_gridContainer" spacing={2} direction = {{xs:"column", md:"column", lg:"row"}} >

                <Grid container>
                    <Grid item className="admin-gridLabel" xs={12} md = {4}>
                        <Typography>Id</Typography>
                    </Grid>
                    <Grid item className="admin-gridData" md= {8} >
                        <Typography>{detalleModeloData.id}</Typography>
                    </Grid>   
                      
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Marca</Typography>
                    </Grid> 
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{detalleModeloData.marca}</Typography>
                    </Grid>   
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Modelo</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{detalleModeloData.modelo}</Typography>
                    </Grid> 
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Año</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{detalleModeloData.Anio}</Typography>
                    </Grid>                                    
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography  sx={{wrap:'nowrap'}}>Diametro Bocina Frontal</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{detalleModeloData.diametroBocinaFrontal}</Typography>
                    </Grid>  
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography sx={{wrap:'nowrap'}}>Profundidad Bocina Frontal</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{detalleModeloData.profundidadBocinaFrontal}</Typography>
                    </Grid>  
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography sx={{wrap:'nowrap'}}>Bocina Compatible Frontal</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{detalleModeloData.bocinaCompatibleFrontal}</Typography>
                    </Grid>  
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Tipo Bocina Frontal</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{detalleModeloData.tipoBocinaFrontal}</Typography>
                    </Grid>  
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography sx={{wrap:'nowrap'}}>Diametro Bocina Trasera</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{detalleModeloData.diametroBocinaTrasera}</Typography>
                    </Grid>  
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography sx={{wrap:'nowrap'}}>Profundidad Bocina Trasera</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{detalleModeloData.profundidadBocinaTrasera}</Typography>
                    </Grid>  
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography sx={{wrap:'nowrap'}}>Bocina Compatible Trasera</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{detalleModeloData.bocinaCompatibleTrasera}</Typography>
                    </Grid>  
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Tipo Bocina Trasera</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{detalleModeloData.tipoBocinaTrasera}</Typography>
                    </Grid>
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Tamaño Cajuela</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{tamanioCajuela}</Typography>
                    </Grid>   
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Un Din AI</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{unDinAI}</Typography>
                    </Grid>  
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Doble Din AI</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{dobleDinAI}</Typography>
                    </Grid>  
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Arnes AI</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{detalleModeloData.arnesAI}</Typography>
                    </Grid>              
                </Grid>
                <Grid container>
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography sx={{wrap:'nowrap'}}>Adaptador Antena AI</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{detalleModeloData.adaptadorAntenaAI}</Typography>
                    </Grid>  
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Calza Frontal AI</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{detalleModeloData.calzaFrontalAI}</Typography>
                    </Grid>
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Calza Trasera AI</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{detalleModeloData.calzaTraseraAI}</Typography>
                    </Grid>                               
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Un Din HF</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{unDinHF}</Typography>
                    </Grid> 
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Doble Din HF</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{dobleDinHF}</Typography>
                    </Grid>
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Arnes HF</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{detalleModeloData.arnesHF}</Typography>
                    </Grid>
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography sx={{wrap:'nowrap'}}>Adaptador Antena HF</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{detalleModeloData.adaptadorAntenaHF}</Typography>
                    </Grid>
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Calza Frontal HF</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{detalleModeloData.calzaFrontalHF}</Typography>
                    </Grid>
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Calza Trasera HF</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{detalleModeloData.calzaTraseraHF}</Typography>
                    </Grid>
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Pantalla HF</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{detalleModeloData.pantallaHF}</Typography>
                    </Grid>
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Alta</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{detalleModeloData.alta}</Typography>
                    </Grid>
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Baja</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{detalleModeloData.baja}</Typography>
                    </Grid>
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Alta Baja</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{detalleModeloData.altaBaja}</Typography>
                    </Grid><Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Niebla</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{detalleModeloData.niebla}</Typography>
                    </Grid>
                </Grid>
            </Stack>
            }
            <Box className="Button_Container_admin">
                <Button variant="contained"  sx={{textTransform: 'none'}} onClick={handleSubmitReturn} className="primary-button-admin" >Regresar</Button>
                </Box>
        </Container>
    );
}
export default ConfiguradorDetail;