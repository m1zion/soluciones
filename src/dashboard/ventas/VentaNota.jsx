import {Document,Page,Text,View,StyleSheet,PDFViewer, Image} from "@react-pdf/renderer";
import React, { useState, useEffect, useCallback, useContext } from 'react';
import {useParams} from "react-router-dom";
import formatNumber  from '@utils/formatNumber';
import logo from '@logos/logo24_7.png';
import { Alert, Box, Typography } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import AppContext from '@context/AppContext';
const API = process.env.REACT_APP_API_URL;
const styles = StyleSheet.create({
    page: {
        //backgroundColor: "#d11fb6",
        //color: "white",
    },
    encabezado: {
      backgroundColor: "black",
      width: "100%",
      height: 40,
      padding: "5 10",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-end"
    },
    logo: {
      width: 100, // Adjust width as needed
      height: 'auto',
      //marginRight: 10,
    },
    sectionHeader: {
        margin: 10,
        padding: 10,
    },
    section: {
        margin: "0 10",
        padding: "2 10",
        fontSize: 12,
        //fontWeight: 400
    },
    sectionRight: {
      margin: "0 10",
      padding: "2 10",
      fontSize: 12,
      textAlign: 'right'
      //fontWeight: 400
    },
    sectionBold: {
      fontSize: 12,
      fontWeight: 'bold'
    },
    section0: {
      margin: 0,
      marginTop: 4,
      padding: 0,
    },
    viewer: {
        width: window.innerWidth, //the pdf viewer will take up all of the width and height
        height: window.innerHeight,
    },
    table: {
        //backgroundColor: "lightgray",
        display: "table",
        margin: "0 auto",
        width: "auto",
        //borderStyle: "solid",
        //borderWidth: 1
    },
    tableRow: {
      margin: "auto",
      flexDirection: "row"
    },
    tableCol90: {
      width: "90%",
    },
    tableCol40: {
      width: "40%",
    },
    tableCol10: {
      width: "10%",
    },
    tableCol20: {
      width: "20%",
    },
    tableCell: {
      margin: "auto",
      marginTop: 5,
      fontSize: 10
    },
    
    tableCellLeft: {
      marginTop: 5,
      fontSize: 10,
      marginLeft: 2,
      textAlign: "left",
    },
    tableCellRight: {
      marginTop: 5,
      marginRight: 2,
      fontSize: 10,
      textAlign: "right",
    },
    horizontalLine: {
      margin: 10,
      borderBottomWidth: 1,
      borderBottomColor: 'black',
    },
    bold: {
      fontWeight: 600
    }
});
var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'MXN',
});
const fetchOrderDetails = async (APIVENTA,token) => {
  const response = await fetch(APIVENTA, {
    headers: {
      'Authorization': `Bearer ${token}`,  // Add the Bearer token here
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Error fetching order details');
  return response.json();
};
const fetchClientDetails = async (API, clienteId,token) => {
  const response = await fetch(`${API}clientes/${clienteId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,  // Add the Bearer token here
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Error fetching client details');
  return response.json();
};
const VentaNota = () => {
  const { state } = useContext(AppContext);
const{ordenVentaId} = useParams();
const [errMsg, setErrMsg] = useState('');
const [success, setSuccess] = useState(false);
const [detalleVentaData, setDetalleVentaData] = useState([]);
const [totalOrden, setTotalOrden] = useState('');
const [fechaVenta, setFechaVenta] = useState('');
const [nombreCliente,setNombreCiente] = useState('');
const [loading, setLoading] = useState(true);
const [telefonoCliente,setTelefonoCliente] = useState('');
const [noGuia,setNoGuia] = useState('');
const [paqueteria,setPaqueteria] = useState('')
const [metodoPago,setMetodoPago] = useState('')

const APIVENTA = API+"orders/"+ordenVentaId;
const formatDate = (dateString) => { //Esta funcion lo retorna con YYYY-MM-DD
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}-${month}-${year}`;
}; 

const loadOrderData = useCallback(async () => {
  try {
      const orderData = await fetchOrderDetails(APIVENTA,state.token);
      if (orderData.items) {
          setFechaVenta(formatDate(orderData.createdAt));
          setDetalleVentaData(orderData.items);

          const totalOrden = orderData.items.reduce((total, item) => {
              return total + (item.precioPromoTotal ? item.precioPromoTotal * item.amount : item.precioPromoTotal * item.amount);
          }, 0);
          const totalOrdenIva = formatter.format(totalOrden).replace(/[^\d.-]/g, '');
          setTotalOrden(totalOrdenIva);

          const clienteId = orderData.clienteId ? orderData.clienteId : 6;
          const clientData = await fetchClientDetails(API, clienteId, state.token);
          const nombreCompleto = `${clientData.nombre} ${clientData.apellidoPaterno} ${clientData.apellidoMaterno || ''}`;
          setNombreCiente(nombreCompleto.trim() || "-");
          setTelefonoCliente(clientData.telefono || '');
          setNoGuia(orderData.noGuia || '')
          setPaqueteria(orderData.paqueteria || '');
          setMetodoPago(orderData.metodoPago || '');
          setSuccess(true);
      }
  } catch (error) {
      setErrMsg(error.message);
      setSuccess(false);
  } finally {
      setLoading(false);
  }
}, [APIVENTA]);

useEffect(() => {
  loadOrderData();
}, [loadOrderData]);
if (loading) {
  return (
    <Box className="loading-box">
      <Typography>Cargando ...</Typography>
      <CircularProgress color="inherit" />
    </Box>
  );
}
if(!success){
  return (
    <Box className="main-container">
      <Box className="product-detail"> 
        <Box className="product-NotFound">
          <Alert severity="error"  className="errmsg" aria-live="assertive" >Orden de venta no encontrada.</Alert>
        </Box>
      </Box>
    </Box>
  );
}
return (
    <PDFViewer style={styles.viewer}>
    <Document>
        <Page size="A4" style={styles.page}>
        <View style={styles.encabezado}>
          <Image
              style={styles.logo}
              src={logo}
          />
        </View>
        <View style={styles.sectionHeader}>
            <Text>Pedido: {ordenVentaId}</Text>
        </View>
        <View style={styles.section}>
            <Text>DETALLES DEL PEDIDO</Text>
        </View>
        <View style={styles.section}>
            <Text>
                <Text style={styles.bold}>FECHA: </Text>
                {fechaVenta}
            </Text>
        </View>
        <View style={styles.horizontalLine}></View>
        <View style={styles.section}>
            <Text>PRODUCTOS</Text>
        </View>
          {detalleVentaData.map((row) => (
            <View style={styles.section0} key={row.SKU}>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <View style={styles.tableCol90}><Text style={styles.tableCellLeft}>{row.marca} {row.Nombre}</Text></View>
                </View>
              </View>
              <View style={styles.table}>
                <View style={styles.tableRow}>
                  <View style={styles.tableCol40}><Text style={styles.tableCellLeft}>SKU:{row.SKU}</Text></View>
                  <View style={styles.tableCol10}><Text style={styles.tableCell}>{row.amount} x</Text></View>
                  <View style={styles.tableCol20}><Text style={[styles.tableCellRight]}>${formatNumber(parseInt(row.precioPromoTotal ? row.precioPromoTotal : row.precioTotal))}</Text></View>
                  <View style={styles.tableCol20}><Text style={[styles.tableCellRight]}>${formatNumber(parseInt(row.precioPromoTotal ? row.precioPromoTotal * row.amount : row.precioTotal * row.amount))}</Text></View>   
                </View>
              </View>
            </View>
          ))}
        <View style={styles.horizontalLine}></View>
        <View style={styles.sectionRight}>
            <Text>Subtotal ( {detalleVentaData.length} productos): ${formatNumber(parseInt(totalOrden))} </Text>
        </View>
        <View style={styles.sectionRight}>
            <Text>Total: ${formatNumber(parseInt(totalOrden))} </Text>
        </View>
        <View style={styles.horizontalLine}></View>
        <View style={styles.sectionRight}>
            <Text>Método de Pago: {metodoPago}</Text>
        </View>
        <View style={styles.sectionRight}>
            <Text>Envío: {paqueteria} {noGuia}</Text>
        </View> 
        <View style={styles.horizontalLine}></View>
        <View style={styles.sectionRight}>
            <Text>Enviar a: {nombreCliente}</Text>
        </View>
        <View style={styles.sectionRight}>
            <Text>Télefono: {telefonoCliente}</Text>
        </View>
      </Page>
    </Document>
    </PDFViewer>
    );
}
export default VentaNota;