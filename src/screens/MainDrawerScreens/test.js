import React, {useEffect, useRef} from 'react';
import {View, Animated, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { moderateScale, scale } from '../../sharedComponents/scaling';

export default function Fade() {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const fadeOut = useRef(new Animated.Value(0)).current;

  // useEffect(() => {
  //   Animated.timing(fadeIn, {
  //     toValue: 1,
  //     duration: 1000,
  //   }).start(() =>
  //     Animated.timing(fadeIn, {
  //       toValue: 0,
  //       duration: 500,
  //     }).start(),
  //   );
  // }, []);

  function start() {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 1000,
    }).start(() =>
      Animated.timing(fadeIn, {
        toValue: 0,
        duration: 1000,
      }).start(),
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn} onPress={() => start()}>
        <Text style={styles.textBtn}>Click</Text>
      </TouchableOpacity>
      <Animated.View
        style={{
          opacity: fadeIn,
          height: scale(50),
          width: scale(200),
          margin: 5,
          borderRadius: 12,
          backgroundColor: 'rgba(192, 190, 202, 1)',
          justifyContent: 'center',
        }}>
        <Text style={styles.text}>Comming Soon... </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {},
  btn: {
    backgroundColor: '#480032',
    width: 100,
    height: 40,
    padding: 3,
    justifyContent: 'center',
    borderRadius: 6,
  },
  text: {
    fontSize: moderateScale(16),
    color: '#fff',
    fontWeight: '100',
    textAlign: 'center',
  },
  item1: {
    backgroundColor: 'red',
    padding: 20,
    width: 100,
    margin: 10,
  },

  textBtn: {
    color: '#f4f4f4',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
