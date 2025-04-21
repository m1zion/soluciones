const useDelete2 = async (API) => {
    try {
      const response = await fetch(API, {
        method: "DELETE",
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
export default useDelete2;
