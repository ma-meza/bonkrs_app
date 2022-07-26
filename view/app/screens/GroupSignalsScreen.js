import React, {useEffect, useState, useRef} from 'react';
import {Text, View, FlatList, StyleSheet, Image} from "react-native"
import globalStyle from "../../assets/style/globalStyle";
import axios from "axios";




const PostCards = ({postInfo}) => (
        <View style={styles.postCardContainer}>
            <View>
                <View style={{alignSelf:"flex-start", marginBottom:5,backgroundColor:postInfo.signaltype==0?"green":"red", paddingVertical:5, paddingHorizontal:10, borderRadius:5}}>
                    <Text style={[globalStyle.regularText, {color:"white", alignSelf:"flex-start"}]}>{postInfo.signaltype==0?"long":"short"}</Text>
                </View>
                <Text style={globalStyle.regularText}><Text style={globalStyle.regularTextBold}>Currency:</Text> {postInfo.customcurrency && postInfo.customcurrency.length>0? postInfo.customcurrency.length: postInfo.currencyname}</Text>
                <Text style={globalStyle.regularText}><Text style={globalStyle.regularTextBold}>Entry:</Text> {postInfo.entry}</Text>
                <Text style={globalStyle.regularText}><Text style={globalStyle.regularTextBold}>Stop loss:</Text> {postInfo.sl}</Text>
                <Text style={globalStyle.regularText}><Text style={globalStyle.regularTextBold}>Take profit:</Text> {postInfo.tp}</Text>
            </View>
        </View>
    );



export default function ChatScreen(){

    const [signalPosts, setSignalPosts] = useState([]);
    const [isFirstDataRender, setIsFirstDataRender] = useState(true);
    let flatList = React.createRef();

    useEffect(()=>{
        axios.get(window.api_prefix+"/groupSignals").then(resp=>{
            setSignalPosts([...resp.data]);
        }).catch();
    }, []);
    const renderItem = ({item}) =>{
        return <PostCards postInfo = {item} />
    }
    
    return (
        <View style={styles.container}>
           <FlatList ref={flatList} inverted={true} onContentSizeChange={()=> {
                if(isFirstDataRender){
                    flatList.current.scrollToEnd(); 
                setIsFirstDataRender(false)
            }
           }
        } 
        extraData={signalPosts} contentContainerStyle={{paddingBottom:10}} data={signalPosts} keyExtractor={item => item.id.toString()} renderItem={renderItem} style={styles.contentContainer} />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start'
      },
  contentContainer:{
      top:0,
      width:"100%",
      left:0,
      backgroundColor:"rgba(0,0,0,0.01)",
      alignSelf:"stretch",
      flex:1,
      paddingTop:0,
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
    borderColor:"rgba(0,0,0,0.1)",
    padding:15,
    borderRadius:10,
    flexDirection:"column",
    alignItems:"flex-start",
    justifyContent:"center",
    marginBottom:10,
    backgroundColor:"white"
  },
});
