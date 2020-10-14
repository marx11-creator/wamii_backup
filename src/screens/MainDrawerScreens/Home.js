/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useContext, useRef} from 'react';
import {useFocusEffect, CommonActions} from '@react-navigation/native';
import {
  ScrollView,
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
  Animated,
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
  APIToken,
  ResetModuleAccess,
  ClearTeamAccess,
  ClearDefaults,
} from '../../sharedComponents/globalCommands/globalCommands';
import {
  UpdateYearMonthsFilter,
  globalStatus,
  OtherSettings,
} from '../../sharedComponents/globalCommands/globalCommands';

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
import UpdateModal from './UpdateModal';
import PageContextGlobalState from './pagecontextGlobalState';
import PageContextGlobalTimer from './pagecontextGlobalTimer';
import PageContextAutoLogout from './pagecontextAutoLogout';
import Icon from 'react-native-vector-icons/Ionicons';

LogBox.ignoreAllLogs();

export default function Home(props) {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const [globalAutoLogout, setglobalAutoLogout] = useContext(
    PageContextAutoLogout,
  );
  const [globalState, setglobalState] = useContext(PageContextGlobalState);
  const [globalTimer] = useContext(PageContextGlobalTimer);
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
            // console.log(results.rows.item(0).amount);
            // console.log(results.rows.item(0).target);
            // console.log('ACH HERE');
            setTarget({
              ...Target,
              SalesvsTarget:
                results.rows.item(0).target < 1 ||
                results.rows.item(0).amount < 1
                  ? 0
                  : parseInt(results.rows.item(0).amount) /
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
        BackHandler.exitApp();
        //         return true;
        // Alert.alert(
        //   'System',
        //   'Are you sure you want to close application?',
        //   [
        //     {
        //       text: 'YES',
        //       onPress: () => {
        //         BackHandler.exitApp();
        //         return true;
        //       },
        //     },
        //     {
        //       text: 'NO',
        //       // onPress: () => {
        //       //   BackHandler.exitApp();
        //       //   return true;
        //       // },
        //     },
        //   ],
        //   {cancelable: true},
        // );
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  useEffect(() => {
    if (globalAutoLogout === 'TRUE') {
      setglobalAutoLogout('FALSE');
      ResetModuleAccess();
      ClearTeamAccess();
      ClearDefaults();

      setglobalState({
        timerSeconds: 0,
        timerMinute: 0,
        updateStatus: 'Start',
        dateTimeUpdated24hr: '',
        updatePercentage: '',
      });

      props.navigation.navigate('SplashScreen');
    }
  }, [globalAutoLogout]);

  useEffect(() => {
    getWorkingDays();
  }, [globalState.dateTimeUpdated24hr]);

  useEffect(() => {
    // console.log('3seonds HERE run');
    var secs = 0;
    // BackgroundTimer.clearInterval();
    const intervalId = BackgroundTimer.setInterval(() => {
      secs = secs + 1;
      // console.log(secs);
      // console.log(globalStatus.StartUpUpdate);
      setlocalSeconds(secs);

      if (secs === 1 && globalStatus.StartUpUpdate === false) {
        globalStatus.updateStatus = 'Updating';
      }

      if (secs === 2 && globalStatus.StartUpUpdate === false) {
        // var screenname = CurrentAppScreen.Screen;
        // console.log('3seonds was run');
        globalStatus.updateStatus = 'Updating';

        globalStatus.updateMode = 'auto';

        // props.navigation.navigate('UpdateModal');
        // props.navigation.navigate(screenname);

        BackgroundTimer.clearInterval(intervalId);
      }
    }, 1000);
  }, []);

  // useEffect(() => {
  //   if (localSeconds === 3) {
  //     setglobalState({
  //       ...globalState,
  //       updateStatus: 'Updating',
  //     });
  //   }
  // }, [localSeconds]);

  // useEffect(() => {

  // }, [APIUpdateVersion.APIUpdateVersionField]);

  // useEffect(() => {

  // }, [APIUpdateVersion.APIUpdateVersionStatus]);

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      console.log('focus on per Home1');
      CurrentAppScreen.Screen = 'Home';
      UpdateYearMonthsFilter();
      //props.navigation.navigate('Inventory');
    });
  }, []);

  function start() {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 500,
    }).start(() =>
      Animated.timing(fadeIn, {
        toValue: 0,
        delay: 1500,
        duration: 700,
      }).start(),
    );
  } 

  function ShowPleaseWait() {
    return (
      <View
        style={{
          flex: 1,
          zIndex: 4,
          width: moderateScale(50),
          height: moderateScale(50),
          alignItems: 'center',
          justifyContent: 'center',
 
          backgroundColor: 'rgba(0, 0, 0, 0)',

          position: 'absolute',
          top: height / 2,
          left: width / 2 - 20,
        }}>
        <Animated.View
          style={{
            zIndex: 0,
            opacity: fadeIn,
            height: scale(60),
            width: scale(200),
            margin: 5,
            borderRadius: 20,
            backgroundColor: 'rgba(107, 107, 107, 0.9)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: moderateScale(16),
              color: '#ffffff',
              fontWeight: '300',
              textAlign: 'center',
            }}>
            Comming Soon...{' '}
          </Text>
        </Animated.View>
  </View>

      // <View
      //   style={{
      //     position: 'absolute',
      //     top: 0,
      //     left: 0,
      //     right: 0,
      //     bottom: 0,
      //     justifyContent: 'center',
      //     alignItems: 'center',
      //     backgroundColor: 'rgba(0, 0, 0, 0)',
      //     zIndex: 0,
      //   }}>
      //   <Animated.View
      //     style={{
      //       zIndex: 0,
      //       opacity: 1,
      //       height: scale(50),
      //       width: scale(200),
      //       margin: 5,
      //       borderRadius: 12,
      //       backgroundColor: 'red',
      //       justifyContent: 'center',
      //     }}>
      //     <Text style={styles.text}>Comming Soon... </Text>
      //   </Animated.View>
      // </View>
    );
  }

  return (
    <ImageOverlay
      // source={require('../../assets/homepagecoslor.jpg')}
      source={require('../../assets/building.jpg')}
      height={height}
      contentPosition="top">
      <ScrollView>
        <ShowPleaseWait />
        <View
          style={{
            zIndex: 0,
            flexDirection: 'column',
            flex: 1,
          }}>
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
                {globalTimer.lastUpdate}
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
                      {'Updating...'}{' '}
                      {globalState.updatePercentage > 0
                        ? globalState.updatePercentage + ' %'
                        : ''}
                    </Text>
                  ) : null}

                  {/* <Text
                        style={{
                          color: 'white',
                          fontSize: moderateScale(12, 0.5),
                          alignContent: 'flex-end',
                          alignItems: 'flex-end',
                          justifyContent: 'flex-end',
                        }}>
                        {hhmmss(900 - globalStatus.CurrentSeconds)}
                      </Text> */}
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
                  start();
                  console.log('test');
                }}
              /> */}
            </View>

            <View
              style={{
                zIndex: 0,
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
                  (100 / WorkingDaysLocal.TotalDays) *
                    WorkingDaysLocal.DaysGone,
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
          {localSeconds === 200 ? <UpdateModal /> : null}
        </View>
      </ScrollView>
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

// props.navigation.dispatch(
//   CommonActions.reset({
//     index: 1,
//     routes: [{name: 'Home'}],
//   }),
// );
