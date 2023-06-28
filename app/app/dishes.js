import { View, ScrollView, Alert, Pressable } from 'react-native';
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

const FilterDrawerScreen = (props) => {
  const [dessertsIsChecked, setDessertsIsChecked] = useState(true);
  const [mainsIsChecked, setMainsIsChecked] = useState(true);
  const [appetisersIsChecked, setAppetisersIsChecked] = useState(true);
  const [open, setOpen] = useState(false);
  const [complexity, setComplexity] = useState(19);
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
    //setCategories(updatedCategories)
    navigation.navigate('Dishes', { categories: updatedCategories, complexity: complexity, matchAll: props.initialParams });
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
          <Button
            mode='contained'
            buttonColor='#33e'
            onPress={handleFilterSubmit}
            style={{
              alignSelf: 'flex-start',
              margin: 10
              }}>
            Filter
            </Button>
        </Drawer>
    </DrawerContentScrollView>
  );
}

const DishCard = (props) => {
  return (
    <Card style={[globalStyles.dishesCard]}>
        <Card.Title
          title={props.text}
        />
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

          if (instance.dish_complexity < complexity + 1){

            if (tempDishes.length > 0){
              tempDishes.forEach((dish) => {
                if (dish.title == instance.title){
                  updatedDishes.push(instance);
                }
              })
            }

            //first instance to update dishes
            if (tempDishes.length == 0 && i != lower.length - 1){
              updatedDishes.push(instance);
            }
          }
        });

        if (updatedDishes.length == 0 && i == lower.length - 1){
          Alert.alert("No dishes found!")
        }

        if (i == lower.length - 1){
        setDishes(updatedDishes);
        } // Update the dishes state with the new array
        tempDishes = updatedDishes;
        })
        .catch((error) => {
          Alert.alert.error("Error getting documents: ", error);
        });
      }
  }
  }, [categories]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ScrollView style={{flex: 1}}>
          {
            dishes.map((item) => {
              return (
                <Pressable key = {item.key} onPress={() => handleReview(item.instructions, item.title, item.dish_ingredient, ingredients)} 
                  style={({pressed}) => [{backgroundColor: pressed ? '#aaa' : '#eee',}, {borderRadius: 10}]}> 
                <DishCard key={item.key} text={item.title}/>
                </Pressable>
              )
            })
          }
        </ScrollView>
      <View style={{
          justifyContent: 'flex-end', marginBottom: 30
        }}>
        <FlatButton text = {'Back'} invert = {'n'} 
          onPress={() => navigation.navigate("Inputs")}
          />
      </View>
    </View>
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
      }}
      useLegacyImplementation
      drawerContent={(props) => <FilterDrawerScreen {...props} navigation={props.navigation} initialParams={matchAll}/>}
      >
      <DrawerNav.Screen name="Dishes" initialParams={{ ingredients, 
      categories: ["Appetisers", "Mains", "Desserts"], complexity: 19, matchAll}} 
      component={DishesScreen} options={{
        headerTitleStyle: {
          ...globalStyles.appMainTitle,
          color: 'black',
        }
      }}/>
    </DrawerNav.Navigator>
    </SafeAreaProvider>
  );
}