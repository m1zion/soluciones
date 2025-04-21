import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Typography, Box, Button, IconButton, MenuItem, Select, InputLabel, FormControl, TableContainer, Alert, TextField } from "@mui/material";
import '@styles/AddressForm.scss';
import React, { useEffect, useRef, useState, useContext } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DescriptionIcon from '@mui/icons-material/Description';
import { useNavigate } from 'react-router-dom';
import useGet from '@hooks/useGet';
import useGet7V from '@hooks/useGet7V';
import '../Administrador.scss';
import Paginate from '@componentsDashboard/Paginate'; 
import useDelete2V from '@hooks/useDelete2V';
import SearchIcon from '@mui/icons-material/Search';
import formatNumber  from '@utils/formatNumber';
import AppContext from '@context/AppContext';
const API = process.env.REACT_APP_API_URL;
const APICATEGORIAS = API+'categories/?offset=0&limit=100';
const APIPROVEEDORES = API+'proveedores/';
export default function ProductosAdm() {
  const { state } = useContext(AppContext);
  const [productoData, setProductoData] = useState([]);
  const categoriasGet = useGet(APICATEGORIAS);
  const categorias = categoriasGet.products;
  const [apiBase,setApiBase] = useState(API+'products/accesorios/'); //Dejamos inicialmente accesorios por ser la primera alfabeticamente
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10); //Pagination
  const [currentPage, setCurrentPage] = useState(1);  //Pagination
  const [success, setSuccess] = useState(false);
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState('');
  const [noResult, setNoResult] = useState(false);
  
  const [frase,setFrase] = useState('');
  const [frase2,setFrase2] = useState('');
  const [administrador,setAdministrador] = useState(true);
  const [categoryId, setCategoryId] = useState('');
  const [categoryId2, setCategoryId2] = useState('');
  const [proveedorId, setPoveedorId] = useState('');

  const [proveedorId2, setPoveedorId2] = useState('');
  const [mostrarTienda,setMostrarTienda] = useState('');
  const [mostrarTienda2,setMostrarTienda2] = useState('');

  const [errorFrase, setErrorFrase] = useState(false);
  const [msgFrase, setMsgFrase] = useState("SKU, Nombre, Marca, Tags");
  //========================CONSULTAMOS LOS PROVEEDORES==========================================
  const { data: proveedoresFetchData, loading: loadingP, error:errorP } = useGet7V(APIPROVEEDORES,state.token);
  useEffect(() => {
      if(errorP){
          setSuccess(false);
          setErrMsg("Error al consultar Proveedores");
      }
  }, [proveedoresFetchData,errorP]);
  const proveedores = proveedoresFetchData.proveedores;
  if (Array.isArray(proveedores)) {
      proveedores.sort((a, b) => {
          const nameA = a.nombre.toUpperCase(); 
          const nameB = b.nombre.toUpperCase();
          if (nameA < nameB) { return -1; }
          if (nameA > nameB) { return 1; }
          return 0;
      });
  }
  //=============================================================================================     
  const { data: productoFetchData, loading, error } = useGet7V(`${apiBase}?offset=${(currentPage - 1) * itemsPerPage}&limit=${itemsPerPage}
  ${frase2 !== '' ? `&frase=${frase2}` : ''}
  ${administrador ? `&administrador=true` : ''}
  ${categoryId2 !== '' ? `&category_id=${categoryId2}` : ''}
  ${proveedorId2 !== '' ? `&proveedorId=${proveedorId2}` : ''}
  ${mostrarTienda2 !== '' ? `&mostrarTienda=${mostrarTienda2}` : ''}`,state.token);
  useEffect(() => {
    if (productoFetchData && (productoFetchData.products || productoFetchData.resultados)) {
      //console.log(productoFetchData);
      setProductoData((productoFetchData.products ? productoFetchData.products : productoFetchData.resultados));
      setTotalItems(productoFetchData.totalItems); 
      setNoResult("");
    }
    else{
      if(error){
        if (error === "No se encontraron resultados"){
          setProductoData([]);
          setSuccess(true);
          setNoResult("No se encontraron resultados");
        }
        else{
          setSuccess(false);
          setErrMsg(error || "Error de consulta.");
        }
      }
    }
  }, [productoFetchData, currentPage, error, apiBase]);
  if (Array.isArray(categorias)) {
    categorias.sort((a, b) => {
      const nameA = a.name.toUpperCase(); // convert names to uppercase for case-insensitive comparison
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
  }
  const handleProveedorId = (event) => {
    setPoveedorId(event.target.value);
  }
  const handleMostrarTienda = (event) => {
    setMostrarTienda(event.target.value);
  }
  const navigate = useNavigate();
  const handleNewItem = () =>{
    navigate('create');
  }
  const handleDetails = (idCategory,modelo) =>{
    navigate('detail/'+idCategory+"/"+modelo);
  };   
  const handleDelete = async (idCategory,productId) =>{
    if(window.confirm("¿Deseas eliminar el registro?")){
      const urlGiven = categorias.find(item => item.id === idCategory);
      const APIDelete =  API+(urlGiven.url)+productId;
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
  const handleSearch = () => {
    //=======================Busqueda por frase =====================================
    if (frase.length > 0 && frase.length < 3) { 
      setErrorFrase(true); setMsgFrase("min:3 caracteres"); 
      return;
    } else { 
      setErrorFrase(false); setMsgFrase("SKU, Nombre, Marca, Tags"); 
    }    
    if (frase != "" || categoryId != "" || proveedorId != "" || mostrarTienda != ""){
      setPoveedorId2(proveedorId);
      setFrase2(frase);
      setMostrarTienda2(mostrarTienda);
      setCategoryId2(categoryId);
      setCurrentPage(1);
      setAdministrador(false);
      setApiBase(API+'buscador/');
    }
    if (frase == "" && categoryId == "" && proveedorId == "" && mostrarTienda == ""){ 
      setFrase2('');
      setCategoryId2('');
      setPoveedorId2('');
      setMostrarTienda2('');
      setAdministrador(true);
      setApiBase(API+'products/accesorios/');
    }
  }

  const handleEdit = (idCategory,modelo) =>{
    navigate('edit/'+idCategory+"/"+modelo);
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
   if (loading) {
    return <Typography>Loading...</Typography>;
  }
  if (!success && error) {
    return  (
          <Alert  severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg ? errMsg : "Error de consulta"}</Alert> 
      );
  }
  if (productoData == undefined) {
    /*<CircularProgress/>*/
    return <Typography>Loading...</Typography>; // or handle loading state appropriately
  }
  return (             
    <Box className = "adminContainer">
      <Box className= "admin-tableHeader" >
        <Typography className="admin-title" variant='h5'>Productos</Typography>
        <Box><Button className= "admin-newButton" variant="contained" onClick={handleNewItem}>+ Nuevo</Button></Box>
      </Box>
      <Box className= "admin-tableHeader" >
        <Box className= "find-properties-box" sx={{width:'100%'}}>
          <TextField
              error={errorFrase}
              sx={{width:'100%',maxWidth:'505px'}}
              id="frase" 
              label={msgFrase} 
              size="small"
              name="frase"
              autoComplete='off'
              value={frase}
              onChange={e=>setFrase(e.target.value)}
              inputProps={{maxLength:40 }}
          ></TextField> 
        </Box>
        <Box className= "find-properties-box">
          <FormControl className="InputSearch"  size="small">
            <InputLabel  id="ddl-categoria-label">Categoria </InputLabel>
            <Select  
              id="categoryId"
              name="categoryId"
              label="Categoria"
              value={categoryId}
              onChange={e=>setCategoryId(e.target.value)}
            >
              <MenuItem key="0" value="">Todas</MenuItem>
              {
              categorias && categorias !== undefined ?
              categorias.map((category,index) =>{
                return (
                  <MenuItem key={index} value={category.id}>{category.name}</MenuItem>
                )
              })
                : ""
              }
            </Select>
          </FormControl> 


          <FormControl             
            className="InputSearch"  
            size="small">
              <InputLabel  id="ddl-marca-label">Proveedor</InputLabel>
              <Select 
                  id="proveedorId"
                  name="proveedorId"
                  value={proveedorId}
                  label="ProveedorId"
                  onChange={handleProveedorId}
                  //MenuProps={{style: {zIndex: 2001}}}
              >
                <MenuItem key="0" value="">Todas</MenuItem>
                  {
                      proveedores && proveedores !== undefined ?
                      proveedores.map((proveedor,index) =>{
                          return (
                              <MenuItem key={index} value={proveedor.id}>{proveedor.nombre}</MenuItem>
                          )
                      })
                      : "No hay proveedores"
                  }
              </Select>
          </FormControl> 
          <FormControl className="InputSearch"  size="small">
            <InputLabel  id="ddl-categoria-label">Mostrar Tienda </InputLabel>
            <Select  
              id="mostrarTienda"
              name="mostrarTienda"
              label="Mostrar Tienda"
              value={mostrarTienda}
              onChange={handleMostrarTienda}
            >
              <MenuItem key="0" value="">Todas</MenuItem>
              <MenuItem key="1" value="true">Si</MenuItem>
              <MenuItem key="2" value="false">No</MenuItem>
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
      <TableContainer sx={{overflow:'auto'}}> {/*Esto es para que no se desborde en dispositivos pequeños*/}
        <Table size="small"  sx={{minWidth:'unset'}}  className='admin-crudTable'>
          <TableHead >
            <TableRow>
              <TableCell className='admin-tableHead' align="right">SKU</TableCell>
              <TableCell className='admin-tableHead' align="right">PROVEEDOR</TableCell>
              <TableCell className='admin-tableHead' align="right">CATEGORIA</TableCell>
              <TableCell className='admin-tableHead' align="right">NOMBRE</TableCell>
              <TableCell className='admin-tableHead admin-actionsCell' align="right">MARCA</TableCell>
              <TableCell className='admin-tableHead' align="right">PRECIO</TableCell>
              <TableCell className='admin-tableHead' align="right">STOCK</TableCell>
              <TableCell className='admin-tableHead'  align="right">ACCIONES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productoData.map((row) => (
              <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
              <TableCell align="right">{row.sku} </TableCell>
              <TableCell align="right">{row.proveedorId}</TableCell>
              <TableCell align="right">{row.Categoria}</TableCell>
              <TableCell align="right">{row.Nombre ? row.Nombre : row.nombre}</TableCell>
              <TableCell  className="admin-actionsCell" align="right">{row.marca}</TableCell>
              <TableCell align="right" sx={{ color: row.precioPromoTotal != null ? 'red' : 'inherit', whiteSpace: 'nowrap'  }}>
              $ {formatNumber(parseFloat(row.precioPromoTotal ?? row.precioTotal))}
              </TableCell>
              <TableCell  className="admin-actionsCell" align="right">{row.stock}</TableCell>
              <TableCell align="right">
                  <Box className="admin-actionButtons">
                    <IconButton className= "admin-deleteButton" onClick={() =>handleEdit(row.categoryId,row.Modelo)} size="small" variant="outlined" color="primary"><EditIcon/></IconButton>
                    <IconButton className= "admin-deleteButton" onClick={() =>handleDetails(row.categoryId,row.Modelo)} size="small" variant="outlined" color="primary"><DescriptionIcon/></IconButton>
                    <IconButton className= "admin-deleteButton" onClick={() =>handleDelete(row.categoryId,row.productId ? row.productId : row.id)} size="small" variant="outlined" color="error"><DeleteIcon/></IconButton>
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