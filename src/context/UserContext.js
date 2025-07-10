import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const brinkoDreamLoadUser = async () => {
      try {
        const brinkoDreamLoadedUserFromStorage = await AsyncStorage.getItem('currentUser');
        if (brinkoDreamLoadedUserFromStorage) {
          setUser(JSON.parse(brinkoDreamLoadedUserFromStorage));
        }
      } catch (error) {
        console.error('Error of brinko dream user loading. You can see log: ', error);
      }
    };
    brinkoDreamLoadUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
