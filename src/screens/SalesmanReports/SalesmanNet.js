/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {useState, useEffect, useContext} from 'react';
import {FlatList, Text, View, SafeAreaView, Image, StyleSheet, TouchableOpacity, Button} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';
import { useFocusEffect } from '@react-navigation/native';
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
  LastDateTimeUpdated,
  hhmmss,
} from '../../sharedComponents/globalCommands/globalCommands';
import moment, { months } from 'moment';
import {ProgressCircle} from 'react-native-svg-charts';
import Icon from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import PageContext from '../MainDrawerScreens/pagecontext';
var db = openDatabase({name: 'Sales_report.db'});

export default function ViewScreen(props) {
  const [globalState, setglobalState] = useContext(PageContext);
 const [DateTimerefreshed, setDateTimerefreshed] = useState('none');
 const [grosssales, setgrosssales] = useState('');
 const [cmamount, setcmamount] = useState('');
 const [discount, setdiscount] = useState('');
 const [netsales, setnetsales] = useState('');
 const [target, settarget] = useState('');
 const [percent, setpercent] = useState('');

 const [focus_int, setfocus_int] = useState(0);

 const [showTop, setshowTop] = useState(true);
 const [showPrincipal, setshowPrincipal] = useState(true);
 const [showCustomer, setshowCustomer] = useState(true);
 const [showCategory, setshowCategory] = useState(true);

  // useEffect(() => {
  //   push_sales_net();
  //   // push_sales_per_customer();
  // });




  useEffect(() => {
    props.navigation.addListener('focus', () => {
      console.log('focus on per MARC'); //
      push_sales_net();
      push_sales_per_vendor();
      push_sales_per_customer();
      push_sales_per_category();
      setfocus_int(1);
    });
  }, []);



  useEffect(() => {

      console.log('focus on per MARC'); //
      push_sales_net();
      push_sales_per_vendor();
      push_sales_per_customer();
      push_sales_per_category();
      setfocus_int(1);

  }, [globalState.dateTimeUpdated24hr]);

  let [FlatListItems, setFlatListItems] = useState([]);
  let [FlatVendor, setFlatVendor] = useState([]);
  let [FlatCategory, setFlatCategory] = useState([]);

  function numFormatter(num) {
    if (num > 999 && num < 1000000) {
      return (num / 1000).toFixed(2) + 'K'; // convert to K for number from > 1000 < 1 million
    } else if (num > 999999) {
      return (num / 1000000).toFixed(2) + 'M'; // convert to M for number from > 1 million
    } else if (num < 1000) {
      return num; // if value < 1000, nothing to do
    }
  }

  function push_sales_net() {
console.log('push run')
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
        tx.executeSql('SELECT * from tbl_sales_net WHERE ' +  YearQuery +  MonthQuery, [], (tx, results) => {
     
        var net = [];
        for (let i = 0; i < results.rows.length; ++i) {
          net.push(results.rows.item(i));
          console.log(results.rows.length);
        }

          // console.log(temp);

        var get_time_date_refreshed = net.map(item => item.dateTimeUpdated);
        var get_gross_sales = net.map(item => item.total_gross_amount).toString();
        var get_discount = net.map(item => item.total_discount).toString();
        var get_cm = net.map(item => item.total_cm).toString();
        var get_net = net.map(item => item.total_net_amount);
        var get_target = net.map(item => item.total_target.toString());

        var get_net = get_gross_sales - get_discount - get_cm;
        var get_percent = get_net / get_target * 100;

        setDateTimerefreshed(get_time_date_refreshed.toString());
        setgrosssales(get_gross_sales);
        setcmamount(get_cm);
        setdiscount(get_discount);
        settarget(get_target);
        setnetsales(get_net);
        setpercent(get_percent.toFixed(2));
        // console.log(get_time_date_refreshed.toString());

      });
    });
  }

  function push_sales_per_vendor() {
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
      tx.executeSql('SELECT principal_acronym, principal_name, SUM(sales) AS total_amount, SUM(target) AS total_target, uba, (SUM(sales) / SUM(target) * 100) as percent FROM tbl_sales_per_vendor WHERE ' + YearQuery + MonthQuery + '  GROUP BY principal_name ', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        setFlatVendor(temp);
      });
    });
  }

  function push_sales_per_customer() {

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
        YearQuery =
          moment().utcOffset('+08:00').format('YYYY');
      } else {
        YearQuery =
         FilterList.DashboardFilterYear;
      }

      var MonthQuery = '';
      if (FilterList.DashboardFilterMonth === '') {
        MonthQuery = moment().utcOffset('+08:00').format('MM');
      } else {
        MonthQuery =
           moment().month(FilterList.DashboardFilterMonth).format('MM');
      }

      var DateFrom = YearQuery + '-' + MonthQuery + '-' + '01';
      var DateTo = YearQuery + '-' + MonthQuery + '-' + '31';


      tx.executeSql('SELECT invoice_date, account_customer_name, SUM(sales) AS sales, invoice_status_final FROM tbl_sales_per_customer WHERE invoice_date BETWEEN  ' + "'" + DateFrom + "'" + '  AND   ' + "'" + DateTo + "'" + '  GROUP BY invoice_date, account_customer_name ORDER BY invoice_date DESC', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }

        setFlatListItems(temp);
      });
    });
  }

  function push_sales_per_category() {

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
      tx.executeSql('SELECT product_category, SUM(sales) AS total_amount, SUM(target) AS total_target, (SUM(sales) / SUM(target) * 100) as percent FROM tbl_sales_per_category WHERE      ' + YearQuery + MonthQuery + '  GROUP BY product_category ', [], (tx, results) => {
        var temp = [];
        if (results.rows.length === 0) {
          setshowCategory(false);
        } else if (results.rows.length !== 0 ){
          setshowCategory(true);
        }
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        setFlatCategory(temp);
      });
    });
  }


  function Principals_shown() {
    setshowTop(false);
    setshowPrincipal(true);
    setshowCustomer(false);
  }

  function Customer_shown() {
    setshowTop(false);
    setshowPrincipal(false);
    setshowCustomer(true);
  }

  function All_shown() {
    setshowTop(true);
    setshowPrincipal(true);
    setshowCustomer(true);
  }

  let listViewItemSeparator = () => {
    return (
      <View style={{height: 0.8, width: '100%', backgroundColor: '#808080'}} />
    );
  };

  let listItemView = (item) => {
    var percent = item.percent + 0;
    percent = (percent).toFixed(2);
    return (

<View style={{height: 35, flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 5 ,alignItems: 'center'}}>
          <View style={{flex: 1,borderWidth: 0}}>
          <Text style={{fontSize: moderateScale(15, 0.5), color: '#FFFFFF', marginLeft: 10, fontWeight:'normal', alignSelf: 'flex-start'}}>{item.principal_acronym}</Text>
          </View>
          <View style={{flex: 1,borderWidth: 0}}>
          <Text style={{fontSize: moderateScale(15, 0.5), color: '#FFFFFF', fontWeight:'normal', alignSelf: 'center'}}>{numFormatter(item.total_target)}</Text>
          </View>
          <View style={{flex: 1,borderWidth: 0}}>
          <Text style={{fontSize: moderateScale(15, 0.5),color: '#FFFFFF', fontWeight:'normal', alignSelf: 'center'}}>{numFormatter(item.total_amount)}</Text>
          </View>
          <View style={{flex: 1,borderWidth: 0}}>
          <Text style={{fontSize: moderateScale(15, 0.5),color: '#FFFFFF',  fontWeight:'normal', alignSelf: 'center'}}>{percent}%</Text>
          </View>
          <View style={{flex: 1,borderWidth: 0}}>
          <Text style={{fontSize: moderateScale(15, 0.5), color: '#FFFFFF',  fontWeight:'normal', alignSelf: 'center'}}>{numFormatter(item.uba)}</Text>
          </View>
        </View>

    );
  };

  let listCategoryView = (item) => {
    var percent = item.percent + 0;
    percent = (percent).toFixed(2);
    return (
      <View key={item.user_id} style={{flexDirection: 'row', paddingVertical: 5}}>
        <View style={{flex: 1.5, borderWidth: 0,justifyContent: 'center', marginLeft: 10 }}>
          <Text style={{alignSelf: 'flex-start', color: '#ffffff', fontSize: moderateScale(12, 0.5)}}>{item.product_category}</Text>
          </View>
          <View style={{flex: 1, borderWidth: 0}}>
          <Text style={{alignSelf: 'center',  color: '#ffffff',fontSize: moderateScale(15, 0.5), padding: 2}}>{numFormatter(item.total_target)}</Text>
          </View>
          <View style={{flex: 1, borderWidth: 0}}>
          <Text style={{alignSelf: 'center', color: '#ffffff', fontSize: moderateScale(15, 0.5), padding: 2}}>{numFormatter(item.total_amount)}</Text>
          </View>
          <View style={{flex: 1, borderWidth: 0}}>
          <Text style={{alignSelf: 'center',  color: '#ffffff',fontSize: moderateScale(15, 0.5), padding: 2}}>{percent}%</Text>
        </View>
      </View>
    );
  };

  // let propStyle = (percent, base_degrees) => {
  //   const rotateBy = base_degrees + (percent * 3.6);
  //   return {
  //     transform:[{rotateZ: `${rotateBy}deg`}],
  //   };
  // };

  // let renderThirdLayer = (percent) => {
  //   if (percent > 100) {
  //     return (
  //       <View style={[styles.offsetLayer, propStyle((percent - 100), 45)]} />
  //     );
  //   } else if (percent > 50){
  //     return (
  //       <View style={[styles.secondProgressLayer, propStyle((percent - 50), 45)]} />
  //     );
  //   } else {
  //     return (
  //       <View style={styles.offsetLayer} />
  //     );
  //   }
  // };

  // const CircularProgress = ({percent}) => {
  //   let firstProgressLayerStyle;
  //   if (percent > 50){
  //     firstProgressLayerStyle = propStyle(50, -135);
  //   } else {
  //     firstProgressLayerStyle = propStyle(percent, -135);
  //   }

  //   return (
  //     <View style={styles.container}>
  //       <View style={[styles.firstProgressLayer, firstProgressLayerStyle]} />
  //       {renderThirdLayer(percent)}
  //       <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
  //         <Text style={styles.display}>{percent}%</Text>
  //         <Text style={styles.displaytext}>Actual Sales</Text>
  //       </View>
  //     </View>
  //   );
  // };




  if (showTop === true && showPrincipal === true && showCustomer === true) {

  return (

    <SafeAreaView style={{flex: 1 }}>


      <View style={{ flex: 1, flexDirection: 'column' }}>
      <Video
        rate={0.9}
        repeat={true}
        resizeMode="cover"
        source={require('../../assets/night.mp4')} // Can be a URL or a local file.
        // ref={ref_video} // Store reference
        // onBuffer={this.onBuffer} // Callback when remote video is buffering
        onError={(Error) => console.log(Error)} // Callback when video cannot be loaded
        style={styles.backgroundVideo}
      />
        {/* percentage */}
        <View style={{flexDirection: 'column',   alignContent: 'center' }}>

        <View style={{width: 50}}>
            <TouchableOpacity onPress={() => props.navigation.openDrawer()}>
              <Icon name="md-filter" color={'#ffffff'} size={34} />
            </TouchableOpacity>
          </View>



        <View style={{alignItems: 'center'}}>
          <Text style={{ fontSize: 20, color: '#FAF0E6'}}>
            {FilterList.DashboardFilterMonth} {FilterList.DashboardFilterYear}
          </Text>
        </View>

        </View>



        <View style={{ flex: 1.5, paddingVertical: 10, justifyContent: 'center', alignItems: 'center'}}>
        <ProgressCircle
          style={{height: scale(200), width: scale(200)}}
          progress={percent / 100}
          progressColor={'#24E4B5'}
          backgroundColor="gray" //'#ECECEC'	PropTypes.any
          startAngle="0" // 	0	PropTypes.number
          // endAngle // Math.PI * 2	   PropTypes.number
          strokeWidth="15" // 5	PropTypes.number
          cornerRadius="45" // PropTypes.number
         />

        <Text style={{
              position: 'absolute',
              color: 'white',
              fontSize: moderateScale(30, 0.5),
              fontWeight: 'bold',
              paddingTop: 10}}>
          {percent}%
          {'\n'}
        </Text>
        <Text style={{
              position: 'absolute',
              color: '#FAEBD7',
              fontSize: moderateScale(20, 0.5),
              fontWeight: 'bold',
              paddingTop: 50}}>
        Net
        </Text>
        </View>

        {/* sales and target */}
        <View style={{flex:0.2, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
          {/* <TouchableOpacity activeOpacity={0.2} onPress={() =>
          {
            props.navigation.navigate('UpdateSalesmanNetData'),
            setfocus_int(0);
          }}>
            <Image source={require('../../assets/pic/refresh.png')} style={{height:moderateScale(30, 0.5), width: moderateScale(30, 0.5)}} />
          </TouchableOpacity>
          <View style={{margin:5}} /> */}
          {/* <Text style={{fontSize: moderateScale(15, 0.5), color: 'gray' }}>Updated: {DateTimerefreshed}</Text> */}

          <Text
              style={{
                color: 'white',
                fontSize: moderateScale(12, 0.5),
                alignContent: 'flex-end',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
              }}>
              Last Update {LastDateTimeUpdated.value} {' ||   '}
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
        <View style={{flex:1.5, flexDirection: 'row', padding: 10 }}>
          <View style={{flex:1,flexDirection: 'column'}}>
          <View style={{flex:1,flexDirection: 'row'}}>
            {/* Field Name */}
            <View style={{flex:1,flexDirection: 'column'}}>
              {/* gross sales */}
              <View style={{flex: 1, justifyContent:'center', alignItems: 'flex-start', padding: 5}}>
                <Text style={{fontSize: moderateScale(15, 0.5), color :'#FAF0E6'}}>Gross Sales</Text>
              </View>
              {/* cm return */}
              <View style={{flex: 1, justifyContent:'center', alignItems: 'flex-start', padding: 5}}>
                <Text style={{fontSize: moderateScale(15, 0.5), color :'#FAF0E6'}}>CM Amount</Text>
              </View>
              {/* discount */}
              <View style={{flex: 1, justifyContent:'center', alignItems: 'flex-start', padding: 5}}>
                <Text style={{fontSize: moderateScale(15, 0.5), color :'#FAF0E6'}}>Discount</Text>
              </View>
              {/* net sales */}
              <View style={{flex: 1, justifyContent:'center', alignItems: 'flex-start', padding: 5}}>
                <Text style={{fontSize: moderateScale(15, 0.5), color :'#FAF0E6'}}>Net Sales</Text>
              </View>
            </View>

            {/* Field data */}
            <View style={{flex:2,flexDirection: 'column'}}>
              {/* gross sales */}
              <View style={{flex: 1, justifyContent:'center', alignItems: 'center', margin: 2, borderRadius: 10, backgroundColor: '#ADFF2F', opacity: 0.90}}>
                <Text style={{fontSize: moderateScale(18, 0.5), padding: 10, color :'black'}}>{numFormatter(grosssales)}</Text>
              </View>
              {/* cm return */}
              <View style={{flex: 1, justifyContent:'center', alignItems: 'center', margin: 2, borderRadius: 10, backgroundColor: '#7FFF00', opacity: 0.90}}>
                <Text style={{fontSize: moderateScale(18, 0.5), padding: 10, color :'black'}}>{numFormatter(cmamount)}</Text>
              </View>
              {/* discount */}
              <View style={{flex: 1, justifyContent:'center', alignItems: 'center', margin: 2, borderRadius: 10, backgroundColor: '#7CFC00', opacity: 0.90}}>
                <Text style={{fontSize: moderateScale(18, 0.5), padding: 10, color :'black'}}>{numFormatter(discount)}</Text>
              </View>
              {/* net sales */}
              <View style={{flex: 1, justifyContent:'center', alignItems: 'center', margin: 2, borderRadius: 10, backgroundColor: '#00FF00', opacity: 0.90}}>
                <Text style={{fontSize: moderateScale(25, 0.5), padding: 10, color :'black', fontWeight: 'bold'}}>{numFormatter(netsales)}</Text>
              </View>
            </View>
            </View>
          </View>
          <View style={{flex:1}}>
          <View style={{flex:1, flexDirection: 'column'  }}>
            <View style={{flex: 1, justifyContent:'center', alignItems: 'center'}}>
              <Text style={{fontSize: moderateScale(20, 0.5), color :'#FAF0E6'}}>Monthly Target</Text>
            </View>
            <View style={{flex: 1.5, justifyContent: 'flex-start', alignItems:'center'}}>
              <Text style={{fontSize: moderateScale(50, 0.5), fontFamily: 'sans-serif', color: 'white'}}>{numFormatter(target)}</Text>
            </View>
          </View>
          </View>
        </View>

        {/* principal */}
        <View style={{flex:1.5, borderTopWidth: 0.5, borderTopColor: 'gray', padding: 5}}>
        <TouchableOpacity activeOpacity={0.2} style={{flex:1, padding: 3, justifyContent: 'center', alignContent: 'center'}} onPress={() => Principals_shown()}>
          <View style={{flex: 1, backgroundColor: '#1E90FF', justifyContent: 'center', borderRadius: 5}}>
            <Text style={{color:'white', fontSize: moderateScale(15, 0.5), alignSelf: 'center'}}>
              PRINCIPALS - CATEGORY
            </Text>
          </View>
        </TouchableOpacity>

        {/* <Button title="Principals - Category" onPress={() => Principals_shown()} /> */}

        <View style={{height: scale(35), borderWidth: 1, flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 5,backgroundColor: '#10D070', alignItems: 'center', opacity: 0.80}}>
          <View style={{flex: 1}}>
          <Text style={{alignSelf: 'flex-start', fontSize: moderateScale(13, 0.5), padding: 2}}>PRINCIPAL</Text>
          </View>
          <View style={{flex: 1}}>
          <Text style={{alignSelf: 'center', fontSize: moderateScale(13, 0.5), padding: 2}}>TARGET</Text>
          </View>
          <View style={{flex: 1}}>
          <Text style={{alignSelf: 'center', fontSize: moderateScale(13, 0.5), padding: 2}}>SALES</Text>
          </View>
          <View style={{flex: 1}}>
          <Text style={{alignSelf: 'center', fontSize: moderateScale(13, 0.5), padding: 2}}>ACHV</Text>
          </View>
          <View style={{flex: 1}}>
          <Text style={{alignSelf: 'center', fontSize: moderateScale(13, 0.5), padding: 2}}>UBA</Text>
          </View>
        </View>
        <View style={{flex: 3, opacity: 0.90}}>
          <FlatList
              data={FlatVendor}
              // ItemSeparatorComponent={listViewItemSeparator}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => listItemView(item)}
            />
        </View>
        </View>

        {/* per customer */}
        <View style={{flex:1.5, paddingVertical: 3, paddingHorizontal: 10}}>
        <TouchableOpacity activeOpacity={0.2} style={{height: moderateScale(40, 0.5), padding: 1, justifyContent: 'center', alignContent: 'center'}} onPress={() => Customer_shown()}>
          <View style={{ flex: 1, backgroundColor: '#1E90FF', justifyContent: 'center', borderRadius: 5}}>
            <Text style={{color:'white', fontSize: moderateScale(15, 0.5), alignSelf: 'center'}}>
              CUSTOMERS
            </Text>
          </View>
        </TouchableOpacity>

        {/* <Button title="Customers" onPress={() => Customer_shown()} /> */}
        <FlatList
            data={FlatListItems}
            ItemSeparatorComponent={listViewItemSeparator}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) =>
            {

                return (
                <TouchableOpacity onPress={() => console.log(item.user_id)}>
                <View key={item.user_id} style={{ padding: 5, flexDirection: 'row'}}>
                  <View style={{flex: 2.5}}>
                  <Text style={{fontSize: moderateScale(13, 0.5), fontFamily: 'serif', alignSelf: 'flex-start', color: 'white'}}>{item.invoice_date}  </Text>
                  </View>
                  <View style={{flex: 6}}>
                  <Text style={{fontSize: moderateScale(13, 0.5), fontFamily: 'serif', alignSelf: 'flex-start', color: 'white'}}>{item.account_customer_name}</Text>
                  </View>
                  <View style={{flex: 2 }}>
                  <Text style={{fontSize: moderateScale(13, 0.5), fontFamily: 'serif', alignSelf: 'center', color: '#7CFC00'}}>{numFormatter(item.sales)}  </Text>
                  </View>
                  <View style={{flex: 2, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                  {/* <Text style={{fontSize: moderateScale(10, 0.5), fontFamily: 'serif', alignSelf: 'center'}}>{item.invoice_status_final}</Text> */}
                   {item.invoice_status_final === 'SAVED' ? (
                  <View style={{backgroundColor: '#F8A4AF',    width: scale(30), height: scale(30),    borderRadius: 50}} />
                    ) : null}
                  {item.invoice_status_final === 'PREPARING' ? (
                  <View style={{backgroundColor: '#F8A4AF',    width: scale(30), height: scale(30),    borderRadius: 50}} />
                    ) : null}
                  {item.invoice_status_final === 'PREPARED' ? (
                  <View style={{backgroundColor: '#F8A4AF',    width: scale(30), height: scale(30),    borderRadius: 50}} />
                    ) : null}
                  {item.invoice_status_final === 'CONFIRMED' ? (
                  <View style={{backgroundColor: '#09F67F',    width: scale(30), height: scale(30),    borderRadius: 50}} />
                    ) : null}
                  {item.invoice_status_final === 'LOADING' ? (
                  <View style={{backgroundColor: '#09F67F',    width: scale(30), height: scale(30),    borderRadius: 50}} />
                    ) : null}
                  {item.invoice_status_final === 'LOADED' ? (
                  <View style={{backgroundColor: '#09F67F',    width: scale(30), height: scale(30),    borderRadius: 50}} />
                    ) : null}
                  {item.invoice_status_final === 'DISPATCH' ? (
                  <View style={{backgroundColor: '#09F67F',    width: scale(30), height: scale(30),    borderRadius: 50}} />
                    ) : null}
                  {item.invoice_status_final === 'DELIVERED' ? (
                  <View style={{backgroundColor: '#09F67F',    width: scale(30), height: scale(30),    borderRadius: 50}} />
                    ) : null}

                  </View>
                </View>
                </TouchableOpacity>
                );


              // return (
              //   <TouchableOpacity onPress={() => console.log(item.user_id)}>
              //   <View key={item.user_id} style={{ padding: 5, flexDirection: 'row'}}>
              //     <View style={{flex: 2}}>
              //     <Text style={{fontSize: moderateScale(16, 0.5), fontFamily: 'serif', alignSelf: 'flex-start'}}>{item.invoice_date}  </Text>
              //     </View>
              //     <View style={{flex: 5}}>
              //     <Text style={{fontSize: moderateScale(15, 0.5), fontFamily: 'serif', alignSelf: 'flex-start'}}>{item.account_customer_name}</Text>
              //     </View>
              //     <View style={{flex: 1 }}>
              //     <Text style={{fontSize: moderateScale(16, 0.5), fontFamily: 'serif', alignSelf: 'center', color: 'green'}}>{numFormatter(item.sales)}  </Text>
              //     </View>
              //     <View style={{flex: 1 }}>
              //     <Text style={{fontSize: moderateScale(10, 0.5), fontFamily: 'serif', alignSelf: 'center'}}>{item.invoice_status_final}</Text>
              //     </View>
              //     <View style={{flex: 1 }}>

              //     <Text style={{fontSize: moderateScale(10, 0.5), fontFamily: 'serif', alignSelf: 'center'}}>{item.invoice_status_final}</Text>
              //     </View>
              //   </View>
              //   </TouchableOpacity>
              // );
            }
              }
          />
        </View>
      </View>

    </SafeAreaView>
  );

} else if (showTop === false && showPrincipal === true && showCustomer === false ) {

if (showCategory === true) {

  return (

    <SafeAreaView style={{flex: 1}}>

      <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'gray'}}>

      <Image source={require('../../assets/pic/green.png')} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, width: '100%', height: '100%'}}/>

        {/* principal */}
        <View style={{flex:3, borderTopWidth: 0.5, borderTopColor: 'gray', padding: 5}}>

        <TouchableOpacity activeOpacity={0.2} style={{height: moderateScale(50, 0.5), padding: 3, justifyContent: 'center', alignContent: 'center'}} onPress={() => All_shown()}>
          <View style={{flex: 1, backgroundColor: '#1E90FF', justifyContent: 'center', borderRadius: 5}}>
            <Text style={{color:'white', fontSize: moderateScale(15, 0.5), alignSelf: 'center'}}>
              MINIMIZE
            </Text>
          </View>
        </TouchableOpacity>

        {/* <Button title="Minimize" onPress={() => All_shown()} /> */}



        <View style={{height: scale(45), borderWidth: 1, flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 5,backgroundColor: '#10D070',alignItems: 'center'}}>
          <View style={{flex: 1}}>
          <Text style={{alignSelf: 'flex-start', fontSize: moderateScale(16, 0.5), padding: 2}}>PRINCIPAL</Text>
          </View>
          <View style={{flex: 1}}>
          <Text style={{alignSelf: 'center', fontSize: moderateScale(16, 0.5), padding: 2}}>TARGET</Text>
          </View>
          <View style={{flex: 1}}>
          <Text style={{alignSelf: 'center', fontSize: moderateScale(16, 0.5), padding: 2}}>SALES</Text>
          </View>
          <View style={{flex: 1}}>
          <Text style={{alignSelf: 'center', fontSize: moderateScale(16, 0.5), padding: 2}}>ACHV</Text>
          </View>
          <View style={{flex: 1}}>
          <Text style={{alignSelf: 'center', fontSize: moderateScale(16, 0.5), padding: 2}}>UBA</Text>
          </View>
        </View>
        <View style={{flex: 3}}>
          <FlatList
              data={FlatVendor}
              // ItemSeparatorComponent={listViewItemSeparator}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => listItemView(item)}
            />
        </View>
        </View>

        <View style={{flex: 1, padding: 10}}>
        <View style={{height: scale(45) , borderWidth: 1, flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 5, backgroundColor: '#10D070', justifyContent: 'center'}}>
          <View style={{flex: 1.5,justifyContent: 'center'}}>
          <Text style={{alignSelf: 'flex-start', fontSize: moderateScale(16, 0.5), marginLeft: 5}}>CATEGORY</Text>
          </View>
          <View style={{flex: 1,justifyContent: 'center'}}>
          <Text style={{alignSelf: 'center', fontSize: moderateScale(16, 0.5), padding: 2}}>TARGET</Text>
          </View>
          <View style={{flex: 1,justifyContent: 'center'}}>
          <Text style={{alignSelf: 'center', fontSize: moderateScale(16, 0.5), padding: 2}}>SALES</Text>
          </View>
          <View style={{flex: 1,justifyContent: 'center'}}>
          <Text style={{alignSelf: 'center', fontSize: moderateScale(16, 0.5), padding: 2}}>ACHV</Text>
          </View>
        </View>

        {/* Per category View */}
        <View style={{flex: 3}}>
          <FlatList
              data={FlatCategory}
              // ItemSeparatorComponent={listViewItemSeparator}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => listCategoryView(item)}
            />
        </View>
        </View>

      </View>

    </SafeAreaView>
  );

} else if (showCategory === false) {

  return (

    <SafeAreaView style={{flex: 1}}>

      <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#FFFAFA'}}>

      <Image source={require('../../assets/pic/green.png')} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, width: '100%', height: '100%'}}/>

        {/* principal */}
        <View style={{flex:3, borderTopWidth: 0.5, borderTopColor: 'gray', padding: 5}}>

        <TouchableOpacity activeOpacity={0.2} style={{height: moderateScale(50, 0.5), padding: 3, justifyContent: 'center', alignContent: 'center'}} onPress={() => All_shown()}>
          <View style={{flex: 1, backgroundColor: '#1E90FF', justifyContent: 'center', borderRadius: 5}}>
            <Text style={{color:'white', fontSize: moderateScale(15, 0.5), alignSelf: 'center'}}>
              MINIMIZE
            </Text>
          </View>
        </TouchableOpacity>

        {/* <Button title="Minimize" onPress={() => All_shown()} /> */}

        <View style={{height: scale(35), borderWidth: 1, flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 5,backgroundColor: '#10D070',alignItems: 'center'}}>
          <View style={{flex: 1}}>
          <Text style={{alignSelf: 'center', fontSize: moderateScale(16, 0.5)}}>PRINCIPAL</Text>
          </View>
          <View style={{flex: 1}}>
          <Text style={{alignSelf: 'center', fontSize: moderateScale(16, 0.5), padding: 2}}>TARGET</Text>
          </View>
          <View style={{flex: 1}}>
          <Text style={{alignSelf: 'center', fontSize: moderateScale(16, 0.5), padding: 2}}>SALES</Text>
          </View>
          <View style={{flex: 1}}>
          <Text style={{alignSelf: 'center', fontSize: moderateScale(16, 0.5), padding: 2}}>ACHV</Text>
          </View>
          <View style={{flex: 1}}>
          <Text style={{alignSelf: 'center', fontSize: moderateScale(16, 0.5), padding: 2}}>UBA</Text>
          </View>
        </View>
        <View style={{flex: 3}}>
          <FlatList
              data={FlatVendor}
              // ItemSeparatorComponent={listViewItemSeparator}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => listItemView(item)}
            />
        </View>
        </View>

      </View>

    </SafeAreaView>
  );

}

} else if (showTop === false && showPrincipal === false && showCustomer === true) {

    return (

      <SafeAreaView style={{flex: 1 }}>

        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#FFFAFA'}}>

        <Image source={require('../../assets/pic/green.png')} style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, width: '100%', height: '100%'}}/>

          {/* per customer */}
          <View style={{flex:1.5, padding: 10, paddingHorizontal: 15}}>

          <TouchableOpacity activeOpacity={0.2} style={{height: moderateScale(50, 0.5), padding: 3, justifyContent: 'center', alignContent: 'center'}} onPress={() => All_shown()}>
          <View style={{flex: 1, backgroundColor: '#1E90FF', justifyContent: 'center', borderRadius: 5}}>
            <Text style={{color:'white', fontSize: moderateScale(15, 0.5), alignSelf: 'center'}}>
              MINIMIZE
            </Text>
          </View>
          </TouchableOpacity>

          {/* <Button title="Minimize" onPress={() => All_shown()} /> */}
          <FlatList
              data={FlatListItems}
              ItemSeparatorComponent={listViewItemSeparator}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) =>
              {
                return (
                  <TouchableOpacity onPress={() => console.log(item.user_id)}>
                <View key={item.user_id} style={{ padding: 5, flexDirection: 'row'}}>
                  <View style={{flex: 2.5}}>
                  <Text style={{fontSize: moderateScale(13, 0.5), fontFamily: 'serif', alignSelf: 'flex-start'}}>{item.invoice_date}  </Text>
                  </View>
                  <View style={{flex: 6}}>
                  <Text style={{fontSize: moderateScale(13, 0.5), fontFamily: 'serif', alignSelf: 'flex-start'}}>{item.account_customer_name}</Text>
                  </View>
                  <View style={{flex: 2 }}>
                  <Text style={{fontSize: moderateScale(13, 0.5), fontFamily: 'serif', alignSelf: 'center', color: 'green'}}>{numFormatter(item.sales)}  </Text>
                  </View>
                  <View style={{flex: 2, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                  {/* <Text style={{fontSize: moderateScale(10, 0.5), fontFamily: 'serif', alignSelf: 'center'}}>{item.invoice_status_final}</Text> */}
                   {item.invoice_status_final === 'SAVED' ? (
                  <View style={{backgroundColor: '#F8A4AF',    width: scale(30), height: scale(30),    borderRadius: 50}} />
                    ) : null}
                  {item.invoice_status_final === 'PREPARING' ? (
                  <View style={{backgroundColor: '#F8A4AF',    width: scale(30), height: scale(30),    borderRadius: 50}} />
                    ) : null}
                  {item.invoice_status_final === 'PREPARED' ? (
                  <View style={{backgroundColor: '#F8A4AF',    width: scale(30), height: scale(30),    borderRadius: 50}} />
                    ) : null}
                  {item.invoice_status_final === 'CONFIRMED' ? (
                  <View style={{backgroundColor: '#09F67F',    width: scale(30), height: scale(30),    borderRadius: 50}} />
                    ) : null}
                  {item.invoice_status_final === 'LOADING' ? (
                  <View style={{backgroundColor: '#09F67F',    width: scale(30), height: scale(30),    borderRadius: 50}} />
                    ) : null}
                  {item.invoice_status_final === 'LOADED' ? (
                  <View style={{backgroundColor: '#09F67F',    width: scale(30), height: scale(30),    borderRadius: 50}} />
                    ) : null}
                  {item.invoice_status_final === 'DISPATCH' ? (
                  <View style={{backgroundColor: '#09F67F',    width: scale(30), height: scale(30),    borderRadius: 50}} />
                    ) : null}
                  {item.invoice_status_final === 'DELIVERED' ? (
                  <View style={{backgroundColor: '#09F67F',    width: scale(30), height: scale(30),    borderRadius: 50}} />
                    ) : null}

                  </View>
                </View>
                  </TouchableOpacity>
                );
              }
                }
            />
          </View>
        </View>

      </SafeAreaView>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    width: moderateScale(250, 0.5),
    height: moderateScale(250, 0.5),
    borderWidth: 20,
    borderRadius: 100,
    borderColor: '#D8BFD8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  firstProgressLayer: {
    width: moderateScale(250, 0.5),
    height: moderateScale(250, 0.5),
    borderWidth: 20,
    position: 'absolute',
    borderLeftColor:'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#00FF7F',
    borderTopColor: '#00FF7F',
    borderRadius: 100,
    transform:[{rotateZ: '-135deg'}],
  },
  secondProgressLayer: {
    width: moderateScale(250, 0.5),
    height: moderateScale(250, 0.5),
    borderWidth: 20,
    position: 'absolute',
    borderLeftColor:'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#00FF7F',
    borderTopColor: '#00FF7F',
    borderRadius: 100,
    transform:[{rotateZ: '45deg'}],
  },
  offsetLayer: {
    width: moderateScale(250, 0.5),
    height: moderateScale(250, 0.5),
    borderWidth: 20,
    position: 'absolute',
    borderLeftColor:'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#D8BFD8',
    borderTopColor: '#D8BFD8',
    borderRadius: 100,
    transform:[{rotateZ: '-135deg'}],
  },
  display: {
    fontSize: moderateScale(25, 0.5),
    fontWeight: 'bold',
  },
  displaytext: {
    fontSize: moderateScale(14, 0.5),
    color: 'red',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
