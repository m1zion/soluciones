import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Typography, Box, Button, IconButton, TableContainer, Alert, TextField } from "@mui/material";
import '@styles/AddressForm.scss';
import React, { useEffect, useRef, useState, useContext } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DescriptionIcon from '@mui/icons-material/Description';
import { useNavigate } from 'react-router-dom';
import useGet7V from '@hooks/useGet7V';
import '../Administrador.scss';
import Paginate from '@componentsDashboard/Paginate'; 
import useDelete2V from '@hooks/useDelete2V';
import SearchIcon from '@mui/icons-material/Search';
import formatNumber  from '@utils/formatNumber';
import AppContext from '@context/AppContext';
const API = process.env.REACT_APP_API_URL;
export default function ClientesAdm() {
  const { state } = useContext(AppContext);
  const [authorized,setAuthorized] = useState(true);
  const [clienteData, setClienteData] = useState([]);
  const [idCliente, setIdCliente] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [nombre2, setNombre2] = useState('');
  const [apellidoPaterno2, setApellidoPaterno2] = useState('');
  const [apellidoMaterno2, setApellidoMaterno2] = useState('');
  const [idCliente2, setIdCliente2] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);  //Pagination
  const [itemsPerPage] = useState(10); //Pagination
  const [success, setSuccess] = useState(false);
  const [noResult, setNoResult] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState('');  
  const [errorNombre, setErrorNombre] = useState(false);
  const [errorApellidoPaterno, setErrorApellidoPaterno] = useState(false);
  const [errorApellidoMaterno, setErrorApellidoMaterno] = useState(false);
  const [msgNombre, setMsgNombre] = useState("Nombre");
  const [msgApellidoPaterno, setMsgApellidoPaterno] = useState("Apellido Paterno");
  const [msgApellidoMaterno, setMsgApellidoMaterno] = useState("Apellido Materno");
  const authorizedRoles = ['admin', 'contabilidad'];
  useEffect(() => {
    if (!authorizedRoles.includes(state.role)) {
      setAuthorized(false);
    }
  }, [state.role]); 
  //===================================Consultamos datos de cliente=========================================
  const { data: clienteFetchData, loading, error } = useGet7V(
    `${API}clientes/?offset=${(currentPage - 1) * itemsPerPage}&limit=${itemsPerPage}`
    + `${nombre2 !== '' ? `&nombre=${nombre2}` : ''}`
    + `${apellidoPaterno2 !== '' ? `&apellidoPaterno=${apellidoPaterno2}` : ''}`
    + `${apellidoMaterno2 !== '' ? `&apellidoMaterno=${apellidoMaterno2}` : ''}`
    + `${idCliente2 !== '' ? `&id=${idCliente2}` : ''}`,state.token
  );
  useEffect(() => {
    const fetchUserEmails = async () => {
      if (clienteFetchData && clienteFetchData.clientes) {
        try {
          const updatedClientes = await Promise.all(clienteFetchData.clientes.map(async (cliente) => {
            const userFetchData = await fetch(`${API}users/${cliente.usuarioId}`, {
              headers: {
                'Authorization': `Bearer ${state.token}`,  // Add the Bearer token here
                'Content-Type': 'application/json',
              },
            });
            const jsonUser = await userFetchData.json();
            return { ...cliente, correo: jsonUser.correo };
          }));
  
          setClienteData(updatedClientes);
          setTotalItems(clienteFetchData.totalItems);
          setNoResult("");
        } catch (error) {
          setSuccess(false);
          setErrMsg(error.message || "Error fetching user emails.");
        }
      } else {
        if (error) {
          if (error === "No se encontraron resultados") {
            setClienteData([]);
            setSuccess(true);
            setNoResult("No se encontraron resultados");
          } else {
            setSuccess(false);
            setErrMsg(error || "Error de consulta.");
          }
        }
      }
    };
  
    fetchUserEmails();
  }, [clienteFetchData, currentPage, error]);
  //===========================================================================================================
  const handleSearch = () => {
    let error = false;
    if (nombre.length > 0 && nombre.length < 3) { 
      setErrorNombre(true); setMsgNombre("min:3 caracteres"); 
      error = true;
    } 
    else { 
      setErrorNombre(false); setMsgNombre("Nombre"); 
    }  
    if  (apellidoPaterno.length > 0 && apellidoPaterno.length < 3) { 
      setErrorApellidoPaterno(true); setMsgApellidoPaterno("min:3 caracteres"); 
      error = true;
    }  
    else { 
      setErrorApellidoPaterno(false); setMsgApellidoPaterno("Apellido Paterno"); 
    }  
    if (apellidoMaterno.length > 0 && apellidoMaterno.length < 3) { 
      setErrorApellidoMaterno(true); setMsgApellidoMaterno("min:3 caracteres"); 
      error = true;
    } 
    else { 
      setErrorApellidoMaterno(false); setMsgApellidoMaterno("Apellido Materno"); 
    }  
    if (error){
      return;
    }
    
    if (nombre != "" || apellidoPaterno != "" || apellidoMaterno != "" || idCliente != ""){
      setIdCliente2(idCliente);
      setNombre2(nombre);
      setApellidoPaterno2(apellidoPaterno);
      setApellidoMaterno2(apellidoMaterno);
      setCurrentPage(1);
    }
    if (nombre == "" && apellidoPaterno == "" && apellidoMaterno == "" && idCliente == ""){  //Limpiamos los resultados
      setIdCliente2("");
      setNombre2("");
      setApellidoPaterno2("");
      setApellidoMaterno2("");
      setCurrentPage(1);
    }
  }
  const navigate = useNavigate();
  const handleNewItem = () =>{
      navigate('create');
  }
  const handleDetails = (id) =>{
      navigate('detail/'+id);
  };    
  const handleDelete = async (id,usuarioId) =>{
    var hasItems = false;
    if(window.confirm("¿Deseas eliminar el registro?")){
      //=================Consultamos si tiene Movimientos ==================================
      try {
        const movimientosFetchData = await fetch(API+"cliente/clienteMovimiento/?clienteId="+id, {
          headers: {
            'Authorization': `Bearer ${state.token}`,  // Add the Bearer token here
            'Content-Type': 'application/json',
          },
        });
        const jsonDetalleMovimientos = await movimientosFetchData.json();
        if (jsonDetalleMovimientos.statusCode && jsonDetalleMovimientos.statusCode === 404) {
          console.log(jsonDetalleMovimientos.message); //Mensaje de productos no encontrados
        } else {
          if (jsonDetalleMovimientos.movimientos.length > 0) {
            hasItems = true;
            alert("El usuario tiene movimientos");
            return;
          }
        }
      } catch (error) {
          hasItems = true; //Pondremos la bandera igualmente si tiene un error
          console.error("Error fetching data:", error);
          return;
      }
      //=================Consultamos si tiene Compras ======================================
      try {
        const ventasFetchData = await fetch(API+"orders/V2/get?clienteId="+id, {
          headers: {
            'Authorization': `Bearer ${state.token}`,  // Add the Bearer token here
            'Content-Type': 'application/json',
          },
        });
        const jsonDetalleVentas = await ventasFetchData.json();
        console.log(jsonDetalleVentas);
        if (jsonDetalleVentas.statusCode && jsonDetalleVentas.statusCode === 404) {
          console.log(jsonDetalleVentas.message);  //Mensaje de productos no encontrados
        } else {
          if (jsonDetalleVentas.orders.length > 0) {
            hasItems = true;
            alert("El usuario tiene ventas");
            return;
          }
        }
      } catch (error) {
          hasItems = true; //Pondremos la bandera igualmente si tiene un error
          console.error("Error fetching data:", error);
          return;
      }
    }
    if(!hasItems){
      console.log("Borrara el cliente");
    }
    //=====================Only if it hasItems = false will delete the data
    try {
      const APIDeleteCliente = API.concat('clientes/').concat(id);
      const APIDeleteUser = API+"users/"+usuarioId;
      const { success: successDelete, error: errorDelete } = await useDelete2V(APIDeleteCliente, state.token); //Borramos el cliente
      if (successDelete) {
        setSuccess(true);    
        const { success: successDeleteUser, error: errorDeleteUser } = await useDelete2V(APIDeleteUser, state.token);  //Borramos el usuario
        if (successDeleteUser) {  
          setSuccess(true);      
          window.location.reload();
        } else if (errorDeleteUser) {
          console.error(errorDeleteUser || "Error occurred during the request");
        }
      } 
      else if (errorDelete) {
        setSuccess(false);
        setErrMsg(errorDelete || "Error occurred during the request");
      }
    } catch (error) {
        
    }
  }

  const handleEdit = (id) =>{
    navigate('edit/'+id);
  };
  //PAGINATION==============================================================================
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
  //PAGINATION END==========================================================================
  if(!authorized){
    return (             
      <Box className = "noAuthorizedContainer">
        <Typography className='noAuthorizedContainer401'>401</Typography>
        <Typography className='noAuthorizedContainertext'>Lo sentimos, no esta autorizado para ver esta pagina.</Typography>
      </Box>
    );
  }
  if (loading) {
    return <Typography>Loading...</Typography>;
  }
  if (!success && error) {
    return  <Alert ref={errRef}  severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert> ;
  }
  if (clienteData == undefined) {
    return <Typography>Loading...</Typography>; // or handle loading state appropriately
  }
  return (             
    <Box className = "adminContainer">
      <Box className= "admin-tableHeader" >
        <Typography  className="admin-title">Clientes</Typography>
        <Box><Button className= "admin-newButton" variant="contained" onClick={handleNewItem}>+ Nuevo</Button></Box>
      </Box>
      <Box className= "admin-tableHeader" >
        <Box className= "find-properties-box">
          <TextField
              id="idCliente" 
              label="Id" 
              size="small"
              name="idCliente"
              autoComplete='off'
              value={idCliente}
              onChange={e=>setIdCliente(e.target.value)}
              inputProps={{maxLength:5 }}
          ></TextField> 
           <TextField
              error={errorNombre}
              id="nombre" 
              label={msgNombre}
              size="small"
              name="nombre"
              autoComplete='off'
              value={nombre}
              onChange={e=>setNombre(e.target.value)}
              inputProps={{maxLength:50 }}
          ></TextField> 
           <TextField
              error={errorApellidoPaterno}
              id="apellidoPaterno" 
              label={msgApellidoPaterno}
              size="small"
              name="apellidoPaterno"
              autoComplete='off'
              value={apellidoPaterno}
              onChange={e=>setApellidoPaterno(e.target.value)}
              inputProps={{maxLength:50 }}
          ></TextField> 
           <TextField
              error={errorApellidoMaterno}
              id="apellidoMaterno" 
              label={msgApellidoMaterno}
              size="small"
              name="apellidoMaterno"
              autoComplete='off'
              value={apellidoMaterno}
              onChange={e=>setApellidoMaterno(e.target.value)}
              inputProps={{maxLength:50 }}
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
      <Alert ref={errRef}  severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert>  
      {  noResult && ( <Alert severity="warning" className={noResult ? "errmsg" : "offscreen"} aria-live="assertive" >{noResult}</Alert>  
      )}
      <TableContainer sx={{overflow:'auto'}}> {/*Esto es para que no se desborde en dispositivos pequeños*/}
        <Table size="small"  sx={{minWidth:'unset'}}  className='admin-crudTable'>
          <TableHead >
            <TableRow>
              <TableCell className='admin-tableHead' align="right">ID</TableCell>
              <TableCell className='admin-tableHead' align="right">NOMBRE</TableCell>
              <TableCell className='admin-tableHead' align="right">E-MAIL</TableCell>
              <TableCell className='admin-tableHead' align="right">TELEFONO</TableCell>
              <TableCell className='admin-tableHead admin-actionsCell' align="right">SALDO</TableCell>
              <TableCell className='admin-tableHead'  align="right">ACCIONES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clienteData.map((row) => (
              <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
              <TableCell align="right">{row.id}</TableCell>
              <TableCell align="right">{row.nombre} {row.apellidoPaterno} {row.apellidoMaterno}</TableCell>
              <TableCell align="right">{row.correo} </TableCell>
              <TableCell align="right">{row.telefono}</TableCell>
              <TableCell  className="admin-actionsCell" sx={{ whiteSpace: 'nowrap' }} align="right">$ {formatNumber(parseFloat(row.saldo))}</TableCell>
              <TableCell align="right">
                  <Box className="admin-actionButtons">
                      <IconButton className= "admin-deleteButton" onClick={() => handleEdit(row.id)} size="small" variant="outlined" color="primary"><EditIcon/></IconButton>
                      <IconButton className= "admin-deleteButton" onClick={() =>handleDetails(row.id)} size="small" variant="outlined" color="primary"><DescriptionIcon/></IconButton>
                      <IconButton className= "admin-deleteButton" onClick={() =>handleDelete(row.id, row.usuarioId)} size="small" variant="outlined" color="error"><DeleteIcon/></IconButton>
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