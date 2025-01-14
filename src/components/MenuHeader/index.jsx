import React, { useState, useContext, useEffect } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Logout from '@mui/icons-material/Logout';
//import '@styles/Menu.scss';
import './MenuHeader.scss';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { useNavigate } from 'react-router-dom';
import AppContext from '@context/AppContext';
import { Avatar, ListItemIcon, Menu, MenuItem } from '@mui/material';
var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'MXN',
});
const MenuHeader = () => {
    const { state, logout } = useContext(AppContext);
    const isAuthenticated = state.token ? true : false;
    const navigate = useNavigate();
    /*--MENU*/
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    /*--MENU ORDERS*/
    const [anchorOrder, setAnchorOrder] = React.useState(null);
    const openOrder = Boolean(anchorOrder);
    const handleClickOrder = (event) => {
      setAnchorOrder(event.currentTarget);
    }; 
    const handleCloseOrder = () => {
        setAnchorOrder(null);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleDirecciones = () => {
    navigate("/addresses");
    };
  
  return(
    <React.Fragment>
        <Box>  
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Typography className='totalCompra'>{formatter.format(15)}</Typography>{/*state.totalCompra*/}
                <Tooltip title="Account settings">
                    <IconButton
                        onClick={handleClick}
                        size="large"
                        sx={{ ml: 0}}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}                 
                    >
                        <Typography className="navbar-email">
                        Nombre Usuario{/*state.userName*/}
                        </Typography>
                        <AccountCircleOutlinedIcon 
                            sx={{ 
                            color: 'white',
                            }}>
                        </AccountCircleOutlinedIcon>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Mi orden" >
                    <IconButton
                        onClick={handleClickOrder}
                        size="large"
                        sx={{ ml: 0}}
                        aria-controls={openOrder ? 'order-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openOrder ? 'true' : undefined}                 
                    >
                        <Typography sx={{ width : '38px',lineHeight:'0', position: 'relative'}}>
                            <ShoppingCartOutlinedIcon sx={{ color: 'white', position: 'relative' }}></ShoppingCartOutlinedIcon> 
                            {
                                state.cart && state.cart.length> 0 ? 
                                (<Typography component={'span'} className='itemNumber'>
                                    {state.cart.length}
                                </Typography>  
                                ) : null
                            }
                        </Typography>
                    </IconButton>
                </Tooltip>      
            </Box>
        </Box>
        {/*===============MENU DEL CLICK=================*/}
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
            <MenuItem>
                <Avatar /> Mi Perfil
            </MenuItem>
            <MenuItem onClick={handleDirecciones}>
                Mis direcciones               
            </MenuItem>
            <MenuItem>
                <ListItemIcon>
                    <Logout fontSize="small" />
                </ListItemIcon>
                {      
                isAuthenticated 
                ? <Typography onClick={() => handleLogout()}>Cerrar Sesion</Typography> 
                : <Typography onClick={() => navigate("/Login/")}>Iniciar Sesion</Typography>
                }
            </MenuItem>
        </Menu>
        {/*===============RESUMEN DE LA ORDEN=================*/}
        <Menu
        sx={{marginLeft:0,
        position: 'fixed',
        top:'30px',}}
        anchorEl={anchorOrder}
        id="order-menu"
        open={openOrder}
        onClose={handleCloseOrder}
        onClick={handleCloseOrder}
        PaperProps={{
        sx: {
            maxHeight: '100%',
            width:{xs: '100%', sm: 'auto'}, 
            overflow: '-moz-hidden-unscrollable',
            //overflow: 'visible',
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
        elevation: 0,
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            {/*<MyOrder/>*/}
        </Menu>
  </React.Fragment>
  );
}
export default MenuHeader;