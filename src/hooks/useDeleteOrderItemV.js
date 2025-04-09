const useDeleteOrderItem = async (API,data,token) => {
    try{
        const requestOptions = {
            method: 'DELETE',
            headers: { 
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json' 
            },
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