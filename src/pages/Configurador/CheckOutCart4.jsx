import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Stack, Typography, Box } from "@mui/material";
import AppContext from '@context/AppContext';
import './CheckOutCart4.scss';
const CheckOutCart4 = () => {
    const { state,refreshState } = useContext(AppContext);
    useEffect(() => {
        refreshState();
    }, []);
    const{order_id} = useParams();
	return (
		<Box className="CheckOutCart4">
            <Typography className="CheckOutCart4Title" variant="h5">Gracias por tu compra !!</Typography>
            <Typography className="CheckOutCart4Text" variant="body1">
            Tu pedido está siendo procesado, recibirás un correo con los datos de tu compra y la información de envío
            </Typography>
            <Box sx={{display:"flex",mt:"1rem",alignItems:"baseline"}}>
                <Typography className="CheckOutCart4Text2" variant="body1">Núm. de Pedido: </Typography>
                <Typography className="CheckOutCart4Text3" variant="h6" sx={{pl:".5rem"}}>{order_id}</Typography>
            </Box>
        </Box>
	);
}
export default CheckOutCart4;