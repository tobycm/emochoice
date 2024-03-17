import React, { FC, ReactNode, createContext, useContext, useEffect, useState } from "react";

type ATLState = {
  current: boolean;
  set: (state: boolean) => void;
};

const ATLStateContext = createContext<ATLState | undefined>(undefined);

export const ATLStateProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isPoppingOver, popATL] = useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  function popATLOver(newState: boolean) {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    popATL(newState);

    if (!newState) return;

    timeoutRef.current = setTimeout(() => popATL(false), 5000);
  }

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current);
    },
    [],
  );

  return <ATLStateContext.Provider value={{ current: isPoppingOver, set: popATLOver }}>{children}</ATLStateContext.Provider>;
};

export function useATLState() {
  const context = useContext(ATLStateContext);
  if (!context) throw new Error("useATLState must be used within an ATLStateProvider");
  return context;
}

// hail chatgpt
