import { Alert, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, Text, 
  TouchableWithoutFeedback, View , TextInput, ScrollView, Modal} from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { auth } from "../firebaseconfig"
import { signOut } from 'firebase/auth';
import { FAB, Card, Button, IconButton} from 'react-native-paper';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Inputs({ navigation }) {
  const [inputs, setInputs] = useState();
  const [ingredients, setIngredients] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

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
    navigation.navigate('DishesApp', {ingredients: ingredients, matchAll: matchAll});
  }

  return (
    <SafeAreaView style={[globalStyles.container, {backgroundColor: '#fff'}]} >
      <View style = {{flex: 1}}>
  
        <View style ={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Button style={{marginLeft:15, marginTop:10}} icon='arrow-left' mode='elevated' contentStyle= {{paddingHorizontal: 5}}
          buttonColor='#fff' textColor='black' onPress={handleSignOut} compact={true} >
            Logout
          </Button>
          <Button style={{marginRight:15, marginTop:10}} icon='arrow-right' mode='elevated' contentStyle= {{paddingHorizontal: 5, 
          flexDirection: 'row-reverse'}} buttonColor='#111' textColor='white' onPress={setModal} compact={true} >
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
    </SafeAreaView>
  );
}