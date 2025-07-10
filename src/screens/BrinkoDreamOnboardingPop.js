import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Dimensions, ImageBackground, TouchableWithoutFeedback, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BrinkoDreamCustomButton from '../components/BrinkoDreamCustomButton';

const BrinkoDreamOnboardingPop = () => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [showTransition, setShowTransition] = useState(false);
    const navigation = useNavigation();
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    
    const bubbleAnims = useRef(Array.from({ length: 12 }, () => new Animated.Value(0))).current;
    const starAnims = useRef(Array.from({ length: 8 }, () => new Animated.Value(0))).current;
    const overlayFade = useRef(new Animated.Value(0)).current;
    const sparkleRotate = useRef(new Animated.Value(0)).current;
    
    const backgroundScale = useRef(new Animated.Value(1)).current;
    const backgroundFade = useRef(new Animated.Value(1)).current;
    const contentScale = useRef(new Animated.Value(1)).current;
    const contentFade = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const onChange = ({ window }) => {
            setDimensions(window);
        };
        const dimensionListener = Dimensions.addEventListener('change', onChange);
        return () => {
            dimensionListener.remove();
        };
    }, []);

    const createBubbleAnimations = () => {
        return bubbleAnims.map((anim, index) => 
            Animated.sequence([
                Animated.delay(index * 100),
                Animated.parallel([
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            ])
        );
    };

    const createStarAnimations = () => {
        return starAnims.map((anim, index) => 
            Animated.sequence([
                Animated.delay(index * 150),
                Animated.timing(anim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ])
        );
    };

    const handleGoToBrinkoApp = () => {
        setShowTransition(true);

        Animated.sequence([
            Animated.parallel([
                Animated.timing(scaleAnim, { toValue: 1.1, duration: 150, useNativeDriver: true }),
                Animated.timing(fadeAnim, { toValue: 0.8, duration: 150, useNativeDriver: true }),
            ]),
            Animated.parallel([
                Animated.timing(scaleAnim, { toValue: 0.95, duration: 150, useNativeDriver: true }),
                Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
            ]),
        ]).start();

        Animated.parallel([
            Animated.timing(overlayFade, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),

            Animated.sequence([
                Animated.delay(200),
                Animated.parallel([
                    Animated.timing(backgroundScale, {
                        toValue: 3.5, 
                        duration: 1200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(backgroundFade, {
                        toValue: 0.3, 
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            ]),
            Animated.sequence([
                Animated.delay(100),
                Animated.parallel([
                    Animated.timing(contentScale, {
                        toValue: 0.8,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                    Animated.timing(contentFade, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ])
            ]),

            Animated.loop(
                Animated.timing(sparkleRotate, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                })
            ),

            Animated.parallel(createBubbleAnimations()),

            Animated.parallel(createStarAnimations()),
        ]).start();

        setTimeout(() => {
            Animated.parallel([
                Animated.timing(backgroundScale, {
                    toValue: 10,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(backgroundFade, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(overlayFade, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                navigation.replace('BrinkoDreamPopHome');
            });
        }, 1800);
    };

    const renderBubbles = () => {
        return bubbleAnims.map((anim, index) => {
            const translateY = anim.interpolate({
                inputRange: [0, 1],
                outputRange: [dimensions.height + 100, -100],
            });
            
            const translateX = anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, (index % 2 === 0 ? 1 : -1) * (Math.random() * 100 + 50)],
            });

            const scale = anim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 1.2, 0.8],
            });

            return (
                <Animated.View
                    key={index}
                    style={{
                        position: 'absolute',
                        left: (dimensions.width / 12) * index + Math.random() * 50,
                        bottom: 0,
                        width: 20 + Math.random() * 30,
                        height: 20 + Math.random() * 30,
                        backgroundColor: ['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57'][index % 5],
                        borderRadius: 25,
                        transform: [
                            { translateY },
                            { translateX },
                            { scale }
                        ],
                        opacity: 0.8,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                        elevation: 5,
                    }}
                />
            );
        });
    };

    const renderStars = () => {
        return starAnims.map((anim, index) => {
            const rotate = sparkleRotate.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
            });

            const scale = anim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 1.5, 0],
            });

            const opacity = anim.interpolate({
                inputRange: [0, 0.3, 0.7, 1],
                outputRange: [0, 1, 1, 0],
            });

            return (
                <Animated.Text
                    key={index}
                    style={{
                        position: 'absolute',
                        left: Math.random() * dimensions.width,
                        top: Math.random() * dimensions.height,
                        fontSize: 20 + Math.random() * 20,
                        color: ['#FFD700', '#FF69B4', '#00CED1', '#FF6347'][index % 4],
                        textShadowColor: 'rgba(0, 0, 0, 0.5)',
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 3,
                        transform: [
                            { rotate },
                            { scale }
                        ],
                        opacity,
                    }}
                >
                    ⭐
                </Animated.Text>
            );
        });
    };

    return (
        <TouchableWithoutFeedback>
            <View style={{ flex: 1, backgroundColor: 'rgba(0, 8, 225, 1)' }}>
                <Animated.View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    transform: [
                        { scale: backgroundScale }
                    ],
                    opacity: backgroundFade,
                }}>
                    <ImageBackground
                        source={require('../assets/images/onboardingImage.png')}
                        style={{
                            flex: 1,
                            width: '100%',
                            height: '100%',
                        }}
                        resizeMode="cover"
                    />
                </Animated.View>

                <Animated.View style={{
                    position: 'absolute',
                    bottom: dimensions.height * 0.03,
                    alignSelf: 'center',
                    transform: [
                        { scale: Animated.multiply(scaleAnim, contentScale) }
                    ],
                    opacity: Animated.multiply(fadeAnim, contentFade),
                }}>
                    <BrinkoDreamCustomButton
                        brinkoButtonPropsLabel={'Start'}
                        buttonWidth={dimensions.width * 0.77}
                        buttonHeight={dimensions.height * 0.091}
                        fontSize={dimensions.width * 0.059}
                        onPress={handleGoToBrinkoApp}
                    />
                </Animated.View>

                {showTransition && (
                    <Animated.View style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(138, 43, 226, 0.2)',
                        opacity: overlayFade,
                        pointerEvents: 'none',
                    }}>
                        {renderBubbles()}
                        {renderStars()}
                    </Animated.View>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
};

export default BrinkoDreamOnboardingPop;