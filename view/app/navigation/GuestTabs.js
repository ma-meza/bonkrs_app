import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {View, Image, Text, StyleSheet} from "react-native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs"
import globalStyle from "../../assets/style/globalStyle";

const Tab = createBottomTabNavigator();


import HomeScreen from "../screens/guestScreens/HomeScreen";
import AccountScreen from "../screens/guestScreens/AccountScreen";
import GroupsScreen from "../screens/guestScreens/GroupsScreen";
import SearchScreen from "../screens/SearchScreen";


export default Tabs = ()=>{
    return (
        <Tab.Navigator 
            tabBarOptions={{
                showLabel:false,
                style:{
                    position:"absolute",
                    bottom:0,
                    width:"100%",
                    height:65,
                    backgroundColor:"#fff",
                    borderTopLeftRadius:5,
                    borderTopRightRadius:5,
                    borderTopColor:"transparent",
                    alignItems:"center",
                    justifyContent:"center"
                }
            }}
            >
            <Tab.Screen name="Home" component={HomeScreen} options={{
                tabBarIcon:({focused})=>(
                    <View style={{alignItems:"center", justifyContent:"center"}}>
                        <Image source={{uri:"https://staticassets2020.s3.amazonaws.com/icons/homeBlack.png", width:25, height:25}} style={{tintColor:focused?"#00cc99":"#a1a1a1"}} resizeMode="contain"  />
                        <Text style={[{color:focused?"#00cc99":"#a1a1a1"}, focused?globalStyle.regularTextBold:globalStyle.regularText]}>Home</Text>
                    </View>
                )
            }}/>
            <Tab.Screen name="Search" component={SearchScreen} options={{
                tabBarIcon:({focused})=>(
                    <View style={{alignItems:"center", justifyContent:"center"}}>
                        <Image source={require("../../assets/icons/search.png")} style={[{tintColor:focused?"#00cc99":"#a1a1a1"}, styles.icons]} resizeMode="contain"  />
                        <Text style={[{color:focused?"#00cc99":"#a1a1a1"}, focused?globalStyle.regularTextBold:globalStyle.regularText]}>Search</Text>
                    </View>
                )
            }}/>
            <Tab.Screen name="Groups" component={GroupsScreen} options={{
                tabBarIcon:({focused})=>(
                    <View style={{alignItems:"center", justifyContent:"center"}}>
                        <Image source={require("../../assets/icons/people.png")} style={[{tintColor:focused?"#00cc99":"#a1a1a1"}, styles.icons]} resizeMode="contain"  />
                        <Text style={[{color:focused?"#00cc99":"#a1a1a1"}, focused?globalStyle.regularTextBold:globalStyle.regularText]}>Groups</Text>
                    </View>
                )
            }}/>
            <Tab.Screen name="Account" component={AccountScreen} options={{
                tabBarIcon:({focused})=>(
                    <View style={{alignItems:"center", justifyContent:"center"}}>
                        <Image source={{uri:"https://staticassets2020.s3.amazonaws.com/icons/personCircleBlack.png", width:25, height:25}} style={{tintColor:focused?"#00cc99":"#a1a1a1"}} resizeMode="contain"  />
                        <Text style={[{color:focused?"#00cc99":"#a1a1a1"}, focused?globalStyle.regularTextBold:globalStyle.regularText]}>Account</Text>
                    </View>
                )
            }} />
        </Tab.Navigator>
    );
}


const styles = StyleSheet.create({
    icons:{
        height:25,
        width:25
    }
});