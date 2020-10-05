import moment from 'moment';
import {
  dbperprincipal,
  dbperarea,
  dbperymtsat,
  dbBusinessCalendar,
  dbinventory,
  dbSalesmanNet,
  dblastdatetimeupdated,
} from '../../database/sqliteSetup';
import PageContext from '../../screens/MainDrawerScreens/pagecontext';
var MonthDiff = '';
var DaysDiff = '';
var HoursDiff = '';
var MinutesDiff = '';

export var ModuleAccess = {
  PerTeam: 'NOT ALLOWED',
  PerSalesman: 'NOT ALLOWED',
  PerPrincipal: 'NOT ALLOWED',
  PerArea: 'NOT ALLOWED',
};

function SQLerror(err) {
  console.log('SQL Error: ' + err.message);
}
export var APIToken = {
  access_token: '',
};

export var server = {
  //http://172.16.0.150:3003
  //https://boiling-atoll-20376.herokuapp.com
  //http://178.128.217.246/
  server_address: 'http://178.128.217.246/',
};

export var CurrentAppVersionUpdate = {
  CurrentAppVersionUpdateField: 1007,
  CurrentAppVersionUpdateFieldDateRelease: 'September 25, 2020',
};

export var CurrentDashboardScreen = {
  Screen: '',
};

//   company: 'coslor/',

export var globalCompany = {
  company: '',
};

export var CurrentAppScreen = {
  Screen: 'Home',
};
export var LocalAppVersionUpdate = {
  LocalAppVersionUpdateField: 0,
};


export var PageVisited = {
  PerTeamPAGE: 'YES',
  PerSalesmanPAGE: 'YES',
  PerPrincipalPAGE: 'YES',
  PerAreaPAGE: 'YES',
};



export var DashboardMonths = [];
export var DashboardYears = [];
export var DashboardTeams = [];

export var FilterList = {
  DashboardFilterMonth: moment().utcOffset('+08:00').format('MMMM'),
  DashboardFilterYear: moment().utcOffset('+08:00').format('YYYY'),
  DashboardFilterTeam: '',
  DashboardFilterYearNMonthTeam:
    moment().utcOffset('+08:00').format('YYYY') +
    moment().utcOffset('+08:00').format('MMMM') +
    ' ',
};

export var FilterListMirror = {
  DashboardFilterMonth: '',
  DashboardFilterYear: '',
  DashboardFilterTeam: '',
};

export var globalStatus = {
  updateMode: '',
  updateStatus: '',
  StartUpUpdate: false,
  dateTimeUpdated24hr: '',
};

export var LastDateTimeUpdated = {
  value: '',
};

export var WorkingDays = {
  TotalDays: '0',
  RemainingDays: '0',
  DaysGone: '0',
};

export var DashboardModalVisible = {
  isVisibleModal: false,
};

export var APIUpdateVersion = {
  APIUpdateVersionField: 0,
  APIUpdateVersionDateTimeRelease: '',
  APIUpdateVersionStatus: '',
  APIUpdateVersionNotice: '',
};

export const ResetModuleAccess = () => {
  return (
    (ModuleAccess.PerTeam = 'NOT ALLOWED'),
    (ModuleAccess.PerSalesman = 'NOT ALLOWED'),
    (ModuleAccess.PerPrincipal = 'NOT ALLOWED'),
    (ModuleAccess.PerArea = 'NOT ALLOWED')
  );
};

// List of global variables
export const ClearTeamAccess = () => {
  return (global.TeamAccessList = ''), (global.TeamAccessListForAPI = '');
};

export function ClearDefaults() {
  global.name = '';
  global.account_type = '';
  globalStatus.StartUpUpdate = false;
  DeletePerAreaAPIData();
  DeletePerymtsatAPIData();
  DeletePerPrincipalAPIData();
  DeleteCalendar();
  DeleteItems();
  delete_per_customer_tbl();
  delete_net_tbl();
  delete_per_vendor_tbl();
  delete_per_category_tbl();
}

let delete_per_customer_tbl = () => {
  dbSalesmanNet.transaction(function (tx) {
    tx.executeSql('DELETE FROM tbl_sales_per_customer ', [], (tx, results) => {
      // console.log('Deleted customer result :', results.rowsAffected);
    });
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
    tx.executeSql('DELETE FROM tbl_sales_per_category ', [], (tx, results) => {
      // console.log('Deleted category result :', results.rowsAffected);
    });
  });
};

function DeleteItems() {
  dbinventory.transaction(function (tx) {
    tx.executeSql(
      'Delete from promo_items_tbl ',
      [],
      (tx, results) => {
        // console.log('Results', results.rowsAffected);
        // if (results.rowsAffected > 0) {
        //   setupdateMessage('Current inventory cleared..');
        //   setItemsDeleted(true);
        // } else {
        //   if (LocalPromoItemData.length > 1) {
        //     console.log('error deleting');
        //   } else {
        //     console.log('nothing to delete, set true to save fetch sku');
        //     setItemsDeleted(true);
        //   }
        // }
      },
      SQLerror,
    );
  });
}

function DeletePerAreaAPIData() {
  dbperarea.transaction(function (tx) {
    tx.executeSql(
      'Delete from perareapermonth_tbl ',
      [],
      (tx, results) => {},
      SQLerror,
    );
  });
}

function DeletePerymtsatAPIData() {
  dbperymtsat.transaction(function (tx) {
    tx.executeSql(
      'Delete from perymtsat_tbl ',
      [],
      (tx, results) => {},
      SQLerror,
    );
  });
}

function DeletePerPrincipalAPIData() {
  dbperprincipal.transaction(function (tx) {
    tx.executeSql(
      'Delete from perprincipalpermonth_tbl ',
      [],
      (tx, results) => {},
      SQLerror,
    );
  });
}

function DeleteCalendar() {
  dbBusinessCalendar.transaction(function (tx) {
    tx.executeSql(
      'Delete from business_calendar_tbl   ',
      [],
      (tx, results) => {
        // if (results.rowsAffected > 0) {}
        console.log('deleted local business_calendar_tbl');
      },
      SQLerror,
    );
  });
}

export function UpdateYearMonthsFilter() {
  GetTeamsforFilter();
  GetYearforFilter();
  GetMonthsforFilter();
  GetDateTime();
  // console.log('GLOBAL YEARS MONTHS TEAM  LOADED');
}

function GetTeamsforFilter() {
  DashboardTeams.length = 0;
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

        if (len > 1) {
          DashboardTeams.push({
            label: 'ALL',
            value: 'ALL',
          });
        }

        if (len > 0) {
          for (let i = 0; i < results.rows.length; ++i) {
            DashboardTeams.push({
              label: results.rows.item(i).label,
              value: results.rows.item(i).value,
            });
          }
        }
      },
    );
  });
}

function GetMonthsforFilter() {
  DashboardMonths.length = 0;

  // console.log('months adding  from START..');
  dbperymtsat.transaction((tx) => {
    tx.executeSql(
      'SELECT Distinct business_month as label, business_month as value FROM perymtsat_tbl ' +
        ' where  business_year = 2020 ' +
        'order  by invoice_date desc ',
      [],
      (tx, results) => {
        var len = results.rows.length;
        if (len > 0) {
          for (let i = 0; i < results.rows.length; ++i) {
            DashboardMonths.push({
              label: results.rows.item(i).label,
              value: results.rows.item(i).value,
            });
          }
        }
      },
    );
  });
}

function GetYearforFilter() {
  DashboardYears.length = 0;

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

export function GetDateTime() {
  dblastdatetimeupdated.transaction((tx) => {
    tx.executeSql(
      'select max(lastdatetimeupdated24hr) as dateTimeUpdated24hr from lastdatetimeupdated_tbl  limit 1',
      [],
      (tx, results) => {
        var len = results.rows.length;
        if (len > 0) {
          globalStatus.dateTimeUpdated24hr = results.rows.item(
            0,
          ).dateTimeUpdated24hr;
          ComputeLastDateTimeUpdate();
          console.log('called');
          console.log(results.rows.item(0).dateTimeUpdated24hr);
          //  console.log(results.rows.item(0).dateTimeUpdated24hr);
        } else {
          //   console.log('No date and time in local db found');
        }
      },
      SQLerror,
    );
  });
}

function pad(num) {
  return ('0' + num).slice(-2);
}

export function hhmmss(secs) {
  var minutes = Math.floor(secs / 60);
  secs = secs % 60;
  var hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  return `${pad(minutes)}:${pad(secs)}`;
  // return pad(hours)+":"+pad(minutes)+":"+pad(secs); for old browsers
}


export function ComputeLastDateTimeUpdate() {
  var now = moment().format('DD/MM/YYYY HH:mm:ss');
  var then = globalStatus.dateTimeUpdated24hr;
  // console.log(moment().format('DD/MM/YYYY HH:mm:ss'));
  // console.log(globalStatus.dateTimeUpdated24hr + '  aaa');

  var ms = moment(now, 'DD/MM/YYYY HH:mm:ss').diff(
    moment(then, 'DD/MM/YYYY HH:mm:ss'),
  );
  var d = moment.duration(ms);
  MonthDiff = '';
  DaysDiff = '';
  HoursDiff = '';
  MinutesDiff = '';

  if (d.months() > 0) {
    MonthDiff = d.months() + ' month ';
  } else {
    MonthDiff = '';
  }

  if (d.days() === 1) {
    DaysDiff = d.days() + ' day ';
  } else if (d.days() > 1) {
    DaysDiff = d.days() + ' days ';
  } else if (d.days() < 1) {
    DaysDiff = '';
  }

  if (d.hours() === 1) {
    HoursDiff = d.hours() + ' hour ';
  } else if (d.hours() > 1) {
    HoursDiff = d.hours() + ' hours ';
  } else if (d.hours() < 1) {
    HoursDiff = '';
  }

  if (d.minutes() === 1) {
    MinutesDiff = d.minutes() + ' minute ';
  } else if (d.minutes() > 1) {
    MinutesDiff = d.minutes() + ' minutes ';
  } else if (d.minutes() < 1) {
    MinutesDiff = '';
  }
  if (MonthDiff !== '') {
    LastDateTimeUpdated.value = MonthDiff + 'ago';
  } else if (DaysDiff !== '') {
    LastDateTimeUpdated.value = DaysDiff + 'ago';
  } else if (HoursDiff !== '') {
    LastDateTimeUpdated.value = HoursDiff + 'ago';
  } else if (MinutesDiff !== '') {
    LastDateTimeUpdated.value = MinutesDiff + 'ago';
  } else {
    LastDateTimeUpdated.value = '0' + ' minutes ago';
  }
}
