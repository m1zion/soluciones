import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Typography, Box, Button, IconButton, Link, TableContainer, Alert, TextField } from "@mui/material";
import '@styles/AddressForm.scss';
import React, { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import useDelete2 from '@hooks/useDelete2';
import { useNavigate   } from 'react-router-dom';
import '../Administrador.scss';
import Paginate from '@componentsDashboard/Paginate'; 
import PopupModelosCreate from '@componentsDashboard/PopupModelosCreate';
import useGet8 from '@hooks/useGet8';
import SearchIcon from '@mui/icons-material/Search';
const API = process.env.REACT_APP_API_URL;
export default function ConfiguradorModelosAdm() {
  const navigate = useNavigate();
  const [buttonPopup, setButtonPopup] = useState(false);
  const [success, setSuccess] = useState(false);
  const [modelo, setModelo] = useState('');
  const [modelo2, setModelo2] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);  //Pagination
  const [itemsPerPage] = useState(5); //Pagination
  const [modeloData,setModeloData] = useState([]); 
  const [errMsg, setErrMsg] = useState('');
  const [noResult, setNoResult] = useState(false);
  const handleNewItem = () =>{
    setButtonPopup(true);  
  }    
  const handleDelete = async (id,nombreModelo) =>{
    const APIDelete = API.concat('configurador/catalogoModelos/').concat(id);
    const response = await fetch(API + 'configurador/detalleModelo/?modelo=' + nombreModelo);
    const data = await response.json();
    let containsItem = false;
    if(data.modelo){
      containsItem = true;
    }
    else  {
      containsItem = false;
    }
    if (containsItem) {
      window.alert('El registro no puede ser eliminado porque tiene registros asociados.');
    }
    else  if (window.confirm('¿Deseas eliminar el registro?')) {
      const { success, error } = await useDelete2(APIDelete);
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
  const handleSearch = () => {
    if (modelo != ""){
      setModelo2(modelo);
      setCurrentPage(1);
    }
    if (modelo == ""){
      setModelo2("");
      setCurrentPage(1);
    }
  }
  const { data: detalleModeloFetchData, loading, error } = useGet8(`${API}configurador/catalogoModelos/?offset=${(currentPage - 1) * itemsPerPage}&limit=${itemsPerPage}${modelo2 !== '' ? `&modelo=${modelo2}` : ''}`,buttonPopup);
  useEffect(() => {
      if (detalleModeloFetchData && detalleModeloFetchData.modelos) {
        setModeloData(detalleModeloFetchData.modelos);
        setTotalItems(detalleModeloFetchData.totalItems);
        setNoResult("");
      }
      else{
        if(error){         
          setTotalItems(0);
          if (error === "No se encontraron resultados"){
            setModeloData([]);
            setSuccess(true);
            setNoResult("No se encontraron resultados");
          }
          else{
            setSuccess(false);
            setErrMsg(error || "Error de consulta.");
          }
        }
      }
    }, [detalleModeloFetchData,currentPage,error,buttonPopup]);  
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
  const handleListItemClick = (event, index) => {
    navigate('/Dashboard/Configurador');
  };
  const flexContainer = {
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
    width:'min-content'
  };
  if (loading) {
    return <Box>Loading...</Box>;
  }
  if (!success && (error)) {
    return  <Alert severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert> ;
  }
  return (             
    <Box className = "adminContainer">
       <Box sx={flexContainer}>
        <Link
          className='adminNavigation'
          onClick={(event) => handleListItemClick(event, 1)}
        >Configurador
        </Link>
      </Box>
      <Box className= "admin-tableHeader" >
        <Typography className="admin-title" variant='h5'>Modelos</Typography>
        <Box><Button className= "admin-newButton" variant="contained" onClick={handleNewItem}>+ Nuevo</Button></Box>
      </Box>
      <Box className= "admin-tableHeader" >
        <TextField
            id="modelo" 
            label="Modelo" 
            size="small"
            name="modelo"
            autoComplete='off'
            value={modelo}
            onChange={e=>setModelo(e.target.value)}
            inputProps={{maxLength:50 }}
          ></TextField> 
          <Button 
            className= "primary-button-admin-outlined-tiny" 
            variant="outlined" 
            startIcon={<SearchIcon/>}
            onClick={handleSearch}
          >
            Buscar
          </Button>
      </Box>
      <Alert severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert>  
      {  noResult && ( <Alert severity="warning" className={noResult ? "errmsg" : "offscreen"} aria-live="assertive" >{noResult}</Alert>  
      )}
      <TableContainer sx={{overflow:'auto'}}> {/*Esto es para que no se desborde en dispositivos pequeños*/}
        <Table size="small"  sx={{minWidth:'unset'}}  className='admin-crudTable'>
          <TableHead >
            <TableRow>
              <TableCell className='admin-tableHead' align="right">MARCA</TableCell>
              <TableCell className='admin-tableHead' align="right">MODELO</TableCell>
              <TableCell className='admin-tableHead' align="right">ACCIONES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {modeloData.map((row) => (
              <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
              <TableCell align="right">{row.marca}</TableCell>
              <TableCell align="right">{row.modelo}</TableCell>
              <TableCell align="right">
                  <Box className="admin-actionButtons">
                      <IconButton className= "admin-deleteButton" onClick={() =>handleDelete(row.id,row.modelo)} size="small" variant="outlined" color="error"><DeleteIcon/></IconButton>
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
      <PopupModelosCreate 
        trigger={buttonPopup} 
        setTrigger={setButtonPopup}
      >
      </PopupModelosCreate> {/*Aqui podemos parar cualquier cjildren y leerlo en el popup {props.children} */}
    </Box>      
  );
}