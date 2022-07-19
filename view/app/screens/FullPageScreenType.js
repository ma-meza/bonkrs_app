import React from 'react';
import { StyleSheet, Text, View, Platform, StatusBar,SafeAreaView, Image, TouchableOpacity, Alert, TouchableNativeFeedback, Button, ScrollView } from 'react-native';
const globalStyle = require('../../assets/style/globalStyle');



export default function FullPageScreen({navigation, route, pageName, children}) {
  return (
    <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
        <View style={styles.topBar}>
            <TouchableNativeFeedback onPress={()=>{navigation.navigate('tabHome', {})}}>
                <Image style={styles.arrowImage} source={require("../../assets/icons/left-arrow.png")} />
            </TouchableNativeFeedback>
            <Text style={globalStyle.title1}>{pageName}</Text>
        </View>
        <View style={styles.contentContainer}>
            {children}
        </View>
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    scrollView:{
        width:"100%",
        height:"100%"
    },
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
