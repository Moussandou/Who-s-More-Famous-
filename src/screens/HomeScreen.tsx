import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { getHighScore } from '../services/storage';

export default function HomeScreen({ navigation }: any) {
    const [highScore, setHighScore] = useState(0);

    // Se déclenche à chaque fois que l'écran devient actif
    useFocusEffect(
        useCallback(() => {
            getHighScore().then(setHighScore);
        }, [])
    );
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#1a1a2e', '#0f0f1a']}
                style={StyleSheet.absoluteFillObject}
            />
            
            <View style={styles.content}>
                <View style={styles.headerIndicator}>
                    <Text style={styles.highScoreLabel}>MEILLEUR SCORE</Text>
                    <Text style={styles.highScoreValue}>🏆 {highScore}</Text>
                </View>

                <Text style={styles.title}>🎌 Who's More Famous?</Text>
                <Text style={styles.subtitle}>Anime Edition par Moussandou</Text>
                
                <TouchableOpacity
                    style={styles.buttonPlay}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('Game')}
                >
                    <LinearGradient
                        colors={['#7c3aed', '#6366f1']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradientButton}
                    >
                        <Text style={styles.buttonText}>▶ JOUER</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttonSecondary}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('Settings')}
                >
                    <Text style={styles.buttonTextSecondary}>⚙ Paramètres</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f0f1a',
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
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(124, 58, 237, 0.2)',
    },
    highScoreLabel: {
        color: '#8888aa',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 2,
    },
    highScoreValue: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    title: { 
        fontSize: 32, 
        fontWeight: '900', 
        color: '#fff', 
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: { 
        fontSize: 14, 
        color: '#8888aa', 
        marginBottom: 80,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    buttonPlay: { 
        width: '100%', 
        height: 60,
        marginBottom: 16, 
        borderRadius: 18,
        overflow: 'hidden',
        // Ombre pour iOS
        shadowColor: '#7c3aed',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        // Elevation pour Android
        elevation: 8,
    },
    gradientButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonSecondary: { 
        paddingVertical: 14, 
        paddingHorizontal: 48, 
        borderRadius: 18, 
        width: '100%', 
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#222',
    },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 1 },
    buttonTextSecondary: { color: '#8888aa', fontSize: 16, fontWeight: '600' },
});
