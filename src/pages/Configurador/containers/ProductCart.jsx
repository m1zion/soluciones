import React, { useContext } from 'react';
import './ProductCart.scss';
import { Stack, Typography, Grid, Box } from "@mui/material";
import '@styles/_vars.css';
import AppContext from '@context/AppContext';
import useDeleteOrderItemV from '@hooks/useDeleteOrderItemV';
import { DeleteForever } from '@mui/icons-material';
const API = process.env.REACT_APP_API_URL;
const APIDelete = API+'orders/delete-item/';
var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
const ProductCart = () => {
    const { state,removeFromCart,setTotalCompra } = useContext(AppContext);
    //console.log(state.cart);
    const sumTotal = () =>{ 
        if (!state.cart || !Array.isArray(state.cart)) {// Handle the case when state.cart is undefined or not an array
            return 0;
        }
        const reducer = (accumulator, currentValue) => accumulator + (parseInt(currentValue.precioPromoTotal? currentValue.precioPromoTotal : currentValue.precioTotal)*parseInt(currentValue.amount));
        //console.log(state.cart);
        const sum = state.cart.reduce(reducer,0);
        return sum;
    }
    const handleRemove  = (product) => {
        //Cambiar Orden ID
        if (confirm('Estas seguro que desea borrar este producto?')) {
            const data = 
            {
                orderId: state.cartOrderId, 
                productId: product.id_producto,
                categoryId: product.id_categoria
            };
            useDeleteOrderItemV(APIDelete,data,state.token); //Borro de la API
            const updatedTotalCompra = parseInt(state.totalCompra) - parseInt(product.amount * product.precioPromoTotal);
            removeFromCart(data,updatedTotalCompra); //Borro del STATE
            //setTotalCompra(updatedTotalCompra);
            //window.location.reload(); //Refrescamos la pagina, porque por el momento no logro refrescar el state, causa un conflicto con el useEffect    
        }
    }
    const products = state.cart;
    let result = [];
    //console.log(state.cart);
    if (products && products.length > 0) {
        result = [...products.reduce( (mp, o) => {
            if (!mp.has(o.SKU)) mp.set(o.SKU, { ...o, amount: 0 });
            //mp.get(o.sku).amount++;
            mp.get(o.SKU).amount =  parseInt(mp.get(o.SKU).amount) + parseInt(o.amount);
            return mp;
        }, new Map).values()];
    }
    //console.log(result);
    return (
        <Stack className="ProductCartConfContainer" direction='column'>
             <Box className='ProductCartTitleContainer'>
                <Typography className="ProductCartTitle"  sx={{pt:"10px"}} variant="h6">Resumen de la compra</Typography>
             </Box>
            {                   
                //Array.isArray(items)?  //Esto es para traerlo de la bd
                //items.map(orden => (  //Esto es para traerlo de la bd
                result.map(orden => (  //Esto es para traerlo del context el GRID contiene 12 celdas
                    <Grid className="ProductCardGrid" container spacing={2} key={orden.id_item}> 
                        <Grid className="ProductCardGridElement" item xs={1} >                   
                         <DeleteForever className = "trashCanConf" alt="close"  onClick={() => handleRemove(orden)}  />
                        </Grid>
                        <Grid className="ProductCardGridElement" item xs={7}>
                            <Box>{orden.Categoria} {orden.Nombre}</Box>
                            <Box sx={{color:'var(--gray-letter)'}}>{orden.descripcionProducto}</Box>
                        </Grid>
                        <Grid  className="ProductCardGridElement"  item xs={1}>
                            <Typography sx={{whiteSpace:'nowrap'}}>{orden.amount} x {orden.precioPromoTotal ? orden.precioPromoTotal : orden.precioTotal}</Typography>
                        
                        </Grid>
                        <Grid  className="ProductCardGridElement"  sx={{ textAlign:"end", paddingRight:"8px" }} item xs={3}>
                        {
                        orden.precioPromoTotal != null ? formatter.format(orden.precioPromoTotal*orden.amount): formatter.format(orden.precioTotal*orden.amount)
                        }                       
                        </Grid>
                    </Grid>         
                ))                
                //:''
            }
            <Stack className="ProductCartTotales">
                <Grid container sx={{padding: 1}}>
                    <Grid item xs={8} display="flex" justifyContent="flex-end">Subtotal</Grid>
                    <Grid item xs={4} display="flex" justifyContent="flex-end"> 
                        {
                        //formatter.format(order.precioTotal)
                        formatter.format(sumTotal())
                        }
                    </Grid>
                    <Grid item xs={8} display="flex" justifyContent="flex-end">Envio</Grid>
                    <Grid item xs={4} display="flex" justifyContent="flex-end">$ 0.00</Grid>
                    <Grid item sx={{ marginTop: "10px" }} xs={8} display="flex" justifyContent="flex-end">Total</Grid>
                    <Grid item sx={{ marginTop: "10px"}} xs={4} display="flex" justifyContent="flex-end" className="total_config">
                        {
                            //formatter.format(order.precioTotal+200)
                            formatter.format(sumTotal())
                        }
                    </Grid>
                </Grid>
            </Stack>
        </Stack>
    );
}
export default ProductCart;