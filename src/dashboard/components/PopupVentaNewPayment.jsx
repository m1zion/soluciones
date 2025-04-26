
import React, { useRef, useState, useContext } from 'react';
import { Stack, TextField, Button, Typography, Box, IconButton, Alert} from "@mui/material"; 
import CloseIcon from '@mui/icons-material/Close';
import usePost2V from '@hooks/usePost2V';
import './popup.scss';
import AppContext from '@context/AppContext';
const API = process.env.REACT_APP_API_URL;
const PopupVentaNewPayment = (props) => {
    const ordenVentaIdValue = props.ordenVentaId; 
    const { state } = useContext(AppContext);  
    const saldoPendiente = props.saldoPendiente;
    const ordenVenta = props.ordenVenta;
    //console.log(ordenVenta);
    const clienteId = props.clienteId;
    const form = useRef(null);
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    //ITEMS VARIABLES
    const [fechaMovimiento, setFechaMovimiento] = useState('');
    const [referencia, setReferencia] = useState(ordenVenta);
    const [concepto, setConcepto] = useState(''); 
    const [monto, setMonto] = useState('');  
    const [notas, setNotas] = useState(''); 
    //Errores
    const [errorFechaMovimiento, setErrorFechaMovimiento] = useState(false);
    const [errorReferencia, setErrorReferencia] = useState(false);
    const [errorConcepto, setErrorConcepto] = useState(false);
    const [errorMonto, setErrorMonto] = useState(false);
    const handleSubmitReturn = (event) => {
        event.preventDefault();
        setFechaMovimiento('');
        setReferencia('');
        setConcepto(''); 
        setMonto('');  
        setNotas(''); 
        setErrorFechaMovimiento(false);
        setErrorReferencia(false);
        setErrorConcepto(false);
        setErrorMonto(false);
        setErrMsg('');
        props.setTrigger(false);
    }   
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateFormInputs()) {
            return;
        }
        //console.log("Entro");
        let nuevoSaldo = 0;
        try {
            const saldoCliente = await fetchSaldoCliente();
            nuevoSaldo = calculateNuevoSaldo(saldoCliente);
            const clienteMovimientoData = createClienteMovimientoData(nuevoSaldo);
            const movimientoSuccess = await postClienteMovimiento(clienteMovimientoData);
            if (movimientoSuccess) {
                await updateSaldoCliente(nuevoSaldo);
                await updateOrdenesVenta();
                setSuccess(true);
                setFechaMovimiento('');
                setReferencia('');
                setConcepto(''); 
                setMonto('');  
                setNotas(''); 
                setErrMsg("Registro Guardado");
                props.setItemChangedMov(prevItemChangedMov=> !prevItemChangedMov);
                props.setTrigger(false);
            }
        } catch (error) {
            console.log("Error");
            setSuccess(false);
            setErrMsg(error.message || "Error occurred during the request");
        }
    };
    //VALIDA FORMAS===========================================================================
    const validateFormInputs = () => {
        let valid = true;
        if (!fechaMovimiento) {
            setErrorFechaMovimiento(true);
            valid = false;
        } else { setErrorFechaMovimiento(false); }
        if (!referencia) {
            setErrorReferencia(true);
            valid = false;
        } else { setErrorReferencia(false); }       
        if (!concepto) {
            setErrorConcepto(true);
            valid = false;
        } else { setErrorConcepto(false); }
        if (!monto) {
            setErrorMonto(true);
            valid = false;
        } else { setErrorMonto(false); }

        if (!fechaMovimiento || !referencia || !concepto || !monto) {
            setErrMsg("Favor de ingresar todos los datos");
            console.log("error 00");
            return false;
        }
        if (monto > saldoPendiente) {
            setErrMsg("El monto no puede ser mayor al saldo");
            console.log("error 01");
            return false;
        }
        
        return valid;
    };
    //LLAMADA A LA API PARA TRAER EL SALDO DEL CLIENTE=====================================
    const fetchSaldoCliente = async () => {
        const ligaCliente = `${API}clientes/${clienteId}`;
        const response = await fetch(ligaCliente, {
            headers: {
              'Authorization': `Bearer ${state.token}`,  // Add the Bearer token here
              'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Error al consultar saldo del cliente');
        }
        const data = await response.json();
        if (data.saldo !== undefined) {
            return data.saldo;
        } else {
            throw new Error('Saldo del cliente no encontrado');
        }
    };
      //CALCULA EL NUEVO SALDO DEL CLIENTE===================================================
      const calculateNuevoSaldo = (saldoCliente) => {
        let nuevoSaldo = 0;
        //Siempre seran ingresos
        //Observaciones 090924 Los pagos (ingresos) disminuyen la deuda pongo (-)
        nuevoSaldo = parseFloat(saldoCliente) - parseFloat(monto);
        return nuevoSaldo;
    };

    //CREA ARREGLO PARA MOVIMIENTO===========================================================
    const createClienteMovimientoData = (nuevoSaldo) => {
        return {
            tipo: 'ingreso',
            clienteId,
            fecha: fechaMovimiento,
            referencia:String(referencia),
            concepto,
            monto,
            referenciaId: String(referencia),
            notas: notas ? notas : '-',  //Quitar cuando Luis lo haga opcional
            saldo: parseFloat(nuevoSaldo).toFixed(2)
        };
    };
     //POSTEA EL MOVIMIENTO A LA API===========================================================   
     const postClienteMovimiento = async (clienteMovimientoData) => {
        const APIPost = `${API}cliente/clienteMovimiento`;
        const { success, data, error } = await usePost2V(APIPost, clienteMovimientoData,state.token);
        if (!success) {
            throw new Error(error || "Error occurred during the request");
        }
        return success;
    };
      //ACTUALIZA EL SALDO DEL CLIENTE EN LA API==============================================
      const updateSaldoCliente = async (nuevoSaldo) => {
        const ligaCliente = `${API}clientes/${clienteId}`;
        const actualizaSaldo = { saldo: nuevoSaldo };
        const response = await fetch(ligaCliente, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${state.token}`, 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(actualizaSaldo),
        });
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage || "Error occurred while updating API");
        }
    };

     //ACTUALIZA EL SALDO DE LAS ORDENES DE VENTA, TOMANDO EN CUENTA LA REFERENCIA===============
    const updateOrdenesVenta = async () => {
        let montoAux = Number(monto);
        let referenciaUsada = true;
        const actualizarOrdenes = async (referenciaU = '') => {
           const ligaOrdenes = `${API}orders/V2/get?offset=0&limit=10&status=surtido&ordenarFechaDesc=ASC&clienteId=${clienteId}${referenciaU ? `&order_id=${referencia}` : ''}`;
            const response = await fetch(ligaOrdenes, {
                headers: {
                  'Authorization': `Bearer ${state.token}`,  // Add the Bearer token here
                  'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Error al consultar las ordenes de venta');
            }
            const data = await response.json();
            if (data.orders) {
                const filteredOrdenes = data.orders.filter(order => Number(order.saldoVenta) !== Number(order.total));
                for (let order of filteredOrdenes) {                   
                    const difference = Number(order.total) - Number(order.saldoVenta);
                    let nuevoEstatus= 'surtido';
                    let metodoPago= '-';
                    if (montoAux >= difference) {
                        order.saldoVenta = Number(order.total);
                        nuevoEstatus = 'pagado';
                        metodoPago = 'Administrador';
                        props.setOcultaBoton(true);
                        montoAux -= difference;
                    } else {
                        order.saldoVenta = Number(order.saldoVenta) + montoAux;
                        montoAux = 0;
                    }
                    const ordenVentaSaldo = {
                        orderType: order.orderType,
                        saldoVenta: order.saldoVenta,
                        status: nuevoEstatus,
                        metodoPago: metodoPago
                    };
                    await patchOrdenVenta(order.id, ordenVentaSaldo);
                    if (montoAux === 0) break;
                }
            } 
        };
        // Primer llamado con la referencia
        await actualizarOrdenes(referenciaUsada ? referencia : '');
        // Segundo llamado sin la referencia si aún queda montoAux
        if (montoAux > 0) {
            await actualizarOrdenes();
        }
    };
    //ACTUALIZA CADA ORDEN DE VENTA EN LA API================================================
    const patchOrdenVenta = async (ordenVentaId, ordenVentaSaldo) => {
        const APIOrdenSaldo = `${API}orders/${ordenVentaId}`;
        const patchResponse = await fetch(APIOrdenSaldo, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${state.token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ordenVentaSaldo)
        });
        if (!patchResponse.ok) {
            throw new Error(`Error al actualizar la orden ${ordenVentaId}`);
        }
    };
     return (
        (props.trigger) ? (
         <Box className="popup">
            <Box className='popup-inner'>
                
                <IconButton onClick={handleSubmitReturn} className='close-btn'><CloseIcon/></IconButton>
                {props.children}
                <Box className= "admin-tableHeaderPopup" >
                    <Typography className="admin-title" variant='h5'>Agregar pago de cliente {props.ordenVentaId}</Typography>
                </Box>
                <Alert severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert> 
                <Stack className="LoginFormContainer_admin" spacing={2} direction = {{xs:"column", md:"column", lg:"row"}} >
                <Box
                className="Form_Container_admin"
                component="form"
                autoComplete="off"
                ref={form}
                noValidate
                >
                    <Stack alignItems="center" spacing={2}>
                    <TextField className="InputBasic"
                            error={errorFechaMovimiento}
                            required
                            id="fechaMovimiento" 
                            label="Fecha Movimiento" 
                            size="small"
                            name="fechaMovimiento"
                            autoComplete='off'
                            type="date"
                            value={fechaMovimiento}
                            onChange={e=>setFechaMovimiento(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                placeholder: '',
                                maxLength: 50,
                            }}
                        ></TextField>    
                        <TextField className="InputBasic"
                            disabled
                            id="referencia" 
                            label="Referencia" 
                            size="small"
                            name="referencia"
                            autoComplete='off'
                            value={ordenVenta}
                            onChange={e=>setReferencia(e.target.value)}
                            inputProps={{maxLength:50 }}
                        ></TextField>
                        <TextField className="InputBasic"
                            error={errorConcepto}
                            required
                            id="concepto" 
                            label="Concepto" 
                            size="small"
                            name="concepto"
                            autoComplete='off'
                            value={concepto}
                            onChange={e=>setConcepto(e.target.value)}
                            inputProps={{maxLength:50 }}
                        ></TextField> 
                         <TextField className="InputBasic"
                            error={errorMonto}
                            required
                            id="monto" 
                            label="Monto" 
                            size="small"
                            name="monto"
                            autoComplete='off'
                            value={monto}
                            type="number"
                            onChange={e=>setMonto(e.target.value)}
                            inputProps={{maxLength:50 }}
                        ></TextField>
                          <Typography sx={{width:'100%',pl:'2rem'}}>
                            Saldo Pendiente: {saldoPendiente}
                        </Typography>
                        <TextField className="InputBasic"
                             id="notas" 
                             label="Notas" 
                             size="small"
                             name="notas"
                             multiline
                             rows={3}
                             autoComplete='off'
                             value={notas}
                             onChange={e=>setNotas(e.target.value)}
                             inputProps={{maxLength:200 }}
                        ></TextField>  
                    </Stack>
                </Box>
                </Stack>
                <Box className="Button_Container_admin">
                    <Button variant="contained"  sx={{textTransform: 'none'}} onClick={handleSubmit} className="primary-button-admin" >Guardar</Button>
                    <Button variant="contained"  sx={{textTransform: 'none'}} onClick={handleSubmitReturn} className="primary-button-admin-outlined" >Regresar</Button>
                </Box>
            </Box>            
         </Box>
        ) : ""
     );
 }
 export default PopupVentaNewPayment;