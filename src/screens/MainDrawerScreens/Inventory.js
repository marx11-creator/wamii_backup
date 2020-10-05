/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-lone-blocks */
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
import PageContextGlobalState from '../MainDrawerScreens/pagecontext';
import Icon from 'react-native-vector-icons/Ionicons';
var ApiRowsCount = 0;
var count = 0;
var localItemcount = 0;
var PrincipalPickerCatcher = '';
var VariantListfromPicker = '';
var TypeListfromPicker = '';
var longStrinfg = '';

// var arrVariantListfromPickerLocal = [];
export default function Inventory(props) {
  const [globalState, setglobalState] = useContext(PageContextGlobalState);

  const ApiFields = [
    {
      principal_name: '',
      product_id: '',
      product_variant: '',
      product_name: '',
      promo_product: '',
      inventory: '',
      img_url: '',
      DateandTimeUpdated: '',
    },
  ];
  const LocalDBFields = [
    {
      ref_id: '',
      product_id: '',
      product_variant: '',
      product_name: '',
      inventory: '',
      img_url: ' ',
      DateandTimeUpdated: '',
    },
  ];

  const PrincipalListX = [
    {
      principal_name: '',
    },
  ];
  const VariantListX = [
    {
      product_variant: '',
    },
  ];

  const PrincipalListFields = [
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
  const TypeListFields = [
    {
      label: 'Promo',
      value: 'Promo',
    },
    {
      label: 'Regular',
      value: 'Regular',
    },
  ];
  const [updateMessage, setupdateMessage] = useState('Updating...');
  const [testnum, settestnum] = useState(10);
  const [principalPicker, setPrincipalPicker] = useState('');
  const [variantPicker, setVariantPicker] = useState('');
  const [PrincipalList, setPrincipalList] = useState(PrincipalListFields);
  const [VariantList, setVariantList] = useState(VariantListFields);
  const [TypeList, setTypeList] = useState(TypeListFields);

  const [arrVariantListfromPicker, setarrVariantListfromPicker] = useState([]);
  const [arrTypeListfromPicker, setarrTypeListfromPicker] = useState([]);
  const [isModalVisible2, setisModalVisible2] = useState(false);

  const [PromoSKURefreshing, setPromoSKURefreshing] = useState(false);

  const [dateTime, setDateTime] = useState('');

  const [loading, setLoading] = useState(false);

  const [ApiPromoItemData, setApiPromoItemData] = useState(ApiFields);

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

  const [modalVisible, setModalVisible] = useState(false);

  const [SelectedImage, setSelectedImage] = useState('');

  const [ItemsDeleted, setItemsDeleted] = useState(false);

  const [visibleMainModal, setVisibleMainModal] = useState(false);

  // useEffect(() => {
  //   console.log(width);
  //   console.log(height);
  // }, []);

  function wait(timeout) {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  }

  // const dateTimeSet = () => {
  //   var date = moment().utcOffset('+08:00').format('MMMM DD YYYY, h:mm:ss a');
  //   setDateTime(date);
  // };

  const onRefresh = React.useCallback(() => {
    setPromoSKURefreshing(true);

    // wait(1000).then(() => {
    console.log('slide down..');
    DownloadPromoItems();
    // dateTimeSet();
    // });
  }, [PromoSKURefreshing]);

  useEffect(() => {
    if (ApiPromoItemData.length === ApiRowsCount) {
      ApiRowsCount = 0;
      DeleteItems();
    }
  });

  useEffect(() => {
    if (ItemsDeleted === true) {
      [SavePromoItems(), setItemsDeleted(false)];
    }
  });

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      console.log('focus on per per item');
      CurrentAppScreen.Screen = 'Inventory';
      GetPrincipalList();
      GetLocalPromoItems();
    });
  }, []);

  // useEffect(() => {
  //   dateTimeSet();
  // },[])

  // WHERE IN OPRATOR
  // 'SELECT * FROM promo_items_tbl where principal_name IN (' +
  // testqq +
  // ') order by principal_name asc ',
  // [],

  //= OPERATOR
  // 'SELECT * FROM promo_items_tbl where principal_name = ' + testqq + ' ',
  // [],

  function GetLocalPromoItems() {
    dbinventory.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM promo_items_tbl ' +
          ' order by product_variant, product_name limit 100 ',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            localItemcount = localItemcount + 1;
            temp.push(results.rows.item(i));
          }
          console.log('Successfully loaded Initial ' + temp.length + ' sku');
          setLocalPromoItemData(temp);
        },
      );
    });
  }

  function GetLocalPromoItemsFiltered() {
    var PrincipalQuery = '';
    if (PrincipalPickerCatcher === '' || PrincipalPickerCatcher === 'ALL') {
      PrincipalQuery = '  principal_name like ' + "'%%' ";
    } else {
      PrincipalQuery =
        ' principal_name = ' + "'" + PrincipalPickerCatcher + "'";
    }

    var VariantQuery = '';

    if (VariantListfromPicker === '' || VariantListfromPicker === 'ALL') {
      VariantQuery = '  and product_variant like ' + "'%%' ";
    } else {
      VariantQuery =
        ' and  product_variant in ' +
        '(' +
        VariantListfromPicker.slice(0, -1) +
        ')';
    }

    var PromoProductQuery = '';
    if (TypeListfromPicker === '') {
      PromoProductQuery = '  ';
    } else {
      PromoProductQuery =
        ' and  promo_product in   ' +
        '(' +
        TypeListfromPicker.slice(0, -1) +
        ')';
    }

    console.log(
      'SELECT * FROM promo_items_tbl where ' +
        PrincipalQuery +
        VariantQuery +
        PromoProductQuery +
        ' order by product_variant, product_name',
    );
    dbinventory.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM promo_items_tbl where ' +
          PrincipalQuery +
          VariantQuery +
          PromoProductQuery +
          ' order by product_variant, product_name',
        [],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            localItemcount = localItemcount + 1;
            temp.push(results.rows.item(i));
          }
          console.log('Successfully loaded FILTERED ' + temp.length + ' sku');
          setLocalPromoItemData(temp);
        },
        SQLerror,
      );
    });
  }

  function GetDateTime() {
    dbinventory.transaction((tx) => {
      tx.executeSql(
        'SELECT DateandTimeUpdated FROM promo_items_tbl limit 1',
        [],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            // console.log(results.rows.item(0).DateandTimeUpdated);
            setDateTime(results.rows.item(0).DateandTimeUpdated);
          } else {
            console.log('No date and time in local db found');
          }
        },
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
            setPrincipalList(temp);
          } else {
            console.log('error getting principal list');
          }
        },
      );
    });
  }

  function GetVariantList() {
    var PrincipalQuery = '';
    if (PrincipalPickerCatcher === 'ALL') {
      console.log('1');
      PrincipalQuery = '  principal_name like ' + "'%%' ";
    } else {
      console.log(PrincipalPickerCatcher);
      PrincipalQuery =
        ' principal_name = ' + "'" + PrincipalPickerCatcher + "'";
    }

    dbinventory.transaction((tx) => {
      tx.executeSql(
        'SELECT Distinct product_variant as label, product_variant as value FROM promo_items_tbl where ' +
          PrincipalQuery +
          ' order by product_variant',
        [],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            console.log('variants found');
            var temp = [];
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
            setVariantList(temp);
          } else {
            console.log('error on GetVariantList');
          }
        },
      );
    });
  }

  const DownloadPromoItems = () => {
    Promise.race([
      fetch(server.server_address + globalCompany.company + 'promo_item', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + APIToken.access_token,
        },
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 40000),
      ),
    ])
      .then((responseData) => {
        return responseData.json();
      })
      .then((jsonData) => {
        // console.log(jsonData);
        setApiPromoItemData(jsonData);
        ApiRowsCount = jsonData.length;
        //console.log(ApiPromoItemData);
        setupdateMessage(jsonData.length + ' rows fetched. saving data...');
      })
      .catch(function (error) {
        console.log('Error 1:' + error.message);
        setLoading(false);
        setModalVisible(true);
      })
      .done();
  };

  function SQLerror(err) {
    console.log('SQL Error: ' + err);
  }

  function SavePromoItems() {
    longStrinfg = '';
    var stocks = 0;
    var ProductType = '';
    var totalProduct = 0;
    {
      ApiPromoItemData.map(function (item, i) {
        totalProduct = totalProduct + 1;
        if (item.promo_product === '1') {
          ProductType = 'Promo';
        } else {
          ProductType = 'Regular';
        }

        if (parseInt(item.total_case) < 1) {
          stocks = item.total_pieces + ' PCS';
        } else {
          stocks = (item.total_case * 1).toFixed(2) + ' CS';
        }
        longStrinfg =
          longStrinfg +
          "('" +
          item.principal_name +
          "'" +
          ',' +
          "'" +
          item.product_id +
          "'" +
          ',' +
          "'" +
          item.product_variant +
          "'" +
          ',' +
          "'" +
          item.product_name +
          "'" +
          ',' +
          "'" +
          ProductType +
          "'" +
          ',' +
          "'" +
          stocks +
          "'" +
          ',' +
          "'" +
          item.img_url +
          "'" +
          ',' +
          "'" +
          item.DateandTimeUpdated +
          "'" +
          '),';
      });
    }

    if (totalProduct === ApiPromoItemData.length) {
      dbinventory.transaction(function (tx) {
        tx.executeSql(
          ' INSERT INTO promo_items_tbl (principal_name, product_id, product_variant, product_name, promo_product, inventory, img_url, DateandTimeUpdated) values ' +
            longStrinfg.slice(0, -1),
          [],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              setLoading(false);
              GetLocalPromoItems();
              GetPrincipalList();
              GetDateTime();
              setPromoSKURefreshing(false);

              Alert.alert(
                'Success!',
                ApiPromoItemData.length + ' Products updated.',
                [{text: 'Ok'}],
              );
            } else {
              console.log('error');
            }
          },
          SQLerror,
        );
      });
    }
  }

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

  function DeleteItems() {
    dbinventory.transaction(function (tx) {
      tx.executeSql(
        'Delete from promo_items_tbl ',
        [],
        (tx, results) => {
          // console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            setupdateMessage('Current inventory cleared..');
            setItemsDeleted(true);
          } else {
            if (LocalPromoItemData.length > 1) {
              console.log('error deleting');
            } else {
              console.log('nothing to delete, set true to save fetch sku');
              setItemsDeleted(true);
            }
          }
        },
        SQLerror,
      );
    });
  }

  const images = [
    {
      // Simplest usage.
      url: SelectedImage,
    },
  ];

  function FlatListHeader() {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{marginRight: moderateScale(10, 0.5)}}>Updating...</Text>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  const renderItem = ({item}) =>
    item.product_variant === '' ? null : (
      <LinearGradient style={{margin: 2}} colors={['#F96E71', '#C70E11']}>
        <View style={styles.promoItemDetailsNImage}>
          <View style={styles.promoitemImageContainer}>
            <TouchableOpacity
              onPress={() => {
                setSelectedImage(item.img_url);
                setVisibleMainModal(true);
              }}>
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
            </TouchableOpacity>
          </View>
          <View style={styles.promoitemDetails}>
            <Text style={styles.item2}>{item.product_variant}</Text>
            <Text style={[styles.item, {justifyContent: 'flex-start'}]}>
              {item.product_name}
            </Text>
            <Text style={styles.item}>Stocks : {item.inventory}</Text>
          </View>
        </View>
      </LinearGradient>
    );

  //from array to section list format
  const result = [];
  let dayData = {title: '', data: []};

  LocalPromoItemData.map(function (item, i) {
    const Sectiontitle = item.principal_name;

    if (dayData.title === Sectiontitle) {
      dayData.data.push(item);
    } else {
      dayData = {
        title: Sectiontitle,
        data: [item],
      };
      result.push(dayData);
    }
  });

  const SectionListItem = ({item}) =>
    item.product_variant === '' ? null : (
      <View style={styles.promoItemDetailsNImage}>
        <View style={styles.promoitemImageContainer}>
          <TouchableOpacity
            onPress={() => {
              setSelectedImage(item.img_url);
              setVisibleMainModal(true);
            }}>
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
          </TouchableOpacity>
        </View>
        <View style={styles.promoitemDetails}>
          <Text style={styles.item2}>{item.product_variant}</Text>
          <Text style={[styles.item, {justifyContent: 'flex-start'}]}>
            {item.product_name}
          </Text>
          <Text style={styles.item}>Stocks : {item.inventory}</Text>
        </View>
      </View>
    );

  const ref_input2 = useRef();
  const ref_input3 = useRef();

  return (
    <View style={styles.container}>
      <View style={styles.HeaderView}>
        <View style={{flex: 1}}>
        <Image
          style={styles.CompanyLogo}
          source={{
            uri:
              'https://public-winganmarketing.sgp1.digitaloceanspaces.com/products/LOGO%20-%20Copy.png',
          }}
        />
        </View>

        {/* <FlatButton
          gradientFrom="red"
          gradientTo="pink"
          text="Update"
          onPress={() => {
            setupdateMessage('Connecting to server...');
            setLoading(!loading);
            DownloadPromoItems();
          }}
        /> */}
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',

          }}>
          <FlatButton // MAIN
            text="Filter"
            gradientFrom="#F08E90"
            gradientTo="#D6171A"
            onPress={() => {
              // setarrVariantListfromPicker(arrVariantListfromPickerLocal);
              GetPrincipalList();
              setisModalVisible2(!isModalVisible2);
            }}
          />
        </View>

        {/* <View style={styles.textLastUpdateView}>
          <Text style={styles.textLastUpdate}>Last Update : {dateTime}</Text>
        </View> */}

        <View
          style={{
            flex: 0.6,
            width: scale(150),
            marginRight: 10,
            alignContent: 'flex-end',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
          }}>
          <Text
            style={{
              color: '#333333',
              fontSize: moderateScale(12, 0.5),
              alignContent: 'flex-end',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
            }}>
            Last Update
          </Text>
          <Text
            style={{
              color: '#333333',
              fontSize: moderateScale(12, 0.5),
              alignContent: 'flex-end',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
            }}>
            {LastDateTimeUpdated.value}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={{width: 10, marginRight: moderateScale(5, 0.5)}}>
              <Icon name="refresh" color={'#333333'} size={10} />
            </View>
            <Text
              style={{
                color: '#333333',
                fontSize: moderateScale(12, 0.5),
                alignContent: 'flex-end',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
              }}>
              {globalState.updateStatus === 'Updating' ||
              globalState.updateStatus === 'Start' ? (
                <Text
                  style={{
                    color: '#333333',
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
                    color: '#333333',
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
      </View>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={LocalPromoItemData}
          renderItem={renderItem}
          // getItemLayout={getItemLayout}
          initialNumToRender={5}
          maxToRenderPerBatch={testnum}
          windowSize={10}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          removeClippedSubviews={true}
        />

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
        visible={visibleMainModal}
        marginBottom={0}
        marginTop={0}
        marginLeft={0}
        marginRight={0}
        deviceHeight={height}
        transparent={true}
        onRequestClose={() => {
          setVisibleMainModal(false);
        }}>
        <ImageViewer
          imageUrls={images}
          onCancel={() => setVisibleMainModal(false)}
          enableSwipeDown={true}
          onSwipeDown={() => setVisibleMainModal(false)}
        />
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
          setisModalVisible2(!isModalVisible2);
        }}>
        <TouchableWithoutFeedback
          onPress={() => {
            console.log('asd');
            setisVisiblePrincipalDropdownPicker(false);
            setisVisibleVariantDropdownPicker(false);
            setisVisibleTypeDropdownPicker(false);
          }}>
          <View
            style={[
              isVisibleVariantDropdownPicker
                ? styles.FilterHeightMax
                : styles.FilterHeightMin,
            ]}>
            <View style={{padding: 5}}>
              {/* <Button
                title="Close Variant"
                onPress={() =>
                  (arrVariantListfromPicker = [
                    'Alfonso',
                    'Glade Sport',
                    'Doublemint',
                  ])
                }
              /> */}
              {/* <Button title="chnage" onPress={() => setVariantPicker('')} /> */}
              <View style={{marginTop: moderateScale(20, 0.5)}}>
                <Text>Vendor :</Text>
                <DropDownPicker //  -----------------------------------------------//// VENDOR
                  placeholder={'Select Vendor'}
                  style={{backgroundColor: '#F1F8F5'}}
                  dropDownMaxHeight={scale(490)}
                  dropDownStyle={{backgroundColor: '#F1F8F5'}}
                  containerStyle={{height: moderateScale(50, 0.5)}}
                  labelStyle={{
                    fontSize: 14,
                    textAlign: 'left',
                    color: '#000',
                  }}
                  isVisible={isVisiblePrincipalDropdownPicker}
                  onOpen={() => {
                    setisVisiblePrincipalDropdownPicker(true);
                    setisVisibleVariantDropdownPicker(false);
                    setisVisibleTypeDropdownPicker(false);
                  }}
                  onClose={() => {
                    setisVisiblePrincipalDropdownPicker(false);
                    setisVisibleTypeDropdownPicker(false);
                    setisVisibleVariantDropdownPicker(false);
                  }}
                  itemStyle={{
                    justifyContent: 'flex-start',
                  }}
                  activeLabelStyle={{color: 'red'}}
                  items={PrincipalList}
                  defaultValue={principalPicker}
                  onChangeItem={(itemValue) => {
                    setarrVariantListfromPicker([]);
                    VariantListfromPicker = '';
                    setPrincipalPicker(itemValue.value);
                    PrincipalPickerCatcher = itemValue.value;
                    GetVariantList();
                  }}
                />
              </View>
              <View style={{marginTop: moderateScale(20, 0.5)}}>
                <Text>Variant :</Text>
                <DropDownPicker //  -----------------------------------------------//// VARIANT
                  placeholder={'Select Variant'}
                  style={{backgroundColor: '#F1F8F5'}}
                  dropDownMaxHeight={scale(530)}
                  dropDownStyle={{backgroundColor: '#F1F8F5'}}
                  containerStyle={{height: moderateScale(50, 0.5)}}
                  isVisible={isVisibleVariantDropdownPicker}
                  onOpen={() => {
                    setisVisibleVariantDropdownPicker(true);
                    setisVisibleTypeDropdownPicker(false);
                    setisVisiblePrincipalDropdownPicker(false);
                  }}
                  onClose={() => {
                    setisVisibleVariantDropdownPicker(false);
                    setisVisiblePrincipalDropdownPicker(false);
                    setisVisibleTypeDropdownPicker(false);
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
                  items={VariantList} //-----------------------------
                  defaultValue={arrVariantListfromPicker}
                  onChangeItem={(itemValue) => {
                    setarrVariantListfromPicker(itemValue);
                    // arrVariantListfromPickerLocal = itemValue;

                    VariantListfromPicker = '';
                    itemValue.map(function (item, i) {
                      VariantListfromPicker =
                        VariantListfromPicker + "'" + item + "',";
                    });
                    // console.log(VariantListfromPicker);
                  }}
                  // searchable={true}
                  // searchablePlaceholder="Search for an item"
                  // searchablePlaceholderTextColor="gray"
                  multiple={true}
                  multipleText="%d items have been selected."
                  min={0}
                  max={100}
                />
              </View>
              <View style={{marginTop: moderateScale(20, 0.5)}}>
                <Text>Product Type :</Text>
                <DropDownPicker //  -----------------------------------------------//// TYPE
                  placeholder={'Select Type'}
                  style={{backgroundColor: '#F1F8F5'}}
                  dropDownMaxHeight={scale(430)}
                  dropDownStyle={{backgroundColor: '#F1F8F5'}}
                  containerStyle={{height: moderateScale(50, 0.5)}}
                  isVisible={isVisibleTypeDropdownPicker}
                  onOpen={() => {
                    setisVisibleTypeDropdownPicker(true);
                    setisVisibleVariantDropdownPicker(false);
                    setisVisiblePrincipalDropdownPicker(false);
                  }}
                  onClose={() => {
                    setisVisibleTypeDropdownPicker(false);

                    setisVisiblePrincipalDropdownPicker(false);

                    setisVisibleVariantDropdownPicker(false);
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
                  items={TypeList} //-----------------------------
                  defaultValue={arrTypeListfromPicker}
                  onChangeItem={(itemValue) => {
                    setarrTypeListfromPicker(itemValue);
                    // arrVariantListfromPickerLocal = itemValue;

                    TypeListfromPicker = '';
                    itemValue.map(function (item, i) {
                      TypeListfromPicker =
                        TypeListfromPicker + "'" + item + "',";
                    });
                    // console.log(VariantListfromPicker);
                  }}
                  // searchable={true}
                  // searchablePlaceholder="Search for an item"
                  // searchablePlaceholderTextColor="gray"
                  multiple={true}
                  multipleText="%d items have been selected."
                  min={0}
                  max={100}
                />
              </View>
              <View>
                <View
                  style={{
                    flexDirection: 'column',
                    marginTop: 5,
                    alignItems: 'flex-end',
                  }}>
                  <View
                    style={{
                      marginBottom: moderateScale(10, 0.5),
                      marginTop: moderateScale(120, 0.5),
                    }}>
                    <FlatButton
                      gradientFrom="red"
                      gradientTo="pink"
                      text="Go"
                      onPress={() => {
                        setisVisibleTypeDropdownPicker(false);
                        setisVisibleVariantDropdownPicker(false);
                        setisVisiblePrincipalDropdownPicker(false);

                        GetLocalPromoItemsFiltered();
                        setisModalVisible2(false);
                        setarrVariantListfromPicker([]);
                      }}
                    />
                  </View>
                  <View>
                    <FlatButton
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
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginTop: moderateScale(10, 0.5),
    backgroundColor: '#ffffff',
  },
  promoitemDetails: {
    // backgroundColor: '#F0515E',
    width: width / 2 - moderateScale(12),
    alignItems: 'flex-start',
  },
  promoitemImageContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    alignSelf: 'center',
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
    // backgroundColor: '#F0515E',
    padding: 5,
    width: width / 2 - 8,
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 3,
    marginLeft: 3,
  },
  item: {
    fontSize: moderateScale(14, 0.4),
    color: 'white',
  },
  item2: {
    fontSize: moderateScale(16, 0.4),
    color: 'white',
    fontWeight: 'bold',
  },
  HeaderView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    height: scale(850),
    alignSelf: 'center',
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
