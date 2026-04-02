import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { THEME } from '../constants/theme';

const { width } = Dimensions.get('window');

interface FamousGaugeProps {
    value?: any; // Accepting any and ignoring it for the safe boot
    selection?: 'left' | 'right' | null;
    isIdle?: boolean;
}

export const FamousGauge: React.FC<FamousGaugeProps> = ({ 
    selection,
    isIdle = true 
}) => {
    // Standard static calculation for rotation
    let rotation = 0;
    if (selection === 'left') rotation = -45;
    else if (selection === 'right') rotation = 45;

    return (
        <View style={styles.container}>
            <View style={styles.gaugeBackground}>
                {/* Gauge Arch */}
                <View style={styles.archContainer}>
                    <View style={[styles.arch, styles.archLeft]} />
                    <View style={[styles.arch, styles.archRight]} />
                </View>

                {/* Markers */}
                <View style={styles.markerContainer}>
                    <Text style={styles.markerText}>LVL</Text>
                    <Text style={styles.markerText}>FAMOUS</Text>
                    <Text style={styles.markerText}>GURU</Text>
                </View>

                {/* Needle - Using standard style instead of Animated */}
                <View 
                    style={[
                        styles.needleContainer,
                        { transform: [{ translateY: 35 }, { rotate: `${rotation}deg` }, { translateY: -35 }] }
                    ]}
                >
                    <View style={styles.needle} />
                    <View style={styles.needleCap} />
                </View>

                <View style={styles.statusBox}>
                    <Text style={styles.statusText}>
                        {selection === 'left' ? 'SWIPE LEFT' : selection === 'right' ? 'SWIPE RIGHT' : isIdle ? 'DUEL' : 'WAITING'}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width * 0.8,
        height: 100,
        alignSelf: 'center',
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gaugeBackground: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    archContainer: {
        position: 'absolute',
        top: 20,
        flexDirection: 'row',
        width: '80%',
        height: 10,
        borderRadius: 5,
        overflow: 'hidden',
    },
    arch: {
        flex: 1,
        height: '100%',
    },
    archLeft: {
        backgroundColor: THEME.colors.primary,
    },
    archRight: {
        backgroundColor: THEME.colors.primary,
    },
    markerContainer: {
        position: 'absolute',
        top: 35,
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    markerText: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 10,
        fontWeight: 'bold',
    },
    needleContainer: {
        position: 'absolute',
        width: 4,
        height: 40,
        bottom: '50%',
        alignItems: 'center',
    },
    needle: {
        width: 3,
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 2,
    },
    needleCap: {
        position: 'absolute',
        bottom: -5,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: THEME.colors.accent,
    },
    statusBox: {
        marginTop: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 15,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    }
});
