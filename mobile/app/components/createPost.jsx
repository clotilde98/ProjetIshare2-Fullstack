import { Text, ImageBackground, View, StyleSheet, TouchableOpacity, Image, TextInput, Alert, Button, Pressable } from "react-native";
import { useFonts } from 'expo-font';
import { Poppins_400Regular } from '@expo-google-fonts/poppins';
import { Avatar } from '@kolking/react-native-avatar';
import { useContext } from 'react';
import { AuthContext } from '../../src/context/authContext.js';
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import MultiSelect from 'react-native-multiple-select';
import Axios from '../../src/service/api.js';
import { useEffect } from "react";
import {useTranslation} from 'react-i18next'; 


export default function CreatePost () {

    
    const {t} = useTranslation(); 

    const [fontsLoaded] = useFonts({
            Poppins: Poppins_400Regular,
    });

    const { user, setUser } = useContext(AuthContext);
    const [image, setImage] = useState(null);
    const [postTitle, setPostTitle] = useState(null);
    const [streetText, setStreetText] = useState(null);
    const [streetNumberText, setStreetNumberText] = useState(null);
    const [descriptionText, setDescriptionText] = useState(null);

    const [selectedFoodTypes, setSelectedFoodTypes] = useState([]);
    const [foodTypes, setFoodTypes] = useState([]);

    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState([]);


    const [nbOfPeople, setNbOfPeople] = useState([]);
    const [selectedNbOfPeople, setSelectedNbOfPeople] = useState([]);
    const n = 20;

    for (let i = 1; i <= n; i++) {
        nbOfPeople.push({
            id: i,
            name: i
        });
    }

    if (!fontsLoaded) {
        return <Text>{t('loadingText')}</Text>; 
    }


    const validations = [
        { condition: !postTitle || postTitle.trim() === "", message: t('error.missingTitle') },
        { condition: !selectedFoodTypes || selectedFoodTypes.length === 0, message: t('error.categoryRequired') },
        { condition: !selectedCity || !selectedCity[0], message: t('error.missingCity') },
        { condition: !streetText || streetText.trim() === "", message: t('error.missingStreetNumber') },
        { condition: !streetNumberText || streetNumberText.trim() === "", message: t('error.missingStreetNumber') },
        { condition: !selectedNbOfPeople || selectedNbOfPeople.length === 0, message: t('error.missingNbOfPeople')},
        { condition: !descriptionText || descriptionText.trim() === "", message: t('error.missingDescription') },
        
    ];

    const handleSubmit = async () => {
        for (const rule of validations) {
            if (rule.condition) {
                Alert.alert(rule.message); 
                return;                  
            }
        }

        try {
        
            const formData = new FormData();

            formData.append("title", postTitle);
            formData.append("description", descriptionText);
            formData.append("addressID", selectedCity[0]);
            formData.append("categoriesProduct", JSON.stringify(selectedFoodTypes)); 
            formData.append("numberOfPlaces", selectedNbOfPeople[0]);
            formData.append("street", streetText);
            formData.append("streetNumber", streetNumberText);

        
            if (image) {
            formData.append("photo", {
                uri: image,        
                name: "photo.jpg",    
                type: "image/jpeg",  
            });
            }

            const response = await Axios.post("posts", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            });

            Alert.alert(t('success.postSuccess'));
        } catch (error) {
            Alert.alert(t('error.sendFailed'), JSON.stringify(error.response.data));
        }




    }

    const fetchCities = async () => {
        try {
            const res = await Axios.get("getAllCities/");
            const items = res.data;
            const formattedItems = items.map(item => ({
                id: item.id,
                name:  "[" + item.postal_code + "] " + item.city
            }));
            setCities(formattedItems);
        } catch (error) {
            Alert.alert(error);
        }
    }

    const fetchFoodTypes = async () => {
        try {
            const res = await Axios.get("productType/");
            const items = res.data.rows;

            const formattedItems = items.map(item => ({
                id: item.id_category,
                name: item.name_category
            }));

            setFoodTypes(formattedItems);
        } catch (error) {
            Alert.alert(error);
        }
    };


    useEffect(() => {
        fetchFoodTypes();
        fetchCities();
    }, []);


    const pickImage = async () => {
       
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
        alert(t('permissionImage'));
        return;
        }

        
        const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images', 
        allowsEditing: true,
        quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };



    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../assets/images/background1.jpg')} style = {styles.image}>
            <View style={{ height: '90%', width: '100%', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <Text style={{ fontSize: 35, fontWeight: 'bold' }}>{t('postText')}</Text>
                
                
                <View style={styles.postForm}>

                    <Avatar
                    source={{ uri: user.photo }}
                    size={40}
                    />
                    <Text style={{textAlign:'center'}}>{user.username}</Text>

                    <TouchableOpacity onPress={pickImage}>
                        {image ? (<Image
                            source={{ uri: image }}
                            style={{
                                width: 100,      
                                height: 60,      
                                borderRadius: 5, 
                                borderWidth: 1,  
                                borderColor: 'gray',
                            }}
                        />) : (<Image source={require('../../assets/images/Vector.png')}/>) }
                        
                    </TouchableOpacity>

                    <TextInput
                        value={postTitle}
                        onChangeText={setPostTitle}
                        placeholder={t('writeTitle')}
                        style={styles.input}
                    />


                    <MultiSelect
                        items={foodTypes}        
                        uniqueKey="id"
                        onSelectedItemsChange={setSelectedFoodTypes}
                        selectedItems={selectedFoodTypes}
                        selectText={t('selectFoodTypes')}
                        searchInputPlaceholderText={t('searchFoodTypes')}
                        tagRemoveIconColor="#CCC"
                        tagBorderColor="#CCC"
                        styleMainWrapper={{ width: '80%' }}       
                        styleListContainer={{ maxHeight: 150 }}
                    />

                    <MultiSelect
                        items={cities}        
                        uniqueKey="id"
                        onSelectedItemsChange={setSelectedCity}
                        selectedItems={selectedCity}
                        selectText={t('selectCityPostalCode')}
                        searchInputPlaceholderText={t('searchCity')}
                        tagRemoveIconColor="#CCC"
                        tagBorderColor="#CCC"
                        styleMainWrapper={{ width: '80%' }}       
                        styleListContainer={{ maxHeight: 150 }}
                        single={true}
                    />


                    <TextInput
                        value={streetText}
                        onChangeText={setStreetText}
                        placeholder={t('street')}
                        style={{fontSize: 16, borderWidth: 0.2, borderRadius: 10, padding: 10, width: '50%'}}
                    />

                    <TextInput
                        value={streetNumberText}
                        onChangeText={setStreetNumberText}
                        placeholder={t('streetNumber')}
                        style={{fontSize: 16, borderWidth: 0.2, borderRadius: 10, padding: 10, width: '50%'}}
                    />


                    <MultiSelect
                        items={nbOfPeople}        
                        uniqueKey="id"
                        onSelectedItemsChange={setSelectedNbOfPeople}
                        selectedItems={selectedNbOfPeople}
                        selectText={t('selectNbOfPeople')}
                        searchInputPlaceholderText={t('searchNbOfPeople')}
                        tagRemoveIconColor="#CCC"
                        tagBorderColor="#CCC"
                        styleMainWrapper={{ width: '80%' }}       
                        styleListContainer={{ maxHeight: 150 }}
                        single={true}
                    />

                    <TextInput
                        value={descriptionText}
                        onChangeText={setDescriptionText}
                        placeholder={t('writeDescription')}
                        style={{fontSize: 16, borderWidth: 0.2, padding : 10, borderRadius: 10, width: '80%', minHeight: 80, flexGrow: 0.2, backgroundColor: '#FFE7C8'}}
                    />

                    <Pressable onPress={handleSubmit}>
                        <Image source={require('../../assets/images/submit.png')}/>
                    </Pressable>

                    

                </View>
            </View>
                
            </ImageBackground>
        </View>
        
    );
}

const styles = StyleSheet.create({

    container: {
        flexDirection: 'column',
    },

    image : {             
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },

    postForm : {
        width: '85%',
        height: '100%',
        backgroundColor: 'white',
        borderRadius: 10,
        gap: 0,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
    },

      input: {
        padding: 10,
        fontSize: 16,
    },
})
