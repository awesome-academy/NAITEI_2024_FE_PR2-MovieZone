const API_URL = process.env.REACT_APP_API_URL;

export const fetchData = async (endpoint: string, param?: string): Promise<{ data: any; totalCount: number }> => {
  try {
    const response = await fetch(`${API_URL}/${endpoint}?${param ? param : ""}`);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();
    const totalCount = parseInt(response.headers.get('x-total-count') || "0", 10);

    return { data, totalCount };
  } catch (error) {
    throw new Error(`Error fetching data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
