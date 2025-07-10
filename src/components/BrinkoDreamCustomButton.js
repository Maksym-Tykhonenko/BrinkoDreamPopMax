import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import FredokaOneText from './FredokaOneText';

const { width } = Dimensions.get('window');

const BrinkoDreamCustomButton = ({
  brinkoButtonPropsLabel,
  onPress,
  buttonWidth = width * 0.8, 
  buttonHeight = width * 0.275, 
  fontSize = width * 0.053,   
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.buttonContainer}>
      <ImageBackground
        source={require('../assets/images/beautifulButtonImage.png')} 
        style={[styles.buttonBackground, { width: buttonWidth, height: buttonHeight,
          alignItems: 'center', justifyContent: 'center',
         }]}
        resizeMode="stretch"
      >
        <FredokaOneText
          fontSize={fontSize}
          color="white"
          strokeColor="#0F4B94"
          strokeWidth={2}
        >
          {brinkoButtonPropsLabel}
        </FredokaOneText>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    margin: 8,
  },
  buttonBackground: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'FredokaOne-Regular',
    textAlign: 'center',
    fontWeight: '700',
    color: 'white',
    letterSpacing: 1,
  },
});

export default BrinkoDreamCustomButton;