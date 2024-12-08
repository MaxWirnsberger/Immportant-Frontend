import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

interface SelectedRealEstateContextType {
  selectedRealEstateId: string | null;
  setSelectedRealEstateId: (id: string | null) => void;
}

const SelectedRealEstateContext = createContext<SelectedRealEstateContextType | undefined>(undefined);

export const SelectedRealEstateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedRealEstateId, setSelectedRealEstateIdState] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const storedId = sessionStorage.getItem('selectedRealEstateId');
      return storedId ? storedId : null;
    }
    return null;
  });

  const router = useRouter();

  const setSelectedRealEstateId = (id: string | null) => {
    setSelectedRealEstateIdState(id);
    if (typeof window !== 'undefined') {
      if (id) {
        sessionStorage.setItem('selectedRealEstateId', id);
      } else {
        sessionStorage.removeItem('selectedRealEstateId');
      }
    }
  };

  useEffect(() => {
    if (!selectedRealEstateId && router.pathname !== '/app/realEstates') {
      router.push('/app/realEstates');
    }
  }, [selectedRealEstateId, router]);

  return (
    <SelectedRealEstateContext.Provider value={{ selectedRealEstateId, setSelectedRealEstateId }}>
      {children}
    </SelectedRealEstateContext.Provider>
  );
};

export const useSelectedRealEstate = () => {
  const context = useContext(SelectedRealEstateContext);
  if (!context) {
    throw new Error('useSelectedRealEstate must be used within a SelectedRealEstateProvider');
  }
  return context;
};
