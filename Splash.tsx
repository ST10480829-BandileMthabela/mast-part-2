import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


export type RootStackParamList = {
  Home: undefined;
  Menu: {
    addMenuItem?: (item: {
      name: string;
      description: string;
      course: string;
      price: number;
      image: string;
    }) => void;
  };
  AddMenu: undefined;
};



function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text >WELCOME TO CAFE FRESH</Text>

      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687' }}
       
      />
      <Text >Fresh cafe isn't just a place get food, it's a destination where food is celebrated.</Text>

      <TouchableOpacity 
       
        onPress={() => navigation.navigate('Menu')}
      >
       <Image
         source={require('./image_assets/splashmenu69.png')}
        
       />
        
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
 
});

