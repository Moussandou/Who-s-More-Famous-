import { View, Text, TouchableOpacity, StyleSheet, Switch, ScrollView } from 'react-native';
import { useHaptics } from '../hooks/useHaptics';
import { useSettings } from '../context/SettingsContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen({ navigation }: any) {
    const { playImpact } = useHaptics();
    const { settings, updateSetting, t } = useSettings();

    const toggleHaptics = (value: boolean) => {
        updateSetting('vibrations', value);
        if (value) playImpact();
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#1a1a2e', '#0f0f1a']}
                style={StyleSheet.absoluteFillObject}
            />

            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => { playImpact(); navigation.goBack(); }}
                >
                    <Ionicons name="chevron-back" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('settings').replace(/⚙ /, '')}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('gameplay')}</Text>
                    
                    <View style={styles.settingItem}>
                        <View style={styles.settingTextContainer}>
                            <Ionicons name="pulse" size={22} color="#7c3aed" />
                            <Text style={styles.settingLabel}>{t('vibrations')}</Text>
                        </View>
                        <Switch
                            value={settings.vibrations}
                            onValueChange={toggleHaptics}
                            trackColor={{ false: '#333', true: '#7c3aed' }}
                            thumbColor="#fff"
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingTextContainer}>
                            <Ionicons name="speedometer" size={22} color="#7c3aed" />
                            <Text style={styles.settingLabel}>{t('difficulty')}</Text>
                        </View>
                        <View style={styles.difficultyContainer}>
                            <TouchableOpacity
                                style={[styles.diffBtn, settings.difficulty === 'classic' && styles.diffBtnActive]}
                                onPress={() => { playImpact(); updateSetting('difficulty', 'classic'); }}
                            >
                                <Text style={[styles.diffText, settings.difficulty === 'classic' && styles.diffTextActive]}>{t('classic')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.diffBtn, settings.difficulty === 'expert' && styles.diffBtnActive]}
                                onPress={() => { playImpact(); updateSetting('difficulty', 'expert'); }}
                            >
                                <Text style={[styles.diffText, settings.difficulty === 'expert' && styles.diffTextActive]}>{t('expert')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('application')}</Text>
                    
                    <View style={styles.settingItem}>
                        <View style={styles.settingTextContainer}>
                            <Ionicons name="language" size={22} color="#7c3aed" />
                            <Text style={styles.settingLabel}>{t('language')}</Text>
                        </View>
                        <View style={styles.difficultyContainer}>
                            <TouchableOpacity
                                style={[styles.diffBtn, settings.language === 'fr' && styles.diffBtnActive]}
                                onPress={() => { playImpact(); updateSetting('language', 'fr'); }}
                            >
                                <Text style={[styles.diffText, settings.language === 'fr' && styles.diffTextActive]}>FR</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.diffBtn, settings.language === 'en' && styles.diffBtnActive]}
                                onPress={() => { playImpact(); updateSetting('language', 'en'); }}
                            >
                                <Text style={[styles.diffText, settings.language === 'en' && styles.diffTextActive]}>EN</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <TouchableOpacity 
                    style={styles.footerInfo}
                    onPress={() => playImpact()}
                >
                    <Text style={styles.versionText}>Who's More Famous v1.0.2</Text>
                    <Text style={styles.creditText}>{t('footer')}</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f0f1a',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 15,
    },
    scrollContent: {
        padding: 20,
    },
    section: {
        marginBottom: 30,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 20,
        padding: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    sectionTitle: {
        color: '#8888aa',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1.5,
        marginBottom: 15,
        marginLeft: 5,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 5,
    },
    settingTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingLabel: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 12,
    },
    difficultyContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 10,
        padding: 4,
    },
    diffBtn: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 7,
    },
    diffBtnActive: {
        backgroundColor: '#7c3aed',
    },
    diffText: {
        color: '#8888aa',
        fontSize: 13,
        fontWeight: 'bold',
    },
    diffTextActive: {
        color: '#fff',
    },
    footerInfo: {
        alignItems: 'center',
        marginTop: 20,
        paddingBottom: 40,
    },
    versionText: {
        color: '#444466',
        fontSize: 12,
        fontWeight: 'bold',
    },
    creditText: {
        color: '#444466',
        fontSize: 11,
        marginTop: 4,
    }
});
