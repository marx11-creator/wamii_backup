/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useContext} from 'react';
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
  TouchableOpacity,
} from 'react-native';

import ImageOverlay from 'react-native-image-overlay';
import {width, height} from '../../sharedComponents/scaling';
import {
  APIUpdateVersion,
  CurrentAppVersionUpdate,
  DashboardYears,
  FilterList,
  WorkingDays,
  CurrentAppScreen,
  LastDateTimeUpdated,
  hhmmss,
} from '../../sharedComponents/globalCommands/globalCommands';
import {
  UpdateYearMonthsFilter,
  globalStatus,
} from '../../sharedComponents/globalCommands/globalCommands';
import DeviceInfo from 'react-native-device-info';
import moment from 'moment';
import {dbBusinessCalendar, dbperymtsat} from '../../database/sqliteSetup';
import numbro from 'numbro';
import {ProgressCircle} from 'react-native-svg-charts';
import {
  scale,
  moderateScale,
  verticalScale,
} from '../../sharedComponents/scaling';
import BackgroundTimer from 'react-native-background-timer';
import App1 from './test';
import UpdateModal from './UpdateModal';
import PageContext from './pagecontext';
import Icon from 'react-native-vector-icons/Ionicons';
LogBox.ignoreAllLogs();

export default function Home(props) {
  //  console.log(auth);
  const [globalState, setglobalState] = useContext(PageContext);
  const [localSeconds, setlocalSeconds] = useState(0);

  const WorkingDaysFields = {
    TotalDays: '0',
    RemainingDays: '0',
    DaysGone: '0',
    SalesvsTarget: '0',
  };
  const [WorkingDaysLocal, setWorkingDaysLocal] = useState(WorkingDaysFields);

  const TargetFields = {
    SalesvsTarget: '0',
  };

  const [Target, setTarget] = useState(TargetFields);

  DeviceInfo.getDeviceName().then((deviceName) => {
    // console.log(deviceName);
    // console.log(DeviceInfo.getUniqueId());
  });



  function SQLerror(err) {
    console.log('SQL Error: ' + err);
  }

  function getWorkingDays() {
    var YearQuery = '';
    if (FilterList.DashboardFilterYear === '') {
      YearQuery =
        ' year=  ' + "'" + moment().utcOffset('+08:00').format('YYYY') + "'";
    } else {
      YearQuery = ' year = ' + "'" + FilterList.DashboardFilterYear + "'";
    }

    var MonthQuery = '';
    if (FilterList.DashboardFilterMonth === '') {
      MonthQuery =
        ' and  month =  ' +
        "'" +
        moment().utcOffset('+08:00').format('MM') +
        "'";
    } else {
      MonthQuery =
        ' and month = ' +
        "'" +
        moment().month(FilterList.DashboardFilterMonth).format('MM') +
        "'";
    }

    var YearQuery2 = '';
    if (FilterList.DashboardFilterYear === '') {
      YearQuery2 =
        ' business_year=  ' +
        "'" +
        moment().utcOffset('+08:00').format('YYYY') +
        "'";
    } else {
      YearQuery2 =
        ' business_year = ' + "'" + FilterList.DashboardFilterYear + "'";
    }

    var MonthQuery2 = '';
    if (FilterList.DashboardFilterMonth === '') {
      MonthQuery2 =
        ' and  business_month =  ' +
        "'" +
        moment().utcOffset('+08:00').format('MMMM') +
        "'";
    } else {
      MonthQuery2 =
        ' and business_month = ' +
        "'" +
        moment().month(FilterList.DashboardFilterMonth).format('MMMM') +
        "'";
    }

    var dateQuery = '';
    dateQuery =
      ' and date < ' +
      "'" +
      moment().utcOffset('+08:00').format('YYYY-MM-DD') +
      "'";
    // console.log(
    //   'SELECT  * from business_calendar_tbl  where ' + YearQuery + MonthQuery,
    // );
    dbBusinessCalendar.transaction((tx) => {
      tx.executeSql(
        'SELECT  * from business_calendar_tbl  where ' + YearQuery + MonthQuery,
        [],
        (tx, results) => {
          var DaysGone = 0;
          for (let i = 0; i < results.rows.length; ++i) {
            if (
              moment(results.rows.item(i).date)
                .utcOffset('+08:00')
                .format('YYYY-MM-DD') <
              moment().utcOffset('+08:00').format('YYYY-MM-DD')
            ) {
              DaysGone = DaysGone + 1;
            }
          }
          setWorkingDaysLocal({
            ...WorkingDaysLocal,
            TotalDays: results.rows.length,
            DaysGone: DaysGone,
            RemainingDays: Number(results.rows.length) - Number(DaysGone),
          });
        },
        SQLerror,
      );
    });

    dbperymtsat.transaction((tx) => {
      tx.executeSql(
        'SELECT  SUM(amount) as amount , SUM(target)   as target FROM perymtsat_tbl  where  ' +
          YearQuery2 +
          MonthQuery2 +
          ' order by invoice_date asc ',
        [],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            //setTotalSales();
            // console.log(
            //   (parseInt(results.rows.item(0).amount) /
            //     parseInt(results.rows.item(0).target)) *
            //     100,
            // );

            setTarget({
              ...Target,
              SalesvsTarget:
                parseInt(results.rows.item(0).amount) /
                parseInt(results.rows.item(0).target),
            });
          }
        },
        SQLerror,
      );
    });
  }

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
                return true;
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
    var secs = 0;
    // BackgroundTimer.clearInterval();
    const intervalId = BackgroundTimer.setInterval(() => {
      secs = secs + 1;

      setlocalSeconds(secs);

      if (secs === 3 && globalStatus.StartUpUpdate === false) {
        // var screenname = CurrentAppScreen.Screen;
        console.log(CurrentAppScreen.Screen);
        globalStatus.updateStatus = 'Updating';

        globalStatus.updateMode = 'auto';
        globalStatus.StartUpUpdate = true;
        // props.navigation.navigate('UpdateModal');
        // props.navigation.navigate(screenname);

        BackgroundTimer.clearInterval(intervalId);
      }
    }, 1000);
  }, []);

  useEffect(() => {
    if (localSeconds === 3) {
      setglobalState({
        ...globalState,
        updateStatus: 'Updating',
      });
    }
  }, [localSeconds]);

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      getWorkingDays();
      console.log('focus on per Home');
      CurrentAppScreen.Screen = 'Home';
      if (APIUpdateVersion.APIUpdateVersionField !== 0) {
        if (
          Number(CurrentAppVersionUpdate.CurrentAppVersionUpdateField) ===
          Number(APIUpdateVersion.APIUpdateVersionField)
        ) {
          //  console.log('app is updated');
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
                  //   console.log('later');
                },
              },
              {
                text: 'Update Now',
                onPress: () => {
                  Linking.canOpenURL('viber://')
                    .then((supported) => {
                      if (!supported) {
                        ////    console.log('1');
                      } else {
                        //    console.log('2');
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

          // console.log(msg1);
          //console.log(msg2);
          //console.log(msg3);

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
      // props.navigation.navigate('SalesmanNet');
    });
  }, []);

  return (
    <ImageOverlay
      // source={require('../../assets/homepagecoslor.jpg')}
      source={require('../../assets/building.jpg')}
      height={height}
      contentPosition="top">
      <View style={{flexDirection: 'column', flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            height: scale(70),
            width: width,
          }}>
          <View style={{width: 50, marginLeft: 10}}>
            <TouchableOpacity onPress={() => props.navigation.openDrawer()}>
              <Icon name="md-filter" color={'#ffffff'} size={34} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              width: scale(150),
              marginRight: 10,
              alignContent: 'flex-end',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: moderateScale(12, 0.5),
                alignContent: 'flex-end',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
              }}>
              Last Update
            </Text>
            <Text
              style={{
                color: 'white',
                fontSize: moderateScale(12, 0.5),
                alignContent: 'flex-end',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
              }}>
              {LastDateTimeUpdated.value}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignContent: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View style={{width: 10, marginRight: moderateScale(5, 0.5)}}>
                <Icon name="refresh" color={'#ffffff'} size={10} />
              </View>
              <Text
                style={{
                  color: 'white',
                  fontSize: moderateScale(12, 0.5),
                  alignContent: 'flex-end',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                }}>
                {globalState.updateStatus === 'Updating' ||
                globalState.updateStatus === 'Start' ? (
                  <Text
                    style={{
                      color: 'white',
                      fontSize: moderateScale(12, 0.5),
                      alignContent: 'flex-end',
                      alignItems: 'flex-end',
                      justifyContent: 'flex-end',
                    }}>
                    {'Updating...'}  {globalState.updatePercentage > 0? (globalState.updatePercentage + ' %'): ''}
                  </Text>
                ) : (
                  <Text
                    style={{
                      color: 'white',
                      fontSize: moderateScale(12, 0.5),
                      alignContent: 'flex-end',
                      alignItems: 'flex-end',
                      justifyContent: 'flex-end',
                    }}>
                    {hhmmss(900 - globalState.timerSeconds)}
                    
                  </Text>
                )}
              </Text>
            </View>
          </View>
        </View>

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
              marginBottom: 10,
            }}>
            <Image
              style={{width: 120, height: 120, resizeMode: 'center'}}
              source={require('../../assets/wamilogo.png')}
              // source={require('../../assets/coslorlogo.png')}
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
              onPress={() => {
                console.log('as');
              }}
            /> */}
          </View>

          <View
            style={{
              marginTop: 80,
              width: scale(190),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ProgressCircle
              style={{height: scale(180), width: scale(230)}}
              progress={Target.SalesvsTarget}
              progressColor={'#24E4B5'}
              backgroundColor="#8E8E8E" //'#ECECEC'	PropTypes.any
              startAngle="0" // 	0	PropTypes.number
              // endAngle // Math.PI * 2	   PropTypes.number
              strokeWidth="3" // 5	PropTypes.number
              cornerRadius="25" // PropTypes.number
            />

            <Text
              style={{
                position: 'absolute',
                color: 'white',
                fontSize: moderateScale(20),
                fontWeight: 'bold',
              }}>
              {numbro(Target.SalesvsTarget * 100).format({
                thousandSeparated: true,
                mantissa: 2,
              })}{' '}
              % {'\n\n'} ACH
            </Text>
          </View>

          {/* <Text style={{color: 'green', fontSize: 20}}>
            {LastDateTimeUpdated.value}
          </Text> */}
          <View
            style={{
              marginTop: 80,
              width: scale(190),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ProgressCircle
              style={{height: scale(180), width: scale(230)}}
              progress={Target.SalesvsTarget}
              progressColor={'#24E4B5'}
              backgroundColor="#8E8E8E" //'#ECECEC'	PropTypes.any
              startAngle="0" // 	0	PropTypes.number
              // endAngle // Math.PI * 2	   PropTypes.number
              strokeWidth="3" // 5	PropTypes.number
              cornerRadius="25" // PropTypes.number
            />

            <Text
              style={{
                position: 'absolute',
                color: 'white',
                fontSize: moderateScale(20),
                fontWeight: 'bold',
              }}>
              {numbro(
                (100 / WorkingDaysLocal.TotalDays) * WorkingDaysLocal.DaysGone,
              ).format({
                thousandSeparated: true,
                mantissa: 2,
              })}{' '}
              % {'\n\n'} PAR
            </Text>
          </View>

          {/* <View
          style={{
            borderWidth: 1,
            padding: 10,
            borderRadius: 20,
            borderColor: 'white',
          }}>
          <Text
            style={{
              marginTop: 40,
              color: 'white',
              fontWeight: 'bold',
              fontSize: 20,
              marginHorizontal: 10,
            }}>
            {' '}
            PAR {numbro(
              (100 / WorkingDaysLocal.TotalDays) * WorkingDaysLocal.DaysGone,
            ).format({
              thousandSeparated: true,
              mantissa: 2,
            })}
            {'%'}
          </Text>

          <Text
            style={{
              marginTop: 40,
              color: 'white',
              fontWeight: 'bold',
              fontSize: 20,
              marginHorizontal: 10,
            }}>
            ACH {numbro(Target.SalesvsTarget).format({
              thousandSeparated: true,
              mantissa: 2,
            })}
            {'%'}
          </Text>
        </View> */}
        </View>
      </View>

      {localSeconds === 3 ? <UpdateModal /> : null}
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
