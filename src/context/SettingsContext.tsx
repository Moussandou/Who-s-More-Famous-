import React, { createContext, useContext, useState, useEffect } from 'react';
import { Settings, DEFAULT_SETTINGS, getSettings as fetchStoredSettings, saveSettings as persistSettings } from '../services/storage';

interface SettingsContextType {
    settings: Settings;
    updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
    isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
    const [isLoading, setIsLoading] = useState(true);

    // Charger les paramètres au démarrage
    useEffect(() => {
        const loadSettings = async () => {
            const stored = await fetchStoredSettings();
            setSettings(stored);
            setIsLoading(false);
        };
        loadSettings();
    }, []);

    const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
        setSettings(prev => {
            const newSettings = { ...prev, [key]: value };
            persistSettings(newSettings); // Sauvegarder asynchronement
            return newSettings;
        });
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSetting, isLoading }}>
            {children}
        </SettingsContext.Provider>
    );
};


export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
