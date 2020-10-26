import React, {useState} from 'react';
import {
  Button,
  Text,
  TextInput,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import RNPickerSelect, {defaultStyles} from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/Ionicons';
const sports = [
  {
    label: 'Football',
    value: 'football',
  },
  {
    label: 'Baseball',
    value: 'baseball',
  },
  {
    label: 'Hockey',
    value: 'hockey',
  },
];

export default function test(props) {
  const [favSport, settfavSport] = useState('Football');
  return (
    <View style={styles.container}>
      <View paddingVertical={5} />

      <RNPickerSelect
        placeholder={{
          label: 'Select Vendor',
          value: null,
          color: 'green',
        }}
        items={sports}
        onValueChange={(value) => {
          settfavSport(value);
        }}
        style={{
          iconContainer: {
            top: 10,
            right: 12,
          },
          inputAndroid: {
            borderColor: 'green',
            fontSize: 16,
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderWidth: 0.5,
            borderRadius: 8,
            color: 'black',
            paddingRight: 30, // to ensure the text is never behind the icon
          },
        }}
        value={favSport}
        useNativeAndroidPickerStyle={false}
        textInputProps={{underlineColor: 'yellow'}}
        Icon={() => {
          return <Icon name="md-arrow-down" size={24} color="gray" />;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  scrollContentContainer: {
    paddingTop: 40,
    paddingBottom: 10,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
