import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, Alert, TouchableNativeFeedback, Button } from 'react-native';
import FullPageScreen from "./FullPageScreenType";


export default function WelcomeScreen({navigation, route}) {
  return (
      <FullPageScreen pageName={"Account settings"} navigation={navigation}>
          <TouchableNativeFeedback>
        <View style={{width:200, height:300, backgroundColor:"blue"}}>
          {/* <Button color={"#ff7700"} title="Click me" onPress={()=>{Alert.alert("Welcome", "Hi marc", [{text:"Yes"}, {text:"No"}])}}></Button> */}
        </View>
      </TouchableNativeFeedback>
      </FullPageScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
