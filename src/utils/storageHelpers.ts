import { UserInfo } from "../movie.type";
  
export const getUserInfo = (): UserInfo | null => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
        try {
            return JSON.parse(storedUser) as UserInfo;
        } catch (error) {
            return null;
        }
    }
    return null;
};
