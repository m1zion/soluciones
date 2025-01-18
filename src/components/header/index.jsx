import React from 'react';
import { AppBar, Box, Container, IconButton, Toolbar} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuHeader from '@components/MenuHeader';
import './header.scss';
import logo from '@logos/logo24_7.png';
import { NavLink } from 'react-router-dom';
export default function Header() {
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
              
        </AppBar>
    )
}