import { useState } from 'react';
import { SafeAreaView, Text, View, TextInput, Alert, Pressable } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import FlatButton from '../custom/Button';
import { auth } from '../firebaseconfig';
import { signInWithEmailAndPassword } from "firebase/auth"; 
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Login({ navigation }) {
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
          blurOnSubmit = {true}  
          placeholder='Password'
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry
        />

        <TouchableOpacity activeOpacity={0.6} onPress={handleLogin}>
        <FlatButton text={'Sign In'} invert={'n'} disabled={false}/>
        </TouchableOpacity>
        <FlatButton text={'Forget Password'} onPress={handlePassword} invert={'y'} disabled={false}/>
        <View style = {{flexDirection: 'row', marginTop: 200}}>
            <Text style = {[globalStyles.appBodyFont, {fontSize: 15}]}>Don&apos;t have an account?&nbsp;</Text>
            <Pressable onPress={() => navigation.navigate("SignUp")}>
              <Text style = {{color:'blue', fontFamily: 'Futura-Medium',}}>Sign Up</Text>
              </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}