import React, { useContext } from 'react';
import './ProductCart.scss';
import { Stack, Typography, Grid, Box, Button } from "@mui/material";
import '@styles/_vars.css';
import AppContext from '@context/AppContext';
import { useNavigate } from 'react-router-dom';
const API = process.env.REACT_APP_API_URL;
var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
const ProductCartConf = (props) => {
    const {addToOrder} = useContext(AppContext);
    const { state } = useContext(AppContext);
    const products = state.cartConf;
    const navigate = useNavigate();
    const handleSubmit = (orderType2) => {
        if (orderType2 == 'openshow'){
            navigate("/openShow");
        }else if(orderType2 == 'configurador'){
            navigate("/Configurador4");
        }
        else{
            navigate("/Configurador1");
        }
    }
    const result = [...products.reduce( (mp, o) => {
        if (!mp.has(o.SKU)) mp.set(o.SKU, { ...o, amount: 0 });
        //mp.get(o.sku).amount++;
        mp.get(o.SKU).amount =  parseInt(mp.get(o.SKU).amount) + parseInt(o.amount);
        return mp;
    }, new Map).values()];
    const sumTotal = () =>{ 
        const reducer = (accumulator, currentValue) => accumulator + (parseInt(currentValue.precioPromoTotal ? currentValue.precioPromoTotal : currentValue.precioTotal)*parseInt(currentValue.amount));
        const sum = state.cartConf.reduce(reducer,0);
        return sum;
    }
    /****SACAMOS EL RESULTADO DELA ORDEN DE COMPRA****/
    //console.log('termina'+state.terminaConfiguracion1);
    //console.log(state.accesorioC.id_item);
    //console.log(state.tieneEcualizado);
    //console.log(state.orderType);
    return (
        (
            ((state.terminaConfiguracion1 == "si" ||
            state.accesorioC.id_item != undefined ||
            state.tieneEcualizador == "no") || state.orderType == 'openshow') || !props.editVisible
        )?
        <Stack className="ProductCartConfContainer" direction='column'>
            <Box className='ProductCartTitleContainer'>
                <Typography className="ProductCartTitle" sx={{pt:"10px"}} variant="h6"> Resumen de {state.orderType == 'openshow' ? 'Open Show': 'Configurador'} ({state.confOrderId})</Typography>
                {
                    props.editVisible &&
                    <Button   onClick={() =>handleSubmit(state.orderType)}  className='primary-basic'>Editar Configurador</Button>       
                }
            </Box>
            {
                //Array.isArray(items)?  //Esto es para traerlo de la bd
                //items.map(orden => (  //Esto es para traerlo de la bd
                result.map(orden => (  //Esto es para traerlo del context el key lo cambiamos por key={orden.sku} key={orden.id_item}>
                    <Grid className="ProductCardGrid" container spacing={2} key={orden.SKU}>
                        <Grid className="ProductCardGridElement" item xs={7}>
                            <Box>{orden.Categoria} {orden.Nombre}</Box>
                            <Box sx={{color:'var(--gray-letter)'}}>{orden.descripcionProducto}</Box>
                        </Grid>
                        <Grid  className="ProductCardGridElement"  item xs={2}>
                            <Box>{orden.amount} </Box>
                            <Box sx={{color:'grey'}}>${ orden.precioPromoTotal != null ? orden.precioPromoTotal: orden.precioTotal}</Box>                        
                        </Grid>
                        <Grid  className="ProductCardGridElement"  sx={{ textAlign:"end", paddingRight:"8px" }} item xs={3}>
                        {
                        orden.precioPromoTotal != null ? formatter.format(orden.precioPromoTotal*orden.amount): formatter.format(orden.precioTotal*orden.amount)
                        //orden.precioPromoTotal != null ? ("$" + (orden.precioPromoTotal*orden.amount)): orden.precioTotal*orden.amount
                        
                        }                       
                        </Grid>
                    </Grid>         
                ))                
            }
            <Stack className="ProductCartTotales">
                <Grid container sx={{padding: 1}}>
                    <Grid item xs={8} display="flex" justifyContent="flex-end">Subtotal</Grid>
                    <Grid item xs={4} display="flex" justifyContent="flex-end"> 
                        {
                        //formatter.format(order.precioTotal)  //De la orden
                        formatter.format(sumTotal())  //Del cart   
                        }
                    </Grid>
                    <Grid item xs={8} display="flex" justifyContent="flex-end">Envio</Grid>
                    <Grid item xs={4} display="flex" justifyContent="flex-end">$ 0.00</Grid>
                    <Grid item sx={{ marginTop: "10px" }} xs={8} display="flex" justifyContent="flex-end">Total</Grid>
                    <Grid item sx={{ marginTop: "10px"}} xs={4} display="flex" justifyContent="flex-end" className="total_config">
                        {
                            //formatter.format(order.precioTotal)
                            formatter.format(sumTotal())
                        }
                    </Grid>
                </Grid>
            </Stack>
        </Stack>
        :
        <Stack className="ProductCartConfContainer" direction='column'>
            <Box className='ProductCartTitleContainer'>
                <Typography className="ProductCartTitle" sx={{pt:"10px"}} variant="h6">Tienes una configuracion pendiente</Typography>               
                {
                    props.editVisible &&
                    <Button   onClick={() =>handleSubmit(state.orderType)}  className='primary-basic'>Editar Configurador</Button>       
                }
            </Box>      
            {
                //Array.isArray(items)?  //Esto es para traerlo de la bd
                //items.map(orden => (  //Esto es para traerlo de la bd
                result.map(orden => (  //Esto es para traerlo del context el key lo cambiamos por key={orden.sku} key={orden.id_item}>
                    <Grid className="ProductCardGrid" container spacing={2} key={orden.SKU}>
                        <Grid className="ProductCardGridElement" item xs={8}>
                            <Box>{orden.Categoria} {orden.Nombre}</Box>
                            <Box sx={{color:'var(--gray-letter)'}}>{orden.descripcionProducto}</Box>
                        </Grid>
                        <Grid  className="ProductCardGridElement"  item xs={1}>
                            <Typography sx={{whiteSpace:'nowrap'}}>{orden.amount} x {orden.precioPromoTotal ? orden.precioPromoTotal : orden.precioTotal}</Typography>
                        </Grid>
                        <Grid  className="ProductCardGridElement"  sx={{ textAlign:"end", paddingRight:"8px" }} item xs={3}>
                        {
                        orden.precioPromoTotal != null ? formatter.format(orden.precioPromoTotal*orden.amount): formatter.format(orden.precioTotal*orden.amount)
                        //orden.precioPromoTotal != null ? ("$" + (orden.precioPromoTotal*orden.amount)): orden.precioTotal*orden.amount
                        
                        }                       
                        </Grid>
                    </Grid>         
                ))                
            }
            <Stack className="ProductCartTotales">
                <Grid container sx={{padding: 1}}>
                    <Grid item xs={8} display="flex" justifyContent="flex-end">Subtotal</Grid>
                    <Grid item xs={4} display="flex" justifyContent="flex-end"> 
                        {
                        //formatter.format(order.precioTotal)  //De la orden
                        formatter.format(sumTotal())  //Del cart     
                        }
                    </Grid>
                    <Grid item xs={8} display="flex" justifyContent="flex-end">Envio</Grid>
                    <Grid item xs={4} display="flex" justifyContent="flex-end">$ 0.00</Grid>
                    <Grid item sx={{ marginTop: "10px" }} xs={8} display="flex" justifyContent="flex-end">Total</Grid>
                    <Grid item sx={{ marginTop: "10px"}} xs={4} display="flex" justifyContent="flex-end" className="total_config">
                        {
                            //formatter.format(order.precioTotal)
                            formatter.format(sumTotal())
                        }
                    </Grid>
                </Grid>
            </Stack>
        </Stack>
    );
}
export default ProductCartConf;