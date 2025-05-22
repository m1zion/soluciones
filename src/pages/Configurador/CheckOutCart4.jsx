import React, { useContext, useEffect } from "react";
import { Stack, Typography, Box } from "@mui/material";
import AppContext from '@context/AppContext';
import './CheckOutCart4.scss';
const CheckOutCart4 = () => {
    const { state,refreshState } = useContext(AppContext);
    useEffect(() => {
        refreshState();
    }, []);
	return (
		<Box className="CheckOutCart4">
            <Typography className="CheckOutCart4Title" variant="h5">Gracias por tu compra !!</Typography>
            <Typography className="CheckOutCart4Text" variant="body1">
            Tu pedido está siendo procesado, recibirás un correo con los datos de tu compra y la información de envío
            </Typography>
            <Stack direction="row" sx={{mt:"1em"}}>
                <Typography className="CheckOutCart4Text2" variant="body1">Núm. de Pedido: </Typography>
                <Typography className="CheckOutCart4Text3" variant="body1" sx={{pl:"1em"}}>{state.confOrderId}</Typography>
            </Stack>
        </Box>
	);
}
export default CheckOutCart4;