/*
 This screen displays all menu items added by chefs and provides
 navigation to Filter and Add Menu screens. Users can view dishes
 with images, descriptions, prices, and course types.
*/

/*
CODE ATTRIBUTION - Pizza Image
Author: Ivan Torres
Title: pizza with berries
Date Published: 2017
Link: https://unsplash.com/photos/pizza-with-berries-MQUqbmszGGM
Date accessed: 22/10/2025
*/

/*
CODE ATTRIBUTION - Fries Image
Author: Pixzolo Photography
Title: fries and ketchup
Date Published: 2018
Link: https://unsplash.com/photos/fries-and-ketchup-8YBHgP0WrEo
Date accessed: 22/10/2025
*/

/*
CODE ATTRIBUTION - Cake Image
Author: Nahima Aparicio
Title: a piece of cake with fruit on top
Date Published: 2022
Link: https://unsplash.com/photos/a-piece-of-cake-with-fruit-on-top-of-it-Tb6VJvW_lqU
Date accessed: 22/10/2025
*/

/*
CODE ATTRIBUTION - Fish Image
Author: Jennifer Burk
Title: a white plate topped with a piece of fish
Date Published: 2020
Link: https://unsplash.com/photos/a-white-plate-topped-with-a-piece-of-fish-gwBcamFtPr4
Date accessed: 22/10/2025
*/

/*
CODE ATTRIBUTION - React Navigation Reference
Author: Codevolution
Title: React Native Tutorial - 74 - Navigation between Screens
Date Published: 2023
Link: https://www.youtube.com/watch?v=HuwQwNDLaJ8
Date accessed: 21/10/2025
*/

/*
CODE ATTRIBUTION - React Native Documentation
Title: React Native - Core Components and APIs
Link: https://reactnative.dev/docs/getting-started
Date accessed: 2025
*/

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './App';

/**
 * MenuItem Interface
 * Defines the structure of each menu item
 */
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  course: string;
  price: number;
  image: string;
}

/**
 * INITIAL_DISHES
 * Default menu items loaded when the app starts.
 */
const INITIAL_DISHES: MenuItem[] = [
  {
    id: '1',
    name: 'Creamy Pancakes',
    description: 'Fluffy pancakes topped with whipped cream and fresh berries',
    course: 'Dessert',
    price: 70.0,
    image: 'https://images.unsplash.com/photo-1670639596808-11aa57e22904?auto=format&fit=crop&q=80&w=687',
  },
  {
    id: '2',
    name: 'Pizza',
    description: 'Delicious cheese pizza with pepperoni and a crispy crust',
    course: 'Main Course',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1170',
  },
  {
    id: '3',
    name: 'French Fries',
    description: 'Salted fries served with tomato sauce',
    course: 'Appetiser',
    price: 25.0,
    image: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '4',
    name: 'Chocolate Cake',
    description: 'Rich chocolate cake with fudge frosting',
    course: 'Dessert',
    price: 55.5,
    image: 'https://images.unsplash.com/photo-1606312619070-5b2f3c4b6f20?auto=format&fit=crop&q=80&w=687',
  },
  {
    id: '5',
    name: 'Grilled Fish',
    description: 'Tender grilled fish served with lemon butter sauce',
    course: 'Main Course',
    price: 95.0,
    image: 'https://images.unsplash.com/photo-1588167056547-c183313da7bd?auto=format&fit=crop&q=80&w=687',
  },
];

/** ---------- GLOBAL STATE ---------- */
let globalMenuItems: MenuItem[] = [...INITIAL_DISHES];

/** Exported functions to allow global access */
export const getGlobalMenuItems = () => globalMenuItems;

export const addGlobalMenuItem = (item: Omit<MenuItem, 'id'>) => {
  const newItem: MenuItem = { ...item, id: String(Date.now()) };
  globalMenuItems.push(newItem);
  return newItem;
};

export const removeGlobalMenuItem = (itemId: string) => {
  globalMenuItems = globalMenuItems.filter(item => item.id !== itemId);
};

/** ---------- MENU COMPONENT ---------- */
export default function Menu() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [menuItems, setMenuItems] = useState<MenuItem[]>(getGlobalMenuItems());

  // Sync global state updates with screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setMenuItems(getGlobalMenuItems());
    });
    return unsubscribe;
  }, [navigation]);

  /** Add new item (used by AddMenu screen) */
  const addMenuItem = (item: {
    name: string;
    description: string;
    course: string;
    price: number;
    image: string;
  }) => {
    addGlobalMenuItem(item);
    setMenuItems([...getGlobalMenuItems()]);
  };

  /** Remove an item by ID */
  const removeMenuItem = (itemId: string) => {
    removeGlobalMenuItem(itemId);
    setMenuItems([...getGlobalMenuItems()]);
  };

  /** Getter for other screens */
  const getMenuItems = () => getGlobalMenuItems();

  /** Attach helper functions to navigation params */
  useEffect(() => {
    navigation.setParams({ addMenuItem, removeMenuItem, getMenuItems });
  }, [navigation, menuItems]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Our Menu</Text>
       <View style={styles.topActions}>
    <TouchableOpacity 
      style={styles.actionSmall}
      onPress={() => navigation.navigate('Filter')}
    >
      <Text style={styles.filterButtonText}>FILTER</Text>
    </TouchableOpacity>

    <TouchableOpacity 
      style={styles.actionAdd}
      onPress={() => navigation.navigate('AddMenu')}
    >
      <Image source={require('./image_assets/blueaddicon.jpg')} style={styles.addButtonIcon} />
    </TouchableOpacity>
  </View>

      {menuItems.length === 0 ? (
        <Text style={styles.emptyText}>No dishes available. Please add some!</Text>
      ) : (
        menuItems.map(item => (
          <View key={item.id} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.cardContent}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.course}>{item.course}</Text>
              <Text style={styles.desc}>{item.description}</Text>
              <Text style={styles.price}>R{item.price.toFixed(2)}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeMenuItem(item.id)}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>

              
            </View>

          </View>
          
        ))
      )}







     






    </ScrollView>
  );
}

/** ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  image: { width: 120, height: 120 },
  cardContent: { flex: 1, padding: 10 },
  name: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  course: { fontSize: 14, fontStyle: 'italic', color: '#666' },
  desc: { fontSize: 13, color: '#444', marginVertical: 4 },
  price: { fontSize: 15, fontWeight: 'bold', color: '#2e7d32' },
  removeButton: {
    marginTop: 6,
    backgroundColor: '#4d0504ff',
    borderRadius: 6,
    padding: 6,
    alignSelf: 'flex-start',
  },
  removeButtonText: { color: '#fff', fontWeight: 'bold' },
  bottomButtons: { marginTop: 20, alignItems: 'center' },
  filterButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 10,
    width: '80%',
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 30, fontSize: 16, color: '#777' },
  addButtonIcon: {
    width: 70,
    height: 70,
    tintColor: '#fff'
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  },
  addButton: {
    backgroundColor: '#1f6a8c',
    width: 70,
    height: 70,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#1f6a8c',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  topActions: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    paddingRight: 16
  },
  actionSmall: {
    backgroundColor: '#1f6a8c',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  actionAdd: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1f6a8c',
    justifyContent: 'center',
    alignItems: 'center'
  },
});
