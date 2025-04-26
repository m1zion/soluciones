import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Typography, Box, Button, IconButton, TableContainer, Alert, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import '@styles/AddressForm.scss';
import React, { useEffect, useRef, useState, useContext } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import useGet7V from '@hooks/useGet7V';
import '../Administrador.scss';
import Paginate from '@componentsDashboard/Paginate'; 
import useDelete2V from '@hooks/useDelete2V';
import SearchIcon from '@mui/icons-material/Search';
import AppContext from '@context/AppContext';
import isEmail from 'validator/lib/isEmail';
const API = process.env.REACT_APP_API_URL;
export default function UsuariosAdm() {
  const { state } = useContext(AppContext);
  const [authorized,setAuthorized] = useState(true);
  const [usuarioData, setUsuarioData] = useState([]);
  const [correo, setCorreo] = useState('');
  const [role, setRole] = useState('');
  const [role2, setRole2] = useState('');
  const [correo2, setCorreo2] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);  //Pagination
  const [itemsPerPage] = useState(10); //Pagination
  const [success, setSuccess] = useState(false);
  const [noResult, setNoResult] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState('');  
  const [errorCorreo, setErrorCorreo] = useState(false);
  const [msgCorreo, setMsgCorreo] = useState('Correo');
  const authorizedRoles = ['admin'];
  useEffect(() => {
    if (!authorizedRoles.includes(state.role)) {
      setAuthorized(false);
    }
  }, [state.role]); 
  //===================================Consultamos datos de usuario=========================================
  const { data: usuarioFetchData, loading, error } = useGet7V(
    `${API}users/?offset=${(currentPage - 1) * itemsPerPage}&limit=${itemsPerPage}`
    + `${role2 !== '' ? `&role=${role2}` : ''}`
    + `${correo2 !== '' ? `&correo=${correo2}` : ''}`,state.token
  );
  useEffect(() => {
      if (usuarioFetchData && usuarioFetchData.users) {
        setUsuarioData(usuarioFetchData.users);
        setTotalItems(usuarioFetchData.totalItems);
        setNoResult("");
      } else {
        if (error) { 
          if (error === "No se encontraron resultados") {
            setUsuarioData([]);
            setSuccess(true);
            setNoResult("No se encontraron resultados");
          } else {
            setUsuarioData([]);
            setSuccess(false);
            setErrMsg(error || "Error de consulta.");
          }
        }
      }

  }, [usuarioFetchData, currentPage, error, role2]);
  //===========================================================================================================
  const handleSearch = () => {
    let error = false;
    if ((correo.length > 0 && correo.length < 3) || (correo.length > 3 && !isEmail(correo))) { 
      setErrorCorreo(true); 
      setMsgCorreo("min:3 caracteres"); 
      error = true;
    } 
    else { 
      setErrorCorreo(false); setMsgCorreo("Correo"); 
    }  
    if (error){
      return;    
    }    
    if (correo != "" || role != ""){
      setCorreo2(correo);
      setRole2(role);
      setCurrentPage(1);
    }
    if (correo == "" && role == ""){  //Limpiamos los resultados
      setCorreo2("");
      setRole2("");
      setCurrentPage(1);
    }
  }
  const navigate = useNavigate();
  const handleNewItem = () =>{
      navigate('create');
  } 
  const handleDelete = async (id) =>{
    if(window.confirm("¿Deseas eliminar el registro?")){
      const APIDelete =  API+'users/'+id;
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
  /*if (!success && error) {
    return  <Alert ref={errRef}  severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert> ;
  }*/
  if (usuarioData == undefined) {
    return <Typography>Loading...</Typography>; // or handle loading state appropriately
  }
  return (             
    <Box className = "adminContainer">
      <Box className= "admin-tableHeader" >
        <Typography  className="admin-title">Usuarios</Typography>
        <Box><Button className= "admin-newButton" variant="contained" onClick={handleNewItem}>+ Nuevo</Button></Box>
      </Box>
      <Box className= "admin-tableHeader" >
        <Box className= "find-properties-box">         
           <TextField
              error={errorCorreo}
              id="correo" 
              label={msgCorreo}
              size="small"
              name="correo"
              autoComplete='off'
              value={correo}
              onChange={e=>setCorreo(e.target.value)}
              inputProps={{maxLength:50 }}
          ></TextField> 
         <FormControl className="InputSearch"  size="small">
            <InputLabel  id="ddl-proveedorId-label">Rol</InputLabel>
            <Select  
              id="role"
              name="role"
              label="Rol"
              value={role}
              onChange={e=>setRole(e.target.value)}
            >
                <MenuItem key="0" value="">Todos</MenuItem>
                <MenuItem key="1" value="admin">Administrador</MenuItem>
                <MenuItem key="2" value="cliente">Clientes</MenuItem>
                {/*<MenuItem key="5" value="ventas">Ventas</MenuItem>
                <MenuItem key="6" value="devoluciones">Devoluciones</MenuItem>
                <MenuItem key="7" value="proveedor">Proveedor</MenuItem>
                <MenuItem key="8" value="contabilidad">Contabilidad</MenuItem>
                <MenuItem key="9" value="recuperacion">Recuperacion</MenuItem>
                <MenuItem key="10" value="estadisticas">Estadisticas</MenuItem>
                <MenuItem key="11" value="diseño">Diseño</MenuItem> */}         
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
      <Alert ref={errRef}  severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert>  
      {  noResult && ( <Alert severity="warning" className={noResult ? "errmsg" : "offscreen"} aria-live="assertive" >{noResult}</Alert>  
      )}
      <TableContainer sx={{overflow:'auto'}}> {/*Esto es para que no se desborde en dispositivos pequeños*/}
        <Table size="small"  sx={{minWidth:'unset'}}  className='admin-crudTable'>
          <TableHead >
            <TableRow>
              <TableCell className='admin-tableHead' align="right">ID</TableCell>
              <TableCell className='admin-tableHead' align="right">CORREO</TableCell>
              <TableCell className='admin-tableHead' align="right">ROL</TableCell>
              <TableCell className='admin-tableHead'  align="right">ACCIONES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarioData.map((row) => (
              <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
              <TableCell align="right">{row.id}</TableCell>
              <TableCell align="right">{row.correo} </TableCell>
              <TableCell align="right">{row.role}</TableCell>
              <TableCell align="right">
                 
                    { row.role != "cliente" &&
                    <Box className="admin-actionButtons">
                    <IconButton className= "admin-deleteButton" onClick={() => handleEdit(row.id)} size="small" variant="outlined" color="primary"><EditIcon/></IconButton>
                    <IconButton className= "admin-deleteButton" onClick={() => handleDelete(row.id)} size="small" variant="outlined" color="error"><DeleteIcon/></IconButton>
                    </Box>
                    }
                    
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