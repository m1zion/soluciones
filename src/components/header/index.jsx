import React, {useState} from 'react';
import { AppBar, Box, Container, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, SwipeableDrawer, Toolbar, Typography} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuHeader from '@components/MenuHeader';
import MenuItemsBurger from "./MenuItemsBurger";
import { menuItems } from "../../menuItems";
import './header.scss';
import logo from '@logos/logo24_7.png';
import { NavLink } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import SpeakerIcon from '@mui/icons-material/Speaker';
import SmartScreenIcon from '@mui/icons-material/SmartScreen';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SettingsInputCompositeIcon from '@mui/icons-material/SettingsInputComposite';
import SpeakerGroupIcon from '@mui/icons-material/SpeakerGroup';
import SecurityIcon from '@mui/icons-material/Security';
import YouTubeIcon from '@mui/icons-material/YouTube';

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
    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const DrawerList = (
        <Box className="menu_list_container" role="presentation" onClick={toggleDrawer(false)}>
            <List>               
                <ListItem disablePadding>
                    <ListItemButton>
                        <Typography>Nombre del usuario</Typography>
                    </ListItemButton>
                </ListItem>
                <Divider  sx={{mb:"2rem", mt:"1rem", backgroundColor:"var(--black247-light)"}}></Divider>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <SettingsIcon sx={{color:"var(--logo-green)"}}/>
                        </ListItemIcon>
                        <ListItemText sx={{color:"var(--logo-green)"}} primary="Configurador" />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <SmartScreenIcon sx={{color:"var(--almost-white)"}}/>
                        </ListItemIcon>
                        <ListItemText primary="Estereos" />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <SpeakerIcon sx={{color:"var(--almost-white)"}}/>
                        </ListItemIcon>
                        <ListItemText primary="Woofers" />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <VolumeUpIcon sx={{color:"var(--almost-white)"}}/>
                        </ListItemIcon>
                        <ListItemText primary="Bocinas" />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <SpeakerGroupIcon sx={{color:"var(--almost-white)"}}/>
                        </ListItemIcon>
                        <ListItemText primary="Cajones" />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <SecurityIcon sx={{color:"var(--almost-white)"}}/>
                        </ListItemIcon>
                        <ListItemText primary="Seguridad" />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <SettingsInputCompositeIcon sx={{color:"var(--almost-white)"}}/>
                        </ListItemIcon>
                        <ListItemText primary="Accesorios" />
                    </ListItemButton>
                </ListItem>
            </List>
            <Box>
                <Box className="social_container">          
                    <a href="https://www.facebook.com/" target='blank'> <FacebookIcon sx={{color:"var(--almost-white)"}}/></a>
                    <a href="https://www.instagram.com/" target='blank'> <InstagramIcon sx={{color:"var(--almost-white)"}}/></a>                        
                    <a href="https://www.youtube.com/" target='blank'> <YouTubeIcon sx={{color:"var(--almost-white)"}}/></a>                        
                    <a href="https://www.whatsapp.com/" target='blank'> <WhatsAppIcon sx={{color:"#25D366"}}/></a>                        
                </Box>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <LogoutIcon sx={{color:"var(--almost-white)"}}/>
                            </ListItemIcon>
                            <ListItemText primary="Cerrar sesión" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>        
        </Box>
    );



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


        <Drawer sx={{ "& .MuiDrawer-paper": { backgroundColor: "var(--black247)" } }} open={open} onClose={toggleDrawer(false)}>
            {DrawerList}
        </Drawer>
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