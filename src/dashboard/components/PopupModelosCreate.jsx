
import React, { useRef, useState, useEffect } from 'react';
import { Stack, TextField, Button, Typography, Box, IconButton, FormControl, InputLabel, Select, MenuItem, Alert} from "@mui/material"; 
import CloseIcon from '@mui/icons-material/Close';
import './popup.scss';
import useGet7 from '@hooks/useGet7';
import usePost2 from '@hooks/usePost2';
const API = process.env.REACT_APP_API_URL;
const APIMARCAS = API+'configurador/catalogoMarcas/?offset=0&limit=50';
const PopupModelosCreate = (props) => {
    const form = useRef(null);
    //ITEMS VARIABLES
    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');    
    const [success, setSuccess] = useState(false);
    const [marcas,setMarcas] = useState([]);
    const [errMsg, setErrMsg] = useState('');
    //Errores
    const [errorMarca, setErrorMarca] = useState(false);
    const [errorModelo, setErrorModelo] = useState(false);
    const { data: marcasFetchData, loading: loadingMa, error:errorMa } = useGet7(APIMARCAS);
    useEffect(() => {
        if(errorMa){
            setSuccess(false);
            setErrMsg("Error al consultar Marcas");
        }
        else{
            setMarcas(marcasFetchData.marcas)
        }
    }, [marcasFetchData,errorMa]);
    const handleSubmitReturn = (event) => {
        event.preventDefault();
        setMarca('');
        setModelo('');
        setErrorModelo(false);
        setErrorMarca(false);
        props.setTrigger(false);
     }   
    const handleMarca = (event) => {
        setMarca(event.target.value);
    };
    const handleSubmit = async(event) => {
        event.preventDefault();
        if (!marca) { setErrorMarca(true); } else { setErrorMarca(false); }
        if (!modelo) { setErrorModelo(true); } else { setErrorModelo(false); }
        if (!marca || !modelo) { return;  }
        const modeloUpper = modelo.toUpperCase().trim();
        const checkAPI = `${API}configurador/catalogoModelos/?modelo=${modeloUpper}`;
        try{
            const response = await fetch(checkAPI);
            if (response.ok) {
                const data = await response.json();
                // Filter by marca as well if needed
                const alreadyExists = data.modelos.some(m => m.marca.toUpperCase() === marca.toUpperCase());
                if (alreadyExists) {
                    alert("El modelo ya existe.");
                    return;
                }
            }
            if (response.status !== 404 && !response.ok) {
                throw new Error("Error al verificar el modelo.");
            }
            const modeloData = { marca, modelo: modeloUpper };
            const APIPost = API+"configurador/catalogoModelos/";
            const { success, data, error } = await usePost2(APIPost, modeloData);
            if (success){
                setSuccess(true);
                setMarca(''); 
                setModelo('');
                setErrorModelo(false);
                setErrorMarca(false);
                props.setTrigger(false);
                alert('Registro Guardado.')
            } else {
                setSuccess(false);
                setErrMsg(error || "Error occurred during the request");
            }
        } 
        catch (err) {
            console.error(err);
            setErrMsg("Ocurrió un error al validar el modelo.");
        }        
    }
    if (!success && (errorMa)) {
    return  (props.trigger) ? (
        <Box className="popup">
        <Box className='popup-inner'>
            <IconButton onClick={handleSubmitReturn} className='close-btn'><CloseIcon/></IconButton>
            <Alert sx={{marginTop:'30px'}} severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert>
            </Box>
            </Box> 
        ) : ""
    }
    return (
        (props.trigger) ? (
         <Box className="popup">
            <Box className='popup-inner'>
                
                <IconButton onClick={handleSubmitReturn} className='close-btn'><CloseIcon/></IconButton>
                {props.children}
                <Box className= "admin-tableHeaderPopup" >
                    <Typography className="admin-title" variant='h5'>Nuevo Modelo</Typography>
                </Box>
                <Stack className="LoginFormContainer_admin" spacing={2} direction = {{xs:"column", md:"column", lg:"row"}} >
                    <Box
                    className="Form_Container_admin"
                    component="form"
                    autoComplete="off"
                    ref={form}
                    noValidate
                    >
                        <Stack alignItems="center" spacing={2}>
                            <FormControl   error={errorMarca} className="InputBasic"  size="small" variant="outlined">
                                <InputLabel  id="ddl-marca-label">Marca *</InputLabel>
                                <Select 
                                    id="marca"
                                    name="marca"
                                    value={marca}
                                    label="Marca"
                                    onChange={handleMarca}
                                    MenuProps={{
                                        style: {zIndex: 2001}
                                    }}
                                    >
                                    {
                                        marcas && marcas !== undefined ?
                                        marcas.map((marca,index) =>{
                                            return (
                                                <MenuItem key={index} value={marca.marca}>{marca.marca}</MenuItem>
                                            )
                                        })
                                        : "No hay marcas"
                                    }
                                </Select>
                            </FormControl> 
                            <TextField className="InputBasic"
                                error={errorModelo}
                                required
                                id="modelo" 
                                label="Modelo" 
                                size="small"
                                name="marca"
                                autoComplete='on'
                                value={modelo}
                                onChange={e=>setModelo(e.target.value)}
                                inputProps={{maxLength:50 }}
                            ></TextField>                                      
                        </Stack>
                    </Box> 
                </Stack>
                <Box className="Button_Container_admin">
                    <Button variant="contained"  sx={{textTransform: 'none'}} onClick={handleSubmit} className="primary-button-admin" >Guardar</Button>
                    <Button variant="contained"  sx={{textTransform: 'none'}} onClick={handleSubmitReturn} className="primary-button-admin-outlined" >Regresar</Button>
                </Box>
            </Box>            
         </Box>
        ) : ""
     );     
 }
export default PopupModelosCreate;