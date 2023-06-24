import { View, ScrollView, Alert } from 'react-native';
import { Text, Button, Checkbox, Card } from 'react-native-paper';
import FlatButton from '../../custom/Button';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { globalStyles } from '../../styles/globalStyles';
import { collection, getDocs, query, where, and } from 'firebase/firestore';
import { firestoredb } from '../../firebaseconfig';
import { Drawer } from 'react-native-drawer-layout';
import { useState, useEffect } from 'react';
import Slider from '@react-native-community/slider';
import { useRoute } from '@react-navigation/native'

const FilterDrawerScreen = (props) => {
  const [dessertsIsChecked, setDessertsIsChecked] = useState(true);
  const [mainsIsChecked, setMainsIsChecked] = useState(true);
  const [appetisersIsChecked, setAppetisersIsChecked] = useState(true);
  const [open, setOpen] = useState(false);
  const [complexity, setComplexity] = useState(10);
  const [categories, setCategories] = useState([]);
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
    setCategories(updatedCategories)
    navigation.navigate('Dishes', { categories: categories, complexity: complexity });
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
    <Card style={[globalStyles.dishesCard, {}]}>
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
  const ingredients = navRoute.params.ingredients
  const lower = ingredients.map(element => {
    return element.toLowerCase();
  });

  useEffect(() => {
    if (categories === undefined || categories.length === 0) {
      setDishes([]);
      return;
    }

    const q = query(dishesRef, and(where("category", "in", categories), (where("ingredients", "array-contains-any", lower))));

    getDocs(q)
      .then((querySnapshot) => {
        const updatedDishes = []; // Create a new array to store the updated dishes
  
        querySnapshot.forEach((doc) => {
          updatedDishes.push({
            id: doc.id, // Add a unique identifier to each dish object
            title: doc.data().title,
          });
        });
        setDishes(updatedDishes); // Update the dishes state with the new array
      })
      .catch((error) => {
        Alert.alert.error("Error getting documents: ", error);
      });
  }, [categories]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ScrollView style={{flex: 1}}>
        {
            dishes.map((item) => {
              return (
                <DishCard key={item.key} text={item.title}/>
              )
            })
          }
          </ScrollView>
      <View style={{
          justifyContent: 'flex-end'
        }}>
        <FlatButton text = {'Reviews'} invert = {'n'} 
          onPress={() => navigation.navigate("Review")}
          />
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

  return (
    <SafeAreaProvider style={[globalStyles.container]}>
      <DrawerNav.Navigator
    screenOptions={{
      drawerType: 'front',
    }}
      useLegacyImplementation
      drawerContent={(props) => <FilterDrawerScreen {...props} navigation={props.navigation}/>}
    >
      <DrawerNav.Screen name="Dishes" initialParams={{ ingredients, categories: ["Appetisers", "Mains", "Desserts"], complexity: 10 }} component={DishesScreen} options={{
        headerTitleStyle: {
          ...globalStyles.appMainTitle,
          color: 'black',
        }
      }}/>
    </DrawerNav.Navigator>
    </SafeAreaProvider>
  );
}