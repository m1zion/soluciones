// A partir de la clase 22 cambia useState por useContext
import React, {useState,useContext,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '@context/AppContext';
import './ProductItemConfigurador.scss';
import '@styles/ProductItem.scss';
import sale from '@images/sale_tag.png';
import { Box, Typography } from '@mui/material';
import usePostOrderItem from '@hooks/usePostOrderItem';
import NumProductos from './NumProductos';
import BotonAgregarDark from './BotonAgregarDark';
import noImage from '@images/imageNotFound.png';
const API = process.env.REACT_APP_API_URL;
const APIaddItem = API+'orders/add-item/';
const ProductItemConfigurador = ({product,llave,category,editarCantidad,cantidadFija,orderId}) => {
  //hacemos un nuevo Arreglo, por alguna extraña razon el state reemplaza el amout si utilizo el arreglo original
  //product2 lo utilizamos para llenar el cart y lo pasamos como parametro
  
  const { state,openProductDetail,setProductToShow } = useContext(AppContext);
  //console.log(product);
  let fotos =  product.fotos;
  let fotoDefault = noImage;
  if(typeof fotos !== "undefined"){
    if (fotos.length > 0 ){
      const defaultPhoto = fotos.find(photo => photo.fileName.includes("_1_lg.jpg"));
      fotoDefault = defaultPhoto ? defaultPhoto.url : fotos[0].url;
      //fotoDefault = product.fotos[0].url;
    }
  }



  const showProduct = (productDetail) => {
    openProductDetail();
    setProductToShow(productDetail);
  };  
  var product2 = {
    categoryId: product.categoryId,
    categoryIdConfigurador: category,
    id: product.id,
    id_producto: product.id,
    Nombre: product.Nombre,
    modelo: product.Modelo,
    Categoria: product.Categoria,
    descripcionProducto: product.descripcionProducto,
    precioTotal: product.precioTotal,
    precioPromoTotal: product.precioPromoTotal,
    tipoMoneda: product.tipoMoneda,
    SKU: product.sku,
    id_categoria: product.id_categoria,
    precio:product.precio,

    alto:product.alto,
    ancho:product.ancho,
    largo:product.largo,
    marca:product.marca,
  };
  //console.log("--Producto2");
  //console.log(product2);
  const navigate = useNavigate();
  const navigateToProductDetail = () => {
    navigate(`/productDetail/${product.id}`);
  };
  /*useState**********************/
  const [cart,setCart] = useState(['']); 
  const handleClickEffect = () => {
    setCart(['hey']);
  }
  /**********************useState*/
  const handleClick = (item,category,item2) => {
    const scrollY = window.scrollY;
    const formData = new FormData(form.current);
    let numberProducts;
    if (!editarCantidad) {
      numberProducts =  parseInt(cantidadFija);
    } else {
      numberProducts = parseInt(formData.get('contador'));
    }
    var amountProducts = numberProducts*item.precioPromoTotal;
    const  data = {
      orderId: orderId,
      productSKU: item.sku,
      categoryId: item.categoryId,
      categoryIdConfigurador: category,
      modelo: item.Modelo || item.modelo || '',  
      amount: numberProducts
    };
    item['categoryConf']= category; //Le agregamos la categoria propia del configurador
    item['amount'] = numberProducts; //   formData.get('contador');
    item['precio'] = numberProducts; //   formData.get('contador');
    item2['amount'] =  numberProducts; // formData.get('contador');
    
    usePostOrderItem(APIaddItem,data,state.token); //Se manda al backend y posteriormente al estado 
    switch (item2.categoryIdConfigurador){
      case '1': handleAccesorios(item2,data,amountProducts); break;
      case '2': handleAdaptador(item2,data,amountProducts); break;
      case '3': handleAdaptadorImpedancia(item2,data,amountProducts); break;
      case '4': handleAmplificador3en1(item2,data,amountProducts); break;
      case '5': handleAmplificador(item2,data,amountProducts); break;
      case '6': handleAmplificadorWoofer(item2,data,amountProducts); break;
      case '7': handleArnes(item2,data,amountProducts); break;
      case '8': handleBase(item2,data,amountProducts); break;
      case '9': handleBocinaPremiumDelantera(item2,data,amountProducts); break;
      case '10': handleBocinaPremiumTrasera(item2,data,amountProducts); break;
      case '11': handleBocinaReemplazoDelantera(item2,data,amountProducts); break;
      case '12': handleBocinaReemplazoTrasera(item2,data,amountProducts); break;
      case '13': handleCajonAcustico(item2,data,amountProducts,amountProducts); break;
      case '14': handleCalzaBocinaPremiumDelantera(item2,data,amountProducts); break;
      case '15': handleCalzaBocinaPremiumTrasera(item2,data,amountProducts); break;
      case '16': handleCalzaBocinaReemplazoDelantera(item2,data,amountProducts); break;
      case '17': handleCalzaBocinaReemplazoTrasera(item2,data,amountProducts); break;
      case '18': handleEcualizador(item2,data,amountProducts); break;
      case '19': handleEpicentro(item2,data,amountProducts); break;
      case '20': handleEstereo(item2,data,amountProducts); break;
      case '21': handleKitCables(item2,data,amountProducts); break;
      case '22': handleMedioRango(item2,data,amountProducts); break;
      case '23': handleProcesador(item2,data,amountProducts); break;
      case '24': handleComponentes(item2,data,amountProducts); break;
      case '25': handleTweeter(item2,data,amountProducts); break;
      case '26': handleWoofer(item2,data,amountProducts); break;
    }
    setTimeout(() => window.scrollTo({ top: scrollY, behavior: 'instant' }));
    //setTimeout(() => window.scrollTo(0, scrollY), 0);
  }
  /*Agregamos el Item al carrito*/
  const form = useRef(null);
  const {addToCartConf} = useContext(AppContext); //Llamamos el estado
  /*Agregamos los productos del configurador*/
  const {
    addToOrder,
    setEstereo,
    setBase,
    setArnes,
    setAdaptador,
    setBocinaReemplazoDelantera,
    setCalzaBocinaReemplazoDelantera,
    setCalzaBocinaReemplazoTrasera,
    setBocinaReemplazoTrasera,
    setAmplificador,
    setBocinaPremiumDelantera,
    setCalzaBocinaPremiumDelantera,
    setCalzaBocinaPremiumTrasera,
    setBocinaPremiumTrasera,
    setEcualizador,
    setAmplificadorWoofer,
    setAmplificador3en1,
    setWoofer,
    setCajonAcustico,
    setKitCables,
    setEpicentro,
    setProcesador,
    setTweeter,
    setTweeterP,
    setAccesorio,
    setAdaptadorImpedancia,
    setMedioRango,
    setComponentes,
    setSetMedios
  } = useContext(AppContext);
  
  const handleOrder = item =>{ addToOrder(item); };
  const handleEstereo = (item2,data,amountProducts) =>{ setEstereo(item2,data,amountProducts); };
  const handleBase = (item2,data,amountProducts) =>{ setBase(item2,data,amountProducts); };
  const handleArnes = (item2,data,amountProducts) =>{ setArnes(item2,data,amountProducts); };
  const handleAdaptador = (item2,data,amountProducts) =>{ setAdaptador(item2,data,amountProducts); };
  const handleBocinaReemplazoDelantera = (item2,data,amountProducts) =>{ setBocinaReemplazoDelantera(item2,data,amountProducts); };
  const handleCalzaBocinaReemplazoDelantera = (item2,data,amountProducts) =>{ setCalzaBocinaReemplazoDelantera(item2,data,amountProducts); };
  const handleBocinaReemplazoTrasera = (item2,data,amountProducts) =>{ setBocinaReemplazoTrasera(item2,data,amountProducts); };
  const handleCalzaBocinaReemplazoTrasera = (item2,data,amountProducts)=>{ setCalzaBocinaReemplazoTrasera(item2,data,amountProducts); };
  const handleAmplificador = (item2,data,amountProducts) =>{ setAmplificador(item2,data,amountProducts); };   //OPEN SHOW
  const handleBocinaPremiumDelantera = (item2,data,amountProducts) =>{ setBocinaPremiumDelantera(item2,data,amountProducts); };
  const handleCalzaBocinaPremiumDelantera = (item2,data,amountProducts) =>{ setCalzaBocinaPremiumDelantera(item2,data,amountProducts); };
  const handleBocinaPremiumTrasera = (item2,data,amountProducts) =>{ setBocinaPremiumTrasera(item2,data,amountProducts); };
  const handleCalzaBocinaPremiumTrasera = (item2,data,amountProducts)=>{ setCalzaBocinaPremiumTrasera(item2,data,amountProducts); };
  const handleAmplificadorWoofer = (item2,data,amountProducts) =>{ setAmplificadorWoofer(item2,data,amountProducts); };  //OPEN SHOW
  const handleAmplificador3en1 = (item2,data,amountProducts) =>{ setAmplificador3en1(item2,data,amountProducts); };
  const handleWoofer = (item2,data,amountProducts) =>{ setWoofer(item2,data,amountProducts); };  //OPEN SHOW
  const handleCajonAcustico = (item2,data,amountProducts) => {setCajonAcustico(item2,data,amountProducts); };  //OPEN SHOW
  const handleKitCables = (item2,data,amountProducts) => {setKitCables(item2,data,amountProducts); };  //OPEN SHOW
  const handleEcualizador = (item2,data,amountProducts) =>{ setEcualizador(item2,data,amountProducts); };
  const handleEpicentro = (item2,data,amountProducts) =>{ setEpicentro(item2,data,amountProducts); };
  const handleProcesador = (item2,data,amountProducts) =>{ setProcesador(item2,data,amountProducts); };
  const handleTweeter = (item2,data,amountProducts) =>{ setTweeter(item2,data,amountProducts); };  //OPEN SHOW
  const handleTweeterPrueba = (item2,data,amountProducts) =>{ setTweeterP(item2,data,amountProducts); };
  const handleAccesorios = (item2,data,amountProducts) =>{ setAccesorio(item2,data,amountProducts); };  //OPEN SHOW
  const handleAdaptadorImpedancia = (item2,data,amountProducts) =>{ setAdaptadorImpedancia(item2,data,amountProducts); }; 
  const handleMedioRango = (item2,data,amountProducts) =>{ setMedioRango(item2,data,amountProducts); };  //OPEN SHOW
  const handleComponentes = (item2,data,amountProducts) =>{ setComponentes(item2,data,amountProducts); };   //OPEN SHOW
  //<form action="#" ref={form}>
  return (
    
    <form ref={form} onSubmit={(e) => e.preventDefault()}>
      <Box className="ProductItemConfig">
        <Box>
          <Box>
            <img  className="ProductItemImageConfig"  src={fotoDefault} alt={product.title}/>
            {
            (product.precioPromoTotal != null && product.precioTotal > 0 ) ? 
              (<Typography className='ProductItem-sale-text-green'>{((product.precioTotal - product.precioPromoTotal) * 100 / product.precioTotal).toFixed(0)}% Off</Typography>)
            : 
              ('')
          }
          </Box> 
          <Box className='ProductItemConfig-NumProductos'>
            {editarCantidad ? <NumProductos/>: <Box className='boton_bloqueado'><Typography>Cantidad: {cantidadFija}</Typography></Box> }
          </Box>
        </Box>
        <Box className="product-info-Config-container">
          <Box 
          className="product-info-Config"
          onClick={() => showProduct(product)}>
            <Box>
              <Typography className="descripcion-Producto"  product={product}>{product.Nombre} - {product.Modelo}</Typography>
              <Typography>${product.precioTotal != null ? product.precioTotal : ''}</Typography>
              <Typography>${product.precioPromoTotal != null ? product.precioPromoTotal: product.precioTotal}</Typography>
            </Box>

            {cart}
          </Box>
          <Box className='product-config-button'>
              <figure 
              className='product-config-button-figure' 
               onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    handleClick(product, category, product2);
  }}
              //onClick={() => handleClick(product,category,product2)}
              >
                <BotonAgregarDark />
              </figure>
          </Box>
        </Box>      
      </Box>
    </form>
  );
  }
export default ProductItemConfigurador;
