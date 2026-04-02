import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Linking from 'expo-linking';
import { SettingsProvider } from './src/context/SettingsContext';

import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AboutScreen from './src/screens/aboutScreen';
import NotFoundScreen from './src/screens/NotfoundScreen';

const Stack = createStackNavigator();

const linking = {
    prefixes: [Linking.createURL('/')],
    config: {
        screens: {
            Home: '',
            Game: 'game',
            GameOver: 'game-over',
            Settings: 'settings',
            AboutScreen: 'about',
            NotFound: '*',
        },
    },
};

export default function App() {
    return (
        <SettingsProvider>
            <NavigationContainer linking={linking}>
                <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Game" component={GameScreen} />
                    <Stack.Screen name="GameOver" component={GameOverScreen} />
                    <Stack.Screen name="Settings" component={SettingsScreen} />
                    <Stack.Screen name="AboutScreen" component={AboutScreen} />
                    <Stack.Screen name="NotFound" component={NotFoundScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </SettingsProvider>
    );
}

