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
//import { LoginContext } from '../../context/LoginContext';
import { Avatar, createTheme, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Paper, styled, ThemeProvider } from '@mui/material';
import { ArrowRight, Dns, Home, KeyboardArrowDown, People, PermMedia, Public, Settings } from '@mui/icons-material';
var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'MXN',
});




const FireNav = styled(List)({
    right:1,
    '& .MuiListItemButton-root': {
      paddingLeft: 24,
      paddingRight: 24,
    },
    '& .MuiListItemIcon-root': {
      minWidth: 0,
      marginRight: 16,
    },
    '& .MuiSvgIcon-root': {
      fontSize: 20,
    },
  });
const MenuHeader = () => {
    //const loginContext = useContext(LoginContext);
    const { state, logout } = useContext(AppContext);
    const isAuthenticated = state.token ? true : false;
    //console.log(state.token);
    const navigate = useNavigate();
    const handleLogout = () => {
        console.log("loging out");
        logout();
        // Redireccionar a la página de login después de cerrar sesión
        window.location.href = '/';
    };
    const data = [
        /*{ icon: <People />, label: 'Mi perfil' },
        { icon: <Dns />, label: 'Mis Ordenes' },    */
        {
            icon: <PermMedia />,
            label: isAuthenticated
                ? 'Cerrar sesión'
                : 'Iniciar sesión',
            onClick: isAuthenticated
                ? () => handleLogout()
                : () => navigate('/Login/'),
        },
    ];

    /*--MENU*/
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
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
    const handleDirecciones = () => {
    navigate("/addresses");
    };
    const [open2, setOpen2] = React.useState(true);
  return(
    <Box
    sx={{
        margin: '1px solid white'
    }}>
        <Box>  
            <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                <Typography className='totalCompra'>{formatter.format(state.totalCompra)}</Typography>
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
                            {state.userName}
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
                                ((state.cartConf && state.cartConf.length > 0) || (state.cart && state.cart.length> 0)) ? 
                                (<Typography component={'span'} className='itemNumber'>
                                    {state.cart.length + state.cartConf.length}
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
        className='custom-menu'     
        paperprops={{
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
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
                },
            },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <ThemeProvider
                theme={createTheme({
                components: {
                    MuiListItemButton: {
                        defaultProps: {
                            disableTouchRipple: true,
                        },
                    },
                },
                palette: {
                    mode: 'dark',
                    primary: { main: '#4E5102' },
                    background: { paper: 'rgb(53, 54,44)' },
                },
                })}
            >
            <Paper elevation={0} sx={{ 
                maxWidth: 256}}>
                <FireNav component="nav">
                    <ListItemButton component="a" href="#customized-list">               
                    <ListItemText
                        sx={{ my: 0 }}
                        primary={state.userName ? state.userName: "Invitado"}
                        primaryTypographyProps={{
                        fontSize: 20,
                        fontWeight: 'medium',
                        letterSpacing: 0,
                        }}
                    />                    
                    </ListItemButton>
                    <Divider />
                    <Box
                    sx={[
                        open2
                        ? {
                            bgcolor: 'rgba(71, 98, 130, 0.2)',
                            }
                        : {
                            bgcolor: null,
                            },
                        open2
                        ? {
                            pb: 2,
                            }
                        : {
                            pb: 0,
                            },
                    ]}
                    >
                    {/*<ListItemButton
                        alignItems="flex-start"
                        onClick={() => setOpen2(!open2)}
                        sx={[{px: 3, pt: 2.5,},
                            open2
                                ? {pb: 0,}: {pb: 2.5,},
                            open2
                                ? {'&:hover, &:focus': {'& svg': {opacity: 1,},},}
                                : {'&:hover, &:focus': {'& svg': {opacity: 0,},},},
                        ]}
                    >                  
                    </ListItemButton>*/}
                    {
                        data.map((item) => (
                        <ListItemButton
                            onClick={item.onClick}
                            key={item.label}
                            sx={{ py: 0, minHeight: 32, color: 'rgba(255,255,255,.8)' }}
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
                </FireNav>
            </Paper>
            </ThemeProvider>
        </Menu>
        {/*<Menu
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
        </Menu>*/}
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
  </Box>
  );
}
export default MenuHeader;