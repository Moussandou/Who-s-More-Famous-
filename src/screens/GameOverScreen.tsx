import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function GameOverScreen({ navigation }: any) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Game Over !</Text>
            <Text style={styles.subtitle}>Score Final: 0 (Simulé)</Text>

            <TouchableOpacity 
                style={styles.buttonPlay}
                onPress={() => navigation.navigate('Home')}
            >
                <Text style={styles.buttonText}>🏠 Menu Principal</Text>
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
    title: { color: '#ff4b4b', fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
    subtitle: { color: '#8888aa', fontSize: 16, marginBottom: 60 },
    buttonPlay: { backgroundColor: '#7c3aed', paddingVertical: 16, paddingHorizontal: 48, borderRadius: 14, marginBottom: 16, width: '100%', alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
