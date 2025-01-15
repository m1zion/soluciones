import React, {useEffect, useState} from "react";
function useLocalStorage(itemName,initialValue) {  //Aqui agregamos al state y al localStorage
    //LocalStorage no acepta valores que no sean texto, por eso debemos de usar .parse y .stringify
    //Vemos si hay "todos" en el localstorage, si no le asignamos un valor vacio y hacemos el setItem con []
    const [item,setItem] = useState(initialValue);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(false); 
    useEffect(() =>
      {
        setTimeout(() => {
          try{
            const localStorageItem = localStorage.getItem(itemName);
            let parsedItem = (localStorageItem && JSON.parse(localStorageItem).length > 0) ? JSON.parse(localStorageItem) : initialValue;
            setItem(parsedItem);  //Guardamos en el state (revisar si esta en el codigo original del curso)
            localStorage.setItem(itemName,JSON.stringify(parsedItem));  //localStorage.removeItem('todos_v1');
            setLoading(false);
          }
          catch(error){
            setLoading(false);
            setError(true);
          }
        },1000) 
      },[]
    );
    const saveItem = (newItem) =>{  //Actualiza localstorage y state
      setItem(newItem); //State
      localStorage.setItem(itemName,JSON.stringify(newItem)); //LS
    }
    //Si tenemos mas de 2 returns es recomendable retornar un objeto
    //return [item,saveItem];
    return {
      item,
      saveItem,
      loading,
      error
    }
}
export {useLocalStorage};