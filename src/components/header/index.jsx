import React, {useState} from 'react';
import { AppBar, Box, Container, Divider, IconButton, List, SwipeableDrawer, Toolbar} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuHeader from '@components/MenuHeader';
import MenuItemsBurger from "./MenuItemsBurger";
import { menuItems } from "../../menuItems";
import './header.scss';
import logo from '@logos/logo24_7.png';
import { NavLink } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
export default function Header() {
    const [open, setOpen] = useState(false);
    const menuItems2 = ['Accesorios','Estereos','Bocinas','Configurador','Soporte','Ajustes', 'Cerrar Sesión'];
    const handleElementClick = (parameter) => {
        if(parameter === 1){
            setOpen(false);
        }else{
            setOpen(true);
        }
    };
    return(
        <AppBar className="menuAppBar">
            <Container maxWidth="100%" className='navbar'>
                <Toolbar  sx={{justifyContent: "space-between",minHeight: "auto", height: "5rem"}}>                
                    <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                        <IconButton
                        onClick={() => setOpen(true)}>
                            <MenuIcon sx={{ color: 'white' }}/>
                        </IconButton>
                    </Box>
                    <NavLink to="/"><img src={logo} alt="logo" className="nav-logo"/></NavLink>            
                    <Container className='toolbarContainer'>
                        {/*<Searcher inputProduct={inputProduct} setInputProduct={setInputProduct}></Searcher>*/}
                    </Container> 
                    <MenuHeader/> 
                </Toolbar>
            </Container> 



        {/*ESTE ES EL MENU ORIGINAL, 
            Dropdown.jsx
            MenuItemsBurguer.jsx
        */}
        {/*
            <SwipeableDrawer 
            anchor='left' 
            open={open} 
            onOpen={()=> setOpen(true)}
            onClose={()=> setOpen(false)}
             sx={{
                minwidth: 50,
                '& .MuiDrawer-paper': {
                    backgroundColor:'var(--black247)',
                    minWidth: '200px',
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
                <List>
                    {menuItems.map((menu, index) => {
                        const depthLevel = 0;
                        return <MenuItemsBurger items={menu} key={index} depthLevel={depthLevel} onHandleElementClick={handleElementClick}/>;  
                    })}
                </List>
            </SwipeableDrawer> 
        */}  
        </AppBar>
    )
}