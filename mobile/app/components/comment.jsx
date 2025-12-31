import { Avatar } from '@kolking/react-native-avatar';
import { View, Text, StyleSheet, TextInput, Image, Pressable, Alert } from 'react-native';
import { Poppins_400Regular, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import { useState } from 'react';
import Axios from '../../src/service/api';

export default function Comment({ imgSource, imgSize, username=null, content, isCurrentUser=false, post, onCommentCreated }) {

    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_700Bold,
    });

    const [comment, setComment] = useState(null);


    async function createComment(){
        try {
            const res = await Axios.post("/comments", {
                content: comment,
                idPost: post.id
            })
            Alert.alert("Commentaire créé avec succès");
            onCommentCreated();
        } catch (err){
            Alert.alert("Erreur", err.response?.data || "Erreur lors de la creation de commentaire");
        }
    }

    

    if (!fontsLoaded) return null;

    return (
        <View style={styles.container}>
            <Avatar source={{ uri: imgSource }} size={imgSize} />

            <View style={styles.textContainer}>
                {username && (
                    <Text style={[styles.username]}>
                        {username}
                    </Text>
                )}

                {isCurrentUser ? (
                    <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems: 'center'}}>
                        <TextInput
                            value={comment}
                            onChangeText={setComment}
                            placeholder="Add a comment..."
    
                        />

                        <Pressable onPress={createComment}>
                            <Image
                                style={{ marginRight: 25, width: 24, height: 24 }}
                                source={require("../../assets/images/icon-send.png")}
                            />
                        </Pressable>

                    </View>)
                    :
                    (<Text style={[styles.content, { fontFamily: isCurrentUser ? '' : 'Poppins_400Regular', fontWeight : isCurrentUser ? '300': '100' }]}>
                        {content}
                    </Text>)}

                
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 10,
    },
    textContainer: {
        flex: 1,
    },
    username: {
        fontSize: 14,
        fontFamily: 'Poppins_700Bold',
        marginBottom: 2,
    },
    content: {
        fontSize: 15,
        flexWrap: 'wrap',
        marginRight: 10,
    },
});
