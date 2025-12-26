








import { ImageBackground, Text, View, StyleSheet, ScrollView, Alert, Image, TouchableOpacity } from "react-native";
import { Avatar } from '@kolking/react-native-avatar';
import { Dimensions } from 'react-native';
import Axios from '../../src/service/api.js';
import { useEffect, useState, useContext } from "react";
import { Poppins_400Regular, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Comment from './comment.jsx';
import { useIsFocused } from '@react-navigation/native';
import { AuthContext } from '../../src/context/authContext.js';


const { width } = Dimensions.get('window');






export default function PostPage(){

    const { user, setUser } = useContext(AuthContext);

    const [postOwner, setPostOwner] = useState(null)
    const [postAddress, setPostAddress] = useState(null)
    const [comments, setComments] = useState([]);

    const [fontsLoaded] =useFonts({
        Poppins_400Regular,
        Poppins_700Bold,
    })

    const isFocused = useIsFocused();

    const post =     
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
    }

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

    useEffect(() => {
        if (isFocused) {
            fetchPostAddress();
            fetchComments();
            fetchUser(post.client_id).then(setPostOwner);
        }
    }, [isFocused]);



    if (!postOwner || !postAddress || !fontsLoaded) {
        return <Text>Chargement...</Text>;
    }



    return (

        <ScrollView style={styles.container}>
            <ImageBackground source={{ uri: post.photo }} style={styles.image} resizeMode="cover" />

            <View style={styles.postHeader}>
                    <View style={{flexDirection: 'row', gap : 20, marginLeft: 10}}>
                        <Text style={[styles.text, {fontWeight: 'bold', marginTop: 20}]}>{post.title}</Text>
                        <Text style={[styles.text, {marginTop: 20}]}>● {post.categories}</Text>
                    </View>

                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 20, marginLeft: 10}}>
                        <Avatar
                        source={{ uri: postOwner.photo }}
                        size={40}
                        />
                        <Text style={[styles.text, {fontWeight: 'bold'}]}>{postOwner.username}</Text>
                    </View>
                    
                    <View style={{flexDirection:'row', gap: 10, marginLeft: 10}}>
                        <Image source={require("../../assets/images/map-pin.png")}></Image>
                        <Text style={[styles.text, {fontSize: 12}]}>{post.street}, n°{post.street_number}, {postAddress.postal_code}, {postAddress.city}</Text>
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
        borderRadius: 20,       // ici ça fonctionne
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





