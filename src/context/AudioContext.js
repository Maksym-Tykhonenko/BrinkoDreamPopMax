import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [volume, setVolume] = useState(1.0); 

  useEffect(() => {
    const loadStoredDreamPopVolume = async () => {
      try {
        const storedStoredDreamPopVolume = await AsyncStorage.getItem('volume');
        if (storedStoredDreamPopVolume !== null) {
          setVolume(parseFloat(storedStoredDreamPopVolume));
        }
      } catch (error) {
        console.log('Error loading volume of the brinko dream pop :', error);
      }
    };
    loadStoredDreamPopVolume();
  }, []);

  const handleChangeBrinkoDreamPopVolume = async (thisVolume) => {
    try {
      await AsyncStorage.setItem('volume', thisVolume.toString());
      setVolume(thisVolume);
    } catch (error) {
      console.log('Error saving brinko volume:', error);
    }
  };

  return (
    <AudioContext.Provider value={{ volume, setVolume: handleChangeBrinkoDreamPopVolume }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
