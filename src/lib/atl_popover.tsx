import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";

type ATLStateType = {
  isATLPopover: boolean;
  setATLPopover: (value: boolean) => void;
};

const ATLStateContext = createContext<ATLStateType | undefined>(undefined);

export const ATLStateProvider: React.FC<ReactNode> = ({ children }) => {
  const [isATLPopover, setIsATLPopover] = useState<boolean>(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const setATLPopover = (value: boolean) => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setIsATLPopover(value);

    if (value) {
      timeoutRef.current = setTimeout(() => {
        setIsATLPopover(false);
      }, 5000);
    }
  };

  const contextValue: ATLStateType = {
    isATLPopover,
    setATLPopover,
  };
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return <ATLStateContext.Provider value={contextValue}>{children}</ATLStateContext.Provider>;
};

export const useATLState = () => {
  const context = useContext(ATLStateContext);
  if (!context) {
    throw new Error("useATLState must be used within an ATLStateProvider");
  }
  return context;
};

// hail chatgpt
