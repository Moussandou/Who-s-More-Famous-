import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useHaptics } from '../hooks/useHaptics';
import { getHighScore } from '../services/storage';
import { useSettings } from '../context/SettingsContext';
import { THEME } from '../constants/theme';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
    const { playImpact } = useHaptics();
    const { settings } = useSettings();
    const [highScore, setHighScore] = useState(0);

    useFocusEffect(
        useCallback(() => {
            getHighScore().then(setHighScore);
        }, [])
    );

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.scoreBadge}>
                    <Text style={styles.scoreLabel}>{"MEILLEUR SCORE"}</Text>
                    <Text style={styles.scoreValue}>{highScore}</Text>
                </View>

                <View style={styles.hero}>
                    <View style={styles.titleBox}>
                        <Text style={styles.titleMain}>WHO'S</Text>
                        <Text style={styles.titleMain}>MORE</Text>
                        <View style={styles.famousBox}>
                            <Text style={styles.titleFamous}>FAMOUS?</Text>
                        </View>
                    </View>
                    <Text style={styles.author}>{"PAR"} MOUSSANDOU</Text>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.btnPrimary}
                        activeOpacity={0.8}
                        onPress={() => {
                            playImpact();
                            navigation.navigate('Game');
                        }}
                    >
                        <Text style={styles.btnTextPrimary}>{"▶ JOUER"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.btnSecondary}
                        activeOpacity={0.8}
                        onPress={() => {
                            playImpact();
                            navigation.navigate('Settings');
                        }}
                    >
                        <Text style={styles.btnTextSecondary}>{"⚙ PARAMÈTRES"}</Text>
                    </TouchableOpacity>
                </View>
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
        padding: 28,
        justifyContent: 'space-between',
        paddingTop: 80,
        paddingBottom: 60,
    },
    scoreBadge: {
        alignSelf: 'center',
        backgroundColor: THEME.colors.white,
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderWidth: 3,
        borderColor: THEME.colors.ink,
        alignItems: 'center',
        ...THEME.shadows.hard,
        transform: [{ rotate: '-1deg' }],
    },
    scoreLabel: {
        color: THEME.colors.gray,
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 3,
        marginBottom: 2,
    },
    scoreValue: {
        color: THEME.colors.ink,
        fontSize: 36,
        fontWeight: '900',
    },
    hero: {
        alignItems: 'center',
        marginVertical: 40,
    },
    titleBox: {
        alignItems: 'center',
    },
    titleMain: {
        color: THEME.colors.ink,
        fontSize: 64,
        fontWeight: '900',
        lineHeight: 64,
        textAlign: 'center',
        letterSpacing: -2,
    },
    famousBox: {
        backgroundColor: THEME.colors.accent,
        paddingHorizontal: 24,
        paddingVertical: 6,
        marginTop: 12,
        borderWidth: 4,
        borderColor: THEME.colors.ink,
        transform: [{ rotate: '3deg' }],
        ...THEME.shadows.hard,
    },
    titleFamous: {
        color: THEME.colors.white,
        fontSize: 56,
        fontWeight: '900',
        lineHeight: 56,
    },
    author: {
        color: THEME.colors.gray,
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 6,
        marginTop: 40,
        opacity: 0.8,
    },
    actions: {
        width: '100%',
    },
    btnPrimary: {
        backgroundColor: THEME.colors.accent,
        height: 75,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: THEME.colors.ink,
        marginBottom: 20,
        ...THEME.shadows.hard,
    },
    btnTextPrimary: {
        color: THEME.colors.white,
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: 4,
    },
    btnSecondary: {
        backgroundColor: THEME.colors.white,
        height: 65,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: THEME.colors.ink,
        ...THEME.shadows.hard,
    },
    btnTextSecondary: {
        color: THEME.colors.ink,
        fontSize: 20,
        fontWeight: '900',
        letterSpacing: 2,
    },
});



