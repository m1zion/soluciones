import React, { useContext } from 'react';
import { styled} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import mainListItems from '@dashboard/listItems';
import HeaderAdmin from '@componentsDashboard/HeaderAdmin';
import AppContext from '@context/AppContext';
const drawerWidth = 240;

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      backgroundColor:' var(--admin5)',
      color:'aliceblue',
      zIndex: 0,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const LayoutAdmin = ({ children }) => {  
    const [open, setOpen] = React.useState(true);  
    const { state } = useContext(AppContext);
    const toggleDrawer = () => {
      setOpen(!open);
    };
    return (
        <Box className="BoxLayoutAdmin">
          <HeaderAdmin/>
          <Box className="admin-mainLayoutContainer"> {/*z-index = 0*/}
            <CssBaseline /> 
              <Drawer className="admin-drawer" variant="permanent" open={open}>
              <Toolbar
                sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                px: [1],                       
                }}
              >
                <IconButton 
                sx={{...(!open && { display: 'none' }),}}
                onClick={toggleDrawer}>
                  <ChevronLeftIcon sx={{color:'white'}}/>
                </IconButton>
                <IconButton 
                sx={{...(open && { display: 'none' }),}}
                onClick={toggleDrawer}>
                  <ChevronRightIcon sx={{color:'white'}}/>
                </IconButton>
              </Toolbar>
              <Divider/>
              <List >
                  {mainListItems(state.role)}
                  <Divider sx={{ my: 1 }} />
              </List>
            </Drawer>
            <Box
              component="main"
              className='admin-mainContainer'
              sx={{
                  backgroundColor: (theme) =>
                  theme.palette.mode === 'light'
                      ? theme.palette.grey[100]
                      : theme.palette.grey[900],
              }}
            >
              {/*<Toolbar /> */}
              <Container maxWidth="lg" className="admin-gridContainer" sx={{ mt: 4, mb: 4}}>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column'}}>
                    {children}
                  </Paper>
                </Grid>
              </Container>
            </Box>
          </Box>
        </Box>
    );
}
export default LayoutAdmin;
