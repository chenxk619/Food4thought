import React, {useState} from 'react';
import {SafeAreaView, Text} from 'react-native';
import FlatButton from '../../custom/Button';

export default function Inputs( {navigation} ) {

  return (
    <SafeAreaView>
      <Text> Inputs! </Text>
      <FlatButton text = {'Dishes'} invert = {'n'} onPress={() => {navigation.navigate('Dishes')}}/>
    </SafeAreaView>
  );
}