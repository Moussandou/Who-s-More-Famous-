import { Text, View, StyleSheet } from "react-native"
import { THEME } from "../constants/theme"

export default function AboutScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>À propos</Text>
            <Text style={styles.text}>Who's More Famous ? {"\n"}{"\n"}
                C'est une application développée par Moussandou Mroivili dans le cadre d'un stage a Dev ID </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.colors.paper,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: THEME.colors.white,
        fontSize: 56,
        fontWeight: '900',
        lineHeight: 56,
    },
    text: {
        color: THEME.colors.ink,
        fontSize: 20,
        fontWeight: 'bold',
    }
})