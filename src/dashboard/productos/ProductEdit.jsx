import React, { useRef, useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";
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
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import itLocale from "i18n-iso-countries/langs/it.json";
import esLocale from "i18n-iso-countries/langs/es.json";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import usePatchV from '@hooks/usePatchV';
import useGet7 from '@hooks/useGet7';
import useGet7V from '@hooks/useGet7V';
import useDelete2V from '@hooks/useDelete2V';
import CircularProgress from '@mui/material/CircularProgress';
import AppContext from '@context/AppContext';
const API = process.env.REACT_APP_API_URL;
const APICATEGORIAS = API+'categories/?offset=0&limit=100';
const APIPROVEEDORES = API+'proveedores/';
const APIFotos = API+'fotos';
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
const ProductEdit = () => {
    const { state } = useContext(AppContext);
    //const{product_id} = useParams();
    const{idCategory} = useParams();
    const{modelo} = useParams();
    const [urlProducto, setUrlProducto] = useState('');
    const [urlProductoPatch, setUrlProductoPatch] = useState('');
    const [success, setSuccess] = useState(false);  
    const [fotosData, setFotosData] = useState([]);
    const [fotosDataFiltered, setFotosDataFiltered] = useState([]);
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
    const handleCategoria = (event) => {
        setCategoryId(event.target.value);
        //En la edicion no sera posible cambiarle la categoria ya que los ID de productos son únicos en cada tabla
    };
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
            //console.log(selectedFile);
            // Request made to the backend api
            // Send formData object
            //axios.post("api/uploadfile", formData);
            }
    };
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
    };*/
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
    const navigate = useNavigate();
    const errRef = useRef();
    const form = useRef(null);
    const [errMsg, setErrMsg] = useState('');
    const [loadingGuardar, setLoadingGuardar] = useState(false);
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
    const [dataArray, setDataArray] = useState(''); //Para los campos especificos    
    const [categoriaName,setCategoriaName] = useState('');
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

//=====================================================================CATEGORIAS=================== 
    const { data: categoriasFetchData, loading: loadingC, error:errorC } = useGet7(APICATEGORIAS);
    useEffect(() => {
        if(errorC){
            setSuccess(false);
            setErrMsg("Error al consultar Categorias");
        }  else {
           if(categoriasFetchData.products){                
               const arrayCategorias = categoriasFetchData.products;
               const urlAPI = arrayCategorias.find(item => item.id === parseInt(idCategory));
               if(urlAPI && urlAPI.url){
                    const urlPatch = API+urlAPI.url;                  
                    const urlLiga = API+urlAPI.url+'getmodel?administrador=true&model='+modelo; 
                    setUrlProducto(urlLiga);
                    setCategoriaName(urlAPI.productModel);
                    setUrlProductoPatch(urlPatch);
               }
           }
       }
    }, [categoriasFetchData,errorC]);
   const categorias = categoriasFetchData.products;
//==================================================================================================
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
//===============================================================CAMPOS PRODUCTOS===================  
    const[camposCategoria,setCamposCategoria] = useState([]);
    const { data: camposProductosFetchData, loading, error } = useGet7(API+"camposProductos?offset=0&limit=10&categoryId="+categoryId);
    useEffect(() => {    
        if(error){
            if (error == `No se encontraron resultados`){
                setCamposCategoria([]);
                setSuccess(true);
                setErrMsg("");
            }
            else
            {
                setCamposCategoria([]);
                setSuccess(false);
                setErrMsg(error+" (Code 001)" || "Error de consulta");
            }
       
        }
        else  if (camposProductosFetchData && camposProductosFetchData.products) {
            setSuccess(true);
            setErrMsg("");
            setCamposCategoria(camposProductosFetchData.products);
        }     
    }, [camposProductosFetchData,error]);//Cada vez que cambia la categoria
//==================================================================================================
//=====================================================================PRODUCTOS====================
    const { data: productoFetchData, loading: loadingPr, error: errorPr } = useGet7(urlProducto);
    useEffect(() => {
        if(productoFetchData && productoFetchData.Nombre != undefined){
            setCategoryId(productoFetchData.categoryId);
            //setCategoryId("36");
            setId(productoFetchData.id);
            setNombre(productoFetchData.Nombre);
            setSku(productoFetchData.sku);
            setMarca(productoFetchData.marca);
            setModelo(productoFetchData.Modelo);
            setPrecioPromoTotal(productoFetchData.precioPromoTotal);
            setPrecio(productoFetchData.precio);
            setFechaPromocion(productoFetchData.fechaPromocion);
            // Check if CostoInstalador exists before setting it in the state to avoid a warning
            if (productoFetchData.costoInstalador !== undefined) { setCostoInstalador(productoFetchData.costoInstalador); }
            setTipoMoneda(productoFetchData.tipoMoneda);
            setClaveSat(productoFetchData.claveSat);
            setProveedorId(productoFetchData.proveedorId);
            setPeso(productoFetchData.peso);
            setAlto(productoFetchData.alto);
            setLargo(productoFetchData.largo);
            setAncho(productoFetchData.ancho);
            setEmpaqueSecundario(productoFetchData.empaqueSecundario);
            setEmpaqueAlto(productoFetchData.empaqueAlto);
            setEmpaqueLargo(productoFetchData.empaqueLargo);
            setEmpaqueAncho(productoFetchData.empaqueAncho);
            setUnidadPeso(productoFetchData.unidadPeso);
            setUnidadMedida(productoFetchData.unidadMedida);
            setPaisDeOrigen(productoFetchData.paisDeOrigen);
            setCedisAsignado(productoFetchData.cedisAsignado);
            setTags(productoFetchData.tags);
            setDescripcionProducto(productoFetchData.descripcionProducto);
            setDescripcionSEO(productoFetchData.descripcionSEO);
            setTituloSEO(productoFetchData.tituloSEO);
            setCodigoBarras(productoFetchData.codigoBarras);
            setClasificacionProveedoresID(productoFetchData.clasificacionProveedoresID);
            setFavoritos(productoFetchData.Favoritos || false);
            setMostrarTienda(productoFetchData.mostrarTienda || false);
            setConsignacion(productoFetchData.consignacion || false);
            //Consultamos las imagenes
            const fetchFotos = async () => {
                try {
                    const response = await fetch(`${APIFotos}/${productoFetchData.sku}`); // Adjust the parameter as needed
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    const filteredData = data.filter(item => item.url.includes("_lg"));                  
                    setFotosData(data);
                    setFotosDataFiltered(filteredData);
                    setSuccess(true);
                    setErrMsg("");   
                } catch (fotosError) {
                    console.error("Error fetching APIFotos data:", fotosError);
                    setErrMsg("Error fetching APIFotos data:");
                    setSuccess(false);
                }
            };
            fetchFotos();
        } 
        else{
            if(errorP){
              setSuccess(false);
              setErrMsg(errorP || "Error de consulta");
            }
        }
    }, [productoFetchData,errorP]);
//==================================================================================================

    const handleSubmitReturn = (event) => {
        event.preventDefault();
        navigate('/Dashboard/Productos');
    }   
    const handleSubmit = async(event) => {
        event.preventDefault();
        setLoadingGuardar(true);
        if (!categoryId) { setErrorCategoryId(true); } else { setErrorCategoryId(false); }
        if (!Nombre) { setErrorNombre(true); } else { setErrorNombre(false); }
        if (!sku) { setErrorSku(true); } else { setErrorSku(false); }
        if (!marca) { setErrorMarca(true); } else { setErrorMarca(false); }
        if (!Modelo) { setErrorModelo(true); } else { setErrorModelo(false); }
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
            !Modelo ||
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
            Nombre,
            sku,
            marca,
            Modelo,
            precio,
            precioTotal: precio,
            claveSat,
            proveedorId,
            Favoritos: Favoritos,  //ARREGLAR CUANDO SE ESTANDARIZE QUE SEAN BOLEANOS
            mostrarTienda: mostrarTienda,
            consignacion: consignacion, //Default
            Favoritos,
            mostrarTienda
        };


        if (precioPromoTotal && precioPromoTotal !== "") { productData.precioPromoTotal = precioPromoTotal; }
        if (costoInstalador && costoInstalador !== "") { productData.costoInstalador = costoInstalador; }
        if (tipoMoneda && tipoMoneda !== "") { productData.tipoMoneda = tipoMoneda; }
        if (peso && peso !== "") { productData.peso = peso; }
        if (alto && alto !== "") { productData.alto = alto; }
        if (largo && largo !== "") { productData.largo = largo; }
        if (ancho && ancho !== "") { productData.ancho = ancho; }
        if (empaqueSecundario && empaqueSecundario !== "") { productData.empaqueSecundario = empaqueSecundario; }
        if (empaqueAlto && empaqueAlto !== "") { productData.empaqueAlto = empaqueAlto; }
        if (empaqueLargo && empaqueLargo !== "") { productData.empaqueLargo = empaqueLargo; }
        if (empaqueAncho && empaqueAncho !== "") { productData.empaqueAncho = empaqueAncho; }
        if (unidadPeso && unidadPeso !== "") { productData.unidadPeso = unidadPeso; }
        if (unidadMedida && unidadMedida !== "") { productData.unidadMedida = unidadMedida; }
        if (paisDeOrigen && paisDeOrigen !== "") { productData.paisDeOrigen = paisDeOrigen; }
        if (cedisAsignado && cedisAsignado !== "") { productData.cedisAsignado = cedisAsignado; }
        if (tags && tags !== "") { productData.tags = tags; }
        if (descripcionProducto && descripcionProducto !== "") { productData.descripcionProducto = descripcionProducto; }
        if (descripcionSEO && descripcionSEO !== "") { productData.descripcionSEO = descripcionSEO; }
        if (tituloSEO && tituloSEO !== "") { productData.tituloSEO = tituloSEO; }
        if (codigoBarras && codigoBarras !== "") { productData.codigoBarras = codigoBarras; }
        if (clasificacionProveedoresID && clasificacionProveedoresID !== "") { productData.clasificacionProveedoresID = clasificacionProveedoresID; }
        const formData = new FormData(form.current);
        //======================================Valido y agrego los campos especificos=================================== 
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
        //=============================================================================================================== 
        const APIPut = urlProductoPatch+id;
        const { success, data, error } = await usePatchV(APIPut, productData, state.token);
        if (success){
            const files = [selectedFile, selectedFile2, selectedFile3, selectedFile4];
            const sizes = ['sm', 'lg'];
            let borraraImagenes = false;
            for (const file of files) {  //Se recorrend las 4 imagenes
                if (file) {
                  borraraImagenes = true;
                }
            }
            //Borrara las imagenes del producto ============================
           //console.log(fotosData);
            if(borraraImagenes){
                console.log("Borrara las imagenes") 
                if (fotosData.length > 0) {
                    const borraFotosPromises = fotosData.map(async (detalle) => {
                        const { success: successDelete, error: errorDelete } = await useDelete2V(`${APIFotos}/${detalle.id}`,state.token); //Borramos todas las fotos
                        if (successDelete) {
                            setSuccess(true); 
                            //console.log('Fotos Eliminadas: '+detalle.id);
                            setErrMsg("Registro Guardado");            
                            //navigate('/Dashboard/Productos');
                            //window.location.reload();
                        } else if (errorDelete) {
                            console.error(errorDelete || "Error occurred during the request");
                        }                    
                    }
                    );
                    await Promise.all(borraFotosPromises);
                }
    
                //Guardar el ID de cada Imagen y borrar una por una
            } 
            //Subira las Nuevas Imagenes ===============
            for (const file of files) {  //Se recorrend las 4 imagenes
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
                                //console.log("sesubio la imagen");
                                return;
                            }
                        } catch (imageUploadError) {
                            setSuccess(false);
                            //console.error(imageUploadError.message || "Error occurred during the request 02");
                            setErrMsg(imageUploadError.message || "Error occurred during the request 02");
                            return;
                        }
                    }  
                }
            }
            setLoadingGuardar(false);
            alert('Registro Guardado.');
            navigate('/Dashboard/Productos');
        } else {
            setLoadingGuardar(false);
            setSuccess(false);
            setErrMsg(error || "Error occurred during the request");
        }
    }
    if (loadingGuardar || loading || loadingC || loadingPr || categoryId =="" || categorias == undefined) {
        return (
        <Box className="loading-box">
            <Typography>Loading</Typography>
            <CircularProgress color="inherit" />
        </Box>
        );
    }
    if (errorC || errorP) {
        return  <Alert severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert> ;
    }
    return (
        <Container maxWidth="lg" className="justified-container">
            <Box className= "admin-tableHeader" >
                <Typography className="admin-title" variant='h5'>Editar articulo</Typography>
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
                        <FormControl  className="InputBasic"  size="small" variant="outlined">
                           <InputLabel  id="ddl-categoria-label">Categoria</InputLabel>
                           <Select  
                               disabled
                               id="categoryId"
                               name="categoryId"
                               value={categoryId}
                               label="Categoria"
                               onChange={handleCategoria}
                               >
                                {!!categorias?.length &&
                                    categorias.map(({label,id, name}) => {
                                        return (
                                            <MenuItem key={id} value={id}>
                                                {name}
                                            </MenuItem>
                                        );
                                    })
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
                            label="SKU" 
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
                        <TextField className="InputBasic"
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
                        ></TextField>
                        <TextField className="InputBasic"
                            id="precioPromoTotal" 
                            label="Precio promo" 
                            size="small"
                            name="precioPromoTotal"
                            autoComplete='off'
                            value={precioPromoTotal ? precioPromoTotal : ""}
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
                        {/*<TextField className="InputBasic"
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
                        ></TextField>*/}
                        <TextField className="InputBasic"
                            id="costoInstalador" 
                            label="Costo Instalación" 
                            size="small"
                            name="costoInstalador"
                            autoComplete='off'
                            value={costoInstalador ? costoInstalador : ''}
                            type="number"
                            onChange={e=>setCostoInstalador(e.target.value)}
                            inputProps={{maxLength:50 }}
                        ></TextField>
                        
                        <FormControl  className="InputBasic"  size="small" variant="outlined">
                            <InputLabel  id="ddl-tipoMoneda-label">Moneda</InputLabel>
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
                        
                        <Box className="formDivider">
                            <Typography className="formDivider-text">Empaque principal</Typography>
                            <Box className="formDivider-line"></Box>
                        </Box>   
                        <Grid sx={{width:'90%'}} container spacing={2}>
                            <Grid item xs={6} sx={{paddingLeft:'0 !important'}}>
                                <TextField className="InputBasic"
                                    id="peso" 
                                    label="Peso" 
                                    size="small"
                                    name="peso"
                                    autoComplete='on'
                                    value={peso ? peso : ''}
                                    type="number"
                                    onChange={e=>setPeso(e.target.value)}
                                    inputProps={{maxLength:50 }}
                                ></TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField         
                                    id="largo" 
                                    label="Largo" 
                                    size="small"
                                    name="largo"
                                    autoComplete='on'
                                    value={largo ? largo : ''}
                                    type="number"
                                    onChange={e=>setLargo(e.target.value)}
                                    inputProps={{maxLength:50 }}
                                ></TextField>    
                            </Grid>
                            <Grid item xs={6} sx={{paddingLeft:'0 !important'}}>
                                <TextField className="InputBasic"
                                    id="alto" 
                                    label="Alto" 
                                    size="small"
                                    name="alto"
                                    autoComplete='on'
                                    value={alto ? alto : ''}
                                    type="number"
                                    onChange={e=>setAlto(e.target.value)}
                                    inputProps={{maxLength:50 }}
                                ></TextField>    
                            </Grid>
                            <Grid item xs={6}>
                                <TextField 
                                    id="ancho" 
                                    label="Ancho" 
                                    size="small"
                                    name="ancho"
                                    autoComplete='on'
                                    value={ancho ? ancho : ''}
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
                                    id="empaqueSecundario" 
                                    label="Empaque secundario" 
                                    size="small"
                                    name="empaqueSecundario"
                                    autoComplete='off'
                                    value={empaqueSecundario ? empaqueSecundario : ''}
                                    onChange={e=>setEmpaqueSecundario(e.target.value)}
                                    inputProps={{maxLength:50 }}
                                ></TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField          
                                    id="empaqueLargo" 
                                    label="Largo" 
                                    size="small"
                                    name="empaqueLargo"
                                    autoComplete='off'
                                    value={empaqueLargo ? empaqueLargo : ''}
                                    type="number"
                                    onChange={e=>setEmpaqueLargo(e.target.value)}
                                    inputProps={{maxLength:50 }}
                                ></TextField>    
                            </Grid>
                            <Grid item xs={6} sx={{paddingLeft:'0 !important'}}>
                                <TextField className="InputBasic"
                                    id="empaqueAlto" 
                                    label="Alto" 
                                    size="small"
                                    name="empaqueAlto"
                                    autoComplete='off'
                                    value={empaqueAlto ? empaqueAlto : ''}
                                    type="number"
                                    onChange={e=>setEmpaqueAlto(e.target.value)}
                                    inputProps={{maxLength:50 }}
                                ></TextField>    
                            </Grid>
                            <Grid item xs={6}>
                                <TextField 
                                    id="empaqueAncho" 
                                    label="Ancho" 
                                    size="small"
                                    name="empaqueAncho"
                                    autoComplete='on'
                                    value={empaqueAncho ? empaqueAncho : ''}
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
                                value={unidadPeso ? unidadPeso : ''}
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
                                value={unidadMedida ? unidadMedida : ''}
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
                        <TextField 
                            className="InputBasic"
                            disabled
                            id="id" 
                            label="Id" 
                            size="small"
                            name="id"
                            autoComplete='on'
                            value={id}
                            inputProps={{maxLength:50 }}
                        ></TextField> 
                        <FormControl  className="InputBasic"  size="small" variant="outlined">
                            <InputLabel  id="ddl-paisDeOrigen-label">Pais de Origen</InputLabel>
                            <Select                                    
                                value={paisDeOrigen ? paisDeOrigen : ''}
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
                            id="cedisAsignado" 
                            label="Cedis asignado" 
                            size="small"
                            name="cedisAsignado"
                            autoComplete='on'
                            value={cedisAsignado ? cedisAsignado : ''}
                            onChange={e=>setCedisAsignado(e.target.value)}
                            inputProps={{maxLength:100 }}
                        ></TextField> 
                        <TextField className="InputBasic"
                            id="tags" 
                            label="Tags" 
                            size="small"
                            name="tags"
                            autoComplete='on'
                            value={tags ? tags : ''}
                            onChange={e=>setTags(e.target.value)}
                            inputProps={{maxLength:150 }}
                        ></TextField>                   
                        <TextField className="InputBasic"
                            id="descripcionProducto" 
                            label="Descripción del producto" 
                            size="small"
                            name="descripcionProducto"
                            autoComplete='off'
                            value={descripcionProducto ? descripcionProducto : ''}
                            onChange={e=>setDescripcionProducto(e.target.value)}
                            inputProps={{maxLength:200 }}
                        ></TextField>  
                        <TextField className="InputBasic"
                            id="descripcionSEO" 
                            label="Descripción SEO" 
                            size="small"
                            name="descripcionSEO"
                            autoComplete='off'
                            value={descripcionSEO ? descripcionSEO : ''}
                            onChange={e=>setDescripcionSEO(e.target.value)}
                            inputProps={{maxLength:200 }}
                        ></TextField>
                        <TextField className="InputBasic"
                            id="tituloSEO" 
                            label="Titulo SEO" 
                            size="small"
                            name="tituloSEO"
                            autoComplete='off'
                            value={tituloSEO ? tituloSEO : ''}
                            onChange={e=>setTituloSEO(e.target.value)}
                            inputProps={{maxLength:200 }}
                        ></TextField>
                        <TextField className="InputBasic"
                            id="codigoBarras" 
                            label="Codigo de barras" 
                            size="small"
                            name="codigoBarras"
                            autoComplete='off'
                            value={codigoBarras ? codigoBarras : ''}
                            onChange={e=>setCodigoBarras(e.target.value)}
                            inputProps={{maxLength:200 }}
                        ></TextField>
                        <TextField className="InputBasic"
                            id="clasificacionProveedoresID" 
                            label="Clasificacion proveedores ID" 
                            size="small"
                            name="clasificacionProveedoresID"
                            autoComplete='off'
                            value={clasificacionProveedoresID ? clasificacionProveedoresID : ''}
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
                            <Button  className="uploadButton_admin" component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                                <Typography noWrap>Imagen 1</Typography>
                                <VisuallyHiddenInput type="file" onChange={onFileChange}/>
                            </Button>
                            {fileData()} 
                            {fotosDataFiltered[0] ? <a className="uploadButton_container_admin_url" href={fotosDataFiltered[0].url} target="_blank" rel="noopener noreferrer">Ver actual</a>: ""} 
                        </Box>
                        <Box className="uploadButton_container_admin">
                            <Button className="uploadButton_admin" component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                                Imagen 2
                                <VisuallyHiddenInput type="file" onChange={onFileChange2}/>
                            </Button> 
                            {fileData2()} 
                            {fotosDataFiltered[1] ? <a className="uploadButton_container_admin_url" href={fotosDataFiltered[1].url} target="_blank" rel="noopener noreferrer">Ver actual</a>: ""}
                        </Box>
                        <Box className="uploadButton_container_admin">
                            <Button className="uploadButton_admin" component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                                Imagen 3
                                <VisuallyHiddenInput type="file" onChange={onFileChange3}/>
                            </Button>
                            {fileData3()} 
                            {fotosDataFiltered[2] ? <a className="uploadButton_container_admin_url" href={fotosDataFiltered[2].url} target="_blank" rel="noopener noreferrer">Ver actual</a>: ""}
                        </Box>
                        <Box className="uploadButton_container_admin">
                            <Button className="uploadButton_admin" component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                                Imagen 4
                                <VisuallyHiddenInput type="file" onChange={onFileChange4}/>
                            </Button>    
                            {fileData4()}      
                            {fotosDataFiltered[3] ? <a className="uploadButton_container_admin_url" href={fotosDataFiltered[3].url} target="_blank" rel="noopener noreferrer">Ver actual</a>: ""}       
                        </Box>
                        <Box className="uploadButton_container_admin">
                            <Alert severity='warning'>Nota: Se reemplazarán todas las imágenes</Alert> 
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
                                        defaultValue={productoFetchData[category.campoId]}
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
export default ProductEdit;