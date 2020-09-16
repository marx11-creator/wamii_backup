import React, {useState, useEffect} from 'react';
import {View, Text, Modal, StyleSheet} from 'react-native';
import {openDatabase} from 'react-native-sqlite-storage';
import {useFocusEffect} from '@react-navigation/native';
import {APIToken} from '../../sharedComponents/globalCommands/globalCommands';
import {dbSalesmanNet} from '../../database/sqliteSetup';
var cur_month = new Date().getMonth() + 1;
var prev_month = new Date().getMonth();
var year = new Date().getFullYear();

export default function InsertScreen(props) {
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

  useFocusEffect(() => {
    if (focus_int === 0) {
      getcurrentDate();
      setfocus_int(1);
    } else if (focus_int === 1) {
      initiate();
      setfocus_int(2);
    }
  });

  let bypass_scj = () => {
    setload_c(3);
  };

  let prompt = () => {
    setLoading(false);
    setmodalvisible(false);
    props.navigation.navigate('SalesmanNet'), setload_pc(0);
    setload_n(0);
    setload_v(0);
    setload_c(0);
  };

  let getcurrentDate = () => {
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
    setfixed_date_from(get_date_from);
    setfixed_date_to(get_date_to);
  };

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
  };

  let delete_per_customer_tbl = () => {
    dbSalesmanNet.transaction(function (tx) {
      tx.executeSql(
        'DELETE FROM tbl_sales_per_customer ',
        [],
        (tx, results) => {
          // console.log('Deleted customer result :', results.rowsAffected);
        },
      );
    });
  };

  let delete_net_tbl = () => {
    dbSalesmanNet.transaction(function (tx) {
      tx.executeSql('DELETE FROM tbl_sales_net ', [], (tx, results) => {
        // console.log('Deleted net result :', results.rowsAffected);
      });
    });
  };

  let delete_per_vendor_tbl = () => {
    dbSalesmanNet.transaction(function (tx) {
      tx.executeSql('DELETE FROM tbl_sales_per_vendor ', [], (tx, results) => {
        // console.log('Deleted vendor result :', results.rowsAffected);
      });
    });
  };

  let delete_per_category_tbl = () => {
    dbSalesmanNet.transaction(function (tx) {
      tx.executeSql(
        'DELETE FROM tbl_sales_per_category ',
        [],
        (tx, results) => {
          // console.log('Deleted category result :', results.rowsAffected);
        },
      );
    });
  };

  let fetch_per_customer_data = () => {
    console.log('fetching fetch_per_customer_data');
    Promise.race([
      fetch(
        'https://boiling-atoll-20376.herokuapp.com/sales_tbl/salesmanfilterddaterange/' +
          global.sales_position_name +
          '&' +
          fixed_date_from +
          '&' +
          fixed_date_to,
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
        console.log('Vendor' + error);
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
        console.log(jsonData);
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
        "'),";
    }, []);

    combine_data_per_customer = combine_data_per_customer.slice(0, -1);
    //console.log(combine_data_per_customer);
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
        'INSERT INTO tbl_sales_per_customer (invoice_date, account_customer_name, invoice_no, principal_name, sales) VALUES ' +
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
    console.log(
      'INSERT INTO tbl_sales_per_category (business_year, business_month, invoice_date, team, sales_position_name, salesman_name, product_category, sales, target, dateTimeUpdated) VALUES ' +
        c_category_data,
    );
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

  function SQLerror(err) {
    console.log('SQL Error: ' + err.message);
  }

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <Modal animationType="slide" transparent={true} visible={modalvisible}>
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          {/* <AnimatedLoader
            visible={isLoading}
            overlayColor="rgba(255,255,255,0.75)"
            source={require('../node_modules/react-native-animated-loader/src/loader.json')}
            animationStyle={styles.lottie}
            speed={1}
          /> */}
          {/* <Text>{load_n} {load_pc} {load_v} {load_c} </Text> */}
          <Text>{loadname}</Text>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  lottie: {
    width: 100,
    height: 100,
  },
});
