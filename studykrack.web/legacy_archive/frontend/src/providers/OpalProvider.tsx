'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type OpalContextType = {
  isOpalMode: boolean;
  toggleOpalMode: () => void;
};

const OpalContext = createContext<OpalContextType | undefined>(undefined);

export function OpalProvider({ children }: { children: React.ReactNode }) {
  const [isOpalMode, setIsOpalMode] = useState(false);

  useEffect(() => {
    // Persist Opal Mode preference
    const saved = localStorage.getItem('opal-mode');
    if (saved === 'true') setIsOpalMode(true);
  }, []);

  const toggleOpalMode = () => {
    const newVal = !isOpalMode;
    setIsOpalMode(newVal);
    localStorage.setItem('opal-mode', String(newVal));
  };

  return (
    <OpalContext.Provider value={{ isOpalMode, toggleOpalMode }}>
      <div className={isOpalMode ? 'opal-active' : ''}>
        {children}
      </div>
    </OpalContext.Provider>
  );
}

export function useOpal() {
  const context = useContext(OpalContext);
  if (context === undefined) {
    throw new Error('useOpal must be used within an OpalProvider');
  }
  return context;
}
