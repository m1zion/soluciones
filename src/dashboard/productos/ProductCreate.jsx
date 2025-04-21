/*https://www.geeksforgeeks.org/file-uploading-in-react-js/*/ //Subir archivos
 /*https://javascript.plainenglish.io/create-a-country-select-component-with-react-2021-a259bd0350d5*/  //Paises
 import React, { useRef, useState, Component, useEffect, useContext } from 'react';
 import { styled } from '@mui/material/styles';
 import { 
     Alert, 
     Stack, 
     TextField, 
     Button, 
     Typography, 
     Box, 
     Container,
     Grid,
     Select,
     MenuItem,
     FormControl, 
     InputLabel,
     FormControlLabel,
     Checkbox,
     FormGroup 
 } from "@mui/material"; 
 import { useNavigate } from 'react-router-dom'; 
 import countries from "i18n-iso-countries";
 import enLocale from "i18n-iso-countries/langs/en.json";
 import itLocale from "i18n-iso-countries/langs/it.json";
 import esLocale from "i18n-iso-countries/langs/es.json";
 import CloudUploadIcon from '@mui/icons-material/CloudUpload';
 import useGet7 from '@hooks/useGet7'; 
 import useGet7V from '@hooks/useGet7V';
 import usePost2V from '@hooks/usePost2V';
 import AppContext from '@context/AppContext';
 const API = process.env.REACT_APP_API_URL;
 const APICATEGORIAS = API+'categories/?offset=0&limit=100';
 const APIPROVEEDORES = API+'proveedores/?offset=0&limit=10';
 const VisuallyHiddenInput = styled('input')({
     clip: 'rect(0 0 0 0)',
     clipPath: 'inset(50%)',
     height: 1,
     overflow: 'hidden',
     position: 'absolute',
     bottom: 0,
     left: 0,
     whiteSpace: 'nowrap',
     width: 1,
   });
 
 const ProductCreate = () => {
    const { state } = useContext(AppContext);
    const navigate = useNavigate();
    const errRef = useRef();
    const form = useRef(null);
    const [errMsg, setErrMsg] = useState('');
    const [urlProducto,setUrlProducto] = useState('');
    const [categoriaName,setCategoriaName] = useState('');
    //const id = "1";
    //ITEMS VARIABLES
    const [categoryId, setCategoryId] = useState('');
    const [Nombre, setNombre] = useState('');
    const [sku, setSku] = useState('');
    const [marca, setMarca] = useState('');
    const [Modelo, setModelo] = useState('');
    const [precioPromoTotal, setPrecioPromoTotal] = useState('');
    const [precio, setPrecio] = useState('');
    const [fechaPromocion, setFechaPromocion] = useState('');
    const [costoInstalador, setCostoInstalador] = useState('');
    const [tipoMoneda, setTipoMoneda] = useState('');
    const [claveSat, setClaveSat] = useState('');
    const [proveedorId, setProveedorId] = useState('');
    const [peso, setPeso] = useState('');
    const [alto, setAlto] = useState('');
    const [largo, setLargo] = useState('');
    const [ancho, setAncho] = useState('');
    const [empaqueSecundario, setEmpaqueSecundario] = useState('');
    const [empaqueAlto, setEmpaqueAlto] = useState('');
    const [empaqueLargo, setEmpaqueLargo] = useState('');
    const [empaqueAncho, setEmpaqueAncho] = useState('');
    const [unidadPeso, setUnidadPeso] = useState('');
    const [unidadMedida, setUnidadMedida] = useState('');
    const [id, setId] = useState('');
    const [paisDeOrigen,setPaisDeOrigen] = useState("");
    const selectedCountryHandler = (value) => setPaisDeOrigen(value);
    const [cedisAsignado,setCedisAsignado] = useState("");
    const [tags,setTags] = useState("");
    const [descripcionProducto,setDescripcionProducto] = useState("");
    const [descripcionSEO,setDescripcionSEO] = useState("");
    const [tituloSEO,setTituloSEO] = useState("");
    const [codigoBarras,setCodigoBarras] = useState("");
    const [clasificacionProveedoresID,setClasificacionProveedoresID] = useState("");
    const [Favoritos,setFavoritos] = useState(false);
    const [mostrarTienda,setMostrarTienda] = useState(false);
    const [consignacion,setConsignacion] = useState(false);

    //Errores
    const [errorCategoryId, setErrorCategoryId] = useState(false);
    const [errorNombre, setErrorNombre] = useState(false);
    const [errorSku, setErrorSku] = useState(false);
    const [errorMarca, setErrorMarca] = useState(false);
    const [errorModelo, setErrorModelo] = useState(false);
    const [errorPrecioPromoTotal, setErrorPrecioPromoTotal] = useState(false);
    const [errorPrecio, setErrorPrecio] = useState(false);
    const [errorFechaPromocion, setErrorFechaPromocion] = useState(false);
    const [errorCostoInstalador, setErrorCostoInstalador] = useState(false);
    const [errorTipoMoneda, setErrorTipoMoneda] = useState(false);
    const [errorClaveSat, setErrorClaveSat] = useState(false);
    const [errorProveedorId, setErrorProveedorId] = useState(false);
    const [errorPeso, setErrorPeso] = useState(false);    
    const [errorAlto, setErrorAlto] = useState(false);
    const [errorLargo, setErrorLargo] = useState(false);
    const [errorAncho, setErrorAncho] = useState(false);
    const [errorEmpaqueSecundario, setErrorEmpaqueSecundario] = useState(false);    
    const [errorEmpaqueAlto, setErrorEmpaqueAlto] = useState(false);
    const [errorEmpaqueLargo, setErrorEmpaqueLargo] = useState(false);
    const [errorEmpaqueAncho, setErrorEmpaqueAncho] = useState(false);
    const [errorUnidadPeso, setErrorUnidadPeso] = useState(false);
    const [errorUnidadMedida, setErrorUnidadMedida] = useState(false);
    const [errorId, setErrorId] = useState(false);
    const [errorPaisDeOrigen, setErrorPaisDeOrigen] = useState(false);
    const [errorCedisAsignado, setErrorCedisAsignado] = useState(false);
    const [errorTags, setErrorTags] = useState(false);
    const [errorDescripcionProducto, setErrorDescripcionProducto] = useState(false);
    const [errorDescripcionSEO, setErrorDescripcionSEO] = useState(false);
    const [errorTituloSEO, setErrorTituloSEO] = useState(false);
    const [errorCodigoBarras, setErrorCodigoBarras] = useState(false);
    const [errorClasificacionProveedoresID, setErrorClasificacionProveedoresID] = useState(false);
    //========================CONSULTAMOS LAS CATEGORIAS==========================================
     const { data: categoriasFetchData, loading: loadingC, error:errorC } = useGet7(APICATEGORIAS);
     useEffect(() => {
         if(errorC){
             setSuccess(false);
             setErrMsg("Error al consultar Categorias");
         }
     }, [categoriasFetchData,errorC]);
     const categorias = categoriasFetchData.products;
    //========================CONSULTAMOS LOS PROVEEDORES==========================================
    const { data: proveedoresFetchData, loading: loadingP, error:errorP } = useGet7V(APIPROVEEDORES,state.token);
    useEffect(() => {
        if(errorP){
            setSuccess(false);
            setErrMsg("Error al consultar Proveedores");
        }
    }, [proveedoresFetchData,errorP]);
    const proveedores = proveedoresFetchData.proveedores;
    if (Array.isArray(proveedores)) {
        proveedores.sort((a, b) => {
            const nameA = a.nombre.toUpperCase(); 
            const nameB = b.nombre.toUpperCase();
            if (nameA < nameB) { return -1; }
            if (nameA > nameB) { return 1; }
            return 0;
        });
    }
   //=============================================================================================
     const [success, setSuccess] = useState(true);
     if (Array.isArray(categorias)) {
         categorias.sort((a, b) => {
           const nameA = a.name.toUpperCase(); // convert names to uppercase for case-insensitive comparison
           const nameB = b.name.toUpperCase();
           if (nameA < nameB) {
             return -1;
           }
           if (nameA > nameB) {
             return 1;
           }
           return 0;
         });
     }

     const handleTipoMoneda = (event) => {
         setTipoMoneda(event.target.value);
     };
     const [selectedFile, setSelectedFile] = useState(null);
     const [selectedFile2, setSelectedFile2] = useState(null);
     const [selectedFile3, setSelectedFile3] = useState(null);
     const [selectedFile4, setSelectedFile4] = useState(null);
     const onFileChange = event => {
         const file = event.target.files[0];
         if (file && file instanceof Blob) { setSelectedFile(file); }
     };
     const onFileChange2 = event => {
         const file = event.target.files[0];
         if (file && file instanceof Blob) { setSelectedFile2(file); }
     };
     const onFileChange3 = event => {
         const file = event.target.files[0];
         if (file && file instanceof Blob) { setSelectedFile3(file); }
     };
     const onFileChange4 = event => {
         const file = event.target.files[0];
         if (file && file instanceof Blob) { setSelectedFile4(file); }
     };
     /*const onFileUpload = () => {
         if (selectedFile) {
             const formData = new FormData(); // Create an object of formData
             // Update the formData object
             formData.append(
                 "myFile",
                 selectedFile,
                 selectedFile.name
             );
             // Details of the uploaded file
             console.log(selectedFile);
             // Request made to the backend api
             // Send formData object
             //axios.post("api/uploadfile", formData);
             }
     };*/
 
     const onFileUpload2 = () => {
         if (selectedFile2) {
             const formData = new FormData();
             formData.append(
                 "myFile",
                 selectedFile2,
                 selectedFile2.name
             );
         }
     };
     const onFileUpload3 = () => {
         if (selectedFile3) {
             const formData = new FormData();
             formData.append(
                 "myFile",
                 selectedFile3,
                 selectedFile3.name
             );
         }
     };
     const onFileUpload4 = () => {
         if (selectedFile4) {
             const formData = new FormData();
             formData.append(
                 "myFile",
                 selectedFile4,
                 selectedFile4.name
             );
         }
     };
     const fileData = () => {
         if (selectedFile) {
             return (
                 <Box><Typography>{selectedFile.name}</Typography></Box>
             );
         } else {
             return (
                 <Box>
                     <Typography>Sin archivo.</Typography>
                 </Box>
             );
         }
     };
     const fileData2 = () => {
         if (selectedFile2) {
             return (
                 <Box><Typography>{selectedFile2.name}</Typography></Box>
             );
         } else {
             return (
                 <Box>
                     <Typography>Sin archivo.</Typography>
                 </Box>
             );
         }
     };
     const fileData3 = () => {
         if (selectedFile3) {
             return (
                 <Box><Typography>{selectedFile3.name}</Typography></Box>
             );
         } else {
             return (
                 <Box>
                     <Typography>Sin archivo.</Typography>
                 </Box>
             );
         }
     };    
     const fileData4 = () => {
         if (selectedFile4) {
             return (
                 <Box><Typography>{selectedFile4.name}</Typography></Box>
             );
         } else {
             return (
                 <Box>
                     <Typography>Sin archivo.</Typography>
                 </Box>
             );
         }
     };
 
     countries.registerLocale(enLocale);
     countries.registerLocale(itLocale);
     countries.registerLocale(esLocale);
     const countryObj = countries.getNames("es", {select: "official"});
     const countryArr = Object.entries(countryObj).map(([key,value]) => {
         return {
             label: value,
             value: key
         };
     });
    
     const handleSubmitReturn = (event) => {
         event.preventDefault();
         navigate('/Dashboard/Productos');
     }   
     const handleCategoria = (event) => {
        console.log(categorias);
        console.log(event.target.value);
        const urlGiven = categorias.find(item => item.id === event.target.value);
        if (urlGiven) {
            console.log(urlGiven.url);
            setUrlProducto(urlGiven.url);
            setCategoriaName(urlGiven.productModel);
        } else {
            console.error("Category not found!");
        }
        setCategoryId(event.target.value);
        //const data = modelos.filter(x => x.marca === event.target.value);
        //const dt = [...new Set(data.map(item => item.modelo))]; // [ 'A', 'B']
        //setModelo(dt);
     };
     //Cada vez que cambia la categoria
     const[camposCategoria,setCamposCategoria] = useState([]);
     
     const { data: camposProductosFetchData, loading, error } = useGet7(API+"camposProductos?offset=0&limit=10&categoryId="+categoryId);
     useEffect(() => {     
        if(categoryId == ""){
            return;
        }
        if (camposProductosFetchData && camposProductosFetchData.products) {
             //setProductoData(camposProductosFetchData.camposProductos);
             setErrMsg("");
             setSuccess(true);
             setCamposCategoria(camposProductosFetchData.products);
        } 
        else {
            if(error){
              console.log("error");
              if (error == `"categoryId" must be a number`){
                setCamposCategoria([]);
                setSuccess(true);
                setErrMsg("");
              }
              else{
                setCamposCategoria([]);
                setSuccess(false);
                console.error((error || "Error de consulta.") +" (Code: 015)");
                setErrMsg("");
                //setErrMsg((error || "Error de consulta.") +" (Code: 015)");
              }
            }
          }
     }, [camposProductosFetchData,error]);
     //SUBMIT--------------

    const handleSubmit = async (event) => {
         event.preventDefault();
         if (!categoryId) { setErrorCategoryId(true); } else { setErrorCategoryId(false); }
         if (!Nombre) { setErrorNombre(true); } else { setErrorNombre(false); }
         if (!sku) { setErrorSku(true); } else { setErrorSku(false); }
         if (!marca) { setErrorMarca(true); } else { setErrorMarca(false); }
         /*if (!Modelo) { setErrorModelo(true); } else { setErrorModelo(false); }*/
         if (!precioPromoTotal) { setErrorPrecioPromoTotal(true); } else { setErrorPrecioPromoTotal(false); }
         if (!precio) { setErrorPrecio(true); } else { setErrorPrecio(false); }
         if (!fechaPromocion) { setErrorFechaPromocion(true); } else { setErrorFechaPromocion(false); }
         if (!tipoMoneda) { setErrorTipoMoneda(true); } else { setErrorTipoMoneda(false); }
         if (!claveSat) { setErrorClaveSat(true); } else { setErrorClaveSat(false); }
         if (!proveedorId) { setErrorProveedorId(true); } else { setErrorProveedorId(false); }
         if (!peso) { setErrorPeso(true); } else { setErrorPeso(false); }
         if (!alto) { setErrorAlto(true); } else { setErrorAlto(false); }
         if (!largo) { setErrorLargo(true); } else { setErrorLargo(false); }
         if (!ancho) { setErrorAncho(true); } else { setErrorAncho(false); }
         if (!empaqueSecundario) { setErrorEmpaqueSecundario(true); } else { setErrorEmpaqueSecundario(false); }
         if (!empaqueAlto) { setErrorEmpaqueAlto(true); } else { setErrorEmpaqueAlto(false); }
         if (!empaqueLargo) { setErrorEmpaqueLargo(true); } else { setErrorEmpaqueLargo(false); }
         if (!empaqueAncho) { setErrorEmpaqueAncho(true); } else { setErrorEmpaqueAncho(false); }
         if (!unidadPeso) { setErrorUnidadPeso(true); } else { setErrorUnidadPeso(false); }
         if (!unidadMedida) { setErrorUnidadMedida(true); } else { setErrorUnidadMedida(false); }
         if (!id) { setErrorId(true); } else { setErrorId(false); }
         if (!paisDeOrigen) { setErrorPaisDeOrigen(true); } else { setErrorPaisDeOrigen(false); }
         if (!cedisAsignado) { setErrorCedisAsignado(true); } else { setErrorCedisAsignado(false); }
         if (!tags) { setErrorTags(true); } else { setErrorTags(false); }
         if (!descripcionProducto) { setErrorDescripcionProducto(true); } else { setErrorDescripcionProducto(false); }
         if (!descripcionSEO) { setErrorDescripcionSEO(true); } else { setErrorDescripcionSEO(false); }
         if (!tituloSEO) { setErrorTituloSEO(true); } else { setErrorTituloSEO(false); }
         if (!codigoBarras) { setErrorCodigoBarras(true); } else { setErrorCodigoBarras(false); }
         if (!clasificacionProveedoresID) { setErrorClasificacionProveedoresID(true); } else { setErrorClasificacionProveedoresID(false); }
         
         if (
             !categoryId || 
             !Nombre ||
             !sku ||
             !marca ||
             !precio ||
             !tipoMoneda ||
             !claveSat ||
             !proveedorId) {
             return;
         }
         if (precioPromoTotal == "") {
            setPrecioPromoTotal(precio);
         }
         var productData={
            categoryId,
            Categoria: categoriaName, //solo informativo
            Nombre,
            sku,
            marca,
            Modelo: sku,
            precio,  //Este precio es el precio Total Sin Iva
            precioTotal: precio,
            claveSat,
            proveedorId, //Requiered
            stock: 0, 
            Favoritos: Favoritos,  //ARREGLAR CUANDO SE ESTANDARIZE QUE SEAN BOLEANOS
            mostrarTienda: mostrarTienda,
            consignacion: consignacion, //Default
            
        };        
        if (precioPromoTotal !== "") { productData.precioPromoTotal = precioPromoTotal; }
        if (costoInstalador !== "") { productData.costoInstalador = costoInstalador; }
        //if (fechaPromocion !== "") { productData.fechaPromocion = fechaPromocion; }
        if (tipoMoneda !== "") { productData.tipoMoneda = tipoMoneda; }
        if (peso !== "") { productData.peso = peso; }
        if (alto !== "") { productData.alto = alto; }
        if (largo !== "") { productData.largo = largo; }
        if (ancho !== "") { productData.ancho = ancho; }
        if (empaqueSecundario !== "") { productData.empaqueSecundario = empaqueSecundario; }
        if (empaqueAlto !== "") { productData.empaqueAlto = empaqueAlto; }
        if (empaqueLargo !== "") { productData.empaqueLargo = empaqueLargo; }
        if (empaqueAncho !== "") { productData.empaqueAncho = empaqueAncho; }
        if (unidadPeso !== "") { productData.unidadPeso = unidadPeso; }
        if (unidadMedida !== "") { productData.unidadMedida = unidadMedida; }
        if (paisDeOrigen !== "") { productData.paisDeOrigen = paisDeOrigen; }
        if (cedisAsignado !== "") { productData.cedisAsignado = cedisAsignado; }
        if (tags !== "") { productData.tags = tags; }
        if (descripcionProducto !== "") { productData.descripcionProducto = descripcionProducto; }
        if (descripcionSEO !== "") { productData.descripcionSEO = descripcionSEO; }
        if (tituloSEO !== "") { productData.tituloSEO = tituloSEO; }
        if (codigoBarras !== "") { productData.codigoBarras = codigoBarras; }
        if (clasificacionProveedoresID !== "") { productData.clasificacionProveedoresID = clasificacionProveedoresID; }

        //Agregamos los elementos independientes posteriormente
        const formData = new FormData(form.current);
        //const  data = {};       
        camposCategoria && camposCategoria !== undefined &
        camposCategoria.map((category,index) =>{
        if(category.type == "Boolean"){
            productData = {
                ...productData, 
                [category.campoId]: formData.get(category.campoId) ? true : false
            };
        }
        else 
        {
            if (formData.get(category.campoId) != "" && formData.get(category.campoId) != null){
                productData = {
                    ...productData, 
                    [category.campoId]: formData.get(category.campoId)
                };
            }
        }
        });
        const APIPost = API+urlProducto;
        console.log(productData);
        try{ 
            const { success, data, error } = await usePost2V(APIPost, productData, state.token);
            if (success){
                const files = [selectedFile, selectedFile2, selectedFile3, selectedFile4];
                const sizes = ['sm', 'lg'];
                for (const file of files) {  //Se recorren las 4 imagenes
                    if (file) {
                        for (const size of sizes) {  //Por cada Imagen se suben diferentes tamaños
                            const params = new URLSearchParams({
                                sku: sku,
                                model: categoriaName,
                                category_id: parseInt(categoryId),
                                size: size
                            });
                            const APIPostImage = `${API}fotos/?${params.toString()}`;
                            const imageFormData = new FormData();
                            imageFormData.append("image", file);
                            try {
                                const response = await fetch(APIPostImage, {
                                    method: 'POST',
                                    headers: {
                                        'Authorization': `Bearer ${state.token}`
                                    },
                                    body: imageFormData
                                });
                                const imageData = await response.json();
                                if (!response.ok) {
                                    setSuccess(false);
                                    setErrMsg(imageData.error || "Error occurred during the request 01");
                                    return;
                                }
                            } catch (imageUploadError) {
                                setSuccess(false);
                                console.error(imageUploadError.message || "Error occurred during the request 02");
                                setErrMsg(imageUploadError.message || "Error occurred during the request 02");
                                return;
                            }
                        }                 
                    }
                } 
                alert('Registro Guardado.');
                navigate('/Dashboard/Productos');
            } else {
                setSuccess(false);
                setErrMsg(error || "Error occurred during the request");
            }
        } catch (productDataError) {
            setSuccess(false);
            setErrMsg(productDataError.message || "Error occurred during the product data submission.");
        }    //SUBMIT END---------------------------
    }

    const handleKeyPress = (event) => { // Allow only digits and a maximum of 3 characters
         if (event.target.value.length >= 3 && event.key !== "Backspace") {
           event.preventDefault();
         }
    };
    if (loadingC) {
        return <Typography>Loading...</Typography>;
    }
    if (errorC) {
        return  <Alert severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert> ;
    }
    return (
        <Container maxWidth="lg" className="justified-container">
            <Box className= "admin-tableHeader" >
                <Typography className="admin-title" variant='h5'>Crear nuevo articulo</Typography>
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
                         <FormControl   error={errorCategoryId} className="InputBasic"  size="small" variant="outlined">
                             <InputLabel  id="ddl-categoria-label">Categoria *</InputLabel>
                             <Select  
                                 id="categoryId"
                                 name="categoryId"
                                 value={categoryId}
                                 label="Categoria"
                                 onChange={handleCategoria}
                                 >
                                 {
                                     categorias && categorias !== undefined ?
                                     categorias.map((category,index) =>{
                                         return (
                                             <MenuItem key={index} value={category.id}>{category.name}</MenuItem>
                                         )
                                     })
                                     : "No hay categorias"
                                 }
                             </Select>
                         </FormControl>                        
                         <TextField className="InputBasic"
                             error={errorNombre}
                             required
                             id="Nombre" 
                             label="Nombre" 
                             size="small"
                             name="Nombre"
                             autoComplete='on'
                             value={Nombre}
                             onChange={e=>setNombre(e.target.value)}
                             inputProps={{maxLength:50 }}
                         ></TextField>
                         <TextField className="InputBasic"
                             error={errorSku}
                             required
                             id="sku" 
                             label="SKU/Modelo" 
                             size="small"
                             name="sku"
                             autoComplete='on'
                             value={sku}
                             onChange={e=>setSku(e.target.value)}
                             inputProps={{maxLength:50 }}
                         ></TextField>
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
                         {/*<TextField className="InputBasic"
                             error={errorModelo}
                             required
                             id="Modelo" 
                             label="Modelo" 
                             size="small"
                             name="Modelo"
                             autoComplete='on'
                             value={Modelo}
                             onChange={e=>setModelo(e.target.value)}
                             inputProps={{maxLength:50 }}
                            ></TextField>*/}
                         <TextField className="InputBasic"
                             /*error={errorPrecioPromoTotal}*/
                             id="precioPromoTotal" 
                             label="Precio promo sin iva" 
                             size="small"
                             name="precioPromoTotal"
                             autoComplete='off'
                             value={precioPromoTotal}
                             type="number"
                             onChange={e=>setPrecioPromoTotal(e.target.value)}
                             inputProps={{maxLength:50 }}
                         ></TextField>
                         <TextField className="InputBasic"
                             error={errorPrecio}
                             required
                             id="precio" 
                             label="Precio" 
                             size="small"
                             name="precio"
                             autoComplete='off'
                             value={precio}
                             type="number"
                             onChange={e=>setPrecio(e.target.value)}
                             inputProps={{maxLength:50 }}
                         ></TextField>
                         <TextField className="InputBasic"
                             /*error={errorFechaPromocion}*/
                             id="fechaPromocion" 
                             label="Fecha promoción" 
                             size="small"
                             name="fechaPromocion"
                             autoComplete='off'
                             value={fechaPromocion}
                             type="date"
                             onChange={e=>setFechaPromocion(e.target.value)}
                             InputLabelProps={{
                                 shrink: true,
                             }}
                             InputProps={{
                                 placeholder: '',
                                 maxLength: 50,
                             }}
                         ></TextField>
                         <TextField className="InputBasic"
                             /*error={errorCostoInstalador}*/
                             id="costoInstalador" 
                             label="Costo Instalación" 
                             size="small"
                             name="costoInstalador"
                             autoComplete='off'
                             value={costoInstalador}
                             type="number"
                             onChange={e=>setCostoInstalador(e.target.value)}
                             inputProps={{maxLength:50 }}
                         ></TextField>
 
 
                         <FormControl error={errorTipoMoneda} className="InputBasic"  size="small" variant="outlined">
                             <InputLabel  id="ddl-tipoMoneda-label">Moneda *</InputLabel>
                             <Select  
                                 id="tipoMoneda"
                                 name="tipoMoneda"
                                 value={tipoMoneda}
                                 label="Moneda"
                                 onChange={handleTipoMoneda}
                                 >                    
                                     <MenuItem key="MXN" value="MXN">MXN</MenuItem>
                                     <MenuItem key="EUR" value="EUR">EUR</MenuItem>
                                     <MenuItem key="USD" value="USD">USD</MenuItem>  
                             </Select>
                         </FormControl>
                         <TextField className="InputBasic"
                             error={errorClaveSat}
                             required
                             id="claveSat" 
                             label="Clave SAT" 
                             size="small"
                             name="claveSat"
                             autoComplete='on'
                             value={claveSat}
                             onChange={e=>setClaveSat(e.target.value)}
                             inputProps={{maxLength:50 }}
                         ></TextField>
                        <FormControl   error={errorProveedorId} className="InputBasic"  size="small" variant="outlined">
                            <InputLabel  id="ddl-marca-label">Proveedor *</InputLabel>
                            <Select 
                                id="proveedorId"
                                name="proveedorId"
                                value={proveedorId}
                                label="ProveedorId"
                                onChange={e=>setProveedorId(e.target.value)}
                                MenuProps={{style: {zIndex: 2001}}}
                            >
                                {
                                    proveedores && proveedores !== undefined ?
                                    proveedores.map((proveedor,index) =>{
                                        return (
                                            <MenuItem key={index} value={proveedor.id}>{proveedor.nombre}</MenuItem>
                                        )
                                    })
                                    : "No hay proveedores"
                                }
                            </Select>
                        </FormControl> 
                        {/*<TextField className="InputBasic"
                             error={errorProveedorId}
                             required
                             id="proveedorId" 
                             label="Proveedor" 
                             size="small"
                             name="proveedorId"
                             autoComplete='on'
                             value={proveedorId}
                             onChange={e=>setProveedorId(e.target.value)}
                             inputProps={{maxLength:50 }}
                         ></TextField>*/}
                         <Box className="formDivider">
                             <Typography className="formDivider-text">Empaque principal</Typography>
                             <Box className="formDivider-line"></Box>
                         </Box>   
                         <Grid sx={{width:'90%'}} container spacing={2}>
                             <Grid item xs={6} sx={{paddingLeft:'0 !important'}}>
                                 <TextField className="InputBasic"
                                     /*error={errorPeso}   */
                                     id="peso" 
                                     label="Peso" 
                                     size="small"
                                     name="peso"
                                     autoComplete='on'
                                     value={peso}
                                     type="number"
                                     onChange={e=>setPeso(e.target.value)}
                                     inputProps={{maxLength:50 }}
                                 ></TextField>
                             </Grid>
                             <Grid item xs={6}>
                                 <TextField 
                                     /*error={errorLargo}  */          
                                     id="largo" 
                                     label="Largo" 
                                     size="small"
                                     name="largo"
                                     autoComplete='on'
                                     value={largo}
                                     type="number"
                                     onChange={e=>setLargo(e.target.value)}
                                     inputProps={{maxLength:50 }}
                                 ></TextField>    
                             </Grid>
                             <Grid item xs={6} sx={{paddingLeft:'0 !important'}}>
                                 <TextField className="InputBasic"
                                     /*error={errorAlto}*/
                                     id="alto" 
                                     label="Alto" 
                                     size="small"
                                     name="alto"
                                     autoComplete='on'
                                     value={alto}
                                     type="number"
                                     onChange={e=>setAlto(e.target.value)}
                                     inputProps={{maxLength:50 }}
                                 ></TextField>    
                             </Grid>
                             <Grid item xs={6}>
                                 <TextField 
                                     /*error={errorAncho}*/
                                     id="ancho" 
                                     label="Ancho" 
                                     size="small"
                                     name="ancho"
                                     autoComplete='on'
                                     value={ancho}
                                     type="number"
                                     onChange={e=>setAncho(e.target.value)}
                                     inputProps={{maxLength:50 }}
                                 ></TextField>
                             </Grid>
                         </Grid>
                         <Box className="formDivider">
                             <Typography className="formDivider-text">Empaque secundario</Typography>
                             <Box className="formDivider-line"></Box>
                         </Box>                        
                         <Grid sx={{width:'90%'}} container spacing={2}>
                             <Grid item xs={6} sx={{paddingLeft:'0 !important'}}>
                                 <TextField className="InputBasic"
                                     /*error={errorPeso}   */
                                     id="empaqueSecundario" 
                                     label="Empaque secundario" 
                                     size="small"
                                     name="empaqueSecundario"
                                     autoComplete='off'
                                     value={empaqueSecundario}
                                     onChange={e=>setEmpaqueSecundario(e.target.value)}
                                     inputProps={{maxLength:50 }}
                                 ></TextField>
                             </Grid>
                             <Grid item xs={6}>
                                 <TextField 
                                     /*error={errorEmpaqueLargo} */           
                                     id="empaqueLargo" 
                                     label="Largo" 
                                     size="small"
                                     name="empaqueLargo"
                                     autoComplete='off'
                                     value={empaqueLargo}
                                     type="number"
                                     onChange={e=>setEmpaqueLargo(e.target.value)}
                                     inputProps={{maxLength:50 }}
                                 ></TextField>    
                             </Grid>
                             <Grid item xs={6} sx={{paddingLeft:'0 !important'}}>
                                 <TextField className="InputBasic"
                                     /*error={errorEmpaqueAlto}*/
                                     id="empaqueAlto" 
                                     label="Alto" 
                                     size="small"
                                     name="empaqueAlto"
                                     autoComplete='off'
                                     value={empaqueAlto}
                                     type="number"
                                     onChange={e=>setEmpaqueAlto(e.target.value)}
                                     inputProps={{maxLength:50 }}
                                 ></TextField>    
                             </Grid>
                             <Grid item xs={6}>
                                 <TextField 
                                     /*error={errorEmpaqueAncho}*/
                                     id="empaqueAncho" 
                                     label="Ancho" 
                                     size="small"
                                     name="empaqueAncho"
                                     autoComplete='on'
                                     value={empaqueAncho}
                                     type="number"
                                     onChange={e=>setEmpaqueAncho(e.target.value)}
                                     inputProps={{maxLength:50 }}
                                 ></TextField>
                             </Grid>
                         </Grid>
                         <FormControl  className="InputBasic"  size="small" variant="outlined">
                             <InputLabel  id="ddl-unidadPeso-label">Unidad de peso</InputLabel>
                             <Select  
                                 id="unidadPeso"
                                 name="unidadPeso"
                                 value={unidadPeso}
                                 label="Unidad de peso"
                                 onChange={e=>setUnidadPeso(e.target.value)}
                                 >                    
                                     <MenuItem key="kg" value="kg">Kilogramo</MenuItem>
                                     <MenuItem key="g" value="g">Gramo</MenuItem>
                                     <MenuItem key="lb" value="lb">Libra</MenuItem>  
                                     <MenuItem key="oz" value="oz">Onza</MenuItem>  
                                     <MenuItem key="otro" value="otro">Otro</MenuItem>  
                             </Select>
                         </FormControl>
                         <FormControl  className="InputBasic"  size="small" variant="outlined">
                             <InputLabel  id="ddl-unidadMedida-label">Unidad de medida</InputLabel>
                             <Select  
                                 id="unidadMedida"
                                 name="unidadMedida"
                                 value={unidadMedida}
                                 label="Unidad de medida"
                                 onChange={e=>setUnidadMedida(e.target.value)}
                                 >                    
                                     <MenuItem key="m" value="m">Metro</MenuItem>
                                     <MenuItem key="cm" value="cm">Centimetro</MenuItem>
                                     <MenuItem key="mm" value="mm">Milimetro</MenuItem>  
                                     <MenuItem key="ft" value="ft">Pie</MenuItem>    
                                     <MenuItem key="in" value="in">Pulgada</MenuItem>
                                     <MenuItem key="otro" value="otro">Otro</MenuItem>  
                             </Select>
                         </FormControl>
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
                         <FormControl  className="InputBasic"  size="small" variant="outlined">
                             <InputLabel  id="ddl-paisDeOrigen-label">Pais de Origen</InputLabel>
                             <Select                                    
                                 value={paisDeOrigen}
                                 onChange={(e) => selectedCountryHandler(e.target.value)}
                                 label="Pais de Origen"
                                 id="paisDeOrigen" 
                                 name="paisDeOrigen"
                             >
                                 {!!countryArr?.length &&
                                 countryArr.map(({label,value}) => (
                                     <MenuItem key={value} value={value}>
                                         {label}
                                     </MenuItem>
                                 ))
 
                                 }
                             </Select>
                         </FormControl>
                         <TextField className="InputBasic"
                             /*error={errorCedisAsignado}*/
                             id="cedisAsignado" 
                             label="Cedis asignado" 
                             size="small"
                             name="cedisAsignado"
                             autoComplete='on'
                             value={cedisAsignado}
                             onChange={e=>setCedisAsignado(e.target.value)}
                             inputProps={{maxLength:100 }}
                         ></TextField> 
                         <TextField className="InputBasic"
                             /*error={errorTags}*/
                             id="tags" 
                             label="Tags" 
                             size="small"
                             name="tags"
                             autoComplete='on'
                             value={tags}
                             onChange={e=>setTags(e.target.value)}
                             inputProps={{maxLength:150 }}
                         ></TextField>                   
                         <TextField className="InputBasic"
                             /*error={errorDescripcionProducto}*/
                             id="descripcionProducto" 
                             label="Descripción del producto" 
                             size="small"
                             name="descripcionProducto"
                             autoComplete='off'
                             value={descripcionProducto}
                             onChange={e=>setDescripcionProducto(e.target.value)}
                             inputProps={{maxLength:200 }}
                         ></TextField>  
                         <TextField className="InputBasic"
                             /*error={errorDescripcionSEO}*/
                             id="descripcionSEO" 
                             label="Descripción SEO" 
                             size="small"
                             name="descripcionSEO"
                             autoComplete='off'
                             value={descripcionSEO}
                             onChange={e=>setDescripcionSEO(e.target.value)}
                             inputProps={{maxLength:200 }}
                         ></TextField>
                         <TextField className="InputBasic"
                             /*error={errorTituloSEO}*/
                             id="tituloSEO" 
                             label="Titulo SEO" 
                             size="small"
                             name="tituloSEO"
                             autoComplete='off'
                             value={tituloSEO}
                             onChange={e=>setTituloSEO(e.target.value)}
                             inputProps={{maxLength:200 }}
                         ></TextField>
                         <TextField className="InputBasic"
                             /*error={errorCodigoBarras}*/
                             id="codigoBarras" 
                             label="Codigo de barras" 
                             size="small"
                             name="codigoBarras"
                             autoComplete='off'
                             value={codigoBarras}
                             onChange={e=>setCodigoBarras(e.target.value)}
                             inputProps={{maxLength:200 }}
                         ></TextField>
                         <TextField className="InputBasic"
                             /*error={errorCodigoBarras}*/
                             id="clasificacionProveedoresID" 
                             label="Clasificacion proveedores ID" 
                             size="small"
                             name="clasificacionProveedoresID"
                             autoComplete='off'
                             value={clasificacionProveedoresID}
                             onChange={e=>setClasificacionProveedoresID(e.target.value)}
                             inputProps={{maxLength:200 }}
                         ></TextField>
                         <FormGroup className="AddressFormDefault">
                             <FormControlLabel 
                                 name="Favoritos" 
                                 control={
                                     <Checkbox 
                                         color="secondary" 
                                         checked={Favoritos}
                                         onChange={e=>setFavoritos(e.target.checked)}
                                     />
                                 } 
                                 label="Favoritos" 
                             />
                         </FormGroup>
                         <FormGroup className="AddressFormDefault">
                             <FormControlLabel 
                                 name="mostrarTienda" 
                                 control={
                                     <Checkbox 
                                         color="secondary" 
                                         checked={mostrarTienda}
                                         onChange={e=>setMostrarTienda(e.target.checked)}
                                     />
                                 } 
                                 label="Mostrar en tienda" 
                             />
                         </FormGroup>
                         <FormGroup className="AddressFormDefault">
                             <FormControlLabel 
                                 name="consignacion" 
                                 control={
                                     <Checkbox 
                                         color="secondary" 
                                         checked={consignacion}
                                         onChange={e=>setConsignacion(e.target.checked)}
                                     />
                                 } 
                                 label="Consignación" 
                             />
                         </FormGroup>
                         <Box className="uploadButton_container_admin">
                             <Button className="uploadButton_admin" component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                                 <Typography noWrap>Imagen 1</Typography>
                                 <VisuallyHiddenInput type="file" onChange={onFileChange}/>
                             </Button>
                             {fileData()} 
                         </Box>
                         <Box className="uploadButton_container_admin">
                             <Button onClick={onFileUpload2} className="uploadButton_admin" component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                                 Imagen 2
                                 <VisuallyHiddenInput type="file" onChange={onFileChange2}/>
                             </Button> 
                             {fileData2()} 
                         </Box>
                         <Box className="uploadButton_container_admin">
                             <Button onClick={onFileUpload3} className="uploadButton_admin" component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                                 Imagen 3
                                 <VisuallyHiddenInput type="file" onChange={onFileChange3}/>
                             </Button>
                             {fileData3()} 
                         </Box>
                         <Box className="uploadButton_container_admin">
                             <Button onClick={onFileUpload4} className="uploadButton_admin" component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                                 Imagen 4
                                 <VisuallyHiddenInput type="file" onChange={onFileChange4}/>
                             </Button>    
                             {fileData4()}             
                         </Box>
                         <Box className="formDivider">
                             <Typography className="formDivider-text">Caracteristicas del producto</Typography>
                             <Box className="formDivider-line"></Box>
                         </Box>
                         <Box sx={{width:"100%"}}>
                         <Stack alignItems="center" spacing={2}>
                         {
                             camposCategoria.map((category,index) =>{
                                if(category.type == "TextField"){
                                    return (                                    
                                        <TextField 
                                        key={index} 
                                        className="InputBasic"
                                        id={category.campoId} 
                                        label={category.label}
                                        size="small"
                                        name={category.name}
                                        autoComplete='off'
                                        /*value={category.name}
                                        onChange={e=>setProfundidad(e.target.value)}*/
                                        inputProps={{maxLength:200 }}
                                        >
                                        </TextField>
                                    );
                                }
                                else if(category.type == "Boolean"){
                                    return ( 
                                        <FormGroup className="AddressFormDefault"  key={index}>
                                            
                                        <FormControlLabel 
                                        
                                        name={category.name}
                                        control={
                                            <Checkbox 
                                                color="secondary"                                                
                                                /*checked={consignacion}*/
                                                /*onChange={e=>setConsignacion(e.target.checked)}*/
                                            />
                                        } 
                                        label={category.label} 
                                        />
                                        </FormGroup>
                                    );
                                } 
                                else if(category.type == "number") {
                                    return (                                    
                                        <TextField 
                                            key={index} 
                                            className="InputBasic"
                                            id={category.campoId} 
                                            label={category.label}
                                            size="small"
                                            name={category.name}
                                            autoComplete='off'
                                            type="number"
                                            inputProps={{maxLength:200 }}
                                        >
                                        </TextField>
                                    );
                                }
                                return null;                         
                            })
                         } 
                         </Stack>
                         </Box> 
                         {/*<CamposProducto key={categoryId} category={categoryId}></CamposProducto>  */}
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
 export default ProductCreate;