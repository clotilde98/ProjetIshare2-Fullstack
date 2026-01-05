import { Poppins_400Regular, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import { useEffect, useState,  useRef } from 'react';
import { FlatList, StyleSheet, Text, View, Modal, Button, TouchableOpacity } from 'react-native';
import { Card, Checkbox } from 'react-native-paper';
import SearchBar from './searchBar.jsx';
import {useTranslation} from 'react-i18next'; 
import Axios from '../../src/service/api.js';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useContext } from 'react';
import { AuthContext } from '../../src/context/authContext.js';
import { useNavigation } from '@react-navigation/native';


export default function Accueil(){

    const {t} = useTranslation(); 
    const navigation = useNavigation(); 

    const [fontsLoaded]=useFonts({
        Jaro: require('../../assets/fonts/jaro.ttf'),
        Poppins_400Regular,
        Poppins_700Bold,
    })

      const [notifications, setNotifications] = useState([]);
      const ws = useRef(null);
    
      const { user } = useContext(AuthContext);
    
     
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
        
        setPosts(data);
    }catch(err) {
       Alert.alert(t('error.errorText'), err.response? `${message}\n\nStatus: ${err.response?.status}` : err.response?.data ? err.response.data : err.toString()); 
    }
    
    } 
    
async function getCategoriesFromApi(){
    try {
          const response = await  Axios.get("/productType/"); 
          const data = response.data;
          console.log(data.rows); 
          setCategories(data.rows); 

        const initialChecked = {};
        data.rows.forEach(categorie => {
        initialChecked[categorie.id_category] = false;
    });
    setCheckedCategories(initialChecked);

 
    }catch(err){
        Alert.alert(t('error.errorText'), err.response? `${message}\n\nStatus: ${err.response?.status}` : err.response?.data ? err.response.data : err.toString()); 
    }
}

async function getFilteredPosts(category){
    try {


        const response = await  Axios.get(`/posts/byCategory`, {
            params: {nameCategory: category.name_category}
        }); 
        const data = response.data;
        console.log(data);
        setSelectedCategory(category.name_category); 
        setPosts(data);
    }catch(err){
       Alert.alert(t('error.errorText'), err.response? `${message}\n\nStatus: ${err.response?.status}` : err.response?.data ? err.response.data : err.toString()); 
    }
}

useEffect(() => {
    getPostsFromApi(), 
    getCategoriesFromApi(),
    ws.current = new WebSocket('ws://192.168.0.119:8080');
    
        ws.current.onopen = () => {
          console.log('WebSocket connecté');
    
          ws.current.send(JSON.stringify({
            type: 'register',
            userId: user.id
          }));
        };
    
        ws.current.onmessage = (event) => {
          const data = JSON.parse(event.data);
            Toast.show({
            type: 'success', 
            text1: 'Nouvelle réservation',
            text2: data.message,
            position: 'top',
            visibilityTime: 6000, 
        })
          setNotifications(prev => [data, ...prev]);
        };
    
        ws.current.onerror = (e) => console.log('WS erreur:', e.message);
        ws.current.onclose = () => console.log('WebSocket fermé');
    
    
        return () => ws.current.close();
      }, []);
    


 if (!fontsLoaded) {
      return <Text>{t('loadingText')}</Text>;
    }
  
  const handlePress = async (categorie) => {
  const updatedChecked = {
    ...checkedCategories,
    [categorie.id_category]: !checkedCategories[categorie.id_category],
  };

  setCheckedCategories(updatedChecked);



  if (!Object.values(checkedCategories).some(v => v === true)) {
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
      
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('PostPage', { postId: item.id });
        }}
      >

      <Card style={styles.card}>
        <Card.Cover source={{ uri : item.photo}} style={styles.cardImage} />

        <Card.Content>
          <Text style={styles.title} numberOfLines={2}  ellipsizeMode="tail">{item.title}</Text>
          <Text style={styles.category}  numberOfLines={2} ellipsizeMode="tail">{categoryToDisplay}</Text>
        </Card.Content>
      </Card>
      </TouchableOpacity>
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

                    <Text style={styles.titleModal}>{t('filtersText')}</Text>
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
    backgroundColor: '#FFCCBB',
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
