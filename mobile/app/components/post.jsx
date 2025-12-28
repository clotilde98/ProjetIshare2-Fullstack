import { Text, View, StyleSheet, ImageBackground, Alert, TouchableOpacity } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useState } from "react";
import Axios from '../../src/service/api.js';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from "react";

export default function Post({ post, onDelete }) {
    const options = { day: 'numeric', month: 'long' };
    const [selectedOption, setSelectedOption] = useState(post.post_status);
    const [nbComments, setNbComments] = useState(null);

    const handleDelete = async () => {
        try {  
            const id = post.id;
            const res = await Axios.delete(`/posts/${id}`);
            Alert.alert("Succès", res.data);
            onDelete();
        } catch (err){
            Alert.alert("Erreur", "Impossible de supprimer l'annonce. " + err);
        }
    };

    const retrieveCommentsCountForPost = async () => {
        try {
            const id = post.id;
            const res = await Axios.get(`comments/post/${id}`);
            setNbComments(res.data.rows.length);
        } catch (err){
            Alert.alert("Erreur", "Impossible de chargement du nombre de commentaire pour l'annonce. " + err);
        }
    }

    useEffect(() => {
        retrieveCommentsCountForPost();
    }, []); 



    const handleStatusChange = async (newStatus) => {
        try {
            const id = post.id;

            const res = await Axios.patch(`/posts/${id}`, { postStatus: newStatus });


            Alert.alert("Succès", res.data.message);
        } catch (error) {
            Alert.alert("Erreur", "Impossible de mettre à jour le statut. " + error.response.data);
        }
    };

    return (
        <View style={styles.container}>
            {/* Titre et date */}
            <View style={styles.postTitleContainer}>
                <Text style={styles.title}>{post.title}</Text>
                <Text style={styles.date}>{new Date(post.post_date).toLocaleDateString('en-GB', options)}</Text>
            </View>

            {/* Image et status */}
            <View style={styles.postDataContainer}>
                <View style={styles.imgContainer}>
                    <ImageBackground source={{ uri: post.photo }} style={styles.image} resizeMode="cover" />
                </View>

                <View style={styles.postStatusContainer}>

                    <Text style={styles.reservationText}>Reservation</Text>

                    <Text>Status</Text>
                    
                    <View>
                        <Picker
                        selectedValue={selectedOption}
                        onValueChange={(itemValue) => {
                            setSelectedOption(itemValue); 
                            handleStatusChange(itemValue);
                        }}
                        style={styles.picker}
                        >
                            <Picker.Item label="available" value="available" style={styles.pickerText} />
                            <Picker.Item label="unavailable" value="unavailable" style={styles.pickerText} />
                        </Picker>
                    </View>
    
                </View>

            </View>



            <View style={{ flexDirection: 'row', gap: 16, marginTop: 10, marginLeft: 5 }}>
                <TouchableOpacity onPress={handleDelete}>
                    <Ionicons name="trash" size={24} color="#000" />
                </TouchableOpacity>

                <TouchableOpacity>
                    <Ionicons name="chatbubble" size={24} color="#000" />
                </TouchableOpacity>

                <Text style={{marginLeft: -5, fontWeight:'bold'}}>{nbComments}</Text>
            </View>


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        backgroundColor: '#FFE7C8',
        padding: 10,
        marginBottom: 16,
    },
    postTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    title: { fontWeight: 'bold', fontSize: 16 },
    date: { fontSize: 14, color: '#555' },

    postDataContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 60
    },
    imgContainer: {
        width: 80,
        height: 80,
        borderRadius: 15,
        overflow: 'hidden',
        marginRight: 12,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: "contain"
    },
    postStatusContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    reservationText: {
        fontWeight:'bold',
        marginBottom: 5,
    },
    picker: {
        height: 50,
        width: 140,
        padding: 0,
    },

    pickerText : {
        fontSize: 12,
    }
});
