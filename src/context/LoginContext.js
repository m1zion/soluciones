import { createContext, useEffect, useState } from "react"
import React from "react";
const API = process.env.REACT_APP_API_URL;

export const LoginContext = createContext();

export const LoginProvider  = ({children}) => {
    const [count,setCount]= useState(1);
    const [userName,setUserName] = useState ('Invitado');
    const setLogin = async(payloadLogin) =>{
        //Aqui dependiendo si es cliente cargo los carritos, si no solo el token 
        if(payloadLogin.role != 'cliente'){
            /*setState({
                ...state, 
                user: payloadLogin.user,
                token: payloadLogin.token,
                role: payloadLogin.role,
                proveedorId: payloadLogin.proveedorId
            });
            // Store values in localStorage
            localStorage.setItem('authUser', payloadLogin.user);
            localStorage.setItem('authToken', payloadLogin.token);
            localStorage.setItem('payloadLogin', payloadLogin.role);*/
        }
        else{
            await fetchOrderData(payloadLogin);  //Caragar los datos de la compra
        }
    }
    const fetchOrderData = async (payloadLogin) => {
        try {
            console.log("Consultando los datos del carrito");
            // 1. Check if I have active orders of cart and configurador
            const APICart = `${API}ordenesUsuario/V2/get?offset=0&limit=1&status=activo&orderType=tienda`; 
            const APIConf = `${API}ordenesUsuario/V2/get?offset=0&limit=1&status=activo&orderType=configurador`; 
            const [cartResponse, confResponse] = await Promise.all([
                fetch(APICart, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${payloadLogin.token}`,
                        'Content-Type': 'application/json'
                    }
                }),
                fetch(APIConf, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${payloadLogin.token}`,
                        'Content-Type': 'application/json'
                    }
                })
            ]);            
            const cartData = await cartResponse.json();
            const confData = await confResponse.json();
            console.log(APICart);
            console.log(cartData);
            /*const cartOrderId = cartData.orders?.[0]?.id;
            const confOrderId = confData.orders?.[0]?.id;
            if (!cartOrderId && !confOrderId) {
                console.log("reseteamos el localStorage y el state");
                setDataCarrito([]);
                setDataConfigurador([]);
                resetLocalStorage();
                const updatedState = { ...state };
                updatedState.totalCompra = '';
                updatedState.confOrderId =  '';
                updatedState.cartOrderId =  '';
                updatedState.cart = [];
                updatedState.cartConf = [];
                updatedState.marcaC = [];
                updatedState.modeloC = [];
                updatedState.anioC = [];
                setState(updatedState); 
                return;
            }
            // 2. If I have any of them, then retrieve the full data 
            const [dataCart, dataConf] = await Promise.all([
                cartOrderId ? fetchFullData(cartOrderId, payloadLogin.token) : Promise.resolve({ items: [] }),
                confOrderId ? fetchFullData(confOrderId, payloadLogin.token) : Promise.resolve({ items: [] }),
            ]);           
            setDataCarrito(dataCart);
            setDataConfigurador(dataConf);    
            // 3. Revisamos que este finalizado el configurador
            const tieneAccesorioC = dataConf.items?.some(item => item.categoryIdConfigurador === '1');
            const configuratorCompleted = dataConf.terminaConfiguracion1 === 'si' || tieneAccesorioC || dataConf.tieneEcualizador === 'no';
            const finalTotalCart = calculateTotal(dataCart.items);
            const finalTotalConf = configuratorCompleted ? calculateTotal(dataConf.items) : 0;
            const montoTotal = finalTotalCart + finalTotalConf;
            handlematchOrdersTodas(dataConf, dataCart, montoTotal,cartOrderId,confOrderId,payloadLogin);*/
        } catch (error) {
            console.error('Error fetching order data:', error);
        }
    };

    return (
        <LoginContext.Provider value={{
            count,
            setLogin,
            userName,
            setUserName,
        }}>
            {children}
        </LoginContext.Provider>   
    )
}