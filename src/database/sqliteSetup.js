/* eslint-disable no-lone-blocks */

import React from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Alert, BackHandler} from 'react-native';

import {useEffect} from 'react';
import {openDatabase} from 'react-native-sqlite-storage';
import {LocalAppVersionUpdate} from '../sharedComponents/globalCommands/globalCommands';
import moment from 'moment';

export var dbUpdateDbVersion = openDatabase({name: 'updateversion_tbl.db'});
export var dbAppToken = openDatabase({name: 'AppToken_tbl.db'});
export var dbsystem_users = openDatabase({name: 'system_users_tbl.db'});
export var dbperymtsat = openDatabase({name: 'perymtsat_tbl.db'});
export var dbperarea = openDatabase({name: 'perareapermonth_tbl.db'});
export var dbperprincipal = openDatabase({name: 'perprincipalpermonth_tbl.db'});
export var dbinventory = openDatabase({name: 'promo_items_tbl.db'});
export var dbBusinessCalendar = openDatabase({
  name: 'business_calendar_tbl.db',
});
export var dbSalesmanNet = openDatabase({name: 'Sales_report.db'});
export var dblastdatetimeupdated = openDatabase({
  name: 'lastdatetimeupdated_tbl.db',
});

//SETUP DATABASE
export default function CreateDatabase() {
  dbBusinessCalendar.transaction(function (txn) {
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='business_calendar_tbl'",
      [],
      function (tx, res) {
        if (res.rows.length === 0) {
          txn.executeSql('DROP TABLE IF EXISTS business_calendar_tbl', []);
          txn.executeSql(
            'CREATE TABLE IF NOT EXISTS business_calendar_tbl(ref_id INTEGER PRIMARY KEY AUTOINCREMENT, date VARCHAR(255), year VARCHAR(255), month VARCHAR(255), day VARCHAR(255), constant_type VARCHAR(255), constant_value VARCHAR(255), update_version VARCHAR(255))',
            [],
          );
        }
      },
    );
  });

  dbUpdateDbVersion.transaction(function (txn) {
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='updateversion_tbl'",
      [],
      function (tx, res) {
        if (res.rows.length == 0) {
          txn.executeSql('DROP TABLE IF EXISTS updatedbversion_tbl', []);
          txn.executeSql(
            'CREATE TABLE IF NOT EXISTS updateversion_tbl(ref_id INTEGER PRIMARY KEY AUTOINCREMENT, updateversion VARCHAR(255), dateTimeUpdated VARCHAR(255))',
            [],
          );
        }
      },
    );
  });

  dbAppToken.transaction(function (txn) {
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='AppToken_tbl'",
      [],
      function (tx, res) {
        if (res.rows.length == 0) {
          txn.executeSql('DROP TABLE IF EXISTS AppToken_tbl', []);
          txn.executeSql(
            // 'CREATE TABLE IF NOT EXISTS perymia_tbl_tbl(ref_id INTEGER PRIMARY KEY AUTOINCREMENT, principal_name VARCHAR(255), product_id VARCHAR(255),product_variant VARCHAR(255), product_name VARCHAR(255), inventory VARCHAR(255), img_url VARCHAR(255), DateandTimeUpdated VARCHAR(255))',
            'CREATE TABLE IF NOT EXISTS AppToken_tbl(ref_id INTEGER PRIMARY KEY AUTOINCREMENT, access_token VARCHAR(255), dateTimeObtained VARCHAR(255))',
            [],
          );
        }
      },
    );
  });

  dbsystem_users.transaction(function (txn) {
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='system_users_tbl'",
      [],
      function (tx, res) {
        if (res.rows.length == 0) {
          txn.executeSql('DROP TABLE IF EXISTS system_users_tbl', []);
          txn.executeSql(
            // 'CREATE TABLE IF NOT EXISTS perymia_tbl_tbl(ref_id INTEGER PRIMARY KEY AUTOINCREMENT, principal_name VARCHAR(255), product_id VARCHAR(255),product_variant VARCHAR(255), product_name VARCHAR(255), inventory VARCHAR(255), img_url VARCHAR(255), DateandTimeUpdated VARCHAR(255))',
            'CREATE TABLE IF NOT EXISTS system_users_tbl(ref_id INTEGER PRIMARY KEY AUTOINCREMENT, user_name VARCHAR(255), name VARCHAR(255), last_name VARCHAR(255),  password VARCHAR(255), account_type VARCHAR(255),  constant_type VARCHAR(255), constant_value VARCHAR(255), dateTimeLogin VARCHAR(255), activeStatus VARCHAR(255))',
            [],
          );
        }
      },
    );
  });

  dbperarea.transaction(function (txn) {
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='perareapermonth_tbl'",
      [],
      function (tx, res) {
        if (res.rows.length == 0) {
          txn.executeSql('DROP TABLE IF EXISTS perareapermonth_tbl', []);
          txn.executeSql(
            'CREATE TABLE IF NOT EXISTS perareapermonth_tbl(ref_id INTEGER PRIMARY KEY AUTOINCREMENT, business_year VARCHAR(255), business_month VARCHAR(255),invoice_date VARCHAR(255), province VARCHAR(255), sales VARCHAR(255), uba VARCHAR(255), dateTimeUpdated VARCHAR(255),principal_name VARCHAR(255),team VARCHAR(255))',
            [],
          );
        }
      },
    );
  });

  dbperprincipal.transaction(function (txn) {
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='perprincipalpermonth_tbl'",
      [],
      function (tx, res) {
        if (res.rows.length == 0) {
          txn.executeSql('DROP TABLE IF EXISTS perprincipalpermonth_tbl', []);
          txn.executeSql(
            // 'CREATE TABLE IF NOT EXISTS perymia_tbl_tbl(ref_id INTEGER PRIMARY KEY AUTOINCREMENT, principal_name VARCHAR(255), product_id VARCHAR(255),product_variant VARCHAR(255), product_name VARCHAR(255), inventory VARCHAR(255), img_url VARCHAR(255), DateandTimeUpdated VARCHAR(255))',
            'CREATE TABLE IF NOT EXISTS perprincipalpermonth_tbl(ref_id INTEGER PRIMARY KEY AUTOINCREMENT, business_year VARCHAR(255), business_month VARCHAR(255),invoice_date VARCHAR(255), principal_name VARCHAR(255),principal_acronym VARCHAR(255), sales VARCHAR(255), target VARCHAR(255), dateTimeUpdated VARCHAR(255),  team VARCHAR(255))',
            [],
            // 'CREATE TABLE IF NOT EXISTS table_user(user_id INTEGER PRIMARY KEY AUTOINCREMENT, user_name VARCHAR(20), user_contact INT(10), user_address VARCHAR(255))',[],
          );
        }
      },
    );
  });

  dbperymtsat.transaction(function (txn) {
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='perymtsat_tbl'",
      [],
      function (tx, res) {
        if (res.rows.length == 0) {
          txn.executeSql('DROP TABLE IF EXISTS perymtsat_tbl', []);
          txn.executeSql(
            // 'CREATE TABLE IF NOT EXISTS perymia_tbl_tbl(ref_id INTEGER PRIMARY KEY AUTOINCREMENT, principal_name VARCHAR(255), product_id VARCHAR(255),product_variant VARCHAR(255), product_name VARCHAR(255), inventory VARCHAR(255), img_url VARCHAR(255), DateandTimeUpdated VARCHAR(255))',
            'CREATE TABLE IF NOT EXISTS perymtsat_tbl(ref_id INTEGER PRIMARY KEY AUTOINCREMENT, business_year VARCHAR(255), business_month VARCHAR(255),invoice_date VARCHAR(255), team VARCHAR(255), salesman_name VARCHAR(255), position_name VARCHAR(255), amount VARCHAR(255), target VARCHAR(255), dateTimeUpdated VARCHAR(255), principal_name VARCHAR(255))',
            [],
            // 'CREATE TABLE IF NOT EXISTS table_user(user_id INTEGER PRIMARY KEY AUTOINCREMENT, user_name VARCHAR(20), user_contact INT(10), user_address VARCHAR(255))',[],
          );
        }
      },
    );
  });

  // // console.log('SQLite database initialize');
  dbinventory.transaction(function (txn) {
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='promo_items_tbl'",
      [],
      function (tx, res) {
        if (res.rows.length == 0) {
          txn.executeSql('DROP TABLE IF EXISTS promo_items_tbl', []);
          txn.executeSql(
            'CREATE TABLE IF NOT EXISTS promo_items_tbl (ref_id INTEGER PRIMARY KEY AUTOINCREMENT, principal_name VARCHAR(255), product_id VARCHAR(255),product_variant VARCHAR(255), product_name VARCHAR(255), inventory VARCHAR(255), img_url VARCHAR(255), DateandTimeUpdated VARCHAR(255),  total_case VARCHAR(255), total_pieces VARCHAR(255), effective_price_date VARCHAR(255), CASE_COMPANY VARCHAR(255), CASE_BOOKING VARCHAR(255), CASE_EXTRUCK VARCHAR(255), PCS_COMPANY VARCHAR(255), PCS_BOOKING VARCHAR(255), PCS_EXTRUCK VARCHAR(255),product_category VARCHAR(255),product_brand VARCHAR(255), CASE_UNIT_PER_PCS  VARCHAR(255) )',
            [],
            // 'CREATE TABLE IF NOT EXISTS table_user(user_id INTEGER PRIMARY KEY AUTOINCREMENT, user_name VARCHAR(20), user_contact INT(10), user_address VARCHAR(255))',[],
          );
        }
      },
    );
  });
}

function SQLerror(err) {
  console.log('SQL Error: ' + err.message);
}

// SALESMAN NET MARC

dbSalesmanNet.transaction(function (txn) {
  txn.executeSql(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='tbl_sales_per_customer'",
    [],
    function (tx, res) {
      if (res.rows.length == 0) {
        txn.executeSql('DROP TABLE IF EXISTS tbl_sales_per_customer', []);
        txn.executeSql(
          'CREATE TABLE IF NOT EXISTS tbl_sales_per_customer(user_id INTEGER PRIMARY KEY AUTOINCREMENT, invoice_date VARCHAR(255), account_customer_name VARCHAR(255), invoice_no VARCHAR(255), principal_name VARCHAR(255), sales INT(100), invoice_status_final VARCHAR(255))',
          [],
        );
      }
    },
  );
});

dbSalesmanNet.transaction(function (txn) {
  txn.executeSql(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='tbl_sales_net'",
    [],
    function (tx, res) {
      if (res.rows.length == 0) {
        txn.executeSql('DROP TABLE IF EXISTS tbl_sales_net', []);
        txn.executeSql(
          'CREATE TABLE IF NOT EXISTS tbl_sales_net(user_id INTEGER PRIMARY KEY AUTOINCREMENT, business_year VARCHAR(255), business_month VARCHAR(255), invoice_date VARCHAR(255), team VARCHAR(255), sales_position_name VARCHAR(255), salesman_name VARCHAR(255), total_gross_amount INT(100), total_net_amount INT(100), total_discount INT(100), total_cm INT(100), total_target INT(100), dateTimeUpdated VARCHAR(255))',
          [],
        );
      }
    },
  );
});

dbSalesmanNet.transaction(function (txn) {
  txn.executeSql(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='tbl_sales_per_vendor'",
    [],
    function (tx, res) {
      if (res.rows.length == 0) {
        txn.executeSql('DROP TABLE IF EXISTS tbl_sales_per_vendor', []);
        txn.executeSql(
          'CREATE TABLE IF NOT EXISTS tbl_sales_per_vendor(user_id INTEGER PRIMARY KEY AUTOINCREMENT, business_year VARCHAR(255), business_month VARCHAR(255), invoice_date VARCHAR(255), team VARCHAR(255), salesman_name VARCHAR(255), sales_position_name VARCHAR(255), principal_name VARCHAR(255), principal_acronym VARCHAR(255), sales INT(100), target INT(100), uba INT(100), dateTimeUpdated VARCHAR(255))',
          [],
        );
      }
    },
  );
});

dbSalesmanNet.transaction(function (txn) {
  txn.executeSql(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='tbl_sales_per_category'",
    [],
    function (tx, res) {
      if (res.rows.length == 0) {
        txn.executeSql('DROP TABLE IF EXISTS tbl_sales_per_category', []);
        txn.executeSql(
          'CREATE TABLE IF NOT EXISTS tbl_sales_per_category(user_id INTEGER PRIMARY KEY AUTOINCREMENT, business_year VARCHAR(255), business_month VARCHAR(255), invoice_date VARCHAR(255), team VARCHAR(255), sales_position_name VARCHAR(255), salesman_name VARCHAR(255), product_category VARCHAR(255), sales INT(100), target INT(100), dateTimeUpdated VARCHAR(255))',
          [],
        );
      }
    },
  );
});

dblastdatetimeupdated.transaction(function (txn) {
  txn.executeSql(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='lastdatetimeupdated_tbl'",
    [],
    function (tx, res) {
      if (res.rows.length == 0) {
        txn.executeSql('DROP TABLE IF EXISTS lastdatetimeupdated_tbl', []);
        txn.executeSql(
          'CREATE TABLE IF NOT EXISTS lastdatetimeupdated_tbl(ref_id INTEGER PRIMARY KEY AUTOINCREMENT, lastdatetimeupdated24hr VARCHAR(255), user_name VARCHAR(255), device_name VARCHAR(255), unique_code1 VARCHAR(255), unique_code2 VARCHAR(255), date VARCHAR(255), unique_code3 VARCHAR(255))',
          [],
        );
      }
    },
  );
});

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>.UPDATE DATABASE TBL FOR ADDITIONAL TBL
export function Update1001() {
  dbperprincipal.transaction(function (txn) {
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='perprincipalpermonth_tbl'",
      [],
      function (tx, res) {
        if (res.rows.length === 1) {
          //if tbl exists
          console.log('main tbl exist1');
          txn.executeSql(
            'SELECT uba FROM perprincipalpermonth_tbl  LIMIT 1',
            [],
            function (tx2, res2) {
              //if column exists
              console.log('1001 update already found nothing to do');
              LocalAppVersionUpdate.LocalAppVersionUpdateField =
                Number(LocalAppVersionUpdate.LocalAppVersionUpdateField) +
                Number(1);
              Add1001UpdatetoLocal();
            },
            //if not function below is a error part where it run a fucntion
            Alter_perprincipalpermonth_tbl_uba,
          );
        }
      },
    );
  });
}

function Alter_perprincipalpermonth_tbl_uba() {
  console.log(
    '1001 query error finding new field, it means field is missing. run alter or udpdate now',
  );
  dbperprincipal.transaction(function (txn) {
    txn.executeSql(
      'ALTER TABLE perprincipalpermonth_tbl ADD COLUMN uba VARCHAR(255)',
      [],
      function (tx3, res3) {
        console.log('1001 new field added');
        LocalAppVersionUpdate.LocalAppVersionUpdateField =
          Number(LocalAppVersionUpdate.LocalAppVersionUpdateField) + Number(1);
        CheckUpdate1001();
      },
      SQLerror,
    );
  });
}

function CheckUpdate1001() {
  if (LocalAppVersionUpdate.LocalAppVersionUpdateField === 1001) {
    Add1001UpdatetoLocal();
    console.log('1001 updated has been processed');
  } else {
    console.log('1001 updated NOT processed');
  }
}

function Add1001UpdatetoLocal() {
  {
    dbUpdateDbVersion.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO  updateversion_tbl (updateversion, dateTimeUpdated) VALUES (?,?)',
        [1001, moment().utcOffset('+08:00').format('YYYY-MM-DD hh:mm:ss a')],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('1001 updated added to local');
          }
        },
        SQLerror,
      );
    });
  }
}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> update 1002

export function Update1002() {
  dbperprincipal.transaction(function (txn) {
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='perprincipalpermonth_tbl'",
      [],
      function (tx, res) {
        if (res.rows.length === 1) {
          //if tbl exists
          console.log('main tbl exist2');
          txn.executeSql(
            'SELECT OutofStock FROM perprincipalpermonth_tbl  LIMIT 1',
            [],
            function (tx2, res2) {
              //if column exists
              console.log('1002 update already found nothing to do');
              LocalAppVersionUpdate.LocalAppVersionUpdateField =
                Number(LocalAppVersionUpdate.LocalAppVersionUpdateField) +
                Number(1);
              Add1002UpdatetoLocal();
            },
            //if not function below is a error part where it run a fucntion
            Alter_perprincipalpermonth_tbl_OutofStock,
          );
        }
      },
    );
  });
}

function Alter_perprincipalpermonth_tbl_OutofStock() {
  console.log(
    '1002 query error finding new field, it means field is missing. run alter or udpdate now',
  );
  dbperprincipal.transaction(function (txn) {
    txn.executeSql(
      'ALTER TABLE perprincipalpermonth_tbl ADD COLUMN OutofStock VARCHAR(255)',
      [],
      function (tx3, res3) {
        console.log('1002 new field added');
        LocalAppVersionUpdate.LocalAppVersionUpdateField =
          Number(LocalAppVersionUpdate.LocalAppVersionUpdateField) + Number(1);
        CheckUpdate1002();
      },
      SQLerror,
    );
  });
}

function CheckUpdate1002() {
  if (LocalAppVersionUpdate.LocalAppVersionUpdateField === 1002) {
    Add1002UpdatetoLocal();
    console.log('1002 updated has been processed');
  } else {
    console.log('1002 updated NOT processed');
  }
}

function Add1002UpdatetoLocal() {
  {
    dbUpdateDbVersion.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO  updateversion_tbl (updateversion, dateTimeUpdated) VALUES (?,?)',
        [1002, moment().utcOffset('+08:00').format('YYYY-MM-DD hh:mm:ss a')],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('1002 updated added to local test');
          }
        },
        SQLerror,
      );
    });
  }
}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> update 1003

export function Update1003() {
  dbperprincipal.transaction(function (txn) {
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='perprincipalpermonth_tbl'",
      [],
      function (tx, res) {
        if (res.rows.length === 1) {
          //if tbl exists
          console.log('main tbl exist3');
          txn.executeSql(
            'SELECT NOTBUYINHCUSTOMER FROM perprincipalpermonth_tbl  LIMIT 1',
            [],
            function (tx2, res2) {
              //if column exists
              console.log('1003 update already found nothing to do');
              LocalAppVersionUpdate.LocalAppVersionUpdateField =
                Number(LocalAppVersionUpdate.LocalAppVersionUpdateField) +
                Number(1);
              Add1003UpdatetoLocal();
            },
            //if not function below is a error part where it run a fucntion
            Alter_perprincipalpermonth_tbl_NOTBUYINHCUSTOMER,
          );
        }
      },
    );
  });
}

function Alter_perprincipalpermonth_tbl_NOTBUYINHCUSTOMER() {
  console.log(
    '1003 query error finding new field, it means field is missing. run alter or udpdate now',
  );
  dbperprincipal.transaction(function (txn) {
    txn.executeSql(
      'ALTER TABLE perprincipalpermonth_tbl ADD COLUMN NOTBUYINHCUSTOMER VARCHAR(255)',
      [],
      function (tx3, res3) {
        console.log('1003 new field added');
        LocalAppVersionUpdate.LocalAppVersionUpdateField =
          Number(LocalAppVersionUpdate.LocalAppVersionUpdateField) + Number(1);
        CheckUpdate1003();
      },
      SQLerror,
    );
  });
}

function CheckUpdate1003() {
  if (LocalAppVersionUpdate.LocalAppVersionUpdateField === 1003) {
    Add1003UpdatetoLocal();
    console.log('1003 updated has been processed');
  } else {
    console.log('1003 updated NOT processed');
  }
}

function Add1003UpdatetoLocal() {
  {
    dbUpdateDbVersion.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO  updateversion_tbl (updateversion, dateTimeUpdated) VALUES (?,?)',
        [1003, moment().utcOffset('+08:00').format('YYYY-MM-DD hh:mm:ss a')],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('1003 updated added to local test');
          }
        },
        SQLerror,
      );
    });
  }
}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> update 1004

export function Update1004() {
  {
    dbUpdateDbVersion.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO  updateversion_tbl (updateversion, dateTimeUpdated) VALUES (?,?)',
        [1004, moment().utcOffset('+08:00').format('YYYY-MM-DD hh:mm:ss a')],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('1004 updated added to local test');

            // Alert.alert(
            //   'System Message',
            //   'System updated Automatically, Please restart application.',
            //   [
            //     {
            //       text: 'OK',
            //       onPress: () => {
            //         BackHandler.exitApp();
            //       },
            //     },
            //   ],
            //   {cancelable: true},
            // );
          }
        },
        SQLerror,
      );
    });
  }
}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> update 1005

export function Update1005() {
  dbinventory.transaction(function (txn) {
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name ='promo_items_tbl'",
      [],
      function (tx, res) {
        if (res.rows.length === 1) {
          //if tbl exists
          console.log('main tbl exist5');
          txn.executeSql(
            'SELECT promo_product FROM promo_items_tbl  LIMIT 1',
            [],
            function (tx2, res2) {
              //if column exists
              console.log('1005 update already found nothing to do');
              LocalAppVersionUpdate.LocalAppVersionUpdateField =
                Number(LocalAppVersionUpdate.LocalAppVersionUpdateField) +
                Number(1);
              Add1005UpdatetoLocal();
            },
            //if not function below is a error part where it run a fucntion
            Alter_inventory_product,
          );
        }
      },
    );
  });
}

function Alter_inventory_product() {
  console.log(
    '1005 query error finding new field, it means field is missing. run alter or udpdate now',
  );
  dbinventory.transaction(function (txn) {
    txn.executeSql(
      'ALTER TABLE promo_items_tbl ADD COLUMN promo_product VARCHAR(255)',
      [],
      function (tx3, res3) {
        console.log('1005 new field added');
        LocalAppVersionUpdate.LocalAppVersionUpdateField =
          Number(LocalAppVersionUpdate.LocalAppVersionUpdateField) + Number(1);
        CheckUpdate1005();
      },
      SQLerror,
    );
  });
}

function CheckUpdate1005() {
  if (LocalAppVersionUpdate.LocalAppVersionUpdateField === 1005) {
    Add1005UpdatetoLocal();
    console.log('1005 updated has been processed');
  } else {
    console.log('1005 updated NOT processed');
  }
}

function Add1005UpdatetoLocal() {
  {
    dbUpdateDbVersion.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO  updateversion_tbl (updateversion, dateTimeUpdated) VALUES (?,?)',
        [1005, moment().utcOffset('+08:00').format('YYYY-MM-DD hh:mm:ss a')],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('1005 updated added to local test');
          }
        },
        SQLerror,
      );
    });
  }
}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> update 1006

export function Update1006() {
  {
    dbUpdateDbVersion.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO  updateversion_tbl (updateversion, dateTimeUpdated) VALUES (?,?)',
        [1006, moment().utcOffset('+08:00').format('YYYY-MM-DD hh:mm:ss a')],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('1006 updated added to local test');

            // Alert.alert(
            //   'System Message',
            //   'System updated Automatically, Please restart application.',
            //   [
            //     {
            //       text: 'OK',
            //       onPress: () => {
            //         BackHandler.exitApp();
            //       },
            //     },
            //   ],
            //   {cancelable: true},
            // );
          }
        },
        SQLerror,
      );
    });
  }
}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> update 1007

export function Update1007() {
  {
    dbUpdateDbVersion.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO  updateversion_tbl (updateversion, dateTimeUpdated) VALUES (?,?)',
        [1007, moment().utcOffset('+08:00').format('YYYY-MM-DD hh:mm:ss a')],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('1007 updated added to local test');

            // Alert.alert(
            //   'System Message',
            //   'System updated Automatically, Please restart application.',
            //   [
            //     {
            //       text: 'OK',
            //       onPress: () => {
            //         BackHandler.exitApp();
            //       },
            //     },
            //   ],
            //   {cancelable: true},
            // );
          }
        },
        SQLerror,
      );
    });
  }
}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> update 1008

export function Update1008() {
  {
    dbUpdateDbVersion.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO  updateversion_tbl (updateversion, dateTimeUpdated) VALUES (?,?)',
        [1008, moment().utcOffset('+08:00').format('YYYY-MM-DD hh:mm:ss a')],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('1008 updated added to local test');

            // Alert.alert(
            //   'System Message',
            //   'System updated Automatically, Please restart application.',
            //   [
            //     {
            //       text: 'OK',
            //       onPress: () => {
            //         BackHandler.exitApp();
            //       },
            //     },
            //   ],
            //   {cancelable: true},
            // );
          }
        },
        SQLerror,
      );
    });
  }
}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> update 1009

export function Update1009() {
  dbinventory.transaction(function (txn) {
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name ='promo_items_tbl'",
      [],
      function (tx, res) {
        if (res.rows.length === 1) {
          //if tbl exists
          console.log('main tbl exist5');
          txn.executeSql(
            'SELECT  product_category FROM promo_items_tbl  LIMIT 1',
            [],
            function (tx2, res2) {
              //if column exists
              console.log('1009 update already found nothing to do');
              LocalAppVersionUpdate.LocalAppVersionUpdateField =
                Number(LocalAppVersionUpdate.LocalAppVersionUpdateField) +
                Number(1);
              Add1008UpdatetoLocal();
            },
            //if not function below is a error part where it run a fucntion
            Alter_inventory_product1009,
          );
        }
      },
    );
  });
}

function Alter_inventory_product1009() {
  console.log(
    '1009 query error finding new field, it means field is missing. run alter or udpdate now',
  );
  dbinventory.transaction(function (txn) {
    txn.executeSql(
      'ALTER TABLE promo_items_tbl ADD COLUMN product_category VARCHAR(255)',
      [],
      function (tx3, res3) {
        console.log('1009.1 new field added');
      },
      SQLerror,
    );
  });

  dbinventory.transaction(function (txn) {
    txn.executeSql(
      'ALTER TABLE promo_items_tbl ADD COLUMN product_brand VARCHAR(255)',
      [],
      function (tx3, res3) {
        console.log('1009.2 new field added');
      },
      SQLerror,
    );
  });

  dbinventory.transaction(function (txn) {
    txn.executeSql(
      ' ALTER TABLE promo_items_tbl  ADD COLUMN CASE_UNIT_PER_PCS VARCHAR(255)',
      [],
      function (tx3, res3) {
        console.log('1009.3 new field added');
      },
      SQLerror,
    );
  });

  dbinventory.transaction(function (txn) {
    txn.executeSql(
      ' ALTER TABLE promo_items_tbl  ADD COLUMN total_case VARCHAR(255)',
      [],
      function (tx3, res3) {
        console.log('1009.4 new field added');
      },
      SQLerror,
    );
  });

  dbinventory.transaction(function (txn) {
    txn.executeSql(
      ' ALTER TABLE promo_items_tbl  ADD COLUMN total_pieces VARCHAR(255)',
      [],
      function (tx3, res3) {
        console.log('1009.5 new field added');
      },
      SQLerror,
    );
  });

  dbinventory.transaction(function (txn) {
    txn.executeSql(
      ' ALTER TABLE promo_items_tbl  ADD COLUMN effective_price_date  VARCHAR(255)',
      [],
      function (tx3, res3) {
        console.log('1009.6 new field added');
      },
      SQLerror,
    );
  });

  dbinventory.transaction(function (txn) {
    txn.executeSql(
      ' ALTER TABLE promo_items_tbl  ADD COLUMN CASE_COMPANY VARCHAR(255)',
      [],
      function (tx3, res3) {
        console.log('1009.7 new field added');
      },
      SQLerror,
    );
  });

  dbinventory.transaction(function (txn) {
    txn.executeSql(
      ' ALTER TABLE promo_items_tbl  ADD COLUMN CASE_BOOKING  VARCHAR(255)',
      [],
      function (tx3, res3) {
        console.log('1009.8 new field added');
      },
      SQLerror,
    );
  });

  dbinventory.transaction(function (txn) {
    txn.executeSql(
      ' ALTER TABLE promo_items_tbl  ADD COLUMN CASE_EXTRUCK  VARCHAR(255)',
      [],
      function (tx3, res3) {
        console.log('1009.9 new field added');
      },
      SQLerror,
    );
  });

  dbinventory.transaction(function (txn) {
    txn.executeSql(
      ' ALTER TABLE promo_items_tbl  ADD COLUMN PCS_COMPANY VARCHAR(255)',
      [],
      function (tx3, res3) {
        console.log('1009.10 new field added');
      },
      SQLerror,
    );
  });

  dbinventory.transaction(function (txn) {
    txn.executeSql(
      ' ALTER TABLE promo_items_tbl  ADD COLUMN PCS_BOOKING VARCHAR(255)',
      [],
      function (tx3, res3) {
        console.log('1009.11 new field added');
      },
      SQLerror,
    );
  });

  dbinventory.transaction(function (txn) {
    txn.executeSql(
      ' ALTER TABLE promo_items_tbl  ADD COLUMN PCS_EXTRUCK VARCHAR(255)',
      [],
      function (tx3, res3) {
        console.log('1009.12 new field added');
      },
      SQLerror,
    );
  });

  dbperprincipal.transaction(function (txn) {
    txn.executeSql(
      ' ALTER TABLE perprincipalpermonth_tbl  ADD COLUMN team VARCHAR(255)',
      [],
      function (tx3, res3) {
        console.log('1009.13 new field added');
      },
      SQLerror,
    );
  });

  dbperymtsat.transaction(function (txn) {
    txn.executeSql(
      ' ALTER TABLE perymtsat_tbl  ADD COLUMN principal_name VARCHAR(255)',
      [],
      function (tx3, res3) {
        console.log('1009.14 new field added');
      },
      SQLerror,
    );
  });

  dbperarea.transaction(function (txn) {
    txn.executeSql(
      ' ALTER TABLE perareapermonth_tbl  ADD COLUMN team VARCHAR(255)',
      [],
      function (tx3, res3) {
        console.log('1009.15 new field added');
      },
      SQLerror,
    );
  });

  dbperarea.transaction(function (txn) {
    txn.executeSql(
      ' ALTER TABLE perareapermonth_tbl  ADD COLUMN principal_name VARCHAR(255)',
      [],
      function (tx3, res3) {
        console.log('1009.16 new field added');
        LocalAppVersionUpdate.LocalAppVersionUpdateField =
          Number(LocalAppVersionUpdate.LocalAppVersionUpdateField) + Number(1);
        CheckUpdate1009();
      },
      SQLerror,
    );
  });
}

function CheckUpdate1009() {
  if (LocalAppVersionUpdate.LocalAppVersionUpdateField === 1009) {
    Add1009UpdatetoLocal();
    console.log('1009 updated has been processed');
  } else {
    console.log('1009 updated NOT processed');
  }
}

function Add1009UpdatetoLocal() {
  {
    dbUpdateDbVersion.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO  updateversion_tbl (updateversion, dateTimeUpdated) VALUES (?,?)',
        [1009, moment().utcOffset('+08:00').format('YYYY-MM-DD hh:mm:ss a')],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            console.log('1009 updated added to local test');
          }
        },
        SQLerror,
      );
    });
  }
}
