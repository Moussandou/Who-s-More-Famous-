import AsyncStorage from '@react-native-async-storage/async-storage';

const HIGH_SCORE_KEY = '@high_score';

/**
 * Récupère le meilleur score sauvegardé.
 */
export async function getHighScore(): Promise<number> {
    try {
        const value = await AsyncStorage.getItem(HIGH_SCORE_KEY);
        return value !== null ? parseInt(value, 10) : 0;
    } catch (e) {
        console.error("Erreur lors de la lecture du high score", e);
        return 0;
    }
}

/**
 * Sauvegarde un nouveau score s'il est supérieur au précédent.
 */
export async function saveHighScore(newScore: number): Promise<boolean> {
    try {
        const currentHigh = await getHighScore();
        if (newScore > currentHigh) {
            await AsyncStorage.setItem(HIGH_SCORE_KEY, newScore.toString());
            return true; // Nouveau record !
        }
        return false;
    } catch (e) {
        console.error("Erreur lors de la sauvegarde du high score", e);
        return false;
    }
}
