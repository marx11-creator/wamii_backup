/* eslint-disable no-sparse-arrays */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-lone-blocks */
import React, {useState, useRef, useEffect, useContext} from 'react';
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  FlatList,
  StyleSheet,
  Image,
  Modal,
  TouchableHighlight,
  ActivityIndicator,
  TouchableWithoutFeedback,
  TouchableOpacity,
  LogBox,
  Alert,
} from 'react-native';

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
// import {LinearGradient, Stop, Defs} from 'react-native-svg';
import {BarChart as Barchat, Grid} from 'react-native-svg-charts';
import LinearGradient from 'react-native-linear-gradient';
import {
  scale,
  moderateScale,
  verticalScale,
  width,
  height,
} from '../../sharedComponents/scaling';
import * as Animatable from 'react-native-animatable';
import Video from 'react-native-video';
import {dbperymtsat} from '../../database/sqliteSetup';
import numbro from 'numbro';
import FlatButton from '../../sharedComponents/custombutton';
import DropDownPicker from 'react-native-dropdown-picker';
import moment from 'moment';
import {ProgressCircle} from 'react-native-svg-charts';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  CurrentDashboardScreen,
  FilterList,
  DashboardYears,
  CurrentAppScreen,
  LastDateTimeUpdated,
  hhmmss,
  globalStatus,
  PageVisited,
} from '../../sharedComponents/globalCommands/globalCommands';
import DashboardModal from '../Dashboard/DashboardModal';
import PageContextGlobalState from '../MainDrawerScreens/pagecontextGlobalState';
import PageContextGlobalTimer from '../MainDrawerScreens/pagecontextGlobalTimer';
var lineChartAPIdatalength = 0;
var BottomPerTeamAPIdatalength = 0;

export default function PerSalesmanDashboard(props) {
  LogBox.ignoreAllLogs();

  // ----------------------------------------------------------------------------------------------------------

  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: '#EA0A16',
    backgroundGradientFromOpacity: 0.9,
    backgroundGradientTo: '#EA0A16',
    backgroundGradientToOpacity: 0,
    strokeWidth: 2,
    decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 100) => 'white', //<- This is needed to prevent the color null from appearing
    labelColor: (opacity = 1) => 'white',
    style: {
      borderRadius: 16,
    },
  };

  const renderData = ({item}) => {
    return (
      <View style={styles.DetailView}>
        <Text
          style={[
            styles.DetailtText,
            {marginLeft: moderateScale(3), width: scale(140)},
          ]}>
          {item.team}
        </Text>
        <Text style={[styles.DetailtText, {marginLeft: scale(22)}]}>
          {item.sales}
        </Text>
        <Text style={styles.DetailtText}>{item.target}</Text>
        <Text
          style={[
            styles.DetailtText,
            {
              width: scale(105),
              marginLeft: scale(15),
              fontSize: moderateScale(13, 0.5),
            },
          ]}>
          {item.achievement}
        </Text>
      </View>
    );
  };

  // <Text style={[styles.DetailtText, {marginLeft: 3, width: scale(160)}]}>{item.team}</Text>
  // <Text style={[styles.DetailtText, {marginLeft: 22}]}>{item.sales}</Text>
  // <Text style={styles.DetailtText}>{item.target}</Text>
  // <Text style={[styles.DetailtText, {width: scale(65), marginLeft: scale(40)}]}>

  const renderDataDetails = ({item}) => {
    return (
      <View style={styles.DetailViewDetails}>
        <View style={{flexDirection: 'column', marginBottom: moderateScale(5)}}>
          <Text
            style={[
              styles.DetailtTextDetails,
              ,
              {
                width: scale(160),
                fontSize: moderateScale(11),
                marginLeft: moderateScale(15),
              },
            ]}>
            {item.salesman_name}
          </Text>
          <Text
            style={[
              styles.DetailtTextDetails,
              ,
              {width: scale(170), fontSize: 7, marginLeft: moderateScale(15)},
            ]}>
            {item.position_name}
          </Text>
        </View>

        <Text style={[styles.DetailtTextDetails, {marginLeft: 2}]}>
          P {numFormatter(item.sales)}
        </Text>
        <Text style={[styles.DetailtTextDetails]}>
          P {item.target > 0 ? numFormatter(item.target) : 0}
        </Text>

        {item.sales > 0 && item.target > 0 ? (
          <Text style={styles.DetailtTextDetails}>
            {numbro((item.sales / item.target) * 100).format({
              thousandSeparated: true,
              mantissa: 2,
            })}{' '}
            %
          </Text>
        ) : (
          <Text style={styles.DetailtTextDetails}>0 %</Text>
        )}
      </View>
    );
  };

  const SUmmaryStyle = {
    width: scale(290),
    height: scale(140),
  };

  const ref_video = useRef(null);
  function numFormatter(num) {
    if (num > 999 && num < 1000000) {
      // 1000 to 999,999.00
      return (num / 1000).toFixed(2) + 'K';
    } else if (num > 999999) {
      //    1M up
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num < 1000) {
      //   999 below
      return num; // if value < 1000, nothing to do
    }
  }

  function SQLerror(err) {
    console.log('SQL Error: ' + err);
  }

  const [globalState, setglobalState] = useContext(PageContextGlobalState);
  const [globalTimer, setglobalTimer] = useContext(PageContextGlobalTimer);

  const [isVisibleModalFilter, setisVisibleModalFilter] = useState(false);

  const [ProgressPercentage, setProgressPercentage] = useState(0);
  const [dateTime, setDateTime] = useState('');

  const [barPercentageWidth, setbarPercentageWidth] = useState(0);

  const [isVisibleFilterModal, setisVisibleFilterModal] = useState(false);
  const [filterMainView, setfilterMainView] = useState(scale(460));
  const [MonthSelected, setMonthSelected] = useState('');

  const [MonthFilterHeight, setMonthFilterHeight] = useState(scale(360));

  const [LineChartAnimation, setLineChartAnimation] = useState(true);
  const [totalSalesAnimation, settotalSalesAnimation] = useState(true);
  const [totalTargetAnimation, settotalTargetsAnimation] = useState(true);
  const [totalAchievementAnimation, settotalAchivementAnimation] = useState(
    true,
  );
  const [totalBalanceAnimation, settotalBalanceAnimation] = useState(true);
  const [totalTeamAnimation, setTotalTeamANimation] = useState(true);

  const [isLoadingActivityIndicator, setisLoadingActivityIndicator] = useState(
    false,
  );

  const monthListFields = [
    {
      label: '',
      value: '',
    },
  ];
  const teamListFields = [
    {
      label: '',
      value: '',
    },
  ];

  const dataProgressRing = {
    labels: ['Run'], // optional
    data: [2.8],
    color: 'red',
    strokeWidth: 1, // optional
  };

  const [monthList, setMonthList] = useState(monthListFields);
  const [teamList, setTeamList] = useState(teamListFields);

  //const for summary
  const [totalSales, setTotalSales] = useState(0);
  const [totalTarget, setTotalTarget] = useState(0);
  const [summaryPercentage, setsummaryPercentage] = useState(0);
  const [summaryBaltoSell, setsummaryBaltoSell] = useState(0);

  const perSalesmanfield = [
    {
      salesman_name: '',
      position_name: '',
      sales: '',
      target: '',
      achievement: '',
    },
  ];
  const perTeamReportFields = [
    {
      business_year: '',
      business_month: '',
      invoice_date: '',
      team: '',
      amount: '',
      target: '',
      dateTimeUpdated: '',
    },
  ];

  //const for bottom per team report
  const [perTeamReport, setperTeamReport] = useState(perTeamReportFields);
  const [perSalesman, setperSalesman] = useState(perSalesmanfield);

  const colData = [0];
  const bottomData = ['Day 0'];

  const lineChartLocalDataField = [
    {
      business_year: '',
      business_month: '',
      invoice_date: '',
      team: '',
      salesman_name: '',
      amount: '',
      target: '',
    },
  ];

  const [lineChartLocalData, setlineChartLocalData] = useState(
    lineChartLocalDataField,
  );
  const [lineChartColLocalData, setlineChartColLocalData] = useState(colData);
  const [lineChartBottomLocalData, setlineChartBottomLocalData] = useState(
    bottomData,
  );

  //USE EFFECT PART

  useEffect(() => {
    console.log('focus on per team from update'); //

    SearchPerSalesman();
  }, [globalState.dateTimeUpdated24hr]);

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      console.log('focus on per salesman focus');

      CurrentAppScreen.Screen = 'PerSalesman';

      if (PageVisited.PerSalesmanPAGE === 'NO') {
        PageVisited.PerSalesmanPAGE = 'YES';
        console.log('focus on per salesman with changes');
        SearchPerSalesman();
      }
    });
  }, []);

  useEffect(() => {
    if (CurrentDashboardScreen.Screen === 'PERSALESMAN') {
      console.log('focus on per team from dashboard global'); //
      PageVisited.PerSalesmanPAGE = 'YES';
      SearchPerSalesman();
    }
  }, [FilterList.DashboardFilterYearNMonthTeam]);

  useEffect(() => {
    setsummaryPercentage((totalSales / totalTarget) * 100);
    setsummaryBaltoSell(totalSales - totalTarget);
    settotalAchivementAnimation(true);
    //  console.log(ProgressPercentage);
  }, [totalSales]);

  useEffect(() => {
    settotalAchivementAnimation(true);
    setProgressPercentage(summaryPercentage / 100);
  }, [summaryPercentage]);

  useEffect(() => {
    settotalTargetsAnimation(true);
  }, [totalTarget]);

  const SearchPerSalesman = () => {
    setisLoadingActivityIndicator(true);
    GetlineChartColLocalData();
    GetlineChartBottomLocalData();
    GetSummary();
    GetBottomPerTeam4LocalData();
    setisVisibleFilterModal(false);
  };

  function GetlineChartColLocalData() {
    var YearQuery = '';
    if (FilterList.DashboardFilterYear === '') {
      YearQuery =
        ' where  business_year =  ' +
        "'" +
        moment().utcOffset('+08:00').format('YYYY') +
        "'";
    } else {
      YearQuery =
        ' where  business_year = ' + "'" + FilterList.DashboardFilterYear + "'";
    }

    var TeamQuery = '';
    if (
      FilterList.DashboardFilterTeam === '' ||
      FilterList.DashboardFilterTeam === 'ALL'
    ) {
      TeamQuery = ' and   team IN ' + global.TeamAccessList;
    } else {
      TeamQuery = ' and team = ' + "'" + FilterList.DashboardFilterTeam + "'";
    }

    var VendorQuery = '';
    if (
      FilterList.DashboardFilterVendor === '' ||
      FilterList.DashboardFilterVendor === 'ALL'
    ) {
      VendorQuery = ' and   principal_name  like ' + "'%%' ";
    } else {
      VendorQuery =
        ' and principal_name = ' + "'" + FilterList.DashboardFilterVendor + "'";
    }

    console.log(
      'SELECT (sum(amount) / 1000000) as amount FROM perymtsat_tbl ' +
        YearQuery +
        TeamQuery +
        VendorQuery +
        ' GROUP BY business_month  ORDER BY invoice_date asc',
    );

    dbperymtsat.transaction((tx) => {
      tx.executeSql(
        'SELECT (sum(amount) / 1000000) as amount FROM perymtsat_tbl ' +
          YearQuery +
          TeamQuery +
          VendorQuery +
          ' GROUP BY business_month  ORDER BY invoice_date asc',
        [],
        (tx, results) => {
          var temp = [];
          var lengthcal = 0;
          lengthcal = results.rows.length * 0.04;
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i).amount);
          }

          if (temp.length > 0) {
            setlineChartColLocalData(temp);
            setbarPercentageWidth(1 - lengthcal);
            //  console.log(barPercentageWidth);
          }
        },
        SQLerror,
      );
    });
  }

  function GetlineChartBottomLocalData() {
    var YearQuery = '';
    if (FilterList.DashboardFilterYear === '') {
      YearQuery =
        '  business_year =  ' +
        "'" +
        moment().utcOffset('+08:00').format('YYYY') +
        "'";
    } else {
      YearQuery =
        ' business_year = ' + "'" + FilterList.DashboardFilterYear + "'";
    }

    var TeamQuery = '';
    if (
      FilterList.DashboardFilterTeam === '' ||
      FilterList.DashboardFilterTeam === 'ALL'
    ) {
      TeamQuery = ' and   team IN ' + global.TeamAccessList;
    } else {
      TeamQuery = ' and team = ' + "'" + FilterList.DashboardFilterTeam + "'";
    }

    var VendorQuery = '';
    if (
      FilterList.DashboardFilterVendor === '' ||
      FilterList.DashboardFilterVendor === 'ALL'
    ) {
      VendorQuery = ' and   principal_name  like ' + "'%%' ";
    } else {
      VendorQuery =
        ' and principal_name = ' + "'" + FilterList.DashboardFilterVendor + "'";
    }

    dbperymtsat.transaction((tx) => {
      tx.executeSql(
        'SELECT distinct  business_month FROM perymtsat_tbl where ' +
          YearQuery +
          TeamQuery +
          VendorQuery +
          ' order by invoice_date asc ',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i).business_month.substring(0, 3));
          }
          if (temp.length > 0) {
            setlineChartBottomLocalData(temp);
          }
        },
        SQLerror,
      );
    });
  }

  //CENTER 4 SUMMARY                     >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  function GetSummary() {
    var YearQuery = '';
    if (FilterList.DashboardFilterYear === '') {
      YearQuery =
        '  business_year =  ' +
        "'" +
        moment().utcOffset('+08:00').format('YYYY') +
        "'";
    } else {
      YearQuery =
        ' business_year = ' + "'" + FilterList.DashboardFilterYear + "'";
    }

    var MonthQuery = '';
    if (FilterList.DashboardFilterMonth === '') {
      MonthQuery =
        '  and business_month =  ' +
        "'" +
        moment().utcOffset('+08:00').format('MMMM') +
        "'";
    } else {
      MonthQuery =
        ' and  business_month = ' + "'" + FilterList.DashboardFilterMonth + "'";
    }

    var TeamQuery = '';
    if (
      FilterList.DashboardFilterTeam === '' ||
      FilterList.DashboardFilterTeam === 'ALL'
    ) {
      TeamQuery = ' and   team IN ' + global.TeamAccessList;
    } else {
      TeamQuery = ' and team = ' + "'" + FilterList.DashboardFilterTeam + "'";
    }

    var VendorQuery = '';
    if (
      FilterList.DashboardFilterVendor === '' ||
      FilterList.DashboardFilterVendor === 'ALL'
    ) {
      VendorQuery = ' and   principal_name  like ' + "'%%' ";
    } else {
      VendorQuery =
        ' and principal_name = ' + "'" + FilterList.DashboardFilterVendor + "'";
    }

    dbperymtsat.transaction((tx) => {
      tx.executeSql(
        'SELECT  SUM(amount) as amount , SUM(target)   as target FROM perymtsat_tbl  where ' +
          YearQuery +
          MonthQuery +
          TeamQuery +
          VendorQuery +
          ' order by invoice_date asc ',
        [],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            // console.log(results.rows.item(0).target);
            //console.log(results.rows.item(0).amount);
            //setTotalSales();
            setTotalTarget(parseInt(results.rows.item(0).target));
            setTotalSales(parseInt(results.rows.item(0).amount));
            settotalSalesAnimation(true);
            //  numbro(parseInt(results.rows.item(0).amount)).format({
            //     thousandSeparated: true,
            //     mantissa: 2,
            //   }),

            // console.log(
            //   'Successfully got summary of ' +
            //     FilterList.DashboardFilterMonth +
            //     numbro(parseInt(results.rows.item(0).amount)).format({
            //       thousandSeparated: true,
            //       mantissa: 2,
            //     }),
            // );
          }
        },
        SQLerror,
      );
    });
  }

  function GetBottomPerTeam4LocalData() {
    var YearQuery = '';
    if (FilterList.DashboardFilterYear === '') {
      YearQuery =
        '  business_year =  ' +
        "'" +
        moment().utcOffset('+08:00').format('YYYY') +
        "'";
    } else {
      YearQuery =
        ' business_year = ' + "'" + FilterList.DashboardFilterYear + "'";
    }

    var MonthQuery = '';
    if (FilterList.DashboardFilterMonth === '') {
      MonthQuery =
        ' and  business_month =  ' +
        "'" +
        moment().utcOffset('+08:00').format('MMMM') +
        "'";
    } else {
      MonthQuery =
        'and business_month = ' + "'" + FilterList.DashboardFilterMonth + "'";
    }

    var TeamQuery = '';
    if (
      FilterList.DashboardFilterTeam === '' ||
      FilterList.DashboardFilterTeam === 'ALL'
    ) {
      TeamQuery = ' and   team IN ' + global.TeamAccessList;
    } else {
      TeamQuery = ' and team = ' + "'" + FilterList.DashboardFilterTeam + "'";
    }

    var VendorQuery = '';
    if (
      FilterList.DashboardFilterVendor === '' ||
      FilterList.DashboardFilterVendor === 'ALL'
    ) {
      VendorQuery = ' and   principal_name  like ' + "'%%' ";
    } else {
      VendorQuery =
        ' and principal_name = ' + "'" + FilterList.DashboardFilterVendor + "'";
    }

    console.log(
      'SELECT salesman_name , position_name , sum(amount) as sales, sum(target) as target,  ' +
        ' sum(target) as achievement FROM perymtsat_tbl  where ' +
        YearQuery +
        MonthQuery +
        TeamQuery +
        VendorQuery +
        ' group by business_year, business_month, salesman_name' +
        ' order by CAST((sales) AS UNSIGNED)   DEsc ',
    );
    dbperymtsat.transaction((tx) => {
      tx.executeSql(
        'SELECT salesman_name , position_name , sum(amount) as sales, sum(target) as target,  ' +
          ' sum(target) as achievement FROM perymtsat_tbl  where ' +
          YearQuery +
          MonthQuery +
          TeamQuery +
          VendorQuery +
          ' group by business_year, business_month, salesman_name' +
          ' order by CAST((sales) AS UNSIGNED)   DEsc ',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          if (temp.length > 0) {
            setperSalesman(temp);
            setTotalTeamANimation(true);
            setisLoadingActivityIndicator(false);
            // console.log(temp);
          } else {
            setperSalesman(temp);
            setTotalTeamANimation(true);
            setisLoadingActivityIndicator(false);
          }
        },
        SQLerror,
      );
    });
  }

  function PerSalsemanFilter() {
    return (
      <View style={{}}>
        <LinearGradient
          style={{
            zIndex: 0,
            marginLeft: scale(8),
            borderRadius: 7,
            marginTop: 3,
            width: scale(290),
            height: scale(70),
          }}
          // start={{x: 1, y: 0.5}}
          // end={{x: 1, y: 4}}
          colors={['#1AD661', '#065223']}>
          <View
            style={{
              flexDirection: 'column',
              backgroundColor: 'transparent',
              marginVertical: 0,
              marginLeft: 5,
            }}>
            <View style={{backgroundColor: 'transparent', flexDirection: 'row'}}>
              <View style={{flex: 1, backgroundColor: 'transparnt'}}>
                <Text
                  style={{
                    fontSize: moderateScale(12, 0.5),
                    color: '#ffffff',
                  }}>
                  Vendor :
                </Text>
              </View>

              <View style={{flex: 2, backgroundColor: 'transparent'}}>
                <Text
                  style={{
                    fontSize: moderateScale(12, 0.5),
                    color: '#ffffff',
                  }}>
                {FilterList.DashboardFilterVendor === '' ? 'ALL': 
               FilterList.DashboardFilterVendor }
                </Text>
              </View>
            </View>
            <View style={{backgroundColor: 'transparent', flexDirection: 'row'}}>
              <View style={{flex: 1, backgroundColor: 'transparent'}}>
                <Text
                  style={{
                    fontSize: moderateScale(12, 0.5),
                    color: '#ffffff',
                  }}>
                  Team :
                </Text>
              </View>

              <View style={{flex: 2, backgroundColor: 'transparent'}}>
                <Text
                  style={{
                    fontSize: moderateScale(12, 0.5),
                    color: '#ffffff',
                  }}>
                  {FilterList.DashboardFilterTeam === '' ? 'ALL': 
               FilterList.DashboardFilterTeam }
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* <ActivityIndicator size="large" color="green" /> */}
      </View>
    );
  }

  return (
    // ===================================================================================================================
    <View style={styles.container}>
      <Video
        rate={0.9}
        repeat={true}
        resizeMode="cover"
        source={require('../../assets/night.mp4')} // Can be a URL or a local file.
        ref={ref_video} // Store reference
        // onBuffer={this.onBuffer} // Callback when remote video is buffering
        onError={(Error) => console.log(Error)} // Callback when video cannot be loaded
        style={styles.backgroundVideo}
      />
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            height: scale(70),
            alignItems: 'center',
          }}>
          <View style={{width: 50}}>
            <TouchableOpacity onPress={() => props.navigation.openDrawer()}>
              <Icon name="md-filter" color={'#ffffff'} size={34} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => {
              {
                DashboardYears.length > 0
                  ? (setisVisibleModalFilter(true),
                    (CurrentDashboardScreen.Screen = 'PERSALESMAN'))
                  : null;
              }
            }}>
            <Text
              style={{
                paddingBottom: moderateScale(10),
                alignSelf: 'center',
                fontSize: moderateScale(22),
                color: 'white',
                fontWeight: 'bold',
                marginLeft: width / 2 - scale(195),
              }}>
              Per Salesman
            </Text>
          </TouchableOpacity>
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
          {/* <View style={styles.textLastUpdateView}>
            <Text style={styles.textLastUpdate}>Last Update</Text>
            <Text style={styles.textLastUpdate}>
              {dateTime.substring(0, 10)}
            </Text>
            <Text style={styles.textLastUpdate}>
              {dateTime.substring(11, 50)}
            </Text>
          </View> */}
        </View>

        <Animatable.View
          useNativeDriver={true}
          opacity={0.9}
          delay={1000}
          animation={LineChartAnimation ? 'fadeIn' : undefined}
          onAnimationEnd={() => setLineChartAnimation(false)}>
          <BarChart
            style={{
              marginVertical: 2,
              ...chartConfig.style,
            }}
            data={{
              labels: lineChartBottomLocalData,
              datasets: [
                {
                  //LEFT COLUM LABEL - AMOUNT
                  data: lineChartColLocalData,
                  color: (opacity = 1) => 'white',
                  strokeWidth: 2, // optional
                },
              ],
            }}
            fromZero={true}
            height={scale(290)}
            width={width}
            yAxisLabel=""
            yAxisSuffix="M"
            withInnerLines={false}
            chartConfig={{
              backgroundColor: 'transparent',
              backgroundGradientFrom: '#EA0A16',
              backgroundGradientFromOpacity: 0.9,
              backgroundGradientTo: 'white',
              backgroundGradientToOpacity: 0.3,
              strokeWidth: 2,
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 100) => 'white', //<- This is needed to prevent the color null from appearing
              barPercentage: barPercentageWidth,
              propsForLabels: {
                fontSize: '10',
              },
              fillShadowGradient: '#EBCFD8', // THIS
              fillShadowGradientOpacity: 0.7, // THIS
            }}
            showBarTops={true}
            showValuesOnTopOfBars={false}
          />
        </Animatable.View>
        <PerSalsemanFilter />

        <View style={{flexDirection: 'row'}}>
          <View>
            <View style={styles.LinearView}>
              <Animatable.View
                useNativeDriver={true}
                delay={200}
                animation={totalSalesAnimation ? 'fadeInLeft' : undefined}
                onAnimationEnd={() => settotalSalesAnimation(false)}>
                <LinearGradient
                  opacity={0.9}
                  start={{x: 0, y: 1}}
                  end={{x: 1, y: 1}}
                  colors={['#F0C0EC', '#F42CE4']}
                  style={SUmmaryStyle}>
                  <View style={styles.LinearTextView}>
                    <Text style={styles.LinearTopBottomText}>
                      {FilterList.DashboardFilterMonth === ''
                        ? moment().utcOffset('+08:00').format('MMMM')
                        : FilterList.DashboardFilterMonth}{' '}
                      {FilterList.DashboardFilterYear} sales
                    </Text>
                    <Text style={styles.LinearCenterText}>
                      P
                      {numbro(totalSales).format({
                        thousandSeparated: true,
                        mantissa: 2,
                      })}
                    </Text>
                    <Text style={styles.LinearTopBottomText}>
                      Current sales{' '}
                    </Text>
                  </View>
                </LinearGradient>
              </Animatable.View>
            </View>
            <View style={styles.LinearView}>
              <Animatable.View
                useNativeDriver={true}
                delay={200}
                animation={totalTargetAnimation ? 'fadeInLeft' : undefined}
                onAnimationEnd={() => settotalTargetsAnimation(false)}>
                <LinearGradient
                  opacity={0.9}
                  start={{x: 0, y: 1}}
                  end={{x: 1, y: 1}}
                  colors={['#78F876', '#09E448']}
                  style={SUmmaryStyle}>
                  <View style={styles.LinearTextView}>
                    <Text style={styles.LinearTopBottomText}>
                      {FilterList.DashboardFilterMonth === ''
                        ? moment().utcOffset('+08:00').format('MMMM')
                        : FilterList.DashboardFilterMonth}{' '}
                      {FilterList.DashboardFilterYear} target
                    </Text>
                    <Text style={styles.LinearCenterText}>
                      P
                      {numbro(totalTarget).format({
                        thousandSeparated: true,
                        mantissa: 2,
                      })}
                    </Text>
                    <Text style={styles.LinearTopBottomText}>
                      Current target{' '}
                    </Text>
                  </View>
                </LinearGradient>
              </Animatable.View>
            </View>
          </View>

          <Animatable.View
            style={{flex: 1, justifyContent: 'center'}}
            useNativeDriver={true}
            delay={200}
            animation={totalAchievementAnimation ? 'zoomInRight' : undefined}
            onAnimationEnd={() => settotalAchivementAnimation(false)}>
            <View
              style={{
                width: scale(190),
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: moderateScale(50),
              }}>
              <ProgressCircle
                style={{height: scale(230), width: scale(230)}}
                progress={ProgressPercentage}
                progressColor={'#24E4B5'}
                backgroundColor="white" //'#ECECEC'	PropTypes.any
                startAngle="0" // 	0	PropTypes.number
                // endAngle // Math.PI * 2	   PropTypes.number
                strokeWidth="10" // 5	PropTypes.number
                cornerRadius="45" // PropTypes.number
              />

              <Text
                style={{
                  position: 'absolute',
                  color: 'white',
                  fontSize: moderateScale(30),
                  fontWeight: 'bold',
                }}>
                {totalTarget > 0
                  ? numbro(summaryPercentage).format({
                      thousandSeparated: true,
                      mantissa: 2,
                    })
                  : 0}{' '}
                %
              </Text>
            </View>
          </Animatable.View>
        </View>
        {isLoadingActivityIndicator && (
          <View>
            <ActivityIndicator size="large" color="green" />
          </View>
        )}

        <Animatable.View
          useNativeDriver={true}
          delay={600}
          animation={totalTeamAnimation ? 'zoomInRight' : undefined}
          onAnimationEnd={() => setTotalTeamANimation(false)}>
          <View style={{borderWidth: 0, margin: scale(5)}}>
            {/* <LinearGradient
          opacity={0.9}
          colors={['#00FF8B', '#28E2EE']}
          style={{width: scale(580), height: scale(530)}}> */}
            <FlatList
              data={[
                {
                  team: 'SALESMAN',
                  sales: 'SALES',
                  target: 'TARGET',
                  achievement: 'Achievement',
                },
              ]}
              renderItem={renderData}
              initialNumToRender={5}
              maxToRenderPerBatch={10}
              windowSize={10}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          <View style={{height: perSalesman.length * moderateScale(45, 0.5)}}>
            <FlatList
              data={perSalesman}
              renderItem={renderDataDetails}
              initialNumToRender={5}
              maxToRenderPerBatch={10}
              windowSize={10}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </Animatable.View>
        {isVisibleModalFilter ? (
          <DashboardModal
            display={isVisibleModalFilter}
            closeDisplay={() => setisVisibleModalFilter(false)} // <- we are passing this function
          />
        ) : null}
        {/* <Modal
          transparent={true}
          animationInTiming={200}
          useNativeDriver={true}
          hideModalContentWhileAnimating={true}
          visible={isVisibleFilterModal}
          animationType="none"
          onRequestClose={() => setisVisibleFilterModal(false)}>
          <TouchableWithoutFeedback>
            <View style={[styles.FilterMainView]}>
              <View
                style={[styles.FilterCenteredView, {height: filterMainView}]}>
                <View
                  style={{
                    backgroundColor: 'white',
                    width: scale(300),
                    height: MonthFilterHeight,
                    alignSelf: 'center',
                  }}>
                  <View style={{padding: moderateScale(5)}}>
                    <Text>Month :</Text>

                    <DropDownPicker
                      style={{backgroundColor: '#F1F8F5'}}
                      dropDownStyle={{backgroundColor: '#F1F8F5'}}
                      labelStyle={{
                        fontSize: 14,
                        textAlign: 'left',
                        color: '#000',
                      }}
                      itemStyle={{
                        justifyContent: 'flex-start',
                      }}
                      onOpen={() => {
                        setfilterMainView(scale(700));
                        setMonthFilterHeight(scale(600));
                      }}
                      onClose={() => {
                        setfilterMainView(scale(400));
                        setMonthFilterHeight(scale(360));
                      }}
                      placeholder="Select Month"
                      dropDownMaxHeight={250}
                      containerStyle={{height: 50}}
                      isVisible={false}
                      items={monthList}
                      // multiple={true}
                      // multipleText="%d items have been selected."
                      // min={0}
                      // max={10}
                      defaultValue={MonthSelected}
                      onChangeItem={(itemValue) => {
                        setMonthSelected(itemValue.value);
                        //     console.log(itemValue.value);
                        // console.log((itemValue.value),
                      }}
                    />
                    <View style={{marginTop: 20}}>
                      <Text>Team :</Text>
                      <DropDownPicker
                        style={{backgroundColor: '#F1F8F5'}}
                        dropDownStyle={{backgroundColor: '#F1F8F5'}}
                        labelStyle={{
                          fontSize: 14,
                          textAlign: 'left',
                          color: '#000',
                        }}
                        itemStyle={{
                          justifyContent: 'flex-start',
                        }}
                        onOpen={() => {
                          setfilterMainView(scale(700));
                          setMonthFilterHeight(scale(600));
                        }}
                        onClose={() => {
                          setfilterMainView(scale(400));
                          setMonthFilterHeight(scale(360));
                        }}
                        placeholder="Select Team"
                        dropDownMaxHeight={scale(330)}
                        containerStyle={{height: scale(70)}}
                        isVisible={false}
                        items={teamList}
                        // multiple={true}
                        // multipleText="%d items have been selected."
                        // min={0}
                        // max={10}
                        defaultValue={TeamSelected}
                        onChangeItem={(itemValue) => {
                          setTeamSelectedtoSearch(itemValue.value);
                          setTeamSelected(itemValue.value);
                          // setisVisibleFilterModal(false);
                        }}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      alignSelf: 'flex-end',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: 20,
                    }}>
                    <FlatButton
                      text="Filter"
                      // onPress={() => {
                      //   setisModalConnectionError(false);
                      //   setisLoadingActivityIndicator(false);
                      //   console.log(isModalConnectionError);
                      //   props.navigation.dispatch(resetAction);
                      // }}

                      onPress={() => {
                        FilterList.DashboardFilterMonth = MonthSelected;
                        SearchPerSalesman();
                        //    console.log(FilterList.DashboardFilterMonth);
                      }}
                      gradientFrom="red"
                      gradientTo="pink"
                    />
                  </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal> */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  LinearView: {
    flexDirection: 'row',
    marginTop: scale(7),
    marginLeft: scale(7),
    marginRight: scale(7),
    marginBottom: 0,
    justifyContent: 'space-between',
  },
  LinearCenterText: {
    fontSize: moderateScale(20, 0.5),
    color: 'white',
    fontWeight: 'bold',
  },
  LinearTopBottomText: {
    fontSize: moderateScale(13, 0.5),
    color: 'white',
  },
  LinearTextView: {
    marginLeft: scale(10),
    justifyContent: 'space-around',

    flex: 1,
  },
  DetailtText: {
    margin: scale(10),
    width: scale(100),
    color: 'white',
    fontSize: moderateScale(15, 0.5),
    fontWeight: 'bold',
  },
  DetailView: {
    flexDirection: 'row',
    marginHorizontal: scale(10),
    borderWidth: 0.4,
    marginTop: 10,
    borderColor: 'white',
  },
  DetailtTextDetails: {
    width: scale(120),
    color: 'white',
    fontSize: moderateScale(15, 0.5),
  },
  DetailViewDetails: {
    flexDirection: 'row',
    marginTop: 1,
  },
  CompanyLogo: {
    width: scale(60),
    height: scale(60),
    borderRadius: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
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
  FilterMainView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(22),
    height: scale(330),
  },
  FilterCenteredView: {
    width: scale(400),
    margin: scale(20),
    backgroundColor: 'white',
    borderRadius: 20,
    padding: scale(35),
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
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: scale(10),
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: scale(15),
    textAlign: 'center',
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  textLastUpdateView: {
    width: scale(150),
    position: 'absolute',
    alignContent: 'flex-end',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    right: scale(0),
  },
  textLastUpdate: {
    color: 'white',
    fontSize: moderateScale(12, 0.5),
    alignContent: 'flex-end',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
});
