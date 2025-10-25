const useDelete = (API) => {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    };
        fetch(API, requestOptions)
        .then(response => response.json());
        //.then((result) => console.log(result));
}
export default useDelete;