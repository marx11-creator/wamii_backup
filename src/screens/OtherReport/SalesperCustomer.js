import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import {
  scale,
  moderateScale,
  verticalScale,
  width,
  height,
} from '../../sharedComponents/scaling';
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
import DashboardModal from './DashboardModal';
import moment, {months} from 'moment';

import {openDatabase} from 'react-native-sqlite-storage';

var db = openDatabase({name: 'Sales_report.db'});

export default function SalesperCustomer() {
  const [isVisibleModalFilter, setisVisibleModalFilter] = useState(false);

  let [FlatVendor, setFlatVendor] = useState([]);

  useEffect(() => {
    console.log('focus on per Customer Screen');
    CurrentAppScreen.Screen = 'SalesperCustomer';
    push_sales_per_customer();
  }, []);

  useEffect(() => {
    if (CurrentDashboardScreen.Screen === 'PERCUSTOMER') {
      console.log('CHANGE TRIGGERED');
      push_sales_per_customer();
    }
  }, [FilterList.DashboardFilterYearNMonthTeam]);

  function push_sales_per_customer() {
    //console.log(FilterList.DashboardFilterYear);
    //console.log(FilterList.DashboardFilterMonth);

    console.log('run');

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

    db.transaction((tx) => {
      var YearQuery = '';
      if (FilterList.DashboardFilterYear === '') {
        YearQuery = moment().utcOffset('+08:00').format('YYYY');
      } else {
        YearQuery = FilterList.DashboardFilterYear;
      }

      var MonthQuery = '';
      if (FilterList.DashboardFilterMonth === '') {
        MonthQuery = moment().utcOffset('+08:00').format('MM');
      } else {
        MonthQuery = moment()
          .month(FilterList.DashboardFilterMonth)
          .format('MM');
      }

      var DateFrom = YearQuery + '-' + MonthQuery + '-' + '01';
      var DateTo = YearQuery + '-' + MonthQuery + '-' + '31';

      console.log(DateFrom + ' ' + DateTo);

      tx.executeSql(
        'SELECT invoice_date, account_customer_name, principal_name, SUM(sales) AS sales FROM tbl_sales_per_customer WHERE invoice_date BETWEEN  ' +
          "'" +
          DateFrom +
          "'" +
          '  AND   ' +
          "'" +
          DateTo +
          "'" +
          '  GROUP BY account_customer_name ORDER BY sales DESC',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }

          //console.log(temp);

          setFlatVendor(temp);

          //setSectionListItems(temp);

          //setFlatListItems(temp);

          //setFormatted_SL(postsByCustomer);
        },
      );
    });
  }

  let listItemView = (item) => {
    //var percent = item.percent + 0;
    //percent = percent.toFixed(2);
    return (
      <View
        style={{
          height: 35,
          flexDirection: 'row',
          paddingVertical: 5,
          paddingHorizontal: 5,
          alignItems: 'center',
        }}>
        <View style={{flex: 4, borderWidth: 0}}>
          <Text
            style={{
              fontSize: moderateScale(15, 0.5),
              color: '#FFFFFF',
              marginLeft: 10,
              fontWeight: 'normal',
              alignSelf: 'flex-start',
            }}>
            {item.account_customer_name}
          </Text>
        </View>
        <View style={{flex: 1, borderWidth: 0}}>
          <Text
            style={{
              fontSize: moderateScale(15, 0.5),
              color: '#FFFFFF',
              fontWeight: 'normal',
              alignSelf: 'center',
            }}>
            {numFormatter(item.sales)}
          </Text>
        </View>
        <View style={{flex: 1, borderWidth: 0}}>
          <Text
            style={{
              fontSize: moderateScale(15, 0.5),
              color: '#FFFFFF',
              fontWeight: 'normal',
              alignSelf: 'center',
            }}>
            {numFormatter(item.sales)}
          </Text>
        </View>
        <View style={{flex: 1, borderWidth: 0}}>
          <Text
            style={{
              fontSize: moderateScale(15, 0.5),
              color: '#FFFFFF',
              fontWeight: 'normal',
              alignSelf: 'center',
            }}>
            {numFormatter(item.sales)}%
          </Text>
        </View>
      </View>
    );
  };

  function numFormatter(num) {
    if (num > 999 && num < 1000000) {
      return (num / 1000).toFixed(2) + 'K'; // convert to K for number from > 1000 < 1 million
    } else if (num > 999999) {
      return (num / 1000000).toFixed(2) + 'M'; // convert to M for number from > 1 million
    } else if (num < 1000) {
      return (num * 1).toFixed(2); // if value < 1000, nothing to do
    }
  }

  return (
    <View style={{flex: 1, backgroundColor: 'gray'}}>
      <TouchableOpacity
        onPress={() => {
          {
            DashboardYears.length > 0
              ? (setisVisibleModalFilter(true),
                (CurrentDashboardScreen.Screen = 'PERCUSTOMER'))
              : null;
          }
        }}>
        <Text
          style={{
            paddingBottom: moderateScale(10),
            alignSelf: 'center',
            fontSize: moderateScale(22),
            color: '#FFFFFF',
            fontWeight: 'bold',
            marginLeft: width / 3 - scale(185),
            paddingTop: 5,
          }}>
          Sales per Customer
        </Text>
        {isVisibleModalFilter ? (
          <DashboardModal
            display={isVisibleModalFilter}
            closeDisplay={() => setisVisibleModalFilter(false)} // <- we are passing this function
          />
        ) : null}
      </TouchableOpacity>
      <View style={{flex: 1}}>
        <View
          style={{
            height: scale(45),
            //borderWidth: 1,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            flexDirection: 'row',
            paddingVertical: 5,
            paddingHorizontal: 5,
            backgroundColor: '#10D070',
            alignItems: 'center',
          }}>
          <View style={{flex: 4, borderRightWidth: 1}}>
            <Text
              style={{
                alignSelf: 'flex-start',
                fontSize: moderateScale(15, 0.5),
                padding: 10,
              }}>
              Customer Name
            </Text>
          </View>
          <View style={{flex: 1, borderRightWidth: 1}}>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: moderateScale(15, 0.5),
                padding: 10,
              }}>
              Sales
            </Text>
          </View>
          <View style={{flex: 1, borderRightWidth: 1}}>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: moderateScale(15, 0.5),
                padding: 10,
              }}>
              Target
            </Text>
          </View>
          <View style={{flex: 1}}>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: moderateScale(15, 0.5),
                padding: 10,
              }}>
              ACHV
            </Text>
          </View>
        </View>
        <FlatList
          data={FlatVendor}
          // ItemSeparatorComponent={listViewItemSeparator}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => listItemView(item)}
        />
      </View>
    </View>
  );
}
