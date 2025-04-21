import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Stack, TextField, Button, Typography, Box, Container, FormControl, InputLabel, Select, MenuItem, Alert} from "@mui/material"; 
import { useNavigate } from 'react-router-dom'; 
import useGet7 from '@hooks/useGet7';
import usePost2 from '@hooks/usePost2';
const API = process.env.REACT_APP_API_URL;
const APIMARCAS = API+'configurador/catalogoMarcas/?offset=0&limit=50';
const APICAJONES = API +'tablasConfigurador/cajonesCajuela/?offset=0&limit=50';
const APICARBASES = API +'tablasConfigurador/carbases/?offset=0&limit=50';
const ConfiguradorCreate = () => {
    const navigate = useNavigate();
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const errRef = useRef();
    const { data: marcasFetchData, loading: loadingMa, error:errorMa } = useGet7(APIMARCAS);
    useEffect(() => {
        if(errorMa){
            setSuccess(false);
            setErrMsg("Error al consultar Marcas");
        }
    }, [marcasFetchData,errorMa]);
    const marcas = marcasFetchData.marcas;
    const [anio, setAnio] = useState('');
    const [years, setYears] = useState([]);
    const form = useRef(null);
    const { data: cajonesCajuelaFetchData, loading: loadingCa, error:errorCa } = useGet7(APICAJONES);
    const cajonesCajuela = useMemo(() => {
        if (errorCa) {
            setSuccess(false);
            setErrMsg("Error al consultar Cajones");
            return;
        }
        return cajonesCajuelaFetchData.CajonesCajuela;
    }, [cajonesCajuelaFetchData, errorCa]);
    const { data: carBasesFetchData, loading: loadingCB, error:errorCB } = useGet7(APICARBASES);
    const carbases = useMemo(() => {
        if (!carBasesFetchData || !Array.isArray(carBasesFetchData.CarBases)) {
            console.error("Data is not an array or does not have CarBases property.");
            return [];
        }
        if (errorCB) {
            setSuccess(false);
            setErrMsg("Error al consultar Bases");
            return;
        }
        const uniqueModeloBases = Array.from(new Set(carBasesFetchData.CarBases.map(item => item.claveId)));
        return uniqueModeloBases;
    }, [carBasesFetchData, errorCB]);
    //console.log(carbases);
    //ITEMS VARIABLES
    const [id, setId] = useState('');
    const [marca,setMarca] = useState('');
    const [modelos,setModelos] = useState('');
    const [modelo, setModelo] = useState('');
    const [diametroBocinaFrontal, setDiametroBocinaFrontal] = useState('');
    const [profundidadBocinaFrontal, setProfundidadBocinaFrontal] = useState('');
    const [bocinaCompatibleFrontal, setBocinaCompatibleFrontal] = useState('');
    const [tipoBocinaFrontal, setTipoBocinaFrontal] = useState('');

    const [diametroBocinaTrasera, setDiametroBocinaTrasera] = useState('');
    const [profundidadBocinaTrasera, setProfundidadBocinaTrasera] = useState('');
    const [bocinaCompatibleTrasera, setBocinaCompatibleTrasera] = useState('');
    const [tipoBocinaTrasera, setTipoBocinaTrasera] = useState('');
    const [tamanioCajuela, setTamanioCajuela] = useState('');
    const [unDinAI, setUnDinAI] = useState('');
    const [unDinAIText, setUnDinAIText] = useState('');
    const [dobleDinAI, setDobleDinAI] = useState('');
    const [dobleDinAIText, setDobleDinAIText] = useState('');
    const [arnesAI, setArnesAI] = useState('');
    const [adaptadorAntenaAI, setAdaptadorAntenaAI] = useState('');
    const [calzaFrontalAI, setCalzaFrontalAI] = useState('');
    const [calzaTraseraAI, setCalzaTraseraAI] = useState('');
    const [unDinHF, setUnDinHF] = useState('');
    const [dobleDinHF, setDobleDinHF] = useState('');
    const [unDinHFText, setUnDinHFText] = useState('');
    const [dobleDinHFText, setDobleDinHFText] = useState('');
    const [arnesHF, setArnesHF] = useState('');
    const [adaptadorAntenaHF, setAdaptadorAntenaHF] = useState('');
    const [calzaFrontalHF, setCalzaFrontalHF] = useState('');
    const [calzaTraseraHF, setCalzaTraseraHF] = useState('');
    const [pantallaHF, setPantallaHF] = useState('');
    const [alta, setAlta] = useState('');
    const [baja, setBaja] = useState('');
    const [altaBaja, setAltaBaja] = useState('');
    const [niebla, setNiebla] = useState('');
    //Errores
    const [errorMarca, setErrorMarca] = useState(false);
    const [errorModelo, setErrorModelo] = useState(false);
    const [errorAnio, setErrorAnio] = useState(false);
    const [errorDiametroBocinaFrontal, setErrorDiametroBocinaFrontal] = useState(false);
    const [errorProfundidadBocinaFrontal, setErrorProfundidadBocinaFrontal] = useState(false);
    const [errorBocinaCompatibleFrontal, setErrorBocinaCompatibleFrontal] = useState(false);
    const [errorTipoBocinaFrontal, setErrorTipoBocinaFrontal] = useState(false);
    const [errorDiametroBocinaTrasera, setErrorDiametroBocinaTrasera] = useState(false);
    const [errorProfundidadBocinaTrasera, setErrorProfundidadBocinaTrasera] = useState(false);
    const [errorBocinaCompatibleTrasera, setErrorBocinaCompatibleTrasera] = useState(false);
    const [errorTipoBocinaTrasera, setErrorTipoBocinaTrasera] = useState(false);
    const [errorTamanioCajuela, setErrorTamanioCajuela] = useState(false);
    const [errorUnDinAI, setErrorUnDinAI] = useState(false);
    const [errorDobleDinAI, setErrorDobleDinAI] = useState(false);
    const [errorArnesAI, setErrorArnesAI] = useState(false);
    const [errorAdaptadorAntenaAI, setErrorAdaptadorAntenaAI] = useState(false);
    const [errorCalzaFrontalAI, setErrorCalzaFrontalAI] = useState(false);
    const [errorCalzaTraseraAI, setErrorCalzaTraseraAI] = useState(false);
    const [errorUnDinHF, setErrorUnDinHF] = useState(false);
    const [errorDobleDinHF, setErrorDobleDinHF] = useState(false);
    const [errorArnesHF, setErrorArnesHF] = useState(false);
    const [errorAdaptadorAntenaHF, setErrorAdaptadorAntenaHF] = useState(false);
    const [errorCalzaFrontalHF, setErrorCalzaFrontalHF] = useState(false);
    const [errorCalzaTraseraHF, setErrorCalzaTraseraHF] = useState(false);
    const [errorPantallaHF, setErrorPantallaHF] = useState(false);
    const [errorAlta, setErrorAlta] = useState(false);
    const [errorBaja, setErrorBaja] = useState(false);
    const [errorAltaBaja, setErrorAltaBaja] = useState(false);
    const [errorNiebla, setErrorNiebla] = useState(false);
    //const APIMODELOS = API+'configurador/modelos/?offset=0&limit=100&marca='+marca;
    // Function to reset form fields
    const handleUnDinAITextChange = (e) => {
        setUnDinAIText(e.target.value);
        setUnDinAI(''); // Set unDinAI to empty when unDinAIText changes
    };
    const handleUnDinAIChange = (e) => {
        setUnDinAI(e.target.value);
        setUnDinAIText(''); // Set unDinAIText to empty when unDinAI changes
    };
    const handleDobleDinAITextChange = (e) => {
        setDobleDinAIText(e.target.value);
        setDobleDinAI(''); 
    };    
    const handleDobleDinAIChange = (e) => {
        setDobleDinAI(e.target.value);
        setDobleDinAIText('');
    };
    const handleUnDinHFTextChange = (e) => {
        setUnDinHFText(e.target.value);
        setUnDinHF(''); 
    };
    const handleUnDinHFChange = (e) => {
        setUnDinHF(e.target.value);
        setUnDinHFText(''); 
    }
    const handleDobleDinHFTextChange = (e) => {
        setDobleDinHFText(e.target.value);
        setDobleDinHF(''); 
    };    
    const handleDobleDinHFChange = (e) => {
        setDobleDinHF(e.target.value);
        setDobleDinHFText('');
    };

    const resetForm = () => {
        setErrMsg('');
        setSuccess(false);
        setAnio('');
        setYears([]);
        setId('');
        setMarca('');
        setModelos('');
        setModelo('');
        setDiametroBocinaFrontal('');
        setProfundidadBocinaFrontal('');
        setBocinaCompatibleFrontal('');
        setTipoBocinaFrontal('');
        setDiametroBocinaTrasera('');
        setProfundidadBocinaTrasera('');
        setBocinaCompatibleTrasera('');
        setTipoBocinaTrasera('');
        setTamanioCajuela('');
        setUnDinAI('');
        setUnDinAIText('');
        setDobleDinAI('');
        setDobleDinAIText('');
        setArnesAI('');
        setAdaptadorAntenaAI('');
        setCalzaFrontalAI('');
        setCalzaTraseraAI('');
        setUnDinHF('');
        setDobleDinHF('');
        setArnesHF('');
        setAdaptadorAntenaHF('');
        setCalzaFrontalHF('');
        setCalzaTraseraHF('');
        setPantallaHF('');
        setAlta('');
        setBaja('');
        setAltaBaja('');
        setNiebla('');
        // Error states
        setErrorMarca(false);
        setErrorModelo(false);
        setErrorAnio(false);
        setErrorDiametroBocinaFrontal(false);
        setErrorProfundidadBocinaFrontal(false);
        setErrorBocinaCompatibleFrontal(false);
        setErrorTipoBocinaFrontal(false);
        setErrorDiametroBocinaTrasera(false);
        setErrorProfundidadBocinaTrasera(false);
        setErrorBocinaCompatibleTrasera(false);
        setErrorTipoBocinaTrasera(false);
        setErrorTamanioCajuela(false);
        setErrorUnDinAI(false);
        setErrorDobleDinAI(false);
        setErrorArnesAI(false);
        setErrorAdaptadorAntenaAI(false);
        setErrorCalzaFrontalAI(false);
        setErrorCalzaTraseraAI(false);
        setErrorUnDinHF(false);
        setErrorDobleDinHF(false);
        setErrorArnesHF(false);
        setErrorAdaptadorAntenaHF(false);
        setErrorCalzaFrontalHF(false);
        setErrorCalzaTraseraHF(false);
        setErrorPantallaHF(false);
        setErrorAlta(false);
        setErrorBaja(false);
        setErrorAltaBaja(false);
        setErrorNiebla(false); 
    };

    const APIMODELOS = API+'configurador/CatalogoModelos/?offset=0&limit=300';
    //const modelosGet = useGet5(APIMODELOS,marca);
    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const pastYears = Array.from({ length: 12 }, (_, index) => currentYear - index - 1);
        const pastYearsHalf = Array.from({ length: 12 }, (_, index) => (currentYear+1) - index - .5);
        const futureYears = Array.from({ length: 2 }, (_, index) => currentYear + index).reverse();
        const allYears = [ ...futureYears,...pastYears,...pastYearsHalf];
        setYears(allYears);
    }, []);
    const handleMarca = async (event) => {
        setModelo('');
        setMarca(event.target.value);
        try {
            const response = await fetch(`${APIMODELOS}&marca=${event.target.value}`);
            if (response.status === 404) {
                // Handle the case where no results are found (404 Not Found)
                setModelos([]);
              } else {
            const data = await response.json();
            const modelos = data.modelos;

            if (Array.isArray(modelos)) {
                const dt = [...new Set(modelos.map(item => item.modelo))];
                setModelos(dt);
            } 
            } 
        }
        catch (error) {
            console.error('Error fetching models:', error);
        }
    };
    const handleModelo = (event) =>{  //Para los años hay que volver a filtrar los modelos pero ahora por modelo
        setModelo(event.target.value);
    }
    const handleSubmitReturn = (event) => {
        event.preventDefault();
        navigate('/Dashboard/Configurador');
    }   
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!marca) { setErrorMarca(true); } else { setErrorMarca(false); }
        if (!modelo) { setErrorModelo(true); } else { setErrorModelo(false); }
        if (!anio) { setErrorAnio(true); } else { setErrorAnio(false); }
        if (!marca || !modelo || !anio) {
            return;
        }
        let unDinAIValue = '';
        let dobleDinAIValue = '';
        let unDinHFValue = '';
        let dobleDinHFValue = '';

        if (unDinAIText != ""){ unDinAIValue = unDinAIText} else {unDinAIValue = unDinAI};
        if (dobleDinAIText != ""){ dobleDinAIValue = dobleDinAIText} else {dobleDinAIValue = dobleDinAI};
        if (unDinHFText != ""){ unDinHFValue = unDinHFText} else {unDinHFValue = unDinHF};
        if (dobleDinHFText != ""){ dobleDinHFValue = dobleDinHFText} else {dobleDinHFValue = dobleDinHF};

        var detalleModeloData={marca,modelo,Anio:anio.toString(),diametroBocinaFrontal,profundidadBocinaFrontal,bocinaCompatibleFrontal,
            tipoBocinaFrontal, diametroBocinaTrasera, profundidadBocinaTrasera, bocinaCompatibleTrasera,
            tipoBocinaTrasera, tamanioCajuela, 
            unDinAI:unDinAIValue, 
            dobleDinAI:dobleDinAIValue,
            arnesAI, adaptadorAntenaAI, calzaFrontalAI, calzaTraseraAI,
            unDinHF: unDinHFValue, 
            dobleDinHF: dobleDinHFValue, 
            arnesHF, adaptadorAntenaHF,calzaFrontalHF, calzaTraseraHF, pantallaHF,
            alta, baja, altaBaja, niebla};
        const APIPost = API+"configurador/detalleModelo/";
        //const APIPost = "http://localhost:3001/detalleModelo";
        //console.log(detalleModeloData);
        const { success, data, error } = await usePost2(APIPost, detalleModeloData);
        if (success){
            setSuccess(true);
            setErrMsg("Registro Guardado");
            alert('Registro Guardado.')
            navigate('/Dashboard/Configurador');
            //resetForm();
        } else {
            setSuccess(false);
            setErrMsg(error || "Error occurred during the request");
        }
     }
    const handleAnio = (event) => {
        setAnio(event.target.value);
    };
    if (loadingCa || loadingMa || loadingCB) {
        return <Box>Loading...</Box>;
    }
    if (errorCa || errorMa || errorCB) {
        return  <Alert ref={errRef}  severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert>
    }
    return (
        <Container maxWidth="lg" className="justified-container">
             <Box className= "admin-tableHeader" >
                 <Typography className="admin-title" variant='h5'>Crear nueva configuración</Typography>
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
                        <FormControl error={errorModelo} className="InputBasic"  size="small" variant="outlined">
                            <InputLabel id="ddl-modelo-label">Modelo *</InputLabel>
                            <Select
                                label="Modelo"
                                id="modelo"
                                name="modelo"
                                value={modelo}
                                onChange={handleModelo}
                            >
                            {
                            modelos && modelos !== undefined ?
                            modelos.map((mod,index) =>{
                                return (
                                    <MenuItem key={index} value={mod}>{mod}</MenuItem>
                                )
                            })
                            : "No hay Modelo"
                            }
                            </Select>
                        </FormControl>
                        <FormControl error={errorAnio} className="InputBasic"  size="small" variant="outlined">
                            <InputLabel id="ddl-anio-label">Año *</InputLabel>
                            <Select
                                label="Año"
                                id="anio"
                                name="anio"
                                value={anio}
                                onChange={handleAnio}
                            >
                            {
                                years && years !== undefined ?
                                years.map((year,index) =>{
                                    return (
                                        <MenuItem key={index} value={year}>{year}</MenuItem>
                                    )
                                })
                                : "No hay Año"
                            }
                            </Select>
                        </FormControl>
                        <TextField className="InputBasic"
                             error={errorDiametroBocinaFrontal}                             
                             id="diametroBocinaFrontal" 
                             label="Diametro Bocina Frontal" 
                             size="small"
                             name="diametroBocinaFrontal"
                             autoComplete='off'
                             value={diametroBocinaFrontal}
                             onChange={e=>setDiametroBocinaFrontal(e.target.value)}
                             inputProps={{maxLength:10 }}
                        ></TextField> 
                        <TextField className="InputBasic"
                             error={errorProfundidadBocinaFrontal}                             
                             id="profundidadBocinaFrontal" 
                             label="Profundidad Bocina Frontal" 
                             size="small"
                             name="profundidadBocinaFrontal"
                             autoComplete='off'
                             value={profundidadBocinaFrontal}
                             onChange={e=>setProfundidadBocinaFrontal(e.target.value)}
                             inputProps={{maxLength:10 }}
                        ></TextField> 
                        <TextField className="InputBasic"
                             error={errorBocinaCompatibleFrontal}                             
                             id="bocinaCompatibleFrontal" 
                             label="Bocina Compatible Frontal" 
                             size="small"
                             name="bocinaCompatibleFrontal"
                             autoComplete='off'
                             value={bocinaCompatibleFrontal}
                             onChange={e=>setBocinaCompatibleFrontal(e.target.value)}
                             inputProps={{maxLength:10 }}
                        ></TextField>    
                        <TextField className="InputBasic"
                             error={errorTipoBocinaFrontal}                             
                             id="tipoBocinaFrontal" 
                             label="Tipo Bocina Frontal" 
                             size="small"
                             name="tipoBocinaFrontal"
                             autoComplete='off'
                             value={tipoBocinaFrontal}
                             onChange={e=>setTipoBocinaFrontal(e.target.value)}
                             inputProps={{maxLength:10 }}
                        ></TextField>
                        <TextField className="InputBasic"                            
                             id="diametroBocinaTrasera" 
                             label="Diametro Bocina Trasera" 
                             size="small"
                             name="diametroBocinaTrasera"
                             autoComplete='off'
                             value={diametroBocinaTrasera}
                             onChange={e=>setDiametroBocinaTrasera(e.target.value)}
                             inputProps={{maxLength:10 }}
                        ></TextField>
                        <TextField className="InputBasic"                            
                             id="profundidadBocinaTrasera" 
                             label="Profundidad Bocina Trasera" 
                             size="small"
                             name="profundidadBocinaTrasera"
                             autoComplete='off'
                             value={profundidadBocinaTrasera}
                             onChange={e=>setProfundidadBocinaTrasera(e.target.value)}
                             inputProps={{maxLength:10 }}
                        ></TextField>
                        <TextField className="InputBasic"                            
                             id="bocinaCompatibleTrasera" 
                             label="Bocina Compatible Trasera" 
                             size="small"
                             name="bocinaCompatibleTrasera"
                             autoComplete='off'
                             value={bocinaCompatibleTrasera}
                             onChange={e=>setBocinaCompatibleTrasera(e.target.value)}
                             inputProps={{maxLength:50 }}
                        ></TextField>
                        <TextField className="InputBasic"                            
                             id="tipoBocinaTrasera" 
                             label="Tipo Bocina Trasera" 
                             size="small"
                             name="tipoBocinaTrasera"
                             autoComplete='off'
                             value={tipoBocinaTrasera}
                             onChange={e=>setTipoBocinaTrasera(e.target.value)}
                             inputProps={{maxLength:50 }}
                        ></TextField>
                        {/*<TextField className="InputBasic"                            
                             id="tamanioCajuela" 
                             label="Tamaño Cajuela" 
                             size="small"
                             name="tamanioCajuela"
                             autoComplete='off'
                             value={tamanioCajuela}
                             onChange={e=>setTamanioCajuela(e.target.value)}
                             inputProps={{maxLength:50 }}
                        ></TextField>*/}
                        <FormControl  className="InputBasic"  size="small" variant="outlined">
                            <InputLabel  id="ddl-tamanioCajuela-label">Tamaño Cajuela</InputLabel>
                            <Select 
                                id="tamanioCajuela"
                                name="tamanioCajuela"
                                value={tamanioCajuela}
                                label="Tamaño Cajuela"
                                onChange={e=>setTamanioCajuela(e.target.value)}
                                MenuProps={{
                                    style: {zIndex: 2001}
                                }}
                                >
                                {
                                    cajonesCajuela && cajonesCajuela !== undefined ?
                                    cajonesCajuela.map((cajonesCajuelaData,index) =>{
                                        return (
                                            <MenuItem key={index} value={cajonesCajuelaData.claveCajones}>{cajonesCajuelaData.claveCajones} ({cajonesCajuelaData.clave}) </MenuItem>
                                        )
                                    })
                                    : "No hay cajones"
                                }
                            </Select>
                        </FormControl>
                        <Box sx={{display:'flex', width:'90%'}}>
                            <TextField className="InputBasic"                            
                                id="unDinAIText" 
                                label="Un Din AI" 
                                size="small"
                                name="unDinAIText"
                                autoComplete='off'
                                value={unDinAIText}
                                onChange={handleUnDinAITextChange}
                                inputProps={{maxLength:50 }}
                            ></TextField>
                            <Typography sx={{display:'flex', alignItems:'center', margin:'0 2px'}}>o</Typography>
                            <FormControl  className="InputBasic"  size="small" variant="outlined">
                                <InputLabel  id="ddl-unDinAI-label">Un Din AI</InputLabel>
                                <Select 
                                    id="unDinAI"
                                    name="unDinAI"
                                    value={unDinAI}
                                    label="Un Din AI"
                                    onChange={handleUnDinAIChange}
                                    MenuProps={{
                                        style: {zIndex: 2001}
                                    }}
                                    >
                                    {
                                        carbases && carbases !== undefined ?
                                        carbases.map((carbasesData,index) =>{
                                            return (
                                                <MenuItem key={index} value={carbasesData}>{carbasesData} </MenuItem>
                                            )
                                        })
                                        : "Error de consulta"
                                    }
                                </Select>
                            </FormControl>
                        </Box>                    
                        <Box sx={{display:'flex', width:'90%'}}>
                            <TextField className="InputBasic"                            
                                    id="dobleDinAIText" 
                                    label="Doble Din AI" 
                                    size="small"
                                    name="dobleDinAIText"
                                    autoComplete='off'
                                    value={dobleDinAIText}
                                    onChange={handleDobleDinAITextChange}
                                    inputProps={{maxLength:50 }}
                            ></TextField>
                            <Typography sx={{display:'flex', alignItems:'center', margin:'0 2px'}}>o</Typography>
                            <FormControl  className="InputBasic"  size="small" variant="outlined">
                                <InputLabel  id="ddl-dobleDinAI-label">Doble Din AI</InputLabel>
                                <Select 
                                    id="dobleDinAI"
                                    name="dobleDinAI"
                                    value={dobleDinAI}
                                    label="Doble Din AI"
                                    onChange={handleDobleDinAIChange}
                                    MenuProps={{
                                        style: {zIndex: 2001}
                                    }}
                                    >
                                    {
                                        carbases && carbases !== undefined ?
                                        carbases.map((carbasesData,index) =>{
                                            return (
                                                <MenuItem key={index} value={carbasesData}>{carbasesData} </MenuItem>
                                            )
                                        })
                                        : "Error de consulta"
                                    }
                                </Select>
                            </FormControl>
                        </Box>                        
                        <TextField className="InputBasic"                            
                             id="arnesAI" 
                             label="Arnes AI" 
                             size="small"
                             name="arnesAI"
                             autoComplete='off'
                             value={arnesAI}
                             onChange={e=>setArnesAI(e.target.value)}
                             inputProps={{maxLength:50 }}
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
                             id="adaptadorAntenaAI" 
                             label="Adaptador Antena AI" 
                             size="small"
                             name="adaptadorAntenaAI"
                             autoComplete='off'
                             value={adaptadorAntenaAI}
                             onChange={e=>setAdaptadorAntenaAI(e.target.value)}
                             inputProps={{maxLength:50 }}
                        ></TextField>
                        <TextField className="InputBasic"                            
                             id="calzaFrontalAI" 
                             label="calza Frontal AI" 
                             size="small"
                             name="calzaFrontalAI"
                             autoComplete='off'
                             value={calzaFrontalAI}
                             onChange={e=>setCalzaFrontalAI(e.target.value)}
                             inputProps={{maxLength:50 }}
                        ></TextField>
                        <TextField className="InputBasic"                            
                             id="calzaTraseraAI" 
                             label="Calza Trasera AI" 
                             size="small"
                             name="calzaTraseraAI"
                             autoComplete='off'
                             value={calzaTraseraAI}
                             onChange={e=>setCalzaTraseraAI(e.target.value)}
                             inputProps={{maxLength:50 }}
                        ></TextField>


                        <Box sx={{display:'flex', width:'90%'}}>
                            <TextField className="InputBasic"                            
                                id="unDinHFText" 
                                label="Un Din HF" 
                                size="small"
                                name="unDinHFText"
                                autoComplete='off'
                                value={unDinHFText}
                                onChange={handleUnDinHFTextChange}
                                inputProps={{maxLength:50 }}
                            ></TextField>
                            <Typography sx={{display:'flex', alignItems:'center', margin:'0 2px'}}>o</Typography>
                            <FormControl  className="InputBasic"  size="small" variant="outlined">
                                <InputLabel  id="ddl-unDinHF-label">Un Din HF</InputLabel>
                                <Select 
                                    id="unDinHF"
                                    name="unDinHF"
                                    value={unDinHF}
                                    label="Un Din HF"
                                    onChange={handleUnDinHFChange}
                                    MenuProps={{
                                        style: {zIndex: 2001}
                                    }}
                                    >
                                    {
                                        carbases && carbases !== undefined ?
                                        carbases.map((carbasesData,index) =>{
                                            return (
                                                <MenuItem key={index} value={carbasesData}>{carbasesData} </MenuItem>
                                            )
                                        })
                                        : "Error de consulta"
                                    }
                                </Select>
                            </FormControl>
                        </Box>
                       

                        <Box sx={{display:'flex', width:'90%'}}>
                            <TextField className="InputBasic"                            
                                    id="dobleDinHFText" 
                                    label="Doble Din HF" 
                                    size="small"
                                    name="dobleDinHFText"
                                    autoComplete='off'
                                    value={dobleDinHFText}
                                    onChange={handleDobleDinHFTextChange}
                                    inputProps={{maxLength:50 }}
                            ></TextField>
                            <Typography sx={{display:'flex', alignItems:'center', margin:'0 2px'}}>o</Typography>
                            <FormControl  className="InputBasic"  size="small" variant="outlined">
                                <InputLabel  id="ddl-dobleDinHF-label">Doble Din HF</InputLabel>
                                <Select 
                                    id="dobleDinHF"
                                    name="dobleDinHF"
                                    value={dobleDinHF}
                                    label="Doble Din HF"
                                    onChange={handleDobleDinHFChange}
                                    MenuProps={{
                                        style: {zIndex: 2001}
                                    }}
                                    >
                                    {
                                        carbases && carbases !== undefined ?
                                        carbases.map((carbasesData,index) =>{
                                            return (
                                                <MenuItem key={index} value={carbasesData}>{carbasesData} </MenuItem>
                                            )
                                        })
                                        : "Error de consulta"
                                    }
                                </Select>
                            </FormControl>
                        </Box>


                        <TextField className="InputBasic"                            
                             id="arnesHF" 
                             label="Arnes HF" 
                             size="small"
                             name="arnesHF"
                             autoComplete='off'
                             value={arnesHF}
                             onChange={e=>setArnesHF(e.target.value)}
                             inputProps={{maxLength:50 }}
                        ></TextField>
                        <TextField className="InputBasic"                            
                             id="adaptadorAntenaHF" 
                             label="Adaptador Antena HF" 
                             size="small"
                             name="adaptadorAntenaHF"
                             autoComplete='off'
                             value={adaptadorAntenaHF}
                             onChange={e=>setAdaptadorAntenaHF(e.target.value)}
                             inputProps={{maxLength:50 }}
                        ></TextField>
                        <TextField className="InputBasic"                            
                             id="calzaFrontalHF" 
                             label="Calza Frontal HF" 
                             size="small"
                             name="calzaFrontalHF"
                             autoComplete='off'
                             value={calzaFrontalHF}
                             onChange={e=>setCalzaFrontalHF(e.target.value)}
                             inputProps={{maxLength:50 }}
                        ></TextField>
                        <TextField className="InputBasic"                            
                             id="calzaTraseraHF" 
                             label="Calza Trasera HF" 
                             size="small"
                             name="calzaTraseraHF"
                             autoComplete='off'
                             value={calzaTraseraHF}
                             onChange={e=>setCalzaTraseraHF(e.target.value)}
                             inputProps={{maxLength:50 }}
                        ></TextField>
                        <TextField className="InputBasic"                            
                             id="pantallaHF" 
                             label="Pantalla HF" 
                             size="small"
                             name="pantallaHF"
                             autoComplete='off'
                             value={pantallaHF}
                             onChange={e=>setPantallaHF(e.target.value)}
                             inputProps={{maxLength:50 }}
                        ></TextField>
                        <TextField className="InputBasic"                            
                             id="alta" 
                             label="Alta" 
                             size="small"
                             name="alta"
                             autoComplete='off'
                             value={alta}
                             onChange={e=>setAlta(e.target.value)}
                             inputProps={{maxLength:50 }}
                        ></TextField>
                        <TextField className="InputBasic"                            
                             id="baja" 
                             label="Baja" 
                             size="small"
                             name="baja"
                             autoComplete='off'
                             value={baja}
                             onChange={e=>setBaja(e.target.value)}
                             inputProps={{maxLength:50 }}
                        ></TextField>
                        <TextField className="InputBasic"                            
                             id="altaBaja" 
                             label="Alta Baja" 
                             size="small"
                             name="altaBaja"
                             autoComplete='off'
                             value={altaBaja}
                             onChange={e=>setAltaBaja(e.target.value)}
                             inputProps={{maxLength:50 }}
                        ></TextField>
                        <TextField className="InputBasic"                            
                             id="niebla" 
                             label="Niebla" 
                             size="small"
                             name="niebla"
                             autoComplete='off'
                             value={niebla}
                             onChange={e=>setNiebla(e.target.value)}
                             inputProps={{maxLength:50 }}
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
 export default ConfiguradorCreate;