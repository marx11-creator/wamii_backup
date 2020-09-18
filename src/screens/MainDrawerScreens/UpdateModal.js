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
import {
  dbperprincipal,
  dbperarea,
  dbBusinessCalendar,
  dbSalesmanNet,
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
  UpdateYearMonthsFilter,
  CurrentAppScreen,
  server,
  globalCompany,
} from '../../sharedComponents/globalCommands/globalCommands';
import {APIUpdateVersion} from '../../sharedComponents/globalCommands/globalCommands';

//marc
import {useFocusEffect} from '@react-navigation/native';
//marc

var lineChartAPIdatalength = 0;

var PerPrincipalAPIdatalength = 0;
var PerAreaAPIdatalength = 0;
var updateProgress = 0;

//marc
var cur_month = new Date().getMonth() + 1;
var prev_month = new Date().getMonth();
var year = new Date().getFullYear();
//marc

export default function UpdateModal(props) {
  ////////////////MARC
  const [customer_data, setcustomer_data] = useState([]);
  const [net_data, setnet_data] = useState([]);
  const [vendor_data, setvendor_data] = useState([]);
  const [category_data, setcategory_data] = useState([]);

  const [c_customer_data, setc_customer_data] = useState([]);
  const [c_net_data, setc_net_data] = useState([]);
  const [c_vendor_data, setc_vendor_data] = useState([]);
  const [c_category_data, setc_category_data] = useState([]);

  const [load_pc, setload_pc] = useState(0);
  const [load_n, setload_n] = useState(0);
  const [load_v, setload_v] = useState(0);
  const [load_c, setload_c] = useState(0);

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
      q5Marc &&
      CurrentAppScreen.Screen === 'UPDATEMDL'
    ) {
      console.log('q2 and q2 and q3 and q4 and q5  is now true');
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
      q5Marc &&
      CurrentAppScreen.Screen === 'UPDATEMDL'
    ) {
      CurrentAppScreen.Screen === 'HOME';
      console.log('q2 and q2 and q3 and q4 and q5  is now true');
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
      q5Marc &&
      CurrentAppScreen.Screen === 'UPDATEMDL'
    ) {
      CurrentAppScreen.Screen === 'HOME';
      console.log('q2 and q2 and q3 and q4 and q5  is now true');
      setisModalConnectionError(false);
      setisLoadingActivityIndicator(false);
      props.navigation.navigate('Home');
      props.navigation.openDrawer();
    }
  }, [q3UserUpdateLog]);

  useEffect(() => {
    if (
      q1Principal &&
      q2Perymtsat &&
      q4Area &&
      q3UserUpdateLog &&
      q5Marc &&
      CurrentAppScreen.Screen === 'UPDATEMDL'
    ) {
      CurrentAppScreen.Screen === 'HOME';
      console.log('q2 and q2 and q3 and q4 and q5  is now true');
      setisModalConnectionError(false);
      setisLoadingActivityIndicator(false);
      props.navigation.navigate('Home');
      props.navigation.openDrawer();
    }
  }, [q4Area]);

  useEffect(() => {
    if (
      q1Principal &&
      q2Perymtsat &&
      q4Area &&
      q3UserUpdateLog &&
      q5Marc &&
      CurrentAppScreen.Screen === 'UPDATEMDL'
    ) {
      CurrentAppScreen.Screen === 'HOME';
      console.log('q2 and q2 and q3 and q4 and q5  is now true');
      setisModalConnectionError(false);
      setisLoadingActivityIndicator(false);
      props.navigation.navigate('Home');
      props.navigation.openDrawer();
    }
  }, [q5Marc]);

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
      updateProgress = Number(updateProgress) + Number(10);
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
      updateProgress = Number(updateProgress) + Number(5);
      PerPrincipalAPIdatalength = 0;
      DeletePerPrincipalAPIData();
    }
  }, [PerPrincipalLocalData]);

  //PER AREA
  useEffect(() => {
    if (PerAreaLocalData.length === PerAreaAPIdatalength) {
      updateProgress = Number(updateProgress) + Number(8);
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
    setq3UserUpdateLog(false); //update status of function to false
    setq4Area(false); //update status of function to false
    setq5Marc(false); //update status of function to false
    console.log('all salesman1');
    if (global.sales_position_name === 'ALLSALESMAN') {
      setq5Marc(true);
      console.log('all salesman1');
    } else {
      initiate();
    }

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
        server.server_address +
          globalCompany.company +
          'persalesmansalestarget/' +
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
          updateProgress = Number(updateProgress) + Number(6);
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
        server.server_address +
          globalCompany.company +
          'perprincipalsalestargetuba/' +
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
        server.server_address +
          globalCompany.company +
          'perareasalesuba/' +
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
      fetch(server.server_address + globalCompany.company + 'UserUpdateLog', {
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
      fetch(server.server_address + 'business_calendar/get/', {
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

  useEffect(() => {
    if (load_pc === 1 && load_v === 1 && load_n === 1 && load_c === 1) {
      console.log('concat run');
      concat_data_per_customer();
      concat_data_per_vendor();
      concat_data_net();
      concat_data_per_category();
    }

    if (load_pc === 2 && load_v === 2 && load_n === 2 && load_c === 2) {
      console.log('upload to local run');
      upload_data_per_customer();
      upload_data_per_vendor();
      upload_data_net();
      upload_data_per_category();

      if (count_c_json === 0) {
        bypass_scj();
      }
    }

    if (load_pc === 3 && load_v === 3 && load_n === 3 && load_c === 3) {
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
  };

  let prompt = () => {
    setLoading(false);
    setmodalvisible(false);
    setload_pc(0);
    setload_n(0);
    setload_v(0);
    setload_c(0);
    setq5Marc(true);
    updateProgress = Number(updateProgress) + Number(10);
    console.log(
      'DONE...........................................................',
    );
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
    delete_net_tbl();
    delete_per_customer_tbl();
    delete_per_vendor_tbl();
    delete_per_category_tbl();

    fetch_net_data();
    fetch_per_customer_data();
    fetch_per_vendor_data();
    fetch_per_category_data();

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
        (tx, results) => {
          console.log('Deleted customer result :', results.rowsAffected);
        },
      );
    });
  };

  let delete_net_tbl = () => {
    dbSalesmanNet.transaction(function (tx) {
      tx.executeSql('DELETE FROM tbl_sales_net ', [], (tx, results) => {
        console.log('Deleted net result :', results.rowsAffected);
      });
    });
  };

  let delete_per_vendor_tbl = () => {
    dbSalesmanNet.transaction(function (tx) {
      tx.executeSql('DELETE FROM tbl_sales_per_vendor ', [], (tx, results) => {
        console.log('Deleted vendor result :', results.rowsAffected);
      });
    });
  };

  let delete_per_category_tbl = () => {
    dbSalesmanNet.transaction(function (tx) {
      tx.executeSql(
        'DELETE FROM tbl_sales_per_category ',
        [],
        (tx, results) => {
          console.log('Deleted category result :', results.rowsAffected);
        },
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

    console.log('fetching fetch_per_customer_data');

    console.log(
      'https://boiling-atoll-20376.herokuapp.com/sales_tbl/salesmanfilterddaterange/' +
        global.sales_position_name +
        '&' +
        get_date_from +
        '&' +
        get_date_to,
    );
    Promise.race([
      fetch(
        'https://boiling-atoll-20376.herokuapp.com/sales_tbl/salesmanfilterddaterange/' +
          global.sales_position_name +
          '&' +
          get_date_from +
          '&' +
          get_date_to,
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
        setTimeout(() => reject(new Error('Timeout')), 20000),
      ),
    ])
      .then((responseData) => {
        return responseData.json();
      })
      .then((jsonData) => {
        setcustomer_data(jsonData);

        setLoading(true);
        setload_pc(1);

        setloadname('Downloading ' + 'Customers');
        console.log('fetching fetch_per_customer_data DONE');
      })
      .catch(function (error) {
        console.log('Customer: ' + error);
      })
      .done();
  };

  let fetch_net_data = () => {
    console.log('fetching fetch_net_data');
    Promise.race([
      fetch(
        'https://boiling-atoll-20376.herokuapp.com/sales_net_tbl/salesmanfilter/' +
          global.sales_position_name,
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
        setTimeout(() => reject(new Error('Timeout')), 20000),
      ),
    ])
      .then((responseData) => {
        return responseData.json();
      })
      .then((jsonData) => {
        setnet_data(jsonData);

        setLoading(true);
        setload_n(1);

        setloadname('Downloading ' + 'Net Sales');

        console.log('fetching fetch_net_data DONE');
      })
      .catch(function (error) {
        console.log('Net: ' + error);
      })
      .done();
  };

  let fetch_per_vendor_data = () => {
    console.log(
      'https://boiling-atoll-20376.herokuapp.com/perprincipalsalestargetuba/' +
        global.TeamAccessListForAPI +
        '&' +
        global.sales_position_name,
    );
    Promise.race([
      fetch(
        'https://boiling-atoll-20376.herokuapp.com/perprincipalsalestargetuba/' +
          global.TeamAccessListForAPI +
          '&' +
          global.sales_position_name,
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
        setTimeout(() => reject(new Error('Timeout')), 20000),
      ),
    ])
      .then((responseData) => {
        return responseData.json();
      })
      .then((jsonData) => {
        setvendor_data(jsonData);
        setLoading(true);
        setload_v(1);

        setloadname('Downloading ' + 'Vendors');
        console.log('fetching fetch_per_vendor_data DONE');
      })
      .catch(function (error) {
        console.log('Vendor1' + error);
      })
      .done();
  };

  let fetch_per_category_data = () => {
    console.log('fetching fetch_per_category_data');
    Promise.race([
      fetch(
        'https://boiling-atoll-20376.herokuapp.com/sales_category_tbl/salesmanfilter/' +
          global.sales_position_name,
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
        setTimeout(() => reject(new Error('Timeout')), 20000),
      ),
    ])
      .then((responseData) => {
        return responseData.json();
      })
      .then((jsonData) => {
        setcategory_data(jsonData);
        // console.log(jsonData);
        setcount_c_json(Object.keys(jsonData).length);

        setLoading(true);
        setload_c(1);

        setloadname('Downloading ' + 'Categories');
        console.log('fetching fetch_per_category_data DONE');
      })
      .catch(function (error) {
        console.log('category' + error);
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
          console.log('upload upload_data_per_customer');
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
          // console.log(i);
        },
      );
    });
  };

  let upload_data_per_vendor = () => {
    console.log('initial upload_data_per_vendor');
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
          console.log(' upload_data_per_vendor');
        },
        SQLerror,
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
          console.log('done3');
        },
        SQLerror,
      );
    });
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
