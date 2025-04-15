import React, { useState, useContext } from 'react';
import { AppBar,Divider,IconButton,SwipeableDrawer,Toolbar,List} from '@mui/material';
import '../../styles/_vars.css';
import './Header.scss';
import './DDMenu.scss';
import { Box, Container } from '@mui/system';
import logo from '@logos/logo24_7.png';
import MenuHeaderAdmin from '@componentsDashboard/MenuHeaderAdmin';
import { NavLink } from "react-router-dom"; 
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import mainListItems from '@dashboard/listItems';
import AppContext from '@context/AppContext';
export default function HeaderAdmin() { 
    const { state } = useContext(AppContext);
    const [open, setOpen] = useState(false);
    const handleElementClick = (parameter) => {
        if(parameter === 1){
            setOpen(false);
        }else{
            setOpen(true);
        }
    };
    return(
        <AppBar position='sticky'  sx={{backgroundColor:"var(--black247)"}}>
            {/*MENU PARA DISPOSITIVOS GRANDES*/}
            <Container  maxWidth='false' className='navbar'>
                <Toolbar disableGutters sx={{justifyContent: "space-between"}}>  
                    {/*ICONO DE HAMBURGUESA*/}
                    <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                        <IconButton
                        onClick={() => setOpen(true)}>
                            <MenuIcon sx={{ color: 'white' }}/>
                        </IconButton>
                    </Box>      
                    <NavLink to="/Dashboard"><img src={logo} alt="logo" className="nav-logo"/></NavLink>               
                    <MenuHeaderAdmin/> 
                </Toolbar>                 
            </Container>   
            <SwipeableDrawer 
            anchor='left' 
            open={open} 
            onOpen={()=> setOpen(true)}
            onClose={()=> setOpen(false)}
             sx={{
                width: 50,
                '& .MuiDrawer-paper': {
                    backgroundColor:'var(--admin5)',
                  },
            }}
            >
                <Box>
                    <IconButton onClick={() => setOpen(false)}>
                        <ChevronLeftIcon
                            sx={{
                                color: 'white'
                            }}
                        />
                    </IconButton>
                </Box>
                <Divider/>
                <List sx={{color:'white', backgroundColor:'var(--admin5)'}}>
                    {mainListItems(state.role)}
                      <Divider sx={{ my: 1 }} />
                </List>
            </SwipeableDrawer>
        </AppBar>
    )
}