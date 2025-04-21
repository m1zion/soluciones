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
export default function ProveedoresAdm() {
  const { state } = useContext(AppContext);
  const [authorized,setAuthorized] = useState(true);
  const [proveedorData, setProveedorData] = useState([]);
  const [nombre, setNombre] = useState('');
  const [nombre2, setNombre2] = useState('');
  const [idProveedor, setIdProveedor] = useState('');

  const cleanProveedorId = (state.proveedorId && state.proveedorId !== 'undefined') ? state.proveedorId : '';
  const [idProveedor2, setIdProveedor2] = useState(cleanProveedorId);

  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);  //Pagination
  const [itemsPerPage] = useState(10); //Pagination
  const [success, setSuccess] = useState(false);
  const [noResult, setNoResult] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState('');
  const authorizedRoles = ['proveedor', 'admin', 'contabilidad'];
  useEffect(() => {
    if (!authorizedRoles.includes(state.role)) {
      setAuthorized(false);
    }
  }, [state.role]); 
  const { data: proveedorFetchData, loading, error } = useGet7V(
    `${API}proveedores/?offset=${(currentPage - 1) * itemsPerPage}&limit=${itemsPerPage}${idProveedor2 !== '' ? `&id=${idProveedor2}` : ''}${nombre2 !== '' ? `&nombre=${nombre2}` : ''}`,state.token
  );
  useEffect(() => {
    if (proveedorFetchData && proveedorFetchData.proveedores) {
      setProveedorData(proveedorFetchData.proveedores);
      setTotalItems(proveedorFetchData.totalItems); 
      setNoResult("");
    }
    else{
      if(error){
        if (error === "No se encontraron resultados"){
          setProveedorData([]);
          setSuccess(true);
          setNoResult("No se encontraron resultados");
        }
        else{
          setSuccess(false);
          setErrMsg(error || "Error de consulta.");
        }
      }
    }
  }, [proveedorFetchData, currentPage, error]);
  const handleSearch = () => {
     // If both fields are empty, reset the search
     if (idProveedor === "" && nombre === "") {
      setIdProveedor2("");
      setNombre2("");
      setCurrentPage(1);
      return;
    }
    // Validate idProveedor length if it's not empty
    if (nombre !== "" && nombre.length < 4) {
      alert("El nombre del proveedor debe tener al menos 4 caracteres.");
      return;
    }
    setIdProveedor2(idProveedor);
    setNombre2(nombre);
    setCurrentPage(1);
  }
  const navigate = useNavigate();
  const handleNewItem = () =>{
      navigate('create');
  }
  const handleDetails = (id) =>{
      navigate('detail/'+id);
  };    
  const handleDelete = async (id) =>{
      if(window.confirm("¿Deseas eliminar el registro?")){
        const APIDelete = API.concat('proveedores/').concat(id);
        const { success, error } = await useDelete2V(APIDelete,state.token);
        if (success) {
          setSuccess(true);          
          alert('Registro Eliminado.')
          window.location.reload();  //talvez podamos usar useEffect para que cuando cambie se recargue el elemento
        } else if (error) {
          setSuccess(false);
          setErrMsg(error || "Error occurred during the request");
        }
      }
  };
  const handleEdit = (id) =>{
    navigate('edit/'+id);
  };
  //PAGINATION------
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
  //PAGINATION END------
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
  if (proveedorData == undefined) {
    return <Typography>Loading...</Typography>; // or handle loading state appropriately
  }
  return (             
    <Box className = "adminContainer">
      <Box className= "admin-tableHeader" >
        <Typography  className="admin-title">Proveedores</Typography>
        <Box><Button className= "admin-newButton" variant="contained" onClick={handleNewItem}>+ Nuevo</Button></Box>
      </Box>
      <Box className= "admin-tableHeader" >
        <Box className= "find-properties-box">
          <TextField
              id="idProveedor" 
              label="Id" 
              size="small"
              name="idProveedor"
              autoComplete='off'
              value={idProveedor}
              onChange={e=>setIdProveedor(e.target.value)}
              inputProps={{maxLength:50 }}
          ></TextField> 
           <TextField
              id="nombre" 
              label="Nombre" 
              size="small"
              name="nombre"
              autoComplete='off'
              value={nombre}
              onChange={e=>setNombre(e.target.value)}
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
              <TableCell className='admin-tableHead' align="right">CODIGO</TableCell>
              <TableCell className='admin-tableHead' align="right">NOMBRE</TableCell>
              <TableCell className='admin-tableHead' align="right">E-MAIL</TableCell>
              <TableCell className='admin-tableHead' align="right">TELEFONO</TableCell>
              <TableCell className='admin-tableHead admin-actionsCell' align="right">SALDO</TableCell>
              <TableCell className='admin-tableHead'  align="right">ACCIONES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proveedorData.map((row) => (
              <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
              <TableCell align="right">{row.id}</TableCell>
              <TableCell align="right">{row.nombre}</TableCell>
              <TableCell align="right">{row.email}</TableCell>
              <TableCell align="right">{row.telefono}</TableCell>
              <TableCell  className="admin-actionsCell" sx={{ whiteSpace: 'nowrap' }} align="right">$ {formatNumber(parseFloat(row.saldo))}</TableCell>
              <TableCell align="right">
                  <Box className="admin-actionButtons">
                      <IconButton className= "admin-deleteButton" onClick={() => handleEdit(row.id)} size="small" variant="outlined" color="primary"><EditIcon/></IconButton>
                      <IconButton className= "admin-deleteButton" onClick={() =>handleDetails(row.id)} size="small" variant="outlined" color="primary"><DescriptionIcon/></IconButton>
                      <IconButton className= "admin-deleteButton" onClick={() =>handleDelete(row.id)} size="small" variant="outlined" color="error"><DeleteIcon/></IconButton>
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