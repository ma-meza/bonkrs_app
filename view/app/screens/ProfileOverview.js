import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, Alert, TouchableNativeFeedback, Button } from 'react-native';
import FullPageScreen from "./FullPageScreenType";
import globalStyle from "../../assets/style/globalStyle";
import CustomButton from "../components/button";
import * as WebBrowser from 'expo-web-browser';



let userBio = "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of.";
export default function WelcomeScreen({navigation, route}) {
  return (
      <FullPageScreen pageName={""} navigation={navigation}>
          <View style={[styles.contentSection, {flexDirection:"row", alignItems:"center", justifyContent:"flex-start"}]}>
            <View style={styles.profilePictureContainer}></View>
            <View style={{flexDirection:"column"}}>
                <Text style={[globalStyle.title2]}>@marc31</Text>
                <Text style={[globalStyle.regularText, {marginBottom:10}]}>Member since March 2020</Text>
            </View>
          </View>
          <View style={[styles.contentSection, {marginBottom:100}]}>
            <Text style={[globalStyle.regularText, {marginBottom:10}]}><Text style={globalStyle.regularTextBold}>177k</Text> subscribers</Text>
            <Text style={[globalStyle.regularText, {marginBottom:20}]}>{userBio}</Text>
            <CustomButton title="Subscribe ($25/mo)" onPress={async ()=>{await WebBrowser.openBrowserAsync('https://google.com');}} style={{marginBottom:5}}/>
            <Text style={[globalStyle.regularText, {color:"#a1a1a1", textAlign:"center"}]}>You'll be able to review your purchase on the next screen.</Text>
          </View>
          <View style={[styles.contentSection, {flex:1, alignItems:"center", justifyContent:"center"}]}>
            <Image style={{width:100, height:100, marginBottom:20}} tintColor="#a1a1a1" source={require("../../assets/icons/lock-big.png")}/>
            <Text style={[globalStyle.regularText, {color:"#a1a1a1",  marginBottom:10}]}>29 signals • 37 posts • 182 chats</Text>
            <View style={{flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
                <View style={{backgroundColor:"green", paddingHorizontal:10, paddingVertical:5,borderRadius:10, marginRight:5}}>
                    <Text style={[globalStyle.regularTextBold, {color:"white"}]}>0.9</Text>
                </View>
                <Text style={[globalStyle.regularTextBold]}>score</Text>
            </View>
          </View>     
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
  contentSection:{
    paddingLeft:15,
    paddingRight:15,
    marginBottom:15
  },
  profilePictureContainer:{
      height:70,
      width:70,
      borderColor:"black",
      borderWidth:1,
      marginRight:10,
      borderRadius:100
  }
});
