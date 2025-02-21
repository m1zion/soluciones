// A diferencia de usePost aqui lo hacemos con async y await y enviamos los errores
//Este hook tambien maneja las respuestas 404 
const usePost2V = async(API,data,token) => {
    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Add Bearer token to the headers
        },
        body: JSON.stringify(data)
    };
    try {
        const response = await fetch(API, requestOptions)
        if (!response.ok) {
            const resultPrev = await  response.json();
            if(resultPrev.errors[0].message){
                const errorOriginal = resultPrev.errors[0].message;
                const translatedError = errorOriginal.replace("must be unique", "tiene que ser único");
                throw new Error(`${translatedError}`);
            }
            else{
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        }
        const result = await  response.json();
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: error.message || 'Something went wrong' };
    }
}
export default usePost2V;
