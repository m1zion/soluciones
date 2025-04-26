
import React, { useRef, useState } from 'react';
import { Stack, TextField, Button, Typography, Box, Container, IconButton, Alert} from "@mui/material"; 
import { useNavigate } from 'react-router-dom'; 
import CloseIcon from '@mui/icons-material/Close';
import usePost2 from '@hooks/usePost2';
import './popup.scss';
const API = process.env.REACT_APP_API_URL;
const PopupMarcasCreate = (props) => {
    const form = useRef(null);
    const [errMsg, setErrMsg] = useState('');
    const [marca, setMarca] = useState('');
    const [success, setSuccess] = useState(false);
    //Errores
    const [errorMarca, setErrorMarca] = useState(false);
    const handleSubmitReturn = (event) => {
        event.preventDefault();
        props.setTrigger(false);
        //navigate('/Dashboard/ConfiguradorMarcas');
    }   
    const handleSubmit = async(event) => {
        event.preventDefault();
         if (!marca) { 
            setErrorMarca(true); 
            return; 
        } else { 
            setErrorMarca(false); 
        }

        const marcaUpper = marca.toUpperCase().trim();
        const checkAPI = `${API}configurador/catalogoMarcas/?marca=${marcaUpper}`;

        try {
            const response = await fetch(checkAPI);
            if (response.ok) {
                const data = await response.json();
                const alreadyExists = data.marcas?.some(m => m.marca.toUpperCase() === marcaUpper);
                if (alreadyExists) {
                    alert("La marca ya existe.");
                    return;
                }
            }
            if (response.status !== 404 && !response.ok) {
                throw new Error("Error al verificar la marca.");
            }
            const marcaData = { marca: marcaUpper };
            const APIPost = API + "configurador/catalogoMarcas/";
            const { success, data, error } = await usePost2(APIPost, marcaData);
            if (success){
                setSuccess(true);
                setMarca('');
                props.setTrigger(false);
                alert('Registro Guardado.')
            } else {
                setSuccess(false);
                setErrMsg(error || "Error occurred during the request");
            }
        } catch (err) {
            console.error(err);
            setErrMsg("Ocurrió un error al validar la marca.");
        }       
    }
    return (
        (props.trigger) ? (
         <Box className="popup">
            <Box className='popup-inner'>
                
                <IconButton onClick={handleSubmitReturn} className='close-btn'><CloseIcon/></IconButton>
                {props.children}
                <Box className= "admin-tableHeaderPopup" >
                    <Typography className="admin-title" variant='h5'>Nueva marca</Typography>
                </Box>
                <Alert severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert> 
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
                                error={errorMarca}
                                required
                                id="marca" 
                                label="Marca" 
                                size="small"
                                name="marca"
                                autoComplete='on'
                                value={marca}
                                onChange={e=>setMarca(e.target.value)}
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
 export default PopupMarcasCreate;