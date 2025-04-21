import { useState, useEffect } from 'react';
const useGet8 = (url,dependencies) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const result = await response.json();
        //console.log("Ejecuta API");
        //if(result.message == 'No se encontraron Configuraciones correspondientes'){
        if(result.message){
          setData([]);
          throw new Error("No se encontraron resultados");
        }
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        setData(result);
      } 
       catch (err) {
        if (err instanceof TypeError && err.message === 'Failed to fetch') {
          setError('Failed to connect.');
        } else if (err.message === 'No se encontraron resultados') {
        //} else if (err.message) {
          setError('No se encontraron resultados');
        } else {
          setError('Error de consulta');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url,dependencies]);

  return { data, loading, error };
};

export default useGet8;
