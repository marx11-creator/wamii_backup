import 'react-native-gesture-handler';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import StartLandingScreen from './src/screens/loginscreens/StartLandingScreen';

const Stack = createStackNavigator();

const StartStackScreen = (props) => (
  <NavigationContainer>
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="StartLoginScreen" component={StartLandingScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default StartStackScreen;
