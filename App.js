import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import StartLandingScreen from './src/screens/loginscreens/StartLandingScreen';
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
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="StartLoginScreen" component={StartLandingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
