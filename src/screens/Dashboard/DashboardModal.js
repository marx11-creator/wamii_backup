/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
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
} from '../../sharedComponents/globalCommands/globalCommands';
import {
  DashboardMonths,
  DashboardYears,
  DashboardTeams,
  DashboardVendor,
  PageVisited,
} from '../../sharedComponents/globalCommands/globalCommands';

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
import {dbperymtsat} from '../../database/sqliteSetup';
export default function DashboardModal(props) {

  const [isVisibleYear, setisVisibleYear] = useState(false);
  const [isVisibleMonth, setisVisibleMonth] = useState(false);
  const [isVisibleTeam, setisVisibleTeam] = useState(false);
  const [isVisibleVendor, setisVisibleVendor] = useState(false);

  const [arrMonth, setarrMonth] = useState(DashboardMonths);
  const [MonthState, setMonthState] = useState('');
  // useEffect(() => {
  //   GetMonthsforFilter();
  // }, []);
  // function GetMonthsforFilter() {
  //   var month1 = '';

  //   var YearQuery = '';
  //   if (FilterListMirror.DashboardFilterYear === '') {
  //     YearQuery =
  //       '  business_year =  ' +
  //       "'" +
  //       moment().utcOffset('+08:00').format('YYYY') +
  //       "'";
  //   } else {
  //     YearQuery =
  //       ' business_year = ' + "'" + FilterListMirror.DashboardFilterYear + "'";
  //   }

  //   DashboardMonths.length = 0;

  //   console.log('from dashboard months adding..');
  //   dbperymtsat.transaction((tx) => {
  //     tx.executeSql(
  //       'SELECT Distinct business_month as label, business_month as value FROM perymtsat_tbl ' +
  //         ' where  ' +
  //         YearQuery +
  //         'order  by invoice_date desc ',
  //       [],
  //       (tx, results) => {
  //         var len = results.rows.length;
  //         if (len > 0) {
  //           var temp = [];
  //           for (let i = 0; i < results.rows.length; ++i) {
  //             if (i === 0) {
  //               month1 = results.rows.item(i).label;
  //             }
  //             temp.push(results.rows.item(i));

  //             setarrMonth(temp);

  //             setMonthState(month1);

  //             FilterListMirror.DashboardFilterMonth = month1;

  //             DashboardMonths.push({
  //               label: results.rows.item(i).label,
  //               value: results.rows.item(i).value,
  //             });
  //           }

  //           // TRANSFER TO GLOBAL MONTH-AO
  //         }
  //       },
  //     );
  //   });
  // }

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
              {/* <Button
                title="Test"
                onPress={() => {
                  console.log(FilterList.DashboardFilterYear + ' orig');
                  console.log(FilterListMirror.DashboardFilterYear + ' mirror');
                }}
              /> */}

              <View
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
              </View>

              <View
                style={{
                  alignItems: 'flex-end',
                }}>
                <FlatButton
                  width={160}
                  text="Filter"
                  onPress={() => {
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

                    props.closeDisplay();
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
