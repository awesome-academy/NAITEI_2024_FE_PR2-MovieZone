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

export const registerUser = async (formData: {
  username: string;
  email: string;
  password: string;
}): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Registration failed!");
    }
    
    const data = await response.json();
    return data.user;
  } catch (error) {
    throw new Error(`Error registering user: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const loginUser = async (formData: {
  email: string;
  password: string;
}): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    
    if (!response.ok) {
      throw new Error("Login failed!");
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    throw new Error(`Error login user: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
