import React, {useContext} from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import SpeakerIcon from '@mui/icons-material/Speaker';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CategoryIcon from '@mui/icons-material/Category';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import LayersIcon from '@mui/icons-material/Layers';
import EngineeringIcon from '@mui/icons-material/Engineering';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import DiscountIcon from '@mui/icons-material/Discount';
import ListIcon from '@mui/icons-material/List';
import { Link } from 'react-router-dom';
import { AddShoppingCart } from '@mui/icons-material';
import AppContext from '@context/AppContext';

export default function Dashboard() {
  const { state } = useContext(AppContext);
  const sections = {
    ofertas:{
      link: "../Dashboard/Ofertas",
      title: "Ofertas",
      icon: <DiscountIcon className='admin-dashboardIcon-lg'/>
    },
    categorias:{
      link: "../Dashboard/Categorias",
      title: "Categorias",
      icon: <CategoryIcon className='admin-dashboardIcon-lg'/>
    },
    productos: {
      link: "../Dashboard/Productos",
      title: "Productos",
      icon: <SpeakerIcon className='admin-dashboardIcon-lg'/>
    },
    ventas: {
      link: "../Dashboard/Ventas",
      title: "Ordenes de venta",
      icon: <ShoppingCartIcon className='admin-dashboardIcon-lg'/>
    },
    clientes: {
      link: "../Dashboard/Clientes",
      title: "Clientes",
      icon: <PeopleIcon className='admin-dashboardIcon-lg'/>
    },
    usuarios: {
      link: "../Dashboard/Usuarios",
      title: "Usuarios",
      icon: <PersonIcon className='admin-dashboardIcon-lg'/>
    },
    configurador: {
      link: "../Dashboard/Configurador",
      title: "Configurador",
      icon: <LayersIcon className='admin-dashboardIcon-lg'/>
    }
  };
  
  // Role-based permissions
  const rolePermissions = {
    diseño: [sections.ofertas],
    almacen: [sections.productos],
    ventas: [sections.ventas],
    contabilidad: [
      sections.ventas, sections.clientes
    ],
    admin: [
      sections.productos,
      sections.ventas, 
      sections.clientes, sections.usuarios, sections.configurador
    ],
  };
  

  return (
    <Box className="adminContainer" sx={{ backgroundColor: '#f5f5f5' }}>
      <Box className="admin-tableHeader" sx={{ backgroundColor: 'white' }}>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Administrador
        </Typography>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, height: '100vh', overflow: 'auto' }}>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {rolePermissions[state.role]?.map(({ link, title, icon }, index) => (
              <Grid item xs={12} md={4} lg={3} key={index}>
                <Link to={link}>
                  <Paper className='admin-paper-sections'>
                    <Typography variant='h6' className='admin-dashboardIcon-title'>{title}</Typography>
                    {icon}
                  </Paper>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}