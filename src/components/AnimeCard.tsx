import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

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
    feedback: 'correct' | 'wrong' | null;
}

export default function AnimeCard({ anime, onPress, feedback }: AnimeCardProps) {
    if (!anime) return null;

    // Couleur de bordure selon le feedback
    const borderColor = feedback === 'correct' ? '#22c55e'   // vert
        : feedback === 'wrong' ? '#ef4444'   // rouge
            : '#333';                               // neutre

    return (
        <TouchableOpacity
            style={[styles.card, { borderColor }]} // [] = merge de styles
            onPress={onPress}
            disabled={!!feedback} // désactivé si un feedback est déjà affiché
        >
            <Image
                source={{ uri: anime.image }}
                style={styles.image}
                resizeMode="cover"
            />
            <Text style={styles.title} numberOfLines={2}>
                {anime.title}
            </Text>
            {feedback && (
                <Text style={styles.members}>
                    👥 {anime.members.toLocaleString()} membres
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: '#1a1a2e',
        borderRadius: 16,
        borderWidth: 2,
        overflow: 'hidden',
        marginHorizontal: 6,
    },
    image: {
        width: '100%',
        height: 200,
    },
    title: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        padding: 10,
        textAlign: 'center',
    },
    members: {
        color: '#a78bfa',
        fontSize: 12,
        textAlign: 'center',
        paddingBottom: 10,
    },
});