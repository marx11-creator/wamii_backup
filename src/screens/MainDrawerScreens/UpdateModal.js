/* eslint-disable no-lone-blocks */
import React, {useState, useEffect, useContext} from 'react';
import {
  Button,
  Text,
  View,
  RefreshControl,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Linking,
  BackHandler,
} from 'react-native';
import FlatButton from '../../sharedComponents/custombutton';
import {dbperymtsat} from '../../database/sqliteSetup';
import {
  dbperprincipal,
  dbperarea,
  dbBusinessCalendar,
  dbSalesmanNet,
  dblastdatetimeupdated,
  dbinventory,
} from '../../database/sqliteSetup';
import {
  scale,
  moderateScale,
  verticalScale,
  width,
  height,
} from '../../sharedComponents/scaling';
import {CommonActions} from '@react-navigation/native';
import moment from 'moment';
import {
  APIToken,
  server,
  globalCompany,
  globalStatus,
  CurrentAppScreen,
  GetDateTime,
  CurrentAppVersionUpdate,
  ResetModuleAccess,
  ClearTeamAccess,
  ClearDefaults,
} from '../../sharedComponents/globalCommands/globalCommands';

import {APIUpdateVersion} from '../../sharedComponents/globalCommands/globalCommands';
import PageContextGlobalState from './pagecontextGlobalState';
import PageContextGlobalTimer from './pagecontextGlobalTimer';
import PageContextAutoLogout from './pagecontextAutoLogout';
import BackgroundTimer from 'react-native-background-timer';
//marc
import {useFocusEffect} from '@react-navigation/native';
import {sqrt} from 'react-native-reanimated';
import {SQLErrors} from 'react-native-sqlite-storage';
//marc
var ApiRowsCount = 0;
var longStrinfg = '';

var FiveSecondsDelay = 0;
var lineChartAPIdatalength = 0;

var PerPrincipalAPIdatalength = 0;
var PerAreaAPIdatalength = 0;
var updateProgress = 0;

var MonthDiff = '';
var DaysDiff = '';
var HoursDiff = '';
var MinutesDiff = '';

//marc
var cur_month = new Date().getMonth() + 1;
var prev_month = new Date().getMonth();
var year = new Date().getFullYear();
var MarcStatus = '0';
//marc

export default function UpdateModal(props) {
  const [globalAutoLogout, setglobalAutoLogout] = useContext(
    PageContextAutoLogout,
  );
  const [globalState, setglobalState] = useContext(PageContextGlobalState);
  const [globalTimer, setglobalTimer] = useContext(PageContextGlobalTimer);
  const [localSeconds, setLocalSeconds] = useState(0);

  var GetPerymtsatAPIDataState = false;

  // var secs = 0;
  // // BackgroundTimer.clearInterval();
  // const intervalId = BackgroundTimer.setInterval(() => {
  //   secs = secs + 1;
  //   setLocalSeconds(secs);
  //   console.log(auth);
  // }, 1000);

  // useEffect(() => {
  //   setglobalState({
  //     ...globalState,
  //     timerSeconds: localSeconds,
  //   });
  //   FiveSecondsDelay = FiveSecondsDelay + 1;
  //   if (FiveSecondsDelay === 60) {
  //     FiveSecondsDelay = 0;
  //     ComputeLastDateTimeUpdate();
  //   }

  //   // console.log('second timer running ' + ' ' + localSeconds);
  //   if (localSeconds === 900) {
  //     globalStatus.updateStatus = 'Updating';

  //     setglobalState({
  //       ...globalState,
  //       timerSeconds: 0,
  //       updateStatus: 'Updating',
  //     });
  //   }
  // }, [localSeconds]);

  useEffect(() => {
    FiveSecondsDelay = FiveSecondsDelay + 1;
    if (FiveSecondsDelay === 60) {
      console.log('60 secs reach');
      FiveSecondsDelay = 0;
      ComputeLastDateTimeUpdate();
    }
  }, [localSeconds]);

  ////////////////MARC
  const [customer_data, setcustomer_data] = useState([]);
  const [net_data, setnet_data] = useState([]);
  const [vendor_data, setvendor_data] = useState([]);
  const [category_data, setcategory_data] = useState([]);
  const [scjcategory_data, setscjcategory_data] = useState([]);

  const [c_customer_data, setc_customer_data] = useState([]);
  const [c_net_data, setc_net_data] = useState([]);
  const [c_vendor_data, setc_vendor_data] = useState([]);
  const [c_category_data, setc_category_data] = useState([]);
  const [scj_category_data, setscj_category_data] = useState([]);

  const [load_pc, setload_pc] = useState(0);
  const [load_n, setload_n] = useState(0);
  const [load_v, setload_v] = useState(0);
  const [load_c, setload_c] = useState(0);
  const [load_scj, setload_scj] = useState(0);

  const [count_c_json, setcount_c_json] = useState('');

  const [isLoading, setLoading] = useState(false);
  const [loadname, setloadname] = useState('');

  const [modalvisible, setmodalvisible] = useState(false);

  const [focus_int, setfocus_int] = useState(0);

  const [fixed_date_from, setfixed_date_from] = useState('');
  const [fixed_date_to, setfixed_date_to] = useState('');

  ////////////////MARC

  //QUERY CHECKER
  const [q1Principal, setq1Principal] = useState(false);
  const [q2Perymtsat, setq2Perymtsat] = useState(false);

  const [q3UserUpdateLog, setq3UserUpdateLog] = useState(false);
  const [q4Area, setq4Area] = useState(false);
  const [q5Marc, setq5Marc] = useState(false);
  const [q6Inventory, setq6Inventory] = useState(false);
  const [isModalConnectionError, setisModalConnectionError] = useState(false);
  const [isLoadingActivityIndicator, setisLoadingActivityIndicator] = useState(
    false,
  );

  const lineChartLocalDataField = [
    {
      business_year: '',
      business_month: '',
      invoice_date: '',
      principal_name: '',
      team: '',
      salesman_name: '',
      position_name: '',
      amount: '',
      target: '',
    },
  ];
  const [lineChartLocalData, setlineChartLocalData] = useState(
    lineChartLocalDataField,
  );

  //PER PRINCIPAL
  const PerPrincipalLocalDataField = [
    {
      business_year: '',
      business_month: '',
      principal_name: '',
      principal_acronym: '',
      team: '',
      sales: '',
      target: '',
      uba: '',
    },
  ];
  const [PerPrincipalLocalData, setPerPrincipalLocalData] = useState(
    PerPrincipalLocalDataField,
  );

  //PER AREA
  const PerAreaLocalDataField = [
    {
      business_year: '',
      business_month: '',
      provice: '',
      principal_name: '',
      team: '',
      sales: '',
      uba: '',
    },
  ];
  const [PerAreaLocalData, setPerAreaLocalData] = useState(
    PerAreaLocalDataField,
  );

  function afterUpdate() {
    SaveLastDatetimeUpdated();
    console.log('27 ' + 'UPDATE DONE!!!!!!!!');

    if (globalStatus.updateMode === 'manual') {
      updateProgress = 0;
      setisModalConnectionError(false);
      setisLoadingActivityIndicator(false);
      // console.log(globalStatus.updateMode);
      globalStatus.updateMode = 'auto';

      globalStatus.updateStatus = 'Idle';

      setglobalState({
        ...globalState,
        updateStatus: 'Idle',
        updatePercentage: updateProgress,
        dateTimeUpdated24hr: moment().format('DD/MM/YYYY HH:mm:ss'),
      });
      props.navigation.navigate(CurrentAppScreen.Screen);
      CheckSystemStatus(); //3.3
      RunTimer();
      //5
    } else {
      updateProgress = 0;
      //globalStatus.updateMode);
      globalStatus.updateStatus = 'Idle';

      setglobalState({
        ...globalState,
        updateStatus: 'Idle',
        updatePercentage: updateProgress,
        dateTimeUpdated24hr: moment().format('DD/MM/YYYY HH:mm:ss'),
      });

      RunTimer();
      //6
    }

    CheckSystemStatus(); //-3
  }

  function CheckSystemStatus() {
    var updateDifference = 0;
    updateDifference =
      Number(APIUpdateVersion.APIUpdateVersionField) -
      Number(CurrentAppVersionUpdate.CurrentAppVersionUpdateField);
    if (APIUpdateVersion.APIUpdateVersionField !== 0) {
      if (
        Number(CurrentAppVersionUpdate.CurrentAppVersionUpdateField) ===
        Number(APIUpdateVersion.APIUpdateVersionField)
      ) {
        //    console.log('app is updated');
      } else {
        if (updateDifference > 1) {
          Alert.alert(
            'Notice',
            'You are using outdated version off the app. Please update to the latest version wamii_v' +
              APIUpdateVersion.APIUpdateVersionField +
              ' \n.',
            [
              {
                text: 'OK',
                onPress: () => {
                  BackHandler.exitApp();
                },
              },
            ],
            {cancelable: true},
          );
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
      }
    }

    if (APIUpdateVersion.APIUpdateVersionStatus === 'OFFLINE') {
      //1
      const input = APIUpdateVersion.APIUpdateVersionNotice;
      const [msg1, msg2, msg3] = input.split('~');
      Alert.alert(
        'System Maintenance',
        msg1 + '\n \n' + msg2 + '\n' + msg3 + '\n',
        [
          {
            text: 'OK',
            // onPress: () => {
            //   props.navigation.navigate('Home');
            // },
          },
        ],
        {cancelable: true},
      );
    } else {
      //  console.log('asd');
    }
  }

  function SaveLastDatetimeUpdated() {
    var currdt = "('" + moment().format('DD/MM/YYYY HH:mm:ss') + "')";
    var currdtRaw = moment().format('DD/MM/YYYY HH:mm:ss');

    dblastdatetimeupdated.transaction(function (tx) {
      tx.executeSql(
        'Delete from lastdatetimeupdated_tbl ',
        [],
        (tx, results) => {
          //    console.log('last datetimeupdatedtbl cleared');
        },
        (tx, err) => {
          //   console.log('ADDED HERE6' + err);
        },
      );

      tx.executeSql(
        'INSERT INTO  lastdatetimeupdated_tbl (lastdatetimeupdated24hr) VALUES ' +
          currdt,
        [],
        (tx, results) => {
          // setglobalState({
          //   ...globalState,
          //   dateTimeUpdated24hr: moment().format('DD/MM/YYYY HH:mm:ss')
          // })
          // GetDateTime(); // call get last date time updated to update global last date time
          globalStatus.dateTimeUpdated24hr = currdtRaw;
          ComputeLastDateTimeUpdate();
        },
        (tx, err) => {
          //  console.log('ADDED HERE7' + err);
        },
      );
    });
  }

  function RunTimer() {
    //  console.log('timer triggered');
    var secs = 0;
    const intervalId2 = BackgroundTimer.setInterval(() => {
      secs = secs + 1;
      setLocalSeconds(secs);
      // globalStatus.CurrentSeconds = secs;
      if (secs === 900) {
        BackgroundTimer.clearInterval(intervalId2);
        GETUpdateVersionAPI();
        globalStatus.updateStatus = 'Updating';
      }

      if (globalStatus.updateMode === 'manual') {
        //  console.log('auto update stopped, manual update clicked');
        BackgroundTimer.clearInterval(intervalId2);
      }
    }, 1000);
  }

  function onErrortimeout() {
    if (globalStatus.updateMode === 'manual') {
      updateProgress = 0;
      setglobalState({
        ...globalState,
        updatePercentage: updateProgress,
      });
      setisModalConnectionError(true);
      setisLoadingActivityIndicator(false); //DISABLE ActivityIndicator

      globalStatus.updateStatus = 'Idle';

      setglobalState({
        ...globalState,
        updateStatus: 'Idle',
      });
      console.log('error occured in background update manual');
      globalStatus.updateMode = 'auto';
      RunTimer();
      //7
    } else {
      updateProgress = 0;
      setglobalState({
        ...globalState,
        updatePercentage: updateProgress,
      });
      setisModalConnectionError(false);
      setisLoadingActivityIndicator(false); //DISABLE ActivityIndicator
      console.log('error occured in background update');

      globalStatus.updateStatus = 'Idle';

      setglobalState({
        ...globalState,
        updateStatus: 'Idle',
      });

      RunTimer();
      //8
    }
  }

  useEffect(() => {
    if (
      q1Principal &&
      q2Perymtsat &&
      q4Area &&
      q3UserUpdateLog &&
      q5Marc &&
      q6Inventory &&
      globalStatus.updateStatus === 'Updating'
    ) {
      afterUpdate();
    }
  }, [q1Principal]);

  useEffect(() => {
    if (
      q1Principal &&
      q2Perymtsat &&
      q4Area &&
      q3UserUpdateLog &&
      q5Marc &&
      q6Inventory &&
      globalStatus.updateStatus === 'Updating'
    ) {
      afterUpdate();
    }
  }, [q2Perymtsat]);

  useEffect(() => {
    if (
      q1Principal &&
      q2Perymtsat &&
      q4Area &&
      q3UserUpdateLog &&
      q5Marc &&
      q6Inventory &&
      globalStatus.updateStatus === 'Updating'
    ) {
      afterUpdate();
    }
  }, [q3UserUpdateLog]);

  useEffect(() => {
    if (
      q1Principal &&
      q2Perymtsat &&
      q4Area &&
      q3UserUpdateLog &&
      q5Marc &&
      q6Inventory &&
      globalStatus.updateStatus === 'Updating'
    ) {
      afterUpdate();
    }
  }, [q4Area]);

  useEffect(() => {
    if (
      q1Principal &&
      q2Perymtsat &&
      q4Area &&
      q3UserUpdateLog &&
      q5Marc &&
      q6Inventory &&
      globalStatus.updateStatus === 'Updating'
    ) {
      afterUpdate();
    }
  }, [q5Marc]);

  useEffect(() => {
    if (
      q1Principal &&
      q2Perymtsat &&
      q4Area &&
      q3UserUpdateLog &&
      q5Marc &&
      q6Inventory &&
      globalStatus.updateStatus === 'Updating'
    ) {
      afterUpdate();
    }
  }, [q6Inventory]);

  //====================================================================> RUN UPDATE

  useEffect(() => {
    ComputeLastDateTimeUpdate();
    {
      globalStatus.updateMode === 'manual'
        ? props.navigation.addListener('focus', () => {
            ManualUpdate();
            // console.log('focused');
          })
        : AutoUpdate();
    }
  }, []);

  function ComputeLastDateTimeUpdate() {
    //console.log('compute running');
    var now = moment().format('DD/MM/YYYY HH:mm:ss');
    var then = globalStatus.dateTimeUpdated24hr;
    var ms = moment(now, 'DD/MM/YYYY HH:mm:ss').diff(
      moment(then, 'DD/MM/YYYY HH:mm:ss'),
    );
    var d = moment.duration(ms);
    MonthDiff = '';
    DaysDiff = '';
    HoursDiff = '';
    MinutesDiff = '';

    if (d.months() > 0) {
      MonthDiff = d.months() + ' month ';
    } else {
      MonthDiff = '';
    }

    if (d.days() === 1) {
      DaysDiff = d.days() + ' day ';
    } else if (d.days() > 1) {
      DaysDiff = d.days() + ' days ';
    } else if (d.days() < 1) {
      DaysDiff = '';
    }

    if (d.hours() === 1) {
      HoursDiff = d.hours() + ' hour ';
    } else if (d.hours() > 1) {
      HoursDiff = d.hours() + ' hours ';
    } else if (d.hours() < 1) {
      HoursDiff = '';
    }

    if (d.minutes() === 1) {
      MinutesDiff = d.minutes() + ' minute ';
    } else if (d.minutes() > 1) {
      MinutesDiff = d.minutes() + ' minutes ';
    } else if (d.minutes() < 1) {
      MinutesDiff = '';
    }

    if (MonthDiff !== '') {
      setglobalTimer({
        ...globalTimer,
        lastUpdate: MonthDiff + 'ago',
      });
    } else if (DaysDiff !== '') {
      setglobalTimer({
        ...globalTimer,
        lastUpdate: DaysDiff + 'ago',
      });
    } else if (HoursDiff !== '') {
      setglobalTimer({
        ...globalTimer,
        lastUpdate: HoursDiff + 'ago',
      });
    } else if (MinutesDiff !== '') {
      setglobalTimer({
        ...globalTimer,
        lastUpdate: MinutesDiff + 'ago',
      });
    } else {
      setglobalTimer({
        ...globalTimer,
        lastUpdate: '0 minutes ago',
      });
    }
  }

  function ManualUpdate() {
    if (
      globalStatus.updateStatus === 'Updating' &&
      globalStatus.updateMode === 'manual'
    ) {
      updateProgress = 0;

      console.log('focus on update');

      if (globalStatus.updateMode === 'manual') {
        setisLoadingActivityIndicator(true); //ENABLEE ActivityIndicator
      }

      GETUpdateVersionAPI(); // GET UPDATED VERSION TO CHECK

      setglobalState({
        ...globalState,
        updateStatus: 'Updating',
        updatePercentage: updateProgress,
      });
    }
  }

  function AutoUpdate() {
    console.log('focus on Auto update');
    //  console.log('Auto Update started');
    if (
      globalStatus.updateStatus === 'Updating' &&
      globalStatus.updateMode === 'auto'
    ) {
      updateProgress = 0;
      //   console.log('focus on update');

      // if (globalStatus.updateMode === 'manual') {
      //   setisLoadingActivityIndicator(true); //ENABLEE ActivityIndicator
      // }

      GETUpdateVersionAPI(); // GET UPDATED VERSION TO CHECK

      setglobalState({
        ...globalState,
        updateStatus: 'Updating',
        updatePercentage: updateProgress,
      });
    }
  }
  // useEffect(() => {
  //   if (globalStatus.updateStatus === 'Updating') {
  //     updateProgress = 0;
  //     console.log('focus on update');

  //   if (globalStatus.updateMode === 'manual') {
  //         setisLoadingActivityIndicator(true); //ENABLEE ActivityIndicator

  //   }

  //     GETUpdateVersionAPI(); // GET UPDATED VERSION TO CHECK

  //     setglobalState({
  //       ...globalState,
  //       updateStatus:  'Updating',
  //     })
  //   } else {
  //     console.log('errrrr');
  //     console.log(globalStatus.updateStatus);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (globalStatus.updateStatus === 'Updating') {
  //     updateProgress = 0;
  //     console.log('focus on update');

  //     if (globalStatus.updateMode === 'manual') {
  //       setisLoadingActivityIndicator(true); //ENABLEE ActivityIndicator
  //     }

  //     GETUpdateVersionAPI(); // GET UPDATED VERSION TO CHECK

  //     setglobalState({
  //       ...globalState,
  //       updateStatus: 'Updating',
  //     });
  //   } else {
  //     console.log('errrrr');
  //     console.log(globalStatus.updateStatus);
  //   }
  // }, []);

  useEffect(() => {
    if (lineChartLocalData.length === lineChartAPIdatalength) {
      updateProgress = Number(updateProgress) + Number(5);

      setglobalState({
        ...globalState,
        updatePercentage: updateProgress,
      });

      lineChartAPIdatalength = 0;
      DeletePerymtsatAPIData();
    } else {
    }
  }, [lineChartLocalData]);

  //PER PRINCIPAL
  useEffect(() => {
    if (PerPrincipalLocalData.length === PerPrincipalAPIdatalength) {
      updateProgress = Number(updateProgress) + Number(5);

      setglobalState({
        ...globalState,
        updatePercentage: updateProgress,
      });

      PerPrincipalAPIdatalength = 0;
      DeletePerPrincipalAPIData();
    }
  }, [PerPrincipalLocalData]);

  //PER AREA
  useEffect(() => {
    if (PerAreaLocalData.length === PerAreaAPIdatalength) {
      updateProgress = Number(updateProgress) + Number(8);
      setglobalState({
        ...globalState,
        updatePercentage: updateProgress,
      });

      PerAreaAPIdatalength = 0;
      DeletePerAreaAPIData();
    }
  }, [PerAreaLocalData]);

  function SQLerror(err) {
    console.log('SPECIAL Error  : ' + err.message);
  }

  function StartUpdate() {
    console.log('START START.................');
    setq1Principal(false); //update status of function to false
    setq2Perymtsat(false); //update status of function to false
    setq3UserUpdateLog(false); //update status of function to false
    setq4Area(false); //update status of function to false
    setq5Marc(false); //update status of function to false
    setq6Inventory(false); //update Inventory
    if (global.account_type === 'Principal') {
      setq5Marc(true);
      console.log('3 4 5 6 initiate bypass');
    } else if (global.account_type === 'Developer') {
      setq5Marc(true);
      console.log('3 4 5 6 initiate bypass');
    } else if (global.account_type === 'Admin') {
      setq5Marc(true);
      console.log('3 4 5 6 initiate bypass');
    } else if (global.account_type === 'Salesman') {
      initiate();
    }

    BusinessCalendarDownload();
    GetPerymtsatAPIData(); //GET API DATA
    GetPerPrincipalAPIData(); //GET API DATA
    GetPerAreaAPIData(); //GET API DATA
    //APISaveUpdate(); //SAVE UPDATE LOG TO API
    DownloadPromoItems();
  }

  const GetPerymtsatAPIData = () => {
    updateProgress = Number(updateProgress) + Number(9);
    setglobalState({
      ...globalState,
      updatePercentage: updateProgress,
    });

    var teams = global.TeamAccessListForAPI;
    var sales_position_name = global.sales_position_name;
    var principal_id = global.PrincipalAccessList;
    var tempstr1 =
      'team=' +
      teams +
      '&' +
      'sales_position_name=' +
      sales_position_name +
      '&' +
      'principal_id=' +
      principal_id;

    //DONE1
    //8
    console.log(
      server.server_address +
        globalCompany.company +
        'persalesmansalestarget?' +
        tempstr1,
    );
    Promise.race([
      fetch(
        server.server_address +
          globalCompany.company +
          'persalesmansalestarget?' +
          tempstr1,
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
        setTimeout(() => reject(new Error('Timeout')), 80000),
      ),
    ])
      .then((responseData) => {
        return responseData.json();
      })
      .then((jsonData) => {
        console.log('FETCH 8 DONE');
        if (jsonData.length > 0) {
          lineChartAPIdatalength = jsonData.length;
          setlineChartLocalData(jsonData);

          updateProgress = Number(updateProgress) + Number(6);
          setglobalState({
            ...globalState,
            updatePercentage: updateProgress,
          });
        } else {
          if (globalStatus.updateMode === 'manual') {
            Alert.alert(
              'Error',
              'Application Error,  No data found \n err1001 \n \n Please Contact Support Team.',
              [
                {
                  text: 'OK',
                },
              ],
              {cancelable: true},
            );

            setisModalConnectionError(false);
            setisLoadingActivityIndicator(false);
            props.navigation.navigate('Home');
          }
        }
      })
      .catch(function (error) {
        console.log('error in GetperymtsatAPIData123 :' + error.message);
        onErrortimeout();
      })
      .done();
  };

  function DeletePerymtsatAPIData() {
    updateProgress = Number(updateProgress) + Number(10);
    setglobalState({
      ...globalState,
      updatePercentage: updateProgress,
    });

    dbperymtsat.transaction(function (tx) {
      tx.executeSql(
        'Delete from perymtsat_tbl ',
        [],
        (tx, results) => {
          updateProgress = Number(updateProgress) + Number(5);
          setglobalState({
            ...globalState,
            updatePercentage: updateProgress,
          });

          SavePerymtsatAPIData();
        },
        (tx, err) => {},
      );
    });
  }

  function SavePerymtsatAPIData() {
    var perymtsatString = '';
    var currIndex = 0;
    var runningIndexCount = 0;

    //basis
    {
      lineChartLocalData.map(function (item, index) {
        currIndex = currIndex + 1;
        runningIndexCount = runningIndexCount + 1;

        if (runningIndexCount < 501) {
          perymtsatString =
            perymtsatString +
            "('" +
            item.business_year +
            "'" +
            ',' +
            "'" +
            item.business_month +
            "'" +
            ',' +
            "'" +
            item.invoice_date +
            "'" +
            ',' +
            "'" +
            item.principal_name +
            "'" +
            ',' +
            "'" +
            item.team +
            "'" +
            ',' +
            "'" +
            item.salesman_name +
            "'" +
            ',' +
            "'" +
            item.position_name +
            "'" +
            ',' +
            "'" +
            item.amount +
            "'" +
            ',' +
            "'" +
            item.target +
            "'" +
            ',' +
            "'" +
            item.dateTimeUpdated +
            "'" +
            '),';

          if (runningIndexCount === 500) {
            var stringnow = perymtsatString;
            perymtsatString = '';
            runningIndexCount = 0;
            dbperymtsat.transaction(function (tx) {
              // done concat
              tx.executeSql(
                'INSERT INTO perymtsat_tbl (business_year, business_month,invoice_date,principal_name,team,salesman_name, position_name, amount,target,datetimeupdated) VALUES ' +
                  stringnow.slice(0, -1),
                [],
                (tx, results) => {
                  //   console.log('SAVED 500X500 SavePerymtsatAPIData');
                },
                SQLerror,
              );
            });
          }

          if (
            runningIndexCount < 500 &&
            currIndex === lineChartLocalData.length
          ) {
            var stringnow = perymtsatString;
            perymtsatString = '';

            dbperymtsat.transaction(function (tx) {
              // done concat
              tx.executeSql(
                'INSERT INTO perymtsat_tbl (business_year, business_month,invoice_date,principal_name,team,salesman_name, position_name, amount,target,datetimeupdated) VALUES ' +
                  stringnow.slice(0, -1),
                [],
                (tx, results) => {
                  // console.log(
                  //   'SAVED 500X500 SavePerymtsatAPIData < 500 ' +
                  //     runningIndexCount,
                  // );
                  runningIndexCount = 0;
                },
                SQLerror,
              );
            });
          }
        }
      });

      if (currIndex === lineChartLocalData.length) {
        /// console.log('5 ' + 'SavePerymtsatAPIData done concatenating, saved..');
        updateProgress = Number(updateProgress) + Number(10);
        setglobalState({
          ...globalState,
          updatePercentage: updateProgress,
        });

        setq1Principal(true);
        // console.log('6 ' + 'DONE SAVING SavePerymtsatAPIData ');
      }
    }
  }

  // !!!ADD TEAM USE IN FILTER IN DASHBOARD
  //PER PRINCIPAL
  const GetPerPrincipalAPIData = () => {
    var teams = global.TeamAccessListForAPI;
    var sales_position_name = global.sales_position_name;
    var principal_id = global.PrincipalAccessList;
    var tempstr3 =
      'team=' +
      teams +
      '&' +
      'sales_position_name=' +
      sales_position_name +
      '&' +
      'principal_id=' +
      principal_id;
    //9
    Promise.race([
      fetch(
        server.server_address +
          globalCompany.company +
          'perprincipalsalestargetuba?' +
          tempstr3,
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
        setTimeout(() => reject(new Error('Timeout')), 80000),
      ),
    ])
      .then((responseData) => {
        return responseData.json();
      })
      .then((jsonData) => {
        console.log('FETCH 9 DONE');
        if (jsonData.length > 0) {
          ///  console.log(jsonData.length);
          PerPrincipalAPIdatalength = jsonData.length;
          setPerPrincipalLocalData(jsonData);
          updateProgress = Number(updateProgress) + Number(3);
          setglobalState({
            ...globalState,
            updatePercentage: updateProgress,
          });
        } else {
          if (globalStatus.updateMode === 'manual') {
            Alert.alert(
              'Error',
              'Application Error,  No data found \n err1001 \n \n Please Contact Support Team.',
              [
                {
                  text: 'OK',
                },
              ],
              {cancelable: true},
            );

            setisModalConnectionError(false);
            setisLoadingActivityIndicator(false);
            props.navigation.navigate('Home');
          }
        }
      })
      .catch(function (error) {
        console.log('error in GetPerPrincipalAPIData :' + error.message);
        onErrortimeout();
      })
      .done();
  };

  function DeletePerPrincipalAPIData() {
    dbperprincipal.transaction(function (tx) {
      tx.executeSql(
        'Delete from perprincipalpermonth_tbl ',
        [],
        (tx, results) => {
          updateProgress = Number(updateProgress) + Number(10);
          setglobalState({
            ...globalState,
            updatePercentage: updateProgress,
          });

          SavePerPrincipalAPIData();
        },
        (tx, err) => {
          console.log('ADDED HERE10' + err);
        },
      );
    });
  }
  function SavePerPrincipalAPIData() {
    var currIndex = 0;
    var perprincipalpermonthString = '';
    var runningIndexCount = 0;
    // done concat
    {
      PerPrincipalLocalData.map(function (item, index) {
        currIndex = currIndex + 1;

        runningIndexCount = runningIndexCount + 1;
        if (runningIndexCount < 501) {
          perprincipalpermonthString =
            perprincipalpermonthString +
            "('" +
            item.business_year +
            "'" +
            ',' +
            "'" +
            item.business_month +
            "'" +
            ',' +
            "'" +
            item.invoice_date +
            "'" +
            ',' +
            "'" +
            item.principal_name +
            "'" +
            ',' +
            "'" +
            item.principal_acronym +
            "'" +
            ',' +
            "'" +
            item.team +
            "'" +
            ',' +
            "'" +
            item.sales +
            "'" +
            ',' +
            "'" +
            item.target +
            "'" +
            ',' +
            "'" +
            item.uba +
            "'" +
            ',' +
            "'" +
            item.dateTimeUpdated +
            "'" +
            '),';

          if (runningIndexCount === 500) {
            var stringnow = perprincipalpermonthString;
            perprincipalpermonthString = '';
            runningIndexCount = 0;

            dbperprincipal.transaction(function (tx) {
              // done concat
              tx.executeSql(
                'INSERT INTO perprincipalpermonth_tbl (business_year, business_month, invoice_date,principal_name, principal_acronym, team, sales, target, uba, dateTimeUpdated) VALUES   ' +
                  stringnow.slice(0, -1),
                [],
                (tx, results) => {
                  //  console.log('SAVED 500X500 SavePerPrincipalAPIData');
                },
                SQLerror,
              );
            });
          }

          if (
            runningIndexCount < 500 &&
            currIndex === PerPrincipalLocalData.length
          ) {
            var stringnow = perprincipalpermonthString;
            perprincipalpermonthString = '';

            dbperprincipal.transaction(function (tx) {
              // done concat
              tx.executeSql(
                'INSERT INTO perprincipalpermonth_tbl (business_year, business_month, invoice_date,principal_name, principal_acronym, team, sales, target, uba, dateTimeUpdated) VALUES   ' +
                  stringnow.slice(0, -1),
                [],
                (tx, results) => {
                  // console.log(
                  //   'SAVED 500X500  SavePerPrincipalAPIData < 500 ' +
                  //     runningIndexCount,
                  // );
                  runningIndexCount = 0;
                },
                SQLerror,
              );
            });
          }
        }

        if (currIndex === PerPrincipalLocalData.length) {
          // console.log(
          //   '5.1 ' + ' SavePerPrincipalAPIData done concatenating, saved..',
          // );
          updateProgress = Number(updateProgress) + Number(7);
          setglobalState({
            ...globalState,
            updatePercentage: updateProgress,
          });

          setq2Perymtsat(true);
          //  console.log('6.1 ' + 'DONE SAVING SavePerPrincipalAPIData ');
        }
      });
    }
  }

  //added quote for zou1

  //PER AREA
  const GetPerAreaAPIData = () => {
    var teams = global.TeamAccessListForAPI;
    var sales_position_name = global.sales_position_name;
    var principal_id = global.PrincipalAccessList;

    // var tempstr2 = teams + '&' + sales_position_name;

    var tempstr2 =
      'team=' +
      teams +
      '&' +
      'sales_position_name=' +
      sales_position_name +
      '&' +
      'principal_id=' +
      principal_id;
    //10

    // console.log(
    //   server.server_address +
    //     globalCompany.company +
    //     'perareasalesuba?' +
    //     tempstr2,
    // );
    Promise.race([
      fetch(
        server.server_address +
          globalCompany.company +
          'perareasalesuba?' +
          tempstr2,
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
        setTimeout(() => reject(new Error('Timeout')), 80000),
      ),
    ])
      .then((responseData) => {
        return responseData.json();
      })
      .then((jsonData) => {
        console.log('FETCH 10 DONE');
        if (jsonData.length > 0) {
          PerAreaAPIdatalength = jsonData.length;
          setPerAreaLocalData(jsonData);
          updateProgress = Number(updateProgress) + Number(2);
          setglobalState({
            ...globalState,
            updatePercentage: updateProgress,
          });
        } else {
          // console.log('Please check code, no perarea found');
          if (globalStatus.updateMode === 'manual') {
            Alert.alert(
              'Error',
              'Application Error,  No data found \n err1001 \n \n Please Contact Support Team.',
              [
                {
                  text: 'OK',
                },
              ],
              {cancelable: true},
            );

            setisModalConnectionError(false);
            setisLoadingActivityIndicator(false);
            props.navigation.navigate('Home');
          }
        }
      })
      .catch(function (error) {
        console.log('error in GetPerAreaAPIData :' + error.message);
        onErrortimeout();
      })
      .done();
  };

  function DeletePerAreaAPIData() {
    dbperarea.transaction(function (tx) {
      tx.executeSql(
        'Delete from perareapermonth_tbl ',
        [],
        (tx, results) => {
          //   console.log('4.1' + ' deleted local perareapermonth_tbl');
          SavePerAreaAPIData();
        },
        (tx, err) => {
          // console.log('ADDED HERE12' + err);
        },
      );
    });
  }
  function SavePerAreaAPIData() {
    var currIndex = 0;
    var perareapermonthString = '';
    var runningIndexCount = 0;
    // const LengthPerAreaLocalData = PerAreaLocalData.length - 1;
    {
      PerAreaLocalData.map(function (item, index) {
        currIndex = currIndex + 1;
        runningIndexCount = runningIndexCount + 1;

        if (runningIndexCount < 501) {
          // console.log('saved on ' + currIndex + ' indexxxxxx');

          perareapermonthString =
            perareapermonthString +
            "('" +
            item.business_year +
            "'" +
            ',' +
            "'" +
            item.business_month +
            "'" +
            ',' +
            "'" +
            item.invoice_date +
            "'" +
            ',' +
            "'" +
            item.province +
            "'" +
            ',' +
            "'" +
            item.principal_name +
            "'" +
            ',' +
            "'" +
            item.team +
            "'" +
            ',' +
            "'" +
            item.sales +
            "'" +
            ',' +
            "'" +
            item.uba +
            "'" +
            ',' +
            "'" +
            item.dateTimeUpdated +
            "'" +
            '),';

          if (runningIndexCount === 500) {
            var stringnow = perareapermonthString;
            perareapermonthString = '';
            runningIndexCount = 0;
            dbperarea.transaction(function (tx) {
              // done concat
              tx.executeSql(
                'INSERT INTO perareapermonth_tbl (business_year, business_month, invoice_date,province, principal_name, team, sales, uba, dateTimeUpdated) VALUES ' +
                  stringnow.slice(0, -1),
                [],
                (tx, results) => {
                  console.log('SAVED 500X500 SavePerAreaAPIData');
                },
                SQLerror,
              );
            });
          }

          if (
            runningIndexCount < 500 &&
            currIndex === PerAreaLocalData.length
          ) {
            var stringnow = perareapermonthString;
            perareapermonthString = '';

            dbperarea.transaction(function (tx) {
              // done concat
              tx.executeSql(
                'INSERT INTO perareapermonth_tbl (business_year, business_month, invoice_date,province,  principal_name, team, sales, uba, dateTimeUpdated) VALUES ' +
                  stringnow.slice(0, -1),
                [],
                (tx, results) => {
                  // console.log(
                  //   'SAVED 500X500 SavePerAreaAPIData < 500 ' +
                  //     runningIndexCount,
                  // );
                  runningIndexCount = 0;
                },
                SQLerror,
              );
            });
          }
        }
      });

      if (currIndex === PerAreaLocalData.length) {
        // console.log('5.2 ' + 'SavePerAreaAPIData done concatenating, saved..');
        updateProgress = Number(updateProgress) + Number(6);
        setglobalState({
          ...globalState,
          updatePercentage: updateProgress,
        });

        //    console.log('7 ' + 'Query completed SavePerAreaAPIData');
        setq4Area(true);
      }
    }
  }

  //     dbperarea.transaction(function (tx) {
  //       tx.executeSql(
  //         'INSERT INTO perareapermonth_tbl (business_year, business_month, invoice_date,province,  sales, uba, dateTimeUpdated) VALUES ' +
  //           perareapermonthString.slice(0, -1),
  //         [],
  //         (tx, results) => {
  //           if (currIndex === PerAreaLocalData.length) {
  //             updateProgress = Number(updateProgress) + Number(6);
  //             setglobalState({
  //               ...globalState,
  //               updatePercentage: updateProgress,
  //             });

  //             console.log('7 ' + 'Query completed SavePerAreaAPIData');
  //             setq4Area(true);
  //           }
  //         },
  //         (tx, err) => {
  //           console.log('ADDED HERE13' + err);
  //         },
  //       );
  //     });
  //   }
  // }

  // const APISaveUpdate = () => {
  //   Promise.race([
  //     fetch(server.server_address + globalCompany.company + 'UserUpdateLog', {
  //       method: 'POST',
  //       headers: {
  //         Accept: 'application/json',
  //         'Content-Type': 'application/json',
  //         Authorization: 'Bearer ' + APIToken.access_token,
  //       },
  //       body: JSON.stringify({
  //         user_name: global.user_name,
  //         dateTimeUpdated: moment()
  //           .utcOffset('+08:00')
  //           .format('YYYY-MM-DD hh:mm:ss a'),
  //       }),
  //     }),
  //     new Promise((_, reject) =>
  //       setTimeout(() => reject(new Error('Timeout')), 80000),
  //     ),
  //   ])
  //     .then((responseData) => {
  //       return responseData.json();
  //     })
  //     .then((jsonData) => {
  //       updateProgress = Number(updateProgress) + Number(7);
  //       setglobalState({
  //         ...globalState,
  //         updatePercentage: updateProgress,
  //       });

  //       console.log('8 ' + 'user update log saved in API');
  //       setq3UserUpdateLog(true);
  //     })
  //     .catch(function (error) {
  //       console.log('error in APISaveUpdate :' + error.text);

  //       if (globalStatus.updateMode === 'manual') {
  //         Alert.alert(
  //           'Error',
  //           'Application Error,  No data found \n err1001 \n \n Please Contact Support Team.',
  //           [
  //             {
  //               text: 'OK',
  //             },
  //           ],
  //           {cancelable: true},
  //         );

  //         setisModalConnectionError(false);
  //         setisLoadingActivityIndicator(false);
  //         props.navigation.navigate('Home');
  //       }
  //     })
  //     .done();
  // };

  const GETUpdateVersionAPI = () => {
    InsertUpdateDataInfo();
    var user_name = global.user_name;
    var dateTimeUpdated = moment()
      .utcOffset('+08:00')
      .format('YYYY-MM-DD hh:mm:ss a');
    Promise.race([
      fetch(
        server.server_address +
          globalCompany.company +
          'updateversion2/' +
          user_name +
          '&' +
          dateTimeUpdated,
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
        setTimeout(() => reject(new Error('Timeout')), 80000),
      ),
    ])
      .then((responseData) => {
        return responseData.json();
      })
      .then((jsonData) => {
        console.log('FETCH 1 DONE');
        if (jsonData.length > 0) {
          jsonData.map((key, index) => {
            APIUpdateVersion.APIUpdateVersionField = key.version;
            APIUpdateVersion.APIUpdateVersionDateTimeRelease =
              key.dateTimeRelease;
            APIUpdateVersion.APIUpdateVersionStatus = key.status;
            APIUpdateVersion.APIUpdateVersionNotice = key.notice;
            APIUpdateVersion.APIForceLogout = key.auto_logout;
            APIUpdateVersion.APIUpdatingStatus = key.serverUpdateStatus;
          });

          if (APIUpdateVersion.APIForceLogout === 'TRUE') {
            setglobalAutoLogout('TRUE');
          } else {
            if (APIUpdateVersion.APIUpdateVersionStatus === 'ONLINE') {
              if (APIUpdateVersion.APIUpdatingStatus === 'Updating') {
                if (globalStatus.updateMode === 'manual') {
                  globalStatus.updateMode = 'auto';
                  updateProgress = 0;
                  setglobalState({
                    ...globalState,
                    updatePercentage: updateProgress,
                    updateStatus: 'Idle',
                  });

                  globalStatus.updateStatus = 'Idle';

                  RunTimer();

                  //1

                  setisModalConnectionError(false);
                  setisLoadingActivityIndicator(false);
                  props.navigation.navigate(CurrentAppScreen.Screen);
                  alert('Server is updating. please try again after a minute.');
                } else {
                  // console.log(APIUpdateVersion.APIUpdateVersionStatus);
                  updateProgress = 0;
                  setglobalState({
                    ...globalState,
                    updatePercentage: updateProgress,
                    updateStatus: 'Idle',
                  });

                  globalStatus.updateStatus = 'Idle';

                  RunTimer();
                  //2
                  console.log(
                    'Server is updating. please try again after a minute.',
                  );
                }
              } else {
                StartUpdate();
                updateProgress = Number(updateProgress) + Number(4);
                setglobalState({
                  ...globalState,
                  updatePercentage: updateProgress,
                });
                setq3UserUpdateLog(true);
              }
            } else if (APIUpdateVersion.APIUpdateVersionStatus === 'OFFLINE') {
              //2
              if (globalStatus.updateMode === 'manual') {
                globalStatus.updateMode = 'auto';
                updateProgress = 0;
                setglobalState({
                  ...globalState,
                  updatePercentage: updateProgress,
                  updateStatus: 'Idle',
                });

                globalStatus.updateStatus = 'Idle';

                RunTimer();

                //1

                setisModalConnectionError(false);
                setisLoadingActivityIndicator(false);
                props.navigation.navigate('Home');
                CheckSystemStatus(); //-1
              } else {
                // console.log(APIUpdateVersion.APIUpdateVersionStatus);
                updateProgress = 0;
                setglobalState({
                  ...globalState,
                  updatePercentage: updateProgress,
                  updateStatus: 'Idle',
                });

                globalStatus.updateStatus = 'Idle';

                RunTimer();
                //2
                CheckSystemStatus(); //-2
              }
            }
          }
        }
      })
      .catch(function (error) {
        console.log('error in GETUpdateVersionAPI :' + error.message);
        onErrortimeout();
      })
      .done();
  };

  function InsertUpdateDataInfo() {
    //11
    fetch(
      server.server_address + globalCompany.company + 'InsertUpdateDataInfo',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + APIToken.access_token,
        },
        body: JSON.stringify({
          user_name: global.user_name,
          device_name: global.device_name,
          device_id: global.device_id,
          dateTimeUpdated: moment().format('YYYY-MM-DD hh:mm:ss a'),
          appVersion: CurrentAppVersionUpdate.CurrentAppVersionUpdateField,
        }),
      },
    )
      .then((responseData) => {
        return responseData.json();
      })
      .then((jsonData) => {
        console.log('FETCH 11 DONE');
        if (jsonData.affectedRows > 0) {
          //  console.log('user update log saved');
        }
      })
      .catch(function (error) {
        console.log('error in   user update log :' + error);
      })
      .done();
  }

  const BusinessCalendarDownload = () => {
    var BusinessCalendarString = '';
    var CurrIndex = 0;
    //2
    Promise.race([
      fetch(server.server_address + 'business_calendar/get/', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + APIToken.access_token,
        },
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 80000),
      ),
    ])
      .then((responseData) => {
        return responseData.json();
      })
      .then((jsonData) => {
        console.log('FETCH 2 DONE');
        if (jsonData.length > 0) {
          jsonData.map((item, index) => {
            // if (index < 1) {
            //   BusinessCalendarField.update_version = item.update_version;
            // }
            CurrIndex = CurrIndex + 1;
            BusinessCalendarString =
              BusinessCalendarString +
              "('" +
              item.date +
              "'" +
              ',' +
              "'" +
              item.year +
              "'" +
              ',' +
              "'" +
              item.month +
              "'" +
              ',' +
              "'" +
              item.day +
              "'" +
              ',' +
              "'" +
              item.update_version +
              "'),";
          });

          if (CurrIndex === jsonData.length) {
            dbBusinessCalendar.transaction(function (tx) {
              // no need concat brake
              tx.executeSql(
                'Delete from business_calendar_tbl   ',
                [],
                (tx, results) => {
                  // if (results.rowsAffected > 0) {}
                  //  console.log('13 ' + 'deleted local business_calendar_tbl');
                  dbBusinessCalendar.transaction(function (tx) {
                    tx.executeSql(
                      'INSERT INTO business_calendar_tbl (date, year, month, day, update_version) VALUES ' +
                        BusinessCalendarString.slice(0, -1),
                      [],
                      (tx, results) => {},
                      (tx, err) => {
                        //     console.log('ADDED HERE14' + err);
                      },
                    );
                  });
                },
                (tx, err) => {
                  //  console.log('ADDED HERE15' + err);
                },
              );
            });
          }
        }
      })
      .catch(function (error) {
        console.log('error in BusinessCalendarDownload :' + error);
      })
      .done();
  };

  useEffect(() => {
    if (
      load_pc === 1 &&
      load_v === 1 &&
      load_n === 1 &&
      load_c === 1 &&
      load_scj === 1 &&
      MarcStatus === '0'
    ) {
      MarcStatus = '1';
      //   console.log('14 ' + 'concat run');
      concat_data_per_customer();
      concat_data_per_vendor();
      concat_data_net();
      concat_data_per_category();
      concat_data_scj_category();
    }

    if (
      load_pc === 2 &&
      load_v === 2 &&
      load_n === 2 &&
      load_c === 2 &&
      load_scj === 2 &&
      MarcStatus === '1'
    ) {
      MarcStatus = '2';
      //   console.log('15 ' + 'upload to local run');
      upload_data_per_customer();
      upload_data_per_vendor();
      upload_data_net();

      if (count_c_json === 0) {
        bypass_scj();
      } else {
        upload_data_per_category();
        upload_data_scj_category();
      }
    }

    if (
      load_pc === 3 &&
      load_v === 3 &&
      load_n === 3 &&
      load_c === 3 &&
      load_scj === 3 &&
      MarcStatus === '2'
    ) {
      MarcStatus = '3';
      prompt();
    }
  });

  // useFocusEffect(() => {
  //   if (focus_int === 0) {
  //     getcurrentDate();
  //     setfocus_int(1);
  //   } else if (focus_int === 1) {
  //     initiate();
  //     setfocus_int(2);
  //   }
  // });

  let bypass_scj = () => {
    setload_c(3);
    setload_scj(3);
  };

  let prompt = () => {
    setLoading(false);
    setmodalvisible(false);
    setload_pc(0);
    setload_n(0);
    setload_v(0);
    setload_c(0);
    setload_scj(0);
    MarcStatus = '0';
    setq5Marc(true);
    updateProgress = Number(updateProgress) + Number(10);
    setglobalState({
      ...globalState,
      updatePercentage: updateProgress,
    });
  };

  // let getcurrentDate = () => {
  //   if (Object.keys(prev_month.toString()).length === 1) {
  //     var get_date_from = year + '-0' + prev_month + '-' + '01';
  //   } else if (Object.keys(prev_month.toString()).length === 2) {
  //     var get_date_from = year + '-' + prev_month + '-' + '01';
  //   }

  //   if (Object.keys(cur_month.toString()).length === 1) {
  //     var get_date_to = year + '-0' + cur_month + '-' + '31';
  //   } else if (Object.keys(cur_month.toString()).length === 2) {
  //     var get_date_to = year + '-' + cur_month + '-' + '31';
  //   }
  //   setfixed_date_from(get_date_from);
  //   setfixed_date_to(get_date_to);
  // };

  let initiate = () => {
    console.log('initiate here');
    delete_net_tbl();
    delete_per_customer_tbl();
    delete_per_vendor_tbl();
    delete_per_category_tbl();
    delete_scj_category_tbl();

    fetch_net_data();
    fetch_per_customer_data();
    fetch_per_vendor_data();
    fetch_per_category_data();
    fetch_scj_category_data();

    setmodalvisible(true);
    setLoading(true);
    setloadname('Downloading');
    setfocus_int(2);
  };

  let delete_per_customer_tbl = () => {
    dbSalesmanNet.transaction(function (tx) {
      tx.executeSql(
        'DELETE FROM tbl_sales_per_customer ',
        [],
        (tx, results) => {},
      );
    });
  };

  let delete_net_tbl = () => {
    dbSalesmanNet.transaction(function (tx) {
      tx.executeSql('DELETE FROM tbl_sales_net ', [], (tx, results) => {});
    });
  };

  let delete_per_vendor_tbl = () => {
    dbSalesmanNet.transaction(function (tx) {
      tx.executeSql(
        'DELETE FROM tbl_sales_per_vendor ',
        [],
        (tx, results) => {},
      );
    });
  };

  let delete_per_category_tbl = () => {
    dbSalesmanNet.transaction(function (tx) {
      tx.executeSql(
        'DELETE FROM tbl_sales_per_category ',
        [],
        (tx, results) => {},
      );
    });
  };

  let delete_scj_category_tbl = () => {
    dbSalesmanNet.transaction(function (tx) {
      tx.executeSql(
        'DELETE FROM tbl_scj_per_category ',
        [],
        (tx, results) => {},
      );
    });
  };

  let fetch_per_customer_data = () => {
    if (Object.keys(prev_month.toString()).length === 1) {
      var get_date_from = year + '-0' + prev_month + '-' + '01';
    } else if (Object.keys(prev_month.toString()).length === 2) {
      var get_date_from = year + '-' + prev_month + '-' + '01';
    }

    if (Object.keys(cur_month.toString()).length === 1) {
      var get_date_to = year + '-0' + cur_month + '-' + '31';
    } else if (Object.keys(cur_month.toString()).length === 2) {
      var get_date_to = year + '-' + cur_month + '-' + '31';
    }

    var sales_position_name = global.sales_position_name;

    var tempstr1 =
      'sales_position_name=' +
      sales_position_name +
      '&' +
      'date_from=' +
      get_date_from +
      '&' +
      'date_to=' +
      get_date_to;
    //3

    console.log(
      server.server_address + 'sales_tbl/salesmanfilterddaterange?' + tempstr1,
    );

    Promise.race([
      fetch(
        server.server_address +
          'sales_tbl/salesmanfilterddaterange?' +
          tempstr1,
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
        setTimeout(() => reject(new Error('Timeout')), 80000),
      ),
    ])
      .then((responseData) => {
        return responseData.json();
      })
      .then((jsonData) => {
        console.log('FETCH 3 DONE');
        setcustomer_data(jsonData);

        setLoading(true);
        setload_pc(1);

        setloadname('Downloading ' + 'Customers');
        //  console.log('17 ' + 'fetching fetch_per_customer_data DONE');
      })
      .catch(function (error) {
        console.log('1Customer: ' + error);
        onErrortimeout();
      })
      .done();
  };

  //done
  let fetch_net_data = () => {
    var sales_position_name = global.sales_position_name;

    var tempstr1 = 'sales_position_name=' + sales_position_name;

    //   console.log('18 ' + 'fetching fetch_net_data');
    //4
    Promise.race([
      fetch(
        server.server_address + 'sales_net_tbl/salesmanfilter?' + tempstr1,
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
        setTimeout(() => reject(new Error('Timeout')), 80000),
      ),
    ])
      .then((responseData) => {
        return responseData.json();
      })
      .then((jsonData) => {
        console.log('FETCH 4 DONE');
        setnet_data(jsonData);

        setLoading(true);
        setload_n(1);

        setloadname('Downloading ' + 'Net Sales');

        //  console.log('19 ' + 'fetching fetch_net_data DONE');
      })
      .catch(function (error) {
        console.log('Net: ' + error);
        onErrortimeout();
      })
      .done();
  };

  //done
  let fetch_per_vendor_data = () => {
    var teams = global.TeamAccessListForAPI;
    var sales_position_name = global.sales_position_name;
    var tempstr1 =
      'team=' +
      teams +
      '&' +
      'sales_position_name=' +
      sales_position_name +
      '&' +
      'principal_id=' +
      global.PrincipalAccessList;
    //5
    Promise.race([
      fetch(server.server_address + 'perprincipalsalestargetuba?' + tempstr1, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + APIToken.access_token,
        },
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 80000),
      ),
    ])
      .then((responseData) => {
        return responseData.json();
      })
      .then((jsonData) => {
        console.log('FETCH 5 DONE');
        setvendor_data(jsonData);
        setLoading(true);
        setload_v(1);

        setloadname('Downloading ' + 'Vendors');

        //  console.log('20 ' + 'fetching fetch_per_vendor_data DONE');
      })
      .catch(function (error) {
        console.log('Vendor1' + error);
        onErrortimeout();
      })
      .done();
  };

  //done
  let fetch_per_category_data = () => {
    // console.log('103 start');
    var sales_position_name = global.sales_position_name;
    var tempstr1 = 'sales_position_name=' + sales_position_name;

    //console.log('21 ' + 'fetching fetch_per_category_data start');
    //6
    Promise.race([
      fetch(
        server.server_address + 'sales_category_tbl/salesmanfilter?' + tempstr1,
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
        setTimeout(() => reject(new Error('Timeout')), 80000),
      ),
    ])
      .then((responseData) => {
        return responseData.json();
      })
      .then((jsonData) => {
        console.log('FETCH 6 DONE');
        setcategory_data(jsonData);
        //  console.log('103 success');
        console.log('21 ' + 'fetching fetch_per_category_data success');
        setcount_c_json(Object.keys(jsonData).length);

        setLoading(true);
        setload_c(1);

        setloadname('Downloading ' + 'Categories');
        // console.log('22 ' + 'fetching fetch_per_category_data DONE');
      })
      .catch(function (error) {
        console.log('category' + error);
        onErrortimeout();
      })
      .done();
  };

  //done
  let fetch_scj_category_data = () => {
    // console.log('104 start');
    var sales_position_name = global.sales_position_name;
    var tempstr1 = 'sales_position_name=' + sales_position_name;

    //console.log('22 ' + 'fetching fetch_scj_category_data start');
    //6
    Promise.race([
      fetch(
        server.server_address + 'scj_category_tbl/salesmanfilter?' + tempstr1,
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
        setTimeout(() => reject(new Error('Timeout')), 80000),
      ),
    ])
      .then((responseData) => {
        return responseData.json();
      })
      .then((jsonData) => {
        console.log('FETCH 6 DONE');
        setscjcategory_data(jsonData);
        //  console.log('103 success');
        console.log('21.1 ' + 'fetching fetch_per_category_data success');
        //setcount_c_json(Object.keys(jsonData).length);

        setLoading(true);
        setload_scj(1);

        setloadname('Downloading ' + 'SCJ Categories');
        // console.log('22.1 ' + 'fetching fetch_scj_category_data DONE');
      })
      .catch(function (error) {
        console.log('SCJ category' + error);
        onErrortimeout();
      })
      .done();
  };

  let concat_data_per_customer = () => {
    var combine_data_per_customer = '';
    var mapdata = customer_data.map((item, index) => {
      combine_data_per_customer =
        combine_data_per_customer +
        "('" +
        item.invoice_date +
        "','" +
        item.account_customer_name +
        "','" +
        item.invoice_no +
        "','" +
        item.principal_name +
        "','" +
        item.sales +
        "','" +
        item.invoice_status_final +
        "'),";
    }, []);

    combine_data_per_customer = combine_data_per_customer.slice(0, -1);
    // console.log(combine_data_per_customer);
    setc_customer_data(combine_data_per_customer);
    setload_pc(2);
  };

  let concat_data_per_vendor = () => {
    var combine_data_per_vendor = '';
    var mapdata = vendor_data.map((item, index) => {
      combine_data_per_vendor =
        combine_data_per_vendor +
        "('" +
        item.business_year +
        "','" +
        item.business_month +
        "','" +
        item.invoice_date +
        "','" +
        item.team +
        "','" +
        item.salesman_name +
        "','" +
        item.sales_position_name +
        "','" +
        item.principal_name +
        "','" +
        item.principal_acronym +
        "','" +
        item.sales +
        "','" +
        item.target +
        "','" +
        item.uba +
        "','" +
        item.dateTimeUpdated +
        "'),";
    }, []);

    combine_data_per_vendor = combine_data_per_vendor.slice(0, -1);
    //console.log(combine_data_per_customer);
    setc_vendor_data(combine_data_per_vendor);
    setload_v(2);
  };

  let concat_data_net = () => {
    var combine_data_net = '';
    var mapdata = net_data.map((item, index) => {
      combine_data_net =
        combine_data_net +
        "('" +
        item.business_year +
        "','" +
        item.business_month +
        "','" +
        item.invoice_date +
        "','" +
        item.team +
        "','" +
        item.sales_position_name +
        "','" +
        item.salesman_name +
        "','" +
        item.total_gross_amount +
        "','" +
        item.total_net_amount +
        "','" +
        item.total_discount +
        "','" +
        item.total_cm +
        "','" +
        item.total_target +
        "','" +
        item.dateTimeUpdated +
        "'),";
    }, []);

    combine_data_net = combine_data_net.slice(0, -1);
    //console.log(combine_data_per_customer);
    setc_net_data(combine_data_net);
    setload_n(2);
  };

  let concat_data_per_category = () => {
    var combine_data_per_category = '';
    var mapdata = category_data.map((item, index) => {
      combine_data_per_category =
        combine_data_per_category +
        "('" +
        item.business_year +
        "','" +
        item.business_month +
        "','" +
        item.invoice_date +
        "','" +
        item.team +
        "','" +
        item.sales_position_name +
        "','" +
        item.salesman_name +
        "','" +
        item.product_category +
        "','" +
        item.sales +
        "','" +
        item.target +
        "','" +
        item.dateTimeUpdated +
        "'),";
    }, []);

    combine_data_per_category = combine_data_per_category.slice(0, -1);
    //console.log(combine_data_per_customer);
    setc_category_data(combine_data_per_category);
    setload_c(2);
  };

  let concat_data_scj_category = () => {
    var combine_data_scj_category = '';
    var mapdata = scjcategory_data.map((item, index) => {
      combine_data_scj_category =
        combine_data_scj_category +
        "('" +
        item.business_year +
        "','" +
        item.business_month +
        "','" +
        item.team +
        "','" +
        item.sales_position_name +
        "','" +
        item.salesman_name +
        "','" +
        item.invoice_date +
        "','" +
        item.account_customer_name +
        "','" +
        item.product_category +
        "','" +
        item.sales +
        "','" +
        item.dateTimeUpdated +
        "'),";
    }, []);

    combine_data_scj_category = combine_data_scj_category.slice(0, -1);
    //console.log(combine_data_scj_customer);
    setscj_category_data(combine_data_scj_category);
    setload_scj(2);
  };

  let upload_data_per_customer = () => {
    dbSalesmanNet.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO tbl_sales_per_customer (invoice_date, account_customer_name, invoice_no, principal_name, sales, invoice_status_final) VALUES ' +
          c_customer_data,
        [],
        (tx, results) => {
          // console.log('Results', results.rowsAffected);
          setmodalvisible(true);
          //setload_pc(i++);
          setload_pc(3);
          //  console.log('23.0' + ' upload upload_data_per_customer');
        },
      );
    });
  };

  let upload_data_net = () => {
    dbSalesmanNet.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO tbl_sales_net (business_year, business_month, invoice_date, team, sales_position_name, salesman_name, total_gross_amount, total_net_amount, total_discount, total_cm, total_target, dateTimeUpdated) VALUES ' +
          c_net_data,
        [],
        (tx, results) => {
          // console.log('Results', results.rowsAffected);
          setmodalvisible(true);
          setload_n(3);
          // setload_n(i++);
          //  console.log('23 ' + 'DONE upload_data_net');
        },
      );
    });
  };

  let upload_data_per_vendor = () => {
    //console.log('24 ' + 'initial upload_data_per_vendor');
    // console.log(c_vendor_data);
    dbSalesmanNet.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO tbl_sales_per_vendor (business_year, business_month, invoice_date, team, salesman_name, sales_position_name, principal_name, principal_acronym, sales, target, uba, dateTimeUpdated) VALUES ' +
          c_vendor_data,
        [],
        (tx, results) => {
          // console.log('Results', results.rowsAffected);
          setmodalvisible(true);
          // setload_v(i++);
          setload_v(3);
          //  console.log('25 ' + 'DONE upload_data_per_vendor');
        },
        (tx, err) => {
          console.log('ADDED HERE1' + err);
        },
      );
    });
  };

  let upload_data_per_category = () => {
    // console.log(
    //   'INSERT INTO tbl_sales_per_category (business_year, business_month, invoice_date, team, sales_position_name, salesman_name, product_category, sales, target, dateTimeUpdated) VALUES ' +
    //     c_category_data,
    // );
    dbSalesmanNet.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO tbl_sales_per_category (business_year, business_month, invoice_date, team, sales_position_name, salesman_name, product_category, sales, target, dateTimeUpdated) VALUES ' +
          c_category_data,
        [],
        (tx, results) => {
          // console.log('Results', results.rowsAffected);
          setmodalvisible(true);
          // setload_v(i++);
          setload_c(3);
          //   console.log('26 ' + 'DONE upload_data_per_category');
        },
        (tx, err) => {
          console.log('ADDED HERE2' + err);
        },
      );
    });
  };

  let upload_data_scj_category = () => {
    // console.log(
    //   'INSERT INTO tbl_scj_per_category (business_year, business_month, team, sales_position_name, salesman_name, invoice_date, account_customer_name, product_category, sales, dateTimeUpdated) VALUES ' +
    //     scj_category_data,
    // );
    dbSalesmanNet.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO tbl_scj_per_category (business_year, business_month, team, sales_position_name, salesman_name, invoice_date, account_customer_name, product_category, sales, dateTimeUpdated) VALUES ' +
          scj_category_data,
        [],
        (tx, results) => {
          // console.log('Results', results.rowsAffected);
          setmodalvisible(true);
          // setload_v(i++);
          setload_scj(3);
          //   console.log('26 ' + 'DONE upload_data_scj_category');
        },
        (tx, err) => {
          console.log('ADDED HERE2.1' + err);
        },
      );
    });
  };

  // PROMO ITEMS  > START

  const ApiFields = [
    {
      principal_name: '',
      product_id: '',
      product_variant: '',
      product_name: '',
      promo_product: '',
      inventory: '',
      img_url: '',
      total_case: 0,
      total_pieces: 0,
      effective_price_date: '',
      CASE_COMPANY: 0,
      CASE_BOOKING: 0,
      CASE_EXTRUCK: 0,
      PCS_COMPANY: 0,
      PCS_BOOKING: 0,
      PCS_EXTRUCK: 0,
      DateandTimeUpdated: '',
    },
  ];

  const [ApiPromoItemData, setApiPromoItemData] = useState(ApiFields);
  const [ItemsDeleted, setItemsDeleted] = useState(false);

  const DownloadPromoItems = () => {
    var principal_id = global.PrincipalAccessList;

    var tempstr = 'principal_id=' + principal_id;
    //7
    Promise.race([
      fetch(
        server.server_address + globalCompany.company + 'promo_item?' + tempstr,
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
        setTimeout(() => reject(new Error('Timeout')), 80000),
      ),
    ])
      .then((responseData) => {
        return responseData.json();
      })
      .then((jsonData) => {
        console.log('FETCH 7 DONE');
        if (jsonData.length > 0) {
          setApiPromoItemData(jsonData);
          ApiRowsCount = jsonData.length;
        } else {
          // NO ITEM, SET TRU TO END UPDATE
          setq6Inventory(true);
        }
        //console.log('AD');
      })
      .catch(function (error) {
        console.log('Error 1:' + error.message);
      })
      .done();
  };

  useEffect(() => {
    if (ApiPromoItemData.length === ApiRowsCount) {
      // console.log('PROMO RUN');
      DeleteItems();
    }
  });

  function DeleteItems() {
    ApiRowsCount = 0;
    dbinventory.transaction(function (tx) {
      tx.executeSql(
        'Delete from promo_items_tbl ',
        [],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            setItemsDeleted(true);
          } else {
            // console.log('nothing to delete, set true to save fetch sku');
            setItemsDeleted(true);
          }
        },
        (tx, err) => {
          // console.log('ADDED HERE3' + err);
        },
      );
    });
  }

  useEffect(() => {
    if (ItemsDeleted === true) {
      [SavePromoItems(), setItemsDeleted(false)];
    }
  });

  function SavePromoItems() {
    longStrinfg = '';
    var stocks = 0;
    var ProductType = '';
    var currIndex = 0;
    var runningIndexCount = 0;

    //basis
    {
      ApiPromoItemData.map(function (item, index) {
        currIndex = currIndex + 1;
        runningIndexCount = runningIndexCount + 1;

        if (runningIndexCount < 501) {
          if (item.promo_product === '1') {
            ProductType = 'Promo';
          } else {
            ProductType = 'Regular';
          }

          if (parseInt(item.total_case) < 1) {
            stocks = item.total_pieces + ' PCS';
          } else {
            stocks = (item.total_case * 1).toFixed(2) + ' CS';
          }

          longStrinfg =
            longStrinfg +
            "('" +
            item.principal_name +
            "'" +
            ',' +
            "'" +
            item.product_id +
            "'" +
            ',' +
            "'" +
            item.product_category +
            "'" +
            ',' +
            "'" +
            item.product_brand +
            "'" +
            ',' +
            "'" +
            item.product_variant +
            "'" +
            ',' +
            "'" +
            item.product_name +
            "'" +
            ',' +
            "'" +
            ProductType +
            "'" +
            ',' +
            "'" +
            stocks +
            "'" +
            ',' +
            "'" +
            item.img_url +
            "'" +
            ',' +
            "'" +
            item.DateandTimeUpdated +
            "'" +
            ',' +
            "'" +
            item.total_case +
            "'" +
            ',' +
            "'" +
            item.total_pieces +
            "'" +
            ',' +
            "'" +
            item.effective_price_date +
            "'" +
            ',' +
            "'" +
            item.CASE_UNIT_PER_PCS +
            "'" +
            ',' +
            "'" +
            item.CASE_COMPANY +
            "'" +
            ',' +
            "'" +
            item.CASE_BOOKING +
            "'" +
            ',' +
            "'" +
            item.CASE_EXTRUCK +
            "'" +
            ',' +
            "'" +
            item.PCS_COMPANY +
            "'" +
            ',' +
            "'" +
            item.PCS_BOOKING +
            "'" +
            ',' +
            "'" +
            item.PCS_EXTRUCK +
            "'" +
            '),';

          if (runningIndexCount === 500) {
            var stringnow = longStrinfg;
            longStrinfg = '';
            runningIndexCount = 0;
            dbinventory.transaction(function (tx) {
              // done concat
              tx.executeSql(
                ' INSERT INTO promo_items_tbl (principal_name, product_id, product_category,product_brand,product_variant, product_name, promo_product, inventory, img_url, DateandTimeUpdated, total_case, total_pieces, effective_price_date,CASE_UNIT_PER_PCS, CASE_COMPANY, CASE_BOOKING, CASE_EXTRUCK, PCS_COMPANY, PCS_BOOKING, PCS_EXTRUCK) values ' +
                  stringnow.slice(0, -1),
                [],
                (tx, results) => {
                  //    console.log('SAVED 500X500 SavePromoItems');
                },
                SQLerror,
              );
            });
          }

          if (
            runningIndexCount < 500 &&
            currIndex === ApiPromoItemData.length
          ) {
            var stringnow = longStrinfg;
            longStrinfg = '';

            dbinventory.transaction(function (tx) {
              // done concat
              tx.executeSql(
                ' INSERT INTO promo_items_tbl (principal_name, product_id, product_category,product_brand,product_variant, product_name, promo_product, inventory, img_url, DateandTimeUpdated, total_case, total_pieces, effective_price_date,CASE_UNIT_PER_PCS, CASE_COMPANY, CASE_BOOKING, CASE_EXTRUCK, PCS_COMPANY, PCS_BOOKING, PCS_EXTRUCK) values ' +
                  stringnow.slice(0, -1),
                [],
                (tx, results) => {
                  // console.log(
                  //   'SAVED 500X500 SavePromoItems < 500 ' + runningIndexCount,
                  // );
                  runningIndexCount = 0;
                },
                SQLerror,
              );
            });
          }
        }
      });

      if (currIndex === ApiPromoItemData.length) {
        //  console.log('5.5 ' + 'SavePromoItems done concatenating, saved..');
        setq6Inventory(true);
      }
    }
  }

  //   {
  //     ApiPromoItemData.map(function (item, i) {
  //       totalProduct = totalProduct + 1;
  //       if (item.promo_product === '1') {
  //         ProductType = 'Promo';
  //       } else {
  //         ProductType = 'Regular';
  //       }

  //       if (parseInt(item.total_case) < 1) {
  //         stocks = item.total_pieces + ' PCS';
  //       } else {
  //         stocks = (item.total_case * 1).toFixed(2) + ' CS';
  //       }

  //       longStrinfg =
  //         longStrinfg +
  //         "('" +
  //         item.principal_name +
  //         "'" +
  //         ',' +
  //         "'" +
  //         item.product_id +
  //         "'" +
  //         ',' +
  //         "'" +
  //         item.product_variant +
  //         "'" +
  //         ',' +
  //         "'" +
  //         item.product_name +
  //         "'" +
  //         ',' +
  //         "'" +
  //         ProductType +
  //         "'" +
  //         ',' +
  //         "'" +
  //         stocks +
  //         "'" +
  //         ',' +
  //         "'" +
  //         item.img_url +
  //         "'" +
  //         ',' +
  //         "'" +
  //         item.DateandTimeUpdated +
  //         "'" +
  //         '),';
  //     });
  //   }

  //   if (totalProduct === ApiPromoItemData.length) {
  //     dbinventory.transaction(function (tx) {
  //       tx.executeSql(
  //         ' INSERT INTO promo_items_tbl (principal_name, product_id, product_variant, product_name, promo_product, inventory, img_url, DateandTimeUpdated) values ' +
  //           longStrinfg.slice(0, -1),
  //         [],
  //         (tx, results) => {
  //           if (results.rowsAffected > 0) {
  //             console.log('SUCCESS SAVING ITEMS');
  //           } else {
  //             console.log('error');
  //           }
  //         },
  //         (tx, err) => {
  //           console.log('ADDED HERE5' + err);
  //         },
  //       );
  //     });
  //   }
  // }

  // PROMO ITEMS  > END

  return (
    <View style={{flex: 1}}>
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={isModalConnectionError}
          onRequestClose={() => {
            globalStatus.updateMode = 'auto';
            RunTimer();
            //3
            setisModalConnectionError(false);
            setisLoadingActivityIndicator(false);

            props.navigation.navigate('Home');
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Please make sure you are connected to the internet.
              </Text>

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
                  globalStatus.updateMode = 'auto';
                  RunTimer();
                  //4
                  setisModalConnectionError(false);
                  setisLoadingActivityIndicator(false);
                  props.navigation.navigate('Home');
                }}
                gradientFrom="red"
                gradientTo="pink"
              />
            </View>
          </View>
        </Modal>
      </View>

      {isLoadingActivityIndicator && (
        <View style={[styles.loading, {backgroundColor: '#2C302E'}]}>
          {/* <Button
            title="Test"
            onPress={() => {
              console.log(q1Principal + ' q1Principal');
              console.log(q2Perymtsat + ' q2Perymtsat');
              console.log(q4Area + ' q4Area');
              console.log(q3UserUpdateLog + ' q3UserUpdateLog');
              console.log(q5Marc + ' q5Marc');
              console.log(q6Inventory + ' Inventory');
              console.log(globalStatus.updateStatus);
            }}
          /> */}
          <Text style={{color: 'white', fontSize: moderateScale(17)}}>
            Updating... {updateProgress} %{' '}
          </Text>
          <ActivityIndicator size="large" color="green" />
        </View>
      )}
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
    borderTopWidth: 1,
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
  loading: {
    flex: 1,
    height: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignContent: 'center',
  },
});
