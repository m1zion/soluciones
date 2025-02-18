// A diferencia de usePost aqui lo hacemos con async y await y enviamos los errores
//Este hook tambien maneja las respuestas 404 
const usePost2 = async(API,data) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };
    try {
        const response = await fetch(API, requestOptions)
        if (!response.ok) {
            // If the response status is not within the range 200-299,
            // treat it as an error and throw an exception
            //Asumiendo que siempre traera los errores en la posicion del arreglo [0]
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
export default usePost2;
