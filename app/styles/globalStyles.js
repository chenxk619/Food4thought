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

    appLogin: {
        flex: 8,
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    // --- Sign Up ---//
    appBody2: {
        flex: 1,
        backgroundColor: '#666',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    // ### Components ### //

    // --- Login --- //
    userInputs: {
        borderColor: '#777',
        borderRadius: 15,
        padding: 12, 
        margin: 10, 
        width: 280,
        backgroundColor: 'white',
        shadowRadius: 3,
        shadowOpacity: 0.3, 
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
    },

    shadow: {
        shadowRadius: 3,
        shadowOpacity: 0.6, 
        shadowOffset: {width: 0, height: 5},
    }
}
)