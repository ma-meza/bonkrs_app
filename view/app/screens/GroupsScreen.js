import { StatusBar } from 'expo-status-bar';
import React from 'react';
import globalStyle from "../../assets/style/globalStyle"
import { StyleSheet, Text, View, TextInput,SafeAreaView, Image, TouchableOpacity, Alert, TouchableNativeFeedback, Button, TouchableWithoutFeedback } from 'react-native';
import SemiFullPageScreen from "./SemiFullPageScreenType";
import { useState } from 'react/cjs/react.development';


export default function HomeScreen({navigation, route}) {

    const [search, setSearch] = useState("");

  let subscriptions = [
    {
      name:"@paulGraham",
      numberMembers:21,
      numberPosts:16
    },
    {
        name:"@mikeWazouski",
        numberMembers:21,
      numberPosts:16
      },
      {
        name:"@johnDoe",
        numberMembers:21,
      numberPosts:16
      },
      {
        name:"@mark31",
        numberMembers:21,
      numberPosts:16
      },
      {
        name:"@johnCena",
        numberMembers:21,
      numberPosts:16
      }
  ]

  let communities = [
      {
          name:"Ripple (XRP)",
          numberMembers:21,
      numberPosts:16
      },
      {
        name:"EUR/USD",
        numberMembers:21,
        numberPosts:16
    },
    {
        name:"Blackberry (BB)",
        numberMembers:21,
      numberPosts:16
    },
    {
        name:"Tesla (TSLA)",
        numberMembers:21,
      numberPosts:16
    },
    {
        name:"GPB/USD",
        numberMembers:21,
      numberPosts:16
    },
    {
        name:"Bitcoin (BTC)",
        numberMembers:21,
      numberPosts:16
    }
  ];
  return (
        <SemiFullPageScreen>
          <View style={styles.sectionView}>
            <Text style={globalStyle.title1}>Groups</Text>
          </View>
          <View style={styles.sectionView}>
            <Text style={globalStyle.title2}>Your group</Text>
          </View>
          <View style={styles.sectionView}>
            <TouchableNativeFeedback onPress={()=>{navigation.navigate('community_screen')}}>
              <View style={styles.postCardContainer}>
                <View style={styles.profilePhotoContainer}>
                    <Image source="" style={styles.profilePhoto}/>
                </View>
                <View style={styles.textContainer}>
                  <Text style={[globalStyle.regularTextBold, styles.TextWithBottomMargin]}>@markTrader</Text>
                  <Text style={[globalStyle.regularText, {color:"#a1a1a1"}]}>259 members  •  71 posts</Text>
                </View>
                <View style={styles.chevronImageContainer}>
                  <Image source={require("../../assets/icons/chevron-right.png")} style={styles.chevronImage}/>
                </View>
              </View>
            </TouchableNativeFeedback>
          </View>
          <View style={styles.sectionView}>
            <Text style={globalStyle.title2}>Subscriptions</Text>
          </View>
          <View style={styles.sectionView}>
            {
              subscriptions.map((subscription, key) => {
                return (
                  <TouchableNativeFeedback key={key} onPress={()=>{navigation.navigate('group_screen')}}>
                    <View key={key} style={styles.postCardContainer}>
                    <View style={styles.profilePhotoContainer}>
                      <Image source="" style={styles.profilePhoto}/>
                    </View>
                    <View style={styles.textContainer}>
                      <Text style={[globalStyle.regularTextBold, styles.TextWithBottomMargin]}>{subscription.name}</Text>
                      <Text style={[globalStyle.regularText, {color:"#a1a1a1"}]}>{subscription.numberMembers} members • {subscription.numberPosts} posts</Text>
                    </View>
                    <View style={styles.chevronImageContainer}>
                      <Image source={require("../../assets/icons/chevron-right.png")} style={styles.chevronImage}/>
                    </View>
                  </View>
                  </TouchableNativeFeedback>
                );
              })
            }
          </View>
          <View style={styles.sectionView}>
            <Text style={globalStyle.title2}>Communities</Text>
          </View>
          <View style={styles.sectionView}>
            {
              communities.map((community, key) => {
                return (
                  <TouchableNativeFeedback key={key} onPress={()=>{navigation.navigate('community_screen')}}>
                    <View key={key} style={styles.postCardContainer}>
                    <View style={styles.profilePhotoContainer}>
                      <Image source="" style={styles.profilePhoto}/>
                    </View>
                    <View style={styles.textContainer}>
                      <Text style={[globalStyle.regularTextBold, styles.TextWithBottomMargin]}>{community.name}</Text>
                      <Text style={[globalStyle.regularText, {color:"#a1a1a1"}]} >{community.numberMembers} members • {community.numberPosts} posts</Text>
                    </View>
                    <View style={styles.chevronImageContainer}>
                      <Image source={require("../../assets/icons/chevron-right.png")} style={styles.chevronImage}/>
                    </View>
                  </View>
                  </TouchableNativeFeedback>
                );
              })
            }
          </View>
        </SemiFullPageScreen>
  );
}

const styles = StyleSheet.create({
  textContainer:{
    alignSelf:"stretch",
    flex:1
  },
  chevronImage:{
    width:20,
    height:40,
    alignSelf:"flex-end"
  },
  profilePhoto:{
    width:40,
    height:40,
    borderColor:"black",
    borderWidth:1,
    borderRadius:100
  },
  profilePhotoContainer:{
    marginRight:10
  },
  sectionView:{
    width:"100%",
    paddingBottom:10,
    paddingLeft:15,
    paddingRight:15,
    paddingTop:10,
  },
  searchBoxAround:{
    width:"100%",
    borderColor:"black",
    borderWidth:1,
    padding:10,
    borderRadius:50
  },
  TextWithBottomMargin:{
    marginBottom:5
  },
  postCardContainer:{
    borderWidth:1,
    borderColor:"#000",
    padding:15,
    borderRadius:10,
    marginBottom:10,
    flexDirection:"row",
    alignItems:"center"  
  },
  container: {
    flex: 1,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
