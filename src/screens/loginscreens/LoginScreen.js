/* eslint-disable no-lone-blocks */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  TextInput,
  StatusBar,
  Modal,
  ActivityIndicator,
  Alert,
  Button,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import {
  scale,
  moderateScale,
  verticalScale,
  width,
  height,
} from '../../sharedComponents/scaling';
import FlatButton from '../../sharedComponents/custombutton';

import {
  globalCompany,
  ModuleAccess,
  OtherSettings,
  server,
} from '../../sharedComponents/globalCommands/globalCommands';
import {dbsystem_users, dbAppToken} from '../../database/sqliteSetup';
import moment from 'moment';
import {APIToken} from '../../sharedComponents/globalCommands/globalCommands';
import {sha1} from 'react-native-sha1';
import {set} from 'react-native-reanimated';

var freshLogin = false;

const SignScreen = (props) => {
  function SQLerror(err) {
    console.log('SQL Error: ' + err);
  }

  const [isModalConnectionError, setisModalConnectionError] = useState(false);
  const [isLoadingActivityIndicator, setisLoadingActivityIndicator] = useState(
    false,
  );

  const [ModalErrorMessage, setModalErrorMessage] = useState('');

  const [data, setData] = useState({
    user_name: '',
    password: '',
    hashed_password: '',
    check_textInputChange: false,
    secureTextEntry: true,
  });

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      setData({
        ...data,
        user_name: global.user_name,
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
      });
    });
  }, []);

  // const LogInCredentialsFields = [
  //   {
  //     user_name: '',
  //     password: '',
  //     constant_type: '',
  //     constant_value: '',
  //   },
  // ];

  // const [LogInCredentials, setLogInCredentials] = useState(
  //   LogInCredentialsFields,
  // );

  const textInputChange = (val) => {
    if (val.length != 0) {
      setData({
        ...data,
        user_name: val,
        check_textInputChange: true,
      });
    } else {
      setData({
        ...data,
        check_textInputChange: false,
      });
    }
  };

  const handlePasswordChange = (val) => {
    sha1(val).then((hash) => {
      setData({
        ...data,
        password: val,
        hashed_password: hash,
      });
    });
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  function SaveUserLogin(props) {
    {
      dbsystem_users.transaction(function (tx) {
        tx.executeSql(
          'INSERT INTO  system_users_tbl (user_name, name, last_name, password, account_type, constant_type, constant_value,dateTimeLogin, activeStatus) VALUES (?,?,?,?,?,?,?,?,?)',
          [
            props.user_name,
            props.name,
            props.last_name,
            'confidential',
            props.account_type,
            props.constant_type,
            props.constant_value,
            moment().utcOffset('+08:00').format('YYYY-MM-DD hh:mm:ss a'),
            'ACTIVE',
          ],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              // console.log('user credential saved while mapping');
            }
          },
          SQLerror,
        );
      });
    }
  }

  function ClearUserLogin(props) {
    {
      dbsystem_users.transaction(function (tx) {
        tx.executeSql(
          'Delete from  system_users_tbl',
          [],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              console.log('user credential Cleared');
            }
          },
          SQLerror,
        );
      });
    }
  }

  const CheckUser = () => {
    ClearUserLogin();
    ClearAppToken();
    setisLoadingActivityIndicator(true);

    //*Enable Hashed Password
    //const unpw = data.user_name + '&' + data.hashed_password;
    const unpw = data.user_name + '&' + data.password;
    console.log(unpw);
    Promise.race([
      fetch(
        server.server_address + globalCompany.company + 'users/search/' + unpw,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      ),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 40000),
      ),
    ])
      .then((responseData) => {
        return responseData.json();
      })
      .then((jsonData) => {
        jsonData.map((key, index) => {
          if (global.device_id === key.device_id) {
            freshLogin = false;
            console.log('Device ID match1');
            GetToken();
          } else if (key.device_id === '') {
            freshLogin = true;
            console.log('fresh login');
            GetToken();
          } else if (
            global.device_id === '69b761866cb11621' ||
            global.device_id === 'ede7b31a387e8c30' ||
            global.device_id === 'bc60fd695d01c3da' ||
            global.device_id === 'a64d03d0164ada0c'
          ) {
            freshLogin = false;
            console.log('ARJAY AND MARC TESTING UNIT, GODMODE');
            GetToken();
          } else {
            console.log(global.device_id);
            console.log('New Device Detected');
            setModalErrorMessage(
              'New login from another device detected. You may only login on one device. \n \n Please contact support team.\n \n',
            );
            setisModalConnectionError(true);
          }
        });

        //IF USER FOUND
        if (jsonData.length < 1) {
          console.log('user not found');
          setModalErrorMessage('Account does not exist.');
          setisModalConnectionError(true);
        }
      })
      .catch(function (error) {
        console.log(
          'Error Signing in.Please make sure you have internet connection' +
            error.text,
        );
        setModalErrorMessage(
          'Error Signing in.Please make sure you have internet connection',
        );
        setisModalConnectionError(true);
      })
      .done();
  };

  function InsertLoginInfo(props) {
    fetch(server.server_address + globalCompany.company + 'InsertLoginInfo', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + props.access_token,
      },
      body: JSON.stringify({
        user_name: data.user_name,
        device_name: global.device_name,
        device_id: global.device_id,
        last_login: moment().format('YYYY-MM-DD HH:mm:ss'),
      }),
    })
      .then((responseData) => {
        return responseData.json();
      })
      .then((jsonData) => {
        if (jsonData.affectedRows > 0) {
          console.log('login device info assigned');
        }
      })
      .catch(function (error) {
        console.log('error in   UpdateAccount :' + error.text);
      })
      .done();
  }

  const GetToken = () => {
    console.log('token get');
    Promise.race([
      fetch('https://wamii.us.auth0.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body:
          '{"client_id":"u8W376tWPYnZCGhpI8tI5WCDxL6MNOmi","client_secret":"bE2llWn4gl9xQ1-eHXHzkQ5eWoXQkkuWZ7KWXsMN-5WHtbyotQmUXvFwNKjnOJjk","audience":"https://wamii_api","grant_type":"client_credentials"}',
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 40000),
      ),
    ])
      .then((responseData) => {
        return responseData.json();
      })
      .then((jsonData) => {
        console.log('token obtained, saving to local');
        APIToken.access_token = jsonData.access_token;

        if (freshLogin === false) {
          //USER IS CURRENTLY USING ASSIGNED
          SaveAppToken(jsonData);
        } else {
          //USER LOGIN IS FRESH, ASSIGNING DEVICE

          if (
            global.device_id === '69b761866cb11621' ||
            global.device_id === 'ede7b31a387e8c30' ||
            global.device_id === 'bc60fd695d01c3da' ||
            global.device_id === 'a64d03d0164ada0c'
          ) {
            console.log('GODMODE DETECTED NOT SAVING');
          } else {
            InsertLoginInfo(jsonData);
          }

          SaveAppToken(jsonData);
        }
      })
      .catch(function (error) {
        setModalErrorMessage('Error Signing in.');
        setisModalConnectionError(true);
      })
      .done();
  };

  function ClearAppToken(props) {
    {
      dbAppToken.transaction(function (tx) {
        tx.executeSql(
          'Delete from  AppToken_tbl',
          [],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              console.log('ClearAppToken Cleared');
            }
          },
          SQLerror,
        );
      });
    }
  }

  function SaveAppToken(SaveAppTokenprops) {
    {
      dbAppToken.transaction(function (tx) {
        tx.executeSql(
          'INSERT INTO  AppToken_tbl (access_token, dateTimeObtained) VALUES (?,?)',
          [
            SaveAppTokenprops.access_token,
            moment().utcOffset('+08:00').format('YYYY-MM-DD hh:mm:ss a'),
          ],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              console.log('SaveAppToken Saved');
              GetUserAccess();
            }
          },
          SQLerror,
        );
      });
    }
  }

  const GetUserAccess = () => {
    //*Enabled Hashed Password
  //  const unpw = data.user_name + '&' + data.hashed_password;
    const unpw = data.user_name + '&' + data.password;
    console.log(
      server.server_address +
        globalCompany.company +
        'users/getuseraccess/' +
        unpw,
    );
    Promise.race([
      fetch(
        server.server_address +
          globalCompany.company +
          'users/getuseraccess/' +
          unpw,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + APIToken.access_token,
          },
        },
      ),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 40000),
      ),
    ])
      .then((responseData) => {
        return responseData.json();
      })
      .then((jsonData) => {
        // console.log(jsonData);
        //IF USER FOUND
        if (jsonData.length < 1) {
          console.log('user not found');
          setModalErrorMessage('Error Signing in.');
          setisModalConnectionError(true);
        } else {
          //IF USER NOT FOUND

          global.TeamAccessList = '';
          global.TeamAccessListForAPI = '';
          global.sales_position_name = '';
          global.PrincipalAccessList = '';

          jsonData.map((key, index) => {
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

            //GET SALES_POSITION_NAME - new
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

            //SAVE USER CREDENTIALS
            SaveUserLogin(key);

            //if loop reach last record ------------------------------------------------------->
            if (index === jsonData.length - 1) {
              console.log(
                'index and json datamatched or last record reached, checking account validity...',
              );

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
                  setisModalConnectionError(true);
                  OtherSettings.AccountValidity = '';
                } else {
                  console.log('user ACCOUT HAS VALIDITY AND NOT YET EXPIRED');
                  //IF USER HAS NO ACCOUNT VALIDITY PROCEED TO SAVING AND HOME

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

                  //SET GLOBAL USERNAME and NAME
                  global.user_name = key.user_name;
                  global.name = key.name;
                  global.account_type = key.account_type;
                  //HIDE ACTIVITY INDICATOR
                  setisLoadingActivityIndicator(false);
                  //NAVIGATE TO HOME PAGE

                  console.log(global.sales_position_name);
                  console.log(global.TeamAccessList);
                  console.log(global.PrincipalAccessList);
                  props.navigation.navigate('StartMainDrawerScreen');
                }
              } else {
                console.log('user has no validity');
                //IF USER HAS NO ACCOUNT VALIDITY PROCEED TO SAVING AND HOME
                //SAVE USER CREDENTIALS
                SaveUserLogin(key);

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

                //    'FOR API  USE SALESMAN

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

                //SET GLOBAL USERNAME and NAME
                global.user_name = key.user_name;
                global.name = key.name;
                global.account_type = key.account_type;
                //HIDE ACTIVITY INDICATOR
                setisLoadingActivityIndicator(false);
                //NAVIGATE TO HOME PAGE

                console.log(global.sales_position_name);
                console.log(global.TeamAccessList);
                console.log(global.PrincipalAccessList);
                props.navigation.navigate('StartMainDrawerScreen');
              }
            } else {
              // console.log(index);
              // console.log(jsonData.length - 1);
            }
          });
        }
      })
      .catch(function (error) {
        console.log('error in checking user online' + error.text);
        setModalErrorMessage('Error Signing in.');
        setisModalConnectionError(true);
      })
      .done();
  };

  return (
    // MAIN VIEW
    <View style={styles.container}>
      {/* HEADER VIEW  */}
      <View style={styles.header}>
        <Text style={styles.text_header}>Welcome</Text>
      </View>

      {/* FOOTER VIEW */}
      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        {/* EMAIL INPUT VIEW ------------------------------------------------>4 */}
        {/* EMAIL LABEL */}
        <Text style={styles.text_footer}>Username</Text>
        {/* ICON AND INPUTBOX AND CHECKBOX ICON VIEW */}
        <View style={styles.action}>
          <FontAwesome name="user-o" color="#05375a" size={20} />

          <TextInput
            defaultValue={global.user_name}
            placeholder="enter username"
            style={styles.textInput}
            autoCapitalize="none"
            onChangeText={(val) => textInputChange(val)}
          />

          {data.check_textInputChange ? (
            <Animatable.View animation="bounceIn">
              <Feather name="check-circle" color="green" size={20} />
            </Animatable.View>
          ) : null}
        </View>
        {/* --------------------------------------------------------------------> */}

        {/* PASSWORD INPUT VIEW ------------------------------------------------>4 */}
        {/* PASSWORD LABEL */}
        <Text
          style={[
            styles.text_footer,
            {
              marginTop: 35,
            },
          ]}>
          Password
        </Text>

        {/* ICON AND INPUTBOX AND EYE ICON VIEW */}
        <View style={styles.action}>
          <Feather name="lock" color="#05375a" size={20} />

          <TextInput
            defaultValue={data.password}
            secureTextEntry={data.secureTextEntry ? true : false}
            placeholder="enter password"
            style={styles.textInput}
            autoCapitalize="none"
            onChangeText={(val) => handlePasswordChange(val)}
          />

          <TouchableOpacity onPress={updateSecureTextEntry}>
            {data.secureTextEntry ? (
              <Feather name="eye-off" color="grey" size={20} />
            ) : (
              <Feather name="eye" color="grey" size={20} />
            )}
          </TouchableOpacity>
        </View>
        {/* -------------------------------------------------------------------------> */}

        {/* BUTTON VIEW ---------------------------------------------------------------> 2 */}
        <View style={styles.button}>
          {/* SIGNIN BUTTON VIEW */}
          <TouchableOpacity
            style={styles.signIn}
            onPress={() => {
              if (data.password === '' || data.user_name === '') {
                Alert.alert(
                  'Error',
                  'Please enter Username and Password.',
                  [
                    {
                      text: 'OK',
                    },
                  ],
                  {cancelable: false},
                );
              } else {
                CheckUser();
              }
            }}>
            <LinearGradient
              colors={['#08d4c4', '#01ab9d']}
              style={styles.signIn}>
              {isLoadingActivityIndicator ? (
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={[
                      styles.textSign,
                      {
                        color: '#fff',
                      },
                    ]}>
                    Signing In...
                    {'  '}
                  </Text>
                  <ActivityIndicator size="large" color="green" />
                </View>
              ) : (
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={[
                      styles.textSign,
                      {
                        color: '#fff',
                      },
                    ]}>
                    Sign In
                    {'  '}
                  </Text>
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* SIGNUP UP BUTTON VIEW */}
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('SplashScreen');
              // GetToken();
            }}
            style={[
              styles.signIn,
              {
                borderColor: '#009387',
                borderWidth: 1,
                marginTop: 15,
              },
            ]}>
            <Text
              style={[
                styles.textSign,
                {
                  color: '#009387',
                },
              ]}>
              Back
            </Text>
          </TouchableOpacity>

          {/* ---------------------------------------------------------------------> */}
        </View>
      </Animatable.View>

      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalConnectionError}
          onRequestClose={() => {
            setisModalConnectionError(false);
            setisLoadingActivityIndicator(false);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{ModalErrorMessage}</Text>

              <FlatButton
                width={160}
                text="Close"
                // onPress={() => {
                //   setisModalConnectionError(false);
                //   setisLoadingActivityIndicator(false);
                //   console.log(isModalConnectionError);
                //   props.navigation.dispatch(resetAction);
                // }}

                onPress={() => {
                  setisModalConnectionError(false);
                  setisLoadingActivityIndicator(false);
                }}
                gradientFrom="red"
                gradientTo="pink"
              />
            </View>
          </View>
        </Modal>

        <Modal
          animationType="none"
          transparent={true}
          visible={isLoadingActivityIndicator}
          onRequestClose={() => {
            setisLoadingActivityIndicator(false);
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'black',
              flexDirection: 'row',
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: 0.3,
            }}>
            {/* <Button title="Test" onPress={() => console.log(updateCount)} /> */}
            <Text style={{color: 'black', fontSize: moderateScale(20)}}> </Text>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default SignScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#009387',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 1,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loading: {
    flex: 1,
    height: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignContent: 'center',
    position: 'absolute',
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
