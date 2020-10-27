import moment from 'moment';
import {
  dbperprincipal,
  dbperarea,
  dbperymtsat,
  dbBusinessCalendar,
  dbinventory,
  dbSalesmanNet,
  dblastdatetimeupdated,
  dbsystem_users,
} from '../../database/sqliteSetup';

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
  //http://172.16.0.150:3003/
  //https://boiling-atoll-20376.herokuapp.com/
  //http://178.128.217.246/
  //http://172.16.0.53:81//
  server_address: 'http://178.128.217.246:81/',
};

export var CurrentAppVersionUpdate = {
  CurrentAppVersionUpdateField: 1008,
  CurrentAppVersionUpdateFieldDateRelease: 'October 06, 2020',
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

// export var DashboardYears = [
//   {
//     label: '2020',
//     value: '2020',
//   },
//   {
//     label: '2019',
//     valDashboardTeamsue: '2019',
//   },
// ];
// export var DashboardMonths = [];
// export var DashboardVendor = [];

export var FilterList = {
  DashboardFilterMonth: moment().utcOffset('+08:00').format('MMMM'),
  DashboardFilterYear: moment().utcOffset('+08:00').format('YYYY'),
  DashboardFilterTeam: '',
  DashboardFilterVendor: '',

  DashboardFilterYearNMonthTeamVendor:
    moment().utcOffset('+08:00').format('YYYY') +
    moment().utcOffset('+08:00').format('MMMM') +
    ' ' +
    ' ',
};

export var FilterListMirror = {
  DashboardFilterMonth: '',
  DashboardFilterYear: '',
  DashboardFilterTeam: '',
  DashboardFilterVendor: '',
};

export var globalStatus = {
  updateMode: '',
  updateStatus: '',
  StartUpUpdate: false,
  dateTimeUpdated24hr: '',
  CurrentSeconds: '',
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
  APIForceLogout: 'FALSE',
};

export var OtherSettings = {
  AutoLogout: 0,
  AccountValidity: '',
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
  DeletelastDateTimeUpdated();
  DeleteSystemUser();
  delete_per_customer_tbl();
  delete_net_tbl();
  delete_per_vendor_tbl();
  delete_per_category_tbl();
  FilterListMirror.DashboardYears = '';
  FilterListMirror.DashboardFilterMonth = '';
  FilterListMirror.DashboardFilterTeam = '';
  FilterListMirror.DashboardFilterVendor = '';

  FilterList.DashboardYears = '';
  FilterList.DashboardFilterMonth = '';
  FilterList.DashboardFilterTeam = '';
  FilterList.DashboardFilterVendor = '';
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

function DeleteSystemUser() {
  dbsystem_users.transaction(function (tx) {
    tx.executeSql(
      'Delete from system_users_tbl ',
      [],
      (tx, results) => {},
      SQLerror,
    );
  });
}

function DeletelastDateTimeUpdated() {
  dblastdatetimeupdated.transaction(function (tx) {
    tx.executeSql(
      'Delete from lastdatetimeupdated_tbl ',
      [],
      (tx, results) => {},
      SQLerror,
    );
  });
}

function DeleteItems() {
  dbinventory.transaction(function (tx) {
    tx.executeSql(
      'Delete from promo_items_tbl ',
      [],
      (tx, results) => {},
      SQLerror,
    );
  });
}

function DeletePerAreaAPIData() {
  dbperarea.transaction(function (tx) {
    tx.executeSql(
      'Delete from perareapermonth_tbl ',
      [],
      (tx, results) => {
        if (results.rowsAffected > 0) {
          console.log('DeletePerAreaAPIData DONE');
        }
      },
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

// export function UpdateYearMonthsFilter() {
//   GetVendorsforFilter();
//   GetTeamsforFilter();
//   // GetYearforFilter();
//   GetMonthsforFilter();
//   GetDateTime();
//   // console.log('GLOBAL YEARS MONTHS TEAM  LOADED');
// }



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
          // ComputeLastDateTimeUpdate();
          //     console.log('called');
          // console.log(results.rows.item(0).dateTimeUpdated24hr);
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

// setCurrentLocalItem([
//   ...CurrentLocalItem,
//   ...temp,
// ]);
