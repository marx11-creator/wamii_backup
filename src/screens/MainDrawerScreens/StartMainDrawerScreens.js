/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';

import Dashboards from '../Dashboard/StartDashboards';

import Home from './Home';
import Inventory from './Inventory';
import UpdateModal from './UpdateModal';
import {DrawerContent} from '../MainDrawerScreens/drawerContent';
import ChangePassword from './ChangePassword';
import BusinessCalendar from './BusinessCalendar';
import ViewScreen from '../SalesmanReports/SalesmanNet';
import InventoryImageList from './InventoryImageList';
import FadingMessage from './test';
const Drawer = createDrawerNavigator();

export default function StartMainDrawerScreen(props) {
  const [isInitialRender, setIsInitialRender] = useState(false);
  if (!isInitialRender) {
    setTimeout(() => setIsInitialRender(true), 1);
  }

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <DrawerContent {...props} />}
      drawerStyle={{width: isInitialRender ? 301 : 0}}>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Dashboard" component={Dashboards} />
      <Drawer.Screen name="Inventory" component={Inventory} />
      <Drawer.Screen name="UpdateModal" component={UpdateModal} />
      <Drawer.Screen name="ChangePassword" component={ChangePassword} />
      <Drawer.Screen name="BusinessCalendar" component={BusinessCalendar} />
      <Drawer.Screen name="SalesmanNet" component={ViewScreen} />
      <Drawer.Screen name="InventoryImageList" component={InventoryImageList} />
      <Drawer.Screen name="TEST" component={FadingMessage} />

    </Drawer.Navigator>
  );
}
