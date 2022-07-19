import React from 'react';
import { StyleSheet, Text, View, Platform, StatusBar,SafeAreaView, Image, TouchableOpacity, Alert, TouchableNativeFeedback, Button, ScrollView, FlatList, Animated, Dimensions } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import GroupChatScreen from "./GroupChatScreen";

const globalStyle = require('../../assets/style/globalStyle');

const {width, height} = Dimensions.get("screen");


const TabNav = createMaterialTopTabNavigator();


export default function FullPageScreen({navigation, route, pageName, children}) {
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
            <TouchableNativeFeedback onPress={()=>{navigation.navigate('tabHome', {})}}>
                <Image style={styles.arrowImage} source={require("../../assets/icons/left-arrow.png")} />
            </TouchableNativeFeedback>
            <View>
                <Text style={[globalStyle.title2, {marginBottom:5}]}>@mark31</Text>
                <Text style={[globalStyle.regularText, {color:"#a1a1a1"}]}>11 members</Text>
            </View>
        </View>
        <View style={styles.contentContainer}>
        <TabNav.Navigator upperCaseLabel={false} tabBarOptions={{
                labelStyle: [globalStyle.regularTextBold, { textTransform: 'none' }],
                tabStyle: { width: 85 },
                indicatorStyle:{backgroundColor:"black"},
                style: { backgroundColor: 'white', borderBottomWidth:1, borderBottomColor:"#a1a1a1", elevation:0 },
                activeTintColor:"black"
            }}>
                <TabNav.Screen name="Posts" component={GroupChatScreen}>

                </TabNav.Screen>
                <TabNav.Screen name="Signals" component={GroupChatScreen}>

                </TabNav.Screen>
                <TabNav.Screen name="Chat" component={GroupChatScreen}>

                </TabNav.Screen>
            </TabNav.Navigator>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight:0
  },
  topBar:{
    width:"100%",
    backgroundColor:"#fff",
    top:0,
    height:80,
    justifyContent:"flex-start",
    alignItems:"center",
    paddingLeft:15,
    flexDirection:"row"
  },
  arrowImage:{
      height:40,
      width:40,
      marginRight:10
  },
  contentContainer:{
      top:0,
      width:"100%",
      left:0,
      backgroundColor:"#fff",
      alignSelf:"stretch",
      flex:1
  }
});
