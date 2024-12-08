// contexts/userContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { useRouter } from 'next/router';

interface User {
  firstname: string;
  lastname: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/auth/login/');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/user/profile/');
        setUser(response.data);
      } catch (error) {
        console.error('Fehler beim Abrufen der Benutzerdaten:', error);
        setUser(null);
        router.push('/auth/login/');
      }
    };

    fetchUserData();
  }, [router]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser muss innerhalb eines UserProviders verwendet werden');
  }
  return context;
};
