const useDelete2V = async (API,token) => {
    try {
      const response = await fetch(API, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`, // Add Bearer token to the headers
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      } 
      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message || 'Something went wrong' };
    }
}
export default useDelete2V;
