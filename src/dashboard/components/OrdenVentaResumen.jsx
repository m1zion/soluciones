
import { Typography, Paper, Grid } from "@mui/material";
import React from "react";
import formatNumber  from '@utils/formatNumber';
const OrdenVentaResumen = ({detalleVentaData}) => {
    const descuento = 0;
    const { totalAmount, totalCostoArticulos } = detalleVentaData.reduce(
        (acc, currentItem) => { // Sum up the values
          acc.totalAmount += currentItem.amount;
          acc.totalCostoArticulos += currentItem.amount * (currentItem.precioPromoTotal ? currentItem.precioPromoTotal : currentItem.precioTotal);
          return acc;
        },
        {
          totalAmount: 0,
          totalCostoArticulos: 0
        }
      ); 
    const sumaImportes = totalCostoArticulos / 1.16;
    const impuesto = totalCostoArticulos * .16 / 1.16;
    const total = totalCostoArticulos - descuento;
    return (
        <Paper className='ordenCompra-paper' elevation={1}  >
            <Grid container spacing={1} >
                <Grid item xs={8}>  
                    Total de articulos
                </Grid>
                <Grid item xs={4}>
                    {totalAmount}
                </Grid>               
                <Grid item xs={8}>
                    Suma de importes
                </Grid>
                <Grid item xs={4}>                    
                    $ {formatNumber(sumaImportes)}
                </Grid>
                <Grid item xs={8}>
                    Impuesto (16%)
                </Grid>
                <Grid item xs={4}>
                    $ {formatNumber(impuesto)}
                </Grid>
                <Grid item xs={8}>
                    Subtotal
                </Grid>
                <Grid item xs={4}>
                    $ {formatNumber(totalCostoArticulos)}
                </Grid>                
                <Grid item xs={8}>
                    Descuento
                </Grid>
                <Grid item xs={4}>
                    $ {formatNumber(descuento)}
                </Grid>               
                <Grid item xs={8}>
                    <Typography className='ordenCompra-paper-bold'>TOTAL</Typography>
                </Grid>
                <Grid item xs={4}>
                    $ {formatNumber(total)}
                </Grid>
            </Grid>
        </Paper>
    );
}
export default OrdenVentaResumen;