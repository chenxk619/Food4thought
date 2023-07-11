import { SafeAreaView, Text, TextInput, View, Alert, ImageBackground } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firebaseApp } from '../firebaseconfig';
import { globalStyles } from '../styles/globalStyles';
import { useState } from 'react';
import FlatButton from '../custom/Button';
import { IconButton } from 'react-native-paper'
import {LinearGradient} from 'expo-linear-gradient'

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      // Signed in 
      // const user = userCredential.user;
      
      Alert.alert("User created")
    })
    .catch((error) => Alert.alert(error.message))
  };

  return (
    <SafeAreaView style = {[globalStyles.appBody, {backgroundColor:'white'}]}>
    <ImageBackground source={require('../assets/bg1_colour.jpeg')}
    resizeMode="cover" style={{flex:1, justifyContent:'center', height:'100%', width:'100%'}}>
      <IconButton style = {{flex:1, alignSelf:'flex-start', marginLeft: 20}} icon='arrow-left' size = {35} onPress={()=> navigation.navigate("Login")}/>
      
      <View style={{flex:9 ,justifyContent:'center', marginBottom: 170, alignItems:'center'}}>
      <LinearGradient colors={['rgba(220, 220, 220, 0.6)' ,'rgba(220, 220, 220, 0.6)']} start={{x: 0, y: 0 }} end={{x: 1, y: 1 }} 
          style={{paddingVertical:10, paddingHorizontal:15, borderRadius:20, flex:0.9}}>
        <IconButton icon='account-circle' style = {{justifyContent:'center' ,alignSelf:'center'}} size={70} />
        <Text
          style = {[globalStyles.appBodyFont, {
            fontSize: 35, fontWeight: '700', alignSelf: 'center', marginVertical: 30
            }]}>
          Create Account
        </Text>
        <TextInput 
          style = {globalStyles.userInputs} 
          autoCapitalize='none' 
          keyboardType = 'email-address' 
          placeholder='Email' 
          value={email}
          onChangeText={text => setEmail(text)} 
        />
        <TextInput 
          style = {globalStyles.userInputs} 
          autoCapitalize='none' 
          placeholder='Password' 
          value={password}
          onChangeText={text => setPassword(text)} 
          />

        <View style = {{marginBottom:20}}></View>
        <FlatButton text='Sign Up' onPress={handleSignUp} bgColor={'black'} textColor={'white'}/>

      </LinearGradient>
      </View>
      
      </ImageBackground>
    </SafeAreaView>
  );
}