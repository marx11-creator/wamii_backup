/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {dbBusinessCalendar} from '../../database/sqliteSetup';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import FlatButton from '../../sharedComponents/custombutton';
import {
  scale,
  moderateScale,
  verticalScale,
  width,
  height,
} from '../../sharedComponents/scaling';
import {
  APIToken,
  globalCompany,
  server,
  CurrentAppScreen,
} from '../../sharedComponents/globalCommands/globalCommands';
var isMonthChanged = false;
var BusinessCalendarField = {
  year: '',
  month: '',
  update_version: 0,
};
var SelectedDaysString = '';
export default function BusinessCalendar(props) {
  // var marked1 = {
  //   '2020-09-09': {startingDay: true, color: 'red'},
  //   '2020-09-10': {color: 'red'},
  //   '2020-09-12': {endingDay: true, color: 'red'},
  // };

  const [totalDays, settotalDays] = useState(moment().format('YYYY-MM'));
  const [selectedDays, setselectedDays] = useState([]);
  const [currMonth, setcurrMonth] = useState({});
  const [ModalMessage, setModalMessage] = useState('');
  const [isEditing, setisEditing] = useState(false);
  const [isVisibleCaldendarModal, setisVisibleCaldendarModal] = useState(false);
  const [markedDates1, setmarkedDates1] = useState({});
  const [InitialSelectedDays, setInitialSelectedDays] = useState(0);
  const [isMonthMoveEnabled, setisMonthMoveEnabled] = useState(0);
  const [YearMonthToSearch, setYearMonthToSearch] = useState([
    {
      year: moment().format('YYYY'),
      month: moment().format('MM'),
    },
  ]);
  useEffect(() => {
    props.navigation.addListener('focus', () => {
      console.log('focus on Business Calendar');
      CurrentAppScreen.Screen = 'BusinessCalendar';
      GetSelectedDays(YearMonthToSearch);
    });
  }, []);

  useEffect(() => {
    // console.log('triggered');
    setcurrMonth(markedDates1);
    UpdateSelected();
  }, [markedDates1]);

  useEffect(() => {
    if (isMonthChanged === true) {
      // console.log('triggered change month');
      if (YearMonthToSearch.year !== '') {
        GetSelectedDays();
      }
    }
  }, [YearMonthToSearch]);

  // useEffect(()=> {
  //   GetSelectedDays();
  // },[InitialSelectedDays])

  function UpdateSelected() {
    // console.log('function run');
    var obj = selectedDays.reduce(
      (c, v) =>
        Object.assign(c, {
          [v]: {selected: true, selectedColor: '#38F156'},
        }),
      {},
    );
    setcurrMonth(obj);
  }

  function SQLerror(err) {
    console.log('SQL Error: ' + err);
  }

  function GetSelectedDays() {
    var YearToSearch = '';
    var MonthToSearch = '';
    YearMonthToSearch.map((key, index) => {
      YearToSearch = key.year;
      MonthToSearch = key.month;
    });

    dbBusinessCalendar.transaction((tx) => {
      tx.executeSql(
        'SELECT  * from business_calendar_tbl  where year = ? and month = ? order by date asc  ',
        [YearToSearch, MonthToSearch],
        (tx, results) => {
          var temp = [];
          // console.log(YearToSearch + ' ' + MonthToSearch);
          selectedDays.length = 0;
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i).date);
            selectedDays.push(results.rows.item(i).date);
            BusinessCalendarField.year = results.rows.item(0).year;
            BusinessCalendarField.month = results.rows.item(0).month;
            BusinessCalendarField.update_version = results.rows.item(
              0,
            ).update_version;
          }
          // setInitialSelectedDays(0);
          setInitialSelectedDays(results.rows.length);

          if (temp.length === results.rows.length) {
            var obj = temp.reduce(
              (c, v) =>
                Object.assign(c, {
                  [v]: {selected: true, selectedColor: '#38F156'},
                }),
              {},
            );
            setcurrMonth(obj);
          }
        },
        SQLerror,
      );
    });
  }

  function SaveSelectedDays() {
    var YearToSearch = '';
    var MonthToSearch = '';
    YearMonthToSearch.map((key, index) => {
      YearToSearch = key.year;
      MonthToSearch = key.month;
    });

    // Promise.race([
    //   fetch(
    //     server.server_address +
    //       '/business_calendar/delete/' +
    //       YearToSearch +
    //       '&' +
    //       MonthToSearch,
    //     {
    //       method: 'DELETE',
    //       headers: {
    //         Accept: 'application/json',
    //         'Content-Type': 'application/json',
    //         Authorization: 'Bearer ' + APIToken.access_token,
    //       },
    //       body: JSON.stringify({
    //         dataString: SelectedDaysString.slice(0, -1),
    //       }),
    //     },
    //   ),
    //   new Promise((_, reject) =>
    //     setTimeout(() => reject(new Error('Timeout')), 40000),
    //   ),
    // ])
    //   .then((responseData) => {
    //     return responseData.json();
    //   })
    //   .then((jsonData) => {
    //     console.log('done');
    //   })
    //   .catch(function (error) {
    //     console.log('error in SAVING ONLINE BUSINESS CALENDAR : ' + error);
    //   })
    //   .done();

    var currIndex = 0;
    var newUpdateVersion =
      Number(BusinessCalendarField.update_version) + Number(1);
    SelectedDaysString = '';
    selectedDays.map(function (item, index) {
      currIndex = currIndex + 1;
      SelectedDaysString =
        SelectedDaysString +
        "('" +
        item +
        "'" +
        ',' +
        "'" +
        moment(item).format('YYYY') +
        "'" +
        ',' +
        "'" +
        moment(item).format('MM') +
        "'" +
        ',' +
        "'" +
        moment(item).format('DD') +
        "'" +
        ',' +
        "'" +
        item +
        "'" +
        ',' +
        "'" +
        item +
        "'" +
        ',' +
        "'" +
        newUpdateVersion +
        "'" +
        '),';
    });
    if (currIndex === selectedDays.length) {
      var YEAR_MONTH_FILTER =
        'year=' + YearToSearch + '&' + 'month=' + MonthToSearch;
      Promise.race([
        fetch(
          server.server_address +
            globalCompany.company +
            'business_calendar/update?' +
            YEAR_MONTH_FILTER,
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + APIToken.access_token,
            },
            body: JSON.stringify({
              dataString: SelectedDaysString.slice(0, -1),
            }),
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
          setInitialSelectedDays(selectedDays.length);
          console.log('done');
        })
        .catch(function (error) {
          console.log('1error in SAVING ONLINE BUSINESS CALENDAR : ' + error);
        })
        .done();
    }

    dbBusinessCalendar.transaction(function (tx) {
      tx.executeSql(
        'Delete from business_calendar_tbl where year = ? and month = ?   ',
        [YearToSearch, MonthToSearch],
        (tx, results) => {
          dbBusinessCalendar.transaction(function (tx) {
            tx.executeSql(
              'INSERT INTO business_calendar_tbl (date, year, month, day, constant_type, constant_value, update_version) VALUES ' +
                SelectedDaysString.slice(0, -1),
              [],
              (tx, results) => {
                setInitialSelectedDays(selectedDays.length);
                GetSelectedDays();
              },
              SQLerror,
            );
          });
        },
        SQLerror,
      );
    });
  }

  const BusinessCalendarEdit = () => {
    if (BusinessCalendarField.year === '') {
      BusinessCalendarField.year = 'XXXX';
    }
    if (BusinessCalendarField.month === '') {
      BusinessCalendarField.month = 'XX';
    }
    if (BusinessCalendarField.update_version === '') {
      BusinessCalendarField.update_version = 'XX';
    }

    var YEAR_MONTH_UPDATE_VERSION_FILTER =
      'year=' +
      BusinessCalendarField.year +
      '&' +
      'month=' +
      BusinessCalendarField.month +
      '&' +
      'update_version=' +
      BusinessCalendarField.update_version;

    Promise.race([
      fetch(
        server.server_address +
          globalCompany.company +
          'business_calendar/edit?' +
          YEAR_MONTH_UPDATE_VERSION_FILTER,
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
        jsonData.map((item, index) => {
          if (index < 1) {
            if (item.message === 'unmatched') {
              console.log('unmatched');
              BusinessCalendarDownload();
            } else {
              setisVisibleCaldendarModal(false);
              setisEditing(true);
            }
          }
        });
      })
      .catch(function (error) {
        setModalMessage('Error : ' + error);
      })
      .done();
  };

  const BusinessCalendarDownload = () => {
    var BusinessCalendarString = '';
    var CurrIndex = 0;

    Promise.race([
      fetch(
        server.server_address +
          globalCompany.company +
          'business_calendar/get/',
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
          jsonData.map((item, index) => {
            if (index < 1) {
              BusinessCalendarField.update_version = item.update_version;
            }
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

                        setisVisibleCaldendarModal(false);
                        setisEditing(true);
                        GetSelectedDays();
                      },
                      SQLerror,
                    );
                  });
                },
                SQLerror,
              );
            });
          }
        } else {
          setisVisibleCaldendarModal(false);
          setisEditing(true);
        }
      })
      .catch(function (error) {
        console.log('error in BusinessCalendarDownload :' + error);
      })
      .done();
  };

  return (
    <View style={{flex: 1, backgroundColor: '#ffffff', margin: 5}}>
      <View style={{flexDirection: 'row', height: scale(70)}}>
        <LinearGradient
          colors={['#08d4c4', '#01ab9d']}
          style={{
            width: '100%',
            height: 50,
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              height: '100%',
            }}>
            <View style={{marginLeft: 5, justifyContent: 'center'}}>
              <TouchableOpacity onPress={() => props.navigation.openDrawer()}>
                <Ionicons name="md-filter" color={'#ffffff'} size={36} />
              </TouchableOpacity>
            </View>

            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '80%',
              }}>
              <Text
                style={{
                  fontSize: moderateScale(20, 0.5),
                  color: '#ffffff',
                  fontWeight: 'bold',
                }}>
                Business Calendar
              </Text>
            </View>
          </View>
        </LinearGradient>

        <Text
          style={{
            paddingBottom: moderateScale(10),
            alignSelf: 'center',
            fontSize: moderateScale(28),
            color: 'white',
            fontWeight: 'bold',
            marginLeft: width / 2 - scale(145),
          }}>
          Business Calendar
        </Text>
      </View>

      <View style={{margin: 1}}></View>

      <View>
        <Calendar
          // Initially visible month. Default = Date()
          current={moment().format('YYYY-MM-DD')}
          // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
          minDate={'2010-08-10'}
          // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
          maxDate={'2029-11-20'}
          // Handler which gets executed on day press. Default = undefined
          onDayPress={(day) => {
            if (isEditing === false) {
              Alert.alert(
                'Note',
                'Please Edit first.',
                [
                  {
                    text: 'OK',
                  },
                ],
                {cancelable: true},
              );
            } else {
              var isSelected = false;

              selectedDays.map((item, index) => {
                if (day.dateString === item) {
                  isSelected = true;
                  console.log(
                    day.dateString + ' is already selected, removing..',
                  );

                  var toRemove = day.dateString;
                  var index = selectedDays.indexOf(toRemove);
                  if (index > -1) {
                    selectedDays.splice(index, 1);
                  }

                  setmarkedDates1({});
                  setcurrMonth({});
                }
              });

              if (isSelected === false) {
                selectedDays.push(day.dateString);
                console.log(day.dateString + ' is NOT selected, adding..');

                setmarkedDates1({
                  ...markedDates1,
                  [day.dateString]: {
                    selected: true,
                    selectedColor: '#38F156',
                  },
                });
              }
            }
          }}
          // Handler which gets executed on day long press. Default = undefined
          onDayLongPress={(day) => {
            console.log('selected day', day);
          }}
          // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
          monthFormat={'MMMM yyyy'}
          // Handler which gets executed when visible month changes in calendar. Default = undefined
          onMonthChange={(dateString) => {
            setisEditing(false);
            isMonthChanged = true;

            setcurrMonth();
            selectedDays.length = 0;
            setYearMonthToSearch([
              {
                year: dateString.year,
                month: moment(dateString.dateString).format('MM'),
              },
            ]);

            settotalDays(moment(dateString.dateString).format('YYYY-MM'));
          }}
          // Hide month navigation arrows. Default = false
          hideArrows={false}
          // Replace default arrows with custom ones (direction can be 'left' or 'right')
          renderArrow={(direction) => {
            if (direction === 'left') {
              if (isMonthMoveEnabled === 0) {
                // console.log('equal');
                return (
                  <Icon
                    name="calendar-arrow-left"
                    color={'#43DF48'}
                    size={26}
                  />
                );
              } else {
                // console.log('equal');
                return (
                  <Icon name="calendar-arrow-left" color={'red'} size={26} />
                );
              }
            }
            if (direction === 'right') {
              if (isMonthMoveEnabled === 0) {
                return (
                  <Icon
                    name="calendar-arrow-right"
                    color={'#43DF48'}
                    size={26}
                  />
                );
              } else {
                return (
                  <Icon name="calendar-arrow-right" color={'red'} size={26} />
                );
              }
            }
          }}
          // Do not show days of other months in month page. Default = false
          hideExtraDays={false}
          // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
          // day from another month that is visible in calendar page. Default = false
          disableMonthChange={true}
          // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
          firstDay={1}
          // Hide day names. Default = false
          hideDayNames={false}
          // Show week numbers to the left. Default = false
          showWeekNumbers={false}
          // Handler which gets executed when press arrow icon left. It receive a callback can go back month

          onPressArrowLeft={(subtractMonth) => {
            console.log(isMonthMoveEnabled);
            if (isMonthMoveEnabled === 1) {
              console.log(isMonthMoveEnabled);
              Alert.alert(
                'Note',
                'Please Update first.',
                [
                  {
                    text: 'OK',
                  },
                ],
                {cancelable: true},
              );
            } else {
              subtractMonth();
            }
          }}
          // Handler which gets executed when press arrow icon right. It receive a callback can go next month
          onPressArrowRight={(addMonth) => {
            console.log(isMonthMoveEnabled);
            if (isMonthMoveEnabled === 1) {
              console.log(isMonthMoveEnabled);
              Alert.alert(
                'Note',
                'Please Update first.',
                [
                  {
                    text: 'OK',
                  },
                ],
                {cancelable: true},
              );
            } else {
              addMonth();
            }
          }}
          // Disable left arrow. Default = false
          disableArrowLeft={false}
          // Disable right arrow. Default = false
          disableArrowRight={false}
          // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
          disableAllTouchEventsForDisabledDays={false}
          // Replace default month and year title with custom one. the function receive a date as parameter.
          // renderHeader={(date) => {
          //   date.
          // }}

          // renderHeader={(monthFormat) => {

          //   return (
          //     <TouchableOpacity>
          //       <Text>{monthFormat}</Text>
          //     </TouchableOpacity>
          //   );
          // }}
          // Enable the option to swipe between months. Default = false
          enableSwipeMonths={true}
          // Specify style for calendar container element. Default = {}
          style={{
            borderWidth: 1,
            borderColor: 'gray',
          }}
          // Specify theme properties to override specific styles for calendar parts. Default = {}

          // dayComponent={({date, state}) => {
          //   return (
          //     <View>
          //       <Text
          //         style={{
          //           textAlign: 'center',
          //           color: state === 'disabled' ? '#DFE2E0' : '',
          //         }}>
          //         {date.day}
          //       </Text>
          //     </View>
          //   );
          // }}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            textSectionTitleDisabledColor: '#d9e1e8',
            selectedDayBackgroundColor: '#00adf5',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#00adf5',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: '#00adf5',
            selectedDotColor: '#ffffff',
            arrowColor: 'orange',
            disabledArrowColor: '#d9e1e8',
            monthTextColor: 'green',
            indicatorColor: 'blue',
            textDayFontFamily: 'monospace',
            textMonthFontFamily: 'monospace',
            textDayHeaderFontFamily: 'monospace',
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 16,
            borderWidth: 2,
            borderColor: 'red',
          }}
          markedDates={currMonth}
          markingType={'simple'}
        />
        {/* <Button
          title="CONSOLE"
          onPress={() => {
            console.log(selectedDays);
          }}
        />
        <Button
          title="DELETE"
          onPress={() => {
          GetSelectedDays();
          }}
        /> */}
        <View
          style={{
            marginTop: 20,
            alignItems: 'flex-end',
            width: '100%',
          }}>
          <View style={{marginRight: 20}}>
            <FlatButton
              width={160}
              text={isEditing ? 'UPDATE' : 'EDIT'}
              onPress={() => {
                if (global.account_type === 'Developer') {
                  if (isEditing === false) {
                    setisMonthMoveEnabled(1);
                   
                    setisVisibleCaldendarModal(true);
                    setModalMessage('Checking for updates...');
                    BusinessCalendarEdit();
                    GetSelectedDays();
                  } else {
                    SaveSelectedDays();
                    setisEditing(false);
                    setisMonthMoveEnabled(0);
                    GetSelectedDays();
                  }
                } else {
                  Alert.alert(
                    'Note',
                    'You are not authorize to update business calendar.',
                    [
                      {
                        text: 'OK',
                      },
                    ],
                    {cancelable: true},
                  );
                }
              }}
              gradientFrom={isEditing ? '#F3769A' : '#08d4c4'}
              gradientTo={isEditing ? '#B41845' : '#02D76C'}
            />
          </View>

          <Modal
            animationType="none"
            transparent={true}
            visible={isVisibleCaldendarModal}
            onRequestClose={() => {
              setisVisibleCaldendarModal(false);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>{ModalMessage}</Text>

                {/* <TouchableHighlight
                  style={{...styles.openButton, backgroundColor: 'orangered'}}
                  onPress={() => {
                    setisVisibleCaldendarModal(!isVisibleCaldendarModal);
                  }}>
                  <Text style={styles.textStyle}> Close </Text>
                </TouchableHighlight> */}
              </View>
            </View>
          </Modal>
        </View>

        <View
          style={{
            justifyContent: 'space-around',
            backgroundColor: '#ffffff',
            height: 100,
            borderColor: '#0AAC5B',
            borderWidth: 1,
            marginTop: 30,
            margin: 10,
          }}>
          <Text
            style={{
              marginLeft: 5,
              color: '#0AC869',
              fontSize: moderateScale(20, 0.5),
              fontWeight: 'bold',
            }}>
            Working Day(s) : {selectedDays.length}
            {'\n'}
            {'\n'}
            Total Days : {moment(totalDays, 'YYYY-MM').daysInMonth()}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalView: {
    margin: moderateScale(20, 0.5),
    width: scale(400),
    height: scale(120),
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
    opacity: 1,
  },
  modalText: {
    marginBottom: moderateScale(15, 0.5),
    textAlign: 'center',
  },
});

// '2020-09-09': {startingDay: true, color: 'green'},
// '2020-09-10': {selected: true, endingDay: true, color: 'green', textColor: 'gray'},
{
  /* <Button
          title="close"
          onPress={() => {
            var nextDay = ['2018-06-20', '2018-06-28', '2018-06-29'];

            var obj = nextDay.reduce(
              (c, v) =>
                Object.assign(c, {
                  [v]: {selected: true, selectedColor: '#38F156'},
                }),
              {},
            );
            setcurrMonth(obj);
          }}
        />
        <Button
          title="clear markeddateds"
          onPress={() => {
            UpdateSelected();
          }}
        />
        <Button
          title="console markeddateds"
          onPress={() => {
            console.log(markedDates1);
            console.log('///////////////////');
            console.log(currMonth);
            console.log('///////////////////');
            console.log(selectedDays);
          }}
        /> */
}
