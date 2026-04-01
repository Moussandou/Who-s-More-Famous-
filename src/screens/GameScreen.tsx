import {
    View, Text, StyleSheet, TouchableOpacity,
    ActivityIndicator, Animated
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { fetchDuel, initializePool } from '../services/jikanAPI';
import AnimeCard, { Anime } from '../components/AnimeCard';

export default function GameScreen({ navigation }: any) {

    // ─── STATE ───────────────────────────────────────────────────────
    // useState(valeurInitiale) retourne [valeur, fonctionPourLaModifier]
    // Quand tu appelles setXxx(), React re-render le composant avec la nouvelle valeur.

    const [anime1, setAnime1] = useState<Anime | null>(null);   // 1er animé du duel
    const [anime2, setAnime2] = useState<Anime | null>(null);   // 2ème animé du duel
    const [score, setScore] = useState(0);      // score actuel
    const [streak, setStreak] = useState(0);      // série de bonnes réponses
    const [loading, setLoading] = useState(true);   // est-ce qu'on charge ?
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);   // 'correct' | 'wrong' | null
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
            setFeedback(null);

            // 1. On s'assure que le pool est prêt (une seule fois par session)
            await initializePool();

            // 2. On pioche le duel (quasi instantané maintenant)
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

        if (isCorrect) {
            setScore(s => s + 1);        // s => s + 1 : forme fonctionnelle (plus safe)
            setStreak(s => s + 1);
            setFeedback('correct');
        } else {
            setStreak(0);                // reset le streak
            setFeedback('wrong');
        }

        // Après 1.2s : animation de fondu + chargement du prochain duel
        setTimeout(() => {
            if (!isCorrect) {
                // Game over : on navigue vers GameOverScreen en passant le score
                navigation.replace('GameOver', { score });
                // replace() au lieu de navigate() pour ne pas pouvoir revenir en arrière
                return;
            }
            animateTransition();
        }, 1200);
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

            {/* En-tête : score + streak */}
            <View style={styles.header}>
                <Text style={styles.scoreText}>Score : {score}</Text>
                {streak >= 2 && (
                    // Rendu conditionnel : affiché seulement si streak >= 2
                    <Text style={styles.streakText}>🔥 x{streak}</Text>
                )}
            </View>

            {/* Animated.View = une View qui peut être animée */}
            <Animated.View style={[styles.duel, { opacity: fadeAnim }]}>

                {/* Les 2 cartes côte à côte */}
                <AnimeCard
                    anime={anime1}
                    feedback={feedback}
                    onPress={() => handleChoice(anime1)}
                />

                <Text style={styles.vs}>VS</Text>

                <AnimeCard
                    anime={anime2}
                    feedback={feedback}
                    onPress={() => handleChoice(anime2)}
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
    scoreText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    streakText: {
        color: '#fcd34d',
        fontSize: 20,
        fontWeight: 'bold',
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