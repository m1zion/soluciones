import { Box, Paper, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, {useContext } from 'react';
import './styles.css'
import AppContext from '@context/AppContext';
import CancelIcon from '@mui/icons-material/Cancel';
import noImage from '@images/imageNotFound.png';
const ProductDetail = () => {
    const context = useContext(AppContext);
    let fotoDefault = noImage;
    function createData(caracteristica, descripcion) {
      return { caracteristica, descripcion };
    }

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
      [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
      },
      [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
      },
    }));
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
      // hide last border
      '&:last-child td, &:last-child th': {
        border: 0,
      },
    }));

    const getProductMeasurements = (productInfo) => {
      //console.log(productInfo);
      const { alto, ancho, largo } = productInfo;
      return (alto !== null && ancho !== null && largo !== null)
          ? `${alto} x ${ancho} x ${largo} cm`
          : '-';
    };

    const rows = [
      createData('Marca', context.productToShow.Marca || context.productToShow.marca || ''),
      createData('Modelo',  context.productToShow.Modelo || context.productToShow.modelo || ''),
      createData('Garantia', '1 año'),
      createData('Descripcion', context.productToShow.descripcionSEO),
      createData('Medidas', getProductMeasurements(context.productToShow)),
    ];


    if (!context.isProductDetailOpen) return null;
    let fotos =  context.productToShow.fotos;
    if(typeof fotos !== "undefined"){
      if (fotos.length > 0 ){
        const defaultPhoto = fotos.find(photo => photo.fileName.includes("_1_lg.jpg"));
        fotoDefault = defaultPhoto ? defaultPhoto.url : fotos[0].url;
        //fotoDefault = product.fotos[0].url;
      }
    }

    return (
        <Box className="product-detail-overlay" onClick={context.closeProductDetail}>
        <Box component="aside" className="product-detail-container" onClick={(e) => e.stopPropagation()}>        
            <Box className = "product-detail-details">
                <Typography variant='h5'>Detalle</Typography>
                <Box>
                    <CancelIcon
                    onClick={context.closeProductDetail}
                    />
                </Box>
            </Box>
            <Box component="figure" sx={{ px: 6 }}>
                <Box
                    component="img"
                    src={fotoDefault} 
                    alt={context.productToShow.Modelo}
                    className="product-detail-img"
                />
            </Box>
            <Box className="product-detail-description">
                {/*Solo condideramos precioTotal y precioPromoTotal*/}
                <Box>
                  <Typography sx={{fontSize: '17px',textDecoration:'line-through',color:'grey'}}>{context.productToShow.precioPromoTotal != null ? '$'+context.productToShow.precioTotal : ''}</Typography>
                  <Typography variant="h5" fontWeight="medium" mb={2}>${context.productToShow.precioPromoTotal != null ? context.productToShow.precioPromoTotal: context.productToShow.precioTotal}</Typography>
                  
                </Box>
                <Box className="SKU_container">
                  <Typography>SKU:</Typography> 
                  <Typography variant="subtitle1" fontWeight="medium" sx={{color:'#2c3e50'}}>{context.productToShow.SKU}</Typography>
                </Box>               
                <Box>
                  <Typography>Descripcion:</Typography>
                  <Typography variant="body2" fontWeight="light" sx={{color:'#2c3e50'}}>{context.productToShow.descripcionProducto}</Typography>
                </Box>                
            </Box>    
            <Box>
            <TableContainer component={Paper} className="table-info">
              <Table sx={{ minWidth: 350 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell colSpan={2} ><Typography variant='subtitle1'>Caracteristicas</Typography></StyledTableCell >
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (                  
                    <StyledTableRow  key={row.caracteristica}
                    >
                      <StyledTableCell component="th" scope="row">{row.caracteristica}</StyledTableCell>
                      <StyledTableCell align="right">{row.descripcion}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            </Box>
        </Box>           
    </Box>
    );
}
export default ProductDetail