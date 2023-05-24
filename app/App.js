import React, {useState} from 'react';
import {SafeAreaView, Text, View, TextInput, Button} from 'react-native';
import { globalStyles } from './styles/globalStyles';
import FlatButton from './custom/Button';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

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
          {fontSize: 35, fontWeight: '700', alignSelf: 'center', marginVertical: 15,}]}>
          Login
          </Text>
        <TextInput style = {globalStyles.userInputs} placeholder='Email' />
        <TextInput style = {globalStyles.userInputs} placeholder='Password'/>

        <FlatButton text={'Sign In'} onPress={test} invert={'n'}/>
        <FlatButton style = {{backgroundColor: 'white'}} text={'Forgot Password'} onPress={test} invert={'y'}/>

        <Text style = {[globalStyles.appBodyFont, {fontSize: 15, marginTop: 200}]}>Don't have an account? Sign Up</Text>
      </View>

    </SafeAreaView>
  );
}