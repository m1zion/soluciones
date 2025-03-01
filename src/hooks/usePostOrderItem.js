const usePostOrderItem = (API,data,token) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Add the bearer token here
        },
        body: JSON.stringify(data)
    };
    fetch(API, requestOptions)
    .then(response => response.json());
}
export default usePostOrderItem;


