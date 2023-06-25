import {SafeAreaView, Text, View} from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { useRoute } from '@react-navigation/native'
import { IconButton } from 'react-native-paper'

export default function Reviews({ navigation }) {
  const route = useRoute()
  const instructions = route.params?.instructions
  const title = route.params?.title

  return (
    <SafeAreaView style = {globalStyles.appBody}>
      <IconButton icon='arrow-left' size = {35} 
        style={{flex:1, alignSelf:'flex-start', marginLeft: 20}} onPress={()=> navigation.navigate("DishesApp")}/>
      <View style = {{flex : 9, paddingHorizontal:  15, marginHorizontal: 30, marginBottom: 150, justifyContent: 'flex-start'}}>
        <Text style={[globalStyles.appMainTitle,{textAlign: 'center', fontSize: 30, color: 'black', marginBottom: 20}]}> 
          {title} 
        </Text>
        <Text style = {[globalStyles.appBodyFont, {marginVertical: 40, fontSize: 17, textAlign: 'center'}]}> 
          {instructions}
        </Text>
        <View style = {{alignItems: 'center', marginBottom: 20}}>
        </View>
        </View>
    </SafeAreaView>
  );
}