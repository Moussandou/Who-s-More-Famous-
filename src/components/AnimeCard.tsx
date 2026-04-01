import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useRef } from 'react';
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
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
        Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
    };

    const onPressOut = () => {
        Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
    };

    if (!anime) return null;

    return (
        <Animated.View style={[styles.wrapper, { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity 
                style={[
                    styles.card, 
                    feedback === 'correct' && styles.correctBorder,
                    feedback === 'wrong' && styles.wrongBorder
                ]} 
                onPress={onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                disabled={revealed}
                activeOpacity={1}
            >
                <View style={styles.imageContainer}>
                    <Image source={{ uri: anime.image }} style={styles.image} resizeMode="cover" />
                    {revealed && (
                        <View style={styles.overlay}>
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
                
                <View style={styles.infoContainer}>
                    <Text style={styles.title} numberOfLines={2}>
                        {anime.title.toUpperCase()}
                    </Text>
                </View>

                {feedback && (
                    <View style={[styles.statusBanner, feedback === 'correct' ? styles.successBanner : styles.failBanner]}>
                        <Text style={styles.statusText}>{feedback === 'correct' ? 'WINNER' : 'LOSER'}</Text>
                    </View>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        marginHorizontal: 8,
    },
    card: {
        flex: 1,
        backgroundColor: THEME.colors.surface,
        borderWidth: THEME.borders.width,
        borderColor: THEME.colors.ink,
        ...THEME.shadows.hard,
        overflow: 'hidden',
    },
    correctBorder: {
        borderColor: '#10B981', // Solid emerald for win
    },
    wrongBorder: {
        borderColor: THEME.colors.accent,
    },
    imageContainer: {
        flex: 1,
        backgroundColor: '#E5E7EB',
        borderBottomWidth: THEME.borders.width,
        borderColor: THEME.colors.ink,
    },

    image: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.7)', // Light overlay instead of dark
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContainer: {
        paddingVertical: 16,
        paddingHorizontal: 8,
        backgroundColor: THEME.colors.white,
        minHeight: 90,
        justifyContent: 'center',
    },
    title: {
        color: THEME.colors.ink,
        fontSize: 15,
        fontWeight: '900',
        lineHeight: 20,
        textAlign: 'center',
        letterSpacing: 0.5,
    },

    badge: {
        backgroundColor: THEME.colors.accent,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderWidth: 2,
        borderColor: THEME.colors.ink,
        alignItems: 'center',
        transform: [{ rotate: '1deg' }],
        ...THEME.shadows.hard,
    },
    memberCount: {
        color: THEME.colors.white,
        fontWeight: '900',
        fontSize: 22,
    },
    memberLabel: {
        color: THEME.colors.white,
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 2,
    },
    statusBanner: {
        position: 'absolute',
        top: '35%',
        left: -10,
        right: -10,
        padding: 10,
        borderWidth: 3,
        borderColor: THEME.colors.ink,
        alignItems: 'center',
        zIndex: 50,
        transform: [{ rotate: '-8deg' }],
        ...THEME.shadows.hard,
    },
    successBanner: {
        backgroundColor: '#10B981',
    },
    failBanner: {
        backgroundColor: THEME.colors.accent,
    },
    statusText: {
        color: THEME.colors.white,
        fontWeight: '900',
        fontSize: 24,
        letterSpacing: 3,
    },
});