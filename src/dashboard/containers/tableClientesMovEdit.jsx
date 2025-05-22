import { Alert, Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React, { useState, useEffect, useRef, useContext } from "react";
import PrintIcon from '@mui/icons-material/Print';
import DescriptionIcon from '@mui/icons-material/Description';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import PopupClienteMovDetails from '@componentsDashboard/PopupClienteMovDetails';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import formatNumber  from '@utils/formatNumber';
import SearchIcon from '@mui/icons-material/Search';
import AppContext from '@context/AppContext';
const API = process.env.REACT_APP_API_URL;
const TableClientesMovEdit = ({clienteId}) => {
    const { state } = useContext(AppContext);
    const navigate = useNavigate();
    const [detailsPopup, setDetailsPopup] = useState(false);
    const [detailsId, setDetailsId] = useState('');
    const [tipoMovimiento, setTipoMovimiento] = useState('');
    const [clienteMovimientoData, setClienteMovimientoData] = useState([]);
    const [clienteVentaData, setClienteVentaData] = useState([]);
    const [fullArray, setFullArray] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);  //Pagination
    const [itemsPerPage] = useState(3); //Pagination
    const [success, setSuccess] = useState(true);
    const errRef = useRef();
    const [errMsg, setErrMsg] = useState(''); 
    const [periodo, setPeriodo] = useState('');
    const [periodo2, setPeriodo2] = useState('');
    const [fechaInicial, setFechaInicial] = useState('');
    const [fechaFinal, setFechaFinal] = useState('');
    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };   
    useEffect(() => {
        if (clienteId) {
            fetchData();
        }
    }, [clienteId, periodo2]);
    const fetchData = async () => {
        try {
            const movimientosData = await fetchMovimientos();
            const ventasData = await fetchOrdenesVenta();             
            //Aqui agregamos VA por que como ventas y movimientos son numericos se puede dar el caso de que se repita
            const updatedVentasData = ventasData.map(item => ({
                ...item,
                id: 'VA' + item.id
              }));
            const devolucionesData = await fetchDevoluciones();
            setClienteMovimientoData(movimientosData);
            setClienteVentaData(ventasData);
            const fullArrayAux = combineArrays(movimientosData, updatedVentasData, devolucionesData);
            setFullArray(fullArrayAux);
            setErrMsg("");
            setSuccess(true);
        } catch (error) {
            console.log("Errorr");
            setErrMsg(error.message || "Error occurred during the request");
            setSuccess(false);
        }
    };

    const fetchMovimientos = async () => {
        const response = await fetch(`${API}cliente/clienteMovimiento/?offset=0&limit=30&clienteId=${clienteId}${periodo2 !== '' ? `&fecha_inicial=${fechaInicial}&fecha_final=${fechaFinal}` : ''}`, {
            headers: {
              'Authorization': `Bearer ${state.token}`,  // Add the Bearer token here
              'Content-Type': 'application/json',
            },
          });
        const data = await response.json();
        if (response.ok && data.movimientos) {
            return data.movimientos;
        } else {
            return [];
            throw new Error(data.message || 'Error fetching movimientos');
        }
    };
    const fetchOrdenesVenta = async () => {
        const response = await fetch(`${API}orders/V2/get?&offset=0&limit=30&clienteId=${clienteId}${periodo2 !== '' ? `&fecha_inicial=${fechaInicial}&fecha_final=${fechaFinal}` : ''}`, {
            headers: {
              'Authorization': `Bearer ${state.token}`,  // Add the Bearer token here
              'Content-Type': 'application/json',
            },
          });
        const data = await response.json();
        if (response.ok && data.orders) {
            return data.orders;
        } else {
            return [];
            throw new Error(data.message || 'Error fetching ordenesCompra');
        }
    };
    const fetchDevoluciones = async () => {
        const response = await fetch(`${API}ventas/devolucionesVenta/?offset=0&limit=30&clienteId=${clienteId}${periodo2 !== '' ? `&fecha_inicial=${fechaInicial}&fecha_final=${fechaFinal}` : ''}`, {
            headers: {
              'Authorization': `Bearer ${state.token}`,  // Add the Bearer token here
              'Content-Type': 'application/json',
            },
          });
        const data = await response.json();
        if (response.ok && data.devoluciones) {
            return data.devoluciones;
        } else {
            return [];
            throw new Error(data.message || 'Error fetching devoluciones');
        }
    };
    const fetchMovimientosFull = async () => {
        const response = await fetch(`${API}cliente/clienteMovimiento/?clienteId=${clienteId}`, {
            headers: {
              'Authorization': `Bearer ${state.token}`,  // Add the Bearer token here
              'Content-Type': 'application/json',
            },
          });
        const data = await response.json();
        if (response.ok && data.movimientos) {
            return data.movimientos;
        } else {
            return [];
        }
    };
    const fetchOrdenesVentaFull = async () => {
        const response = await fetch(`${API}orders/V2/get?&clienteId=${clienteId}`, {
            headers: {
              'Authorization': `Bearer ${state.token}`,  // Add the Bearer token here
              'Content-Type': 'application/json',
            },
          });
        const data = await response.json();
        if (response.ok && data.orders) {
            return data.orders;
        } else {
            return [];
        }
    };
    const fetchDevolucionesFull = async () => {
        const response = await fetch(`${API}ventas/devolucionesVenta/?clienteId=${clienteId}`, {
            headers: {
              'Authorization': `Bearer ${state.token}`,  // Add the Bearer token here
              'Content-Type': 'application/json',
            },
          });
        const data = await response.json();
        if (response.ok && data.devoluciones) {
            return data.devoluciones;
        } else {
            return [];
        }
    };

     //========================================CONBINAR ARRAYS=============================================================
    const combineArrays = (movimientosArray, ordenesVentaArray, devolucionesArray) => {
        const combinedArray = [...movimientosArray, ...ordenesVentaArray, ...devolucionesArray];
        const result = [];
        let totalItemsArray = 0;
        combinedArray.forEach(item => {
            const idMovimiento = item.id || item.ordenDevolucionVenta; //item.ordenVenta || item.ordenDevolucion || item.id;
            const exists = result.some(existingItem => existingItem.idMovimiento === idMovimiento);
            if (!exists) {
                let tipoValue = "Desconocido";
                let tipoMov = "";
                if (item.orderType) {
                    tipoValue = "Ingreso"; //Ingreso Egreso cambie por ingreso pagina 37 observaciones
                    tipoMov = "venta";
                } 
                else if (item.ordenDevolucionVenta) {
                    tipoValue = "Egreso";
                    tipoMov = "devolucion";
                } 
                else if (item.tipo) {
                    tipoValue = item.tipo;
                    tipoMov = "movimiento";
                }
                result.push({
                    id: totalItemsArray,
                    idMovimiento,
                    createdAt: item.createdAt,
                    fecha: item.fecha ? item.fecha : item.createdAt, //Para la orden es createdAt y para el movimiento fecha
                    concepto: item.concepto ? item.concepto : `Orden de venta/devolucion`,
                    referencia: item.referencia,
                    tipo: tipoValue,
                    monto: item.monto ? item.monto : item.total,
                    saldo: item.saldo ? item.saldo : null,
                    tipoMov
                });
                totalItemsArray++;
            }
        });
        return(result);
        //setTotalItems(totalItemsArray);
    };
    //====================================================================================================================
    const handleEdit = (id) =>{
        navigate('../Dashboard/Clientes/movimientoedit/'+clienteId+"/"+id);
    };
    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1);
    };

    const getLastDayOfMonth = (year, month) => {
        return new Date(year, month + 1, 0);
    };
    const handleSearch = () => {
        if (periodo != ""){
          setPeriodo2(periodo);
          const currentDate = new Date();
          let firstDay, lastDay;    
          switch (parseInt(periodo)) {
            case 0:
              firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
              lastDay = getLastDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
              break;
            case 1:
              firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth() - 1);
              lastDay = getLastDayOfMonth(currentDate.getFullYear(), currentDate.getMonth() - 1);
              break;
            case 2:
              firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth() - 2);
              lastDay = getLastDayOfMonth(currentDate.getFullYear(), currentDate.getMonth() - 2);
              break;
            default:
              firstDay = null;
              lastDay = null;
          }
          if (firstDay && lastDay) {
            setFechaInicial(firstDay.toISOString().split('T')[0]);
            setFechaFinal(lastDay.toISOString().split('T')[0]);
          }
          setCurrentPage(1);
        }
        else {
          setPeriodo2("");
          setCurrentPage(1);
        }
    }

    const handleExportCSV = async () => {
        // Create a CSV string from your data
        try {
            const movimientosData = await fetchMovimientosFull();
            const ventasData = await fetchOrdenesVentaFull();          
            const devolucionesData = await fetchDevolucionesFull();
            const fullArrayAuxCSV = combineArrays(movimientosData, ventasData, devolucionesData);
            const csvData = "No,ID,FECHA CREACION,FECHA,CONCEPTO,REFERENCIA,I/A,MONTO,SALDO,TIPO MOV\n" +
            fullArrayAuxCSV.map(row => Object.values(row).join(",")).join("\n");
            // Create a Blob object and initiate a download
            const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'cliente_mov_data.csv';
            link.click();
        } catch (error) {
            console.error("Error exporting CSV:", error);
        }
    };
    const handleDetails = (id,tipo) =>{
        let cleanedId = id;
        if (typeof id === 'string' && id.startsWith('VA')) {
            cleanedId = id.replace('VA', '');
        }
        setDetailsId(cleanedId);
        setTipoMovimiento(tipo);
        setDetailsPopup(true); 
    } 

    if (!success) {
    return  (
        <Box>
            <Typography>ERROR</Typography>
            <Alert ref={errRef}  severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert> 
        </Box>
        
        );
    }
    if (clienteVentaData == undefined) {
    return <Typography><CircularProgress /></Typography>; // or handle loading state appropriately
    }
    fullArray.sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
    });
	return (

        <>
         <Box className= "admin-tableHeader" >
            <Box className= "find-properties-box">
                <FormControl className="InputSearch"  size="small">
                <InputLabel id="ddl-periodo-label">Periodo</InputLabel>
                <Select
                    id="periodo"
                    name="periodo"
                    label="Periodo"
                    value={periodo}
                    onChange={e=>setPeriodo(e.target.value)}
                >
                    <MenuItem key="0" value="0">Actual</MenuItem>
                    <MenuItem key="1" value="1">1 mes atras</MenuItem>
                    <MenuItem key="2" value="2">2 mes atras</MenuItem>
                </Select>
                </FormControl>
            </Box>
            <Button
                className= "primary-button-admin-outlined-tiny" 
                variant="outlined" 
                startIcon={<SearchIcon/>}
                onClick={handleSearch}
            >
                Buscar
            </Button>
        </Box>


        <TableContainer sx={{overflow:'auto'}}> {/*Esto es para que no se desborde en dispositivos pequeños onClick={handleExportCSV}*/}
            <IconButton size="small" variant="outlined" color="primary" onClick={handleExportCSV}>
                <PrintIcon/>
            </IconButton>
            <Table size="small"  sx={{minWidth:'unset'}}  className='admin-crudTable'>
                <TableHead >
                    <TableRow>
                        <TableCell className='admin-tableHead' align="right">#</TableCell>
                        <TableCell className='admin-tableHead' align="right">FECHA</TableCell>
                        <TableCell className='admin-tableHead' align="right">CONCEPTO</TableCell>
                        <TableCell className='admin-tableHead' align="right">REFERENCIA</TableCell>
                        <TableCell className='admin-tableHead' align="right">I/A</TableCell>
                        <TableCell className='admin-tableHead admin-actionsCell' align="right">MONTO</TableCell>
                        <TableCell className='admin-tableHead admin-actionsCell' align="right">SALDO</TableCell>
                        <TableCell className='admin-tableHead'  align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {fullArray.map((row) => (
                    <TableRow
                        key={row.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell align="right">{row.id}</TableCell>
                        <TableCell align="right">{formatDate(row.fecha)}</TableCell>
                        <TableCell align="right">{row.concepto}</TableCell>
                        <TableCell align="right">{row.referencia}</TableCell>
                        <TableCell align="right">{row.tipo == "Ingreso" ? <TrendingUpIcon sx={{color:"green"}}/> : <TrendingDownIcon sx={{color:"red"}}/>}</TableCell>
                        <TableCell  className="admin-actionsCell" sx={{whiteSpace: 'nowrap'}} align="right">$ {formatNumber(parseFloat(row.monto))}</TableCell>
                        <TableCell  className="admin-actionsCell" sx={{whiteSpace: 'nowrap'}} align="right">$ {row.saldo ? (formatNumber(parseFloat(row.saldo))): '0'}</TableCell>
                        <TableCell align="right">
                            <Box className="admin-actionButtons">
                                {/*<IconButton className= "admin-deleteButton" onClick={() => handleEdit(row.id)} size="small" variant="outlined" color="primary"><EditIcon/></IconButton>*/}
                                <IconButton className= "admin-deleteButton" onClick={() => handleDetails(row.idMovimiento,row.tipoMov)} size="small" variant="outlined" color="primary"><DescriptionIcon/></IconButton>
                        </Box>
                        </TableCell>
                    </TableRow>
                    
                    ))}
                </TableBody>
            </Table>
            {(detailsPopup) && (
            <PopupClienteMovDetails 
                trigger={detailsPopup} 
                setTrigger={setDetailsPopup}
                id={detailsId}
                tipoMovimiento={tipoMovimiento}
            >
            </PopupClienteMovDetails>
            )}
        </TableContainer>
        </>
	);
}
export default TableClientesMovEdit;