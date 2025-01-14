// ¿Qué es react context?
// React context es una manera de acceder a un tipo de “variables globales” entre nuestros componentes de react. 
// Es decir, hay situaciones en las que quisieramos pasarles datos importantes a un componente de react, y a todos sus nodos hijos. 
// Sin embargo, usando props esta tarea es muy repetitiva y poco efectiva de mantener. 
// Incluso, existen ocasiones que le pasamos props a nodos obligadamente aunque nunca la necesiten. 
// Es aquí cuando entra en acción react context. Nosostros podemos acceder desde donde sea a una variables en nuestra aplicación. 
// E inlcuso podemos crear cuantos contexto queramos donde cada uno mantendra información necesaria.
 //1. Creamos el contexto que va a usar la API y lo exportamos para poder ser usado
 import React from 'react';
 const AppContext = React.createContext({}); 
 class Parent extends React.Component {
     setValue = (value) => {    
       this.setState({ value });
     }
     state = {
       setValue: this.setValue,
       value: localStorage.getItem("parentValueKey")
     }
     componentDidUpdate(prevProps, prevState) {
       if (this.state.value !== prevState.value) {
         // Whatever storage mechanism you end up deciding to use.
         localStorage.setItem("parentValueKey", this.state.value)
       }
     }
     render() {
       return (
         <MyContext.Provider value={this.state}>
           {this.props.children}
         </MyContext.Provider>
       )
     }
   }
 export default AppContext;
 