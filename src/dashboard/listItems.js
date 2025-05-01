import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import SpeakerIcon from '@mui/icons-material/Speaker';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CategoryIcon from '@mui/icons-material/Category';
import ListIcon from '@mui/icons-material/List';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import EngineeringIcon from '@mui/icons-material/Engineering';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import DiscountIcon from '@mui/icons-material/Discount';
import PersonIcon from '@mui/icons-material/Person';
import './Administrador.scss';
import { Link } from 'react-router-dom';
const sections = {
  categorias: {text:"Categorias", icon: <CategoryIcon className='admin-dashboardIcon'/>, path: "../Dashboard/Categorias" },
  productos: { text: "Productos", icon: <SpeakerIcon className='admin-dashboardIcon'/>, path: "../Dashboard/Productos" },
  ventas: { text: "Ordenes de venta", icon: <ShoppingCartIcon className='admin-dashboardIcon'/>, path: "../Dashboard/Ventas" },
  clientes: { text: "Clientes", icon: <PeopleIcon className='admin-dashboardIcon'/>, path: "../Dashboard/Clientes" },
  usuarios: { text: "Usuarios", icon: <PersonIcon className='admin-dashboardIcon'/>, path: "../Dashboard/Usuarios" },
  configurador: { text: "Configurador", icon: <LayersIcon className='admin-dashboardIcon'/>, path: "../Dashboard/Configurador" }
};
// Your rolePermissions object from before
const rolePermissions = {
  admin: [
    sections.productos, sections.ventas, sections.clientes, sections.usuarios, sections.configurador
  ]
};


const mainListItems = (role) => {
  const allowedSections = rolePermissions[role] || [];
  return (
    <React.Fragment>
      {allowedSections.map((section) => (
        <Link to={section.path} key={section.text}>
          <ListItemButton className='admin-menuItems'>
            <ListItemIcon>{section.icon}</ListItemIcon>
            <ListItemText primary={section.text} />
          </ListItemButton>
        </Link>
      ))}
    </React.Fragment>
  );
};
export default mainListItems;
