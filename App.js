import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import StartLandingScreen from './src/screens/loginscreens/StartLandingScreen';
import PageContextGlobalState  from './src/screens/MainDrawerScreens/pagecontext';
import PageContextGlobalTimer from './src/screens/MainDrawerScreens/pagecontext2';
import moment from 'moment';
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
  const [globalTimer, setglobalTimer] = useState({
    lastUpdate: '---',
  });
  const [globalState, setglobalState] = useState({
    timerSeconds: 0,
    timerMinute: 0,
    updateStatus: 'Start',
    dateTimeUpdated24hr: '',
    updatePercentage: '',
    DashboardFilterYearNMonthTeam:
      moment().utcOffset('+08:00').format('YYYY') +
      moment().utcOffset('+08:00').format('MMMM') +
      '',
  });
  return (
    <PageContextGlobalState.Provider value={[globalState, setglobalState]}>
      <PageContextGlobalTimer.Provider value={[globalTimer, setglobalTimer]}>
      <NavigationContainer>
        <Stack.Navigator headerMode="none">
          <Stack.Screen
            name="StartLoginScreen"
            component={StartLandingScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
      </PageContextGlobalTimer.Provider>
    </PageContextGlobalState.Provider>

  );
};

export default App;
