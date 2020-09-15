/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-lone-blocks */
import React, {useState, useRef, useEffect} from 'react';
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
  YellowBox,
  Button,
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
import {locales} from 'moment';
import {
  CurrentDashboardScreen,
  FilterList,
  DashboardYears,
  DashboardMonths,
  CurrentAppScreen,
} from '../../sharedComponents/globalCommands/globalCommands';
import Icon from 'react-native-vector-icons/Ionicons';
import DashboardModal from '../Dashboard/DashboardModal';

var lineChartAPIdatalength = 0;
var BottomPerTeamAPIdatalength = 0;
LogBox.ignoreAllLogs();
YellowBox.ignoreWarnings(['']);

export default function PerTeamDashboard(props) {
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
        <Text style={[styles.DetailtText, {marginLeft: 3}]}>{item.team}</Text>
        <Text style={[styles.DetailtText, {marginLeft: scale(22)}]}>
          {item.sales}
        </Text>
        <Text style={styles.DetailtText}>{item.target}</Text>
        <Text style={[styles.DetailtText, {width: scale(145)}]}>
          {item.achievement}
        </Text>
      </View>
    );
  };
  const renderDataDetails = ({item}) => {
    return (
      <View style={styles.DetailViewDetails}>
        <Text
          style={[
            styles.DetailtTextDetails,
            {
              width: scale(108),
              fontSize: moderateScale(13.7, 0.3),
              marginLeft: scale(15),
            },
          ]}>
          {item.team}
        </Text>
        <Text
          style={[
            styles.DetailtTextDetails,
            {marginLeft: moderateScale(12, 0.2)},
          ]}>
          P {numFormatter(item.sales)}
        </Text>
        <Text style={styles.DetailtTextDetails}>
          P {numFormatter(item.target)}
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
      return (num / 1000).toFixed(2) + 'K'; // convert to K for number from > 1000 < 1 million
    } else if (num > 999999) {
      return (num / 1000000).toFixed(2) + 'M'; // convert to M for number from > 1 million
    } else if (num < 1000) {
      return num; // if value < 1000, nothing to do
    }
  }

  function SQLerror(err) {
    console.log('SQL Error: ' + err);
  }

  const [isVisibleModalFilter, setisVisibleModalFilter] = useState(false);
  const [isModalConnectionError, setisModalConnectionError] = useState(false);
  const [isLoadingActivityIndicator, setisLoadingActivityIndicator] = useState(
    false,
  );
  const [dateTime, setDateTime] = useState('');

  const [barPercentageWidth, setbarPercentageWidth] = useState(0);

  const [isVisibleFilterModal, setisVisibleFilterModal] = useState(false);
  const [filterMainView, setfilterMainView] = useState(scale(360));
  const [MonthSelected, setMonthSelected] = useState('');
  const [MothFilterWidth, setMothFilterWidth] = useState(scale(100));

  const [LineChartAnimation, setLineChartAnimation] = useState(true);
  const [totalSalesAnimation, settotalSalesAnimation] = useState(true);
  const [totalTargetAnimation, settotalTargetsAnimation] = useState(true);
  const [totalAchievementAnimation, settotalAchivementAnimation] = useState(
    true,
  );
  const [totalBalanceAnimation, settotalBalanceAnimation] = useState(true);
  const [totalTeamAnimation, setTotalTeamANimation] = useState(true);

  // const monthListFields = [
  //   {
  //     label: '',
  //     value: '',
  //   },
  // ];

  //const for summary
  const [totalSales, setTotalSales] = useState(0);
  const [totalTarget, setTotalTarget] = useState(0);
  const [summaryPercentage, setsummaryPercentage] = useState(0);
  const [summaryBaltoSell, setsummaryBaltoSell] = useState(0);

  const perTeam4field = [
    {
      team: '',
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
  const [perTeam4, setperTeam4] = useState(perTeam4field);

  const colData = [0];
  const bottomData = ['Day 0'];

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
  const [lineChartColLocalData, setlineChartColLocalData] = useState(colData);
  const [lineChartBottomLocalData, setlineChartBottomLocalData] = useState(
    bottomData,
  );

  //USE EFFECT PART

  useEffect(() => {
    settotalSalesAnimation(true);
    setsummaryPercentage((totalSales / totalTarget) * 100);
    setsummaryBaltoSell(totalSales - totalTarget);
    settotalAchivementAnimation(true);
    settotalTargetsAnimation(true);
    settotalBalanceAnimation(true);
  }, [totalSales]);

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      console.log('focus on per team');
      LoadPerTeam();

      if (DashboardYears.length > 0) {
        console.log('With data');
      } else {
        Alert.alert(
          'NOTE:',
          'Please update application data first. ',
          [
            {
              text: 'UPDATE NOW',
              onPress: () => {
                CurrentAppScreen.Screen = 'UPDATEMDL';
                props.navigation.navigate('UpdateModal');
     
              },
            },
            {
              text: 'CANCEL',
              onPress: () => {
                props.navigation.navigate('Home');
              },
            },
          ],
          {cancelable: true},
        );
      }
    });
  }, []);

  useEffect(() => {
    if (CurrentDashboardScreen.Screen === 'PERTEAM') {
      LoadPerTeamFiltered();
    }
  }, [FilterList.DashboardFilterYearNMonthTeam]);

  function LoadPerTeam() {
    GetlineChartColLocalData();
    GetlineChartBottomLocalData();
    setLineChartAnimation(true);
    GetSummary();
    GetBottomPerTeam4LocalData();
    setTotalTeamANimation(true);
    GetDateTime();
  }

  function LoadPerTeamFiltered() {
    GetlineChartColLocalData();
    GetlineChartBottomLocalData();
    setLineChartAnimation(true);
    GetSummary();
    GetBottomPerTeam4LocalData();
    setTotalTeamANimation(true);
  }

  //TOP LINE CHART               >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  function GetlineChartColLocalData() {
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

    dbperymtsat.transaction((tx) => {
      tx.executeSql(
        'SELECT (sum(amount) / 1000000) as amount FROM perymtsat_tbl ' +
          ' where  ' +
          YearQuery +
          ' GROUP BY business_month  ORDER BY invoice_date asc',
        [],
        (tx, results) => {
          var temp = [];
          var lengthcal = 0;
          lengthcal = results.rows.length * 0.04;
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i).amount);
          }
          // console.log(temp);
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

    dbperymtsat.transaction((tx) => {
      tx.executeSql(
        'SELECT distinct  business_month FROM perymtsat_tbl ' +
          ' where  ' +
          YearQuery +
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
        ' and business_month =  ' +
        "'" +
        moment().utcOffset('+08:00').format('MMMM') +
        "'";
    } else {
      MonthQuery =
        ' and business_month = ' + "'" + FilterList.DashboardFilterMonth + "'";
    }

    dbperymtsat.transaction((tx) => {
      tx.executeSql(
        'SELECT  SUM(amount) as amount , SUM(target)   as target FROM perymtsat_tbl  where  ' +
          YearQuery +
          MonthQuery +
          ' order by invoice_date asc ',
        [],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            //setTotalSales();
            setTotalTarget(parseInt(results.rows.item(0).target));
            setTotalSales(parseInt(results.rows.item(0).amount));
            setisLoadingActivityIndicator(false);
          }
        },
        SQLerror,
      );
    });
  }

  function GetDateTime() {
    dbperymtsat.transaction((tx) => {
      tx.executeSql(
        'select dateTimeUpdated from (select DISTINCT(dateTimeUpdated) ,substr(dateTimeUpdated,1,10) as datecut,case when dateTimeUpdated like ' +
          "'%PM%'" +
          ' THEN (substr(dateTimeUpdated,12,2)) + 12 else (substr(dateTimeUpdated,12,2))  end as timecut from perymtsat_tbl) as q1 order by datecut desc,   CAST((timecut) AS UNSIGNED)  desc limit 1',
        [],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            setDateTime(results.rows.item(0).dateTimeUpdated);
          }
        },
        SQLerror,
      );
    });
  }

  function GetBottomPerTeam4LocalData() {
    // console.log(FilterList.DashboardFilterMonth);
    // console.log(FilterList.DashboardFilterYear);
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
        ' and business_month = ' + "'" + FilterList.DashboardFilterMonth + "'";
    }

    dbperymtsat.transaction((tx) => {
      tx.executeSql(
        'SELECT team, sum(amount) as sales, sum(target) as target, sum(target) as achievement ' +
          ' FROM perymtsat_tbl  where  ' +
          YearQuery +
          MonthQuery +
          ' group by business_year, business_month, team' +
          ' order by CAST((sales) AS UNSIGNED)   DEsc ',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          if (temp.length > 0) {
            setperTeam4(temp);
          } else {
            perTeam4.length = 0;
          }
        },
        SQLerror,
      );
    });
  }

  return (
    // ===================================================================================================================
    <View style={{flex: 1}}>
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
        <View style={{flexDirection: 'column'}}>
          <View style={{margin: moderateScale(5), flex: 1}}>
            <View style={{flexDirection: 'row', height: scale(70)}}>
              {/* <Image
                style={styles.CompanyLogo}
                source={{
                  uri:
                    'https://public-winganmarketing.sgp1.digitaloceanspaces.com/products/LOGO%20-%20Copy.png',
                }}
              /> */}
              <View style={{width: 50}}>
                <TouchableOpacity onPress={() => props.navigation.openDrawer()}>
                  <Icon name="list-outline" color={'#ffffff'} size={34} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => {
                  {
                    DashboardYears.length > 0
                      ? (setisVisibleModalFilter(true),
                        (CurrentDashboardScreen.Screen = 'PERTEAM'))
                      : null;
                  }
                }}>
                <Text
                  style={{
                    paddingBottom: moderateScale(10),
                    alignSelf: 'center',
                    fontSize: moderateScale(28),
                    color: 'white',
                    fontWeight: 'bold',
                    marginLeft: width / 2 - scale(145),
                  }}>
                  Per Team
                </Text>
              </TouchableOpacity>
              <View style={styles.textLastUpdateView}>
                <Text style={styles.textLastUpdate}>Last Update</Text>
                <Text style={styles.textLastUpdate}>
                  {dateTime.substring(0, 10)}
                </Text>
                <Text style={styles.textLastUpdate}>
                  {dateTime.substring(11, 50)}
                </Text>
              </View>
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
                width={scale(585)}
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

            {/* <Button
              title="Test"
              onPress={() => {
                console.log(DashboardYears.length);
              }}
            /> */}
          </View>
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
                colors={['#F5AD80', '#FF773E']}
                style={SUmmaryStyle}>
                <View style={styles.LinearTextView}>
                  <Text style={styles.LinearTopBottomText}>
                    {FilterList.DashboardFilterMonth === ''
                      ? moment().utcOffset('+08:00').format('MMMM')
                      : FilterList.DashboardFilterMonth}{' '}
                    {FilterList.DashboardFilterYear === ''
                      ? moment().utcOffset('+08:00').format('YYYYY')
                      : FilterList.DashboardFilterYear}
                    {' sales'}
                  </Text>
                  <Text style={styles.LinearCenterText}>
                    P
                    {numbro(totalSales).format({
                      thousandSeparated: true,
                      mantissa: 2,
                    })}
                  </Text>
                  <Text style={styles.LinearTopBottomText}>Current sales </Text>
                </View>
              </LinearGradient>
            </Animatable.View>
            <Animatable.View
              useNativeDriver={true}
              delay={200}
              animation={totalTargetAnimation ? 'fadeInRight' : undefined}
              onAnimationEnd={() => settotalTargetsAnimation(false)}>
              <LinearGradient
                opacity={0.9}
                start={{x: 0, y: 1}}
                end={{x: 1, y: 1}}
                colors={['#99C0E8', '#1D85F0']}
                style={SUmmaryStyle}>
                <View style={styles.LinearTextView}>
                  <Text style={styles.LinearTopBottomText}>
                    {FilterList.DashboardFilterMonth === ''
                      ? moment().utcOffset('+08:00').format('MMMM')
                      : FilterList.DashboardFilterMonth}{' '}
                    {FilterList.DashboardFilterYear === ''
                      ? moment().utcOffset('+08:00').format('YYYY')
                      : FilterList.DashboardFilterYear}
                    {' target'}
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
              <Animatable.View />
            </Animatable.View>
          </View>
          <View style={styles.LinearView}>
            <Animatable.View
              useNativeDriver={true}
              delay={400}
              animation={totalAchievementAnimation ? 'fadeInLeft' : undefined}
              onAnimationEnd={() => settotalAchivementAnimation(false)}>
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
                    {FilterList.DashboardFilterYear === ''
                      ? moment().utcOffset('+08:00').format('YYYY')
                      : FilterList.DashboardFilterYear}
                    {' achievement'}
                  </Text>
                  <Animatable.Text
                    animation="pulse"
                    easing="ease-out-back"
                    iterationCount={500}
                    iterationDelay={100}
                    style={{textAlign: 'center', fontSize: scale(22)}}>
                    🏆
                  </Animatable.Text>
                  <Text
                    style={[
                      styles.LinearCenterText,
                      {alignSelf: 'center', fontSize: scale(30)},
                    ]}>
                    {totalTarget > 0
                      ? numbro(summaryPercentage).format({
                          thousandSeparated: true,
                          mantissa: 2,
                        })
                      : 0}
                    %
                  </Text>
                  <Text style={styles.LinearTopBottomText}>Achievement</Text>
                </View>
              </LinearGradient>
            </Animatable.View>
            <Animatable.View
              useNativeDriver={true}
              delay={400}
              animation={totalBalanceAnimation ? 'fadeInRight' : undefined}
              onAnimationEnd={() => settotalBalanceAnimation(false)}>
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
                    {FilterList.DashboardFilterYear === ''
                      ? moment().utcOffset('+08:00').format('YYYY')
                      : FilterList.DashboardFilterYear}
                    {' balance'}
                  </Text>
                  <Text style={styles.LinearCenterText}>
                    P
                    {numbro(summaryBaltoSell).format({
                      thousandSeparated: true,
                      mantissa: 2,
                    })}
                  </Text>
                  <Text style={styles.LinearTopBottomText}>
                    Current balance to sell{' '}
                  </Text>
                </View>
              </LinearGradient>
            </Animatable.View>
          </View>

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
                    team: 'TEAM',
                    sales: 'SALES',
                    target: 'TARGET',
                    achievement: 'ACHIEVEMENT',
                  },
                ]}
                renderItem={renderData}
                initialNumToRender={5}
                maxToRenderPerBatch={10}
                windowSize={10}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
            <View style={{height: perTeam4.length * scale(75)}}>
              <FlatList
                data={perTeam4}
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
                      height: MothFilterWidth,
                      alignSelf: 'center',
                    }}>
                    <View style={{padding: 5}}>
                      <View>
                        <Text>Year :</Text>

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
                            setfilterMainView(monthList.length * scale(85));
                            setMothFilterWidth(monthList.length * scale(75));
                          }}
                          onClose={() => {
                            setfilterMainView(scale(200));
                            setMothFilterWidth(scale(100));
                          }}
                          placeholder="Select Year"
                          dropDownMaxHeight={scale(290)}
                          containerStyle={{height: 40}}
                          isVisible={false}
                          items={monthList}
                          defaultValue={MonthSelected}
                          onChangeItem={(itemValue) => {
                            FilterList.DashboardFilterMonth = itemValue.value;
                            LoadPerTeam();
                            setMonthSelected(itemValue.value);
                            setisVisibleFilterModal(false);
                          }}
                        />
                      </View>

                      <View style={{marginTop: 20}}>
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
                            setfilterMainView(monthList.length * scale(85));
                            setMothFilterWidth(monthList.length * scale(75));
                          }}
                          onClose={() => {
                            setfilterMainView(scale(200));
                            setMothFilterWidth(scale(100));
                          }}
                          placeholder="Select Month"
                          dropDownMaxHeight={scale(290)}
                          containerStyle={{height: 40}}
                          isVisible={false}
                          items={monthList}
                          // multiple={true}
                          // multipleText="%d items have been selected."
                          // min={0}
                          // max={10}
                          defaultValue={MonthSelected}
                          onChangeItem={(itemValue) => {
                            FilterList.DashboardFilterMonth = itemValue.value;
                            LoadPerTeam();
                            setMonthSelected(itemValue.value);
                            setisVisibleFilterModal(false);
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal> */}
        </View>
      </ScrollView>
    </View>
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
    margin: scale(10),
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
  FilterMainView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(22),
    height: scale(330),
  },
  FilterCenteredView: {
    height: scale(200),
    width: scale(300),
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
