import React, {useEffect} from 'react'
import { Alert, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, Text, 
  TouchableWithoutFeedback, View , TextInput, ScrollView, Modal, ImageBackground} from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { FAB, Card, Button, IconButton} from 'react-native-paper';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {LinearGradient} from 'expo-linear-gradient'
import { collection, getDocs, addDoc, updateDoc, doc} from 'firebase/firestore';
import { auth, firestoredb } from "../firebaseconfig"

let backup = []

export default function Inputs({ navigation }) {
  const [inputs, setInputs] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [found, setFound] = useState(false)
  const [dishesRendered, setDishesRendered] = useState(10)
  const userId = auth.currentUser.uid

  //Only for initial render of ingredients
  useEffect(() => {
    //Check if user is already in collection
    getDocs(collection(firestoredb, "saved_ingredients"))
    .then((querySnapshot)=>{         
        const newData = querySnapshot.docs
            .map((doc) => ({...doc.data(), id:doc.id }));
                    
        //If found user account
        newData.forEach((elem) => 
            {   
              if (elem.userId == userId){
              setFound(true)
              //Load from backend
              setIngredients(elem.ingredient)
              ingredients.forEach((item) =>{
                backup.push(item)
              })
              }
            })
        })

    //Check if user is already in collection
    getDocs(collection(firestoredb, "name"))
    .then((querySnapshot)=>{         
        const newData = querySnapshot.docs
            .map((doc) => ({...doc.data(), id:doc.id }));
                    
        //If found then reset name

            newData.forEach((elem) => 
            {   if (elem.userId == auth.currentUser.uid){
                  setDishesRendered(Number(elem.render))
            }})})
      }
 ,[])

  const saveIngredient = () => {
    getDocs(collection(firestoredb, "saved_ingredients"))
    .then((querySnapshot)=>{       
      if (found){  
        const newData = querySnapshot.docs
            .map((doc) => ({...doc.data(), id:doc.id }));
        newData.forEach((elem) => 
            {   
              if (elem.userId == userId){
              //Update the array on backend
              const docRef = doc(firestoredb, "saved_ingredients", elem.id);
              updateDoc(docRef, {
                ingredient: backup
              })
            }
            })
        }})

    //If not then create new name
    if (!found){
      const doc_Ref = addDoc(collection(firestoredb, "saved_ingredients"), {
          ingredient: backup,   
          userId: userId
      })
      setFound(true)
      console.log("Document written with ID: ", doc_Ref.id)
    }
    
  }

  function Ingredient(props) {
    return (
      <Card style={{flex:0.1, marginHorizontal:30, marginVertical:5, backgroundColor:'white', shadowColor:'black', shadowRadius:2}}>
          <LinearGradient colors={['rgba(247,152,98, 0.5)' ,'rgba(247,152,98, 0.5)']} start={{x: 1, y: 0 }} end={{x: 1, y: 1 }} 
          style={{paddingVertical:10, paddingHorizontal:15, borderRadius:10, flex:0.75}}>
          <Card.Title
            titleStyle = {[globalStyles.appBodyFont, {fontWeight:'500', textAlign:'left'}]}
            title={props.text}
            right={() => (
              <IconButton
                icon={'delete'}
                onPress={() => {removeIngredient(props.value); saveIngredient()}}
              />
            )}
          />
        </LinearGradient>
      </Card>
    )
  }

  const addIngredient = () => {
      Keyboard.dismiss();
      if (ingredients.length > 10) {
        Alert.alert(`Maximum of 10 Ingredients!`)
        return
      }
      if (inputs === undefined || inputs === "") {
        Alert.alert(`Please key in a valid input!`)
      }
      else{
        let duplicate = false
        ingredients.forEach((item) => {
          if (item == inputs){
            duplicate = true
          }
        })
        if (!duplicate){
          setIngredients([...ingredients, inputs]);
          backup.push(inputs)
        }
      }
  }

  const clearInput =  React.useCallback(()=> {setInputs('')}, []);

  const removeIngredient = (index) => {
    let ingredientsCopy = [...ingredients];
    ingredientsCopy.splice(index, 1);
    setIngredients(ingredientsCopy);
    if (backup.length != 0){
      backup.splice(index, 1);
    }
  }

  const setModal = () => {
    if (ingredients.length > 0)
    {
      setModalVisible(!modalVisible)
    }
    else{
      Alert.alert("Minimum of 1 ingredient");
    }
  }

  const ModalNav = (matchAll) => {
    setModalVisible(!modalVisible)
    console.log(dishesRendered)
    navigation.navigate('DishesApp', {ingredients: ingredients, matchAll: matchAll, dishesRendered: dishesRendered});
  }

  return (
    <SafeAreaView style = {[globalStyles.appBody, {backgroundColor:'white'}]}>
      <ImageBackground source={require('../assets/bg2_colour.jpeg')}
        resizeMode="cover" style={{flex:1, justifyContent:'center', height:'100%', width:'100%'}}>
      <View style = {{flex: 1}}>
  
        <View style ={{flexDirection: 'row', justifyContent: 'space-between'}}>

          <IconButton style = {{alignSelf:'flex-start', marginLeft: 20}} icon='arrow-left' size = {30} 
          onPress={()=> navigation.navigate("Main")}/>

          <Button style={{marginRight:15, marginTop:10, height:40, width: 105}} icon='arrow-right' mode='elevated' contentStyle= {{paddingHorizontal: 5, 
          flexDirection: 'row-reverse'}} buttonColor='#111' textColor='white' onPress={setModal} compact={false} >
            Dishes
          </Button>
        </View>

        <Text style={[globalStyles.appMainTitle,{ alignSelf: 'center', fontSize: 30, color: 'black', paddingBottom: 10,
          marginVertical: 10,}]}> 
          Ingredients 
        </Text>

        <View style={[globalStyles.appBody, { justifyContent: 'flex-end', backgroundColor: 'transparent', marginVertical: 10,}]}>
          <View style={{flexDirection: 'row'}}>
              <TextInput style={{alignItems: 'center', width: '70%', borderColor: '#999', borderRadius: 15, borderWidth: 1,
                paddingHorizontal: 10, fontWeight: '600', backgroundColor:'white' }} mode='outlined' placeholder='Add Ingredients '
                value={inputs} onChangeText={inputs => setInputs(inputs)} ref={input => { this.textInput = input }}
              />
              <IconButton
              icon={'close'} onPress={clearInput} style={{position: 'absolute',right: 65,top:6}}/>
              <TouchableOpacity activeOpacity={0.6} onPress={() => {addIngredient();saveIngredient()}}>
              <FAB
                style={{ margin: 4, backgroundColor: 'black'}} color='white' icon='plus'/>
              </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style = {{flex:2.5}}>
        <ScrollView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? "padding" : null}
          style={globalStyles.container}>
            <View style={{ 
              justifyContent: 'center',
              }}>

                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    setModalVisible(!modalVisible);
                  }}>
                  <View style = {{flex: 1, alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center'}}>
                    <View style = {[globalStyles.button, {marginTop: 30,backgroundColor: 'white', height: 300, width: 330}]}>
                      
                      <View style={{marginLeft: 20, flexDirection:'row', justifyContent:'flex-end'}}>
                        <View style={{marginTop:20, flex:1, justifyContent:'flex-end'}}>
                        <Text style={[globalStyles.appBodyFont, {textAlign:'center', fontSize:22, alignSelf:'flex-end',}]}>
                          The dishes shown will contain:    
                        </Text>
                        </View>
                        <View>
                        <IconButton
                          icon={'close'}
                          onPress={() => setModalVisible(!modalVisible)}/>
                        </View>
                      </View>
                      
                      <View style={{flex:1, paddingBottom: 20, alignItems:'center',justifyContent:'center'}}>

                        <TouchableOpacity activeOpacity={0.6} onPress = {() => ModalNav(false)}>
                          <View style={[globalStyles.userInputs, {backgroundColor:'#eee', height:50}]}>
                          <Text style={[globalStyles.appBodyFont, {textAlign:'center'}]}>Any of the ingredients</Text>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.6} onPress = {() => ModalNav(true)}>
                          <View style={[globalStyles.userInputs, {backgroundColor:'#eee', height:50}]}>
                          <Text style={[globalStyles.appBodyFont, {textAlign:'center'}]}>All of the ingredients</Text>
                          </View>
                        </TouchableOpacity>

                      </View>
                    </View>
                  </View>
                </Modal>
              {
                ingredients.map((item, index) => {
                  return (
                    <Ingredient key={index} value={index} text={item}/>
                  )
                })
              }
            </View>
        </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
        </ScrollView>
      </View>
    </ImageBackground>
    </SafeAreaView>
  );
}