import { StyleSheet, Text, View, Pressable} from 'react-native';

export default function FlatButton({text, onPress, bgColor, textColor}){

    return (
        <Pressable onPress = {onPress}>
            <View style = {[styles.button, {backgroundColor:bgColor}]}>
                <Text style = {[styles.buttonText, {color:textColor}]}> {text} </Text>
            </View>
        </Pressable>

    )

}

const styles = StyleSheet.create({
    button:{
        borderRadius: 15,
        padding: 12, 
        margin: 10, 
        width: 280,
        backgroundColor: '#333',
    },

    buttonText:{
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
        textAlign: 'center',
    },
})