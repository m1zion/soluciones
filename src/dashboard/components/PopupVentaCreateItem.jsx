
import React, { useRef, useState, useEffect, useContext } from 'react';
import { Stack, TextField, Button, Typography, Box, IconButton, Alert, FormControl, InputLabel, Select, MenuItem} from "@mui/material"; 
import CloseIcon from '@mui/icons-material/Close';
import usePost2V from '@hooks/usePost2V';
import './popup.scss';
import useGet7 from '@hooks/useGet7';
import AppContext from '@context/AppContext';
const API = process.env.REACT_APP_API_URL;
const APICATEGORIAS = API+'categories/?offset=0&limit=100';
const PopupVentaCreateItem = (props) => {
    const ordenVentaIdValue = props.ordenVentaId;   
    const { state } = useContext(AppContext);
    const form = useRef(null);
    const [errMsg, setErrMsg] = useState('');
    const [successProducto, setSuccessProducto] = useState(false);
    const [successExistencias, setSuccessExistencias] = useState(true);
    const [successSubmit, setSuccessSubmit] = useState(false);
    const { data: categoriasFetchData, loading: loadingC, error:errorC } = useGet7(APICATEGORIAS);
    useEffect(() => {
        if(errorC){
            setSuccessProducto(false);
            setErrMsg("Error al consultar Categorias");
        }
    }, [categoriasFetchData,errorC]);
    const categorias = categoriasFetchData.products;
    if (Array.isArray(categorias)) {
        categorias.sort((a, b) => {
          const nameA = a.name.toUpperCase(); 
          const nameB = b.name.toUpperCase();
          if (nameA < nameB) { return -1; }
          if (nameA > nameB) { return 1; }
          return 0;
        });
    }
    const [urlProducto,setUrlProduto] = useState('');
    const [APIProductoDetalle,setAPIProductoDetalle] = useState('');
    const [noExistencias,setNoExistencias] = useState('');
    //ITEMS VARIABLES
    const [precio, setPrecio] = useState('');
    const [precioActual,setPrecioActual] = useState('');
    const [sku, setSku] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [categoriaId, setCategoriaId] = useState('');
    //Errores
    const [errorSku, setErrorSku] = useState(false);
    const [errorCantidad, setErrorCantidad] = useState(false);
    const [errorPrecio, setErrorPrecio] = useState(false);
    const [errorCategoriaId,setErrorCategoriaId] = useState(false);
    const handleCategoria = (event) => {
        setSku('');
        setNoExistencias('');
        setCantidad('');
        setPrecio('');
        setPrecioActual('');
        const urlGiven = categorias.find(item => item.id === event.target.value);
        if (urlGiven) {
            setUrlProduto(urlGiven.url);
        } else {
            setSuccessProducto(false);
        }
        setCategoriaId(event.target.value);
    };
    const handleSKU = (event) => {
        //console.log("entra al handleSKU");
        const modeloProducto = event.target.value ? event.target.value : sku; 
        const APIProduct = API+urlProducto+'getmodel?administrador=true&model='+modeloProducto;
        const fetchData = async () => {
            try {
                const productoFetchData = await fetch(APIProduct);
                if (!productoFetchData.ok) {
                    throw new Error('Failed to fetch products');
                }
                const jsonProductos = await productoFetchData.json();   
                console.log(jsonProductos);
                setPrecio(jsonProductos.precioPromoTotal ? jsonProductos.precioPromoTotal : jsonProductos.precioTotal);
                setPrecioActual(jsonProductos.precioPromoTotal ? jsonProductos.precioPromoTotal : jsonProductos.precioTotal);
                setNoExistencias(jsonProductos.stock);
                if(jsonProductos.stock <= 0){
                    setErrorSku(true);
                    setSuccessProducto(false);
                    setErrMsg("No hay existencias");
                }
                else {
                    setErrorSku(false);
                    setSuccessProducto(true);
                    setErrMsg("");
                }               
            } catch (error) {
                console.error(error);
                setSuccessProducto(false);
                setNoExistencias('')
                setErrorSku(true);
                setErrMsg("Error al consultar Productos");
            }          
        };
        fetchData();
    }
    const handleExistencias = (event) => {
        const existencias = event.target.value; 
        setCantidad( event.target.value) ;
        if (existencias && noExistencias && (existencias > noExistencias)){
            setSuccessExistencias(false);
        }else{
            setSuccessExistencias(true);
        }
    }
    //REEMPLAZAMOS EL HOOK POR UN FETCH DIRECTO PARA EVITAR QUE SE CONSUMA AL MOMENTO DE CARGAR LA PAGINA
    //===============================Buscamos que el producto exista y establecemos el precio ===============
    const handleSubmitReturn = (event) => {
        event.preventDefault();
        setAPIProductoDetalle('');
        setNoExistencias('');
        setErrorSku(false);
        setErrorCantidad(false);
        setErrorPrecio(false);
        setErrorCategoriaId(false);
        setPrecio('');
        setPrecioActual('');
        setSku('');
        setCantidad('');
        setCategoriaId('');
        setErrMsg('');
        props.setTrigger(false);
    }   
    const handleSubmit = async(event) => {
        event.preventDefault();
        if (!sku) { setErrorSku(true); } else { setErrorSku(false); }
        if (!cantidad) { setErrorCantidad(true); } else { setErrorCantidad(false); }
        if (!categoriaId) { setErrorCategoriaId(true); } else { setErrorCategoriaId(false); }
        if (!precio) { setErrorPrecio(true); } else { setErrorPrecio(false); }
        if (!sku || !precio || !cantidad || !categoriaId || !successProducto || !successExistencias) {
            if(!successExistencias){
                setErrMsg("No hay existencias suficientes");
            }
            else {
                setSuccessSubmit(true);
                setErrMsg("Favor de llenar los campos requeridos.");
            }
            return;
        }   
        const detalleVentaData={
            orderId: ordenVentaIdValue,
            categoryId:categoriaId.toString(),
            productSKU: sku,
            amount:parseInt(cantidad, 10),            
            precioPromoTotal: precio
        }; 
        const APIPost = API+"orders/add-item/";
        const { success: successCompra, data, error } = await usePost2V(APIPost, detalleVentaData,state.token);
        if (successCompra){
            setNoExistencias('');
            setSuccessSubmit(true);
            setErrMsg("");
            setPrecio('');
            setPrecioActual('');
            setSku('');
            setCantidad('');
            setCategoriaId('');
            props.setTrigger(false);
            props.setItemChanged(prevItemChanged=> !prevItemChanged);
            alert('Registro Guardado.');
        } else {
            setSuccessSubmit(false);
            setErrMsg(error || "Error occurred during the request");
        }
    }
     return (
        (props.trigger) ? (
         <Box className="popup">
            <Box className='popup-inner'>
                
                <IconButton onClick={handleSubmitReturn} className='close-btn'><CloseIcon/></IconButton>
                {props.children}
                <Box className= "admin-tableHeaderPopup" >
                    <Typography className="admin-title" variant='h5'>Agregar articulo a la orden de venta {props.ordenVentaId}</Typography>
                </Box>
                <Alert severity={(errMsg) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert> 
                <Stack className="LoginFormContainer_admin" spacing={2} direction = {{xs:"column", md:"column", lg:"row"}} >
                <Box
                className="Form_Container_admin"
                component="form"
                autoComplete="off"
                ref={form}
                noValidate
                >
                    <Stack alignItems="center" spacing={2}>
                        <FormControl error={errorCategoriaId} className="InputBasic"  size="small" variant="outlined">
                            <InputLabel  id="ddl-marca-label">Categoria *</InputLabel>
                            <Select 
                                id="categoriaId"
                                name="categoriaId"
                                value={categoriaId}
                                label="Categoria"
                                //onChange={e=>setCategoriaId(e.target.value)}
                                onChange={handleCategoria}
                                MenuProps={{
                                    style: {zIndex: 2001}
                                }}
                                >
                                {
                                    categorias && categorias !== undefined ?
                                    categorias.map((categoria,index) =>{
                                        return (
                                            <MenuItem key={index} value={categoria.id}>{categoria.name}</MenuItem>
                                        )
                                    })
                                    : "No hay Categorias"
                                }
                            </Select>
                        </FormControl>                 
                        <TextField className="InputBasic"
                            disabled = {categoriaId != "" ? false : true}
                            error={errorSku}
                            required
                            id="sku" 
                            label="Sku" 
                            size="small"
                            name="sku"
                            autoComplete='on'
                            value={sku}
                            onChange={e=>setSku(e.target.value)}
                            inputProps={{maxLength:50 }}
                            onBlur={handleSKU}
                        ></TextField>
                        <TextField className="InputBasic"
                            disabled = {categoriaId != "" ? false : true}
                            error={errorCantidad}
                            required
                            id="cantidad" 
                            label="Cantidad" 
                            size="small"
                            name="cantidad"
                            autoComplete='off'
                            value={cantidad}
                            type="number"
                            onChange={handleExistencias}
                            inputProps={{maxLength:50 }}
                        ></TextField> 
                        <Box sx={{width:'90%', color: 'gray'}}>
                            <Typography>Articulos disponibles {noExistencias}</Typography>
                        </Box>      
                        <Box sx={{width:'90%', color: 'gray'}}>
                            <Typography>Precio actual {precioActual ? precioActual : ''}</Typography>
                        </Box>                  
                        <TextField className="InputBasic"   
                            disabled = {categoriaId != "" ? false : true}    
                            required
                            error={errorPrecio}                  
                            id="precio" 
                            label="Precio" 
                            size="small"
                            name="precio"
                            onChange={e=>setPrecio(e.target.value)}
                            value={precio ? precio : ''}
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
 export default PopupVentaCreateItem;