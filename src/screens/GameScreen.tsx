import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withSpring, 
    withTiming, 
    runOnJS 
} from 'react-native-reanimated';

import AnimeCard, { Anime } from '../components/AnimeCard';
import FamousGauge from '../components/FamousGauge';
import { fetchDuel, initializePool } from '../services/jikanAPI';
import { saveHighScore } from '../services/storage';
import { useSettings } from '../context/SettingsContext';
import { THEME } from '../constants/theme';
import { useHaptics } from '../hooks/useHaptics';

export default function GameScreen() {
    const navigation = useNavigation<any>();
    const { playSuccess, playError, playImpact } = useHaptics();
    const { settings } = useSettings();

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

    // Reanimated Shared Values
    const fadeAnim = useSharedValue(1);
    const gestureX = useSharedValue(0);
    const SWIPE_THRESHOLD = 80;

    const loadDuel = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            setFeedback1(null);
            setFeedback2(null);
            setRevealed(false);
            gestureX.value = withSpring(0);

            await initializePool(settings.difficulty, (p) => setProgress(p));
            
            const { anime1, anime2 } = await fetchDuel();
            setAnime1(anime1);
            setAnime2(anime2);

            fadeAnim.value = withTiming(1, { duration: 500 });
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }, [settings.difficulty]);

    useEffect(() => {
        loadDuel();
    }, [loadDuel]);

    const handleChoice = (chosen: Anime | null) => {
        if (!chosen || revealed) return;
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
            
            fadeAnim.value = withTiming(0, { duration: 300 }, () => {
                runOnJS(loadDuel)();
            });
        }, 2000);
    };

    // Correct Pan Gesture using Reanimated and Gesture Handler
    const panGesture = Gesture.Pan()
        .enabled(!loading && !revealed)
        .onUpdate((event) => {
            'worklet';
            gestureX.value = event.translationX;
        })
        .onEnd((event) => {
            'worklet';
            if (event.translationX < -SWIPE_THRESHOLD) {
                runOnJS(handleChoice)(anime1!);
            } else if (event.translationX > SWIPE_THRESHOLD) {
                runOnJS(handleChoice)(anime2!);
            } else {
                gestureX.value = withSpring(0);
            }
        });

    const duelStyle = useAnimatedStyle(() => ({
        opacity: fadeAnim.value,
    }));

    if (loading && !anime1) {
        return (
            <View style={styles.center}>
                <View style={styles.loadingBox}>
                    <Text style={styles.loadingTitle}>{"CHARGEMENT..."}</Text>
                    <View style={styles.progressContainer}>
                        <View 
                            style={[
                                styles.progressBar, 
                                { width: `${progress * 100}%` }
                            ]} 
                        />
                    </View>
                    <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
                    <ActivityIndicator size="large" color={THEME.colors.accent} style={{ marginTop: 20 }} />
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{"ERREUR"}</Text>
                    <Text style={styles.errorDetail}>{error}</Text>
                    <TouchableOpacity 
                        style={styles.retryBtn} 
                        onPress={() => { playImpact(); loadDuel(); }}
                    >
                        <Text style={styles.retryBtnText}>{"REESSAYER"}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>{"SCORE"}</Text>
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
                    <Text style={styles.statLabel}>{"SERIE"}</Text>
                    <Text style={[styles.statValue, { color: THEME.colors.accent }]}>{streak}</Text>
                </View>
            </View>

            <GestureDetector gesture={panGesture}>
                <Animated.View style={[styles.duel, duelStyle]}>
                    <View style={styles.cardCol}>
                        <AnimeCard
                            anime={anime1}
                            feedback={feedback1}
                            revealed={revealed}
                            onPress={() => !revealed && handleChoice(anime1)}
                        />
                    </View>

                    <View style={styles.gaugeCol} pointerEvents="none">
                        <FamousGauge 
                            value={gestureX} 
                            isIdle={!revealed}
                            selection={revealed ? (feedback1 === 'correct' || feedback2 === 'wrong' ? 'left' : 'right') : null}
                        />
                    </View>

                    <View style={styles.cardCol}>
                        <AnimeCard
                            anime={anime2}
                            feedback={feedback2}
                            revealed={revealed}
                            onPress={() => !revealed && handleChoice(anime2)}
                        />
                    </View>
                </Animated.View>
            </GestureDetector>
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
        marginBottom: 20,
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
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    cardCol: {
        flex: 1,
        alignItems: 'center',
    },
    gaugeCol: {
        width: 140, // Match gauge size
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: '15%', // Better positioning than center overlap
        zIndex: 100,
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