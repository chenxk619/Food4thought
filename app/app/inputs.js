import { Alert, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, Text, 
  TouchableWithoutFeedback, View , TextInput, ScrollView} from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { auth } from "../firebaseconfig"
import { signOut } from 'firebase/auth';
import { FAB, Card, Button, IconButton} from 'react-native-paper';
import { useState } from 'react';

export default function Inputs({ navigation }) {
  const [inputs, setInputs] = useState();
  const [ingredients, setIngredients] = useState([]);

  function Ingredient(props) {
    return (
      <Card style={[globalStyles.ingredientsCard]}>
          <Card.Title
            title={props.text}
            right={() => (
              <IconButton
                icon={'delete'}
                onPress={() => removeIngredient(props.value)}
              />
            )}
          />
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
      else {
        setIngredients([...ingredients, inputs]);
        setInputs("");
      }
  }
  const removeIngredient = (index) => {
    let ingredientsCopy = [...ingredients];
    ingredientsCopy.splice(index, 1);
    setIngredients(ingredientsCopy);
  }
  const handleSignOut = () => {
    Keyboard.dismiss();
    signOut(auth).then(() => {
      navigation.navigate("Login");
    })
    .catch(error => Alert.alert(error.message))
  }

  const navDishes = () => {
    if (ingredients.length > 0)
    {
      navigation.navigate('DishesApp', {ingredients: ingredients});
    }
    else{
      Alert.alert("Minimum of 1 ingredient");
    }
  }

  return (
    <SafeAreaView style={[globalStyles.container, {backgroundColor: '#fff'}]} >
      <View style = {{flex: 1}}>
        
        <View style ={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Button style={{marginLeft:15, marginTop:10}} icon='arrow-left' mode='elevated' 
          buttonColor='#fff' textColor='black' onPress={handleSignOut} compact={true} >
            Logout
          </Button>
          <Button style={{marginRight:15, marginTop:10}} icon='arrow-right' mode='elevated' 
          buttonColor='#111' textColor='white' onPress={navDishes} compact={true} >
            Dishes
          </Button>
        </View>

        <Text style={[globalStyles.appMainTitle,{
          alignSelf: 'center',
          fontSize: 30, 
          color: 'black',
          paddingBottom: 10,
          marginVertical: 10,
          }]}> 
          Ingredients 
        </Text>

        <View style={[globalStyles.appBody, {
            justifyContent: 'flex-end',
            backgroundColor: '#fff',
            marginVertical: 10,
            }]}>
          <View style={{flexDirection: 'row'}}>
              <TextInput style={{
                alignItems: 'center',
                width: '70%',
                borderColor: '#999',
                borderRadius: 15,
                borderWidth: 1,
                paddingHorizontal: 10,
                fontWeight: '600',
                }}
                mode='outlined'
                placeholder='Add Ingredients '
                value={inputs} 
                onChangeText={input => setInputs(input)}
              />
              <FAB
                style={{
                  margin: 4,
                  backgroundColor: '#888'
                }}
                color='white'
                icon='plus'
                onPress={()=> addIngredient()}
                />
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
              backgroundColor: '#fff', 
              justifyContent: 'center',
              }}>
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
    </SafeAreaView>
  );
}