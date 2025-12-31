import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Axios from '../../src/service/api.js';
import Toast from 'react-native-toast-message';
import { useContext } from 'react';
import { AuthContext } from '../../src/context/authContext.js';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const ws = useRef(null);

  const { user } = useContext(AuthContext);

  useEffect(() => {
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

 
  const reservePost = async () => {
    try {

      await Axios.post( `http://192.168.1.58:3002/reservations/`, {postID:6});
    } catch (err) {
      console.log(err.response.data);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={reservePost}>
        <Text style={styles.buttonText}>Réserver une annonce</Text>
      </TouchableOpacity>

    
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  button: {
    backgroundColor: '#4CAF50', // vert sympa
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',       // ombre pour effet relief
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,              // pour Android
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  notification: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
