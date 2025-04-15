import React, { useContext} from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import './Menu.scss';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import AppContext from '@context/AppContext';
//import MyOrder from '@containers/MyOrder';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
const MenuHeaderAdmin = () => {
   //const {loginWithRedirect} = useAuth0();
   //const {logout} = useAuth0();
   //const {user, isAuthenticated} = useAuth0();
   const isAuthenticated = true;
   const navigate = useNavigate();
    const ITEM_HEIGHT = 48;
    /*--MENU*/
      const [anchorEl, setAnchorEl] = React.useState(null);
      const open = Boolean(anchorEl);
      const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
      const handleClose = () => {
        setAnchorEl(null);
      };
    /*MENU--*/
    /*--MENU ORDERS*/
      const [anchorOrder, setAnchorOrder] = React.useState(null);
      const openOrder = Boolean(anchorOrder);
      const handleClickOrder = (event) => {
        setAnchorOrder(event.currentTarget);
      };
      const handleCloseOrder = () => {
        setAnchorOrder(null);
      };
      const { state } = useContext(AppContext);
  return(
    <React.Fragment>
    <Box>  
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
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
        <Typography sx={{ width: '38px' }}><ExitToAppOutlinedIcon 
                  sx={{ 
                  color: 'white',
                  size: 'large'
                  }}/>
        </Typography>
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
    <MenuItem>
      <Avatar /> Mi Perfil
    </MenuItem>
    <MenuItem>
      <ListItemIcon>
        <Settings fontSize="small" />
      </ListItemIcon>
      Cuenta
    </MenuItem>
    <MenuItem>
      <ListItemIcon>
        <Logout fontSize="small" />
      </ListItemIcon>
      {
      /*  state.userName.length>= 1 
      () => navigate("/Login/")*/
      
      isAuthenticated 
      ? <Typography onClick={() => logout()}>Cerrar Sesion</Typography> 
      : <Typography onClick={() => loginWithRedirect()}>Iniciar Sesion</Typography>
      }
    </MenuItem>
  </Menu>
  <Menu
    /*disableScrollLock={true}*/
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
    {/* <MyOrder/>*/}
  </Menu>
  </React.Fragment>
  );
}
export default MenuHeaderAdmin;
