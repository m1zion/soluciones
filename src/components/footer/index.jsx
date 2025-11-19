import React from 'react';
import './footer.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTiktok,faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';

import { Box, List, ListItem, Typography } from '@mui/material';
//import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Header() {
    return(
        <Box className="footer">
            <Box className="footer__addr">
                <Box>
                    <Typography className="footer__logo">Soluciones para tu auto</Typography>
                    <Typography variant="h6">Contacto</Typography>
                    <address>
                        <Box className='footer__addr_info'>
                        Ciudad de México 5566-10212 | Celaya 5566-10212 
                        </Box>
                        <a className="footer__btn" href="mailto:example@gmail.com">Correo</a>
                    </address>
                </Box>
                <Box>
                    <List className="social-icons">
                        <ListItem sx={{pl:'5px'}}><a className="facebook" href="https://www.facebook.com/247.mexico" target='blank'><FontAwesomeIcon icon={faFacebook} /></a></ListItem>
                        <ListItem sx={{pl:'5px'}}><a className="tiktok" href="https://www.tiktok.com/@247.mexico" target='blank'><FontAwesomeIcon icon={faTiktok} /></a></ListItem>
                        <ListItem sx={{pl:'5px'}}><a className="instagram" href="https://www.instagram.com/247.mexico/" target='blank'><FontAwesomeIcon icon={faInstagram} /></a></ListItem>  
                    </List>
                </Box>
            </Box>
            <Box className="legal">
                <Typography>&copy;Solucionesparatuauto. Derechos reservados. v1.1.6</Typography>
            </Box>
        </Box>
    )
}