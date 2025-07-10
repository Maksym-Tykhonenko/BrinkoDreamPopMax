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
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { fonts } from '../assets/fonts';

const dreamRoomObjects = [
    {
        id: 1,
        image: require('../assets/images/dreamRoomImages/dreamRoomImage1.png'),
        text: 'I once dreamed of a bubble that rose higher than the clouds, floating gently past the tallest trees and brightest stars. I tried to pop it, like I always do in games, but it escaped me each time, drifting further into a sky I couldn’t quite reach. It shimmered with a color I couldn’t name — not quite blue, not quite silver. For a long time, I chased it, thinking I had failed every time it slipped through my fingers. But eventually, I realized it was never meant to be caught. That bubble was an idea — a dream I wasn’t ready to understand yet. Sometimes, what we chase isn’t something we’re meant to possess, but something we’re meant to grow into. Some dreams aren’t goals. They’re directions. And some bubbles are meant to lead you, not break.',
    },
    {
        id: 2,
        image: require('../assets/images/dreamRoomImages/dreamRoomImage2.png'),
        text: 'Not every star in the sky is soft. Some twinkle gently, barely flickering like whispers in the dark. But others burn bold and sharp — like the first time someone tells you to believe in yourself. I remember lying under the night sky once, in a dream so still it felt like the world had paused. I looked up and saw stars blinking like thoughts, as if the sky itself was writing stories. One of them blinked at me harder than the rest — it pulsed, like a heartbeat, and I knew it was mine. We all have those sharp stars inside us — the hopes that poke and pull and ask us to rise. They hurt sometimes, but they’re honest. If you feel restless, like your dream is tugging at your chest, maybe it’s just your sharp star waking up again.',
    },
    {
        id: 3,
        image: require('../assets/images/dreamRoomImages/dreamRoomImage3.png'),
        text: 'Every step I’ve taken in this dream world has made a sound — pop, pop, pop. Each bubble beneath my feet disappears as I move forward, and for the longest time, I thought that meant I was losing something. But now I see that popping isn’t an end — it’s proof that I moved. That I dared. That I tried. The path behind me isn’t empty. It’s full of echoes. People often want to leave a mark, but I think the soft sound of progress is enough. You don’t need loud footsteps to go far. You need courage to keep walking, even when the ground is uncertain and made of moments that vanish the moment you stand on them. Let the pops guide you — and never stop moving.',
    },
];

const BrinkoDreamPopDreamRoom = ({ setBrinkoDreamScreenNow }) => {
    const dimensions = Dimensions.get('window');
    const styles = brinkoDreamStyles(dimensions);
    const [isDreamObjDetailsVisible, setIsDreamObjDetailsVisible] = useState(false);
    const [selectedDreamRoomObject, setSelectedDreamRoomObject] = useState(null);

    const rippleScale = useRef(new Animated.Value(0)).current;
    const rippleOpacity = useRef(new Animated.Value(0)).current;
    const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 });

    const detailsScale = useRef(new Animated.Value(0)).current;
    const detailsOpacity = useRef(new Animated.Value(0)).current;
    const overlayOpacity = useRef(new Animated.Value(0)).current;

    const openDreamObjectDetails = (item, touchPosition) => {
        setSelectedDreamRoomObject(item);
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
            setIsDreamObjDetailsVisible(true);
            Animated.parallel([
                Animated.timing(overlayOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(detailsScale, {
                    toValue: 1,
                    tension: 100,
                    friction: 8,
                    useNativeDriver: true,
                }),
                Animated.timing(detailsOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]).start();
        }, 300);
    };

    const closeDreamObjectDetails = () => {
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
            Animated.timing(detailsScale, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(detailsOpacity, {
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
            setIsDreamObjDetailsVisible(false);
        });
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

            {isDreamObjDetailsVisible && (
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
                            if (isDreamObjDetailsVisible) {
                                closeDreamObjectDetails();
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
                            resizeMode="contain"
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
                        Dream Room
                    </Text>

                    <Image
                        source={require('../assets/icons/goBackBtnIcon.png')}
                        style={{
                            width: dimensions.height * 0.07,
                            height: dimensions.height * 0.07,
                            opacity: 0
                        }}
                        resizeMode="contain"
                    />
                </View>
            </SafeAreaView>

            {!isDreamObjDetailsVisible ? (
                <ScrollView 
                    style={{ flex: 1, zIndex: 0 }} 
                    contentContainerStyle={{
                        alignItems: 'center',
                        paddingBottom: dimensions.height * 0.05,
                    }} 
                    showsVerticalScrollIndicator={false}
                >
                    {dreamRoomObjects.map((item) => (
                        <TouchableOpacity 
                            key={item.id} 
                            onPress={(event) => {
                                const { pageX, pageY } = event.nativeEvent;
                                openDreamObjectDetails(item, { x: pageX, y: pageY });
                            }}
                        >
                            <Image
                                source={item.image}
                                style={{
                                    width: dimensions.width * 0.9,
                                    height: dimensions.height * 0.23,
                                    marginVertical: dimensions.height * 0.01,
                                    alignSelf: 'center',
                                }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            ) : (
                <Animated.View 
                    style={{
                        flex: 1,
                        transform: [{ scale: detailsScale }],
                        opacity: detailsOpacity,
                        zIndex: 3,
                    }}
                >
                    <ScrollView 
                        style={{ flex: 1 }}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: dimensions.height * 0.18,
                        }}
                    >
                        <Image
                            source={selectedDreamRoomObject?.image}
                            style={{
                                width: dimensions.width * 0.9,
                                height: dimensions.height * 0.23,
                                marginVertical: dimensions.height * 0.01,
                                alignSelf: 'center',
                            }}
                            resizeMode="contain"
                        />

                        <Text style={{
                            fontFamily: fonts.fredokaRegular,
                            fontSize: dimensions.width * 0.055,
                            color: 'white',
                            textAlign: 'center',
                            fontWeight: '400',
                            paddingHorizontal: dimensions.width * 0.05,
                            marginTop: dimensions.height * 0.031,
                        }}>
                            {selectedDreamRoomObject ? selectedDreamRoomObject.text : ''}
                        </Text>
                    </ScrollView>
                </Animated.View>
            )}
        </View>
    );
};

const brinkoDreamStyles = (dimensions) => StyleSheet.create({
});

export default BrinkoDreamPopDreamRoom;