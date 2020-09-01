import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import SplashScreen from './SplashScreen';
import LoginScreen from './LoginScreen';
import StartMainDrawerScreen from '../MainDrawerScreens/StartMainDrawerScreens';

const Stack = createStackNavigator();

const StartLandingScreen = (props) => (
  <Stack.Navigator headerMode="none" initialRouteName="SplashScreen">
    <Stack.Screen name="SplashScreen" component={SplashScreen} />
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen
      name="StartMainDrawerScreen"
      component={StartMainDrawerScreen}
    />
  </Stack.Navigator>
);

export default StartLandingScreen;
