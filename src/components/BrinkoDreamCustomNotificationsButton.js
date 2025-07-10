import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import FredokaOneText from './FredokaOneText';

const { width } = Dimensions.get('window');

const BrinkoDreamCustomNotificationsButton = ({
  brinkoButtonPropsLabel,
  onPress,
  buttonWidth = width * 0.8,
  buttonHeight = width * 0.275,
  fontSize = width * 0.053,
  isBrinkoNotification
}) => {
  const dimensions = Dimensions.get('window');
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.buttonContainer}>
      <ImageBackground
        source={isBrinkoNotification
          ? require('../assets/images/notificationsOnImage.png')
          : require('../assets/images/notificationsOffImage.png')
        }
        style={[styles.buttonBackground, {
          width: buttonWidth, height: buttonHeight,
          alignItems: 'flex-start', justifyContent: 'center', paddingHorizontal: dimensions.width * 0.05
        }]}
        resizeMode="stretch"
      >
        <Text style={{
          fontFamily: 'FredokaOne-Regular',
          fontSize: fontSize,
          color: 'white',
          textAlign: 'left',
          fontWeight: '700',
          letterSpacing: 1,
        }}>
          {brinkoButtonPropsLabel}
        </Text>
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

export default BrinkoDreamCustomNotificationsButton;