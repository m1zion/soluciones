import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Typography, Box, Button, IconButton, MenuItem, Select, InputLabel, FormControl, TableContainer, TextField, Alert } from "@mui/material";
import '@styles/AddressForm.scss';
import React, { useEffect, useState, useContext } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DescriptionIcon from '@mui/icons-material/Description';
import { useNavigate } from 'react-router-dom';
import '../Administrador.scss';
import Paginate from '@componentsDashboard/Paginate'; 
import useGet7V from '@hooks/useGet7V';
import SearchIcon from '@mui/icons-material/Search';
import formatNumber  from '@utils/formatNumber';
import AppContext from '@context/AppContext';
const API = process.env.REACT_APP_API_URL;
export default function VentasAdm() {
  const { state } = useContext(AppContext);
  const [authorized,setAuthorized] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);  //Pagination
  const [itemsPerPage] = useState(10); //Pagination
  const [success, setSuccess] = useState(false);    
  const [errMsg, setErrMsg] = useState('');
  const[ordenVentaData,setOrdenVentaData] = useState([]);
  const [noResult, setNoResult] = useState(false);
  const [ordenVenta, setOrdenVenta] = useState('');
  const [ordenVenta2, setOrdenVenta2] = useState('');
  const [clienteId, setClienteId] = useState('');
  const [clienteId2, setClienteId2] = useState('');
  const [fechaInicial, setFechaInicial] = useState('');
  const [fechaInicial2, setFechaInicial2] = useState('');
  const [fechaFinal, setFechaFinal] = useState('');
  const [fechaFinal2, setFechaFinal2] = useState('');
  const [estatus,setEstatus] = useState('');
  const [estatus2,setEstatus2] = useState('');
  const [canal,setCanal] = useState('');
  const [canal2,setCanal2] = useState('');
  const navigate = useNavigate();
  const authorizedRoles = ['ventas', 'admin', 'contabilidad'];
  const handleNewItem = () =>{
      navigate('create');
  }
  useEffect(() => {
      if (!authorizedRoles.includes(state.role)) {
        setAuthorized(false);
      }
    }, [state.role]); 
  const handleDetails = (id) =>{
      navigate('detail/'+id);
  };    
  const handleEdit = (id) =>{
    navigate('edit/'+id);
  };
  const handleSearch = () => {
    if (estatus != "" || canal != "" || ordenVenta != "" || fechaInicial != "" || fechaFinal != "" || clienteId != ""){
      if(fechaInicial != "" && fechaFinal == ""){ //Asignamos la fecha final al dia de hoy + 1
        const today = new Date();
        today.setDate(today.getDate() + 1); // Add one day to FechaFinal
        const formattedDate = today.toISOString().split('T')[0];
        setFechaFinal2(formattedDate);  
        setFechaInicial2(fechaInicial);
      }
      if(fechaInicial == "" && fechaFinal != ""){ //Asignamos la fecha Inicial a enero de 2024 
        const fechaFinalDate = new Date(fechaFinal);
        fechaFinalDate.setDate(fechaFinalDate.getDate() + 1); // Add one day to fechaFinal
        const formattedFechaFinal2 = fechaFinalDate.toISOString().split('T')[0];
        setFechaFinal2(formattedFechaFinal2);
        setFechaInicial2('2024-01-01');
      }
      if(fechaInicial != "" && fechaFinal != ""){ //Asignamos fecha inicial tal cual, fecha final +1 
        const fechaFinalDate = new Date(fechaFinal);
        fechaFinalDate.setDate(fechaFinalDate.getDate() + 1); // Add one day to fechaFinal
        const formattedFechaFinal2 = fechaFinalDate.toISOString().split('T')[0];
        setFechaFinal2(formattedFechaFinal2); 
        setFechaInicial2(fechaInicial);
      }
      setClienteId2(clienteId);
      setEstatus2(estatus);
      setCanal2(canal);
      setOrdenVenta2(ordenVenta);
      setCurrentPage(1);
    }
    if (estatus == "" && canal == "" && ordenVenta == "" && fechaInicial == "" && fechaFinal == "" && clienteId == ""){
      setClienteId2("");
      setEstatus2("");
      setCanal2("");
      setOrdenVenta2("");
      setFechaInicial2("");
      setFechaFinal2("");
      setCurrentPage(1);
    }
  }
  //==========================================PAGINATION===========================================
  const paginate = (pageNumber) => {
  setCurrentPage(pageNumber);
  };
  const nextPage = () => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }    
  };
  const previousPage = () => {
    if (currentPage !== 1) {
        setCurrentPage(currentPage - 1);
    }
  };
  //===============================GET ORDENES DE VENTA =========================================
  //+ `${canal2 !== '' ? `&proveedorId=${canal2}` : ''}`
  const { data: ordenesVentaFetchData, loading, error } = useGet7V(
    `${API}orders/V2/get?ordenarFechaDesc=DESC&offset=${(currentPage - 1) * itemsPerPage}&limit=${itemsPerPage}`
    + `${estatus2 !== '' ? `&status=${estatus2}` : ''}`
    + `${ordenVenta2 !== '' ? `&order_id=${ordenVenta2}` : ''}`
    + `${fechaInicial2 !== '' ? `&fecha_inicial=${fechaInicial2}` : ''}`
    + `${fechaFinal2 !== '' ? `&fecha_final=${fechaFinal2}` : ''}`
    + `${clienteId2 !== '' ? `&clienteId=${clienteId2}` : ''}`,state.token
  );
  useEffect(() => {
    if (ordenesVentaFetchData && ordenesVentaFetchData.orders) {
      setOrdenVentaData(ordenesVentaFetchData.orders);
      setTotalItems(ordenesVentaFetchData.totalItems); // You may want to update this based on your actual API response
      setNoResult("");
    }
    else{
      if(error){
        if (error === "No se encontraron resultados"){
          setTotalItems(0);
          setOrdenVentaData([]);
          setSuccess(true);
          setNoResult("No se encontraron resultados");
        }
        else{
          setTotalItems(0);
          setSuccess(false);
          setErrMsg(error || "Error de consulta.");
        }
      }
    }
  }, [ordenesVentaFetchData,currentPage,error]);   
  const formatDate2 = (dateString) => { //Esta funcion lo retorna con YYYY-MM-DD
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    //return `${month}-${day}-${year}`;
    return `${year}-${month}-${day}`;
  };
   
  if(!authorized){
    return (             
      <Box className = "noAuthorizedContainer">
        <Typography className='noAuthorizedContainer401'>401</Typography>
        <Typography className='noAuthorizedContainertext'>Lo sentimos, no esta autorizado para ver esta pagina.</Typography>
      </Box>
    );
  }
  if (loading) {
    return <Box>Loading...</Box>;
  }
  if (!success && (error)) {
    return  <Alert severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert> ;
  }
  if (ordenVentaData == undefined) {
    return <Box>Loading...</Box>; // or handle loading state appropriately
  }
  return (             
    <Box className = "adminContainer">
      <Box className= "admin-tableHeader" >
        <Typography component="h2" variant="h5" color ="#1a237e" gutterBottom>Ordenes de Venta</Typography>
        <Box><Button className= "admin-newButton" variant="contained" onClick={handleNewItem}>+ Nuevo</Button></Box>
      </Box>
      <Box className= "admin-tableHeader" >
        <Box className= "find-properties-box">
          <TextField 
            className="InputSearch"
            id="fechaIncial" 
            label="Fecha cambio inicial" 
            size="small"
            name="fechaInicial"
            autoComplete='off'
            value={fechaInicial}
            type="date"
            onChange={e=>setFechaInicial(e.target.value)}
            InputLabelProps={{
                shrink: true,
            }}
            InputProps={{
                placeholder: '',
                maxLength: 50,
            }}
          ></TextField>
          <TextField 
            className="InputSearch"
            id="fechaFinal" 
            label="Fecha cambio final" 
            size="small"
            name="fechaFinal"
            autoComplete='off'
            value={fechaFinal}
            type="date"
            onChange={e=>setFechaFinal(e.target.value)}
            InputLabelProps={{
                shrink: true,
            }}
            InputProps={{
                placeholder: '',
                maxLength: 50,
            }}
          ></TextField>
          <FormControl className="InputSearch"  size="small">
            <InputLabel  id="ddl-proveedorId-label">Estatus</InputLabel>
            <Select  
              id="estatus"
              name="estatus"
              label="Estatus"
              value={estatus}
              onChange={e=>setEstatus(e.target.value)}
            >
              <MenuItem key="0" value="">Todos</MenuItem>
              <MenuItem key={1} value="esperando surtido">Esperando Surtido</MenuItem> {/*pagado*/}
              <MenuItem key={2} value="surtido">Surtido</MenuItem> {/*surtido*/}
              <MenuItem key={3} value="cancelado">Cancelado</MenuItem> {/*cancelado*/}
              <MenuItem key={4} value="pagado">Pagado</MenuItem> {/*cancelado*/}
            </Select>
          </FormControl>
          {/*<FormControl className="InputSearch"  size="small">
            <InputLabel  id="ddl-proveedorId-label">Canal</InputLabel>
            <Select  
              id="canal"
              name="canal"
              label="Canal"
              value={canal}
              onChange={e=>setCanal(e.target.value)}
            >
              <MenuItem key="0" value="0">Todos</MenuItem>
              <MenuItem key={1} value="tienda">Tienda</MenuItem>
              <MenuItem key={2} value="configurador">Configurador</MenuItem>
              <MenuItem key={3} value="openshow">Open Show</MenuItem>
              <MenuItem key={4} value="administrador">Administrador</MenuItem>
            </Select>
          </FormControl>*/}
          <TextField 
            className="InputSearch"
            id="ordenVenta" 
            label="Orden de venta" 
            size="small"
            name="ordenVenta"
            autoComplete='off'
            value={ordenVenta}
            onChange={e=>setOrdenVenta(e.target.value)}
            inputProps={{maxLength:50 }}
          ></TextField>
          <TextField 
            className="InputSearch"
            id="clienteId" 
            label="No. Cliente" 
            size="small"
            name="clienteId"
            autoComplete='off'
            value={clienteId}
            onChange={e=>setClienteId(e.target.value)}
            inputProps={{maxLength:4 }}
          ></TextField>
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
      {  noResult && ( <Alert severity="warning" className={noResult ? "errmsg" : "offscreen"} aria-live="assertive" >{noResult}</Alert>  
      )}
      <TableContainer sx={{overflow:'auto'}}> {/*Esto es para que no se desborde en dispositivos pequeños*/}
        <Table size="small"  sx={{minWidth:'unset'}}  className='admin-crudTable'>
          <TableHead >
            <TableRow>
              <TableCell className='admin-tableHead' align="right">ORDEN</TableCell>
              <TableCell className='admin-tableHead' align="right">F. CAMBIO</TableCell>
              <TableCell className='admin-tableHead' align="right">F. CREACIÓN</TableCell>
              <TableCell className='admin-tableHead' align="right">CLIENTE</TableCell>
              <TableCell className='admin-tableHead' align="right">ESTATUS</TableCell>
              <TableCell className='admin-tableHead admin-actionsCell' align="right">TOTAL</TableCell>
              <TableCell className='admin-tableHead admin-actionsCell' align="right">PAGADO</TableCell>
              <TableCell className='admin-tableHead'  align="right">ACCION</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ordenVentaData.map((row) => (
              <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="right">{row.id}</TableCell>
                <TableCell align="right">{formatDate2(row.lastmodified)}</TableCell>
                <TableCell align="right">{formatDate2(row.createdAt)}</TableCell>
                <TableCell align="right">{row.clienteId}</TableCell>
                <TableCell align="right">{row.status}</TableCell>
                <TableCell align="right"><Typography variant='body2' noWrap>{row.total ? (`$ ${formatNumber(row.total)}`) : '-'}</Typography></TableCell>
                <TableCell align="right">{row.status == 'pagado' ? 'PAGADO' : '$'+formatNumber(row.saldoVenta)}</TableCell>
                <TableCell align="right">
                  <Box className="admin-actionButtons">
                  {row.status !== "cancelado" && row.status !== "pagado" && row.status !== "surtido" && (
                    <IconButton
                      className="admin-deleteButton"
                      onClick={() => handleEdit(row.id)}
                      size="small"
                      variant="outlined"
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                   <IconButton className= "admin-deleteButton" onClick={() => handleDetails(row.id)} size="small" variant="outlined" color="primary"><DescriptionIcon/></IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Paginate
        productsPerPage={itemsPerPage}
        totalPosts={totalItems}
        paginate={paginate}
        previousPage={previousPage}
        nextPage={nextPage}
        currentPage={currentPage}
      />  
    </Box>      
  );
}