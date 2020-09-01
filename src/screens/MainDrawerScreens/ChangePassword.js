/* eslint-disable react-native/no-inline-styles */

import React, {useState} from 'react';
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
  Alert,
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
import {APIToken} from '../../sharedComponents/globalCommands/globalCommands';
import {dbsystem_users} from '../../database/sqliteSetup';

const SignScreen = (props) => {
  function SQLerror(err) {
    console.log('SQL Error: ' + err);
  }

  const [data, setAccount] = useState({
    user_name: global.user_name,
    password: '',
    confirm_password: '',
    check_user_name: false,
    secureTextEntry: true,
  });

  const [ErrorMessage, setErrorMessage] = useState('');

  const changeUser_name = (val) => {
    setErrorMessage('');
    if (val.length !== 0) {
      setAccount({
        ...data,
        user_name: val,
        check_user_name: true,
      });
    } else {
      setAccount({
        ...data,
        user_name: val,
        check_user_name: false,
      });
    }
  };

  const handlePasswordChange = (val) => {
    setErrorMessage('');
    setAccount({
      ...data,
      password: val,
    });
  };

  const handleConfirmPasswordChange = (val) => {
    setErrorMessage('');
    setAccount({
      ...data,
      confirm_password: val,
    });
  };

  const updateSecureTextEntry = () => {
    setAccount({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };
  const updateConfirmSecureTextEntry = () => {
    setAccount({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const UpdateAccount = () => {
    fetch('https://boiling-atoll-20376.herokuapp.com/UpdateAccount', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + APIToken.access_token,
      },
      body: JSON.stringify({
        user_name: data.user_name,
        password: data.password,
      }),
    })
      .then((responseData) => {
        return responseData.json();
      })
      .then((jsonData) => {
        if (jsonData.affectedRows > 0) {
          Alert.alert(
            'Success',
            'Password succesfully updated.',
            [
              {
                text: 'Continue',
                onPress: () => {
                  UpdateUserActiveStatus();
                },
              },
            ],
            {cancelable: false},
          );
        }
      })
      .catch(function (error) {
        console.log('error in   UpdateAccount :' + error.message);
      })
      .done();
  };

  function UpdateUserActiveStatus() {
    dbsystem_users.transaction((tx) => {
      tx.executeSql(
        'Update system_users_tbl  set activeStatus = ' + "'INACTIVE'",
        [],
        (tx, results) => {
          var len = results.rowsAffected;
          if (len > 0) {
            console.log('User UpdateUserActiveStatus changed to INACTIVE');
            props.navigation.navigate('LoginScreen');
          } else {
            console.log('user cannot update his  ActiveStatus');
          }
        },
        SQLerror,
      );
    });
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#009387" barStyle="light-content" />
      {/* -------------------------------------------------------------------------------> HEADER */}
      <View style={styles.header}>
        <Text style={styles.text_header}>Update Account</Text>
      </View>

      {/* ----------------------------------------------------------------------------------------------->  EMAIL */}
      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        <Text style={styles.text_footer}>Username</Text>
        <View style={styles.action}>
          <FontAwesome name="user-o" color="#05375a" size={20} />
          <TextInput
            editable={global.account_type === 'Administrator' ? true : false}
            defaultValue={global.user_name}
            placeholder="enter username"
            style={[styles.textInput]}
            autoCapitalize="none"
            onChangeText={(val) => changeUser_name(val)}
          />
          {data.check_textInputChange ? (
            <Animatable.View animation="bounceIn">
              <Feather name="check-circle" color="green" size={20} />
            </Animatable.View>
          ) : null}
        </View>

        {/* --------------------------------------------------------------------------------> PASSWORD */}
        <Text
          style={[
            styles.text_footer,
            {
              marginTop: height * 0.02,
            },
          ]}>
          New Password
        </Text>
        <View style={styles.action}>
          <Feather name="lock" color="#05375a" size={20} />
          <TextInput
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

        {/* ---------------------------------------------------------------------------> CONFIRM PASSWORD */}
        <Text
          style={[
            styles.text_footer,
            {
              marginTop: height * 0.02,
            },
          ]}>
          Confirm Password
        </Text>
        <View style={styles.action}>
          <Feather name="lock" color="#05375a" size={20} />
          <TextInput
            secureTextEntry={data.secureTextEntry ? true : false}
            placeholder="enter password"
            style={styles.textInput}
            autoCapitalize="none"
            onChangeText={(val) => handleConfirmPasswordChange(val)}
          />
          <TouchableOpacity onPress={updateConfirmSecureTextEntry}>
            {data.secureTextEntry ? (
              <Feather name="eye-off" color="grey" size={20} />
            ) : (
              <Feather name="eye" color="grey" size={20} />
            )}
          </TouchableOpacity>
        </View>

        <Text
          style={{
            color: 'red',
            fontStyle: 'italic',
            fontSize: moderateScale(16),
          }}>
          {ErrorMessage}
        </Text>

        <View style={([styles.button], {marginTop: moderateScale(20)})}>
          {/* // ------------------------------------------------------> SIGN UP */}
          <TouchableOpacity
            onPress={() => {
              if (
                data.password === '' ||
                data.confirm_password === '' ||
                data.email === ''
              ) {
                setErrorMessage('Please Complete All fields');
              } else if (data.password !== data.confirm_password) {
                setErrorMessage('Password doesnt match.');
              } else if (data.password.length < 6) {
                setErrorMessage('Password length must be atleast 6 characters');
              } else {
                UpdateAccount();
              }
            }}
            style={styles.signIn}>
            <LinearGradient
              colors={['#08d4c4', '#01ab9d']}
              style={styles.signIn}>
              <Text
                style={[
                  styles.textSign,
                  {
                    color: '#fff',
                  },
                ]}>
                Change Password
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* ------------------------------------------------------------------------------------> SIGN IN */}
          <TouchableOpacity
            onPress={() => props.navigation.navigate('Home')}
            style={[
              styles.signIn,
              {
                borderColor: '#009387',
                borderWidth: 1,
                marginTop: 15,
                width: '95%',
              },
            ]}>
            <Text
              style={[
                styles.textSign,
                {
                  color: '#009387',
                },
              ]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
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
    fontSize: 35,
  },
  text_footer: {
    color: '#05375a',
    fontSize: height * 0.02,
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
    marginTop: height * 0.054,
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
});
