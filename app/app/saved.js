import { useEffect, useMemo} from 'react';
import { SafeAreaView, Text, View , ImageBackground, Image} from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { auth, firestoredb } from "../firebaseconfig"
import { Card, IconButton} from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { collection, getDocs } from 'firebase/firestore';
import { useRoute } from '@react-navigation/native'

export default function Saved( {navigation} ) {
    const route = useRoute()
    const userId = auth.currentUser.uid
    const [found, setFound] = useState(false)
    const [array, setArray] = useState([])
    const fromSaved = true
    
    //On callback to refresh dishes
    const params = useMemo(() => route.params || {}, [route.params])

    useEffect(() => {
        
        //Check if user is already in collection
        getDocs(collection(firestoredb, "saved_dishes"))
        .then((querySnapshot)=>{         
            const newData = querySnapshot.docs
                .map((doc) => ({...doc.data(), id:doc.id }));
  
            let temp = []
            //If found
            newData.forEach((elem) => 
                {   if (elem.userId == userId){
                    setFound(true)
                    elem.array.map((item) => {
                        let arr = Object.values(item)
                        temp.push(arr)
                    })
                }})
                // 0 - Title, 1: Directions, 2: Ingredients list, 3: Ingrgedinets string , 4: url
                setArray(temp)
        })

    } ,[params])



    const handleReview = (instructions, title, dish_ingredient, ingredient_str, image) => {
        navigation.navigate('Reviews', {instructions: instructions, title: title, ingredients: dish_ingredient, 
          ingredient_str: ingredient_str, image: image, fromSaved});
      }

    const DishCard = (props) => {
        return (
            <Card style={[globalStyles.dishesCard, {borderRadius:20, height: 290, width: 330, padding:0, marginHorizontal: 30}]}>
              <Image style = {{justifyContent:'center', alignSelf:'center', borderTopRightRadius:20, borderTopLeftRadius:20, 
              width:330, height:240}} source = {props.image == '' ? require('../assets/food4thought_logo.png') : {uri: props.image}}/>
              <Card.Title
                titleStyle = {{fontFamily:'Futura', fontSize: 16, textAlign:'center'}}
                title={props.text}
              />
      
            </Card>
        )
      }


    return (
        <SafeAreaView style = {[globalStyles.container, {backgroundColor:'white'}]}>
        <ImageBackground source={require('../assets/bg2_colour.jpeg')}
        resizeMode="cover" style={{flex:1, justifyContent:'center', height:'100%', width:'100%'}}>

            <View style={{flex:1}}>
                <IconButton style = {{alignSelf:'flex-start', marginLeft: 20}} icon='arrow-left' size = {30} 
                onPress={()=> navigation.navigate("Main")}/>
                <Text style={[globalStyles.appMainTitle, {color:'black', alignSelf:'center', textAlign:'center', fontSize:30}]}>
                    Favourites
                </Text>
            </View>

            <View style = {{flex:5}}>
            <ScrollView>
            {
                array.map((item) => {
                return (
                    <TouchableOpacity key = {item} activeOpacity={0.6} onPress={() => 
                    handleReview(item[1], item[0], item[2], item[3], item[4])} > 
                    <DishCard key = {item} text={item[0]} image={item[4]}/>
                    </TouchableOpacity>
                )
                })
            }
            <View style={{height:100}}></View>
            </ScrollView>
            </View>


        </ImageBackground>
        </SafeAreaView>

    );
}
