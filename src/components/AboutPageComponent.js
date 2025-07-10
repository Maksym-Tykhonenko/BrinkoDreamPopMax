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
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAudio } from '../context/AudioContext';
import BrinkoDreamCustomBlueButton from '../components/BrinkoDreamCustomBlueButton';
import { ScrollView } from 'react-native-gesture-handler';
import { fonts } from '../assets/fonts';

const AboutPageComponent = ({ setIsAboutBrinkoVisible }) => {
    const dimensions = Dimensions.get('window');
    const styles = brinkoDreamStyles(dimensions);
    const { volume, setVolume } = useAudio();

    return (
        <ScrollView style={{
            flex: 1,
            
        }} showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                paddingBottom: dimensions.height * 0.18,
            }}
        >
            <Text style={{
                fontFamily: fonts.fredokaRegular,
                fontSize: dimensions.width * 0.055,
                color: 'white',
                textAlign: 'center',
                fontWeight: '400',
                paddingHorizontal: dimensions.width * 0.05,
                marginTop: dimensions.height * 0.031,
            }}>
                {`Welcome to Brinko Dream Pop, a dreamy arcade world where colors burst, stars blink, and everything begins with a pop.
Follow Brinko, a bright-hearted dreamer, as he travels through colorful levels, catches glowing orbs, and unlocks new dreamscapes with every step.

In this game, your mission is to catch just the right balls to fill your progress triangle. Each level is a small journey, and every group of three brings you closer to bigger dreams.

But Brinko’s world isn’t only about gameplay — it’s also about reflection. Explore the Dream Space, where Brinko shares his quiet thoughts, nighttime visions, and inspiring stories about hope, rest, and following the soft glow of your own dream.
So take a deep breath, trust your timing, and pop your way through wonder.
Your dream begins now.`}
            </Text>
        


        </ScrollView>
    );
};

const brinkoDreamStyles = (dimensions) => StyleSheet.create({
    
});

export default AboutPageComponent;