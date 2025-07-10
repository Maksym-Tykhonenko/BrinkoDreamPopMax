import React from 'react';
import { Text, StyleSheet, View } from 'react-native';

const FredokaOneText = ({ 
  children, 
  fontSize, 
  color = 'white', 
  strokeColor = '#0F4B94',
  strokeWidth = 2,
  style,
  ...props 
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* Контур тексту - 8 напрямків */}
      <Text style={[styles.baseText, styles.strokeText, { 
        fontSize, 
        color: strokeColor,
        textShadowOffset: { width: -strokeWidth, height: 0 },
        textShadowColor: strokeColor,
        textShadowRadius: 0
      }]} {...props}>
        {children}
      </Text>
      <Text style={[styles.baseText, styles.strokeText, { 
        fontSize, 
        color: strokeColor,
        textShadowOffset: { width: strokeWidth, height: 0 },
        textShadowColor: strokeColor,
        textShadowRadius: 0
      }]} {...props}>
        {children}
      </Text>
      <Text style={[styles.baseText, styles.strokeText, { 
        fontSize, 
        color: strokeColor,
        textShadowOffset: { width: 0, height: -strokeWidth },
        textShadowColor: strokeColor,
        textShadowRadius: 0
      }]} {...props}>
        {children}
      </Text>
      <Text style={[styles.baseText, styles.strokeText, { 
        fontSize, 
        color: strokeColor,
        textShadowOffset: { width: 0, height: strokeWidth },
        textShadowColor: strokeColor,
        textShadowRadius: 0
      }]} {...props}>
        {children}
      </Text>
      <Text style={[styles.baseText, styles.strokeText, { 
        fontSize, 
        color: strokeColor,
        textShadowOffset: { width: -strokeWidth/1.4, height: -strokeWidth/1.4 },
        textShadowColor: strokeColor,
        textShadowRadius: 0
      }]} {...props}>
        {children}
      </Text>
      <Text style={[styles.baseText, styles.strokeText, { 
        fontSize, 
        color: strokeColor,
        textShadowOffset: { width: strokeWidth/1.4, height: -strokeWidth/1.4 },
        textShadowColor: strokeColor,
        textShadowRadius: 0
      }]} {...props}>
        {children}
      </Text>
      <Text style={[styles.baseText, styles.strokeText, { 
        fontSize, 
        color: strokeColor,
        textShadowOffset: { width: -strokeWidth/1.4, height: strokeWidth/1.4 },
        textShadowColor: strokeColor,
        textShadowRadius: 0
      }]} {...props}>
        {children}
      </Text>
      <Text style={[styles.baseText, styles.strokeText, { 
        fontSize, 
        color: strokeColor,
        textShadowOffset: { width: strokeWidth/1.4, height: strokeWidth/1.4 },
        textShadowColor: strokeColor,
        textShadowRadius: 0
      }]} {...props}>
        {children}
      </Text>
      
      {/* Основний текст */}
      <Text style={[styles.baseText, styles.mainText, { fontSize, color }]} {...props}>
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    fontFamily: 'FredokaOne-Regular',
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 1,
  },
  strokeText: {
    position: 'absolute',
    padding: 10
  },
  mainText: {
    position: 'absolute',
    padding: 10
  },
});

export default FredokaOneText;