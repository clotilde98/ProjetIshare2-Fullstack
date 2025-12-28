import React from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import Post from './post'
import { useState } from 'react';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import Axios from '../../src/service/api.js';
import { useIsFocused } from '@react-navigation/native';

export default function RessourcesPage() {
  const [posts, setPosts] = useState([]);
  const isFocused = useIsFocused();

  const fetchPosts = async () => {

    try {
      const res = await Axios.get("/posts/myPosts/");
      setPosts(res.data);
    } catch (err) {
      Alert.alert("Erreur backend",`\nMessage: ${err.response.data}`);
    }
  
  }

  useEffect(() => {
    if (isFocused) {
      fetchPosts();
    }
  }, [isFocused]);


  return (
    <View style={styles.container}>
        <ImageBackground source={require('../../assets/images/background1.jpg')} style ={styles.image}>
          
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>My Posts</Text>
            <Text style={styles.headerText}>My Reservations</Text>
          </View>

          <View style={styles.postsContainer}>
              <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {posts.length > 0 ? (
                    posts.map((post) => <Post key={post.id} post={post} onDelete={fetchPosts}/>)
                  ) : (
                    <Text>Aucun post disponible</Text>
                )}  
              </ScrollView>
          </View>

        </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',   // centre verticalement
    alignItems: 'center',       // centre horizontalement
    backgroundColor: '#fff',
  },

  headerTextContainer : {
    flexDirection: 'row',
    justifyContent: 'center',
    gap:20,
    marginTop: 120,
    marginBottom: 20
  },

  headerText : {
    fontWeight: 'bold',
    fontSize: 25,
    marginTop: 25
  },

  image : {             
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },

  postsContainer : {
    backgroundColor: 'white',
    height: '90%',
    width: '90%',
    borderRadius: 5,
  },

  scrollContent: {
    padding: 16,
    gap: 12,
  },

  post: {
    backgroundColor: '#eee',
    padding: 20,
    borderRadius: 8,
  }

});
