import React from 'react';
import {SafeAreaView, Text, TextInput, View} from 'react-native';
import { globalStyles } from '../styles/globalStyles';

export default function SignUp( {navigation} ) {

  return (
    <SafeAreaView style = {globalStyles.appBody2}>
      <View style = {{flex: 1}}>
        <Text style = {[globalStyles.appBodyFont, globalStyles.shadow,
          {fontSize: 35, fontWeight: '700', alignSelf: 'center', marginTop: 50, color: '#fff'}]}> 
          Create an account 
        </Text>
      </View>

      <View style = {{flex: 4}}>
        <TextInput style = {[globalStyles.userInputs, {shadowOpacity: 0.9}]} keyboardType = 'email-address' placeholder='Email' />
        <TextInput style = {[globalStyles.userInputs, {shadowOpacity: 0.9}]} blurOnSubmit = {true}  placeholder='Password'/>
      </View>
    </SafeAreaView>
  );
}