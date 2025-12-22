import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Input({ textValue, secureTextEntry, secureEye, onChangeText }) {
  const [hidden, setHidden] = useState(secureTextEntry);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={textValue}
        secureTextEntry={hidden}
        style={{
          height: 45,
          width: '80%',
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 18,
          borderRadius: 10,
        }}
        onChangeText={(text) => onChangeText(text)}
      />

      {secureEye && (
        <Pressable onPress={() => setHidden(!hidden)} style={styles.eye}>
          <Icon
            name={hidden ? 'eye-off' : 'eye'}
            size={26}
            color="gray"
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '95%',
    alignItems: 'center',
  },
  eye : {
    position: 'absolute',
    right : 15,
    top : 9,
  }
});