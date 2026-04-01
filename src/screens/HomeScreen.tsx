import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }: any) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>🎌 Who's More Famous?</Text>
            <Text style={styles.subtitle}>Anime Edition</Text>
            
            <TouchableOpacity
                style={styles.buttonPlay}
                onPress={() => navigation.navigate('Game')}
            >
                <Text style={styles.buttonText}>▶ Jouer</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={() => navigation.navigate('Settings')}
            >
                <Text style={styles.buttonTextSecondary}>⚙ Paramètres</Text>
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
    title: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#8888aa', marginBottom: 60 },
    buttonPlay: { backgroundColor: '#7c3aed', paddingVertical: 16, paddingHorizontal: 48, borderRadius: 14, marginBottom: 16, width: '100%', alignItems: 'center' },
    buttonSecondary: { borderWidth: 1, borderColor: '#444', paddingVertical: 14, paddingHorizontal: 48, borderRadius: 14, width: '100%', alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    buttonTextSecondary: { color: '#8888aa', fontSize: 16 },
});
