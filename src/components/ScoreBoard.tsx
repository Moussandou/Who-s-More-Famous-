import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface ScoreBoardProps {
    score: number;
    streak: number;
    lives: number;
}

export default function ScoreBoard({ score, streak, lives }: ScoreBoardProps) {
    return (
        <View style={styles.container}>
            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>SCORE</Text>
                    <Text style={styles.statValue}>{score}</Text>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>STREAK</Text>
                    <Text style={styles.statValue}>x{streak}</Text>
                </View>
            </View>

            <View style={styles.livesContainer}>
                {[1, 2, 3].map((i) => (
                    <Ionicons 
                        key={i}
                        name={i <= lives ? "heart" : "heart-outline"} 
                        size={22} 
                        color={THEME.colors.primary} 
                        style={styles.heart}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 15,
        paddingTop: 10,
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: THEME.colors.ink,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 14,
        alignItems: 'center',
        ...THEME.shadows.hard,
    },
    statItem: {
        alignItems: 'center',
        minWidth: 55,
    },
    divider: {
        width: 1,
        height: '70%',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginHorizontal: 12,
    },
    statLabel: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 2,
    },
    statValue: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '900',
    },
    livesContainer: {
        flexDirection: 'row',
        backgroundColor: THEME.colors.white,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: THEME.colors.ink,
        ...THEME.shadows.hard,
    },
    heart: {
        marginHorizontal: 2,
    },
});
