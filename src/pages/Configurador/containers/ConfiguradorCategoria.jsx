import React, {useContext, useState,useEffect } from 'react';
import AppContext from '@context/AppContext';
import {Alert, Button, Typography } from "@mui/material";
import { Box } from '@mui/system';
import ProductItemConfigurador from '../components/ProductItemConfigurador';
import useGet7 from '@hooks/useGet7';
import usePut from '@hooks/usePut';
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
    const { state,setProductoOpcional } = useContext(AppContext);
    const [success, setSuccess] = useState(false); 
    const [errMsg, setErrMsg] = useState('');  
    const [productosFinal,setProductosFinal] = useState(null);
    /*const [productosModelo,setProductosModelo] = useState([]);    */
    const [cantidadFija,setCantidadFija] = useState(1);
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
    //let cantidadFija = 1;
    let caracteristicas = carFeatures;
    const APICajones = `${API}products/cajones/getmodel?model=${state.cajonAcusticoC.modelo}`;  
    //console.log("switch category");
    //console.log(category);
    switch (category){
        case '1': categoryAPI = 'accesorios'; categoriaOpcional = 'Accesorios'; break;  //26
        case '2': categoryAPI = 'adaptadoresAntena'; categoriaOpcional = 'Adaptadores de Antena'; break;  //15
        case '4': categoryAPI = 'amplificadores3en1'; categoriaOpcional = 'Amplificadores 3 en 1'; break; //38 
        case '5': // Amplificador de Voz  4 canales, clase D = bajo/Woofer A/B = voz
        case '6': categoryAPI = 'amplificadores'; categoriaOpcional = 'Amplificadores'; break;  //17 //Amplificador de Woofer 
        case '7': categoryAPI = 'arneses'; categoriaOpcional = 'Arnenses'; break; //14
        case '8': categoryAPI = 'bases'; categoriaOpcional = 'Bases'; break; //13
        case '9': categoryAPI = 'bocinas'; categoriaOpcional = 'Bocinas Premium Delanteras'; categoryComplement = 'componentes'; break; //16
        case '10': categoryAPI = 'bocinas'; categoriaOpcional = 'Bocinas Premium Traseras'; categoryComplement = 'componentes'; break; //16
        case '11': categoryAPI = 'bocinas'; categoriaOpcional = 'Bocinas de Reemplazo Delanteras'; categoryComplement = 'componentes'; break; //16  
        case '12': categoryAPI = 'bocinas'; categoriaOpcional = 'Bocinas de Reemplazo Traseras'; categoryComplement = 'componentes'; break; //16
        case '13': categoryAPI = 'cajones'; categoriaOpcional = 'Cajones'; break; //22 =>71
        case '14': categoryAPI = 'basesBocina'; categoriaOpcional = 'Base para Bocinas Premium Delanteras'; break; //28
        case '16': categoryAPI = 'basesBocina'; categoriaOpcional = 'Base para Bocinas Delanteras'; break; //28
        case '17': categoryAPI = 'basesBocina'; categoriaOpcional = 'Base para Bocinas Traseras'; break; //28
        case '18': categoryAPI = 'ecualizadores'; categoriaOpcional = 'Ecualizadores'; break;  //20*
        case '19': categoryAPI = 'epicentros'; categoriaOpcional = 'Epicentros'; break; //23
        case '20': categoryAPI = 'estereos';  categoriaOpcional = 'Estereo'; break; //1
        case '21': categoryAPI = 'kitsCables'; categoriaOpcional = 'Kit de Cables'; break; //25    
        case '23': categoryAPI = 'procesadores'; categoriaOpcional = 'Procesadores'; break;  //No hay ninguno   
        case '25': categoryAPI = 'tweeters'; categoriaOpcional = 'Tweeters'; break;  //19
        case '26': categoryAPI = 'woofers'; categoriaOpcional = 'Woofers'; break;  //2
    }    
    //console.log(categoryAPI);
    const handleProductoOpcional = (category) =>{ setProductoOpcional(category); };
    let API2 = APIProducts.concat(categoryAPI,"/?administrador=false&offset=0&limit=700"); 
    console.log(API2);
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
            console.log(productFetchData);
            if(productFetchData.products){
                const productos = productFetchData.products;
                if (categoryComplement !== "") {
                    let APIComplement = APIProducts.concat(categoryComplement,"/?administrador=true&offset=0&limit=50"); 
                    console.log(APIComplement);
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
        console.log("filterAndSetProductosFinal");
        if (value !== 'N/A') {  // Esta es la categoria
            let productosModeloAux = [];
            switch (category) {               
                case '7': //Arneses
                    if(typeof caracteristicas !== "undefined"){
                        if (caracteristicas){ 
                            const arnesAI = caracteristicas?.arnesAI;
                            const arnesHF = caracteristicas?.arnesHF; 
                            //console.log('Filtrara los arneses de acuerdo a los siguientes modelos '+arnesAI+' '+arnesHF);
                            //console.log(productos);
                            productosModeloAux = productos?.filter(function(product){ 
                                return  product.Modelo== arnesAI || product.Modelo == arnesHF;
                            });                       
                        }
                    }
                    else{
                        productosModeloAux = productos?.filter(function(product){ return (product.Modelo==product.Modelo)});
                    }              
                    //console.log(productosModeloAux) ;    
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
                case '2': //Adaptadores
                    //console.log("Entra a adaptadores");
                    if(typeof caracteristicas !== "undefined"){
                        if (caracteristicas){ 
                            const adaptadorAntenaAI = caracteristicas?.adaptadorAntenaAI;
                            const adaptadorAntenaHF = caracteristicas?.adaptadorAntenaHF; 
                            //console.log("filtrata los adaptadores de acuerdo a estos modelos "+adaptadorAntenaAI+" "+adaptadorAntenaHF);
                            productosModeloAux = productos?.filter(function(product){ 
                                return  product.Modelo== adaptadorAntenaAI || product.Modelo == adaptadorAntenaHF || product.Modelo == 'AU';
                            });
                        }
                    }
                    else{
                        productosModeloAux = productos?.filter(function(product){ return (product.Modelo==product.Modelo)});
                    }
                    setProductosFinal(productosModeloAux);
                    //setNumeroDeProductos(productosModeloAux.length);
                break;
                case '9': //BOCINA PREMIUM DELANTERA
                case '11': //BOCINAS REEMPLAZO DELANTERAS FILTROS:  
                    //Las bocinas van combinadas con los componentes, cuando es componente quito el filtro de categoria
                    console.log("Entra a bocinas delanteras");
                    //console.log(caracteristicas);
                    if(typeof caracteristicas !== "undefined"){
                        //console.log("Entra a filtrar delanteras");
                        if (caracteristicas){ 
                            const diametroBocinaFrontal = parseFloat(caracteristicas.diametroBocinaFrontal); //console.log(diametroBocinaFrontal);
                            const diametroBocinaFrontalString = diametroBocinaFrontal.toString().replace('.', 'x'); //console.log(diametroBocinaFrontalString);
                            const profundidadBocinaFrontal = caracteristicas.profundidadBocinaFrontal; //console.log(profundidadBocinaFrontal);
                            let categoria = (caracteristicas.bocinaCompatibleFrontal).toLowerCase(); //console.log(categoria);
                            const tipoBocinaFrontal = (caracteristicas.tipoBocinaFrontal).toLowerCase(); //console.log(tipoBocinaFrontal);     
                            
                            console.log(diametroBocinaFrontal);
                            console.log(profundidadBocinaFrontal);
                            console.log(categoria); //pb (carro)
                            console.log(tipoBocinaFrontal); //Componente (carro)
                            console.log(productos);


                            productosModeloAux = productos?.filter(function(product){ 
                                const tipoConfiguracion2 = typeof tipoConfiguracion === 'string' ? tipoConfiguracion.toLowerCase() : '';                                    
                                //console.log(tipoConfiguracion2); //básico
                                return (
                                    (product.diametro == diametroBocinaFrontal || (product.diametro ?? '').toLowerCase() == diametroBocinaFrontalString) &&
                                    (product.Profundidad ?? '').toLowerCase() == profundidadBocinaFrontal.toLowerCase() &&
                                     //Cuando es componente (bocinaCompatibleFrontal) quito el filtro (categoria) y hago la union con los componentes
                                    //(product.Categoria ?? '').toLowerCase() == categoria.toLowerCase() &&
                                    (categoria.toLowerCase() === 'componente' || (product.Categoria ?? '').toLowerCase() == categoria.toLowerCase()) &&
                                    
                                    //((Carro)pb === 'componente' || (producto)'Bocinas' == (carro)'pb' )
                                    (product.tipoBocinas ?? '').toLowerCase() == tipoBocinaFrontal.toLowerCase() &&
                                    (product.tipoCategoria ?? '').toLowerCase() == tipoConfiguracion2.toLowerCase()
                                );
                            });                                             
                        }
                    }
                    else{
                        productosModeloAux = productos?.filter(function(product){ 
                            return product.Modelo==product.Modelo;
                        });
                    }  
                    setProductosFinal(productosModeloAux);
                break;
                case '14':
                case '16': //Bases para bocina delantera
                    //console.log("filtra Bases para bocina delantera");
                    if(typeof caracteristicas !== "undefined"){
                        if (caracteristicas){ 
                            const calzaFrontalAI = caracteristicas?.calzaFrontalAI;
                            const calzaFrontalHF = caracteristicas?.calzaFrontalHF;
                            //console.log('Filtrara las bases frontales de acuerdo a '+calzaFrontalAI+' '+calzaFrontalHF);
                            productosModeloAux = productos?.filter(function(product){ 
                                return  product.Modelo== calzaFrontalAI || product.Modelo == calzaFrontalHF;
                            });
                        }
                    }
                    else{
                        productosModeloAux = productos?.filter(function(product){ return (product.Modelo==product.Modelo)});
                    }
                    setProductosFinal(productosModeloAux);
                break;
                case '10': //BOCINAS PREMIUM TRASERAS                
                case '12': //BOCINAS REEMPLAZO TRASERAS
                    //console.log("Entra a bocinas traseras");
                    if(typeof caracteristicas !== "undefined"){
                        if (caracteristicas){ 
                            //console.log("Entra a filtrar traseras");
                            const diametroBocinaTrasera = parseFloat(caracteristicas.diametroBocinaTrasera); //console.log(diametroBocinaTrasera);
                            const diametroBocinaTraseraString = diametroBocinaTrasera.toString().replace('.', 'x'); //console.log(diametroBocinaTraseraString);
                            const profundidadBocinaTrasera = caracteristicas.profundidadBocinaTrasera; //console.log(profundidadBocinaTrasera);
                            let categoria = (caracteristicas.bocinaCompatibleTrasera).toLowerCase(); //console.log(categoria);        
                            const tipoBocinaTrasera = (caracteristicas.tipoBocinaTrasera).toLowerCase(); //console.log(tipoBocinaFrontal);                          
                            productosModeloAux = productos?.filter(function(product){ 
                                const tipoConfiguracion2 = typeof tipoConfiguracion === 'string' ? tipoConfiguracion.toLowerCase() : '';
                                return (
                                    (product.diametro == diametroBocinaTrasera || (product.diametro ?? '').toLowerCase() == diametroBocinaTraseraString) &&
                                    (product.Profundidad ?? '').toLowerCase() == profundidadBocinaTrasera.toLowerCase() &&
                                    //Cuando es componente (bocinaCompatibleFrontal) quito el filtro (categoria) y hago la union con los componentes
                                    //(product.Categoria ?? '').toLowerCase() == categoria.toLowerCase() &&
                                    (categoria.toLowerCase() === 'componente' || (product.Categoria ?? '').toLowerCase() == categoria.toLowerCase()) &&
                                    (product.tipoBocinas ?? '').toLowerCase() == tipoBocinaTrasera.toLowerCase() &&
                                    (product.tipoCategoria ?? '').toLowerCase() == tipoConfiguracion2.toLowerCase()
                                );
                            });
                        }                       
                    }
                    else{
                        productosModeloAux = productos?.filter(function(product){ 
                            return product.diametro==product.diametro;
                        });
                    }
                    setProductosFinal(productosModeloAux);
                break;
                case '17': //Bases para bocina trasera
                    if(typeof caracteristicas !== "undefined"){
                        if (caracteristicas){ 
                            const calzaTraseraAI = caracteristicas?.calzaTraseraAI;
                            const calzaTraseraHF = caracteristicas?.calzaTraseraHF;
                            //console.log('Filtrara las bases traseras de acuerdo a '+calzaTraseraAI +' ' +calzaTraseraHF);
                            //console.log(productos);
                            productosModeloAux = productos?.filter(function(product){ 
                                return  (product.Modelo == calzaTraseraAI || product.Modelo == calzaTraseraHF);
                            });
                        }
                    }
                    else{
                        productosModeloAux = productos?.filter(function(product){ return (product.Modelo==product.Modelo)});
                    }
                    setProductosFinal(productosModeloAux);
                break;
                case '5': // Amplificador de Voz
                //console.log("Entra a Amplificadores");
                productosModeloAux = productos?.filter(function (product) {
                    const tipoConfiguracion2 = typeof tipoConfiguracion === 'string' ? tipoConfiguracion.toLowerCase() : '';
                    return (
                        product.clase === 'A/B' &&
                        product.tipoCategoria.toLowerCase() === tipoConfiguracion2
                    );
                });
                setProductosFinal(productosModeloAux);
                break;
                case '6': //Amplificador de Bajos/Woofer
                    //console.log("Filtra amplificadore de woofer")
                    productosModeloAux = productos?.filter(function(product){ 
                        const tipoConfiguracion2 = typeof tipoConfiguracion === 'string' ? tipoConfiguracion.toLowerCase() : '';
                        return (
                            product.clase=='D' &&
                            (product.tipoCategoria).toLowerCase() == tipoConfiguracion2
                        )
                    });               
                    setProductosFinal(productosModeloAux);
                break;
                case '13':  //Cajon Acustico
                    //console.log("Cajon Acustico");
                    //console.log("Filta los cajones que tengan el subgrupo del modelo");
                    const tamanioCajuela = caracteristicas?.tamanioCajuela;
                    //console.log(tamanioCajuela);
                    productosModeloAux = productos?.filter(function (product) {
                        return (
                        typeof tamanioCajuela === 'string'
                            ? (product.subgrupo).toLowerCase() === tamanioCajuela
                            : Array.isArray(tamanioCajuela) && tamanioCajuela.some(item => item.claveCajones === product.subgrupo));
                    }); 
                    setProductosFinal(productosModeloAux); 
                    //setNumeroDeProductos(productosModeloAux.length);
                break; 
                case '19': //Epicentro
                case '23': //Procesador 
                case '25': //Tweeters
                case '18': //Ecualizador
                //console.log(productos);
                    productosModeloAux = productos?.filter(function(product) {                        
                        const tipoConfiguracion2 = typeof tipoConfiguracion === 'string' ? tipoConfiguracion.toLowerCase().trim() : '';            
                        return (product.tipoCategoria).toLowerCase().trim() === tipoConfiguracion2;
                    });
                    setProductosFinal(productosModeloAux);
                break;
                case '21': //Kit de cables 
                    console.log("Entra a filtar kits de cables");
                    const fetchCaracteristicasKitCables = async () => {
                    try {    
                    let modeloamplificador = "";
                    if (typeof state.amplificadorC.modelo !== "undefined"){
                        modeloamplificador = state.amplificadorC.modelo;
                    }
                    if(typeof state.amplificadorWooferC.modelo !== "undefined"){
                        modeloamplificador = state.amplificadorWooferC.modelo;
                    }
                    const APIAmplificador = API + 'products/amplificadores/getmodel?model='+modeloamplificador;   
                    const response = await fetch(APIAmplificador);
                    const caracteristicasAmplificador = await response.json();
                    let subgrupoAmplificadores = caracteristicasAmplificador?.subgrupo ?? ''; 
                    const tipoConfiguracion2 = typeof tipoConfiguracion === 'string' ? tipoConfiguracion.toLowerCase() : '';                      
                    console.log("Filta los Woofers de al tipo de categoria ("+tipoConfiguracion2+")");
                    productosModeloAux = productos?.filter(function(product) {
                        if (typeof state.amplificador3en1C.modelo !== "undefined"){
                            return ((product.tipoCategoria).toLowerCase() === tipoConfiguracion2);
                        }       
                        else{                            
                            return ((product.tipoCategoria).toLowerCase() === tipoConfiguracion2 && (product.subgrupo).toLowerCase() == subgrupoAmplificadores.toLowerCase());
                        }
                        
                    });      

                    setProductosFinal(productosModeloAux);
                    } catch (error) {
                        console.error('Error fetching data Kit Cables:', error);
                    }
                    };
                    fetchCaracteristicasKitCables();
                break;
                case '26':  //Woofers para los woofers consultamos de acuerdo a las caracteristicas del cajon que seleccionó
                    //console.log("Woofers");
                    const fetchCaracteristicasCajones = async () => {
                        try {
                    const response = await fetch(APICajones);
                    const caracteristicasCajones = await response.json();
                    editarCantidad = false;  // No permitimos editar la cantidad
                    let cajonesPulgadas = caracteristicasCajones.pulgadas;
                    let tipoWoofer = caracteristicasCajones.tipoWoofer;
                    //let cantidadFija = caracteristicasCajones.cantidadWoofers;
                    setCantidadFija(caracteristicasCajones.cantidadWoofers);
                    const tipoConfiguracion2 = typeof tipoConfiguracion === 'string' ? tipoConfiguracion.toLowerCase() : '';  
                    /*console.log("Filta los Woofers de acuerdo al numero de cantidadWoofers que tenga el cajon");
                    console.log("Filta los Woofers de al tipo de categoria ("+tipoConfiguracion2+")");
                    console.log("Pulgadas: "+cajonesPulgadas);
                    console.log("Tipo: "+tipoWoofer);*/
                    productosModeloAux = productos?.filter(function(product) {                                 
                        return (
                            (product.tipoCategoria).toLowerCase() === tipoConfiguracion2 && 
                            product.pulgadas == cajonesPulgadas && // validar el tamaño de la pulgada woofers (AK) cajones (AL)
                            product.tipo == tipoWoofer // woofers Tipo(AO) cajones (tipo woofer)
                        );
                    });        
                        setProductosFinal(productosModeloAux);
                    } catch (error) {
                        console.error('Error fetching data:', error);
                    }
                };

                fetchCaracteristicasCajones();
                break;

                default:
                    productosModeloAux = productos;
                    setProductosFinal(productos);
                    //setNumeroDeProductos(productos.length);
            }
            setNumeroDeProductos(productosModeloAux.length);
        }
    };

    const handleClickOpcional = category => {
        const APIconfCaracteristicas = API+'orders/'+state.confOrderId;
        const activeConfigOrder = state.confOrderId
        let data;
        //console.log(APIconfCaracteristicas);
        switch(category){
            case '1': 
                data = {orderType:'configurador', accesorioC: 'N/A', status: 'activo' }
                usePut(APIconfCaracteristicas,data);
            break;
            case '11': 
                data = {orderType:'configurador', bocinaReemplazoDelanteraC: 'N/A', status: 'activo' }
                usePut(APIconfCaracteristicas,data);
            break;
            case '16': 
                data = {orderType:'configurador', calzaBocinaReemplazoDelanteraC: 'N/A', status: 'activo' }
                usePut(APIconfCaracteristicas,data); 
            break;
            case '12': 
                data = {orderType:'configurador', bocinaReemplazoTraseraC: 'N/A', status: 'activo' }
                usePut(APIconfCaracteristicas,data); 
            break;
            case '17': 
                data = {orderType:'configurador', calzaBocinaReemplazoTraseraC: 'N/A', status: 'activo'}
                usePut(APIconfCaracteristicas,data); 
            break;
            case '9': 
                data = {orderType:'configurador', bocinaPremiumDelanteraC: 'N/A', status: 'activo' }
                usePut(APIconfCaracteristicas,data);
            break;
            case '14': 
                data = {orderType:'configurador', calzaBocinaPremiumDelanteraC: 'N/A', status: 'activo' }
                usePut(APIconfCaracteristicas,data); 
            break;
            case '10': 
                data = {orderType:'configurador', bocinaPremiumTraseraC: 'N/A', status: 'activo' }
                usePut(APIconfCaracteristicas,data); 
            break;
            case '15': 
                data = {orderType:'configurador', calzaBocinaPremiumTraseraC: 'N/A', status: 'activo' }
                usePut(APIconfCaracteristicas,data); 
            break;
            case '13': 
                data = {orderType:'configurador', cajonAcusticoC: 'N/A', status: 'activo' }
                usePut(APIconfCaracteristicas,data); 
            break;
            case '18': 
                data = {orderType:'configurador', ecualizadorC: 'N/A', status: 'activo' }
                usePut(APIconfCaracteristicas,data); 
            break;
            case '19': 
                data = {orderType:'configurador', epicentroC: 'N/A', status: 'activo' }
                usePut(APIconfCaracteristicas,data); 
            break;
            case '21': 
                data = {orderType:'configurador', kitCablesC: 'N/A', status: 'activo' }
                usePut(APIconfCaracteristicas,data); 
            break;
            case '23': 
                data = {orderType:'configurador', procesadorC: 'N/A', status: 'activo' }
                usePut(APIconfCaracteristicas,data); 
            break;     
            case '25': 
            data = {orderType:'configurador', tweeterC: 'N/A', status: 'activo' }
            usePut(APIconfCaracteristicas,data); 
            break;   
            case '25': 
                data = {orderType:'configurador', componentesC: 'N/A', status: 'activo' }
                usePut(APIconfCaracteristicas,data); 
            break;         
            case '26': 
                data = {orderType:'configurador', wooferC: 'N/A', status: 'activo' }
                usePut(APIconfCaracteristicas,data); 
            break;
            case '6': 
                data = {orderType:'configurador', amplificadorWooferC: 'N/A', status: 'activo' }
                usePut(APIconfCaracteristicas,data); 
            break;
        }
        handleProductoOpcional(category);
    }


    //-----PAGINATION------/
    useEffect(() => {
        //console.log(productosFinal);
        if (!productosFinal) return; 
        //console.log("Actualiza productos")
        setLoadingP(true);
        if (productosFinal && productosFinal.length > 0) {
            //console.log('entroA')
            setCurrentProducts(productosFinal.slice(indexOfFirstPost, indexOfLastPost));
        }
        else if (productosFinal && productosFinal.length == 0) {
            //console.log('entroB')
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