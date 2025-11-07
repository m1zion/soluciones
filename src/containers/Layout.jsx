import React from 'react';
import Header from '@components/header/';  //Header 2 en el original
import Footer from '@components/footer/';
import '@styles/Layout.scss';
import { Box } from '@mui/material';
//import Header2 from '@components/Header2';
//import Footer from '@components/Footer';
const Layout = ({ children }) => {  //Esto indica que puede contener un Hijo 
    return (
        <Box className='Layout'>
            <Header />
            <Box flex="1" display="flex" flexDirection="column">   {/*display="flex" flexDirection="column"*/}
                {children} {/* Main content expands to push footer down */}
            </Box>
            <Footer />
        </Box>
    );
}
export default Layout;