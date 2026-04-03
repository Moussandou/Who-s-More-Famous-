import { Text, View, StyleSheet, TouchableOpacity } from "react-native"
import { THEME } from "../constants/theme"
import { useNavigation } from "@react-navigation/native";

export default function AboutScreen() {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Text style={styles.title}>À propos</Text>
            <Text style={styles.text}>Who's More Famous ? {"\n"}
                C'est une application développée par Moussandou Mroivili dans le cadre d'un stage a Dev ID{"\n"} </Text>
            <View>
                <Text style={styles.text}>Version : 1.0.0</Text>
                <Text style={styles.text}>Développé par : Moussandou Mroivili</Text>
                <Text style={styles.text}>Stage à : Dev ID</Text>
                <Text style={styles.text}>Année : 2026</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
                <Text style={styles.buttonText}>Fermer</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.colors.paper,
        padding: 20,
    },
    title: {
        color: THEME.colors.gray,
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 3,
        marginBottom: 2,
    },
    text: {
        color: THEME.colors.ink,
        fontSize: 20,
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: THEME.colors.accent,
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    buttonText: {
        color: THEME.colors.white,
        fontSize: 20,
        fontWeight: 'bold',
    }
})