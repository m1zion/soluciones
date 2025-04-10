import React , {useContext, useRef, useState , useEffect}from "react";
import { Stack,RadioGroup, FormControl,FormControlLabel,FormGroup, Radio, Typography, Button, Box, Checkbox} from "@mui/material";
import ProductCart from "./containers/ProductCart";
import './CheckOutCart2.scss';
import ProductCartConf from "./containers/ProductCartConf";
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import usePut2V from '@hooks/usePut2V';
import {Elements, CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';  
import './CheckOutCart3.scss';
import AppContext from '@context/AppContext';
import axios from'axios';
//import AddressCardDeliveryDefault from "@components/AddressCardDeliveryDefault";
import Alert from '@mui/material/Alert';
import { EnhancedEncryptionTwoTone, SecurityUpdateOutlined } from "@mui/icons-material";
const stripe_pk = process.env.REACT_APP_PUBLIC_KEY;
const stripePromise = loadStripe(stripe_pk,{
    locale: 'es'
})
var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'MXN',
});
const API = process.env.REACT_APP_API_URL;
const APICATEGORIAS = API+'categories/?offset=0&limit=100';
//==================================================================Checkout form=======
const Checkoutform = ({monto,tieneDireccion}) => { 
  const [categorias,setCategorias] = useState('');
  const { state } = useContext(AppContext);
  const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
          fontSize: '16px',
          color: '#32325d',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: 'antialiased',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: 'green',
          iconColor: '#fa755a',
        },
    },
    hidePostalCode: true,
  };
  const amount = (monto > 0) ? "$" + monto : "";
  const stripe = useStripe();
  const elements = useElements();
  const[loading,setLoading] = useState(false);
  const [installmentsEnabled, setInstallmentsEnabled] = useState(false);
  const [installmentPlan, setInstallmentPlan] = useState(3);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
   //========================CONSULTAMOS LAS CATEGORIAS===========================================
   useEffect(() => {// no usamos un hook para evitar multiples peticiones a la API
    const fetchData = async () => {
        try {
            const categoriasFetchData = await fetch(APICATEGORIAS);
            if (!categoriasFetchData.ok) {
                throw new Error('Failed to fetch categorias');
            }
            const jsonCategorias = await categoriasFetchData.json();
            setCategorias(jsonCategorias.products);
        } catch (error) {
            console.error("Error al consultar Categorias");
        }          
    };
    fetchData();
    }, []); // Empty dependency array ensures this effect runs only once  
  /****************************************************** */
  //Revisar que tenga meses sin intereses lo checamos cuando el event.complete = true 
  const [installmentsAvailable, setInstallmentsAvailable] = useState(false);
  const handleCardNumberChange = (event) => {
    const card = elements.getElement('card'); 
  }
  /****************************************************** */
  //En esta funcion registramos primero el client secret y posteriormente hacemos el payment intent y por ultimo la confirmacion  ----------
  //const handleFormSubmit = async ev => {} //Revisar la copia
  //En esta funcion hacemos el payment Intent directamente, esta es la que funciona con los meses sin intereses
  const handleSubmit = async (e) => {
    //PENDIENTES:
    //3. Se tiene que insertart un movimiento?
    e.preventDefault(); 
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    })
    setLoading(true); //mientras exista el proceso se activara
    //7. Tenemos que obtener el id de la transaccion
    if(!error){ // Pass the appearance object to the Elements instance
        const {id} = paymentMethod; //id de la transaccion que se reenvia de nuevo a stripe
        const {id: paymentMethodId, type: paymentType} = paymentMethod;
        const amountStripe = parseInt(monto*100);        
        try {  
          const activeCart =  await verifyActiveCart(); //Verificamos orden activa de tienda y monto 
          const ordenVentaId = activeCart.orders[0].id;
          const clienteId = activeCart.orders[0].clienteId;
          const ordenVentaData = createOrdenVentaData();
          const detalleVenta = await fetchDetalleVenta(ordenVentaId);
          if(detalleVenta.items.length == 0){
              console.error("Orden Vacia");
              setLoading(false);
              return;
          }
          const updatedDetalleVenta = await verifyStockAvailability(detalleVenta.items);
          if (updatedDetalleVenta.length === 0) {
            console.error("No procede el pago, algunos articulos no tienen stock");
            setLoading(false);
            return;
          }
          const totalOrden = calculateTotalOrden(detalleVenta.items);
          if (totalOrden*100 != amountStripe){
            console.error("Los montos no coinciden, favor de actualizar");
          }
          const clienteData = await fetchClienteData(clienteId); //Aqui podemos validar que el cliente sea correcto
          const saldoActualizado = updateSaldo(clienteData.saldo, totalOrden);
          ordenVentaData.saldo = saldoActualizado;
          ordenVentaData.total = totalOrden;
          //AQUI PROCEDEMOS AL PAGO Y HACEMOS LOS UPDATE
          //const {data} = await axios.post('http://localhost:3001/api/checkout', {
          const {data} = await axios.post(API+'stripe/checkout', {  
            id,
            amount: parseInt(amountStripe),
            installments: installmentsEnabled,
            count: parseInt(installmentPlan)
          })
          //console.log(data);
          ordenVentaData.paymentId = paymentMethodId;
          ordenVentaData.metodoPago = paymentType;
          if(data.message == "succesful payment"){
            //HERE WE HAVE TO PUT ALL THE LOGIC
            const updateSuccess = await updateOrdenVenta(ordenVentaData,ordenVentaId);
            if (updateSuccess) {
              await updateStock(updatedDetalleVenta); //VERIFICAR COMO SE PUEDE AFETAR EL STOCK DE MANERA SEGURA
              //await updateClienteSaldo(clienteData.id, saldoActualizado); //El saldo no se mueve porque la venta se concreta
              //Aqui tengo que hacer una funcion para borrar las variables del state y tambien del localStorage
              alert('Venta Finalizada!!!');
              navigate('/checkoutcart4');
            }
            else{
              console.error("Ocurrio un problema al procesar la venta");
            }
          }
          else {                      
            setErrorMessage("Error al procesar el pago. code:001");
            if(data.message.decline_code){
              if(data.message.decline_code == "insufficient_funds"){
                setErrorMessage("Fondos insuficientes");
              }
            }
            else{
              setErrorMessage("Error al procesar el pago. code:003");
            }                      
            console.log(data);
          }
        } catch (error) {
          setErrorMessage("Error al procesar el pago. code:002");
          console.log("Error al procesar el pago. code:002");
          console.log(error);
        }
      setLoading(false); //Al acabar el proceso se desactiva el loading
    } 
    setLoading(false);
    //8. Creamos el backend en server/index.js
}
//HELPER FUNCTIONS=============================================================
const verifyActiveCart = async () =>{
  const APICart = `${API}ordenesUsuario/V2/get?offset=0&limit=1&status=activo&orderType=tienda`; 
  const response = await fetch(APICart, {
    headers: {
      'Authorization': `Bearer ${state.token}`,  
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error("Error fetching detalle venta");
  return response.json();
}
const createOrdenVentaData = () => {
    const orderType = "tienda";
    const estatus = "surtido";  
    const ordenVentaData = { orderType, status: estatus, noGuia:'pendiente', paqueteria: 'pendiente' };
    return ordenVentaData;
};
const fetchDetalleVenta = async (ordenVentaId) => {
  const response = await fetch(API + "orders/" + ordenVentaId, {
      headers: {
        'Authorization': `Bearer ${state.token}`,  
        'Content-Type': 'application/json',
      },
    });
  if (!response.ok) throw new Error("Error fetching detalle venta");
  return response.json();
};
const verifyStockAvailability = async (items) => {
  let stockAvailable = true;
  const updatedDetalleVenta = await Promise.all(items.map(async (detalle) => {
      const category = categorias.find(cat => cat.id.toString() === detalle.id_categoria.toString());
      if (category) {
          const stockResponse = await fetch(API + category.url + 'getmodel?administrador=true&model=' + detalle.SKU);
          const stockData = await stockResponse.json();
          if (stockData.stock < detalle.amount) {
              //setSuccess(false);
              console.error("Algunos artículos no están disponibles: " + detalle.sku_producto);
              stockAvailable = false;
          }
          return {
              ...detalle,
              url: category.url,
              stockNuevo: stockData.stock - detalle.amount,
              articuloId: stockData.id
          };
      } else {
          return detalle;
      }
  }));
  if (!stockAvailable) {
      throw new Error("Algunos artículos no están disponibles");
  }
  return updatedDetalleVenta;
};
const calculateTotalOrden = (items) => {
  return items.reduce((total, item) => {
      return total + (item.precioPromoTotal ? item.precioPromoTotal * item.amount : item.precioTotal * item.amount);
  }, 0);
};
const fetchClienteData = async (clienteId) => {
  const response = await fetch(API + 'clientes/' + clienteId, {
      headers: {
        'Authorization': `Bearer ${state.token}`,  
        'Content-Type': 'application/json',
      },
    });
  if (!response.ok) throw new Error("Cliente no encontrado");
  return response.json();
};
const updateSaldo = (saldo, totalOrden) => {
  return (parseFloat(saldo) + parseFloat(totalOrden)).toFixed(2);  //Suma como ingreso pagina 37 de observaciones
};
const updateOrdenVenta = async (ordenVentaData,ordenVentaId) => {
  const APIPut = API + "orders/" + ordenVentaId;
  const { success, data, error } = await usePut2V(APIPut, ordenVentaData, state.token); 
  if (!success) throw new Error(error || "Error occurred during the request");
  return success;
};
const updateStock = async (updatedDetalleVenta) => {
  await Promise.all(updatedDetalleVenta.map(async (product) => {
      //const url = API + product.url + product.articuloId;
      const url = API+ "ordenesUsuario/v2/update-stock/"
      
      //const data = { categoryId: product.stockNuevo };
      const data = { categoryId: product.id_categoria, productSKU:product.SKU, amount:product.amount  };
      const response = await fetch(url, {
          method: 'PUT',
          headers: {
              'Authorization': `Bearer ${state.token}`,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update product');
  }));
};
//END HELPER FUNCTIONS=============================================================
  return (
    <Box component="form"
      sx={{
      '& > :not(style)': { m: 1 },
      }}
      noValidate
      autoComplete="off"
    >
        <Typography>Pago con tarjeta</Typography> 
        <CardElement options={CARD_ELEMENT_OPTIONS} onChange={handleCardNumberChange}/>
        <FormGroup>
          <FormControlLabel 
            control={
              <Checkbox 
              id="installments-enabled" 
              checked={installmentsEnabled}
              onChange={(e) => setInstallmentsEnabled(e.target.checked)}/>
            } 
            label="Pagar a meses sin intereses" 
          />
        </FormGroup>
        {installmentsEnabled && (
        <Box>
          <Typography variant="body2">Planes de cuotas</Typography>
          <Box className="checkOut_installments_container">
            <FormControl sx={{width:"100%"}}>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                name="radio-buttons-group"        
              >
                <FormControlLabel 
                className="checkOut_divider"  
                value="3" control={<Radio checked={installmentPlan === "3" || installmentPlan == 3} onChange={(e) => setInstallmentPlan(e.target.value)}/>} 
                label={<Box>
                  <Typography variant="body2" className = "checkOut_installments_radio">3 pagos de {formatter.format(parseInt(monto)/3)}</Typography> 
                  <Typography className="checkOut_total">Total {formatter.format(parseInt(monto))}</Typography>
                  </Box>}
                />
                <FormControlLabel 
                className="checkOut_divider"
                value="6" 
                control={<Radio checked={installmentPlan === "6"} onChange={(e) => setInstallmentPlan(e.target.value)}/>} 
                label={<Box>
                  <Typography variant="body2" className = "checkOut_installments_radio">6 pagos de {formatter.format(parseInt(monto)/6)}</Typography>
                  <Typography className="checkOut_total">Total {formatter.format(parseInt(monto))}</Typography>
                  </Box>} 
                />
                <FormControlLabel 
                value="12" 
                className="checkOut_divider2"
                control={<Radio checked={installmentPlan === "12"} onChange={(e) => setInstallmentPlan(e.target.value)}/>} 
                label={<Box>
                  <Typography variant="body2" className = "checkOut_installments_radio">12 pagos de {formatter.format(parseInt(monto)/12)}</Typography>
                  <Typography className="checkOut_total">Total {formatter.format(parseInt(monto))}</Typography>
                  </Box>} 
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </Box>
      )}
      {installmentsAvailable && <p>Installments are available for Mexican cards.</p>}
        <Button 
            onClick={handleSubmit} 
            variant="raised"
            sx={{
                textTransform: 'none',
                margin: '0 !important'
            }}  
            className={(!stripe || !tieneDireccion) ? 'primary-button-disabled': 'primary-button'}
            disabled = {!stripe || !tieneDireccion}>
            {loading ? (<CircularProgress color="inherit"/>) : "Pagar " + amount }
        </Button>
        <Box className="errorMessage">
          {(errorMessage != "") && 
            <Alert severity="error">{errorMessage}</Alert>
          }
        </Box>
    </Box>);
  };
//==================================================================Checkout form=======
const CheckOutCart3_1 = () => {
  const { state,fetchOrderData } = useContext(AppContext);
  const [dataCarrito, setDataCarrito] = useState(null);
  const [dataConfigurador, setDataConfigurador] = useState(null);
  const [tieneDireccion,setTieneDireccion] = useState(false);
  const appearance = {
      theme: 'stripe'
  };
  const  dataLogin = {
    token: state.token
  }
  //Esto cargaria el carrito al state
  useEffect(() => {
    console.log("Se ejecuta fetchOrderData");
    fetchOrderData(dataLogin);
  }, [state.token]); 
  //==================================FUNCIONES PARA TRAER EL CARRITO==================================
	const form = useRef(null);
  if (state.totalCompra <= 0){
    return(
      <Box className="CheckOutCart2Container">
        <Stack spacing={2} sx={{pt:'1rem', pb:'2rem',pl:'1rem'}} className="CheckOutCart2Form" direction = {{xs:"column", md:"column"}}>              
          <Typography variant="h5" >Tu carrito se encuentra vacío</Typography>              
          <Typography>Puedes continuar comprando en el configurador o en la pagina principal</Typography>              
        </Stack>
      </Box>
    );
  }
	return (
        <Box className="CheckOutCart2Container">
            <Stack spacing={2} className="CheckOutCart2Form" direction = {{xs:"column", md:"column"}}>              
                <Box className="form, facturacion_Form" ref={form}>                    
                    <Elements 
                    stripe={stripePromise} 
                    className="payment_elements"  
                    options={{appearance}}
                    >
                        <Box className="payment_container">
                          <Box>Aqui va AddressCardDeliveryDefault</Box>
                          {/*<AddressCardDeliveryDefault userId={state.userId} setTieneDireccion={setTieneDireccion}/>*/}
                          <Checkoutform monto = {state.totalCompra} tieneDireccion={tieneDireccion}/>
                        </Box>
                    </Elements>
                </Box>                
            </Stack>
            <Box>
                <ProductCart/>      
                <Box sx={{height:'10px'}}></Box>          
                <ProductCartConf editVisible={true}/>
                <Box className="total_compra">
                  <Typography >Total de la Compra:</Typography> 
                  <Typography  className="total_config">{formatter.format(state.totalCompra)}</Typography>
                </Box>
            </Box>
        </Box>
	);
}
export default CheckOutCart3_1;

