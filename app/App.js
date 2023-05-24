import React, {useState} from 'react';
import {SafeAreaView, Text, View, TextInput, Button} from 'react-native';
import { globalStyles } from './styles/globalStyles';
import FlatButton from './custom/Button';

export default function App() {

  const test = () => {
    console.log(1);
  }
  return (
    <SafeAreaView style = {globalStyles.container}>

      <View style = {globalStyles.appHeader}>
        <Text style = {globalStyles.appMainTitle}>FOOD4THOUGHT</Text>
      </View>

      <View style = {globalStyles.appBody}>
        <Text style = {globalStyles.appBodyFont}> Say hello to endless culinary possibilities! </Text>
      </View>

      <View style = {globalStyles.appLogin}>
        <Text style = {[globalStyles.appBodyFont, 
          {fontSize: 35, fontWeight: '700', alignSelf: 'center', marginVertical: 10,}]}>
          Login
          </Text>
        <TextInput style = {globalStyles.userInputs} placeholder='Email' />
        <TextInput style = {globalStyles.userInputs} placeholder='Password'/>

        <FlatButton text={'Sign In'} onPress={test} invert={'y'}/>
        <FlatButton style = {{backgroundColor: 'white'}} text={'Forgot Password'} onPress={test} invert={'y'}/>

        <Text style = {[globalStyles.appBodyFont, {fontSize: 15, marginTop: 120}]}>Don't have an account? Sign Up</Text>
      </View>

    </SafeAreaView>
  );
}