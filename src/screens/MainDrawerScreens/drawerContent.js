/* eslint-disable no-lone-blocks */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  Button,
  Image,
  BackHandler,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageOverlay from 'react-native-image-overlay';
import {
  scale,
  moderateScale,
  verticalScale,
  width,
  height,
} from '../../sharedComponents/scaling';
import FlatButton from '../../sharedComponents/custombutton';
import {
  ModuleAccess,
  ResetModuleAccess,
  ClearTeamAccess,
  ClearDefaults,
  CurrentAppScreen,
  CurrentAppVersionUpdate,
  globalStatus,
  FilterList,
} from '../../sharedComponents/globalCommands/globalCommands';
import {dbsystem_users} from '../../database/sqliteSetup';
import PageContext from './pagecontext';
import moment from 'moment';

export function DrawerContent(props) {
  const [globalState, setglobalState] = useContext(PageContext);

  function SQLerror(err) {
    console.log('SQL Error: ' + err);
  }

  const [isDashboardAllowed, setisDashboardAllowed] = useState(false);
  const [isDarkTheme, setisDarkTheme] = useState(false);

  const toggleTheme = () => {
    setisDarkTheme(!isDarkTheme);
  };

  useEffect(() => {
    if (
      ModuleAccess.PerTeam === 'ALLOWED' ||
      ModuleAccess.PerSalesman === 'ALLOWED' ||
      ModuleAccess.PerPrincipal === 'ALLOWED' ||
      ModuleAccess.PerArea === 'ALLOWED'
    ) {
      setisDashboardAllowed(true);
    } else {
      setisDashboardAllowed(false);
    }
  });

  function UpdateUserActiveStatus() {
    dbsystem_users.transaction((tx) => {
      tx.executeSql(
        'Update system_users_tbl  set activeStatus = ' + "'INACTIVE'",
        [],
        (tx, results) => {
          var len = results.rowsAffected;
          if (len > 0) {
            console.log('User UpdateUserActiveStatus changed to INACTIVE');
          } else {
            console.log('user cannot update his  ActiveStatus');
          }
        },
        SQLerror,
      );
    });
  }

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView>
        <View style={[styles.drawerContent]}>
          <ImageOverlay
            source={require('../../assets/profilebg.png')}
            height={140}
            contentPosition="top">
            <View
              style={
                ([styles.userInfoSection],
                {
                  alignSelf: 'flex-start',
                  marginLeft: 30,
                })
              }>
              <View style={{flexDirection: 'row', marginTop: 15, left: 0}}>
                <Avatar.Image
                  source={require('../../assets/avatar.jpg')}
                  size={60}
                />
                <View style={{marginLeft: 15, flexDirection: 'column'}}>
                  <Title style={([styles.title], {color: 'white'})}>
                    {global.name}
                  </Title>
                  <Caption style={([styles.caption], {color: 'white'})}>
                    @{global.user_name}
                  </Caption>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.section}>
                  <Paragraph
                    style={
                      ([styles.paragraph, styles.caption], {color: 'white'})
                    }>
                    Account Type :
                  </Paragraph>
                  <Caption style={styles.caption}> </Caption>
                </View>
                <View style={styles.section}>
                  <Paragraph
                    style={[styles.paragraph, styles.caption]}></Paragraph>
                  <Caption style={([styles.caption], {color: 'white'})}>
                    {global.account_type}
                  </Caption>
                </View>
              </View>
            </View>
          </ImageOverlay>

          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="account-group" color={color} size={size} />
              )}
              style={[
                isDashboardAllowed
                  ? styles.EnabledDrawer
                  : styles.DisabledDrawer,
              ]}
              label="Dashboard"
              onPress={() => {
                {
                  // FilterList.DashboardFilterYearNMonthTeam =   moment().utcOffset('+08:00').format('YYYY') +  moment().utcOffset('+08:00').format('MMMM') +  '';

                  ModuleAccess.PerTeam === 'ALLOWED' ||
                  ModuleAccess.PerSalesman === 'ALLOWED' ||
                  ModuleAccess.PerPrincipal === 'ALLOWED' ||
                  ModuleAccess.PerArea === 'ALLOWED'
                    ? props.navigation.navigate('Dashboard')
                    : alert('not allowed');
                }
              }}
            />
            {/* <DrawerItem
              icon={({color, size}) => (
                <Icon name="microsoft-onenote" color={color} size={size} />
              )}
              style={[
                isDashboardAllowed
                  ? styles.EnabledDrawer
                  : styles.DisabledDrawer,
              ]}
              label="Activity"
              onPress={() => {
                {
                  ModuleAccess.PerTeam === 'ALLOWED' ||
                  ModuleAccess.PerSalesman === 'ALLOWED' ||
                  ModuleAccess.PerPrincipal === 'ALLOWED' ||
                  ModuleAccess.PerArea === 'ALLOWED'
                    ? props.navigation.navigate('Dashboard')
                    : alert('not allowed');
                }
              }}
            /> */}
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="account-outline" color={color} size={size} />
              )}
              label="Inventory"
              onPress={() => {
                props.navigation.navigate('Inventory');
              }}
            />
            {global.sales_position_name === 'TEST' ? (
              <DrawerItem
                icon={({color, size}) => (
                  <Icon name="microsoft-onenote" color={color} size={size} />
                )}
                label="Schedule"
                onPress={() => {
                  props.navigation.navigate('SalesmanNet');
                }}
              />
            ) : null}
            {global.sales_position_name !== 'ALLSALESMAN' ? (
              <DrawerItem
                icon={({color, size}) => (
                  <Icon name="bookmark-outline" color={color} size={size} />
                )}
                label="Salesman Reports"
                onPress={() => {
                  props.navigation.navigate('SalesmanNet');
                }}
              />
            ) : null}

            {/* <DrawerItem
              icon={({color, size}) => (
                <Icon name="clock" color={color} size={size} />
              )}
              label="Comming Soon!"
              onPress={() => console.log('test')}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="clock" color={color} size={size} />
              )}
              label="Comming Soon!"
              onPress={() => {
                props.navigation.navigate('Customer');
              }}
            /> */}
          </Drawer.Section>

          <Drawer.Section title="Update App Data">
            <TouchableRipple
              onPress={() => {
                toggleTheme();
              }}>
              <View style={{alignItems: 'flex-start', marginLeft: scale(80)}}>
                <FlatButton
                  text={
                    globalState.updateStatus === 'Idle'
                      ? 'Update Now'
                      : 'Updating...'
                  }
                  onPress={() => {
                    if (globalStatus.updateStatus === 'Updating') {
                      Alert.alert(
                        'Note',
                        'Application already updating in background. Kindly wait',
                        [
                          {
                            text: 'OK',
                          },
                        ],
                        {cancelable: true},
                      );
                    } else {
                      setglobalState({
                        ...globalState,
                        timerSeconds: 0,
                        updateStatus: 'Updating',
                      });

                      globalStatus.updateStatus = 'Updating';
                      globalStatus.updateMode = 'manual';
                      props.navigation.navigate('UpdateModal');
                    }
                  }}
                  gradientFrom="#00961A"
                  gradientTo="#34F856"
                />
              </View>
            </TouchableRipple>
          </Drawer.Section>
          <Drawer.Section style={styles.bottomDrawerSection}>
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="calendar" color={color} size={size} />
              )}
              label="Business Calendar"
              onPress={() => {
                props.navigation.navigate('BusinessCalendar');
              }}
            />
          </Drawer.Section>
          <Drawer.Section style={styles.bottomDrawerSection}>
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="onepassword" color={color} size={size} />
              )}
              label="Change Password"
              onPress={() => {
                // ResetModuleAccess();
                // ClearTeamAccess();
                props.navigation.navigate('ChangePassword');
              }}
            />
          </Drawer.Section>
          <Drawer.Section style={styles.bottomDrawerSection}>
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="home-outline" color={color} size={size} />
              )}
              label="Home"
              onPress={() => {
                props.navigation.navigate('Home');
              }}
            />
          </Drawer.Section>
          <Drawer.Section style={styles.bottomDrawerSection}>
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="exit-to-app" color={color} size={size} />
              )}
              label="Sign Out"
              onPress={() => {
                ResetModuleAccess();
                ClearTeamAccess();
                ClearDefaults();
                UpdateUserActiveStatus();

                setglobalState({
                  timerSeconds: 0,
                  timerMinute: 0,
                  updateStatus: 'Start',
                  dateTimeUpdated24hr: '',
                  updatePercentage: '',
                });
                // console.log(globalState);
                props.navigation.navigate('SplashScreen');
              }}
            />
          </Drawer.Section>

          <Drawer.Section style={styles.bottomDrawerSection}>
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="cellphone-information" color={color} size={size} />
              )}
              label="About"
              onPress={() => {
                Alert.alert(
                  'About Application',
                  '\nWAMii App \n' +
                    'Version : ' +
                    CurrentAppVersionUpdate.CurrentAppVersionUpdateField +
                    ' \n \nRelease Date : ' +
                    CurrentAppVersionUpdate.CurrentAppVersionUpdateFieldDateRelease +
                    "  utcOffset('+08:00')",
                  [
                    {
                      text: 'OK',
                    },
                  ],
                  {cancelable: true},
                );
              }}
            />
          </Drawer.Section>

          <Drawer.Section style={styles.bottomDrawerSection}>
            <DrawerItem
              icon={({color, size}) => (
                <Icon name="location-exit" color={color} size={size} />
              )}
              label="Exit"
              onPress={() => {
                BackHandler.addEventListener(
                  'hardwareBackPress',
                  BackHandler.exitApp(),
                );
              }}
            />
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 0,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: scale(10),
    elevation: 2,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  modalView: {
    height: 150,
    margin: 20,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: scale(15),
    textAlign: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  EnabledDrawer: {
    backgroundColor: '#ffffff',
  },
  DisabledDrawer: {
    backgroundColor: '#CDCECD',
  },
});
