import {useRef} from 'react'
import { View, ScrollView, Alert, ImageBackground, Image} from 'react-native';
import { Text, Button, Checkbox, Card } from 'react-native-paper';
import FlatButton from '../custom/Button';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { globalStyles } from '../styles/globalStyles';
import { collection, getDocs, query, where, and, limit, orderBy, startAfter, documentId} from 'firebase/firestore';
import { auth, firestoredb } from '../firebaseconfig';
import { Drawer } from 'react-native-drawer-layout';
import { useState, useEffect } from 'react';
import Slider from '@react-native-community/slider';
import { useRoute } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { IconButton } from 'react-native-paper'

//"Starters & nibbles", "Main course", "Cakes and baking", "Desserts", "Drinks and cocktails", 
//"Light meals & snacks", "Side dishes", "Other"
const FilterDrawerScreen = (props) => {
  const [starters, setStarters] = useState(false)
  const [mains, setMains] = useState(true)
  const [sides, setSides] = useState(false)
  const [cakes, setCakes] = useState(false)
  const [lights, setLights] =useState(false)
  const [desserts, setDesserts] = useState(false)
  const [drinks, setDrinks] = useState(false)
  const [others, setOthers] = useState(false)

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
    if (starters) {
      updatedCategories.push("Starters & nibbles");
    }
    if (mains) {
      updatedCategories.push("Main course");
    }
    if (sides) {
      updatedCategories.push("Side dishes");
    }
    if (cakes) {
      updatedCategories.push("Cakes and baking");
    }
    if (lights) {
      updatedCategories.push("Light meals & snacks");
    }
    if (desserts) {
      updatedCategories.push("Desserts");
    }
    if (drinks) {
      updatedCategories.push("Drinks and cocktails");
    }
    if (others) {
      updatedCategories.push("Other");
    }

    navigation.navigate('Dishes', { ingredients: props.ingredients, categories: updatedCategories, complexity: complexity, 
      matchAll: selectAll, image: props.image});
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

          <View style={{flexDirection:'row', justifyContent:'space-between', marginRight:50}}>
          <CategoryFilter
          title={`Appetisers`}
          checked={starters}
          onPress={() => setStarters(!starters)}
          />

          <CategoryFilter
          title={`Mains`}
          checked={mains}
          onPress={() => setMains(!mains)}
          />
          </View>

          <View style={{flexDirection:'row', justifyContent:'space-between', marginLeft:33, marginRight:50}}>
          <CategoryFilter
          title={`Sides`}
          checked={sides}
          onPress={() => setSides(!sides)}
          />

          <CategoryFilter
          title={`Cakes`}
          checked={cakes}
          onPress={() => setCakes(!cakes)}
          />
          </View>

          <View style={{flexDirection:'row', justifyContent:'space-between', marginLeft:22, marginRight:50}}>
          <CategoryFilter
          title={`Snacks`}
          checked={lights}
          onPress={() => setLights(!lights)}
          />

          <CategoryFilter
          title={`Desserts`}
          checked={desserts}
          onPress={() => setDesserts(!desserts)}
          />
          </View>

          <View style={{flexDirection:'row', justifyContent:'space-between', marginLeft:27, marginRight:50}}>
          <CategoryFilter
          title={`Drinks`}
          checked={drinks}
          onPress={() => setDrinks(!drinks)}
          />

          <CategoryFilter
          title={`Others`}
          checked={others}
          onPress={() => setOthers(!others)}
          />
          </View>

          <Text style={[globalStyles.appBodyFont, {padding: 10, paddingTop: 20}]}>Complexity</Text>
          <ComplexityFilter/>
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
    <Card style={[globalStyles.dishesCard, {borderRadius:20, height:290, width: 330, padding:0, marginHorizontal: 30,}]}>
        <Image style = {{justifyContent:'center', alignSelf:'center', borderTopRightRadius:20, borderTopLeftRadius:20, 
        width:330, height:240}} source = {props.image == '' ? require('../assets/food4thought_logo.png') : {uri: props.image}}/>
        <Card.Title
          titleStyle = {{fontFamily:'Futura', fontSize: 16, textAlign:'center'}}
          title={props.text}
        />

      </Card>
  )
}

const DishesScreen = ({ route, navigation }) => {
  const navRoute = useRoute();
  const dishesRef = collection(firestoredb, 'Recipe3')
  const [dishes, setDishes] = useState([]);
  const { categories } = route.params;
  const { complexity } = route.params;
  const ingredients = navRoute.params.ingredients
  const matchAll = navRoute.params.matchAll
  let dishesRendered = navRoute.params.dishesRendered
  if (!dishesRendered){
    dishesRendered = 10
  }
  const [render, setRender] = useState(dishesRendered)
  const [firstItem, setFirstItem] = useState('0')
  const [bottom, setBottom] = useState(true)
  let [bottomed, setBottomed] = useState(false)
  const scrollRef = useRef();
  

  //convert ingredients to lower case
  const lower = ingredients.map(element => {
    return element.toLowerCase();
  });

  //To handle each dishes' page (review page)
  const handleReview = (instructions, title, dish_ingredient, ingredient_str, original_ingredient, image, category, prep_time,
    cook_time, serves) => { navigation.navigate('Reviews', {instructions: instructions, title: title, ingredients: dish_ingredient, 
      ingredient_str: ingredient_str, original_ingredient, image: image, fromSaved: false, prep_time: prep_time, 
      cook_time: cook_time, serves: serves, category: category});
  }

  //Detect when the user is close to bottom and 
  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 5;
    setBottomed(true)
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  useEffect(() => {
    if (categories === undefined || categories.length === 0) {
      setDishes([]);
      Alert.alert("No dishes found!")
      return;
    }

  //For match any ingredients 
  if (!matchAll){

  let q;

  //If scrolled to bottom
  if (bottomed){
  q = query(dishesRef, and(where("category", "in", categories), (where( "array", "array-contains-any", lower))), 
  orderBy(documentId()), startAfter(firstItem), limit(render));
  setBottomed(false)
  }
  
  //If app didnt hit bottom nor hit a refresh
  else{
    q = query(dishesRef, and(where("category", "in", categories), (where( "array", "array-contains-any", lower))), 
    orderBy(documentId()), startAfter('0'), limit(render));
  }

    getDocs(q)
      .then((querySnapshot) => {
        const updatedDishes = []; // Create a new array to store the updated dishes

        querySnapshot.forEach((doc) => {
          setFirstItem(doc.id)
          const instance = {
            key: doc.id, // Add a unique identifier to each dish object
            title: doc.data().title,
            category: doc.data().category,
            dish_complexity: doc.data().array.length,
            instructions: doc.data().directions,
            dish_ingredient: doc.data().array,
            ingredient_str: doc.data().ingredients,
            image : doc.data().image,
            prep_time : doc.data().prepTime,
            cook_time : doc.data().cookingTime,
            serves : doc.data().serves,
          }

          if (instance.dish_complexity < complexity + 1){
          updatedDishes.push(instance);
          }
        })

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
  let q;

  for (let i = 0; i < lower.length; i++){

    //If scrolled to bottom
    if (bottomed){
      q = query(dishesRef, and(where("category", "in", categories), (where( "array", "array-contains", lower[i]))), 
      orderBy(documentId()), startAfter(firstItem), limit(render));
      setBottomed(false)
      }
    
    //If app didnt hit bottom nor hit a refresh
    else{
      q = query(dishesRef, and(where("category", "in", categories), (where( "array", "array-contains", lower[i]))), 
      orderBy(documentId()), startAfter('0'), limit(render));
    }

    // const q = query(dishesRef, and(where("category", "in", categories), (where("array", "array-contains" ,lower[i])) ), 
    // orderBy(documentId()), startAfter(firstItem), limit(10));
   
    getDocs(q)
      .then((querySnapshot) => {
        let updatedDishes = []; // Create a new array to store the updated dishes

        querySnapshot.forEach((doc) => {
          setFirstItem(doc.id)
          const instance = {
            key: doc.id, // Add a unique identifier to each dish object
            title: doc.data().title,
            category: doc.data().category,
            dish_complexity: doc.data().array.length,
            instructions: doc.data().directions,
            dish_ingredient: doc.data().array,
            ingredient_str: doc.data().ingredients,
            image : doc.data().image,
            prep_time : doc.data().prepTime,
            cook_time : doc.data().cookingTime,
            serves : doc.data().serves,
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
  }, [categories, bottom]);

  return (
    <SafeAreaProvider style={[globalStyles.appBody, {backgroundColor:'white'}]}>
      <ImageBackground source={require('../assets/bg1.jpg')}
        resizeMode="cover" style={{flex:1, height:'100%', width:'100%', alignItems:'center'}}>

      <View style={{marginTop:20, marginBottom:20, marginLeft:'60%', width: '90%', flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start'}}>
        <View style={{ marginTop:40, marginLeft:10}}>
          <Text style={[globalStyles.appMainTitle, {color:'black'}]}>Dishes</Text>
        </View>
        <View style={{flex:1}}>
        <IconButton icon='home' size = {35} style={{flex:1,marginTop:20, marginRight:20, alignSelf:'center'}} 
        onPress={() => navigation.navigate("Main")}/>
        </View>
      </View>

        <ScrollView ref={scrollRef} style={{flex: 9}}
        onMomentumScrollEnd={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
             setBottom(!bottom)
          }
        }}
        scrollEventThrottle={500}
        >
        
          {
            dishes.map((item) => {
              return (
                <TouchableOpacity key = {item.key} activeOpacity={0.6} onPress={() => 
                handleReview(item.instructions, item.title, item.dish_ingredient, item.ingredient_str, ingredients, item.image,
                item.category, item.prep_time, item.cook_time, item.serves)} > 
                <DishCard key={item.key} text={item.title} image={item.image}/>
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


      </ImageBackground>
    </SafeAreaProvider>
  );
}


const DrawerNav = createDrawerNavigator();

export default function DishesApp() {
  const route = useRoute()
  const ingredients = route.params?.ingredients
  const matchAll = route.params?.matchAll
  const dishesRendered = route.params?.dishesRendered

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
      matchAll={matchAll} ingredients={ingredients} style={{marginTop:30}} />}
      >

      <DrawerNav.Screen name="Dishes" initialParams={{ ingredients, 
      categories: ["Main course"], complexity: 19, matchAll, dishesRendered}} 
      component={DishesScreen} options={{
        headerTransparent: true,
        headerStyle : {height:0, backgroundColor:'white'},
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