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
                inputRange: [-100, 100],
                outputRange: ['-60deg', '60deg'],
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
            const angle = -60 + (i * 120) / 10;
            ticks.push(
                <View 
                    key={i} 
                    style={[
                        styles.tick, 
                        { transform: [{ rotate: `${angle}deg` }, { translateY: -40 }] }
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
        width: 100,
        height: 60,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginHorizontal: -10,
        zIndex: 100,
    },
    gaugeBackground: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    tick: {
        position: 'absolute',
        width: 2,
        height: 8,
        backgroundColor: THEME.colors.ink,
        borderRadius: 1,
    },
    needle: {
        position: 'absolute',
        width: 4,
        height: 40,
        backgroundColor: THEME.colors.needle,
        bottom: '50%',
        borderRadius: 2,
    },
    centerDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: THEME.colors.ink,
        zIndex: 10,
    }
});
