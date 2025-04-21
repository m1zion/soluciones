import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box, Container, MenuItem, Select, InputLabel, FormControl, TableContainer, Hidden, Typography } from "@mui/material";
import '@styles/AddressForm.scss';
import React, { useEffect, useRef, useState } from 'react';
import useGet from '@hooks/useGet';
import '../Administrador.scss';
const API = process.env.REACT_APP_API_URL;
const APICATEGORIAS = API+'categories/?offset=0&limit=100';
export default function ProductosAdm() {
  const categoriasGet = useGet(APICATEGORIAS);
  const categorias = categoriasGet.products;
  const [categoryId, setCategoryId] = useState('');
  const [proveedorId, setPoveedorId] = useState('');
  const [mostrarTienda,setMostrarTienda] = useState('');
  const form = useRef(null);
  useEffect(() => {
    const filteredMenuData = menuDataOriginal.filter((item) => {
      if(categoryId != '0' && categoryId != ''){
        if(proveedorId != '0' && proveedorId != ''){
          if(mostrarTienda != '0' && mostrarTienda != ''){
            return item.categoryId === categoryId && item.proveedorId === proveedorId && item.mostrarTienda === mostrarTienda;
          }
          else{
            return item.categoryId === categoryId && item.proveedorId === proveedorId;
          }
        }
        else{
          return item.categoryId === categoryId;
        }
      }
      else{
        //En este segundo ciclo se deben de incluir los dos faltantes
        if (proveedorId !== '0' && proveedorId !== '') {
          if (mostrarTienda !== '0' && mostrarTienda !== '') {
            return item.proveedorId === proveedorId && item.mostrarTienda === mostrarTienda;
          } else {
            return item.proveedorId === proveedorId;
          }
        } else {
          if (mostrarTienda !== '0' && mostrarTienda !== '') {
            return item.mostrarTienda === mostrarTienda;
          } else {
            return(menuDataOriginal);  // Include all items
          }
        }
      }
    });
    menuDataChange(filteredMenuData);
  }, [categoryId,proveedorId,mostrarTienda]);

  const handleCategoryId = (event) => {
    setCategoryId(event.target.value);
    /*if (event.target.value !== '' && event.target.value != '0') {
      const filteredMenuData = menuDataOriginal.filter((item) => {
        if(proveedorId != '0' && proveedorId != ''){
          return item.categoryId === event.target.value && item.proveedorId === proveedorId;
        }
        else{
          return item.categoryId === event.target.value
        }
      });
      menuDataChange(filteredMenuData);
    } else {
      // If categoryId is empty, show all menuData
      menuDataChange(menuDataOriginal);
    }*/
  };
  const handleProveedorId = (event) => {
    setPoveedorId(event.target.value);
    /*if (event.target.value !== '' && event.target.value !== '0') {
      const filteredMenuData = menuDataOriginal.filter((item) => {
        if(categoryId != '0' && categoryId != ''){
          return item.categoryId === categoryId && item.proveedorId === event.target.value;
        }
        else {
          return item.proveedorId === event.target.value;
        }
        
      });
      menuDataChange(filteredMenuData);
    } else {
      menuDataChange(menuDataOriginal);
    }*/
  }

  const handleMostrarTienda = (event) => {
    setMostrarTienda(event.target.value);
  }
  const[menuDataOriginal,menuDataChangeOriginal] = useState([]);
  const[menuData,menuDataChange] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3001/productosItems").then((res) => {
        return res.json();
    }).then((resp) => {
        //console.log(resp);
        menuDataChangeOriginal(resp);
        menuDataChange(resp);
    }).catch((err) => {
        console.log(err.message);
    })
  }, []);

  return (  
    <Box className = "adminContainer">     
      <Box 
        className= "admin-tableHeader" 
        component="form"
        autoComplete="off"
        ref={form}
        noValidate
      >
        <FormControl className="InputSearch"  size="small">
          <InputLabel  id="ddl-categoria-label">Categoria </InputLabel>
          <Select  
            id="categoryId"
            name="categoryId"
            label="Categoria"
            value={categoryId}
            onChange={handleCategoryId}
          >
            <MenuItem key="0" value="0">Todas</MenuItem>
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
        <FormControl className="InputSearch"  size="small">
          <InputLabel  id="ddl-proveedorId-label">Proveedor</InputLabel>
          <Select  
            id="proveedorId"
            name="proveedorId"
            label="Proveedor"
            value={proveedorId}
            onChange={handleProveedorId}
          >
            <MenuItem key="0" value="0">Todas</MenuItem>
            <MenuItem key="1" value="1">1</MenuItem>
            <MenuItem key="2" value="2">2</MenuItem>
            <MenuItem key="3" value="3">3</MenuItem>
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
            <MenuItem key="0" value="0">Todas</MenuItem>
            <MenuItem key="1" value="1">Si</MenuItem>
            <MenuItem key="2" value="2">No</MenuItem>
          </Select>
        </FormControl>
      </Box>      
      {/*<Box sx={{backgroundColor:'lightcoral',width:'550px', overflow:'auto'}}>
        <Typography>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis iure dolor ab nostrum fuga? Voluptatum deserunt quia blanditiis impedit ex architecto, omnis dolore quisquam unde harum repellat corporis doloribus earum.</Typography>
          </Box>*/}
    <TableContainer sx={{overflow:'auto'}}>
      <Table size="small" sx={{minWidth:'unset'}} className='admin-crudTable'>
        <TableHead >
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>PROVEEDOR</TableCell>
            <TableCell>NOMBRE</TableCell>
            <Hidden smDown>
              <TableCell>CATEGORY</TableCell>
            </Hidden>
            <TableCell>MOSTRAR</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {menuData.map((row) => (
            <TableRow
            key={row.id}           
            >
            <TableCell component="th" scope="row">{row.id}</TableCell>
            <TableCell>{row.proveedorId}</TableCell>
            <TableCell>{row.nombre}</TableCell>
            <Hidden smDown>
                <TableCell>{row.categoryId}</TableCell>
              </Hidden>
            <TableCell>{row.mostrarTienda ? 'Si' : 'No' }</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </TableContainer>  
    </Box> 
  );
}
