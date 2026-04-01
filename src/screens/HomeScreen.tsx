import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useHaptics } from '../hooks/useHaptics';
import { getHighScore } from '../services/storage';
import { useSettings } from '../context/SettingsContext';
import { THEME } from '../constants/theme';

export default function HomeScreen({ navigation }: any) {
    const { playImpact } = useHaptics();
    const { t } = useSettings();
    const [highScore, setHighScore] = useState(0);

    useFocusEffect(
        useCallback(() => {
            getHighScore().then(setHighScore);
        }, [])
    );

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.headerIndicator}>
                    <Text style={styles.highScoreLabel}>{t('highScore').toUpperCase()}</Text>
                    <Text style={styles.highScoreValue}>{highScore}</Text>
                </View>

                <View style={styles.titleContainer}>
                    <Text style={styles.titleMain}>WHO'S MORE</Text>
                    <Text style={styles.titleSecond}>FAMOUS?</Text>
                    <View style={styles.titleUnderline} />
                </View>
                
                <Text style={styles.subtitle}>{t('by').toUpperCase()} MOUSSANDOU</Text>

                <TouchableOpacity
                    style={styles.buttonPlay}
                    activeOpacity={1}
                    onPress={() => {
                        playImpact();
                        navigation.navigate('Game');
                    }}
                >
                    <View style={styles.btnInner}>
                        <Text style={styles.buttonText}>{t('play').toUpperCase()}</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttonSecondary}
                    activeOpacity={1}
                    onPress={() => {
                        playImpact();
                        navigation.navigate('Settings');
                    }}
                >
                    <Text style={styles.buttonTextSecondary}>{t('settings').toUpperCase()}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.colors.paper,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    headerIndicator: {
        position: 'absolute',
        top: 60,
        alignItems: 'center',
        backgroundColor: THEME.colors.white,
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderWidth: THEME.borders.width,
        borderColor: THEME.colors.ink,
        ...THEME.shadows.hard,
    },
    highScoreLabel: {
        color: THEME.colors.gray,
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 2,
    },
    highScoreValue: {
        color: THEME.colors.ink,
        fontSize: 24,
        fontWeight: '900',
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 8,
    },
    titleMain: { 
        fontSize: 48, 
        fontWeight: '900', 
        color: THEME.colors.ink, 
        lineHeight: 48,
    },
    titleSecond: { 
        fontSize: 48, 
        fontWeight: '900', 
        color: THEME.colors.ink,
        lineHeight: 48,
    },
    titleUnderline: {
        height: 6,
        backgroundColor: THEME.colors.accent,
        width: '100%',
        marginTop: 4,
    },
    subtitle: { 
        fontSize: 12, 
        color: THEME.colors.gray, 
        marginBottom: 80,
        fontWeight: 'bold',
        letterSpacing: 4,
    },
    buttonPlay: { 
        width: '100%', 
        height: 64,
        marginBottom: 20, 
        backgroundColor: THEME.colors.ink,
        borderWidth: THEME.borders.width,
        borderColor: THEME.colors.ink,
        ...THEME.shadows.hard,
    },
    btnInner: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonSecondary: { 
        paddingVertical: 14, 
        width: '100%', 
        alignItems: 'center',
        borderWidth: THEME.borders.width,
        borderColor: THEME.colors.ink,
        backgroundColor: THEME.colors.white,
        ...THEME.shadows.hard,
    },
    buttonText: { 
        color: THEME.colors.paper, 
        fontSize: 22, 
        fontWeight: '900', 
        letterSpacing: 2 
    },
    buttonTextSecondary: { 
        color: THEME.colors.ink, 
        fontSize: 16, 
        fontWeight: '900',
        letterSpacing: 1
    },
});

