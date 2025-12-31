import * as SecureStore from 'expo-secure-store';

export async function saveToken(token) {
  await SecureStore.setItemAsync("jwt", token);
}

export async function getToken() {
  return await SecureStore.getItemAsync("jwt");
}

export async function removeToken() {
  await SecureStore.deleteItemAsync("jwt");
}
