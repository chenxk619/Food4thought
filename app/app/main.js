import { useEffect } from 'react';
import { Alert, Keyboard, SafeAreaView, Text, View , TextInput, ScrollView, Modal, ImageBackground} from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { auth, firestoredb } from "../firebaseconfig"
import { signOut } from 'firebase/auth';
import { Card, IconButton, FAB} from 'react-native-paper';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {LinearGradient} from 'expo-linear-gradient'
import { collection, getDocs } from 'firebase/firestore';
import { useRoute } from '@react-navigation/native'

export default function MainPage( {navigation} ) {
    const route = useRoute()
    const update = route.params?.update
    const [name, setName] = useState("Guest")
    
    //passed back
    
    const handleSignOut = () => {
        Keyboard.dismiss();
        signOut(auth).then(() => {
          navigation.navigate("Login");
        })
        .catch(error => Alert.alert(error.message))
      }


    useEffect(() => {
        
            const userId = auth.currentUser.uid
            getDocs(collection(firestoredb, "name"))
                .then((querySnapshot)=>{              
                    const newData = querySnapshot.docs
                        .map((doc) => ({...doc.data(), id:doc.id }));
                    
                    newData.forEach((elem) => 
                    {
                        if (elem.userId == userId){
                        setName(elem.nickname)
                    }})
                })
        
       
    } ,[update])

    return(
        <SafeAreaView style = {[globalStyles.container, {backgroundColor:'white'}]}>
            <ImageBackground source={require('../assets/bg2_colour.jpeg')}
            resizeMode="cover" style={{flex:1, justifyContent:'center', height:'100%', width:'100%'}}>

            <View style={{flex:2, alignItems:'center', justifyContent:'center', margin: 20}}>
                <Text style={[globalStyles.appMainTitle, {fontSize:35, fontWeight:'600', color:'black', textAlign:'center'}]}>  
                Welcome, {name} </Text>
            </View>

            <View style={{flex:7}}>
                <View style={{flex:0.5, flexDirection:'row', justifyContent:'center', alignItems:'flex-end'}}>
                
                    <Card style={{ flex:1, marginHorizontal:25, marginBottom:30, backgroundColor:'white', 
                    shadowColor:'black', shadowRadius:2, marginRight:15}}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => {navigation.navigate('Inputs')}}>                       
                        <LinearGradient colors={['rgba(247,152,98, 0.5)' ,'rgba(247,152,98, 0.5)']} start={{x: 1, y: 0 }} end={{x: 1, y: 1 }} 
                            style={{height: 160, paddingVertical:10, paddingHorizontal:15, borderRadius:10}}>
                            <IconButton style={{justifyContent:'center', alignSelf:'center'}}icon={'food'} size={70}/>
                            <Text style = {[globalStyles.appBodyFont, {fontWeight:'500', textAlign:'center'}]}>
                                Ingredients
                            </Text>
                        </LinearGradient>
                        </TouchableOpacity> 
                    </Card>

                    <Card style={{ flex:1, marginHorizontal:25, marginBottom:30, backgroundColor:'white', 
                    shadowColor:'black', shadowRadius:2, marginLeft:15}}>                        
                        <TouchableOpacity activeOpacity={0.8}>                       
                        <LinearGradient colors={['rgba(247,152,98, 0.5)' ,'rgba(247,152,98, 0.5)']} start={{x: 1, y: 0 }} end={{x: 1, y: 1 }} 
                            style={{height: 160, paddingVertical:10, paddingHorizontal:15, borderRadius:10}}>
                            <IconButton style={{justifyContent:'center', alignSelf:'center'}}icon={'heart'} size={70}/>
                            <Text style = {[globalStyles.appBodyFont, {fontWeight:'500', textAlign:'center'}]}>
                                Favourites
                            </Text>
                        </LinearGradient>
                        </TouchableOpacity> 
                    </Card>

                </View>

                <View style={{flex:0.5,flexDirection:'row', alignItems:'flex-start'}}>
                    <Card style={{ flex:1, marginHorizontal:25, backgroundColor:'white', 
                    shadowColor:'black', shadowRadius:2, marginRight:15}}>
                        <TouchableOpacity activeOpacity={0.8}>                       
                        <LinearGradient colors={['rgba(247,152,98, 0.5)' ,'rgba(247,152,98, 0.5)']} start={{x: 1, y: 0 }} end={{x: 1, y: 1 }} 
                            style={{height: 160, paddingVertical:10, paddingHorizontal:15, borderRadius:10}}>
                            <IconButton style={{justifyContent:'center', alignSelf:'center'}}icon={'account-supervisor'} size={70}/>
                            <Text style = {[globalStyles.appBodyFont, {fontWeight:'500', textAlign:'center'}]}>
                                Socials
                            </Text>
                        </LinearGradient>
                        </TouchableOpacity> 
                    </Card>

                    <Card style={{ flex:1, marginHorizontal:25, backgroundColor:'white', 
                    shadowColor:'black', shadowRadius:2, marginLeft:15}}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => {navigation.navigate("Settings" , {name:name})}}>                       
                        <LinearGradient colors={['rgba(247,152,98, 0.5)' ,'rgba(247,152,98, 0.5)']} start={{x: 1, y: 0 }} end={{x: 1, y: 1 }} 
                            style={{height: 160, paddingVertical:10, paddingHorizontal:15, borderRadius:10}}>
                            <IconButton style={{justifyContent:'center', alignSelf:'center'}}icon={'cog'} size={70}/>
                            <Text style = {[globalStyles.appBodyFont, {fontWeight:'500', textAlign:'center'}]}>
                                Settings
                            </Text>
                        </LinearGradient>
                        </TouchableOpacity> 
                    </Card>
                </View>

                <View style={{flex:0.5,flexDirection:'row', alignItems:'flex-start', justifyContent: 'center'}}>
                    <Card style={{ flex:0.5, marginHorizontal:25, backgroundColor:'white', 
                    shadowColor:'black', shadowRadius:2, marginRight:15}}>
                        <TouchableOpacity activeOpacity={0.8} onPress={handleSignOut}>                       
                        <LinearGradient colors={['rgba(247,152,98, 0.5)' ,'rgba(247,152,98, 0.5)']} start={{x: 1, y: 0 }} end={{x: 1, y: 1 }} 
                            style={{height: 160, paddingVertical:10, paddingHorizontal:15, borderRadius:10}}>
                            <IconButton style={{justifyContent:'center', alignSelf:'center'}}icon={'logout'} size={70}/>
                            <Text style = {[globalStyles.appBodyFont, {fontWeight:'500', textAlign:'center'}]}>
                                Log Out
                            </Text>
                        </LinearGradient>
                        </TouchableOpacity> 
                    </Card>
                </View>

            </View>

            <View style={{flex:0.5}}>

            </View>

          </ImageBackground>
        </SafeAreaView>
    );
}