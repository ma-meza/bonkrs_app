import { StatusBar } from 'expo-status-bar';
import React from 'react';
import globalStyle from "../../assets/style/globalStyle"
import { StyleSheet, Text, View, TextInput,SafeAreaView, Image, TouchableOpacity, Alert, TouchableNativeFeedback, Button, TouchableWithoutFeedback } from 'react-native';
import SemiFullPageScreen from "./SemiFullPageScreenType";
import { useState } from 'react/cjs/react.development';


export default function HomeScreen({navigation, route}) {

    const [search, setSearch] = useState("");

    let traders = [
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
            <Text style={globalStyle.title1}>Search</Text>
          </View>
          <TouchableWithoutFeedback onPress={()=>{navigation.navigate('searchfullscreen')}}>
              <View style={styles.sectionView}>
                <View style={styles.searchBoxAround}>
                    <Image source={require("../../assets/icons/search.png")} style={styles.searchIcon}/>
                    <Text style={globalStyle.regularText}>Find traders and communities</Text>
                </View>
              </View>
          </TouchableWithoutFeedback>
          <View style={styles.sectionView}>
            <Text style={globalStyle.title2}>Trending traders</Text>
          </View>
          <View style={styles.sectionViewTraders}>
            {
              traders.map((trader, key) => {
                return (
                  <View key={key} style={[styles.postCardTradersContainer, {marginRight:key%2 == 0?"1%":0, marginLeft:key%2 == 0?0:"1%"}]}>
                    <View style={styles.traderProfilePictureContainer}>
                        <Image source="" style={styles.traderProfilePicture}/>
                    </View>
                    <View style={styles.traderTextContainer}>
                        <Text style={globalStyle.regularTextBold}>{trader.name}</Text>
                    </View>
                    <View style={[styles.traderTextContainer, {marginBottom:30}]}>
                        <Text style={[globalStyle.regularText, styles.marginBottomText]}><Text style={globalStyle.regularTextBold}>25</Text> members</Text>
                        <Text style={[globalStyle.regularText, styles.marginBottomText]}>Long-term crypto / short-term forex</Text>
                        <Text style={globalStyle.regularText}><Text style={globalStyle.regularTextBold}>$25</Text> membership</Text>
                    </View>
                    <View>
                        <Text style={[globalStyle.regularTextBold, styles.viewProfileButton]}>view profile</Text>
                    </View>
                  </View>
                );
              })
            }
          </View>
          <View style={styles.sectionView}>
            <Text style={globalStyle.title2}>Trending communities</Text>
          </View>
          <View style={styles.sectionView}>
            {
              communities.map((community, key) => {
                return (
                  <View key={key} style={styles.postCardCommunitiesContainer}>
                    <View style={styles.profilePhotoContainer}>
                      <Image source="" style={styles.profilePhoto}/>
                    </View>
                    <View>
                        <Text style={[globalStyle.regularTextBold, styles.textWithMarginBottom]}>{community.name}</Text>
                        <Text style={[globalStyle.regularText, {color:"#a1a1a1"}]}>{community.numberMembers} members • {community.numberPosts} posts</Text>
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
    viewProfileButton:{
        padding:10,
        borderWidth:1,
        borderColor:"black",
        borderRadius:100,
        textAlign:"center"
    },
    marginBottomText:{
        marginBottom:10
    },
    traderProfilePictureContainer:{
        width:"100%",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
        marginBottom:10
    },
    traderProfilePicture:{
        width:40,
        height:40,
        borderRadius:100,
        borderWidth:1,
        borderColor:"black"
    },
    traderTextContainer:{
        width:"100%",
        flexDirection:"column",
        justifyContent:"flex-start",
        alignItems:"center",
        marginBottom:10
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
  sectionViewTraders:{
    width:"100%",
    paddingBottom:10,
    paddingLeft:15,
    paddingRight:15,
    paddingTop:10,
    flexDirection:"row",
    flexWrap:"wrap"
  },
  searchBoxAround:{
    width:"100%",
    borderColor:"black",
    borderWidth:1,
    padding:10,
    borderRadius:50,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"flex-start"
  },
  searchIcon:{
    height:30,
    width:30,
    marginRight:10
  },
  postCardCommunitiesContainer:{
    borderWidth:1,
    borderColor:"#000",
    padding:15,
    borderRadius:10,
    marginBottom:10,
    flexDirection:"row"
  },
  postCardTradersContainer:{
    borderWidth:1,
    borderColor:"#000",
    padding:10,
    borderRadius:10,
    width:"49%",
    marginBottom:10
  },
  textWithMarginBottom:{
    marginBottom:5
  },
  container: {
    flex: 1,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
