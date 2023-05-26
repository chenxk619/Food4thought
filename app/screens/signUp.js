import React, {useState} from 'react';
import {SafeAreaView, Text, TextInput, Button} from 'react-native';
import FlatButton from '../custom/Button';
import { getAuth,createUserWithEmailAndPassword } from 'firebase/auth';
import { firebaseApp } from '../firebaseconfig';
import { globalStyles } from '../styles/globalStyles';

export default function SignUp( {navigation} ) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode);
      console.error(errorMessage);
    });
  };

  return (
    <SafeAreaView>
      <TextInput 
        styles={globalStyles.userInputs} 
        value={email} 
        onChangeText={(email)=> {setEmail(email)}} 
        placeholder='Email'
      />
      <TextInput 
        styles={globalStyles.userInputs} 
        value={password} 
        onChangeText={(password)=> {setPassword(password)}} 
        placeholder='Password' secureTextEntry
      />
      <Button onPress={handleSignUp} title='Sign Up'></Button>
    </SafeAreaView>
  );
}