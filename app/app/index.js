import {useEffect, useState} from 'react';
import {SafeAreaView, Text, View, TextInput} from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import FlatButton from '../custom/Button';
import { auth } from '../firebaseconfig';
import { signInWithEmailAndPassword } from "firebase/auth"; 
import { Link, useRouter } from 'expo-router';
import { GoogleSignin } from '@react-native-google-signin/google-signin/';

GoogleSignin.configure({
  webClientId: '330002817844-gcndolvp2hu7e71o0l4t3ak73658p1ss.apps.googleusercontent.com',
  iosClientId: '330002817844-obhdei0qtbfqro1vmbl592cq8923ah5c.apps.googleusercontent.com',
});


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  //For Google Log in

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      //if signed in: Go to inputs
      if (user) {
        router.replace("/inputs")
      } 
    })
    return unsubscribe
  }, [])

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        // Signed in 
        const user = userCredentials.user;
      })
      .catch((error) => alert(error.message))
      // .catch((error) => {
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // console.error(errorCode);
      // console.error(errorMessage);
    };

  const handlePassword = () => {
    router.replace("/password");
  }
  
  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();
  
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
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

        <FlatButton text={'Sign In'} onPress={handleLogin} invert={'n'}/>
        <FlatButton text={'Sign In with Google'} onPress = {onGoogleButtonPress} invert={'n'}/>
        <FlatButton text={'Forget Password'} onPress={handlePassword} invert={'y'}/>
        <View style = {{flexDirection: 'row', alignItems: 'flex-end',}}>
            <Text style = {[globalStyles.appBodyFont, {fontSize: 15, marginTop: 200}]}>Don't have an account?&nbsp;</Text>
            <Link href="/signUp" style = {{color:'blue', fontFamily: 'Futura-Medium',}}> 
              Sign Up
              </Link>
            {/* <Pressable onPress={() => navigation.navigate('SignUp')}>
                <Text style = {{color:'blue', fontFamily: 'Futura-Medium',}}> Sign Up</Text>
            </Pressable> */}
        </View>
      </View>

    </SafeAreaView>
  );
}