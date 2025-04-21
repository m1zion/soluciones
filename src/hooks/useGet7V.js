import { useState, useEffect } from 'react';
const useGet7V = (url,token) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const result = await response.json();
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('401 Unauthorized: Access is denied');
          }
          /*if (response.status === 404) {
            throw new Error('No se encontraron resultados');
          }*/
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        if(result.message){
          setData([]);
          throw new Error("No se encontraron resultados");
        }
        setData(result);
        setError(null);
      } 
       catch (err) {
        if (err instanceof TypeError && err.message === 'Failed to fetch') {
          setError('Failed to connect.');
        } else if (err.message === 'No se encontraron resultados' || err.message.toLowerCase().includes('404')) {
          setData([]);
          setError('No se encontraron resultados');
        } else if (err.message === '401 Unauthorized: Access is denied')  {
          setError('No autorizado');
        } else if (err.message.toLowerCase().includes('unauthorized')) {
          setError('No autorizado');
        } 
        else{
          setError('Error de consulta');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url,token]);
  return { data, loading, error };
};
export default useGet7V;
