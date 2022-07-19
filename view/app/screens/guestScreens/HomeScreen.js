import React from 'react';
import globalStyle from "../../../assets/style/globalStyle"
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, Alert, TouchableNativeFeedback, Button, ScrollView } from 'react-native';
import SemiFullPageScreen from "../SemiFullPageScreenType";
import { StatusBar } from 'expo-status-bar';



export default function HomeScreen({navigation, route}) {

  let trendingCommunities = [
    {
      name:"Bitcoin (BTC)",
      numberMembers:2100
    },
    {
      name:"Cardano (ADA)",
      numberMembers:2100
    },
    {
      name:"GBP/USD",
      numberMembers:2100
    },
    {
      name:"XRP",
      numberMembers:2100
    },
    {
      name:"Blackberry (BB)",
      numberMembers:2100
    },
    {
      name:"Tesla (TSLA)",
      numberMembers:2100
    },
    {
      name:"CAD/JPY",
      numberMembers:2100
    },
    {
      name:"Dogecoin (DOGE)",
      numberMembers:2100
    }
  ];

  let cryptoCommunities = [
    {
      name:"Bitcoin (BTC)",
      numberMembers:2100
    },
    {
      name:"Cardano (ADA)",
      numberMembers:2100
    },
    {
      name:"XRP",
      numberMembers:2100
    },
    {
      name:"Dogecoin (DOGE)",
      numberMembers:2100
    },
    {
      name:"Safemoon (SAFE)",
      numberMembers:2100
    },
    {
      name:"Litecoin (LTC)",
      numberMembers:2100
    },
    {
      name:"Ethereum (ETH)",
      numberMembers:2100
    },
    {
      name:"Hedera hashgraph (HBAR)",
      numberMembers:2100
    }
  ];

  let trendingTraders = [
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

  let fxCommunities = [
    {
      name:"GBP/USD",
      numberMembers:2100
    },
    {
      name:"CAD/JPY",
      numberMembers:2100
    },
    {
      name:"NZD/USD",
      numberMembers:2100
    },
    {
      name:"CAD/JPY",
      numberMembers:2100
    },
    {
      name:"GBP/USD",
      numberMembers:2100
    },
    {
      name:"CAD/JPY",
      numberMembers:2100
    },
    {
      name:"GBP/USD",
      numberMembers:2100
    },
    {
      name:"CAD/JPY",
      numberMembers:2100
    }
  ];
  let stockMarketCommunities = [
    {
      name:"Blackberry (BB)",
      numberMembers:2100
    },
    {
      name:"Tesla (TSLA)",
      numberMembers:2100
    },
    {
      name:"Paypal (PPL)",
      numberMembers:2100
    },
    {
      name:"Airbnb (ABNB)",
      numberMembers:2100
    },
    {
      name:"AMC",
      numberMembers:2100
    },
    {
      name:"Gamestop (GME)",
      numberMembers:2100
    },
    {
      name:"Uber (UBER)",
      numberMembers:2100
    },
    {
      name:"Dropbox (DBOX)",
      numberMembers:2100
    }
  ];
  return (
        <SemiFullPageScreen noPadding={true}>
          <View style={{flex:1}} style={{backgroundColor:"#9FBFBB"}}>
            <Image source={require("../../../assets/illustrations/finance2.jpg")} style={{width:"100%", position:"absolute", bottom:0, left:0, height:200, resizeMode:"contain"}}/>
            <View style={styles.sectionView}>
              <Text style={[globalStyle.title1, {color:"black"}]}>👋 Hey you!</Text>
            </View>
            <View style={styles.sectionView}>
              <View style={{paddingTop:10, paddingBottom:150}}>
                {/* <Text style={[globalStyle.title1, {color:"black", lineHeight:35}]}>Join investing communities and get trading signals from top traders.</Text> */}
                <Text style={[globalStyle.title1, {color:"black", lineHeight:35}]}>Communities and signals for traders, by traders.</Text>
              </View>
            </View>
            <View style={{width:"100%", height:20, borderTopRightRadius:20, borderTopLeftRadius:20, backgroundColor:"white"}}></View>
          </View>
          <View style={styles.sectionView}>
            <Text style={[globalStyle.title2, {color:"black"}]}>Trending communities</Text>
          </View>
          <View style={styles.noPaddingSectionView}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <View style={{flex:1, flexDirection:"column", marginRight:10, paddingLeft:15}}>
                {
                trendingCommunities.slice(0,2).map((postInfo, key) => {
                  return (
                    <View key={key} style={styles.communityCardContainer}>
                      <View style={styles.communityInfoContainer}>
                        <Image style={styles.profilePicture} source="" />
                        <View>
                          <Text style={[globalStyle.regularTextBold, {marginBottom:5}]}>{postInfo.name}</Text>
                          <Text style={[globalStyle.regularText, styles.greyText]}>{postInfo.numberMembers} members</Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              }
              </View>
              <View style={{flex:1, flexDirection:"column", marginRight:10}}>
              {
                trendingCommunities.slice(2,4).map((postInfo, key) => {
                  return (
                    <View key={key} style={styles.communityCardContainer}>
                      <View style={styles.communityInfoContainer}>
                        <Image style={styles.profilePicture} source="" />
                        <View>
                          <Text style={[globalStyle.regularTextBold, {marginBottom:5}]}>{postInfo.name}</Text>
                          <Text style={[globalStyle.regularText, styles.greyText]}>{postInfo.numberMembers} members</Text>   
                        </View>
                      </View>
                    </View>
                  );
                })
              }
              </View>
              <View style={{flex:1, flexDirection:"column", marginRight:10}}>
              {
                trendingCommunities.slice(4,6).map((postInfo, key) => {
                  return (
                    <View key={key} style={styles.communityCardContainer}>
                      <View style={styles.communityInfoContainer}>
                        <Image style={styles.profilePicture} source="" />
                        <View>
                          <Text style={[globalStyle.regularTextBold, {marginBottom:5}]}>{postInfo.name}</Text>
                          <Text style={[globalStyle.regularText, styles.greyText]}>{postInfo.numberMembers} members</Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              }
              </View>
              <View style={{flex:1, flexDirection:"column", marginRight:10}}>
              {
                trendingCommunities.slice(6,8).map((postInfo, key) => {
                  return (
                    <View key={key} style={styles.communityCardContainer}>
                      <View style={styles.communityInfoContainer}>
                        <Image style={styles.profilePicture} source="" />
                        <View>
                          <Text style={[globalStyle.regularTextBold, {marginBottom:5}]}>{postInfo.name}</Text>
                          <Text style={[globalStyle.regularText, styles.greyText]}>{postInfo.numberMembers} members</Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              }
              </View>
            </ScrollView>
          </View>
          <View style={styles.sectionView}>
            <Text style={[globalStyle.title2, {color:"black"}]}>Most active communities</Text>
          </View>
          <View style={styles.noPaddingSectionView}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <View style={{flex:1, flexDirection:"column", marginRight:10, paddingLeft:15}}>
                {
                trendingCommunities.slice(0,2).map((postInfo, key) => {
                  return (
                    <View key={key} style={styles.communityCardContainer}>
                      <View style={styles.communityInfoContainer}>
                        <Image style={styles.profilePicture} source="" />
                        <View>
                          <Text style={[globalStyle.regularTextBold, {marginBottom:5}]}>{postInfo.name}</Text>
                          <Text style={[globalStyle.regularText, styles.greyText]}>{postInfo.numberMembers} members</Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              }
              </View>
              <View style={{flex:1, flexDirection:"column", marginRight:10}}>
              {
                trendingCommunities.slice(2,4).map((postInfo, key) => {
                  return (
                    <View key={key} style={styles.communityCardContainer}>
                      <View style={styles.communityInfoContainer}>
                        <Image style={styles.profilePicture} source="" />
                        <View>
                          <Text style={[globalStyle.regularTextBold, {marginBottom:5}]}>{postInfo.name}</Text>
                          <Text style={[globalStyle.regularText, styles.greyText]}>{postInfo.numberMembers} members</Text>   
                        </View>
                      </View>
                    </View>
                  );
                })
              }
              </View>
              <View style={{flex:1, flexDirection:"column", marginRight:10}}>
              {
                trendingCommunities.slice(4,6).map((postInfo, key) => {
                  return (
                    <View key={key} style={styles.communityCardContainer}>
                      <View style={styles.communityInfoContainer}>
                        <Image style={styles.profilePicture} source="" />
                        <View>
                          <Text style={[globalStyle.regularTextBold, {marginBottom:5}]}>{postInfo.name}</Text>
                          <Text style={[globalStyle.regularText, styles.greyText]}>{postInfo.numberMembers} members</Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              }
              </View>
              <View style={{flex:1, flexDirection:"column", marginRight:10}}>
              {
                trendingCommunities.slice(6,8).map((postInfo, key) => {
                  return (
                    <View key={key} style={styles.communityCardContainer}>
                      <View style={styles.communityInfoContainer}>
                        <Image style={styles.profilePicture} source="" />
                        <View>
                          <Text style={[globalStyle.regularTextBold, {marginBottom:5}]}>{postInfo.name}</Text>
                          <Text style={[globalStyle.regularText, styles.greyText]}>{postInfo.numberMembers} members</Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              }
              </View>
            </ScrollView>
          </View>
          <View style={styles.sectionView}>
            <Text style={[globalStyle.title2, {color:"black"}]}>Trending traders</Text>
          </View>
          <View style={styles.sectionViewTraders}>
          {
              trendingTraders.map((trader, key) => {
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
                        <Text style={[globalStyle.regularText, styles.marginBottomText]}>crypto/forex trader</Text>
                        <Text style={globalStyle.regularText}><Text style={globalStyle.regularTextBold}>$25</Text> membership</Text>
                    </View>
                    <TouchableNativeFeedback onPress={()=>{navigation.navigate("profileOverviewScreen")}}>
                      <View>
                          <Text style={[globalStyle.regularTextBold, styles.viewProfileButton]}>view profile</Text>
                      </View>
                    </TouchableNativeFeedback>
                  </View>
                );
              })
            }
          </View>
          <View style={styles.sectionView}>
            <Text style={[globalStyle.title2, {color:"black"}]}>FX communities</Text>
          </View>
          <View style={styles.noPaddingSectionView}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <View style={{flex:1, flexDirection:"column", marginRight:10, paddingLeft:15}}>
                {
                fxCommunities.slice(0,2).map((postInfo, key) => {
                  return (
                    <View key={key} style={styles.communityCardContainer}>
                      <View style={styles.communityInfoContainer}>
                        <Image style={styles.profilePicture} source="" />
                        <View>
                          <Text style={[globalStyle.regularTextBold, {marginBottom:5}]}>{postInfo.name}</Text>
                          <Text style={[globalStyle.regularText, styles.greyText]}>{postInfo.numberMembers} members</Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              }
              </View>
              <View style={{flex:1, flexDirection:"column", marginRight:10}}>
              {
                fxCommunities.slice(2,4).map((postInfo, key) => {
                  return (
                    <View key={key} style={styles.communityCardContainer}>
                      <View style={styles.communityInfoContainer}>
                        <Image style={styles.profilePicture} source="" />
                        <View>
                          <Text style={[globalStyle.regularTextBold, {marginBottom:5}]}>{postInfo.name}</Text>
                          <Text style={[globalStyle.regularText, styles.greyText]}>{postInfo.numberMembers} members</Text>   
                        </View>
                      </View>
                    </View>
                  );
                })
              }
              </View>
              <View style={{flex:1, flexDirection:"column", marginRight:10}}>
              {
                fxCommunities.slice(4,6).map((postInfo, key) => {
                  return (
                    <View key={key} style={styles.communityCardContainer}>
                      <View style={styles.communityInfoContainer}>
                        <Image style={styles.profilePicture} source="" />
                        <View>
                          <Text style={[globalStyle.regularTextBold, {marginBottom:5}]}>{postInfo.name}</Text>
                          <Text style={[globalStyle.regularText, styles.greyText]}>{postInfo.numberMembers} members</Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              }
              </View>
              <View style={{flex:1, flexDirection:"column", marginRight:10}}>
              {
                fxCommunities.slice(6,8).map((postInfo, key) => {
                  return (
                    <View key={key} style={styles.communityCardContainer}>
                      <View style={styles.communityInfoContainer}>
                        <Image style={styles.profilePicture} source="" />
                        <View>
                          <Text style={[globalStyle.regularTextBold, {marginBottom:5}]}>{postInfo.name}</Text>
                          <Text style={[globalStyle.regularText, styles.greyText]}>{postInfo.numberMembers} members</Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              }
              </View>
            </ScrollView>
          </View>
          <View style={styles.sectionView}>
            <Text style={[globalStyle.title2, {color:"black"}]}>Crypto communities</Text>
          </View>
          <View style={styles.noPaddingSectionView}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <View style={{flex:1, flexDirection:"column", marginRight:10, paddingLeft:15}}>
                {
                cryptoCommunities.slice(0,2).map((postInfo, key) => {
                  return (
                    <View key={key} style={styles.communityCardContainer}>
                      <View style={styles.communityInfoContainer}>
                        <Image style={styles.profilePicture} source="" />
                        <View>
                          <Text style={[globalStyle.regularTextBold, {marginBottom:5}]}>{postInfo.name}</Text>
                          <Text style={[globalStyle.regularText, styles.greyText]}>{postInfo.numberMembers} members</Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              }
              </View>
              <View style={{flex:1, flexDirection:"column", marginRight:10}}>
              {
                cryptoCommunities.slice(2,4).map((postInfo, key) => {
                  return (
                    <View key={key} style={styles.communityCardContainer}>
                      <View style={styles.communityInfoContainer}>
                        <Image style={styles.profilePicture} source="" />
                        <View>
                          <Text style={[globalStyle.regularTextBold, {marginBottom:5}]}>{postInfo.name}</Text>
                          <Text style={[globalStyle.regularText, styles.greyText]}>{postInfo.numberMembers} members</Text>   
                        </View>
                      </View>
                    </View>
                  );
                })
              }
              </View>
              <View style={{flex:1, flexDirection:"column", marginRight:10}}>
              {
                cryptoCommunities.slice(4,6).map((postInfo, key) => {
                  return (
                    <View key={key} style={styles.communityCardContainer}>
                      <View style={styles.communityInfoContainer}>
                        <Image style={styles.profilePicture} source="" />
                        <View>
                          <Text style={[globalStyle.regularTextBold, {marginBottom:5}]}>{postInfo.name}</Text>
                          <Text style={[globalStyle.regularText, styles.greyText]}>{postInfo.numberMembers} members</Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              }
              </View>
              <View style={{flex:1, flexDirection:"column", marginRight:10}}>
              {
                cryptoCommunities.slice(6,8).map((postInfo, key) => {
                  return (
                    <View key={key} style={styles.communityCardContainer}>
                      <View style={styles.communityInfoContainer}>
                        <Image style={styles.profilePicture} source="" />
                        <View>
                          <Text style={[globalStyle.regularTextBold, {marginBottom:5}]}>{postInfo.name}</Text>
                          <Text style={[globalStyle.regularText, styles.greyText]}>{postInfo.numberMembers} members</Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              }
              </View>
            </ScrollView>
          </View>
          <View style={styles.sectionView}>
            <Text style={[globalStyle.title2, {color:"black"}]}>Stock market communities</Text>
          </View>
          <View style={styles.noPaddingSectionView}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <View style={{flex:1, flexDirection:"column", marginRight:10, paddingLeft:15}}>
                {
                stockMarketCommunities.slice(0,2).map((postInfo, key) => {
                  return (
                    <View key={key} style={styles.communityCardContainer}>
                      <View style={styles.communityInfoContainer}>
                        <Image style={styles.profilePicture} source="" />
                        <View>
                          <Text style={[globalStyle.regularTextBold, {marginBottom:5}]}>{postInfo.name}</Text>
                          <Text style={[globalStyle.regularText, styles.greyText]}>{postInfo.numberMembers} members</Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              }
              </View>
              <View style={{flex:1, flexDirection:"column", marginRight:10}}>
              {
                stockMarketCommunities.slice(2,4).map((postInfo, key) => {
                  return (
                    <View key={key} style={styles.communityCardContainer}>
                      <View style={styles.communityInfoContainer}>
                        <Image style={styles.profilePicture} source="" />
                        <View>
                          <Text style={[globalStyle.regularTextBold, {marginBottom:5}]}>{postInfo.name}</Text>
                          <Text style={[globalStyle.regularText, styles.greyText]}>{postInfo.numberMembers} members</Text>   
                        </View>
                      </View>
                    </View>
                  );
                })
              }
              </View>
              <View style={{flex:1, flexDirection:"column", marginRight:10}}>
              {
                stockMarketCommunities.slice(4,6).map((postInfo, key) => {
                  return (
                    <View key={key} style={styles.communityCardContainer}>
                      <View style={styles.communityInfoContainer}>
                        <Image style={styles.profilePicture} source="" />
                        <View>
                          <Text style={[globalStyle.regularTextBold, {marginBottom:5}]}>{postInfo.name}</Text>
                          <Text style={[globalStyle.regularText, styles.greyText]}>{postInfo.numberMembers} members</Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              }
              </View>
              <View style={{flex:1, flexDirection:"column", marginRight:10}}>
              {
                stockMarketCommunities.slice(6,8).map((postInfo, key) => {
                  return (
                    <View key={key} style={styles.communityCardContainer}>
                      <View style={styles.communityInfoContainer}>
                        <Image style={styles.profilePicture} source="" />
                        <View>
                          <Text style={[globalStyle.regularTextBold, {marginBottom:5}]}>{postInfo.name}</Text>
                          <Text style={[globalStyle.regularText, styles.greyText]}>{postInfo.numberMembers} members</Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              }
              </View>
            </ScrollView>
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
    paddingBottom:15,
    paddingLeft:15,
    paddingRight:15,
    paddingTop:10,
  },
  noPaddingSectionView:{
    width:"100%",
    paddingBottom:20,
    paddingTop:10,
  },
  postCardTradersContainer:{
    borderWidth:1,
    borderColor:"#000",
    padding:10,
    borderRadius:10,
    width:"49%",
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
marginBottomText:{
  marginBottom:10
},
viewProfileButton:{
  padding:10,
  borderWidth:1,
  borderColor:"black",
  borderRadius:100,
  textAlign:"center"
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


  communityCardContainer:{
    borderWidth:1,
    borderColor:"#000",
    paddingTop:15,
    paddingBottom:15,
    paddingRight:20,
    paddingLeft:20,
    borderRadius:10,
    flexDirection:"column",
    alignItems:"flex-start",
    justifyContent:"center",
    marginBottom:10
  },
  communityInfoContainer:{
    flex:1,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"flex-start"
  },
  container: {
    flex: 1,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
