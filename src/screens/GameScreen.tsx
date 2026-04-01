import {
    View, Text, StyleSheet, TouchableOpacity,
    Animated, Dimensions
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
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
    const [progress, setProgress] = useState(0);
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

            await initializePool(settings.difficulty, (p) => setProgress(p));
            
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
                <View style={styles.loadingBox}>
                    <Text style={styles.loadingTitle}>{t('loading').toUpperCase()}</Text>
                    <View style={styles.progressContainer}>
                        <Animated.View 
                            style={[
                                styles.progressBar, 
                                { width: `${progress * 100}%` }
                            ]} 
                        />
                    </View>
                    <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
                </View>
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
                    <View style={styles.livesContainer}>
                        {[1, 2, 3].map((i) => (
                            <Ionicons 
                                key={i}
                                name={i <= lives ? "heart" : "heart-outline"} 
                                size={28} 
                                color={i <= lives ? THEME.colors.accent : THEME.colors.gray}
                                style={{ marginHorizontal: 2 }}
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

                <View style={styles.vsBadge}>
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
        paddingHorizontal: 24,
        marginBottom: 40,
    },
    statBox: {
        flex: 1,
    },
    statLabel: {
        color: THEME.colors.gray,
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 2,
    },
    statValue: {
        color: THEME.colors.ink,
        fontSize: 28,
        fontWeight: '900',
    },
    centerHeader: {
        alignItems: 'center',
        marginHorizontal: 12,
    },
    livesContainer: {
        flexDirection: 'row',
    },
    duel: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
    },
    vsBadge: {
        position: 'absolute',
        top: '40%',
        left: '50%',
        marginLeft: -28,
        width: 56,
        height: 56,
        backgroundColor: THEME.colors.accent,
        borderWidth: 4,
        borderColor: THEME.colors.ink,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
        transform: [{ rotate: '45deg' }],
        ...THEME.shadows.hard,
    },
    vsText: {
        color: THEME.colors.white,
        fontSize: 20,
        fontWeight: '900',
        transform: [{ rotate: '-45deg' }],
    },
    loadingBox: {
        width: Dimensions.get('window').width * 0.85,
        padding: 32,
        backgroundColor: THEME.colors.white,
        borderWidth: 4,
        borderColor: THEME.colors.ink,
        ...THEME.shadows.hard,
        alignItems: 'center',
    },
    loadingTitle: {
        color: THEME.colors.ink,
        fontSize: 28,
        fontWeight: '900',
        letterSpacing: 4,
        marginBottom: 24,
    },

    progressContainer: {
        width: '100%',
        height: 16,
        backgroundColor: '#EEEEEE',
        borderWidth: 2,
        borderColor: THEME.colors.ink,
        marginBottom: 12,
    },
    progressBar: {
        height: '100%',
        backgroundColor: THEME.colors.accent,
    },
    progressText: {
        color: THEME.colors.gray,
        fontSize: 14,
        fontWeight: '900',
    },
    errorBox: {
        padding: 32,
        borderWidth: 4,
        borderColor: THEME.colors.ink,
        backgroundColor: THEME.colors.white,
        ...THEME.shadows.hard,
        alignItems: 'center',
        margin: 20,
    },
    errorText: {
        color: THEME.colors.accent,
        fontSize: 28,
        fontWeight: '900',
        marginBottom: 12,
    },
    errorDetail: {
        color: THEME.colors.gray,
        fontSize: 14,
        marginBottom: 24,
        textAlign: 'center',
    },
    retryBtn: {
        backgroundColor: THEME.colors.accent,
        paddingVertical: 14,
        paddingHorizontal: 36,
        borderWidth: 3,
        borderColor: THEME.colors.ink,
        ...THEME.shadows.hard,
    },
    retryBtnText: {
        color: THEME.colors.white,
        fontWeight: '900',
        fontSize: 16,
        letterSpacing: 2,
    },
});