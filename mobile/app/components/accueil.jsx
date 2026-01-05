import { Poppins_400Regular, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, Modal, TouchableOpacity, Alert } from 'react-native';
import { Card, Checkbox } from 'react-native-paper';
import SearchBar from './searchBar.jsx';
import { useTranslation } from 'react-i18next';
import Axios from '../../src/service/api.js';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useLocation } from '../../src/hook/useLocation.jsx';
import { useRouter } from 'expo-router';

export default function Accueil() {
    const { t } = useTranslation();
    const { getCurrentAddress, locating } = useLocation(); 
    const router = useRouter();
    
    const [fontsLoaded] = useFonts({
        Jaro: require('../../assets/fonts/jaro.ttf'),
        Poppins_400Regular,
        Poppins_700Bold,
    });

    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [categories, setCategories] = useState([]);
    const [checkedCategories, setCheckedCategories] = useState({});

    const openMenu = () => setModalVisible(true);

    async function getPostsFromApi() {
        let city = null;
        let street = null;
        const address = await getCurrentAddress();
        
        if (address) {
            city = address.city;
            street = address.street;
        }

        try {
            const response = await Axios.get("/posts/allPostsCategories", {
                params: { city, street }
            });
            setPosts(response.data);
        } catch (err) {
            Alert.alert(t('error.errorText'), err.message);
        }
    }

    async function getCategoriesFromApi() {
        try {
            const response = await Axios.get("/productType/");
            const data = response.data.rows;
            setCategories(data);
            const initialChecked = {};
            data.forEach(cat => initialChecked[cat.id_category] = false);
            setCheckedCategories(initialChecked);
        } catch (err) {
        }
    }

    async function applyFilters() {
        try {
            const selectedIds = Object.keys(checkedCategories).filter(id => checkedCategories[id]);
            
            if (selectedIds.length === 0) {
                await getPostsFromApi();
            } else {
                const response = await Axios.get(`/posts/byCategory`, {
                    params: { ids: selectedIds.join(',') }
                });
                setPosts(response.data);
            }
            setModalVisible(false);
        } catch (err) {
            Alert.alert(t('error.errorText'), "Erreur lors du filtrage");
        }
    }

    useEffect(() => {
        getPostsFromApi();
        getCategoriesFromApi();
    }, []);

    const handlePress = (id_category) => {
        setCheckedCategories(prev => ({
            ...prev,
            [id_category]: !prev[id_category]
        }));
    };

    if (!fontsLoaded) return <View style={styles.container}><Text>{t('loadingText')}</Text></View>;

    const renderItem = ({ item }) => (
        <View style={styles.cardWrapper}>
            {/* On rend la carte entière cliquable */}
            <TouchableOpacity 
                activeOpacity={0.9} 
              onPress={() => router.push({
                    pathname: "/PostPage", // Doit correspondre au nom du fichier dans app/
                    params: { postId: item.id }
                })}
            >
                <Card style={styles.card}>
                    <Card.Cover source={{ uri: item.photo }} style={styles.cardImage} />
                    <Card.Content>
                        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                        <Text style={styles.category} numberOfLines={1}>{item.categories}</Text>
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.SpaceSearchInput}>
                <Text style={styles.nameApplication}>IShare</Text>
                <SearchBar textValue={search} onChangeText={setSearch} style={styles.searchBar} handleIconPress={openMenu} />
                
                <Modal visible={modalVisible} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                <AntDesign name="close" size={22} color="#333" />
                            </TouchableOpacity>
                            <Text style={styles.titleModal}>{t('filtersText')}</Text>
                            {categories.map(cat => (
                                <View key={cat.id_category} style={styles.containerfilters}>
                                    <Checkbox 
                                        status={checkedCategories[cat.id_category] ? 'checked' : 'unchecked'} 
                                        onPress={() => handlePress(cat.id_category)} 
                                    />
                                    <Text>{cat.name_category}</Text>
                                </View>
                            ))}
                            <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
                                <Text style={styles.applyButtonText}>Appliquer</Text>
                            </TouchableOpacity>
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
                    columnWrapperStyle={styles.columnWrapper}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFCCBB', paddingHorizontal: 12, paddingTop: 30 },
    SpaceSearchInput: { marginBottom: '9%' },
    nameApplication: { fontFamily: 'Jaro', fontSize: 22, marginLeft: '5%' },
    searchBar: { margin: "3%", marginTop: "5%" },
    columnWrapper: { justifyContent: 'space-between' },
    cardWrapper: { width: '48%', marginBottom: 12 },
    card: { borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff', height: 260 },
    cardImage: { height: 160 },
    title: { fontFamily: 'Poppins_700Bold', fontSize: 13, marginTop: 8, paddingHorizontal: 8 },
    category: { fontFamily: 'Poppins_400Regular', fontSize: 11, color: '#666', paddingHorizontal: 8 },
    cityBadge: { fontSize: 9, color: '#FF8866', paddingHorizontal: 8, marginTop: 2 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '85%', backgroundColor: '#fff', padding: 20, borderRadius: 15 },
    closeButton: { alignSelf: 'flex-end' },
    titleModal: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    containerfilters: { flexDirection: 'row', alignItems: 'center', marginVertical: 2 },
    applyButton: { backgroundColor: '#FF8866', padding: 12, borderRadius: 8, marginTop: 20, alignItems: 'center' },
    applyButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});