import React, { createContext, useContext, useState, ReactNode } from "react";

interface AlertContextType {
  alert: { message: string; type: string } | null;
  setAlert: (alert: { message: string; type: string }) => void;
  clearAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alert, setAlert] = useState<{ message: string; type: string } | null>(null);

  const clearAlert = () => setAlert(null);

  return (
    <AlertContext.Provider value={{ alert, setAlert, clearAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
