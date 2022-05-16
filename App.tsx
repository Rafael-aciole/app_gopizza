import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useFonts, DMSans_400Regular } from '@expo-google-fonts/dm-sans'
import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display';

import AppLoading from 'expo-app-loading';
import { AuthProvider } from '@hooks/auth'

import { ThemeProvider } from 'styled-components/native';
import theme from './src/theme';

import { Routes } from './src/routes';

export default function App() {
  const [ fontsLoaded ] = useFonts({
    DMSans_400Regular,
    DMSerifDisplay_400Regular
  });

  if(!fontsLoaded){
    return <AppLoading />
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        <StatusBar 
              barStyle='light-content'
              translucent
              backgroundColor='transparent'
          />
          
          <AuthProvider>
              <Routes />
          </AuthProvider>
          
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

