import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Image,
  Dimensions,
  SafeAreaView,
  Platform,
  Animated,
  Text,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import BrinkoDreamPopSettings from './BrinkoDreamPopSettings';
import Sound from 'react-native-sound';
import { useAudio } from '../context/AudioContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BrinkoDreamCustomButton from '../components/BrinkoDreamCustomButton';
import BrinkoDreamPopDreamRoom from './BrinkoDreamPopDreamRoom';
import BrinkoDreamPopShop from './BrinkoDreamPopShop';
import LinearGradient from 'react-native-linear-gradient';
import BrinkoDreamPopPlayGame from './BrinkoDreamPopPlayGame';

const BrinkoDreamButtonsPop = [
  {
    id: 1,
    brinkoDreamButtonTitle: 'Start',
  },
  {
    id: 2,
    brinkoDreamButtonTitle: 'Dream Room',
  },
];

const getBrinkoBottomButtons = () => {
  const buttons = [
    {
      id: 1,
      brinkoBottomButtonName: 'Shop',
      brinkoBottomButtonIcon: require('../assets/icons/cartIcon.png'),
    },
    {
      id: 3,
      brinkoBottomButtonName: 'Settings',
      brinkoBottomButtonIcon: require('../assets/icons/settingsIcon.png'),
    },
  ];

  if (Platform.OS === 'ios') {
    buttons.splice(1, 0, {
      id: 2,
      brinkoBottomButtonName: 'Volume',
      brinkoBottomButtonIcon: require('../assets/icons/volumeOnIcon.png'),
      brinkoBottomButtonIconOff: require('../assets/icons/volumeOfIcon.png'),
    });
  }

  return buttons;
};

const brinkoBackgrounds = [
  {
    id: 1,
    image: require('../assets/images/mainBrinkoBg.png'),
    title: 'Cotton Sky',
  },
  {
    id: 2,
    image: require('../assets/images/secondBrinkoBg.png'),
    title: 'Candy Nebula',
    price: 18,
  },
];

const BrinkoDreamPopHome = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [brinkoDreamScreenNow, setBrinkoDreamScreenNow] = useState('BrinkoHomeDream');
  const [currentBackground, setCurrentBackground] = useState(brinkoBackgrounds[0]);
  const [ownedBrinkoStars, setOwnedBrinkoStars] = useState(0);

  useEffect(() => {
    const loadOwnedBrinkoStars = async () => {
      try {
        const starsValue = await AsyncStorage.getItem('ownedBrinkoStars');
        if (starsValue !== null) {
          setOwnedBrinkoStars(JSON.parse(starsValue));
        } else {
          await AsyncStorage.setItem('ownedBrinkoStars', JSON.stringify(0));
          setOwnedBrinkoStars(0);
        }

      } catch (error) {
        console.error("Error loading shop data:", error);
      }
    };

    loadOwnedBrinkoStars();
  }, [brinkoDreamScreenNow]);

  const fadeAnim = useState(new Animated.Value(1))[0];
  const scaleAnim = useState(new Animated.Value(1))[0];

  const cascadeBalls = useRef(
    Array.from({ length: 20 }, () => ({
      translateY: new Animated.Value(-100),
      translateX: new Animated.Value(0),
      scale: new Animated.Value(0),
      rotate: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current;

  const screenSlideY = useRef(new Animated.Value(0)).current;
  const bounceScale = useRef(new Animated.Value(1)).current;

  const rippleScale = useRef(new Animated.Value(0)).current;
  const rippleOpacity = useRef(new Animated.Value(0)).current;
  const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 });

  const [sound, setSound] = useState(null);
  const { volume } = useAudio();
  const [brinkoDreamIdOfTrack, setBrinkoDreamIdOfTrack] = useState(0);
  const [isBrinkoDreamMusicOn, setIsBrinkoDreamMusicOn] = useState(true);

  const brinkoDreamTracks = ['playful-music.wav', 'playful-music.wav'];

  const loadCurrentBrinkoDreamBackground = async () => {
    try {
      const bgIdValue = await AsyncStorage.getItem('brinkoBgId');
      if (bgIdValue !== null) {
        const bgId = JSON.parse(bgIdValue);
        const background = brinkoBackgrounds.find((bg) => bg.id === bgId);
        if (background) {
          setCurrentBackground(background);
        }
      }
    } catch (error) {
      console.error('Error loading current background:', error);
    }
  };

  useEffect(() => {
    loadCurrentBrinkoDreamBackground();
  }, []);

  useEffect(() => {
    if (brinkoDreamScreenNow === 'BrinkoHomeDream') {
      loadCurrentBrinkoDreamBackground();
    }
  }, [brinkoDreamScreenNow]);

  useEffect(() => {
    brinkoDreamTrack(brinkoDreamIdOfTrack);

    return () => {
      if (sound) {
        sound.stop(() => {
          sound.release();
        });
      }
    };
  }, [brinkoDreamIdOfTrack]);

  useEffect(() => {
    if (sound) {
      sound.setVolume(volume);
    }
  }, [volume]);

  const brinkoDreamTrack = (index) => {
    if (sound) {
      sound.stop(() => {
        sound.release();
      });
    }

    const newBrinkoDreamTrack = new Sound(brinkoDreamTracks[index], Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Error brinko dream pop loading track: ', error);
        return;
      }
      newBrinkoDreamTrack.setVolume(volume);
      newBrinkoDreamTrack.play((success) => {
        if (success) {
          setBrinkoDreamIdOfTrack((prevIndex) => (prevIndex + 1) % brinkoDreamTracks.length);
        } else {
          console.log('Error brinko dream pop playing track');
        }
      });
      setSound(newBrinkoDreamTrack);
    });
  };

  const loadBrinkoDreamIsMusic = async () => {
    try {
      const brinkoDreamIsMusicValue = await AsyncStorage.getItem('isBrinkoDreamMusicOn');
      if (brinkoDreamIsMusicValue !== null) {
        const isBrinkoDreamMusicOn = JSON.parse(brinkoDreamIsMusicValue);
        setIsBrinkoDreamMusicOn(isBrinkoDreamMusicOn);
        if (sound) {
          sound.setVolume(isBrinkoDreamMusicOn ? volume : 0);
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  useEffect(() => {
    const setVolumeBasedOnBrinkoDreamMusic = async () => {
      try {
        const brinkoDreamIsMusicValue = await AsyncStorage.getItem('isBrinkoDreamMusicOn');
        if (brinkoDreamIsMusicValue !== null) {
          const isBrinkoDreamMusicOn = JSON.parse(brinkoDreamIsMusicValue);
          setIsBrinkoDreamMusicOn(isBrinkoDreamMusicOn);
          if (sound) {
            sound.setVolume(isBrinkoDreamMusicOn ? volume : 0);
          }
        }
      } catch (error) {
        console.error('Error setting volume based on music enabled:', error);
      }
    };

    setVolumeBasedOnBrinkoDreamMusic();
  }, [sound, volume]);

  useEffect(() => {
    if (sound) {
      sound.setVolume(isBrinkoDreamMusicOn ? volume : 0);
    }
  }, [volume, isBrinkoDreamMusicOn]);

  useEffect(() => {
    loadBrinkoDreamIsMusic();
  }, [brinkoDreamScreenNow]);

  const createCascadeBallAnimations = () => {
    return cascadeBalls.map((ball, index) => {
      const row = Math.floor(index / 5);
      const col = index % 5;
      const startX = col * (dimensions.width / 4) + dimensions.width * 0.1;
      const endX = startX + (Math.random() - 0.5) * 150;
      const delay = row * 150 + col * 100;

      return Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.spring(ball.scale, {
            toValue: 1,
            tension: 200,
            friction: 6,
            useNativeDriver: true,
          }),
          Animated.timing(ball.opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(ball.translateY, {
            toValue: dimensions.height + 100,
            duration: 1500 + Math.random() * 500,
            useNativeDriver: true,
          }),
          Animated.timing(ball.translateX, {
            toValue: endX - startX,
            duration: 1500 + Math.random() * 500,
            useNativeDriver: true,
          }),
          Animated.loop(
            Animated.timing(ball.rotate, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            { iterations: -1 }
          ),
        ]),
      ]);
    });
  };

  const brinkoDreamAnimationOfTransition = (newScreen) => {
    const randomX = Math.random() * dimensions.width;
    const randomY = Math.random() * dimensions.height;
    setRipplePosition({ x: randomX, y: randomY });

    Animated.sequence([
      Animated.timing(bounceScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(bounceScale, {
        toValue: 1,
        tension: 300,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.parallel([
      Animated.timing(rippleScale, {
        toValue: 8,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(rippleOpacity, {
          toValue: 0.7,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(rippleOpacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      rippleScale.setValue(0);
      rippleOpacity.setValue(0);
    });

    setTimeout(() => {
      Animated.parallel(createCascadeBallAnimations()).start();
    }, 200);

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(screenSlideY, {
          toValue: -dimensions.height,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setBrinkoDreamScreenNow(newScreen);

        screenSlideY.setValue(dimensions.height);

        cascadeBalls.forEach((ball) => {
          ball.translateY.setValue(-100);
          ball.translateX.setValue(0);
          ball.scale.setValue(0);
          ball.opacity.setValue(0);
          ball.rotate.setValue(0);
        });

        Animated.parallel([
          Animated.spring(screenSlideY, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 600);
  };

  const renderCascadeBalls = () => {
    return cascadeBalls.map((ball, index) => {
      const ballColors = [
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
        '#E056FD',
        '#FF6B6B',
        '#4ECDC4',
        '#45B7D1',
        '#FFD93D',
        '#6C5CE7',
        '#A29BFE',
        '#FD79A8',
        '#00B894',
        '#E17055',
      ];

      const rotateInterpolate = ball.rotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
      });

      const ballSize = 20 + Math.random() * 15;

      return (
        <Animated.View
          key={index}
          style={{
            position: 'absolute',
            top: -50,
            left: (index % 5) * (dimensions.width / 4) + dimensions.width * 0.1,
            width: ballSize,
            height: ballSize,
            backgroundColor: ballColors[index],
            borderRadius: ballSize / 2,
            transform: [
              { translateY: ball.translateY },
              { translateX: ball.translateX },
              { scale: ball.scale },
              { rotate: rotateInterpolate },
            ],
            opacity: ball.opacity,
            shadowColor: ballColors[index],
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 6,
            elevation: 10,
            borderWidth: 2,
            borderColor: 'rgba(255, 255, 255, 0.3)',
          }}
        />
      );
    });
  };

  const renderAnimatedScreen = (screen) => {
    return (
      <Animated.View
        style={[
          { flex: 1 },
          {
            transform: [{ translateY: screenSlideY }, { scale: bounceScale }],
            opacity: fadeAnim,
          },
        ]}
      >
        {screen}
      </Animated.View>
    );
  };

  return (
    <View
      style={{
        backgroundColor: '#FED9D3',
        width: '100%',
        height: dimensions.height,
        flex: 1,
        overflow: 'hidden',
      }}
    >
      <ImageBackground
        source={currentBackground.image}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        resizeMode="cover"
      />

      <Animated.View
        style={{
          position: 'absolute',
          top: ripplePosition.y - 30,
          left: ripplePosition.x - 30,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          borderWidth: 2,
          borderColor: 'rgba(255, 255, 255, 0.5)',
          transform: [{ scale: rippleScale }],
          opacity: rippleOpacity,
          zIndex: 3,
        }}
      />

      <View style={{
        marginTop: Platform.OS === 'android' ? dimensions.height * 0.04 : 0
      }}/>

      <View style={{ position: 'absolute', zIndex: 5 }}>{renderCascadeBalls()}</View>

      {brinkoDreamScreenNow === 'BrinkoHomeDream' ? (
        renderAnimatedScreen(
          <SafeAreaView
            style={{
              flex: 1,
              alignItems: 'center',
              marginTop: Platform.OS === 'android' ? dimensions.height * 0.03 : 0,
            }}
          >
            <View style={{
              width: dimensions.width * 0.3,
              height: dimensions.height * 0.059,
              backgroundColor: '#85DAFF',
              borderRadius: dimensions.height * 0.5,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              borderWidth: dimensions.width * 0.014,
              borderColor: '#85DAFF',
              flexDirection: 'row',
            }}>
              <LinearGradient
                colors={['#0087F0', '#0058C2', '#00489E']}
                style={{
                  width: '100%',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />

              <Image
                source={require('../assets/icons/starIcon.png')}
                style={{
                  width: dimensions.height * 0.031,
                  height: dimensions.height * 0.031,
                  marginRight: dimensions.width * 0.02,
                }}
              />
              <Text style={{
                fontFamily: 'FredokaOne-Regular',
                fontSize: dimensions.width * 0.061,
                color: 'white',
                textAlign: 'center',
                fontWeight: '700',
                letterSpacing: 1,
              }}>
                {ownedBrinkoStars}
              </Text>
            </View>

            <Image
              source={require('../assets/images/brinkoTextImage.png')}
              style={{
                width: dimensions.width * 0.8,
                height: dimensions.height * 0.25,
                alignSelf: 'center',
                marginTop: dimensions.height * 0.02,
              }}
              resizeMode="contain"
            />

            <View
              style={{
                marginTop: dimensions.height * 0.08,
              }}
            />

            {BrinkoDreamButtonsPop.map((brinkoButton, index) => (
              <BrinkoDreamCustomButton
                key={index}
                brinkoButtonPropsLabel={brinkoButton.brinkoDreamButtonTitle}
                buttonWidth={dimensions.width * 0.77}
                buttonHeight={dimensions.height * 0.091}
                fontSize={dimensions.width * 0.059}
                onPress={() => {
                  brinkoDreamAnimationOfTransition(brinkoButton.brinkoDreamButtonTitle);
                }}
              />
            ))}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                bottom: dimensions.height * 0.08,
              }}
            >
              {getBrinkoBottomButtons().map((brinkoBottomButton, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    marginHorizontal: dimensions.width * 0.02,
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    if (brinkoBottomButton.brinkoBottomButtonName === 'Shop') {
                      brinkoDreamAnimationOfTransition('Shop');
                    } else if (brinkoBottomButton.brinkoBottomButtonName === 'Volume') {
                      setIsBrinkoDreamMusicOn(!isBrinkoDreamMusicOn);
                      AsyncStorage.setItem('isBrinkoDreamMusicOn', JSON.stringify(!isBrinkoDreamMusicOn));
                    } else if (brinkoBottomButton.brinkoBottomButtonName === 'Settings') {
                      brinkoDreamAnimationOfTransition('SETTINGS');
                    }
                  }}
                >
                  <Image
                    source={
                      isBrinkoDreamMusicOn && brinkoBottomButton.brinkoBottomButtonName === 'Volume'
                        ? brinkoBottomButton.brinkoBottomButtonIcon
                        : brinkoBottomButton.brinkoBottomButtonIconOff ||
                        brinkoBottomButton.brinkoBottomButtonIcon
                    }
                    style={{
                      width: dimensions.height * 0.08,
                      height: dimensions.height * 0.08,
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </SafeAreaView>
        )
      ) : brinkoDreamScreenNow === 'SETTINGS' ? (
        renderAnimatedScreen(
          <BrinkoDreamPopSettings
            setBrinkoDreamScreenNow={brinkoDreamAnimationOfTransition}
            isBrinkoDreamMusicOn={isBrinkoDreamMusicOn}
            setIsBrinkoDreamMusicOn={setIsBrinkoDreamMusicOn}
          />
        )
      ) : brinkoDreamScreenNow === 'Dream Room' ? (
        renderAnimatedScreen(
          <BrinkoDreamPopDreamRoom setBrinkoDreamScreenNow={brinkoDreamAnimationOfTransition} />
        )
      ) : brinkoDreamScreenNow === 'Shop' ? (
        renderAnimatedScreen(
          <BrinkoDreamPopShop setBrinkoDreamScreenNow={brinkoDreamAnimationOfTransition} currentBackground={currentBackground} setCurrentBackground={setCurrentBackground}
          />
        )
      ) : brinkoDreamScreenNow === 'Start' ? (
        renderAnimatedScreen(
          <BrinkoDreamPopPlayGame setBrinkoDreamScreenNow={brinkoDreamAnimationOfTransition} ownedBrinkoStars={ownedBrinkoStars} setOwnedBrinkoStars={setOwnedBrinkoStars} />
        )
      ) : null}
    </View>
  );
};

export default BrinkoDreamPopHome;
