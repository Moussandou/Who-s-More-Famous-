import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useHaptics } from '../hooks/useHaptics';
import { useSettings } from '../context/SettingsContext';

export default function GameOverScreen({ navigation, route }: any) {
    const { score } = route.params || { score: 0 };
    const { playError, playImpact } = useHaptics();
    const { t } = useSettings();

    useEffect(() => {
        // ✨ Vibration d'erreur à l'ouverture pour marquer le Game Over
        playError();
    }, []);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#1a1a2e', '#0f0f1a']}
                style={StyleSheet.absoluteFillObject}
            />

            <Text style={styles.emoji}>💀</Text>
            <Text style={styles.title}>{t('gameOver')}</Text>
            
            <View style={styles.scoreContainer}>
                <Text style={styles.scoreLabel}>{t('yourScore')}</Text>
                <Text style={styles.scoreValue}>{score}</Text>
            </View>

            <TouchableOpacity 
                style={styles.buttonPlay}
                activeOpacity={0.8}
                onPress={() => {
                    playImpact();
                    navigation.navigate('Home');
                }}
            >
                <LinearGradient
                    colors={['#7c3aed', '#6366f1']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradient}
                >
                    <Text style={styles.buttonText}>{t('mainMenu')}</Text>
                </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.buttonRetry}
                activeOpacity={0.7}
                onPress={() => {
                    playImpact();
                    navigation.replace('Game');
                }}
            >
                <Text style={styles.retryText}>{t('retry')}</Text>
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f0f1a',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emoji: {
        fontSize: 64,
        marginBottom: 10,
    },
    title: { 
        color: '#ff4b4b', 
        fontSize: 40, 
        fontWeight: '900', 
        marginBottom: 40,
        letterSpacing: 2,
    },
    scoreContainer: {
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingVertical: 20,
        paddingHorizontal: 40,
        borderRadius: 20,
        marginBottom: 60,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    scoreLabel: {
        color: '#8888aa',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 2,
        marginBottom: 5,
    },
    scoreValue: {
        color: '#fff',
        fontSize: 64,
        fontWeight: '900',
    },
    buttonPlay: {
        width: '100%',
        height: 56,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
    },
    gradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: { 
        color: '#fff', 
        fontSize: 18, 
        fontWeight: 'bold' 
    },
    buttonRetry: {
        padding: 10,
    },
    retryText: {
        color: '#8888aa',
        fontSize: 16,
        fontWeight: '600',
    }
});
