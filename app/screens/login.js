import React, {useState} from 'react';
import {SafeAreaView, Text, View, TextInput, Pressable} from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import FlatButton from '../custom/Button';
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from '../firebaseconfig';

export default function Login( {navigation} ) {
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
        <TextInput style = {globalStyles.userInputs} keyboardType = 'email-address' placeholder='Email' />
        <TextInput style = {globalStyles.userInputs} blurOnSubmit = {true}  placeholder='Password'/>

        <FlatButton text={'Sign In'} onPress={() => navigation.navigate('Inputs')} invert={'n'}/>
        <FlatButton style = {{backgroundColor: 'white'}} text={'Forgot Password'} onPress={() => navigation.navigate('Password')} invert={'y'}/>

        <View style = {{flexDirection: 'row', alignItems: 'flex-end',}}>
            <Text style = {[globalStyles.appBodyFont, {fontSize: 15, marginTop: 200}]}>Don't have an account?</Text>
            <Pressable onPress={() => navigation.navigate('SignUp')}>
                <Text style = {{color:'blue', fontFamily: 'Futura-Medium',}}> Sign Up</Text>
            </Pressable>
        </View>
      </View>

    </SafeAreaView>
  );
}
