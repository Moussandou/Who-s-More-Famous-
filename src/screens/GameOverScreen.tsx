import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { useHaptics } from '../hooks/useHaptics';
import { useSettings } from '../context/SettingsContext';
import { THEME } from '../constants/theme';

export default function GameOverScreen({ navigation, route }: any) {
    const { score } = route.params || { score: 0 };
    const { playError, playImpact } = useHaptics();
    const { t } = useSettings();

    useEffect(() => {
        playError();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.gameOverText}>CHAPTER END</Text>
                <View style={styles.underline} />
            </View>

            <View style={styles.scoreCard}>
                <Text style={styles.scoreLabel}>{t('yourScore').toUpperCase()}</Text>
                <Text style={styles.scoreValue}>{score}</Text>
            </View>

            <TouchableOpacity 
                style={styles.buttonMain}
                activeOpacity={1}
                onPress={() => {
                    playImpact();
                    navigation.replace('Game');
                }}
            >
                <Text style={styles.buttonTextPrimary}>{t('retry').toUpperCase()}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.buttonSecondary}
                activeOpacity={1}
                onPress={() => {
                    playImpact();
                    navigation.navigate('Home');
                }}
            >
                <Text style={styles.buttonTextSecondary}>{t('mainMenu').toUpperCase()}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.colors.paper,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    header: {
        alignItems: 'center',
        marginBottom: 60,
    },
    gameOverText: {
        fontSize: 56,
        fontWeight: '900',
        color: THEME.colors.accent,
        letterSpacing: -2,
    },
    underline: {
        height: 8,
        width: '120%',
        backgroundColor: THEME.colors.ink,
        marginTop: -10,
        zIndex: -1,
    },
    scoreCard: {
        alignItems: 'center',
        backgroundColor: THEME.colors.white,
        paddingVertical: 48,
        paddingHorizontal: 64,
        borderWidth: 4,
        borderColor: THEME.colors.ink,
        ...THEME.shadows.hard,
        marginBottom: 80,
        transform: [{ rotate: '-1.5deg' }],
    },
    scoreLabel: {
        color: THEME.colors.gray,
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 4,
        marginBottom: 8,
    },
    scoreValue: {
        color: THEME.colors.ink,
        fontSize: 96,
        fontWeight: '900',
        lineHeight: 96,
    },
    buttonMain: {
        width: '100%',
        height: 75,
        backgroundColor: THEME.colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: THEME.colors.ink,
        ...THEME.shadows.hard,
        marginBottom: 24,
    },
    buttonSecondary: {
        width: '100%',
        height: 65,
        backgroundColor: THEME.colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: THEME.colors.ink,
        ...THEME.shadows.hard,
    },
    buttonTextPrimary: {
        color: THEME.colors.white,
        fontSize: 28,
        fontWeight: '900',
        letterSpacing: 4,
    },
    buttonTextSecondary: {
        color: THEME.colors.ink,
        fontSize: 20,
        fontWeight: '900',
        letterSpacing: 2,
    },
});



