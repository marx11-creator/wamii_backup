import React, {
  useState,
  useEffect,
  useDebugValue,
  useRef,
  useReducer,
  useContext,
} from 'react';
import moment from 'moment';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlight,
  SafeAreaView,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  KeyboardAvoidingView,
  SectionList,
  Alert,
  Button,
  Animated,
} from 'react-native';
import {dbinventory} from '../../database/sqliteSetup';
import FlatButton from '../../sharedComponents/custombutton';
import {
  scale,
  moderateScale,
  verticalScale,
  width,
  height,
} from '../../sharedComponents/scaling';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  APIToken,
  globalCompany,
  server,
  CurrentAppScreen,
  LastDateTimeUpdated,
  hhmmss,
} from '../../sharedComponents/globalCommands/globalCommands';
import PageContextGlobalState from '../MainDrawerScreens/pagecontextGlobalState';
import PageContextGlobalTimer from '../MainDrawerScreens/pagecontextGlobalTimer';
import Icon from 'react-native-vector-icons/Ionicons';
import numbro from 'numbro';
import Swiper from 'react-native-swiper';
import MaterialIcons from 'react-native-vector-icons//MaterialIcons';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import BackgroundTimer from 'react-native-background-timer';
import RNPickerSelect from 'react-native-picker-select';
import {getBrand} from 'react-native-device-info';
import { cos } from 'react-native-reanimated';
var CurrentItemCount = 0;
var count = 0;
var localItemcount = 0;

// var VariantListfromPicker = '';
// var TypeListfromPicker = '';
var longStrinfg = '';

var test = 'aa';
// var arrVariantListfromPickerLocal = [];
export default function Inventory(props) {
  const arrProductTypefromPickerFields = [
    {
      label: 'Promo',
      value: 'Promo',
    },
    {
      label: 'Regular',
      value: 'Regular',
    },
  ];

  const arrPriceOptionfromPickerFields = [
    {
      label: 'Booking',
      value: 'Booking',
    },
    {
      label: 'Van',
      value: 'Van',
    },
  ];

  const [pleaseWaitMessage, setpleaseWaitMessage] = useState('Please wait...');
  //
  const [arrVendorfromPicker, setarrVendorfromPicker] = useState('');
  const [arrCategoryfromPicker, setarrCategoryfromPicker] = useState([]);
  const [arrBrandfromPicker, setarrBrandfromPicker] = useState([]);
  const [arrPriceOptionfromPicker, setarrPriceOptionfromPicker] = useState(
    arrPriceOptionfromPickerFields,
  );
  const [arrVariantfromPicker, setarrVariantfromPicker] = useState([]);
  const [arrProductTypefromPicker, setarrProductTypefromPicker] = useState(
    arrProductTypefromPickerFields,
  );
  //

  const [VendorPickerCatcherState, setVendorPickerCatcherState] = useState('');
  const [CategoryPickerCatcherState, setCategoryPickerCatcherState] = useState(
    '',
  );
  const [BrandPickerCatcherState, setBrandPickerCatcherState] = useState('');

  const [VariantPickerCatcherState, setVariantPickerCatcherState] = useState(
    '',
  );

  const [
    ProductTypePickerCatcherState,
    setProductTypePickerCatcherState,
  ] = useState('');

  const [
    PriceOptionPickerCatcherState,
    setPriceOptionPickerCatcherState,
  ] = useState('');

  const [refreshing, setRefreshing] = React.useState(false);
  const fadeIn = useRef(new Animated.Value(0)).current;
  var ImageLoop = [];
  var refContainer = useRef();
  var swiper = useRef();
  const [
    onEndReachedCalledDuringMomentum,
    setonEndReachedCalledDuringMomentum,
  ] = useState(false);

  const [isVisibleButton, setisVisibleButton] = useState(false);
  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(2000).then(() => {
      setRefreshing(false);
      console.log('refreshed');

      GetPrincipalList();
      GetLocalPromoItems(page);
    });
  }, []);
  //   const onEndReached = () => {
  //     if (onEndReachedCalledDuringMomentum===false) {
  //       console.log('reach edndadad')
  //       setonEndReachedCalledDuringMomentum(true);

  // if (start < LocalPromoItemData.length){
  //   var temp = [];
  //   LocalPromoItemData.slice([start -1 + -2], [end]).map((item, i) => {
  //       temp.push(item);
  //   });
  //   setCurrentLocalItem(temp);
  //   refContainer.current.scrollToIndex({ animated: false, index: 0 });
  //   setpage(Number(page) + Number(1))
  //       setstart(Number(start) + Number(200));
  //   setend(Number(end) + Number(200));

  // }

  //     }
  //   };

  const onIndexChanged = (index) => {
    swiper.current.scrollTo(9);
  };

  function MovedSwiper(inumber) {
    swiper.current.scrollTo(inumber);
  }

  const [globalState] = useContext(PageContextGlobalState);
  const [globalTimer] = useContext(PageContextGlobalTimer);

  const LocalDBFields = [
    {
      row_number: 0,
      ref_id: ' ',
      product_id: ' ',
      product_variant: ' ',
      product_name: ' ',
      inventory: ' ',
      img_url: ' ',
      DateandTimeUpdated: ' ',
      total_case: 0,
      total_pieces: 0,
      effective_price_date: '',
      CASE_COMPANY: 0,
      CASE_BOOKING: 0,
      CASE_EXTRUCK: 0,
      PCS_COMPANY: 0,
      PCS_BOOKING: 0,
      PCS_EXTRUCK: 0,
    },
  ];
  const LocalDBFields2 = [
    {
      ref_id: ' ',
      product_id: ' ',
      product_variant: ' ',
      product_name: ' ',
      inventory: ' ',
      img_url: ' ',
      DateandTimeUpdated: ' ',
      total_case: 0,
      total_pieces: 0,
      effective_price_date: '',
      CASE_COMPANY: 0,
      CASE_BOOKING: 0,
      CASE_EXTRUCK: 0,
      PCS_COMPANY: 0,
      PCS_BOOKING: 0,
      PCS_EXTRUCK: 0,
    },
  ];

  const PrincipalListFields = [
    {
      label: '',
      value: '',
    },
  ];
  const CategoryListFields = [
    {
      label: '',
      value: '',
    },
  ];
  const BrandListFields = [
    {
      label: '',
      value: '',
    },
  ];
  const VariantListFields = [
    {
      label: '',
      value: '',
    },
  ];

  const ItemFields = [
    {
      Vendor: '',
      Category: '',
    },
  ];

  const InventorySummaryFields = [
    {
      VendorName: ' ',
      Category: ' ',
      Brand: ' ',
      TotalItems: 0,
      TotalCase: 0,
      TotalAmount: 0,
    },
  ];
  const [PleaseWaitVisible, setPleaseWaitVisible] = useState(false);
  const [PleaseWaitImageList, setPleaseWaitImageList] = useState(false);
  const [currentIndex, setcurrentIndex] = useState(0);
  const [InventorySummary, setInventorySummary] = useState(
    InventorySummaryFields,
  );
  const [unitPrice, setunitPrice] = useState('PCS');
  const [updateMessage, setupdateMessage] = useState('Updating...');
  const [page, setpage] = useState(0);

  const [PrincipalList, setPrincipalList] = useState(PrincipalListFields);
  const [CategoryList, setCategoryList] = useState(CategoryListFields);
  const [BrandList, setBrandList] = useState(BrandListFields);
  const [VariantList, setVariantList] = useState(VariantListFields);

  const [isModalVisible2, setisModalVisible2] = useState(false);

  const [loading, setLoading] = useState(false);

  var start = 1;
  var end = 50;
  const [isLastPage, setisLastPage] = useState(false);

  const [CurrentLocalItem, setCurrentLocalItem] = useState([]);
  const [LocalPromoItemData, setLocalPromoItemData] = useState(LocalDBFields);
  const [
    isVisiblePrincipalDropdownPicker,
    setisVisiblePrincipalDropdownPicker,
  ] = useState(false);
  const [
    isVisibleVariantDropdownPicker,
    setisVisibleVariantDropdownPicker,
  ] = useState(false);
  const [
    isVisibleTypeDropdownPicker,
    setisVisibleTypeDropdownPicker,
  ] = useState(false);

  const [
    isVisibleCategoryDropdownPicker,
    setisVisibleCategoryDropdownPicker,
  ] = useState(false);

  const [
    isVisibleBrandDropdownPicker,
    setisVisibleBrandDropdownPicker,
  ] = useState(false);

  const [
    isVisiblePriceOptionDropdownPicker,
    setisVisiblePriceOptionDropdownPicker,
  ] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const [SelectedImage, setSelectedImage] = useState('');

  const [ItemsDeleted, setItemsDeleted] = useState(false);

  const [visibleMainModal, setVisibleMainModal] = useState(false);
  const [visibleImageListModal, setvisibleImageListModal] = useState(false);

  // useEffect(() => {
  //   if (visibleImageListModal === true) {
  //     MovedSwiper(20);
  //     console.log(visibleImageListModal + ' true');
  //   } else {
  //     console.log(visibleImageListModal + ' false');
  //   }
  // }, [visibleImageListModal]);

  // useEffect(() => {
  //   if (PleaseWaitVisible === false) {
  //     if (refContainer.current) {
  //       //2
  //       refContainer.current.scrollToIndex({animated: true, index: 0});
  //     }
  //   }
  // }, [PleaseWaitVisible]);

  // function wait(timeout) {
  //   return new Promise((resolve) => {
  //     setTimeout(resolve, timeout);
  //   });
  // }

  // const dateTimeSet = () => {
  //   var date = moment().utcOffset('+08:00').format('MMMM DD YYYY, h:mm:ss a');
  //   setDateTime(date);
  // };

  // const onRefresh = React.useCallback(() => {
  //   setPromoSKURefreshing(true);

  //   // wait(1000).then(() => {
  //   console.log('slide down..');
  //   DownloadPromoItems();
  //   // dateTimeSet();
  //   // });
  // }, [PromoSKURefreshing]);

  // useEffect(() => {
  //   if (ApiPromoItemData.length === ApiRowsCount) {
  //     ApiRowsCount = 0;
  //     DeleteItems();
  //   }
  // });

  // useEffect(() => {
  //   if (ItemsDeleted === true) {
  //     [SavePromoItems(), setItemsDeleted(false)];
  //   }
  // });

  // const datas = [
  //   {
  //     name: 'ARJAY',
  //     lastname: 'DAVID',
  //     age: '28',
  //     sex: 'M',
  //   },
  //   {
  //     name: 'JANE',
  //     lastname: 'NALUS',
  //     age: '27',
  //     sex: 'F',
  //   },
  //   {
  //     name: 'MARK',
  //     lastname: 'MANGILA',
  //     age: '27',
  //     sex: 'F',
  //   },
  // ];

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      console.log('focus on per per item');
      CurrentAppScreen.Screen = 'Inventory';
      GetPrincipalList();
      GetLocalPromoItems(page);
    });
  }, []);

  useEffect(() => {
    console.log('focus on per sku after update'); //
    CurrentAppScreen.Screen = 'Inventory';
    GetPrincipalList();
    GetLocalPromoItems(page);
  }, [globalState.dateTimeUpdated24hr]);

  function GetLocalPromoItems(page) {
    var pageNumber = page * 50;
    var endofPagenumber = pageNumber + 50;

    // console.log(pageNumber);
    // console.log(pageNumber + 50);
    var TotalItems1 = 0;
    var TotalCase1 = 0;
    var TotalAmount1 = 0;
    var TotalItems1 = 0;
    var TotalCase1 = 0;
    var TotalAmount1 = 0;

    var PrincipalQuery = '';
    if (
      VendorPickerCatcherState === '' ||
      VendorPickerCatcherState === 'ALL' ||
      VendorPickerCatcherState === null
    ) {
      PrincipalQuery = '  principal_name like ' + "'%%' ";
    } else {
      PrincipalQuery =
        ' principal_name = ' + "'" + VendorPickerCatcherState + "'";
    }

    var CategoryQuery = '';

    if (
      CategoryPickerCatcherState === '' ||
      CategoryPickerCatcherState === 'ALL' ||
      CategoryPickerCatcherState === null
    ) {
      CategoryQuery = '  and product_category like ' + "'%%' ";
    } else {
      CategoryQuery =
        ' and product_category = ' + "'" + CategoryPickerCatcherState + "'";
    }

    var BrandQuery = '';

    if (
      BrandPickerCatcherState === '' ||
      BrandPickerCatcherState === 'ALL' ||
      BrandPickerCatcherState === null
    ) {
      BrandQuery = '  and product_brand like ' + "'%%' ";
    } else {
      BrandQuery =
        ' and product_brand = ' + "'" + BrandPickerCatcherState + "'";
    }

    var VariantQuery = '';

    if (
      VariantPickerCatcherState === '' ||
      VariantPickerCatcherState === 'ALL' ||
      VariantPickerCatcherState === null
    ) {
      VariantQuery = '  and product_variant like ' + "'%%' ";
    } else {
      VariantQuery =
        ' and product_variant = ' + "'" + VariantPickerCatcherState + "'";
    }

    var PromoProductQuery = '';

    if (
      ProductTypePickerCatcherState === '' ||
      ProductTypePickerCatcherState === 'ALL' ||
      ProductTypePickerCatcherState === null
    ) {
      PromoProductQuery = '  and promo_product like ' + "'%%' ";
    } else {
      PromoProductQuery =
        ' and promo_product = ' + "'" + ProductTypePickerCatcherState + "'";
    }
 
    dbinventory.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM promo_items_tbl where ' +
          PrincipalQuery +
          CategoryQuery +
          BrandQuery +
          VariantQuery +
          PromoProductQuery +
          ' order by principal_name, product_variant, product_name limit 3  ',
        [],
        (tx, results) => {
          var len = results.rows.length;

          if (len > 0) {
            if (Number(pageNumber) + Number(50) > Number(results.rows.length)) {
              endofPagenumber = results.rows.length;
              setisLastPage(true);
            } else {
              setisLastPage(false);
            }

            var temp = [];
            CurrentItemCount = 0;
            for (let i = pageNumber; i < endofPagenumber; ++i) {
              CurrentItemCount = CurrentItemCount + 1;

              temp.push(results.rows.item(i));
            }

            for (let i = 0; i < results.rows.length; ++i) {
              TotalItems1 = TotalItems1 + 1;
              TotalCase1 = TotalCase1 + Number(results.rows.item(i).total_case);
              TotalAmount1 =
                TotalAmount1 +
                Number(
                  Number(results.rows.item(i).total_case) *
                    Number(results.rows.item(i).CASE_COMPANY),
                );
            }

            var VendorShow = '';
            if (
              VendorPickerCatcherState === '' ||
              VendorPickerCatcherState === 'ALL'||
              VendorPickerCatcherState === null
            ) {
              VendorShow = 'ALL';
            } else {
              VendorShow = results.rows.item(0).principal_name;
            }

            var CategoryShow = '';
            if (
              CategoryPickerCatcherState === '' ||
              CategoryPickerCatcherState === 'ALL'||
              CategoryPickerCatcherState === null
            ) {
              CategoryShow = 'ALL';
            } else {
              CategoryShow = results.rows.item(0).product_category;
            }

            var BrandShow = '';
            if (
              BrandPickerCatcherState === '' ||
              BrandPickerCatcherState === 'ALL'||
              BrandPickerCatcherState === null
            ) {
              BrandShow = 'ALL';
            } else {
              BrandShow = results.rows.item(0).product_brand;
            }

            setInventorySummary({
              ...InventorySummary,
              TotalItems: TotalItems1,
              TotalCase: TotalCase1,
              TotalAmount: TotalAmount1,
              VendorName: VendorShow,
              Category: CategoryShow,
              Brand: BrandShow,
            });

            console.log('Successfully loaded Initial ' + temp.length + ' sku');
            setLocalPromoItemData(temp);

            setPleaseWaitVisible(false);
          } else {
            setLocalPromoItemData([]);
            setpleaseWaitMessage('No items found.');
            setPleaseWaitVisible(false);
          }
        },
        SQLerror,
      );
    });
  }

  function GetPrincipalList() {
    const AllPrincipal = {
      label: 'ALL',
      value: 'ALL',
    };

    dbinventory.transaction((tx) => {
      tx.executeSql(
        'SELECT Distinct principal_name as label, principal_name as value FROM promo_items_tbl order by principal_name asc',
        [],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            var temp = [];
            temp.push(AllPrincipal);
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
            setarrVendorfromPicker(temp);
          } else {
            console.log('error getting principal list');
          }
        },
      );
    });
  }

  function GetCategoryList(value) {
    // var category1 = '';

    const AllCategory = {
      label: 'ALL',
      value: 'ALL',
    };

    // var TwoRow = [];
    // const AllRow = {
    //   label: 'ALL',
    //   value: 'ALL',
    // };

    // const BlankRow = {
    //   label: '--',
    //   value: '--',
    // };

    var PrincipalQuery = '';
    if (value === 'ALL' || value === '' || value === null) {
      PrincipalQuery = '  principal_name like ' + "'%%' ";
    } else {
      PrincipalQuery = ' principal_name = ' + "'" + value + "'";
    }
 
    dbinventory.transaction((tx) => {
      tx.executeSql(
        'SELECT Distinct product_category as label, product_category as value FROM promo_items_tbl where ' +
          PrincipalQuery +
          ' order by product_category',
        [],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            var temp = [];
            temp.push(AllCategory);
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));

              // if (i === 0) {
              //   category1 = results.rows.item(i).label;
              // }
            }
            setarrCategoryfromPicker(temp);
            setarrBrandfromPicker([]);
            setarrVariantfromPicker([]);
            // setarrCategoryfromPicker(temp);
            // setCategoryPickerCatcherState(category1);
            // setCategoryPickerCatcherState('ALL');
            //////////////////////////////////

            // TwoRow.push(AllRow);
            // TwoRow.push(BlankRow);

            // setarrBrandfromPicker(TwoRow);

            // setBrandPickerCatcherState('--');
            // setBrandPickerCatcherState('ALL');
            // //////////////////////////////////

            // setarrVariantfromPicker(TwoRow);

            // setVariantPickerCatcherState('--');
            // setVariantPickerCatcherState('ALL');
          } else {
            console.log('error on 1G2tCategoryList');
          }
        },
        SQLerror,
      );
    });
  }

  function GetBrandList(value) {
    const AllBrand = {
      label: 'ALL',
      value: 'ALL',
    };

    var PrincipalQuery = '';
    if (
      VendorPickerCatcherState === 'ALL' ||
      VendorPickerCatcherState === '' ||
      VendorPickerCatcherState === null
    ) {
      PrincipalQuery = '  principal_name like ' + "'%%' ";
    } else {
      PrincipalQuery =
        ' principal_name = ' + "'" + VendorPickerCatcherState + "'";
    }

    var CategoryQuery = '';
    if (value === 'ALL' || value === '' || value === null) {
      CategoryQuery = ' and  product_category like ' + "'%%' ";
    } else {
      CategoryQuery = ' and  product_category = ' + "'" + value + "'";
    }

 
    dbinventory.transaction((tx) => {
      tx.executeSql(
        'SELECT Distinct product_brand as label, product_brand as value FROM promo_items_tbl where ' +
          PrincipalQuery +
          CategoryQuery +
          ' order by product_brand',
        [],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            var temp = [];
            temp.push(AllBrand);
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
            setarrBrandfromPicker(temp);

            setarrVariantfromPicker([]);
            // setarrBrandfromPicker(temp);

            // setBrandPickerCatcherState(brand1);
            // setBrandPickerCatcherState('ALL');
            // //////////////////////////////////

            // TwoRow.push(AllRow);
            // TwoRow.push(BlankRow);

            // setarrVariantfromPicker(TwoRow);

            // setVariantPickerCatcherState('--');
            // setVariantPickerCatcherState('ALL');
          } else {
            console.log('error on GetBrandList');
          }
        },
        SQLerror,
      );
    });
  }

  function GetVariantList(value) {
    const AllVariant = {
      label: 'ALL',
      value: 'ALL',
    };
    var PrincipalQuery = '';
    if (
      VendorPickerCatcherState === 'ALL' ||
      VendorPickerCatcherState === '' ||
      VendorPickerCatcherState === null
    ) {
      PrincipalQuery = '  principal_name like ' + "'%%' ";
    } else {
      PrincipalQuery =
        ' principal_name = ' + "'" + VendorPickerCatcherState + "'";
    }

    var CategoryQuery = '';
    if (
      CategoryPickerCatcherState === 'ALL' ||
      CategoryPickerCatcherState === '' ||
      CategoryPickerCatcherState === null
    ) {
      CategoryQuery = ' and  product_category like ' + "'%%' ";
    } else {
      CategoryQuery =
        ' and  product_category = ' + "'" + CategoryPickerCatcherState + "'";
    }

    var BrandQuery = '';
    if (value === 'ALL' || value === '' || value === null) {
      BrandQuery = ' and  product_brand like ' + "'%%' ";
    } else {
      BrandQuery = ' and  product_brand = ' + "'" + value + "'";
    }

    console.log(
      'SELECT Distinct product_variant as label, product_variant as value FROM promo_items_tbl where ' +
        PrincipalQuery +
        CategoryQuery +
        BrandQuery +
        ' order by product_brand',
    );
    dbinventory.transaction((tx) => {
      tx.executeSql(
        'SELECT Distinct product_variant as label, product_variant as value FROM promo_items_tbl where ' +
          PrincipalQuery +
          CategoryQuery +
          BrandQuery +
          ' order by product_brand',
        [],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            var temp = [];
            temp.push(AllVariant);
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
            setarrVariantfromPicker(temp);
            // setarrVariantfromPicker(temp);

            // setVariantPickerCatcherState(variant1);
            // setVariantPickerCatcherState('ALL');
          } else {
            console.log('error on GetVariantList');
          }
        },
      );
    });
  }

  // const DownloadPromoItems = () => {
  //   Promise.race([
  //     fetch(server.server_address + globalCompany.company + 'promo_item', {
  //       method: 'GET',
  //       headers: {
  //         Accept: 'application/json',
  //         'Content-Type': 'application/json',
  //         Authorization: 'Bearer ' + APIToken.access_token,
  //       },
  //     }),
  //     new Promise((_, reject) =>
  //       setTimeout(() => reject(new Error('Timeout')), 40000),
  //     ),
  //   ])
  //     .then((responseData) => {
  //       return responseData.json();
  //     })
  //     .then((jsonData) => {
  //       // console.log(jsonData);
  //       setApiPromoItemData(jsonData);
  //       ApiRowsCount = jsonData.length;
  //       //console.log(ApiPromoItemData);
  //       setupdateMessage(jsonData.length + ' rows fetched. saving data...');
  //     })
  //     .catch(function (error) {
  //       console.log('Error 1:' + error.message);
  //       setLoading(false);
  //       setModalVisible(true);
  //     })
  //     .done();
  // };

  function SQLerror(err) {
    console.log('SQL Error: ' + err);
  }

  // function SavePromoItems() {
  //   longStrinfg = '';
  //   var stocks = 0;
  //   var ProductType = '';
  //   var totalProduct = 0;
  //   {
  //     ApiPromoItemData.map(function (item, i) {
  //       totalProduct = totalProduct + 1;
  //       if (item.promo_product === '1') {
  //         ProductType = 'Promo';
  //       } else {
  //         ProductType = 'Regular';
  //       }

  //       if (parseInt(item.total_case) < 1) {
  //         stocks = item.total_pieces + ' PCS';
  //       } else {
  //         stocks = (item.total_case * 1).toFixed(2) + ' CS';
  //       }
  //       longStrinfg =
  //         longStrinfg +
  //         "('" +
  //         item.principal_name +
  //         "'" +
  //         ',' +
  //         "'" +
  //         item.product_id +
  //         "'" +
  //         ',' +
  //         "'" +
  //         item.product_variant +
  //         "'" +
  //         ',' +
  //         "'" +
  //         item.product_name +
  //         "'" +
  //         ',' +
  //         "'" +
  //         ProductType +
  //         "'" +
  //         ',' +
  //         "'" +
  //         stocks +
  //         "'" +
  //         ',' +
  //         "'" +
  //         item.img_url +
  //         "'" +
  //         ',' +
  //         "'" +
  //         item.DateandTimeUpdated +
  //         "'" +
  //         '),';
  //     });
  //   }

  //   if (totalProduct === ApiPromoItemData.length) {
  //     dbinventory.transaction(function (tx) {
  //       tx.executeSql(
  //         ' INSERT INTO promo_items_tbl (principal_name, product_id, product_variant, product_name, promo_product, inventory, img_url, DateandTimeUpdated) values ' +
  //           longStrinfg.slice(0, -1),
  //         [],
  //         (tx, results) => {
  //           if (results.rowsAffected > 0) {
  //             setLoading(false);
  //             GetLocalPromoItems();
  //             GetPrincipalList();
  //             GetDateTime();
  //             setPromoSKURefreshing(false);

  //             Alert.alert(
  //               'Success!',
  //               ApiPromoItemData.length + ' Products updated.',
  //               [{text: 'Ok'}],
  //             );
  //           } else {
  //             console.log('error');
  //           }
  //         },
  //         SQLerror,
  //       );
  //     });
  //   }
  // }

  // function SavePromoItems() {
  //   var stocks = 0;
  //   var ProductType = '';
  //   {
  //     ApiPromoItemData.map(function (item, i) {
  //       if (item.promo_product === '1') {
  //         ProductType = 'Promo';
  //       } else {
  //         ProductType = 'Regular';
  //       }

  //       dbinventory.transaction(function (tx) {
  //         if (parseInt(item.total_case) < 1) {
  //           stocks = item.total_pieces + ' PCS';
  //         } else {
  //           stocks = (item.total_case * 1).toFixed(2) + ' CS';
  //         }
  //         tx.executeSql(
  //           'INSERT INTO promo_items_tbl (principal_name, product_id, product_variant, product_name, promo_product, inventory, img_url, DateandTimeUpdated) VALUES (?,?,?,?,?,?,?,?)',
  //           [
  //             item.principal_name,
  //             item.product_id,
  //             item.product_variant,
  //             item.product_name,
  //             ProductType,
  //             stocks,
  //             item.img_url,
  //             item.DateandTimeUpdated,
  //           ],
  //           (tx, results) => {
  //             // console.log('Results', results.rowsAffected);
  //             if (results.rowsAffected > 0) {
  //               count = count + 1;
  //               setupdateMessage(
  //                 count + '/' + ApiPromoItemData.length + ' products updated.',
  //               );
  //               if (count === ApiPromoItemData.length) {
  //                 setLoading(false);
  //                 GetLocalPromoItems();
  //                 GetDateTime();
  //                 // GetPrincipalList();
  //                 count = 0;
  //                 setPromoSKURefreshing(false);
  //                 Alert.alert(
  //                   'Success!',
  //                   ApiPromoItemData.length + ' Products updated.',
  //                   [{text: 'Ok'}],
  //                 );
  //               }
  //             } else {
  //               console.log('error');
  //             }
  //           },
  //           SQLerror,
  //         );
  //       });
  //     });
  //   }
  //   ApiRowsCount = 0;
  // }

  // function DeleteItems() {
  //   dbinventory.transaction(function (tx) {
  //     tx.executeSql(
  //       'Delete from promo_items_tbl ',
  //       [],
  //       (tx, results) => {
  //         // console.log('Results', results.rowsAffected);
  //         if (results.rowsAffected > 0) {
  //           setupdateMessage('Current inventory cleared..');
  //           setItemsDeleted(true);
  //         } else {
  //           if (LocalPromoItemData.length > 1) {
  //             console.log('error deleting');
  //           } else {
  //             console.log('nothing to delete, set true to save fetch sku');
  //             setItemsDeleted(true);
  //           }
  //         }
  //       },
  //       SQLerror,
  //     );
  //   });
  // }

  const images = [
    {
      // Simplest usage.
      url: SelectedImage,
    },
  ];

  function ShowPleaseWait() {
    return (
      <View
        style={{
          zIndex: 2,
          flex: 1,
          backgroundColor: 'rgba(71, 72, 61, 0.5)',
          position: 'absolute',
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        }}>
        <View
          style={{
            borderRadius: 20,
            backgroundColor: '#ffffff',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              opacity: 1,
              height: 50,
              width: 200,
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: moderateScale(18)}}>Please wait... </Text>
            <ActivityIndicator size="large" color="green" />
          </View>
        </View>
      </View>
    );
  }

  function FlatListHeader() {
    return (
      <View style={{}}>
        <LinearGradient
          style={{zIndex: 0, margin: 0}}
          // start={{x: 1, y: 0.5}}
          // end={{x: 1, y: 4}}
          colors={['#1AD661', '#065223']}>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: 'transparent',
              marginVertical: 5,
            }}>
            <View
              style={{
                backgroundColor: 'transparent',
                flex: 1,
                marginLeft: scale(5),
              }}>
              <View
                style={{backgroundColor: 'transparent', flexDirection: 'row'}}>
                <View style={{flex: 1, backgroundColor: 'transparent'}}>
                  <Text
                    style={{
                      fontSize: moderateScale(15, 0.5),
                      color: '#ffffff',
                    }}>
                    Vendor :
                  </Text>
                </View>

                <View style={{flex: 2, backgroundColor: 'transparent'}}>
                  <Text
                    style={{
                      fontSize: moderateScale(13, 0.5),
                      color: '#ffffff',
                    }}>
                    {InventorySummary.VendorName}
                  </Text>
                </View>
              </View>

              <View
                style={{backgroundColor: 'transparent', flexDirection: 'row'}}>
                <View style={{flex: 1, backgroundColor: 'transparent'}}>
                  <Text
                    style={{
                      fontSize: moderateScale(15, 0.5),
                      color: '#ffffff',
                    }}>
                    Category :
                  </Text>
                </View>

                <View style={{flex: 2, backgroundColor: 'transparent'}}>
                  <Text
                    style={{
                      fontSize: moderateScale(15, 0.5),
                      color: '#ffffff',
                    }}>
                    {InventorySummary.Category}
                  </Text>
                </View>
              </View>
              <View
                style={{backgroundColor: 'transparent', flexDirection: 'row'}}>
                <View style={{flex: 1, backgroundColor: 'transparent'}}>
                  <Text
                    style={{
                      fontSize: moderateScale(15, 0.5),
                      color: '#ffffff',
                    }}>
                    Brand :
                  </Text>
                </View>

                <View style={{flex: 2, backgroundColor: 'transparent'}}>
                  <Text
                    style={{
                      fontSize: moderateScale(15, 0.5),
                      color: '#ffffff',
                    }}>
                    {InventorySummary.Brand}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{backgroundColor: 'transparent', flex: 1}}>
              <View
                style={{backgroundColor: 'transparent', flexDirection: 'row'}}>
                <View style={{flex: 1, backgroundColor: 'transparent'}}>
                  <Text
                    style={{
                      fontSize: moderateScale(15, 0.5),
                      color: '#ffffff',
                    }}>
                    Total Items :
                  </Text>
                </View>

                <View style={{flex: 1, backgroundColor: 'transparent'}}>
                  <Text
                    style={{
                      fontSize: moderateScale(15, 0.5),
                      color: '#ffffff',
                    }}>
                    {InventorySummary.TotalItems > 0
                      ? numbro(Number(InventorySummary.TotalItems)).format({
                          thousandSeparated: true,
                          mantissa: 0,
                        })
                      : null}
                  </Text>
                </View>
              </View>

              <View
                style={{backgroundColor: 'transparent', flexDirection: 'row'}}>
                <View style={{flex: 1, backgroundColor: 'transparent'}}>
                  <Text
                    style={{
                      fontSize: moderateScale(15, 0.5),
                      color: '#ffffff',
                    }}>
                    Total Case :
                  </Text>
                </View>

                <View style={{flex: 1, backgroundColor: 'transparent'}}>
                  <Text
                    style={{
                      fontSize: moderateScale(15, 0.5),
                      color: '#ffffff',
                    }}>
                    {InventorySummary.TotalCase > 0
                      ? numbro(Number(InventorySummary.TotalCase)).format({
                          thousandSeparated: true,
                          mantissa: 0,
                        })
                      : null}
                  </Text>
                </View>
              </View>

              {global.sales_position_name === 'ALLSALESMAN' ? (
                <View
                  style={{
                    backgroundColor: 'transparent',
                    flexDirection: 'row',
                    marginBottom: 3,
                  }}>
                  <View style={{flex: 1, backgroundColor: 'transparent'}}>
                    <Text
                      style={{
                        fontSize: moderateScale(15, 0.5),
                        color: '#ffffff',
                      }}>
                      Total Amount :
                    </Text>
                  </View>

                  <View
                    style={{
                      flex: 1,
                      backgroundColor: 'transparent',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: moderateScale(13, 0.5),
                        color: '#ffffff',
                      }}>
                      P{' '}
                      {InventorySummary.TotalAmount > 0
                        ? numbro(Number(InventorySummary.TotalAmount)).format({
                            thousandSeparated: true,
                            mantissa: 0,
                          })
                        : null}
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>
          </View>
        </LinearGradient>

        {/* <ActivityIndicator size="large" color="green" /> */}
      </View>
    );
  }

  LocalPromoItemData.slice([0], [LocalPromoItemData.length]).map((item, i) => {
    // placeIDs.push(item.place_id);

    ImageLoop.push(
      <View
        testID="Hello"
        style={{flex: 1, backgroundColor: '#ffffff', flexDirection: 'column'}}>
        <ScrollView>
          <View
            style={{
              backgroundColor: 'red',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              borderBottomColor: '#F5F5F5',
              borderBottomWidth: 10,
            }}>
            <View
              style={{
                flex: 1,
                zIndex: 4,
                position: 'absolute',
                width: moderateScale(120),
                height: moderateScale(120),
                alignItems: 'center',
                justifyContent: 'center',
                right: -1,
                top: 5,
                backgroundColor: 'transparent',
              }}>
              <Image
                style={{
                  width: scale(120),
                  height: scale(120),
                }}
                source={require('../../assets/companyname.png')}
              />
            </View>

            <TouchableHighlight
              onPress={() => {
                //  console.log('ad');

                //  setPleaseWaitImageList(true);

                setSelectedImage(item.img_url);
                setVisibleMainModal(true);
                //  /zoomview
              }}>
              <Image
                style={{
                  width: width,
                  height: 400,
                }}
                source={{
                  uri: item.img_url,
                }}
                onError={() => ({
                  uri:
                    'https://public-winganmarketing.sgp1.digitaloceanspaces.com/products/noimage.png',
                })}
              />
            </TouchableHighlight>
          </View>
          <Text
            style={{
              // FOR IMAGE SLIDE
              marginHorizontal: moderateScale(10),
              color: 'red',
              fontSize: moderateScale(22),
              marginBottom: moderateScale(10),
              marginTop: moderateScale(20),
              fontFamily: 'Lato-Bold',
            }}>
            {PriceOptionPickerCatcherState === '' ||
            PriceOptionPickerCatcherState === 'Booking' ||
            PriceOptionPickerCatcherState === 'ALL' ||
            PriceOptionPickerCatcherState === null
              ? '₱' +
                numbro(Number(item.PCS_BOOKING)).format({
                  thousandSeparated: true,
                  mantissa: 2,
                })
              : '₱' +
                numbro(Number(item.PCS_EXTRUCK)).format({
                  thousandSeparated: true,
                  mantissa: 2,
                })}
          </Text>

          <View
            style={{
              marginHorizontal: moderateScale(10),
              backgroundColor: '#ffffff',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            <Text> </Text>
            <Image
              style={{
                width: moderateScale(40),
                height: moderateScale(40),
                resizeMode: 'center',
              }}
              source={require('../../assets/wamilogo.png')}
              // source={require('../../assets/coslorlogo.png')}
            />

            <Text style={[styles.text, {marginLeft: moderateScale(20)}]}>
              {item.product_name}
            </Text>
          </View>
          <View
            style={{
              marginTop: moderateScale(12),
              marginHorizontal: moderateScale(10),
              backgroundColor: '#FBDEE0',
              justifyContent: 'center',
              alignItems: 'flex-start',
              borderRadius: 7,
            }}>
            <View
              style={{
                marginVertical: 5,
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={{marginLeft: moderateScale(5)}}>
                <Icon name="layers-outline" color={'#FF0F16'} size={19} />
              </View>
              <Text style={{color: 'red', fontSize: moderateScale(13)}}>
                {' '}
                Category{' '}
              </Text>
              <Text style={[styles.text, {fontSize: moderateScale(17)}]}>
                {item.product_category}
              </Text>
            </View>
          </View>
          <View>
            <View style={{borderBottomColor: '#F5F5F5', borderBottomWidth: 8}}>
              <View
                style={{
                  marginHorizontal: moderateScale(10),
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignContent: 'center',
                  marginVertical: moderateScale(8),
                }}>
                <Text
                  style={{
                    color: '#333333',
                    fontSize: moderateScale(15),
                    marginBottom: 1,
                  }}>
                  {' '}
                  5{' '}
                </Text>
                <MaterialIcons
                  name="grade"
                  size={moderateScale(20)}
                  color="#F9C500"
                />
                <MaterialIcons
                  name="grade"
                  size={moderateScale(20)}
                  color="#F9C500"
                />

                <MaterialIcons
                  name="grade"
                  size={moderateScale(20)}
                  color="#F9C500"
                />

                <MaterialIcons
                  name="grade"
                  size={moderateScale(20)}
                  color="#F9C500"
                />

                <MaterialIcons
                  name="grade"
                  size={moderateScale(20)}
                  color="#F9C500"
                />
              </View>
            </View>

            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  marginHorizontal: moderateScale(10),
                }}>
                <Text style={[styles.text, {marginTop: moderateScale(10)}]}>
                  Brand: {'    '}
                  {item.product_brand}
                </Text>
                <Text style={[styles.text, {marginBottom: moderateScale(10)}]}>
                  Variant: {'  '}
                  {item.product_variant}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignContent: 'center',
                  marginRight: 10,
                }}>
                <MaterialCommunityIcons
                  name="heart-multiple-outline"
                  size={moderateScale(30)}
                  color="#A0A0A0"
                  style={{marginRight: moderateScale(10)}}
                />
                <MaterialIcons
                  name="share"
                  size={moderateScale(30)}
                  color="#A0A0A0"
                />
              </View>
            </View>

            <View style={{flexDirection: 'column'}}>
              <View
                style={{backgroundColor: '#DEDEDE', height: 1, width: '100%'}}>
                <Text></Text>
              </View>

              <View
                style={{
                  marginHorizontal: moderateScale(10),
                  marginVertical: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignContent: 'center',
                }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    backgroundColor: '#ffffff',
                  }}>
                  <Icon
                    name="shield-checkmark"
                    color={'#28C719'}
                    size={moderateScale(20)}
                  />
                  <Text style={{fontSize: moderateScale(14), fontStyle: '400'}}>
                    {' '}
                    100% Authentic
                  </Text>
                </View>

                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    backgroundColor: '#ffffff',
                  }}>
                  <MaterialIcons
                    name="assignment-return"
                    size={moderateScale(20)}
                    color="#28C719"
                  />

                  <Text style={{fontSize: moderateScale(14), fontStyle: '400'}}>
                    {' '}
                    Service Returns{' '}
                  </Text>
                </View>

                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    backgroundColor: '#ffffff',
                  }}>
                  <MaterialCommunityIcons
                    name="truck-delivery"
                    size={moderateScale(23)}
                    color="#28C719"
                  />

                  <Text style={{fontSize: moderateScale(14), fontStyle: '400'}}>
                    {' '}
                    Free Shipping{' '}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: '#F5F5F5',
                  height: 8,
                  width: '100%',
                }}></View>

              <View
                style={{
                  backgroundColor: 'transparent',
                  borderBottomColor: '#F5F5F5',
                  borderBottomWidth: 8,
                  marginLeft: scale(15),
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    backgroundColor: 'transparent',
                    height: 20,
                  }}>
                  <View style={{flex: 1}}>
                    <Text
                      style={{fontSize: moderateScale(15), fontWeight: 'bold'}}>
                      Specifications
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'flex-end',
                      alignItems: 'flex-end',
                    }}>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={moderateScale(32)}
                      color="red"
                    />
                  </View>
                </View>

                <View style={{marginBottom: 10}}>
                  <Text
                    style={{fontSize: moderateScale(13), fontWeight: '800'}}>
                    (Weight, Size, Material, Storage Type, Etc..)
                  </Text>
                </View>
              </View>

              <View
                style={{
                  backgroundColor: 'transparent',
                  borderBottomColor: '#F5F5F5',
                  borderBottomWidth: 8,
                  marginLeft: scale(15),
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    backgroundColor: 'transparent',
                    height: 20,
                  }}>
                  <View style={{flex: 1}}>
                    <Text
                      style={{fontSize: moderateScale(15), fontWeight: 'bold'}}>
                      Other Details
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'flex-end',
                      alignItems: 'flex-end',
                    }}>
                    {/* <MaterialCommunityIcons
                      name="chevron-right"
                      size={moderateScale(32)}
                      color="red"
                    /> */}
                  </View>
                </View>

                <View style={{marginBottom: 10}}>
                  <Text
                    style={{fontSize: moderateScale(13), fontWeight: '800'}}>
                    Pcs Price :{' '}
                    {numbro(Number(item.PCS_BOOKING)).format({
                      thousandSeparated: true,
                      mantissa: 2,
                    })}
                  </Text>
                  <Text
                    style={{fontSize: moderateScale(13), fontWeight: '800'}}>
                    Case Price :{' '}
                    {numbro(Number(item.CASE_BOOKING)).format({
                      thousandSeparated: true,
                      mantissa: 2,
                    })}
                  </Text>
                  <Text
                    style={{fontSize: moderateScale(13), fontWeight: '800'}}>
                    Pcs per Case :{' '}
                    {numbro(Number(item.CASE_UNIT_PER_PCS)).format({
                      thousandSeparated: true,
                      mantissa: 0,
                    })}
                  </Text>
                </View>
              </View>
              <View style={{height: 100}}></View>
            </View>
          </View>
        </ScrollView>
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignContent: 'space-around',
            backgroundColor: '#ffffff',
          }}>
          <View
            style={{
              backgroundColor: 'transparent',
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity
              onPress={() => {
                FadingMessage();
                //  console.log('a');
              }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignContent: 'center',
                }}>
                <MaterialCommunityIcons
                  name="storefront-outline"
                  size={moderateScale(30)}
                  color="red"
                />
                <Text style={{fontSize: moderateScale(11), fontWeight: '200'}}>
                  VENDOR
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                FadingMessage();
                console.log('a');
              }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignContent: 'center',
                }}>
                <MaterialCommunityIcons
                  name="message-text-outline"
                  size={moderateScale(30)}
                  color="red"
                />

                <Text style={{fontSize: moderateScale(11), fontWeight: '200'}}>
                  CONTACT
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <LinearGradient
            start={{x: 0, y: 0.9}}
            end={{x: 0.9, y: 0.1}}
            colors={['#F2C123', '#F57F2C']}
            style={{
              marginHorizontal: 5,
              flex: 1,
              borderWidth: 0.01,
              height: moderateScale(50),
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
            }}>
            <TouchableOpacity
              onPress={() => {
                FadingMessage();
                console.log('a');
              }}>
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>
                  {' '}
                  {'      '}Add to Cart{'         '}
                </Text>
              </View>
            </TouchableOpacity>
          </LinearGradient>

          <LinearGradient
            start={{x: 0, y: 0.9}}
            end={{x: 0.9, y: 0.1}}
            colors={['#F0900D', '#F2300D']}
            style={{
              marginHorizontal: 5,
              flex: 1,
              borderWidth: 0.01,
              height: moderateScale(50),
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
            }}>
            <TouchableOpacity
              onPress={() => {
                FadingMessage();
                console.log('a');
              }}>
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>
                  {' '}
                  {'        '}Buy Now{'         '}
                </Text>
              </View>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>,
    );
  });

  // for (let i = 0; i < LocalPromoItemData.length; i++) {}

  const renderItem = ({item, index}) => (
    <TouchableOpacity
      onPress={() => {
        var setindexforImagelIst = Number(index);
        console.log('PRESED imagelistmodal ON INDEX ' + Number(index));
        setPleaseWaitVisible(true);
        setcurrentIndex(setindexforImagelIst);

        var secs = 0;
        const timerID = BackgroundTimer.setInterval(() => {
          secs = secs + 1;

          if (secs === 1) {
            setPleaseWaitVisible(false);
            setvisibleImageListModal(true);
            BackgroundTimer.clearInterval(timerID);
          }
        }, 200);

        //  setPleaseWaitVisible(true);

        // setSelectedImage(item.img_url);
        // setVisibleMainModal(true);
      }}>
      <LinearGradient
        start={{x: 0.3, y: 0.6}}
        end={{x: 1, y: 1}}
        style={{
          margin: 2,
          marginTop: 0,
          borderColor: '#C6CDC8',
          borderWidth: 0.9,
        }}
        colors={['white', '#F47F83']}>
        <View style={[styles.promoItemDetailsNImage]}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
            }}>
            <View style={[styles.promoitemImageContainer]}>
              <Image
                style={styles.promoitemImage}
                source={{
                  uri: item.img_url,
                }}
                onError={() => ({
                  uri:
                    'https://public-winganmarketing.sgp1.digitaloceanspaces.com/products/noimage.png',
                })}
              />
            </View>

            <View
              style={{
                flex: 1,

                marginLeft: scale(15),
                flexDirection: 'column',
                justifyContent: 'space-evenly',
                margin: scale(10),
                alignItems: 'flex-end',
              }}>
              <TouchableOpacity>
                <Text
                  style={{fontSize: moderateScale(13, 0.5), color: '#000000'}}>
                  {'Price per '}
                  {unitPrice === 'CASE' ? 'CASE' : 'PCs'}
                </Text>

                <Text
                  //FOR FLATLIST
                  style={{fontSize: moderateScale(13, 0.5), color: '#000000'}}>
                  {PriceOptionPickerCatcherState === '' ||
                  PriceOptionPickerCatcherState === 'Booking' ||
                  PriceOptionPickerCatcherState === 'ALL' ||
                  PriceOptionPickerCatcherState === null
                    ? '₱' +
                      numbro(Number(item.PCS_BOOKING)).format({
                        thousandSeparated: true,
                        mantissa: 2,
                      })
                    : '₱' +
                      numbro(Number(item.PCS_EXTRUCK)).format({
                        thousandSeparated: true,
                        mantissa: 2,
                      })}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={[
              styles.promoitemDetails,
              {backgroundColor: 'transparent', marginTop: 5},
            ]}>
            <View
              style={{
                marginHorizontal: moderateScale(-5),
                flexDirection: 'row',
                alignItems: 'center',
                alignContent: 'center',
              }}>
              <Text
                style={{
                  color: '#333333',
                  fontSize: moderateScale(11),
                }}>
                {' '}
                5{' '}
              </Text>
              <MaterialIcons
                name="grade"
                size={moderateScale(14)}
                color="#F9C500"
              />
              <MaterialIcons
                name="grade"
                size={moderateScale(14)}
                color="#F9C500"
              />

              <MaterialIcons
                name="grade"
                size={moderateScale(14)}
                color="#F9C500"
              />

              <MaterialIcons
                name="grade"
                size={moderateScale(14)}
                color="#F9C500"
              />

              <MaterialIcons
                name="grade"
                size={moderateScale(14)}
                color="#F9C500"
              />
            </View>

            <Text style={styles.item2}>{item.product_variant}</Text>

            <View style={{backgroundColor: 'transparent'}}>
              <Text
                style={[
                  styles.item,
                  {justifyContent: 'flex-start', height: scale(50)},
                ]}>
                {item.product_name}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                width: '100%',
              }}>
              <Text style={styles.item}>Stocks : {item.inventory}</Text>

              <View
                style={{
                  flex: 1,
                  alignItems: 'flex-end',
                  marginRight: 10,
                }}>
                <MaterialCommunityIcons
                  name="truck-delivery"
                  size={moderateScale(23)}
                  color="#21BA1E"
                />
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  // //from array to section list format
  // const result = [];
  // let dayData = {title: '', data: []};

  // LocalPromoItemData.map(function (item, i) {
  //   const Sectiontitle = item.principal_name;

  //   if (dayData.title === Sectiontitle) {
  //     dayData.data.push(item);
  //   } else {
  //     dayData = {
  //       title: Sectiontitle,
  //       data: [item],
  //     };
  //     result.push(dayData);
  //   }
  // });

  // const SectionListItem = ({item}) =>
  //   item.product_variant === '' ? null : (
  //     <View style={styles.promoItemDetailsNImage}>
  //       <View style={styles.promoitemImageContainer}>
  //         <TouchableOpacity
  //           onPress={() => {
  //             setSelectedImage(item.img_url);
  //             setVisibleMainModal(true);
  //           }}>
  //           <Image
  //             style={styles.promoitemImage}
  //             source={{
  //               uri: item.img_url,
  //             }}
  //             onError={() => ({
  //               uri:
  //                 'https://public-winganmarketing.sgp1.digitaloceanspaces.com/products/noimage.png',
  //             })}
  //           />
  //         </TouchableOpacity>
  //       </View>
  //       <View style={styles.promoitemDetails}>
  //         <Text style={styles.item2}>{item.product_variant}</Text>
  //         <Text style={[styles.item, {justifyContent: 'flex-start'}]}>
  //           {item.product_name}
  //         </Text>
  //         <Text style={styles.item}>Stocks : {item.inventory}</Text>
  //       </View>
  //     </View>
  //   );

  // function  LoadinitialItem(){

  // }

  function FadingMessage() {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 500,
    }).start(() =>
      Animated.timing(fadeIn, {
        toValue: 0,
        delay: 1000,
        duration: 700,
      }).start(),
    );
  }

  function ShowFadingMessage() {
    return (
      <View
        style={{
          flex: 1,
          zIndex: 4,
          width: moderateScale(50),
          height: moderateScale(50),
          alignItems: 'center',
          justifyContent: 'center',

          backgroundColor: 'rgba(0, 0, 0, 0)',

          position: 'absolute',
          top: height / 2,
          left: width / 2 - 20,
        }}>
        <Animated.View
          style={{
            zIndex: 4,
            opacity: fadeIn,
            height: scale(60),
            width: scale(200),
            margin: 5,
            borderRadius: 20,
            backgroundColor: 'rgba(107, 107, 107, 0.9)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: moderateScale(16),
              color: '#ffffff',
              fontWeight: '300',
              textAlign: 'center',
            }}>
            Comming Soon...{' '}
          </Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {PleaseWaitVisible === true ? <ShowPleaseWait /> : null}

      <View style={{flexDirection: 'column'}}>
        <View style={styles.HeaderView}>
          <View style={{flex: 1, marginLeft: scale(15)}}>
            <View style={{width: 50}}>
              <TouchableOpacity onPress={() => props.navigation.openDrawer()}>
                <Icon name="md-filter" color={'#ffffff'} size={34} />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flex: 1.5,
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'flex-end',
              alignSelf: 'center',
            }}>
            <FlatButton // MAIN
              width={120}
              text="Filter"
              gradientFrom="#F9A7A8"
              gradientTo="#D6171A"
              onPress={() => {
                setisModalVisible2(!isModalVisible2);
              }}
            />
          </View>

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
                color: '#ffffff',
                fontSize: moderateScale(12, 0.5),
                alignContent: 'flex-end',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
              }}>
              Last Update
            </Text>
            <Text
              style={{
                color: '#ffffff',
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
                marginBottom: 5,
              }}>
              <View style={{width: 10, marginRight: moderateScale(5, 0.5)}}>
                <Icon name="refresh" color={'#ffffff'} size={10} />
              </View>
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: moderateScale(12, 0.5),
                  alignContent: 'flex-end',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                }}>
                {globalState.updateStatus === 'Updating' ||
                globalState.updateStatus === 'Start' ? (
                  <Text
                    style={{
                      color: '#ffffff',
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
                ) : null}

                {/* <Text
                        style={{
                          color: 'white',
                          fontSize: moderateScale(12, 0.5),
                          alignContent: 'flex-end',
                          alignItems: 'flex-end',
                          justifyContent: 'flex-end',
                        }}>
                        {hhmmss(900 - globalStatus.CurrentSeconds)}
                      </Text> */}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <SafeAreaView style={[styles.container, {zIndex: 0}]}>
        {LocalPromoItemData.length === CurrentItemCount &&
        LocalPromoItemData.length > 0 ? (
          // {LocalPromoItemData.length !== 0 ? (
          <View style={{flexDirection: 'column'}}>
            <FlatList
              // onScrollEndDrag={() => {
              //   setisVisibleButton(true);
              // }}
              // onScrollBeginDrag={() => {
              //   setisVisibleButton(false);
              // }}
              ref={refContainer}
              data={LocalPromoItemData}
              renderItem={renderItem}
              // getItemLayout={getItemLayout}
              initialNumToRender={10}
              maxToRenderPerBatch={6}
              windowSize={10}
              keyExtractor={(item) => item.product_id}
              numColumns={2}
              removeClippedSubviews={true}
              ListHeaderComponent={FlatListHeader}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              //   onEndReachedThreshold={0.5}
              // // onMomentumScrollBegin={() => { setonEndReachedCalledDuringMomentum(false)}}

              // onEndReached={() => {
              //   console.log('1dad')
              //   setisVisibleButton(true);
              // }}

              //           onEndReached={()=>{

              // console.log('end reached')

              // if(start === 51) {
              //           var temp = [];
              //             LocalPromoItemData.slice([start -1], [end]).map((item, i) => {
              //                 temp.push(item);
              //             });
              //             setCurrentLocalItem(temp);
              //             refContainer.current.scrollToIndex({ animated: false, index: 0 });

              //                 setstart(Number(start) + Number(50));
              //             setend(Number(end) + Number(50));

              // }

              //           //   var temp = [];
              //           //   LocalPromoItemData.slice([start -1], [end]).map((item, i) => {

              //           //       temp.push(item);

              //           //   });

              //           // setCurrentLocalItem(temp);

              //           //     refContainer.current.scrollToIndex({ animated: false, index: 2 });

              //           //   setstart(Number(start) + Number(50));
              //           //   setend(Number(end) + Number(50));

              //           }
            />
            {InventorySummary.TotalItems > 50 && isLastPage === false ? (
              <TouchableOpacity
                onPress={() => {
                  // var currentpageAdd = Number(page) * Number(50);
                  //floating
                  setPleaseWaitVisible(true);

                  GetLocalPromoItems(page + 1);

                  setpage(page + 1);
                }}
                // NEXT PAGE
                style={styles.fab}>
                <Icon
                  name="chevron-forward-circle-outline"
                  color={'#ffffff'}
                  size={60}
                  alignSelf={'center'}
                  marginBottom={8}
                />
              </TouchableOpacity>
            ) : null}

            {page > 0 ? (
              <TouchableOpacity
                //PREVIOUS PAGE
                onPress={() => {
                  setPleaseWaitVisible(true);

                  GetLocalPromoItems(page - 1);

                  setpage(page - 1);
                }}
                style={styles.fab2}>
                <Icon
                  name="chevron-back-circle-outline"
                  color={'#ffffff'}
                  size={60}
                  alignSelf={'center'}
                  marginBottom={8}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              style={{
                width: moderateScale(250),
                height: moderateScale(250),
                resizeMode: 'center',
              }}
              source={require('../../assets/wamilogo.png')}
              // source={require('../../assets/coslorlogo.png')}
            />
            <Text style={{fontWeight: '800', fontSize: moderateScale(18)}}>
              {pleaseWaitMessage}
            </Text>
          </View>
        )}

        {loading && (
          <View style={styles.loading}>
            <Text style={{color: 'white', fontSize: moderateScale(22, 0.5)}}>
              {updateMessage}{' '}
            </Text>
            <ActivityIndicator size="large" color="green" />
          </View>
        )}
      </SafeAreaView>

      <Modal
        //MODAL FOR IMAGE LIST
        style={{zIndex: 1}}
        visible={visibleImageListModal}
        marginBottom={0}
        marginTop={0}
        marginLeft={0}
        marginRight={0}
        deviceHeight={height}
        transparent={true}
        onRequestClose={() => {
          var indexLast = Number(Number(currentIndex) - Number(4)) / Number(2);
          if (indexLast < 1) {
            indexLast = 0;
          }
          setvisibleImageListModal(false);
          setPleaseWaitImageList(false);
          //1
          if (refContainer.current) {
            refContainer.current.scrollToIndex({
              animated: true,
              index: Number(indexLast),
            });
          }
        }}>
        <View style={{flex: 1, backgroundColor: '#E9E9E9', zIndex: 1}}>
          {PleaseWaitImageList === true ? <ShowPleaseWait /> : null}
          <ShowFadingMessage />
          <TouchableOpacity
            onPress={() => {
              var indexLast =
                Number(Number(currentIndex) - Number(4)) / Number(2);
              if (indexLast < 1) {
                indexLast = 0;
              }
              setvisibleImageListModal(false);
              setPleaseWaitImageList(false);
              //1
              if (refContainer.current) {
                refContainer.current.scrollToIndex({
                  animated: true,
                  index: Number(indexLast),
                });
              }
            }}
            style={{
              flex: 1,
              zIndex: 4,
              position: 'absolute',
              width: moderateScale(45),
              height: moderateScale(45),
              alignItems: 'center',
              justifyContent: 'center',
              left: 20,
              top: 25,
              backgroundColor: 'rgba(191, 190, 198, 1)',
              borderRadius: 30,
            }}>
            <Icon
              name="arrow-back"
              color={'#ffffff'}
              size={moderateScale(30)}
              alignSelf={'center'}
              marginBottom={8}
            />
          </TouchableOpacity>

          <View
            style={{
              width: '100%',
              height: '100%',
              opacity: 0.5,
              position: 'absolute',
              backgroundColor: 'gray',
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
            }}>
            {/* <Text style={{fontSize: moderateScale(20)}}>Please wait...</Text> */}
          </View>
          {PleaseWaitVisible === false ? (
            <Swiper
              ref={swiper}
              onIndexChanged={(index) => {
                setcurrentIndex(index);
              }}
              showsPagination={false}
              loadMinimalSize={20}
              loadMinimal={false}
              autoplay={false}
              pagingEnabled={true}
              autoplayTimeout={2}
              showsButtons={true}
              index={currentIndex}
              loop={false}>
              {ImageLoop}
            </Swiper>
          ) : null}
        </View>
      </Modal>

      <Modal
        //FOT IMAGE VIEWER
        visible={visibleMainModal}
        marginBottom={0}
        marginTop={0}
        marginLeft={0}
        marginRight={0}
        deviceHeight={height}
        transparent={true}
        onRequestClose={() => {
          setVisibleMainModal(false);
          setPleaseWaitImageList(false);
        }}>
        <View style={{flex: 1, backgroundColor: '#E9E9E9', zIndex: 3}}>
          <TouchableOpacity
            onPress={() => {
              setVisibleMainModal(false);
              setPleaseWaitImageList(false);
            }}
            style={{
              flex: 1,
              zIndex: 4,
              position: 'absolute',
              width: moderateScale(50),
              height: moderateScale(50),
              alignItems: 'center',
              justifyContent: 'center',
              right: 20,
              top: 25,
              backgroundColor: '#ffffff',
              borderRadius: 30,
              elevation: 8,
              opacity: 1,
            }}>
            <Icon
              name="close-outline"
              color={'#000000'}
              size={moderateScale(45)}
              alignSelf={'center'}
              marginBottom={8}
            />
          </TouchableOpacity>

          <View style={{flex: 1, zIndex: 3}}>
            <ImageViewer
              imageUrls={images}
              onCancel={() => setVisibleMainModal(false)}
              enableSwipeDown={true}
              onSwipeDown={() => {
                setVisibleMainModal(false);
                setPleaseWaitImageList(false);
              }}
            />
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Please make sure you are connected to the internet.
            </Text>

            <TouchableHighlight
              style={{...styles.openButton, backgroundColor: 'orangered'}}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              <Text style={styles.textStyle}> Close </Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
      {/* MODAL FOR FILTER =---------------------------------------------------> */}
      <Modal
        animationInTiming={200}
        useNativeDriver={true}
        hideModalContentWhileAnimating={true}
        isVisible={isModalVisible2}
        animationType="none"
        onRequestClose={() => {
          setisVisiblePrincipalDropdownPicker(false);
          setisVisibleVariantDropdownPicker(false);
          setisVisibleTypeDropdownPicker(false);
          setisVisibleCategoryDropdownPicker(false);
          setisVisibleBrandDropdownPicker(false);
          setisVisiblePriceOptionDropdownPicker(false);
          setisModalVisible2(!isModalVisible2);
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            console.log('TOUCHED WHOTE');
            setisVisiblePrincipalDropdownPicker(false);
            setisVisibleVariantDropdownPicker(false);
            setisVisibleTypeDropdownPicker(false);
            setisVisibleCategoryDropdownPicker(false);
            setisVisibleBrandDropdownPicker(false);
            setisVisiblePriceOptionDropdownPicker(false);
          }}>
          <View style={styles.FilterHeightMax}>
            {/* VENDOR ///////////////////////////////////////////////////////////////////////////////*/}
            <View paddingVertical={5} />
            <View
              style={{
                marginHorizontal: 5,
                justifyContent: 'space-around',
                alignContent: 'space-between',
              }}>
              <Text>Vendor :</Text>
            </View>
            <View paddingVertical={1} />
            <RNPickerSelect
              placeholder={{
                label: 'Select Vendor',
                value: null,
                color: 'green',
              }}
              items={arrVendorfromPicker}
              onValueChange={(value) => {
                setVendorPickerCatcherState(value);
                GetCategoryList(value);
              }}
              style={{
                iconContainer: {
                  top: 10,
                  right: 12,
                },
                inputAndroid: {
                  borderColor: 'green',
                  fontSize: scale(18),
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  borderWidth: 0.5,
                  borderRadius: 8,
                  color: 'black',
                  paddingRight: 30, // to ensure the text is never behind the icon
                },
              }}
              value={VendorPickerCatcherState}
              useNativeAndroidPickerStyle={false}
              textInputProps={{underlineColor: 'yellow'}}
              Icon={() => {
                return <Icon name="md-arrow-down" size={24} color="gray" />;
              }}
            />
            <View paddingVertical={2} />
            {/* VENDOR ///////////////////////////////////////////////////////////////////////////////*/}

            {/* CATEGORY ///////////////////////////////////////////////////////////////////////////////*/}
            <View paddingVertical={5} />
            <View
              style={{
                marginHorizontal: 5,
                justifyContent: 'space-around',
                alignContent: 'space-between',
              }}>
              <Text>Category :</Text>
            </View>
            <View paddingVertical={1} />
            <RNPickerSelect
              placeholder={{
                label: 'Select Category',
                value: null,
                color: 'green',
              }}
              items={arrCategoryfromPicker}
              onValueChange={(value) => {
                setCategoryPickerCatcherState(value);
                GetBrandList(value);
              }}
              style={{
                iconContainer: {
                  top: 10,
                  right: 12,
                },
                inputAndroid: {
                  borderColor: 'green',
                  fontSize: scale(18),
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  borderWidth: 0.5,
                  borderRadius: 8,
                  color: 'black',
                  paddingRight: 30, // to ensure the text is never behind the icon
                },
              }}
              value={CategoryPickerCatcherState}
              useNativeAndroidPickerStyle={false}
              textInputProps={{underlineColor: 'yellow'}}
              Icon={() => {
                return <Icon name="md-arrow-down" size={24} color="gray" />;
              }}
            />
            <View paddingVertical={2} />
            {/* CATEGORY ///////////////////////////////////////////////////////////////////////////////*/}
            {/* BRAND ///////////////////////////////////////////////////////////////////////////////*/}
            <View paddingVertical={5} />
            <View
              style={{
                marginHorizontal: 5,
                justifyContent: 'space-around',
                alignContent: 'space-between',
              }}>
              <Text>Brand :</Text>
            </View>
            <View paddingVertical={1} />
            <RNPickerSelect
              placeholder={{
                label: 'Select Brand',
                value: null,
                color: 'green',
              }}
              items={arrBrandfromPicker}
              onValueChange={(value) => {
                setBrandPickerCatcherState(value);
                GetVariantList(value);
              }}
              style={{
                iconContainer: {
                  top: 10,
                  right: 12,
                },
                inputAndroid: {
                  borderColor: 'green',
                  fontSize: scale(18),
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  borderWidth: 0.5,
                  borderRadius: 8,
                  color: 'black',
                  paddingRight: 30, // to ensure the text is never behind the icon
                },
              }}
              value={BrandPickerCatcherState}
              useNativeAndroidPickerStyle={false}
              textInputProps={{underlineColor: 'yellow'}}
              Icon={() => {
                return <Icon name="md-arrow-down" size={24} color="gray" />;
              }}
            />
            <View paddingVertical={2} />
            {/* BRAND ///////////////////////////////////////////////////////////////////////////////*/}
            {/* VARIANT ///////////////////////////////////////////////////////////////////////////////*/}
            <View paddingVertical={5} />
            <View
              style={{
                marginHorizontal: 5,
                justifyContent: 'space-around',
                alignContent: 'space-between',
              }}>
              <Text>Variant :</Text>
            </View>
            <View paddingVertical={1} />
            <RNPickerSelect
              placeholder={{
                label: 'Select Variant',
                value: null,
                color: 'green',
              }}
              items={arrVariantfromPicker}
              onValueChange={(value) => {
                setVariantPickerCatcherState(value);
              }}
              style={{
                iconContainer: {
                  top: 10,
                  right: 12,
                },
                inputAndroid: {
                  borderColor: 'green',
                  fontSize: scale(18),
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  borderWidth: 0.5,
                  borderRadius: 8,
                  color: 'black',
                  paddingRight: 30, // to ensure the text is never behind the icon
                },
              }}
              value={VariantPickerCatcherState}
              useNativeAndroidPickerStyle={false}
              textInputProps={{underlineColor: 'yellow'}}
              Icon={() => {
                return <Icon name="md-arrow-down" size={24} color="gray" />;
              }}
            />
            <View paddingVertical={2} />
            {/* VARIANT ///////////////////////////////////////////////////////////////////////////////*/}
 {/* TYPE ///////////////////////////////////////////////////////////////////////////////*/}
 <View paddingVertical={5} />
            <View
              style={{
                marginHorizontal: 5,
                justifyContent: 'space-around',
                alignContent: 'space-between',
              }}>
              <Text>Type :</Text>
            </View>
            <View paddingVertical={1} />
            <RNPickerSelect
              placeholder={{
                label: 'Select Variant',
                value: null,
                color: 'green',
              }}
              items={[
                {
                  label: 'ALL',
                  value: 'ALL',
                },
                {
                  label: 'Promo',
                  value: 'Promo',
                },
                {
                  label: 'Regular',
                  value: 'Regular',
                },
              ]}
              onValueChange={(value) => {
                setProductTypePickerCatcherState(value);
              }}
              style={{
                iconContainer: {
                  top: 10,
                  right: 12,
                },
                inputAndroid: {
                  borderColor: 'green',
                  fontSize: scale(18),
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  borderWidth: 0.5,
                  borderRadius: 8,
                  color: 'black',
                  paddingRight: 30, // to ensure the text is never behind the icon
                },
              }}
              value={ProductTypePickerCatcherState}
              useNativeAndroidPickerStyle={false}
              textInputProps={{underlineColor: 'yellow'}}
              Icon={() => {
                return <Icon name="md-arrow-down" size={24} color="gray" />;
              }}
            />
            <View paddingVertical={2} />
            {/* TYPE ///////////////////////////////////////////////////////////////////////////////*/}

            {/* VENDOR ///////////////////////////////////////////////////////////////////////////////*/}
            {/* <View style={{marginTop: moderateScale(20, 0.5)}}>
                <Text>Vendor :</Text>
                <DropDownPicker  
                  placeholder={'ALL'}
                  style={{backgroundColor: '#F1F8F5'}}
                  dropDownMaxHeight={scale(490)}
                  dropDownStyle={{backgroundColor: '#F1F8F5'}}
                  containerStyle={{height: moderateScale(40, 0.5)}}
                  labelStyle={{
                    fontSize: 13,
                    textAlign: 'left',
                    color: '#000',
                  }}
                  isVisible={isVisiblePrincipalDropdownPicker}
                  onOpen={() => {
                    setisVisiblePrincipalDropdownPicker(true);
                    setisVisibleVariantDropdownPicker(false);
                    setisVisibleTypeDropdownPicker(false);
                    setisVisibleCategoryDropdownPicker(false);
                    setisVisibleBrandDropdownPicker(false);
                    setisVisiblePriceOptionDropdownPicker(false);
                  }}
                  onClose={() => {
                    setisVisiblePrincipalDropdownPicker(false);
                    setisVisibleVariantDropdownPicker(false);
                    setisVisibleTypeDropdownPicker(false);
                    setisVisibleCategoryDropdownPicker(false);
                    setisVisibleBrandDropdownPicker(false);
                    setisVisiblePriceOptionDropdownPicker(false);
                  }}
                  itemStyle={{
                    justifyContent: 'flex-start',
                  }}
                  activeLabelStyle={{color: 'red'}}
                  items={arrPrincipalfromPicker}
                  defaultValue={PrincipalPickerCatcher}
                  onChangeItem={(itemValue) => {
                    setarrCategoryfromPicker([]);
                    setarrBrandfromPicker([]);
                    setarrVariantfromPicker([]);
                    CategoryPickerCatcher = '';
                    BrandPickerCatcher = '';
                    VariantPickerCatcher = '';

                    PrincipalPickerCatcher = itemValue.value;

                    GetCategoryList();
                  }}
                />
              </View> */}
            {/* VENDOR ///////////////////////////////////////////////////////////////////////////////*/}
            {/*} CATEGORY ///////////////////////////////////////////////////////////////////////////////  */}
            {/*              
               <View style={{marginTop: moderateScale(20, 0.5)}}>
                <Text>Category :</Text>
                <DropDownPicker 
                  placeholder={'ALL'}
                  style={{backgroundColor: '#F1F8F5'}}
                  dropDownMaxHeight={scale(490)}
                  dropDownStyle={{backgroundColor: '#F1F8F5'}}
                  containerStyle={{height: moderateScale(40, 0.5)}}
                  labelStyle={{
                    fontSize: 14,
                    textAlign: 'left',
                    color: '#000',
                  }}
                  isVisible={isVisibleCategoryDropdownPicker}
                  onOpen={() => {
                    setisVisiblePrincipalDropdownPicker(false);
                    setisVisibleVariantDropdownPicker(false);
                    setisVisibleTypeDropdownPicker(false);
                    setisVisibleCategoryDropdownPicker(true);
                    setisVisibleBrandDropdownPicker(false);
                    setisVisiblePriceOptionDropdownPicker(false);
                  }}
                  onClose={() => {
                    setisVisiblePrincipalDropdownPicker(false);
                    setisVisibleVariantDropdownPicker(false);
                    setisVisibleTypeDropdownPicker(false);
                    setisVisibleCategoryDropdownPicker(false);
                    setisVisibleBrandDropdownPicker(false);
                    setisVisiblePriceOptionDropdownPicker(false);
                  }}
                  itemStyle={{
                    justifyContent: 'flex-start',
                  }}
                  activeLabelStyle={{color: 'red'}}
                  items={arrCategoryfromPicker}
                  defaultValue={CategoryPickerCatcherState}
                  onChangeItem={(itemValue) => {
                    setarrBrandfromPicker([]);
                    setarrVariantfromPicker([]);

                    BrandPickerCatcher = '';
                    VariantPickerCatcher = '';
                    setCategoryPickerCatcherState(itemValue.value);
                    CategoryPickerCatcher = itemValue.value;
                    GetBrandList();
                  }}
                />
              </View> */}

            {/* CATEGORY ///////////////////////////////////////////////////////////////////////////////*/}
            {/* BRAND ///////////////////////////////////////////////////////////////////////////////*/}
            {/* <View style={{marginTop: moderateScale(20, 0.5)}}>
                <Text>Brand :</Text>
                <DropDownPicker  
                  placeholder={'ALL'}
                  style={{backgroundColor: '#F1F8F5'}}
                  dropDownMaxHeight={scale(490)}
                  dropDownStyle={{backgroundColor: '#F1F8F5'}}
                  containerStyle={{height: moderateScale(40, 0.5)}}
                  labelStyle={{
                    fontSize: 14,
                    textAlign: 'left',
                    color: '#000',
                  }}
                  isVisible={isVisibleBrandDropdownPicker}
                  onOpen={() => {
                    setisVisiblePrincipalDropdownPicker(false);
                    setisVisibleVariantDropdownPicker(false);
                    setisVisibleTypeDropdownPicker(false);
                    setisVisibleCategoryDropdownPicker(false);
                    setisVisibleBrandDropdownPicker(true);
                    setisVisiblePriceOptionDropdownPicker(false);
                  }}
                  onClose={() => {
                    setisVisiblePrincipalDropdownPicker(false);
                    setisVisibleVariantDropdownPicker(false);
                    setisVisibleTypeDropdownPicker(false);
                    setisVisibleCategoryDropdownPicker(false);
                    setisVisibleBrandDropdownPicker(false);
                    setisVisiblePriceOptionDropdownPicker(false);
                  }}
                  itemStyle={{
                    justifyContent: 'flex-start',
                  }}
                  activeLabelStyle={{color: 'red'}}
                  items={arrBrandfromPicker}
                  defaultValue={BrandPickerCatcherState}
                  onChangeItem={(itemValue) => {
                    setarrVariantfromPicker([]);

                    VariantPickerCatcher = '';
                    if (itemValue.value === '--') {
                      setBrandPickerCatcherState('ALL');
                      BrandPickerCatcher = 'ALL';
                    } else {
                      setBrandPickerCatcherState(itemValue.value);
                      BrandPickerCatcher = itemValue.value;
                    }

                    GetVariantList();
                  }}
                />
              </View> */}
            {/* BRAND ///////////////////////////////////////////////////////////////////////////////*/}
            {/* VARIANT ///////////////////////////////////////////////////////////////////////////////*/}

            {/* <View style={{marginTop: moderateScale(20, 0.5)}}>
                <Text>Variant :</Text>
                <DropDownPicker  
                  placeholder={'ALL'}
                  style={{backgroundColor: '#F1F8F5'}}
                  dropDownMaxHeight={scale(530)}
                  dropDownStyle={{backgroundColor: '#F1F8F5'}}
                  containerStyle={{height: moderateScale(40, 0.5)}}
                  isVisible={isVisibleVariantDropdownPicker}
                  onOpen={() => {
                    setisVisiblePrincipalDropdownPicker(false);
                    setisVisibleVariantDropdownPicker(true);
                    setisVisibleTypeDropdownPicker(false);
                    setisVisibleCategoryDropdownPicker(false);
                    setisVisibleBrandDropdownPicker(false);
                    setisVisiblePriceOptionDropdownPicker(false);
                  }}
                  onClose={() => {
                    setisVisiblePrincipalDropdownPicker(false);
                    setisVisibleVariantDropdownPicker(false);
                    setisVisibleTypeDropdownPicker(false);
                    setisVisibleCategoryDropdownPicker(false);
                    setisVisibleBrandDropdownPicker(false);
                    setisVisiblePriceOptionDropdownPicker(false);
                  }}
                  labelStyle={{
                    fontSize: 14,
                    // eslint-disable-next-line prettier/prettier
                  textAlign: 'left',            //VARIANT
                    color: '#000',
                  }}
                  itemStyle={{
                    justifyContent: 'flex-start',
                  }}
                  activeLabelStyle={{color: 'red'}}
                  items={arrVariantfromPicker} //-----------------------------
                  defaultValue={VariantPickerCatcherState}
                  onChangeItem={(itemValue) => {
                    if (itemValue.value === '--') {
                      setVariantPickerCatcherState('ALL');
                      VariantPickerCatcher = 'ALL';
                    } else {
                      VariantPickerCatcher = itemValue.value;
                      setVariantPickerCatcherState(itemValue.value);
                    }
                  }}
                />
              </View> */}
            {/* VARIANT ///////////////////////////////////////////////////////////////////////////////*/}
            {/* TYPE ///////////////////////////////////////////////////////////////////////////////*/}
            {/* <View style={{marginTop: moderateScale(20, 0.5)}}>
                <Text>Product Type :</Text>
                <DropDownPicker  
                  placeholder={'ALL'}
                  style={{backgroundColor: '#F1F8F5'}}
                  dropDownMaxHeight={scale(430)}
                  dropDownStyle={{backgroundColor: '#F1F8F5'}}
                  containerStyle={{height: moderateScale(40, 0.5)}}
                  isVisible={isVisibleTypeDropdownPicker}
                  onOpen={() => {
                    setisVisiblePrincipalDropdownPicker(false);
                    setisVisibleVariantDropdownPicker(false);
                    setisVisibleTypeDropdownPicker(true);
                    setisVisibleCategoryDropdownPicker(false);
                    setisVisibleBrandDropdownPicker(false);
                    setisVisiblePriceOptionDropdownPicker(false);
                  }}
                  onClose={() => {
                    setisVisiblePrincipalDropdownPicker(false);
                    setisVisibleVariantDropdownPicker(false);
                    setisVisibleTypeDropdownPicker(false);
                    setisVisibleCategoryDropdownPicker(false);
                    setisVisibleBrandDropdownPicker(false);
                    setisVisiblePriceOptionDropdownPicker(false);
                  }}
                  labelStyle={{
                    fontSize: 14,
                    // eslint-disable-next-line prettier/prettier
                  textAlign: 'left',            //VARIANT
                    color: '#000',
                  }}
                  itemStyle={{
                    justifyContent: 'flex-start',
                  }}
                  activeLabelStyle={{color: 'red'}}
                  items={arrProductTypefromPicker} //-----------------------------
                  defaultValue={ProductTypePickerCatcherState}
                  onChangeItem={(itemValue) => {
                    ProductTypePickerCatcher = itemValue.value;
                    setProductTypePickerCatcherState(itemValue.value);
                  }}
                />
              </View> */}
            {/* TYPE ///////////////////////////////////////////////////////////////////////////////*/}
            {/* OPTION ///////////////////////////////////////////////////////////////////////////////*/}
            {/*              
              {global.sales_position_name === 'ALLSALESMAN' ? (
                <View style={{marginTop: moderateScale(20, 0.5)}}>
                  <Text>Price Option :</Text>
                  <DropDownPicker //  -----------------------------------------------//// TYPE
                    placeholder={'ALL'}
                    style={{backgroundColor: '#F1F8F5'}}
                    dropDownMaxHeight={scale(430)}
                    dropDownStyle={{backgroundColor: '#F1F8F5'}}
                    containerStyle={{height: moderateScale(40, 0.5)}}
                    isVisible={isVisiblePriceOptionDropdownPicker}
                    onOpen={() => {
                      setisVisiblePrincipalDropdownPicker(false);
                      setisVisibleVariantDropdownPicker(false);
                      setisVisibleTypeDropdownPicker(false);
                      setisVisibleCategoryDropdownPicker(false);
                      setisVisibleBrandDropdownPicker(false);
                      setisVisiblePriceOptionDropdownPicker(true);
                    }}
                    onClose={() => {
                      setisVisiblePrincipalDropdownPicker(false);
                      setisVisibleVariantDropdownPicker(false);
                      setisVisibleTypeDropdownPicker(false);
                      setisVisibleCategoryDropdownPicker(false);
                      setisVisibleBrandDropdownPicker(false);
                      setisVisiblePriceOptionDropdownPicker(false);
                    }}
                    labelStyle={{
                      fontSize: 14,
                      // eslint-disable-next-line prettier/prettier
                  textAlign: 'left',            //VARIANT
                      color: '#000',
                    }}
                    itemStyle={{
                      justifyContent: 'flex-start',
                    }}
                    activeLabelStyle={{color: 'red'}}
                    items={arrPriceOptionfromPicker} //-----------------------------
                    defaultValue={PriceOptionPickerCatcherState}
                    onChangeItem={(itemValue) => {
                      PriceOptionPickerCatcher = itemValue.value;
                      setPriceOptionPickerCatcherState(itemValue.value);
                    }}
                    // multiple={true}
                    // multipleText="%d items have been selected."
                    // min={0}
                    // max={100}
                  />
                </View>
              ) : null} */}
            {/* OPTION ///////////////////////////////////////////////////////////////////////////////*/}

            <View>
              <View
                style={{
                  flexDirection: 'column',
                  marginTop: 5,
                  alignItems: 'flex-end',
                  marginRight: moderateScale(20),
                }}>
                <View
                  style={{
                    marginBottom: moderateScale(20, 0.5),
                    marginTop: moderateScale(20, 0.5),
                  }}>
                  <FlatButton
                    width={140}
                    gradientFrom="red"
                    gradientTo="pink"
                    text="Filter"
                    onPress={() => {
                      console.log(CategoryPickerCatcherState);
                      setPleaseWaitVisible(true);

                      setpage(0);
                      setisVisiblePrincipalDropdownPicker(false);
                      setisVisibleVariantDropdownPicker(false);
                      setisVisibleTypeDropdownPicker(false);
                      setisVisibleCategoryDropdownPicker(false);
                      setisVisibleBrandDropdownPicker(false);
                      setisVisiblePriceOptionDropdownPicker(false);

                      GetLocalPromoItems(page * 0);
                      setisModalVisible2(false);
                    }}
                  />
                </View>
                <View>
                  <FlatButton
                    width={140}
                    gradientFrom="red"
                    gradientTo="pink"
                    text="Close"
                    onPress={() => {
                      setisVisiblePrincipalDropdownPicker(false);
                      setisVisibleVariantDropdownPicker(false);
                      setisModalVisible2(false);
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#03A9F4',
    borderRadius: 30,
    elevation: 8,
    opacity: 0.8,
  },
  fab2: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    left: 20,
    bottom: 20,
    backgroundColor: '#03A9F4',
    borderRadius: 30,
    elevation: 8,
    opacity: 0.8,
  },
  fabIcon: {
    fontSize: 30,
    color: 'white',
    alignSelf: 'center',
    marginBottom: moderateScale(8),
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
  container: {
    flex: 1,
    marginTop: moderateScale(1, 0.5),
    backgroundColor: '#E4E4E4',
  },
  promoitemDetails: {
    // backgroundColor: '#F0515E',
    width: width / 2 - moderateScale(12),
    alignItems: 'flex-start',
  },
  promoitemImageContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  promoitemImage: {
    width: scale(100),
    height: scale(100),
    borderRadius: 20,
  },
  CompanyLogo: {
    width: scale(60),
    height: scale(60),
    borderRadius: moderateScale(20, 0.5),
  },
  textLastUpdate: {
    fontSize: moderateScale(16),
  },
  textLastUpdateView: {
    width: scale(150),
  },
  principalPicker: {
    transform: [{scaleX: 1.0}, {scaleY: 1.0}],
    backgroundColor: '#DEE6EC',
    width: width - scale(180),
  },
  PickerView: {
    width: scale(200),
  },
  promoItemDetailsNImage: {
    padding: 5,
    width: width / 2 - 8,
    flexDirection: 'column',
    marginBottom: 3,
    marginLeft: 3,
  },
  item: {
    fontSize: moderateScale(13, 0.4),
    color: '#000000',
  },
  item2: {
    fontSize: moderateScale(14, 0.4),
    color: '#000000',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  HeaderView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'gray',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderateScale(22, 0.5),
  },
  modalView: {
    margin: moderateScale(20, 0.5),
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
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: moderateScale(15, 0.5),
    textAlign: 'center',
  },
  FilterHeightMin: {
    height: scale(750),
    backgroundColor: '#FFFFFF',
    width: width - scale(90),
    alignSelf: 'center',
  },
  FilterHeightMax: {
    backgroundColor: '#FFFFFF',
    width: width - scale(90),
    height: height - 120,
    alignSelf: 'center',
    borderRadius: 20,
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#333333',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    fontStyle: 'normal',
    fontWeight: '200',
  },
});

// dataTest = dataTest
//   .filter(function (item) {
//     return item.principal_name === 'MARS PHILIPPINES';
//   })
//   .map(function ({principal_name}) {
//     return {principal_name};
//   });
// console.log(dataTest);
// setDataTest2(dataTest);
