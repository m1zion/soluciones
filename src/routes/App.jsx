import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Configurador1 from '@pages/Configurador/Configurador1';
import Configurador2 from '@pages/Configurador/Configurador2';
import Configurador3 from '@pages/Configurador/Configurador3';
import Configurador4 from '@pages/Configurador/Configurador4';
import CheckOutCart3_1 from '@pages/Configurador/CheckOutCart3_1';
import CheckOutCart from '@pages/Configurador/CheckOutCart';
import CheckOutCart4 from '@pages/Configurador/CheckOutCart4';
import Login from "../pages/Login";


import Dashboard from '@dashboard/Dashboard.js';


import useInitialState from '@hooks/useInitialState';
import AppContext from '@context/AppContext';
import '@styles/global.css';
import Layout from '@containers/Layout';
import LayoutAdmin from '@containersDashboard/LayoutAdmin';
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
                        <Route exact path="/configurador3" element={<Layout><Configurador3/></Layout>} />  
                        <Route exact path="/configurador4" element={<Layout><Configurador4/></Layout>} /> 
                        <Route exact path="/CheckOutCart3_1" element={<Layout><CheckOutCart3_1/></Layout>} /> 
                        <Route exact path="/CheckOutCart" element={<Layout><CheckOutCart/></Layout>} /> 
                        <Route exact path="/CheckOutCart4" element={<Layout><CheckOutCart4/></Layout>} /> 
                        <Route exact path="/login" element={<Layout><Login/></Layout>} />      
                        <Route exact path="/newAccount" element={<Layout><NewAccount/></Layout>} />   

                        <Route exact path="/Dashboard" element={<LayoutAdmin><Dashboard/></LayoutAdmin>}/>

                    </Routes>
                </BrowserRouter>
            </AppContext.Provider>
        
    );
}
export default App;