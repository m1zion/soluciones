import { useState } from "react";
const API = 'localhost';//process.env.REACT_APP_API_URL;
const initialState = {  //
    //VARIABLES DE SESION
}
const useInitialState = () =>{  //Funcion para inicializar el estado
    console.log("Loading state...");
    const [state, setState] = useState(initialState);      
    return {
        state,
    }
}
export default useInitialState;