
const usePut = (API,data) => {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };
    //const [order, setOrder] = useState([]);
        fetch(API, requestOptions)
        .then(response => response.json());
        //.then((result) => console.log(result));
}
export default usePut;


