import { View, Text, TouchableOpacity, StyleSheet, Switch, ScrollView } from 'react-native';
import { useHaptics } from '../hooks/useHaptics';
import { useSettings } from '../context/SettingsContext';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/theme';

export default function SettingsScreen({ navigation }: any) {
    const { playImpact } = useHaptics();
    const { settings, updateSetting, t } = useSettings();

    const toggleHaptics = (value: boolean) => {
        updateSetting('vibrations', value);
        if (value) playImpact();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => { playImpact(); navigation.goBack(); }}
                >
                    <Ionicons name="chevron-back" size={28} color={THEME.colors.ink} />
                </TouchableOpacity>
                <View style={styles.titleWrapper}>
                    <Text style={styles.headerTitle}>{t('settings').replace(/⚙ /, '').toUpperCase()}</Text>
                    <View style={styles.titleUnderline} />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('gameplay').toUpperCase()}</Text>
                    
                    <View style={styles.settingItem}>
                        <View style={styles.settingTextContainer}>
                            <Ionicons name="pulse" size={20} color={THEME.colors.ink} />
                            <Text style={styles.settingLabel}>{t('vibrations').toUpperCase()}</Text>
                        </View>
                        <Switch
                            value={settings.vibrations}
                            onValueChange={toggleHaptics}
                            trackColor={{ false: THEME.colors.gray, true: THEME.colors.ink }}
                            thumbColor={THEME.colors.white}
                        />
                    </View>

                    <View style={styles.settingItemDivider} />

                    <View style={styles.settingItem}>
                        <View style={styles.settingTextContainer}>
                            <Ionicons name="speedometer" size={20} color={THEME.colors.ink} />
                            <Text style={styles.settingLabel}>{t('difficulty').toUpperCase()}</Text>
                        </View>
                        <View style={styles.segmentedContainer}>
                            <TouchableOpacity
                                style={[styles.segBtn, settings.difficulty === 'classic' && styles.segBtnActive]}
                                onPress={() => { playImpact(); updateSetting('difficulty', 'classic'); }}
                            >
                                <Text style={[styles.segText, settings.difficulty === 'classic' && styles.segTextActive]}>
                                    {t('classic').toUpperCase()}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.segBtn, settings.difficulty === 'expert' && styles.segBtnActive]}
                                onPress={() => { playImpact(); updateSetting('difficulty', 'expert'); }}
                            >
                                <Text style={[styles.segText, settings.difficulty === 'expert' && styles.segTextActive]}>
                                    {t('expert').toUpperCase()}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('application').toUpperCase()}</Text>
                    
                    <View style={styles.settingItem}>
                        <View style={styles.settingTextContainer}>
                            <Ionicons name="language" size={20} color={THEME.colors.ink} />
                            <Text style={styles.settingLabel}>{t('language').toUpperCase()}</Text>
                        </View>
                        <View style={styles.segmentedContainer}>
                            <TouchableOpacity
                                style={[styles.segBtn, settings.language === 'fr' && styles.segBtnActive]}
                                onPress={() => { playImpact(); updateSetting('language', 'fr'); }}
                            >
                                <Text style={[styles.segText, settings.language === 'fr' && styles.segTextActive]}>FR</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.segBtn, settings.language === 'en' && styles.segBtnActive]}
                                onPress={() => { playImpact(); updateSetting('language', 'en'); }}
                            >
                                <Text style={[styles.segText, settings.language === 'en' && styles.segTextActive]}>EN</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={styles.footerInfo}>
                    <Text style={styles.versionText}>WHO'S MORE FAMOUS V1.1.0</Text>
                    <Text style={styles.creditText}>{t('footer').toUpperCase()} BY MOUSSANDOU</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.colors.paper,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backButton: {
        width: 44,
        height: 44,
        borderWidth: 2,
        borderColor: THEME.colors.ink,
        backgroundColor: THEME.colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        ...THEME.shadows.hard,
    },
    titleWrapper: {
        marginLeft: 20,
        alignItems: 'flex-start',
    },
    headerTitle: {
        color: THEME.colors.ink,
        fontSize: 28,
        fontWeight: '900',
    },
    titleUnderline: {
        height: 6,
        width: '100%',
        backgroundColor: THEME.colors.accent,
        marginTop: -4,
        zIndex: -1,
    },
    scrollContent: {
        padding: 20,
    },
    section: {
        marginBottom: 30,
        backgroundColor: THEME.colors.white,
        padding: 20,
        borderWidth: THEME.borders.width,
        borderColor: THEME.colors.ink,
        ...THEME.shadows.hard,
    },
    sectionTitle: {
        color: THEME.colors.gray,
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 20,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    settingItemDivider: {
        height: 1,
        backgroundColor: THEME.colors.paper,
        marginVertical: 10,
    },
    settingTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingLabel: {
        color: THEME.colors.ink,
        fontSize: 14,
        fontWeight: '900',
        marginLeft: 12,
    },
    segmentedContainer: {
        flexDirection: 'row',
        backgroundColor: THEME.colors.ink,
        padding: 3,
        borderWidth: 1,
        borderColor: THEME.colors.ink,
    },
    segBtn: {
        paddingVertical: 6,
        paddingHorizontal: 16,
    },
    segBtnActive: {
        backgroundColor: THEME.colors.white,
    },
    segText: {
        color: THEME.colors.paper,
        fontSize: 11,
        fontWeight: '900',
    },
    segTextActive: {
        color: THEME.colors.ink,
    },
    footerInfo: {
        alignItems: 'center',
        marginTop: 20,
        paddingBottom: 40,
    },
    versionText: {
        color: THEME.colors.gray,
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
    },
    creditText: {
        color: THEME.colors.gray,
        fontSize: 9,
        marginTop: 4,
        fontWeight: '700',
        letterSpacing: 0.5,
    }
});

