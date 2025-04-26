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
import ProductosAdm from '@dashboard/productos/ProductosAdm';
import ProductosAdmFiltros from '@dashboard/productos/ProductosAdmFiltros';
import ProductCreate from '@dashboard/productos/ProductCreate';
import ProductEdit from '@dashboard/productos/ProductEdit';
import ProductDetailAdmin from '@dashboard/productos/ProductDetail';

/*import ProveedoresAdm from '@dashboard/proveedores/ProveedoresAdm';
import ProveedorCreate from '@dashboard/proveedores/ProveedorCreate';
import ProveedorDetail from '@dashboard/proveedores/ProveedorDetail';
import ProveedorEdit from '@dashboard/proveedores/ProveedorEdit';*/
//import ProveedorMovimientoEdit from '@dashboard/proveedores/ProveedorMovimientoEdit';
//import ProveedorMovimientoCreate from '@dashboard/proveedores/ProveedorMovimientoCreate';

import UsuariosAdm from '@dashboard/usuarios/UsuariosAdm';
import UsuarioCreate from '@dashboard/usuarios/UsuarioCreate';
import UsuarioEdit from '@dashboard/usuarios/UsuarioEdit';

import ConfiguradorAdm from '@dashboard/configurador/ConfiguradorAdm';
import ConfiguradorCreate from '@dashboard/configurador/ConfiguradorCreate';
import ConfiguradorEdit from '@dashboard/configurador/ConfiguradorEdit';
import ConfiguradorDetail from '@dashboard/configurador/ConfiguradorDetail';
import ConfiguradorMarcasAdm from '@dashboard/configurador/ConfiguradorMarcasAdm';
import ConfiguradorModelosAdm from '@dashboard/configurador/ConfiguradorModelosAdm';

import useInitialState from '@hooks/useInitialState';
import AppContext from '@context/AppContext';
import '@styles/global.css';
import Layout from '@containers/Layout';
import LayoutAdmin from '@containersDashboard/LayoutAdmin';
import NewAccount from "../pages/NewAccount";

import ClientesAdm from '@dashboard/clientes/ClientesAdm';
import ClienteCreate from '@dashboard/clientes/ClienteCreate';
import ClienteDetail from '@dashboard/clientes/ClienteDetail';
import ClienteEdit from '@dashboard/clientes/ClienteEdit';
//import ClienteMovimientoEdit from '@dashboard/clientes/ClienteMovimientoEdit';
//import ClienteMovimientoCreate from '@dashboard/clientes/ClienteMovimientoCreate';


import VentasAdm from '@dashboard/ventas/VentasAdm';
import VentaCreate from '@dashboard/ventas/VentaCreate';
import VentaDetail from '@dashboard/ventas/VentaDetail';
import VentaEdit from '@dashboard/ventas/VentaEdit';
import VentaNota from '@dashboard/ventas/VentaNota';



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
                        <Route exact path="/Dashboard/Productos" element={<LayoutAdmin><ProductosAdm/></LayoutAdmin>} />
                        <Route exact path="/Dashboard/ProductosF" element={<LayoutAdmin><ProductosAdmFiltros/></LayoutAdmin>} />
                        <Route exact path="/Dashboard/Productos/create" element={<LayoutAdmin><ProductCreate/></LayoutAdmin>} />
                        <Route exact path="/Dashboard/Productos/edit/:idCategory/:modelo" element={<LayoutAdmin><ProductEdit/> </LayoutAdmin>} />
                        <Route exact path="/Dashboard/productos/detail/:idCategory/:modelo" element={<LayoutAdmin><ProductDetailAdmin/></LayoutAdmin>} />
                        
                        {/*<Route exact path="/Dashboard/Proveedores" element={<LayoutAdmin><ProveedoresAdm/></LayoutAdmin>} />
                        <Route exact path="/Dashboard/Proveedores/create" element={<LayoutAdmin><ProveedorCreate/></LayoutAdmin>} />
                        <Route exact path="/Dashboard/Proveedores/detail/:proveedor_id" element={<LayoutAdmin><ProveedorDetail/></LayoutAdmin>} />
                        <Route exact path="/Dashboard/Proveedores/edit/:proveedor_id" element={<LayoutAdmin><ProveedorEdit/></LayoutAdmin>} />
                        <Route exact path="/Dashboard/Proveedores/movimientoedit/:proveedorId/:proveedorMovimiento_id" element={<LayoutAdmin><ProveedorMovimientoEdit/></LayoutAdmin>} />
                        <Route exact path="/Dashboard/Proveedores/movimientocreate/:proveedorId/:tipo" element={<LayoutAdmin><ProveedorMovimientoCreate/></LayoutAdmin>} />*/}

                        <Route exact path="/Dashboard/Configurador" element={<LayoutAdmin><ConfiguradorAdm/></LayoutAdmin>} />
                        <Route exact path="/Dashboard/Configurador/create" element={<LayoutAdmin><ConfiguradorCreate/></LayoutAdmin>} />
                        <Route exact path="/Dashboard/Configurador/edit/:configurador_id" element={<LayoutAdmin><ConfiguradorEdit/></LayoutAdmin>} />
                        <Route exact path="/Dashboard/Configurador/detail/:configurador_id" element={<LayoutAdmin><ConfiguradorDetail/></LayoutAdmin>} />
                        <Route exact path="/Dashboard/ConfiguradorMarcas" element={<LayoutAdmin><ConfiguradorMarcasAdm/></LayoutAdmin>} />
                        <Route exact path="/Dashboard/ConfiguradorModelos" element={<LayoutAdmin><ConfiguradorModelosAdm/></LayoutAdmin>} />

                        <Route exact path="/Dashboard/Clientes" element={<LayoutAdmin><ClientesAdm/></LayoutAdmin>} />
                        <Route exact path="/Dashboard/Clientes/create" element={<LayoutAdmin><ClienteCreate/></LayoutAdmin>} />
                        <Route exact path="/Dashboard/Clientes/edit/:cliente_id" element={<LayoutAdmin><ClienteEdit/></LayoutAdmin>} />
                        {/*<Route exact path="/Dashboard/Clientes/movimientoedit/:clienteId/:clienteMovimiento_id" element={<LayoutAdmin><ClienteMovimientoEdit/></LayoutAdmin>} />*/}
                        <Route exact path="/Dashboard/Clientes/detail/:cliente_id" element={<LayoutAdmin><ClienteDetail/></LayoutAdmin>} />
                        {/*<Route exact path="/Dashboard/Clientes/movimientocreate/:clienteId/:tipo" element={<LayoutAdmin><ClienteMovimientoCreate/></LayoutAdmin>} />*/}

                        <Route exact path="/Dashboard/Usuarios" element={<LayoutAdmin><UsuariosAdm/></LayoutAdmin>} />
                        <Route exact path="/Dashboard/Usuarios/create" element={<LayoutAdmin><UsuarioCreate/></LayoutAdmin>} />
                        <Route exact path="/Dashboard/Usuarios/edit/:usuario_id" element={<LayoutAdmin><UsuarioEdit/></LayoutAdmin>} />
                       
                        <Route exact path="/Dashboard/Ventas" element={<LayoutAdmin><VentasAdm/></LayoutAdmin>} />
                        <Route exact path="/Dashboard/Ventas/create" element={<LayoutAdmin><VentaCreate/></LayoutAdmin>} />                        
                        <Route exact path="/Dashboard/Ventas/detail/:ordenVentaId" element={<LayoutAdmin><VentaDetail/></LayoutAdmin>} />
                        <Route exact path="/Dashboard/Ventas/ventaNota/:ordenVentaId" element={<VentaNota/>} /> 
                        <Route exact path="/Dashboard/Ventas/edit/:ordenVentaId" element={<LayoutAdmin><VentaEdit/></LayoutAdmin>} />
                        


                    </Routes>
                </BrowserRouter>
            </AppContext.Provider>
        
    );
}
export default App;