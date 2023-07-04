import { useState } from 'react';
import { SafeAreaView, Text, View, TextInput, Alert, Pressable, Image, ImageBackground} from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import FlatButton from '../custom/Button';
import { auth } from '../firebaseconfig';
import { signInWithEmailAndPassword } from "firebase/auth"; 
import { TouchableOpacity } from 'react-native-gesture-handler';
import {LinearGradient} from 'expo-linear-gradient'
import { Dimensions } from 'react-native';

export default function Login({ navigation }) {
  const windowHeight = Dimensions.get('window').height;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigation.navigate("Inputs")
      })
      .catch((error) => Alert.alert(error.message))
    };

  const handlePassword = () => {
    navigation.navigate("Password");
  }

  return (
    <SafeAreaView style = {globalStyles.container}>

      <View style={globalStyles.appBody}>
      <ImageBackground source={require('../assets/food4thought_bg_light.jpg')}
    resizeMode="cover" style={{flex:1, justifyContent:'center', height:'100%', width:'100%'}}>

      <View style = {{flex:1 ,justifyContent:'center', alignItems:'center'}}>
        <Image
          style={{height: 100, width: 100, opacity:0.8}}
          source={require('../assets/food4thought_logo.png')}
        />
        <Text style = {[globalStyles.appMainTitle, {color:'black', fontSize: 30, alignSelf:'center', marginBottom: 50}]}>
          FOOD4THOUGHT</Text>


        <View style = {{justifyContent:'center', alignItems:'center'}}>
        <LinearGradient colors={['rgba(220, 220, 220, 0.4)' ,'rgba(220, 220, 220, 0.4)']} start={{x: 0, y: 0 }} end={{x: 1, y: 1 }} 
          style={{padding:20, borderRadius:20}}>

          <Text style = {[globalStyles.appBodyFont, 
            {fontSize: 30, fontWeight: '700', alignSelf: 'center', marginVertical: 15,}]}>
            Login
            </Text>

          <TextInput 
            style = {[globalStyles.userInputs]}
            autoCapitalize='none' 
            keyboardType = 'email-address' 
            placeholder='Email' 
            value={email}
            onChangeText={text => setEmail(text)} 
            />

          <TextInput 
            style = {globalStyles.userInputs} 
            blurOnSubmit = {true}  
            placeholder='Password'
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry
          />

          <TouchableOpacity activeOpacity={0.6} onPress={handleLogin}>
          <FlatButton text={'Sign In'} disabled={false} bgColor={'black'} textColor={'white'}/>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.6} onPress={handlePassword}>
          <FlatButton text={'Forget Password'} disabled={false}/>
          </TouchableOpacity>

          </LinearGradient>
        </View>

        <View style = {{flexDirection: 'row', marginTop: windowHeight/6}}>
            <Text style = {[globalStyles.appBodyFont, {fontSize: 15}]}>Don&apos;t have an account?&nbsp;</Text>
            <Pressable onPress={() => navigation.navigate("SignUp")}>
              <Text style = {{color:'blue', fontFamily: 'Futura-Medium',}}>Sign Up</Text>
              </Pressable>
        </View>
      
      </View>
      </ImageBackground>
    </View>


    </SafeAreaView>
  );
}