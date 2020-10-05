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
  YellowBox,
  Button,
  Alert,
} from 'react-native';

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
import {dbperarea} from '../../database/sqliteSetup';
import numbro from 'numbro';
import FlatButton from '../../sharedComponents/custombutton';
import DropDownPicker from 'react-native-dropdown-picker';
import moment from 'moment';
import {ProgressCircle} from 'react-native-svg-charts';

import {PieChart} from 'react-native-svg-charts';
import {Text as Text2} from 'react-native-svg';
import {
  CurrentDashboardScreen,
  FilterList,
  DashboardYears,
  CurrentAppScreen,
  hhmmss,
  LastDateTimeUpdated,
  globalStatus,
  PageVisited,
} from '../../sharedComponents/globalCommands/globalCommands';
import Icon from 'react-native-vector-icons/Ionicons';
import DashboardModal from '../Dashboard/DashboardModal';
import PageContextGlobalState from '../MainDrawerScreens/pagecontext';
import PageContextGlobalTimer from '../MainDrawerScreens/pagecontext2';
export default function PerAreaDashboard(props) {
  LogBox.ignoreAllLogs();
  YellowBox.ignoreWarnings(['']);

  // ----------------------------------------------------------------------------------------------------------

  const renderData = ({item}) => {
    return (
      <View style={styles.DetailView}>
        <View style={{flex: 2.9}}>
          <Text
            style={[styles.DetailtText, {marginLeft: 3, width: scale(140)}]}>
            {item.team}
          </Text>
        </View>

        <View style={{flex: 1.8}}>
          <Text style={[styles.DetailtText, {marginLeft: moderateScale(25)}]}>
            {item.sales}
          </Text>
        </View>

        <View style={{flex: 1.2, marginLeft: 10}}>
          <Text style={[styles.DetailtText, {marginLeft: moderateScale(25)}]}>
            {item.target}
          </Text>
        </View>

        <View style={{flex: 1.8}}>
          <Text
            style={[
              styles.DetailtText,
              {
                width: scale(115),
                marginLeft: scale(10),
                fontSize: moderateScale(14, 0.5),
              },
            ]}>
            {item.achievement}
          </Text>
        </View>
      </View>
    );
  };

  const renderDataDetails = ({item, index}) => {
    return (
      <View style={[styles.DetailViewDetails]}>
        <View
          style={{
            flex: 3,
            flexDirection: 'column',
            marginBottom: moderateScale(10),
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: colors[index],
                marginLeft: moderateScale(10),
                borderRadius: 60,
                width: moderateScale(18),
                height: moderateScale(18),
              }}></View>
            <Text
              style={[
                styles.DetailtTextDetails,
                ,
                {
                  width: scale(130),
                  fontSize: moderateScale(13.5),
                  marginLeft: moderateScale(15),
                },
              ]}>
              {item.province}
            </Text>
          </View>
        </View>
        <View style={{flex: 1.8}}>
          <Text style={[styles.DetailtTextDetails, {marginLeft: 2}]}>
            P {numFormatter(item.sales1)}
          </Text>
        </View>

        <View style={{flex: 1.5}}>
          <Text
            style={[
              styles.DetailtTextDetails,
              {marginLeft: moderateScale(25)},
            ]}>
            {item.uba}
          </Text>
        </View>

        <View style={{flex: 1.2}}>
          <Text
            style={[styles.DetailtTextDetails, {marginLeft: moderateScale(5)}]}>
            {numbro((item.sales1 / totalSales) * 100).format({
              thousandSeparated: true,
              mantissa: 2,
            })}{' '}
            %
          </Text>
        </View>
      </View>
    );
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

  function numFormatter1M(num) {
    return (num / 1000000).toFixed(2); // convert to M for number from > 1 million
  }

  function SQLerror(err) {
    console.log('SQL Error: ' + err);
  }
  const [globalState, setglobalState] = useContext(PageContextGlobalState);
  const [globalTimer, setglobalTimer] = useContext(PageContextGlobalTimer);
  
  const [dateTime, setDateTime] = useState('');
  const [isVisibleFilterModal, setisVisibleFilterModal] = useState(false);
  const [filterMainView, setfilterMainView] = useState(scale(360));
  const [MonthSelected, setMonthSelected] = useState('');
  const [MonthFilterHeight, setMonthFilterHeight] = useState(scale(250));
  const [isVisibleModalFilter, setisVisibleModalFilter] = useState(false);
  const [LineChartAnimation, setLineChartAnimation] = useState(true);

  const [totalTeamAnimation, setTotalTeamANimation] = useState(true);

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

  const [monthList, setMonthList] = useState(monthListFields);
  const [teamList, setTeamList] = useState(teamListFields);

  //const for summary

  const perAreafield = [
    {
      business_year: '',
      business_month: '',
      province: '',
      sales1: '',
      uba: '',
    },
  ];

  //const for bottom per team report
  const [perArea, setPerArea] = useState(perAreafield);
  const [totalSales, setTotalSales] = useState(0);

  const [CurrentContribution, setCurrentContribution] = useState(0);
  const [DynamicPrincipalList, setDynamicPrincipalList] = useState(['']);
  const [DynamicPrincipalSales, setDynamicPrincipalSales] = useState([1]);

  //USE EFFECT PART

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      console.log('focus on per area focus'); //
      CurrentAppScreen.Screen = 'PerArea';
      if (PageVisited.PerAreaPAGE === 'NO') {
        PageVisited.PerAreaPAGE = 'YES';
        console.log('focus on per area with changes');

        // LOAD PER PRINCIPAL     >>>>>>>>>>>>>>>>>
        SearchPrincipal();

        if (perArea.length > 1 && totalSales > 1) {
          // IF SEARCHING  FOR MONTH AND AMOUNT IS DONE
          var temp = [];
          perArea.map((item, index) => {
            //BUILD PRINCIPAL ACONYM
            temp.push(item.principal_acronym);
          });

          var tempSales = [];
          var firstContribution = 1;
          perArea.map((item, index) => {
            // BUILD PRINCIPAL SALES
            tempSales.push(((item.sales1 / totalSales) * 100).toFixed(2) * 1);
            if (firstContribution === 1) {
              setCurrentContribution(
                ((item.sales1 / totalSales) * 100).toFixed(2) * 1,
              );
              firstContribution = 0;
            }
          });

          if (temp.length === tempSales.length) {
            //  POPULATE NEEDED DATA
            setDynamicPrincipalList(temp);
            setDynamicPrincipalSales(tempSales);
          }
        }
      }
    });
  }, []);

  useEffect(() => {
    console.log('focus on per area from update'); //

    // LOAD PER PRINCIPAL     >>>>>>>>>>>>>>>>>
    SearchPrincipal();

    if (perArea.length > 1 && totalSales > 1) {
      // IF SEARCHING  FOR MONTH AND AMOUNT IS DONE
      var temp = [];
      perArea.map((item, index) => {
        //BUILD PRINCIPAL ACONYM
        temp.push(item.principal_acronym);
      });

      var tempSales = [];
      var firstContribution = 1;
      perArea.map((item, index) => {
        // BUILD PRINCIPAL SALES
        tempSales.push(((item.sales1 / totalSales) * 100).toFixed(2) * 1);
        if (firstContribution === 1) {
          setCurrentContribution(
            ((item.sales1 / totalSales) * 100).toFixed(2) * 1,
          );
          firstContribution = 0;
        }
      });

      if (temp.length === tempSales.length) {
        //  POPULATE NEEDED DATA
        setDynamicPrincipalList(temp);
        setDynamicPrincipalSales(tempSales);
      }
    }
  }, [globalState.dateTimeUpdated24hr]);

  useEffect(() => {
    if (CurrentDashboardScreen.Screen === 'PERAREA') {
      console.log('focus on per area from dashboard global'); //
      PageVisited.PerAreaPAGE = 'YES';
      // LOAD PER PRINCIPAL     >>>>>>>>>>>>>>>>>
      SearchPrincipal();

      if (perArea.length > 1 && totalSales > 1) {
        // IF SEARCHING  FOR MONTH AND AMOUNT IS DONE
        var temp = [];
        perArea.map((item, index) => {
          //BUILD PRINCIPAL ACONYM
          temp.push(item.principal_acronym);
        });

        var tempSales = [];
        var firstContribution = 1;
        perArea.map((item, index) => {
          // BUILD PRINCIPAL SALES
          tempSales.push(((item.sales1 / totalSales) * 100).toFixed(2) * 1);
          if (firstContribution === 1) {
            setCurrentContribution(
              ((item.sales1 / totalSales) * 100).toFixed(2) * 1,
            );
            firstContribution = 0;
          }
        });

        if (temp.length === tempSales.length) {
          //  POPULATE NEEDED DATA
          setDynamicPrincipalList(temp);
          setDynamicPrincipalSales(tempSales);
        }
      }
    }
  }, [FilterList.DashboardFilterYearNMonthTeam]);

  useEffect(() => {
    //SETUP DYNAMIC PIE CHART LIST AND PERCENTAGE
    if (perArea.length > 1 && totalSales > 1) {
      var temp = [];
      perArea.map((item, index) => {
        temp.push(item.province);
      });

      var tempSales = [];
      var firstContribution = 1;
      perArea.map((item, index) => {
        tempSales.push(((item.sales1 / totalSales) * 100).toFixed(2) * 1);
        if (firstContribution === 1) {
          setCurrentContribution(
            ((item.sales1 / totalSales) * 100).toFixed(2) * 1,
          );
          firstContribution = 0;
        }
      });

      if (temp.length === tempSales.length) {
        setDynamicPrincipalList(temp);
        setDynamicPrincipalSales(tempSales);
        // console.log('matched!');
      }
    }
  }, [perArea]);

  useEffect(() => {
    if (perArea.length > 1 && totalSales > 1) {
      var temp = [];
      perArea.map((item, index) => {
        temp.push(item.province);
      });

      var tempSales = [];
      var firstContribution = 1;
      perArea.map((item, index) => {
        tempSales.push(((item.sales1 / totalSales) * 100).toFixed(2) * 1);
        if (firstContribution === 1) {
          setCurrentContribution(
            ((item.sales1 / totalSales) * 100).toFixed(2) * 1,
          );
          firstContribution = 0;
        }
      });

      if (temp.length === tempSales.length) {
        setDynamicPrincipalList(temp);
        setDynamicPrincipalSales(tempSales);
        // console.log('matched!');
      }
    }
  }, [totalSales]);

  const selectedSliceFields = {
    label: '',
    value: 0,
  };
  const [selectedSlice, setselectedSlice] = useState(selectedSliceFields);

  //pie
  const {label, value} = selectedSlice;
  const keys = DynamicPrincipalList;
  const values = DynamicPrincipalSales;
  const colors = [
    '#F4568F',
    '#45A9F0',
    '#67EC56',
    '#F2BF61',
    '#FCA228',
    '#600080',
    '#9900cc',
    '#c61aff',
    '#d966ff',
    '#ecb3ff',
    '#600080',
    '#9900cc',
    '#c61aff',
    '#d966ff',
    '#ecb3ff',
    '#600080',
    '#9900cc',
    '#c61aff',
    '#d966ff',
    '#ecb3ff',
    '#600080',
    '#9900cc',
    '#c61aff',
    '#d966ff',
    '#ecb3ff',
    '#600080',
    '#9900cc',
    '#c61aff',
    '#d966ff',
    '#ecb3ff',
    '#600080',
    '#9900cc',
    '#c61aff',
    '#d966ff',
    '#ecb3ff',
    '#600080',
    '#9900cc',
    '#c61aff',
    '#d966ff',
    '#ecb3ff',
  ];

  const data = keys.map((key, index) => {
    var pieLabel = index;
    if (pieLabel < 5) {
      pieLabel = keys[index];
    } else {
      pieLabel = '';
    }
    return {
      key,
      value: values[index],
      amount: pieLabel,
      svg: {fill: colors[index]},
      arc: {
        padAngle: label === key ? 0.1 : 0,
      },
    };
  });

  const Labels = ({slices, height, width}) => {
    return slices.map((slice, index) => {
      const {labelCentroid, pieCentroid, data} = slice;
      return (
        <Text2
          key={index}
          x={pieCentroid[0]}
          y={pieCentroid[1]}
          fill={'white'}
          textAnchor={'middle'}
          alignmentBaseline={'middle'}
          fontSize={moderateScale(16)}
          fontWeight={'bold'}
          stroke={'black'}
          strokeWidth={0.2}>
          {data.amount}
        </Text2>
      );
    });
  };

  function SearchPrincipal() {
    GetBottomPerAreaLocalData();
    setisVisibleFilterModal(false);
  };

  //CENTER 4 SUMMARY                     >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  function GetBottomPerAreaLocalData() {
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
        ' and  business_month = ' + "'" + FilterList.DashboardFilterMonth + "'";
    }

    dbperarea.transaction((tx) => {
      tx.executeSql(
        'SELECT business_year, business_month, province,   sum(sales) as sales1, sum(uba)  as uba FROM perareapermonth_tbl  where ' +
          YearQuery +
          MonthQuery +
          ' group by business_year, business_month,  province' +
          ' ORDER BY CAST(sales1 AS UNSIGNED) desc  ',
        [],
        (tx, results) => {
          var temp = [];
          var tempSales = 0;
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
            tempSales = tempSales + results.rows.item(i).sales1;
          }
          if (temp.length > 0) {
            setPerArea(temp);
            setTotalSales(tempSales);

            setTotalTeamANimation(true);
            // console.log(
            //   results.rows.length +
            //     'BottomPerAreaLocalData Successfully read on local',
            // );
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
          <View
            style={{
              flexDirection: 'row',
              height: scale(90),

              alignContent: 'center',
              alignItems: 'center',
            }}>
            {/* <Image
              style={styles.CompanyLogo}
              source={{
                uri:
                  'https://public-winganmarketing.sgp1.digitaloceanspaces.com/products/LOGO%20-%20Copy.png',
              }}
            /> */}

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
                      (CurrentDashboardScreen.Screen = 'PERAREA'))
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
                  marginLeft: width / 2 - scale(185),
                }}>
                Sales Per Area
              </Text>
            </TouchableOpacity>
            {/* <View style={styles.textLastUpdateView}>
              <Text style={styles.textLastUpdate}>Last Update</Text>
              <Text style={styles.textLastUpdate}>
                {dateTime.substring(0, 10)}
              </Text>
              <Text style={styles.textLastUpdate}>
                {dateTime.substring(11, 50)}
              </Text>
            </View> */}
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
          <View style={{margin: moderateScale(5)}}>
            <View>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  fontSize: moderateScale(20),
                }}>
                {FilterList.DashboardFilterMonth}{' '}
                {FilterList.DashboardFilterYear}
              </Text>
              <Animatable.View
                style={{justifyContent: 'center', marginTop: -scale(29)}}
                useNativeDriver={true}
                delay={500}
                animation={LineChartAnimation ? 'fadeIn' : undefined}
                onAnimationEnd={() => setLineChartAnimation(false)}>
                <Text
                  style={{
                    position: 'absolute',
                    alignSelf: 'center',
                    fontSize: moderateScale(25),
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                  }}>
                  {numFormatter(totalSales)}
                </Text>
                <PieChart
                  style={{height: scale(400), opacity: 1}}
                  outerRadius={'100%'}
                  innerRadius={'40%'}
                  data={data}>
                  <Labels />
                </PieChart>
              </Animatable.View>
              {/* <Button
              title="Test"
              onPress={() => console.log(PageVisited)}
            /> */}
            </View>
          </View>

          <Animatable.View
            style={{marginTop: 0}}
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
                    team: 'PROVINCE',
                    sales: 'SALES',
                    target: 'UBA',
                    achievement: 'Contribution',
                  },
                ]}
                renderItem={renderData}
                initialNumToRender={5}
                maxToRenderPerBatch={10}
                windowSize={10}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
            <View style={{height: perArea.length * moderateScale(65, 0.5)}}>
              <FlatList
                data={perArea}
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
                    <View style={{padding: 5}}>
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
                          setfilterMainView(scale(380));
                          setMonthFilterHeight(scale(300));
                        }}
                        placeholder="Select Month"
                        dropDownMaxHeight={330}
                        containerStyle={{height: scale(70)}}
                        isVisible={false}
                        items={monthList}
                        // multiple={true}
                        // multipleText="%d items have been selected."
                        // min={0}
                        // max={10}
                        defaultValue={MonthSelected}
                        onChangeItem={(itemValue) => {
                          setMonthSelected(itemValue.value);
                        }}
                      />
                      {/* <View style={{marginTop: 20}}>
                    <Text>Team :</Text>
                    <DropDownPicker
                      style={{backgroundColor: '#F1F8F5'}}
                      dropDownStyle={{backgroundColor: '#F1F8F5'}}
                      onOpen={() => {
                        setfilterMainView(scale(700));
                        setMonthFilterHeight(scale(600));
                      }}
                      onClose={() => {
                        setfilterMainView(scale(400));
                        setMonthFilterHeight(scale(360));
                      }}
                      placeholder="Select Team"
                      dropDownMaxHeight={330}
                      containerStyle={{height: 50}}
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
                  </View> */}
          {/* </View>
                    <View
                      style={{
                        alignSelf: 'flex-end',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: moderateScale(20),
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
                          SearchPrincipal();
                        }}
                        gradientFrom="red"
                        gradientTo="pink"
                      />
                    </View>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback> */}
          {/* </Modal>  */}
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
    color: '#FFFFFF',
    fontSize: moderateScale(15, 0.5),
    fontWeight: 'bold',
  },
  DetailView: {
    flexDirection: 'row',
    marginHorizontal: scale(10),
    borderWidth: 0.4,
    marginTop: 10,
    borderColor: '#FFFFFF',
  },
  DetailtTextDetails: {
    width: scale(120),
    color: '#FFFFFF',
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
    marginLeft: 5,
    marginTop: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderateScale(22),
  },
  modalView: {
    margin: moderateScale(20),
    backgroundColor: 'white',
    borderRadius: 20,
    padding: moderateScale(35),
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
