import react, { createContext } from "react";
const ConfiguradorContext = createContext();
function ConfiguradorProvider({children}){
    const configuracionX =[
        {
            marca: '',
            modelo: '',
            anio: ''
        }
    ];
    const configuracionInicial =[];
    const {
        item: configuracion,
        saveItem: saveConfiguracion,
        loading,
        error} = useLocalStorage('configuracionAuto',configuracionInicial);

    const addConfiguracion = (text) => {
        const newTodos = [...configuracion];
        const id = todos.length > 0 ? todos[todos.length - 1].id + 1 : 1; // Incremental ID based on the last item's ID
        newTodos.push({
            id,
            text,
            completed: false,
        });
        saveTodos(newTodos);
    };
    return (
        <TodoContext.Provider value={{
            loading,
            error,
            addConfiguracion,
        }}> { /*Cualquier elemento que le enviemos tentra las propiedades del provider*/}
            {children} 
        </TodoContext.Provider>
    )


}
export {ConfiguradorContext,ConfiguradorProvider};
