import { UserLists, UserInfo } from "../movie.type";

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
    const id = data.user.id;

    const userLists = {
      addToList: {},
      favorite: [],
      watchlist: [],
      rating: {},
    };

    await fetch(`${API_URL}/userLists_movie`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, ...userLists }),
    });

    await fetch(`${API_URL}/userLists_tv`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, ...userLists }),
    });

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

export const deleteUser = async (userId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Account deletion failed!");
    }

    await fetch(`${API_URL}/userLists_movie/${userId}`, {
      method: "DELETE",
    });

    await fetch(`${API_URL}/userLists_tv/${userId}`, {
      method: "DELETE",
    });

    console.log('User and user lists deleted successfully');
  } catch (error) {
    throw new Error(`Error deleting user: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const fetchUserLists = async (userId: number, type: "movie" | "tv"): Promise<UserLists> => {
  try {
    const response = await fetch(`${API_URL}/userLists_${type}/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch user lists');
    }

    const data: UserLists = await response.json();
    return data;
  } catch (error) {
    return {
      addToList: {},
      favorite: [],
      watchlist: [],
      rating: {},
    };
  }
};

export const saveUserLists = async (userId: number, type: "movie" | "tv", userLists: UserLists): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/userLists_${type}/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userLists),
    });

    if (!response.ok) {
      throw new Error('Error saving user lists');
    }
  } catch (error) {
    throw new Error('Error saving user lists');
  }
};

export const updateUser = async (userId: number, updatedData: Partial<UserInfo>): Promise<UserInfo> => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error("Account update failed!");
    }

    const data = await response.json();
    console.log("User updated successfully", data);
    return data;
  } catch (error) {
    throw new Error(`Error updating user: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};
