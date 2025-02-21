
// A diferencia de usePout aqui lo hacemos con async y await y enviamos los errores
//Este hook tambien maneja las respuestas 404 
const usePut2V = async(API,data,token) => {
    const requestOptions = {
        method: 'PUT',
        headers: { 
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };
    try {
        const response = await fetch(API, requestOptions)
        if (!response.ok) {
            // If the response status is not within the range 200-299,
            // treat it as an error and throw an exception
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await  response.json();
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: error.message || 'Something went wrong' };
    }
}
export default usePut2V;


