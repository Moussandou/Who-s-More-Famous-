import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
    useAnimatedStyle, 
    useSharedValue, 
    withRepeat, 
    withSequence, 
    withTiming, 
    interpolate,
    Extrapolation,
    SharedValue
} from 'react-native-reanimated';
import { THEME } from '../constants/theme';

interface FamousGaugeProps {
    value?: SharedValue<number>;
    isIdle?: boolean;
    selection?: 'left' | 'right' | null;
}

export default function FamousGauge({ value, isIdle = true, selection = null }: FamousGaugeProps) {
    const idleValue = useSharedValue(0);

    useEffect(() => {
        if (isIdle && !selection) {
            idleValue.value = withRepeat(
                withSequence(
                    withTiming(15, { duration: 2000 }),
                    withTiming(-15, { duration: 2000 })
                ),
                -1,
                true
            );
        } else {
            idleValue.value = withTiming(0, { duration: 300 });
        }
    }, [isIdle, selection]);

    const needleStyle = useAnimatedStyle(() => {
        'worklet';
        let rotationValue = 0;
        
        if (selection === 'left') {
            rotationValue = -45;
        } else if (selection === 'right') {
            rotationValue = 45;
        } else if (value) {
            rotationValue = interpolate(
                value.value,
                [-150, 150],
                [-65, 65],
                Extrapolation.CLAMP
            );
        } else {
            rotationValue = idleValue.value;
        }

        return {
            transform: [
                { translateY: 35 },
                { rotate: `${rotationValue}deg` },
                { translateY: -35 },
            ],
        };
    });

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
                <Animated.View style={[styles.needle, needleStyle]} />
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
