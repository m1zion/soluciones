import React from "react";
import { Button, ButtonBase } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Typography } from "@mui/material";
const BotonAgregarDark = () => {
    return(
        <Button 
    sx={{
      border: '1.5px solid var(--logo-green-darker)',
      display: 'flex',
      justifyContent: 'center',
      fontWeight: '500',
      width: '100%',
      textTransform:'none',
      background:'var(--logo-green-darker)',
      color:'var(--white)',
      '&:hover': {
        /*boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',*/
        backgroundColor: 'var(--logo-green)',
      },
    }
    }>{<ShoppingCartOutlinedIcon/>}
    <Typography sx={{pl:'8px' }}>Agregar</Typography>
         
    </Button>
    );
}

export default BotonAgregarDark;