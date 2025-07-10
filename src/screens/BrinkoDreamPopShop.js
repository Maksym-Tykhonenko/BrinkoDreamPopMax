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
    Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import BrinkoDreamCustomButton from '../components/BrinkoDreamCustomButton';

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
        price: 18
    }
]

const BrinkoDreamPopShop = ({ setBrinkoDreamScreenNow, currentBackground, setCurrentBackground}) => {
    const dimensions = Dimensions.get('window');
    const styles = brinkoDreamStyles(dimensions);

    const rippleScale = useRef(new Animated.Value(0)).current;
    const rippleOpacity = useRef(new Animated.Value(0)).current;
    const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 });

    const backgroundOpacity = useRef(new Animated.Value(1)).current;
    const backgroundScale = useRef(new Animated.Value(1)).current;

    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState({ title: '', message: '', type: 'info' });
    const modalScale = useRef(new Animated.Value(0)).current;
    const modalOpacity = useRef(new Animated.Value(0)).current;

    const overlayOpacity = useRef(new Animated.Value(0)).current;
    const [ownedBrinkoStars, setOwnedBrinkoStars] = useState(0);
    const [brinkoBgId, setBrinkoBgId] = useState(1);
    const [ownedBrinkoBackgrounds, setOwnedBrinkoBackgrounds] = useState([1]);
    const [displayedBackground, setDisplayedBackground] = useState(brinkoBackgrounds[0]);
    const [currentBgIndex, setCurrentBgIndex] = useState(0);

    useEffect(() => {
        loadShopData();
    }, []);

    // useEffect(() => {
    //     const clearAsyncStorage = async () => {
    //         try {
    //             // Очищення всього AsyncStorage
    //             await AsyncStorage.clear();
    //             console.log('AsyncStorage cleared successfully');
                
            
                
    //         } catch (error) {
    //             console.error('Error clearing AsyncStorage:', error);
    //         }
    //     };
    
    //     // Розкоментуй цю лінію щоб очистити AsyncStorage при завантаженні компоненту
    //     clearAsyncStorage();
    // }, []);

    const loadShopData = async () => {
        try {
            const starsValue = await AsyncStorage.getItem('ownedBrinkoStars');
            if (starsValue !== null) {
                setOwnedBrinkoStars(JSON.parse(starsValue));
            } else {
                await AsyncStorage.setItem('ownedBrinkoStars', JSON.stringify(100));
                setOwnedBrinkoStars(100);
            }

            const bgIdValue = await AsyncStorage.getItem('brinkoBgId');
            if (bgIdValue !== null) {
                const bgId = JSON.parse(bgIdValue);
                setBrinkoBgId(bgId);
                const bgIndex = brinkoBackgrounds.findIndex(bg => bg.id === bgId);
                setCurrentBgIndex(bgIndex !== -1 ? bgIndex : 0);
                setDisplayedBackground(brinkoBackgrounds[bgIndex !== -1 ? bgIndex : 0]);
            }

            const ownedBgsValue = await AsyncStorage.getItem('ownedBrinkoBackgrounds');
            if (ownedBgsValue !== null) {
                setOwnedBrinkoBackgrounds(JSON.parse(ownedBgsValue));
            } else {
                await AsyncStorage.setItem('ownedBrinkoBackgrounds', JSON.stringify([1]));
                setOwnedBrinkoBackgrounds([1]);
            }

        } catch (error) {
            console.error("Error loading shop data:", error);
        }
    };

    const showModal = (title, message, type = 'info') => {
        setModalData({ title, message, type });
        setModalVisible(true);

        Animated.parallel([
            Animated.spring(modalScale, {
                toValue: 1,
                tension: 100,
                friction: 8,
                useNativeDriver: true,
            }),
            Animated.timing(modalOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const hideModal = () => {
        Animated.parallel([
            Animated.timing(modalScale, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(modalOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setModalVisible(false);
            modalScale.setValue(0);
            modalOpacity.setValue(0);
        });
    };

    const unlockBackground = async () => {
        if (displayedBackground.price && ownedBrinkoStars >= displayedBackground.price) {
            try {
                const newStars = ownedBrinkoStars - displayedBackground.price;
                setOwnedBrinkoStars(newStars);
                await AsyncStorage.setItem('ownedBrinkoStars', JSON.stringify(newStars));

                const newOwnedBgs = [...ownedBrinkoBackgrounds, displayedBackground.id];
                setOwnedBrinkoBackgrounds(newOwnedBgs);
                await AsyncStorage.setItem('ownedBrinkoBackgrounds', JSON.stringify(newOwnedBgs));

                setBrinkoBgId(displayedBackground.id);
                await AsyncStorage.setItem('brinkoBgId', JSON.stringify(displayedBackground.id));
                setCurrentBackground(displayedBackground);

                showModal('Success!', 'Background unlocked and set as current!', 'success');
            } catch (error) {
                console.error("Error unlocking background:", error);
            }
        } else {
            showModal('Not enough stars!', `You need ${displayedBackground.price} stars to unlock this background.`, 'error');
        }
    };

    const selectBackground = async (background) => {
        if (ownedBrinkoBackgrounds.includes(background.id)) {
            try {
                setBrinkoBgId(background.id);
                await AsyncStorage.setItem('brinkoBgId', JSON.stringify(background.id));
                setCurrentBackground(background);
                showModal('Background Selected!', `${background.title} is now your active background.`, 'success');
            } catch (error) {
                console.error("Error selecting background:", error);
            }
        }
    };

    const navigateBackground = (direction) => {
        Animated.parallel([
            Animated.timing(backgroundOpacity, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(backgroundScale, {
                toValue: 0.9,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start(() => {
            let newIndex = currentBgIndex;

            if (direction === 'left') {
                newIndex = currentBgIndex > 0 ? currentBgIndex - 1 : brinkoBackgrounds.length - 1;
            } else {
                newIndex = currentBgIndex < brinkoBackgrounds.length - 1 ? currentBgIndex + 1 : 0;
            }

            setCurrentBgIndex(newIndex);
            setDisplayedBackground(brinkoBackgrounds[newIndex]);

            Animated.parallel([
                Animated.timing(backgroundOpacity, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.spring(backgroundScale, {
                    toValue: 1,
                    tension: 100,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]).start();
        });
    };

    const isBackgroundOwned = ownedBrinkoBackgrounds.includes(displayedBackground.id);
    const isCurrentlySelected = brinkoBgId === displayedBackground.id;

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

            <Modal
                transparent
                visible={modalVisible}
                animationType="none"
                statusBarTranslucent
            >
                <View style={styles.modalOverlay}>
                    <Animated.View
                        style={[
                            styles.modalContainer,
                            {
                                transform: [{ scale: modalScale }],
                                opacity: modalOpacity,
                            }
                        ]}
                    >
                        <ImageBackground
                            source={require('../assets/images/dreamWorldItemBackground.png')}
                            style={styles.modalBackground}
                            resizeMode="stretch"
                        >
                            <Image
                                source={
                                    modalData.type === 'success'
                                        ? require('../assets/icons/starIcon.png')
                                        : require('../assets/icons/lockIcon.png')
                                }
                                style={styles.modalIcon}
                                resizeMode="contain"
                            />

                            <Text style={[styles.modalTitle, { color: modalData.type === 'success' ? '#FFCC00' : '#FF6B6B' }]}>
                                {modalData.title}
                            </Text>

                            <Text style={styles.modalMessage}>
                                {modalData.message}
                            </Text>

                            <TouchableOpacity onPress={hideModal}>
                                <BrinkoDreamCustomButton
                                    brinkoButtonPropsLabel={'OK'}
                                    buttonWidth={dimensions.width * 0.3}
                                    buttonHeight={dimensions.height * 0.06}
                                    fontSize={dimensions.width * 0.04}
                                    onPress={hideModal}
                                />
                            </TouchableOpacity>
                        </ImageBackground>
                    </Animated.View>
                </View>
            </Modal>

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
                            setBrinkoDreamScreenNow('BrinkoHomeDream');
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

            <Text style={{
                fontFamily: 'FredokaOne-Regular',
                fontSize: dimensions.width * 0.07,
                color: 'white',
                textAlign: 'center',
                fontWeight: '700',
                letterSpacing: 1,
                marginVertical: dimensions.height * 0.031,
                paddingHorizontal: dimensions.width * 0.05,
            }}>
                Choose Your Dream World
            </Text>

            <Animated.View
                style={{
                    opacity: backgroundOpacity,
                    transform: [{ scale: backgroundScale }],
                }}
            >
                <ImageBackground
                    source={require('../assets/images/dreamWorldItemBackground.png')}
                    style={[styles.dragonButtonBackground, {
                        width: dimensions.width * 0.9,
                        height: dimensions.height * 0.55,
                        paddingTop: dimensions.height * 0.05,
                        alignSelf: 'center'
                    }]}
                    resizeMode="stretch"
                >
                    <View style={{
                        alignSelf: 'center',
                        width: dimensions.width * 0.68,
                    }}>
                        <View style={{ position: 'relative' }}>
                            <Image
                                source={displayedBackground.image}
                                style={{
                                    width: dimensions.width * 0.4,
                                    height: dimensions.height * 0.25,
                                    alignSelf: 'center',
                                    borderRadius: dimensions.height * 0.025,
                                    opacity: isBackgroundOwned ? 1 : 0.5,
                                }}
                                resizeMode='cover'
                            />

                            {!isBackgroundOwned && (
                                <View style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Image
                                        source={require('../assets/icons/lockIcon.png')}
                                        style={{
                                            width: dimensions.width * 0.1,
                                            height: dimensions.width * 0.1,
                                        }}
                                        resizeMode='contain'
                                    />

                                    {!isBackgroundOwned && displayedBackground.price && (
                                        <View style={{
                                            width: dimensions.width * 0.25,
                                            height: dimensions.height * 0.045,
                                            backgroundColor: '#85DAFF',
                                            borderRadius: dimensions.height * 0.5,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            overflow: 'hidden',
                                            borderWidth: dimensions.width * 0.01,
                                            borderColor: '#85DAFF',
                                            flexDirection: 'row',
                                            alignSelf: 'center',
                                            marginTop: dimensions.height * 0.019,
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
                                                    width: dimensions.height * 0.025,
                                                    height: dimensions.height * 0.025,
                                                    marginRight: dimensions.width * 0.015,
                                                }}
                                            />
                                            <Text style={{
                                                fontFamily: 'FredokaOne-Regular',
                                                fontSize: dimensions.width * 0.045,
                                                color: 'white',
                                                textAlign: 'center',
                                                fontWeight: '700',
                                                letterSpacing: 1,
                                            }}>
                                                {displayedBackground.price}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>

                        <Text style={{
                            fontFamily: 'FredokaOne-Regular',
                            fontSize: dimensions.width * 0.05,
                            color: 'white',
                            textAlign: 'center',
                            fontWeight: '700',
                            letterSpacing: 1,
                            marginVertical: dimensions.height * 0.031,
                        }}>
                            {displayedBackground.title}
                        </Text>

                        {!isBackgroundOwned && displayedBackground.price && (
                            <View style={{
                                alignSelf: 'center',
                            }}>
                                <BrinkoDreamCustomButton
                                    brinkoButtonPropsLabel={'Unlock'}
                                    buttonWidth={dimensions.width * 0.5}
                                    buttonHeight={dimensions.height * 0.07}
                                    fontSize={dimensions.width * 0.045}
                                    onPress={unlockBackground}
                                />
                            </View>
                        )}

                        {isBackgroundOwned && !isCurrentlySelected && (
                            <View style={{
                                alignSelf: 'center',
                            }}>
                                <BrinkoDreamCustomButton
                                    brinkoButtonPropsLabel={'Select'}
                                    buttonWidth={dimensions.width * 0.5}
                                    buttonHeight={dimensions.height * 0.07}
                                    fontSize={dimensions.width * 0.045}
                                    onPress={() => selectBackground(displayedBackground)}
                                />
                            </View>
                        )}

                        {isCurrentlySelected && (
                            <Text style={{
                                fontFamily: 'FredokaOne-Regular',
                                fontSize: dimensions.width * 0.04,
                                color: '#4ECDC4',
                                textAlign: 'center',
                                fontWeight: '700',
                                letterSpacing: 1,
                            }}>
                                Currently Selected
                            </Text>
                        )}

                    </View>
                </ImageBackground>
            </Animated.View>

            <View style={{
                alignSelf: 'center',
                width: dimensions.width * 0.9,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: dimensions.height * 0.019,
            }}>
                <TouchableOpacity onPress={() => navigateBackground('left')}>
                    <Image
                        source={require('../assets/icons/goBackBtnIcon.png')}
                        style={{
                            width: dimensions.height * 0.07,
                            height: dimensions.height * 0.07,
                        }}
                        resizeMode='contain'
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigateBackground('right')}>
                    <Image
                        source={require('../assets/icons/goRightBtnIcon.png')}
                        style={{
                            width: dimensions.height * 0.07,
                            height: dimensions.height * 0.07,
                        }}
                        resizeMode='contain'
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const brinkoDreamStyles = (dimensions) => StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: dimensions.width * 0.8,
        minHeight: dimensions.height * 0.3,
    },
    modalBackground: {
        width: dimensions.width * 0.8,
        minHeight: dimensions.height * 0.3,
        paddingVertical: dimensions.height * 0.03,
        paddingHorizontal: dimensions.width * 0.05,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalIcon: {
        width: dimensions.width * 0.15,
        height: dimensions.width * 0.15,
        marginBottom: dimensions.height * 0.02,
    },
    modalTitle: {
        fontFamily: 'FredokaOne-Regular',
        fontSize: dimensions.width * 0.06,
        textAlign: 'center',
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: dimensions.height * 0.015,
    },
    modalMessage: {
        fontFamily: 'FredokaOne-Regular',
        fontSize: dimensions.width * 0.04,
        color: 'white',
        textAlign: 'center',
        fontWeight: '400',
        marginBottom: dimensions.height * 0.025,
        paddingHorizontal: dimensions.width * 0.02,
    },
});

export default BrinkoDreamPopShop;