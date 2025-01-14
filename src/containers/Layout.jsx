import React from 'react';
import Header from '@components/Header/';  //Header 2 en el original
import '@styles/Layout.scss';
import { Box } from '@mui/material';
//import Header2 from '@components/Header2';
//import Footer from '@components/Footer';
const Layout = ({ children }) => {  //Esto indica que puede contener un Hijo 
    return (
        <Box className='Layout'>
            <Header />
            {children}
            {/*<Footer />*/}
        </Box>
    );
}
export default Layout;