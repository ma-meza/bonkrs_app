import { StatusBar } from 'expo-status-bar';
import React from 'react';
import globalStyle from "../../assets/style/globalStyle"
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, Alert, TouchableNativeFeedback, Button } from 'react-native';
import SemiFullPageScreen from "./SemiFullPageScreenType";

let traderPostTypes = ["post", "signal"];


export default function HomeScreen({navigation, route}) {
  let communityPost = [
    {
      traderName:"@marc31",
      communityName:"Bitcoin (BTC)",
      text:"Hello mate??"
    }
  ];

  let traderPost = [
    {
      traderName:"@marc31",
      text:"Hello mate??",
      type:0
    },
    {
      traderName:"@marc31",
      text:"Hello mate??",
      type:1
    },
    {
      traderName:"@marc31",
      text:"Hello mate??",
      type:1
    },
    {
      traderName:"@marc31",
      text:"Hello mate??",
      type:1
    }
  ];
  return (
        <SemiFullPageScreen>
          <View style={styles.sectionView}>
            <Text style={[globalStyle.title1, {color:"black"}]}>👋 Hey @marc31!</Text>
          </View>
          <View style={styles.sectionView}>
            <Text>Subscribe to traders.</Text>
          </View>
          <View style={styles.sectionView}>
            <Text style={[globalStyle.title2, {color:"black"}]}>Recent posts</Text>
          </View>
          <View style={styles.sectionView}>
            {
              traderPost.map((postInfo, key) => {
                return (
                  <View key={key} style={styles.postCardContainer}>
                    <View style={styles.traderInfoContainer}>
                      <Image style={styles.profilePicture} source="" />
                      <View>
                        <Text style={globalStyle.regularTextBold}>{postInfo.traderName}</Text>
                        <Text style={[globalStyle.regularText, styles.greyText]}>{traderPostTypes[postInfo.type]}</Text>
                      </View>
                    </View>
                    <View>
                      <Text style={globalStyle.regularText}>{postInfo.text}</Text>
                    </View>
                  </View>
                );
              })
            }
            {
              communityPost.map((postInfo, key) => {
                return (
                  <View key={key} style={styles.postCardContainer}>
                    <View style={styles.traderInfoContainer}>
                      <Image style={styles.profilePicture} source="" />
                      <View>
                        <Text style={globalStyle.regularTextBold}>{postInfo.traderName} • {postInfo.communityName}</Text>
                      </View>
                    </View>
                    <View>
                      <Text style={globalStyle.regularText}>{postInfo.text}</Text>
                    </View>
                  </View>
                );
              })
            }
          </View>
        </SemiFullPageScreen>
  );
}

const styles = StyleSheet.create({
  greyText:{
    color:"#a1a1a1"
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
  container: {
    flex: 1,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
