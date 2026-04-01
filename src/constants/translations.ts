export const translations = {
    fr: {
        highScore: 'MEILLEUR SCORE',
        play: '▶ JOUER',
        settings: '⚙ Paramètres',
        back: 'Retour',
        gameplay: 'EXPÉRIENCE',
        application: 'APPLICATION',
        vibrations: 'Vibrations',
        difficulty: 'Difficulté',
        classic: 'Classique',
        expert: 'Expert',
        language: 'Langue',
        gameOver: 'Game Over !',
        yourScore: 'VOTRE SCORE',
        mainMenu: '🏠 Menu Principal',
        retry: 'Rejouer',
        loading: 'Chargement...',
        moreFans: 'Qui a le plus de fans ?',
        than: 'que',
        fans: 'fans',
        error: 'Une erreur est survenue...',
        footer: 'Créé avec ❤️ pour les fans d\'Anime'
    },
    en: {
        highScore: 'HIGHEST SCORE',
        play: '▶ PLAY',
        settings: '⚙ Settings',
        back: 'Back',
        gameplay: 'GAMEPLAY',
        application: 'APPLICATION',
        vibrations: 'Vibrations',
        difficulty: 'Difficulty',
        classic: 'Classic',
        expert: 'Expert',
        language: 'Language',
        gameOver: 'Game Over!',
        yourScore: 'YOUR SCORE',
        mainMenu: '🏠 Main Menu',
        retry: 'Retry',
        loading: 'Loading...',
        moreFans: 'Who has more fans?',
        than: 'than',
        fans: 'fans',
        error: 'An error occurred...',
        footer: 'Made with ❤️ for Anime fans'
    }
};

export type Language = 'fr' | 'en';
export type TranslationKey = keyof typeof translations.fr;
