import {
    View, Text, StyleSheet, TouchableOpacity,
    ActivityIndicator, Animated
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { fetchDuel, initializePool } from '../services/jikanAPI';
import { saveHighScore } from '../services/storage';
import AnimeCard, { Anime } from '../components/AnimeCard';
import { useHaptics } from '../hooks/useHaptics';
import { useSettings } from '../context/SettingsContext';
import { THEME } from '../constants/theme';

export default function GameScreen({ navigation }: any) {
    const { playSuccess, playError, playImpact } = useHaptics();
    const { settings, t } = useSettings();

    const [anime1, setAnime1] = useState<Anime | null>(null);
    const [anime2, setAnime2] = useState<Anime | null>(null);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [lives, setLives] = useState(3);
    const [revealed, setRevealed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [feedback1, setFeedback1] = useState<'correct' | 'wrong' | null>(null);
    const [feedback2, setFeedback2] = useState<'correct' | 'wrong' | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fadeAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        loadDuel();
    }, []);

    async function loadDuel() {
        try {
            setLoading(true);
            setError(null);
            setFeedback1(null);
            setFeedback2(null);
            setRevealed(false);

            await initializePool(settings.difficulty);

            const { anime1, anime2 } = await fetchDuel();
            setAnime1(anime1);
            setAnime2(anime2);

        } catch (err: any) {
            setError(err.message || "ERROR");
        } finally {
            setLoading(false);
        }
    }

    function handleChoice(chosen: Anime | null) {
        if (!chosen) return;
        const other = chosen === anime1 ? anime2 : anime1;
        if (!other) return;

        const isCorrect = chosen.members >= other.members;
        setRevealed(true);

        if (isCorrect) {
            setScore(s => s + 1);
            setStreak(s => s + 1);
            setFeedback1(chosen === anime1 ? 'correct' : null);
            setFeedback2(chosen === anime2 ? 'correct' : null);
            playSuccess();
        } else {
            setStreak(0);
            setLives(l => l - 1);
            if (chosen === anime1) {
                setFeedback1('wrong');
                setFeedback2('correct');
            } else {
                setFeedback2('wrong');
                setFeedback1('correct');
            }
            playError();
        }

        setTimeout(async () => {
            const currentLives = isCorrect ? lives : lives - 1;

            if (currentLives <= 0) {
                await saveHighScore(score);
                navigation.replace('GameOver', { score });
                return;
            }
            animateTransition();
        }, 1500);
    }

    function animateTransition() {
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(() => {
            loadDuel();
        });
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={THEME.colors.ink} />
                <Text style={styles.loadingText}>{t('loading').toUpperCase()}</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{t('error').toUpperCase()}</Text>
                    <Text style={styles.errorDetail}>{error}</Text>
                    <TouchableOpacity 
                        style={styles.retryBtn} 
                        onPress={() => { playImpact(); loadDuel(); }}
                    >
                        <Text style={styles.retryBtnText}>{t('retry').toUpperCase()}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>{t('score').toUpperCase()}</Text>
                    <Text style={styles.statValue}>{score}</Text>
                </View>

                <View style={styles.centerHeader}>
                    <Text style={styles.livesLabel}>LIVES</Text>
                    <View style={styles.livesContainer}>
                        {[...Array(3)].map((_, i) => (
                            <View 
                                key={i} 
                                style={[
                                    styles.lifeBlock, 
                                    i >= lives && styles.lifeBlockEmpty
                                ]} 
                            />
                        ))}
                    </View>
                </View>

                <View style={[styles.statBox, { alignItems: 'flex-end' }]}>
                    <Text style={styles.statLabel}>{t('streak').toUpperCase()}</Text>
                    <Text style={[styles.statValue, { color: THEME.colors.accent }]}>{streak}</Text>
                </View>
            </View>

            <Animated.View style={[styles.duel, { opacity: fadeAnim }]}>
                <AnimeCard
                    anime={anime1}
                    feedback={feedback1}
                    revealed={revealed}
                    onPress={() => !revealed && handleChoice(anime1)}
                />

                <View style={styles.vsContainer}>
                    <Text style={styles.vsText}>VS</Text>
                </View>

                <AnimeCard
                    anime={anime2}
                    feedback={feedback2}
                    revealed={revealed}
                    onPress={() => !revealed && handleChoice(anime2)}
                />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.colors.paper,
        paddingTop: 60,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: THEME.colors.paper,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 30,
    },
    statBox: {
        flex: 1,
    },
    statLabel: {
        color: THEME.colors.gray,
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
    },
    statValue: {
        color: THEME.colors.ink,
        fontSize: 22,
        fontWeight: '900',
    },
    centerHeader: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    livesLabel: {
        fontSize: 9,
        fontWeight: '900',
        color: THEME.colors.gray,
        letterSpacing: 2,
        marginBottom: 4,
    },
    livesContainer: {
        flexDirection: 'row',
    },
    lifeBlock: {
        width: 16,
        height: 16,
        backgroundColor: THEME.colors.ink,
        marginHorizontal: 2,
        borderWidth: 1,
        borderColor: THEME.colors.ink,
    },
    lifeBlockEmpty: {
        backgroundColor: 'transparent',
    },
    duel: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
    },
    vsContainer: {
        width: 40,
        height: 40,
        backgroundColor: THEME.colors.ink,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
        borderWidth: 3,
        borderColor: THEME.colors.white,
        marginHorizontal: -20,
    },
    vsText: {
        color: THEME.colors.white,
        fontSize: 14,
        fontWeight: '900',
    },
    loadingText: {
        color: THEME.colors.ink,
        marginTop: 16,
        fontWeight: '900',
        letterSpacing: 2,
    },
    errorBox: {
        padding: 30,
        borderWidth: THEME.borders.width,
        borderColor: THEME.colors.ink,
        backgroundColor: THEME.colors.white,
        ...THEME.shadows.hard,
        alignItems: 'center',
        margin: 20,
    },
    errorText: {
        color: THEME.colors.accent,
        fontSize: 24,
        fontWeight: '900',
        marginBottom: 8,
    },
    errorDetail: {
        color: THEME.colors.gray,
        fontSize: 14,
        marginBottom: 20,
        textAlign: 'center',
    },
    retryBtn: {
        backgroundColor: THEME.colors.ink,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderWidth: 2,
        borderColor: THEME.colors.ink,
    },
    retryBtnText: {
        color: THEME.colors.paper,
        fontWeight: '900',
        letterSpacing: 1,
    },
});