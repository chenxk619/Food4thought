import React, {useState} from 'react';
import { StyleSheet, SafeAreaView, Text, View, Button, TextInput, FlatList, Pressable} from 'react-native';


export default function App(){

  const [input, setInput] = useState('');

  const[chore, setChore] = useState([
    {name : 'Wash dishes', key: '1'},
  ])

  //To set inputs
  const inputHandler = (text) => {
    setInput(text);
  }

  //To add chores
  const addHandler = (input) => {
    setChore((prevList) => {
      return [{name: input, key: Math.random().toString()},
      ...prevList]
    })
  }

  //To remove chores
  const removeHandler = (key) => {
    setChore((prevList) => {
      return prevList.filter(item => item.key != key);
    })
  }
  
  return (
    <SafeAreaView style = {styles.container}>
      <View style = {styles.topArea}>
        <Text style = {styles.whiteBold}> My Todo </Text>
      </View>
      
      <View style = {styles.midArea}>
        <TextInput 
        style = {styles.textInput}
        onChangeText = {inputHandler}
        placeholder= 'Enter Todo'
        />

        <View style = {styles.button}>
          <Button color={'white'} title = 'Add Todo' onPress = {() => addHandler(input)}/>
        </View>

        <FlatList
        data = {chore}
        renderItem = {({item}) => 
        <Pressable onPress = {() => removeHandler(item.key)}>
          <Text style = {styles.list}> {item.name} </Text>
        </Pressable>
        }/>

      </View>

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container : {
    flex : 1,
  },

  topArea : {
    flex: 1,
    backgroundColor: 'coral',
    alignItems: 'center',
    justifyContent: 'center',
  },

  midArea : {
    flex : 8,
  },

  whiteBold : {
    fontWeight: 'bold',
    color : 'white',
    fontSize: 20,
  },

  button : {
    backgroundColor: 'coral',
    color: 'white',
    marginHorizontal: 80,
    marginVertical: 20,
  },

  list : {
    borderColor : 'black',
    borderRadius: 10,
    borderColor : '#777',
    borderWidth: 1,
    borderStyle: 'dashed',
    padding: 5,
    margin: 5,
    fontWeight: '500',
  },

  textInput : {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    marginVertical: 10,
    marginHorizontal: 100,
  },
})
