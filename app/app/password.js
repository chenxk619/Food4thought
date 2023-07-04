import {useState} from 'react';
import {SafeAreaView, Text, View, TextInput, ImageBackground} from 'react-native';
import FlatButton from '../custom/Button';
import InvisText from '../custom/HiddenText';
import { globalStyles } from '../styles/globalStyles';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { IconButton } from 'react-native-paper'
import { TouchableOpacity } from 'react-native-gesture-handler';
import {LinearGradient} from 'expo-linear-gradient'
import { Dimensions } from 'react-native';

export default function Password({ navigation }) {
  const windowHeight = Dimensions.get('window').height;
  const auth = getAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [sent, setSent] =useState(false);

  const handleReset = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setError(false);
        setSent(true);
      })
      .catch(() => {
        setError(true);
      });
  }

  return (
    <SafeAreaView style = {globalStyles.appBody}>
      <ImageBackground source={require('../assets/food4thought_bg_light.jpg')}
    resizeMode="cover" style={{flex:1, justifyContent:'center', height:'100%', width:'100%'}}>
      <IconButton icon='arrow-left' size = {35} 
        style={{flex:1, alignSelf:'flex-start', marginLeft: 20}} onPress={()=> navigation.navigate("Login")}/>

      <View style = {{height: 3/4 * windowHeight, paddingHorizontal:  15, marginHorizontal: 18, 
      marginBottom: 50, justifyContent: 'center', alignItems:'center'}}>
      <LinearGradient colors={['rgba(220, 220, 220, 0.4)' ,'rgba(220, 220, 220, 0.4)']} start={{x: 0, y: 0 }} end={{x: 1, y: 1 }} 
          style={{paddingVertical:10, paddingHorizontal:15, borderRadius:20, flex:0.75}}>
        <IconButton icon='lock-reset' style = {{justifyContent:'flex-start' ,alignSelf:'center', marginBottom:20}} size={70} />
        <Text style={[globalStyles.appMainTitle,{alignSelf: 'center', fontSize: 30, color: 'black', marginBottom: 20}]}> 
          Forgot Password 
        </Text>

        <Text style = {[globalStyles.appBodyFont, {marginHorizontal:5, marginBottom: 50, fontSize: 17, textAlign: 'center'}]}>Enter your email 
        and we will send you a link to reset your password </Text>
        <View style = {{alignItems: 'center', marginBottom: 30}}>
        <InvisText text = {'Email not found'} colour= {'red'} size = {17} disabled={!error}/>
        <InvisText text = {'Link Sent to your email!'} colour= {'black'} size = {15} disabled={!sent}/>
        </View>

          <TextInput
            style = {[globalStyles.userInputs, {marginBottom: 15}]}
            autoCapitalize='none' 
            placeholder='Email' 
            value={email}
            onChangeText={text => setEmail(text)} 
            onEndEditing={handleReset}
          />
          <TouchableOpacity activeOpacity={0.6} onPress={() => handleReset()}>
          <FlatButton text='Proceed' bgColor={'black'} textColor={'white'}/>
          </TouchableOpacity>

        </LinearGradient>
        </View>
        </ImageBackground>
    </SafeAreaView>
  );
}