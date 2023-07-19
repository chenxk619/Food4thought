import {SafeAreaView, Text, View, ImageBackground, Alert} from 'react-native';
import { useEffect } from 'react';
import { globalStyles } from '../styles/globalStyles';
import { useRoute } from '@react-navigation/native'
import { IconButton } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler';
import { auth, firestoredb } from "../firebaseconfig"
import { collection, addDoc, getDocs, updateDoc, doc, arrayUnion, arrayRemove} from 'firebase/firestore';
import { useState } from 'react';

export default function Reviews({ navigation }) {
  const route = useRoute()
  const instructions = route.params?.instructions
  const title = route.params?.title
  const ingredients = route.params?.ingredients
  const original_ingredient = route.params?.original_ingredient
  const ingredient_str = route.params?.ingredient_str
  const image = route.params?.image
  const fromSaved = route.params?.fromSaved

  const userId = auth.currentUser.uid
  const [found, setFound] = useState(false)
  const [dishFound, setDishFound] = useState(false)
  const [dishID, setDishID] = useState(null)

  useEffect(() => {
        
      //Check if user is already in collection
      getDocs(collection(firestoredb, "saved_dishes"))
      .then((querySnapshot)=>{         
          const newData = querySnapshot.docs
              .map((doc) => ({...doc.data(), id:doc.id }));

          //If found -> user has 0 or more dishes saved
          newData.forEach((elem) => 
              {if (elem.userId == userId){
                  elem.dish.forEach(dish => {
                    if (dish == title){
                      setDishFound(true)
                    }
                  });
                  setDishID(elem.id)
                  setFound(true)
              }})
      })
  } ,[dishFound])


  const saveDish = async () => { 

        //If user in collection, check if adding or removing dish
        if (found) {
          const docRef = doc(firestoredb, "saved_dishes", dishID);
          let array = []
          //Dish title, directions, array of ingredients, ingredients with desc, url
          array.push(title, instructions, ingredients, ingredient_str, image)
          
          //adding
          if (!dishFound){
            updateDoc(docRef, {
              dish: arrayUnion(title), 
              // instructions: arrayUnion(instructions),
              // ingredients: arrayUnion(Object.assign({}, ingredients)),
              // image: arrayUnion(image),
              userId: userId,
              array: arrayUnion(Object.assign({}, array))
            })
            Alert.alert("Dish added to saved recipes")
          }

          //Removing
          else{
            updateDoc(docRef, {
              dish: arrayRemove(title), 
              // instructions: arrayUnion(instructions),
              // ingredients: arrayUnion(Object.assign({}, ingredients)),
              // image: arrayUnion(image),
              userId: userId,
              array: arrayRemove(Object.assign({}, array))
            })
            Alert.alert("Dish removed from saved recipes")
          }
          setDishFound(!dishFound)
        }

        //Totally new user
        else{
            let array = []
            array.push(title, instructions, ingredients, ingredient_str, image)
            await addDoc(collection(firestoredb, "saved_dishes"), {
                dish: arrayUnion(title), 
                // instructions: arrayUnion(instructions),
                // ingredients: arrayUnion(Object.assign({}, ingredients)),
                // image: arrayUnion(image),
                userId: userId,
                array: arrayUnion(Object.assign({}, array))
            })
            setFound(true)
            setDishFound(true)
            Alert.alert("Dish added to saved recipes")
        }
    }

    //         {ingredient_str.split('-').map((step, index)=> <Text key={index} numberOfLines={2} adjustsFontSizeToFit={true}>
    //{step.split('For the').map((step2, index2) => <Text key={index2}> {step2}  </Text>)}{"\n"} </Text>)}

        //console.error("Error adding document: ");
  //.split('For the').map((step2, index2) => <Text key={index2}>For the {step2} </Text>)


  return (
    <SafeAreaView style = {[globalStyles.appBody, {backgroundColor:'white'}]}>
      <ImageBackground source={require('../assets/bg1.jpg')}
        resizeMode="cover" style={{flex:1, justifyContent:'center', height:'100%', width:'100%'}}>

      <View style={{flex:1, flexDirection:'row', width:'100%'}}>
        <View style={{alignItems:'center'}}>
          <IconButton icon='arrow-left' size = {35} 
            style={{flex:1, justifyContent:'center',marginLeft: 20}} onPress={()=> fromSaved ? navigation.navigate("Saved", {item : 'test'})
            : navigation.navigate("DishesApp", {ingredients: original_ingredient})}/>
        </View>
        <View style={{alignItems:'center'}}>
        <IconButton icon= {dishFound ?  'heart': 'heart-outline'}  size = {35} 
          style={{flex:1, justifyContent:'flex-end',marginLeft: 240}} onPress={()=> {saveDish()}}/>
        </View>
      </View>

      <View style={{flex:1.5, alignItems:'center', justifyContent:'flex-end'}}>
        <Text style={[globalStyles.appMainTitle,{flex:9,textAlign: 'center', fontSize: 35, color: 'black', marginVertical: 10, 
        marginHorizontal:10, fontFamily:'Hoefler Text'}]} numberOfLines={2} adjustsFontSizeToFit={true} > 
              {title} 
        </Text>
      </View>

      <View style = {{flex : 11, paddingHorizontal:  15, marginHorizontal: 10, marginBottom: 30, justifyContent: 'flex-start'}}>
      <ScrollView>
        
        <Text style = {[globalStyles.appMainTitle, {color: 'black', fontSize: 25, alignSelf: 'center',fontFamily:'Hoefler Text'}]}>
         Ingredients
        </Text>

        <Text style = {[globalStyles.appBodyFont, {lineHeight: 30,marginTop: 10, marginBottom: 40, fontSize: 17, textAlign: 'center', 
        fontFamily:'Hoefler Text'}]}> 
          {ingredient_str}
        </Text>

        <Text style = {[globalStyles.appMainTitle, {fontFamily:'Hoefler Text', color: 'black', fontSize: 25, alignSelf: 'center'}]}>
          Directions 
        </Text >

        <Text style = {[globalStyles.appBodyFont, {lineHeight: 20, fontFamily:'Hoefler Text', marginTop: 10, marginBottom: 40, 
        fontSize: 17, textAlign: 'center'}]}> 
        {instructions.split('  ').map((step, index)=> 
        <Text key={index} adjustsFontSizeToFit={true} > {step}{"\n\n"}</Text>)}
        </Text>

        <View style = {{alignItems: 'center', marginBottom: 20}}>
        </View>

      </ScrollView>
      </View>
      </ImageBackground>
    </SafeAreaView>
  );
}