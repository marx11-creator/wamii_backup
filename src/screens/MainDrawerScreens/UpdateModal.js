/* eslint-disable no-lone-blocks */
import React, {useState, useEffect} from 'react';
import {
  Button,
  Text,
  View,
  RefreshControl,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import FlatButton from '../../sharedComponents/custombutton';
import {dbperymtsat} from '../../database/sqliteSetup';
import {dbperprincipal, dbperarea, dbBusinessCalendar} from '../../database/sqliteSetup';
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
  UpdateYearMonthsFilter,
  CurrentAppScreen,
  server,
} from '../../sharedComponents/globalCommands/globalCommands';
import {APIUpdateVersion} from '../../sharedComponents/globalCommands/globalCommands';

var lineChartAPIdatalength = 0;

var PerPrincipalAPIdatalength = 0;
var PerAreaAPIdatalength = 0;
var updateProgress = 0;
export default function UpdateModal(props) {
  //QUERY CHECKER
  const [q1Principal, setq1Principal] = useState(false);
  const [q2Perymtsat, setq2Perymtsat] = useState(false);
  const [q4Area, setq4Area] = useState(false);
  const [q3UserUpdateLog, setq3UserUpdateLog] = useState(false);

  const [isModalConnectionError, setisModalConnectionError] = useState(false);
  const [isLoadingActivityIndicator, setisLoadingActivityIndicator] = useState(
    false,
  );

  const lineChartLocalDataField = [
    {
      business_year: '',
      business_month: '',
      invoice_date: '',
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
      sales: '',
      uba: '',
    },
  ];
  const [PerAreaLocalData, setPerAreaLocalData] = useState(
    PerAreaLocalDataField,
  );

  useEffect(() => {
    if (
      q1Principal &&
      q2Perymtsat &&
      q4Area &&
      q3UserUpdateLog &&
      CurrentAppScreen.Screen === 'UPDATEMDL'
    ) {
      console.log('q1 and q2 and q3 and q4 is now true');
      setisModalConnectionError(false);
      setisLoadingActivityIndicator(false);
      props.navigation.navigate('Home');
      props.navigation.openDrawer();
    }
  }, [q1Principal]);

  useEffect(() => {
    if (
      q1Principal &&
      q2Perymtsat &&
      q4Area &&
      q3UserUpdateLog &&
      CurrentAppScreen.Screen === 'UPDATEMDL'
    ) {
      CurrentAppScreen.Screen === 'HOME';
      console.log('q2 and q2 and q3 and q4 is now true');
      setisModalConnectionError(false);
      setisLoadingActivityIndicator(false);
      props.navigation.navigate('Home');
      props.navigation.openDrawer();
    }
  }, [q2Perymtsat]);

  useEffect(() => {
    if (
      q1Principal &&
      q2Perymtsat &&
      q4Area &&
      q3UserUpdateLog &&
      CurrentAppScreen.Screen === 'UPDATEMDL'
    ) {
      CurrentAppScreen.Screen === 'HOME';
      console.log('q2 and q2 and q3 and q4  is now true');
      setisModalConnectionError(false);
      setisLoadingActivityIndicator(false);
      props.navigation.navigate('Home');
      props.navigation.openDrawer();
    }
  }, [q4Area]);

  //====================================================================> RUN UPDATE

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      if (CurrentAppScreen.Screen === 'UPDATEMDL') {
        updateProgress = 0;
        console.log('focus on update');
        setisLoadingActivityIndicator(true); //ENABLEE ActivityIndicator
        GETUpdateVersionAPI(); // GET UPDATED VERSION TO CHECK
      }
    });
  }, []);

  useEffect(() => {
    if (lineChartLocalData.length === lineChartAPIdatalength) {
      updateProgress = Number(updateProgress) + Number(8);
      lineChartAPIdatalength = 0;
      DeletePerymtsatAPIData();
      console.log(
        lineChartLocalData.length + 'effect delete line chart initialize',
      );
    }
  }, [lineChartLocalData]);

  //PER PRINCIPAL
  useEffect(() => {
    if (PerPrincipalLocalData.length === PerPrincipalAPIdatalength) {
      updateProgress = Number(updateProgress) + Number(10);
      PerPrincipalAPIdatalength = 0;
      DeletePerPrincipalAPIData();
    }
  }, [PerPrincipalLocalData]);

  //PER AREA
  useEffect(() => {
    if (PerAreaLocalData.length === PerAreaAPIdatalength) {
      updateProgress = Number(updateProgress) + Number(3);
      PerAreaAPIdatalength = 0;
      DeletePerAreaAPIData();
      console.log(
        PerAreaLocalData.length + 'effect delete  perarea initialize',
      );
    }
  }, [PerAreaLocalData]);

  function SQLerror(err) {
    console.log('SQL Error: ' + err);
  }

  function StartUpdate() {
    setq1Principal(false); //update status of function to false
    setq2Perymtsat(false); //update status of function to false
    setq4Area(false); //update status of function to false
    setq3UserUpdateLog(false); //update status of function to false

    BusinessCalendarDownload();
    GetPerymtsatAPIData(); //GET API DATA
    GetPerPrincipalAPIData(); //GET API DATA
    GetPerAreaAPIData(); //GET API DATA
    //APISaveUpdate(); //SAVE UPDATE LOG TO API
  }

  const GetPerymtsatAPIData = () => {
    updateProgress = Number(updateProgress) + Number(9);
    var teams = global.TeamAccessListForAPI;
    var sales_position_name = global.sales_position_name;
    var tempstr1 = teams + '&' + sales_position_name;
    //  console.log(tempstr1);
    Promise.race([
      fetch(
        'https://boiling-atoll-20376.herokuapp.com/persalesmansalestarget/' +
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
        setTimeout(() => reject(new Error('Timeout')), 40000),
      ),
    ])
      .then((responseData) => {
        return responseData.json();
      })
      .then((jsonData) => {
        if (jsonData.length > 0) {
          lineChartAPIdatalength = jsonData.length;
          setlineChartLocalData(jsonData);
          updateProgress = Number(updateProgress) + Number(8);
        } else {
          console.log('Please check code, no lineChartAPIData found');

          CurrentAppScreen.Screen === 'HOME';

          Alert.alert(
            'Error',
            'Application Error,  No data found \n err1002 \n \n Please Contact Support Team.',
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
      })
      .catch(function (error) {
        console.log('error in GetperymtsatAPIData123 :' + error.message);

        setisModalConnectionError(true);
        setisLoadingActivityIndicator(false); //DISABLE ActivityIndicator
      })
      .done();
  };

  function DeletePerymtsatAPIData() {
    updateProgress = Number(updateProgress) + Number(10);
    dbperymtsat.transaction(function (tx) {
      tx.executeSql(
        'Delete from perymtsat_tbl ',
        [],
        (tx, results) => {
          updateProgress = Number(updateProgress) + Number(10);
          console.log('deleted local perymtsat');
          SavePerymtsatAPIData();
        },
        SQLerror,
      );
    });
  }

  function SavePerymtsatAPIData() {
    var perymtsatString = '';
    var currIndex = 0;
    //const LengthlineChartLocalData = lineChartLocalData.length - 1;
    {
      lineChartLocalData.map(function (item, index) {
        currIndex = currIndex + 1;
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
      });

      if (currIndex === lineChartLocalData.length) {
        ///console.log(perymtsatString);
   
        console.log('SavePerymtsatAPIData done concatenating, saving...');
        updateProgress = Number(updateProgress) + Number(10);

        dbperymtsat.transaction(function (tx) {
          tx.executeSql(
            'INSERT INTO perymtsat_tbl (business_year, business_month,invoice_date,team,salesman_name, position_name, amount,target,datetimeupdated) VALUES ' +
              perymtsatString.slice(0, -1),
            [],
            (tx, results) => {
              UpdateYearMonthsFilter();
              setq1Principal(true);
            },
            SQLerror,
          );
        });
      }
    }
  }

  //PER PRINCIPAL
  const GetPerPrincipalAPIData = () => {
    var teams = global.TeamAccessListForAPI;
    var sales_position_name = global.sales_position_name;
    var tempstr3 = teams + '&' + sales_position_name;
    Promise.race([
      fetch(
        'https://boiling-atoll-20376.herokuapp.com/perprincipalsalestargetuba/' +
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
        setTimeout(() => reject(new Error('Timeout')), 40000),
      ),
    ])
      .then((responseData) => {
        return responseData.json();
      })
      .then((jsonData) => {
        if (jsonData.length > 0) {
        ///  console.log(jsonData.length);
          PerPrincipalAPIdatalength = jsonData.length;
          setPerPrincipalLocalData(jsonData);
          updateProgress = Number(updateProgress) + Number(3);
        } else {
          CurrentAppScreen.Screen === 'HOME';

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
      })
      .catch(function (error) {
        console.log('error in GetPerPrincipalAPIData :' + error.message);

        setisModalConnectionError(true);
        setisLoadingActivityIndicator(false); //DISABLE ActivityIndicator
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
          SavePerPrincipalAPIData();
        },
        SQLerror,
      );
    });
  }
  function SavePerPrincipalAPIData() {
    var currIndex = 0;
    var perprincipalpermonthString = '';
   // const LengthPerPrincipalLocalData = PerPrincipalLocalData.length - 1;
    {
      PerPrincipalLocalData.map(function (item, index) {
        currIndex = currIndex + 1;
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
      });

      dbperprincipal.transaction(function (tx) {
        tx.executeSql(
          'INSERT INTO perprincipalpermonth_tbl (business_year, business_month, invoice_date,principal_name, principal_acronym, sales, target, uba, dateTimeUpdated) VALUES   ' +
            perprincipalpermonthString.slice(0, -1),
          [],
          (tx, results) => {
            if (currIndex === PerPrincipalLocalData.length) {
              updateProgress = Number(updateProgress) + Number(7);
              setq2Perymtsat(true);
            }
          },
          SQLerror,
        );
      });
    }
  }

  //PER AREA
  const GetPerAreaAPIData = () => {
    var teams = global.TeamAccessListForAPI;
    var sales_position_name = global.sales_position_name;
    var tempstr2 = teams + '&' + sales_position_name;
    Promise.race([
      fetch(
        'https://boiling-atoll-20376.herokuapp.com/perareasalesuba/' + tempstr2,
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
        if (jsonData.length > 0) {
          PerAreaAPIdatalength = jsonData.length;
          setPerAreaLocalData(jsonData);
          updateProgress = Number(updateProgress) + Number(2);
          console.log(jsonData.length);
        } else {
          console.log('Please check code, no perarea found');

          CurrentAppScreen.Screen === 'HOME';

          Alert.alert(
            'Error',
            'Application Error,  No data found \n err1003 \n \n Please Contact Support Team..',
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
      })
      .catch(function (error) {
        console.log('error in GetPerAreaAPIData :' + error.message);

        setisModalConnectionError(true);
        setisLoadingActivityIndicator(false); //DISABLE ActivityIndicator
      })
      .done();
  };

  function DeletePerAreaAPIData() {
    dbperarea.transaction(function (tx) {
      tx.executeSql(
        'Delete from perareapermonth_tbl ',
        [],
        (tx, results) => {
          console.log('deleted local perareapermonth_tbl');
          SavePerAreaAPIData();
        },
        SQLerror,
      );
    });
  }
  function SavePerAreaAPIData() {
    var currIndex = 0;
    var perareapermonthString = '';
    // const LengthPerAreaLocalData = PerAreaLocalData.length - 1;
    {
      PerAreaLocalData.map(function (item, index) {
        currIndex = currIndex + 1;
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
      });

      dbperarea.transaction(function (tx) {
        tx.executeSql(
          'INSERT INTO perareapermonth_tbl (business_year, business_month, invoice_date,province,  sales, uba, dateTimeUpdated) VALUES ' +
            perareapermonthString.slice(0, -1),
          [],
          (tx, results) => {
            if (currIndex === PerAreaLocalData.length) {
              updateProgress = Number(updateProgress) + Number(6);
              console.log('Query completed SavePerAreaAPIData');
              setq4Area(true);
            }
          },
          SQLerror,
        );
      });
    }
  }

  const APISaveUpdate = () => {
    Promise.race([
      fetch('https://boiling-atoll-20376.herokuapp.com/UserUpdateLog', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + APIToken.access_token,
        },
        body: JSON.stringify({
          user_name: global.user_name,
          dateTimeUpdated: moment()
            .utcOffset('+08:00')
            .format('YYYY-MM-DD hh:mm:ss a'),
        }),
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 40000),
      ),
    ])
      .then((responseData) => {
        return responseData.json();
      })
      .then((jsonData) => {
        updateProgress = Number(updateProgress) + Number(7);
        console.log('user update log saved in API');
        setq3UserUpdateLog(true);
      })
      .catch(function (error) {
        console.log('error in APISaveUpdate :' + error.text);

        CurrentAppScreen.Screen === 'HOME';

        Alert.alert(
          'Error',
          'Application Error,  No data found \n err1004 \n \n Please Contact Support Team.',
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
      })
      .done();
  };

  const GETUpdateVersionAPI = () => {
    var user_name = global.user_name;
    var dateTimeUpdated = moment()
      .utcOffset('+08:00')
      .format('YYYY-MM-DD hh:mm:ss a');
    Promise.race([
      //---------------------------------------------------------------first command
      fetch(
        'https://boiling-atoll-20376.herokuapp.com/updateversion2/' +
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
        setTimeout(() => reject(new Error('Timeout')), 40000),
      ),
    ])
      .then((responseData) => {
        return responseData.json();
      })
      .then((jsonData) => {
        if (jsonData.length > 0) {
          console.log('successfully get updateversion test');
          jsonData.map((key, index) => {
            APIUpdateVersion.APIUpdateVersionField = key.version;
            APIUpdateVersion.APIUpdateVersionDateTimeRelease =
              key.dateTimeRelease;
            APIUpdateVersion.APIUpdateVersionStatus = key.status;
            APIUpdateVersion.APIUpdateVersionNotice = key.notice;
          });

          if (APIUpdateVersion.APIUpdateVersionStatus === 'ONLINE') {
            StartUpdate();

            updateProgress = Number(updateProgress) + Number(4);
            console.log('user update log saved in API');
            setq3UserUpdateLog(true);
          } else if (APIUpdateVersion.APIUpdateVersionStatus === 'OFFLINE') {
            console.log(APIUpdateVersion.APIUpdateVersionStatus);

            CurrentAppScreen.Screen === 'HOME';
            console.log('SERVER OFFLINE');
            setisModalConnectionError(false);
            setisLoadingActivityIndicator(false);
            props.navigation.navigate('Home');
          }
        }
      })
      .catch(function (error) {
        console.log('error in GETUpdateVersionAPI :' + error.message);
        setisModalConnectionError(true);
        setisLoadingActivityIndicator(false); //DISABLE ActivityIndicator
      })
      .done();
  };


  const BusinessCalendarDownload = () => {
    var BusinessCalendarString = '';
    var CurrIndex = 0;

    Promise.race([
      fetch(server.server_address + '/business_calendar/get/', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + APIToken.access_token,
        },
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 40000),
      ),
    ])
      .then((responseData) => {
        return responseData.json();
      })
      .then((jsonData) => {
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
              tx.executeSql(
                'Delete from business_calendar_tbl   ',
                [],
                (tx, results) => {
                  // if (results.rowsAffected > 0) {}
                  console.log('deleted local business_calendar_tbl');
                  dbBusinessCalendar.transaction(function (tx) {
                    tx.executeSql(
                      'INSERT INTO business_calendar_tbl (date, year, month, day, update_version) VALUES ' +
                        BusinessCalendarString.slice(0, -1),
                      [],
                      (tx, results) => {
                        // Alert.alert('Sucess', 'Calendar Updated', [{text: 'OK'}], {
                        //   cancelable: false,
                        // });

                        // setisVisibleCaldendarModal(false);
                        // setisEditing(true);
                        // GetSelectedDays();
                      },
                      SQLerror,
                    );
                  });
                },
                SQLerror,
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





  return (
    <View style={{flex: 1}}>
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={isModalConnectionError}
          onRequestClose={() => {
            setisModalConnectionError(false);
            setisLoadingActivityIndicator(false);
            CurrentAppScreen.Screen === 'HOME';
            props.navigation.navigate('Home');
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Please make sure you are connected to the internet.
              </Text>

              <FlatButton
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
                  props.navigation.navigate('Home');
                  CurrentAppScreen.Screen === 'HOME';
                }}
                gradientFrom="red"
                gradientTo="pink"
              />
            </View>
          </View>
        </Modal>
      </View>

      {isLoadingActivityIndicator && (
        <View style={styles.loading}>
          {/* <Button title="Test" onPress={() => console.log(updateCount)} /> */}
          <Text style={{color: 'black', fontSize: moderateScale(17)}}>
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
