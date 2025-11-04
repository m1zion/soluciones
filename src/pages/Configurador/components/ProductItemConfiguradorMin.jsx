// A partir de la clase 22 cambia useState por useContext
import React, {useState,useContext,useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '@context/AppContext';
import './ProductItemConfigurador.scss';
import '@styles/ProductItem.scss';
import { Box, Typography } from '@mui/material';
import usePostOrderItem from '@hooks/usePostOrderItem';
import NumProductos from './NumProductos';
import BotonAgregarDark from './BotonAgregarDark';
import noImage from '@images/imageNotFound.png';
const API = process.env.REACT_APP_API_URL;
const APIaddItem = API+'orders/add-item/';
const ProductItemConfigurador = ({product,llave,category,editarCantidad,cantidadFija,orderId}) => {
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
  const showProduct3 = (productDetail) => {
    openProductDetail();
    setProductToShow(productDetail);
  };  
  const showProduct = useCallback((productDetail) => {
    openProductDetail();
    setProductToShow(productDetail);
  }, [openProductDetail, setProductToShow]);

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
      case '2': handleAdaptador(item2,data,amountProducts); break;
      case '3': handleAdaptadorImpedancia(item2,data,amountProducts); break;
      case '7': handleArnes(item2,data,amountProducts); break;
      case '8': handleBase(item2,data,amountProducts); break;
      case '20': handleEstereo(item2,data,amountProducts); break;     
    }
  //setTimeout(() => window.scrollTo(0, scrollY), 0);
  requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: scrollY, behavior: 'instant' });
      });
    });

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
  } = useContext(AppContext);
  const handleEstereo = (item2,data,amountProducts) =>{ setEstereo(item2,data,amountProducts); };
  const handleBase = (item2,data,amountProducts) =>{ setBase(item2,data,amountProducts); };
  const handleArnes = (item2,data,amountProducts) =>{ setArnes(item2,data,amountProducts); };
  const handleAdaptador = (item2,data,amountProducts) =>{ setAdaptador(item2,data,amountProducts); };
  const handleAdaptadorImpedancia = (item2,data,amountProducts) =>{ setAdaptadorImpedancia(item2,data,amountProducts); }; 
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
