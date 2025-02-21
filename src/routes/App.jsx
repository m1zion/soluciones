import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Configurador1 from '@pages/Configurador/Configurador1';
import Configurador2 from '@pages/Configurador/Configurador2';
import Login from "../pages/Login";
import useInitialState from '@hooks/useInitialState';
import AppContext from '@context/AppContext';
import '@styles/global.css';
import Layout from '@containers/Layout';
import NewAccount from "../pages/NewAccount";
//import { LoginProvider } from "../context/LoginContext";
//<LoginProvider>
//</LoginProvider>
const App = () => {
    const initialState = useInitialState();
    return (
   
            <AppContext.Provider value={initialState}>
                <BrowserRouter>
                    <Routes>                        
                        <Route exact path="/" element={<Layout><Configurador1/></Layout>} />  
                        <Route exact path="/configurador2" element={<Layout><Configurador2/></Layout>} />  
                        <Route exact path="/login" element={<Layout><Login/></Layout>} />      
                        <Route exact path="/newAccount" element={<Layout><NewAccount/></Layout>} />                            
                    </Routes>
                </BrowserRouter>
            </AppContext.Provider>
        
    );
}
export default App;