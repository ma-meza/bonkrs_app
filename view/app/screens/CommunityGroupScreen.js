import React from 'react';
import { StyleSheet, Text, View, Platform, StatusBar,SafeAreaView, Image, TouchableOpacity, Alert, TouchableNativeFeedback, Button, ScrollView, FlatList, Animated, Dimensions } from 'react-native';

import GroupChatScreen from "./GroupChatScreen";

const globalStyle = require('../../assets/style/globalStyle');


let posts = [
    {
        id:1,
        traderName:"@marc31",
        text:"Hello mate??"
    },
    {
        id:2,
        traderName:"@marc31",
        text:"Hello mate??"
    },
    {
        id:3,
        traderName:"@marc31",
        text:"Hello mate??"
    },
    {
        id:4,
        traderName:"@marc31",
        text:"Hello mate??"
    },
    {
        id:5,
        traderName:"@marc31",
        text:"Hello mate??"
    },
    {
        id:6,
        traderName:"@marc31",
        text:"Hello mate??"
    },
    {
        id:7,
        traderName:"@marc31",
        text:"Hello mate??"
    },
    {
        id:8,
        traderName:"@marc31",
        text:"Hello mate??"
    },
    {
        id:9,
        traderName:"@marc31",
        text:"Hello mate??"
    },
    {
        id:10,
        traderName:"@marc31",
        text:"Hello mate??"
    }
];

const PostCards = ({post}) => (
        <View style={styles.postCardContainer}>
            <View style={styles.traderInfoContainer}>
                <Image style={styles.profilePicture} source="" />
                <View>
                    <Text style={globalStyle.regularTextBold}>{post.traderName}</Text>
                </View>
            </View>
            <View>
                <Text style={globalStyle.regularText}>{post.text}</Text>
            </View>
        </View>
        );

export default function FullPageScreen({navigation, route, pageName, children}) {

    const renderItem = ({item}) =>{
        return <PostCards post = {item} />
    }
  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.topBar}>
            <TouchableNativeFeedback onPress={()=>{navigation.navigate('tabHome', {})}}>
                <Image style={styles.arrowImage} source={require("../../assets/icons/left-arrow.png")} />
            </TouchableNativeFeedback>
            <View>
                <Text style={[globalStyle.title2, {marginBottom:5}]}>Bitcoin (BTC)</Text>
                <Text style={[globalStyle.regularText, {color:"#a1a1a1"}]}>11 members</Text>
            </View>
        </View>
        <FlatList initialScrollIndex={posts.length - 1} contentContainerStyle={{paddingBottom:10}} data={posts} keyExtractor={item => item.id.toString()} renderItem={renderItem} style={styles.contentContainer} />
        <View style={styles.messageInputMainContainer}>

        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    messageInputMainContainer:{
        width:"100%",
        height:80,
        borderTopWidth:1,
        borderTopColor:"#a1a1a1"
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
    flexDirection:"row",
    borderBottomColor:"#a1a1a1",
    borderBottomWidth:1
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
      flex:1,
      paddingTop:10,
      paddingLeft:15,
      paddingRight:15
    },



  profilePicture:{
    width:40,
    height:40,
    borderColor:"black",
    borderWidth:1,
    borderRadius:100,
    marginRight:10
  },
  traderInfoContainer:{
    flex:1,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"flex-start",
    marginBottom:10
  },
  sectionView:{
    width:"100%",
    paddingBottom:20,
    paddingLeft:15,
    paddingRight:15,
    paddingTop:10,
  },
  postCardContainer:{
    borderWidth:1,
    borderColor:"#000",
    padding:15,
    borderRadius:10,
    flexDirection:"column",
    alignItems:"flex-start",
    justifyContent:"center",
    marginBottom:10
  },
});
