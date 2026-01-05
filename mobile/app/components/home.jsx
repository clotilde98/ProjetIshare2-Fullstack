{/*import { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import io from 'socket.io-client';

useEffect(() => {
    const socket= io("http://192.168.0.12:3002", 
       {query: {userId: currentUser.id}}
    ); 

    socket.on('newReservation', (reservation) => {

    Toast.show({
        type:'success', 
        text1: 'Nouvelle réservation', 
        text2: `Quelqu’un a réservé : ${reservation.client_id}`})


    })
}



, [])*/}

import { Poppins_400Regular, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, Modal, Button, TouchableOpacity } from 'react-native';
import { Card, Checkbox } from 'react-native-paper';
//import SearchBar from './searchBar.jsx';
//import i18next from '../../src/service/i18next.js';
//import {useTranslation} from 'react-i18next'; 
import Axios from '../../src/service/api.js';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as React from 'react';






export default function Accueil(){

    const {t} = useTranslation(); 

    const [fontsLoaded]=useFonts({
        Jaro: require('../../assets/fonts/jaro.ttf'),
        Poppins_400Regular,
        Poppins_700Bold,
    })
     
    const[posts, setPosts]=useState([])
    const[search, setSearch]=useState(""); 
    const [modalVisible, setModalVisible] = useState(false);
    const[categories, setCategories]=useState([]); 
    const[checkedCategories, setCheckedCategories]=useState({}); 
    const openMenu = () => setModalVisible(true);
    const[selectedCategory, setSelectedCategory]=useState(""); 
    
    
   
async function getPostsFromApi() {
    

    try {
        const response = await  Axios.get("/posts/allPostsCategories"); 
        const data = response.data;
    
    if(Array.isArray(data)){
        setPosts(data);
    }else{
        console.error("allPostsCategorie ne retourne pas un tableau valide:", data);
    }

    }catch(err) {
        if(err.response){
          console.error("Erreur API:", err.response.data, "Status:", err.response.status);
        } else {
          console.error("Erreur réseau ou autre:", err.message);
        }

    }
    
    } 
    
async function getCategoriesFromApi(){
    try {
          const response = await  Axios.get("/productType/"); 
          const data = response.data;
          setCategories(data.rows); 

        const initialChecked = {};
        data.rows.forEach(categorie => {
        initialChecked[categorie.id_category] = false;
    });
    setCheckedCategories(initialChecked);

 
    }catch(err){
        if(err.response){
          console.error("Erreur API:", err.response.data, "Status:", err.response.status);
        } else {
          console.error("Erreur réseau ou autre:", err.message);
        }
    }
}

async function getFilteredPosts(category){
    try {


        const response = await  Axios.get(`/posts/byCategory`, {
            params: {nameCategory: category.name_category}
        }); 
        const data = response.data;
        setSelectedCategory(category.name_category); 
        setPosts(data);
    }catch(err){
        if(err.response){
          console.error("Erreur API:", err.response.data, "Status:", err.response.status);
        } else {
          console.error("Erreur réseau ou autre:", err.message);
        }
    }
}

useEffect(() => {
    getPostsFromApi(), 
    getCategoriesFromApi()
}, []);

 if (!fontsLoaded) {
      return <Text>Chargement...</Text>;
    }
  
  const handlePress = async (categorie) => {
  const updatedChecked = {
    ...checkedCategories,
    [categorie.id_category]: !checkedCategories[categorie.id_category],
  };

  setCheckedCategories(updatedChecked);



  if (!Object.values(checkedCategories).some(v => v === true)) {
    // ➜ PLUS AUCUN FILTRE
    setSelectedCategory("");
    getPostsFromApi();
  } else {
     getFilteredPosts(categorie);
  }
};


const renderItem = ({ item }) => {
     const categoryToDisplay = selectedCategory ? selectedCategory : item.categories;

   return (
    <View style={styles.cardWrapper}>
      <Card style={styles.card}>
        <Card.Cover source={{ uri : item.photo}} style={styles.cardImage} />

        <Card.Content>
          <Text style={styles.title} numberOfLines={2}  ellipsizeMode="tail">{item.title}</Text>
          <Text style={styles.category}  numberOfLines={2} ellipsizeMode="tail">{categoryToDisplay}</Text>
        </Card.Content>
      </Card>
    </View>
     ); 
    };




    return(


        <View style={styles.container}>
       
        <View style={styles.SpaceSearchInput}>
            <Text style={styles.nameApplication}>IShare</Text>
            <SearchBar textValue={search} onChangeText={setSearch} style={styles.searchBar} handleIconPress={openMenu}></SearchBar>
            <Modal  
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
                >
                <View style={styles.modalOverlay}>
                   <View style={styles.modalContent}>
                     <TouchableOpacity style={styles.closeButton} onPress={() => {
                        setModalVisible(false)
                        if(!Object.values(checkedCategories).some(v => v === true)){
                        const reset= {}; 
                        categories.forEach(c => reset[c.id_category] = false);
                        setCheckedCategories(reset);
                        getPostsFromApi();}
                     }}>
                        <AntDesign name="close" size={22} color="#333" />
                     </TouchableOpacity> 

                    <Text style={styles.titleModal}>Filtres</Text>
                    {categories.map(categorie => {
                        return(
                            <View key={categorie.id_category} style={styles.containerfilters}>
                            <Checkbox status={checkedCategories[categorie.id_category] ? 'checked': 'unchecked'} onPress={() => handlePress(categorie)}/>
                            <Text>{categorie.name_category}</Text>
                            </View>
                        )})}
                    </View> 
                    
                </View>        


            </Modal>
             
        </View>

        
        <View style={styles.listPosts}>
        <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        />
        </View>
        

        </View>
    )

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFCCBB', // sans espace
    paddingHorizontal: 12,
    paddingTop: 30,
  },
  header: {
    marginBottom: 16,
  },
  appTitle: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 20,

  },
  columnWrapper: {
    justifyContent: 'flex-start',
  },
  cardWrapper: {
    width: '45%',
    marginRight: '7%',
    marginBottom: 12,   
  },
  card: {
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    height: 240
      
  },
  cardImage: {
    height: 170,
    borderRadius: 0,
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 12,
    marginTop: "5%",
  },
  category: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 10,
    color: '#666',
  },
  SpaceSearchInput: {
    marginBottom:'9%'
  }, 
  listPosts: {
     marginLeft:'2.5%'
  }, 
  nameApplication: {
    fontFamily: 'Jaro', 
    fontSize: 22,
    marginLeft: '5%' 
  }, 
  searchBar: {
    margin: "3%", 
    marginTop: "5%"

  }, 
  modalOverlay:{
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  }, 
  modalContent: {
     width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  }, 
  titleModal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  }, 
  containerfilters: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 4
  }
});