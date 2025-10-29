import { useNavigate, useParams } from "react-router-dom";
import React, {useEffect, useState, useRef} from "react";
import { Box, Typography, Container, Button, Grid, Stack, Alert } from "@mui/material";
import useGet7 from '@hooks/useGet7';
const API = process.env.REACT_APP_API_URL;
const APICATEGORIAS = API+'categories/?offset=0&limit=100';
const ProductDetail = () => {
    const navigate = useNavigate();
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const errRef = useRef();
    //const{product_id} = useParams();
    const{idCategory} = useParams();
    const{modelo} = useParams();
    const [urlProducto, setUrlProducto] = useState('');
    const [errorPr,setErrorPr] = useState('');
    const[camposCategoria,setCamposCategoria] = useState([]);
    const [productoFetchData, setProductoFetchData] = useState('');
    //Buscamos la liga del producto
    const { data: categoriasFetchData, loading: loadingC, error:errorC } = useGet7(APICATEGORIAS);
    useEffect(() => {
        if(errorC){
            setSuccess(false);
            setErrMsg("Error al consultar Categorias");
        }
        else {
            if(categoriasFetchData.products){
                //setSuccess(true);
                //setErrMsg("");
                //console.log("ENtra a fetch");
                const arrayCategorias = categoriasFetchData.products;
                const urlAPI = arrayCategorias.find(item => item.id === parseInt(idCategory));
                //console.log(urlAPI);
                if(urlAPI && urlAPI.url){
                    const urlLiga = API+urlAPI.url+'getmodel?administrador=true&model='+modelo;    
                        //console.log(urlLiga);               
                        //setUrlProducto(API+urlLiga+modelo);
                        //setUrlProducto(urlLiga);
                        fetch(urlLiga)
                        .then(response => response.json())
                        .then(data => {
                            console.log("Exitosa");
                            setSuccess(true);
                            setErrMsg("");
                            setProductoFetchData(data);
                        })
                        .catch(error => {
                            console.log("No Exitosa");
                            setSuccess(false);
                            setErrMsg(error);
                            setErrorPr(true);
                        });


                }
            }
        }
    }, [categoriasFetchData,errorC]);
    
    const handleSubmitReturn = (event) => {
        event.preventDefault();
        navigate('/Dashboard/Productos');
    }   
    //Buscamos los campos especificos
    const { data: camposProductosFetchData, loading: loadingCC, error: errorCC } = useGet7(API+"camposProductos?offset=0&limit=10&categoryId="+idCategory);
    useEffect(() => {    
        if(idCategory == ""){
           return;
        }
        if (camposProductosFetchData && camposProductosFetchData.products) {
            setErrMsg("");
            setSuccess(true);
            setCamposCategoria(camposProductosFetchData.products);
        } 
        else{
           if(errorCC){
             if (errorCC == `"categoryId" must be a number` || errorCC == 'Campos de producto no encontrados' || errorCC == 'No se encontraron resultados'){
               setCamposCategoria([]);
               setSuccess(true);
               setErrMsg("");
             }
             else{
               setCamposCategoria([]);
               setSuccess(false);
               setErrMsg(errorCC || "Error de consulta.");
             }
           }
         }
    }, [camposProductosFetchData,errorCC]);
    
    if (loadingC || loadingCC) {
        return <Typography>Loading...</Typography>;
    }
    if (errorPr || errorC || (errorCC && idCategory != "" && !success)) {
        return  <Alert ref={errRef}  severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert> ;
    }
    return (
        <Container maxWidth="lg" className="justified-container">
             <Box className= "admin-tableHeader" >
                <Typography className="admin-title" variant='h5'>Detalles del articulo</Typography>
            </Box>
             {productoFetchData &&
            <Stack className="admin_gridContainer" spacing={2} direction = {{xs:"column", md:"column", lg:"row"}} >

                <Grid container>
                    <Grid item className="admin-gridLabel" xs={12} md = {4}>
                        <Typography>Id</Typography>
                    </Grid>
                    <Grid item className="admin-gridData" md= {8} >
                        <Typography>{productoFetchData.id}</Typography>
                    </Grid>
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Categoria</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{productoFetchData.categoryId}</Typography>
                    </Grid>
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Nombre</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{productoFetchData.Nombre}</Typography>
                    </Grid>
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography>SKU</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{productoFetchData.sku}</Typography>
                    </Grid>
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Marca</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{productoFetchData.marca}</Typography>
                    </Grid>
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Modelo</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{productoFetchData.Modelo}</Typography>
                    </Grid>
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Stock</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{productoFetchData.stock}</Typography>
                    </Grid>
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Costo Promedio</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography className="costoPromedio-text">{productoFetchData.costoPromedio}</Typography>
                    </Grid>
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Precio promo</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{productoFetchData.precioPromoTotal}</Typography>
                    </Grid>
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Precio</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{productoFetchData.precio}</Typography>
                    </Grid>
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Fecha Promocion</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{productoFetchData.fechaPromocion}</Typography>
                    </Grid>
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Costo instalador</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{productoFetchData.costoInstalador}</Typography>
                    </Grid>                    
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Tipo Moneda</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{productoFetchData.tipoMoneda}</Typography>
                    </Grid>
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Clave Sat</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{productoFetchData.claveSat}</Typography>
                    </Grid>
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Proveedor</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{productoFetchData.proveedorId}</Typography>
                    </Grid> 
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Peso</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{productoFetchData.peso}</Typography>
                    </Grid> 
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Largo</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{productoFetchData.largo}</Typography>
                    </Grid> 
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Alto</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{productoFetchData.alto}</Typography>
                    </Grid> 
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Ancho</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{productoFetchData.ancho}</Typography>
                    </Grid> 
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography>Empaque Secundario</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{productoFetchData.empaqueSecundario}</Typography>
                    </Grid> 
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Empaque Largo</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{productoFetchData.empaqueLargo}</Typography>
                    </Grid> 
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Empaque Alto</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{productoFetchData.empaqueAlto}</Typography>
                    </Grid> 
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Empaque Ancho</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{productoFetchData.empaqueAncho}</Typography>
                    </Grid> 
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Unidad Peso</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{productoFetchData.unidadPeso}</Typography>
                    </Grid> 
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Unidad Medida</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{productoFetchData.unidadMedida}</Typography>
                    </Grid> 
                </Grid>
                <Grid container>
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Pais de Origen</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{productoFetchData.paisDeOrigen}</Typography>
                    </Grid> 
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Cedis Asignado</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{productoFetchData.cedisAsignado}</Typography>
                    </Grid> 

                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Tags</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{productoFetchData.tags}</Typography>
                    </Grid> 

                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Descripcion</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{productoFetchData.descripcionProducto}</Typography>
                    </Grid> 

                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Descripcion SEO</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{productoFetchData.descripcionSEO}</Typography>
                    </Grid> 

                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Titulo SEO</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{productoFetchData.tituloSEO}</Typography>
                    </Grid> 

                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Codigo Barras</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{productoFetchData.codigoBarras}</Typography>
                    </Grid> 
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography >Clasificacion Proveedores ID</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{productoFetchData.clasificacionProveedoresID}</Typography>
                    </Grid> 

                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Favoritos</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{productoFetchData.Favoritos? 'si' : 'no'}</Typography>
                    </Grid> 
                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Mostrar Tienda</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{productoFetchData.mostrarTienda? 'si' : 'no'}</Typography>
                    </Grid> 

                    <Grid item className="admin-gridLabel" xs={12} md = {4} >
                        <Typography noWrap>Consignacion</Typography>
                    </Grid>
                    <Grid item className="admin-gridData"  md= {8} >
                        <Typography>{productoFetchData.consignacion? 'si' : 'no'}</Typography>
                    </Grid> 
                    <Box className="formDivider">
                        <Typography className="formDivider-text">Caracteristicas del producto</Typography>
                        <Box className="formDivider-line"></Box>
                    </Box>
                    <Grid item className="admin-gridData" xs={12}>
                        {
                            camposCategoria.map((category,index) =>{
                                return (
                                    <Grid key={index} container >
                                    <Grid item  key={category.label} className="admin-gridLabel" xs={12} md={4} >
                                            <Typography noWrap>{category.label}</Typography>
                                        </Grid>
                                        <Grid item  key={category.fieldId} className="admin-gridData"  md={8} >
                                            <Typography>{productoFetchData[category.campoId]}</Typography>
                                        </Grid> 
                                    </Grid>                                                                    
                                )
                            })
                        } 
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
export default ProductDetail;