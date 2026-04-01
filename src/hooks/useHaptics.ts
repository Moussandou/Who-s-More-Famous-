import * as Haptics from 'expo-haptics';
import { useSettings } from '../context/SettingsContext';

/**
 * Hook personnalisé pour gérer les retours haptiques (vibrations) de manière centralisée.
 */
export const useHaptics = () => {
    const { settings } = useSettings();
    
    // Vérifier si les vibrations sont activées dans les paramètres
    const canPlay = settings.vibrations;

    // Pour les interactions standard (boutons, clics)
    const playImpact = (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium) => {
        if (canPlay) Haptics.impactAsync(style);
    };

    // Pour les succès (bonne réponse)
    const playSuccess = () => {
        if (canPlay) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    // Pour les échecs (mauvaise réponse, game over)
    const playError = () => {
        if (canPlay) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    };

    // Pour une notification d'avertissement
    const playWarning = () => {
        if (canPlay) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    };

    // Pour une sélection légère
    const playLight = () => {
        if (canPlay) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    return {
        playImpact,
        playSuccess,
        playError,
        playWarning,
        playLight
    };
};

