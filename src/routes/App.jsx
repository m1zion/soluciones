import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
const Configurador1 = React.lazy(() => import('@pages/Configurador/Configurador1'));
const Configurador2 = React.lazy(() => import('@pages/Configurador/Configurador2'));
const Configurador3 = React.lazy(() => import('@pages/Configurador/Configurador3'));
const Configurador4 = React.lazy(() => import('@pages/Configurador/Configurador4'));
const CheckOutCart3_1 = React.lazy(() => import('@pages/Configurador/CheckOutCart3_1'));
const CheckOutCart = React.lazy(() => import('@pages/Configurador/CheckOutCart'));
const CheckOutCart4 = React.lazy(() => import('@pages/Configurador/CheckOutCart4'));
const Login = React.lazy(() => import('../pages/Login'));

const Dashboard = React.lazy(() => import('@dashboard/Dashboard.js'));
const ProductosAdm = React.lazy(() => import('@dashboard/productos/ProductosAdm'));
const ProductosAdmFiltros = React.lazy(() => import('@dashboard/productos/ProductosAdmFiltros'));
const ProductCreate = React.lazy(() => import('@dashboard/productos/ProductCreate'));
const ProductEdit = React.lazy(() => import('@dashboard/productos/ProductEdit'));
const ProductDetailAdmin = React.lazy(() => import('@dashboard/productos/ProductDetail'));
const UsuariosAdm = React.lazy(() => import('@dashboard/usuarios/UsuariosAdm'));
const UsuarioCreate = React.lazy(() => import('@dashboard/usuarios/UsuarioCreate'));
const UsuarioEdit = React.lazy(() => import('@dashboard/usuarios/UsuarioEdit'));
const ConfiguradorAdm = React.lazy(() => import('@dashboard/configurador/ConfiguradorAdm'));

const ConfiguradorCreate = React.lazy(() => import('@dashboard/configurador/ConfiguradorCreate'));
const ConfiguradorEdit = React.lazy(() => import('@dashboard/configurador/ConfiguradorEdit'));
const ConfiguradorDetail = React.lazy(() => import('@dashboard/configurador/ConfiguradorDetail'));
const ConfiguradorMarcasAdm = React.lazy(() => import('@dashboard/configurador/ConfiguradorMarcasAdm'));
const ConfiguradorModelosAdm = React.lazy(() => import('@dashboard/configurador/ConfiguradorModelosAdm'));

import useInitialState from '@hooks/useInitialState';
import AppContext from '@context/AppContext';
import '@styles/global.css';
import Layout from '@containers/Layout';
import LayoutAdmin from '@containersDashboard/LayoutAdmin';
import NewAccount from '../pages/NewAccount';
import ForgotPassword from '../pages/ForgotPassword';
const Recovery = React.lazy(() => import('../pages/Recovery'));
const ClientesAdm = React.lazy(() => import('@dashboard/clientes/ClientesAdm'));
const ClienteCreate = React.lazy(() => import('@dashboard/clientes/ClienteCreate'));
const ClienteDetail = React.lazy(() => import('@dashboard/clientes/ClienteDetail'));
const ClienteEdit = React.lazy(() => import('@dashboard/clientes/ClienteEdit'));
const VentasAdm = React.lazy(() => import('@dashboard/ventas/VentasAdm'));
const VentaCreate = React.lazy(() => import('@dashboard/ventas/VentaCreate'));
const VentaDetail = React.lazy(() => import('@dashboard/ventas/VentaDetail'));
const VentaEdit = React.lazy(() => import('@dashboard/ventas/VentaEdit'));
const VentaNota = React.lazy(() => import('@dashboard/ventas/VentaNota'));
//import { LoginProvider } from "../context/LoginContext";
//<LoginProvider>
//</LoginProvider>
const App = () => {
    const initialState = useInitialState();
    return (
   
            <AppContext.Provider value={initialState}>
                <BrowserRouter>
                 <Suspense fallback={<div>Loading...</div>}>
                    <Routes>                        
                        <Route exact path="/" element={<Layout><Configurador1/></Layout>} />  
                        <Route exact path="/configurador2" element={<Layout><Configurador2/></Layout>} />  
                        <Route exact path="/configurador3" element={<Layout><Configurador3/></Layout>} />  
                        <Route exact path="/configurador4" element={<Layout><Configurador4/></Layout>} /> 
                        <Route exact path="/CheckOutCart3_1" element={<Layout><CheckOutCart3_1/></Layout>} /> 
                        <Route exact path="/CheckOutCart" element={<Layout><CheckOutCart/></Layout>} /> 
                        <Route exact path="/CheckOutCart4/:order_id" element={<Layout><CheckOutCart4/></Layout>} /> 
                        <Route exact path="/login" element={<Layout><Login/></Layout>} />      
                        <Route exact path="/newAccount" element={<Layout><NewAccount/></Layout>} />   
                        <Route exact path="/ForgotPassword" element={<Layout><ForgotPassword/></Layout>} />   
                        <Route exact path="/Recovery" element={<Layout><Recovery/></Layout>} />   

                        <Route exact path="/Dashboard" element={<LayoutAdmin><Dashboard/></LayoutAdmin>}/>
                        <Route exact path="/Dashboard/Productos" element={<LayoutAdmin><ProductosAdm/></LayoutAdmin>} />
                        <Route exact path="/Dashboard/ProductosF" element={<LayoutAdmin><ProductosAdmFiltros/></LayoutAdmin>} />
                        <Route exact path="/Dashboard/Productos/create" element={<LayoutAdmin><ProductCreate/></LayoutAdmin>} />
                        <Route exact path="/Dashboard/Productos/edit/:idCategory/:modelo" element={<LayoutAdmin><ProductEdit/> </LayoutAdmin>} />
                        <Route exact path="/Dashboard/productos/detail/:idCategory/:modelo" element={<LayoutAdmin><ProductDetailAdmin/></LayoutAdmin>} />
                        
                        {/*<Route exact path="/Dashboard/Proveedores" element={<LayoutAdmin><ProveedoresAdm/></LayoutAdmin>} />*/}

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
                    </Suspense>
                </BrowserRouter>
            </AppContext.Provider>        
    );
}
export default App;