import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Configurador1 from '@pages/Configurador1';
import useInitialState from '@hooks/useInitialState';
import AppContext from '@context/AppContext';
import '@styles/global.css';
import Layout from '@containers/Layout';
const App = () => {
    const initialState = useInitialState();
    return (
        <AppContext.Provider value={initialState}>
            <BrowserRouter>
                <Routes>                        
                    <Route exact path="/" element={<Layout><Configurador1/></Layout>} />                             
                </Routes>
            </BrowserRouter>
        </AppContext.Provider>
    );
}
export default App;