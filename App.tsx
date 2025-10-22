import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Menu from './menu';
import AddMenu from './addmenu';


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
      <Text style={styles.title}>WELCOME TO CAFE FRESH</Text>

      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687' }}
        style={styles.mainImage}
      />
      <Text style={styles.description}>Fresh cafe isn't just a place get food, it's a destination where food is celebrated.</Text>

      <TouchableOpacity 
        style={styles.menuButton}
        onPress={() => navigation.navigate('Menu')}
      >
       <Image
         source={require('./image_assets/splashmenu69.png')}
         style={styles.buttonImage}
       />
        
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen name="AddMenu" component={AddMenu} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  mainImage: {
    width: 300,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  menuButton: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#000000ff',
    borderRadius: 1,
    marginTop: 2,
    shadowColor: '#1aff00ff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonImage: {
    width: 60,
    height: 80,
    marginBottom: 1,
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  }
});

