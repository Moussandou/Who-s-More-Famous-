import {
    View, Text, StyleSheet, TouchableOpacity,
    ActivityIndicator, Animated
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { fetchDuel, initializePool } from '../services/jikanAPI';
import { saveHighScore } from '../services/storage';
import AnimeCard, { Anime } from '../components/AnimeCard';
import { LinearGradient } from 'expo-linear-gradient';
import { useHaptics } from '../hooks/useHaptics';

export default function GameScreen({ navigation }: any) {
    const { playSuccess, playError } = useHaptics();

    // ─── STATE ───────────────────────────────────────────────────────
    // useState(valeurInitiale) retourne [valeur, fonctionPourLaModifier]
    // Quand tu appelles setXxx(), React re-render le composant avec la nouvelle valeur.

    const [anime1, setAnime1] = useState<Anime | null>(null);   // 1er animé du duel
    const [anime2, setAnime2] = useState<Anime | null>(null);   // 2ème animé du duel
    const [score, setScore] = useState(0);      // score actuel
    const [streak, setStreak] = useState(0);      // série de bonnes réponses
    const [lives, setLives] = useState(3);        // ✨ Système de vies (3 chances)
    const [revealed, setRevealed] = useState(false); // ✨ Révéler le nombre de fans
    const [loading, setLoading] = useState(true);   // est-ce qu'on charge ?
    const [feedback1, setFeedback1] = useState<'correct' | 'wrong' | null>(null);
    const [feedback2, setFeedback2] = useState<'correct' | 'wrong' | null>(null);
    const [error, setError] = useState<string | null>(null);   // message d'erreur API

    // useRef = une valeur qui persiste entre les renders SANS déclencher un re-render.
    // Ici on l'utilise pour l'animation (pas besoin de re-render pour animer).
    const fadeAnim = useRef(new Animated.Value(1)).current;

    // ─── EFFETS ──────────────────────────────────────────────────────
    // useEffect(fonction, [dépendances])
    // La fonction s'exécute APRÈS le premier render, et à chaque fois 
    // qu'une dépendance change.
    // [] vide = s'exécute UNE SEULE FOIS au montage du composant.

    useEffect(() => {
        loadDuel();
    }, []); // ← [] : charge un duel au démarrage

    // ─── FONCTIONS ───────────────────────────────────────────────────

    async function loadDuel() {
        try {
            setLoading(true);
            setError(null);
            setFeedback1(null);
            setFeedback2(null);
            setRevealed(false); // On cache les résultats pour le nouveau duel

            // 1. On s'assure que le pool est prêt (une seule fois par session)
            await initializePool();

            // 2. On pioche le duel
            const { anime1, anime2 } = await fetchDuel();
            setAnime1(anime1);
            setAnime2(anime2);

        } catch (err: any) {
            setError(err.message || "Impossible de charger les données. Réessaie !");
        } finally {
            setLoading(false);
        }
    }

    function handleChoice(chosen: Anime | null) {
        if (!chosen) return;
        // "chosen" = l'animé sur lequel l'utilisateur a tapé
        const other = chosen === anime1 ? anime2 : anime1;
        if (!other) return; // Sécurité TypeScript

        const isCorrect = chosen.members >= other.members;
        setRevealed(true); // On révèle les chiffres !

        if (isCorrect) {
            setScore(s => s + 1);
            setStreak(s => s + 1);
            setFeedback1(chosen === anime1 ? 'correct' : feedback1);
            setFeedback2(chosen === anime2 ? 'correct' : feedback2);
            // ✨ Vibration de succès (via hook)
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
            // ✨ Vibration d'erreur (via hook)
            playError();
        }

        // Après 1.5s (plus long pour laisser lire les chiffres)
        setTimeout(async () => {
            const currentLives = isCorrect ? lives : lives - 1;

            if (currentLives <= 0) {
                // Game over : Sauvegarder le High Score avant de partir
                await saveHighScore(score);
                navigation.replace('GameOver', { score });
                return;
            }
            animateTransition();
        }, 1500);
    }

    function animateTransition() {
        // Animated.sequence = joue les animations l'une après l'autre
        Animated.sequence([
            // Fade out (opacité 1 → 0 en 300ms)
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true, // ← TOUJOURS true pour les perfs (GPU natif)
            }),
            // Fade in (opacité 0 → 1 en 300ms)
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // Le callback start() s'exécute quand l'animation est finie
            loadDuel();
        });
    }
    // ─── RENDU ───────────────────────────────────────────────────────

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#7c3aed" />
                <Text style={styles.loadingText}>Initialisation du jeu...</Text>
                <Text style={styles.loadingSubtitle}>Récupération des 200 meilleurs animés (MyAnimeList)</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryBtn} onPress={loadDuel}>
                    <Text style={styles.buttonText}>🔄 Réessayer</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#1a1a2e', '#0f0f1a']}
                style={StyleSheet.absoluteFillObject}
            />

            {/* En-tête : score + vies */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.scoreTitle}>SCORE</Text>
                    <Text style={styles.scoreText}>{score}</Text>
                </View>

                <View style={styles.livesContainer}>
                    {[...Array(3)].map((_, i) => (
                        <Text key={i} style={[styles.heart, i >= lives && styles.heartEmpty]}>
                            ❤️
                        </Text>
                    ))}
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.scoreTitle}>STREAK</Text>
                    <Text style={[styles.streakText, streak === 0 && { opacity: 0.3 }]}>
                        🔥 {streak}
                    </Text>
                </View>
            </View>

            <Animated.View style={[styles.duel, { opacity: fadeAnim }]}>
                <AnimeCard
                    anime={anime1}
                    feedback={feedback1}
                    revealed={revealed}
                    onPress={() => !revealed && handleChoice(anime1)}
                />

                <Text style={styles.vs}>VS</Text>

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
        backgroundColor: '#0f0f1a',
        paddingTop: 60,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f0f1a',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 40,
    },
    scoreTitle: {
        color: '#8888aa',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    scoreText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '900',
    },
    livesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingVertical: 5,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    heart: {
        fontSize: 18,
        marginHorizontal: 2,
    },
    heartEmpty: {
        opacity: 0.2,
    },
    streakText: {
        color: '#fcd34d',
        fontSize: 24,
        fontWeight: '900',
    },
    duel: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    vs: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'black',
        marginHorizontal: 4,
    },
    loadingText: {
        color: '#8888aa',
        marginTop: 10,
    },
    errorText: {
        color: '#ef4444',
        marginBottom: 20,
        textAlign: 'center',
    },
    retryBtn: {
        backgroundColor: '#7c3aed',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    loadingSubtitle: {
        color: '#666',
        fontSize: 12,
        marginTop: 5,
        textAlign: 'center',
    },
});