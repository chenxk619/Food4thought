import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./screens/login";
import Inputs from "./screens/auth/inputs";
import Dishes from "./screens/auth/dishes";
import Review from "./screens/auth/review";
import Password from "./screens/password";
import SignUp from "./screens/signUp";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Inputs" component={Inputs} />
        <Stack.Screen name="Dishes" component={Dishes} />
        <Stack.Screen name="Review" component={Review} />
        <Stack.Screen name="Password" component={Password} />
        <Stack.Screen name="SignUp" component={SignUp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}