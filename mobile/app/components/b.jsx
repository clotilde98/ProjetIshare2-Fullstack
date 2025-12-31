import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function B() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>A</Text>
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
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
