/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useContext} from 'react';
import {CommonActions} from '@react-navigation/native';
import {
  Modal,
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  LogBox,
  BackHandler,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons//MaterialIcons';
import CreateDatabase from '../../database/sqliteSetup';
import moment from 'moment';
import {
  dbsystem_users,
  dbAppToken,
  dbUpdateDbVersion,
} from '../../database/sqliteSetup';
import {
  Update1001,
  Update1002,
  Update1003,
  Update1004,
  Update1005,
  Update1006,
  Update1007,
  Update1008,
} from '../../database/sqliteSetup';
import {
  scale,
  moderateScale,
  verticalScale,
  width,
  height,
} from '../../sharedComponents/scaling';
import {
  ModuleAccess,
  APIToken,
  CurrentAppVersionUpdate,
  LocalAppVersionUpdate,
  ResetModuleAccess,
  ClearTeamAccess,
  ClearDefaults,
  OtherSettings,
} from '../../sharedComponents/globalCommands/globalCommands';

import BackgroundTimer from 'react-native-background-timer';
import {cos} from 'react-native-reanimated';
import DeviceInfo from 'react-native-device-info';
import FlatButton from '../../sharedComponents/custombutton';
// LogBox.ignoreAllLogs();

// global.salespositionname = 'PMS 1 PAMPANGA';
// global.team = 'TEAM JR';
// global.date_from = '2020-09-01';
// global.date_to = '2020-09-31';

export default function SplashScreen(props) {
  CreateDatabase();

  DeviceInfo.getDeviceName().then((deviceName) => {
    global.device_name = deviceName;
    global.device_id = DeviceInfo.getUniqueId();
  });

  function SQLerror(err) {
    console.log('SQL Error: ' + err);
  }
  const [isLoadingActivityIndicator, setisLoadingActivityIndicator] = useState(
    false,
  );
  const [isModalConnectionError, setisModalConnectionError] = useState(false);
  const [ModalErrorMessage, setModalErrorMessage] = useState('');
  const [LogoAnimation, setLogoAnimation] = useState(false);
  const [ShowGettingStarted, setShowGettingStarted] = useState(false);

  // useEffect(() => {
  //   if (loading === true) {
  //     CheckUserifLogin();
  //     console.log('now true');
  //   } else {
  //     console.log('still false');
  //   }
  // }, [loading]);

  // useEffect(() => {
  //   props.navigation.addListener('focus', () => {
  //     setLoading(true);
  //     CheckUserifLogin();
  //   });
  // }, []);

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      setLogoAnimation(true);
      var currSecc = 0;
      const intervalId = BackgroundTimer.setInterval(() => {
        // this will be executed every 200 ms
        // even when app is the the background
        currSecc = currSecc + 1;
        // console.log('current second is' + currSecc);

        if (currSecc === 1) {
          // CheckUserifLogin();
          GetAppVersionInLocalDB();

          BackgroundTimer.clearInterval(intervalId);
        }
      }, 1000);
    });
  }, []);

  function GetAppVersionInLocalDB() {
    dbUpdateDbVersion.transaction((tx) => {
      tx.executeSql(
        'SELECT max(updateversion) as updateversion, dateTimeUpdated FROM updateversion_tbl',
        [],
        (_tx, results) => {
          var len = results.rows.length;
          if (len > 0 && results.rows.item(0).updateversion !== null) {
            // console.log('update found');
            LocalAppVersionUpdate.LocalAppVersionUpdateField = results.rows.item(
              0,
            ).updateversion;
            RunDBUpdate();
          } else {
            //console.log('no update version found');
            LocalAppVersionUpdate.LocalAppVersionUpdateField = 1000;
            RunDBUpdate();
          }
        },
        SQLerror,
      );
    });
  }

  function RunDBUpdate() {
    //if local and current have initialized
    if (
      LocalAppVersionUpdate.LocalAppVersionUpdateField > 0 &&
      CurrentAppVersionUpdate.CurrentAppVersionUpdateField > 0
    ) {
      //console.log('local and current have initialized');
      //if local is less than current app update or local is not updated
      if (
        LocalAppVersionUpdate.LocalAppVersionUpdateField <
        CurrentAppVersionUpdate.CurrentAppVersionUpdateField
      ) {
        const intervalUpdateChecker = BackgroundTimer.setInterval(() => {
          if (
            LocalAppVersionUpdate.LocalAppVersionUpdateField ===
            CurrentAppVersionUpdate.CurrentAppVersionUpdateField
          ) {
            BackgroundTimer.clearInterval(intervalUpdateChecker);
            //console.log('timer triggered local and current update matche');
            CheckUserifLogin();
          }
        }, 1000);

        //console.log('local is not updated, running update...');
        if (LocalAppVersionUpdate.LocalAppVersionUpdateField < 1001) {
          // console.log('update 001 initialized');
          //  console.log(
          //     'before update' + LocalAppVersionUpdate.LocalAppVersionUpdateField,
          //   );
          Update1001();
        }
        if (LocalAppVersionUpdate.LocalAppVersionUpdateField < 1002) {
          //console.log('update 002 initialized');
          // console.log(
          //   'before update' + LocalAppVersionUpdate.LocalAppVersionUpdateField,
          // );
          Update1002();
        }
        if (LocalAppVersionUpdate.LocalAppVersionUpdateField < 1003) {
          //console.log('update 003 initialized');
          //console.log(
          //   'before update' + LocalAppVersionUpdate.LocalAppVersionUpdateField,
          // );
          Update1003();
        }
        if (LocalAppVersionUpdate.LocalAppVersionUpdateField < 1004) {
          //console.log('update 004 initialized');
          //console.log(
          //   'before update' + LocalAppVersionUpdate.LocalAppVersionUpdateField,
          // );
          Update1004();
        }

        if (LocalAppVersionUpdate.LocalAppVersionUpdateField < 1005) {
          //console.log('update 005 initialized');
          //console.log(
          //   'before update' + LocalAppVersionUpdate.LocalAppVersionUpdateField,
          // );
          Update1005();
        }
        if (LocalAppVersionUpdate.LocalAppVersionUpdateField < 1006) {
          //console.log('update 005 initialized');
          //console.log(
          //   'before update' + LocalAppVersionUpdate.LocalAppVersionUpdateField,
          // );
          Update1006();
        }

        if (LocalAppVersionUpdate.LocalAppVersionUpdateField < 1007) {
          //console.log('update 005 initialized');
          //console.log(
          //   'before update' + LocalAppVersionUpdate.LocalAppVersionUpdateField,
          // );
          Update1007();
        }

        if (LocalAppVersionUpdate.LocalAppVersionUpdateField < 1008) {
          //console.log('update 005 initialized');
          //console.log(
          //   'before update' + LocalAppVersionUpdate.LocalAppVersionUpdateField,
          // );
       //   console.log('focus on Splash123');
          Update1008();
          CheckUserifLogin(); //moved tihs when u have new update to load check user on last update
        }
      } else {
        //console.log('local is updated, nothing to update.');
        // console.log('6');
        // console.log(LocalAppVersionUpdate.LocalAppVersionUpdateField);

        CheckUserifLogin();
      }
    }
  }

  function CheckUserifLogin() {
    dbsystem_users.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM system_users_tbl  where activeStatus = ' + "'ACTIVE'",
        [],
        (_tx, results) => {
          var len = results.rows.length;

          if (len > 0) {
            GetLocalToken();
          } else {
            // setLoading(false);
            setShowGettingStarted(true);
            // console.log('No User Account login');
          }
        },
        SQLerror,
      );
    });
  }

  function GetLocalToken() {
    dbAppToken.transaction((tx) => {
      tx.executeSql(
        'SELECT access_token,  (substr(dateTimeObtained,1,10)) as dateTimeObtained FROM AppToken_tbl ',
        [],
        (_tx, results) => {
          var len = results.rows.length;
          var currentdate = moment().utcOffset('+08:00').format('YYYY-MM-DD');
          var dateTimeObtained = '';
          if (len > 0) {
            APIToken.access_token = results.rows.item(0).access_token;
           // console.log(results.rows.item(0).access_token);
            // console.log(results.rows.item(0).dateTimeObtained);
            dateTimeObtained = results.rows.item(0).dateTimeObtained;
            // console.log(moment(currentdate).diff(dateTimeObtained, 'days'));
            if (moment(currentdate).diff(dateTimeObtained, 'days') > 29) {
              //  console.log('reach 30days, auto logout');

              ResetModuleAccess();
              ClearTeamAccess();
              ClearDefaults();
              UpdateUserActiveStatus();
              setShowGettingStarted(true);
            } else {
              //   console.log('token still valid');
              GetUserLocalCredential();
            }
          } else {
            //  console.log('nothing found local token');
          }
        },
        SQLerror,
      );
    });
  }

  function UpdateUserActiveStatus() {
    dbsystem_users.transaction((tx) => {
      tx.executeSql(
        'Update system_users_tbl  set activeStatus = ' + "'INACTIVE'",
        [],
        (tx, results) => {
          var len = results.rowsAffected;
          if (len > 0) {
            //  console.log('User UpdateUserActiveStatus changed to INACTIVE');
          } else {
            //   console.log('user cannot update his  ActiveStatus');
          }
        },
        SQLerror,
      );
    });
  }

  function GetUserLocalCredential() {
    dbsystem_users.transaction((tx) => {
      tx.executeSql(
        'SELECT user_name, name, password, account_type, constant_type, constant_value from system_users_tbl ',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }

          global.TeamAccessList = '';
          global.TeamAccessListForAPI = '';
          global.sales_position_name = '';
          global.PrincipalAccessList = '';
          temp.map((key, index) => {
            if (
              key.constant_type === 'MODULE_ACCESS' &&
              key.constant_value === 'PER TEAM'
            ) {
              // console.log('1');
              ModuleAccess.PerTeam = 'ALLOWED';
            }

            if (
              key.constant_type === 'MODULE_ACCESS' &&
              key.constant_value === 'PER SALESMAN'
            ) {
              // console.log('2');
              ModuleAccess.PerSalesman = 'ALLOWED';
            }

            if (
              key.constant_type === 'MODULE_ACCESS' &&
              key.constant_value === 'PER PRINCIPAL'
            ) {
              // console.log('3');
              ModuleAccess.PerPrincipal = 'ALLOWED';
            }

            if (
              key.constant_type === 'MODULE_ACCESS' &&
              key.constant_value === 'PER AREA'
            ) {
              // console.log('4');
              ModuleAccess.PerArea = 'ALLOWED';
            }

            //GET ACCESS TEAM
            if (key.constant_type === 'TEAM_ACCESS') {
              global.TeamAccessList =
                global.TeamAccessList + "'" + key.constant_value + "',";
            }

            //GET SALES_POSITION_NAME
            if (key.constant_type === 'SALES_POSITION_NAME') {
              global.sales_position_name =
                global.sales_position_name + "'" + key.constant_value + "',";
            }

            //GET ACCESS PRINCIPAL
            if (key.constant_type === 'PRINCIPAL_ACCESS') {
              global.PrincipalAccessList =
                global.PrincipalAccessList + "'" + key.constant_value + "',";
            }

            //GET AUTO_LOGOUT STATUS
            if (key.constant_type === 'ACCOUNT_VALIDITY') {
              OtherSettings.AccountValidity = key.constant_value;
            }

            //if loop reach last record ------------------------------------------------------->
            if (index === temp.length - 1) {
              // console.log(
              //   'index and json datamatched or last record reached, checking account validity...',
              // );

              if (OtherSettings.AccountValidity !== '') {
                var currentdate = moment()
                  .utcOffset('+08:00')
                  .format('YYYY-MM-DD');
                // console.log(currentdate);
                // console.log(OtherSettings.AccountValidity);

                // console.log(
                //   moment(OtherSettings.AccountValidity).diff(
                //     currentdate,
                //     'days',
                //   ),
                // );
                if (
                  moment(currentdate).diff(
                    OtherSettings.AccountValidity,
                    'days',
                  ) > 0
                ) {
                  setModalErrorMessage(
                    'Your Account has expired.\n\nPlease contact I.T Support Team.',
                  );

                  setisLoadingActivityIndicator(true);

                  setisModalConnectionError(true);

                  OtherSettings.AccountValidity = '';
                  ResetModuleAccess();
                  ClearTeamAccess();
                  ClearDefaults();
                } else {
                  console.log('user ACCOUT HAS VALIDITY AND NOT YET EXPIRED');
                  //    'FOR API  USE TEAMACESS
                  if (global.TeamAccessList === '') {
                    global.TeamAccessListForAPI = 'ALLTEAM';
                  } else {
                    global.TeamAccessListForAPI = global.TeamAccessList.slice(
                      0,
                      -1,
                    );
                  }

                  //    'FOR API  USE SALESMAN

                  if (global.sales_position_name === '') {
                    global.sales_position_name = 'ALLSALESMAN';
                  } else {
                    global.sales_position_name = global.sales_position_name.slice(
                      0,
                      -1,
                    );
                  }

                  //    'FOR API  USE PRINCIPAL

                  if (global.PrincipalAccessList === '') {
                    global.PrincipalAccessList = 'ALLPRINCIPAL';
                  } else {
                    global.PrincipalAccessList = global.PrincipalAccessList.slice(
                      0,
                      -1,
                    );
                  }

                  //    'FOR LOCAL USE ONLY IN TABLET'
                  global.TeamAccessList =
                    '(' + global.TeamAccessList.slice(0, -1) + ')';

                  global.user_name = key.user_name;
                  global.name = key.name;
                  global.account_type = key.account_type;

                  setShowGettingStarted(false);
                  setLogoAnimation(false);
                  props.navigation.navigate('StartMainDrawerScreen');
                }
              } else {
                console.log('user has no validity');

                //    'FOR API  USE TEAMACESS
                if (global.TeamAccessList === '') {
                  global.TeamAccessListForAPI = 'ALLTEAM';
                } else {
                  global.TeamAccessListForAPI = global.TeamAccessList.slice(
                    0,
                    -1,
                  );
                }

                //    'FOR API  USE SALESMAN

                if (global.sales_position_name === '') {
                  global.sales_position_name = 'ALLSALESMAN';
                } else {
                  global.sales_position_name = global.sales_position_name.slice(
                    0,
                    -1,
                  );
                }

                //    'FOR API  USE PRINCIPAL

                if (global.PrincipalAccessList === '') {
                  global.PrincipalAccessList = 'ALLPRINCIPAL';
                } else {
                  global.PrincipalAccessList = global.PrincipalAccessList.slice(
                    0,
                    -1,
                  );
                }

                //    'FOR LOCAL USE ONLY IN TABLET'
                global.TeamAccessList =
                  '(' + global.TeamAccessList.slice(0, -1) + ')';

                global.user_name = key.user_name;
                global.name = key.name;
                global.account_type = key.account_type;

                setShowGettingStarted(false);
                setLogoAnimation(false);
                props.navigation.navigate('StartMainDrawerScreen');
              }
            }
          });
        },
        SQLerror,
      );
    });
  }

  function testReset() {
    props.navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          {name: 'SplashScreen'},
          {
            name: 'SplashScreen',
          },
        ],
      }),
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Animatable.Image
          animation={LogoAnimation ? 'bounceIn' : undefined}
          duration={1000}
          source={require('../../assets/wamilogo.png')}
          //       source={require('../../assets/coslorlogo.png')}
          style={styles.logo}
          resizeMode="stretch"
        />
      </View>

      {ShowGettingStarted && (
        <Animatable.View animation="fadeInUpBig" style={styles.footer}>
          <Text style={styles.title}>Start now!</Text>
          <Text style={styles.text}>Sign in with Account</Text>
          <View style={styles.button}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('LoginScreen');
                setShowGettingStarted(false);
                setLogoAnimation(false);
              }}>
              <LinearGradient
                colors={['#08d464', '#01ab9d']}
                style={styles.signIn}>
                <Text style={styles.textSign}>Getting Started</Text>
                <MaterialIcons name="navigate-next" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
            {/* <TouchableOpacity>
            <LinearGradient
              colors={['#08d464', '#01ab9d']}
              style={styles.signIn}>
              <Text style={styles.textSign}>Fetch from server!!!</Text>
              <MaterialIcons name="navigate-next" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity> */}
          </View>
        </Animatable.View>
      )}

      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isLoadingActivityIndicator}
          onRequestClose={() => {
            setisModalConnectionError(false);
            setisLoadingActivityIndicator(false);
            setisLoadingActivityIndicator(false);
            testReset();
            BackHandler.exitApp();
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{ModalErrorMessage}</Text>

              <FlatButton
                width={160}
                text="Close"
                onPress={() => {
                  setisModalConnectionError(false);
                  setisLoadingActivityIndicator(false);
                  setisLoadingActivityIndicator(false);
                  testReset();
                  BackHandler.exitApp();
                }}
                gradientFrom="red"
                gradientTo="pink"
              />
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

// const {height} = Dimensions.get('screen');
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#009387',
  },
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  logo: {
    width: height_logo,
    height: height_logo,
  },
  title: {
    color: '#05375a',
    fontSize: 30,
    fontWeight: 'bold',
  },
  text: {
    color: 'grey',
    marginTop: 5,
  },
  button: {
    alignItems: 'flex-end',
    marginTop: 30,
  },
  signIn: {
    width: 190,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
  },
  textSign: {
    color: 'white',
    fontWeight: 'bold',
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.4,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  modalView: {
    height: 250,
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
    marginBottom: scale(25),
    textAlign: 'center',
  },
});
