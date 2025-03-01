import { Button, ButtonGroup,TextField} from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import './NumProductos.scss'
function NumProductos(props) {
    //console.log(props.NumProductos);
    let numeroDeProductos;
    if(props.NumProductos>1){
        numeroDeProductos = props.NumProductos
    }
    else{
        numeroDeProductos = 1;
    }
    const numeroProductos = props.NumProductos;
    const [counter, setCounter] = useState(numeroDeProductos);

    let incrementCounter = () => setCounter(counter + 1);
    let decrementCounter = () => setCounter(counter - 1);
    //let setNumProductos = () => setCounter(2);
    if(counter<=0) {
        decrementCounter = () => setCounter(1);
    }

    return (
        <Box  className="numProductos">  
            <ButtonGroup size="small" aria-label="small outlined button group">
                <input type="button" onClick={decrementCounter} className="botonMas" value="-"/>
                <Box message={counter} className="NumItems">
                    <input className='NumProductosContador' type="number" id="contador" name="contador" value={counter} readOnly/>
                </Box> 
                <input  type="button" onClick={incrementCounter} className="botonMenos" value="+"/>
                {/*{counter}<Button onClick={incrementCounter} className="botonMenos">+</Button>*/}
            </ButtonGroup>

        </Box>
    );
}
export default NumProductos;
