import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import StartLandingScreen from './src/screens/loginscreens/StartLandingScreen';
import PageContext from './src/screens/MainDrawerScreens/pagecontext';
const Stack = createStackNavigator();

// export default function StartStackScreen(){
//   StartStackScreen1();`
//   const [auth, setAuth] = useState('');

//   const StartStackScreen1 = (props) => (
//     <PageContext.Provider value={[auth, setAuth]}>
//       <NavigationContainer>
//         <Stack.Navigator headerMode="none">
//           <Stack.Screen name="StartLoginScreen" component={StartLandingScreen} />
//         </Stack.Navigator>
//       </NavigationContainer>
//       </PageContext.Provider>
//     );

// }

const App = () => {
  const [globalState, setglobalState] = useState({
    timerSeconds: 0,
    timerMinute: 0,
    updateStatus: 'Start',
    dateTimeUpdated24hr: '',
    updatePercentage: '',
  });
  return (
    <PageContext.Provider value={[globalState, setglobalState]}>
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="StartLoginScreen" component={StartLandingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
     </PageContext.Provider>
  );
};

export default App;
