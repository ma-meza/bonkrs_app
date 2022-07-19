import React from 'react';
import { StyleSheet, StatusBar, Platform,Text, View, SafeAreaView, Image, TouchableOpacity, Alert, TouchableNativeFeedback, Button, ScrollView } from 'react-native';
import { AuthContext } from '../components/context';
const globalStyle = require('../../assets/style/globalStyle');



export default function AccountScreen({navigation, route}) {
  const {signOut} = React.useContext(AuthContext);
  return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>

        <View style={styles.topContainer}>
          <Image style={styles.profileImage} src="" />
          <Text style={globalStyle.regularText}>@marc31</Text>
        </View>
        <TouchableNativeFeedback>
          <View style={styles.rowsContainer}>
            <Image style={styles.iconImage} source={require("../../assets/icons/people.png")} />
            <Text style={globalStyle.regularText}>Your group</Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback onPress={()=>{navigation.navigate('settings')}}>
          <View style={styles.rowsContainer}>
            <Image style={styles.iconImage} source={require("../../assets/icons/settings.png")} />
            <Text style={globalStyle.regularText}>Account settings</Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback>
          <View style={styles.rowsContainer}>
          <Image style={styles.iconImage} source={require("../../assets/icons/credit-card.png")} /> 
            <Text style={globalStyle.regularText}>Payments and payouts</Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback>
          <View style={styles.rowsContainer}>
            <Image style={styles.iconImage} source={require("../../assets/icons/bell.png")} /> 
            <Text style={globalStyle.regularText}>Notifications</Text>
          </View>
        </TouchableNativeFeedback>
        
        <View style={styles.sectionDivisor}></View>

        <TouchableNativeFeedback>
          <View style={styles.rowsContainer}>
            <Image style={styles.iconImage} source={require("../../assets/icons/unverified.png")} />
            <Text style={globalStyle.regularText}>How WeTrade works</Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback >
          <View style={styles.rowsContainer}>
            <Image style={styles.iconImage} source={require("../../assets/icons/lightbulb.png")} />
            <Text style={globalStyle.regularText}>Get help</Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback >
          <View style={styles.rowsContainer}>
            <Image style={styles.iconImage} source={require("../../assets/icons/megaphone.png")} />
            <Text style={globalStyle.regularText}>Give feedback</Text>
          </View>
        </TouchableNativeFeedback>

        <View style={styles.sectionDivisor}></View>


        <TouchableNativeFeedback >
          <View style={styles.rowsContainer}>
          <Image style={styles.iconImage} source={require("../../assets/icons/law.png")} />
            <Text style={globalStyle.regularText}>Terms of service</Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback onPress={()=>{signOut();}}>
          <View style={styles.rowsContainer}>
          <Image style={styles.iconImage} source={require("../../assets/icons/sign-out.png")} />
            <Text style={globalStyle.regularText}>Log out</Text>
          </View>
        </TouchableNativeFeedback>
          <View style={styles.rowsContainer}>
            <Text style={globalStyle.regularText}>contact@wetrade.com</Text>
        </View>
        
        
        </ScrollView>
        
        
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionDivisor:{
    width:"100%",
    height:40
  }, 
  scrollView:{
    width:"100%",
    height:"100%"
  },
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight:0,
    paddingBottom:65,
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  topContainer:{
    width:"100%",
    borderWidth:2,
    borderLeftWidth:0,
    borderRightWidth:0,
    borderTopWidth:0,
    borderBottomColor:"#e1e1e1",
    borderBottomWidth:1,
    height:60,
    paddingLeft:10,
    justifyContent:"center",
    marginBottom:10,
    flexDirection:"row",
    justifyContent:"flex-start",
    alignItems:"center"
  },
  rowsContainer:{
    width:"100%",
    paddingLeft:10,
    justifyContent:"center",
    height:60,
    flexDirection:"row",
    justifyContent:"flex-start",
    alignItems:"center"
  },
  profileImage:{
    height:35,
    width:35,
    borderColor:"black",
    borderWidth:2,
    marginRight:10,
    borderRadius:100
  },
  iconImage:{
    height:25,
    width:25,
    marginRight:10
  }
});
