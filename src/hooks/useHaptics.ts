import * as Haptics from 'expo-haptics';

/**
 * Hook personnalisé pour gérer les retours haptiques (vibrations) de manière centralisée.
 */
export const useHaptics = () => {
    
    // Pour les interactions standard (boutons, clics)
    const playImpact = (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium) => {
        Haptics.impactAsync(style);
    };

    // Pour les succès (bonne réponse)
    const playSuccess = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    // Pour les échecs (mauvaise réponse, game over)
    const playError = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    };

    // Pour une notification d'avertissement
    const playWarning = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    };

    // Pour une sélection légère
    const playLight = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    return {
        playImpact,
        playSuccess,
        playError,
        playWarning,
        playLight
    };
};
