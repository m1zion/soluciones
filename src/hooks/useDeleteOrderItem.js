const useDeleteOrderItem = async (API,data) => {
    try{
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        const response = await fetch(API, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: error.message || 'Error al eliminar el elemento' };
    }
}
export default useDeleteOrderItem;


/*const useDeleteOrderItem = (API,data) => {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };
    fetch(API, requestOptions)
    .then(response => response.json());
}
export default useDeleteOrderItem;*/

