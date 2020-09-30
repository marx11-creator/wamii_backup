import React, {useState, useEffect, ReactElement} from 'react';
import {View, Text, YellowBox, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import PerTeamDashBoard from './PerTeamDashboard';
import PerSalesmanDashboard from './PerSalesmanDashboard';
import PerPrincipalDashboard from './PerPrincipalDashboard';
import PerAreaDashboard from './PerAreaDashboard';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {
  ModuleAccess,
  DashboardYears,
} from '../../sharedComponents/globalCommands/globalCommands';
import {moderateScale, scale} from '../../sharedComponents/scaling';

const Tab = createMaterialTopTabNavigator();

const Dashboards = (props) => {
  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      tabBarOptions={{
        labelStyle: {
          fontSize: moderateScale(12, 0.5),
        },
        showIcon: true,
        style: {
          height: scale(90),
          backgroundColor: '#11C567',
        },
        activeTintColor: '#ffffff',
        inactiveTintColor: '#ffffff',
      }}>
      <Tab.Screen
        name="PerTeam"
        component={PerTeamDashBoard}
        options={{
          tabBarLabel: 'Team',
          tabBarIcon: (tabInfo) => (
            <Icon
              name="people"
              size={moderateScale(29, 0.5)}
              color={'#ffffff'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="PerArea"
        component={PerAreaDashboard}
        options={{
          tabBarLabel: 'Area',
          tabBarIcon: (tabInfo) => (
            <Icon
              name="md-map"
              size={moderateScale(29, 0.5)}
              color={'#ffffff'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="PerSalesman"
        component={PerSalesmanDashboard}
        options={{
          tabBarLabel: 'Salesman',
          tabBarIcon: (tabInfo) => (
            <Icon
              name="ios-person"
              size={moderateScale(29, 0.5)}
              color={'#ffffff'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="PerPrincipal"
        component={PerPrincipalDashboard}
        options={{
          tabBarLabel: 'Principal',
          tabBarIcon: (tabInfo) => (
            <Icon
              name="ios-aperture"
              size={moderateScale(29, 0.5)}
              color={'#ffffff'}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Dashboards;
