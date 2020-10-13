import React from 'react';
import {View, Text, Button} from 'react-native'
import {FadingMessage} from './test';
export default function TEST2(){
    return (
        <View>
        <Text>TESTSTS</Text>
        <Button title="as" onPress={FadingMessage} />
        </View>
    );
}