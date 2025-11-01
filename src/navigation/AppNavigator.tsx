import { StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabStack } from './TabStack';
import StartUpScreen from './StartUpScreen';
import { Routes } from '@constants/routes';

const AppNavigator: React.FC = () => {
  const [splash, setSplash] = useState<boolean>(true);

  const Stack = createNativeStackNavigator();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {splash ? (
        <StartUpScreen />
      ) : (
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={Routes.TabStack} component={TabStack} />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({});
