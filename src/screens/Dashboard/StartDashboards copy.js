import React, {useState, useEffect} from 'react';
import {View, Text, YellowBox} from 'react-native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import PerTeamDashBoard from './PerTeamDashboard';
import PerSalesmanDashboard from './PerSalesmanDashboard';
import PerPrincipalDashboard from './PerPrincipalDashboard';
import PerAreaDashboard from './PerAreaDashboard';
import Home from '../MainDrawerScreens/Home';
import App1 from './Blank';

import {
  ModuleAccess,
  DashboardYears,
} from '../../sharedComponents/globalCommands/globalCommands';
import {dbperymtsat} from '../../database/sqliteSetup';
const Tab = createMaterialBottomTabNavigator();

export default function Dashboards() {
  return (
    <Tab.Navigator
      // initialRouteName="App1"z
      activeColor="#fff"
      swipeEnabled={true}
      style={{backgroundColor: 'tomato'}}>
      {ModuleAccess.PerTeam === 'ALLOWED' ? (
        <Tab.Screen
          name="PerTeam"
          component={PerTeamDashBoard}
          options={{
            tabBarLabel: 'Per Team',
            tabBarColor: '#32157D',
            tabBarIcon: ({color}) => (
              <Icon name="people" color={color} size={26} />
            ),
          }}
        />
      ) : null}

      {ModuleAccess.PerArea === 'ALLOWED' ? (
        <Tab.Screen
          name="PerArea"
          component={PerAreaDashboard}
          options={{
            tabBarLabel: 'Per Area',
            tabBarColor: '#1351FF',
            tabBarIcon: ({color}) => (
              <Icon name="md-map" color={color} size={26} />
            ),
          }}
        />
      ) : null}

      {ModuleAccess.PerSalesman === 'ALLOWED' ? (
        <Tab.Screen
          name="PerSalesman"
          component={PerSalesmanDashboard}
          options={{
            tabBarLabel: 'Per Salesman',
            tabBarColor: '#1CE0C7',
            tabBarIcon: ({color}) => (
              <Icon name="ios-person" color={color} size={26} />
            ),
          }}
        />
      ) : null}

      {ModuleAccess.PerPrincipal === 'ALLOWED' ? (
        <Tab.Screen
          name="PerPrincipal"
          component={PerPrincipalDashboard}
          options={{
            tabBarLabel: 'Per Principal',
            tabBarColor: 'green',
            tabBarIcon: ({color}) => (
              <Icon name="ios-aperture" color={color} size={26} />
            ),
          }}
        />
      ) : null}
    </Tab.Navigator>
  );
}
