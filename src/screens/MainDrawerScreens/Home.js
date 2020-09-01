/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  Image,
  LogBox,
  YellowBox,
  BackHandler,
  Alert,
  Button,
  Linking,
} from 'react-native';

import ImageOverlay from 'react-native-image-overlay';
import {width, height} from '../../sharedComponents/scaling';
import {
  APIUpdateVersion,
  CurrentAppVersionUpdate,
  DashboardYears,
} from '../../sharedComponents/globalCommands/globalCommands';
import {UpdateYearMonthsFilter} from '../../sharedComponents/globalCommands/globalCommands';
import DeviceInfo from 'react-native-device-info';
LogBox.ignoreAllLogs();

export default function Home(props) {
  DeviceInfo.getDeviceName().then((deviceName) => {
    console.log(deviceName);
    console.log(DeviceInfo.getUniqueId());
  });



  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'System',
          'Are you sure you want to close application?',
          [
            {
              text: 'YES',
              onPress: () => {
                BackHandler.exitApp();
              },
            },
            {
              text: 'NO',
              // onPress: () => {
              //   BackHandler.exitApp();
              //   return true;
              // },
            },
          ],
          {cancelable: true},
        );
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      console.log('focus on per Home');
      if (APIUpdateVersion.APIUpdateVersionField !== 0) {
        if (
          Number(CurrentAppVersionUpdate.CurrentAppVersionUpdateField) ===
          Number(APIUpdateVersion.APIUpdateVersionField)
        ) {
          console.log('app is updated');
        } else {
          Alert.alert(
            'Update',
            'A new version of the app is now available! \nPlease download and install on our Viber Group Chat \n\n(App Version wamii_v' +
              APIUpdateVersion.APIUpdateVersionField +
              ' \n.',
            [
              {
                text: 'later',
                onPress: () => {
                  console.log('later');
                },
              },
              {
                text: 'Update Now',
                onPress: () => {
                  Linking.canOpenURL('viber://')
                    .then((supported) => {
                      if (!supported) {
                        console.log('1');
                      } else {
                        console.log('2');
                        Linking.openURL('viber://chats');
                        // Linking.openURL('viber://chat?number=639188989911');
                      }
                    })
                    .catch((err) => console.log(err));
                },
              },
            ],
            {cancelable: true},
          );
        }

        if (APIUpdateVersion.APIUpdateVersionStatus === 'OFFLINE') {
          const input = APIUpdateVersion.APIUpdateVersionNotice;

          const [msg1, msg2, msg3] = input.split('~');

          console.log(msg1);
          console.log(msg2);
          console.log(msg3);

          Alert.alert(
            'System Maintenance',
            msg1 + '\n \n' + msg2 + '\n' + msg3 + '\n',
            [
              {
                text: 'OK',
                onPress: () => {
                  props.navigation.navigate('Home');
                },
              },
            ],
            {cancelable: true},
          );
        } else {
          UpdateYearMonthsFilter();
        }
      } else {
        UpdateYearMonthsFilter();
      }
    });
  }, []);

  return (
    <ImageOverlay
      source={require('../../assets/building.jpg')}
      height={height}
      contentPosition="top">
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          height: height,
          width: width,
          alignItems: 'center',
        }}>
        <View
          style={{
            // backgroundColor: 'red',
            width: 120,
            height: 120,
            alignItems: 'center',
            marginTop: 20,
            marginBottom: 10,
          }}>
          <Image
            style={{width: 120, height: 120, resizeMode: 'center'}}
            source={require('../../assets/wamilogo.png')}
          />
        </View>

        <View
          style={{
            borderWidth: 1,
            padding: 10,
            borderRadius: 20,
            borderColor: 'white',
          }}>
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: 20,
              marginHorizontal: 10,
            }}>
            {' '}
            Wing An Marketing Inc.
          </Text>
          {/* <Button
            title="test"
            onPress={() => console.log(DashboardYears.length)}
          /> */}
        </View>
      </View>
    </ImageOverlay>
  );
}

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  textInput: {
    paddingLeft: 10,
    color: '#05375a',
    borderBottomWidth: 0.2,
  },
});
