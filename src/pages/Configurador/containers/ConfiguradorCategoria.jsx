import React, {useContext, useState,useEffect } from 'react';
import AppContext from '@context/AppContext';
import {Alert, Button, Typography } from "@mui/material";
import { Box } from '@mui/system';
import ProductItemConfigurador from '../components/ProductItemConfigurador';
import useGet7 from '@hooks/useGet7';
import '@styles/Pagination2.scss';
import '@styles/ProductList.scss';
import { CircularProgress } from "@mui/material";
import Paginate from '@components/Paginate'; 
const API = process.env.REACT_APP_API_URL;
const APIProducts = API+'products/';
//                             category="20" config={state.configuracion} value={valor} value2= {valor2} optional="false" carFeatures={caracteristicas}/>
const ConfiguradorCategoria = ({category,value,value2,estereo,optional,carFeatures}) => {
    var categoryAPI;
    var categoriaOpcional = category;    
    let categoryComplement = "";
    const { state } = useContext(AppContext);
    const [success, setSuccess] = useState(false); 
    const [errMsg, setErrMsg] = useState('');  
    const [productosFinal,setProductosFinal] = useState(null);
    /*const [productosModelo,setProductosModelo] = useState([]);    
    const [cantidadFija,setCantidadFija] = useState(1);*/
    const [loadingP, setLoadingP] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(6);
    const [currentProducts,setCurrentProducts] = useState(null);
    const [numeroDeProductos,setNumeroDeProductos] = useState(0);
    const [noHayProductos, setNohayProductos] = useState(false);
    const indexOfLastPost = currentPage * productsPerPage;
    const indexOfFirstPost = indexOfLastPost - productsPerPage;

    let dines = state.dinesC; //config.dines;
    let tipoConfiguracion = state.tipoConfiguracionC;
    let editarCantidad = true;
    let cantidadFija = 1;
    let caracteristicas = carFeatures;
    /*const APICajones = `${API}products/cajones/getmodel?model=${state.cajonAcusticoC.modelo}`;  
    */
    switch (category){
        case '7': categoryAPI = 'arneses'; categoriaOpcional = 'Arnenses'; break; //14
        case '8': categoryAPI = 'bases'; categoriaOpcional = 'Bases'; break; //13
        case '20': categoryAPI = 'estereos';  categoriaOpcional = 'Estereo'; break; //1
    }    
    let API2 = APIProducts.concat(categoryAPI,"/?administrador=false&offset=0&limit=700"); 
    //==============================CONSULTAMOS LOS PRODUCTOS==========================================
    const { data: productFetchData, loading, error:errorE } = useGet7(API2);
    useEffect(() => {
        if (!productFetchData) return; 
        console.log("Consulta productos");
        setLoadingP(true);
        if(errorE){
            setSuccess(false);
            setErrMsg("Error al consultar los productos");
            //console.log("ErrorA01");
            //console.log(errorE);
            if (productFetchData.length === 0){
                setErrMsg("No hay articulos disponibles");
                setCurrentProducts([]); //Esto es para que el lenght sea 0 y me salga el loading                
            }
            //setLoadingP(false);
        }
        else{
            //console.log(productFetchData);
            if(productFetchData.products){
                const productos = productFetchData.products;
                if (categoryComplement !== "") {
                    let APIComplement = APIProducts.concat(categoryComplement,"/?administrador=true&offset=0&limit=50"); 
                    fetch(APIComplement)
                    .then(response => response.json())
                    .then(dataComplement => {
                        const combinedProducts = [...productos, ...dataComplement.products];
                        filterAndSetProductosFinal(combinedProducts); 
                    })
                    .catch(error => {
                        //Para las bocinas agregamos tambien los componentes
                        console.log("ErrorA02");
                    })
                    .finally(() => setLoadingP(false));
                }
                else {
                    filterAndSetProductosFinal(productos);
                    setLoadingP(false);
                }
            }
            else {
                setLoadingP(false);
            }
        }
        setLoadingP(false);
    }, [productFetchData,errorE,categoryComplement]);
    //=======================================================================================================
    const filterAndSetProductosFinal = (productos) => {
        //console.log("categoria");
        if (value !== 'N/A') {  // Esta es la categoria
            let productosModeloAux = [];
            switch (category) {               
                case '7': //Arneses
                    if(typeof caracteristicas !== "undefined"){
                        if (caracteristicas){ 
                            const arnesAI = caracteristicas?.arnesAI;
                            const arnesHF = caracteristicas?.arnesHF; 
                            //console.log('Filtrara los arneses de acuerdo a los siguientes modelos '+arnesAI+' '+arnesHF);
                            productosModeloAux = productos?.filter(function(product){ 
                                return  product.Modelo== arnesAI || product.Modelo == arnesHF;
                            });                       
                        }
                    }
                    else{
                        productosModeloAux = productos?.filter(function(product){ return (product.Modelo==product.Modelo)});
                    }              
                    console.log(productosModeloAux) ;    
                    setProductosFinal(productosModeloAux);
                break;
                case '8': //Bases
                    /*console.log("entrada a filtar bases");
                    console.log(caracteristicas);*/
                    //El Modelo de la base tiene que ser el del modelo de la configuracion
                    if(typeof caracteristicas !== "undefined"){
                        if (caracteristicas){ 
                            var unDinAI = caracteristicas?.unDinAI;
                            const unDinHF = caracteristicas?.unDinHF; 
                            const dobleDinAI = caracteristicas?.dobleDinAI;
                            const dobleDinHF = caracteristicas?.dobleDinHF;                           
                            if (dines == '1'){                                             
                                productosModeloAux = productos?.filter(function (product) {
                                    const matchUnDinAI =
                                      typeof unDinAI === 'string'
                                        ? product.Modelo === unDinAI
                                        : Array.isArray(unDinAI) && unDinAI.some(item => item.modeloBase === product.Modelo);
                                  
                                    const matchUnDinHF =
                                      typeof unDinHF === 'string'
                                        ? product.Modelo === unDinHF
                                        : Array.isArray(unDinHF) && unDinHF.some(item => item.modeloBase === product.Modelo);
                                  
                                    return matchUnDinAI || matchUnDinHF;
                                });                                       
                            } else
                            if(dines == '2'){
                                //console.log("Filtrata bases de acuerdo a estos modelos "+dobleDinAI+" "+dobleDinHF);
                                productosModeloAux = productos?.filter(function (product) {
                                    const matchDobleDinAI =
                                      typeof dobleDinAI === 'string'
                                        ? product.Modelo === dobleDinAI
                                        : Array.isArray(dobleDinAI) && dobleDinAI.some(item => item.modeloBase === product.Modelo);
                                  
                                    const matchDobleDinHF =
                                      typeof dobleDinHF === 'string'
                                        ? product.Modelo === dobleDinHF
                                        : Array.isArray(dobleDinHF) && dobleDinHF.some(item => item.modeloBase === product.Modelo);
                                  
                                    return matchDobleDinAI || matchDobleDinHF;
                                });  
                            }
                            else{
                                //console.log("No filtrata nada de Bases" );
                                productosModeloAux = productos?.filter(function(product){ return (product.Modelo==product.Modelo)});
                            }    
                        }                        
                        setProductosFinal(productosModeloAux);
                    }
                    else{
                        productosModeloAux = productosModelo?.filter(function(product){ return (product.Modelo==product.Modelo)});
                    }
                    setProductosFinal(productosModeloAux);
                break;               
                case '20': //Estereos                   
                    productosModeloAux = productos?.filter(function(product){ 
                        const tipoConfiguracion2 = typeof tipoConfiguracion === 'string' ? tipoConfiguracion.toLowerCase() : '';
                        //return (product.Dines==dines && (product.tipoCategoria).toLowerCase() == tipoConfiguracion2)
                        //En este ejemplo si tipoConfiguracion2 === '' entonces solo evaluamos la primera condicional
                        return (product.Dines==dines) && (tipoConfiguracion2 === '' || (product.tipoCategoria).toLowerCase() == tipoConfiguracion2);
                        }
                    );
                    productosModeloAux = productos;
                    setProductosFinal(productosModeloAux);
                break;              
                default:
                    productosModeloAux = productos;
                    setProductosFinal(productos);
                    //setNumeroDeProductos(productos.length);
            }
            setNumeroDeProductos(productosModeloAux.length);
        }
    };
    //-----PAGINATION------/
    useEffect(() => {
        console.log(productosFinal);
        if (!productosFinal) return; 
        console.log("Actualiza productos")
        setLoadingP(true);
        if (productosFinal && productosFinal.length > 0) {
            console.log('entroA')
            setCurrentProducts(productosFinal.slice(indexOfFirstPost, indexOfLastPost));
        }
        else if (productosFinal && productosFinal.length == 0) {
            console.log('entroB')
            setCurrentProducts([]);
        }
        setLoadingP(false);
    }, [currentPage, productsPerPage, productosFinal]);
    
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const previousPage = () => {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    const nextPage = () => {
        if (productosFinal && productosFinal !== undefined){
            if (currentPage !== Math.ceil(productosFinal.length / productsPerPage)) {
            setCurrentPage(currentPage + 1);
            }
        }
    };
    //---------------------------------------------
    //     /*const handleProductoOpcional = (category) =>{ setProductoOpcional(category); };*/
    //console.log(loading);
    //console.log(currentProducts);
    if (loading || currentProducts  === null) {
        return <CircularProgress />;
    }
    if (!success && errMsg) {
        return (<>
                    <Alert 
                    severity={(errMsg != "No hay articulos disponibles" && !success) ? "error" : "info"}  
                    className={errMsg ? "errmsg" : "offscreen"} 
                    aria-live="assertive" >{errMsg}
                    </Alert> 
                    {
                    (optional !== undefined && optional === 'true') && (
                    <Button  className="configurador-optionalButton" variant="contained" onClick={() => handleClickOpcional(category)}>
                        No deseo este producto
                    </Button>   )
                }
                </>);
      }
     return(     
        <> 
            {
            (currentProducts?.length > 0) ? (               
                <>
                    <Box className="ProductListConf">
                        {
                            currentProducts.map((product) => (
                                <ProductItemConfigurador 
                                product={product} 
                                key={product.sku} 
                                category={category} 
                                editarCantidad={editarCantidad} 
                                cantidadFija={cantidadFija}
                                orderId={state.confOrderId}/>
                            ))    
                        }   
                        {
                            (optional !== undefined && optional === 'true') && (
                            <Button  className="configurador-optionalButton" variant="contained" onClick={() => handleClickOpcional(category)}>
                                No deseo este producto
                            </Button>   )
                        }
                    </Box> 
                    <Paginate
                        productsPerPage={productsPerPage}
                        totalPosts={numeroDeProductos}
                        paginate={paginate}
                        previousPage={previousPage}
                        nextPage={nextPage}
                        currentPage={currentPage}
                    /> 
                </>
            ) : (
                <Box className= "configurador-noStock" >
                    <Typography>No hay productos disponibles por el momento.</Typography>
                    <Button className="configurador-optionalButton" variant="contained" onClick={() => handleClickOpcional(category)}>
                        Continuar
                    </Button>
                </Box>
                )
            }  
        </>    
     
    );
}
export default React.memo(ConfiguradorCategoria);