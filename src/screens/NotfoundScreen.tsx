import { Text, View, StyleSheet, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { THEME } from "../constants/theme"

export default function NotFoundScreen() {
    const navigation = useNavigation<any>();
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>404</Text>
            <Text style={styles.message}>COUP DUR, CETTE PAGE N'EXISTE PAS.</Text>

            <TouchableOpacity 
                style={styles.button} 
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Home')}
            >
                <Text style={styles.buttonText}>RETOUR AU MENU</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.colors.paper,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    title: {
        fontSize: 120,
        fontWeight: '900',
        color: THEME.colors.accent,
        marginBottom: -20,
        ...THEME.shadows.hard,
    },
    message: {
        fontSize: 24,
        fontWeight: '900',
        color: THEME.colors.ink,
        marginBottom: 60,
        textAlign: 'center',
        letterSpacing: 2,
    },
    button: {
        backgroundColor: THEME.colors.white,
        paddingVertical: 18,
        paddingHorizontal: 32,
        borderWidth: 4,
        borderColor: THEME.colors.ink,
        ...THEME.shadows.hard,
        transform: [{ rotate: '-2deg' }],
    },
    buttonText: {
        color: THEME.colors.ink,
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 2,
    },
});
