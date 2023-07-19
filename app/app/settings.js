import { Alert,  Platform, SafeAreaView, Text, View , TextInput, ImageBackground} from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { auth, firestoredb, firebaseApp } from "../firebaseconfig"
import { signOut } from 'firebase/auth';
import { Card, Button, IconButton} from 'react-native-paper';
import { useState } from 'react';
import {LinearGradient} from 'expo-linear-gradient'
import { collection, addDoc, getDocs, updateDoc, doc} from 'firebase/firestore';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";


export default function Settings( {navigation} ) {

    const [Name, setName] = useState('Guest')
    const [render , setRender] = useState('')
    let rendered = 10;
    const userId = auth.currentUser.uid
    const email = auth.currentUser.email
    const Auth = getAuth();

    const updateChanges = async (type) => { 

        try{
        let found = false;

            console.log(type)

            //Check if user is already in collection
            await getDocs(collection(firestoredb, "name"))
            .then((querySnapshot)=>{         
                const newData = querySnapshot.docs
                    .map((doc) => ({...doc.data(), id:doc.id }));
                           
                //If found then reset name

                    newData.forEach((elem) => 
                    {   if (elem.userId == userId){

                        if (type == "name"){
                            const docRef = doc(firestoredb, "name", elem.id);
                            updateDoc(docRef, {nickname: Name})
                        }
                        if (type == "render"){
                            const docRef = doc(firestoredb, "name", elem.id);
                            updateDoc(docRef, {render: rendered})
                        }
                        found = true
                    }})
                }
            )

            //If not then create new name
            if (!found){
                const doc_Ref = await addDoc(collection(firestoredb, "name"), {
                    nickname: Name,   
                    render: rendered,
                    userId: userId
                })
                console.log("Document written with ID: ", doc_Ref.id)
            }
            Alert.alert("Named changed")
        } 
        
        catch {
            console.error("Error adding document: ");
        }
    }

    const handleReset = () => {
        sendPasswordResetEmail(Auth, email)
          .then(() => {
            Alert.alert("Reset instructions sent to your email")
          })
          .catch(() => {
            Alert.alert("Error resetting password")
          });
      }


    // const test = async () => { 


    //         await getDocs(collection(firestoredb, "Recipe3"))
    //         .then((querySnapshot)=>{         
    //             const newData = querySnapshot.docs
    //                 .map((doc) => ({...doc.data(), id:doc.id }));

    //         //8356
    //         newData.slice(3000,6000).forEach((elems) =>
    //         {
    //         const docRef = doc(firestoredb, "Recipe3", elems.id);
    //         const newArr = elems.ingredientList.split(',')
    //         newArr.forEach((elem) => {
    //             updateDoc(docRef, {
    //                 array: arrayUnion(elem)
    //             })
    //         })
    //         // i = i + 1
    //         // console.log(i)
    //         // console.log(elems.id)
    //         }
    //         )
    //         console.log('Done')
    //     })}

    

    return (
        <SafeAreaView style = {[globalStyles.appBody, {backgroundColor:'white'}]}>
            <ImageBackground source={require('../assets/bg2_colour.jpeg')}
            resizeMode="cover" style={{flex:1, justifyContent:'center', height:'100%', width:'100%'}}>

            <View style={{flex:1}}>
                <IconButton style = {{alignSelf:'flex-start', marginLeft: 20}} icon='arrow-left' size = {30} 
                onPress={()=> navigation.navigate("Main", {update: Name})}/>
                <Text style={[globalStyles.appMainTitle, {color:'black', alignSelf:'center', textAlign:'center', fontSize:30}]}>
                    Settings
                </Text>
            </View>

            <View style={{flex:5, justifyContent:'center', margin:30}}>
                <LinearGradient colors={['rgba(220, 220, 220, 0.5)' ,'rgba(220, 220, 220, 0.5)']} start={{x: 0, y: 0 }} end={{x: 1, y: 1 }} 
                style={{padding:20, borderRadius:20, flex:1}}>

                <View style={{flex:1, alignItems:'center'}}>
                    <Text style={[globalStyles.appBodyFont, {padding:10}]}>Change your name</Text>
                    <View style={{flexDirection:'row', width:300, alignItems:'center', justifyContent:'center'}}>
                        <TextInput 
                        style = {[{flex:6},globalStyles.userInputs]}
                        autoCapitalize='none' 
                        placeholder='Name' 
                        value={Name}
                        maxLength={30}
                        onChangeText={text => setName(text)} 
                        />
                        <IconButton style = {{flex:1,alignSelf:'flex-start'}} icon='arrow-right' size = {30} 
                        onPress={()=> {updateChanges('name')}}/>
                    </View>
                </View>

                <View style={{flex:1, marginTop:20, alignItems:'center'}}>
                    <Text style={[globalStyles.appBodyFont, {padding:10}]}>Dishes rendered per page</Text>
                    <View style={{flexDirection:'row', width:300, alignItems:'center', justifyContent:'center'}}>
                        <TextInput 
                        style = {[{flex:6},globalStyles.userInputs]}
                        autoCapitalize='none' 
                        keyboardType='numeric'
                        value={render.replace(/[^0-9]/, '')}
                        maxLength={2}
                        onChangeText={render => setRender(render)} 
                        />
                        <IconButton style = {{flex:1,alignSelf:'flex-start'}} icon='arrow-right' size = {30} 
                        onPress={()=> {rendered = render; updateChanges('render')}}/>
                    </View>
                </View>

                <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                    <View style={{flexDirection:'row', width:300, alignItems:'center', justifyContent:'center'}}>
                        <Text style={[globalStyles.appBodyFont, {marginLeft:80}]}>Reset Password</Text>
                        <IconButton style = {{flex:1,alignSelf:'flex-start'}} icon='arrow-right' size = {30} 
                        onPress={()=> {handleReset()}}/>
                    </View>
                </View>

                <View style = {{flex:3}}></View>

                </LinearGradient>
            </View>

            </ImageBackground>
        </SafeAreaView>
    )
}
