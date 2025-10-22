/*
CODE ATTRIBUTION
Author:Ivan Torres
Title: pizza 
Date Published: 2017
Link/Accessed at:https://unsplash.com/photos/pizza-with-berries-MQUqbmszGGM
Date accessed:22/10/2025
*/

/*
CODE ATTRIBUTION
Author:Pixzolo Photography
Title: fries and ketchup
Date Published:2018
Link/Accessed at: https://unsplash.com/photos/fries-and-ketchup-8YBHgP0WrEo
Date accessed:22/10/2025
*/

/*
CODE ATTRIBUTION
Author:Nahima Aparicio
Title: a piece of cake with fruit on top
Date Published:2022
Link/Accessed at:https://unsplash.com/photos/a-piece-of-cake-with-fruit-on-top-of-it-Tb6VJvW_lqU
Date accessed:22/10/2025
*/

/*
CODE ATTRIBUTION
Author: Jennifer Burk
Title: a white plate topped with a piece of fish
Date Published: 2020
Link/Accessed at: https://unsplash.com/photos/a-white-plate-topped-with-a-piece-of-fish-gwBcamFtPr4
Date accessed: 22/10/2025
*/

/*
CODE ATTRIBUTION
Author:Codevolution
Title: 
React Native Tutorial - 74 - Navigation between Screens
Date Published:2023
Link/Accessed at:https://www.youtube.com/watch?v=HuwQwNDLaJ8
Date accessed:21/10/2025
*/



import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import { RootStackParamList } from './App';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  course: string;
  price: number;
  image: string;
}

const INITIAL_DISHES: MenuItem[] = [
  {
    id: '1',
    name: 'Creamy Pancakes',
    description: 'Fluffy pancakes topped with whipped cream and fresh berries',
    course: 'Dessert',
    price: 70.00,
    image: 'https://images.unsplash.com/photo-1670639596808-11aa57e22904?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
  },
  {
    id: '2',
    name: 'Pizza',
    description: 'Delicious cheese pizza with pepperoni and a crispy crust',
    course: 'Main Course',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
  },
  {
    id: '3',
    name: 'French Fries',
    description: 'salted fries with tomato sauce',
    course: 'Appetiser',
    price: 25.00,
    image: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZnJpZXN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600',
  },
   {
    id: '4',
    name: 'Cake',
    description: 'Rich chocolate cake with a creamy frosting',
    course: 'Dessert',
    price: 90.00,
    image: 'https://images.unsplash.com/photo-1646678257756-a56adbd0d8f8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
  },
  {
    id: '5',
    name: 'Fish',
    description: 'Grilled fish served with lemon and herbs',
    course: 'Main Course',
    price: 230.00,
    image: 'https://images.unsplash.com/photo-1580959375944-abd7e991f971?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1976',
  },
  

];

export default function Menu() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [menuItems, setMenuItems] = React.useState<MenuItem[]>(INITIAL_DISHES);

  const addMenuItem = React.useCallback((newItem: Omit<MenuItem, 'id'>) => {
    const id = (menuItems.length + 1).toString();
    setMenuItems(prevItems => [...prevItems, { ...newItem, id }]);
  }, [menuItems]);

  React.useEffect(() => {
    navigation.setParams({ addMenuItem });
  }, [navigation, addMenuItem]);

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerText}>Menu</Text>
            <Text style={styles.itemCount}>{menuItems.length} items</Text>
          </View>
        </View>
      
        {menuItems.map((dish) => (
          <TouchableOpacity key={dish.id} style={styles.card}>
            <Image
              source={{ uri: dish.image }}
              style={styles.image}
            />
            <View style={styles.cardContent}>
              <View style={styles.titleRow}>
                <Text style={styles.name}>{dish.name}</Text>
                <Text style={styles.price}>R{dish.price.toFixed(2)}</Text>
              </View>
              <Text style={styles.course}>{dish.course}</Text>
              <Text style={styles.description}>{dish.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      <View style={styles.navBar}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddMenu')}
        >
          <Image source={require('./image_assets/blueaddicon.jpg')} style={styles.addButtonIcon} />
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: '#fff',

    borderTopColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bottomSpacing: {
    height: 80,
  },
  addButtonIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff'
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
      marginBottom: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    addButton: {
      backgroundColor: '#007AFF',
      width: 70,
      height: 70,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    addButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600'
  },
  headerText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12
  },
  cardContent: {
    padding: 16
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF'
  },
  course: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic'
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20
  }
})