import { useEffect, useState } from "react";
const useGet = (API) => {
    const [order, setOrder] = useState([]);
    useEffect(() => {
        fetch(API)
          .then(response => response.json())
          .then(data => setOrder(data));
      }, []);
    return order;
}
export default useGet;

