import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useSettings } from '../context/SettingsContext';

export interface Anime {
    id: number;
    title: string;
    image: string;
    members: number;
    score: number;
    year: number;
}

interface AnimeCardProps {
    anime: Anime | null;
    onPress: () => void;
    feedback?: 'correct' | 'wrong' | null;
    revealed?: boolean; // ✨ Nouveau : pour afficher le nombre de membres
}

export default function AnimeCard({ anime, onPress, feedback, revealed }: AnimeCardProps) {
    const { t } = useSettings();
    if (!anime) return null;



    // Calcul du style de bordure en fonction du feedback
    const borderStyle = feedback === 'correct' 
        ? styles.correctBorder 
        : feedback === 'wrong' 
        ? styles.wrongBorder 
        : null;

    return (
        <TouchableOpacity 
            style={[styles.card, borderStyle]} 
            onPress={onPress}
            activeOpacity={0.9}
        >
            <Image source={{ uri: anime.image }} style={styles.image} />
            
            <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={2}>{anime.title}</Text>
                
                {revealed && (
                    <View style={styles.revealContainer}>
                        <Text style={styles.memberCount}>
                            {anime.members.toLocaleString()}
                        </Text>
                        <Text style={styles.memberLabel}>{t('fans')}</Text>
                    </View>
                )}
            </View>

            {/* Overlay translucide pour le feedback visuel */}
            {feedback && (
                <View style={[
                    styles.overlay, 
                    feedback === 'correct' ? styles.correctOverlay : styles.wrongOverlay
                ]} />
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        height: 280,
        backgroundColor: 'rgba(255, 255, 255, 0.05)', // Glassmorphism
        borderRadius: 20,
        marginHorizontal: 5,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        // Shadow for premium look
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 5,
    },
    correctBorder: {
        borderColor: '#10b981',
        borderWidth: 2,
    },
    wrongBorder: {
        borderColor: '#ef4444',
        borderWidth: 2,
    },
    image: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 12,
        backgroundColor: 'rgba(0,0,0,0.4)', // Gradient simulé
    },
    title: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    revealContainer: {
        marginTop: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
    },
    memberCount: {
        color: '#fcd34d',
        fontWeight: '900',
        fontSize: 14,
    },
    memberLabel: {
        color: '#fff',
        fontSize: 10,
        marginLeft: 4,
        opacity: 0.8,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.3,
    },
    correctOverlay: {
        backgroundColor: '#10b981',
    },
    wrongOverlay: {
        backgroundColor: '#ef4444',
    },
});