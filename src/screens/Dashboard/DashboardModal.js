/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Button,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import {
  FilterList,
  FilterListMirror,
  CurrentDashboardScreen,
  CurrentAppScreen,
} from '../../sharedComponents/globalCommands/globalCommands';
import {PageVisited} from '../../sharedComponents/globalCommands/globalCommands';

import {
  scale,
  moderateScale,
  verticalScale,
  width,
  height,
} from '../../sharedComponents/scaling';
import DropDownPicker from 'react-native-dropdown-picker';
import FlatButton from '../../sharedComponents/custombutton';
import moment from 'moment';
import {
  dbperprincipal,
  dbperarea,
  dbperymtsat,
  dbinventory,
  dbSalesmanNet,
  dblastdatetimeupdated,
  dbsystem_users,
} from '../../database/sqliteSetup';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/Ionicons';
import PageContextGlobalDashboard from '../MainDrawerScreens/pagecontextGlobalDashboard';

export default function DashboardModal(props) {
  const [GlobalDashboardfilter, setGlobalDashboardfilter] = useContext(
    PageContextGlobalDashboard,
  );
  const [YearValue, setYearValue] = useState(GlobalDashboardfilter.YearValue);
  const [MonthValue, setMonthValue] = useState(
    GlobalDashboardfilter.MonthValue,
  );
  const [VendorValue, setVendorValue] = useState(
    GlobalDashboardfilter.VendorValue,
  );
  const [TeamValue, setTeamValue] = useState(GlobalDashboardfilter.TeamValue);

  const [Months, setMonths] = useState([]);
  const [Vendors, setVendors] = useState([]);
  const [Teams, setTeams] = useState([]);

  useEffect(() => {
    GetVendorsforFilter();
    GetTeamsforFilter();
    // GetYearforFilter();
    if (GlobalDashboardfilter.YearValue === '') {
      GetMonthsforFilter(moment().utcOffset('+08:00').format('YYYY'));
    } else {
      GetMonthsforFilter(GlobalDashboardfilter.YearValue);
    }
  }, []);

  // useEffect(() => {
  //   setTeams(DashboardTeams);
  // }, [DashboardTeams]);

  // useEffect(() => {teamqu
  //   Months.length = 0;
  //   setMonths(DashboardMonths);
  // }, [DashboardMonths]);

  // useEffect(() => {
  //   if (GlobalDashboardfilter.YearValue !== '') {
  //     GetMonthsforFilter();
  //   }
  // }, [GlobalDashboardfilter.YearValue]);
  function GetVendorsforFilter() {
    dbperprincipal.transaction((tx) => {
      tx.executeSql(
        'SELECT Distinct principal_name as label, principal_name as value FROM perprincipalpermonth_tbl ' +
          ' where  business_year = 2020 ' +
          ' order  by principal_name  ',
        [],
        (tx, results) => {
          var temp = [];
          var len = results.rows.length;

          if (len > 1) {
            temp.push({
              label: 'ALL',
              value: 'ALL',
            });
          }

          if (len > 0) {
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
              // DashboardVendor.push({
              //   label: results.rows.item(i).label,
              //   value: results.rows.item(i).value,
              // });
            }
            setVendors(temp);
          }
        },
      );
    });
  }

  function GetTeamsforFilter() {
    dbperymtsat.transaction((tx) => {
      tx.executeSql(
        'SELECT Distinct team as label, team as value FROM perymtsat_tbl ' +
          ' where  business_year = 2020 ' +
          ' and team in ' +
          global.TeamAccessList +
          ' order  by team  ',
        [],
        (tx, results) => {
          var len = results.rows.length;
          var temp = [];
          if (len > 1) {
            temp.push({
              label: 'ALL',
              value: 'ALL',
            });
          }

          if (len > 0) {
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
            setTeams(temp);
          }
        },
      );
    });
  }

  function GetMonthsforFilter(value) {
    var YearQuery = '';
    if (value === '') {
      YearQuery =
        ' where  business_year = ' +
        "'" +
        moment().utcOffset('+08:00').format('YYYY') +
        "'";
    } else {
      YearQuery = ' where business_year = ' + "'" + value + "'";
    }

    dbperymtsat.transaction((tx) => {
      tx.executeSql(
        'SELECT Distinct business_month as label, business_month as value FROM perymtsat_tbl ' +
          YearQuery +
          ' ORDER BY  invoice_date   desc ',
        [],
        (tx, results) => {
          var temp = [];
          var len = results.rows.length;
          if (len > 0) {
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));

              // DashboardMonths.push({
              //   label: results.rows.item(i).label,
              //   value: results.rows.item(i).value,
              // });
            }
            setMonths(temp);
          } else {
            console.log('nmf');
          }
          SQLerror;
        },
      );
    });
  }

  function GetYearforFilter() {
    // console.log('years adding from START..');
    dbperymtsat.transaction((tx) => {
      tx.executeSql(
        'SELECT Distinct business_year as label, business_year as value FROM perymtsat_tbl ' +
          'order  by invoice_date desc ',
        [],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            for (let i = 0; i < results.rows.length; ++i) {
              DashboardYears.push({
                label: results.rows.item(i).label,
                value: results.rows.item(i).value,
              });
            }
            // console.log('YEARS LOADED');
          }
        },
      );
    });
  }

  return (
    <Modal
      transparent={true}
      animationInTiming={200}
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
      visible={props.display}
      animationType="none"
      onRequestClose={() => {
        props.closeDisplay();

        FilterListMirror.DashboardFilterYear = FilterList.DashboardFilterYear;
        FilterListMirror.DashboardFilterMonth = FilterList.DashboardFilterMonth;
        FilterListMirror.DashboardFilterTeam = FilterList.DashboardFilterTeam;
        FilterListMirror.DashboardFilterVendor =
          FilterList.DashboardFilterVendor;
      }}>
      <TouchableWithoutFeedback>
        <View style={[styles.FilterMainView]}>
          <View style={[styles.FilterCenteredView]}>
            <View
              style={{
                flex: 1,
                padding: 5,
                backgroundColor: '##EBFAEB',
                width: scale(450),
                alignSelf: 'center',
              }}>
              {/* YEAR >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/}
              <View
                style={{
                  marginHorizontal: 5,
                  justifyContent: 'space-around',
                  alignContent: 'space-between',
                }}>
                <Text>Year :</Text>
              </View>
              <View paddingVertical={2} />
              <RNPickerSelect
                placeholder={{
                  label: 'Select Year',
                  value: null,
                  color: 'green',
                }}
                items={[
                  {
                    label: '2020',
                    value: '2020',
                  },
                  {
                    label: '2019',
                    value: '2019',
                  },
                ]}
                onValueChange={(value) => {
                  // setGlobalDashboardfilter({
                  //   ...GlobalDashboardfilter,
                  //   YearValue: value,
                  //   MonthValue: '',
                  // });
                  setYearValue(value);
                  GetMonthsforFilter(value);
                  // setMonthValue('');
                  // setYearValue(value);
                  FilterListMirror.DashboardFilterYear = value;
                }}
                style={{
                  iconContainer: {
                    top: 10,
                    right: 12,
                  },
                  inputAndroid: {
                    borderColor: 'green',
                    fontSize: 16,
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                    borderWidth: 0.5,
                    borderRadius: 8,
                    color: 'black',
                    paddingRight: 30, // to ensure the text is never behind the icon
                  },
                }}
                value={YearValue}
                useNativeAndroidPickerStyle={false}
                textInputProps={{underlineColor: 'yellow'}}
                Icon={() => {
                  return <Icon name="md-arrow-down" size={24} color="gray" />;
                }}
              />
              <View paddingVertical={5} />
              {/* YEAR >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/}
              {/* MONTH >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/}
              <View
                style={{
                  marginHorizontal: 5,
                  justifyContent: 'space-around',
                  alignContent: 'space-between',
                }}>
                <Text>Month :</Text>
              </View>
              <View paddingVertical={2} />
              <RNPickerSelect
                placeholder={{
                  label: 'Select Month',
                  value: null,
                  color: 'green',
                }}
                items={Months}
                onValueChange={(value) => {
                  // setMonthValue(value);
                  FilterListMirror.DashboardFilterMonth = value;
                  setMonthValue(value);
                }}
                style={{
                  iconContainer: {
                    top: 10,
                    right: 12,
                  },
                  inputAndroid: {
                    borderColor: 'green',
                    fontSize: 16,
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                    borderWidth: 0.5,
                    borderRadius: 8,
                    color: 'black',
                    paddingRight: 30, // to ensure the text is never behind the icon
                  },
                }}
                value={MonthValue}
                useNativeAndroidPickerStyle={false}
                textInputProps={{underlineColor: 'yellow'}}
                Icon={() => {
                  return <Icon name="md-arrow-down" size={24} color="gray" />;
                }}
              />
              <View paddingVertical={5} />
              {/* MONTH >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/}
              {/* VENDORS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/}

              {CurrentAppScreen.Screen === 'SalesmanNet' ? null : (
                <View>
                  <View
                    style={{
                      marginHorizontal: 5,
                      justifyContent: 'space-around',
                      alignContent: 'space-between',
                    }}>
                    <Text>Vendor :</Text>
                  </View>
                  <View paddingVertical={2} />
                  <RNPickerSelect
                    placeholder={{
                      label: 'Select Vendor',
                      value: null,
                      color: 'green',
                    }}
                    items={Vendors}
                    onValueChange={(value) => {
                      setVendorValue(value);

                      FilterListMirror.DashboardFilterVendor = value;
                    }}
                    style={{
                      iconContainer: {
                        top: 10,
                        right: 12,
                      },
                      inputAndroid: {
                        borderColor: 'green',
                        fontSize: 16,
                        paddingHorizontal: 10,
                        paddingVertical: 8,
                        borderWidth: 0.5,
                        borderRadius: 8,
                        color: 'black',
                        paddingRight: 30, // to ensure the text is never behind the icon
                      },
                    }}
                    value={VendorValue}
                    useNativeAndroidPickerStyle={false}
                    textInputProps={{underlineColor: 'yellow'}}
                    Icon={() => {
                      return (
                        <Icon name="md-arrow-down" size={24} color="gray" />
                      );
                    }}
                  />
                  <View paddingVertical={5} />
                  {/* VENDORS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/}
                  {/* TEAMS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/}
                  <View
                    style={{
                      marginHorizontal: 5,
                      justifyContent: 'space-around',
                      alignContent: 'space-between',
                    }}>
                    <Text>Teams :</Text>
                  </View>
                  <View paddingVertical={2} />
                  <RNPickerSelect
                    placeholder={{
                      label: 'Select Team',
                      value: null,
                      color: 'green',
                    }}
                    items={Teams}
                    onValueChange={(value) => {
                      setTeamValue(value);
                      FilterListMirror.DashboardFilterTeam = value;
                    }}
                    style={{
                      iconContainer: {
                        top: 10,
                        right: 12,
                      },
                      inputAndroid: {
                        borderColor: 'green',
                        fontSize: 16,
                        paddingHorizontal: 10,
                        paddingVertical: 8,
                        borderWidth: 0.5,
                        borderRadius: 8,
                        color: 'black',
                        paddingRight: 30, // to ensure the text is never behind the icon
                      },
                    }}
                    value={TeamValue}
                    useNativeAndroidPickerStyle={false}
                    textInputProps={{underlineColor: 'yellow'}}
                    Icon={() => {
                      return (
                        <Icon name="md-arrow-down" size={24} color="gray" />
                      );
                    }}
                  />
                  <View paddingVertical={5} />
                  {/* TEAMS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/}
                </View>
              )}

              {/* <View
                style={{
                  //                                                 YEAR >>>>>>>>>>>>>>>>
                  marginHorizontal: 5,
                  justifyContent: 'space-around',
                  alignContent: 'space-between',
                }}>
                <Text>Year :</Text>
              </View>
              <View
                style={{
                  marginHorizontal: 5,
                  marginBottom: 10,
                  justifyContent: 'space-around',
                  alignContent: 'space-between',
                }}>
                <DropDownPicker
                  style={{backgroundColor: '#F1F8F5', marginTop: 10}} //  YEAR >>>>>>>>>>>>>>>>
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
                    setisVisibleYear(true);
                    setisVisibleMonth(false);
                    setisVisibleTeam(false);
                    setisVisibleVendor(false);
                  }}
                  onClose={() => {
                    setisVisibleYear(false);
                    setisVisibleMonth(false);
                    setisVisibleTeam(false);
                    setisVisibleVendor(false);
                  }}
                  placeholder="Select Year"
                  dropDownMaxHeight={scale(290)}
                  containerStyle={{height: 50}}
                  isVisible={isVisibleYear}
                  items={DashboardYears}
                  defaultValue={
                    FilterList.DashboardFilterYear === ''
                      ? moment().utcOffset('+08:00').format('YYYYY')
                      : FilterList.DashboardFilterYear
                  }
                  onChangeItem={(itemValue) => {
                    // setarrMonth([]);
                    FilterListMirror.DashboardFilterMonth = '';
                    FilterListMirror.DashboardFilterYear = itemValue.value;
                    // GetMonthsforFilter();
                  }} //                                                YEAR >>>>>>>>>>>>>>>>
                />
              </View>

              <View
                style={{
                  marginHorizontal: 5,
                  marginBottom: 20,
                  justifyContent: 'space-around',
                  alignContent: 'space-between',
                }}></View>
              <View
                style={{
                  //                                                MONTH >>>>>>>>>>>>>>>>
                  marginHorizontal: 5,
                  justifyContent: 'space-around',
                  alignContent: 'space-between',
                }}>
                <Text>Month :</Text>
              </View>
              <View
                style={{
                  marginHorizontal: 5,
                  marginBottom: 20,
                  justifyContent: 'space-around',
                  alignContent: 'space-between',
                }}>
                <DropDownPicker
                  style={{backgroundColor: '#F1F8F5', marginTop: 10}} //   MONTH >>>>>>>>>>>>>>>>
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
                    setisVisibleYear(false);
                    setisVisibleMonth(true);
                    setisVisibleTeam(false);
                    setisVisibleVendor(false);
                  }}
                  onClose={() => {
                    setisVisibleYear(false);
                    setisVisibleMonth(false);
                    setisVisibleTeam(false);
                    setisVisibleVendor(false);
                  }}
                  placeholder={moment().utcOffset('+08:00').format('MMMM')}
                  dropDownMaxHeight={scale(290)}
                  containerStyle={{height: 50}}
                  isVisible={isVisibleMonth}
                  defaultValue={FilterList.DashboardFilterMonth}
                  items={DashboardMonths}
                  onChangeItem={(itemValue) => {
                    FilterListMirror.DashboardFilterMonth = itemValue.value;
                    //setMonthState(itemValue.value);
                  }} //                                                MONTH >>>>>>>>>>>>>>>>
                />
              </View>

              <View
                style={{
                  //                                                 TEAM>>>>>>>>>>>>>>>>
                  marginHorizontal: 5,
                  marginBottom: 25,
                  justifyContent: 'space-around',
                  alignContent: 'space-between',
                }}>
                <Text>Vendor :</Text>

                <DropDownPicker
                  style={{backgroundColor: '#F1F8F5', marginTop: 10}} // TEAM>>>>>>>>>>>>>>>>
                  dropDownStyle={{backgroundColor: '#F1F8F5'}}
                  labelStyle={{
                    fontSize: 12,
                    textAlign: 'left',
                    color: '#000',
                  }}
                  itemStyle={{
                    justifyContent: 'flex-start',
                  }}
                  onOpen={() => {
                    setisVisibleYear(false);
                    setisVisibleMonth(false);
                    setisVisibleTeam(false);
                    setisVisibleVendor(true);
                  }}
                  onClose={() => {
                    setisVisibleYear(false);
                    setisVisibleMonth(false);
                    setisVisibleTeam(false);
                    setisVisibleVendor(false);
                  }}
                  placeholder="Select Vendor"
                  dropDownMaxHeight={scale(290)}
                  containerStyle={{height: 50}}
                  isVisible={isVisibleVendor}
                  defaultValue={FilterList.DashboardFilterVendor}
                  items={DashboardVendor}
                  onChangeItem={(itemValue) => {
                    FilterListMirror.DashboardFilterVendor = itemValue.value;
                  }} //                                               TEAM>>>>>>>>>>>>>>>>
                />
              </View>

              <View
                style={{
                  //                                                 TEAM>>>>>>>>>>>>>>>>
                  marginHorizontal: 5,
                  marginBottom: 25,
                  justifyContent: 'space-around',
                  alignContent: 'space-between',
                }}>
                <Text>Team :</Text>

                <DropDownPicker
                  style={{backgroundColor: '#F1F8F5', marginTop: 10}} // TEAM>>>>>>>>>>>>>>>>
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
                    setisVisibleYear(false);
                    setisVisibleMonth(false);
                    setisVisibleTeam(true);
                    setisVisibleVendor(false);
                  }}
                  onClose={() => {
                    setisVisibleYear(false);
                    setisVisibleMonth(false);
                    setisVisibleTeam(false);
                    setisVisibleVendor(false);
                  }}
                  placeholder="Select Team"
                  dropDownMaxHeight={scale(290)}
                  containerStyle={{height: 50}}
                  isVisible={isVisibleTeam}
                  items={DashboardTeams}
                  defaultValue={FilterList.DashboardFilterTeam}
                  onChangeItem={(itemValue) => {
                    FilterListMirror.DashboardFilterTeam = itemValue.value;
                  }} //                                               TEAM>>>>>>>>>>>>>>>>
                />
              </View> */}

              <View
                style={{
                  alignItems: 'flex-end',
                }}>
                <FlatButton
                  width={160}
                  text="Filter"
                  onPress={() => {
                    if (FilterListMirror.DashboardFilterMonth === null) {
                      Alert.alert(
                        'System Message',
                        'Please Select Month.',
                        [
                          {
                            text: 'OK',
                          },
                        ],
                        {cancelable: true},
                      );
                    } else {
                      if (FilterListMirror.DashboardFilterYear === '') {
                        FilterListMirror.DashboardFilterYear =
                          FilterList.DashboardFilterYear;
                      }
                      if (FilterListMirror.DashboardFilterMonth === '') {
                        FilterListMirror.DashboardFilterMonth =
                          FilterList.DashboardFilterMonth;
                      }
                      if (FilterListMirror.DashboardFilterTeam === '') {
                        FilterListMirror.DashboardFilterTeam =
                          FilterList.DashboardFilterTeam;
                      }

                      if (FilterListMirror.DashboardFilterVendor === '') {
                        FilterListMirror.DashboardFilterVendor =
                          FilterList.DashboardFilterVendor;
                      }

                      PageVisited.PerTeamPAGE = 'NO';
                      PageVisited.PerAreaPAGE = 'NO';
                      PageVisited.PerSalesmanPAGE = 'NO';
                      PageVisited.PerPrincipalPAGE = 'NO';

                      FilterList.DashboardFilterYearNMonthTeamVendor =
                        FilterListMirror.DashboardFilterYear +
                        FilterListMirror.DashboardFilterMonth +
                        FilterListMirror.DashboardFilterTeam +
                        FilterListMirror.DashboardFilterVendor;

                      FilterList.DashboardFilterYear =
                        FilterListMirror.DashboardFilterYear;

                      FilterList.DashboardFilterMonth =
                        FilterListMirror.DashboardFilterMonth;

                      FilterList.DashboardFilterTeam =
                        FilterListMirror.DashboardFilterTeam;

                      FilterList.DashboardFilterVendor =
                        FilterListMirror.DashboardFilterVendor;

                      setGlobalDashboardfilter({
                        ...GlobalDashboardfilter,
                        YearValue: FilterListMirror.DashboardFilterYear,
                        MonthValue: FilterListMirror.DashboardFilterMonth,
                        VendorValue: FilterListMirror.DashboardFilterVendor,
                        TeamValue: FilterListMirror.DashboardFilterTeam,
                      });

                      props.closeDisplay();
                    }
                  }}
                  gradientFrom="red"
                  gradientTo="pink"
                />
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    marginTop: 30,
    height: 200,
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 100,
    height: 200,
  },
  text: {
    color: '#3f2949',
    marginTop: 10,
  },
  FilterMainView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  FilterCenteredView: {
    height: height - 50,
    width: width - 40,
    margin: scale(20),
    backgroundColor: '#ffffff',
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
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

{
  /* <Modal
        animationType={'slide'}
        transparent={true}
        visible={props.display}
        onRequestClose={() => {
          props.closeDisplay;
        }}>
        <View style={styles.modal}>
          <Text style={styles.text}>Modal is open!</Text>
          <Button
            title="close"
            onPress={() => {
              props.closeDisplay();
              FilterList.DashboardFilterMonth = 'April';
            }}
          />
        </View>
      </Modal> */
}
