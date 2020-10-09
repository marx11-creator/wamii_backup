import React from 'react';
import {Text, View, Image} from 'react-native';
import Swiper from 'react-native-swiper';

const datas = [
  {
    name: 'ARJAY',
    lastname: 'DAVID',
    age: '28',
    sex: 'M',
  },
  {
    name: 'JANE',
    lastname: 'NALUS',
    age: '27',
    sex: 'F',
  },
  {
    name: 'MARK',
    lastname: 'MANGILA',
    age: '27',
    sex: 'F',
  },
];

const colors = [
  '#F4568F',
  '#45A9F0',
  '#67EC56',
  '#d966ff',
  '#ecb3ff',
  '#c61aff',
  '#d966ff',
  '#ecb3ff',
];
var styles = {
  wrapper: {},
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
};

export default function InventoryImageList() {
 
  var ImageLoop = [];

  for (let i = 0; i < datas.length; i++) {
    ImageLoop.push(
      <View
        testID="Hello"
        style={[
          styles.slide1,
          {backgroundColor: colors[i], flexDirection: 'column'},
        ]}>
        <Text style={styles.text}>NAME: {datas[i].name}</Text>

        <Text style={styles.text}>LASTNAME: {datas[i].lastname}</Text>
        <Text style={styles.text}>AGE: {datas[i].age}</Text>
        <Image
          style={{width: 500, height: 500, borderRadius: 0}}
          source={require('../../assets/building.jpg')}
          onError={() => ({
            uri:
              'https://public-winganmarketing.sgp1.digitaloceanspaces.com/products/noimage.png',
          })}
        />
      </View>,
    );
  }

  return (
    <Swiper
      style={styles.wrapper}
      onIndexChanged={(index) => {
        console.log(index);
      }}
      //

      showsPagination={false}
      loadMinimalSize={10}
      loadMinimal={true}
      autoplay={false}
      pagingEnabled={true}
      autoplayTimeout={2}
      showsButtons={true}
      loop={false}>
      {ImageLoop}
    </Swiper>
  );
}

// function findLinkByName(tosearchname) {
//     for (const item of datas) {
//       if (item.name === tosearchname) {
//         return item.age;
//       }
//     }
//   }
