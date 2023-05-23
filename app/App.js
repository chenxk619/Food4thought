import React, {useState} from 'react';
import {SafeAreaView, Text} from 'react-native';
import { globalStyles } from './styles/globalStyles';

export default function App() {

  return (
    <SafeAreaView style = {globalStyles.container}>
      <Text> Hello world </Text>
    </SafeAreaView>
  );
}