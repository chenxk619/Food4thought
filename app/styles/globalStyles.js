import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
    // ### Formatting ### //
    container: {
        flex: 1,
    },

    // --- Login --- //
    appHeader: {
        flex: 1,
        backgroundColor: '#333',
        alignItems: 'center',
        justifyContent: 'center',
    },

    appBody: {
        flex: 1,
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // ### Components ### //

    // --- Login --- //
    userInputs: {
        borderColor: '#fff',
        borderRadius: 15,
        borderWidth: 1,
        padding: 12, 
        margin: 10, 
        width: 280,
        backgroundColor: 'white',
        shadowColor:'#aaa',
        shadowRadius: 3,
        shadowOpacity: 0.5, 
        shadowOffset: {width: 0, height: 5},
    },

    button: {
        backgroundColor: 'black',
        color: 'white',
        borderRadius: 15,
        padding: 5,
        margin: 10, 
        width: 280,
    },

    logIn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // --- Input --- //
    ingredientsCard: {
        width: '85%',
        padding: 5,
        marginHorizontal: 30,
        marginVertical: 5,
    },

    dishesCard: {
        padding: 5,
        margin: 5,
    },

    // modal: {
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     backgroundColor: 'white',
    //     bor
    // },
    // ### Fonts ### //

    // --- Login --- //
    appMainTitle: {
        fontSize: 28,
        color: '#fff',
        fontFamily: 'Futura-Medium',
        fontWeight: 'bold',
    },

    appBodyFont: {
        fontSize: 18,
        color: '#111',
        fontFamily: 'Futura',
    }
}
)