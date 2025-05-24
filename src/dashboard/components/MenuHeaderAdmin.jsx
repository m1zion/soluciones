import React, { useContext} from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Logout from '@mui/icons-material/Logout';
import './Menu.scss';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import AppContext from '@context/AppContext';
//import MyOrder from '@containers/MyOrder';
import { useNavigate } from 'react-router-dom';
import { ListItemButton, ListItemText } from '@mui/material';
const MenuHeaderAdmin = () => {
  const { state, logout } = useContext(AppContext);
  const isAuthenticated = true; 
  const handleLogout = () => {
    logout();
    window.location.href = '/';    // Redireccionar a la página de login después de cerrar sesión
  };   
  const data = [   
    {
      icon: <Avatar />,
      label: "Mi Perfil"
    },
    {
      icon: <Logout />,
      label: isAuthenticated
        ? 'Cerrar sesión'
        : 'Iniciar Sesión',
      onClick: isAuthenticated
        ? () => handleLogout()
        : () => navigate('/Login/'),
    },
  ];
  const navigate = useNavigate();
  //--MENU
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };   
  //--MENU ORDERS
  const [anchorOrder, setAnchorOrder] = React.useState(null);
  const openOrder = Boolean(anchorOrder);
  const handleCloseOrder = () => {
    setAnchorOrder(null);
  };
  return(
    <React.Fragment>
    <Box>  
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>       
        <IconButton
          onClick={handleClick}
          size="large"
          sx={{ ml: 0}}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}                 
        >
          <Typography className="navbar-email">
            {state.userName}
            </Typography>
            <AccountCircleOutlinedIcon 
              sx={{ 
              color: 'white',
              }}>
            </AccountCircleOutlinedIcon>
        </IconButton>
        <ExitToAppOutlinedIcon sx={{ color: 'white', size: 'large' }}/>
      </Box>
    </Box>
    <Menu
    anchorEl={anchorEl}
    id="account-menu"
    open={open}
    onClose={handleClose}
    onClick={handleClose}
    PaperProps={{
      elevation: 0,
      sx: {
        overflow: 'visible',
        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
        mt: 1.5,
        '& .MuiAvatar-root': {
          width: 32,
          height: 32,
          ml: -0.5,
          mr: 1,
        },
        '&:before': {
          content: '""',
          display: 'block',
          position: 'absolute',
          top: 0,
          right: 14,
          width: 10,
          height: 10,
          bgcolor: 'background.paper',
          transform: 'translateY(-50%) rotate(45deg)',
          zIndex: 0,
        },
      },
    }}
    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Box sx={{pb: 2}}> 
        {
          data.map((item) => (
          <ListItemButton
              onClick={item.onClick}
              key={item.label}
              sx={{ py: 0, minHeight: 32, pb: 2 }}
          >
              <ListItemIcon sx={{ color: 'inherit' }}>
              {item.icon}
              </ListItemIcon>
              <ListItemText
              primary={item.label}
              primaryTypographyProps={{ fontSize: 14, fontWeight: 'medium' }}
              />
          </ListItemButton>
        ))}      
      </Box>
    </Menu>    
  </React.Fragment>
  );
}
export default MenuHeaderAdmin;