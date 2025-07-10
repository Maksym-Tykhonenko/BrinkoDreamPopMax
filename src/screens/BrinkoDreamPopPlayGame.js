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
    ImageBackground,
} from 'react-native';
import BrinkoDreamLevelPhrase from '../components/BrinkoDreamLevelPhrase';
import BrinkoDreamCustomButton from '../components/BrinkoDreamCustomButton';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const brinkoBalls = [
    {
        id: 1,
        color: 'green',
        image: require('../assets/images/greenBallImage.png'),
        platformRotation: 0,
    },
    {
        id: 2,
        color: 'yellow',
        image: require('../assets/images/yellowBallImage.png'),
        platformRotation: 90,
    },
    {
        id: 3,
        color: 'red',
        image: require('../assets/images/redBallImage.png'),
        platformRotation: 180,
    },
]

const BrinkoDreamPopPlayGame = ({ setBrinkoDreamScreenNow, ownedBrinkoStars, setOwnedBrinkoStars }) => {
    const dimensions = Dimensions.get('window');
    const styles = brinkoDreamStyles(dimensions);
    const [isAboutBrinkoVisible, setIsAboutBrinkoVisible] = useState(false);
    const [ownedBrinkoLevels, setOwnedBrinkoLevels] = useState([1]);
    const [isBrinkoGameFinished, setIsBrinkoGameFinished] = useState(false);
    const [isBrinkoGamePreviewVisible, setIsBrinkoGamePreviewVisible] = useState(false);
    const [selectedBrinkoLevel, setSelectedBrinkoLevel] = useState(null);
    const [needBallsToLevel, setNeedBallsToLevel] = useState(12);
    const [currentPhrase, setCurrentPhrase] = useState('');
    const [isGameOver, setIsGameOver] = useState(false);
    const [levelCompleted, setLevelCompleted] = useState(false);

    const [fallingBalls, setFallingBalls] = useState([]);
    const [platformRotation, setPlatformRotation] = useState(0);
    const [score, setScore] = useState(0);
    const [gameTimer, setGameTimer] = useState(null);
    const [ballIdCounter, setBallIdCounter] = useState(0);

    const platformRotationAnim = useRef(new Animated.Value(0)).current;

    const createNewBall = () => {
        const randomBall = brinkoBalls[Math.floor(Math.random() * brinkoBalls.length)];
        const centerX = (dimensions.width - dimensions.width * 0.1111) / 2;

        const uniqueBallId = `ball_${Date.now()}_${Math.random()}`;

        const newBall = {
            ...randomBall,
            uniqueId: uniqueBallId,
            x: centerX,
            y: -dimensions.width * 0.1111,
            animatedY: new Animated.Value(-dimensions.width * 0.1111),
        };

        return newBall;
    };

    
    useEffect(() => {
        const loadOwnedBrinkoLevels = async () => {
            try {
                const savedLevels = await AsyncStorage.getItem('ownedBrinkoLevels');
                if (savedLevels !== null) {
                    const levels = JSON.parse(savedLevels);
                    setOwnedBrinkoLevels(levels);
                }
            } catch (error) {
                console.error('Error loading owned levels:', error);
            }
        };

        loadOwnedBrinkoLevels();
    }, []);

    const saveOwnedBrinkoLevels = async (levels) => {
        try {
            await AsyncStorage.setItem('ownedBrinkoLevels', JSON.stringify(levels));
        } catch (error) {
            console.error('Error saving owned levels:', error);
        }
    };

    const saveOwnedBrinkoStars = async (stars) => {
        try {
            await AsyncStorage.setItem('ownedBrinkoStars', JSON.stringify(stars));
        } catch (error) {
            console.error('Error saving owned stars:', error);
        }
    };

    const getStarsRewardForLevel = (level) => {
        return level * 10; // 10 за перший, 20 за другий, 30 за третій і так далі
    };

    const animateBallFall = (ball) => {
        Animated.timing(ball.animatedY, {
            toValue: dimensions.height + dimensions.width * 0.1111,
            duration: 3000 + Math.random() * 1000,
            useNativeDriver: true,
        }).start(() => {
            setTimeout(() => {
                setFallingBalls(prev => prev.filter(b => b.uniqueId !== ball.uniqueId));
            }, 10)
        });
    };

    const startGame = () => {
        setScore(0);
        setFallingBalls([]);
        setPlatformRotation(0);
        platformRotationAnim.setValue(0);
        setBallIdCounter(0);
        setIsGameOver(false);
        setLevelCompleted(false);

        const ballInterval = setInterval(() => {
            const newBall = createNewBall();
            setFallingBalls(prev => [...prev, newBall]);
            animateBallFall(newBall);
        }, 2000);

        setGameTimer(ballInterval);
    };

    const stopGame = () => {
        if (gameTimer) {
            clearInterval(gameTimer);
            setGameTimer(null);
        }
        setFallingBalls([]);
    };

    const rotatePlatform = () => {
        if (isGameOver) return; 

        const newRotation = (platformRotation + 90) % 360;
        setPlatformRotation(newRotation);

        Animated.timing(platformRotationAnim, {
            toValue: newRotation,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    const checkCollision = (ball) => {
        const currentY = ball.animatedY._value;
        const ballCenterY = currentY + (dimensions.width * 0.1111) / 2;
        const platformY = dimensions.height - (dimensions.height * 0.071) - (dimensions.width * 0.14);

        const ballCenterX = ball.x + (dimensions.width * 0.1111) / 2;
        const platformCenterX = dimensions.width / 2;
        const platformWidth = dimensions.width * 0.28;

        if (ballCenterY >= platformY - dimensions.height * 0.235 && ballCenterY <= platformY + 40) {
            if (Math.abs(ballCenterX - platformCenterX) <= platformWidth / 2) {
                const requiredRotation = ball.platformRotation;
                const currentRotation = platformRotation;

                if (requiredRotation === currentRotation ||
                    (requiredRotation === 90 && (currentRotation === 90 || currentRotation === 270))) {
                    setScore(prev => prev + 1);
                    setFallingBalls(prev => prev.filter(b => b.uniqueId !== ball.uniqueId));
                    return true;
                } else {
                    setIsGameOver(true);
                    setIsBrinkoGameFinished(true);
                    stopGame();
                    setFallingBalls(prev => prev.filter(b => b.uniqueId !== ball.uniqueId));
                    return true;
                }
            }
        }
        return false;
    };

    const getRandomPhrase = (ballsNeeded) => {
        const phrases = [
            `Let's get popping! Catch ${ballsNeeded} balls to fill the progress triangle!`,
            `This level's dream needs ${ballsNeeded} balls. Think you're ready?`,
            `Hmm… I think ${ballsNeeded} is the lucky number today. Let's catch that many!`,
            `Every pop brings us closer! We need ${ballsNeeded} to light up the sky.`,
            `Gather ${ballsNeeded} shining balls and I'll show you the next dream!`,
            `Ready for the challenge? Catch ${ballsNeeded} colorful bubbles to win this level!`,
        ];
        
        const randomIndex = Math.floor(Math.random() * phrases.length);
        setCurrentPhrase(phrases[randomIndex]);
    }

    const getBallsForLevel = (level) => {
        switch (level) {
            case 1: return 12;
            case 2: return 20;
            case 3: return 28;
            case 4: return 36;
            case 5: return 44;
            case 6: return 52;
            case 7: return 60;
            case 8: return 68;
            case 9: return 76;
            case 10: return 84;
            case 11: return 92;
            case 12: return 100;
            default: return 12;
        }
    };

    const progressNeedBallsToUnlockNewLevel = (level) => {
        const ballsNeeded = getBallsForLevel(level);
        setNeedBallsToLevel(ballsNeeded);
    };

    const restartOrNextLevel = (isNextLevel = false) => {
        if (isNextLevel && selectedBrinkoLevel < 12) {
            const newLevel = selectedBrinkoLevel + 1;
            setSelectedBrinkoLevel(newLevel);
            progressNeedBallsToUnlockNewLevel(newLevel);
            
            const ballsForLevel = getBallsForLevel(newLevel);
            getRandomPhrase(ballsForLevel);
            
            setOwnedBrinkoLevels(prev => {
                if (!prev.includes(newLevel)) {
                    const updatedLevels = [...prev, newLevel];
                    saveOwnedBrinkoLevels(updatedLevels); 
                    return updatedLevels;
                }
                return prev;
            });
        }
    
        setIsGameOver(false);
        setIsBrinkoGameFinished(false);
        setScore(0);
        setFallingBalls([]);
        setPlatformRotation(0);
        platformRotationAnim.setValue(0);
        setBallIdCounter(0);
        setLevelCompleted(false);
    
        if (isNextLevel) {
            setIsBrinkoGamePreviewVisible(false);
        } else {
            setIsBrinkoGamePreviewVisible(true);
        }
    };

    useEffect(() => {
        if (isBrinkoGamePreviewVisible && !isBrinkoGameFinished && !isGameOver) {
            startGame();
        } else {
            stopGame();
        }

        return () => stopGame();
    }, [isBrinkoGamePreviewVisible, isBrinkoGameFinished, isGameOver]);

    useEffect(() => {
        if (score >= needBallsToLevel && isBrinkoGamePreviewVisible && !isGameOver && !levelCompleted) {
            setLevelCompleted(true);
            setIsBrinkoGameFinished(true);
            stopGame();
            
            const starsReward = getStarsRewardForLevel(selectedBrinkoLevel);
            const newStarsTotal = ownedBrinkoStars + starsReward;
            setOwnedBrinkoStars(newStarsTotal);
            saveOwnedBrinkoStars(newStarsTotal);
            
            const nextLevel = selectedBrinkoLevel + 1;
            if (selectedBrinkoLevel < 12 && !ownedBrinkoLevels.includes(nextLevel)) {
                setOwnedBrinkoLevels(prev => {
                    const updatedLevels = [...prev, nextLevel];
                    saveOwnedBrinkoLevels(updatedLevels); 
                    return updatedLevels;
                });
            }
        }
    }, [score, needBallsToLevel, isBrinkoGamePreviewVisible, isGameOver, selectedBrinkoLevel, ownedBrinkoLevels, levelCompleted]);

    useEffect(() => {
        if (!isBrinkoGamePreviewVisible || isBrinkoGameFinished || isGameOver) return;

        const interval = setInterval(() => {
            setFallingBalls(prev => {
                return prev.filter(ball => {
                    return !checkCollision(ball);
                });
            });
        }, 50);

        return () => clearInterval(interval);
    }, [platformRotation, needBallsToLevel, isBrinkoGamePreviewVisible, isBrinkoGameFinished, isGameOver]);

    const rippleScale = useRef(new Animated.Value(0)).current;
    const rippleOpacity = useRef(new Animated.Value(0)).current;
    const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 });

    const aboutScale = useRef(new Animated.Value(0)).current;
    const aboutOpacity = useRef(new Animated.Value(0)).current;
    const overlayOpacity = useRef(new Animated.Value(0)).current;

    const openAboutPage = (touchPosition) => {
        setRipplePosition(touchPosition);

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
        setRipplePosition({
            x: dimensions.width / 2,
            y: dimensions.height / 2
        });

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
        ]).start();
    };

    return (
        <View style={{ flex: 1 }}>
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

            <SafeAreaView style={{ zIndex: 10 }}>
                {!isGameOver && (
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
                                if (isBrinkoGamePreviewVisible) {
                                    setIsBrinkoGamePreviewVisible(false);
                                    setIsBrinkoGameFinished(false);
                                    setIsGameOver(false);
                                    stopGame();
                                } else if (selectedBrinkoLevel) {
                                    closeAboutPage();
                                    setTimeout(() => {
                                        setSelectedBrinkoLevel(null);
                                    }, 350);
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
                            Level{!selectedBrinkoLevel ? 's' : ` ${selectedBrinkoLevel}`}
                        </Text>

                        {isBrinkoGamePreviewVisible && !isBrinkoGameFinished && !isGameOver ? (
                            <Text style={{
                                fontFamily: 'FredokaOne-Regular',
                                fontSize: dimensions.width * 0.05,
                                color: 'white',
                                textAlign: 'center',
                                fontWeight: '700',
                                letterSpacing: 1,
                            }}>
                                {score}/{needBallsToLevel}
                            </Text>
                        ) : (
                            <TouchableOpacity
                                disabled={!selectedBrinkoLevel || !isBrinkoGamePreviewVisible}
                            >
                                <Image
                                    source={require('../assets/icons/brinkoPauseButton.png')}
                                    style={{
                                        width: dimensions.height * 0.07,
                                        height: dimensions.height * 0.07,
                                        opacity: isBrinkoGamePreviewVisible ? 1 : 0
                                    }}
                                    resizeMode='contain'
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </SafeAreaView>

            {!selectedBrinkoLevel ? (
                <>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        alignSelf: 'center',
                        paddingHorizontal: dimensions.width * 0.05,
                        marginTop: dimensions.height * 0.025,
                    }}>
                        {Array.from({ length: 12 }).map((_, index) => (
                            <TouchableOpacity
                                key={`level_${index}`}
                                onPress={(event) => {
                                    const levelNumber = index + 1;
                                    progressNeedBallsToUnlockNewLevel(levelNumber);
                                    setSelectedBrinkoLevel(levelNumber);
                                    
                                    const ballsForLevel = getBallsForLevel(levelNumber);
                                    getRandomPhrase(ballsForLevel);
                                    
                                    const { pageX, pageY } = event.nativeEvent;
                                    openAboutPage({ x: pageX, y: pageY })
                                }}
                                disabled={!ownedBrinkoLevels.includes(index + 1)}
                            >
                                <ImageBackground
                                    source={require('../assets/images/levelBtnBg.png')}
                                    style={{
                                        width: dimensions.width * 0.25,
                                        height: dimensions.width * 0.25,
                                        margin: dimensions.width * 0.014,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    resizeMode='stretch'
                                >
                                    {ownedBrinkoLevels.includes(index + 1) ? (
                                        <Text style={{
                                            fontFamily: 'FredokaOne-Regular',
                                            fontSize: dimensions.width * 0.084,
                                            color: 'white',
                                            textAlign: 'left',
                                            fontWeight: '700',
                                            letterSpacing: 1,
                                        }}>
                                            {index + 1}
                                        </Text>
                                    ) : (
                                        <Image
                                            source={require('../assets/icons/lockIcon.png')}
                                            style={{
                                                width: dimensions.width * 0.08,
                                                height: dimensions.width * 0.08,
                                                marginBottom: dimensions.width * 0.01,
                                            }}
                                            resizeMode='contain'
                                        />
                                    )}
                                </ImageBackground>
                            </TouchableOpacity>
                        ))}
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
                    {!isBrinkoGamePreviewVisible ? (
                        <>
                            <Image
                                source={require('../assets/images/brinkoBoyImage.png')}
                                style={{
                                    width: dimensions.width * 0.8,
                                    height: dimensions.height * 0.5,
                                    alignSelf: 'center',
                                    marginTop: dimensions.height * 0.05,
                                }}
                                resizeMode='contain'
                            />

                            <View style={{
                                alignSelf: 'center',
                            }}>
                                <BrinkoDreamLevelPhrase
                                    brinkoButtonPropsLabel={currentPhrase}
                                    buttonWidth={dimensions.width * 0.88}
                                    buttonHeight={dimensions.height * 0.16}
                                    fontSize={dimensions.width * 0.059}
                                />
                            </View>
                            <View style={{
                                alignSelf: 'center',
                            }}>
                                <BrinkoDreamCustomButton
                                    brinkoButtonPropsLabel={'Play'}
                                    buttonWidth={dimensions.width * 0.77}
                                    buttonHeight={dimensions.height * 0.091}
                                    fontSize={dimensions.width * 0.059}
                                    onPress={() => {
                                        setIsBrinkoGamePreviewVisible(true);
                                        setIsBrinkoGameFinished(false);
                                        setIsGameOver(false);
                                    }}
                                />
                            </View>
                        </>
                    ) : (
                        !isBrinkoGameFinished && !isGameOver ? (
                            <>
                                <TouchableOpacity
                                    style={{
                                        width: dimensions.width,
                                        height: dimensions.height * 0.88,
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        zIndex: 0
                                    }}
                                    activeOpacity={1}
                                    onPress={rotatePlatform}
                                >
                                    {fallingBalls.map((ball) => (
                                        <Animated.View
                                            key={ball.uniqueId}
                                            style={{
                                                position: 'absolute',
                                                left: ball.x,
                                                transform: [{ translateY: ball.animatedY }],
                                                zIndex: 5,
                                            }}
                                        >
                                            <Image
                                                source={ball.image}
                                                style={{
                                                    width: dimensions.width * 0.1111,
                                                    height: dimensions.width * 0.1111,
                                                }}
                                                resizeMode='contain'
                                            />
                                        </Animated.View>
                                    ))}

                                    <Animated.View
                                        style={{
                                            position: 'absolute',
                                            zIndex: 10,
                                            bottom: dimensions.height * 0.071,
                                            alignSelf: 'center',
                                            transform: [
                                                {
                                                    rotate: platformRotationAnim.interpolate({
                                                        inputRange: [0, 360],
                                                        outputRange: ['0deg', '360deg'],
                                                    })
                                                }
                                            ],
                                        }}
                                    >
                                        <Image
                                            source={require('../assets/images/brinkoObjectToCatchBallsImage.png')}
                                            style={{
                                                width: dimensions.width * 0.28,
                                                height: dimensions.width * 0.28,
                                            }}
                                            resizeMode='contain'
                                        />
                                    </Animated.View>
                                </TouchableOpacity>
                            </>
                        ) : isGameOver ? (
                            <>
                                <View style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                }}>
                                    <ImageBackground
                                        source={require('../assets/images/dreamWorldItemBackground.png')}
                                        style={{
                                            width: dimensions.width * 0.9,
                                            height: dimensions.height * 0.5,
                                            alignSelf: 'center',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginTop: dimensions.height * 0.03
                                        }}
                                        resizeMode='stretch'
                                    >
                                        <Text style={{
                                            fontFamily: 'FredokaOne-Regular',
                                            fontSize: dimensions.width * 0.08,
                                            color: 'rgb(214, 150, 0)',
                                            textAlign: 'center',
                                            fontWeight: '700',
                                            letterSpacing: 1,
                                            marginBottom: 20,

                                        }}>
                                            💥 LEVEL FAILED
                                        </Text>

                                        <Text style={{
                                            fontFamily: 'FredokaOne-Regular',
                                            fontSize: dimensions.width * 0.05,
                                            color: 'white',
                                            textAlign: 'center',
                                            fontWeight: '500',
                                            letterSpacing: 1,
                                            marginBottom: dimensions.height * 0.02,
                                            paddingHorizontal: dimensions.width * 0.05,
                                        }}>
                                            Oh no! That pop didn’t go as planned. But hey — every great dream has a few restarts!
                                        </Text>

                                        <Text style={{
                                            fontFamily: 'FredokaOne-Regular',
                                            fontSize: dimensions.width * 0.06,
                                            color: 'white',
                                            textAlign: 'center',
                                            fontWeight: '500',
                                            letterSpacing: 1,
                                            marginBottom: 30,
                                        }}>
                                            Score: {score}/{needBallsToLevel}
                                        </Text>

                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            alignSelf: 'center',

                                        }}>
                                            <TouchableOpacity onPress={() => {
                                                setBrinkoDreamScreenNow('BrinkoHomeDream')
                                            }}>
                                                <Image
                                                    source={require('../assets/icons/goHomeIcon.png')}
                                                    style={{
                                                        width: dimensions.height * 0.084,
                                                        height: dimensions.height * 0.084,
                                                        marginRight: dimensions.width * 0.08,
                                                        borderWidth: dimensions.width * 0.0025,
                                                        borderRadius: dimensions.width * 0.5
                                                    }}
                                                    resizeMode='contain'
                                                />
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={() => restartOrNextLevel(false)}>
                                                <Image
                                                    source={require('../assets/icons/resumeBrinkoIcon.png')}
                                                    style={{
                                                        width: dimensions.height * 0.084,
                                                        height: dimensions.height * 0.084,
                                                    }}
                                                    resizeMode='contain'
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </ImageBackground>

                                    <Image
                                        source={require('../assets/images/sadBrinkoBoyImage.png')}
                                        style={{
                                            width: dimensions.width,
                                            height: dimensions.height * 0.64,
                                            alignSelf: 'center',
                                            bottom: -dimensions.height * 0.19,
                                            position: 'absolute'
                                        }}
                                        resizeMode='contain'
                                    />
                                </View>
                            </>
                        ) : (
                            <>
                                <View style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                }}>
                                    <ImageBackground
                                        source={require('../assets/images/dreamWorldItemBackground.png')}
                                        style={{
                                            width: dimensions.width * 0.9,
                                            height: dimensions.height * 0.4,
                                            alignSelf: 'center',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginTop: dimensions.height * 0.03
                                        }}
                                        resizeMode='stretch'
                                    >
                                        <Text style={{
                                            fontFamily: 'FredokaOne-Regular',
                                            fontSize: dimensions.width * 0.07,
                                            color: 'rgb(141, 184, 24)',
                                            textAlign: 'center',
                                            fontWeight: '700',
                                            letterSpacing: 1,
                                        }}>
                                            🏆 LEVEL COMPLETE
                                        </Text>

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
                                            marginVertical: dimensions.height * 0.025
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
                                                {getStarsRewardForLevel(selectedBrinkoLevel)}
                                            </Text>
                                        </View>

                                        <Text style={{
                                            fontFamily: 'FredokaOne-Regular',
                                            fontSize: dimensions.width * 0.06,
                                            color: 'white',
                                            textAlign: 'center',
                                            fontWeight: '500',
                                            letterSpacing: 1,
                                        }}>
                                            You did it!
                                        </Text>

                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            alignSelf: 'center',
                                            marginTop: dimensions.height * 0.019
                                        }}>
                                            <TouchableOpacity onPress={() => {
                                                setBrinkoDreamScreenNow('BrinkoHomeDream')
                                            }}>
                                                <Image
                                                    source={require('../assets/icons/goHomeIcon.png')}
                                                    style={{
                                                        width: dimensions.height * 0.084,
                                                        height: dimensions.height * 0.084,
                                                        marginRight: dimensions.width * 0.08,
                                                        borderWidth: dimensions.width * 0.0025,
                                                        borderRadius: dimensions.width * 0.5
                                                    }}
                                                    resizeMode='contain'
                                                />
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={() => restartOrNextLevel(true)}>
                                                <Image
                                                    source={require('../assets/icons/resumeBrinkoIcon.png')}
                                                    style={{
                                                        width: dimensions.height * 0.084,
                                                        height: dimensions.height * 0.084,
                                                    }}
                                                    resizeMode='contain'
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </ImageBackground>

                                    <Image
                                        source={require('../assets/images/happyBrinkoBoy.png')}
                                        style={{
                                            width: dimensions.width,
                                            height: dimensions.height * 0.64,
                                            alignSelf: 'center',
                                            bottom: -dimensions.height * 0.19,
                                            position: 'absolute'
                                        }}
                                        resizeMode='contain'
                                    />
                                </View>
                            </>
                        )
                    )}
                </Animated.View>
            )}
        </View>
    );
};

const brinkoDreamStyles = (dimensions) => StyleSheet.create({
});

export default BrinkoDreamPopPlayGame;