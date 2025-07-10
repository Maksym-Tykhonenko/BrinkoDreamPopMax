import React, {useContext, useEffect, useState, useRef} from 'react';
import {View, Dimensions, Animated, ImageBackground, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {loadUserData} from '../redux/userSlice';
import {UserContext} from '../context/UserContext';

const BrinkoDreamPopLoadApp = () => {
  const navigation = useNavigation();
  const {setUser} = useContext(UserContext);
  const dispatch = useDispatch();
  const dimensions = Dimensions.get('window');

  const [isBrinkoDreamUserWas, setIsBrinkoDreamUserWas] = useState(false);
  const [isBrinkoDreamOnboardingLoade, setIsBrinkoDreamOnboardingLoade] =
    useState(false);

  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const logoPulse = useRef(new Animated.Value(1)).current;
  const logoGlow = useRef(new Animated.Value(0)).current;

  const ballAnims = useRef(
    Array.from({length: 15}, () => ({
      translateY: new Animated.Value(-100),
      translateX: new Animated.Value(0),
      scale: new Animated.Value(0),
      rotate: new Animated.Value(0),
      opacity: new Animated.Value(0),
    })),
  ).current;

  const transitionScale = useRef(new Animated.Value(1)).current;
  const transitionOpacity = useRef(new Animated.Value(1)).current;
  const backgroundZoom = useRef(new Animated.Value(1)).current;
  const spiralRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(logoGlow, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }),
    ]).start();

    const pulsing = Animated.loop(
      Animated.sequence([
        Animated.timing(logoPulse, {
          toValue: 1.1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(logoPulse, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
      ]),
    );
    pulsing.start();

    const rotating = Animated.loop(
      Animated.timing(logoRotate, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      }),
    );
    rotating.start();

    return () => {
      pulsing.stop();
      rotating.stop();
    };
  }, []);

  const createBallAnimations = () => {
    return ballAnims.map((ballAnim, index) => {
      const delay = index * 200;
      const endX = (Math.random() - 0.5) * dimensions.width * 1.5;

      return Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.spring(ballAnim.scale, {
            toValue: 1,
            tension: 120,
            friction: 6,
            useNativeDriver: true,
          }),
          Animated.timing(ballAnim.opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),

        Animated.parallel([
          Animated.timing(ballAnim.translateY, {
            toValue: dimensions.height + 100,
            duration: 2000 + Math.random() * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(ballAnim.translateX, {
            toValue: endX,
            duration: 2000 + Math.random() * 1000,
            useNativeDriver: true,
          }),
          Animated.loop(
            Animated.timing(ballAnim.rotate, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
          ),
        ]),
      ]);
    });
  };

  const logoRotateInterpolate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spiralRotateInterpolate = spiralRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '720deg'],
  });

  useEffect(() => {
    const brinkoDreamUserLoading = async () => {
      try {
        const deviceId = await DeviceInfo.getUniqueId();
        const storageKey = `currentUser_${deviceId}`;
        const isBrinkoDreamUserLoadedYet = await AsyncStorage.getItem(
          'isBrinkoDreamUserLoadedYet',
        );
        const storedBrinkoDreamUser = await AsyncStorage.getItem(storageKey);

        if (storedBrinkoDreamUser) {
          setUser(JSON.parse(storedBrinkoDreamUser));
          setIsBrinkoDreamUserWas(false);
        } else if (isBrinkoDreamUserLoadedYet) {
          setIsBrinkoDreamUserWas(false);
        } else {
          setIsBrinkoDreamUserWas(true);
          await AsyncStorage.setItem('isBrinkoDreamUserLoadedYet', 'true');
        }
      } catch (error) {
        console.error('Loading dream brinko pop user error: ', error);
      } finally {
        setIsBrinkoDreamOnboardingLoade(true);
      }
    };

    brinkoDreamUserLoading();
  }, [setUser]);

  useEffect(() => {
    dispatch(loadUserData());
  }, [dispatch]);

  useEffect(() => {
    if (isBrinkoDreamOnboardingLoade) {
      Animated.parallel(createBallAnimations()).start();

      const sweetTimer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(transitionScale, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(spiralRotate, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(backgroundZoom, {
            toValue: 3,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(transitionOpacity, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]).start();
      }, 8000);

      return () => clearTimeout(sweetTimer);
    }
  }, [isBrinkoDreamOnboardingLoade, isBrinkoDreamUserWas, navigation]);
  {
    /**() => {
          const brinkoDestinationDream = isBrinkoDreamUserWas ? 'BrinkoDreamOnboardingPop' : 'BrinkoDreamPopHome';
          navigation.replace(brinkoDestinationDream);
        } */
  }
  const renderPlinkoSBalls = () => {
    return ballAnims.map((ballAnim, index) => {
      const ballColor = [
        '#FF6B9D',
        '#4ECDC4',
        '#45B7D1',
        '#96CEB4',
        '#FECA57',
        '#FF9F43',
        '#EE5A24',
        '#0ABDE3',
        '#10AC84',
        '#F79F1F',
      ][index % 10];

      const rotateInterpolate = ballAnim.rotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
      });

      return (
        <Animated.View
          key={index}
          style={{
            position: 'absolute',
            top: -50,
            left: dimensions.width / 2 - 15 + (Math.random() - 0.5) * 100,
            width: 30,
            height: 30,
            backgroundColor: ballColor,
            borderRadius: 15,
            transform: [
              {translateY: ballAnim.translateY},
              {translateX: ballAnim.translateX},
              {scale: ballAnim.scale},
              {rotate: rotateInterpolate},
            ],
            opacity: ballAnim.opacity,
            shadowColor: ballColor,
            shadowOffset: {width: 0, height: 0},
            shadowOpacity: 0.8,
            shadowRadius: 10,
            elevation: 10,
          }}
        />
      );
    });
  };

  return (
    <Animated.View
      style={{
        alignItems: 'center',
        height: dimensions.height,
        justifyContent: 'center',
        width: dimensions.width,
        opacity: transitionOpacity,
        backgroundColor: '#0158eb',
        overflow: 'hidden',
      }}>
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: [{scale: backgroundZoom}],
        }}>
        <ImageBackground
          source={require('../assets/images/mainBrinkoBg.png')}
          style={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          resizeMode="cover"
        />
      </Animated.View>

      {renderPlinkoSBalls()}

      <Animated.View
        style={{
          transform: [
            {scale: Animated.multiply(logoScale, logoPulse, transitionScale)},
            {rotate: logoRotateInterpolate},
            {rotate: spiralRotateInterpolate},
          ],
        }}>
        <Animated.View
          style={{
            shadowColor: '#fff',
            shadowOffset: {width: 0, height: 0},
            shadowOpacity: logoGlow,
            shadowRadius: 20,
            elevation: 20,
          }}>
          <Image
            source={require('../assets/images/brinkoTextImage.png')}
            style={{
              width: dimensions.width * 0.8,
              height: dimensions.width * 0.8,
            }}
            resizeMode="contain"
          />
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
};

export default BrinkoDreamPopLoadApp;
