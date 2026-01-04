import {Linking, ImageBackground, Text, View, StyleSheet, ScrollView, Alert, Image, TouchableOpacity, Share } from "react-native";
import { Avatar } from '@kolking/react-native-avatar';
import { Dimensions } from 'react-native';
import Axios from '../../src/service/api.js';
import { useEffect, useState, useContext } from "react";
import { Poppins_400Regular, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Comment from './comment.jsx';
import { useIsFocused } from '@react-navigation/native';
import { AuthContext } from '../../src/context/authContext.js';
import { Button } from "react-native-paper";


const { width } = Dimensions.get('window');






export default function PostPage({ route, navigation }){

    const { postId } = route.params;

    if (!postId){
        return;
    }


    const { user, setUser } = useContext(AuthContext);

    const [postOwner, setPostOwner] = useState(null)
    const [postAddress, setPostAddress] = useState(null)
    const [comments, setComments] = useState([]);
    const [post, setPost] = useState(null);
    const [postCategories, setPostCategories] = useState([]);

    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_700Bold,
    })

    const isFocused = useIsFocused();
    

    /*const post =     
        {
      "id": 1,
      "title": "Don de riz",
      "address_id": 25,
      "client_id": 11,
      "photo": "http://192.168.0.11:3002/images/5bda557e-0cf1-447d-9b56-f29a95024082.jpeg",
      "post_date": "2025-12-24T23:00:00.000Z",
      "places_restantes": "3",
      "categories": "Legume",
      "city": "Longueville",
      "description": "Riz cuisiné maison disponible ce soir",
      "username": "test",
      "post_status": "available",
      "street": "Avenue Louise",
      "street_number": 45,
      "postal_code": "1325"
    }*/





    const handleShare = async () => {
        if (!post?.id) return;

        try {
            await Share.share({
                message: `Regarde cette annonce : ${post.title}\nLien : ishare://post/${post.id}`,
            });
        } catch (error) {
            Alert.alert("Erreur", error.message);
        }
    };



    async function fetchComments() {
        try {
                const id = post.id;
                const res = await Axios.get(`/comments/post/${id}`);

                const commentsWithUsers = await Promise.all(
                res.data.rows.map(async (comment) => {
                    const user = await fetchUser(comment.id_customer);
                    return {
                    ...comment,
                    user,
                    };
                })
                );

                setComments(commentsWithUsers);
            } catch (err) {
                Alert.alert("Erreur", err.response?.data || "Erreur de recuperation de commentaires");
            }
        }


    async function handleBooking() {
        try {
            const res = await Axios.post("reservations", {
                postID: post.id
            })
            Alert.alert("Reservation cree avec succes");
            
        } catch (err) {
            Alert.alert("Erreur", err.response?.data || "Erreur de creation de reservation");
        }
    }


    async function fetchUser(id) {
        const res = await Axios.get(`/users/${id}`);
        return res.data.user;
    }



    async function fetchPostAddress(){
        try {
            const id = post.address_id;
            const res = await Axios.get(`/address/${id}`);
            setPostAddress(res.data.address);
        } catch (err){
            Alert.alert("Erreur", "Impossible de recuperer l'addresse de l'annonce. " + err.response.data);
        }
    }


    async function fetchPost(){
        try {
            const res = await Axios.get(`/posts/${postId}`);
            setPost(res.data);
        } catch (err){
            Alert.alert("Erreur", "Impossible de recuperer l'annonce. " + err.response.data);
        }
    }

    useEffect(() => {
        if (!isFocused) return;

        const loadPostData = async () => {
            try {
          
                const resPost = await Axios.get(`/posts/${postId}`);
                console.log(resPost);
                const postData = resPost.data;
                setPost(postData);
                setPostCategories(postData.data.categories);

             
                const owner = await fetchUser(postData.client_id);
                setPostOwner(owner);

                
                const resAddress = await Axios.get(`/address/${postData.address_id}`);
                setPostAddress(resAddress.data.address);

               
                const resComments = await Axios.get(`/comments/post/${postData.id}`);
                const commentsWithUsers = await Promise.all(
                    resComments.data.rows.map(async (comment) => {
                        const user = await fetchUser(comment.id_customer);
                        return { ...comment, user };
                    })
                );
                setComments(commentsWithUsers);

       
                
                

            } catch (err) {
                console.log(err); 
                Alert.alert("Erreur", err.response?.data || "Erreur de récupération des données");
            }
        };

        loadPostData();
    }, [isFocused, postId]);




    if (!postOwner || !postAddress || !fontsLoaded) {
        return <Text>Chargement...</Text>;
    }



    return (

        <ScrollView style={styles.container}>
            <ImageBackground source={{ uri: post.photo }} style={styles.image} resizeMode="cover" />

            <View style={styles.postHeader}>
                <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 10,
                    marginTop: 20,
                }}
                >
                <View
                    style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    flex: 1,
                    marginRight: 10,
                    flexWrap: 'wrap'
                    }}
                >
                    <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[styles.text, { fontWeight: 'bold', flexShrink: 1 }]}
                    >
                    {post.title}
                    </Text>

                    <Text>●</Text>

                    {postCategories.map((category) => (
                    <Text
                        key={category.id_category}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[styles.text, { flexShrink: 1 }]}
                    >
                        {category.name_category}
                    </Text>
                    ))}
                </View>


                <Button
                    mode="contained"
                    onPress={handleShare}
                    style={{ backgroundColor: 'black' }}
                    labelStyle={{ color: 'white', fontWeight: 'bold' }}
                >
                    Share
                </Button>
                </View>



                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 20, marginLeft: 10}}>
                        <Avatar
                        source={{ uri: postOwner.photo }}
                        size={40}
                        />
                        <Text style={[styles.text, {fontWeight: 'bold'}]}>{postOwner.username}</Text>
                    </View>
                    
                        <View style={{flexDirection:'row', gap: 10, marginLeft: 10}}>
                            
                                <TouchableOpacity
                                    onPress={() => {
                                        const destination = `${post.street} ${post.street_number}, ${postAddress.postal_code} ${postAddress.city}`;
                                        const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
                                        Linking.openURL(url).catch(err => Alert.alert("Erreur", "Impossible d'ouvrir Google Maps"));
                                    }}
                                    >
                                        <View style={{borderWidth: 1, borderColor: 'black', flexDirection: 'row', gap: 10, backgroundColor: 'pink', borderRadius: 10, padding: 10}}>
                                            <Image source={require("../../assets/images/map-pin.png")} />
                                            <Text style={[styles.text, {fontSize: 12}]}>
                                                {post.street}, n°{post.street_number}, {postAddress.postal_code}, {postAddress.city}
                                            </Text>
                                        </View>
                                </TouchableOpacity>


                    </View>
                </View>


                <View style={{height: width * 0.04, backgroundColor: '#FFB682'}}></View>

                <View style={{marginTop: 15, marginBottom: 15, marginLeft: 20, gap: 20}}>
                    <Text style={{fontWeight: 'bold', fontSize: 16}}>Description</Text>
                    <Text>{post.description}</Text>
                </View>
                
                <View style={{height: width * 0.04, backgroundColor: '#FFB682'}}></View>


                <View style={{gap: 20, marginLeft: 20, marginTop: 10}}>
                    <Text style={{fontWeight: 'bold', fontSize: 17}}>Comments</Text>

                    {comments.map(comment => (
                        <Comment
                            key={comment.id}
                            imgSource={comment.user.photo}
                            imgSize={40}
                            username={comment.user.username}
                            content={comment.content}
                            post={post}
                            onCommentCreated={fetchComments}
                        />
                    ))}

                </View>


                <View style={{marginLeft: 20, marginTop: 20}}>
                    <Comment
                        imgSource={user.photo}
                        imgSize={40}
                        content={'Add a comment...'}
                        isCurrentUser={true}
                        post={post}
                        onCommentCreated={fetchComments}
                    />
                </View>   


                    <View style={{ alignItems: 'center', marginTop: 30, marginBottom: 200 }}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleBooking}
                        >
                            <Text style={styles.textInput}>Book</Text>
                        </TouchableOpacity>
                    </View>

        </ScrollView>





    );
}

const styles = StyleSheet.create({

    container: {
        height: '100%',
        backgroundColor: '#FFCCBB'
    },

    text : {
        fontFamily: 'Poppins_400Regular',
    },

    image: {
        width: width,
        height: width * 0.95,
    },

    postHeader: {
        justifyContent: 'space-evenly',
        flexDirection: 'column',
        gap: 15,
        marginLeft: 10,
        marginBottom: 10
    },

    button: {
        backgroundColor: 'black',
        borderRadius: 20,      
        width: width * 0.3,
        paddingVertical: 10,
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 200
    },
    textInput: {
        color: 'white',
        fontWeight: 'bold',
    },


})