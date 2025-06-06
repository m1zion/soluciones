import React, { useRef, useState, useEffect, useContext } from 'react';
import { Alert, Stack, TextField, Button, Typography, Box, Container} from "@mui/material"; 
import { useParams,useNavigate } from 'react-router-dom'; 
import usePost2V from '@hooks/usePost2V';
import TableVentasMov from '../containers/tableVentasMov';
import usePatchV from '@hooks/usePatchV';
import usePut2V from '@hooks/usePut2V';
import DatosCliente from '@containersDashboard/datosCliente';
const API = process.env.REACT_APP_API_URL;
const APICATEGORIAS = API+'categories/?offset=0&limit=100';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { CircularProgress } from "@mui/material";
import AppContext from '@context/AppContext';
const steps = [
    'activo',
    'esperando surtido',
    'surtido'
  ];
const VentaEdit = () => {
    const { state } = useContext(AppContext);
    const [authorized,setAuthorized] = useState(true);
    const{ordenVentaId} = useParams();
    const existeOrden = true;
    const ordenVenta = ordenVentaId;
    const [estatusOrden,setEstatusOrden] = useState('');
    const [success, setSuccess] = useState(false);  
    const [successCliente, setSuccessCliente] = useState(false);    
    const [errMsg, setErrMsg] = useState('');
    const [loadingCategoria, setLoadingCategoria] = useState(true);
    const [loadingVenta, setLoadingVenta] = useState(true);
    const [loadingCliente, setLoadingCliente] = useState(true);
    const [totalOrden,setTotalOrden] = useState('');
    const [categorias,setCategorias] = useState('');
    const [APICliente,setAPICliente] = useState('');
    const [datosCliente,setDatosCliente] = useState('');
    const [datosOrden,setDatosOrden] = useState('');
    const [datosDireccion,setDatosDireccion] = useState('');
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const navigate = useNavigate();
    const errRef = useRef();
    const form = useRef(null);
    //ITEMS VARIABLES
    const [descuento,setDescuento] = useState('');
    const [clienteId, setClienteId] = useState('');
    const [noGuia, setNoGuia] = useState('');
    const [paqueteria,setPaqueteria] = useState('');
    const [notas, setNotas] = useState('');
    const [fecha, setFecha] = useState('');
    //Errores
    const [errorVenta,setErrorVenta] = useState(false);
    const [errorDescuento,setErrorDescuento] = useState(false);
    const [errorClienteId,setErrorClienteId] = useState(false);
    const [errorNoGuia,setErrorNoGuia] = useState(false);
    const [errorPaqueteria,setErrorPaqueteria] = useState(false);
    const [errorFecha, setErrorFecha] = useState(false);
    const authorizedRoles = ['ventas', 'admin', 'contabilidad'];
    useEffect(() => {
        if (!authorizedRoles.includes(state.role)) {
          setAuthorized(false);
        }
      }, [state.role]); 
    const handleSubmitReturn = (event) => {
        event.preventDefault();
        navigate('/Dashboard/Ventas');
    }   
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'MXN',
    });
    const getActiveStep = () => {
        switch (estatusOrden) {
            case "activo":
                return 0;
            case "esperando surtido":
                return 1;
            case "surtido":
                return 2;
            default:
                return 0; // Default to 0 if estatusOrden doesn't match any condition
        }
    };   
    //====================Hace la busqueda del cliente y la direccion ========================================
    const handleClienteId = (event) => {
        const clienteId = event.target.value; 
        if (clienteId != ""){
            setAPICliente(API+'clientes/'+clienteId);
        }
        else{
            setDatosCliente([]);
            setDatosDireccion([]);
        }        
    }
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toISOString().split('T')[0]; // Extracting the date part
    };
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
                setLoadingCategoria(false);
                setErrMsg("");
            } catch (error) {
                setSuccess(false);
                setErrMsg("Error al consultar Categorias");
                setLoadingCategoria(false);
            }          
        };
        fetchData();
    }, []); // Empty dependency array ensures this effect runs only once
    //=============================================================================================
    //===============ORDEN DE VENTA====================
    useEffect(() => {// PARA ESTE CASO USAMOS UN FETCH DIRECTO
        if(ordenVentaId != ""){
            const APIORDEN = API+'orders/'+ordenVentaId;
            const fetchData = async () => {
                try {
                    const ordenFetchData = await fetch(APIORDEN, {
                        headers: {
                          'Authorization': `Bearer ${state.token}`,  
                          'Content-Type': 'application/json',
                        },
                      });
                    if (!ordenFetchData.ok) {
                        throw new Error('Failed to fetch orden');
                    }
                    const jsonOrden = await ordenFetchData.json();   
                    setClienteId(jsonOrden.clienteId);                   
                    const datosDireccionTemp = {
                        nombreCompleto: jsonOrden.nombreCompleto,
                        calle: jsonOrden.calle,
                        numExterior: jsonOrden.numExterior,
                        numInterior: jsonOrden.numInterior,
                        codigoPostal: jsonOrden.codigoPostal,
                        ciudad: jsonOrden.ciudad,
                        estado: jsonOrden.estado,
                        pais: jsonOrden.pais,
                    }
                    setDatosDireccion(datosDireccionTemp);
                    setEstatusOrden(jsonOrden.status);   
                    if(jsonOrden.status == 'pagado') {
                        alert("La orden no se puede editar");
                        navigate('/Dashboard/Ventas');
                    }
                    setNotas(jsonOrden.notas ? jsonOrden.notas : '');  
                    //setAPICliente(API+'clientes/'+jsonOrden.clienteId);
                    setAPICliente(`${API}clientes/?offset=0&limit=1`+`${jsonOrden.clienteId !== '' ? `&usuarioId=${jsonOrden.clienteId}` : ''}`); //USERID
                    setFecha(formatDate(jsonOrden.lastmodified));                
                    setDatosOrden(jsonOrden);
                    setLoadingVenta(false);
                    setErrorVenta(false);
                } catch (error) {
                    console.error(error);
                    setDatosOrden([]);                  
                    setErrMsg("Error al consultar orden / orden no encontrado");      
                    setLoadingVenta(false);    
                    setErrorVenta(true);         
                }          
            };
            fetchData();
        }
    }, []); // Empty dependency array ensures this effect runs only once
    //===============CLIENTE====================
    useEffect(() => {// PARA ESTE CASO USAMOS UN FETCH DIRECTO
        if(clienteId != ""){
            const fetchData = async () => {
                try {
                    const clienteFetchData = await fetch(APICliente, {
                        headers: {
                          'Authorization': `Bearer ${state.token}`,  
                          'Content-Type': 'application/json',
                        },
                      });
                    if (!clienteFetchData.ok) {
                        throw new Error('Failed to fetch clientes');
                    }
                    const jsonClientes = await clienteFetchData.json();    
                    const userId = jsonClientes.clientes[0].usuarioId; // o usa jsonClientes.userId si es otro campo
                    const userResponse = await fetch(`${API}users/${userId}`, {
                        headers: {
                            'Authorization': `Bearer ${state.token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (!userResponse.ok) {
                        throw new Error('Failed to fetch user');
                    }
                    const userData = await userResponse.json();
                    const clienteConEmail = { ...jsonClientes.clientes[0], correo: userData.correo };                             
                    setSuccessCliente(true); 
                    setErrorClienteId(false);
                    setErrMsg("");
                    setLoadingCliente(false);
                    setDatosCliente(clienteConEmail);
                } catch (error) {
                    console.error(error);
                    setDatosCliente([]);
                    setDatosDireccion([]);
                    setErrorClienteId(true);
                    setErrMsg("Error al consultar clientes / cliente no encontrado");
                    setSuccessCliente(false); 
                    setLoadingCliente(false);
                }          
            };
            fetchData();
        }
    }, [APICliente]); // Empty dependency array ensures this effect runs only once
    //=======================================================================================================
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!clienteId) { setErrorClienteId(true); } else { setErrorClienteId(false); }
        if (!fecha) { setErrorFecha(true); } else { setErrorFecha(false); }
        if (!clienteId ||
            !fecha || 
            !successCliente) {
                setErrMsg("Favor de llenar los campos requeridos.")
            return;
        }
        const orderType = "administrador";
        const estatus = "esperando surtido"; 
        const ordenVentaData={clienteId,orderType,status:estatus}; 
        if (notas && notas !== '') {
            ordenVentaData.notas = notas;
        }
        const APIPost = API+"orders/";
        const { success: successVenta, data, error } = await usePost2V(APIPost, ordenVentaData, state.token);
        if (successVenta){
            setSuccess(true);
            setEstatusOrden(estatus);
            setErrMsg("Registro Guardado");
        } else {
            setSuccess(false);
            setErrMsg(error || "Error occurred during the request");
        }
    }
    const handleUpdate = async (event) => {
        event.preventDefault(); 
        setLoadingUpdate(true);
        if (!validateFormInputs()) {
            setLoadingUpdate(false)
            return;
        }
        try {
            const ordenVentaData = createOrdenVentaData();
            const detalleVenta = await fetchDetalleVenta();
            if(detalleVenta.items.length == 0){
                setErrMsg("Orden Vacia");
                setLoadingUpdate(false);
                return;
            }
            const updatedDetalleVenta = await verifyStockAvailability(detalleVenta.items);
            if (updatedDetalleVenta.length === 0) {
                console.error("No hay suficiente stock");
                setLoadingUpdate(false);
                return;
            }
            const totalOrden = calculateTotalOrden(detalleVenta.items);
            const clienteData = await fetchClienteData();
            const saldoActualizado = updateSaldo(clienteData.saldo, totalOrden);
            ordenVentaData.saldo = saldoActualizado;
            ordenVentaData.total = totalOrden;
            const updateSuccess = await updateOrdenVenta(ordenVentaData);
            if (updateSuccess) {
                await updateStock(updatedDetalleVenta);
                await updateClienteSaldo(clienteData.id, saldoActualizado);
                setSuccess(true);
                setEstatusOrden(ordenVentaData.status_orden);
                setErrMsg("Registro Guardado");
                setLoadingUpdate(false);
                alert('Registro Actualizado.');
                navigate('/Dashboard/Ventas');
            }
        }
        catch (error) {
            setSuccess(false);
            setLoadingUpdate(false);
            setErrMsg(error.message || "Error occurred during the request");
        }
    }


    //FUNCIONES PARA ACTUALIZAR ORDEN DE VENTA, STOCK y SALDO DEL CLIENTE=============================================================
    const validateFormInputs = () => {
        let valid = true;
        if (!clienteId) { setErrorClienteId(true); valid = false; } else { setErrorClienteId(false); }
        if (!fecha) { setErrorFecha(true); valid = false; } else { setErrorFecha(false); }
        if (!noGuia) { setErrorNoGuia(true); valid = false; } else { setErrorNoGuia(false); }
        if (!paqueteria) { setErrorPaqueteria(true); valid = false; } else { setErrorPaqueteria(false); }
        if (!successCliente || !clienteId || !fecha || !noGuia || !paqueteria) {
            setErrMsg("Favor de llenar los campos requeridos.");
            valid = false;
        }
        return valid;
    };
    const createOrdenVentaData = () => {
        const orderType = "administrador";
        const estatus = "surtido";  
        const ordenVentaData = { orderType, status: estatus, noGuia, paqueteria };
        if (notas && notas !== '') {
            ordenVentaData.notas = notas;
        }
        return ordenVentaData;
    };
    const fetchDetalleVenta = async () => {
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
                    setSuccess(false);
                    setErrMsg("Algunos artículos no están disponibles: " + detalle.sku_producto);
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
    const fetchClienteData = async () => {
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
    const updateOrdenVenta = async (ordenVentaData) => {
        const APIPut = API + "orders/" + ordenVentaId;
        const { success, data, error } = await usePut2V(APIPut, ordenVentaData,state.token);
        if (!success) throw new Error(error || "Error occurred during the request");
        return success;
    };
    const updateStock = async (updatedDetalleVenta) => {
        await Promise.all(updatedDetalleVenta.map(async (product) => {
            const url = API + product.url + product.articuloId;
            const data = { stock: product.stockNuevo };
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${state.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to update product');
        }));
    };
    const updateClienteSaldo = async (clienteId, saldoActualizado) => {
        const APIClienteUpdate = API + "clientes/" + clienteId;
        const saldoActualizadoData = { saldo: saldoActualizado };
        //console.log("Entra patch");
        const { success, error } = await usePatchV(APIClienteUpdate, saldoActualizadoData, state.token);
        //console.log("Sale patch");
        if (!success) throw new Error(error || "Error al actualizar el saldo del proveedor");
        return success;
    };
//==========================================================================================================================


    const handleDescuento = (e) => {
        let newValue = e.target.value;
        newValue = Math.min(Math.max(parseInt(newValue), 1), 99);
        setDescuento(newValue);
    };
    if(!authorized){
        return (             
          <Box className = "noAuthorizedContainer">
            <Typography className='noAuthorizedContainer401'>401</Typography>
            <Typography className='noAuthorizedContainertext'>Lo sentimos, no esta autorizado para ver esta pagina.</Typography>
          </Box>
        );
      }
    if (loadingCategoria || loadingVenta || loadingCliente) { 
        return <Typography>Loading...</Typography>;
    }
    if (errorVenta) {
        return  <Alert severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert> ;
    }
    if (estatusOrden != 'activo' && estatusOrden != 'esperando surtido'){
        return  <Alert severity={(errMsg) ? "error" : "info"}  className="errmsg" aria-live="assertive" >La orden ya está concluida</Alert> ;
    }
    return (
        <Container maxWidth="lg" className="justified-container">
            {loadingUpdate && <LoadingOverlay />}
            <Box className= "admin-tableHeader" >
                <Typography  component="h2" variant="h5" color ="#1a237e" gutterBottom>Orden de venta ({ordenVenta}) {estatusOrden ? estatusOrden : 'Activo'}</Typography>
            </Box>
            <Box sx={{ width: '100%' }}>
                <Stepper activeStep={getActiveStep()} alternativeLabel>
                    {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                    ))}
                </Stepper>
            </Box>
            <Alert ref={errRef}  severity={(errMsg && !success) ? "error" : "info"}  className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive" >{errMsg}</Alert>            
            <Stack className="LoginFormContainer_admin" spacing={2} direction = {{xs:"column", md:"row", lg:"row"}} >
                <Box
                className="Form_Container_admin"
                component="form"
                autoComplete="off"
                ref={form}
                noValidate
                >
                    <Stack alignItems="center" spacing={2}>
                        <TextField className="InputBasic"                        
                            id="descuento" 
                            label="Descuento" 
                            size="small"
                            name="descuento"
                            autoComplete='off'
                            value={descuento}
                            type="number"
                            onChange={e=>setDescuento(e.target.value)}
                            onInput = {(e) =>{
                                e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,2)
                            }}
                        ></TextField>

                        <TextField className="InputBasic"
                            error={errorClienteId}
                            required
                            disabled
                            id="clienteId" 
                            label="Id del Cliente" 
                            size="small"
                            name="clienteId"
                            autoComplete='off'
                            value={clienteId}
                            onChange={e=>setClienteId(e.target.value)}
                            onBlur={handleClienteId}
                            inputProps={{maxLength:50 }}
                        ></TextField>                          
                        <TextField className="InputBasic"
                            error={errorFecha}
                            required
                            id="fecha" 
                            label="Fecha" 
                            size="small"
                            name="fecha"
                            autoComplete='off'
                            value={fecha}
                            type="date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={e=>setFecha(e.target.value)}
                            inputProps={{maxLength:50 }}
                        ></TextField>
                        <Stack direction="row" justifyContent="space-between" spacing={2} className="InputBasic">
                            <TextField 
                                disabled = {estatusOrden != "esperando surtido" ? true : false}  
                                error={errorNoGuia}
                                className="InputBasicHalf"
                                id="noGuia" 
                                label="Guia" 
                                size="small"
                                name="noGuia"
                                autoComplete='on'
                                value={noGuia}
                                onChange={e=>setNoGuia(e.target.value)}
                                inputProps={{maxLength:50 }}
                            ></TextField>
                            <TextField className="InputBasicHalf"
                                disabled = {estatusOrden != "esperando surtido" ? true : false}
                                error={errorPaqueteria}
                                label="Paqueteria" 
                                size="small"
                                name="paqueteria"
                                autoComplete='on'
                                value={paqueteria}
                                onChange={e=>setPaqueteria(e.target.value)}
                                inputProps={{maxLength:50 }}
                            ></TextField>
                        </Stack>
                        <TextField className="InputBasic"                           
                             id="notas" 
                             label="Notas" 
                             size="small"
                             name="notas"
                             multiline
                             maxRows={4}
                             autoComplete='off'
                             value={notas}
                             onChange={e=>setNotas(e.target.value)}
                             inputProps={{maxLength:200 }}
                        ></TextField>                         
                    </Stack>
                    <Box className="Ventas_Button_Container">
                        {existeOrden && estatusOrden === 'esperando surtido' ? ( 
                            <Button variant="contained" sx={{ textTransform: 'none' }} onClick={handleUpdate} className="primary-button-admin-green">
                                Surtido
                            </Button>
                        ) : (
                            <Button variant="contained" sx={{ textTransform: 'none' }} onClick={handleSubmit} className="primary-button-admin">
                                Generar (esperando surtido) {/* Pasa a estatus esperando surtido*/}
                            </Button>
                        )}
                        <Button variant="contained"  sx={{textTransform: 'none'}} onClick={handleSubmitReturn} className="primary-button-admin-outlined" >Regresar</Button>
                    </Box>
                </Box>
                <DatosCliente datosCliente={datosCliente} datosDireccion={datosDireccion}/>
            </Stack>
            {existeOrden && 
            <TableVentasMov 
            ordenVentaId={ordenVentaId} 
            ordenVenta={ordenVenta}
            setTotalOrden={setTotalOrden}  
            edit={true}
            editMovimiento={estatusOrden == "surtido" ? true : false} 
            categoryData={categorias}
            clienteId={clienteId}
            />}  {/*Esto se renderisa 7 veces, bajar la carga*/}

        </Container>
    );

    function LoadingOverlay() {
        return(
        <Box className='overlayStyle'>
            <Box className='spinnerStyle'> <CircularProgress color="inherit" />Loading...</Box>
        </Box>
        );
    }
}
export default VentaEdit;