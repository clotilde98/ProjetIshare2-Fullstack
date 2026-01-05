import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Post from './post'; 
import Reservation from './reservation';

import Axios from '../../src/service/api.js';
import { useIsFocused } from '@react-navigation/native';

import {useTranslation} from 'react-i18next'; 

export default function RessourcesPage() {
  
  const {t} = useTranslation(); 

  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [reservations, setReservations] = useState([]);
  const isFocused = useIsFocused();

  const fetchPosts = async () => {
    try {
      const res = await Axios.get("/posts/myPosts/");
      setPosts(res.data);
    } catch (err) {
      Alert.alert(t('error.errorText'), t('postsLoadError'));
    }
  };

  const fetchReservations = async () => {
    try {
      const res = await Axios.get("/reservations/me/");
      setReservations(res.data);
    } catch (err) {
      Alert.alert(t('error.errorText'), t('reservationsLoadError'));
    }
  };

  useEffect(() => {
    if (isFocused) {
      if (activeTab === 'posts') {
        fetchPosts();
      } else {
        fetchReservations();
      }
    }
  }, [isFocused, activeTab]);

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/images/background1.jpg')} style={styles.image}>
        
        <View style={styles.headerTabsContainer}>
          <TouchableOpacity onPress={() => setActiveTab('posts')}>
            <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
              {t('subTitlePosts')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setActiveTab('reservations')}>
            <Text style={[styles.tabText, activeTab === 'reservations' && styles.activeTabText]}>
              {t('subTitleReservations"')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.whiteCardContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            {activeTab === 'posts' ? (
              posts.length > 0 ? (
                posts.map((post) => (
                  <Post key={post.id} post={post} onDelete={fetchPosts} />
                ))
              ) : (
                <Text style={styles.emptyText}>{t('postsEmpty')}</Text>
              )
            ) : (
              reservations.length > 0 ? (
    reservations.map((item) => (
      <Reservation 
        key={item.id} 
        item={item} 
        onDelete={fetchReservations} 
      />
    ))
  ) : (
    <Text style={styles.emptyText}>{t('reservationsEmpty')}</Text>
  )
)}

          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: '100%', alignItems: 'center' },
  headerTabsContainer: { 
    flexDirection: 'row', 
    marginTop: 100, 
    marginBottom: 20,
    gap: 30 
  },
  tabText: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#999' 
  },
  activeTabText: { 
    color: '#000', 
    borderBottomWidth: 2,
    borderBottomColor: '#000' 
  },
  whiteCardContainer: {
    backgroundColor: 'white',
    flex: 1,
    width: '94%',
    marginBottom: 30,
    borderRadius: 15,
    padding: 15,
    elevation: 3,
  },
  scrollContent: { paddingVertical: 10 },
  emptyText: { textAlign: 'center', marginTop: 30, color: '#999' }
});