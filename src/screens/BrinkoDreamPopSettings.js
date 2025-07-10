import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    Dimensions,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    Image,
    Animated,
    Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BrinkoDreamCustomBlueButton from '../components/BrinkoDreamCustomBlueButton';
import AboutPageComponent from '../components/AboutPageComponent';
import BrinkoDreamCustomNotificationsButton from '../components/BrinkoDreamCustomNotificationsButton';

const BrinkoDreamPopSettings = ({ setBrinkoDreamScreenNow }) => {
    const dimensions = Dimensions.get('window');
    const styles = brinkoDreamStyles(dimensions);
    const [isAboutBrinkoVisible, setIsAboutBrinkoVisible] = useState(false);
    const [isBrinkoNotifications, setIsBrinkoNotifications] = useState(false);

    // Анімації для ripple ефекту
    const rippleScale = useRef(new Animated.Value(0)).current;
    const rippleOpacity = useRef(new Animated.Value(0)).current;
    const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 });

    // Анімації для переходу
    const aboutScale = useRef(new Animated.Value(0)).current;
    const aboutOpacity = useRef(new Animated.Value(0)).current;
    const overlayOpacity = useRef(new Animated.Value(0)).current;

    // Завантаження налаштувань notifications при завантаженні компонента
    useEffect(() => {
        loadBrinkoNotificationsSettings();
    }, []);

    const loadBrinkoNotificationsSettings = async () => {
        try {
            const brinkoNotificationsValue = await AsyncStorage.getItem('brinkoNotifications');
            if (brinkoNotificationsValue !== null) {
                setIsBrinkoNotifications(JSON.parse(brinkoNotificationsValue));
            } else {
                // Встановлюємо true за замовчуванням, якщо налаштування відсутні
                setIsBrinkoNotifications(true);
                await AsyncStorage.setItem('brinkoNotifications', JSON.stringify(true));
            }
        } catch (error) {
            console.error("Error loading notifications settings:", error);
        }
    };

    const toggleBrinkoNotifications = async () => {
        try {
            const newNotificationsState = !isBrinkoNotifications;
            setIsBrinkoNotifications(newNotificationsState);
            await AsyncStorage.setItem('brinkoNotifications', JSON.stringify(newNotificationsState));
        } catch (error) {
            console.error("Error saving notifications settings:", error);
        }
    };

    const openAboutPage = (touchPosition) => {
        setRipplePosition(touchPosition);

        // Ripple анімація
        Animated.parallel([
            Animated.timing(rippleScale, {
                toValue: 8,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.sequence([
                Animated.timing(rippleOpacity, {
                    toValue: 0.8,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(rippleOpacity, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]),
        ]).start(() => {
            rippleScale.setValue(0);
            rippleOpacity.setValue(0);
        });

        setTimeout(() => {
            setIsAboutBrinkoVisible(true);
            Animated.parallel([
                Animated.timing(overlayOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(aboutScale, {
                    toValue: 1,
                    tension: 100,
                    friction: 8,
                    useNativeDriver: true,
                }),
                Animated.timing(aboutOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]).start();
        }, 300);
    };

    const closeAboutPage = () => {
        // Центрована позиція для закриття
        setRipplePosition({
            x: dimensions.width / 2,
            y: dimensions.height / 2
        });

        // Ripple анімація
        Animated.parallel([
            Animated.timing(rippleScale, {
                toValue: 6,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.sequence([
                Animated.timing(rippleOpacity, {
                    toValue: 0.6,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(rippleOpacity, {
                    toValue: 0,
                    duration: 350,
                    useNativeDriver: true,
                }),
            ]),
        ]).start(() => {
            rippleScale.setValue(0);
            rippleOpacity.setValue(0);
        });

        Animated.parallel([
            Animated.timing(aboutScale, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(aboutOpacity, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(overlayOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setIsAboutBrinkoVisible(false);
        });
    };

    return (
        <View style={{ flex: 1 }}>
            {/* Ripple ефект */}
            <Animated.View
                style={{
                    position: 'absolute',
                    top: ripplePosition.y - 30,
                    left: ripplePosition.x - 30,
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    borderWidth: 2,
                    borderColor: 'rgba(255, 255, 255, 0.6)',
                    transform: [{ scale: rippleScale }],
                    opacity: rippleOpacity,
                    zIndex: 2,
                    pointerEvents: 'none',
                }}
            />

            {/* Оверлей */}
            {isAboutBrinkoVisible && (
                <Animated.View
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.41)',
                        width: dimensions.width,
                        height: dimensions.height,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1,
                        opacity: overlayOpacity,
                        pointerEvents: 'none',
                    }}
                />
            )}

            <SafeAreaView style={{ zIndex: 10 }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: dimensions.width * 0.05,
                    width: dimensions.width,
                }}>
                    <TouchableOpacity
                        style={{ zIndex: 11 }}
                        onPress={() => {
                            if (isAboutBrinkoVisible) {
                                closeAboutPage();
                            } else {
                                setBrinkoDreamScreenNow('BrinkoHomeDream');
                            }
                        }}
                    >
                        <Image
                            source={require('../assets/icons/goBackBtnIcon.png')}
                            style={{
                                width: dimensions.height * 0.07,
                                height: dimensions.height * 0.07,
                            }}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>

                    <Text style={{
                        fontFamily: 'FredokaOne-Regular',
                        fontSize: dimensions.width * 0.07,
                        color: 'white',
                        textAlign: 'left',
                        fontWeight: '700',
                        letterSpacing: 1,
                    }}>
                        {!isAboutBrinkoVisible ? 'Settings' : 'About'}
                    </Text>

                    <Image
                        source={require('../assets/icons/goBackBtnIcon.png')}
                        style={{
                            width: dimensions.height * 0.07,
                            height: dimensions.height * 0.07,
                            opacity: 0
                        }}
                        resizeMode='contain'
                    />
                </View>
            </SafeAreaView>

            {!isAboutBrinkoVisible ? (
                <>
                    <View style={{ alignSelf: 'center' }}>
                        <BrinkoDreamCustomNotificationsButton
                            brinkoButtonPropsLabel={'Notifications'}
                            buttonWidth={dimensions.width * 0.77}
                            buttonHeight={dimensions.height * 0.091}
                            isBrinkoNotification={isBrinkoNotifications}
                            fontSize={dimensions.width * 0.059}
                            onPress={() => {
                                toggleBrinkoNotifications();
                            }}
                        />
                    </View>

                    <View style={{ alignSelf: 'center' }}>
                        <BrinkoDreamCustomBlueButton
                            brinkoButtonPropsLabel={'About'}
                            buttonWidth={dimensions.width * 0.77}
                            buttonHeight={dimensions.height * 0.091}
                            fontSize={dimensions.width * 0.059}
                            onPress={(event) => {
                                const { pageX, pageY } = event.nativeEvent;
                                openAboutPage({ x: pageX, y: pageY });
                            }}
                        />
                    </View>

                    <View style={{ alignSelf: 'center' }}>
                        <BrinkoDreamCustomBlueButton
                            brinkoButtonPropsLabel={'Terms of Use'}
                            buttonWidth={dimensions.width * 0.77}
                            buttonHeight={dimensions.height * 0.091}
                            fontSize={dimensions.width * 0.059}
                            onPress={() => {
                                Linking.openURL('https://www.termsfeed.com/live/0847dca5-14e3-483a-a0c4-5fe4181da3e0');
                            }}
                        />
                    </View>
                </>
            ) : (
                <Animated.View
                    style={{
                        flex: 1,
                        transform: [{ scale: aboutScale }],
                        opacity: aboutOpacity,
                        zIndex: 3,
                    }}
                >
                    <AboutPageComponent setIsAboutBrinkoVisible={closeAboutPage} />
                </Animated.View>
            )}
        </View>
    );
};

const brinkoDreamStyles = (dimensions) => StyleSheet.create({
});

export default BrinkoDreamPopSettings;