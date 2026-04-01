import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function SettingsScreen({ navigation }: any) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>⚙ Paramètres</Text>
            <Text style={styles.subtitle}>Configurions l'expérience...</Text>

            <TouchableOpacity 
                style={styles.buttonSecondary}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.buttonTextSecondary}>⬅ Retour</Text>
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
        padding: 24,
    },
    title: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
    subtitle: { color: '#8888aa', fontSize: 16, marginBottom: 60 },
    buttonSecondary: { borderWidth: 1, borderColor: '#444', paddingVertical: 14, paddingHorizontal: 48, borderRadius: 14, width: '100%', alignItems: 'center' },
    buttonTextSecondary: { color: '#8888aa', fontSize: 16 },
});
