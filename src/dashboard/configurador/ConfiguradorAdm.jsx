import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Typography, Box, Button, IconButton, MenuItem, Select, InputLabel, FormControl, TableContainer, Alert } from "@mui/material";
import '@styles/AddressForm.scss';
import React, { useEffect, useState, useRef, useMemo, useContext } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DescriptionIcon from '@mui/icons-material/Description';
import { useNavigate } from 'react-router-dom';
import useGet7 from '@hooks/useGet7';
import '../Administrador.scss';
import Paginate from '@componentsDashboard/Paginate'; 
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import useDelete2 from '@hooks/useDelete2';
import SearchIcon from '@mui/icons-material/Search';
import AppContext from '@context/AppContext';
const API = process.env.REACT_APP_API_URL;
const APIMARCAS = API+'configurador/marcas/?offset=0&limit=100';
const APIMODELOS = API+'configurador/modelos/?offset=0&limit=100';
export default function ConfiguradorAdm() {
  const { state } = useContext(AppContext);
  const [authorized,setAuthorized] = useState(true);
  //console.log("EJECUTANDOSE");
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const errRef = useRef();
  const [modelos,setModelos] = useState('');
  const [marcaId, setMarcaId] = useState('');
  const [modelo, setModelo] = useState('');
  const [marcaId2, setMarcaId2] = useState('');
  const [modelo2, setModelo2] = useState('');
  const [buscar, setBuscar] = useState(false);
  const [noResult, setNoResult] = useState(false);
  const[detalleModeloData,setDetalleModeloData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);  //Pagination
  const [itemsPerPage] = useState(5); //Pagination
  const { data: marcasFetchData, loading: loadingMa, error:errorMa } = useGet7(APIMARCAS);
  const authorizedRoles = ['admin'];
  useEffect(() => {
    if (!authorizedRoles.includes(state.role)) {
      setAuthorized(false);
    }
  }, [state.role]); 


  const marcas = useMemo(() => {
      if (errorMa) {
          setSuccess(false);
          setErrMsg("Error al consultar Marcas");
          return;
      }
      return marcasFetchData.marcas;
  }, [marcasFetchData, errorMa]);
  if (Array.isArray(marcas)) {
    marcas.sort((a, b) => {
      const nameA = a.marca.toUpperCase(); // convert names to uppercase for case-insensitive comparison
      const nameB = b.marca.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }
  const handleMarcaId = async (event) => {
    setModelo('');
    setMarcaId(event.target.value);
    try {
      const response = await fetch(`${APIMODELOS}&marca=${event.target.value}`);
      if (response.status === 404) {
          setModelos([]);
        } else {
      const data = await response.json();
      const modelos = data.modelos;

      if (Array.isArray(modelos)) {
          const dt = [...new Set(modelos.map(item => item.modelo))];
          setModelos(dt);
      } 
      } 
    }
    catch (error) {
        console.error('Error fetching models:', error);
    }
  };

  const navigate = useNavigate();
  const handleNewItem = () =>{ navigate('create'); }
  const handleMarcas = () =>{ navigate('/Dashboard/ConfiguradorMarcas'); }
  const handleModelos = () =>{ navigate('/Dashboard/ConfiguradorModelos'); }
  const handleDetails = (id) =>{ navigate('detail/'+id); };   
  const handleEdit = (id) =>{ navigate('edit/'+id); }; 
  const handleModelo = (event) =>{ 
    setModelo(event.target.value);
  }
  const handleSearch = () => {
    if (marcaId != "" || modelo != ""){
      setBuscar((prevBuscar) => !prevBuscar);
      setMarcaId2(marcaId);
      setModelo2(modelo);
      setCurrentPage(1);
    }
    if (marcaId == "" && modelo == ""){
      setMarcaId2("");
      setModelo2("");
      setCurrentPage(1);
    }
  }
  const handleDelete = async (id) =>{
    if(window.confirm("¿Deseas eliminar el registro?")){
      const APIDelete = API.concat('configurador/detalleModelo/').concat(id);
      //const APIDelete = 'http://localhost:3001/detalleModelo/'.concat(id);
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
  const { data: detalleModeloFetchData, loading, error } = useGet7(
    `${API}configurador/modelos/?offset=${(currentPage - 1) * itemsPerPage}&limit=${itemsPerPage}${marcaId2 !== '' ? `&marca=${marcaId2}` : ''}${modelo2 !== '' ? `&modelo=${modelo2}` : ''}`
  );
  //Si quiero que cambien automaticamente sin dar clic en buscar solamente tengo que cabiar marcaId2 por marcaId y modelo2 por modelo
  //De esta manera la url cambia siempre y el useEffect se ejecuta
  //const { data: detalleModeloFetchData, loading, error } = useGet7(
    //`${API}configurador/modelos/?offset=${(currentPage - 1) * itemsPerPage}&limit=${itemsPerPage}${marcaId !== '' ? `&marca=${marcaId}` : ''}${modelo !== '' ? `&modelo=${modelo}` : ''}`
  //);
  useEffect(() => {
      //console.log(detalleModeloFetchData);
      if (detalleModeloFetchData && detalleModeloFetchData.modelos) {
        setDetalleModeloData(detalleModeloFetchData.modelos);
        setTotalItems(detalleModeloFetchData.totalItems); // You may want to update this based on your actual API response
        setNoResult("");
      }
      else{
        if(error){
         
          if (error === "No se encontraron resultados"){
            setDetalleModeloData([]);
            setSuccess(true);
            setNoResult("No se encontraron resultados");
          }
          else{
            setSuccess(false);
            setErrMsg(error || "Error de consulta.");
          }
        }
      }
    }, [detalleModeloFetchData,currentPage,error]);    

  if(!authorized){
    return (             
      <Box className = "noAuthorizedContainer">
        <Typography className='noAuthorizedContainer401'>401</Typography>
        <Typography className='noAuthorizedContainertext'>Lo sentimos, no esta autorizado para ver esta pagina.</Typography>
      </Box>
    );
  }
  if (loading || loadingMa) {
    return <Box>Loading...</Box>;
  }
  if (!success && (error || errorMa)) {
    return  <Alert ref={errRef}  severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert> ;
  }
  if (detalleModeloData == undefined) {
    return <Box>Loading...</Box>; // or handle loading state appropriately
  }
  return (             
    <Box className = "adminContainer">
      <Box className= "admin-tableHeader" >
        <Typography className="admin-title" variant='h5'>Configurador de Auto</Typography>
        <Box><Button className= "admin-newButton" variant="contained" onClick={handleNewItem}>+ Nuevo</Button></Box>
      </Box>
      <Box className= "admin-tableHeader2" >
          <Button className= "primary-button-admin-outlined-small" variant="contained" onClick={handleMarcas} startIcon={<LibraryAddIcon />}>Marcas</Button>
          <Button className= "primary-button-admin-outlined-small" variant="contained" onClick={handleModelos} startIcon={<DirectionsCarIcon />}>Modelos</Button>
      </Box>
      <Box className= "admin-tableHeader" >
        <Box className= "find-properties-box">
          <FormControl className="InputSearch"  size="small">
            <InputLabel  id="ddl-marca-label">Marca </InputLabel>
            <Select  
              id="marcaId"
              name="marcaId"
              label="Marca"
              value={marcaId}
              //onChange={e=>setMarcaId(e.target.value)}
              onChange={handleMarcaId}
            >
              <MenuItem key="0" value="">Todas</MenuItem>
              {
              marcas && marcas !== undefined ?
              marcas.map((marca,index) =>{
                return (
                  <MenuItem key={index} value={marca.marca}>{marca.marca}</MenuItem>
                )
              })
                : ""
              }
            </Select>
          </FormControl>
          <FormControl className="InputSearch"  size="small">
            <InputLabel id="ddl-modelo-label">Modelo *</InputLabel>
            <Select
                label="Modelo"
                id="modelo"
                name="modelo"
                value={modelo}
                onChange={handleModelo}
            >
            {
            modelos && modelos !== undefined ?
            modelos.map((mod,index) =>{
                return (
                    <MenuItem key={index} value={mod}>{mod}</MenuItem>
                )
            })
            : "No hay Modelo"
            }
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
     
      <TableContainer sx={{overflow:'auto'}}> 
        <Table size="small"  sx={{minWidth:'unset'}}  className='admin-crudTable'>
          <TableHead >
            <TableRow>
              <TableCell className='admin-tableHead' align="right">ID</TableCell>
              <TableCell className='admin-tableHead' align="right">MARCA</TableCell>
              <TableCell className='admin-tableHead' align="right">MODELO</TableCell>
              <TableCell className='admin-tableHead' align="right">AÑO</TableCell>
              <TableCell className='admin-tableHead'  align="right">ACCIONES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {detalleModeloData.map((row) => (
              <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
              <TableCell align="right">{row.id}</TableCell>
              <TableCell align="right">{row.marca}</TableCell>
              <TableCell align="right">{row.modelo}</TableCell>
              <TableCell align="right">{row.Anio}</TableCell>
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



/*import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Typography, Box, Button, IconButton, MenuItem, Select, InputLabel, FormControl, TableContainer, Alert } from "@mui/material";
import '@styles/AddressForm.scss';
import React, { useEffect, useState, useRef, useMemo } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DescriptionIcon from '@mui/icons-material/Description';
import { useNavigate } from 'react-router-dom';
import useGet7 from '@hooks/useGet7';
import '@styles/Administrador.scss';
import Paginate from '@componentsD/Paginate'; 
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import useDelete2 from '@hooks/useDelete2';
import SearchIcon from '@mui/icons-material/Search';
const API = process.env.REACT_APP_API_URL;
const APIMARCAS = API+'configurador/marcas/?offset=0&limit=100';
const APIMODELOS = API+'configurador/modelos/';
export default function ConfiguradorAdm() {
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const errRef = useRef();
  const [marcaId, setMarcaId] = useState('');
  const [modelos,setModelos] = useState('');
  const [modelo, setModelo] = useState('');
  const [noResult, setNoResult] = useState('');
  const [buscar, setBuscar] = useState(false);  
  const[detalleModeloData,setDetalleModeloData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);  //Pagination
  const [itemsPerPage] = useState(5); //Pagination

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: marcasFetchData, loading: loadingMa, error:errorMa } = useGet7(APIMARCAS);
  const marcas = useMemo(() => {
      if (errorMa) {
          setSuccess(false);
          setErrMsg("Error al consultar Marcas");
          return;
      }
      return marcasFetchData.marcas;
  }, [marcasFetchData, errorMa]);
  if (Array.isArray(marcas)) {
    marcas.sort((a, b) => {
      const nameA = a.marca.toUpperCase(); // convert names to uppercase for case-insensitive comparison
      const nameB = b.marca.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }
  const handleMarcaId = async (event) => {
    setModelo('');
    setMarcaId(event.target.value);
    try {
      const response = await fetch(`${APIMODELOS}?marca=${event.target.value}`);
      if (response.status === 404) {
          setModelos([]);
        } else {
      const data = await response.json();
      const modelos = data.modelos;

      if (Array.isArray(modelos)) {
          const dt = [...new Set(modelos.map(item => item.modelo))];
          setModelos(dt);
      } 
      } 
    }
    catch (error) {
        console.error('Error fetching models:', error);
    }
  };
  const navigate = useNavigate();
  const handleNewItem = () =>{ navigate('create'); }
  const handleMarcas = () =>{ navigate('/Dashboard/ConfiguradorMarcas'); }
  const handleModelos = () =>{ navigate('/Dashboard/ConfiguradorModelos'); }
  const handleDetails = (id) =>{ navigate('detail/'+id); };   
  const handleEdit = (id) =>{ navigate('edit/'+id); }; 
  const handleModelo = (event) =>{ 
    setModelo(event.target.value);
  }
  const handleSearch = () => {
    if (marcaId != "" || modelo != ""){
      setBuscar((prevBuscar) => !prevBuscar);
      setCurrentPage(1);
    }   
  }
  const handleDelete = async (id) =>{
  if(window.confirm("¿Deseas eliminar el registro?")){
    //const APIDelete = API.concat('detalleModelo/').concat(id);
    const APIDelete = 'http://localhost:3001/detalleModelo/'.concat(id);
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
  const fetchDataBasedOnSearch = async () => {
    try {
      let url = `${API}configurador/modelos/?offset=${(currentPage - 1) * itemsPerPage}&limit=${itemsPerPage}`;
      if (marcaId != '') {
        url += `&marca=${marcaId}`;
      }
      if (modelo != '') {
        url += `&modelo=${modelo}`;
      }
      const response = await fetch(url);    
      if (response.status === 404) {
        const data2 = await response.json();
        if(data2.message == 'No se encontraron Configuraciones correspondientes'){
          setNoResult(data2.message);
          setDetalleModeloData([]);
          setTotalItems(0);
        }
        else{
          setError('Failed to connect.');
          setSuccess(false);
          setErrMsg(error || 'Error de consulta');
        }
      } else {
        const data = await response.json();
        //console.log(data);
        setDetalleModeloData(data.modelos);
        setTotalItems(data.totalItems);
        setNoResult(false);
      }
    } 
    catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        setError('Failed to connect.');
        setSuccess(false);
        setErrMsg(error || 'Error de consulta');
      } else {
        setError('Error de consulta');
        setSuccess(false);
        setErrMsg(error || 'Error de consulta');
      }
    } 
    finally {
      setLoading(false);
    }
  };
  useEffect(() => {
      fetchDataBasedOnSearch();
  }, [buscar,currentPage]);

  
  if (loading || loadingMa) {
    return <Box>Loading...</Box>;
  }
  if (error || errorMa) {
    return  <Alert ref={errRef}  severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert> ;
  }
  if (detalleModeloData == undefined) {
    return <Box>Loading...</Box>; // or handle loading state appropriately
  }
  return (             
    <Box className = "adminContainer">
      <Box className= "admin-tableHeader" >
        <Typography className="admin-title" variant='h5'>Configurador de Auto</Typography>
        <Box><Button className= "admin-newButton" variant="contained" onClick={handleNewItem}>+ Nuevo</Button></Box>
      </Box>
      <Box className= "admin-tableHeader2" >
          <Button className= "primary-button-admin-outlined-small" variant="contained" onClick={handleMarcas} startIcon={<LibraryAddIcon />}>Marcas</Button>
          <Button className= "primary-button-admin-outlined-small" variant="contained" onClick={handleModelos} startIcon={<DirectionsCarIcon />}>Modelos</Button>
      </Box>
      <Box className= "admin-tableHeader" >
        <Box className= "find-properties-box">
          <FormControl className="InputSearch"  size="small">
            <InputLabel  id="ddl-marca-label">Marca </InputLabel>
            <Select  
              id="marcaId"
              name="marcaId"
              label="Marca"
              value={marcaId}
              onChange={handleMarcaId}
            >
              <MenuItem key="0" value="0">Todas</MenuItem>
              {
              marcas && marcas !== undefined ?
              marcas.map((marca,index) =>{
                return (
                  <MenuItem key={index} value={marca.marca}>{marca.marca}</MenuItem>
                )
              })
                : ""
              }
            </Select>
          </FormControl>
          <FormControl className="InputSearch"  size="small">
            <InputLabel id="ddl-modelo-label">Modelo *</InputLabel>
            <Select
                label="Modelo"
                id="modelo"
                name="modelo"
                value={modelo}
                onChange={handleModelo}
            >
            {
            modelos && modelos !== undefined ?
            modelos.map((mod,index) =>{
                return (
                    <MenuItem key={index} value={mod}>{mod}</MenuItem>
                )
            })
            : "No hay Modelo"
            }
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
      <Alert severity="warning" className={noResult ? "errmsg" : "offscreen"} aria-live="assertive" >{noResult}</Alert>  
      <Alert ref={errRef}  severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert>  
      <TableContainer sx={{overflow:'auto'}}>
        <Table size="small"  sx={{minWidth:'unset'}}  className='admin-crudTable'>
          <TableHead >
            <TableRow>
              <TableCell className='admin-tableHead' align="right">ID</TableCell>
              <TableCell className='admin-tableHead' align="right">MARCA</TableCell>
              <TableCell className='admin-tableHead' align="right">MODELO</TableCell>
              <TableCell className='admin-tableHead' align="right">AÑO</TableCell>
              <TableCell className='admin-tableHead'  align="right">ACCIONES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {detalleModeloData.map((row) => (
              <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
              <TableCell align="right">{row.id}</TableCell>
              <TableCell align="right">{row.marca}</TableCell> 
              <TableCell align="right">{row.modelo}</TableCell>
              <TableCell align="right">{row.Anio}</TableCell>  
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
*/