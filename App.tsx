import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SettingsProvider } from './src/context/SettingsContext';

import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createStackNavigator();

export default function App() {
    return (
        <SettingsProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Game" component={GameScreen} />
                    <Stack.Screen name="GameOver" component={GameOverScreen} />
                    <Stack.Screen name="Settings" component={SettingsScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </SettingsProvider>
    );
}

