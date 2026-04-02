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
                <TouchableOpacity
                    style={styles.btnSecondary}
                    activeOpacity={0.8}
                    onPress={() => {
                        playImpact();
                        navigation.navigate('AboutScreen');
                    }}
                >
                    <Text style={styles.buttonTextSecondary}>{'À PROPOS'}</Text>
                </TouchableOpacity>

                <View style={styles.footerInfo}>
                    <Text style={styles.versionText}>WHO'S MORE FAMOUS V2.0.0 'BINGEKI'</Text>
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
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    backButton: {
        width: 50,
        height: 50,
        borderWidth: 3,
        borderColor: THEME.colors.ink,
        backgroundColor: THEME.colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        ...THEME.shadows.hard,
    },
    titleWrapper: {
        marginLeft: 20,
    },
    headerTitle: {
        color: THEME.colors.ink,
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: 1,
    },
    titleUnderline: {
        height: 8,
        width: '100%',
        backgroundColor: THEME.colors.accent,
        marginTop: -10,
        zIndex: -1,
        opacity: 0.3,
    },
    scrollContent: {
        padding: 24,
    },
    section: {
        marginBottom: 32,
        backgroundColor: THEME.colors.white,
        padding: 24,
        borderWidth: 4,
        borderColor: THEME.colors.ink,
        ...THEME.shadows.hard,
    },
    sectionTitle: {
        color: THEME.colors.gray,
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 4,
        marginBottom: 24,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
    },
    settingItemDivider: {
        height: 2,
        backgroundColor: THEME.colors.ink,
        marginVertical: 14,
        opacity: 0.1,
    },
    settingTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingLabel: {
        color: THEME.colors.ink,
        fontSize: 15,
        fontWeight: '900',
        marginLeft: 14,
        letterSpacing: 1,
    },
    segmentedContainer: {
        flexDirection: 'row',
        backgroundColor: THEME.colors.ink,
        padding: 4,
        borderWidth: 1,
        borderColor: THEME.colors.ink,
    },
    segBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    segBtnActive: {
        backgroundColor: THEME.colors.accent,
    },
    segText: {
        color: THEME.colors.white,
        fontSize: 12,
        fontWeight: '900',
    },
    segTextActive: {
        color: THEME.colors.white,
    },
    footerInfo: {
        alignItems: 'center',
        marginTop: 20,
        paddingBottom: 60,
    },
    versionText: {
        color: THEME.colors.gray,
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 3,
    },
    creditText: {
        color: THEME.colors.accent,
        fontSize: 11,
        marginTop: 6,
        fontWeight: '900',
        letterSpacing: 2,
    },
    btnSecondary: {
        backgroundColor: THEME.colors.white,
        height: 65,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: THEME.colors.ink,
        ...THEME.shadows.hard,
    },
    buttonTextSecondary: {
        color: THEME.colors.ink,
        fontSize: 15,
        fontWeight: '900',
        letterSpacing: 1,
    },
});
