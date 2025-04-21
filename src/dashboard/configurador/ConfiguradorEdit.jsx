import React, { useRef, useState,  useEffect, useMemo } from 'react';
import { useNavigate, useParams} from "react-router-dom";
import {Stack, Box,Select,MenuItem,FormControl, InputLabel, Container, Button, TextField, Alert, Typography, CircularProgress} from "@mui/material"; 
import useGet7 from '@hooks/useGet7';
import usePatch from '@hooks/usePatch';
const API = process.env.REACT_APP_API_URL;
const APIMARCAS = API+'configurador/catalogoMarcas/?offset=0&limit=50';
const APIMODELOS = API+'configurador/CatalogoModelos/?offset=0&limit=300';
const APICAJONES = API +'tablasConfigurador/cajonesCajuela/';
const APICARBASES = API +'tablasConfigurador/carbases/';
const ConfiguradorEdit = () => {
    const [marcas,setMarcas] = useState('');
    const [modelos,setModelos] = useState('');
    const errRef = useRef();
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const{configurador_id} = useParams();
    const { data: marcasFetchData, loading: loadingMa, error:errorMa } = useGet7(APIMARCAS);
    useEffect(() => {
        if(errorMa){
            setSuccess(false);
            setErrMsg("Error al consultar Marcas");
        }
        else{
            setSuccess(true);
            setErrMsg("");
            setMarcas(marcasFetchData.marcas);
        }
    }, [marcasFetchData,errorMa]);
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
    //const marcas = marcasFetchData.marcas;
    
    const navigate = useNavigate();
    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const pastYears = Array.from({ length: 12 }, (_, index) => currentYear - index - 1);
        const pastYearsHalf = Array.from({ length: 12 }, (_, index) => (currentYear + 1) - index - .5);
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
    const form = useRef(null);
    //ITEMS VARIABLES
    const [id, setId] = useState('');
    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');
    const [anio, setAnio] = useState('');
    const [years, setYears] = useState([]);
    const [diametroBocinaFrontal, setDiametroBocinaFrontal] = useState('');
    const [profundidadBocinaFrontal, setProfundidadBocinaFrontal] = useState('');
    const [bocinaCompatibleFrontal, setBocinaCompatibleFrontal] = useState('');
    const [tipoBocinaFrontal, setTipoBocinaFrontal] = useState('');
    const [diametroBocinaTrasera, setDiametroBocinaTrasera] = useState('');
    const [profundidadBocinaTrasera, setProfundidadBocinaTrasera] = useState('');
    const [bocinaCompatibleTrasera, setBocinaCompatibleTrasera] = useState('');
    const [tipoBocinaTrasera, setTipoBocinaTrasera] = useState('');
    const [tamanioCajuela, setTamanioCajuela] = useState('');
    //Las siguientes funciones evaluan si es un array o no en los campos que asi sea requerido
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
            setDobleDinAIText(newValue);
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
            setUnDinAIText(newValue);
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
            setDobleDinHFText(newValue);
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
            setUnDinHFText(newValue);
        }
    };

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

    //Cargamos los datos de la configuracion
    const { data: detalleModeloFetchData, loading, error } = useGet7(API+"configurador/detalleModelo/?id="+configurador_id);
    //const { data: detalleModeloFetchData, loading, error } = useGet7(API+"configurador/detalleModelo/?marca=RAM&modelo=RAM 1500&Anio=2024");
    //const { data: detalleModeloFetchData, loading, error } = useGet7("http://localhost:3001/detalleModelo/"+configurador_id);
    useEffect(() => {
    if(detalleModeloFetchData && detalleModeloFetchData.modelo != undefined){
        const detalleModeloData = detalleModeloFetchData.modelo;
        setId(detalleModeloData.id);
        setMarca(detalleModeloData.marca);
        setModelo(detalleModeloData.modelo);
        setAnio(detalleModeloData.Anio);
        setDiametroBocinaFrontal(detalleModeloData.diametroBocinaFrontal);
        setProfundidadBocinaFrontal(detalleModeloData.profundidadBocinaFrontal);
        setBocinaCompatibleFrontal(detalleModeloData.bocinaCompatibleFrontal);
        setTipoBocinaFrontal(detalleModeloData.tipoBocinaFrontal);
        setDiametroBocinaTrasera(detalleModeloData.diametroBocinaTrasera);
        setProfundidadBocinaTrasera(detalleModeloData.profundidadBocinaTrasera);
        setBocinaCompatibleTrasera(detalleModeloData.bocinaCompatibleTrasera);
        setTipoBocinaTrasera(detalleModeloData.tipoBocinaTrasera);
        setCajuela(detalleModeloData.tamanioCajuela); //hacemos un setter intermedio para determinar si es array o string
        handleUnDinAI(detalleModeloData.unDinAI)
        handleDobleDInAI(detalleModeloData.dobleDinAI);
        //setDobleDinAIText(detalleModeloData.dobleDinAI);
        //setUnDinAIText(detalleModeloData.unDinAI);
        setArnesAI(detalleModeloData.arnesAI);
        setAdaptadorAntenaAI(detalleModeloData.adaptadorAntenaAI);
        setCalzaFrontalAI(detalleModeloData.calzaFrontalAI);
        setCalzaTraseraAI(detalleModeloData.calzaTraseraAI);
        handleUnDinHF(detalleModeloData.unDinHF)
        handleDobleDInHF(detalleModeloData.dobleDinHF);
        //setUnDinHFText(detalleModeloData.unDinHF);
        //setDobleDinHFText(detalleModeloData.dobleDinHF);
        setArnesHF(detalleModeloData.arnesHF);
        setAdaptadorAntenaHF(detalleModeloData.adaptadorAntenaHF);
        setCalzaFrontalHF(detalleModeloData.calzaFrontalHF);
        setCalzaTraseraHF(detalleModeloData.calzaTraseraHF);
        setPantallaHF(detalleModeloData.pantallaHF);
        setAlta(detalleModeloData.alta);
        setBaja(detalleModeloData.baja);
        setAltaBaja(detalleModeloData.altaBaja);
        setNiebla(detalleModeloData.niebla);
        }
        else{
            if(error){
                setSuccess(false);
                setErrMsg(error || "Error de consulta");
            }
        }
    }, [detalleModeloFetchData,error]);

    //Cargamos los modelos una vez que la marca se carga
    useEffect(() => {
        const fetchModelos = async () => {
            try {
            const response = await fetch(`${APIMODELOS}&marca=${marca}`);
            if (response.status === 404) {
                setModelos([]);
            } 
            else {
                const data = await response.json();
                const modelos = data.modelos;
                if (Array.isArray(modelos)) {
                    const uniqueModelos = [...new Set(modelos.map(item => item.modelo))];
                    setModelos(uniqueModelos);
                }
            }
            } catch (error) {
            console.error('Error fetching models:', error);
            }
        };          
        if (marca) {
            fetchModelos();
        }
    }, [marca]);

/*


    const { data: modelosFetchData, loading: loadingMo, error:errorMo } = useGet7(APIMODELOS+"&marca="+marca);
    useEffect(() => {
        if(errorMo){
            setSuccess(false);
            setErrMsg("Error al consultar Modelos");
            setModelos([]);
        }
        else {
            setSuccess(true);
            setErrMsg("");
            const modelos = modelosFetchData.modelos;
            if (Array.isArray(modelos)) {
                const uniqueModelos = [...new Set(modelos.map(item => item.modelo))];
                setModelos(uniqueModelos);
            }
        }
    }, [modelosFetchData,errorMo,marca]);*/



    const handleSubmitReturn = (event) => {
        event.preventDefault();
        navigate('/Dashboard/Configurador');
    }   
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!marca) { setErrorMarca(true); } else { setErrorMarca(false); }
        if (!marca) {
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

        var detalleModeloData={marca,modelo,Anio: anio,diametroBocinaFrontal,profundidadBocinaFrontal,bocinaCompatibleFrontal,
            tipoBocinaFrontal, diametroBocinaTrasera, profundidadBocinaTrasera, bocinaCompatibleTrasera,
            tipoBocinaTrasera, tamanioCajuela,  unDinAI:unDinAIValue, 
            dobleDinAI:dobleDinAIValue,
            arnesAI, adaptadorAntenaAI, calzaFrontalAI, calzaTraseraAI,
            unDinHF: unDinHFValue, 
            dobleDinHF: dobleDinHFValue,  arnesHF, adaptadorAntenaHF,
            calzaFrontalHF, calzaTraseraHF, pantallaHF,
            alta, baja, altaBaja, niebla};
        const APIPut = API+"configurador/detalleModelo/"+configurador_id;
        //const APIPut = "http://localhost:3001/detalleModelo/"+configurador_id;
        const { success, data, error } = await usePatch(APIPut, detalleModeloData);
        if (success){
            setSuccess(true);
            setErrMsg("Registro Guardado");
            alert('Registro Actualizado.')
            navigate('/Dashboard/Configurador');
        } else {
            setSuccess(false);
            setErrMsg(error || "Error occurred during the request");
        }
    }
    const handleAnio = (event) => {
        setAnio(event.target.value);
    };

    if (loading || loadingMa) {
        return <Typography>Loading...</Typography>;
    }
    if (error || errorMa) {
        return  <Alert ref={errRef}  severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert> ;
    }
    /*if (!marcas?.length){
        return  <Alert severity="error"  className="errmsg" aria-live="assertive" >Error al consultar Marcas</Alert> ; 
    }
    if (!modelos?.length){
        return  <Alert severity="error"  className="errmsg" aria-live="assertive" >Error al consultar Modelos</Alert> ; 
    }*/
    return (
        <Container maxWidth="lg" className="justified-container">
            <Box className= "admin-tableHeader" >
                <Typography className="admin-title" variant='h5'>Editar configuración de auto</Typography>
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
                    {!!marcas?.length && (
                    <FormControl  error={errorMarca} className="InputBasic"  size="small" variant="outlined">
                        <InputLabel  id="ddl-marca-label">Marca *</InputLabel>
                        <Select  
                            id="marca"
                            name="marca"
                            value={marca}
                            label="Marca"
                            onChange={handleMarca}
                            >
                            {
                            marcas.map(({label,marca}) => {
                                return (
                                    <MenuItem key={marca} value={marca}>
                                        {marca}
                                    </MenuItem>
                                );
                            })
                            }
                        </Select>
                    </FormControl>   
                    )}
                    {!!modelos?.length && (    
                    <FormControl error={errorModelo} className="InputBasic"  size="small" variant="outlined">
                        <InputLabel id="ddl-modelo-label">Modelo *</InputLabel>
                        <Select
                            label="Modelo"
                            id="modelo"
                            name="modelo"
                            onChange={handleModelo}
                            value={modelo}
                        >
                            <MenuItem value=""></MenuItem>
                            {
                            modelos && modelos !== undefined ?
                            modelos.map((mod,index) =>{
                                return (
                                    <MenuItem key={index} value={mod}>{mod}</MenuItem>
                                )
                            })
                            : ""
                            }
                        </Select>
                    </FormControl>
                    )}
                    <FormControl error={errorAnio} className="InputBasic"  size="small" variant="outlined">
                        <InputLabel id="ddl-modelo-label">Año *</InputLabel>
                        <Select
                            label="Año"
                            id="anio"
                            name="anio"
                            onChange={handleAnio}
                            value={anio}
                        >
                            <MenuItem value=""></MenuItem>
                            {
                            years && years !== undefined ?
                            years.map((year,index) =>{
                                return (
                                    <MenuItem key={index} value={year}>{year}</MenuItem>
                                )
                            })
                            : ""
                            }
                        </Select>
                    </FormControl>
                    <TextField className="InputBasic"                           
                        id="diametroBocinaFrontal" 
                        label="Diametro Bocina Frontal" 
                        size="small"
                        name="diametroBocinaFrontal"
                        autoComplete='off'
                        value={diametroBocinaFrontal ? diametroBocinaFrontal : ''}
                        onChange={e=>setDiametroBocinaFrontal(e.target.value)}
                        inputProps={{maxLength:10 }}
                    ></TextField>
                    <TextField className="InputBasic"                            
                            id="profundidadBocinaFrontal" 
                            label="Profundidad Bocina Frontal" 
                            size="small"
                            name="profundidadBocinaFrontal"
                            autoComplete='off'
                            value={profundidadBocinaFrontal ? profundidadBocinaFrontal : ''}
                            onChange={e=>setProfundidadBocinaFrontal(e.target.value)}
                            inputProps={{maxLength:10 }}
                    ></TextField> 
                    <TextField className="InputBasic"                           
                            id="bocinaCompatibleFrontal" 
                            label="Bocina Compatible Frontal" 
                            size="small"
                            name="bocinaCompatibleFrontal"
                            autoComplete='off'
                            value={bocinaCompatibleFrontal ? bocinaCompatibleFrontal : ''}
                            onChange={e=>setBocinaCompatibleFrontal(e.target.value)}
                            inputProps={{maxLength:10 }}
                    ></TextField>    
                    <TextField className="InputBasic"                           
                            id="tipoBocinaFrontal" 
                            label="Tipo Bocina Frontal" 
                            size="small"
                            name="tipoBocinaFrontal"
                            autoComplete='off'
                            value={tipoBocinaFrontal ? tipoBocinaFrontal : ''}
                            onChange={e=>setTipoBocinaFrontal(e.target.value)}
                            inputProps={{maxLength:10 }}
                    ></TextField>
                    <TextField className="InputBasic"                            
                            id="diametroBocinaTrasera" 
                            label="Diametro Bocina Trasera" 
                            size="small"
                            name="diametroBocinaTrasera"
                            autoComplete='off'
                            value={diametroBocinaTrasera ? diametroBocinaTrasera : ''}
                            onChange={e=>setDiametroBocinaTrasera(e.target.value)}
                            inputProps={{maxLength:10 }}
                    ></TextField>
                    <TextField className="InputBasic"                            
                            id="profundidadBocinaTrasera" 
                            label="Profundidad Bocina Trasera" 
                            size="small"
                            name="profundidadBocinaTrasera"
                            autoComplete='off'
                            value={profundidadBocinaTrasera ? profundidadBocinaTrasera: ''}
                            onChange={e=>setProfundidadBocinaTrasera(e.target.value)}
                            inputProps={{maxLength:10 }}
                    ></TextField>
                    <TextField className="InputBasic"                            
                            id="bocinaCompatibleTrasera" 
                            label="Bocina Compatible Trasera" 
                            size="small"
                            name="bocinaCompatibleTrasera"
                            autoComplete='off'
                            value={bocinaCompatibleTrasera ? bocinaCompatibleTrasera : ''}
                            onChange={e=>setBocinaCompatibleTrasera(e.target.value)}
                            inputProps={{maxLength:50 }}
                    ></TextField>
                    <TextField className="InputBasic"                            
                            id="tipoBocinaTrasera" 
                            label="Tipo Bocina Trasera" 
                            size="small"
                            name="tipoBocinaTrasera"
                            autoComplete='off'
                            value={tipoBocinaTrasera ? tipoBocinaTrasera : ''}
                            onChange={e=>setTipoBocinaTrasera(e.target.value)}
                            inputProps={{maxLength:50 }}
                    ></TextField>
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
                                value={unDinAI ? unDinAI : ''}
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
                                value={dobleDinAI ? dobleDinAI : ''}
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
                            value={arnesAI ? arnesAI : ''}
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
                             value={adaptadorAntenaAI ? adaptadorAntenaAI : ''}
                             onChange={e=>setAdaptadorAntenaAI(e.target.value)}
                             inputProps={{maxLength:50 }}
                        ></TextField>
                        <TextField className="InputBasic"                            
                             id="calzaFrontalAI" 
                             label="calza Frontal AI" 
                             size="small"
                             name="calzaFrontalAI"
                             autoComplete='off'
                             value={calzaFrontalAI ? calzaFrontalAI: '' }
                             onChange={e=>setCalzaFrontalAI(e.target.value)}
                             inputProps={{maxLength:50 }}
                        ></TextField>
                        <TextField className="InputBasic"                            
                             id="calzaTraseraAI" 
                             label="Calza Trasera AI" 
                             size="small"
                             name="calzaTraseraAI"
                             autoComplete='off'
                             value={calzaTraseraAI ? calzaTraseraAI : ''}
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
                             value={arnesHF ? arnesHF : ''}
                             onChange={e=>setArnesHF(e.target.value)}
                             inputProps={{maxLength:50 }}
                        ></TextField>
                        <TextField className="InputBasic"                            
                             id="adaptadorAntenaHF" 
                             label="Adaptador Antena HF" 
                             size="small"
                             name="adaptadorAntenaHF"
                             autoComplete='off'
                             value={adaptadorAntenaHF ? adaptadorAntenaHF : ''}
                             onChange={e=>setAdaptadorAntenaHF(e.target.value)}
                             inputProps={{maxLength:50 }}
                        ></TextField>
                        <TextField className="InputBasic"                            
                             id="calzaFrontalHF" 
                             label="Calza Frontal HF" 
                             size="small"
                             name="calzaFrontalHF"
                             autoComplete='off'
                             value={calzaFrontalHF ? calzaFrontalHF : ''}
                             onChange={e=>setCalzaFrontalHF(e.target.value)}
                             inputProps={{maxLength:50 }}
                        ></TextField>
                         <TextField className="InputBasic"                            
                             id="calzaTraseraHF" 
                             label="Calza Trasera HF" 
                             size="small"
                             name="calzaTraseraHF"
                             autoComplete='off'
                             value={calzaTraseraHF ? calzaTraseraHF : ''}
                             onChange={e=>setCalzaTraseraHF(e.target.value)}
                             inputProps={{maxLength:50 }}
                        ></TextField>
                        <TextField className="InputBasic"                            
                             id="pantallaHF" 
                             label="Pantalla HF" 
                             size="small"
                             name="pantallaHF"
                             autoComplete='off'
                             value={pantallaHF ? pantallaHF : ''}
                             onChange={e=>setPantallaHF(e.target.value)}
                             inputProps={{maxLength:50 }}
                        ></TextField>
                        <TextField className="InputBasic"                            
                             id="alta" 
                             label="Alta" 
                             size="small"
                             name="alta"
                             autoComplete='off'
                             value={alta ? alta : ''}
                             onChange={e=>setAlta(e.target.value)}
                             inputProps={{maxLength:50 }}
                        ></TextField>
                        <TextField className="InputBasic"                            
                             id="baja" 
                             label="Baja" 
                             size="small"
                             name="baja"
                             autoComplete='off'
                             value={baja ? baja : ''}
                             onChange={e=>setBaja(e.target.value)}
                             inputProps={{maxLength:50 }}
                        ></TextField>
                        <TextField className="InputBasic"                            
                             id="altaBaja" 
                             label="Alta Baja" 
                             size="small"
                             name="altaBaja"
                             autoComplete='off'
                             value={altaBaja ? altaBaja : ''}
                             onChange={e=>setAltaBaja(e.target.value)}
                             inputProps={{maxLength:50 }}
                        ></TextField>
                        <TextField className="InputBasic"                            
                             id="niebla" 
                             label="Niebla" 
                             size="small"
                             name="niebla"
                             autoComplete='off'
                             value={niebla ? niebla : ''}
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
export default ConfiguradorEdit;