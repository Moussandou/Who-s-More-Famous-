import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { THEME } from '../constants/theme';
import { Anime } from '../components/AnimeCard';
import * as animeService from '../services/jikanAPI';
import { saveHighScore } from '../services/storage';
import AnimeCard from '../components/AnimeCard';
import ScoreBoard from '../components/ScoreBoard';
import { useHaptics } from '../hooks/useHaptics';

const { width } = Dimensions.get('window');

export default function GameScreen() {
    const navigation = useNavigation<any>();
    const { playImpact, playSuccess, playError } = useHaptics();

    // GAME STATE
    const [anime1, setAnime1] = useState<Anime | null>(null);
    const [anime2, setAnime2] = useState<Anime | null>(null);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [streak, setStreak] = useState(0);
    const [loading, setLoading] = useState(true);
    const [revealed, setRevealed] = useState(false);
    const [selection, setSelection] = useState<'left' | 'right' | null>(null);
    const [progress, setProgress] = useState(0);

    const loadNextPair = async () => {
        setLoading(true);
        setRevealed(false);
        setSelection(null);
        setProgress(0.1);
        
        try {
            const { anime1: a1, anime2: a2 } = await animeService.fetchDuel();
            setAnime1(a1);
            setProgress(0.6);
            setAnime2(a2);
            setProgress(1.0);
        } catch (error) {
            console.error("Error loading pair:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNextPair();
    }, []);

    const handleChoice = (chosen: Anime) => {
        if (revealed || !anime1 || !anime2) return;

        const other = chosen.id === anime1.id ? anime2 : anime1;
        setSelection(chosen.id === anime1.id ? 'left' : 'right');
        setRevealed(true);

        if (chosen.members >= other.members) {
            playSuccess();
            setScore(prev => prev + 1);
            setStreak(prev => prev + 1);
            setTimeout(loadNextPair, 2000);
        } else {
            playError();
            setLives(prev => {
                const nextLives = prev - 1;
                if (nextLives <= 0) {
                    saveHighScore(score); // Save high score before game over
                    setTimeout(() => {
                        navigation.navigate('GameOver', { score });
                    }, 1500);
                } else {
                    setStreak(0);
                    setTimeout(loadNextPair, 2000);
                }
                return nextLives;
            });
        }
    };

    if (loading && !anime1) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.center}>
                    <Text style={styles.loadingText}>Chargement...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScoreBoard score={score} streak={streak} lives={lives} />

            <View style={styles.duelContainer}>
                {anime1 && (
                    <TouchableOpacity 
                        activeOpacity={0.9}
                        onPress={() => handleChoice(anime1)}
                        style={[styles.cardWrapper, selection === 'left' && styles.selectedCard]}
                    >
                        <AnimeCard 
                            anime={anime1} 
                            revealed={revealed} 
                            feedback={revealed ? (anime1.members >= (anime2?.members || 0) ? 'correct' : 'wrong') : null}
                            onPress={() => handleChoice(anime1)}
                        />
                    </TouchableOpacity>
                )}

                <View style={styles.vsCircle}>
                    <Text style={styles.vsText}>VS</Text>
                </View>

                {anime2 && (
                    <TouchableOpacity 
                        activeOpacity={0.9}
                        onPress={() => handleChoice(anime2)}
                        style={[styles.cardWrapper, selection === 'right' && styles.selectedCard]}
                    >
                        <AnimeCard 
                            anime={anime2} 
                            revealed={revealed} 
                            feedback={revealed ? (anime2.members >= (anime1?.members || 0) ? 'correct' : 'wrong') : null}
                            onPress={() => handleChoice(anime2)}
                        />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.footer}>
                <Text style={styles.hint}>
                    {revealed ? "Calcul du résultat..." : "Qui est le plus célèbre ?"}
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.colors.background,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: THEME.colors.ink,
        fontSize: 18,
        fontWeight: 'bold',
    },
    duelContainer: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardWrapper: {
        flex: 0.48,
        height: '80%',
    },
    selectedCard: {
        transform: [{ scale: 1.05 }],
        zIndex: 10,
    },
    vsCircle: {
        position: 'absolute',
        left: width / 2 - 25,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: THEME.colors.accent,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
        borderWidth: 3,
        borderColor: THEME.colors.background,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    vsText: {
        color: '#fff',
        fontWeight: 'black',
        fontSize: 18,
    },
    footer: {
        padding: 30,
        alignItems: 'center',
    },
    hint: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 14,
        fontStyle: 'italic',
    }
});