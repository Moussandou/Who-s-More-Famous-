import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { THEME } from '../constants/theme';

interface FamousGaugeProps {
    value?: Animated.Value; // -100 to 100
    isIdle?: boolean;
    selection?: 'left' | 'right' | null;
}

export default function FamousGauge({ value, isIdle = true, selection = null }: FamousGaugeProps) {
    const idleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isIdle && !selection) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(idleAnim, {
                        toValue: 8,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(idleAnim, {
                        toValue: -8,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            Animated.timing(idleAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [isIdle, selection]);

    const getRotation = () => {
        if (selection === 'left') return '-45deg';
        if (selection === 'right') return '45deg';
        
        if (value) {
            return value.interpolate({
                inputRange: [-150, 150],
                outputRange: ['-65deg', '65deg'],
                extrapolate: 'clamp',
            });
        }
        
        return idleAnim.interpolate({
            inputRange: [-8, 8],
            outputRange: ['-8deg', '8deg'],
        });
    };

    const rotation = getRotation();

    const renderTicks = () => {
        const ticks = [];
        for (let i = 0; i <= 10; i++) {
            const angle = -65 + (i * 130) / 10;
            ticks.push(
                <View 
                    key={i} 
                    style={[
                        styles.tick, 
                        { transform: [{ rotate: `${angle}deg` }, { translateY: -60 }] }
                    ]} 
                />
            );
        }
        return ticks;
    };

    return (
        <View style={styles.container}>
            <View style={styles.gaugeBackground}>
                {renderTicks()}
                <View style={styles.centerDot} />
                <Animated.View style={[
                    styles.needle, 
                    {
                        transform: [
                            { translateY: 20 },
                            { rotate: rotation as any },
                            { translateY: -20 },
                        ]
                    }
                ]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 160,
        height: 100,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    gaugeBackground: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    tick: {
        position: 'absolute',
        width: 3,
        height: 12,
        backgroundColor: THEME.colors.ink,
        borderRadius: 2,
    },
    needle: {
        position: 'absolute',
        width: 6,
        height: 70,
        backgroundColor: THEME.colors.needle,
        bottom: '50%',
        borderRadius: 3,
        ...THEME.shadows.hard,
    },
    centerDot: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: THEME.colors.ink,
        zIndex: 10,
        borderWidth: 2,
        borderColor: THEME.colors.white,
    }
});
