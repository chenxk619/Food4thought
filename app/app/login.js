import { useState } from 'react';
import { SafeAreaView, Text, View, TextInput, Alert, Pressable } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import FlatButton from '../custom/Button';
import { auth } from '../firebaseconfig';
import { signInWithEmailAndPassword } from "firebase/auth"; 
import { TouchableOpacity } from 'react-native-gesture-handler';
import {LinearGradient} from 'expo-linear-gradient'
import {Dimensions} from 'react-native';

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
      <LinearGradient style={{ position: 'absolute', left: 0,right: 0, bottom: 0, height: windowHeight,
         }}colors={['rbga(0,0,0,0.3)', 'transparent']}/>

      <View style = {{flex:1 ,justifyContent:'center', alignItems:'center'}}>
      <Text style = {[globalStyles.appMainTitle, {color:'black', fontSize: 30, alignSelf:'center', marginBottom: 50}]}>
        FOOD4THOUGHT</Text>

        <Text style = {[globalStyles.appBodyFont, 
          {fontSize: 30, fontWeight: '700', alignSelf: 'center', marginVertical: 15,}]}>
          Login
          </Text>

        <View style = {globalStyles.logIn} >
        <TextInput 
          style = {[globalStyles.userInputs]}
          autoCapitalize='none' 
          keyboardType = 'email-address' 
          placeholder='Email' 
          value={email}
          onChangeText={text => setEmail(text)} 
          />
        </View>
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
        <FlatButton text={'Forget Password'} onPress={handlePassword} disabled={false}/>
        <View style = {{flexDirection: 'row', marginTop: 200}}>
            <Text style = {[globalStyles.appBodyFont, {fontSize: 15}]}>Don&apos;t have an account?&nbsp;</Text>
            <Pressable onPress={() => navigation.navigate("SignUp")}>
              <Text style = {{color:'blue', fontFamily: 'Futura-Medium',}}>Sign Up</Text>
              </Pressable>
        </View>
        </View>
        
      </View>

    </SafeAreaView>
  );
}