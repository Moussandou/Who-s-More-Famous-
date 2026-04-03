import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { THEME } from "../constants/theme";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

export default function AboutScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Header Badge */}
                <View style={styles.header}>
                    <View style={styles.titleBadge}>
                        <Text style={styles.titleText}>{"À PROPOS"}</Text>
                    </View>
                </View>

                {/* Main Info Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.appName}>WHO'S MORE FAMOUS?</Text>
                        <Text style={styles.tagline}>Le jeu de duel d'animes ultime</Text>
                    </View>

                    <View style={styles.divider} />

                    {/* Info Rows */}
                    <View style={styles.infoSection}>
                        <InfoRow
                            icon="person-outline"
                            label="DÉVELOPPEUR"
                            value="Moussandou Mroivili"
                        />
                        <InfoRow
                            icon="briefcase-outline"
                            label="STAGE"
                            value="Dev ID"
                        />
                        <InfoRow
                            icon="calendar-outline"
                            label="ANNÉE"
                            value="2026"
                        />
                        <InfoRow
                            icon="git-branch-outline"
                            label="VERSION"
                            value="1.0.0"
                        />
                    </View>

                    <View style={styles.footerInfo}>
                        <Text style={styles.footerText}>
                            Développé par Moussandou Mroivili.
                        </Text>
                    </View>
                </View>

                {/* Action Button */}
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    activeOpacity={0.8}
                >
                    <Ionicons name="arrow-back" size={24} color={THEME.colors.ink} />
                    <Text style={styles.backButtonText}>RETOUR</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

function InfoRow({ icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <View style={styles.row}>
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={20} color={THEME.colors.accent} />
            </View>
            <View style={styles.rowTextContainer}>
                <Text style={styles.rowLabel}>{label}</Text>
                <Text style={styles.rowValue}>{value}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.colors.paper,
    },
    scrollContent: {
        padding: 24,
        alignItems: 'center',
        paddingTop: 40,
    },
    header: {
        marginBottom: 40,
        zIndex: 10,
    },
    titleBadge: {
        backgroundColor: THEME.colors.accent,
        paddingHorizontal: 28,
        paddingVertical: 10,
        borderWidth: 4,
        borderColor: THEME.colors.ink,
        transform: [{ rotate: '-3deg' }],
        ...THEME.shadows.hard,
    },
    titleText: {
        color: THEME.colors.white,
        fontSize: 28,
        fontWeight: '900',
        letterSpacing: 2,
    },
    card: {
        backgroundColor: THEME.colors.white,
        width: '100%',
        borderWidth: 4,
        borderColor: THEME.colors.ink,
        padding: 20,
        ...THEME.shadows.hard,
        marginBottom: 40,
    },
    cardHeader: {
        marginBottom: 15,
        alignItems: 'center',
    },
    appName: {
        fontSize: 18,
        fontWeight: '900',
        color: THEME.colors.ink,
        letterSpacing: 1,
    },
    tagline: {
        fontSize: 14,
        color: THEME.colors.gray,
        fontWeight: '600',
        marginTop: 4,
    },
    divider: {
        height: 3,
        backgroundColor: THEME.colors.ink,
        marginVertical: 15,
        opacity: 0.1,
    },
    infoSection: {
        gap: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        backgroundColor: THEME.colors.paper,
        borderRadius: 0,
        borderWidth: 2,
        borderColor: THEME.colors.ink,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    rowTextContainer: {
        flex: 1,
    },
    rowLabel: {
        fontSize: 10,
        fontWeight: '900',
        color: THEME.colors.gray,
        letterSpacing: 1.5,
    },
    rowValue: {
        fontSize: 16,
        fontWeight: '700',
        color: THEME.colors.ink,
        marginTop: 2,
    },
    footerInfo: {
        marginTop: 25,
        paddingTop: 20,
        borderTopWidth: 2,
        borderTopColor: '#f0f0f0',
    },
    footerText: {
        fontSize: 13,
        color: THEME.colors.gray,
        textAlign: 'center',
        lineHeight: 18,
        fontStyle: 'italic',
    },
    backButton: {
        backgroundColor: THEME.colors.white,
        flexDirection: 'row',
        height: 55,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: THEME.colors.ink,
        ...THEME.shadows.hard,
        gap: 10,
    },
    backButtonText: {
        color: THEME.colors.ink,
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 2,
    },
});