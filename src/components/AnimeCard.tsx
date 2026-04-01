import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useSettings } from '../context/SettingsContext';
import { THEME } from '../constants/theme';

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
    revealed?: boolean;
}

export default function AnimeCard({ anime, onPress, feedback, revealed }: AnimeCardProps) {
    const { t } = useSettings();
    if (!anime) return null;

    return (
        <TouchableOpacity 
            style={[
                styles.card, 
                feedback === 'correct' && styles.correctBorder,
                feedback === 'wrong' && styles.wrongBorder
            ]} 
            onPress={onPress}
            activeOpacity={1} // No fade on click for a "snappy" manga feel
        >
            <View style={styles.imageContainer}>
                <Image source={{ uri: anime.image }} style={styles.image} resizeMode="cover" />
            </View>
            
            <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={2}>
                    {anime.title.toUpperCase()}
                </Text>
                
                {revealed && (
                    <View style={styles.revealContainer}>
                        <View style={styles.badge}>
                            <Text style={styles.memberCount}>
                                {anime.members.toLocaleString()}
                            </Text>
                            <Text style={styles.memberLabel}>
                                {t('fans').toUpperCase()}
                            </Text>
                        </View>
                    </View>
                )}
            </View>

            {/* Solid marks for feedback instead of generic overlay */}
            {feedback === 'correct' && (
                <View style={[styles.markContainer, styles.correctMark]}>
                    <Text style={styles.markText}>WIN</Text>
                </View>
            )}
            {feedback === 'wrong' && (
                <View style={[styles.markContainer, styles.wrongMark]}>
                    <Text style={styles.markText}>LOSE</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        height: 280,
        backgroundColor: THEME.colors.white,
        borderRadius: THEME.borders.radius,
        marginHorizontal: 8,
        borderWidth: THEME.borders.width,
        borderColor: THEME.colors.ink,
        ...THEME.shadows.hard,
        overflow: 'hidden',
    },
    correctBorder: {
        borderColor: '#10b981',
        borderWidth: THEME.borders.width + 1,
    },
    wrongBorder: {
        borderColor: THEME.colors.accent,
        borderWidth: THEME.borders.width + 1,
    },
    imageContainer: {
        flex: 1,
        backgroundColor: '#ddd',
        borderBottomWidth: THEME.borders.width,
        borderColor: THEME.colors.ink,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    infoContainer: {
        padding: 10,
        backgroundColor: THEME.colors.white,
        height: 90,
        justifyContent: 'center',
    },
    title: {
        color: THEME.colors.ink,
        fontSize: 14,
        fontWeight: '900',
        lineHeight: 18,
    },
    revealContainer: {
        marginTop: 6,
        alignSelf: 'flex-start',
    },
    badge: {
        backgroundColor: THEME.colors.ink,
        paddingHorizontal: 6,
        paddingVertical: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    memberCount: {
        color: THEME.colors.paper,
        fontWeight: '900',
        fontSize: 12,
    },
    memberLabel: {
        color: THEME.colors.paper,
        fontSize: 9,
        marginLeft: 4,
        fontWeight: 'bold',
    },
    markContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 2,
        borderColor: THEME.colors.ink,
        backgroundColor: THEME.colors.white,
        transform: [{ rotate: '15deg' }],
        zIndex: 10,
    },
    correctMark: {
        backgroundColor: '#10b981',
    },
    wrongMark: {
        backgroundColor: THEME.colors.accent,
    },
    markText: {
        color: THEME.colors.ink,
        fontWeight: '900',
        fontSize: 16,
    }
});