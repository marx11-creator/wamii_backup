import React from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import {scale, moderateScale, verticalScale, width, height} from './scaling';
import LinearGradient from 'react-native-linear-gradient';

export default function FlatButton({text, onPress, gradientFrom, gradientTo}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        colors={[gradientFrom, gradientTo]}
        style={
          ([styles.button],
          {
            width: scale(160),
            borderRadius: 10,
            borderWidth: 0.3,
            height: moderateScale(40, 0.3),
            justifyContent: 'center',
            textAlign: 'center',
          })
        }>
        <Text style={[styles.buttonText]}>{text}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: moderateScale(14, 0.3),
    textAlign: 'center',
  },
});
