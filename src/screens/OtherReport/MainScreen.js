import React from 'react';
import {View, Text} from 'react-native';
import SalesperCustomer from './SalesperCustomer';
import CustomerReturns from './CustomerReturns';
import PurchaseReport from './PurchaseReport';
import BlankReport from './BlankReport';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {moderateScale, scale} from '../../sharedComponents/scaling';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createMaterialTopTabNavigator();

export default function MainScreen() {
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
        name="PerCustomer"
        component={SalesperCustomer}
        options={{
          tabBarLabel: 'Trade',
          tabBarIcon: (tabInfo) => (
            <Icon
              name="people"
              size={moderateScale(25, 0.5)}
              color={'#ffffff'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="CustomerReturns"
        component={CustomerReturns}
        options={{
          tabBarLabel: 'Returns',
          tabBarIcon: (tabInfo) => (
            <Icon
              name="cube-outline"
              size={moderateScale(25, 0.5)}
              color={'#ffffff'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Purchases"
        component={PurchaseReport}
        options={{
          tabBarLabel: 'Sell in',
          tabBarIcon: (tabInfo) => (
            <Icon
              name="bar-chart"
              size={moderateScale(25, 0.5)}
              color={'#ffffff'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Blank"
        component={BlankReport}
        options={{
          tabBarLabel: 'Blank Report',
          tabBarIcon: (tabInfo) => (
            <Icon
              name="analytics-outline"
              size={moderateScale(25, 0.5)}
              color={'#ffffff'}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
