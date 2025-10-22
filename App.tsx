/*
CODE ATTRIBUTION
Author:Codevolution
Title: 
React Native Tutorial - 74 - Navigation between Screens
Date Published:2023
Link/Accessed at:https://www.youtube.com/watch?v=HuwQwNDLaJ8
Date accessed:21/10/2025
*/

/*
CODE ATTRIBUTION
Author:Simon Grimm
Title: Better than React Native Stylesheet 
Date Published:2024
Link/Accessed at:https://youtu.be/OT5hQbvGRW8?si=ogmIVJQVcikX7hbK
Date accessed:22/10/2025
*/


/*
CODE ATTRIBUTION
Author:The IIE
Title: Creating a simple user interface
Date Published:2025
Link/Accessed at:https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7BC4AAF478-96AC-4469-8005-F7CDC4A15EBB%7D&file=MAST5112MM.docx&action=default&mobileredirect=true
Date accessed:22/10/2025
*/

/*
CODE ATTRIBUTION
Author:The IIE
Title: core user interface components
Date Published:2025
Link/Accessed at:https://advtechonline.sharepoint.com/:w:/r/sites/TertiaryStudents/_layouts/15/Doc.aspx?sourcedoc=%7BC4AAF478-96AC-4469-8005-F7CDC4A15EBB%7D&file=MAST5112MM.docx&action=default&mobileredirect=true
Date accessed:22/10/2025
*/






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
      <Text style={styles.buttonText}>View Menu</Text>
        
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
    backgroundColor: '#007AFF',
    borderRadius: 1,
    marginTop: 2,
    padding: 10,
    shadowColor: '#000000ff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
 
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  }
});

