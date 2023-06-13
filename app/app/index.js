import {useEffect, useState} from 'react';
import {SafeAreaView, Text, View, TextInput} from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import FlatButton from '../custom/Button';
import { auth } from '../firebaseconfig';
import { signInWithEmailAndPassword } from "firebase/auth"; 
import { Link, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [accessToken, setAccessToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    //iosClientId : "330002817844-obhdei0qtbfqro1vmbl592cq8923ah5c.apps.googleusercontent.com",
    expoClientId : "330002817844-gcndolvp2hu7e71o0l4t3ak73658p1ss.apps.googleusercontent.com",
    webClientId : "330002817844-gcndolvp2hu7e71o0l4t3ak73658p1ss.apps.googleusercontent.com",
    scopes: ['profile', 'email'],
  });

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
    };

  const handlePassword = () => {
    router.replace("/password");
  }

  useEffect(() => {
    console.log("used effect")
    if (response?.type === "success") {
      setAccessToken(response.authentication.accessToken);
      getUserInfo();
    }
    else{
      console.log(response?.type);
    }
  }, [response, accessToken]);
  

  const getUserInfo = async () => {
    console.log("getting user info");
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const user = await response.json();
      setUserInfo(user);
    } catch (error) {
      console.log("userInfo error");
    }
  };


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

        <FlatButton text={'Sign In'} onPress={handleLogin} invert={'n'} disabled={false}/>
        <FlatButton text={'Sign In with Google'} onPress = {() => promptAsync()} invert={'n'} disabled={false}/>
        <FlatButton text={'Forget Password'} onPress={handlePassword} invert={'y'} disabled={false}/>
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