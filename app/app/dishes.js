import { View, ScrollView, Alert, ImageBackground} from 'react-native';
import { Text, Button, Checkbox, Card } from 'react-native-paper';
import FlatButton from '../custom/Button';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { globalStyles } from '../styles/globalStyles';
import { collection, getDocs, query, where, and } from 'firebase/firestore';
import { firestoredb } from '../firebaseconfig';
import { Drawer } from 'react-native-drawer-layout';
import { useState, useEffect } from 'react';
import Slider from '@react-native-community/slider';
import { useRoute } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import {LinearGradient} from 'expo-linear-gradient'
import { color } from 'react-native-reanimated';

const FilterDrawerScreen = (props) => {
  const [dessertsIsChecked, setDessertsIsChecked] = useState(true);
  const [mainsIsChecked, setMainsIsChecked] = useState(true);
  const [appetisersIsChecked, setAppetisersIsChecked] = useState(true);
  const [open, setOpen] = useState(false);
  const [complexity, setComplexity] = useState(19);
  const [selectAll, setSelectAll] = useState(props.matchAll);
  const { navigation } = props;

  function CategoryFilter(props) {
    const { title, checked, onPress} = props;

    return (
      <View style={{ 
        alignContent: 'center',
        flexDirection: 'row',
        paddingLeft: 10,
        }}>
        <Text style={{alignSelf: 'center'}}>{title}</Text>
        <Checkbox.Android
            status={checked ? 'checked' : 'unchecked'}
            color='gray'
            onPress={onPress}
          />
      </View>
    )
  }

  function ComplexityFilter() {

    useEffect(() => {
    }, [complexity]);
    
    return (
      <View style={{paddingLeft: 10}}>
        <Slider style={{width: 240, height: 10}}
          minimumValue={1}
          maximumValue={19}
          minimumTrackTintColor='gray'
          step={1}
          value={complexity}
          onSlidingComplete={(value) => setComplexity(value)}
          />
          <Text>
            Ingredients:{complexity}
            </Text>
        </View>
    )
  }

  function handleFilterSubmit() {

    const updatedCategories = []
    if (appetisersIsChecked) {
      updatedCategories.push("Appetisers");
    }
    if (mainsIsChecked) {
      updatedCategories.push("Mains");
    }
    if (dessertsIsChecked) {
      updatedCategories.push("Desserts");
    }
    
    navigation.navigate('Dishes', { ingredients: props.ingredients, categories: updatedCategories, complexity: complexity, matchAll: selectAll });
  }

  const handleSelect = () => {
    setSelectAll(!selectAll);
    props.matchAll = !props.matchAll;
    props.redundancy = !props.redundancy;
  }

  return (
    <DrawerContentScrollView scrollEnabled={false} style={{}} {...props}>
       <Drawer
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        renderDrawerContent={() => {
        }}>
          <Text style={[globalStyles.appBodyFont, {padding: 10}]}>Category</Text>
          <CategoryFilter
            title={`Appetisers`}
            checked={appetisersIsChecked}
            onPress={() => setAppetisersIsChecked(!appetisersIsChecked)}
            />
          <CategoryFilter
            title={`Mains`}
            checked={mainsIsChecked}
            onPress={() => setMainsIsChecked(!mainsIsChecked)}
            />
          <CategoryFilter
            title={`Desserts`}
            checked={dessertsIsChecked}
            onPress={() => setDessertsIsChecked(!dessertsIsChecked)}
            />
          <Text style={[globalStyles.appBodyFont, {padding: 10, paddingTop: 20}]}>Complexity</Text>
          <ComplexityFilter />
          <View style={{flex:1, marginHorizontal: 10, marginTop: 30, flexDirection:'row', alignItems: 'center'}}>
            <Text style={[globalStyles.appBodyFont]}>Filter mode:</Text>
            <TouchableOpacity activeOpacity={0.6} onPress={handleSelect}>
            <Button style={{marginLeft:15}} mode='elevated' contentStyle= {{paddingHorizontal: 2}}
            buttonColor='#111' compact={true} > 
            <Text style={{color: 'white', fontSize:12, fontFamily: 'Futura'}}>{selectAll ? 'Match All': 'Match Any'} </Text>
            </Button>
            </TouchableOpacity>
          </View>

          <Button
            mode='contained' buttonColor='#111' icon='magnify' onPress={handleFilterSubmit}
            style={{
              alignSelf: 'flex-start',
              marginVertical: 20,
              marginHorizontal: 10,
              }}>
            Filter
          </Button>
        </Drawer>
    </DrawerContentScrollView>
  );
}

const DishCard = (props) => {
  return (
    <Card style={[globalStyles.dishesCard, {padding:0}]}>
        <LinearGradient colors={['rgba(100,200,0, 0.5)' ,'rgba(190,237,83,0.4)']} start={{x: 1, y: 0 }} end={{x: 1, y: 1 }} 
          style={{paddingVertical:10, paddingHorizontal:0, borderRadius:10}}>
        <Card.Title
          titleStyle = {{fontFamily:'Futura', fontSize: 16, textAlign:'center'}}
          title={props.text}
        />
        </LinearGradient>
      </Card>
  )
}

const DishesScreen = ({ route, navigation }) => {
  const navRoute = useRoute();
  const dishesRef = collection(firestoredb, 'dishes')
  const [dishes, setDishes] = useState([]);
  const { categories } = route.params;
  const { complexity } = route.params;
  const ingredients = navRoute.params.ingredients
  const matchAll = navRoute.params.matchAll

  const lower = ingredients.map(element => {
    return element.toLowerCase();
  });

  const handleReview = (instructions, title, dish_ingredient, original_ingredient) => {
    navigation.navigate('Reviews', {instructions: instructions, title: title, ingredients: dish_ingredient, original_ingredient});
  }

  useEffect(() => {
    if (categories === undefined || categories.length === 0) {
      setDishes([]);
      Alert.alert("No dishes found!")
      return;
    }

  if (!matchAll){
  const q = query(dishesRef, and(where("category", "in", categories), (where("ingredients", "array-contains-any", lower)) ));

    getDocs(q)
      .then((querySnapshot) => {
        const updatedDishes = []; // Create a new array to store the updated dishes

        querySnapshot.forEach((doc) => {
          const instance = {
            key: doc.id, // Add a unique identifier to each dish object
            title: doc.data().title,
            category: doc.data().category,
            dish_complexity: doc.data().ingredients.length,
            instructions: doc.data().directions,
            dish_ingredient: doc.data().ingredients,
          }

          if (instance.dish_complexity < complexity + 1){
          updatedDishes.push(instance);
          }
        });

        if (updatedDishes.length == 0){
          Alert.alert("No dishes found!")
        }
        setDishes(updatedDishes); // Update the dishes state with the new array
        })
        .catch((error) => {
          Alert.alert.error("Error getting documents: ", error);
        });
  }

  else{

  let tempDishes = [];
  for (let i = 0; i < lower.length; i++){
    const q = query(dishesRef, and(where("category", "in", categories), (where("ingredients", "array-contains" ,lower[i])) ));
    getDocs(q)
      .then((querySnapshot) => {
        let updatedDishes = []; // Create a new array to store the updated dishes

        querySnapshot.forEach((doc) => {
          const instance = {
            key: doc.id, // Add a unique identifier to each dish object
            title: doc.data().title,
            category: doc.data().category,
            dish_complexity: doc.data().ingredients.length,
            instructions: doc.data().directions,
            dish_ingredient: doc.data().ingredients,
          }

          //To check for complexity
          if (instance.dish_complexity < complexity + 1){

            //for i > 0 (second iteration)
            if (tempDishes.length > 0){
              tempDishes.forEach((dish) => {
                if (dish == instance.title){
                  updatedDishes.push(instance);
                }
              })
            }

            //first instance to update dishes
            if (tempDishes.length == 0 && i == 0){
              updatedDishes.push(instance);
            }
          }
        });

        if (updatedDishes.length == 0 && i == lower.length - 1){
          Alert.alert("No dishes found!")
        }

        updatedDishes.forEach((dish) => 
        {tempDishes.push(dish.title)})

        if (i == lower.length - 1){
          setDishes(updatedDishes);
          } // Update the dishes state with the new array
        })
        .catch((error) => {
          Alert.alert.error("Error getting documents: ", error);
        });
      }
  }
  }, [categories]);

  return (
    <SafeAreaProvider style={[globalStyles.container, {backgroundColor:'white',
      justifyContent: 'center', alignItems: 'center'}]}>
      <ImageBackground source={require('../assets/bg2_colour2.jpg')}
        resizeMode="cover" style={{flex:1, marginTop:50, justifyContent:'center', height:'100%', width:'100%'}}>
      <View style={{flex:0.1, justifyContent:'center', alignItems:'center'}}>
        <Text style={[globalStyles.appMainTitle, {color:'black'}]}>Dishes</Text>
      </View>

      <View style={{flex:1, alignItems:'center'}}>
        <ScrollView style={{flex: 9}}>
          {
            dishes.map((item) => {
              return (
                <TouchableOpacity key = {item.key} activeOpacity={0.6} onPress={() => 
                handleReview(item.instructions, item.title, item.dish_ingredient, ingredients)} > 
                <DishCard key={item.key} text={item.title}/>
                </TouchableOpacity>
              )
            })
          }
        </ScrollView>
        <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate("Inputs")}>
        <View style={{
            justifyContent: 'flex-end', marginBottom: 30,
          }}>
          <FlatButton text = {'Back'} bgColor={'black'} textColor={'white'}/>
        </View>
        </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaProvider>
  );
}

const DrawerNav = createDrawerNavigator();

export default function DishesApp() {
  const route = useRoute()
  const ingredients = route.params?.ingredients
  const matchAll = route.params?.matchAll

  return (
    <SafeAreaProvider style={[globalStyles.container]}>
      <DrawerNav.Navigator
      screenOptions={{
      drawerType: 'front',
      drawerStyle: {
        backgroundColor: 'white'
      },
      }}
      useLegacyImplementation
      drawerContent={(props) => <FilterDrawerScreen {...props} navigation={props.navigation} 
      matchAll={matchAll} ingredients={ingredients}/>}
      >
      <DrawerNav.Screen name="Dishes" initialParams={{ ingredients, 
      categories: ["Appetisers", "Mains", "Desserts"], complexity: 19, matchAll}} 
      component={DishesScreen} options={{
        headerTransparent: true,
        headerStyle : {height:0, backgroundColor:'red'},
        headerTitleStyle: {
          ...globalStyles.appMainTitle,
          color: 'black',
          marginBottom: 15,
        }
      }}/>
    </DrawerNav.Navigator>
    </SafeAreaProvider>
  );
}