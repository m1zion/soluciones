import { Alert, Box, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import PrintIcon from '@mui/icons-material/Print';
import useGet8V from '@hooks/useGet8V';
import DeleteIcon from '@mui/icons-material/Delete';
import formatNumber  from '@utils/formatNumber';
import PopupVentaCreateItem from '@componentsDashboard/PopupVentaCreateItem';
import OrdenVentaResumen from '@componentsDashboard/OrdenVentaResumen';
import useDeleteOrderItemV from '@hooks/useDeleteOrderItemV';
import PopupVentaNewPayment from '@componentsDashboard/PopupVentaNewPayment';
import AppContext from '@context/AppContext';
const API = process.env.REACT_APP_API_URL;
const TableVentasMov = ({ordenVentaId,ordenVenta,edit,editMovimiento,setTotalOrden,categoryData,clienteId,saldoPendiente}) => {
    //console.log("TABLA VENTAS");
    const { state } = useContext(AppContext);
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const [detalleVentaData, setDetalleVentaData] = useState([]);
    const [loadingAD, setLoadingAD] = useState(true);
    const [buttonPopup, setButtonPopup] = useState(false);
    const [clienteMovimientoData,setClienteMovimientoData] = useState([]);
    const [itemChanged, setItemChanged] = useState(false);
    const [itemChangedMov, setItemChangedMov] = useState(false);
    const [ocultaBoton,setOcultaBoton] = useState(false);
    const [popupPayment, setPopupPayment] = useState(false);
    //=========================================Consultamos los movimientos de el detalle de venta ==============
    const { data: detalleventaFetchData, loading: loadingV, error: errorV } = useGet8V(API+"orders/"+ordenVentaId,itemChanged,state.token);
    useEffect(() => {
        const fetchAdditionalData = async () => {
            //console.log("Entra a fetchAdditionalData ");
            //console.log(API+"orders/"+ordenVentaId);
            //console.log(detalleventaFetchData);
            if(detalleventaFetchData.items && categoryData != undefined){
                setSuccess(true);
                setErrMsg("");
                //Para cada Item le agregamos el costo promedio itemsWithAdditionalData
                try {
                    //console.log("try");
                    const itemsWithAdditionalData = await Promise.all(detalleventaFetchData.items.map(async (item) => {            
                        const category = categoryData.find(cat => cat.id === item.id_categoria);
                        if (!category) {
                          console.log(`No URL found for id_categoria ${item.id_categoria}`);
                        }                                 
                        const response = await fetch(`${API}${category.url}getmodel?model=${item.SKU}&administrador=true`);
                        const data = await response.json();
                        return {
                            ...item,
                            costoPromedio: data.costoPromedio // Assuming the API response structure
                        };
                        }   
                    ));     
                    
                    
                    //console.log(itemsWithAdditionalData);
                    
                    setDetalleVentaData(itemsWithAdditionalData);
                    setLoadingAD(false);
                } catch (error) {
                    setSuccess(false);
                    setLoadingAD(false);
                    setErrMsg("Error fetching additional data (00001).");
                }
                // Calculate the total order
                const totalOrden = detalleventaFetchData.items.reduce((total, item) => {
                    return total + (item.precioPromoTotal ? item.precioPromoTotal * item.amount: item.precioPromoTotal * item.amount);
                }, 0);
                const totalOrdenIva = formatter.format(totalOrden).replace(/[^\d.-]/g, '');
                setTotalOrden(totalOrdenIva);
            } else {
                if(errorV){         
                    if (errorV === "No se encontraron resultados"){
                        setDetalleVentaData([]);
                        setSuccess(true);
                    }
                    else{
                        setSuccess(false);
                        setErrMsg(errorV || "Error de consulta.");
                    }
                }
            }
        }
        fetchAdditionalData();
    }, [detalleventaFetchData,errorV,itemChanged,categoryData]);
    //================================================================================================                                                                                          
    const { data: clienteMovimientoFetchData, loading: loadingM, error: errorM } = useGet8V(API+"/cliente/clienteMovimiento/?offset=0&limit=5&referenciaId="+ordenVenta+"&clienteId="+clienteId,itemChangedMov,state.token);  
    useEffect(() => {
        if(clienteMovimientoFetchData && clienteMovimientoFetchData.movimientos != undefined){
          setClienteMovimientoData(clienteMovimientoFetchData.movimientos);
        } else {
            if(errorM){         
                if (errorM === "No se encontraron resultados"){
                    setClienteMovimientoData([]);
                }
                else{
                    //setSuccess(false);
                    //setErrMsg(errorC || "Error de consulta.");
                }
            }
        }
    }, [clienteMovimientoFetchData,errorM,itemChangedMov]);
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'MXN',
    });
    const handleExportPDF = () => {
        const url = `/Dashboard/Ventas/ventaNota/${ordenVentaId}`;
        window.open(url, '_blank');
    };
    const handleNewItem = () =>{
        setButtonPopup(true);
    } 
    const handleNewPayment = () =>{
        setPopupPayment(true);
    } 
    const handleDelete = async (id,SKU,id_categoria) =>{
        if(window.confirm("¿Deseas eliminar el registro?")){
            const data = 
            {
                orderId: ordenVentaId, 
                productSKU: SKU,
                categoryId: id_categoria
            };
            const APIDelete = API.concat('orders/delete-item/');
            const { success, error } = await useDeleteOrderItemV(APIDelete,data,state.token);
            if (success) {
                setSuccess(true);          
                alert('Registro Eliminado.')
                setItemChanged(prevItemChanged=> !prevItemChanged); // Toggle the value
            } else if (error) {
                setSuccess(false);
                setErrMsg("Error al borrar el articulo");
            }
        }
    };
    if (loadingV || loadingAD) {
        return <Typography>Loading...</Typography>;
    }
    if (errorV && !success) {
        return (
            <Box>     
                <TableContainer sx={{overflow:'auto', marginTop:'15px'}}> 
                    <Box className= "admin-tableHeader" >
                        <Alert sx={{marginTop:"15px"}} severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert>
                    </Box>
                </TableContainer>
            </Box>
        );
    }
	return (
        <Box>     
            <TableContainer sx={{overflow:'auto', marginTop:'15px'}}> {/*Esto es para que no se desborde en dispositivos pequeños onClick={handleExportCSV}*/}
            <Box className= "admin-tableHeader" >
                <IconButton size="small" variant="outlined" color="primary" onClick={handleExportPDF}>
                      <PrintIcon/>
                </IconButton>
                {edit ? (
                <Box>
                    <Button className= "admin-newButton" variant="contained" onClick={handleNewItem}>+ Agregar articulo</Button>
                </Box>
                ) : null}
            </Box>
            <Alert severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert>  
            <Table size="small"  sx={{minWidth:'unset'}}  className='admin-crudTable'>
                <TableHead >
                    <TableRow>
                        <TableCell className='admin-tableHead' align="right">SKU</TableCell>
                        <TableCell className='admin-tableHead admin-actionsCell' align="right">MARCA</TableCell>
                        <TableCell className='admin-tableHead admin-actionsCell' align="right">NOMBRE</TableCell>
                        <TableCell className='admin-tableHead' align="right">CANT.</TableCell>
                        <TableCell className='admin-tableHead' align="right">PRECIO</TableCell>
                        <TableCell className='admin-tableHead' align="right">C. PROMEDIO</TableCell>
                        <TableCell className='admin-tableHead' align="right">TOTAL</TableCell>
                        <TableCell className='admin-tableHead'  align="right">ACCIONES</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                   {detalleVentaData.map((row) => (
                    <TableRow
                        key={row.id_item}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell align="right">{row.SKU}</TableCell>
                        <TableCell align="right" className="admin-actionsCell">{row.marca}</TableCell>
                        <TableCell align="right" className="admin-actionsCell">{row.Nombre}</TableCell>
                        <TableCell align="right">{row.amount}</TableCell>
                        <TableCell align="right" sx={{ whiteSpace: 'nowrap', color: row.precioPromoTotal ? 'red' : 'blue'}} >${formatNumber(parseFloat(row.precioPromoTotal ? row.precioPromoTotal : row.precioTotal))}</TableCell>
                        <TableCell align="right" sx={{ whiteSpace: 'nowrap'}} >{row.costoPromedio ? '$'+formatNumber(parseFloat(row.costoPromedio)): '-'}</TableCell>
                        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>$ {formatNumber(parseFloat(row.precioPromoTotal ? row.precioPromoTotal*row.amount : row.precioTotal*row.amount ))}</TableCell>
                        <TableCell align="right">
                            {edit ? (<Box className="admin-actionButtons">
                                <IconButton className= "admin-deleteButton" onClick={() =>handleDelete(row.id,row.SKU,row.id_categoria)} size="small" variant="outlined" color="error"><DeleteIcon/></IconButton>
                            </Box>
                            ) : null}
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer> 
        {/*Este movimiento solo se hara en la edicion ya que necesita estar finalizada la orden */}
        <Box className="ordenCompra-footer">     
            <OrdenVentaResumen detalleVentaData={detalleVentaData}></OrdenVentaResumen>
        </Box>
        <PopupVentaCreateItem 
            trigger={buttonPopup} 
            setTrigger={setButtonPopup}
            setItemChanged={setItemChanged}
            ordenVentaId={ordenVentaId}
        >
        </PopupVentaCreateItem>
        </Box>
	);
}
export default TableVentasMov;