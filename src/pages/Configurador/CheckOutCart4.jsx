import React from "react";
import { Stack, Typography, Box } from "@mui/material";
import './CheckOutCart4.scss';
const CheckOutCart4 = () => {
	return (
		<Box className="CheckOutCart4">
            <Typography className="CheckOutCart4Title" variant="h5">Gracias por tu compra !!</Typography>
            <Typography className="CheckOutCart4Text" variant="body1">
            Tu pedido esta siendo procesado, recibiras un correo con los datos de tu compra y la informacion de envio
            </Typography>
            <Stack direction="row" sx={{mt:"1em"}}>
                <Typography className="CheckOutCart4Text2" variant="body1">No de Pedido: </Typography>
                <Typography className="CheckOutCart4Text3" variant="body1" sx={{pl:"1em"}}>123456</Typography>
            </Stack>
        </Box>
	);
}
export default CheckOutCart4;