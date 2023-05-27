import React, {useState} from 'react';
import {SafeAreaView, Text} from 'react-native';
import FlatButton from '../../custom/Button';

export default function Dishes( {navigation} ) {

  return (
    <SafeAreaView>
      <Text> Dishes! </Text>
      <FlatButton text = {'Reviews'} invert = {'n'} onPress={() => {navigation.navigate('Review')}}/>
    </SafeAreaView>
  );
}